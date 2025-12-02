var md = Object.defineProperty;
var gi = (e) => {
  throw TypeError(e);
};
var pd = (e, t, r) => t in e ? md(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Mr = (e, t, r) => pd(e, typeof t != "symbol" ? t + "" : t, r), _i = (e, t, r) => t.has(e) || gi("Cannot " + r);
var he = (e, t, r) => (_i(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Lr = (e, t, r) => t.has(e) ? gi("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Vr = (e, t, r, n) => (_i(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
import Zc, { ipcMain as qe, dialog as $d, app as mt, shell as Qc, BrowserWindow as el } from "electron";
import { createRequire as yd } from "node:module";
import { fileURLToPath as gd } from "node:url";
import C from "node:path";
import re from "fs";
import _e from "node:process";
import { promisify as be, isDeepStrictEqual as _d } from "node:util";
import ee from "node:fs";
import Fr from "node:crypto";
import vd from "node:assert";
import ns from "node:os";
import { spawn as wd } from "child_process";
import vi from "path";
import tl from "zlib";
const rr = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, Ns = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), Ed = new Set("0123456789");
function ss(e) {
  const t = [];
  let r = "", n = "start", s = !1;
  for (const o of e)
    switch (o) {
      case "\\": {
        if (n === "index")
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        s && (r += o), n = "property", s = !s;
        break;
      }
      case ".": {
        if (n === "index")
          throw new Error("Invalid character in an index");
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (s) {
          s = !1, r += o;
          break;
        }
        if (Ns.has(r))
          return [];
        t.push(r), r = "", n = "property";
        break;
      }
      case "[": {
        if (n === "index")
          throw new Error("Invalid character in an index");
        if (n === "indexEnd") {
          n = "index";
          break;
        }
        if (s) {
          s = !1, r += o;
          break;
        }
        if (n === "property") {
          if (Ns.has(r))
            return [];
          t.push(r), r = "";
        }
        n = "index";
        break;
      }
      case "]": {
        if (n === "index") {
          t.push(Number.parseInt(r, 10)), r = "", n = "indexEnd";
          break;
        }
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
      }
      default: {
        if (n === "index" && !Ed.has(o))
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        n === "start" && (n = "property"), s && (s = !1, r += "\\"), r += o;
      }
    }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (Ns.has(r))
        return [];
      t.push(r);
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      t.push("");
      break;
    }
  }
  return t;
}
function $o(e, t) {
  if (typeof t != "number" && Array.isArray(e)) {
    const r = Number.parseInt(t, 10);
    return Number.isInteger(r) && e[r] === e[t];
  }
  return !1;
}
function rl(e, t) {
  if ($o(e, t))
    throw new Error("Cannot use string index");
}
function Sd(e, t, r) {
  if (!rr(e) || typeof t != "string")
    return r === void 0 ? e : r;
  const n = ss(t);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const o = n[s];
    if ($o(e, o) ? e = s === n.length - 1 ? void 0 : null : e = e[o], e == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function wi(e, t, r) {
  if (!rr(e) || typeof t != "string")
    return e;
  const n = e, s = ss(t);
  for (let o = 0; o < s.length; o++) {
    const a = s[o];
    rl(e, a), o === s.length - 1 ? e[a] = r : rr(e[a]) || (e[a] = typeof s[o + 1] == "number" ? [] : {}), e = e[a];
  }
  return n;
}
function bd(e, t) {
  if (!rr(e) || typeof t != "string")
    return !1;
  const r = ss(t);
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (rl(e, s), n === r.length - 1)
      return delete e[s], !0;
    if (e = e[s], !rr(e))
      return !1;
  }
}
function Pd(e, t) {
  if (!rr(e) || typeof t != "string")
    return !1;
  const r = ss(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!rr(e) || !(n in e) || $o(e, n))
      return !1;
    e = e[n];
  }
  return !0;
}
const Nt = ns.homedir(), yo = ns.tmpdir(), { env: $r } = _e, Nd = (e) => {
  const t = C.join(Nt, "Library");
  return {
    data: C.join(t, "Application Support", e),
    config: C.join(t, "Preferences", e),
    cache: C.join(t, "Caches", e),
    log: C.join(t, "Logs", e),
    temp: C.join(yo, e)
  };
}, Id = (e) => {
  const t = $r.APPDATA || C.join(Nt, "AppData", "Roaming"), r = $r.LOCALAPPDATA || C.join(Nt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: C.join(r, e, "Data"),
    config: C.join(t, e, "Config"),
    cache: C.join(r, e, "Cache"),
    log: C.join(r, e, "Log"),
    temp: C.join(yo, e)
  };
}, Rd = (e) => {
  const t = C.basename(Nt);
  return {
    data: C.join($r.XDG_DATA_HOME || C.join(Nt, ".local", "share"), e),
    config: C.join($r.XDG_CONFIG_HOME || C.join(Nt, ".config"), e),
    cache: C.join($r.XDG_CACHE_HOME || C.join(Nt, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: C.join($r.XDG_STATE_HOME || C.join(Nt, ".local", "state"), e),
    temp: C.join(yo, t, e)
  };
};
function Od(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), _e.platform === "darwin" ? Nd(e) : _e.platform === "win32" ? Id(e) : Rd(e);
}
const yt = (e, t) => function(...n) {
  return e.apply(void 0, n).catch(t);
}, it = (e, t) => function(...n) {
  try {
    return e.apply(void 0, n);
  } catch (s) {
    return t(s);
  }
}, Td = _e.getuid ? !_e.getuid() : !1, jd = 1e4, Le = () => {
}, me = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!me.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !Td && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!me.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!me.isNodeError(e))
      throw e;
    if (!me.isChangeErrorOk(e))
      throw e;
  }
};
class kd {
  constructor() {
    this.interval = 25, this.intervalId = void 0, this.limit = jd, this.queueActive = /* @__PURE__ */ new Set(), this.queueWaiting = /* @__PURE__ */ new Set(), this.init = () => {
      this.intervalId || (this.intervalId = setInterval(this.tick, this.interval));
    }, this.reset = () => {
      this.intervalId && (clearInterval(this.intervalId), delete this.intervalId);
    }, this.add = (t) => {
      this.queueWaiting.add(t), this.queueActive.size < this.limit / 2 ? this.tick() : this.init();
    }, this.remove = (t) => {
      this.queueWaiting.delete(t), this.queueActive.delete(t);
    }, this.schedule = () => new Promise((t) => {
      const r = () => this.remove(n), n = () => t(r);
      this.add(n);
    }), this.tick = () => {
      if (!(this.queueActive.size >= this.limit)) {
        if (!this.queueWaiting.size)
          return this.reset();
        for (const t of this.queueWaiting) {
          if (this.queueActive.size >= this.limit)
            break;
          this.queueWaiting.delete(t), this.queueActive.add(t), t();
        }
      }
    };
  }
}
const Ad = new kd(), gt = (e, t) => function(n) {
  return function s(...o) {
    return Ad.schedule().then((a) => {
      const l = (d) => (a(), d), i = (d) => {
        if (a(), Date.now() >= n)
          throw d;
        if (t(d)) {
          const u = Math.round(100 * Math.random());
          return new Promise((E) => setTimeout(E, u)).then(() => s.apply(void 0, o));
        }
        throw d;
      };
      return e.apply(void 0, o).then(l, i);
    });
  };
}, _t = (e, t) => function(n) {
  return function s(...o) {
    try {
      return e.apply(void 0, o);
    } catch (a) {
      if (Date.now() > n)
        throw a;
      if (t(a))
        return s.apply(void 0, o);
      throw a;
    }
  };
}, Ie = {
  attempt: {
    /* ASYNC */
    chmod: yt(be(ee.chmod), me.onChangeError),
    chown: yt(be(ee.chown), me.onChangeError),
    close: yt(be(ee.close), Le),
    fsync: yt(be(ee.fsync), Le),
    mkdir: yt(be(ee.mkdir), Le),
    realpath: yt(be(ee.realpath), Le),
    stat: yt(be(ee.stat), Le),
    unlink: yt(be(ee.unlink), Le),
    /* SYNC */
    chmodSync: it(ee.chmodSync, me.onChangeError),
    chownSync: it(ee.chownSync, me.onChangeError),
    closeSync: it(ee.closeSync, Le),
    existsSync: it(ee.existsSync, Le),
    fsyncSync: it(ee.fsync, Le),
    mkdirSync: it(ee.mkdirSync, Le),
    realpathSync: it(ee.realpathSync, Le),
    statSync: it(ee.statSync, Le),
    unlinkSync: it(ee.unlinkSync, Le)
  },
  retry: {
    /* ASYNC */
    close: gt(be(ee.close), me.isRetriableError),
    fsync: gt(be(ee.fsync), me.isRetriableError),
    open: gt(be(ee.open), me.isRetriableError),
    readFile: gt(be(ee.readFile), me.isRetriableError),
    rename: gt(be(ee.rename), me.isRetriableError),
    stat: gt(be(ee.stat), me.isRetriableError),
    write: gt(be(ee.write), me.isRetriableError),
    writeFile: gt(be(ee.writeFile), me.isRetriableError),
    /* SYNC */
    closeSync: _t(ee.closeSync, me.isRetriableError),
    fsyncSync: _t(ee.fsyncSync, me.isRetriableError),
    openSync: _t(ee.openSync, me.isRetriableError),
    readFileSync: _t(ee.readFileSync, me.isRetriableError),
    renameSync: _t(ee.renameSync, me.isRetriableError),
    statSync: _t(ee.statSync, me.isRetriableError),
    writeSync: _t(ee.writeSync, me.isRetriableError),
    writeFileSync: _t(ee.writeFileSync, me.isRetriableError)
  }
}, Cd = "utf8", Ei = 438, Dd = 511, Md = {}, Ld = ns.userInfo().uid, Vd = ns.userInfo().gid, Fd = 1e3, Ud = !!_e.getuid;
_e.getuid && _e.getuid();
const Si = 128, zd = (e) => e instanceof Error && "code" in e, bi = (e) => typeof e == "string", Is = (e) => e === void 0, qd = _e.platform === "linux", nl = _e.platform === "win32", go = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
nl || go.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
qd && go.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
class Gd {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (nl && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? _e.kill(_e.pid, "SIGTERM") : _e.kill(_e.pid, t));
      }
    }, this.hook = () => {
      _e.once("exit", () => this.exit());
      for (const t of go)
        try {
          _e.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const Kd = new Gd(), Hd = Kd.register, Re = {
  /* VARIABLES */
  store: {},
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${s}`;
  },
  get: (e, t, r = !0) => {
    const n = Re.truncate(t(e));
    return n in Re.store ? Re.get(e, t, r) : (Re.store[n] = r, [n, () => delete Re.store[n]]);
  },
  purge: (e) => {
    Re.store[e] && (delete Re.store[e], Ie.attempt.unlink(e));
  },
  purgeSync: (e) => {
    Re.store[e] && (delete Re.store[e], Ie.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in Re.store)
      Re.purgeSync(e);
  },
  truncate: (e) => {
    const t = C.basename(e);
    if (t.length <= Si)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - Si;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
Hd(Re.purgeSyncAll);
function sl(e, t, r = Md) {
  if (bi(r))
    return sl(e, t, { encoding: r });
  const n = Date.now() + ((r.timeout ?? Fd) || -1);
  let s = null, o = null, a = null;
  try {
    const l = Ie.attempt.realpathSync(e), i = !!l;
    e = l || e, [o, s] = Re.get(e, r.tmpCreate || Re.create, r.tmpPurge !== !1);
    const d = Ud && Is(r.chown), u = Is(r.mode);
    if (i && (d || u)) {
      const h = Ie.attempt.statSync(e);
      h && (r = { ...r }, d && (r.chown = { uid: h.uid, gid: h.gid }), u && (r.mode = h.mode));
    }
    if (!i) {
      const h = C.dirname(e);
      Ie.attempt.mkdirSync(h, {
        mode: Dd,
        recursive: !0
      });
    }
    a = Ie.retry.openSync(n)(o, "w", r.mode || Ei), r.tmpCreated && r.tmpCreated(o), bi(t) ? Ie.retry.writeSync(n)(a, t, 0, r.encoding || Cd) : Is(t) || Ie.retry.writeSync(n)(a, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Ie.retry.fsyncSync(n)(a) : Ie.attempt.fsync(a)), Ie.retry.closeSync(n)(a), a = null, r.chown && (r.chown.uid !== Ld || r.chown.gid !== Vd) && Ie.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== Ei && Ie.attempt.chmodSync(o, r.mode);
    try {
      Ie.retry.renameSync(n)(o, e);
    } catch (h) {
      if (!zd(h) || h.code !== "ENAMETOOLONG")
        throw h;
      Ie.retry.renameSync(n)(o, Re.truncate(e));
    }
    s(), o = null;
  } finally {
    a && Ie.attempt.closeSync(a), o && Re.purge(o);
  }
}
function ol(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Xs = { exports: {} }, al = {}, xe = {}, wr = {}, cn = {}, x = {}, on = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(w) {
      if (super(), !e.IDENTIFIER.test(w))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = w;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(w) {
      super(), this._items = typeof w == "string" ? [w] : w;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const w = this._items[0];
      return w === "" || w === '""';
    }
    get str() {
      var w;
      return (w = this._str) !== null && w !== void 0 ? w : this._str = this._items.reduce((P, I) => `${P}${I}`, "");
    }
    get names() {
      var w;
      return (w = this._names) !== null && w !== void 0 ? w : this._names = this._items.reduce((P, I) => (I instanceof r && (P[I.str] = (P[I.str] || 0) + 1), P), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...w) {
    const P = [m[0]];
    let I = 0;
    for (; I < w.length; )
      l(P, w[I]), P.push(m[++I]);
    return new n(P);
  }
  e._ = s;
  const o = new n("+");
  function a(m, ...w) {
    const P = [g(m[0])];
    let I = 0;
    for (; I < w.length; )
      P.push(o), l(P, w[I]), P.push(o, g(m[++I]));
    return i(P), new n(P);
  }
  e.str = a;
  function l(m, w) {
    w instanceof n ? m.push(...w._items) : w instanceof r ? m.push(w) : m.push(h(w));
  }
  e.addCodeArg = l;
  function i(m) {
    let w = 1;
    for (; w < m.length - 1; ) {
      if (m[w] === o) {
        const P = d(m[w - 1], m[w + 1]);
        if (P !== void 0) {
          m.splice(w - 1, 3, P);
          continue;
        }
        m[w++] = "+";
      }
      w++;
    }
  }
  function d(m, w) {
    if (w === '""')
      return m;
    if (m === '""')
      return w;
    if (typeof m == "string")
      return w instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof w != "string" ? `${m.slice(0, -1)}${w}"` : w[0] === '"' ? m.slice(0, -1) + w.slice(1) : void 0;
    if (typeof w == "string" && w[0] === '"' && !(m instanceof r))
      return `"${m}${w.slice(1)}`;
  }
  function u(m, w) {
    return w.emptyStr() ? m : m.emptyStr() ? w : a`${m}${w}`;
  }
  e.strConcat = u;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : g(Array.isArray(m) ? m.join(",") : m);
  }
  function E(m) {
    return new n(g(m));
  }
  e.stringify = E;
  function g(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = g;
  function v(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = v;
  function y(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = y;
  function $(m) {
    return new n(m.toString());
  }
  e.regexpCode = $;
})(on);
var Js = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = on;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(i) {
    i[i.Started = 0] = "Started", i[i.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: u } = {}) {
      this._names = {}, this._prefixes = d, this._parent = u;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const u = this._names[d] || this._nameGroup(d);
      return `${d}${u.index++}`;
    }
    _nameGroup(d) {
      var u, h;
      if (!((h = (u = this._parent) === null || u === void 0 ? void 0 : u._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class o extends t.Name {
    constructor(d, u) {
      super(u), this.prefix = d;
    }
    setValue(d, { property: u, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(u)}[${h}]`;
    }
  }
  e.ValueScopeName = o;
  const a = (0, t._)`\n`;
  class l extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? a : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new o(d, this._newName(d));
    }
    value(d, u) {
      var h;
      if (u.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const E = this.toName(d), { prefix: g } = E, v = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let y = this._values[g];
      if (y) {
        const w = y.get(v);
        if (w)
          return w;
      } else
        y = this._values[g] = /* @__PURE__ */ new Map();
      y.set(v, E);
      const $ = this._scope[g] || (this._scope[g] = []), m = $.length;
      return $[m] = u.ref, E.setValue(u, { property: g, itemIndex: m }), E;
    }
    getValue(d, u) {
      const h = this._values[d];
      if (h)
        return h.get(u);
    }
    scopeRefs(d, u = this._values) {
      return this._reduceValues(u, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, u, h) {
      return this._reduceValues(d, (E) => {
        if (E.value === void 0)
          throw new Error(`CodeGen: name "${E}" has no value`);
        return E.value.code;
      }, u, h);
    }
    _reduceValues(d, u, h = {}, E) {
      let g = t.nil;
      for (const v in d) {
        const y = d[v];
        if (!y)
          continue;
        const $ = h[v] = h[v] || /* @__PURE__ */ new Map();
        y.forEach((m) => {
          if ($.has(m))
            return;
          $.set(m, n.Started);
          let w = u(m);
          if (w) {
            const P = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            g = (0, t._)`${g}${P} ${m} = ${w};${this.opts._n}`;
          } else if (w = E == null ? void 0 : E(m))
            g = (0, t._)`${g}${w}${this.opts._n}`;
          else
            throw new r(m);
          $.set(m, n.Completed);
        });
      }
      return g;
    }
  }
  e.ValueScope = l;
})(Js);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = on, r = Js;
  var n = on;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = Js;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class o {
    optimizeNodes() {
      return this;
    }
    optimizeNames(c, f) {
      return this;
    }
  }
  class a extends o {
    constructor(c, f, S) {
      super(), this.varKind = c, this.name = f, this.rhs = S;
    }
    render({ es5: c, _n: f }) {
      const S = c ? r.varKinds.var : this.varKind, T = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${S} ${this.name}${T};` + f;
    }
    optimizeNames(c, f) {
      if (c[this.name.str])
        return this.rhs && (this.rhs = O(this.rhs, c, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class l extends o {
    constructor(c, f, S) {
      super(), this.lhs = c, this.rhs = f, this.sideEffects = S;
    }
    render({ _n: c }) {
      return `${this.lhs} = ${this.rhs};` + c;
    }
    optimizeNames(c, f) {
      if (!(this.lhs instanceof t.Name && !c[this.lhs.str] && !this.sideEffects))
        return this.rhs = O(this.rhs, c, f), this;
    }
    get names() {
      const c = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return oe(c, this.rhs);
    }
  }
  class i extends l {
    constructor(c, f, S, T) {
      super(c, S, T), this.op = f;
    }
    render({ _n: c }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + c;
    }
  }
  class d extends o {
    constructor(c) {
      super(), this.label = c, this.names = {};
    }
    render({ _n: c }) {
      return `${this.label}:` + c;
    }
  }
  class u extends o {
    constructor(c) {
      super(), this.label = c, this.names = {};
    }
    render({ _n: c }) {
      return `break${this.label ? ` ${this.label}` : ""};` + c;
    }
  }
  class h extends o {
    constructor(c) {
      super(), this.error = c;
    }
    render({ _n: c }) {
      return `throw ${this.error};` + c;
    }
    get names() {
      return this.error.names;
    }
  }
  class E extends o {
    constructor(c) {
      super(), this.code = c;
    }
    render({ _n: c }) {
      return `${this.code};` + c;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(c, f) {
      return this.code = O(this.code, c, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class g extends o {
    constructor(c = []) {
      super(), this.nodes = c;
    }
    render(c) {
      return this.nodes.reduce((f, S) => f + S.render(c), "");
    }
    optimizeNodes() {
      const { nodes: c } = this;
      let f = c.length;
      for (; f--; ) {
        const S = c[f].optimizeNodes();
        Array.isArray(S) ? c.splice(f, 1, ...S) : S ? c[f] = S : c.splice(f, 1);
      }
      return c.length > 0 ? this : void 0;
    }
    optimizeNames(c, f) {
      const { nodes: S } = this;
      let T = S.length;
      for (; T--; ) {
        const j = S[T];
        j.optimizeNames(c, f) || (k(c, j.names), S.splice(T, 1));
      }
      return S.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((c, f) => q(c, f.names), {});
    }
  }
  class v extends g {
    render(c) {
      return "{" + c._n + super.render(c) + "}" + c._n;
    }
  }
  class y extends g {
  }
  class $ extends v {
  }
  $.kind = "else";
  class m extends v {
    constructor(c, f) {
      super(f), this.condition = c;
    }
    render(c) {
      let f = `if(${this.condition})` + super.render(c);
      return this.else && (f += "else " + this.else.render(c)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const c = this.condition;
      if (c === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const S = f.optimizeNodes();
        f = this.else = Array.isArray(S) ? new $(S) : S;
      }
      if (f)
        return c === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(U(c), f instanceof m ? [f] : f.nodes);
      if (!(c === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(c, f) {
      var S;
      if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(c, f), !!(super.optimizeNames(c, f) || this.else))
        return this.condition = O(this.condition, c, f), this;
    }
    get names() {
      const c = super.names;
      return oe(c, this.condition), this.else && q(c, this.else.names), c;
    }
  }
  m.kind = "if";
  class w extends v {
  }
  w.kind = "for";
  class P extends w {
    constructor(c) {
      super(), this.iteration = c;
    }
    render(c) {
      return `for(${this.iteration})` + super.render(c);
    }
    optimizeNames(c, f) {
      if (super.optimizeNames(c, f))
        return this.iteration = O(this.iteration, c, f), this;
    }
    get names() {
      return q(super.names, this.iteration.names);
    }
  }
  class I extends w {
    constructor(c, f, S, T) {
      super(), this.varKind = c, this.name = f, this.from = S, this.to = T;
    }
    render(c) {
      const f = c.es5 ? r.varKinds.var : this.varKind, { name: S, from: T, to: j } = this;
      return `for(${f} ${S}=${T}; ${S}<${j}; ${S}++)` + super.render(c);
    }
    get names() {
      const c = oe(super.names, this.from);
      return oe(c, this.to);
    }
  }
  class R extends w {
    constructor(c, f, S, T) {
      super(), this.loop = c, this.varKind = f, this.name = S, this.iterable = T;
    }
    render(c) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(c);
    }
    optimizeNames(c, f) {
      if (super.optimizeNames(c, f))
        return this.iterable = O(this.iterable, c, f), this;
    }
    get names() {
      return q(super.names, this.iterable.names);
    }
  }
  class F extends v {
    constructor(c, f, S) {
      super(), this.name = c, this.args = f, this.async = S;
    }
    render(c) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(c);
    }
  }
  F.kind = "func";
  class W extends g {
    render(c) {
      return "return " + super.render(c);
    }
  }
  W.kind = "return";
  class Y extends v {
    render(c) {
      let f = "try" + super.render(c);
      return this.catch && (f += this.catch.render(c)), this.finally && (f += this.finally.render(c)), f;
    }
    optimizeNodes() {
      var c, f;
      return super.optimizeNodes(), (c = this.catch) === null || c === void 0 || c.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(c, f) {
      var S, T;
      return super.optimizeNames(c, f), (S = this.catch) === null || S === void 0 || S.optimizeNames(c, f), (T = this.finally) === null || T === void 0 || T.optimizeNames(c, f), this;
    }
    get names() {
      const c = super.names;
      return this.catch && q(c, this.catch.names), this.finally && q(c, this.finally.names), c;
    }
  }
  class ce extends v {
    constructor(c) {
      super(), this.error = c;
    }
    render(c) {
      return `catch(${this.error})` + super.render(c);
    }
  }
  ce.kind = "catch";
  class ie extends v {
    render(c) {
      return "finally" + super.render(c);
    }
  }
  ie.kind = "finally";
  class D {
    constructor(c, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = c, this._scope = new r.Scope({ parent: c }), this._nodes = [new y()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(c) {
      return this._scope.name(c);
    }
    // reserves unique name in the external scope
    scopeName(c) {
      return this._extScope.name(c);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(c, f) {
      const S = this._extScope.value(c, f);
      return (this._values[S.prefix] || (this._values[S.prefix] = /* @__PURE__ */ new Set())).add(S), S;
    }
    getScopeValue(c, f) {
      return this._extScope.getValue(c, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(c) {
      return this._extScope.scopeRefs(c, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(c, f, S, T) {
      const j = this._scope.toName(f);
      return S !== void 0 && T && (this._constants[j.str] = S), this._leafNode(new a(c, j, S)), j;
    }
    // `const` declaration (`var` in es5 mode)
    const(c, f, S) {
      return this._def(r.varKinds.const, c, f, S);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(c, f, S) {
      return this._def(r.varKinds.let, c, f, S);
    }
    // `var` declaration with optional assignment
    var(c, f, S) {
      return this._def(r.varKinds.var, c, f, S);
    }
    // assignment code
    assign(c, f, S) {
      return this._leafNode(new l(c, f, S));
    }
    // `+=` code
    add(c, f) {
      return this._leafNode(new i(c, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(c) {
      return typeof c == "function" ? c() : c !== t.nil && this._leafNode(new E(c)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...c) {
      const f = ["{"];
      for (const [S, T] of c)
        f.length > 1 && f.push(","), f.push(S), (S !== T || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, T));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(c, f, S) {
      if (this._blockNode(new m(c)), f && S)
        this.code(f).else().code(S).endIf();
      else if (f)
        this.code(f).endIf();
      else if (S)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(c) {
      return this._elseNode(new m(c));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new $());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, $);
    }
    _for(c, f) {
      return this._blockNode(c), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(c, f) {
      return this._for(new P(c), f);
    }
    // `for` statement for a range of values
    forRange(c, f, S, T, j = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const G = this._scope.toName(c);
      return this._for(new I(j, G, f, S), () => T(G));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(c, f, S, T = r.varKinds.const) {
      const j = this._scope.toName(c);
      if (this.opts.es5) {
        const G = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${G}.length`, (z) => {
          this.var(j, (0, t._)`${G}[${z}]`), S(j);
        });
      }
      return this._for(new R("of", T, j, f), () => S(j));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(c, f, S, T = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(c, (0, t._)`Object.keys(${f})`, S);
      const j = this._scope.toName(c);
      return this._for(new R("in", T, j, f), () => S(j));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(w);
    }
    // `label` statement
    label(c) {
      return this._leafNode(new d(c));
    }
    // `break` statement
    break(c) {
      return this._leafNode(new u(c));
    }
    // `return` statement
    return(c) {
      const f = new W();
      if (this._blockNode(f), this.code(c), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(W);
    }
    // `try` statement
    try(c, f, S) {
      if (!f && !S)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const T = new Y();
      if (this._blockNode(T), this.code(c), f) {
        const j = this.name("e");
        this._currNode = T.catch = new ce(j), f(j);
      }
      return S && (this._currNode = T.finally = new ie(), this.code(S)), this._endBlockNode(ce, ie);
    }
    // `throw` statement
    throw(c) {
      return this._leafNode(new h(c));
    }
    // start self-balancing block
    block(c, f) {
      return this._blockStarts.push(this._nodes.length), c && this.code(c).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(c) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const S = this._nodes.length - f;
      if (S < 0 || c !== void 0 && S !== c)
        throw new Error(`CodeGen: wrong number of nodes: ${S} vs ${c} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(c, f = t.nil, S, T) {
      return this._blockNode(new F(c, f, S)), T && this.code(T).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(F);
    }
    optimize(c = 1) {
      for (; c-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(c) {
      return this._currNode.nodes.push(c), this;
    }
    _blockNode(c) {
      this._currNode.nodes.push(c), this._nodes.push(c);
    }
    _endBlockNode(c, f) {
      const S = this._currNode;
      if (S instanceof c || f && S instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${c.kind}/${f.kind}` : c.kind}"`);
    }
    _elseNode(c) {
      const f = this._currNode;
      if (!(f instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = c, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const c = this._nodes;
      return c[c.length - 1];
    }
    set _currNode(c) {
      const f = this._nodes;
      f[f.length - 1] = c;
    }
  }
  e.CodeGen = D;
  function q(_, c) {
    for (const f in c)
      _[f] = (_[f] || 0) + (c[f] || 0);
    return _;
  }
  function oe(_, c) {
    return c instanceof t._CodeOrName ? q(_, c.names) : _;
  }
  function O(_, c, f) {
    if (_ instanceof t.Name)
      return S(_);
    if (!T(_))
      return _;
    return new t._Code(_._items.reduce((j, G) => (G instanceof t.Name && (G = S(G)), G instanceof t._Code ? j.push(...G._items) : j.push(G), j), []));
    function S(j) {
      const G = f[j.str];
      return G === void 0 || c[j.str] !== 1 ? j : (delete c[j.str], G);
    }
    function T(j) {
      return j instanceof t._Code && j._items.some((G) => G instanceof t.Name && c[G.str] === 1 && f[G.str] !== void 0);
    }
  }
  function k(_, c) {
    for (const f in c)
      _[f] = (_[f] || 0) - (c[f] || 0);
  }
  function U(_) {
    return typeof _ == "boolean" || typeof _ == "number" || _ === null ? !_ : (0, t._)`!${b(_)}`;
  }
  e.not = U;
  const M = p(e.operators.AND);
  function K(..._) {
    return _.reduce(M);
  }
  e.and = K;
  const L = p(e.operators.OR);
  function N(..._) {
    return _.reduce(L);
  }
  e.or = N;
  function p(_) {
    return (c, f) => c === t.nil ? f : f === t.nil ? c : (0, t._)`${b(c)} ${_} ${b(f)}`;
  }
  function b(_) {
    return _ instanceof t.Name ? _ : (0, t._)`(${_})`;
  }
})(x);
var A = {};
Object.defineProperty(A, "__esModule", { value: !0 });
A.checkStrictMode = A.getErrorPath = A.Type = A.useFunc = A.setEvaluated = A.evaluatedPropsToName = A.mergeEvaluated = A.eachItem = A.unescapeJsonPointer = A.escapeJsonPointer = A.escapeFragment = A.unescapeFragment = A.schemaRefOrVal = A.schemaHasRulesButRef = A.schemaHasRules = A.checkUnknownRules = A.alwaysValidSchema = A.toHash = void 0;
const le = x, Bd = on;
function Wd(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
A.toHash = Wd;
function Xd(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (il(e, t), !cl(t, e.self.RULES.all));
}
A.alwaysValidSchema = Xd;
function il(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const o in t)
    s[o] || dl(e, `unknown keyword: "${o}"`);
}
A.checkUnknownRules = il;
function cl(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
A.schemaHasRules = cl;
function Jd(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
A.schemaHasRulesButRef = Jd;
function xd({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, le._)`${r}`;
  }
  return (0, le._)`${e}${t}${(0, le.getProperty)(n)}`;
}
A.schemaRefOrVal = xd;
function Yd(e) {
  return ll(decodeURIComponent(e));
}
A.unescapeFragment = Yd;
function Zd(e) {
  return encodeURIComponent(_o(e));
}
A.escapeFragment = Zd;
function _o(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
A.escapeJsonPointer = _o;
function ll(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
A.unescapeJsonPointer = ll;
function Qd(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
A.eachItem = Qd;
function Pi({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, o, a, l) => {
    const i = a === void 0 ? o : a instanceof le.Name ? (o instanceof le.Name ? e(s, o, a) : t(s, o, a), a) : o instanceof le.Name ? (t(s, a, o), o) : r(o, a);
    return l === le.Name && !(i instanceof le.Name) ? n(s, i) : i;
  };
}
A.mergeEvaluated = {
  props: Pi({
    mergeNames: (e, t, r) => e.if((0, le._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, le._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, le._)`${r} || {}`).code((0, le._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, le._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, le._)`${r} || {}`), vo(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: ul
  }),
  items: Pi({
    mergeNames: (e, t, r) => e.if((0, le._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, le._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, le._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, le._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function ul(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, le._)`{}`);
  return t !== void 0 && vo(e, r, t), r;
}
A.evaluatedPropsToName = ul;
function vo(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, le._)`${t}${(0, le.getProperty)(n)}`, !0));
}
A.setEvaluated = vo;
const Ni = {};
function ef(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Ni[t.code] || (Ni[t.code] = new Bd._Code(t.code))
  });
}
A.useFunc = ef;
var xs;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(xs || (A.Type = xs = {}));
function tf(e, t, r) {
  if (e instanceof le.Name) {
    const n = t === xs.Num;
    return r ? n ? (0, le._)`"[" + ${e} + "]"` : (0, le._)`"['" + ${e} + "']"` : n ? (0, le._)`"/" + ${e}` : (0, le._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, le.getProperty)(e).toString() : "/" + _o(e);
}
A.getErrorPath = tf;
function dl(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
A.checkStrictMode = dl;
var Fe = {};
Object.defineProperty(Fe, "__esModule", { value: !0 });
const Pe = x, rf = {
  // validation function arguments
  data: new Pe.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Pe.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Pe.Name("instancePath"),
  parentData: new Pe.Name("parentData"),
  parentDataProperty: new Pe.Name("parentDataProperty"),
  rootData: new Pe.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Pe.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Pe.Name("vErrors"),
  // null or array of validation errors
  errors: new Pe.Name("errors"),
  // counter of validation errors
  this: new Pe.Name("this"),
  // "globals"
  self: new Pe.Name("self"),
  scope: new Pe.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Pe.Name("json"),
  jsonPos: new Pe.Name("jsonPos"),
  jsonLen: new Pe.Name("jsonLen"),
  jsonPart: new Pe.Name("jsonPart")
};
Fe.default = rf;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = x, r = A, n = Fe;
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: m }) => m ? (0, t.str)`"${$}" keyword must be ${m} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, m = e.keywordError, w, P) {
    const { it: I } = $, { gen: R, compositeRule: F, allErrors: W } = I, Y = h($, m, w);
    P ?? (F || W) ? i(R, Y) : d(I, (0, t._)`[${Y}]`);
  }
  e.reportError = s;
  function o($, m = e.keywordError, w) {
    const { it: P } = $, { gen: I, compositeRule: R, allErrors: F } = P, W = h($, m, w);
    i(I, W), R || F || d(P, n.default.vErrors);
  }
  e.reportExtraError = o;
  function a($, m) {
    $.assign(n.default.errors, m), $.if((0, t._)`${n.default.vErrors} !== null`, () => $.if(m, () => $.assign((0, t._)`${n.default.vErrors}.length`, m), () => $.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function l({ gen: $, keyword: m, schemaValue: w, data: P, errsCount: I, it: R }) {
    if (I === void 0)
      throw new Error("ajv implementation error");
    const F = $.name("err");
    $.forRange("i", I, n.default.errors, (W) => {
      $.const(F, (0, t._)`${n.default.vErrors}[${W}]`), $.if((0, t._)`${F}.instancePath === undefined`, () => $.assign((0, t._)`${F}.instancePath`, (0, t.strConcat)(n.default.instancePath, R.errorPath))), $.assign((0, t._)`${F}.schemaPath`, (0, t.str)`${R.errSchemaPath}/${m}`), R.opts.verbose && ($.assign((0, t._)`${F}.schema`, w), $.assign((0, t._)`${F}.data`, P));
    });
  }
  e.extendErrors = l;
  function i($, m) {
    const w = $.const("err", m);
    $.if((0, t._)`${n.default.vErrors} === null`, () => $.assign(n.default.vErrors, (0, t._)`[${w}]`), (0, t._)`${n.default.vErrors}.push(${w})`), $.code((0, t._)`${n.default.errors}++`);
  }
  function d($, m) {
    const { gen: w, validateName: P, schemaEnv: I } = $;
    I.$async ? w.throw((0, t._)`new ${$.ValidationError}(${m})`) : (w.assign((0, t._)`${P}.errors`, m), w.return(!1));
  }
  const u = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h($, m, w) {
    const { createErrors: P } = $.it;
    return P === !1 ? (0, t._)`{}` : E($, m, w);
  }
  function E($, m, w = {}) {
    const { gen: P, it: I } = $, R = [
      g(I, w),
      v($, w)
    ];
    return y($, m, R), P.object(...R);
  }
  function g({ errorPath: $ }, { instancePath: m }) {
    const w = m ? (0, t.str)`${$}${(0, r.getErrorPath)(m, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, w)];
  }
  function v({ keyword: $, it: { errSchemaPath: m } }, { schemaPath: w, parentSchema: P }) {
    let I = P ? m : (0, t.str)`${m}/${$}`;
    return w && (I = (0, t.str)`${I}${(0, r.getErrorPath)(w, r.Type.Str)}`), [u.schemaPath, I];
  }
  function y($, { params: m, message: w }, P) {
    const { keyword: I, data: R, schemaValue: F, it: W } = $, { opts: Y, propertyName: ce, topSchemaRef: ie, schemaPath: D } = W;
    P.push([u.keyword, I], [u.params, typeof m == "function" ? m($) : m || (0, t._)`{}`]), Y.messages && P.push([u.message, typeof w == "function" ? w($) : w]), Y.verbose && P.push([u.schema, F], [u.parentSchema, (0, t._)`${ie}${D}`], [n.default.data, R]), ce && P.push([u.propertyName, ce]);
  }
})(cn);
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.boolOrEmptySchema = wr.topBoolOrEmptySchema = void 0;
const nf = cn, sf = x, of = Fe, af = {
  message: "boolean schema is false"
};
function cf(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? fl(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(of.default.data) : (t.assign((0, sf._)`${n}.errors`, null), t.return(!0));
}
wr.topBoolOrEmptySchema = cf;
function lf(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), fl(e)) : r.var(t, !0);
}
wr.boolOrEmptySchema = lf;
function fl(e, t) {
  const { gen: r, data: n } = e, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, nf.reportError)(s, af, void 0, t);
}
var ye = {}, nr = {};
Object.defineProperty(nr, "__esModule", { value: !0 });
nr.getRules = nr.isJSONType = void 0;
const uf = ["string", "number", "integer", "boolean", "null", "object", "array"], df = new Set(uf);
function ff(e) {
  return typeof e == "string" && df.has(e);
}
nr.isJSONType = ff;
function hf() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
nr.getRules = hf;
var ut = {};
Object.defineProperty(ut, "__esModule", { value: !0 });
ut.shouldUseRule = ut.shouldUseGroup = ut.schemaHasRulesForType = void 0;
function mf({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && hl(e, n);
}
ut.schemaHasRulesForType = mf;
function hl(e, t) {
  return t.rules.some((r) => ml(e, r));
}
ut.shouldUseGroup = hl;
function ml(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
ut.shouldUseRule = ml;
Object.defineProperty(ye, "__esModule", { value: !0 });
ye.reportTypeError = ye.checkDataTypes = ye.checkDataType = ye.coerceAndCheckDataType = ye.getJSONTypes = ye.getSchemaTypes = ye.DataType = void 0;
const pf = nr, $f = ut, yf = cn, Z = x, pl = A;
var yr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(yr || (ye.DataType = yr = {}));
function gf(e) {
  const t = $l(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
ye.getSchemaTypes = gf;
function $l(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(pf.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ye.getJSONTypes = $l;
function _f(e, t) {
  const { gen: r, data: n, opts: s } = e, o = vf(t, s.coerceTypes), a = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, $f.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const l = wo(t, n, s.strictNumbers, yr.Wrong);
    r.if(l, () => {
      o.length ? wf(e, t, o) : Eo(e);
    });
  }
  return a;
}
ye.coerceAndCheckDataType = _f;
const yl = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function vf(e, t) {
  return t ? e.filter((r) => yl.has(r) || t === "array" && r === "array") : [];
}
function wf(e, t, r) {
  const { gen: n, data: s, opts: o } = e, a = n.let("dataType", (0, Z._)`typeof ${s}`), l = n.let("coerced", (0, Z._)`undefined`);
  o.coerceTypes === "array" && n.if((0, Z._)`${a} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, Z._)`${s}[0]`).assign(a, (0, Z._)`typeof ${s}`).if(wo(t, s, o.strictNumbers), () => n.assign(l, s))), n.if((0, Z._)`${l} !== undefined`);
  for (const d of r)
    (yl.has(d) || d === "array" && o.coerceTypes === "array") && i(d);
  n.else(), Eo(e), n.endIf(), n.if((0, Z._)`${l} !== undefined`, () => {
    n.assign(s, l), Ef(e, l);
  });
  function i(d) {
    switch (d) {
      case "string":
        n.elseIf((0, Z._)`${a} == "number" || ${a} == "boolean"`).assign(l, (0, Z._)`"" + ${s}`).elseIf((0, Z._)`${s} === null`).assign(l, (0, Z._)`""`);
        return;
      case "number":
        n.elseIf((0, Z._)`${a} == "boolean" || ${s} === null
              || (${a} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, Z._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, Z._)`${a} === "boolean" || ${s} === null
              || (${a} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, Z._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, Z._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, Z._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, Z._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, Z._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${s} === null`).assign(l, (0, Z._)`[${s}]`);
    }
  }
}
function Ef({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, Z._)`${t} !== undefined`, () => e.assign((0, Z._)`${t}[${r}]`, n));
}
function Ys(e, t, r, n = yr.Correct) {
  const s = n === yr.Correct ? Z.operators.EQ : Z.operators.NEQ;
  let o;
  switch (e) {
    case "null":
      return (0, Z._)`${t} ${s} null`;
    case "array":
      o = (0, Z._)`Array.isArray(${t})`;
      break;
    case "object":
      o = (0, Z._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      o = a((0, Z._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      o = a();
      break;
    default:
      return (0, Z._)`typeof ${t} ${s} ${e}`;
  }
  return n === yr.Correct ? o : (0, Z.not)(o);
  function a(l = Z.nil) {
    return (0, Z.and)((0, Z._)`typeof ${t} == "number"`, l, r ? (0, Z._)`isFinite(${t})` : Z.nil);
  }
}
ye.checkDataType = Ys;
function wo(e, t, r, n) {
  if (e.length === 1)
    return Ys(e[0], t, r, n);
  let s;
  const o = (0, pl.toHash)(e);
  if (o.array && o.object) {
    const a = (0, Z._)`typeof ${t} != "object"`;
    s = o.null ? a : (0, Z._)`!${t} || ${a}`, delete o.null, delete o.array, delete o.object;
  } else
    s = Z.nil;
  o.number && delete o.integer;
  for (const a in o)
    s = (0, Z.and)(s, Ys(a, t, r, n));
  return s;
}
ye.checkDataTypes = wo;
const Sf = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, Z._)`{type: ${e}}` : (0, Z._)`{type: ${t}}`
};
function Eo(e) {
  const t = bf(e);
  (0, yf.reportError)(t, Sf);
}
ye.reportTypeError = Eo;
function bf(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, pl.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: e
  };
}
var os = {};
Object.defineProperty(os, "__esModule", { value: !0 });
os.assignDefaults = void 0;
const ir = x, Pf = A;
function Nf(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Ii(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, o) => Ii(e, o, s.default));
}
os.assignDefaults = Nf;
function Ii(e, t, r) {
  const { gen: n, compositeRule: s, data: o, opts: a } = e;
  if (r === void 0)
    return;
  const l = (0, ir._)`${o}${(0, ir.getProperty)(t)}`;
  if (s) {
    (0, Pf.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let i = (0, ir._)`${l} === undefined`;
  a.useDefaults === "empty" && (i = (0, ir._)`${i} || ${l} === null || ${l} === ""`), n.if(i, (0, ir._)`${l} = ${(0, ir.stringify)(r)}`);
}
var nt = {}, ne = {};
Object.defineProperty(ne, "__esModule", { value: !0 });
ne.validateUnion = ne.validateArray = ne.usePattern = ne.callValidateCode = ne.schemaProperties = ne.allSchemaProperties = ne.noPropertyInData = ne.propertyInData = ne.isOwnProperty = ne.hasPropFunc = ne.reportMissingProp = ne.checkMissingProp = ne.checkReportMissingProp = void 0;
const de = x, So = A, vt = Fe, If = A;
function Rf(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Po(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, de._)`${t}` }, !0), e.error();
  });
}
ne.checkReportMissingProp = Rf;
function Of({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, de.or)(...n.map((o) => (0, de.and)(Po(e, t, o, r.ownProperties), (0, de._)`${s} = ${o}`)));
}
ne.checkMissingProp = Of;
function Tf(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ne.reportMissingProp = Tf;
function gl(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, de._)`Object.prototype.hasOwnProperty`
  });
}
ne.hasPropFunc = gl;
function bo(e, t, r) {
  return (0, de._)`${gl(e)}.call(${t}, ${r})`;
}
ne.isOwnProperty = bo;
function jf(e, t, r, n) {
  const s = (0, de._)`${t}${(0, de.getProperty)(r)} !== undefined`;
  return n ? (0, de._)`${s} && ${bo(e, t, r)}` : s;
}
ne.propertyInData = jf;
function Po(e, t, r, n) {
  const s = (0, de._)`${t}${(0, de.getProperty)(r)} === undefined`;
  return n ? (0, de.or)(s, (0, de.not)(bo(e, t, r))) : s;
}
ne.noPropertyInData = Po;
function _l(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ne.allSchemaProperties = _l;
function kf(e, t) {
  return _l(t).filter((r) => !(0, So.alwaysValidSchema)(e, t[r]));
}
ne.schemaProperties = kf;
function Af({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: o }, it: a }, l, i, d) {
  const u = d ? (0, de._)`${e}, ${t}, ${n}${s}` : t, h = [
    [vt.default.instancePath, (0, de.strConcat)(vt.default.instancePath, o)],
    [vt.default.parentData, a.parentData],
    [vt.default.parentDataProperty, a.parentDataProperty],
    [vt.default.rootData, vt.default.rootData]
  ];
  a.opts.dynamicRef && h.push([vt.default.dynamicAnchors, vt.default.dynamicAnchors]);
  const E = (0, de._)`${u}, ${r.object(...h)}`;
  return i !== de.nil ? (0, de._)`${l}.call(${i}, ${E})` : (0, de._)`${l}(${E})`;
}
ne.callValidateCode = Af;
const Cf = (0, de._)`new RegExp`;
function Df({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, o = s(r, n);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, de._)`${s.code === "new RegExp" ? Cf : (0, If.useFunc)(e, s)}(${r}, ${n})`
  });
}
ne.usePattern = Df;
function Mf(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, o = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return a(() => t.assign(l, !1)), l;
  }
  return t.var(o, !0), a(() => t.break()), o;
  function a(l) {
    const i = t.const("len", (0, de._)`${r}.length`);
    t.forRange("i", 0, i, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: So.Type.Num
      }, o), t.if((0, de.not)(o), l);
    });
  }
}
ne.validateArray = Mf;
function Lf(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((i) => (0, So.alwaysValidSchema)(s, i)) && !s.opts.unevaluated)
    return;
  const a = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((i, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(a, (0, de._)`${a} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, de.not)(a));
  })), e.result(a, () => e.reset(), () => e.error(!0));
}
ne.validateUnion = Lf;
Object.defineProperty(nt, "__esModule", { value: !0 });
nt.validateKeywordUsage = nt.validSchemaType = nt.funcKeywordCode = nt.macroKeywordCode = void 0;
const Oe = x, Xt = Fe, Vf = ne, Ff = cn;
function Uf(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: o, it: a } = e, l = t.macro.call(a.self, s, o, a), i = vl(r, n, l);
  a.opts.validateSchema !== !1 && a.self.validateSchema(l, !0);
  const d = r.name("valid");
  e.subschema({
    schema: l,
    schemaPath: Oe.nil,
    errSchemaPath: `${a.errSchemaPath}/${n}`,
    topSchemaRef: i,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
nt.macroKeywordCode = Uf;
function zf(e, t) {
  var r;
  const { gen: n, keyword: s, schema: o, parentSchema: a, $data: l, it: i } = e;
  Gf(i, t);
  const d = !l && t.compile ? t.compile.call(i.self, o, a, i) : t.validate, u = vl(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      y(), t.modifying && Ri(e), $(() => e.error());
    else {
      const m = t.async ? g() : v();
      t.modifying && Ri(e), $(() => qf(e, m));
    }
  }
  function g() {
    const m = n.let("ruleErrs", null);
    return n.try(() => y((0, Oe._)`await `), (w) => n.assign(h, !1).if((0, Oe._)`${w} instanceof ${i.ValidationError}`, () => n.assign(m, (0, Oe._)`${w}.errors`), () => n.throw(w))), m;
  }
  function v() {
    const m = (0, Oe._)`${u}.errors`;
    return n.assign(m, null), y(Oe.nil), m;
  }
  function y(m = t.async ? (0, Oe._)`await ` : Oe.nil) {
    const w = i.opts.passContext ? Xt.default.this : Xt.default.self, P = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, Oe._)`${m}${(0, Vf.callValidateCode)(e, u, w, P)}`, t.modifying);
  }
  function $(m) {
    var w;
    n.if((0, Oe.not)((w = t.valid) !== null && w !== void 0 ? w : h), m);
  }
}
nt.funcKeywordCode = zf;
function Ri(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Oe._)`${n.parentData}[${n.parentDataProperty}]`));
}
function qf(e, t) {
  const { gen: r } = e;
  r.if((0, Oe._)`Array.isArray(${t})`, () => {
    r.assign(Xt.default.vErrors, (0, Oe._)`${Xt.default.vErrors} === null ? ${t} : ${Xt.default.vErrors}.concat(${t})`).assign(Xt.default.errors, (0, Oe._)`${Xt.default.vErrors}.length`), (0, Ff.extendErrors)(e);
  }, () => e.error());
}
function Gf({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function vl(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Oe.stringify)(r) });
}
function Kf(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
nt.validSchemaType = Kf;
function Hf({ schema: e, opts: t, self: r, errSchemaPath: n }, s, o) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(o) : s.keyword !== o)
    throw new Error("ajv implementation error");
  const a = s.dependencies;
  if (a != null && a.some((l) => !Object.prototype.hasOwnProperty.call(e, l)))
    throw new Error(`parent schema must have dependencies of ${o}: ${a.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[o])) {
    const i = `keyword "${o}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(i);
    else
      throw new Error(i);
  }
}
nt.validateKeywordUsage = Hf;
var Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
Tt.extendSubschemaMode = Tt.extendSubschemaData = Tt.getSubschema = void 0;
const tt = x, wl = A;
function Bf(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: o, topSchemaRef: a }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const l = e.schema[t];
    return r === void 0 ? {
      schema: l,
      schemaPath: (0, tt._)`${e.schemaPath}${(0, tt.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: l[r],
      schemaPath: (0, tt._)`${e.schemaPath}${(0, tt.getProperty)(t)}${(0, tt.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, wl.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || o === void 0 || a === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: a,
      errSchemaPath: o
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Tt.getSubschema = Bf;
function Wf(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: o, propertyName: a }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, E = l.let("data", (0, tt._)`${t.data}${(0, tt.getProperty)(r)}`, !0);
    i(E), e.errorPath = (0, tt.str)`${d}${(0, wl.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, tt._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof tt.Name ? s : l.let("data", s, !0);
    i(d), a !== void 0 && (e.propertyName = a);
  }
  o && (e.dataTypes = o);
  function i(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Tt.extendSubschemaData = Wf;
function Xf(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: o }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Tt.extendSubschemaMode = Xf;
var Ee = {}, as = function e(t, r) {
  if (t === r) return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor) return !1;
    var n, s, o;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length) return !1;
      for (s = n; s-- !== 0; )
        if (!e(t[s], r[s])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
    if (o = Object.keys(t), n = o.length, n !== Object.keys(r).length) return !1;
    for (s = n; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, o[s])) return !1;
    for (s = n; s-- !== 0; ) {
      var a = o[s];
      if (!e(t[a], r[a])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, El = { exports: {} }, Rt = El.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  An(t, n, s, e, "", e);
};
Rt.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
Rt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Rt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Rt.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function An(e, t, r, n, s, o, a, l, i, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, o, a, l, i, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in Rt.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            An(e, t, r, h[E], s + "/" + u + "/" + E, o, s, u, n, E);
      } else if (u in Rt.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            An(e, t, r, h[g], s + "/" + u + "/" + Jf(g), o, s, u, n, g);
      } else (u in Rt.keywords || e.allKeys && !(u in Rt.skipKeywords)) && An(e, t, r, h, s + "/" + u, o, s, u, n);
    }
    r(n, s, o, a, l, i, d);
  }
}
function Jf(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var xf = El.exports;
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.getSchemaRefs = Ee.resolveUrl = Ee.normalizeId = Ee._getFullPath = Ee.getFullPath = Ee.inlineRef = void 0;
const Yf = A, Zf = as, Qf = xf, eh = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function th(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Zs(e) : t ? Sl(e) <= t : !1;
}
Ee.inlineRef = th;
const rh = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Zs(e) {
  for (const t in e) {
    if (rh.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Zs) || typeof r == "object" && Zs(r))
      return !0;
  }
  return !1;
}
function Sl(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !eh.has(r) && (typeof e[r] == "object" && (0, Yf.eachItem)(e[r], (n) => t += Sl(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function bl(e, t = "", r) {
  r !== !1 && (t = gr(t));
  const n = e.parse(t);
  return Pl(e, n);
}
Ee.getFullPath = bl;
function Pl(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ee._getFullPath = Pl;
const nh = /#\/?$/;
function gr(e) {
  return e ? e.replace(nh, "") : "";
}
Ee.normalizeId = gr;
function sh(e, t, r) {
  return r = gr(r), e.resolve(t, r);
}
Ee.resolveUrl = sh;
const oh = /^[a-z_][-a-z0-9._]*$/i;
function ah(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = gr(e[r] || t), o = { "": s }, a = bl(n, s, !1), l = {}, i = /* @__PURE__ */ new Set();
  return Qf(e, { allKeys: !0 }, (h, E, g, v) => {
    if (v === void 0)
      return;
    const y = a + E;
    let $ = o[v];
    typeof h[r] == "string" && ($ = m.call(this, h[r])), w.call(this, h.$anchor), w.call(this, h.$dynamicAnchor), o[E] = $;
    function m(P) {
      const I = this.opts.uriResolver.resolve;
      if (P = gr($ ? I($, P) : P), i.has(P))
        throw u(P);
      i.add(P);
      let R = this.refs[P];
      return typeof R == "string" && (R = this.refs[R]), typeof R == "object" ? d(h, R.schema, P) : P !== gr(y) && (P[0] === "#" ? (d(h, l[P], P), l[P] = h) : this.refs[P] = y), P;
    }
    function w(P) {
      if (typeof P == "string") {
        if (!oh.test(P))
          throw new Error(`invalid anchor "${P}"`);
        m.call(this, `#${P}`);
      }
    }
  }), l;
  function d(h, E, g) {
    if (E !== void 0 && !Zf(h, E))
      throw u(g);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ee.getSchemaRefs = ah;
Object.defineProperty(xe, "__esModule", { value: !0 });
xe.getData = xe.KeywordCxt = xe.validateFunctionCode = void 0;
const Nl = wr, Oi = ye, No = ut, Hn = ye, ih = os, Xr = nt, Rs = Tt, H = x, X = Fe, ch = Ee, dt = A, Ur = cn;
function lh(e) {
  if (Ol(e) && (Tl(e), Rl(e))) {
    fh(e);
    return;
  }
  Il(e, () => (0, Nl.topBoolOrEmptySchema)(e));
}
xe.validateFunctionCode = lh;
function Il({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, o) {
  s.code.es5 ? e.func(t, (0, H._)`${X.default.data}, ${X.default.valCxt}`, n.$async, () => {
    e.code((0, H._)`"use strict"; ${Ti(r, s)}`), dh(e, s), e.code(o);
  }) : e.func(t, (0, H._)`${X.default.data}, ${uh(s)}`, n.$async, () => e.code(Ti(r, s)).code(o));
}
function uh(e) {
  return (0, H._)`{${X.default.instancePath}="", ${X.default.parentData}, ${X.default.parentDataProperty}, ${X.default.rootData}=${X.default.data}${e.dynamicRef ? (0, H._)`, ${X.default.dynamicAnchors}={}` : H.nil}}={}`;
}
function dh(e, t) {
  e.if(X.default.valCxt, () => {
    e.var(X.default.instancePath, (0, H._)`${X.default.valCxt}.${X.default.instancePath}`), e.var(X.default.parentData, (0, H._)`${X.default.valCxt}.${X.default.parentData}`), e.var(X.default.parentDataProperty, (0, H._)`${X.default.valCxt}.${X.default.parentDataProperty}`), e.var(X.default.rootData, (0, H._)`${X.default.valCxt}.${X.default.rootData}`), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, H._)`${X.default.valCxt}.${X.default.dynamicAnchors}`);
  }, () => {
    e.var(X.default.instancePath, (0, H._)`""`), e.var(X.default.parentData, (0, H._)`undefined`), e.var(X.default.parentDataProperty, (0, H._)`undefined`), e.var(X.default.rootData, X.default.data), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, H._)`{}`);
  });
}
function fh(e) {
  const { schema: t, opts: r, gen: n } = e;
  Il(e, () => {
    r.$comment && t.$comment && kl(e), yh(e), n.let(X.default.vErrors, null), n.let(X.default.errors, 0), r.unevaluated && hh(e), jl(e), vh(e);
  });
}
function hh(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, H._)`${r}.evaluated`), t.if((0, H._)`${e.evaluated}.dynamicProps`, () => t.assign((0, H._)`${e.evaluated}.props`, (0, H._)`undefined`)), t.if((0, H._)`${e.evaluated}.dynamicItems`, () => t.assign((0, H._)`${e.evaluated}.items`, (0, H._)`undefined`));
}
function Ti(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, H._)`/*# sourceURL=${r} */` : H.nil;
}
function mh(e, t) {
  if (Ol(e) && (Tl(e), Rl(e))) {
    ph(e, t);
    return;
  }
  (0, Nl.boolOrEmptySchema)(e, t);
}
function Rl({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Ol(e) {
  return typeof e.schema != "boolean";
}
function ph(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && kl(e), gh(e), _h(e);
  const o = n.const("_errs", X.default.errors);
  jl(e, o), n.var(t, (0, H._)`${o} === ${X.default.errors}`);
}
function Tl(e) {
  (0, dt.checkUnknownRules)(e), $h(e);
}
function jl(e, t) {
  if (e.opts.jtd)
    return ji(e, [], !1, t);
  const r = (0, Oi.getSchemaTypes)(e.schema), n = (0, Oi.coerceAndCheckDataType)(e, r);
  ji(e, r, !n, t);
}
function $h(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, dt.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function yh(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, dt.checkStrictMode)(e, "default is ignored in the schema root");
}
function gh(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, ch.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function _h(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function kl({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const o = r.$comment;
  if (s.$comment === !0)
    e.code((0, H._)`${X.default.self}.logger.log(${o})`);
  else if (typeof s.$comment == "function") {
    const a = (0, H.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, H._)`${X.default.self}.opts.$comment(${o}, ${a}, ${l}.schema)`);
  }
}
function vh(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: o } = e;
  r.$async ? t.if((0, H._)`${X.default.errors} === 0`, () => t.return(X.default.data), () => t.throw((0, H._)`new ${s}(${X.default.vErrors})`)) : (t.assign((0, H._)`${n}.errors`, X.default.vErrors), o.unevaluated && wh(e), t.return((0, H._)`${X.default.errors} === 0`));
}
function wh({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof H.Name && e.assign((0, H._)`${t}.props`, r), n instanceof H.Name && e.assign((0, H._)`${t}.items`, n);
}
function ji(e, t, r, n) {
  const { gen: s, schema: o, data: a, allErrors: l, opts: i, self: d } = e, { RULES: u } = d;
  if (o.$ref && (i.ignoreKeywordsWithRef || !(0, dt.schemaHasRulesButRef)(o, u))) {
    s.block(() => Dl(e, "$ref", u.all.$ref.definition));
    return;
  }
  i.jtd || Eh(e, t), s.block(() => {
    for (const E of u.rules)
      h(E);
    h(u.post);
  });
  function h(E) {
    (0, No.shouldUseGroup)(o, E) && (E.type ? (s.if((0, Hn.checkDataType)(E.type, a, i.strictNumbers)), ki(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, Hn.reportTypeError)(e)), s.endIf()) : ki(e, E), l || s.if((0, H._)`${X.default.errors} === ${n || 0}`));
  }
}
function ki(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, ih.assignDefaults)(e, t.type), r.block(() => {
    for (const o of t.rules)
      (0, No.shouldUseRule)(n, o) && Dl(e, o.keyword, o.definition, t.type);
  });
}
function Eh(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (Sh(e, t), e.opts.allowUnionTypes || bh(e, t), Ph(e, e.dataTypes));
}
function Sh(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Al(e.dataTypes, r) || Io(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), Ih(e, t);
  }
}
function bh(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Io(e, "use allowUnionTypes to allow union type keyword");
}
function Ph(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, No.shouldUseRule)(e.schema, s)) {
      const { type: o } = s.definition;
      o.length && !o.some((a) => Nh(t, a)) && Io(e, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function Nh(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Al(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function Ih(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Al(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Io(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, dt.checkStrictMode)(e, t, e.opts.strictTypes);
}
let Cl = class {
  constructor(t, r, n) {
    if ((0, Xr.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, dt.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Ml(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Xr.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", X.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, H.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, H.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, H._)`${r} !== undefined && (${(0, H.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Ur.reportExtraError : Ur.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Ur.reportError)(this, this.def.$dataError || Ur.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Ur.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = H.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = H.nil, r = H.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: o, def: a } = this;
    n.if((0, H.or)((0, H._)`${s} === undefined`, r)), t !== H.nil && n.assign(t, !0), (o.length || a.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== H.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: o } = this;
    return (0, H.or)(a(), l());
    function a() {
      if (n.length) {
        if (!(r instanceof H.Name))
          throw new Error("ajv implementation error");
        const i = Array.isArray(n) ? n : [n];
        return (0, H._)`${(0, Hn.checkDataTypes)(i, r, o.opts.strictNumbers, Hn.DataType.Wrong)}`;
      }
      return H.nil;
    }
    function l() {
      if (s.validateSchema) {
        const i = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, H._)`!${i}(${r})`;
      }
      return H.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Rs.getSubschema)(this.it, t);
    (0, Rs.extendSubschemaData)(n, this.it, t), (0, Rs.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return mh(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = dt.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = dt.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, H.Name)), !0;
  }
};
xe.KeywordCxt = Cl;
function Dl(e, t, r, n) {
  const s = new Cl(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Xr.funcKeywordCode)(s, r) : "macro" in r ? (0, Xr.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Xr.funcKeywordCode)(s, r);
}
const Rh = /^\/(?:[^~]|~0|~1)*$/, Oh = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Ml(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, o;
  if (e === "")
    return X.default.rootData;
  if (e[0] === "/") {
    if (!Rh.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, o = X.default.rootData;
  } else {
    const d = Oh.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const u = +d[1];
    if (s = d[2], s === "#") {
      if (u >= t)
        throw new Error(i("property/index", u));
      return n[t - u];
    }
    if (u > t)
      throw new Error(i("data", u));
    if (o = r[t - u], !s)
      return o;
  }
  let a = o;
  const l = s.split("/");
  for (const d of l)
    d && (o = (0, H._)`${o}${(0, H.getProperty)((0, dt.unescapeJsonPointer)(d))}`, a = (0, H._)`${a} && ${o}`);
  return a;
  function i(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
xe.getData = Ml;
var ln = {};
Object.defineProperty(ln, "__esModule", { value: !0 });
let Th = class extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
};
ln.default = Th;
var Pr = {};
Object.defineProperty(Pr, "__esModule", { value: !0 });
const Os = Ee;
let jh = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Os.resolveUrl)(t, r, n), this.missingSchema = (0, Os.normalizeId)((0, Os.getFullPath)(t, this.missingRef));
  }
};
Pr.default = jh;
var je = {};
Object.defineProperty(je, "__esModule", { value: !0 });
je.resolveSchema = je.getCompilingSchema = je.resolveRef = je.compileSchema = je.SchemaEnv = void 0;
const Ke = x, kh = ln, Bt = Fe, Xe = Ee, Ai = A, Ah = xe;
let is = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Xe.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
je.SchemaEnv = is;
function Ro(e) {
  const t = Ll.call(this, e);
  if (t)
    return t;
  const r = (0, Xe.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: o } = this.opts, a = new Ke.CodeGen(this.scope, { es5: n, lines: s, ownProperties: o });
  let l;
  e.$async && (l = a.scopeValue("Error", {
    ref: kh.default,
    code: (0, Ke._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const i = a.scopeName("validate");
  e.validateName = i;
  const d = {
    gen: a,
    allErrors: this.opts.allErrors,
    data: Bt.default.data,
    parentData: Bt.default.parentData,
    parentDataProperty: Bt.default.parentDataProperty,
    dataNames: [Bt.default.data],
    dataPathArr: [Ke.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: a.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Ke.stringify)(e.schema) } : { ref: e.schema }),
    validateName: i,
    ValidationError: l,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Ke.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Ke._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, Ah.validateFunctionCode)(d), a.optimize(this.opts.code.optimize);
    const h = a.toString();
    u = `${a.scopeRefs(Bt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const g = new Function(`${Bt.default.self}`, `${Bt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(i, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: i, validateCode: h, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: v, items: y } = d;
      g.evaluated = {
        props: v instanceof Ke.Name ? void 0 : v,
        items: y instanceof Ke.Name ? void 0 : y,
        dynamicProps: v instanceof Ke.Name,
        dynamicItems: y instanceof Ke.Name
      }, g.source && (g.source.evaluated = (0, Ke.stringify)(g.evaluated));
    }
    return e.validate = g, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
je.compileSchema = Ro;
function Ch(e, t, r) {
  var n;
  r = (0, Xe.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let o = Lh.call(this, e, r);
  if (o === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    a && (o = new is({ schema: a, schemaId: l, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[r] = Dh.call(this, o);
}
je.resolveRef = Ch;
function Dh(e) {
  return (0, Xe.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Ro.call(this, e);
}
function Ll(e) {
  for (const t of this._compilations)
    if (Mh(t, e))
      return t;
}
je.getCompilingSchema = Ll;
function Mh(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Lh(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || cs.call(this, e, t);
}
function cs(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Xe._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Xe.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Ts.call(this, r, e);
  const o = (0, Xe.normalizeId)(n), a = this.refs[o] || this.schemas[o];
  if (typeof a == "string") {
    const l = cs.call(this, e, a);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : Ts.call(this, r, l);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || Ro.call(this, a), o === (0, Xe.normalizeId)(t)) {
      const { schema: l } = a, { schemaId: i } = this.opts, d = l[i];
      return d && (s = (0, Xe.resolveUrl)(this.opts.uriResolver, s, d)), new is({ schema: l, schemaId: i, root: e, baseId: s });
    }
    return Ts.call(this, r, a);
  }
}
je.resolveSchema = cs;
const Vh = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Ts(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const i = r[(0, Ai.unescapeFragment)(l)];
    if (i === void 0)
      return;
    r = i;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !Vh.has(l) && d && (t = (0, Xe.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let o;
  if (typeof r != "boolean" && r.$ref && !(0, Ai.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, Xe.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    o = cs.call(this, n, l);
  }
  const { schemaId: a } = this.opts;
  if (o = o || new is({ schema: r, schemaId: a, root: n, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const Fh = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Uh = "Meta-schema for $data reference (JSON AnySchema extension proposal)", zh = "object", qh = [
  "$data"
], Gh = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, Kh = !1, Hh = {
  $id: Fh,
  description: Uh,
  type: zh,
  required: qh,
  properties: Gh,
  additionalProperties: Kh
};
var Oo = {}, ls = { exports: {} };
const Bh = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  A: 10,
  b: 11,
  B: 11,
  c: 12,
  C: 12,
  d: 13,
  D: 13,
  e: 14,
  E: 14,
  f: 15,
  F: 15
};
var Wh = {
  HEX: Bh
};
const { HEX: Xh } = Wh, Jh = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
function Vl(e) {
  if (Ul(e, ".") < 3)
    return { host: e, isIPV4: !1 };
  const t = e.match(Jh) || [], [r] = t;
  return r ? { host: Yh(r, "."), isIPV4: !0 } : { host: e, isIPV4: !1 };
}
function Ci(e, t = !1) {
  let r = "", n = !0;
  for (const s of e) {
    if (Xh[s] === void 0) return;
    s !== "0" && n === !0 && (n = !1), n || (r += s);
  }
  return t && r.length === 0 && (r = "0"), r;
}
function xh(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let o = !1, a = !1, l = !1;
  function i() {
    if (s.length) {
      if (o === !1) {
        const d = Ci(s);
        if (d !== void 0)
          n.push(d);
        else
          return r.error = !0, !1;
      }
      s.length = 0;
    }
    return !0;
  }
  for (let d = 0; d < e.length; d++) {
    const u = e[d];
    if (!(u === "[" || u === "]"))
      if (u === ":") {
        if (a === !0 && (l = !0), !i())
          break;
        if (t++, n.push(":"), t > 7) {
          r.error = !0;
          break;
        }
        d - 1 >= 0 && e[d - 1] === ":" && (a = !0);
        continue;
      } else if (u === "%") {
        if (!i())
          break;
        o = !0;
      } else {
        s.push(u);
        continue;
      }
  }
  return s.length && (o ? r.zone = s.join("") : l ? n.push(s.join("")) : n.push(Ci(s))), r.address = n.join(""), r;
}
function Fl(e) {
  if (Ul(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = xh(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, escapedHost: n, isIPV6: !0 };
  }
}
function Yh(e, t) {
  let r = "", n = !0;
  const s = e.length;
  for (let o = 0; o < s; o++) {
    const a = e[o];
    a === "0" && n ? (o + 1 <= s && e[o + 1] === t || o + 1 === s) && (r += a, n = !1) : (a === t ? n = !0 : n = !1, r += a);
  }
  return r;
}
function Ul(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
const Di = /^\.\.?\//u, Mi = /^\/\.(?:\/|$)/u, Li = /^\/\.\.(?:\/|$)/u, Zh = /^\/?(?:.|\n)*?(?=\/|$)/u;
function Qh(e) {
  const t = [];
  for (; e.length; )
    if (e.match(Di))
      e = e.replace(Di, "");
    else if (e.match(Mi))
      e = e.replace(Mi, "/");
    else if (e.match(Li))
      e = e.replace(Li, "/"), t.pop();
    else if (e === "." || e === "..")
      e = "";
    else {
      const r = e.match(Zh);
      if (r) {
        const n = r[0];
        e = e.slice(n.length), t.push(n);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return t.join("");
}
function em(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function tm(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    const n = Vl(r);
    if (n.isIPV4)
      r = n.host;
    else {
      const s = Fl(n.host);
      s.isIPV6 === !0 ? r = `[${s.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var rm = {
  recomposeAuthority: tm,
  normalizeComponentEncoding: em,
  removeDotSegments: Qh,
  normalizeIPv4: Vl,
  normalizeIPv6: Fl
};
const nm = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, sm = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function zl(e) {
  return typeof e.secure == "boolean" ? e.secure : String(e.scheme).toLowerCase() === "wss";
}
function ql(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function Gl(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function om(e) {
  return e.secure = zl(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function am(e) {
  if ((e.port === (zl(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function im(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(sm);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, o = To[s];
    e.path = void 0, o && (e = o.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function cm(e, t) {
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, o = To[s];
  o && (e = o.serialize(e, t));
  const a = e, l = e.nss;
  return a.path = `${n || t.nid}:${l}`, t.skipEscape = !0, a;
}
function lm(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !nm.test(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function um(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const Kl = {
  scheme: "http",
  domainHost: !0,
  parse: ql,
  serialize: Gl
}, dm = {
  scheme: "https",
  domainHost: Kl.domainHost,
  parse: ql,
  serialize: Gl
}, Cn = {
  scheme: "ws",
  domainHost: !0,
  parse: om,
  serialize: am
}, fm = {
  scheme: "wss",
  domainHost: Cn.domainHost,
  parse: Cn.parse,
  serialize: Cn.serialize
}, hm = {
  scheme: "urn",
  parse: im,
  serialize: cm,
  skipNormalize: !0
}, mm = {
  scheme: "urn:uuid",
  parse: lm,
  serialize: um,
  skipNormalize: !0
}, To = {
  http: Kl,
  https: dm,
  ws: Cn,
  wss: fm,
  urn: hm,
  "urn:uuid": mm
};
var pm = To;
const { normalizeIPv6: $m, normalizeIPv4: ym, removeDotSegments: Hr, recomposeAuthority: gm, normalizeComponentEncoding: pn } = rm, jo = pm;
function _m(e, t) {
  return typeof e == "string" ? e = st(pt(e, t), t) : typeof e == "object" && (e = pt(st(e, t), t)), e;
}
function vm(e, t, r) {
  const n = Object.assign({ scheme: "null" }, r), s = Hl(pt(e, n), pt(t, n), n, !0);
  return st(s, { ...n, skipEscape: !0 });
}
function Hl(e, t, r, n) {
  const s = {};
  return n || (e = pt(st(e, r), r), t = pt(st(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Hr(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Hr(t.path || ""), s.query = t.query) : (t.path ? (t.path.charAt(0) === "/" ? s.path = Hr(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = Hr(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function wm(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = st(pn(pt(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = st(pn(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = st(pn(pt(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = st(pn(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function st(e, t) {
  const r = {
    host: e.host,
    scheme: e.scheme,
    userinfo: e.userinfo,
    port: e.port,
    path: e.path,
    query: e.query,
    nid: e.nid,
    nss: e.nss,
    uuid: e.uuid,
    fragment: e.fragment,
    reference: e.reference,
    resourceName: e.resourceName,
    secure: e.secure,
    error: ""
  }, n = Object.assign({}, t), s = [], o = jo[(n.scheme || r.scheme || "").toLowerCase()];
  o && o.serialize && o.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const a = gm(r);
  if (a !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(a), r.path && r.path.charAt(0) !== "/" && s.push("/")), r.path !== void 0) {
    let l = r.path;
    !n.absolutePath && (!o || !o.absolutePath) && (l = Hr(l)), a === void 0 && (l = l.replace(/^\/\//u, "/%2F")), s.push(l);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const Em = Array.from({ length: 127 }, (e, t) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(t)));
function Sm(e) {
  let t = 0;
  for (let r = 0, n = e.length; r < n; ++r)
    if (t = e.charCodeAt(r), t > 126 || Em[t])
      return !0;
  return !1;
}
const bm = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function pt(e, t) {
  const r = Object.assign({}, t), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  }, s = e.indexOf("%") !== -1;
  let o = !1;
  r.reference === "suffix" && (e = (r.scheme ? r.scheme + ":" : "") + "//" + e);
  const a = e.match(bm);
  if (a) {
    if (n.scheme = a[1], n.userinfo = a[3], n.host = a[4], n.port = parseInt(a[5], 10), n.path = a[6] || "", n.query = a[7], n.fragment = a[8], isNaN(n.port) && (n.port = a[5]), n.host) {
      const i = ym(n.host);
      if (i.isIPV4 === !1) {
        const d = $m(i.host);
        n.host = d.host.toLowerCase(), o = d.isIPV6;
      } else
        n.host = i.host, o = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const l = jo[(r.scheme || n.scheme || "").toLowerCase()];
    if (!r.unicodeSupport && (!l || !l.unicodeSupport) && n.host && (r.domainHost || l && l.domainHost) && o === !1 && Sm(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (i) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + i;
      }
    (!l || l && !l.skipNormalize) && (s && n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), s && n.host !== void 0 && (n.host = unescape(n.host)), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), l && l.parse && l.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const ko = {
  SCHEMES: jo,
  normalize: _m,
  resolve: vm,
  resolveComponents: Hl,
  equal: wm,
  serialize: st,
  parse: pt
};
ls.exports = ko;
ls.exports.default = ko;
ls.exports.fastUri = ko;
var Bl = ls.exports;
Object.defineProperty(Oo, "__esModule", { value: !0 });
const Wl = Bl;
Wl.code = 'require("ajv/dist/runtime/uri").default';
Oo.default = Wl;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = xe;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = x;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = ln, s = Pr, o = nr, a = je, l = x, i = Ee, d = ye, u = A, h = Hh, E = Oo, g = (N, p) => new RegExp(N, p);
  g.code = "new RegExp";
  const v = ["removeAdditional", "useDefaults", "coerceTypes"], y = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), $ = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, w = 200;
  function P(N) {
    var p, b, _, c, f, S, T, j, G, z, ae, Me, kt, At, Ct, Dt, Mt, Lt, Vt, Ft, Ut, zt, qt, Gt, Kt;
    const Ge = N.strict, Ht = (p = N.code) === null || p === void 0 ? void 0 : p.optimize, Cr = Ht === !0 || Ht === void 0 ? 1 : Ht || 0, Dr = (_ = (b = N.code) === null || b === void 0 ? void 0 : b.regExp) !== null && _ !== void 0 ? _ : g, Ps = (c = N.uriResolver) !== null && c !== void 0 ? c : E.default;
    return {
      strictSchema: (S = (f = N.strictSchema) !== null && f !== void 0 ? f : Ge) !== null && S !== void 0 ? S : !0,
      strictNumbers: (j = (T = N.strictNumbers) !== null && T !== void 0 ? T : Ge) !== null && j !== void 0 ? j : !0,
      strictTypes: (z = (G = N.strictTypes) !== null && G !== void 0 ? G : Ge) !== null && z !== void 0 ? z : "log",
      strictTuples: (Me = (ae = N.strictTuples) !== null && ae !== void 0 ? ae : Ge) !== null && Me !== void 0 ? Me : "log",
      strictRequired: (At = (kt = N.strictRequired) !== null && kt !== void 0 ? kt : Ge) !== null && At !== void 0 ? At : !1,
      code: N.code ? { ...N.code, optimize: Cr, regExp: Dr } : { optimize: Cr, regExp: Dr },
      loopRequired: (Ct = N.loopRequired) !== null && Ct !== void 0 ? Ct : w,
      loopEnum: (Dt = N.loopEnum) !== null && Dt !== void 0 ? Dt : w,
      meta: (Mt = N.meta) !== null && Mt !== void 0 ? Mt : !0,
      messages: (Lt = N.messages) !== null && Lt !== void 0 ? Lt : !0,
      inlineRefs: (Vt = N.inlineRefs) !== null && Vt !== void 0 ? Vt : !0,
      schemaId: (Ft = N.schemaId) !== null && Ft !== void 0 ? Ft : "$id",
      addUsedSchema: (Ut = N.addUsedSchema) !== null && Ut !== void 0 ? Ut : !0,
      validateSchema: (zt = N.validateSchema) !== null && zt !== void 0 ? zt : !0,
      validateFormats: (qt = N.validateFormats) !== null && qt !== void 0 ? qt : !0,
      unicodeRegExp: (Gt = N.unicodeRegExp) !== null && Gt !== void 0 ? Gt : !0,
      int32range: (Kt = N.int32range) !== null && Kt !== void 0 ? Kt : !0,
      uriResolver: Ps
    };
  }
  class I {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...P(p) };
      const { es5: b, lines: _ } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: y, es5: b, lines: _ }), this.logger = q(p.logger);
      const c = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, o.getRules)(), R.call(this, $, p, "NOT SUPPORTED"), R.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ie.call(this), p.formats && Y.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && ce.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), W.call(this), p.validateFormats = c;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: b, schemaId: _ } = this.opts;
      let c = h;
      _ === "id" && (c = { ...h }, c.id = c.$id, delete c.$id), b && p && this.addMetaSchema(c, c[_], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: b } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[b] || p : void 0;
    }
    validate(p, b) {
      let _;
      if (typeof p == "string") {
        if (_ = this.getSchema(p), !_)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        _ = this.compile(p);
      const c = _(b);
      return "$async" in _ || (this.errors = _.errors), c;
    }
    compile(p, b) {
      const _ = this._addSchema(p, b);
      return _.validate || this._compileSchemaEnv(_);
    }
    compileAsync(p, b) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: _ } = this.opts;
      return c.call(this, p, b);
      async function c(z, ae) {
        await f.call(this, z.$schema);
        const Me = this._addSchema(z, ae);
        return Me.validate || S.call(this, Me);
      }
      async function f(z) {
        z && !this.getSchema(z) && await c.call(this, { $ref: z }, !0);
      }
      async function S(z) {
        try {
          return this._compileSchemaEnv(z);
        } catch (ae) {
          if (!(ae instanceof s.default))
            throw ae;
          return T.call(this, ae), await j.call(this, ae.missingSchema), S.call(this, z);
        }
      }
      function T({ missingSchema: z, missingRef: ae }) {
        if (this.refs[z])
          throw new Error(`AnySchema ${z} is loaded but ${ae} cannot be resolved`);
      }
      async function j(z) {
        const ae = await G.call(this, z);
        this.refs[z] || await f.call(this, ae.$schema), this.refs[z] || this.addSchema(ae, z, b);
      }
      async function G(z) {
        const ae = this._loading[z];
        if (ae)
          return ae;
        try {
          return await (this._loading[z] = _(z));
        } finally {
          delete this._loading[z];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, b, _, c = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const S of p)
          this.addSchema(S, void 0, _, c);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: S } = this.opts;
        if (f = p[S], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return b = (0, i.normalizeId)(b || f), this._checkUnique(b), this.schemas[b] = this._addSchema(p, _, b, c, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, b, _ = this.opts.validateSchema) {
      return this.addSchema(p, b, !0, _), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, b) {
      if (typeof p == "boolean")
        return !0;
      let _;
      if (_ = p.$schema, _ !== void 0 && typeof _ != "string")
        throw new Error("$schema must be a string");
      if (_ = _ || this.opts.defaultMeta || this.defaultMeta(), !_)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const c = this.validate(_, p);
      if (!c && b) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return c;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(p) {
      let b;
      for (; typeof (b = F.call(this, p)) == "string"; )
        p = b;
      if (b === void 0) {
        const { schemaId: _ } = this.opts, c = new a.SchemaEnv({ schema: {}, schemaId: _ });
        if (b = a.resolveSchema.call(this, c, p), !b)
          return;
        this.refs[p] = b;
      }
      return b.validate || this._compileSchemaEnv(b);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(p) {
      if (p instanceof RegExp)
        return this._removeAllSchemas(this.schemas, p), this._removeAllSchemas(this.refs, p), this;
      switch (typeof p) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const b = F.call(this, p);
          return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const b = p;
          this._cache.delete(b);
          let _ = p[this.opts.schemaId];
          return _ && (_ = (0, i.normalizeId)(_), delete this.schemas[_], delete this.refs[_]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const b of p)
        this.addKeyword(b);
      return this;
    }
    addKeyword(p, b) {
      let _;
      if (typeof p == "string")
        _ = p, typeof b == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), b.keyword = _);
      else if (typeof p == "object" && b === void 0) {
        if (b = p, _ = b.keyword, Array.isArray(_) && !_.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (O.call(this, _, b), !b)
        return (0, u.eachItem)(_, (f) => k.call(this, f)), this;
      M.call(this, b);
      const c = {
        ...b,
        type: (0, d.getJSONTypes)(b.type),
        schemaType: (0, d.getJSONTypes)(b.schemaType)
      };
      return (0, u.eachItem)(_, c.type.length === 0 ? (f) => k.call(this, f, c) : (f) => c.type.forEach((S) => k.call(this, f, c, S))), this;
    }
    getKeyword(p) {
      const b = this.RULES.all[p];
      return typeof b == "object" ? b.definition : !!b;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: b } = this;
      delete b.keywords[p], delete b.all[p];
      for (const _ of b.rules) {
        const c = _.rules.findIndex((f) => f.keyword === p);
        c >= 0 && _.rules.splice(c, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, b) {
      return typeof b == "string" && (b = new RegExp(b)), this.formats[p] = b, this;
    }
    errorsText(p = this.errors, { separator: b = ", ", dataVar: _ = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((c) => `${_}${c.instancePath} ${c.message}`).reduce((c, f) => c + b + f);
    }
    $dataMetaSchema(p, b) {
      const _ = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const c of b) {
        const f = c.split("/").slice(1);
        let S = p;
        for (const T of f)
          S = S[T];
        for (const T in _) {
          const j = _[T];
          if (typeof j != "object")
            continue;
          const { $data: G } = j.definition, z = S[T];
          G && z && (S[T] = L(z));
        }
      }
      return p;
    }
    _removeAllSchemas(p, b) {
      for (const _ in p) {
        const c = p[_];
        (!b || b.test(_)) && (typeof c == "string" ? delete p[_] : c && !c.meta && (this._cache.delete(c.schema), delete p[_]));
      }
    }
    _addSchema(p, b, _, c = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let S;
      const { schemaId: T } = this.opts;
      if (typeof p == "object")
        S = p[T];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let j = this._cache.get(p);
      if (j !== void 0)
        return j;
      _ = (0, i.normalizeId)(S || _);
      const G = i.getSchemaRefs.call(this, p, _);
      return j = new a.SchemaEnv({ schema: p, schemaId: T, meta: b, baseId: _, localRefs: G }), this._cache.set(j.schema, j), f && !_.startsWith("#") && (_ && this._checkUnique(_), this.refs[_] = j), c && this.validateSchema(p, !0), j;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : a.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const b = this.opts;
      this.opts = this._metaOpts;
      try {
        a.compileSchema.call(this, p);
      } finally {
        this.opts = b;
      }
    }
  }
  I.ValidationError = n.default, I.MissingRefError = s.default, e.default = I;
  function R(N, p, b, _ = "error") {
    for (const c in N) {
      const f = c;
      f in p && this.logger[_](`${b}: option ${c}. ${N[f]}`);
    }
  }
  function F(N) {
    return N = (0, i.normalizeId)(N), this.schemas[N] || this.refs[N];
  }
  function W() {
    const N = this.opts.schemas;
    if (N)
      if (Array.isArray(N))
        this.addSchema(N);
      else
        for (const p in N)
          this.addSchema(N[p], p);
  }
  function Y() {
    for (const N in this.opts.formats) {
      const p = this.opts.formats[N];
      p && this.addFormat(N, p);
    }
  }
  function ce(N) {
    if (Array.isArray(N)) {
      this.addVocabulary(N);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in N) {
      const b = N[p];
      b.keyword || (b.keyword = p), this.addKeyword(b);
    }
  }
  function ie() {
    const N = { ...this.opts };
    for (const p of v)
      delete N[p];
    return N;
  }
  const D = { log() {
  }, warn() {
  }, error() {
  } };
  function q(N) {
    if (N === !1)
      return D;
    if (N === void 0)
      return console;
    if (N.log && N.warn && N.error)
      return N;
    throw new Error("logger must implement log, warn and error methods");
  }
  const oe = /^[a-z_$][a-z0-9_$:-]*$/i;
  function O(N, p) {
    const { RULES: b } = this;
    if ((0, u.eachItem)(N, (_) => {
      if (b.keywords[_])
        throw new Error(`Keyword ${_} is already defined`);
      if (!oe.test(_))
        throw new Error(`Keyword ${_} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(N, p, b) {
    var _;
    const c = p == null ? void 0 : p.post;
    if (b && c)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let S = c ? f.post : f.rules.find(({ type: j }) => j === b);
    if (S || (S = { type: b, rules: [] }, f.rules.push(S)), f.keywords[N] = !0, !p)
      return;
    const T = {
      keyword: N,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? U.call(this, S, T, p.before) : S.rules.push(T), f.all[N] = T, (_ = p.implements) === null || _ === void 0 || _.forEach((j) => this.addKeyword(j));
  }
  function U(N, p, b) {
    const _ = N.rules.findIndex((c) => c.keyword === b);
    _ >= 0 ? N.rules.splice(_, 0, p) : (N.rules.push(p), this.logger.warn(`rule ${b} is not defined`));
  }
  function M(N) {
    let { metaSchema: p } = N;
    p !== void 0 && (N.$data && this.opts.$data && (p = L(p)), N.validateSchema = this.compile(p, !0));
  }
  const K = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function L(N) {
    return { anyOf: [N, K] };
  }
})(al);
var Ao = {}, Co = {}, Do = {};
Object.defineProperty(Do, "__esModule", { value: !0 });
const Pm = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Do.default = Pm;
var $t = {};
Object.defineProperty($t, "__esModule", { value: !0 });
$t.callRef = $t.getValidate = void 0;
const Nm = Pr, Vi = ne, Ae = x, cr = Fe, Fi = je, $n = A, Im = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: o, validateName: a, opts: l, self: i } = n, { root: d } = o;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = Fi.resolveRef.call(i, d, s, r);
    if (u === void 0)
      throw new Nm.default(n.opts.uriResolver, s, r);
    if (u instanceof Fi.SchemaEnv)
      return E(u);
    return g(u);
    function h() {
      if (o === d)
        return Dn(e, a, o, o.$async);
      const v = t.scopeValue("root", { ref: d });
      return Dn(e, (0, Ae._)`${v}.validate`, d, d.$async);
    }
    function E(v) {
      const y = Xl(e, v);
      Dn(e, y, v, v.$async);
    }
    function g(v) {
      const y = t.scopeValue("schema", l.code.source === !0 ? { ref: v, code: (0, Ae.stringify)(v) } : { ref: v }), $ = t.name("valid"), m = e.subschema({
        schema: v,
        dataTypes: [],
        schemaPath: Ae.nil,
        topSchemaRef: y,
        errSchemaPath: r
      }, $);
      e.mergeEvaluated(m), e.ok($);
    }
  }
};
function Xl(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ae._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
$t.getValidate = Xl;
function Dn(e, t, r, n) {
  const { gen: s, it: o } = e, { allErrors: a, schemaEnv: l, opts: i } = o, d = i.passContext ? cr.default.this : Ae.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, Ae._)`await ${(0, Vi.callValidateCode)(e, t, d)}`), g(t), a || s.assign(v, !0);
    }, (y) => {
      s.if((0, Ae._)`!(${y} instanceof ${o.ValidationError})`, () => s.throw(y)), E(y), a || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, Vi.callValidateCode)(e, t, d), () => g(t), () => E(t));
  }
  function E(v) {
    const y = (0, Ae._)`${v}.errors`;
    s.assign(cr.default.vErrors, (0, Ae._)`${cr.default.vErrors} === null ? ${y} : ${cr.default.vErrors}.concat(${y})`), s.assign(cr.default.errors, (0, Ae._)`${cr.default.vErrors}.length`);
  }
  function g(v) {
    var y;
    if (!o.opts.unevaluated)
      return;
    const $ = (y = r == null ? void 0 : r.validate) === null || y === void 0 ? void 0 : y.evaluated;
    if (o.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (o.props = $n.mergeEvaluated.props(s, $.props, o.props));
      else {
        const m = s.var("props", (0, Ae._)`${v}.evaluated.props`);
        o.props = $n.mergeEvaluated.props(s, m, o.props, Ae.Name);
      }
    if (o.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (o.items = $n.mergeEvaluated.items(s, $.items, o.items));
      else {
        const m = s.var("items", (0, Ae._)`${v}.evaluated.items`);
        o.items = $n.mergeEvaluated.items(s, m, o.items, Ae.Name);
      }
  }
}
$t.callRef = Dn;
$t.default = Im;
Object.defineProperty(Co, "__esModule", { value: !0 });
const Rm = Do, Om = $t, Tm = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  Rm.default,
  Om.default
];
Co.default = Tm;
var Mo = {}, Lo = {};
Object.defineProperty(Lo, "__esModule", { value: !0 });
const Bn = x, wt = Bn.operators, Wn = {
  maximum: { okStr: "<=", ok: wt.LTE, fail: wt.GT },
  minimum: { okStr: ">=", ok: wt.GTE, fail: wt.LT },
  exclusiveMaximum: { okStr: "<", ok: wt.LT, fail: wt.GTE },
  exclusiveMinimum: { okStr: ">", ok: wt.GT, fail: wt.LTE }
}, jm = {
  message: ({ keyword: e, schemaCode: t }) => (0, Bn.str)`must be ${Wn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Bn._)`{comparison: ${Wn[e].okStr}, limit: ${t}}`
}, km = {
  keyword: Object.keys(Wn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: jm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Bn._)`${r} ${Wn[t].fail} ${n} || isNaN(${r})`);
  }
};
Lo.default = km;
var Vo = {};
Object.defineProperty(Vo, "__esModule", { value: !0 });
const Jr = x, Am = {
  message: ({ schemaCode: e }) => (0, Jr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Jr._)`{multipleOf: ${e}}`
}, Cm = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Am,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, o = s.opts.multipleOfPrecision, a = t.let("res"), l = o ? (0, Jr._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, Jr._)`${a} !== parseInt(${a})`;
    e.fail$data((0, Jr._)`(${n} === 0 || (${a} = ${r}/${n}, ${l}))`);
  }
};
Vo.default = Cm;
var Fo = {}, Uo = {};
Object.defineProperty(Uo, "__esModule", { value: !0 });
function Jl(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Uo.default = Jl;
Jl.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Fo, "__esModule", { value: !0 });
const Jt = x, Dm = A, Mm = Uo, Lm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Jt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Jt._)`{limit: ${e}}`
}, Vm = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Lm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, o = t === "maxLength" ? Jt.operators.GT : Jt.operators.LT, a = s.opts.unicode === !1 ? (0, Jt._)`${r}.length` : (0, Jt._)`${(0, Dm.useFunc)(e.gen, Mm.default)}(${r})`;
    e.fail$data((0, Jt._)`${a} ${o} ${n}`);
  }
};
Fo.default = Vm;
var zo = {};
Object.defineProperty(zo, "__esModule", { value: !0 });
const Fm = ne, Xn = x, Um = {
  message: ({ schemaCode: e }) => (0, Xn.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Xn._)`{pattern: ${e}}`
}, zm = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Um,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: o } = e, a = o.opts.unicodeRegExp ? "u" : "", l = r ? (0, Xn._)`(new RegExp(${s}, ${a}))` : (0, Fm.usePattern)(e, n);
    e.fail$data((0, Xn._)`!${l}.test(${t})`);
  }
};
zo.default = zm;
var qo = {};
Object.defineProperty(qo, "__esModule", { value: !0 });
const xr = x, qm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, xr.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, xr._)`{limit: ${e}}`
}, Gm = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: qm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? xr.operators.GT : xr.operators.LT;
    e.fail$data((0, xr._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
qo.default = Gm;
var Go = {};
Object.defineProperty(Go, "__esModule", { value: !0 });
const zr = ne, Yr = x, Km = A, Hm = {
  message: ({ params: { missingProperty: e } }) => (0, Yr.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Yr._)`{missingProperty: ${e}}`
}, Bm = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Hm,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: o, it: a } = e, { opts: l } = a;
    if (!o && r.length === 0)
      return;
    const i = r.length >= l.loopRequired;
    if (a.allErrors ? d() : u(), l.strictRequired) {
      const g = e.parentSchema.properties, { definedProperties: v } = e.it;
      for (const y of r)
        if ((g == null ? void 0 : g[y]) === void 0 && !v.has(y)) {
          const $ = a.schemaEnv.baseId + a.errSchemaPath, m = `required property "${y}" is not defined at "${$}" (strictRequired)`;
          (0, Km.checkStrictMode)(a, m, a.opts.strictRequired);
        }
    }
    function d() {
      if (i || o)
        e.block$data(Yr.nil, h);
      else
        for (const g of r)
          (0, zr.checkReportMissingProp)(e, g);
    }
    function u() {
      const g = t.let("missing");
      if (i || o) {
        const v = t.let("valid", !0);
        e.block$data(v, () => E(g, v)), e.ok(v);
      } else
        t.if((0, zr.checkMissingProp)(e, r, g)), (0, zr.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, zr.noPropertyInData)(t, s, g, l.ownProperties), () => e.error());
      });
    }
    function E(g, v) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(v, (0, zr.propertyInData)(t, s, g, l.ownProperties)), t.if((0, Yr.not)(v), () => {
          e.error(), t.break();
        });
      }, Yr.nil);
    }
  }
};
Go.default = Bm;
var Ko = {};
Object.defineProperty(Ko, "__esModule", { value: !0 });
const Zr = x, Wm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Zr.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Zr._)`{limit: ${e}}`
}, Xm = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Wm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? Zr.operators.GT : Zr.operators.LT;
    e.fail$data((0, Zr._)`${r}.length ${s} ${n}`);
  }
};
Ko.default = Xm;
var Ho = {}, un = {};
Object.defineProperty(un, "__esModule", { value: !0 });
const xl = as;
xl.code = 'require("ajv/dist/runtime/equal").default';
un.default = xl;
Object.defineProperty(Ho, "__esModule", { value: !0 });
const js = ye, ve = x, Jm = A, xm = un, Ym = {
  message: ({ params: { i: e, j: t } }) => (0, ve.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, ve._)`{i: ${e}, j: ${t}}`
}, Zm = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Ym,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: o, schemaCode: a, it: l } = e;
    if (!n && !s)
      return;
    const i = t.let("valid"), d = o.items ? (0, js.getSchemaTypes)(o.items) : [];
    e.block$data(i, u, (0, ve._)`${a} === false`), e.ok(i);
    function u() {
      const v = t.let("i", (0, ve._)`${r}.length`), y = t.let("j");
      e.setParams({ i: v, j: y }), t.assign(i, !0), t.if((0, ve._)`${v} > 1`, () => (h() ? E : g)(v, y));
    }
    function h() {
      return d.length > 0 && !d.some((v) => v === "object" || v === "array");
    }
    function E(v, y) {
      const $ = t.name("item"), m = (0, js.checkDataTypes)(d, $, l.opts.strictNumbers, js.DataType.Wrong), w = t.const("indices", (0, ve._)`{}`);
      t.for((0, ve._)`;${v}--;`, () => {
        t.let($, (0, ve._)`${r}[${v}]`), t.if(m, (0, ve._)`continue`), d.length > 1 && t.if((0, ve._)`typeof ${$} == "string"`, (0, ve._)`${$} += "_"`), t.if((0, ve._)`typeof ${w}[${$}] == "number"`, () => {
          t.assign(y, (0, ve._)`${w}[${$}]`), e.error(), t.assign(i, !1).break();
        }).code((0, ve._)`${w}[${$}] = ${v}`);
      });
    }
    function g(v, y) {
      const $ = (0, Jm.useFunc)(t, xm.default), m = t.name("outer");
      t.label(m).for((0, ve._)`;${v}--;`, () => t.for((0, ve._)`${y} = ${v}; ${y}--;`, () => t.if((0, ve._)`${$}(${r}[${v}], ${r}[${y}])`, () => {
        e.error(), t.assign(i, !1).break(m);
      })));
    }
  }
};
Ho.default = Zm;
var Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
const Qs = x, Qm = A, ep = un, tp = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Qs._)`{allowedValue: ${e}}`
}, rp = {
  keyword: "const",
  $data: !0,
  error: tp,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: o } = e;
    n || o && typeof o == "object" ? e.fail$data((0, Qs._)`!${(0, Qm.useFunc)(t, ep.default)}(${r}, ${s})`) : e.fail((0, Qs._)`${o} !== ${r}`);
  }
};
Bo.default = rp;
var Wo = {};
Object.defineProperty(Wo, "__esModule", { value: !0 });
const Br = x, np = A, sp = un, op = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Br._)`{allowedValues: ${e}}`
}, ap = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: op,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= a.opts.loopEnum;
    let i;
    const d = () => i ?? (i = (0, np.useFunc)(t, sp.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", o);
      u = (0, Br.or)(...s.map((v, y) => E(g, y)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", o, (g) => t.if((0, Br._)`${d()}(${r}, ${g})`, () => t.assign(u, !0).break()));
    }
    function E(g, v) {
      const y = s[v];
      return typeof y == "object" && y !== null ? (0, Br._)`${d()}(${r}, ${g}[${v}])` : (0, Br._)`${r} === ${y}`;
    }
  }
};
Wo.default = ap;
Object.defineProperty(Mo, "__esModule", { value: !0 });
const ip = Lo, cp = Vo, lp = Fo, up = zo, dp = qo, fp = Go, hp = Ko, mp = Ho, pp = Bo, $p = Wo, yp = [
  // number
  ip.default,
  cp.default,
  // string
  lp.default,
  up.default,
  // object
  dp.default,
  fp.default,
  // array
  hp.default,
  mp.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  pp.default,
  $p.default
];
Mo.default = yp;
var Xo = {}, Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.validateAdditionalItems = void 0;
const xt = x, eo = A, gp = {
  message: ({ params: { len: e } }) => (0, xt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, xt._)`{limit: ${e}}`
}, _p = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: gp,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, eo.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Yl(e, n);
  }
};
function Yl(e, t) {
  const { gen: r, schema: n, data: s, keyword: o, it: a } = e;
  a.items = !0;
  const l = r.const("len", (0, xt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, xt._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, eo.alwaysValidSchema)(a, n)) {
    const d = r.var("valid", (0, xt._)`${l} <= ${t.length}`);
    r.if((0, xt.not)(d), () => i(d)), e.ok(d);
  }
  function i(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: o, dataProp: u, dataPropType: eo.Type.Num }, d), a.allErrors || r.if((0, xt.not)(d), () => r.break());
    });
  }
}
Nr.validateAdditionalItems = Yl;
Nr.default = _p;
var Jo = {}, Ir = {};
Object.defineProperty(Ir, "__esModule", { value: !0 });
Ir.validateTuple = void 0;
const Ui = x, Mn = A, vp = ne, wp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Zl(e, "additionalItems", t);
    r.items = !0, !(0, Mn.alwaysValidSchema)(r, t) && e.ok((0, vp.validateArray)(e));
  }
};
function Zl(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: o, keyword: a, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = Mn.mergeEvaluated.items(n, r.length, l.items));
  const i = n.name("valid"), d = n.const("len", (0, Ui._)`${o}.length`);
  r.forEach((h, E) => {
    (0, Mn.alwaysValidSchema)(l, h) || (n.if((0, Ui._)`${d} > ${E}`, () => e.subschema({
      keyword: a,
      schemaProp: E,
      dataProp: E
    }, i)), e.ok(i));
  });
  function u(h) {
    const { opts: E, errSchemaPath: g } = l, v = r.length, y = v === h.minItems && (v === h.maxItems || h[t] === !1);
    if (E.strictTuples && !y) {
      const $ = `"${a}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, Mn.checkStrictMode)(l, $, E.strictTuples);
    }
  }
}
Ir.validateTuple = Zl;
Ir.default = wp;
Object.defineProperty(Jo, "__esModule", { value: !0 });
const Ep = Ir, Sp = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, Ep.validateTuple)(e, "items")
};
Jo.default = Sp;
var xo = {};
Object.defineProperty(xo, "__esModule", { value: !0 });
const zi = x, bp = A, Pp = ne, Np = Nr, Ip = {
  message: ({ params: { len: e } }) => (0, zi.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, zi._)`{limit: ${e}}`
}, Rp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Ip,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, bp.alwaysValidSchema)(n, t) && (s ? (0, Np.validateAdditionalItems)(e, s) : e.ok((0, Pp.validateArray)(e)));
  }
};
xo.default = Rp;
var Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
const Ue = x, yn = A, Op = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ue.str)`must contain at least ${e} valid item(s)` : (0, Ue.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ue._)`{minContains: ${e}}` : (0, Ue._)`{minContains: ${e}, maxContains: ${t}}`
}, Tp = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Op,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    let a, l;
    const { minContains: i, maxContains: d } = n;
    o.opts.next ? (a = i === void 0 ? 1 : i, l = d) : a = 1;
    const u = t.const("len", (0, Ue._)`${s}.length`);
    if (e.setParams({ min: a, max: l }), l === void 0 && a === 0) {
      (0, yn.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && a > l) {
      (0, yn.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, yn.alwaysValidSchema)(o, r)) {
      let y = (0, Ue._)`${u} >= ${a}`;
      l !== void 0 && (y = (0, Ue._)`${y} && ${u} <= ${l}`), e.pass(y);
      return;
    }
    o.items = !0;
    const h = t.name("valid");
    l === void 0 && a === 1 ? g(h, () => t.if(h, () => t.break())) : a === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, Ue._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const y = t.name("_valid"), $ = t.let("count", 0);
      g(y, () => t.if(y, () => v($)));
    }
    function g(y, $) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: yn.Type.Num,
          compositeRule: !0
        }, y), $();
      });
    }
    function v(y) {
      t.code((0, Ue._)`${y}++`), l === void 0 ? t.if((0, Ue._)`${y} >= ${a}`, () => t.assign(h, !0).break()) : (t.if((0, Ue._)`${y} > ${l}`, () => t.assign(h, !1).break()), a === 1 ? t.assign(h, !0) : t.if((0, Ue._)`${y} >= ${a}`, () => t.assign(h, !0)));
    }
  }
};
Yo.default = Tp;
var us = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = x, r = A, n = ne;
  e.error = {
    message: ({ params: { property: i, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${i} is present`;
    },
    params: ({ params: { property: i, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${i},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${u}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(i) {
      const [d, u] = o(i);
      a(i, d), l(i, u);
    }
  };
  function o({ schema: i }) {
    const d = {}, u = {};
    for (const h in i) {
      if (h === "__proto__")
        continue;
      const E = Array.isArray(i[h]) ? d : u;
      E[h] = i[h];
    }
    return [d, u];
  }
  function a(i, d = i.schema) {
    const { gen: u, data: h, it: E } = i;
    if (Object.keys(d).length === 0)
      return;
    const g = u.let("missing");
    for (const v in d) {
      const y = d[v];
      if (y.length === 0)
        continue;
      const $ = (0, n.propertyInData)(u, h, v, E.opts.ownProperties);
      i.setParams({
        property: v,
        depsCount: y.length,
        deps: y.join(", ")
      }), E.allErrors ? u.if($, () => {
        for (const m of y)
          (0, n.checkReportMissingProp)(i, m);
      }) : (u.if((0, t._)`${$} && (${(0, n.checkMissingProp)(i, y, g)})`), (0, n.reportMissingProp)(i, g), u.else());
    }
  }
  e.validatePropertyDeps = a;
  function l(i, d = i.schema) {
    const { gen: u, data: h, keyword: E, it: g } = i, v = u.name("valid");
    for (const y in d)
      (0, r.alwaysValidSchema)(g, d[y]) || (u.if(
        (0, n.propertyInData)(u, h, y, g.opts.ownProperties),
        () => {
          const $ = i.subschema({ keyword: E, schemaProp: y }, v);
          i.mergeValidEvaluated($, v);
        },
        () => u.var(v, !0)
        // TODO var
      ), i.ok(v));
  }
  e.validateSchemaDeps = l, e.default = s;
})(us);
var Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
const Ql = x, jp = A, kp = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Ql._)`{propertyName: ${e.propertyName}}`
}, Ap = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: kp,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, jp.alwaysValidSchema)(s, r))
      return;
    const o = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, o), t.if((0, Ql.not)(o), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
Zo.default = Ap;
var ds = {};
Object.defineProperty(ds, "__esModule", { value: !0 });
const gn = ne, Be = x, Cp = Fe, _n = A, Dp = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Be._)`{additionalProperty: ${e.additionalProperty}}`
}, Mp = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Dp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: o, it: a } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: i } = a;
    if (a.props = !0, i.removeAdditional !== "all" && (0, _n.alwaysValidSchema)(a, r))
      return;
    const d = (0, gn.allSchemaProperties)(n.properties), u = (0, gn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Be._)`${o} === ${Cp.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !u.length ? v($) : t.if(E($), () => v($));
      });
    }
    function E($) {
      let m;
      if (d.length > 8) {
        const w = (0, _n.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, gn.isOwnProperty)(t, w, $);
      } else d.length ? m = (0, Be.or)(...d.map((w) => (0, Be._)`${$} === ${w}`)) : m = Be.nil;
      return u.length && (m = (0, Be.or)(m, ...u.map((w) => (0, Be._)`${(0, gn.usePattern)(e, w)}.test(${$})`))), (0, Be.not)(m);
    }
    function g($) {
      t.code((0, Be._)`delete ${s}[${$}]`);
    }
    function v($) {
      if (i.removeAdditional === "all" || i.removeAdditional && r === !1) {
        g($);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: $ }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, _n.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        i.removeAdditional === "failing" ? (y($, m, !1), t.if((0, Be.not)(m), () => {
          e.reset(), g($);
        })) : (y($, m), l || t.if((0, Be.not)(m), () => t.break()));
      }
    }
    function y($, m, w) {
      const P = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: _n.Type.Str
      };
      w === !1 && Object.assign(P, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(P, m);
    }
  }
};
ds.default = Mp;
var Qo = {};
Object.defineProperty(Qo, "__esModule", { value: !0 });
const Lp = xe, qi = ne, ks = A, Gi = ds, Vp = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Gi.default.code(new Lp.KeywordCxt(o, Gi.default, "additionalProperties"));
    const a = (0, qi.allSchemaProperties)(r);
    for (const h of a)
      o.definedProperties.add(h);
    o.opts.unevaluated && a.length && o.props !== !0 && (o.props = ks.mergeEvaluated.props(t, (0, ks.toHash)(a), o.props));
    const l = a.filter((h) => !(0, ks.alwaysValidSchema)(o, r[h]));
    if (l.length === 0)
      return;
    const i = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, qi.propertyInData)(t, s, h, o.opts.ownProperties)), u(h), o.allErrors || t.else().var(i, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(i);
    function d(h) {
      return o.opts.useDefaults && !o.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, i);
    }
  }
};
Qo.default = Vp;
var ea = {};
Object.defineProperty(ea, "__esModule", { value: !0 });
const Ki = ne, vn = x, Hi = A, Bi = A, Fp = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: o } = e, { opts: a } = o, l = (0, Ki.allSchemaProperties)(r), i = l.filter((y) => (0, Hi.alwaysValidSchema)(o, r[y]));
    if (l.length === 0 || i.length === l.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const d = a.strictSchema && !a.allowMatchingProperties && s.properties, u = t.name("valid");
    o.props !== !0 && !(o.props instanceof vn.Name) && (o.props = (0, Bi.evaluatedPropsToName)(t, o.props));
    const { props: h } = o;
    E();
    function E() {
      for (const y of l)
        d && g(y), o.allErrors ? v(y) : (t.var(u, !0), v(y), t.if(u));
    }
    function g(y) {
      for (const $ in d)
        new RegExp(y).test($) && (0, Hi.checkStrictMode)(o, `property ${$} matches pattern ${y} (use allowMatchingProperties)`);
    }
    function v(y) {
      t.forIn("key", n, ($) => {
        t.if((0, vn._)`${(0, Ki.usePattern)(e, y)}.test(${$})`, () => {
          const m = i.includes(y);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: y,
            dataProp: $,
            dataPropType: Bi.Type.Str
          }, u), o.opts.unevaluated && h !== !0 ? t.assign((0, vn._)`${h}[${$}]`, !0) : !m && !o.allErrors && t.if((0, vn.not)(u), () => t.break());
        });
      });
    }
  }
};
ea.default = Fp;
var ta = {};
Object.defineProperty(ta, "__esModule", { value: !0 });
const Up = A, zp = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Up.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
ta.default = zp;
var ra = {};
Object.defineProperty(ra, "__esModule", { value: !0 });
const qp = ne, Gp = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: qp.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
ra.default = Gp;
var na = {};
Object.defineProperty(na, "__esModule", { value: !0 });
const Ln = x, Kp = A, Hp = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Ln._)`{passingSchemas: ${e.passing}}`
}, Bp = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Hp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const o = r, a = t.let("valid", !1), l = t.let("passing", null), i = t.name("_valid");
    e.setParams({ passing: l }), t.block(d), e.result(a, () => e.reset(), () => e.error(!0));
    function d() {
      o.forEach((u, h) => {
        let E;
        (0, Kp.alwaysValidSchema)(s, u) ? t.var(i, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, i), h > 0 && t.if((0, Ln._)`${i} && ${a}`).assign(a, !1).assign(l, (0, Ln._)`[${l}, ${h}]`).else(), t.if(i, () => {
          t.assign(a, !0), t.assign(l, h), E && e.mergeEvaluated(E, Ln.Name);
        });
      });
    }
  }
};
na.default = Bp;
var sa = {};
Object.defineProperty(sa, "__esModule", { value: !0 });
const Wp = A, Xp = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((o, a) => {
      if ((0, Wp.alwaysValidSchema)(n, o))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: a }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
sa.default = Xp;
var oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
const Jn = x, eu = A, Jp = {
  message: ({ params: e }) => (0, Jn.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Jn._)`{failingKeyword: ${e.ifClause}}`
}, xp = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Jp,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, eu.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Wi(n, "then"), o = Wi(n, "else");
    if (!s && !o)
      return;
    const a = t.let("valid", !0), l = t.name("_valid");
    if (i(), e.reset(), s && o) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, Jn.not)(l), d("else"));
    e.pass(a, () => e.error(!0));
    function i() {
      const u = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, l);
      e.mergeEvaluated(u);
    }
    function d(u, h) {
      return () => {
        const E = e.subschema({ keyword: u }, l);
        t.assign(a, l), e.mergeValidEvaluated(E, a), h ? t.assign(h, (0, Jn._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function Wi(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, eu.alwaysValidSchema)(e, r);
}
oa.default = xp;
var aa = {};
Object.defineProperty(aa, "__esModule", { value: !0 });
const Yp = A, Zp = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Yp.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
aa.default = Zp;
Object.defineProperty(Xo, "__esModule", { value: !0 });
const Qp = Nr, e$ = Jo, t$ = Ir, r$ = xo, n$ = Yo, s$ = us, o$ = Zo, a$ = ds, i$ = Qo, c$ = ea, l$ = ta, u$ = ra, d$ = na, f$ = sa, h$ = oa, m$ = aa;
function p$(e = !1) {
  const t = [
    // any
    l$.default,
    u$.default,
    d$.default,
    f$.default,
    h$.default,
    m$.default,
    // object
    o$.default,
    a$.default,
    s$.default,
    i$.default,
    c$.default
  ];
  return e ? t.push(e$.default, r$.default) : t.push(Qp.default, t$.default), t.push(n$.default), t;
}
Xo.default = p$;
var ia = {}, Rr = {};
Object.defineProperty(Rr, "__esModule", { value: !0 });
Rr.dynamicAnchor = void 0;
const As = x, $$ = Fe, Xi = je, y$ = $t, g$ = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => tu(e, e.schema)
};
function tu(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, As._)`${$$.default.dynamicAnchors}${(0, As.getProperty)(t)}`, o = n.errSchemaPath === "#" ? n.validateName : _$(e);
  r.if((0, As._)`!${s}`, () => r.assign(s, o));
}
Rr.dynamicAnchor = tu;
function _$(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: o, localRefs: a, meta: l } = t.root, { schemaId: i } = n.opts, d = new Xi.SchemaEnv({ schema: r, schemaId: i, root: s, baseId: o, localRefs: a, meta: l });
  return Xi.compileSchema.call(n, d), (0, y$.getValidate)(e, d);
}
Rr.default = g$;
var Or = {};
Object.defineProperty(Or, "__esModule", { value: !0 });
Or.dynamicRef = void 0;
const Ji = x, v$ = Fe, xi = $t, w$ = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => ru(e, e.schema)
};
function ru(e, t) {
  const { gen: r, keyword: n, it: s } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const o = t.slice(1);
  if (s.allErrors)
    a();
  else {
    const i = r.let("valid", !1);
    a(i), e.ok(i);
  }
  function a(i) {
    if (s.schemaEnv.root.dynamicAnchors[o]) {
      const d = r.let("_v", (0, Ji._)`${v$.default.dynamicAnchors}${(0, Ji.getProperty)(o)}`);
      r.if(d, l(d, i), l(s.validateName, i));
    } else
      l(s.validateName, i)();
  }
  function l(i, d) {
    return d ? () => r.block(() => {
      (0, xi.callRef)(e, i), r.let(d, !0);
    }) : () => (0, xi.callRef)(e, i);
  }
}
Or.dynamicRef = ru;
Or.default = w$;
var ca = {};
Object.defineProperty(ca, "__esModule", { value: !0 });
const E$ = Rr, S$ = A, b$ = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, E$.dynamicAnchor)(e, "") : (0, S$.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
ca.default = b$;
var la = {};
Object.defineProperty(la, "__esModule", { value: !0 });
const P$ = Or, N$ = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, P$.dynamicRef)(e, e.schema)
};
la.default = N$;
Object.defineProperty(ia, "__esModule", { value: !0 });
const I$ = Rr, R$ = Or, O$ = ca, T$ = la, j$ = [I$.default, R$.default, O$.default, T$.default];
ia.default = j$;
var ua = {}, da = {};
Object.defineProperty(da, "__esModule", { value: !0 });
const Yi = us, k$ = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Yi.error,
  code: (e) => (0, Yi.validatePropertyDeps)(e)
};
da.default = k$;
var fa = {};
Object.defineProperty(fa, "__esModule", { value: !0 });
const A$ = us, C$ = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, A$.validateSchemaDeps)(e)
};
fa.default = C$;
var ha = {};
Object.defineProperty(ha, "__esModule", { value: !0 });
const D$ = A, M$ = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, D$.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
ha.default = M$;
Object.defineProperty(ua, "__esModule", { value: !0 });
const L$ = da, V$ = fa, F$ = ha, U$ = [L$.default, V$.default, F$.default];
ua.default = U$;
var ma = {}, pa = {};
Object.defineProperty(pa, "__esModule", { value: !0 });
const bt = x, Zi = A, z$ = Fe, q$ = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, bt._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, G$ = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: q$,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: o } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: a, props: l } = o;
    l instanceof bt.Name ? t.if((0, bt._)`${l} !== true`, () => t.forIn("key", n, (h) => t.if(d(l, h), () => i(h)))) : l !== !0 && t.forIn("key", n, (h) => l === void 0 ? i(h) : t.if(u(l, h), () => i(h))), o.props = !0, e.ok((0, bt._)`${s} === ${z$.default.errors}`);
    function i(h) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: h }), e.error(), a || t.break();
        return;
      }
      if (!(0, Zi.alwaysValidSchema)(o, r)) {
        const E = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: Zi.Type.Str
        }, E), a || t.if((0, bt.not)(E), () => t.break());
      }
    }
    function d(h, E) {
      return (0, bt._)`!${h} || !${h}[${E}]`;
    }
    function u(h, E) {
      const g = [];
      for (const v in h)
        h[v] === !0 && g.push((0, bt._)`${E} !== ${v}`);
      return (0, bt.and)(...g);
    }
  }
};
pa.default = G$;
var $a = {};
Object.defineProperty($a, "__esModule", { value: !0 });
const Yt = x, Qi = A, K$ = {
  message: ({ params: { len: e } }) => (0, Yt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Yt._)`{limit: ${e}}`
}, H$ = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: K$,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, o = s.items || 0;
    if (o === !0)
      return;
    const a = t.const("len", (0, Yt._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: o }), e.fail((0, Yt._)`${a} > ${o}`);
    else if (typeof r == "object" && !(0, Qi.alwaysValidSchema)(s, r)) {
      const i = t.var("valid", (0, Yt._)`${a} <= ${o}`);
      t.if((0, Yt.not)(i), () => l(i, o)), e.ok(i);
    }
    s.items = !0;
    function l(i, d) {
      t.forRange("i", d, a, (u) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: u, dataPropType: Qi.Type.Num }, i), s.allErrors || t.if((0, Yt.not)(i), () => t.break());
      });
    }
  }
};
$a.default = H$;
Object.defineProperty(ma, "__esModule", { value: !0 });
const B$ = pa, W$ = $a, X$ = [B$.default, W$.default];
ma.default = X$;
var ya = {}, ga = {};
Object.defineProperty(ga, "__esModule", { value: !0 });
const pe = x, J$ = {
  message: ({ schemaCode: e }) => (0, pe.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, pe._)`{format: ${e}}`
}, x$ = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: J$,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: o, schemaCode: a, it: l } = e, { opts: i, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!i.validateFormats)
      return;
    s ? E() : g();
    function E() {
      const v = r.scopeValue("formats", {
        ref: h.formats,
        code: i.code.formats
      }), y = r.const("fDef", (0, pe._)`${v}[${a}]`), $ = r.let("fType"), m = r.let("format");
      r.if((0, pe._)`typeof ${y} == "object" && !(${y} instanceof RegExp)`, () => r.assign($, (0, pe._)`${y}.type || "string"`).assign(m, (0, pe._)`${y}.validate`), () => r.assign($, (0, pe._)`"string"`).assign(m, y)), e.fail$data((0, pe.or)(w(), P()));
      function w() {
        return i.strictSchema === !1 ? pe.nil : (0, pe._)`${a} && !${m}`;
      }
      function P() {
        const I = u.$async ? (0, pe._)`(${y}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, pe._)`${m}(${n})`, R = (0, pe._)`(typeof ${m} == "function" ? ${I} : ${m}.test(${n}))`;
        return (0, pe._)`${m} && ${m} !== true && ${$} === ${t} && !${R}`;
      }
    }
    function g() {
      const v = h.formats[o];
      if (!v) {
        w();
        return;
      }
      if (v === !0)
        return;
      const [y, $, m] = P(v);
      y === t && e.pass(I());
      function w() {
        if (i.strictSchema === !1) {
          h.logger.warn(R());
          return;
        }
        throw new Error(R());
        function R() {
          return `unknown format "${o}" ignored in schema at path "${d}"`;
        }
      }
      function P(R) {
        const F = R instanceof RegExp ? (0, pe.regexpCode)(R) : i.code.formats ? (0, pe._)`${i.code.formats}${(0, pe.getProperty)(o)}` : void 0, W = r.scopeValue("formats", { key: o, ref: R, code: F });
        return typeof R == "object" && !(R instanceof RegExp) ? [R.type || "string", R.validate, (0, pe._)`${W}.validate`] : ["string", R, W];
      }
      function I() {
        if (typeof v == "object" && !(v instanceof RegExp) && v.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, pe._)`await ${m}(${n})`;
        }
        return typeof $ == "function" ? (0, pe._)`${m}(${n})` : (0, pe._)`${m}.test(${n})`;
      }
    }
  }
};
ga.default = x$;
Object.defineProperty(ya, "__esModule", { value: !0 });
const Y$ = ga, Z$ = [Y$.default];
ya.default = Z$;
var Er = {};
Object.defineProperty(Er, "__esModule", { value: !0 });
Er.contentVocabulary = Er.metadataVocabulary = void 0;
Er.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Er.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Ao, "__esModule", { value: !0 });
const Q$ = Co, ey = Mo, ty = Xo, ry = ia, ny = ua, sy = ma, oy = ya, ec = Er, ay = [
  ry.default,
  Q$.default,
  ey.default,
  (0, ty.default)(!0),
  oy.default,
  ec.metadataVocabulary,
  ec.contentVocabulary,
  ny.default,
  sy.default
];
Ao.default = ay;
var _a = {}, fs = {};
Object.defineProperty(fs, "__esModule", { value: !0 });
fs.DiscrError = void 0;
var tc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(tc || (fs.DiscrError = tc = {}));
Object.defineProperty(_a, "__esModule", { value: !0 });
const mr = x, to = fs, rc = je, iy = Pr, cy = A, ly = {
  message: ({ params: { discrError: e, tagName: t } }) => e === to.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, mr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, uy = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: ly,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: o } = e, { oneOf: a } = s;
    if (!o.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const l = n.propertyName;
    if (typeof l != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!a)
      throw new Error("discriminator: requires oneOf keyword");
    const i = t.let("valid", !1), d = t.const("tag", (0, mr._)`${r}${(0, mr.getProperty)(l)}`);
    t.if((0, mr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: to.DiscrError.Tag, tag: d, tagName: l })), e.ok(i);
    function u() {
      const g = E();
      t.if(!1);
      for (const v in g)
        t.elseIf((0, mr._)`${d} === ${v}`), t.assign(i, h(g[v]));
      t.else(), e.error(!1, { discrError: to.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(g) {
      const v = t.name("valid"), y = e.subschema({ keyword: "oneOf", schemaProp: g }, v);
      return e.mergeEvaluated(y, mr.Name), v;
    }
    function E() {
      var g;
      const v = {}, y = m(s);
      let $ = !0;
      for (let I = 0; I < a.length; I++) {
        let R = a[I];
        if (R != null && R.$ref && !(0, cy.schemaHasRulesButRef)(R, o.self.RULES)) {
          const W = R.$ref;
          if (R = rc.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, W), R instanceof rc.SchemaEnv && (R = R.schema), R === void 0)
            throw new iy.default(o.opts.uriResolver, o.baseId, W);
        }
        const F = (g = R == null ? void 0 : R.properties) === null || g === void 0 ? void 0 : g[l];
        if (typeof F != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        $ = $ && (y || m(R)), w(F, I);
      }
      if (!$)
        throw new Error(`discriminator: "${l}" must be required`);
      return v;
      function m({ required: I }) {
        return Array.isArray(I) && I.includes(l);
      }
      function w(I, R) {
        if (I.const)
          P(I.const, R);
        else if (I.enum)
          for (const F of I.enum)
            P(F, R);
        else
          throw new Error(`discriminator: "properties/${l}" must have "const" or "enum"`);
      }
      function P(I, R) {
        if (typeof I != "string" || I in v)
          throw new Error(`discriminator: "${l}" values must be unique strings`);
        v[I] = R;
      }
    }
  }
};
_a.default = uy;
var va = {};
const dy = "https://json-schema.org/draft/2020-12/schema", fy = "https://json-schema.org/draft/2020-12/schema", hy = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, my = "meta", py = "Core and Validation specifications meta-schema", $y = [
  {
    $ref: "meta/core"
  },
  {
    $ref: "meta/applicator"
  },
  {
    $ref: "meta/unevaluated"
  },
  {
    $ref: "meta/validation"
  },
  {
    $ref: "meta/meta-data"
  },
  {
    $ref: "meta/format-annotation"
  },
  {
    $ref: "meta/content"
  }
], yy = [
  "object",
  "boolean"
], gy = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", _y = {
  definitions: {
    $comment: '"definitions" has been replaced by "$defs".',
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    deprecated: !0,
    default: {}
  },
  dependencies: {
    $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $dynamicRef: "#meta"
        },
        {
          $ref: "meta/validation#/$defs/stringArray"
        }
      ]
    },
    deprecated: !0,
    default: {}
  },
  $recursiveAnchor: {
    $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
    $ref: "meta/core#/$defs/anchorString",
    deprecated: !0
  },
  $recursiveRef: {
    $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
    $ref: "meta/core#/$defs/uriReferenceString",
    deprecated: !0
  }
}, vy = {
  $schema: dy,
  $id: fy,
  $vocabulary: hy,
  $dynamicAnchor: my,
  title: py,
  allOf: $y,
  type: yy,
  $comment: gy,
  properties: _y
}, wy = "https://json-schema.org/draft/2020-12/schema", Ey = "https://json-schema.org/draft/2020-12/meta/applicator", Sy = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, by = "meta", Py = "Applicator vocabulary meta-schema", Ny = [
  "object",
  "boolean"
], Iy = {
  prefixItems: {
    $ref: "#/$defs/schemaArray"
  },
  items: {
    $dynamicRef: "#meta"
  },
  contains: {
    $dynamicRef: "#meta"
  },
  additionalProperties: {
    $dynamicRef: "#meta"
  },
  properties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependentSchemas: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  propertyNames: {
    $dynamicRef: "#meta"
  },
  if: {
    $dynamicRef: "#meta"
  },
  then: {
    $dynamicRef: "#meta"
  },
  else: {
    $dynamicRef: "#meta"
  },
  allOf: {
    $ref: "#/$defs/schemaArray"
  },
  anyOf: {
    $ref: "#/$defs/schemaArray"
  },
  oneOf: {
    $ref: "#/$defs/schemaArray"
  },
  not: {
    $dynamicRef: "#meta"
  }
}, Ry = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, Oy = {
  $schema: wy,
  $id: Ey,
  $vocabulary: Sy,
  $dynamicAnchor: by,
  title: Py,
  type: Ny,
  properties: Iy,
  $defs: Ry
}, Ty = "https://json-schema.org/draft/2020-12/schema", jy = "https://json-schema.org/draft/2020-12/meta/unevaluated", ky = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, Ay = "meta", Cy = "Unevaluated applicator vocabulary meta-schema", Dy = [
  "object",
  "boolean"
], My = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, Ly = {
  $schema: Ty,
  $id: jy,
  $vocabulary: ky,
  $dynamicAnchor: Ay,
  title: Cy,
  type: Dy,
  properties: My
}, Vy = "https://json-schema.org/draft/2020-12/schema", Fy = "https://json-schema.org/draft/2020-12/meta/content", Uy = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, zy = "meta", qy = "Content vocabulary meta-schema", Gy = [
  "object",
  "boolean"
], Ky = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, Hy = {
  $schema: Vy,
  $id: Fy,
  $vocabulary: Uy,
  $dynamicAnchor: zy,
  title: qy,
  type: Gy,
  properties: Ky
}, By = "https://json-schema.org/draft/2020-12/schema", Wy = "https://json-schema.org/draft/2020-12/meta/core", Xy = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, Jy = "meta", xy = "Core vocabulary meta-schema", Yy = [
  "object",
  "boolean"
], Zy = {
  $id: {
    $ref: "#/$defs/uriReferenceString",
    $comment: "Non-empty fragments not allowed.",
    pattern: "^[^#]*#?$"
  },
  $schema: {
    $ref: "#/$defs/uriString"
  },
  $ref: {
    $ref: "#/$defs/uriReferenceString"
  },
  $anchor: {
    $ref: "#/$defs/anchorString"
  },
  $dynamicRef: {
    $ref: "#/$defs/uriReferenceString"
  },
  $dynamicAnchor: {
    $ref: "#/$defs/anchorString"
  },
  $vocabulary: {
    type: "object",
    propertyNames: {
      $ref: "#/$defs/uriString"
    },
    additionalProperties: {
      type: "boolean"
    }
  },
  $comment: {
    type: "string"
  },
  $defs: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    }
  }
}, Qy = {
  anchorString: {
    type: "string",
    pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
  },
  uriString: {
    type: "string",
    format: "uri"
  },
  uriReferenceString: {
    type: "string",
    format: "uri-reference"
  }
}, eg = {
  $schema: By,
  $id: Wy,
  $vocabulary: Xy,
  $dynamicAnchor: Jy,
  title: xy,
  type: Yy,
  properties: Zy,
  $defs: Qy
}, tg = "https://json-schema.org/draft/2020-12/schema", rg = "https://json-schema.org/draft/2020-12/meta/format-annotation", ng = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, sg = "meta", og = "Format vocabulary meta-schema for annotation results", ag = [
  "object",
  "boolean"
], ig = {
  format: {
    type: "string"
  }
}, cg = {
  $schema: tg,
  $id: rg,
  $vocabulary: ng,
  $dynamicAnchor: sg,
  title: og,
  type: ag,
  properties: ig
}, lg = "https://json-schema.org/draft/2020-12/schema", ug = "https://json-schema.org/draft/2020-12/meta/meta-data", dg = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, fg = "meta", hg = "Meta-data vocabulary meta-schema", mg = [
  "object",
  "boolean"
], pg = {
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  deprecated: {
    type: "boolean",
    default: !1
  },
  readOnly: {
    type: "boolean",
    default: !1
  },
  writeOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  }
}, $g = {
  $schema: lg,
  $id: ug,
  $vocabulary: dg,
  $dynamicAnchor: fg,
  title: hg,
  type: mg,
  properties: pg
}, yg = "https://json-schema.org/draft/2020-12/schema", gg = "https://json-schema.org/draft/2020-12/meta/validation", _g = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, vg = "meta", wg = "Validation vocabulary meta-schema", Eg = [
  "object",
  "boolean"
], Sg = {
  type: {
    anyOf: [
      {
        $ref: "#/$defs/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/$defs/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  const: !0,
  enum: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  maxItems: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  maxContains: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minContains: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 1
  },
  maxProperties: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/$defs/stringArray"
  },
  dependentRequired: {
    type: "object",
    additionalProperties: {
      $ref: "#/$defs/stringArray"
    }
  }
}, bg = {
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 0
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, Pg = {
  $schema: yg,
  $id: gg,
  $vocabulary: _g,
  $dynamicAnchor: vg,
  title: wg,
  type: Eg,
  properties: Sg,
  $defs: bg
};
Object.defineProperty(va, "__esModule", { value: !0 });
const Ng = vy, Ig = Oy, Rg = Ly, Og = Hy, Tg = eg, jg = cg, kg = $g, Ag = Pg, Cg = ["/properties"];
function Dg(e) {
  return [
    Ng,
    Ig,
    Rg,
    Og,
    Tg,
    t(this, jg),
    kg,
    t(this, Ag)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, Cg) : n;
  }
}
va.default = Dg;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = al, n = Ao, s = _a, o = va, a = "https://json-schema.org/draft/2020-12/schema";
  class l extends r.default {
    constructor(g = {}) {
      super({
        ...g,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((g) => this.addVocabulary(g)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: g, meta: v } = this.opts;
      v && (o.default.call(this, g), this.refs["http://json-schema.org/schema"] = a);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
    }
  }
  t.Ajv2020 = l, e.exports = t = l, e.exports.Ajv2020 = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
  var i = xe;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return i.KeywordCxt;
  } });
  var d = x;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return d._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return d.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return d.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return d.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return d.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return d.CodeGen;
  } });
  var u = ln;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return u.default;
  } });
  var h = Pr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(Xs, Xs.exports);
var Mg = Xs.exports, ro = { exports: {} }, nu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(D, q) {
    return { validate: D, compare: q };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(o, a),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(i(!0), d),
    "date-time": t(E(!0), g),
    "iso-time": t(i(), u),
    "iso-date-time": t(E(), v),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: m,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: ie,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
    // byte: https://github.com/miguelmota/is-base64
    byte: P,
    // signed 32 bit integer
    int32: { type: "number", validate: F },
    // signed 64 bit integer
    int64: { type: "number", validate: W },
    // C-type float
    float: { type: "number", validate: Y },
    // C-type double
    double: { type: "number", validate: Y },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, a),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, d),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, g),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, u),
    "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, v),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(D) {
    return D % 4 === 0 && (D % 100 !== 0 || D % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function o(D) {
    const q = n.exec(D);
    if (!q)
      return !1;
    const oe = +q[1], O = +q[2], k = +q[3];
    return O >= 1 && O <= 12 && k >= 1 && k <= (O === 2 && r(oe) ? 29 : s[O]);
  }
  function a(D, q) {
    if (D && q)
      return D > q ? 1 : D < q ? -1 : 0;
  }
  const l = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function i(D) {
    return function(oe) {
      const O = l.exec(oe);
      if (!O)
        return !1;
      const k = +O[1], U = +O[2], M = +O[3], K = O[4], L = O[5] === "-" ? -1 : 1, N = +(O[6] || 0), p = +(O[7] || 0);
      if (N > 23 || p > 59 || D && !K)
        return !1;
      if (k <= 23 && U <= 59 && M < 60)
        return !0;
      const b = U - p * L, _ = k - N * L - (b < 0 ? 1 : 0);
      return (_ === 23 || _ === -1) && (b === 59 || b === -1) && M < 61;
    };
  }
  function d(D, q) {
    if (!(D && q))
      return;
    const oe = (/* @__PURE__ */ new Date("2020-01-01T" + D)).valueOf(), O = (/* @__PURE__ */ new Date("2020-01-01T" + q)).valueOf();
    if (oe && O)
      return oe - O;
  }
  function u(D, q) {
    if (!(D && q))
      return;
    const oe = l.exec(D), O = l.exec(q);
    if (oe && O)
      return D = oe[1] + oe[2] + oe[3], q = O[1] + O[2] + O[3], D > q ? 1 : D < q ? -1 : 0;
  }
  const h = /t|\s/i;
  function E(D) {
    const q = i(D);
    return function(O) {
      const k = O.split(h);
      return k.length === 2 && o(k[0]) && q(k[1]);
    };
  }
  function g(D, q) {
    if (!(D && q))
      return;
    const oe = new Date(D).valueOf(), O = new Date(q).valueOf();
    if (oe && O)
      return oe - O;
  }
  function v(D, q) {
    if (!(D && q))
      return;
    const [oe, O] = D.split(h), [k, U] = q.split(h), M = a(oe, k);
    if (M !== void 0)
      return M || d(O, U);
  }
  const y = /\/|:/, $ = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(D) {
    return y.test(D) && $.test(D);
  }
  const w = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function P(D) {
    return w.lastIndex = 0, w.test(D);
  }
  const I = -2147483648, R = 2 ** 31 - 1;
  function F(D) {
    return Number.isInteger(D) && D <= R && D >= I;
  }
  function W(D) {
    return Number.isInteger(D);
  }
  function Y() {
    return !0;
  }
  const ce = /[^\\]\\Z/;
  function ie(D) {
    if (ce.test(D))
      return !1;
    try {
      return new RegExp(D), !0;
    } catch {
      return !1;
    }
  }
})(nu);
var su = {}, no = { exports: {} }, ou = {}, Ye = {}, Sr = {}, dn = {}, te = {}, an = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(w) {
      if (super(), !e.IDENTIFIER.test(w))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = w;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(w) {
      super(), this._items = typeof w == "string" ? [w] : w;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const w = this._items[0];
      return w === "" || w === '""';
    }
    get str() {
      var w;
      return (w = this._str) !== null && w !== void 0 ? w : this._str = this._items.reduce((P, I) => `${P}${I}`, "");
    }
    get names() {
      var w;
      return (w = this._names) !== null && w !== void 0 ? w : this._names = this._items.reduce((P, I) => (I instanceof r && (P[I.str] = (P[I.str] || 0) + 1), P), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...w) {
    const P = [m[0]];
    let I = 0;
    for (; I < w.length; )
      l(P, w[I]), P.push(m[++I]);
    return new n(P);
  }
  e._ = s;
  const o = new n("+");
  function a(m, ...w) {
    const P = [g(m[0])];
    let I = 0;
    for (; I < w.length; )
      P.push(o), l(P, w[I]), P.push(o, g(m[++I]));
    return i(P), new n(P);
  }
  e.str = a;
  function l(m, w) {
    w instanceof n ? m.push(...w._items) : w instanceof r ? m.push(w) : m.push(h(w));
  }
  e.addCodeArg = l;
  function i(m) {
    let w = 1;
    for (; w < m.length - 1; ) {
      if (m[w] === o) {
        const P = d(m[w - 1], m[w + 1]);
        if (P !== void 0) {
          m.splice(w - 1, 3, P);
          continue;
        }
        m[w++] = "+";
      }
      w++;
    }
  }
  function d(m, w) {
    if (w === '""')
      return m;
    if (m === '""')
      return w;
    if (typeof m == "string")
      return w instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof w != "string" ? `${m.slice(0, -1)}${w}"` : w[0] === '"' ? m.slice(0, -1) + w.slice(1) : void 0;
    if (typeof w == "string" && w[0] === '"' && !(m instanceof r))
      return `"${m}${w.slice(1)}`;
  }
  function u(m, w) {
    return w.emptyStr() ? m : m.emptyStr() ? w : a`${m}${w}`;
  }
  e.strConcat = u;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : g(Array.isArray(m) ? m.join(",") : m);
  }
  function E(m) {
    return new n(g(m));
  }
  e.stringify = E;
  function g(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = g;
  function v(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = v;
  function y(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = y;
  function $(m) {
    return new n(m.toString());
  }
  e.regexpCode = $;
})(an);
var so = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = an;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(i) {
    i[i.Started = 0] = "Started", i[i.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: u } = {}) {
      this._names = {}, this._prefixes = d, this._parent = u;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const u = this._names[d] || this._nameGroup(d);
      return `${d}${u.index++}`;
    }
    _nameGroup(d) {
      var u, h;
      if (!((h = (u = this._parent) === null || u === void 0 ? void 0 : u._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class o extends t.Name {
    constructor(d, u) {
      super(u), this.prefix = d;
    }
    setValue(d, { property: u, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(u)}[${h}]`;
    }
  }
  e.ValueScopeName = o;
  const a = (0, t._)`\n`;
  class l extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? a : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new o(d, this._newName(d));
    }
    value(d, u) {
      var h;
      if (u.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const E = this.toName(d), { prefix: g } = E, v = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let y = this._values[g];
      if (y) {
        const w = y.get(v);
        if (w)
          return w;
      } else
        y = this._values[g] = /* @__PURE__ */ new Map();
      y.set(v, E);
      const $ = this._scope[g] || (this._scope[g] = []), m = $.length;
      return $[m] = u.ref, E.setValue(u, { property: g, itemIndex: m }), E;
    }
    getValue(d, u) {
      const h = this._values[d];
      if (h)
        return h.get(u);
    }
    scopeRefs(d, u = this._values) {
      return this._reduceValues(u, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, u, h) {
      return this._reduceValues(d, (E) => {
        if (E.value === void 0)
          throw new Error(`CodeGen: name "${E}" has no value`);
        return E.value.code;
      }, u, h);
    }
    _reduceValues(d, u, h = {}, E) {
      let g = t.nil;
      for (const v in d) {
        const y = d[v];
        if (!y)
          continue;
        const $ = h[v] = h[v] || /* @__PURE__ */ new Map();
        y.forEach((m) => {
          if ($.has(m))
            return;
          $.set(m, n.Started);
          let w = u(m);
          if (w) {
            const P = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            g = (0, t._)`${g}${P} ${m} = ${w};${this.opts._n}`;
          } else if (w = E == null ? void 0 : E(m))
            g = (0, t._)`${g}${w}${this.opts._n}`;
          else
            throw new r(m);
          $.set(m, n.Completed);
        });
      }
      return g;
    }
  }
  e.ValueScope = l;
})(so);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = an, r = so;
  var n = an;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = so;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class o {
    optimizeNodes() {
      return this;
    }
    optimizeNames(c, f) {
      return this;
    }
  }
  class a extends o {
    constructor(c, f, S) {
      super(), this.varKind = c, this.name = f, this.rhs = S;
    }
    render({ es5: c, _n: f }) {
      const S = c ? r.varKinds.var : this.varKind, T = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${S} ${this.name}${T};` + f;
    }
    optimizeNames(c, f) {
      if (c[this.name.str])
        return this.rhs && (this.rhs = O(this.rhs, c, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class l extends o {
    constructor(c, f, S) {
      super(), this.lhs = c, this.rhs = f, this.sideEffects = S;
    }
    render({ _n: c }) {
      return `${this.lhs} = ${this.rhs};` + c;
    }
    optimizeNames(c, f) {
      if (!(this.lhs instanceof t.Name && !c[this.lhs.str] && !this.sideEffects))
        return this.rhs = O(this.rhs, c, f), this;
    }
    get names() {
      const c = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return oe(c, this.rhs);
    }
  }
  class i extends l {
    constructor(c, f, S, T) {
      super(c, S, T), this.op = f;
    }
    render({ _n: c }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + c;
    }
  }
  class d extends o {
    constructor(c) {
      super(), this.label = c, this.names = {};
    }
    render({ _n: c }) {
      return `${this.label}:` + c;
    }
  }
  class u extends o {
    constructor(c) {
      super(), this.label = c, this.names = {};
    }
    render({ _n: c }) {
      return `break${this.label ? ` ${this.label}` : ""};` + c;
    }
  }
  class h extends o {
    constructor(c) {
      super(), this.error = c;
    }
    render({ _n: c }) {
      return `throw ${this.error};` + c;
    }
    get names() {
      return this.error.names;
    }
  }
  class E extends o {
    constructor(c) {
      super(), this.code = c;
    }
    render({ _n: c }) {
      return `${this.code};` + c;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(c, f) {
      return this.code = O(this.code, c, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class g extends o {
    constructor(c = []) {
      super(), this.nodes = c;
    }
    render(c) {
      return this.nodes.reduce((f, S) => f + S.render(c), "");
    }
    optimizeNodes() {
      const { nodes: c } = this;
      let f = c.length;
      for (; f--; ) {
        const S = c[f].optimizeNodes();
        Array.isArray(S) ? c.splice(f, 1, ...S) : S ? c[f] = S : c.splice(f, 1);
      }
      return c.length > 0 ? this : void 0;
    }
    optimizeNames(c, f) {
      const { nodes: S } = this;
      let T = S.length;
      for (; T--; ) {
        const j = S[T];
        j.optimizeNames(c, f) || (k(c, j.names), S.splice(T, 1));
      }
      return S.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((c, f) => q(c, f.names), {});
    }
  }
  class v extends g {
    render(c) {
      return "{" + c._n + super.render(c) + "}" + c._n;
    }
  }
  class y extends g {
  }
  class $ extends v {
  }
  $.kind = "else";
  class m extends v {
    constructor(c, f) {
      super(f), this.condition = c;
    }
    render(c) {
      let f = `if(${this.condition})` + super.render(c);
      return this.else && (f += "else " + this.else.render(c)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const c = this.condition;
      if (c === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const S = f.optimizeNodes();
        f = this.else = Array.isArray(S) ? new $(S) : S;
      }
      if (f)
        return c === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(U(c), f instanceof m ? [f] : f.nodes);
      if (!(c === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(c, f) {
      var S;
      if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(c, f), !!(super.optimizeNames(c, f) || this.else))
        return this.condition = O(this.condition, c, f), this;
    }
    get names() {
      const c = super.names;
      return oe(c, this.condition), this.else && q(c, this.else.names), c;
    }
  }
  m.kind = "if";
  class w extends v {
  }
  w.kind = "for";
  class P extends w {
    constructor(c) {
      super(), this.iteration = c;
    }
    render(c) {
      return `for(${this.iteration})` + super.render(c);
    }
    optimizeNames(c, f) {
      if (super.optimizeNames(c, f))
        return this.iteration = O(this.iteration, c, f), this;
    }
    get names() {
      return q(super.names, this.iteration.names);
    }
  }
  class I extends w {
    constructor(c, f, S, T) {
      super(), this.varKind = c, this.name = f, this.from = S, this.to = T;
    }
    render(c) {
      const f = c.es5 ? r.varKinds.var : this.varKind, { name: S, from: T, to: j } = this;
      return `for(${f} ${S}=${T}; ${S}<${j}; ${S}++)` + super.render(c);
    }
    get names() {
      const c = oe(super.names, this.from);
      return oe(c, this.to);
    }
  }
  class R extends w {
    constructor(c, f, S, T) {
      super(), this.loop = c, this.varKind = f, this.name = S, this.iterable = T;
    }
    render(c) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(c);
    }
    optimizeNames(c, f) {
      if (super.optimizeNames(c, f))
        return this.iterable = O(this.iterable, c, f), this;
    }
    get names() {
      return q(super.names, this.iterable.names);
    }
  }
  class F extends v {
    constructor(c, f, S) {
      super(), this.name = c, this.args = f, this.async = S;
    }
    render(c) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(c);
    }
  }
  F.kind = "func";
  class W extends g {
    render(c) {
      return "return " + super.render(c);
    }
  }
  W.kind = "return";
  class Y extends v {
    render(c) {
      let f = "try" + super.render(c);
      return this.catch && (f += this.catch.render(c)), this.finally && (f += this.finally.render(c)), f;
    }
    optimizeNodes() {
      var c, f;
      return super.optimizeNodes(), (c = this.catch) === null || c === void 0 || c.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(c, f) {
      var S, T;
      return super.optimizeNames(c, f), (S = this.catch) === null || S === void 0 || S.optimizeNames(c, f), (T = this.finally) === null || T === void 0 || T.optimizeNames(c, f), this;
    }
    get names() {
      const c = super.names;
      return this.catch && q(c, this.catch.names), this.finally && q(c, this.finally.names), c;
    }
  }
  class ce extends v {
    constructor(c) {
      super(), this.error = c;
    }
    render(c) {
      return `catch(${this.error})` + super.render(c);
    }
  }
  ce.kind = "catch";
  class ie extends v {
    render(c) {
      return "finally" + super.render(c);
    }
  }
  ie.kind = "finally";
  class D {
    constructor(c, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = c, this._scope = new r.Scope({ parent: c }), this._nodes = [new y()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(c) {
      return this._scope.name(c);
    }
    // reserves unique name in the external scope
    scopeName(c) {
      return this._extScope.name(c);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(c, f) {
      const S = this._extScope.value(c, f);
      return (this._values[S.prefix] || (this._values[S.prefix] = /* @__PURE__ */ new Set())).add(S), S;
    }
    getScopeValue(c, f) {
      return this._extScope.getValue(c, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(c) {
      return this._extScope.scopeRefs(c, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(c, f, S, T) {
      const j = this._scope.toName(f);
      return S !== void 0 && T && (this._constants[j.str] = S), this._leafNode(new a(c, j, S)), j;
    }
    // `const` declaration (`var` in es5 mode)
    const(c, f, S) {
      return this._def(r.varKinds.const, c, f, S);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(c, f, S) {
      return this._def(r.varKinds.let, c, f, S);
    }
    // `var` declaration with optional assignment
    var(c, f, S) {
      return this._def(r.varKinds.var, c, f, S);
    }
    // assignment code
    assign(c, f, S) {
      return this._leafNode(new l(c, f, S));
    }
    // `+=` code
    add(c, f) {
      return this._leafNode(new i(c, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(c) {
      return typeof c == "function" ? c() : c !== t.nil && this._leafNode(new E(c)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...c) {
      const f = ["{"];
      for (const [S, T] of c)
        f.length > 1 && f.push(","), f.push(S), (S !== T || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, T));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(c, f, S) {
      if (this._blockNode(new m(c)), f && S)
        this.code(f).else().code(S).endIf();
      else if (f)
        this.code(f).endIf();
      else if (S)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(c) {
      return this._elseNode(new m(c));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new $());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, $);
    }
    _for(c, f) {
      return this._blockNode(c), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(c, f) {
      return this._for(new P(c), f);
    }
    // `for` statement for a range of values
    forRange(c, f, S, T, j = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const G = this._scope.toName(c);
      return this._for(new I(j, G, f, S), () => T(G));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(c, f, S, T = r.varKinds.const) {
      const j = this._scope.toName(c);
      if (this.opts.es5) {
        const G = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${G}.length`, (z) => {
          this.var(j, (0, t._)`${G}[${z}]`), S(j);
        });
      }
      return this._for(new R("of", T, j, f), () => S(j));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(c, f, S, T = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(c, (0, t._)`Object.keys(${f})`, S);
      const j = this._scope.toName(c);
      return this._for(new R("in", T, j, f), () => S(j));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(w);
    }
    // `label` statement
    label(c) {
      return this._leafNode(new d(c));
    }
    // `break` statement
    break(c) {
      return this._leafNode(new u(c));
    }
    // `return` statement
    return(c) {
      const f = new W();
      if (this._blockNode(f), this.code(c), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(W);
    }
    // `try` statement
    try(c, f, S) {
      if (!f && !S)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const T = new Y();
      if (this._blockNode(T), this.code(c), f) {
        const j = this.name("e");
        this._currNode = T.catch = new ce(j), f(j);
      }
      return S && (this._currNode = T.finally = new ie(), this.code(S)), this._endBlockNode(ce, ie);
    }
    // `throw` statement
    throw(c) {
      return this._leafNode(new h(c));
    }
    // start self-balancing block
    block(c, f) {
      return this._blockStarts.push(this._nodes.length), c && this.code(c).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(c) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const S = this._nodes.length - f;
      if (S < 0 || c !== void 0 && S !== c)
        throw new Error(`CodeGen: wrong number of nodes: ${S} vs ${c} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(c, f = t.nil, S, T) {
      return this._blockNode(new F(c, f, S)), T && this.code(T).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(F);
    }
    optimize(c = 1) {
      for (; c-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(c) {
      return this._currNode.nodes.push(c), this;
    }
    _blockNode(c) {
      this._currNode.nodes.push(c), this._nodes.push(c);
    }
    _endBlockNode(c, f) {
      const S = this._currNode;
      if (S instanceof c || f && S instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${c.kind}/${f.kind}` : c.kind}"`);
    }
    _elseNode(c) {
      const f = this._currNode;
      if (!(f instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = c, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const c = this._nodes;
      return c[c.length - 1];
    }
    set _currNode(c) {
      const f = this._nodes;
      f[f.length - 1] = c;
    }
  }
  e.CodeGen = D;
  function q(_, c) {
    for (const f in c)
      _[f] = (_[f] || 0) + (c[f] || 0);
    return _;
  }
  function oe(_, c) {
    return c instanceof t._CodeOrName ? q(_, c.names) : _;
  }
  function O(_, c, f) {
    if (_ instanceof t.Name)
      return S(_);
    if (!T(_))
      return _;
    return new t._Code(_._items.reduce((j, G) => (G instanceof t.Name && (G = S(G)), G instanceof t._Code ? j.push(...G._items) : j.push(G), j), []));
    function S(j) {
      const G = f[j.str];
      return G === void 0 || c[j.str] !== 1 ? j : (delete c[j.str], G);
    }
    function T(j) {
      return j instanceof t._Code && j._items.some((G) => G instanceof t.Name && c[G.str] === 1 && f[G.str] !== void 0);
    }
  }
  function k(_, c) {
    for (const f in c)
      _[f] = (_[f] || 0) - (c[f] || 0);
  }
  function U(_) {
    return typeof _ == "boolean" || typeof _ == "number" || _ === null ? !_ : (0, t._)`!${b(_)}`;
  }
  e.not = U;
  const M = p(e.operators.AND);
  function K(..._) {
    return _.reduce(M);
  }
  e.and = K;
  const L = p(e.operators.OR);
  function N(..._) {
    return _.reduce(L);
  }
  e.or = N;
  function p(_) {
    return (c, f) => c === t.nil ? f : f === t.nil ? c : (0, t._)`${b(c)} ${_} ${b(f)}`;
  }
  function b(_) {
    return _ instanceof t.Name ? _ : (0, t._)`(${_})`;
  }
})(te);
var V = {};
Object.defineProperty(V, "__esModule", { value: !0 });
V.checkStrictMode = V.getErrorPath = V.Type = V.useFunc = V.setEvaluated = V.evaluatedPropsToName = V.mergeEvaluated = V.eachItem = V.unescapeJsonPointer = V.escapeJsonPointer = V.escapeFragment = V.unescapeFragment = V.schemaRefOrVal = V.schemaHasRulesButRef = V.schemaHasRules = V.checkUnknownRules = V.alwaysValidSchema = V.toHash = void 0;
const ue = te, Lg = an;
function Vg(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
V.toHash = Vg;
function Fg(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (au(e, t), !iu(t, e.self.RULES.all));
}
V.alwaysValidSchema = Fg;
function au(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const o in t)
    s[o] || uu(e, `unknown keyword: "${o}"`);
}
V.checkUnknownRules = au;
function iu(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
V.schemaHasRules = iu;
function Ug(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
V.schemaHasRulesButRef = Ug;
function zg({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ue._)`${r}`;
  }
  return (0, ue._)`${e}${t}${(0, ue.getProperty)(n)}`;
}
V.schemaRefOrVal = zg;
function qg(e) {
  return cu(decodeURIComponent(e));
}
V.unescapeFragment = qg;
function Gg(e) {
  return encodeURIComponent(wa(e));
}
V.escapeFragment = Gg;
function wa(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
V.escapeJsonPointer = wa;
function cu(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
V.unescapeJsonPointer = cu;
function Kg(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
V.eachItem = Kg;
function nc({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, o, a, l) => {
    const i = a === void 0 ? o : a instanceof ue.Name ? (o instanceof ue.Name ? e(s, o, a) : t(s, o, a), a) : o instanceof ue.Name ? (t(s, a, o), o) : r(o, a);
    return l === ue.Name && !(i instanceof ue.Name) ? n(s, i) : i;
  };
}
V.mergeEvaluated = {
  props: nc({
    mergeNames: (e, t, r) => e.if((0, ue._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ue._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ue._)`${r} || {}`).code((0, ue._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ue._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ue._)`${r} || {}`), Ea(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: lu
  }),
  items: nc({
    mergeNames: (e, t, r) => e.if((0, ue._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ue._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ue._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ue._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function lu(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ue._)`{}`);
  return t !== void 0 && Ea(e, r, t), r;
}
V.evaluatedPropsToName = lu;
function Ea(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ue._)`${t}${(0, ue.getProperty)(n)}`, !0));
}
V.setEvaluated = Ea;
const sc = {};
function Hg(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: sc[t.code] || (sc[t.code] = new Lg._Code(t.code))
  });
}
V.useFunc = Hg;
var oo;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(oo || (V.Type = oo = {}));
function Bg(e, t, r) {
  if (e instanceof ue.Name) {
    const n = t === oo.Num;
    return r ? n ? (0, ue._)`"[" + ${e} + "]"` : (0, ue._)`"['" + ${e} + "']"` : n ? (0, ue._)`"/" + ${e}` : (0, ue._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ue.getProperty)(e).toString() : "/" + wa(e);
}
V.getErrorPath = Bg;
function uu(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
V.checkStrictMode = uu;
var at = {};
Object.defineProperty(at, "__esModule", { value: !0 });
const Ne = te, Wg = {
  // validation function arguments
  data: new Ne.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Ne.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Ne.Name("instancePath"),
  parentData: new Ne.Name("parentData"),
  parentDataProperty: new Ne.Name("parentDataProperty"),
  rootData: new Ne.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Ne.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Ne.Name("vErrors"),
  // null or array of validation errors
  errors: new Ne.Name("errors"),
  // counter of validation errors
  this: new Ne.Name("this"),
  // "globals"
  self: new Ne.Name("self"),
  scope: new Ne.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Ne.Name("json"),
  jsonPos: new Ne.Name("jsonPos"),
  jsonLen: new Ne.Name("jsonLen"),
  jsonPart: new Ne.Name("jsonPart")
};
at.default = Wg;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = te, r = V, n = at;
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: m }) => m ? (0, t.str)`"${$}" keyword must be ${m} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, m = e.keywordError, w, P) {
    const { it: I } = $, { gen: R, compositeRule: F, allErrors: W } = I, Y = h($, m, w);
    P ?? (F || W) ? i(R, Y) : d(I, (0, t._)`[${Y}]`);
  }
  e.reportError = s;
  function o($, m = e.keywordError, w) {
    const { it: P } = $, { gen: I, compositeRule: R, allErrors: F } = P, W = h($, m, w);
    i(I, W), R || F || d(P, n.default.vErrors);
  }
  e.reportExtraError = o;
  function a($, m) {
    $.assign(n.default.errors, m), $.if((0, t._)`${n.default.vErrors} !== null`, () => $.if(m, () => $.assign((0, t._)`${n.default.vErrors}.length`, m), () => $.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function l({ gen: $, keyword: m, schemaValue: w, data: P, errsCount: I, it: R }) {
    if (I === void 0)
      throw new Error("ajv implementation error");
    const F = $.name("err");
    $.forRange("i", I, n.default.errors, (W) => {
      $.const(F, (0, t._)`${n.default.vErrors}[${W}]`), $.if((0, t._)`${F}.instancePath === undefined`, () => $.assign((0, t._)`${F}.instancePath`, (0, t.strConcat)(n.default.instancePath, R.errorPath))), $.assign((0, t._)`${F}.schemaPath`, (0, t.str)`${R.errSchemaPath}/${m}`), R.opts.verbose && ($.assign((0, t._)`${F}.schema`, w), $.assign((0, t._)`${F}.data`, P));
    });
  }
  e.extendErrors = l;
  function i($, m) {
    const w = $.const("err", m);
    $.if((0, t._)`${n.default.vErrors} === null`, () => $.assign(n.default.vErrors, (0, t._)`[${w}]`), (0, t._)`${n.default.vErrors}.push(${w})`), $.code((0, t._)`${n.default.errors}++`);
  }
  function d($, m) {
    const { gen: w, validateName: P, schemaEnv: I } = $;
    I.$async ? w.throw((0, t._)`new ${$.ValidationError}(${m})`) : (w.assign((0, t._)`${P}.errors`, m), w.return(!1));
  }
  const u = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h($, m, w) {
    const { createErrors: P } = $.it;
    return P === !1 ? (0, t._)`{}` : E($, m, w);
  }
  function E($, m, w = {}) {
    const { gen: P, it: I } = $, R = [
      g(I, w),
      v($, w)
    ];
    return y($, m, R), P.object(...R);
  }
  function g({ errorPath: $ }, { instancePath: m }) {
    const w = m ? (0, t.str)`${$}${(0, r.getErrorPath)(m, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, w)];
  }
  function v({ keyword: $, it: { errSchemaPath: m } }, { schemaPath: w, parentSchema: P }) {
    let I = P ? m : (0, t.str)`${m}/${$}`;
    return w && (I = (0, t.str)`${I}${(0, r.getErrorPath)(w, r.Type.Str)}`), [u.schemaPath, I];
  }
  function y($, { params: m, message: w }, P) {
    const { keyword: I, data: R, schemaValue: F, it: W } = $, { opts: Y, propertyName: ce, topSchemaRef: ie, schemaPath: D } = W;
    P.push([u.keyword, I], [u.params, typeof m == "function" ? m($) : m || (0, t._)`{}`]), Y.messages && P.push([u.message, typeof w == "function" ? w($) : w]), Y.verbose && P.push([u.schema, F], [u.parentSchema, (0, t._)`${ie}${D}`], [n.default.data, R]), ce && P.push([u.propertyName, ce]);
  }
})(dn);
Object.defineProperty(Sr, "__esModule", { value: !0 });
Sr.boolOrEmptySchema = Sr.topBoolOrEmptySchema = void 0;
const Xg = dn, Jg = te, xg = at, Yg = {
  message: "boolean schema is false"
};
function Zg(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? du(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(xg.default.data) : (t.assign((0, Jg._)`${n}.errors`, null), t.return(!0));
}
Sr.topBoolOrEmptySchema = Zg;
function Qg(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), du(e)) : r.var(t, !0);
}
Sr.boolOrEmptySchema = Qg;
function du(e, t) {
  const { gen: r, data: n } = e, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, Xg.reportError)(s, Yg, void 0, t);
}
var ge = {}, sr = {};
Object.defineProperty(sr, "__esModule", { value: !0 });
sr.getRules = sr.isJSONType = void 0;
const e0 = ["string", "number", "integer", "boolean", "null", "object", "array"], t0 = new Set(e0);
function r0(e) {
  return typeof e == "string" && t0.has(e);
}
sr.isJSONType = r0;
function n0() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
sr.getRules = n0;
var ft = {};
Object.defineProperty(ft, "__esModule", { value: !0 });
ft.shouldUseRule = ft.shouldUseGroup = ft.schemaHasRulesForType = void 0;
function s0({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && fu(e, n);
}
ft.schemaHasRulesForType = s0;
function fu(e, t) {
  return t.rules.some((r) => hu(e, r));
}
ft.shouldUseGroup = fu;
function hu(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
ft.shouldUseRule = hu;
Object.defineProperty(ge, "__esModule", { value: !0 });
ge.reportTypeError = ge.checkDataTypes = ge.checkDataType = ge.coerceAndCheckDataType = ge.getJSONTypes = ge.getSchemaTypes = ge.DataType = void 0;
const o0 = sr, a0 = ft, i0 = dn, Q = te, mu = V;
var _r;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(_r || (ge.DataType = _r = {}));
function c0(e) {
  const t = pu(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
ge.getSchemaTypes = c0;
function pu(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(o0.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ge.getJSONTypes = pu;
function l0(e, t) {
  const { gen: r, data: n, opts: s } = e, o = u0(t, s.coerceTypes), a = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, a0.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const l = Sa(t, n, s.strictNumbers, _r.Wrong);
    r.if(l, () => {
      o.length ? d0(e, t, o) : ba(e);
    });
  }
  return a;
}
ge.coerceAndCheckDataType = l0;
const $u = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function u0(e, t) {
  return t ? e.filter((r) => $u.has(r) || t === "array" && r === "array") : [];
}
function d0(e, t, r) {
  const { gen: n, data: s, opts: o } = e, a = n.let("dataType", (0, Q._)`typeof ${s}`), l = n.let("coerced", (0, Q._)`undefined`);
  o.coerceTypes === "array" && n.if((0, Q._)`${a} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, Q._)`${s}[0]`).assign(a, (0, Q._)`typeof ${s}`).if(Sa(t, s, o.strictNumbers), () => n.assign(l, s))), n.if((0, Q._)`${l} !== undefined`);
  for (const d of r)
    ($u.has(d) || d === "array" && o.coerceTypes === "array") && i(d);
  n.else(), ba(e), n.endIf(), n.if((0, Q._)`${l} !== undefined`, () => {
    n.assign(s, l), f0(e, l);
  });
  function i(d) {
    switch (d) {
      case "string":
        n.elseIf((0, Q._)`${a} == "number" || ${a} == "boolean"`).assign(l, (0, Q._)`"" + ${s}`).elseIf((0, Q._)`${s} === null`).assign(l, (0, Q._)`""`);
        return;
      case "number":
        n.elseIf((0, Q._)`${a} == "boolean" || ${s} === null
              || (${a} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, Q._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, Q._)`${a} === "boolean" || ${s} === null
              || (${a} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, Q._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, Q._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, Q._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, Q._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, Q._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${s} === null`).assign(l, (0, Q._)`[${s}]`);
    }
  }
}
function f0({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, Q._)`${t} !== undefined`, () => e.assign((0, Q._)`${t}[${r}]`, n));
}
function ao(e, t, r, n = _r.Correct) {
  const s = n === _r.Correct ? Q.operators.EQ : Q.operators.NEQ;
  let o;
  switch (e) {
    case "null":
      return (0, Q._)`${t} ${s} null`;
    case "array":
      o = (0, Q._)`Array.isArray(${t})`;
      break;
    case "object":
      o = (0, Q._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      o = a((0, Q._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      o = a();
      break;
    default:
      return (0, Q._)`typeof ${t} ${s} ${e}`;
  }
  return n === _r.Correct ? o : (0, Q.not)(o);
  function a(l = Q.nil) {
    return (0, Q.and)((0, Q._)`typeof ${t} == "number"`, l, r ? (0, Q._)`isFinite(${t})` : Q.nil);
  }
}
ge.checkDataType = ao;
function Sa(e, t, r, n) {
  if (e.length === 1)
    return ao(e[0], t, r, n);
  let s;
  const o = (0, mu.toHash)(e);
  if (o.array && o.object) {
    const a = (0, Q._)`typeof ${t} != "object"`;
    s = o.null ? a : (0, Q._)`!${t} || ${a}`, delete o.null, delete o.array, delete o.object;
  } else
    s = Q.nil;
  o.number && delete o.integer;
  for (const a in o)
    s = (0, Q.and)(s, ao(a, t, r, n));
  return s;
}
ge.checkDataTypes = Sa;
const h0 = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, Q._)`{type: ${e}}` : (0, Q._)`{type: ${t}}`
};
function ba(e) {
  const t = m0(e);
  (0, i0.reportError)(t, h0);
}
ge.reportTypeError = ba;
function m0(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, mu.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: e
  };
}
var hs = {};
Object.defineProperty(hs, "__esModule", { value: !0 });
hs.assignDefaults = void 0;
const lr = te, p0 = V;
function $0(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      oc(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, o) => oc(e, o, s.default));
}
hs.assignDefaults = $0;
function oc(e, t, r) {
  const { gen: n, compositeRule: s, data: o, opts: a } = e;
  if (r === void 0)
    return;
  const l = (0, lr._)`${o}${(0, lr.getProperty)(t)}`;
  if (s) {
    (0, p0.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let i = (0, lr._)`${l} === undefined`;
  a.useDefaults === "empty" && (i = (0, lr._)`${i} || ${l} === null || ${l} === ""`), n.if(i, (0, lr._)`${l} = ${(0, lr.stringify)(r)}`);
}
var ot = {}, se = {};
Object.defineProperty(se, "__esModule", { value: !0 });
se.validateUnion = se.validateArray = se.usePattern = se.callValidateCode = se.schemaProperties = se.allSchemaProperties = se.noPropertyInData = se.propertyInData = se.isOwnProperty = se.hasPropFunc = se.reportMissingProp = se.checkMissingProp = se.checkReportMissingProp = void 0;
const fe = te, Pa = V, Et = at, y0 = V;
function g0(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Ia(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, fe._)`${t}` }, !0), e.error();
  });
}
se.checkReportMissingProp = g0;
function _0({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, fe.or)(...n.map((o) => (0, fe.and)(Ia(e, t, o, r.ownProperties), (0, fe._)`${s} = ${o}`)));
}
se.checkMissingProp = _0;
function v0(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
se.reportMissingProp = v0;
function yu(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, fe._)`Object.prototype.hasOwnProperty`
  });
}
se.hasPropFunc = yu;
function Na(e, t, r) {
  return (0, fe._)`${yu(e)}.call(${t}, ${r})`;
}
se.isOwnProperty = Na;
function w0(e, t, r, n) {
  const s = (0, fe._)`${t}${(0, fe.getProperty)(r)} !== undefined`;
  return n ? (0, fe._)`${s} && ${Na(e, t, r)}` : s;
}
se.propertyInData = w0;
function Ia(e, t, r, n) {
  const s = (0, fe._)`${t}${(0, fe.getProperty)(r)} === undefined`;
  return n ? (0, fe.or)(s, (0, fe.not)(Na(e, t, r))) : s;
}
se.noPropertyInData = Ia;
function gu(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
se.allSchemaProperties = gu;
function E0(e, t) {
  return gu(t).filter((r) => !(0, Pa.alwaysValidSchema)(e, t[r]));
}
se.schemaProperties = E0;
function S0({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: o }, it: a }, l, i, d) {
  const u = d ? (0, fe._)`${e}, ${t}, ${n}${s}` : t, h = [
    [Et.default.instancePath, (0, fe.strConcat)(Et.default.instancePath, o)],
    [Et.default.parentData, a.parentData],
    [Et.default.parentDataProperty, a.parentDataProperty],
    [Et.default.rootData, Et.default.rootData]
  ];
  a.opts.dynamicRef && h.push([Et.default.dynamicAnchors, Et.default.dynamicAnchors]);
  const E = (0, fe._)`${u}, ${r.object(...h)}`;
  return i !== fe.nil ? (0, fe._)`${l}.call(${i}, ${E})` : (0, fe._)`${l}(${E})`;
}
se.callValidateCode = S0;
const b0 = (0, fe._)`new RegExp`;
function P0({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, o = s(r, n);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, fe._)`${s.code === "new RegExp" ? b0 : (0, y0.useFunc)(e, s)}(${r}, ${n})`
  });
}
se.usePattern = P0;
function N0(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, o = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return a(() => t.assign(l, !1)), l;
  }
  return t.var(o, !0), a(() => t.break()), o;
  function a(l) {
    const i = t.const("len", (0, fe._)`${r}.length`);
    t.forRange("i", 0, i, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: Pa.Type.Num
      }, o), t.if((0, fe.not)(o), l);
    });
  }
}
se.validateArray = N0;
function I0(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((i) => (0, Pa.alwaysValidSchema)(s, i)) && !s.opts.unevaluated)
    return;
  const a = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((i, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(a, (0, fe._)`${a} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, fe.not)(a));
  })), e.result(a, () => e.reset(), () => e.error(!0));
}
se.validateUnion = I0;
Object.defineProperty(ot, "__esModule", { value: !0 });
ot.validateKeywordUsage = ot.validSchemaType = ot.funcKeywordCode = ot.macroKeywordCode = void 0;
const Te = te, Zt = at, R0 = se, O0 = dn;
function T0(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: o, it: a } = e, l = t.macro.call(a.self, s, o, a), i = _u(r, n, l);
  a.opts.validateSchema !== !1 && a.self.validateSchema(l, !0);
  const d = r.name("valid");
  e.subschema({
    schema: l,
    schemaPath: Te.nil,
    errSchemaPath: `${a.errSchemaPath}/${n}`,
    topSchemaRef: i,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
ot.macroKeywordCode = T0;
function j0(e, t) {
  var r;
  const { gen: n, keyword: s, schema: o, parentSchema: a, $data: l, it: i } = e;
  A0(i, t);
  const d = !l && t.compile ? t.compile.call(i.self, o, a, i) : t.validate, u = _u(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      y(), t.modifying && ac(e), $(() => e.error());
    else {
      const m = t.async ? g() : v();
      t.modifying && ac(e), $(() => k0(e, m));
    }
  }
  function g() {
    const m = n.let("ruleErrs", null);
    return n.try(() => y((0, Te._)`await `), (w) => n.assign(h, !1).if((0, Te._)`${w} instanceof ${i.ValidationError}`, () => n.assign(m, (0, Te._)`${w}.errors`), () => n.throw(w))), m;
  }
  function v() {
    const m = (0, Te._)`${u}.errors`;
    return n.assign(m, null), y(Te.nil), m;
  }
  function y(m = t.async ? (0, Te._)`await ` : Te.nil) {
    const w = i.opts.passContext ? Zt.default.this : Zt.default.self, P = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, Te._)`${m}${(0, R0.callValidateCode)(e, u, w, P)}`, t.modifying);
  }
  function $(m) {
    var w;
    n.if((0, Te.not)((w = t.valid) !== null && w !== void 0 ? w : h), m);
  }
}
ot.funcKeywordCode = j0;
function ac(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Te._)`${n.parentData}[${n.parentDataProperty}]`));
}
function k0(e, t) {
  const { gen: r } = e;
  r.if((0, Te._)`Array.isArray(${t})`, () => {
    r.assign(Zt.default.vErrors, (0, Te._)`${Zt.default.vErrors} === null ? ${t} : ${Zt.default.vErrors}.concat(${t})`).assign(Zt.default.errors, (0, Te._)`${Zt.default.vErrors}.length`), (0, O0.extendErrors)(e);
  }, () => e.error());
}
function A0({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function _u(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Te.stringify)(r) });
}
function C0(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
ot.validSchemaType = C0;
function D0({ schema: e, opts: t, self: r, errSchemaPath: n }, s, o) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(o) : s.keyword !== o)
    throw new Error("ajv implementation error");
  const a = s.dependencies;
  if (a != null && a.some((l) => !Object.prototype.hasOwnProperty.call(e, l)))
    throw new Error(`parent schema must have dependencies of ${o}: ${a.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[o])) {
    const i = `keyword "${o}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(i);
    else
      throw new Error(i);
  }
}
ot.validateKeywordUsage = D0;
var jt = {};
Object.defineProperty(jt, "__esModule", { value: !0 });
jt.extendSubschemaMode = jt.extendSubschemaData = jt.getSubschema = void 0;
const rt = te, vu = V;
function M0(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: o, topSchemaRef: a }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const l = e.schema[t];
    return r === void 0 ? {
      schema: l,
      schemaPath: (0, rt._)`${e.schemaPath}${(0, rt.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: l[r],
      schemaPath: (0, rt._)`${e.schemaPath}${(0, rt.getProperty)(t)}${(0, rt.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, vu.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || o === void 0 || a === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: a,
      errSchemaPath: o
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
jt.getSubschema = M0;
function L0(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: o, propertyName: a }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, E = l.let("data", (0, rt._)`${t.data}${(0, rt.getProperty)(r)}`, !0);
    i(E), e.errorPath = (0, rt.str)`${d}${(0, vu.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, rt._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof rt.Name ? s : l.let("data", s, !0);
    i(d), a !== void 0 && (e.propertyName = a);
  }
  o && (e.dataTypes = o);
  function i(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
jt.extendSubschemaData = L0;
function V0(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: o }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
jt.extendSubschemaMode = V0;
var Se = {}, wu = { exports: {} }, Ot = wu.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Vn(t, n, s, e, "", e);
};
Ot.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
Ot.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Ot.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Ot.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Vn(e, t, r, n, s, o, a, l, i, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, o, a, l, i, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in Ot.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            Vn(e, t, r, h[E], s + "/" + u + "/" + E, o, s, u, n, E);
      } else if (u in Ot.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            Vn(e, t, r, h[g], s + "/" + u + "/" + F0(g), o, s, u, n, g);
      } else (u in Ot.keywords || e.allKeys && !(u in Ot.skipKeywords)) && Vn(e, t, r, h, s + "/" + u, o, s, u, n);
    }
    r(n, s, o, a, l, i, d);
  }
}
function F0(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var U0 = wu.exports;
Object.defineProperty(Se, "__esModule", { value: !0 });
Se.getSchemaRefs = Se.resolveUrl = Se.normalizeId = Se._getFullPath = Se.getFullPath = Se.inlineRef = void 0;
const z0 = V, q0 = as, G0 = U0, K0 = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function H0(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !io(e) : t ? Eu(e) <= t : !1;
}
Se.inlineRef = H0;
const B0 = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function io(e) {
  for (const t in e) {
    if (B0.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(io) || typeof r == "object" && io(r))
      return !0;
  }
  return !1;
}
function Eu(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !K0.has(r) && (typeof e[r] == "object" && (0, z0.eachItem)(e[r], (n) => t += Eu(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Su(e, t = "", r) {
  r !== !1 && (t = vr(t));
  const n = e.parse(t);
  return bu(e, n);
}
Se.getFullPath = Su;
function bu(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Se._getFullPath = bu;
const W0 = /#\/?$/;
function vr(e) {
  return e ? e.replace(W0, "") : "";
}
Se.normalizeId = vr;
function X0(e, t, r) {
  return r = vr(r), e.resolve(t, r);
}
Se.resolveUrl = X0;
const J0 = /^[a-z_][-a-z0-9._]*$/i;
function x0(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = vr(e[r] || t), o = { "": s }, a = Su(n, s, !1), l = {}, i = /* @__PURE__ */ new Set();
  return G0(e, { allKeys: !0 }, (h, E, g, v) => {
    if (v === void 0)
      return;
    const y = a + E;
    let $ = o[v];
    typeof h[r] == "string" && ($ = m.call(this, h[r])), w.call(this, h.$anchor), w.call(this, h.$dynamicAnchor), o[E] = $;
    function m(P) {
      const I = this.opts.uriResolver.resolve;
      if (P = vr($ ? I($, P) : P), i.has(P))
        throw u(P);
      i.add(P);
      let R = this.refs[P];
      return typeof R == "string" && (R = this.refs[R]), typeof R == "object" ? d(h, R.schema, P) : P !== vr(y) && (P[0] === "#" ? (d(h, l[P], P), l[P] = h) : this.refs[P] = y), P;
    }
    function w(P) {
      if (typeof P == "string") {
        if (!J0.test(P))
          throw new Error(`invalid anchor "${P}"`);
        m.call(this, `#${P}`);
      }
    }
  }), l;
  function d(h, E, g) {
    if (E !== void 0 && !q0(h, E))
      throw u(g);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Se.getSchemaRefs = x0;
Object.defineProperty(Ye, "__esModule", { value: !0 });
Ye.getData = Ye.KeywordCxt = Ye.validateFunctionCode = void 0;
const Pu = Sr, ic = ge, Ra = ft, xn = ge, Y0 = hs, Qr = ot, Cs = jt, B = te, J = at, Z0 = Se, ht = V, qr = dn;
function Q0(e) {
  if (Ru(e) && (Ou(e), Iu(e))) {
    r_(e);
    return;
  }
  Nu(e, () => (0, Pu.topBoolOrEmptySchema)(e));
}
Ye.validateFunctionCode = Q0;
function Nu({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, o) {
  s.code.es5 ? e.func(t, (0, B._)`${J.default.data}, ${J.default.valCxt}`, n.$async, () => {
    e.code((0, B._)`"use strict"; ${cc(r, s)}`), t_(e, s), e.code(o);
  }) : e.func(t, (0, B._)`${J.default.data}, ${e_(s)}`, n.$async, () => e.code(cc(r, s)).code(o));
}
function e_(e) {
  return (0, B._)`{${J.default.instancePath}="", ${J.default.parentData}, ${J.default.parentDataProperty}, ${J.default.rootData}=${J.default.data}${e.dynamicRef ? (0, B._)`, ${J.default.dynamicAnchors}={}` : B.nil}}={}`;
}
function t_(e, t) {
  e.if(J.default.valCxt, () => {
    e.var(J.default.instancePath, (0, B._)`${J.default.valCxt}.${J.default.instancePath}`), e.var(J.default.parentData, (0, B._)`${J.default.valCxt}.${J.default.parentData}`), e.var(J.default.parentDataProperty, (0, B._)`${J.default.valCxt}.${J.default.parentDataProperty}`), e.var(J.default.rootData, (0, B._)`${J.default.valCxt}.${J.default.rootData}`), t.dynamicRef && e.var(J.default.dynamicAnchors, (0, B._)`${J.default.valCxt}.${J.default.dynamicAnchors}`);
  }, () => {
    e.var(J.default.instancePath, (0, B._)`""`), e.var(J.default.parentData, (0, B._)`undefined`), e.var(J.default.parentDataProperty, (0, B._)`undefined`), e.var(J.default.rootData, J.default.data), t.dynamicRef && e.var(J.default.dynamicAnchors, (0, B._)`{}`);
  });
}
function r_(e) {
  const { schema: t, opts: r, gen: n } = e;
  Nu(e, () => {
    r.$comment && t.$comment && ju(e), i_(e), n.let(J.default.vErrors, null), n.let(J.default.errors, 0), r.unevaluated && n_(e), Tu(e), u_(e);
  });
}
function n_(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, B._)`${r}.evaluated`), t.if((0, B._)`${e.evaluated}.dynamicProps`, () => t.assign((0, B._)`${e.evaluated}.props`, (0, B._)`undefined`)), t.if((0, B._)`${e.evaluated}.dynamicItems`, () => t.assign((0, B._)`${e.evaluated}.items`, (0, B._)`undefined`));
}
function cc(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, B._)`/*# sourceURL=${r} */` : B.nil;
}
function s_(e, t) {
  if (Ru(e) && (Ou(e), Iu(e))) {
    o_(e, t);
    return;
  }
  (0, Pu.boolOrEmptySchema)(e, t);
}
function Iu({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Ru(e) {
  return typeof e.schema != "boolean";
}
function o_(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && ju(e), c_(e), l_(e);
  const o = n.const("_errs", J.default.errors);
  Tu(e, o), n.var(t, (0, B._)`${o} === ${J.default.errors}`);
}
function Ou(e) {
  (0, ht.checkUnknownRules)(e), a_(e);
}
function Tu(e, t) {
  if (e.opts.jtd)
    return lc(e, [], !1, t);
  const r = (0, ic.getSchemaTypes)(e.schema), n = (0, ic.coerceAndCheckDataType)(e, r);
  lc(e, r, !n, t);
}
function a_(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, ht.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function i_(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, ht.checkStrictMode)(e, "default is ignored in the schema root");
}
function c_(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, Z0.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function l_(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function ju({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const o = r.$comment;
  if (s.$comment === !0)
    e.code((0, B._)`${J.default.self}.logger.log(${o})`);
  else if (typeof s.$comment == "function") {
    const a = (0, B.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, B._)`${J.default.self}.opts.$comment(${o}, ${a}, ${l}.schema)`);
  }
}
function u_(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: o } = e;
  r.$async ? t.if((0, B._)`${J.default.errors} === 0`, () => t.return(J.default.data), () => t.throw((0, B._)`new ${s}(${J.default.vErrors})`)) : (t.assign((0, B._)`${n}.errors`, J.default.vErrors), o.unevaluated && d_(e), t.return((0, B._)`${J.default.errors} === 0`));
}
function d_({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof B.Name && e.assign((0, B._)`${t}.props`, r), n instanceof B.Name && e.assign((0, B._)`${t}.items`, n);
}
function lc(e, t, r, n) {
  const { gen: s, schema: o, data: a, allErrors: l, opts: i, self: d } = e, { RULES: u } = d;
  if (o.$ref && (i.ignoreKeywordsWithRef || !(0, ht.schemaHasRulesButRef)(o, u))) {
    s.block(() => Cu(e, "$ref", u.all.$ref.definition));
    return;
  }
  i.jtd || f_(e, t), s.block(() => {
    for (const E of u.rules)
      h(E);
    h(u.post);
  });
  function h(E) {
    (0, Ra.shouldUseGroup)(o, E) && (E.type ? (s.if((0, xn.checkDataType)(E.type, a, i.strictNumbers)), uc(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, xn.reportTypeError)(e)), s.endIf()) : uc(e, E), l || s.if((0, B._)`${J.default.errors} === ${n || 0}`));
  }
}
function uc(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, Y0.assignDefaults)(e, t.type), r.block(() => {
    for (const o of t.rules)
      (0, Ra.shouldUseRule)(n, o) && Cu(e, o.keyword, o.definition, t.type);
  });
}
function f_(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (h_(e, t), e.opts.allowUnionTypes || m_(e, t), p_(e, e.dataTypes));
}
function h_(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      ku(e.dataTypes, r) || Oa(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), y_(e, t);
  }
}
function m_(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Oa(e, "use allowUnionTypes to allow union type keyword");
}
function p_(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Ra.shouldUseRule)(e.schema, s)) {
      const { type: o } = s.definition;
      o.length && !o.some((a) => $_(t, a)) && Oa(e, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function $_(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function ku(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function y_(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    ku(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Oa(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, ht.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Au {
  constructor(t, r, n) {
    if ((0, Qr.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, ht.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Du(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Qr.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", J.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, B.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, B.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, B._)`${r} !== undefined && (${(0, B.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? qr.reportExtraError : qr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, qr.reportError)(this, this.def.$dataError || qr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, qr.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = B.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = B.nil, r = B.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: o, def: a } = this;
    n.if((0, B.or)((0, B._)`${s} === undefined`, r)), t !== B.nil && n.assign(t, !0), (o.length || a.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== B.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: o } = this;
    return (0, B.or)(a(), l());
    function a() {
      if (n.length) {
        if (!(r instanceof B.Name))
          throw new Error("ajv implementation error");
        const i = Array.isArray(n) ? n : [n];
        return (0, B._)`${(0, xn.checkDataTypes)(i, r, o.opts.strictNumbers, xn.DataType.Wrong)}`;
      }
      return B.nil;
    }
    function l() {
      if (s.validateSchema) {
        const i = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, B._)`!${i}(${r})`;
      }
      return B.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Cs.getSubschema)(this.it, t);
    (0, Cs.extendSubschemaData)(n, this.it, t), (0, Cs.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return s_(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = ht.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = ht.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, B.Name)), !0;
  }
}
Ye.KeywordCxt = Au;
function Cu(e, t, r, n) {
  const s = new Au(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Qr.funcKeywordCode)(s, r) : "macro" in r ? (0, Qr.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Qr.funcKeywordCode)(s, r);
}
const g_ = /^\/(?:[^~]|~0|~1)*$/, __ = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Du(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, o;
  if (e === "")
    return J.default.rootData;
  if (e[0] === "/") {
    if (!g_.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, o = J.default.rootData;
  } else {
    const d = __.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const u = +d[1];
    if (s = d[2], s === "#") {
      if (u >= t)
        throw new Error(i("property/index", u));
      return n[t - u];
    }
    if (u > t)
      throw new Error(i("data", u));
    if (o = r[t - u], !s)
      return o;
  }
  let a = o;
  const l = s.split("/");
  for (const d of l)
    d && (o = (0, B._)`${o}${(0, B.getProperty)((0, ht.unescapeJsonPointer)(d))}`, a = (0, B._)`${a} && ${o}`);
  return a;
  function i(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
Ye.getData = Du;
var fn = {};
Object.defineProperty(fn, "__esModule", { value: !0 });
class v_ extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
fn.default = v_;
var Tr = {};
Object.defineProperty(Tr, "__esModule", { value: !0 });
const Ds = Se;
class w_ extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Ds.resolveUrl)(t, r, n), this.missingSchema = (0, Ds.normalizeId)((0, Ds.getFullPath)(t, this.missingRef));
  }
}
Tr.default = w_;
var De = {};
Object.defineProperty(De, "__esModule", { value: !0 });
De.resolveSchema = De.getCompilingSchema = De.resolveRef = De.compileSchema = De.SchemaEnv = void 0;
const He = te, E_ = fn, Wt = at, Je = Se, dc = V, S_ = Ye;
class ms {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Je.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
De.SchemaEnv = ms;
function Ta(e) {
  const t = Mu.call(this, e);
  if (t)
    return t;
  const r = (0, Je.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: o } = this.opts, a = new He.CodeGen(this.scope, { es5: n, lines: s, ownProperties: o });
  let l;
  e.$async && (l = a.scopeValue("Error", {
    ref: E_.default,
    code: (0, He._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const i = a.scopeName("validate");
  e.validateName = i;
  const d = {
    gen: a,
    allErrors: this.opts.allErrors,
    data: Wt.default.data,
    parentData: Wt.default.parentData,
    parentDataProperty: Wt.default.parentDataProperty,
    dataNames: [Wt.default.data],
    dataPathArr: [He.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: a.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, He.stringify)(e.schema) } : { ref: e.schema }),
    validateName: i,
    ValidationError: l,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: He.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, He._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, S_.validateFunctionCode)(d), a.optimize(this.opts.code.optimize);
    const h = a.toString();
    u = `${a.scopeRefs(Wt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const g = new Function(`${Wt.default.self}`, `${Wt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(i, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: i, validateCode: h, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: v, items: y } = d;
      g.evaluated = {
        props: v instanceof He.Name ? void 0 : v,
        items: y instanceof He.Name ? void 0 : y,
        dynamicProps: v instanceof He.Name,
        dynamicItems: y instanceof He.Name
      }, g.source && (g.source.evaluated = (0, He.stringify)(g.evaluated));
    }
    return e.validate = g, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
De.compileSchema = Ta;
function b_(e, t, r) {
  var n;
  r = (0, Je.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let o = I_.call(this, e, r);
  if (o === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    a && (o = new ms({ schema: a, schemaId: l, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[r] = P_.call(this, o);
}
De.resolveRef = b_;
function P_(e) {
  return (0, Je.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Ta.call(this, e);
}
function Mu(e) {
  for (const t of this._compilations)
    if (N_(t, e))
      return t;
}
De.getCompilingSchema = Mu;
function N_(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function I_(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || ps.call(this, e, t);
}
function ps(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Je._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Je.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Ms.call(this, r, e);
  const o = (0, Je.normalizeId)(n), a = this.refs[o] || this.schemas[o];
  if (typeof a == "string") {
    const l = ps.call(this, e, a);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : Ms.call(this, r, l);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || Ta.call(this, a), o === (0, Je.normalizeId)(t)) {
      const { schema: l } = a, { schemaId: i } = this.opts, d = l[i];
      return d && (s = (0, Je.resolveUrl)(this.opts.uriResolver, s, d)), new ms({ schema: l, schemaId: i, root: e, baseId: s });
    }
    return Ms.call(this, r, a);
  }
}
De.resolveSchema = ps;
const R_ = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Ms(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const i = r[(0, dc.unescapeFragment)(l)];
    if (i === void 0)
      return;
    r = i;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !R_.has(l) && d && (t = (0, Je.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let o;
  if (typeof r != "boolean" && r.$ref && !(0, dc.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, Je.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    o = ps.call(this, n, l);
  }
  const { schemaId: a } = this.opts;
  if (o = o || new ms({ schema: r, schemaId: a, root: n, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const O_ = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", T_ = "Meta-schema for $data reference (JSON AnySchema extension proposal)", j_ = "object", k_ = [
  "$data"
], A_ = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, C_ = !1, D_ = {
  $id: O_,
  description: T_,
  type: j_,
  required: k_,
  properties: A_,
  additionalProperties: C_
};
var ja = {};
Object.defineProperty(ja, "__esModule", { value: !0 });
const Lu = Bl;
Lu.code = 'require("ajv/dist/runtime/uri").default';
ja.default = Lu;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Ye;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = te;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = fn, s = Tr, o = sr, a = De, l = te, i = Se, d = ge, u = V, h = D_, E = ja, g = (N, p) => new RegExp(N, p);
  g.code = "new RegExp";
  const v = ["removeAdditional", "useDefaults", "coerceTypes"], y = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), $ = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, w = 200;
  function P(N) {
    var p, b, _, c, f, S, T, j, G, z, ae, Me, kt, At, Ct, Dt, Mt, Lt, Vt, Ft, Ut, zt, qt, Gt, Kt;
    const Ge = N.strict, Ht = (p = N.code) === null || p === void 0 ? void 0 : p.optimize, Cr = Ht === !0 || Ht === void 0 ? 1 : Ht || 0, Dr = (_ = (b = N.code) === null || b === void 0 ? void 0 : b.regExp) !== null && _ !== void 0 ? _ : g, Ps = (c = N.uriResolver) !== null && c !== void 0 ? c : E.default;
    return {
      strictSchema: (S = (f = N.strictSchema) !== null && f !== void 0 ? f : Ge) !== null && S !== void 0 ? S : !0,
      strictNumbers: (j = (T = N.strictNumbers) !== null && T !== void 0 ? T : Ge) !== null && j !== void 0 ? j : !0,
      strictTypes: (z = (G = N.strictTypes) !== null && G !== void 0 ? G : Ge) !== null && z !== void 0 ? z : "log",
      strictTuples: (Me = (ae = N.strictTuples) !== null && ae !== void 0 ? ae : Ge) !== null && Me !== void 0 ? Me : "log",
      strictRequired: (At = (kt = N.strictRequired) !== null && kt !== void 0 ? kt : Ge) !== null && At !== void 0 ? At : !1,
      code: N.code ? { ...N.code, optimize: Cr, regExp: Dr } : { optimize: Cr, regExp: Dr },
      loopRequired: (Ct = N.loopRequired) !== null && Ct !== void 0 ? Ct : w,
      loopEnum: (Dt = N.loopEnum) !== null && Dt !== void 0 ? Dt : w,
      meta: (Mt = N.meta) !== null && Mt !== void 0 ? Mt : !0,
      messages: (Lt = N.messages) !== null && Lt !== void 0 ? Lt : !0,
      inlineRefs: (Vt = N.inlineRefs) !== null && Vt !== void 0 ? Vt : !0,
      schemaId: (Ft = N.schemaId) !== null && Ft !== void 0 ? Ft : "$id",
      addUsedSchema: (Ut = N.addUsedSchema) !== null && Ut !== void 0 ? Ut : !0,
      validateSchema: (zt = N.validateSchema) !== null && zt !== void 0 ? zt : !0,
      validateFormats: (qt = N.validateFormats) !== null && qt !== void 0 ? qt : !0,
      unicodeRegExp: (Gt = N.unicodeRegExp) !== null && Gt !== void 0 ? Gt : !0,
      int32range: (Kt = N.int32range) !== null && Kt !== void 0 ? Kt : !0,
      uriResolver: Ps
    };
  }
  class I {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...P(p) };
      const { es5: b, lines: _ } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: y, es5: b, lines: _ }), this.logger = q(p.logger);
      const c = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, o.getRules)(), R.call(this, $, p, "NOT SUPPORTED"), R.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ie.call(this), p.formats && Y.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && ce.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), W.call(this), p.validateFormats = c;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: b, schemaId: _ } = this.opts;
      let c = h;
      _ === "id" && (c = { ...h }, c.id = c.$id, delete c.$id), b && p && this.addMetaSchema(c, c[_], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: b } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[b] || p : void 0;
    }
    validate(p, b) {
      let _;
      if (typeof p == "string") {
        if (_ = this.getSchema(p), !_)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        _ = this.compile(p);
      const c = _(b);
      return "$async" in _ || (this.errors = _.errors), c;
    }
    compile(p, b) {
      const _ = this._addSchema(p, b);
      return _.validate || this._compileSchemaEnv(_);
    }
    compileAsync(p, b) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: _ } = this.opts;
      return c.call(this, p, b);
      async function c(z, ae) {
        await f.call(this, z.$schema);
        const Me = this._addSchema(z, ae);
        return Me.validate || S.call(this, Me);
      }
      async function f(z) {
        z && !this.getSchema(z) && await c.call(this, { $ref: z }, !0);
      }
      async function S(z) {
        try {
          return this._compileSchemaEnv(z);
        } catch (ae) {
          if (!(ae instanceof s.default))
            throw ae;
          return T.call(this, ae), await j.call(this, ae.missingSchema), S.call(this, z);
        }
      }
      function T({ missingSchema: z, missingRef: ae }) {
        if (this.refs[z])
          throw new Error(`AnySchema ${z} is loaded but ${ae} cannot be resolved`);
      }
      async function j(z) {
        const ae = await G.call(this, z);
        this.refs[z] || await f.call(this, ae.$schema), this.refs[z] || this.addSchema(ae, z, b);
      }
      async function G(z) {
        const ae = this._loading[z];
        if (ae)
          return ae;
        try {
          return await (this._loading[z] = _(z));
        } finally {
          delete this._loading[z];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, b, _, c = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const S of p)
          this.addSchema(S, void 0, _, c);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: S } = this.opts;
        if (f = p[S], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return b = (0, i.normalizeId)(b || f), this._checkUnique(b), this.schemas[b] = this._addSchema(p, _, b, c, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, b, _ = this.opts.validateSchema) {
      return this.addSchema(p, b, !0, _), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, b) {
      if (typeof p == "boolean")
        return !0;
      let _;
      if (_ = p.$schema, _ !== void 0 && typeof _ != "string")
        throw new Error("$schema must be a string");
      if (_ = _ || this.opts.defaultMeta || this.defaultMeta(), !_)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const c = this.validate(_, p);
      if (!c && b) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return c;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(p) {
      let b;
      for (; typeof (b = F.call(this, p)) == "string"; )
        p = b;
      if (b === void 0) {
        const { schemaId: _ } = this.opts, c = new a.SchemaEnv({ schema: {}, schemaId: _ });
        if (b = a.resolveSchema.call(this, c, p), !b)
          return;
        this.refs[p] = b;
      }
      return b.validate || this._compileSchemaEnv(b);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(p) {
      if (p instanceof RegExp)
        return this._removeAllSchemas(this.schemas, p), this._removeAllSchemas(this.refs, p), this;
      switch (typeof p) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const b = F.call(this, p);
          return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const b = p;
          this._cache.delete(b);
          let _ = p[this.opts.schemaId];
          return _ && (_ = (0, i.normalizeId)(_), delete this.schemas[_], delete this.refs[_]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const b of p)
        this.addKeyword(b);
      return this;
    }
    addKeyword(p, b) {
      let _;
      if (typeof p == "string")
        _ = p, typeof b == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), b.keyword = _);
      else if (typeof p == "object" && b === void 0) {
        if (b = p, _ = b.keyword, Array.isArray(_) && !_.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (O.call(this, _, b), !b)
        return (0, u.eachItem)(_, (f) => k.call(this, f)), this;
      M.call(this, b);
      const c = {
        ...b,
        type: (0, d.getJSONTypes)(b.type),
        schemaType: (0, d.getJSONTypes)(b.schemaType)
      };
      return (0, u.eachItem)(_, c.type.length === 0 ? (f) => k.call(this, f, c) : (f) => c.type.forEach((S) => k.call(this, f, c, S))), this;
    }
    getKeyword(p) {
      const b = this.RULES.all[p];
      return typeof b == "object" ? b.definition : !!b;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: b } = this;
      delete b.keywords[p], delete b.all[p];
      for (const _ of b.rules) {
        const c = _.rules.findIndex((f) => f.keyword === p);
        c >= 0 && _.rules.splice(c, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, b) {
      return typeof b == "string" && (b = new RegExp(b)), this.formats[p] = b, this;
    }
    errorsText(p = this.errors, { separator: b = ", ", dataVar: _ = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((c) => `${_}${c.instancePath} ${c.message}`).reduce((c, f) => c + b + f);
    }
    $dataMetaSchema(p, b) {
      const _ = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const c of b) {
        const f = c.split("/").slice(1);
        let S = p;
        for (const T of f)
          S = S[T];
        for (const T in _) {
          const j = _[T];
          if (typeof j != "object")
            continue;
          const { $data: G } = j.definition, z = S[T];
          G && z && (S[T] = L(z));
        }
      }
      return p;
    }
    _removeAllSchemas(p, b) {
      for (const _ in p) {
        const c = p[_];
        (!b || b.test(_)) && (typeof c == "string" ? delete p[_] : c && !c.meta && (this._cache.delete(c.schema), delete p[_]));
      }
    }
    _addSchema(p, b, _, c = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let S;
      const { schemaId: T } = this.opts;
      if (typeof p == "object")
        S = p[T];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let j = this._cache.get(p);
      if (j !== void 0)
        return j;
      _ = (0, i.normalizeId)(S || _);
      const G = i.getSchemaRefs.call(this, p, _);
      return j = new a.SchemaEnv({ schema: p, schemaId: T, meta: b, baseId: _, localRefs: G }), this._cache.set(j.schema, j), f && !_.startsWith("#") && (_ && this._checkUnique(_), this.refs[_] = j), c && this.validateSchema(p, !0), j;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : a.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const b = this.opts;
      this.opts = this._metaOpts;
      try {
        a.compileSchema.call(this, p);
      } finally {
        this.opts = b;
      }
    }
  }
  I.ValidationError = n.default, I.MissingRefError = s.default, e.default = I;
  function R(N, p, b, _ = "error") {
    for (const c in N) {
      const f = c;
      f in p && this.logger[_](`${b}: option ${c}. ${N[f]}`);
    }
  }
  function F(N) {
    return N = (0, i.normalizeId)(N), this.schemas[N] || this.refs[N];
  }
  function W() {
    const N = this.opts.schemas;
    if (N)
      if (Array.isArray(N))
        this.addSchema(N);
      else
        for (const p in N)
          this.addSchema(N[p], p);
  }
  function Y() {
    for (const N in this.opts.formats) {
      const p = this.opts.formats[N];
      p && this.addFormat(N, p);
    }
  }
  function ce(N) {
    if (Array.isArray(N)) {
      this.addVocabulary(N);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in N) {
      const b = N[p];
      b.keyword || (b.keyword = p), this.addKeyword(b);
    }
  }
  function ie() {
    const N = { ...this.opts };
    for (const p of v)
      delete N[p];
    return N;
  }
  const D = { log() {
  }, warn() {
  }, error() {
  } };
  function q(N) {
    if (N === !1)
      return D;
    if (N === void 0)
      return console;
    if (N.log && N.warn && N.error)
      return N;
    throw new Error("logger must implement log, warn and error methods");
  }
  const oe = /^[a-z_$][a-z0-9_$:-]*$/i;
  function O(N, p) {
    const { RULES: b } = this;
    if ((0, u.eachItem)(N, (_) => {
      if (b.keywords[_])
        throw new Error(`Keyword ${_} is already defined`);
      if (!oe.test(_))
        throw new Error(`Keyword ${_} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(N, p, b) {
    var _;
    const c = p == null ? void 0 : p.post;
    if (b && c)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let S = c ? f.post : f.rules.find(({ type: j }) => j === b);
    if (S || (S = { type: b, rules: [] }, f.rules.push(S)), f.keywords[N] = !0, !p)
      return;
    const T = {
      keyword: N,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? U.call(this, S, T, p.before) : S.rules.push(T), f.all[N] = T, (_ = p.implements) === null || _ === void 0 || _.forEach((j) => this.addKeyword(j));
  }
  function U(N, p, b) {
    const _ = N.rules.findIndex((c) => c.keyword === b);
    _ >= 0 ? N.rules.splice(_, 0, p) : (N.rules.push(p), this.logger.warn(`rule ${b} is not defined`));
  }
  function M(N) {
    let { metaSchema: p } = N;
    p !== void 0 && (N.$data && this.opts.$data && (p = L(p)), N.validateSchema = this.compile(p, !0));
  }
  const K = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function L(N) {
    return { anyOf: [N, K] };
  }
})(ou);
var ka = {}, Aa = {}, Ca = {};
Object.defineProperty(Ca, "__esModule", { value: !0 });
const M_ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Ca.default = M_;
var or = {};
Object.defineProperty(or, "__esModule", { value: !0 });
or.callRef = or.getValidate = void 0;
const L_ = Tr, fc = se, Ce = te, ur = at, hc = De, wn = V, V_ = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: o, validateName: a, opts: l, self: i } = n, { root: d } = o;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = hc.resolveRef.call(i, d, s, r);
    if (u === void 0)
      throw new L_.default(n.opts.uriResolver, s, r);
    if (u instanceof hc.SchemaEnv)
      return E(u);
    return g(u);
    function h() {
      if (o === d)
        return Fn(e, a, o, o.$async);
      const v = t.scopeValue("root", { ref: d });
      return Fn(e, (0, Ce._)`${v}.validate`, d, d.$async);
    }
    function E(v) {
      const y = Vu(e, v);
      Fn(e, y, v, v.$async);
    }
    function g(v) {
      const y = t.scopeValue("schema", l.code.source === !0 ? { ref: v, code: (0, Ce.stringify)(v) } : { ref: v }), $ = t.name("valid"), m = e.subschema({
        schema: v,
        dataTypes: [],
        schemaPath: Ce.nil,
        topSchemaRef: y,
        errSchemaPath: r
      }, $);
      e.mergeEvaluated(m), e.ok($);
    }
  }
};
function Vu(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ce._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
or.getValidate = Vu;
function Fn(e, t, r, n) {
  const { gen: s, it: o } = e, { allErrors: a, schemaEnv: l, opts: i } = o, d = i.passContext ? ur.default.this : Ce.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, Ce._)`await ${(0, fc.callValidateCode)(e, t, d)}`), g(t), a || s.assign(v, !0);
    }, (y) => {
      s.if((0, Ce._)`!(${y} instanceof ${o.ValidationError})`, () => s.throw(y)), E(y), a || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, fc.callValidateCode)(e, t, d), () => g(t), () => E(t));
  }
  function E(v) {
    const y = (0, Ce._)`${v}.errors`;
    s.assign(ur.default.vErrors, (0, Ce._)`${ur.default.vErrors} === null ? ${y} : ${ur.default.vErrors}.concat(${y})`), s.assign(ur.default.errors, (0, Ce._)`${ur.default.vErrors}.length`);
  }
  function g(v) {
    var y;
    if (!o.opts.unevaluated)
      return;
    const $ = (y = r == null ? void 0 : r.validate) === null || y === void 0 ? void 0 : y.evaluated;
    if (o.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (o.props = wn.mergeEvaluated.props(s, $.props, o.props));
      else {
        const m = s.var("props", (0, Ce._)`${v}.evaluated.props`);
        o.props = wn.mergeEvaluated.props(s, m, o.props, Ce.Name);
      }
    if (o.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (o.items = wn.mergeEvaluated.items(s, $.items, o.items));
      else {
        const m = s.var("items", (0, Ce._)`${v}.evaluated.items`);
        o.items = wn.mergeEvaluated.items(s, m, o.items, Ce.Name);
      }
  }
}
or.callRef = Fn;
or.default = V_;
Object.defineProperty(Aa, "__esModule", { value: !0 });
const F_ = Ca, U_ = or, z_ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  F_.default,
  U_.default
];
Aa.default = z_;
var Da = {}, Ma = {};
Object.defineProperty(Ma, "__esModule", { value: !0 });
const Yn = te, St = Yn.operators, Zn = {
  maximum: { okStr: "<=", ok: St.LTE, fail: St.GT },
  minimum: { okStr: ">=", ok: St.GTE, fail: St.LT },
  exclusiveMaximum: { okStr: "<", ok: St.LT, fail: St.GTE },
  exclusiveMinimum: { okStr: ">", ok: St.GT, fail: St.LTE }
}, q_ = {
  message: ({ keyword: e, schemaCode: t }) => (0, Yn.str)`must be ${Zn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Yn._)`{comparison: ${Zn[e].okStr}, limit: ${t}}`
}, G_ = {
  keyword: Object.keys(Zn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: q_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Yn._)`${r} ${Zn[t].fail} ${n} || isNaN(${r})`);
  }
};
Ma.default = G_;
var La = {};
Object.defineProperty(La, "__esModule", { value: !0 });
const en = te, K_ = {
  message: ({ schemaCode: e }) => (0, en.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, en._)`{multipleOf: ${e}}`
}, H_ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: K_,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, o = s.opts.multipleOfPrecision, a = t.let("res"), l = o ? (0, en._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, en._)`${a} !== parseInt(${a})`;
    e.fail$data((0, en._)`(${n} === 0 || (${a} = ${r}/${n}, ${l}))`);
  }
};
La.default = H_;
var Va = {}, Fa = {};
Object.defineProperty(Fa, "__esModule", { value: !0 });
function Fu(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Fa.default = Fu;
Fu.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Va, "__esModule", { value: !0 });
const Qt = te, B_ = V, W_ = Fa, X_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Qt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Qt._)`{limit: ${e}}`
}, J_ = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: X_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, o = t === "maxLength" ? Qt.operators.GT : Qt.operators.LT, a = s.opts.unicode === !1 ? (0, Qt._)`${r}.length` : (0, Qt._)`${(0, B_.useFunc)(e.gen, W_.default)}(${r})`;
    e.fail$data((0, Qt._)`${a} ${o} ${n}`);
  }
};
Va.default = J_;
var Ua = {};
Object.defineProperty(Ua, "__esModule", { value: !0 });
const x_ = se, Qn = te, Y_ = {
  message: ({ schemaCode: e }) => (0, Qn.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Qn._)`{pattern: ${e}}`
}, Z_ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Y_,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: o } = e, a = o.opts.unicodeRegExp ? "u" : "", l = r ? (0, Qn._)`(new RegExp(${s}, ${a}))` : (0, x_.usePattern)(e, n);
    e.fail$data((0, Qn._)`!${l}.test(${t})`);
  }
};
Ua.default = Z_;
var za = {};
Object.defineProperty(za, "__esModule", { value: !0 });
const tn = te, Q_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, tn.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, tn._)`{limit: ${e}}`
}, ev = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Q_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? tn.operators.GT : tn.operators.LT;
    e.fail$data((0, tn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
za.default = ev;
var qa = {};
Object.defineProperty(qa, "__esModule", { value: !0 });
const Gr = se, rn = te, tv = V, rv = {
  message: ({ params: { missingProperty: e } }) => (0, rn.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, rn._)`{missingProperty: ${e}}`
}, nv = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: rv,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: o, it: a } = e, { opts: l } = a;
    if (!o && r.length === 0)
      return;
    const i = r.length >= l.loopRequired;
    if (a.allErrors ? d() : u(), l.strictRequired) {
      const g = e.parentSchema.properties, { definedProperties: v } = e.it;
      for (const y of r)
        if ((g == null ? void 0 : g[y]) === void 0 && !v.has(y)) {
          const $ = a.schemaEnv.baseId + a.errSchemaPath, m = `required property "${y}" is not defined at "${$}" (strictRequired)`;
          (0, tv.checkStrictMode)(a, m, a.opts.strictRequired);
        }
    }
    function d() {
      if (i || o)
        e.block$data(rn.nil, h);
      else
        for (const g of r)
          (0, Gr.checkReportMissingProp)(e, g);
    }
    function u() {
      const g = t.let("missing");
      if (i || o) {
        const v = t.let("valid", !0);
        e.block$data(v, () => E(g, v)), e.ok(v);
      } else
        t.if((0, Gr.checkMissingProp)(e, r, g)), (0, Gr.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, Gr.noPropertyInData)(t, s, g, l.ownProperties), () => e.error());
      });
    }
    function E(g, v) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(v, (0, Gr.propertyInData)(t, s, g, l.ownProperties)), t.if((0, rn.not)(v), () => {
          e.error(), t.break();
        });
      }, rn.nil);
    }
  }
};
qa.default = nv;
var Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
const nn = te, sv = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, nn.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, nn._)`{limit: ${e}}`
}, ov = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: sv,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? nn.operators.GT : nn.operators.LT;
    e.fail$data((0, nn._)`${r}.length ${s} ${n}`);
  }
};
Ga.default = ov;
var Ka = {}, hn = {};
Object.defineProperty(hn, "__esModule", { value: !0 });
const Uu = as;
Uu.code = 'require("ajv/dist/runtime/equal").default';
hn.default = Uu;
Object.defineProperty(Ka, "__esModule", { value: !0 });
const Ls = ge, we = te, av = V, iv = hn, cv = {
  message: ({ params: { i: e, j: t } }) => (0, we.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, we._)`{i: ${e}, j: ${t}}`
}, lv = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: cv,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: o, schemaCode: a, it: l } = e;
    if (!n && !s)
      return;
    const i = t.let("valid"), d = o.items ? (0, Ls.getSchemaTypes)(o.items) : [];
    e.block$data(i, u, (0, we._)`${a} === false`), e.ok(i);
    function u() {
      const v = t.let("i", (0, we._)`${r}.length`), y = t.let("j");
      e.setParams({ i: v, j: y }), t.assign(i, !0), t.if((0, we._)`${v} > 1`, () => (h() ? E : g)(v, y));
    }
    function h() {
      return d.length > 0 && !d.some((v) => v === "object" || v === "array");
    }
    function E(v, y) {
      const $ = t.name("item"), m = (0, Ls.checkDataTypes)(d, $, l.opts.strictNumbers, Ls.DataType.Wrong), w = t.const("indices", (0, we._)`{}`);
      t.for((0, we._)`;${v}--;`, () => {
        t.let($, (0, we._)`${r}[${v}]`), t.if(m, (0, we._)`continue`), d.length > 1 && t.if((0, we._)`typeof ${$} == "string"`, (0, we._)`${$} += "_"`), t.if((0, we._)`typeof ${w}[${$}] == "number"`, () => {
          t.assign(y, (0, we._)`${w}[${$}]`), e.error(), t.assign(i, !1).break();
        }).code((0, we._)`${w}[${$}] = ${v}`);
      });
    }
    function g(v, y) {
      const $ = (0, av.useFunc)(t, iv.default), m = t.name("outer");
      t.label(m).for((0, we._)`;${v}--;`, () => t.for((0, we._)`${y} = ${v}; ${y}--;`, () => t.if((0, we._)`${$}(${r}[${v}], ${r}[${y}])`, () => {
        e.error(), t.assign(i, !1).break(m);
      })));
    }
  }
};
Ka.default = lv;
var Ha = {};
Object.defineProperty(Ha, "__esModule", { value: !0 });
const co = te, uv = V, dv = hn, fv = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, co._)`{allowedValue: ${e}}`
}, hv = {
  keyword: "const",
  $data: !0,
  error: fv,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: o } = e;
    n || o && typeof o == "object" ? e.fail$data((0, co._)`!${(0, uv.useFunc)(t, dv.default)}(${r}, ${s})`) : e.fail((0, co._)`${o} !== ${r}`);
  }
};
Ha.default = hv;
var Ba = {};
Object.defineProperty(Ba, "__esModule", { value: !0 });
const Wr = te, mv = V, pv = hn, $v = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Wr._)`{allowedValues: ${e}}`
}, yv = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: $v,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= a.opts.loopEnum;
    let i;
    const d = () => i ?? (i = (0, mv.useFunc)(t, pv.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", o);
      u = (0, Wr.or)(...s.map((v, y) => E(g, y)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", o, (g) => t.if((0, Wr._)`${d()}(${r}, ${g})`, () => t.assign(u, !0).break()));
    }
    function E(g, v) {
      const y = s[v];
      return typeof y == "object" && y !== null ? (0, Wr._)`${d()}(${r}, ${g}[${v}])` : (0, Wr._)`${r} === ${y}`;
    }
  }
};
Ba.default = yv;
Object.defineProperty(Da, "__esModule", { value: !0 });
const gv = Ma, _v = La, vv = Va, wv = Ua, Ev = za, Sv = qa, bv = Ga, Pv = Ka, Nv = Ha, Iv = Ba, Rv = [
  // number
  gv.default,
  _v.default,
  // string
  vv.default,
  wv.default,
  // object
  Ev.default,
  Sv.default,
  // array
  bv.default,
  Pv.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Nv.default,
  Iv.default
];
Da.default = Rv;
var Wa = {}, jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.validateAdditionalItems = void 0;
const er = te, lo = V, Ov = {
  message: ({ params: { len: e } }) => (0, er.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, er._)`{limit: ${e}}`
}, Tv = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Ov,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, lo.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    zu(e, n);
  }
};
function zu(e, t) {
  const { gen: r, schema: n, data: s, keyword: o, it: a } = e;
  a.items = !0;
  const l = r.const("len", (0, er._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, er._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, lo.alwaysValidSchema)(a, n)) {
    const d = r.var("valid", (0, er._)`${l} <= ${t.length}`);
    r.if((0, er.not)(d), () => i(d)), e.ok(d);
  }
  function i(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: o, dataProp: u, dataPropType: lo.Type.Num }, d), a.allErrors || r.if((0, er.not)(d), () => r.break());
    });
  }
}
jr.validateAdditionalItems = zu;
jr.default = Tv;
var Xa = {}, kr = {};
Object.defineProperty(kr, "__esModule", { value: !0 });
kr.validateTuple = void 0;
const mc = te, Un = V, jv = se, kv = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return qu(e, "additionalItems", t);
    r.items = !0, !(0, Un.alwaysValidSchema)(r, t) && e.ok((0, jv.validateArray)(e));
  }
};
function qu(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: o, keyword: a, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = Un.mergeEvaluated.items(n, r.length, l.items));
  const i = n.name("valid"), d = n.const("len", (0, mc._)`${o}.length`);
  r.forEach((h, E) => {
    (0, Un.alwaysValidSchema)(l, h) || (n.if((0, mc._)`${d} > ${E}`, () => e.subschema({
      keyword: a,
      schemaProp: E,
      dataProp: E
    }, i)), e.ok(i));
  });
  function u(h) {
    const { opts: E, errSchemaPath: g } = l, v = r.length, y = v === h.minItems && (v === h.maxItems || h[t] === !1);
    if (E.strictTuples && !y) {
      const $ = `"${a}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, Un.checkStrictMode)(l, $, E.strictTuples);
    }
  }
}
kr.validateTuple = qu;
kr.default = kv;
Object.defineProperty(Xa, "__esModule", { value: !0 });
const Av = kr, Cv = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, Av.validateTuple)(e, "items")
};
Xa.default = Cv;
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
const pc = te, Dv = V, Mv = se, Lv = jr, Vv = {
  message: ({ params: { len: e } }) => (0, pc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, pc._)`{limit: ${e}}`
}, Fv = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Vv,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, Dv.alwaysValidSchema)(n, t) && (s ? (0, Lv.validateAdditionalItems)(e, s) : e.ok((0, Mv.validateArray)(e)));
  }
};
Ja.default = Fv;
var xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
const ze = te, En = V, Uv = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, ze.str)`must contain at least ${e} valid item(s)` : (0, ze.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, ze._)`{minContains: ${e}}` : (0, ze._)`{minContains: ${e}, maxContains: ${t}}`
}, zv = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Uv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    let a, l;
    const { minContains: i, maxContains: d } = n;
    o.opts.next ? (a = i === void 0 ? 1 : i, l = d) : a = 1;
    const u = t.const("len", (0, ze._)`${s}.length`);
    if (e.setParams({ min: a, max: l }), l === void 0 && a === 0) {
      (0, En.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && a > l) {
      (0, En.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, En.alwaysValidSchema)(o, r)) {
      let y = (0, ze._)`${u} >= ${a}`;
      l !== void 0 && (y = (0, ze._)`${y} && ${u} <= ${l}`), e.pass(y);
      return;
    }
    o.items = !0;
    const h = t.name("valid");
    l === void 0 && a === 1 ? g(h, () => t.if(h, () => t.break())) : a === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, ze._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const y = t.name("_valid"), $ = t.let("count", 0);
      g(y, () => t.if(y, () => v($)));
    }
    function g(y, $) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: En.Type.Num,
          compositeRule: !0
        }, y), $();
      });
    }
    function v(y) {
      t.code((0, ze._)`${y}++`), l === void 0 ? t.if((0, ze._)`${y} >= ${a}`, () => t.assign(h, !0).break()) : (t.if((0, ze._)`${y} > ${l}`, () => t.assign(h, !1).break()), a === 1 ? t.assign(h, !0) : t.if((0, ze._)`${y} >= ${a}`, () => t.assign(h, !0)));
    }
  }
};
xa.default = zv;
var Gu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = te, r = V, n = se;
  e.error = {
    message: ({ params: { property: i, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${i} is present`;
    },
    params: ({ params: { property: i, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${i},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${u}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(i) {
      const [d, u] = o(i);
      a(i, d), l(i, u);
    }
  };
  function o({ schema: i }) {
    const d = {}, u = {};
    for (const h in i) {
      if (h === "__proto__")
        continue;
      const E = Array.isArray(i[h]) ? d : u;
      E[h] = i[h];
    }
    return [d, u];
  }
  function a(i, d = i.schema) {
    const { gen: u, data: h, it: E } = i;
    if (Object.keys(d).length === 0)
      return;
    const g = u.let("missing");
    for (const v in d) {
      const y = d[v];
      if (y.length === 0)
        continue;
      const $ = (0, n.propertyInData)(u, h, v, E.opts.ownProperties);
      i.setParams({
        property: v,
        depsCount: y.length,
        deps: y.join(", ")
      }), E.allErrors ? u.if($, () => {
        for (const m of y)
          (0, n.checkReportMissingProp)(i, m);
      }) : (u.if((0, t._)`${$} && (${(0, n.checkMissingProp)(i, y, g)})`), (0, n.reportMissingProp)(i, g), u.else());
    }
  }
  e.validatePropertyDeps = a;
  function l(i, d = i.schema) {
    const { gen: u, data: h, keyword: E, it: g } = i, v = u.name("valid");
    for (const y in d)
      (0, r.alwaysValidSchema)(g, d[y]) || (u.if(
        (0, n.propertyInData)(u, h, y, g.opts.ownProperties),
        () => {
          const $ = i.subschema({ keyword: E, schemaProp: y }, v);
          i.mergeValidEvaluated($, v);
        },
        () => u.var(v, !0)
        // TODO var
      ), i.ok(v));
  }
  e.validateSchemaDeps = l, e.default = s;
})(Gu);
var Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
const Ku = te, qv = V, Gv = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Ku._)`{propertyName: ${e.propertyName}}`
}, Kv = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Gv,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, qv.alwaysValidSchema)(s, r))
      return;
    const o = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, o), t.if((0, Ku.not)(o), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
Ya.default = Kv;
var $s = {};
Object.defineProperty($s, "__esModule", { value: !0 });
const Sn = se, We = te, Hv = at, bn = V, Bv = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, We._)`{additionalProperty: ${e.additionalProperty}}`
}, Wv = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Bv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: o, it: a } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: i } = a;
    if (a.props = !0, i.removeAdditional !== "all" && (0, bn.alwaysValidSchema)(a, r))
      return;
    const d = (0, Sn.allSchemaProperties)(n.properties), u = (0, Sn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, We._)`${o} === ${Hv.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !u.length ? v($) : t.if(E($), () => v($));
      });
    }
    function E($) {
      let m;
      if (d.length > 8) {
        const w = (0, bn.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, Sn.isOwnProperty)(t, w, $);
      } else d.length ? m = (0, We.or)(...d.map((w) => (0, We._)`${$} === ${w}`)) : m = We.nil;
      return u.length && (m = (0, We.or)(m, ...u.map((w) => (0, We._)`${(0, Sn.usePattern)(e, w)}.test(${$})`))), (0, We.not)(m);
    }
    function g($) {
      t.code((0, We._)`delete ${s}[${$}]`);
    }
    function v($) {
      if (i.removeAdditional === "all" || i.removeAdditional && r === !1) {
        g($);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: $ }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, bn.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        i.removeAdditional === "failing" ? (y($, m, !1), t.if((0, We.not)(m), () => {
          e.reset(), g($);
        })) : (y($, m), l || t.if((0, We.not)(m), () => t.break()));
      }
    }
    function y($, m, w) {
      const P = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: bn.Type.Str
      };
      w === !1 && Object.assign(P, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(P, m);
    }
  }
};
$s.default = Wv;
var Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
const Xv = Ye, $c = se, Vs = V, yc = $s, Jv = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && yc.default.code(new Xv.KeywordCxt(o, yc.default, "additionalProperties"));
    const a = (0, $c.allSchemaProperties)(r);
    for (const h of a)
      o.definedProperties.add(h);
    o.opts.unevaluated && a.length && o.props !== !0 && (o.props = Vs.mergeEvaluated.props(t, (0, Vs.toHash)(a), o.props));
    const l = a.filter((h) => !(0, Vs.alwaysValidSchema)(o, r[h]));
    if (l.length === 0)
      return;
    const i = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, $c.propertyInData)(t, s, h, o.opts.ownProperties)), u(h), o.allErrors || t.else().var(i, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(i);
    function d(h) {
      return o.opts.useDefaults && !o.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, i);
    }
  }
};
Za.default = Jv;
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
const gc = se, Pn = te, _c = V, vc = V, xv = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: o } = e, { opts: a } = o, l = (0, gc.allSchemaProperties)(r), i = l.filter((y) => (0, _c.alwaysValidSchema)(o, r[y]));
    if (l.length === 0 || i.length === l.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const d = a.strictSchema && !a.allowMatchingProperties && s.properties, u = t.name("valid");
    o.props !== !0 && !(o.props instanceof Pn.Name) && (o.props = (0, vc.evaluatedPropsToName)(t, o.props));
    const { props: h } = o;
    E();
    function E() {
      for (const y of l)
        d && g(y), o.allErrors ? v(y) : (t.var(u, !0), v(y), t.if(u));
    }
    function g(y) {
      for (const $ in d)
        new RegExp(y).test($) && (0, _c.checkStrictMode)(o, `property ${$} matches pattern ${y} (use allowMatchingProperties)`);
    }
    function v(y) {
      t.forIn("key", n, ($) => {
        t.if((0, Pn._)`${(0, gc.usePattern)(e, y)}.test(${$})`, () => {
          const m = i.includes(y);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: y,
            dataProp: $,
            dataPropType: vc.Type.Str
          }, u), o.opts.unevaluated && h !== !0 ? t.assign((0, Pn._)`${h}[${$}]`, !0) : !m && !o.allErrors && t.if((0, Pn.not)(u), () => t.break());
        });
      });
    }
  }
};
Qa.default = xv;
var ei = {};
Object.defineProperty(ei, "__esModule", { value: !0 });
const Yv = V, Zv = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Yv.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
ei.default = Zv;
var ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
const Qv = se, ew = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Qv.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
ti.default = ew;
var ri = {};
Object.defineProperty(ri, "__esModule", { value: !0 });
const zn = te, tw = V, rw = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, zn._)`{passingSchemas: ${e.passing}}`
}, nw = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: rw,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const o = r, a = t.let("valid", !1), l = t.let("passing", null), i = t.name("_valid");
    e.setParams({ passing: l }), t.block(d), e.result(a, () => e.reset(), () => e.error(!0));
    function d() {
      o.forEach((u, h) => {
        let E;
        (0, tw.alwaysValidSchema)(s, u) ? t.var(i, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, i), h > 0 && t.if((0, zn._)`${i} && ${a}`).assign(a, !1).assign(l, (0, zn._)`[${l}, ${h}]`).else(), t.if(i, () => {
          t.assign(a, !0), t.assign(l, h), E && e.mergeEvaluated(E, zn.Name);
        });
      });
    }
  }
};
ri.default = nw;
var ni = {};
Object.defineProperty(ni, "__esModule", { value: !0 });
const sw = V, ow = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((o, a) => {
      if ((0, sw.alwaysValidSchema)(n, o))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: a }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
ni.default = ow;
var si = {};
Object.defineProperty(si, "__esModule", { value: !0 });
const es = te, Hu = V, aw = {
  message: ({ params: e }) => (0, es.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, es._)`{failingKeyword: ${e.ifClause}}`
}, iw = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: aw,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Hu.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = wc(n, "then"), o = wc(n, "else");
    if (!s && !o)
      return;
    const a = t.let("valid", !0), l = t.name("_valid");
    if (i(), e.reset(), s && o) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, es.not)(l), d("else"));
    e.pass(a, () => e.error(!0));
    function i() {
      const u = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, l);
      e.mergeEvaluated(u);
    }
    function d(u, h) {
      return () => {
        const E = e.subschema({ keyword: u }, l);
        t.assign(a, l), e.mergeValidEvaluated(E, a), h ? t.assign(h, (0, es._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function wc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Hu.alwaysValidSchema)(e, r);
}
si.default = iw;
var oi = {};
Object.defineProperty(oi, "__esModule", { value: !0 });
const cw = V, lw = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, cw.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
oi.default = lw;
Object.defineProperty(Wa, "__esModule", { value: !0 });
const uw = jr, dw = Xa, fw = kr, hw = Ja, mw = xa, pw = Gu, $w = Ya, yw = $s, gw = Za, _w = Qa, vw = ei, ww = ti, Ew = ri, Sw = ni, bw = si, Pw = oi;
function Nw(e = !1) {
  const t = [
    // any
    vw.default,
    ww.default,
    Ew.default,
    Sw.default,
    bw.default,
    Pw.default,
    // object
    $w.default,
    yw.default,
    pw.default,
    gw.default,
    _w.default
  ];
  return e ? t.push(dw.default, hw.default) : t.push(uw.default, fw.default), t.push(mw.default), t;
}
Wa.default = Nw;
var ai = {}, ii = {};
Object.defineProperty(ii, "__esModule", { value: !0 });
const $e = te, Iw = {
  message: ({ schemaCode: e }) => (0, $e.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, $e._)`{format: ${e}}`
}, Rw = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Iw,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: o, schemaCode: a, it: l } = e, { opts: i, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!i.validateFormats)
      return;
    s ? E() : g();
    function E() {
      const v = r.scopeValue("formats", {
        ref: h.formats,
        code: i.code.formats
      }), y = r.const("fDef", (0, $e._)`${v}[${a}]`), $ = r.let("fType"), m = r.let("format");
      r.if((0, $e._)`typeof ${y} == "object" && !(${y} instanceof RegExp)`, () => r.assign($, (0, $e._)`${y}.type || "string"`).assign(m, (0, $e._)`${y}.validate`), () => r.assign($, (0, $e._)`"string"`).assign(m, y)), e.fail$data((0, $e.or)(w(), P()));
      function w() {
        return i.strictSchema === !1 ? $e.nil : (0, $e._)`${a} && !${m}`;
      }
      function P() {
        const I = u.$async ? (0, $e._)`(${y}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, $e._)`${m}(${n})`, R = (0, $e._)`(typeof ${m} == "function" ? ${I} : ${m}.test(${n}))`;
        return (0, $e._)`${m} && ${m} !== true && ${$} === ${t} && !${R}`;
      }
    }
    function g() {
      const v = h.formats[o];
      if (!v) {
        w();
        return;
      }
      if (v === !0)
        return;
      const [y, $, m] = P(v);
      y === t && e.pass(I());
      function w() {
        if (i.strictSchema === !1) {
          h.logger.warn(R());
          return;
        }
        throw new Error(R());
        function R() {
          return `unknown format "${o}" ignored in schema at path "${d}"`;
        }
      }
      function P(R) {
        const F = R instanceof RegExp ? (0, $e.regexpCode)(R) : i.code.formats ? (0, $e._)`${i.code.formats}${(0, $e.getProperty)(o)}` : void 0, W = r.scopeValue("formats", { key: o, ref: R, code: F });
        return typeof R == "object" && !(R instanceof RegExp) ? [R.type || "string", R.validate, (0, $e._)`${W}.validate`] : ["string", R, W];
      }
      function I() {
        if (typeof v == "object" && !(v instanceof RegExp) && v.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, $e._)`await ${m}(${n})`;
        }
        return typeof $ == "function" ? (0, $e._)`${m}(${n})` : (0, $e._)`${m}.test(${n})`;
      }
    }
  }
};
ii.default = Rw;
Object.defineProperty(ai, "__esModule", { value: !0 });
const Ow = ii, Tw = [Ow.default];
ai.default = Tw;
var br = {};
Object.defineProperty(br, "__esModule", { value: !0 });
br.contentVocabulary = br.metadataVocabulary = void 0;
br.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
br.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(ka, "__esModule", { value: !0 });
const jw = Aa, kw = Da, Aw = Wa, Cw = ai, Ec = br, Dw = [
  jw.default,
  kw.default,
  (0, Aw.default)(),
  Cw.default,
  Ec.metadataVocabulary,
  Ec.contentVocabulary
];
ka.default = Dw;
var ci = {}, ys = {};
Object.defineProperty(ys, "__esModule", { value: !0 });
ys.DiscrError = void 0;
var Sc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Sc || (ys.DiscrError = Sc = {}));
Object.defineProperty(ci, "__esModule", { value: !0 });
const pr = te, uo = ys, bc = De, Mw = Tr, Lw = V, Vw = {
  message: ({ params: { discrError: e, tagName: t } }) => e === uo.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, pr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, Fw = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Vw,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: o } = e, { oneOf: a } = s;
    if (!o.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const l = n.propertyName;
    if (typeof l != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!a)
      throw new Error("discriminator: requires oneOf keyword");
    const i = t.let("valid", !1), d = t.const("tag", (0, pr._)`${r}${(0, pr.getProperty)(l)}`);
    t.if((0, pr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: uo.DiscrError.Tag, tag: d, tagName: l })), e.ok(i);
    function u() {
      const g = E();
      t.if(!1);
      for (const v in g)
        t.elseIf((0, pr._)`${d} === ${v}`), t.assign(i, h(g[v]));
      t.else(), e.error(!1, { discrError: uo.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(g) {
      const v = t.name("valid"), y = e.subschema({ keyword: "oneOf", schemaProp: g }, v);
      return e.mergeEvaluated(y, pr.Name), v;
    }
    function E() {
      var g;
      const v = {}, y = m(s);
      let $ = !0;
      for (let I = 0; I < a.length; I++) {
        let R = a[I];
        if (R != null && R.$ref && !(0, Lw.schemaHasRulesButRef)(R, o.self.RULES)) {
          const W = R.$ref;
          if (R = bc.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, W), R instanceof bc.SchemaEnv && (R = R.schema), R === void 0)
            throw new Mw.default(o.opts.uriResolver, o.baseId, W);
        }
        const F = (g = R == null ? void 0 : R.properties) === null || g === void 0 ? void 0 : g[l];
        if (typeof F != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        $ = $ && (y || m(R)), w(F, I);
      }
      if (!$)
        throw new Error(`discriminator: "${l}" must be required`);
      return v;
      function m({ required: I }) {
        return Array.isArray(I) && I.includes(l);
      }
      function w(I, R) {
        if (I.const)
          P(I.const, R);
        else if (I.enum)
          for (const F of I.enum)
            P(F, R);
        else
          throw new Error(`discriminator: "properties/${l}" must have "const" or "enum"`);
      }
      function P(I, R) {
        if (typeof I != "string" || I in v)
          throw new Error(`discriminator: "${l}" values must be unique strings`);
        v[I] = R;
      }
    }
  }
};
ci.default = Fw;
const Uw = "http://json-schema.org/draft-07/schema#", zw = "http://json-schema.org/draft-07/schema#", qw = "Core schema meta-schema", Gw = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, Kw = [
  "object",
  "boolean"
], Hw = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, Bw = {
  $schema: Uw,
  $id: zw,
  title: qw,
  definitions: Gw,
  type: Kw,
  properties: Hw,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = ou, n = ka, s = ci, o = Bw, a = ["/properties"], l = "http://json-schema.org/draft-07/schema";
  class i extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((v) => this.addVocabulary(v)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const v = this.opts.$data ? this.$dataMetaSchema(o, a) : o;
      this.addMetaSchema(v, l, !1), this.refs["http://json-schema.org/schema"] = l;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(l) ? l : void 0);
    }
  }
  t.Ajv = i, e.exports = t = i, e.exports.Ajv = i, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = i;
  var d = Ye;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var u = te;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return u._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return u.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return u.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return u.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return u.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return u.CodeGen;
  } });
  var h = fn;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var E = Tr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return E.default;
  } });
})(no, no.exports);
var Ww = no.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = Ww, r = te, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, o = {
    message: ({ keyword: l, schemaCode: i }) => (0, r.str)`should be ${s[l].okStr} ${i}`,
    params: ({ keyword: l, schemaCode: i }) => (0, r._)`{comparison: ${s[l].okStr}, limit: ${i}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: o,
    code(l) {
      const { gen: i, data: d, schemaCode: u, keyword: h, it: E } = l, { opts: g, self: v } = E;
      if (!g.validateFormats)
        return;
      const y = new t.KeywordCxt(E, v.RULES.all.format.definition, "format");
      y.$data ? $() : m();
      function $() {
        const P = i.scopeValue("formats", {
          ref: v.formats,
          code: g.code.formats
        }), I = i.const("fmt", (0, r._)`${P}[${y.schemaCode}]`);
        l.fail$data((0, r.or)((0, r._)`typeof ${I} != "object"`, (0, r._)`${I} instanceof RegExp`, (0, r._)`typeof ${I}.compare != "function"`, w(I)));
      }
      function m() {
        const P = y.schema, I = v.formats[P];
        if (!I || I === !0)
          return;
        if (typeof I != "object" || I instanceof RegExp || typeof I.compare != "function")
          throw new Error(`"${h}": format "${P}" does not define "compare" function`);
        const R = i.scopeValue("formats", {
          key: P,
          ref: I,
          code: g.code.formats ? (0, r._)`${g.code.formats}${(0, r.getProperty)(P)}` : void 0
        });
        l.fail$data(w(R));
      }
      function w(P) {
        return (0, r._)`${P}.compare(${d}, ${u}) ${s[h].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const a = (l) => (l.addKeyword(e.formatLimitDefinition), l);
  e.default = a;
})(su);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = nu, n = su, s = te, o = new s.Name("fullFormats"), a = new s.Name("fastFormats"), l = (d, u = { keywords: !0 }) => {
    if (Array.isArray(u))
      return i(d, u, r.fullFormats, o), d;
    const [h, E] = u.mode === "fast" ? [r.fastFormats, a] : [r.fullFormats, o], g = u.formats || r.formatNames;
    return i(d, g, h, E), u.keywords && (0, n.default)(d), d;
  };
  l.get = (d, u = "full") => {
    const E = (u === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!E)
      throw new Error(`Unknown format "${d}"`);
    return E;
  };
  function i(d, u, h, E) {
    var g, v;
    (g = (v = d.opts.code).formats) !== null && g !== void 0 || (v.formats = (0, s._)`require("ajv-formats/dist/formats").${E}`);
    for (const y of u)
      d.addFormat(y, h[y]);
  }
  e.exports = t = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
})(ro, ro.exports);
var Xw = ro.exports;
const Jw = /* @__PURE__ */ ol(Xw), xw = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), o = Object.getOwnPropertyDescriptor(t, r);
  !Yw(s, o) && n || Object.defineProperty(e, r, o);
}, Yw = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, Zw = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, Qw = (e, t) => `/* Wrapped ${e}*/
${t}`, eE = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), tE = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), rE = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = Qw.bind(null, n, t.toString());
  Object.defineProperty(s, "name", tE);
  const { writable: o, enumerable: a, configurable: l } = eE;
  Object.defineProperty(e, "toString", { value: s, writable: o, enumerable: a, configurable: l });
};
function nE(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    xw(e, t, s, r);
  return Zw(e, t), rE(e, t, n), e;
}
const Pc = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: s = !1,
    after: o = !0
  } = t;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!s && !o)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let a, l, i;
  const d = function(...u) {
    const h = this, E = () => {
      a = void 0, l && (clearTimeout(l), l = void 0), o && (i = e.apply(h, u));
    }, g = () => {
      l = void 0, a && (clearTimeout(a), a = void 0), o && (i = e.apply(h, u));
    }, v = s && !a;
    return clearTimeout(a), a = setTimeout(E, r), n > 0 && n !== Number.POSITIVE_INFINITY && !l && (l = setTimeout(g, n)), v && (i = e.apply(h, u)), i;
  };
  return nE(d, e), d.cancel = () => {
    a && (clearTimeout(a), a = void 0), l && (clearTimeout(l), l = void 0);
  }, d;
};
var fo = { exports: {} };
const sE = "2.0.0", Bu = 256, oE = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, aE = 16, iE = Bu - 6, cE = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var gs = {
  MAX_LENGTH: Bu,
  MAX_SAFE_COMPONENT_LENGTH: aE,
  MAX_SAFE_BUILD_LENGTH: iE,
  MAX_SAFE_INTEGER: oE,
  RELEASE_TYPES: cE,
  SEMVER_SPEC_VERSION: sE,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const lE = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var _s = lE;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = gs, o = _s;
  t = e.exports = {};
  const a = t.re = [], l = t.safeRe = [], i = t.src = [], d = t.safeSrc = [], u = t.t = {};
  let h = 0;
  const E = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", s],
    [E, n]
  ], v = ($) => {
    for (const [m, w] of g)
      $ = $.split(`${m}*`).join(`${m}{0,${w}}`).split(`${m}+`).join(`${m}{1,${w}}`);
    return $;
  }, y = ($, m, w) => {
    const P = v(m), I = h++;
    o($, I, m), u[$] = I, i[I] = m, d[I] = P, a[I] = new RegExp(m, w ? "g" : void 0), l[I] = new RegExp(P, w ? "g" : void 0);
  };
  y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${E}*`), y("MAINVERSION", `(${i[u.NUMERICIDENTIFIER]})\\.(${i[u.NUMERICIDENTIFIER]})\\.(${i[u.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${i[u.NUMERICIDENTIFIERLOOSE]})\\.(${i[u.NUMERICIDENTIFIERLOOSE]})\\.(${i[u.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${i[u.NONNUMERICIDENTIFIER]}|${i[u.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${i[u.NONNUMERICIDENTIFIER]}|${i[u.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${i[u.PRERELEASEIDENTIFIER]}(?:\\.${i[u.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${i[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${i[u.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${E}+`), y("BUILD", `(?:\\+(${i[u.BUILDIDENTIFIER]}(?:\\.${i[u.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${i[u.MAINVERSION]}${i[u.PRERELEASE]}?${i[u.BUILD]}?`), y("FULL", `^${i[u.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${i[u.MAINVERSIONLOOSE]}${i[u.PRERELEASELOOSE]}?${i[u.BUILD]}?`), y("LOOSE", `^${i[u.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${i[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${i[u.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${i[u.XRANGEIDENTIFIER]})(?:\\.(${i[u.XRANGEIDENTIFIER]})(?:\\.(${i[u.XRANGEIDENTIFIER]})(?:${i[u.PRERELEASE]})?${i[u.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${i[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${i[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${i[u.XRANGEIDENTIFIERLOOSE]})(?:${i[u.PRERELEASELOOSE]})?${i[u.BUILD]}?)?)?`), y("XRANGE", `^${i[u.GTLT]}\\s*${i[u.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${i[u.GTLT]}\\s*${i[u.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), y("COERCE", `${i[u.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", i[u.COERCEPLAIN] + `(?:${i[u.PRERELEASE]})?(?:${i[u.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", i[u.COERCE], !0), y("COERCERTLFULL", i[u.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${i[u.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", y("TILDE", `^${i[u.LONETILDE]}${i[u.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${i[u.LONETILDE]}${i[u.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${i[u.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", y("CARET", `^${i[u.LONECARET]}${i[u.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${i[u.LONECARET]}${i[u.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${i[u.GTLT]}\\s*(${i[u.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${i[u.GTLT]}\\s*(${i[u.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${i[u.GTLT]}\\s*(${i[u.LOOSEPLAIN]}|${i[u.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${i[u.XRANGEPLAIN]})\\s+-\\s+(${i[u.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${i[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${i[u.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(fo, fo.exports);
var mn = fo.exports;
const uE = Object.freeze({ loose: !0 }), dE = Object.freeze({}), fE = (e) => e ? typeof e != "object" ? uE : e : dE;
var li = fE;
const Nc = /^[0-9]+$/, Wu = (e, t) => {
  const r = Nc.test(e), n = Nc.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, hE = (e, t) => Wu(t, e);
var Xu = {
  compareIdentifiers: Wu,
  rcompareIdentifiers: hE
};
const Nn = _s, { MAX_LENGTH: Ic, MAX_SAFE_INTEGER: In } = gs, { safeRe: Rn, t: On } = mn, mE = li, { compareIdentifiers: dr } = Xu;
let pE = class et {
  constructor(t, r) {
    if (r = mE(r), t instanceof et) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Ic)
      throw new TypeError(
        `version is longer than ${Ic} characters`
      );
    Nn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Rn[On.LOOSE] : Rn[On.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > In || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > In || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > In || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const o = +s;
        if (o >= 0 && o < In)
          return o;
      }
      return s;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (Nn("SemVer.compare", this.version, this.options, t), !(t instanceof et)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new et(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof et || (t = new et(t, this.options)), dr(this.major, t.major) || dr(this.minor, t.minor) || dr(this.patch, t.patch);
  }
  comparePre(t) {
    if (t instanceof et || (t = new et(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = t.prerelease[r];
      if (Nn("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return dr(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof et || (t = new et(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (Nn("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return dr(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? Rn[On.PRERELEASELOOSE] : Rn[On.PRERELEASE]);
        if (!s || s[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const s = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [s];
        else {
          let o = this.prerelease.length;
          for (; --o >= 0; )
            typeof this.prerelease[o] == "number" && (this.prerelease[o]++, o = -2);
          if (o === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(s);
          }
        }
        if (r) {
          let o = [r, s];
          n === !1 && (o = [r]), dr(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var ke = pE;
const Rc = ke, $E = (e, t, r = !1) => {
  if (e instanceof Rc)
    return e;
  try {
    return new Rc(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Ar = $E;
const yE = Ar, gE = (e, t) => {
  const r = yE(e, t);
  return r ? r.version : null;
};
var _E = gE;
const vE = Ar, wE = (e, t) => {
  const r = vE(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var EE = wE;
const Oc = ke, SE = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Oc(
      e instanceof Oc ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var bE = SE;
const Tc = Ar, PE = (e, t) => {
  const r = Tc(e, null, !0), n = Tc(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const o = s > 0, a = o ? r : n, l = o ? n : r, i = !!a.prerelease.length;
  if (!!l.prerelease.length && !i) {
    if (!l.patch && !l.minor)
      return "major";
    if (l.compareMain(a) === 0)
      return l.minor && !l.patch ? "minor" : "patch";
  }
  const u = i ? "pre" : "";
  return r.major !== n.major ? u + "major" : r.minor !== n.minor ? u + "minor" : r.patch !== n.patch ? u + "patch" : "prerelease";
};
var NE = PE;
const IE = ke, RE = (e, t) => new IE(e, t).major;
var OE = RE;
const TE = ke, jE = (e, t) => new TE(e, t).minor;
var kE = jE;
const AE = ke, CE = (e, t) => new AE(e, t).patch;
var DE = CE;
const ME = Ar, LE = (e, t) => {
  const r = ME(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var VE = LE;
const jc = ke, FE = (e, t, r) => new jc(e, r).compare(new jc(t, r));
var Ze = FE;
const UE = Ze, zE = (e, t, r) => UE(t, e, r);
var qE = zE;
const GE = Ze, KE = (e, t) => GE(e, t, !0);
var HE = KE;
const kc = ke, BE = (e, t, r) => {
  const n = new kc(e, r), s = new kc(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var ui = BE;
const WE = ui, XE = (e, t) => e.sort((r, n) => WE(r, n, t));
var JE = XE;
const xE = ui, YE = (e, t) => e.sort((r, n) => xE(n, r, t));
var ZE = YE;
const QE = Ze, e1 = (e, t, r) => QE(e, t, r) > 0;
var vs = e1;
const t1 = Ze, r1 = (e, t, r) => t1(e, t, r) < 0;
var di = r1;
const n1 = Ze, s1 = (e, t, r) => n1(e, t, r) === 0;
var Ju = s1;
const o1 = Ze, a1 = (e, t, r) => o1(e, t, r) !== 0;
var xu = a1;
const i1 = Ze, c1 = (e, t, r) => i1(e, t, r) >= 0;
var fi = c1;
const l1 = Ze, u1 = (e, t, r) => l1(e, t, r) <= 0;
var hi = u1;
const d1 = Ju, f1 = xu, h1 = vs, m1 = fi, p1 = di, $1 = hi, y1 = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return d1(e, r, n);
    case "!=":
      return f1(e, r, n);
    case ">":
      return h1(e, r, n);
    case ">=":
      return m1(e, r, n);
    case "<":
      return p1(e, r, n);
    case "<=":
      return $1(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Yu = y1;
const g1 = ke, _1 = Ar, { safeRe: Tn, t: jn } = mn, v1 = (e, t) => {
  if (e instanceof g1)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Tn[jn.COERCEFULL] : Tn[jn.COERCE]);
  else {
    const i = t.includePrerelease ? Tn[jn.COERCERTLFULL] : Tn[jn.COERCERTL];
    let d;
    for (; (d = i.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), i.lastIndex = d.index + d[1].length + d[2].length;
    i.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", o = r[4] || "0", a = t.includePrerelease && r[5] ? `-${r[5]}` : "", l = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return _1(`${n}.${s}.${o}${a}${l}`, t);
};
var w1 = v1;
class E1 {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const s = this.map.keys().next().value;
        this.delete(s);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var S1 = E1, Fs, Ac;
function Qe() {
  if (Ac) return Fs;
  Ac = 1;
  const e = /\s+/g;
  class t {
    constructor(k, U) {
      if (U = s(U), k instanceof t)
        return k.loose === !!U.loose && k.includePrerelease === !!U.includePrerelease ? k : new t(k.raw, U);
      if (k instanceof o)
        return this.raw = k.value, this.set = [[k]], this.formatted = void 0, this;
      if (this.options = U, this.loose = !!U.loose, this.includePrerelease = !!U.includePrerelease, this.raw = k.trim().replace(e, " "), this.set = this.raw.split("||").map((M) => this.parseRange(M.trim())).filter((M) => M.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const M = this.set[0];
        if (this.set = this.set.filter((K) => !y(K[0])), this.set.length === 0)
          this.set = [M];
        else if (this.set.length > 1) {
          for (const K of this.set)
            if (K.length === 1 && $(K[0])) {
              this.set = [K];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let k = 0; k < this.set.length; k++) {
          k > 0 && (this.formatted += "||");
          const U = this.set[k];
          for (let M = 0; M < U.length; M++)
            M > 0 && (this.formatted += " "), this.formatted += U[M].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(k) {
      const M = ((this.options.includePrerelease && g) | (this.options.loose && v)) + ":" + k, K = n.get(M);
      if (K)
        return K;
      const L = this.options.loose, N = L ? i[d.HYPHENRANGELOOSE] : i[d.HYPHENRANGE];
      k = k.replace(N, q(this.options.includePrerelease)), a("hyphen replace", k), k = k.replace(i[d.COMPARATORTRIM], u), a("comparator trim", k), k = k.replace(i[d.TILDETRIM], h), a("tilde trim", k), k = k.replace(i[d.CARETTRIM], E), a("caret trim", k);
      let p = k.split(" ").map((f) => w(f, this.options)).join(" ").split(/\s+/).map((f) => D(f, this.options));
      L && (p = p.filter((f) => (a("loose invalid filter", f, this.options), !!f.match(i[d.COMPARATORLOOSE])))), a("range list", p);
      const b = /* @__PURE__ */ new Map(), _ = p.map((f) => new o(f, this.options));
      for (const f of _) {
        if (y(f))
          return [f];
        b.set(f.value, f);
      }
      b.size > 1 && b.has("") && b.delete("");
      const c = [...b.values()];
      return n.set(M, c), c;
    }
    intersects(k, U) {
      if (!(k instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((M) => m(M, U) && k.set.some((K) => m(K, U) && M.every((L) => K.every((N) => L.intersects(N, U)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(k) {
      if (!k)
        return !1;
      if (typeof k == "string")
        try {
          k = new l(k, this.options);
        } catch {
          return !1;
        }
      for (let U = 0; U < this.set.length; U++)
        if (oe(this.set[U], k, this.options))
          return !0;
      return !1;
    }
  }
  Fs = t;
  const r = S1, n = new r(), s = li, o = ws(), a = _s, l = ke, {
    safeRe: i,
    t: d,
    comparatorTrimReplace: u,
    tildeTrimReplace: h,
    caretTrimReplace: E
  } = mn, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: v } = gs, y = (O) => O.value === "<0.0.0-0", $ = (O) => O.value === "", m = (O, k) => {
    let U = !0;
    const M = O.slice();
    let K = M.pop();
    for (; U && M.length; )
      U = M.every((L) => K.intersects(L, k)), K = M.pop();
    return U;
  }, w = (O, k) => (a("comp", O, k), O = F(O, k), a("caret", O), O = I(O, k), a("tildes", O), O = Y(O, k), a("xrange", O), O = ie(O, k), a("stars", O), O), P = (O) => !O || O.toLowerCase() === "x" || O === "*", I = (O, k) => O.trim().split(/\s+/).map((U) => R(U, k)).join(" "), R = (O, k) => {
    const U = k.loose ? i[d.TILDELOOSE] : i[d.TILDE];
    return O.replace(U, (M, K, L, N, p) => {
      a("tilde", O, M, K, L, N, p);
      let b;
      return P(K) ? b = "" : P(L) ? b = `>=${K}.0.0 <${+K + 1}.0.0-0` : P(N) ? b = `>=${K}.${L}.0 <${K}.${+L + 1}.0-0` : p ? (a("replaceTilde pr", p), b = `>=${K}.${L}.${N}-${p} <${K}.${+L + 1}.0-0`) : b = `>=${K}.${L}.${N} <${K}.${+L + 1}.0-0`, a("tilde return", b), b;
    });
  }, F = (O, k) => O.trim().split(/\s+/).map((U) => W(U, k)).join(" "), W = (O, k) => {
    a("caret", O, k);
    const U = k.loose ? i[d.CARETLOOSE] : i[d.CARET], M = k.includePrerelease ? "-0" : "";
    return O.replace(U, (K, L, N, p, b) => {
      a("caret", O, K, L, N, p, b);
      let _;
      return P(L) ? _ = "" : P(N) ? _ = `>=${L}.0.0${M} <${+L + 1}.0.0-0` : P(p) ? L === "0" ? _ = `>=${L}.${N}.0${M} <${L}.${+N + 1}.0-0` : _ = `>=${L}.${N}.0${M} <${+L + 1}.0.0-0` : b ? (a("replaceCaret pr", b), L === "0" ? N === "0" ? _ = `>=${L}.${N}.${p}-${b} <${L}.${N}.${+p + 1}-0` : _ = `>=${L}.${N}.${p}-${b} <${L}.${+N + 1}.0-0` : _ = `>=${L}.${N}.${p}-${b} <${+L + 1}.0.0-0`) : (a("no pr"), L === "0" ? N === "0" ? _ = `>=${L}.${N}.${p}${M} <${L}.${N}.${+p + 1}-0` : _ = `>=${L}.${N}.${p}${M} <${L}.${+N + 1}.0-0` : _ = `>=${L}.${N}.${p} <${+L + 1}.0.0-0`), a("caret return", _), _;
    });
  }, Y = (O, k) => (a("replaceXRanges", O, k), O.split(/\s+/).map((U) => ce(U, k)).join(" ")), ce = (O, k) => {
    O = O.trim();
    const U = k.loose ? i[d.XRANGELOOSE] : i[d.XRANGE];
    return O.replace(U, (M, K, L, N, p, b) => {
      a("xRange", O, M, K, L, N, p, b);
      const _ = P(L), c = _ || P(N), f = c || P(p), S = f;
      return K === "=" && S && (K = ""), b = k.includePrerelease ? "-0" : "", _ ? K === ">" || K === "<" ? M = "<0.0.0-0" : M = "*" : K && S ? (c && (N = 0), p = 0, K === ">" ? (K = ">=", c ? (L = +L + 1, N = 0, p = 0) : (N = +N + 1, p = 0)) : K === "<=" && (K = "<", c ? L = +L + 1 : N = +N + 1), K === "<" && (b = "-0"), M = `${K + L}.${N}.${p}${b}`) : c ? M = `>=${L}.0.0${b} <${+L + 1}.0.0-0` : f && (M = `>=${L}.${N}.0${b} <${L}.${+N + 1}.0-0`), a("xRange return", M), M;
    });
  }, ie = (O, k) => (a("replaceStars", O, k), O.trim().replace(i[d.STAR], "")), D = (O, k) => (a("replaceGTE0", O, k), O.trim().replace(i[k.includePrerelease ? d.GTE0PRE : d.GTE0], "")), q = (O) => (k, U, M, K, L, N, p, b, _, c, f, S) => (P(M) ? U = "" : P(K) ? U = `>=${M}.0.0${O ? "-0" : ""}` : P(L) ? U = `>=${M}.${K}.0${O ? "-0" : ""}` : N ? U = `>=${U}` : U = `>=${U}${O ? "-0" : ""}`, P(_) ? b = "" : P(c) ? b = `<${+_ + 1}.0.0-0` : P(f) ? b = `<${_}.${+c + 1}.0-0` : S ? b = `<=${_}.${c}.${f}-${S}` : O ? b = `<${_}.${c}.${+f + 1}-0` : b = `<=${b}`, `${U} ${b}`.trim()), oe = (O, k, U) => {
    for (let M = 0; M < O.length; M++)
      if (!O[M].test(k))
        return !1;
    if (k.prerelease.length && !U.includePrerelease) {
      for (let M = 0; M < O.length; M++)
        if (a(O[M].semver), O[M].semver !== o.ANY && O[M].semver.prerelease.length > 0) {
          const K = O[M].semver;
          if (K.major === k.major && K.minor === k.minor && K.patch === k.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Fs;
}
var Us, Cc;
function ws() {
  if (Cc) return Us;
  Cc = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(u, h) {
      if (h = r(h), u instanceof t) {
        if (u.loose === !!h.loose)
          return u;
        u = u.value;
      }
      u = u.trim().split(/\s+/).join(" "), a("comparator", u, h), this.options = h, this.loose = !!h.loose, this.parse(u), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(u) {
      const h = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], E = u.match(h);
      if (!E)
        throw new TypeError(`Invalid comparator: ${u}`);
      this.operator = E[1] !== void 0 ? E[1] : "", this.operator === "=" && (this.operator = ""), E[2] ? this.semver = new l(E[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(u) {
      if (a("Comparator.test", u, this.options.loose), this.semver === e || u === e)
        return !0;
      if (typeof u == "string")
        try {
          u = new l(u, this.options);
        } catch {
          return !1;
        }
      return o(u, this.operator, this.semver, this.options);
    }
    intersects(u, h) {
      if (!(u instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new i(u.value, h).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new i(this.value, h).test(u.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || o(this.semver, "<", u.semver, h) && this.operator.startsWith(">") && u.operator.startsWith("<") || o(this.semver, ">", u.semver, h) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  Us = t;
  const r = li, { safeRe: n, t: s } = mn, o = Yu, a = _s, l = ke, i = Qe();
  return Us;
}
const b1 = Qe(), P1 = (e, t, r) => {
  try {
    t = new b1(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Es = P1;
const N1 = Qe(), I1 = (e, t) => new N1(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var R1 = I1;
const O1 = ke, T1 = Qe(), j1 = (e, t, r) => {
  let n = null, s = null, o = null;
  try {
    o = new T1(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || s.compare(a) === -1) && (n = a, s = new O1(n, r));
  }), n;
};
var k1 = j1;
const A1 = ke, C1 = Qe(), D1 = (e, t, r) => {
  let n = null, s = null, o = null;
  try {
    o = new C1(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || s.compare(a) === 1) && (n = a, s = new A1(n, r));
  }), n;
};
var M1 = D1;
const zs = ke, L1 = Qe(), Dc = vs, V1 = (e, t) => {
  e = new L1(e, t);
  let r = new zs("0.0.0");
  if (e.test(r) || (r = new zs("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let o = null;
    s.forEach((a) => {
      const l = new zs(a.semver.version);
      switch (a.operator) {
        case ">":
          l.prerelease.length === 0 ? l.patch++ : l.prerelease.push(0), l.raw = l.format();
        case "":
        case ">=":
          (!o || Dc(l, o)) && (o = l);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!r || Dc(r, o)) && (r = o);
  }
  return r && e.test(r) ? r : null;
};
var F1 = V1;
const U1 = Qe(), z1 = (e, t) => {
  try {
    return new U1(e, t).range || "*";
  } catch {
    return null;
  }
};
var q1 = z1;
const G1 = ke, Zu = ws(), { ANY: K1 } = Zu, H1 = Qe(), B1 = Es, Mc = vs, Lc = di, W1 = hi, X1 = fi, J1 = (e, t, r, n) => {
  e = new G1(e, n), t = new H1(t, n);
  let s, o, a, l, i;
  switch (r) {
    case ">":
      s = Mc, o = W1, a = Lc, l = ">", i = ">=";
      break;
    case "<":
      s = Lc, o = X1, a = Mc, l = "<", i = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (B1(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const u = t.set[d];
    let h = null, E = null;
    if (u.forEach((g) => {
      g.semver === K1 && (g = new Zu(">=0.0.0")), h = h || g, E = E || g, s(g.semver, h.semver, n) ? h = g : a(g.semver, E.semver, n) && (E = g);
    }), h.operator === l || h.operator === i || (!E.operator || E.operator === l) && o(e, E.semver))
      return !1;
    if (E.operator === i && a(e, E.semver))
      return !1;
  }
  return !0;
};
var mi = J1;
const x1 = mi, Y1 = (e, t, r) => x1(e, t, ">", r);
var Z1 = Y1;
const Q1 = mi, eS = (e, t, r) => Q1(e, t, "<", r);
var tS = eS;
const Vc = Qe(), rS = (e, t, r) => (e = new Vc(e, r), t = new Vc(t, r), e.intersects(t, r));
var nS = rS;
const sS = Es, oS = Ze;
var aS = (e, t, r) => {
  const n = [];
  let s = null, o = null;
  const a = e.sort((u, h) => oS(u, h, r));
  for (const u of a)
    sS(u, t, r) ? (o = u, s || (s = u)) : (o && n.push([s, o]), o = null, s = null);
  s && n.push([s, null]);
  const l = [];
  for (const [u, h] of n)
    u === h ? l.push(u) : !h && u === a[0] ? l.push("*") : h ? u === a[0] ? l.push(`<=${h}`) : l.push(`${u} - ${h}`) : l.push(`>=${u}`);
  const i = l.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return i.length < d.length ? i : t;
};
const Fc = Qe(), pi = ws(), { ANY: qs } = pi, Kr = Es, $i = Ze, iS = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Fc(e, r), t = new Fc(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const o of t.set) {
      const a = lS(s, o, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, cS = [new pi(">=0.0.0-0")], Uc = [new pi(">=0.0.0")], lS = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === qs) {
    if (t.length === 1 && t[0].semver === qs)
      return !0;
    r.includePrerelease ? e = cS : e = Uc;
  }
  if (t.length === 1 && t[0].semver === qs) {
    if (r.includePrerelease)
      return !0;
    t = Uc;
  }
  const n = /* @__PURE__ */ new Set();
  let s, o;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? s = zc(s, g, r) : g.operator === "<" || g.operator === "<=" ? o = qc(o, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let a;
  if (s && o) {
    if (a = $i(s.semver, o.semver, r), a > 0)
      return null;
    if (a === 0 && (s.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const g of n) {
    if (s && !Kr(g, String(s), r) || o && !Kr(g, String(o), r))
      return null;
    for (const v of t)
      if (!Kr(g, String(v), r))
        return !1;
    return !0;
  }
  let l, i, d, u, h = o && !r.includePrerelease && o.semver.prerelease.length ? o.semver : !1, E = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && o.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const g of t) {
    if (u = u || g.operator === ">" || g.operator === ">=", d = d || g.operator === "<" || g.operator === "<=", s) {
      if (E && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === E.major && g.semver.minor === E.minor && g.semver.patch === E.patch && (E = !1), g.operator === ">" || g.operator === ">=") {
        if (l = zc(s, g, r), l === g && l !== s)
          return !1;
      } else if (s.operator === ">=" && !Kr(s.semver, String(g), r))
        return !1;
    }
    if (o) {
      if (h && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === h.major && g.semver.minor === h.minor && g.semver.patch === h.patch && (h = !1), g.operator === "<" || g.operator === "<=") {
        if (i = qc(o, g, r), i === g && i !== o)
          return !1;
      } else if (o.operator === "<=" && !Kr(o.semver, String(g), r))
        return !1;
    }
    if (!g.operator && (o || s) && a !== 0)
      return !1;
  }
  return !(s && d && !o && a !== 0 || o && u && !s && a !== 0 || E || h);
}, zc = (e, t, r) => {
  if (!e)
    return t;
  const n = $i(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, qc = (e, t, r) => {
  if (!e)
    return t;
  const n = $i(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var uS = iS;
const Gs = mn, Gc = gs, dS = ke, Kc = Xu, fS = Ar, hS = _E, mS = EE, pS = bE, $S = NE, yS = OE, gS = kE, _S = DE, vS = VE, wS = Ze, ES = qE, SS = HE, bS = ui, PS = JE, NS = ZE, IS = vs, RS = di, OS = Ju, TS = xu, jS = fi, kS = hi, AS = Yu, CS = w1, DS = ws(), MS = Qe(), LS = Es, VS = R1, FS = k1, US = M1, zS = F1, qS = q1, GS = mi, KS = Z1, HS = tS, BS = nS, WS = aS, XS = uS;
var JS = {
  parse: fS,
  valid: hS,
  clean: mS,
  inc: pS,
  diff: $S,
  major: yS,
  minor: gS,
  patch: _S,
  prerelease: vS,
  compare: wS,
  rcompare: ES,
  compareLoose: SS,
  compareBuild: bS,
  sort: PS,
  rsort: NS,
  gt: IS,
  lt: RS,
  eq: OS,
  neq: TS,
  gte: jS,
  lte: kS,
  cmp: AS,
  coerce: CS,
  Comparator: DS,
  Range: MS,
  satisfies: LS,
  toComparators: VS,
  maxSatisfying: FS,
  minSatisfying: US,
  minVersion: zS,
  validRange: qS,
  outside: GS,
  gtr: KS,
  ltr: HS,
  intersects: BS,
  simplifyRange: WS,
  subset: XS,
  SemVer: dS,
  re: Gs.re,
  src: Gs.src,
  tokens: Gs.t,
  SEMVER_SPEC_VERSION: Gc.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Gc.RELEASE_TYPES,
  compareIdentifiers: Kc.compareIdentifiers,
  rcompareIdentifiers: Kc.rcompareIdentifiers
};
const fr = /* @__PURE__ */ ol(JS), xS = Object.prototype.toString, YS = "[object Uint8Array]", ZS = "[object ArrayBuffer]";
function Qu(e, t, r) {
  return e ? e.constructor === t ? !0 : xS.call(e) === r : !1;
}
function ed(e) {
  return Qu(e, Uint8Array, YS);
}
function QS(e) {
  return Qu(e, ArrayBuffer, ZS);
}
function eb(e) {
  return ed(e) || QS(e);
}
function tb(e) {
  if (!ed(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function rb(e) {
  if (!eb(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Hc(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, o) => s + o.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    tb(s), r.set(s, n), n += s.length;
  return r;
}
const kn = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Bc(e, t = "utf8") {
  return rb(e), kn[t] ?? (kn[t] = new globalThis.TextDecoder(t)), kn[t].decode(e);
}
function nb(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const sb = new globalThis.TextEncoder();
function Ks(e) {
  return nb(e), sb.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const ob = Jw.default, Wc = "aes-256-cbc", hr = () => /* @__PURE__ */ Object.create(null), ab = (e) => e != null, ib = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, qn = "__internal__", Hs = `${qn}.migrations.version`;
var It, ct, Ve, lt;
class cb {
  constructor(t = {}) {
    Mr(this, "path");
    Mr(this, "events");
    Lr(this, It);
    Lr(this, ct);
    Lr(this, Ve);
    Lr(this, lt, {});
    Mr(this, "_deserialize", (t) => JSON.parse(t));
    Mr(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = {
      configName: "config",
      fileExtension: "json",
      projectSuffix: "nodejs",
      clearInvalidConfig: !1,
      accessPropertiesByDotNotation: !0,
      configFileMode: 438,
      ...t
    };
    if (!r.cwd) {
      if (!r.projectName)
        throw new Error("Please specify the `projectName` option.");
      r.cwd = Od(r.projectName, { suffix: r.projectSuffix }).config;
    }
    if (Vr(this, Ve, r), r.schema ?? r.ajvOptions ?? r.rootSchema) {
      if (r.schema && typeof r.schema != "object")
        throw new TypeError("The `schema` option must be an object.");
      const a = new Mg.Ajv2020({
        allErrors: !0,
        useDefaults: !0,
        ...r.ajvOptions
      });
      ob(a);
      const l = {
        ...r.rootSchema,
        type: "object",
        properties: r.schema
      };
      Vr(this, It, a.compile(l));
      for (const [i, d] of Object.entries(r.schema ?? {}))
        d != null && d.default && (he(this, lt)[i] = d.default);
    }
    r.defaults && Vr(this, lt, {
      ...he(this, lt),
      ...r.defaults
    }), r.serialize && (this._serialize = r.serialize), r.deserialize && (this._deserialize = r.deserialize), this.events = new EventTarget(), Vr(this, ct, r.encryptionKey);
    const n = r.fileExtension ? `.${r.fileExtension}` : "";
    this.path = C.resolve(r.cwd, `${r.configName ?? "config"}${n}`);
    const s = this.store, o = Object.assign(hr(), r.defaults, s);
    if (r.migrations) {
      if (!r.projectVersion)
        throw new Error("Please specify the `projectVersion` option.");
      this._migrate(r.migrations, r.projectVersion, r.beforeEachMigration);
    }
    this._validate(o);
    try {
      vd.deepEqual(s, o);
    } catch {
      this.store = o;
    }
    r.watch && this._watch();
  }
  get(t, r) {
    if (he(this, Ve).accessPropertiesByDotNotation)
      return this._get(t, r);
    const { store: n } = this;
    return t in n ? n[t] : r;
  }
  set(t, r) {
    if (typeof t != "string" && typeof t != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof t}`);
    if (typeof t != "object" && r === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(t))
      throw new TypeError(`Please don't use the ${qn} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (o, a) => {
      ib(o, a), he(this, Ve).accessPropertiesByDotNotation ? wi(n, o, a) : n[o] = a;
    };
    if (typeof t == "object") {
      const o = t;
      for (const [a, l] of Object.entries(o))
        s(a, l);
    } else
      s(t, r);
    this.store = n;
  }
  has(t) {
    return he(this, Ve).accessPropertiesByDotNotation ? Pd(this.store, t) : t in this.store;
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      ab(he(this, lt)[r]) && this.set(r, he(this, lt)[r]);
  }
  delete(t) {
    const { store: r } = this;
    he(this, Ve).accessPropertiesByDotNotation ? bd(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    this.store = hr();
    for (const t of Object.keys(he(this, lt)))
      this.reset(t);
  }
  onDidChange(t, r) {
    if (typeof t != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof t}`);
    if (typeof r != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof r}`);
    return this._handleChange(() => this.get(t), r);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(t) {
    if (typeof t != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof t}`);
    return this._handleChange(() => this.store, t);
  }
  get size() {
    return Object.keys(this.store).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    try {
      const t = ee.readFileSync(this.path, he(this, ct) ? null : "utf8"), r = this._encryptData(t), n = this._deserialize(r);
      return this._validate(n), Object.assign(hr(), n);
    } catch (t) {
      if ((t == null ? void 0 : t.code) === "ENOENT")
        return this._ensureDirectory(), hr();
      if (he(this, Ve).clearInvalidConfig && t.name === "SyntaxError")
        return hr();
      throw t;
    }
  }
  set store(t) {
    this._ensureDirectory(), this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      yield [t, r];
  }
  _encryptData(t) {
    if (!he(this, ct))
      return typeof t == "string" ? t : Bc(t);
    try {
      const r = t.slice(0, 16), n = Fr.pbkdf2Sync(he(this, ct), r.toString(), 1e4, 32, "sha512"), s = Fr.createDecipheriv(Wc, n, r), o = t.slice(17), a = typeof o == "string" ? Ks(o) : o;
      return Bc(Hc([s.update(a), s.final()]));
    } catch {
    }
    return t.toString();
  }
  _handleChange(t, r) {
    let n = t();
    const s = () => {
      const o = n, a = t();
      _d(a, o) || (n = a, r.call(this, a, o));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(t) {
    if (!he(this, It) || he(this, It).call(this, t) || !he(this, It).errors)
      return;
    const n = he(this, It).errors.map(({ instancePath: s, message: o = "" }) => `\`${s.slice(1)}\` ${o}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    ee.mkdirSync(C.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    if (he(this, ct)) {
      const n = Fr.randomBytes(16), s = Fr.pbkdf2Sync(he(this, ct), n.toString(), 1e4, 32, "sha512"), o = Fr.createCipheriv(Wc, s, n);
      r = Hc([n, Ks(":"), o.update(Ks(r)), o.final()]);
    }
    if (_e.env.SNAP)
      ee.writeFileSync(this.path, r, { mode: he(this, Ve).configFileMode });
    else
      try {
        sl(this.path, r, { mode: he(this, Ve).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          ee.writeFileSync(this.path, r, { mode: he(this, Ve).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    this._ensureDirectory(), ee.existsSync(this.path) || this._write(hr()), _e.platform === "win32" ? ee.watch(this.path, { persistent: !1 }, Pc(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 100 })) : ee.watchFile(this.path, { persistent: !1 }, Pc(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 5e3 }));
  }
  _migrate(t, r, n) {
    let s = this._get(Hs, "0.0.0");
    const o = Object.keys(t).filter((l) => this._shouldPerformMigration(l, s, r));
    let a = { ...this.store };
    for (const l of o)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: l,
          finalVersion: r,
          versions: o
        });
        const i = t[l];
        i == null || i(this), this._set(Hs, l), s = l, a = { ...this.store };
      } catch (i) {
        throw this.store = a, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${i}`);
      }
    (this._isVersionInRangeFormat(s) || !fr.eq(s, r)) && this._set(Hs, r);
  }
  _containsReservedKey(t) {
    return typeof t == "object" && Object.keys(t)[0] === qn ? !0 : typeof t != "string" ? !1 : he(this, Ve).accessPropertiesByDotNotation ? !!t.startsWith(`${qn}.`) : !1;
  }
  _isVersionInRangeFormat(t) {
    return fr.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && fr.satisfies(r, t) ? !1 : fr.satisfies(n, t) : !(fr.lte(t, r) || fr.gt(t, n));
  }
  _get(t, r) {
    return Sd(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    wi(n, t, r), this.store = n;
  }
}
It = new WeakMap(), ct = new WeakMap(), Ve = new WeakMap(), lt = new WeakMap();
const { app: Gn, ipcMain: ho, shell: lb } = Zc;
let Xc = !1;
const Jc = () => {
  if (!ho || !Gn)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: Gn.getPath("userData"),
    appVersion: Gn.getVersion()
  };
  return Xc || (ho.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), Xc = !0), e;
};
class ub extends cb {
  constructor(t) {
    let r, n;
    if (_e.type === "renderer") {
      const s = Zc.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else ho && Gn && ({ defaultCwd: r, appVersion: n } = Jc());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = C.isAbsolute(t.cwd) ? t.cwd : C.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    Jc();
  }
  async openInEditor() {
    const t = await lb.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const td = 67324752, rd = 33639248, nd = 101010256, db = Object.prototype.hasOwnProperty;
function fb(e) {
  for (let t = e.length - 22; t >= 0; t--)
    if (e.readUInt32LE(t) === nd)
      return t;
  throw new Error("End of central directory not found");
}
function sd(e) {
  const t = fb(e), r = e.readUInt32LE(t + 12), n = e.readUInt32LE(t + 16), s = [], o = /* @__PURE__ */ new Map();
  let a = n, l = 0;
  for (; a < n + r; ) {
    if (e.readUInt32LE(a) !== rd)
      throw new Error("Invalid central directory signature");
    const d = e.readUInt16LE(a + 4), u = e.readUInt16LE(a + 6), h = e.readUInt16LE(a + 8), E = e.readUInt16LE(a + 10), g = e.readUInt16LE(a + 12), v = e.readUInt16LE(a + 14), y = e.readUInt32LE(a + 16), $ = e.readUInt32LE(a + 20), m = e.readUInt32LE(a + 24), w = e.readUInt16LE(a + 28), P = e.readUInt16LE(a + 30), I = e.readUInt16LE(a + 32), R = e.readUInt16LE(a + 34), F = e.readUInt16LE(a + 36), W = e.readUInt32LE(a + 38), Y = e.readUInt32LE(a + 42), ce = a + 46, ie = ce + w, D = e.slice(ce, ie).toString("utf8"), q = ie, oe = q + P, O = e.slice(q, oe), k = oe, U = k + I, M = e.slice(k, U);
    if (e.readUInt32LE(Y) !== td)
      throw new Error(`Invalid local header signature for ${D}`);
    const L = e.readUInt16LE(Y + 26), N = e.readUInt16LE(Y + 28), p = Y + 30 + L + N, b = p + $, _ = e.slice(p, b), c = e.slice(
      Y + 30 + L,
      p
    ), f = {
      fileName: D,
      versionMadeBy: d,
      versionNeeded: u,
      generalPurpose: h,
      compressionMethod: E,
      lastModTime: g,
      lastModDate: v,
      crc32: y,
      compressedSize: $,
      uncompressedSize: m,
      diskNumberStart: R,
      internalAttrs: F,
      externalAttrs: W,
      extraField: O,
      fileComment: M,
      localExtraField: c,
      compressedData: _,
      localHeaderOffset: Y,
      order: l
    };
    s.push(f), o.set(D, f), a = U, l += 1;
  }
  return { entries: s, entryMap: o };
}
function hb(e) {
  let t = 4294967295;
  for (let r = 0; r < e.length; r++) {
    const n = e[r];
    t = t >>> 8 ^ mb[(t ^ n) & 255];
  }
  return (t ^ 4294967295) >>> 0;
}
const mb = (() => {
  const e = new Uint32Array(256);
  for (let t = 0; t < 256; t++) {
    let r = t;
    for (let n = 0; n < 8; n++)
      r & 1 ? r = 3988292384 ^ r >>> 1 : r >>>= 1;
    e[t] = r >>> 0;
  }
  return e;
})();
function ts(e) {
  if (e.compressionMethod === 0)
    return Buffer.from(e.compressedData);
  if (e.compressionMethod === 8)
    return tl.inflateRawSync(e.compressedData);
  throw new Error(`Unsupported compression method: ${e.compressionMethod}`);
}
function pb(e, t) {
  if (t === 0)
    return e;
  if (t === 8)
    return tl.deflateRawSync(e);
  throw new Error(`Unsupported compression method: ${t}`);
}
function mo(e) {
  return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}
function $b(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function od(e) {
  const t = [], r = /<si>([\s\S]*?)<\/si>/g;
  let n;
  for (; (n = r.exec(e)) !== null; ) {
    const s = n[1], o = /<t[^>]*>([\s\S]*?)<\/t>/g;
    let a = "", l;
    for (; (l = o.exec(s)) !== null; )
      a += mo(l[1]);
    t.push(a);
  }
  return t;
}
function ad(e) {
  const t = {}, r = /(\w+)=\"([^\"]*)\"/g;
  let n;
  for (; (n = r.exec(e)) !== null; )
    t[n[1]] = n[2];
  return t;
}
function Bs(e) {
  const t = Object.entries(e);
  return t.length === 0 ? "" : t.map(([r, n]) => `${r}="${n}"`).join(" ");
}
function id(e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const n = e.charCodeAt(r);
    n >= 65 && n <= 90 ? t = t * 26 + (n - 64) : n >= 97 && n <= 122 && (t = t * 26 + (n - 96));
  }
  return t - 1;
}
function yb(e, t, r) {
  if (t === "s") {
    const s = e.match(/<v>([\s\S]*?)<\/v>/);
    if (!s) return "";
    const o = Number.parseInt(s[1], 10);
    return Number.isNaN(o) ? "" : r[o] ?? "";
  }
  if (t === "inlineStr") {
    const s = e.match(/<t[^>]*>([\s\S]*?)<\/t>/);
    return s ? mo(s[1]) : "";
  }
  const n = e.match(/<v>([\s\S]*?)<\/v>/);
  return n ? mo(n[1]) : "";
}
function cd(e) {
  return e == null ? !1 : typeof e == "string" ? e.trim().length > 0 : !0;
}
function gb(e, t, r) {
  const n = /* @__PURE__ */ new Map(), s = [];
  let o = 0;
  for (; ; ) {
    const i = e.indexOf("<c", o);
    if (i === -1) break;
    const d = e.indexOf(">", i);
    if (d === -1) break;
    let u = e.slice(i + 2, d), h = !1;
    u.endsWith("/") && (h = !0, u = u.slice(0, -1));
    const E = ad(u), g = E.r;
    let v = "", y = d + 1;
    if (!h) {
      const $ = e.indexOf("</c>", d);
      if ($ === -1) break;
      v = e.slice(d + 1, $), y = $ + 4;
    }
    if (g) {
      const $ = /^([A-Z]+)(\d+)$/.exec(g);
      if ($) {
        const m = $[1], w = parseInt($[2], 10), P = id(m);
        if (P === 0) {
          const I = v.match(/<v>([\s\S]*?)<\/v>/);
          if (I) {
            const R = Number.parseInt(I[1], 10), F = t[R];
            F && n.set(w, F.trim());
          }
        } else if (P === 1) {
          const I = n.get(w), R = (Y) => {
            if (!Y) return;
            const ce = /* @__PURE__ */ new Set();
            ce.add(Y);
            const ie = Y.trim();
            ie && ce.add(ie);
            const D = ie.replace(/[()]/g, "").trim();
            if (D && ce.add(D), ie.startsWith("(") && ie.endsWith(")")) {
              const q = ie.slice(1, -1).trim();
              q && ce.add(q);
            }
            for (const q of ce)
              if (db.call(r, q))
                return r[q];
          }, F = I ?? (w === 1 ? "SFC" : void 0), W = R(F);
          if (F && W !== void 0) {
            const Y = { ...E }, ce = Bs(Y);
            let ie;
            if (!cd(W))
              ie = `<c${ce ? ` ${ce}` : ""}/>`;
            else {
              const D = `${W}`, q = Number(D);
              if (D.trim().length > 0 && !Number.isNaN(q)) {
                delete Y.t;
                const O = Bs(Y);
                ie = `<c${O ? ` ${O}` : ""}><v>${D}</v></c>`;
              } else {
                Y.t = "inlineStr";
                const O = Bs(Y);
                ie = `<c${O ? ` ${O}` : ""}><is><t>${$b(D)}</t></is></c>`;
              }
            }
            s.push({ start: i, end: y, text: ie });
          }
        } else
          s.push({ start: i, end: y, text: "" });
      }
    }
    o = y;
  }
  if (s.length === 0)
    return e;
  s.sort((i, d) => i.start - d.start);
  let a = "", l = 0;
  for (const i of s)
    a += e.slice(l, i.start), a += i.text, l = i.end;
  return a += e.slice(l), a;
}
function _b(e) {
  const t = [...e.entries].sort(
    (i, d) => i.localHeaderOffset - d.localHeaderOffset
  ), r = [];
  let n = 0;
  for (const i of t) {
    const d = Buffer.from(i.fileName, "utf8"), u = Buffer.alloc(30);
    u.writeUInt32LE(td, 0), u.writeUInt16LE(i.versionNeeded, 4), u.writeUInt16LE(i.generalPurpose, 6), u.writeUInt16LE(i.compressionMethod, 8), u.writeUInt16LE(i.lastModTime, 10), u.writeUInt16LE(i.lastModDate, 12), u.writeUInt32LE(i.crc32, 14), u.writeUInt32LE(i.compressedSize, 18), u.writeUInt32LE(i.uncompressedSize, 22), u.writeUInt16LE(d.length, 26), u.writeUInt16LE(i.localExtraField.length, 28), r.push(
      u,
      d,
      i.localExtraField,
      i.compressedData
    ), i.newLocalHeaderOffset = n, n += u.length + d.length + i.localExtraField.length + i.compressedData.length;
  }
  const s = n, o = [];
  for (const i of t) {
    const d = Buffer.from(i.fileName, "utf8"), u = Buffer.alloc(46);
    u.writeUInt32LE(rd, 0), u.writeUInt16LE(i.versionMadeBy, 4), u.writeUInt16LE(i.versionNeeded, 6), u.writeUInt16LE(i.generalPurpose, 8), u.writeUInt16LE(i.compressionMethod, 10), u.writeUInt16LE(i.lastModTime, 12), u.writeUInt16LE(i.lastModDate, 14), u.writeUInt32LE(i.crc32, 16), u.writeUInt32LE(i.compressedSize, 20), u.writeUInt32LE(i.uncompressedSize, 24), u.writeUInt16LE(d.length, 28), u.writeUInt16LE(i.extraField.length, 30), u.writeUInt16LE(i.fileComment.length, 32), u.writeUInt16LE(i.diskNumberStart, 34), u.writeUInt16LE(i.internalAttrs, 36), u.writeUInt32LE(i.externalAttrs, 38), u.writeUInt32LE(i.newLocalHeaderOffset ?? 0, 42), o.push(
      u,
      d,
      i.extraField,
      i.fileComment
    ), n += u.length + d.length + i.extraField.length + i.fileComment.length;
  }
  const a = n - s, l = Buffer.alloc(22);
  return l.writeUInt32LE(nd, 0), l.writeUInt16LE(0, 4), l.writeUInt16LE(0, 6), l.writeUInt16LE(t.length, 8), l.writeUInt16LE(t.length, 10), l.writeUInt32LE(a, 12), l.writeUInt32LE(s, 16), l.writeUInt16LE(0, 20), Buffer.concat([...r, ...o, l]);
}
function vb(e, t) {
  const r = {};
  t && (r.SFC = t);
  for (const [n, s] of Object.entries(e))
    cd(s) && (r[n] = s);
  return r;
}
function wb(e, t, r) {
  if (!re.existsSync(e))
    throw new Error(`Workbook not found: ${e}`);
  const n = re.readFileSync(e), s = sd(n), o = s.entryMap.get("xl/worksheets/sheet1.xml"), a = s.entryMap.get("xl/sharedStrings.xml");
  if (!o || !a)
    throw new Error("Workbook is missing required worksheet or shared strings");
  const l = ts(a).toString("utf8"), i = od(l), d = ts(o).toString("utf8"), u = vb(t, r), h = gb(
    d,
    i,
    u
  );
  if (h === d)
    return u;
  const E = Buffer.from(h, "utf8"), g = pb(E, o.compressionMethod);
  o.compressedData = g, o.compressedSize = g.length, o.uncompressedSize = E.length, o.crc32 = hb(E);
  const v = _b(s), y = `${e}.tmp`;
  return re.writeFileSync(y, v), re.renameSync(y, e), u;
}
function Eb(e, t = "xl/worksheets/sheet1.xml") {
  if (!re.existsSync(e))
    throw new Error(`Workbook not found: ${e}`);
  const r = re.readFileSync(e), n = sd(r), s = n.entryMap.get(t);
  if (!s)
    throw new Error(`Worksheet not found: ${t}`);
  const o = n.entryMap.get("xl/sharedStrings.xml"), a = o ? od(ts(o).toString("utf8")) : [], l = ts(s).toString("utf8"), i = [], d = /<row[^>]*>([\s\S]*?)<\/row>/g;
  let u;
  for (; (u = d.exec(l)) !== null; ) {
    const h = u[1], E = [];
    let g = -1;
    const v = /<c([^>]*)>([\s\S]*?)<\/c>/g;
    let y;
    for (; (y = v.exec(h)) !== null; ) {
      const $ = y[1], m = y[2], w = ad($), P = w.r;
      let I = -1;
      if (P) {
        const F = P.replace(/\d+/g, "");
        I = id(F);
      } else
        I = E.length;
      if (I < 0)
        continue;
      const R = yb(m, w.t, a);
      E[I] = R, I > g && (g = I);
    }
    if (g >= 0)
      for (let $ = 0; $ <= g; $ += 1)
        E[$] === void 0 && (E[$] = "");
    i.push(E);
  }
  return i;
}
function Sb(e) {
  const t = vi.join(e, "Input_Total.xlsx");
  if (!re.existsSync(t)) {
    const r = vi.join(e, "Input_Plant.xlsx");
    if (!re.existsSync(r))
      throw new Error("No template available to create Input_Total.xlsx");
    re.copyFileSync(r, t);
  }
  return t;
}
yd(import.meta.url);
const Ss = C.dirname(gd(import.meta.url));
process.env.APP_ROOT = C.join(Ss, "..");
const po = process.env.VITE_DEV_SERVER_URL, Zb = C.join(process.env.APP_ROOT, "dist-electron"), Kn = C.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = po ? C.join(process.env.APP_ROOT, "public") : Kn;
function bb() {
  return mt.isPackaged ? C.join(process.resourcesPath, "third-party") : C.join(Ss, "..", "third-party");
}
function ar() {
  return mt.isPackaged ? C.join(process.resourcesPath, "output") : C.join(Ss, "..", "output");
}
function xc(e) {
  re.existsSync(e) || re.mkdirSync(e, { recursive: !0 });
}
function ld(e) {
  if (!e) return null;
  const t = e.replace(/[^0-9]/g, "");
  return t.length === 8 ? t : null;
}
function Pb(e = "Asia/Seoul") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: e,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(/* @__PURE__ */ new Date()).replace(/-/g, "");
}
function bs(e, t) {
  const r = (o) => {
    if (!o) return null;
    const a = C.join(e, o);
    return re.existsSync(a) && re.statSync(a).isDirectory() ? { dir: a, date: o } : null;
  }, n = ld(t), s = r(n);
  if (s)
    return s;
  try {
    const a = re.readdirSync(e, { withFileTypes: !0 }).filter((l) => l.isDirectory() && /^\d{8}$/.test(l.name)).map((l) => l.name).sort().at(-1) ?? null;
    return a ? { dir: C.join(e, a), date: a } : null;
  } catch (o) {
    return console.error("Failed to resolve output directory", e, o), null;
  }
}
const Nb = "Execution cancelled by user";
let sn = null, tr = !1;
function Ib(e, t) {
  return new Promise((r, n) => {
    var o, a;
    tr = !1;
    const s = wd(e, {
      cwd: t,
      windowsHide: !0
    });
    sn = s, s.on("error", (l) => {
      sn = null, tr = !1, n(l);
    }), (o = s.stdout) == null || o.on("data", (l) => {
      console.log(`[exe stdout] ${l}`);
    }), (a = s.stderr) == null || a.on("data", (l) => {
      console.error(`[exe stderr] ${l}`);
    }), s.on("close", (l) => {
      const i = tr;
      if (sn = null, tr = !1, i) {
        n(new Error(Nb));
        return;
      }
      if (l === 0) {
        r();
        return;
      }
      n(new Error(`Executable exited with code ${l}`));
    });
  });
}
function rs(e) {
  const t = [];
  let r = "", n = !1;
  for (let s = 0; s < e.length; s += 1) {
    const o = e[s];
    if (o === '"') {
      n && e[s + 1] === '"' ? (r += '"', s += 1) : n = !n;
      continue;
    }
    if (o === "," && !n) {
      t.push(r), r = "";
      continue;
    }
    r += o;
  }
  return t.push(r), t.map((s) => s.trim());
}
function ud(e, t, r) {
  if (r < 0 || r >= t.length)
    return null;
  const n = e[r] ?? "", s = Number.parseFloat(n);
  if (!Number.isFinite(s))
    return null;
  const o = {};
  return t.forEach((a, l) => {
    if (l === r || !a) return;
    const i = e[l];
    if (i == null) {
      o[a] = "";
      return;
    }
    o[a] = `${i}`;
  }), { time: s, values: o };
}
function Rb(e) {
  const r = re.readFileSync(e, "utf-8").split(/\r?\n/).filter((a) => a.trim().length > 0);
  if (r.length === 0)
    return [];
  const n = rs(r[0]), s = n.findIndex(
    (a) => a.toLowerCase() === "time"
  );
  if (s === -1)
    return console.warn("Output CSV missing Time column"), [];
  const o = [];
  for (let a = 1; a < r.length; a += 1) {
    const l = rs(r[a]), i = ud(l, n, s);
    i && o.push(i);
  }
  return o;
}
function Ob(e) {
  try {
    const t = Eb(e);
    if (t.length === 0)
      return [];
    const r = t[0].map((o) => o.trim()), n = r.findIndex(
      (o) => o.toLowerCase() === "time"
    );
    if (n === -1)
      return console.warn("Workbook missing Time column"), [];
    const s = [];
    for (let o = 1; o < t.length; o += 1) {
      const a = t[o], l = ud(a, r, n);
      l && s.push(l);
    }
    return s;
  } catch (t) {
    return console.error("Failed to read simulation workbook", e, t), [];
  }
}
function dd(e) {
  const t = C.join(e, "Output_Total.xlsx");
  if (re.existsSync(t)) {
    const n = Ob(t);
    if (n.length > 0)
      return n;
  }
  const r = C.join(e, "Output_Total.csv");
  return re.existsSync(r) ? Rb(r) : [];
}
const Tb = /* @__PURE__ */ new Set([
  "-1.#IND",
  "-1.#QNAN",
  "NAN",
  "INF",
  "+INF",
  "-INF"
]);
function fd(e) {
  if (!e) return null;
  const t = e.replace(/,/g, "").trim();
  if (!t || Tb.has(t.toUpperCase()))
    return null;
  const r = Number.parseFloat(t);
  return Number.isFinite(r) ? r : null;
}
function Ws(e) {
  if (!re.existsSync(e))
    return [];
  const r = re.readFileSync(e, "utf-8").split(/\r?\n/).filter((o) => o.trim().length > 0);
  if (r.length <= 1)
    return [];
  const n = rs(r[0]), s = [];
  for (let o = 1; o < r.length; o += 1) {
    const a = rs(r[o]), l = {};
    n.forEach((i, d) => {
      i && (l[i] = a[d] ?? "");
    }), s.push(l);
  }
  return s;
}
function Yc(e) {
  const t = {};
  for (const [r, n] of Object.entries(e)) {
    const s = fd(n);
    if (s !== null) {
      t[r] = s;
      continue;
    }
    const o = n.trim();
    t[r] = o.length > 0 ? o : null;
  }
  return t;
}
function jb(e) {
  const t = C.join(e, "Output_EE2.csv"), r = C.join(e, "Output_EE3.csv"), n = C.join(e, "Output_EE1.csv"), s = {}, o = Ws(t);
  for (const i of o) {
    const d = Object.entries(i);
    if (d.length === 0) continue;
    const [u, h] = d[0], E = (i.Variable ?? i[u] ?? "").trim();
    if (!E) continue;
    let g = "";
    "Value" in i ? g = i.Value ?? "" : d.length > 1 && (g = d[1][1]);
    const v = fd(g);
    s[E] = v !== null ? v : g.trim() || null;
  }
  const a = Ws(r).map(Yc), l = Ws(n).map(Yc);
  return { report: s, cashflow: a, coefficients: l };
}
qe.handle("run-exe", async (e, t) => {
  const r = bb(), n = C.join(r, "MHySIM_HRS_Run.exe");
  if (!re.existsSync(n)) {
    const v = `실행 파일을 찾을 수 없습니다:
` + n + `

패키징 시 extraResources에 third-party를 포함했는지 확인하세요.`;
    throw console.error("[run-exe] " + v), $d.showErrorBox("Executable missing", v), new Error(v);
  }
  const s = Pb(), o = ar();
  console.log(o, "baseOutputDir"), xc(o);
  const a = C.join(o, s);
  xc(a), console.log(a, "baseOutputDir");
  const l = a, i = (t == null ? void 0 : t.skipExe) ?? !1, d = s, u = re.readdirSync(l).filter((v) => /^Output_\d+\.csv$/i.test(v));
  for (const v of u) {
    const y = C.extname(v), $ = C.basename(v, y);
    let m = 1, w = `${$}-${m}${y}`;
    for (; re.existsSync(C.join(l, w)); )
      m++, w = `${$}-${m}${y}`;
    re.renameSync(
      C.join(l, v),
      C.join(l, w)
    ), console.log(`📁 백업됨: ${v} → ${w}`);
  }
  try {
    const v = (t == null ? void 0 : t.values) ?? {}, y = (t == null ? void 0 : t.sfc) ?? null;
    if (Object.keys(v).length > 0 || y) {
      const m = Sb(r), w = wb(
        m,
        v,
        y
      );
      try {
        const P = C.join(l, "Input_Total.xlsx");
        re.copyFileSync(m, P), console.log("📄 Input_Total.xlsx copied to", P);
      } catch (P) {
        console.error("⚠️ Failed to copy Input_Total workbook", P);
      }
      try {
        const P = {
          sfc: y,
          values: w,
          generatedAt: (/* @__PURE__ */ new Date()).toISOString()
        }, I = C.join(l, "input_total.json");
        re.writeFileSync(
          I,
          JSON.stringify(P, null, 2),
          "utf8"
        ), console.log("📝 input_total.json written to", I);
      } catch (P) {
        console.error("⚠️ Failed to write input_total.json", P);
      }
    }
  } catch (v) {
    throw console.error("❌ Excel 업데이트 실패:", v), v;
  }
  try {
    const v = C.join(l, "MHySIM.log");
    re.existsSync(v) && re.writeFileSync(v, "");
  } catch (v) {
    console.warn("⚠️ 진행 로그 초기화 실패", v);
  }
  let h;
  if (i)
    h = "EXE skipped by user toggle", console.info("[run-exe] Execution skipped by user toggle");
  else if (process.platform === "win32")
    try {
      await Ib(n, l), h = "EXE completed successfully";
    } catch (v) {
      throw console.error("❌ EXE 실행 실패:", v), v;
    }
  else
    h = `EXE execution skipped: unsupported platform (${process.platform})`, console.warn(
      `run-exe called on unsupported platform (${process.platform}); executable skipped.`
    );
  const E = dd(l);
  return {
    status: h,
    frames: E.sort((v, y) => v.time - y.time),
    outputDate: d,
    outputDir: l
  };
});
qe.handle("stop-exe", async () => sn ? tr ? { stopped: !0 } : (tr = !0, sn.kill() ? { stopped: !0 } : (tr = !1, { stopped: !1 })) : { stopped: !1 });
qe.handle(
  "read-output-data",
  async (e, t) => {
    const r = ar(), n = bs(r, (t == null ? void 0 : t.date) ?? null);
    if (!n)
      return { frames: [], date: null };
    try {
      return { frames: dd(n.dir).sort(
        (o, a) => o.time - a.time
      ), date: n.date };
    } catch (s) {
      return console.error("Failed to read output data", n, s), { frames: [], date: n.date };
    }
  }
);
qe.handle(
  "read-progress-log",
  async (e, t) => {
    const r = ar(), n = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, ""), o = ld((t == null ? void 0 : t.date) ?? null) ?? n, a = C.join(r, o), l = C.join(a, "MHySIM.log");
    if (!re.existsSync(l))
      return {
        date: o,
        exists: !1,
        raw: "",
        updatedAt: null
      };
    try {
      const i = re.readFileSync(l, "utf-8"), d = re.statSync(l);
      return {
        date: o,
        exists: !0,
        raw: i,
        updatedAt: d.mtimeMs
      };
    } catch (i) {
      return console.error("Failed to read progress log", { logPath: l, error: i }), {
        date: o,
        exists: !1,
        raw: "",
        updatedAt: null
      };
    }
  }
);
function kb(e) {
  const t = e.getFullYear(), r = `${e.getMonth() + 1}`.padStart(2, "0"), n = `${e.getDate()}`.padStart(2, "0");
  return `${t}-${r}-${n}`;
}
qe.handle("read-recent-logs", async () => {
  const e = ar(), t = [], r = /* @__PURE__ */ new Date();
  for (let n = 0; n < 5; n += 1) {
    const s = new Date(r);
    s.setDate(r.getDate() - n);
    const o = kb(s), a = o.replace(/-/g, ""), l = C.join(e, a, "MHySIM.jsonl");
    let i = [];
    if (re.existsSync(l))
      try {
        i = re.readFileSync(l, "utf-8").split(/\r?\n/).map((u) => u.trim()).filter(Boolean).map((u) => {
          try {
            return JSON.parse(u);
          } catch (h) {
            return console.warn("Failed to parse log line", {
              logPath: l,
              line: u,
              error: h
            }), null;
          }
        }).filter((u) => u !== null);
      } catch (d) {
        console.error("Failed to read log file", l, d);
      }
    t.push({ date: o, entries: i });
  }
  return t;
});
qe.handle(
  "read-economic-evaluation",
  async (e, t) => {
    const r = ar(), n = bs(r, (t == null ? void 0 : t.date) ?? null);
    if (!n)
      return {
        date: null,
        report: {},
        cashflow: [],
        coefficients: []
      };
    try {
      const s = jb(n.dir);
      return {
        date: n.date,
        report: s.report,
        cashflow: s.cashflow,
        coefficients: s.coefficients
      };
    } catch (s) {
      return console.error(
        "Failed to read economic evaluation outputs",
        n,
        s
      ), {
        date: n.date,
        report: {},
        cashflow: [],
        coefficients: []
      };
    }
  }
);
qe.handle(
  "download-report-files",
  async (e, t) => {
    const r = ar(), n = bs(r, (t == null ? void 0 : t.date) ?? null);
    if (!n)
      return { success: !1, reason: "NO_OUTPUT_DIR" };
    const s = [
      "Output_Total.csv",
      "Output_EE2.csv",
      "Output_EE3.csv"
    ], o = [], a = s.map((u) => {
      const h = C.join(n.dir, u);
      return re.existsSync(h) || o.push(u), { name: u, path: h };
    });
    if (o.length > 0)
      return { success: !1, reason: "MISSING_FILES", missing: o };
    const l = mt.getPath("downloads"), i = [];
    for (const u of a) {
      const h = C.extname(u.name), E = C.basename(u.name, h);
      let g = `${E}_${n.date}${h}`, v = 1;
      for (; re.existsSync(C.join(l, g)); )
        g = `${E}_${n.date}(${v})${h}`, v += 1;
      const y = C.join(l, g);
      try {
        re.copyFileSync(u.path, y), i.push(y);
      } catch ($) {
        return console.error("Failed to copy report file", u.path, y, $), { success: !1, reason: "COPY_FAILED", file: u.name };
      }
    }
    let d = !1;
    try {
      await Qc.openPath(l), d = !0;
    } catch (u) {
      console.warn("Failed to open downloads directory", l, u);
    }
    return { success: !0, files: i, date: n.date, opened: d };
  }
);
qe.handle(
  "download-output-total",
  async (e, t) => {
    const r = ar(), n = bs(r, (t == null ? void 0 : t.date) ?? null);
    if (!n)
      return { success: !1, reason: "NO_OUTPUT_DIR" };
    const s = "Output_Total.csv", o = C.join(n.dir, s);
    if (!re.existsSync(o))
      return { success: !1, reason: "MISSING_FILE" };
    const a = mt.getPath("downloads"), l = C.extname(s), i = C.basename(s, l);
    let d = `${i}_${n.date}${l}`, u = 1;
    for (; re.existsSync(C.join(a, d)); )
      d = `${i}_${n.date}(${u})${l}`, u += 1;
    const h = C.join(a, d);
    try {
      re.copyFileSync(o, h);
    } catch (g) {
      return console.error(
        "Failed to copy Output_Total.csv",
        o,
        h,
        g
      ), { success: !1, reason: "COPY_FAILED" };
    }
    let E = !1;
    try {
      await Qc.openPath(a), E = !0;
    } catch (g) {
      console.warn("Failed to open downloads directory", a, g);
    }
    return { success: !0, file: h, date: n.date, opened: E };
  }
);
const yi = new ub();
qe.handle("electron-store-get", (e, t) => yi.get(t));
qe.handle("electron-store-set", (e, t, r) => {
  yi.set(t, r);
});
qe.handle("electron-store-delete", (e, t) => {
  yi.delete(t);
});
qe.on("save-project-backup", (e, t, r) => {
  const n = C.join(mt.getPath("userData"), `${r}.json`);
  try {
    re.writeFileSync(n, JSON.stringify(t, null, 2), "utf-8"), console.log("✅ 프로젝트 백업 저장 완료:", n);
  } catch (s) {
    console.error("❌ 프로젝트 백업 저장 실패:", s);
  }
});
let Pt;
function hd() {
  Pt = new el({
    icon: C.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: C.join(Ss, "preload.mjs")
    }
  }), Pt.webContents.on("did-finish-load", () => {
    Pt == null || Pt.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), po ? Pt.loadURL(po) : (console.log("RENDERER_DIST:", Kn), console.log("index.html path:", C.join(Kn, "index.html")), Pt.loadFile(C.join(Kn, "index.html")));
}
mt.on("window-all-closed", () => {
  process.platform !== "darwin" && (mt.quit(), Pt = null);
});
mt.on("activate", () => {
  el.getAllWindows().length === 0 && hd();
});
mt.whenReady().then(hd);
export {
  Zb as MAIN_DIST,
  Kn as RENDERER_DIST,
  po as VITE_DEV_SERVER_URL
};
