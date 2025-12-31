"""
Async streaming console chat for Gemini Developer API (AI Studio).

Install:
  pip install google-genai

Run:
  export GEMINI_API_KEY="your_key"
  python chat_gemini_async.py

Notes:
- Uses asyncio + streaming.
- Type /exit to quit, /reset to clear conversation.
"""

import asyncio
import os
import sys
from typing import List, Dict, Any

from google import genai


MODEL = "gemini-3-pro-preview"


def build_contents(history: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Convert a simple in-memory history into the 'contents' shape expected by the API.
    We store each turn as: {"role": "user"|"model", "text": "..."}
    """
    contents = []
    for turn in history:
        contents.append(
            {
                "role": turn["role"],
                "parts": [{"text": turn["text"]}],
            }
        )
    return contents


async def ainput(prompt: str = "") -> str:
    """Async-friendly input() using a thread so we don't block the event loop."""
    return await asyncio.to_thread(input, prompt)


async def stream_assistant_reply(client: genai.Client, history: List[Dict[str, Any]]) -> str:
    """
    Streams the model reply to stdout and returns the full accumulated text.
    Uses a thread wrapper because the SDK's streaming iterator is synchronous.
    """
    # Create the synchronous stream
    stream = client.models.generate_content_stream(
        model=MODEL,
        contents=build_contents(history),
    )

    full = []

    def consume_stream():
        # Consume the sync iterator in a worker thread.
        # Print tokens as they arrive; collect full text for history.
        for chunk in stream:
            # chunk.text is typically incremental text
            text = getattr(chunk, "text", None)
            if text:
                print(text, end="", flush=True)
                full.append(text)

    await asyncio.to_thread(consume_stream)
    print()  # newline after assistant completes
    return "".join(full).strip()


async def main() -> None:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Missing GEMINI_API_KEY env var.", file=sys.stderr)
        print('Set it like: export GEMINI_API_KEY="YOUR_API_KEY_HERE"', file=sys.stderr)
        raise SystemExit(1)

    client = genai.Client(api_key=api_key)

    history: List[Dict[str, Any]] = []
    print(f"Gemini async chat (model: {MODEL})")
    print("Commands: /exit, /reset")
    print("-" * 40)

    while True:
        user_text = (await ainput("you> ")).strip()
        if not user_text:
            continue
        if user_text.lower() in ("/exit", "exit", "quit", "/quit"):
            break
        if user_text.lower() == "/reset":
            history.clear()
            print("(history cleared)")
            continue

        history.append({"role": "user", "text": user_text})

        print("ai> ", end="", flush=True)
        try:
            reply = await stream_assistant_reply(client, history)
        except Exception as e:
            # Don't poison the history if generation failed
            history.pop()
            print(f"\n[error] {type(e).__name__}: {e}", file=sys.stderr)
            continue

        history.append({"role": "model", "text": reply})

    print("bye!")


if __name__ == "__main__":
    asyncio.run(main())

