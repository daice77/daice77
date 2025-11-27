"use strict";
(() => {
  var dt = Object.create;
  var oe = Object.defineProperty;
  var lt = Object.getOwnPropertyDescriptor;
  var Ie = (r, t) => ((t = Symbol[r]) ? t : Symbol.for("Symbol." + r)),
    F = (r) => {
      throw TypeError(r);
    };
  var Pe = (r, t, e) =>
    t in r
      ? oe(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e })
      : (r[t] = e);
  var Me = (r, t) => oe(r, "name", { value: t, configurable: !0 });
  var Le = (r) => [, , , dt(r?.[Ie("metadata")] ?? null)],
    Ke = [
      "class",
      "method",
      "getter",
      "setter",
      "accessor",
      "field",
      "value",
      "get",
      "set",
    ],
    j = (r) =>
      r !== void 0 && typeof r != "function" ? F("Function expected") : r,
    ht = (r, t, e, n, s) => ({
      kind: Ke[r],
      name: t,
      metadata: n,
      addInitializer: (a) =>
        e._ ? F("Already initialized") : s.push(j(a || null)),
    }),
    ae = (r, t) => Pe(t, Ie("metadata"), r[3]),
    Fe = (r, t, e, n) => {
      for (var s = 0, a = r[t >> 1], i = a && a.length; s < i; s++)
        t & 1 ? a[s].call(e) : (n = a[s].call(e, n));
      return n;
    },
    T = (r, t, e, n, s, a) => {
      var i,
        c,
        h,
        l,
        x,
        d = t & 7,
        D = !!(t & 8),
        f = !!(t & 16),
        P = d > 3 ? r.length + 1 : d ? (D ? 1 : 2) : 0,
        B = Ke[d + 5],
        U = d > 3 && (r[P - 1] = []),
        $ = r[P] || (r[P] = []),
        y =
          d &&
          (!f && !D && (s = s.prototype),
          d < 5 &&
            (d > 3 || !f) &&
            lt(
              d < 4
                ? s
                : {
                    get [e]() {
                      return o(this, a);
                    },
                    set [e](v) {
                      return R(this, a, v);
                    },
                  },
              e,
            ));
      d
        ? f && d < 4 && Me(a, (d > 2 ? "set " : d > 1 ? "get " : "") + e)
        : Me(s, e);
      for (var Y = n.length - 1; Y >= 0; Y--)
        ((l = ht(d, e, (h = {}), r[3], $)),
          d &&
            ((l.static = D),
            (l.private = f),
            (x = l.access = { has: f ? (v) => pt(s, v) : (v) => e in v }),
            d ^ 3 &&
              (x.get = f
                ? (v) => (d ^ 1 ? o : _)(v, s, d ^ 4 ? a : y.get)
                : (v) => v[e]),
            d > 2 &&
              (x.set = f
                ? (v, K) => R(v, s, K, d ^ 4 ? a : y.set)
                : (v, K) => (v[e] = K))),
          (c = (0, n[Y])(
            d
              ? d < 4
                ? f
                  ? a
                  : y[B]
                : d > 4
                  ? void 0
                  : { get: y.get, set: y.set }
              : s,
            l,
          )),
          (h._ = 1),
          d ^ 4 || c === void 0
            ? j(c) &&
              (d > 4 ? U.unshift(c) : d ? (f ? (a = c) : (y[B] = c)) : (s = c))
            : typeof c != "object" || c === null
              ? F("Object expected")
              : (j((i = c.get)) && (y.get = i),
                j((i = c.set)) && (y.set = i),
                j((i = c.init)) && U.unshift(i)));
      return (d || ae(r, s), y && oe(s, e, y), f ? (d ^ 4 ? a : y) : s);
    },
    ie = (r, t, e) => Pe(r, typeof t != "symbol" ? t + "" : t, e),
    ce = (r, t, e) => t.has(r) || F("Cannot " + e),
    pt = (r, t) =>
      Object(t) !== t
        ? F('Cannot use the "in" operator on this value')
        : r.has(t),
    o = (r, t, e) => (
      ce(r, t, "read from private field"),
      e ? e.call(r) : t.get(r)
    ),
    S = (r, t, e) =>
      t.has(r)
        ? F("Cannot add the same private member more than once")
        : t instanceof WeakSet
          ? t.add(r)
          : t.set(r, e),
    R = (r, t, e, n) => (
      ce(r, t, "write to private field"),
      n ? n.call(r, e) : t.set(r, e),
      e
    ),
    _ = (r, t, e) => (ce(r, t, "access private method"), e);
  var mt = (r) =>
    btoa(r).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  var Ne = (r) => {
    if (r === void 0)
      throw new TypeError(
        "encodeBase64: `undefined` cannot be encoded to valid JSON. Pass null instead.",
      );
    let t = JSON.stringify(r),
      e = new TextEncoder().encode(t),
      n = "";
    for (let s of e) n += String.fromCharCode(s);
    return mt(n);
  };
  var G = class {
    callbacks = new Map();
    on(t, e) {
      (this.callbacks.has(t) || this.callbacks.set(t, new Set()),
        this.callbacks.get(t).add(e));
    }
    emit(t, ...e) {
      let n = e[0];
      this.callbacks.get(t)?.forEach((s) => s(n));
    }
    off(t, e) {
      e ? this.callbacks.get(t)?.delete(e) : this.callbacks.delete(t);
    }
    allOff() {
      this.callbacks.clear();
    }
  };
  var g = "__chatkit_error__",
    He = class {
      [g];
      message;
      stack;
      constructor(t) {
        ((this[g] = t.name),
          (this.message = t.message),
          (this.stack = t.stack));
      }
    },
    u = class extends Error {
      cause;
      eventName;
      metadata;
      [g];
      get canonicalName() {
        return "AppError";
      }
      constructor(t, e) {
        let n = t instanceof Error ? t.message : String(t),
          s = t instanceof Error ? t : void 0;
        (super(n, { cause: s }), (this.name = this.canonicalName));
        let a = e ? e + ": " : "";
        (n.startsWith(a) || (this.message = `${a}${n}`),
          (this[g] = this.name),
          (this.eventName =
            this.name.length > 0
              ? `error.${this.name.charAt(0).toLowerCase() + this.name.slice(1).replace(/Error$/i, "")}`
              : "error.app"),
          s && s.stack && (this.stack = s.stack),
          s && "metadata" in s && s.metadata && (this.metadata = s.metadata));
      }
      static fromPossibleFrameSafeError(t) {
        if (
          t &&
          typeof t == "object" &&
          g in t &&
          typeof t[g] == "string" &&
          We[t[g]]
        ) {
          let e = t,
            n = We[t[g]],
            s = new n(e.message);
          return ((s.stack = e.stack), (s.name = e[g]), (s[g] = e[g]), s);
        }
        return null;
      }
    },
    de = class extends u {
      get canonicalName() {
        return "StreamError";
      }
    },
    le = class extends u {
      get canonicalName() {
        return "StreamEventParsingError";
      }
      constructor(t) {
        super(t, "Failed to parse stream event");
      }
    },
    he = class extends u {
      get canonicalName() {
        return "StreamEventHandlingError";
      }
      constructor(t) {
        super(t, "Failed to handle stream event");
      }
    },
    pe = class extends u {
      get canonicalName() {
        return "StreamStopError";
      }
      constructor(t) {
        super(t, "Failed to stop stream");
      }
    },
    me = class extends u {
      get canonicalName() {
        return "ThreadRenderingError";
      }
    },
    ue = class extends u {
      get canonicalName() {
        return "HistoryViewError";
      }
      constructor(t) {
        super(t, "Failed to load conversation");
      }
    },
    ge = class r extends u {
      get canonicalName() {
        return "EntitySearchError";
      }
      static fromQuery(t, e) {
        let n = `Failed to search entities for query: ${e}`;
        return new r(t, n);
      }
    },
    fe = class extends u {
      get canonicalName() {
        return "WidgetItemError";
      }
    },
    ye = class extends u {
      get canonicalName() {
        return "InitialThreadLoadError";
      }
      constructor(t) {
        super(t, "Failed to load initial thread");
      }
    },
    ve = class extends u {
      get canonicalName() {
        return "FileAttachmentError";
      }
      constructor(t) {
        super(t, "Failed to upload file");
      }
    },
    Ee = class extends u {
      get canonicalName() {
        return "UnhandledError";
      }
    },
    we = class extends u {
      get canonicalName() {
        return "UnhandledPromiseRejectionError";
      }
    },
    be = class extends u {
      code;
      get canonicalName() {
        return "IntlError";
      }
      constructor(t) {
        (super(t, "Intl error"),
          (this.code =
            typeof t == "object" && t !== null && "code" in t
              ? String(t.code)
              : ""));
      }
    },
    Ce = class extends u {
      get canonicalName() {
        return "FatalAppError";
      }
    },
    ke = class extends u {
      get canonicalName() {
        return "NetworkError";
      }
    },
    xe = class extends u {
      get canonicalName() {
        return "DomainVerificationRequestError";
      }
    };
  var We = {
    StreamError: de,
    StreamEventParsingError: le,
    StreamEventHandlingError: he,
    StreamStopError: pe,
    ThreadRenderingError: me,
    HistoryViewError: ue,
    EntitySearchError: ge,
    WidgetItemError: fe,
    InitialThreadLoadError: ye,
    FileAttachmentError: ve,
    UnhandledError: Ee,
    UnhandledPromiseRejectionError: we,
    IntlError: be,
    DomainVerificationRequestError: xe,
    NetworkError: ke,
    FatalAppError: Ce,
  };
  var b = class r extends Error {
      _name;
      constructor(t) {
        (super(t), (this.name = "IntegrationError"), (this._name = this.name));
      }
      static fromPossibleFrameSafeError(t) {
        if (
          t &&
          typeof t == "object" &&
          g in t &&
          t[g] === "IntegrationError"
        ) {
          let e = t,
            n = new r(e.message);
          return ((n.stack = e.stack), n);
        }
        return null;
      }
    },
    Q = class {
      [g] = "IntegrationError";
      message;
      stack;
      constructor(t) {
        ((this.message = t), (this.stack = new Error(t).stack));
      }
    };
  var N = class r extends Error {
      status;
      statusText;
      metadata;
      constructor(t, e, n) {
        (super(t),
          (this.name = "HttpError"),
          (this.statusText = e.statusText),
          (this.status = e.status),
          (this.metadata = n));
      }
      static fromPossibleFrameSafeError(t) {
        if (t instanceof r) return t;
        if (t && typeof t == "object" && g in t && t[g] === "HttpError") {
          let e = t,
            n = new r(
              e.message,
              { status: e.status, statusText: e.statusText },
              e.metadata,
            );
          return ((n.stack = e.stack), n);
        }
        return null;
      }
    },
    H = class r {
      [g] = "HttpError";
      message;
      stack;
      status;
      statusText;
      metadata;
      constructor(t, e, n) {
        ((this.message = t),
          (this.stack = new Error(t).stack),
          (this.status = e.status),
          (this.statusText = e.statusText),
          (this.metadata = n));
      }
      static fromHttpError(t) {
        return new r(
          t.message,
          { status: t.status, statusText: t.statusText },
          t.metadata,
        );
      }
    };
  function De(r) {
    let t = b.fromPossibleFrameSafeError(r);
    if (t) return t;
    let e = N.fromPossibleFrameSafeError(r);
    return e || (u.fromPossibleFrameSafeError(r) ?? r);
  }
  async function Ue(r, t) {
    let e = r.getReader(),
      n;
    for (; !(n = await e.read()).done; ) t(n.value);
  }
  function $e(r) {
    let t,
      e,
      n,
      s = !1;
    return function (i) {
      t === void 0 ? ((t = i), (e = 0), (n = -1)) : (t = ut(t, i));
      let c = t.length,
        h = 0;
      for (; e < c; ) {
        s && (t[e] === 10 && (h = ++e), (s = !1));
        let l = -1;
        for (; e < c && l === -1; ++e)
          switch (t[e]) {
            case 58:
              n === -1 && (n = e - h);
              break;
            case 13:
              s = !0;
            case 10:
              l = e;
              break;
          }
        if (l === -1) break;
        (r(t.subarray(h, l), n), (h = e), (n = -1));
      }
      h === c ? (t = void 0) : h !== 0 && ((t = t.subarray(h)), (e -= h));
    };
  }
  function Ye(r, t, e) {
    let n = Be(),
      s = new TextDecoder();
    return function (i, c) {
      if (i.length === 0) (e?.(n), (n = Be()));
      else if (c > 0) {
        let h = s.decode(i.subarray(0, c)),
          l = c + (i[c + 1] === 32 ? 2 : 1),
          x = s.decode(i.subarray(l));
        switch (h) {
          case "data":
            n.data = n.data
              ? n.data +
                `
` +
                x
              : x;
            break;
          case "event":
            n.event = x;
            break;
          case "id":
            r((n.id = x));
            break;
          case "retry":
            let d = parseInt(x, 10);
            isNaN(d) || t((n.retry = d));
            break;
        }
      }
    };
  }
  function ut(r, t) {
    let e = new Uint8Array(r.length + t.length);
    return (e.set(r), e.set(t, r.length), e);
  }
  function Be() {
    return { data: "", event: "", id: "", retry: void 0 };
  }
  var gt = function (r, t) {
      var e = {};
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) &&
          t.indexOf(n) < 0 &&
          (e[n] = r[n]);
      if (r != null && typeof Object.getOwnPropertySymbols == "function")
        for (var s = 0, n = Object.getOwnPropertySymbols(r); s < n.length; s++)
          t.indexOf(n[s]) < 0 &&
            Object.prototype.propertyIsEnumerable.call(r, n[s]) &&
            (e[n[s]] = r[n[s]]);
      return e;
    },
    Z = "text/event-stream",
    ft = 1e3,
    je = "last-event-id";
  function Te(r, t) {
    var {
        signal: e,
        headers: n,
        onopen: s,
        onmessage: a,
        onclose: i,
        onerror: c,
        openWhenHidden: h,
        fetch: l,
      } = t,
      x = gt(t, [
        "signal",
        "headers",
        "onopen",
        "onmessage",
        "onclose",
        "onerror",
        "openWhenHidden",
        "fetch",
      ]);
    return new Promise((d, D) => {
      let f = Object.assign({}, n);
      f.accept || (f.accept = Z);
      let P;
      function B() {
        (P.abort(), document.hidden || K());
      }
      h || document.addEventListener("visibilitychange", B);
      let U = ft,
        $ = 0;
      function y() {
        (document.removeEventListener("visibilitychange", B),
          window.clearTimeout($),
          P.abort());
      }
      e?.addEventListener("abort", () => {
        (y(), d());
      });
      let Y = l ?? window.fetch,
        v = s ?? yt;
      async function K() {
        var se;
        P = new AbortController();
        try {
          let J = await Y(
            r,
            Object.assign(Object.assign({}, x), {
              headers: f,
              signal: P.signal,
            }),
          );
          (await v(J),
            await Ue(
              J.body,
              $e(
                Ye(
                  (L) => {
                    L ? (f[je] = L) : delete f[je];
                  },
                  (L) => {
                    U = L;
                  },
                  a,
                ),
              ),
            ),
            i?.(),
            y(),
            d());
        } catch (J) {
          if (!P.signal.aborted)
            try {
              let L = (se = c?.(J)) !== null && se !== void 0 ? se : U;
              (window.clearTimeout($), ($ = window.setTimeout(K, L)));
            } catch (L) {
              (y(), D(L));
            }
        }
      }
      K();
    });
  }
  function yt(r) {
    let t = r.headers.get("content-type");
    if (!t?.startsWith(Z))
      throw new Error(`Expected content-type to be ${Z}, Actual: ${t}`);
  }
  var ze = (r, t = 1e4, e = 1e3) => {
    let n = Math.min(t, e * 2 ** r);
    return Math.floor(n * (0.5 + Math.random() * 0.5));
  };
  var ee = class extends Error {
      constructor(t) {
        (super(), (this.cause = t));
      }
    },
    Ve = async (r, t) => {
      let e = 0,
        { onopen: n, ...s } = t;
      await Te(r, {
        ...s,
        onopen: async (a) => {
          if (
            (n?.(a),
            a.ok &&
              a.headers.get("content-type")?.startsWith("text/event-stream"))
          ) {
            e = 0;
            return;
          }
          let i = new H(`Streaming failed: ${a.statusText}`, a);
          throw a.status >= 400 && a.status < 500 ? i : new ee(i);
        },
        onerror: (a) => {
          if (a instanceof ee) {
            if (e >= 5) throw a.cause;
            return ((e += 1), ze(e));
          }
          throw a;
        },
      });
    };
  var te = class {
    targetOrigin;
    target;
    commandHandlers;
    _fetch;
    constructor({
      handlers: t,
      target: e,
      targetOrigin: n,
      fetch: s = window.fetch,
    }) {
      ((this.commandHandlers = t),
        (this.target = e),
        (this.targetOrigin = n),
        (this._fetch = (...a) => s(...a)));
    }
    emitter = new G();
    handlers = new Map();
    fetchEventSourceHandlers = new Map();
    abortControllers = new Map();
    sendMessage(t, e) {
      let n = { __oaiChatKit: !0, ...t };
      this.target()?.postMessage(n, this.targetOrigin, e);
    }
    connect() {
      window.addEventListener("message", this.handleMessage);
    }
    disconnect() {
      window.removeEventListener("message", this.handleMessage);
    }
    fetch(t, e) {
      return new Promise((n, s) => {
        let a = crypto.randomUUID();
        this.handlers.set(a, {
          resolve: n,
          reject: s,
          stack: new Error().stack || "",
        });
        let i;
        if (e.body instanceof FormData) {
          i = {};
          for (let [c, h] of e.body.entries()) i[c] = h;
          e.body = void 0;
        }
        (e.signal &&
          (e.signal.addEventListener("abort", () => {
            this.sendMessage({
              type: "abortSignal",
              nonce: a,
              reason: e.signal?.reason,
            });
          }),
          (e.signal = void 0)),
          this.sendMessage({
            type: "fetch",
            nonce: a,
            params: e,
            formData: i,
            url: t,
          }));
      });
    }
    fetchEventSource(t, e) {
      return new Promise((n, s) => {
        let { onmessage: a, signal: i, ...c } = e,
          h = crypto.randomUUID();
        (this.handlers.set(h, {
          resolve: n,
          reject: s,
          stack: new Error().stack || "",
        }),
          this.fetchEventSourceHandlers.set(h, { onmessage: a }),
          i &&
            i.addEventListener("abort", () => {
              this.sendMessage({
                type: "abortSignal",
                nonce: h,
                reason: i.reason,
              });
            }),
          this.sendMessage({
            type: "fetchEventSource",
            nonce: h,
            params: c,
            url: t,
          }));
      });
    }
    commands = new Proxy(
      {},
      {
        get: (t, e) => (n, s) =>
          new Promise((a, i) => {
            let c = crypto.randomUUID();
            (this.handlers.set(c, {
              resolve: a,
              reject: i,
              stack: new Error().stack || "",
            }),
              this.sendMessage(
                {
                  type: "command",
                  nonce: c,
                  command: `on${e.charAt(0).toUpperCase()}${e.slice(1)}`,
                  data: n,
                },
                s,
              ));
          }),
      },
    );
    emit(...[t, e, n]) {
      this.sendMessage({ type: "event", event: t, data: e }, n);
    }
    on(...[t, e]) {
      this.emitter.on(t, e);
    }
    destroy() {
      (window.removeEventListener("message", this.handleMessage),
        this.emitter.allOff(),
        this.handlers.clear());
    }
    handleMessage = async (t) => {
      if (
        !t.data ||
        t.data.__oaiChatKit !== !0 ||
        t.origin !== this.targetOrigin ||
        t.source !== this.target()
      )
        return;
      let e = t.data;
      switch (e.type) {
        case "event": {
          this.emitter.emit(e.event, e.data);
          break;
        }
        case "fetch": {
          try {
            if (e.formData) {
              let i = new FormData();
              for (let [c, h] of Object.entries(e.formData)) i.append(c, h);
              e.params.body = i;
            }
            let n = new AbortController();
            (this.abortControllers.set(e.nonce, n),
              (e.params.signal = n.signal));
            let s = await this._fetch(e.url, e.params);
            if (!s.ok) {
              let i = await s
                .json()
                .then((c) => c.message || s.statusText)
                .catch(() => s.statusText);
              throw new H(i, s);
            }
            let a = await s.json().catch(() => ({}));
            this.sendMessage({ type: "response", response: a, nonce: e.nonce });
          } catch (n) {
            this.sendMessage({ type: "response", error: n, nonce: e.nonce });
          }
          break;
        }
        case "fetchEventSource": {
          try {
            let n = new AbortController();
            (this.abortControllers.set(e.nonce, n),
              await Ve(e.url, {
                ...e.params,
                signal: n.signal,
                fetch: this._fetch,
                onmessage: (s) => {
                  this.sendMessage({
                    type: "fetchEventSourceMessage",
                    message: s,
                    nonce: e.nonce,
                  });
                },
              }),
              this.sendMessage({
                type: "response",
                response: void 0,
                nonce: e.nonce,
              }));
          } catch (n) {
            this.sendMessage({ type: "response", error: n, nonce: e.nonce });
          }
          break;
        }
        case "command": {
          if (!this.canReceiveCommand(e.command)) {
            this.sendMessage({
              type: "response",
              error: new Q(`Command ${e.command} not supported`),
              nonce: e.nonce,
            });
            return;
          }
          try {
            let n = await this.commandHandlers[e.command]?.(e.data);
            this.sendMessage({ type: "response", response: n, nonce: e.nonce });
          } catch (n) {
            this.sendMessage({ type: "response", error: n, nonce: e.nonce });
          }
          break;
        }
        case "response": {
          let n = this.handlers.get(e.nonce);
          if (!n) {
            console.error("No handler found for nonce", e.nonce);
            return;
          }
          if (e.error) {
            let s = b.fromPossibleFrameSafeError(e.error),
              a = N.fromPossibleFrameSafeError(e.error);
            s
              ? ((s.stack = n.stack), n.reject(s))
              : a
                ? n.reject(a)
                : n.reject(e.error);
          } else n.resolve(e.response);
          this.handlers.delete(e.nonce);
          break;
        }
        case "fetchEventSourceMessage": {
          if (!this.fetchEventSourceHandlers.get(e.nonce)) {
            console.error("No handler found for nonce", e.nonce);
            return;
          }
          this.fetchEventSourceHandlers.get(e.nonce)?.onmessage?.(e.message);
          break;
        }
        case "abortSignal": {
          let n = this.abortControllers.get(e.nonce);
          n && (n.abort(e.reason), this.abortControllers.delete(e.nonce));
          break;
        }
        default:
          break;
      }
    };
  };
  var ne = class extends te {
    canReceiveCommand(t) {
      return !0;
    }
  };
  var re = (r, t = new WeakSet()) => {
    if (typeof r == "function") return "[ChatKitMethod]";
    if (typeof r != "object" || r === null || t.has(r)) return r;
    if ((t.add(r), Array.isArray(r))) return r.map((n) => re(n, t));
    let e = {};
    for (let [n, s] of Object.entries(r))
      typeof s != "function" ? (e[n] = re(s, t)) : (e[n] = "[ChatKitMethod]");
    return e;
  };
  var z = [
      "command.setOptions",
      "command.sendUserMessage",
      "command.setComposerValue",
      "command.setThreadId",
      "command.focusComposer",
      "command.fetchUpdates",
      "command.sendCustomAction",
      "event.ready",
      "event.error",
      "event.log",
      "event.response.start",
      "event.response.end",
      "event.response.stop",
      "event.thread.change",
      "event.tool.change",
      "event.thread.load.start",
      "event.thread.load.end",
      "event.deeplink",
      "event.effect",
      "error.StreamError",
      "error.StreamEventParsingError",
      "error.WidgetItemError",
      "error.InitialThreadLoadError",
      "error.FileAttachmentError",
      "error.HistoryViewError",
      "error.FatalAppError",
      "error.IntegrationError",
      "error.EntitySearchError",
      "error.DomainVerificationRequestError",
      "backend.threads.get_by_id",
      "backend.threads.list",
      "backend.threads.update",
      "backend.threads.delete",
      "backend.threads.create",
      "backend.threads.add_user_message",
      "backend.threads.add_client_tool_output",
      "backend.threads.retry_after_item",
      "backend.threads.custom_action",
      "backend.attachments.create",
      "backend.attachments.get_preview",
      "backend.attachments.delete",
      "backend.items.list",
      "backend.items.feedback",
      "thread.item.user_message",
      "thread.item.assistant_message",
      "thread.item.client_tool_call",
      "thread.item.widget",
      "thread.item.task",
      "thread.item.workflow",
      "thread.item.end_of_turn",
      "thread.item.image_generation",
      "widget.Basic",
      "widget.Card",
      "widget.ListView",
      "widget.ListViewItem",
      "widget.Badge",
      "widget.Box",
      "widget.Row",
      "widget.Col",
      "widget.Button",
      "widget.Caption",
      "widget.Chart",
      "widget.Checkbox",
      "widget.DatePicker",
      "widget.Divider",
      "widget.Form",
      "widget.Icon",
      "widget.Image",
      "widget.Input",
      "widget.Label",
      "widget.Markdown",
      "widget.RadioGroup",
      "widget.Select",
      "widget.Spacer",
      "widget.Text",
      "widget.Textarea",
      "widget.Title",
      "widget.Transition",
    ],
    Se = [
      "command.shareThread",
      "command.showHistory",
      "command.hideHistory",
      "command.setTrainingOptOut",
      "command.showHistory",
      "command.hideHistory",
      "event.thread.restore",
      "event.message.share",
      "event.image.download",
      "event.history.open",
      "event.history.close",
      "event.log.chatgpt",
      "error.HttpError",
      "error.NetworkError",
      "error.UnhandledError",
      "error.UnhandledPromiseRejectionError",
      "error.StreamEventHandlingError",
      "error.StreamStopError",
      "error.ThreadRenderingError",
      "error.IntlError",
      "error.AppError",
      "backend.threads.stop",
      "backend.threads.share",
      "backend.threads.create_from_shared",
      "backend.threads.init",
      "backend.attachments.process",
      "widget.CardCarousel",
      "widget.Favicon",
      "widget.CardLinkItem",
      "widget.Map",
    ],
    qe = {
      chatkit: { allow: [...z, "thread.item.image_generation"], deny: Se },
      "chatgpt-shell": {
        allow: [
          ...z,
          "command.shareThread",
          "command.showHistory",
          "command.hideHistory",
          "event.response.stop",
          "event.thread.restore",
          "event.message.share",
          "event.image.download",
          "event.history.open",
          "event.history.close",
          "event.log.chatgpt",
          "error.HttpError",
          "error.NetworkError",
          "error.ThreadRenderingError",
          "backend.threads.stop",
          "backend.threads.share",
          "backend.threads.create_from_shared",
          "backend.threads.init",
          "backend.attachments.process",
          "thread.item.image_generation",
          "widget.CardCarousel",
          "widget.Favicon",
          "widget.CardLinkItem",
        ],
        deny: ["event.log", "backend.threads.add_client_tool_output"],
      },
      "chatgpt-shell-anonymous": {
        allow: [
          ...z,
          "command.setTrainingOptOut",
          "event.response.stop",
          "event.thread.restore",
          "event.history.open",
          "event.history.close",
          "event.message.share",
          "event.log.chatgpt",
          "error.HttpError",
          "error.NetworkError",
          "error.ThreadRenderingError",
          "backend.threads.stop",
          "backend.threads.create_from_shared",
          "backend.threads.init",
          "backend.attachments.process",
          "thread.item.image_generation",
          "widget.CardCarousel",
          "widget.Favicon",
          "widget.CardLinkItem",
        ],
        deny: [
          "event.log",
          "backend.threads.add_client_tool_output",
          "backend.threads.list",
        ],
      },
    };
  var Re = (r) => {
      let t = qe[r],
        e = new Set(t.allow);
      for (let l of t.deny ?? []) e.delete(l);
      let n = new Set(),
        s = new Set(),
        a = new Set(),
        i = new Set(),
        c = new Set(),
        h = new Set();
      for (let l of e) {
        if (l.startsWith("command.")) {
          n.add(l.slice(8));
          continue;
        }
        if (l.startsWith("event.")) {
          s.add(l.slice(6));
          continue;
        }
        if (l.startsWith("backend.")) {
          a.add(l.slice(8));
          continue;
        }
        if (
          (l.startsWith("thread.item.") && i.add(l.slice(12)),
          l.startsWith("error."))
        ) {
          c.add(l.slice(6));
          continue;
        }
        if (l.startsWith("widget.")) {
          h.add(l.slice(7));
          continue;
        }
      }
      return {
        commands: n,
        events: s,
        backend: a,
        threadItems: i,
        errors: c,
        widgets: h,
      };
    },
    tn = [...z, ...Se];
  var Xe =
    "https://cdn.platform.openai.com/deployments/chatkit/index-BXMGNMdAn3.html";
  function Je(r) {
    return re(r);
  }
  function A(r, t) {
    let e = String(t.name);
    return function (...n) {
      if (!this.capabilities.commands.has(e))
        throw new b(
          `ChatKit command "${String(e)}" is not available for the "${this.profile}" profile.`,
        );
      return r.apply(this, n);
    };
  }
  var Ge,
    Qe,
    Ze,
    et,
    tt,
    nt,
    rt,
    st,
    ot,
    at,
    it,
    p,
    O,
    M,
    I,
    q,
    w,
    m,
    C,
    V,
    _e,
    X,
    W,
    Ae,
    k,
    E = class extends ((it = HTMLElement),
    (at = [A]),
    (ot = [A]),
    (st = [A]),
    (rt = [A]),
    (nt = [A]),
    (tt = [A]),
    (et = [A]),
    (Ze = [A]),
    (Qe = [A]),
    (Ge = [A]),
    it) {
      constructor({ profile: e }) {
        super();
        Fe(k, 5, this);
        S(this, C);
        ie(this, "profile");
        ie(this, "capabilities");
        S(this, p);
        S(this, O);
        S(this, M);
        S(this, I, this.attachShadow({ mode: "open" }));
        S(this, q);
        S(
          this,
          w,
          new Promise((e) => {
            R(this, q, e);
          }),
        );
        S(
          this,
          m,
          new ne({
            fetch: (...e) => {
              let n =
                o(this, p)?.api &&
                "fetch" in o(this, p).api &&
                o(this, p).api.fetch;
              return n ? n(...e) : fetch(...e);
            },
            target: () => o(this, O)?.contentWindow ?? null,
            targetOrigin: new URL(Xe).origin,
            handlers: {
              onFileInputClick: ({ inputAttributes: e }) =>
                new Promise((n) => {
                  let s = document.createElement("input");
                  for (let [i, c] of Object.entries(e))
                    s.setAttribute(i, String(c));
                  let a = () => {
                    (n(Array.from(s.files || [])),
                      o(this, I).contains(s) && o(this, I).removeChild(s));
                  };
                  (s.addEventListener("cancel", a),
                    s.addEventListener("change", a),
                    o(this, I).appendChild(s),
                    s.click());
                }),
              onClientToolCall: async ({ name: e, params: n }) => {
                let s = o(this, p)?.onClientTool;
                return (
                  s ||
                    _(this, C, V).call(
                      this,
                      new b(
                        "No handler for client tool calls. You'll need to add onClientTool to your ChatKit options.",
                      ),
                    ),
                  s({ name: e, params: n })
                );
              },
              onWidgetAction: async ({ action: e, widgetItem: n }) => {
                let s = o(this, p)?.widgets?.onAction;
                return (
                  s ||
                    _(this, C, V).call(
                      this,
                      new b(
                        "No handler for widget actions. You'll need to add widgets.onAction to your ChatKit options.",
                      ),
                    ),
                  s(e, n)
                );
              },
              onEntitySearch: async ({ query: e }) =>
                o(this, p)?.entities?.onTagSearch?.(e) ?? [],
              onEntityClick: async ({ entity: e }) =>
                o(this, p)?.entities?.onClick?.(e),
              onEntityPreview: async ({ entity: e }) =>
                o(this, p)?.entities?.onRequestPreview?.(e) ?? {
                  preview: null,
                },
              onGetClientSecret: async (e) => (
                (!o(this, p) ||
                  !("getClientSecret" in o(this, p).api) ||
                  !o(this, p).api.getClientSecret) &&
                  _(this, C, V).call(
                    this,
                    new b(
                      "Could not refresh the session because ChatKitOptions.api.getClientSecret is not configured.",
                    ),
                  ),
                o(this, p).api.getClientSecret(e ?? null)
              ),
            },
          }),
        );
        S(this, X, () => {
          var e;
          ((this.dataset.loaded = "true"),
            this.dispatchEvent(
              new CustomEvent("chatkit.ready", { bubbles: !0, composed: !0 }),
            ),
            (e = o(this, q)) == null || e.call(this));
        });
        S(this, W, !1);
        ((this.profile = e), (this.capabilities = Re(e)));
      }
      setProfile(e) {
        ((this.profile = e), (this.capabilities = Re(e)));
      }
      connectedCallback() {
        let e = document.createElement("style");
        e.textContent = `
      :host {
        display: block;
        position: relative;
        height: 100%;
        width: 100%;
      }
      .ck-iframe {
        border: none;
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        color-scheme: light only;
      }
      .ck-wrapper {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        opacity: 0;
      }
      :host([data-color-scheme="dark"]) .ck-iframe {
        color-scheme: dark only;
      }
      :host([data-loaded="true"]) .ck-wrapper {
        opacity: 1;
      }
    `;
        let n = document.createElement("iframe");
        ((n.className = "ck-iframe"),
          (n.name = "chatkit"),
          (n.role = "presentation"),
          (n.tabIndex = 0),
          n.setAttribute("allowtransparency", "true"),
          n.setAttribute("frameborder", "0"),
          n.setAttribute("scrolling", "no"),
          n.setAttribute("allow", "clipboard-read; clipboard-write"),
          R(this, O, n));
        let s = document.createElement("div");
        ((s.className = "ck-wrapper"),
          s.appendChild(n),
          R(this, M, s),
          o(this, I).append(e),
          o(this, m).on("left_header_icon_click", () => {
            o(this, p)?.header?.leftAction?.onClick();
          }),
          o(this, m).on("right_header_icon_click", () => {
            o(this, p)?.header?.rightAction?.onClick();
          }),
          o(this, m).on("public_event", ([a, i]) => {
            if (this.capabilities.events.has(a)) {
              if (a === "error" && "error" in i) {
                let c = De(i.error);
                if (
                  (this.dispatchEvent(
                    new CustomEvent("chatkit.error", { detail: { error: c } }),
                  ),
                  c instanceof b)
                )
                  throw c;
                return;
              }
              this.dispatchEvent(
                new CustomEvent(`chatkit.${a}`, { detail: i }),
              );
            }
          }),
          o(this, m).on("unmount", () => {
            o(this, M) &&
              o(this, I).contains(o(this, M)) &&
              (o(this, I).removeChild(o(this, M)),
              R(this, M, void 0),
              R(this, O, void 0));
          }),
          o(this, m).on("capabilities_profile_change", ({ profile: a }) => {
            this.setProfile(a);
          }),
          n.addEventListener("load", o(this, X), { once: !0 }),
          _(this, C, Ae).call(this));
      }
      disconnectedCallback() {
        (o(this, O)?.removeEventListener("load", o(this, X)),
          o(this, m).disconnect());
      }
      applySanitizedOptions(e) {
        (R(this, p, e),
          o(this, W)
            ? (_(this, C, _e).call(this, o(this, p)),
              o(this, w).then(() => {
                o(this, m).commands.setOptions(Je(e));
              }))
            : _(this, C, Ae).call(this));
      }
      setOptions(e) {
        try {
          let n = this.sanitizeOptions(e);
          this.applySanitizedOptions(n);
        } catch (n) {
          _(this, C, V).call(
            this,
            n instanceof Error ? n : new b("Failed to parse options"),
          );
        }
      }
      async focusComposer() {
        (await o(this, w),
          o(this, O)?.focus(),
          await o(this, m)?.commands.focusComposer());
      }
      async fetchUpdates() {
        (await o(this, w), await o(this, m)?.commands.fetchUpdates());
      }
      async sendUserMessage(e) {
        (await o(this, w), await o(this, m)?.commands.sendUserMessage(e));
      }
      async setComposerValue(e) {
        (await o(this, w), await o(this, m)?.commands.setComposerValue(e));
      }
      async setThreadId(e) {
        (await o(this, w),
          await o(this, m)?.commands.setThreadId({ threadId: e }));
      }
      async shareThread() {
        return (await o(this, w), o(this, m)?.commands.shareThread());
      }
      async sendCustomAction(e, n) {
        return (
          await o(this, w),
          o(this, m)?.commands.sendCustomAction({ action: e, itemId: n })
        );
      }
      async showHistory() {
        return (await o(this, w), o(this, m)?.commands.showHistory());
      }
      async hideHistory() {
        return (await o(this, w), o(this, m)?.commands.hideHistory());
      }
      async setTrainingOptOut(e) {
        return (
          await o(this, w),
          o(this, m)?.commands.setTrainingOptOut({ value: e })
        );
      }
    };
  ((k = Le(it)),
    (p = new WeakMap()),
    (O = new WeakMap()),
    (M = new WeakMap()),
    (I = new WeakMap()),
    (q = new WeakMap()),
    (w = new WeakMap()),
    (m = new WeakMap()),
    (C = new WeakSet()),
    (V = function (e) {
      throw (
        this.dispatchEvent(
          new CustomEvent("chatkit.error", { detail: { error: e } }),
        ),
        e
      );
    }),
    (_e = function (e) {
      this.dataset.colorScheme =
        typeof e.theme == "string"
          ? e.theme
          : (e.theme?.colorScheme ?? "light");
    }),
    (X = new WeakMap()),
    (W = new WeakMap()),
    (Ae = function () {
      if (o(this, W) || !o(this, O) || !o(this, p)) return;
      (R(this, W, !0), _(this, C, _e).call(this, o(this, p)));
      let e = new URL(Xe);
      ((e.hash = Ne({
        options: Je(o(this, p)),
        referrer: window.location.origin,
        profile: this.profile,
      })),
        o(this, m).connect(),
        (o(this, O).src = e.toString()),
        o(this, M) && o(this, I).append(o(this, M)));
    }),
    T(k, 1, "focusComposer", at, E),
    T(k, 1, "fetchUpdates", ot, E),
    T(k, 1, "sendUserMessage", st, E),
    T(k, 1, "setComposerValue", rt, E),
    T(k, 1, "setThreadId", nt, E),
    T(k, 1, "shareThread", tt, E),
    T(k, 1, "sendCustomAction", et, E),
    T(k, 1, "showHistory", Ze, E),
    T(k, 1, "hideHistory", Qe, E),
    T(k, 1, "setTrainingOptOut", Ge, E),
    ae(k, E));
  var Oe = class extends E {
    constructor() {
      super({ profile: "chatkit" });
    }
    sanitizeOptions(t) {
      return (delete t.threadItemActions?.share, t);
    }
  };
  function ct(r = "openai-chatkit") {
    "customElements" in globalThis &&
      (customElements.get(r) || customElements.define(r, Oe));
  }
  ct();
})();
//# sourceMappingURL=chatkit.js.map
