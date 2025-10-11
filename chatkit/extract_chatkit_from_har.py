#!/usr/bin/env python3
import json, os, re, base64, urllib.parse, sys

HAR_PATH = "chatkit.har"
OUT_DIR  = "public/vendor/chatkit"

CDN_HOST = "cdn.platform.openai.com"
CDN_BASE = f"https://{CDN_HOST}/deployments/chatkit/"

os.makedirs(OUT_DIR, exist_ok=True)

def safe_path(url: str) -> str:
    # keep path under deployments/chatkit/, drop querystring
    u = urllib.parse.urlparse(url)
    if CDN_HOST not in u.netloc: return None
    if not u.path.startswith("/deployments/chatkit/"): return None
    rel = u.path[len("/deployments/chatkit/"):]
    # make subdirs as needed
    rel = rel.lstrip("/")
    return os.path.join(OUT_DIR, rel)

def write_entry(entry):
    req = entry.get("request", {})
    res = entry.get("response", {})
    url = req.get("url", "")
    out_path = safe_path(url)
    if not out_path:
        return None

    content = res.get("content", {})
    text = content.get("text")
    if text is None:
        return None  # no body captured (served from memory/disk cache)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    if content.get("encoding") == "base64":
        data = base64.b64decode(text)
    else:
        data = text.encode("utf-8")
    # strip query-only filenames (e.g., f.js?dpl=...)
    root, _qs = os.path.splitext(out_path) if out_path.endswith("?") else (out_path, "")
    # actually remove query parameters from filename
    if "?" in out_path:
        out_path = out_path.split("?", 1)[0]
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "wb") as f:
        f.write(data)
    return out_path

def patch_files(written_files):
    # find chatkit.js and index-*.html
    ck_js = None
    index_html = None
    for p in written_files:
        if p is None: continue
        name = os.path.basename(p)
        if name == "chatkit.js":
            ck_js = p
        elif name.startswith("index-") and name.endswith(".html"):
            index_html = p

    # rewrite absolute CDN URLs in index html to local /vendor/chatkit/
    if index_html:
        with open(index_html, "r", encoding="utf-8", errors="ignore") as f:
            html = f.read()
        html = html.replace(CDN_BASE, "/vendor/chatkit/")
        # also make relative asset references work locally: they already are under same dir
        with open(index_html, "w", encoding="utf-8") as f:
            f.write(html)

    # rewrite Ae in chatkit.js to point to local index-*.html
    if ck_js and index_html:
        with open(ck_js, "r", encoding="utf-8", errors="ignore") as f:
            js = f.read()
        # Replace: var Ae="https://cdn.platform.openai.com/deployments/chatkit/index-XXXX.html";
        js = re.sub(
            r'var Ae="https://cdn\.platform\.openai\.com/deployments/chatkit/[^"]+index-[^"]+\.html";',
            f'var Ae="/vendor/chatkit/{os.path.basename(index_html)}";',
            js
        )
        with open(ck_js, "w", encoding="utf-8") as f:
            f.write(js)

def main():
    with open(HAR_PATH, "r", encoding="utf-8") as f:
        har = json.load(f)
    written = []
    for e in har.get("log", {}).get("entries", []):
        p = write_entry(e)
        if p: written.append(p)
    if not written:
        print("No ChatKit assets found in HAR (did you save WITH content, and from the iframe request list?)")
        sys.exit(1)
    patch_files(written)
    print(f"Done. Files in {OUT_DIR}")
    print('Include in your app:\n  <script src="/vendor/chatkit/chatkit.js" async></script>')

if __name__ == "__main__":
    main()

