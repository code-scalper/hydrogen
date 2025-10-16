var sd = Object.defineProperty;
var fi = (e) => {
  throw TypeError(e);
};
var od = (e, t, r) => t in e ? sd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Cr = (e, t, r) => od(e, typeof t != "symbol" ? t + "" : t, r), hi = (e, t, r) => t.has(e) || fi("Cannot " + r);
var fe = (e, t, r) => (hi(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Dr = (e, t, r) => t.has(e) ? fi("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Mr = (e, t, r, n) => (hi(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
import Bc, { ipcMain as Er, dialog as ad, app as Qt, BrowserWindow as Wc } from "electron";
import { createRequire as id } from "node:module";
import { fileURLToPath as cd } from "node:url";
import B from "node:path";
import $e from "fs";
import _e from "node:process";
import { promisify as be, isDeepStrictEqual as ld } from "node:util";
import Q from "node:fs";
import Lr from "node:crypto";
import ud from "node:assert";
import Qn from "node:os";
import { spawn as dd } from "child_process";
import mi from "path";
import Xc from "zlib";
const er = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, ws = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), fd = new Set("0123456789");
function es(e) {
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
        if (ws.has(r))
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
          if (ws.has(r))
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
        if (n === "index" && !fd.has(o))
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        n === "start" && (n = "property"), s && (s = !1, r += "\\"), r += o;
      }
    }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (ws.has(r))
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
function lo(e, t) {
  if (typeof t != "number" && Array.isArray(e)) {
    const r = Number.parseInt(t, 10);
    return Number.isInteger(r) && e[r] === e[t];
  }
  return !1;
}
function Jc(e, t) {
  if (lo(e, t))
    throw new Error("Cannot use string index");
}
function hd(e, t, r) {
  if (!er(e) || typeof t != "string")
    return r === void 0 ? e : r;
  const n = es(t);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const o = n[s];
    if (lo(e, o) ? e = s === n.length - 1 ? void 0 : null : e = e[o], e == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function pi(e, t, r) {
  if (!er(e) || typeof t != "string")
    return e;
  const n = e, s = es(t);
  for (let o = 0; o < s.length; o++) {
    const a = s[o];
    Jc(e, a), o === s.length - 1 ? e[a] = r : er(e[a]) || (e[a] = typeof s[o + 1] == "number" ? [] : {}), e = e[a];
  }
  return n;
}
function md(e, t) {
  if (!er(e) || typeof t != "string")
    return !1;
  const r = es(t);
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (Jc(e, s), n === r.length - 1)
      return delete e[s], !0;
    if (e = e[s], !er(e))
      return !1;
  }
}
function pd(e, t) {
  if (!er(e) || typeof t != "string")
    return !1;
  const r = es(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!er(e) || !(n in e) || lo(e, n))
      return !1;
    e = e[n];
  }
  return !0;
}
const bt = Qn.homedir(), uo = Qn.tmpdir(), { env: hr } = _e, $d = (e) => {
  const t = B.join(bt, "Library");
  return {
    data: B.join(t, "Application Support", e),
    config: B.join(t, "Preferences", e),
    cache: B.join(t, "Caches", e),
    log: B.join(t, "Logs", e),
    temp: B.join(uo, e)
  };
}, yd = (e) => {
  const t = hr.APPDATA || B.join(bt, "AppData", "Roaming"), r = hr.LOCALAPPDATA || B.join(bt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: B.join(r, e, "Data"),
    config: B.join(t, e, "Config"),
    cache: B.join(r, e, "Cache"),
    log: B.join(r, e, "Log"),
    temp: B.join(uo, e)
  };
}, gd = (e) => {
  const t = B.basename(bt);
  return {
    data: B.join(hr.XDG_DATA_HOME || B.join(bt, ".local", "share"), e),
    config: B.join(hr.XDG_CONFIG_HOME || B.join(bt, ".config"), e),
    cache: B.join(hr.XDG_CACHE_HOME || B.join(bt, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: B.join(hr.XDG_STATE_HOME || B.join(bt, ".local", "state"), e),
    temp: B.join(uo, t, e)
  };
};
function _d(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), _e.platform === "darwin" ? $d(e) : _e.platform === "win32" ? yd(e) : gd(e);
}
const pt = (e, t) => function(...n) {
  return e.apply(void 0, n).catch(t);
}, at = (e, t) => function(...n) {
  try {
    return e.apply(void 0, n);
  } catch (s) {
    return t(s);
  }
}, vd = _e.getuid ? !_e.getuid() : !1, wd = 1e4, Le = () => {
}, he = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!he.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !vd && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!he.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!he.isNodeError(e))
      throw e;
    if (!he.isChangeErrorOk(e))
      throw e;
  }
};
class Ed {
  constructor() {
    this.interval = 25, this.intervalId = void 0, this.limit = wd, this.queueActive = /* @__PURE__ */ new Set(), this.queueWaiting = /* @__PURE__ */ new Set(), this.init = () => {
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
const Sd = new Ed(), $t = (e, t) => function(n) {
  return function s(...o) {
    return Sd.schedule().then((a) => {
      const u = (d) => (a(), d), c = (d) => {
        if (a(), Date.now() >= n)
          throw d;
        if (t(d)) {
          const l = Math.round(100 * Math.random());
          return new Promise((w) => setTimeout(w, l)).then(() => s.apply(void 0, o));
        }
        throw d;
      };
      return e.apply(void 0, o).then(u, c);
    });
  };
}, yt = (e, t) => function(n) {
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
    chmod: pt(be(Q.chmod), he.onChangeError),
    chown: pt(be(Q.chown), he.onChangeError),
    close: pt(be(Q.close), Le),
    fsync: pt(be(Q.fsync), Le),
    mkdir: pt(be(Q.mkdir), Le),
    realpath: pt(be(Q.realpath), Le),
    stat: pt(be(Q.stat), Le),
    unlink: pt(be(Q.unlink), Le),
    /* SYNC */
    chmodSync: at(Q.chmodSync, he.onChangeError),
    chownSync: at(Q.chownSync, he.onChangeError),
    closeSync: at(Q.closeSync, Le),
    existsSync: at(Q.existsSync, Le),
    fsyncSync: at(Q.fsync, Le),
    mkdirSync: at(Q.mkdirSync, Le),
    realpathSync: at(Q.realpathSync, Le),
    statSync: at(Q.statSync, Le),
    unlinkSync: at(Q.unlinkSync, Le)
  },
  retry: {
    /* ASYNC */
    close: $t(be(Q.close), he.isRetriableError),
    fsync: $t(be(Q.fsync), he.isRetriableError),
    open: $t(be(Q.open), he.isRetriableError),
    readFile: $t(be(Q.readFile), he.isRetriableError),
    rename: $t(be(Q.rename), he.isRetriableError),
    stat: $t(be(Q.stat), he.isRetriableError),
    write: $t(be(Q.write), he.isRetriableError),
    writeFile: $t(be(Q.writeFile), he.isRetriableError),
    /* SYNC */
    closeSync: yt(Q.closeSync, he.isRetriableError),
    fsyncSync: yt(Q.fsyncSync, he.isRetriableError),
    openSync: yt(Q.openSync, he.isRetriableError),
    readFileSync: yt(Q.readFileSync, he.isRetriableError),
    renameSync: yt(Q.renameSync, he.isRetriableError),
    statSync: yt(Q.statSync, he.isRetriableError),
    writeSync: yt(Q.writeSync, he.isRetriableError),
    writeFileSync: yt(Q.writeFileSync, he.isRetriableError)
  }
}, bd = "utf8", $i = 438, Pd = 511, Nd = {}, Id = Qn.userInfo().uid, Rd = Qn.userInfo().gid, Od = 1e3, Td = !!_e.getuid;
_e.getuid && _e.getuid();
const yi = 128, jd = (e) => e instanceof Error && "code" in e, gi = (e) => typeof e == "string", Es = (e) => e === void 0, kd = _e.platform === "linux", Yc = _e.platform === "win32", fo = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
Yc || fo.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
kd && fo.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
class Ad {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (Yc && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? _e.kill(_e.pid, "SIGTERM") : _e.kill(_e.pid, t));
      }
    }, this.hook = () => {
      _e.once("exit", () => this.exit());
      for (const t of fo)
        try {
          _e.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const Cd = new Ad(), Dd = Cd.register, Re = {
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
    const t = B.basename(e);
    if (t.length <= yi)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - yi;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
Dd(Re.purgeSyncAll);
function xc(e, t, r = Nd) {
  if (gi(r))
    return xc(e, t, { encoding: r });
  const n = Date.now() + ((r.timeout ?? Od) || -1);
  let s = null, o = null, a = null;
  try {
    const u = Ie.attempt.realpathSync(e), c = !!u;
    e = u || e, [o, s] = Re.get(e, r.tmpCreate || Re.create, r.tmpPurge !== !1);
    const d = Td && Es(r.chown), l = Es(r.mode);
    if (c && (d || l)) {
      const h = Ie.attempt.statSync(e);
      h && (r = { ...r }, d && (r.chown = { uid: h.uid, gid: h.gid }), l && (r.mode = h.mode));
    }
    if (!c) {
      const h = B.dirname(e);
      Ie.attempt.mkdirSync(h, {
        mode: Pd,
        recursive: !0
      });
    }
    a = Ie.retry.openSync(n)(o, "w", r.mode || $i), r.tmpCreated && r.tmpCreated(o), gi(t) ? Ie.retry.writeSync(n)(a, t, 0, r.encoding || bd) : Es(t) || Ie.retry.writeSync(n)(a, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Ie.retry.fsyncSync(n)(a) : Ie.attempt.fsync(a)), Ie.retry.closeSync(n)(a), a = null, r.chown && (r.chown.uid !== Id || r.chown.gid !== Rd) && Ie.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== $i && Ie.attempt.chmodSync(o, r.mode);
    try {
      Ie.retry.renameSync(n)(o, e);
    } catch (h) {
      if (!jd(h) || h.code !== "ENAMETOOLONG")
        throw h;
      Ie.retry.renameSync(n)(o, Re.truncate(e));
    }
    s(), o = null;
  } finally {
    a && Ie.attempt.closeSync(a), o && Re.purge(o);
  }
}
function Zc(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var qs = { exports: {} }, Qc = {}, Je = {}, gr = {}, sn = {}, Y = {}, rn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(v) {
      if (super(), !e.IDENTIFIER.test(v))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = v;
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
    constructor(v) {
      super(), this._items = typeof v == "string" ? [v] : v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const v = this._items[0];
      return v === "" || v === '""';
    }
    get str() {
      var v;
      return (v = this._str) !== null && v !== void 0 ? v : this._str = this._items.reduce((P, I) => `${P}${I}`, "");
    }
    get names() {
      var v;
      return (v = this._names) !== null && v !== void 0 ? v : this._names = this._items.reduce((P, I) => (I instanceof r && (P[I.str] = (P[I.str] || 0) + 1), P), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...v) {
    const P = [m[0]];
    let I = 0;
    for (; I < v.length; )
      u(P, v[I]), P.push(m[++I]);
    return new n(P);
  }
  e._ = s;
  const o = new n("+");
  function a(m, ...v) {
    const P = [g(m[0])];
    let I = 0;
    for (; I < v.length; )
      P.push(o), u(P, v[I]), P.push(o, g(m[++I]));
    return c(P), new n(P);
  }
  e.str = a;
  function u(m, v) {
    v instanceof n ? m.push(...v._items) : v instanceof r ? m.push(v) : m.push(h(v));
  }
  e.addCodeArg = u;
  function c(m) {
    let v = 1;
    for (; v < m.length - 1; ) {
      if (m[v] === o) {
        const P = d(m[v - 1], m[v + 1]);
        if (P !== void 0) {
          m.splice(v - 1, 3, P);
          continue;
        }
        m[v++] = "+";
      }
      v++;
    }
  }
  function d(m, v) {
    if (v === '""')
      return m;
    if (m === '""')
      return v;
    if (typeof m == "string")
      return v instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof v != "string" ? `${m.slice(0, -1)}${v}"` : v[0] === '"' ? m.slice(0, -1) + v.slice(1) : void 0;
    if (typeof v == "string" && v[0] === '"' && !(m instanceof r))
      return `"${m}${v.slice(1)}`;
  }
  function l(m, v) {
    return v.emptyStr() ? m : m.emptyStr() ? v : a`${m}${v}`;
  }
  e.strConcat = l;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : g(Array.isArray(m) ? m.join(",") : m);
  }
  function w(m) {
    return new n(g(m));
  }
  e.stringify = w;
  function g(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = g;
  function E(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = E;
  function _(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = _;
  function $(m) {
    return new n(m.toString());
  }
  e.regexpCode = $;
})(rn);
var Gs = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = rn;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: l } = {}) {
      this._names = {}, this._prefixes = d, this._parent = l;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const l = this._names[d] || this._nameGroup(d);
      return `${d}${l.index++}`;
    }
    _nameGroup(d) {
      var l, h;
      if (!((h = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class o extends t.Name {
    constructor(d, l) {
      super(l), this.prefix = d;
    }
    setValue(d, { property: l, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(l)}[${h}]`;
    }
  }
  e.ValueScopeName = o;
  const a = (0, t._)`\n`;
  class u extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? a : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new o(d, this._newName(d));
    }
    value(d, l) {
      var h;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const w = this.toName(d), { prefix: g } = w, E = (h = l.key) !== null && h !== void 0 ? h : l.ref;
      let _ = this._values[g];
      if (_) {
        const v = _.get(E);
        if (v)
          return v;
      } else
        _ = this._values[g] = /* @__PURE__ */ new Map();
      _.set(E, w);
      const $ = this._scope[g] || (this._scope[g] = []), m = $.length;
      return $[m] = l.ref, w.setValue(l, { property: g, itemIndex: m }), w;
    }
    getValue(d, l) {
      const h = this._values[d];
      if (h)
        return h.get(l);
    }
    scopeRefs(d, l = this._values) {
      return this._reduceValues(l, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, l, h) {
      return this._reduceValues(d, (w) => {
        if (w.value === void 0)
          throw new Error(`CodeGen: name "${w}" has no value`);
        return w.value.code;
      }, l, h);
    }
    _reduceValues(d, l, h = {}, w) {
      let g = t.nil;
      for (const E in d) {
        const _ = d[E];
        if (!_)
          continue;
        const $ = h[E] = h[E] || /* @__PURE__ */ new Map();
        _.forEach((m) => {
          if ($.has(m))
            return;
          $.set(m, n.Started);
          let v = l(m);
          if (v) {
            const P = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            g = (0, t._)`${g}${P} ${m} = ${v};${this.opts._n}`;
          } else if (v = w == null ? void 0 : w(m))
            g = (0, t._)`${g}${v}${this.opts._n}`;
          else
            throw new r(m);
          $.set(m, n.Completed);
        });
      }
      return g;
    }
  }
  e.ValueScope = u;
})(Gs);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = rn, r = Gs;
  var n = rn;
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
  var s = Gs;
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
    optimizeNames(i, f) {
      return this;
    }
  }
  class a extends o {
    constructor(i, f, S) {
      super(), this.varKind = i, this.name = f, this.rhs = S;
    }
    render({ es5: i, _n: f }) {
      const S = i ? r.varKinds.var : this.varKind, O = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${S} ${this.name}${O};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = T(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class u extends o {
    constructor(i, f, S) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = S;
    }
    render({ _n: i }) {
      return `${this.lhs} = ${this.rhs};` + i;
    }
    optimizeNames(i, f) {
      if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
        return this.rhs = T(this.rhs, i, f), this;
    }
    get names() {
      const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return oe(i, this.rhs);
    }
  }
  class c extends u {
    constructor(i, f, S, O) {
      super(i, S, O), this.op = f;
    }
    render({ _n: i }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + i;
    }
  }
  class d extends o {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `${this.label}:` + i;
    }
  }
  class l extends o {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `break${this.label ? ` ${this.label}` : ""};` + i;
    }
  }
  class h extends o {
    constructor(i) {
      super(), this.error = i;
    }
    render({ _n: i }) {
      return `throw ${this.error};` + i;
    }
    get names() {
      return this.error.names;
    }
  }
  class w extends o {
    constructor(i) {
      super(), this.code = i;
    }
    render({ _n: i }) {
      return `${this.code};` + i;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(i, f) {
      return this.code = T(this.code, i, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class g extends o {
    constructor(i = []) {
      super(), this.nodes = i;
    }
    render(i) {
      return this.nodes.reduce((f, S) => f + S.render(i), "");
    }
    optimizeNodes() {
      const { nodes: i } = this;
      let f = i.length;
      for (; f--; ) {
        const S = i[f].optimizeNodes();
        Array.isArray(S) ? i.splice(f, 1, ...S) : S ? i[f] = S : i.splice(f, 1);
      }
      return i.length > 0 ? this : void 0;
    }
    optimizeNames(i, f) {
      const { nodes: S } = this;
      let O = S.length;
      for (; O--; ) {
        const j = S[O];
        j.optimizeNames(i, f) || (k(i, j.names), S.splice(O, 1));
      }
      return S.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => z(i, f.names), {});
    }
  }
  class E extends g {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class _ extends g {
  }
  class $ extends E {
  }
  $.kind = "else";
  class m extends E {
    constructor(i, f) {
      super(f), this.condition = i;
    }
    render(i) {
      let f = `if(${this.condition})` + super.render(i);
      return this.else && (f += "else " + this.else.render(i)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const i = this.condition;
      if (i === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const S = f.optimizeNodes();
        f = this.else = Array.isArray(S) ? new $(S) : S;
      }
      if (f)
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(V(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var S;
      if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = T(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return oe(i, this.condition), this.else && z(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class v extends E {
  }
  v.kind = "for";
  class P extends v {
    constructor(i) {
      super(), this.iteration = i;
    }
    render(i) {
      return `for(${this.iteration})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iteration = T(this.iteration, i, f), this;
    }
    get names() {
      return z(super.names, this.iteration.names);
    }
  }
  class I extends v {
    constructor(i, f, S, O) {
      super(), this.varKind = i, this.name = f, this.from = S, this.to = O;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: S, from: O, to: j } = this;
      return `for(${f} ${S}=${O}; ${S}<${j}; ${S}++)` + super.render(i);
    }
    get names() {
      const i = oe(super.names, this.from);
      return oe(i, this.to);
    }
  }
  class R extends v {
    constructor(i, f, S, O) {
      super(), this.loop = i, this.varKind = f, this.name = S, this.iterable = O;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = T(this.iterable, i, f), this;
    }
    get names() {
      return z(super.names, this.iterable.names);
    }
  }
  class L extends E {
    constructor(i, f, S) {
      super(), this.name = i, this.args = f, this.async = S;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  L.kind = "func";
  class W extends g {
    render(i) {
      return "return " + super.render(i);
    }
  }
  W.kind = "return";
  class se extends E {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var S, O;
      return super.optimizeNames(i, f), (S = this.catch) === null || S === void 0 || S.optimizeNames(i, f), (O = this.finally) === null || O === void 0 || O.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && z(i, this.catch.names), this.finally && z(i, this.finally.names), i;
    }
  }
  class ae extends E {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  ae.kind = "catch";
  class de extends E {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  de.kind = "finally";
  class F {
    constructor(i, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = i, this._scope = new r.Scope({ parent: i }), this._nodes = [new _()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(i) {
      return this._scope.name(i);
    }
    // reserves unique name in the external scope
    scopeName(i) {
      return this._extScope.name(i);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(i, f) {
      const S = this._extScope.value(i, f);
      return (this._values[S.prefix] || (this._values[S.prefix] = /* @__PURE__ */ new Set())).add(S), S;
    }
    getScopeValue(i, f) {
      return this._extScope.getValue(i, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(i) {
      return this._extScope.scopeRefs(i, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(i, f, S, O) {
      const j = this._scope.toName(f);
      return S !== void 0 && O && (this._constants[j.str] = S), this._leafNode(new a(i, j, S)), j;
    }
    // `const` declaration (`var` in es5 mode)
    const(i, f, S) {
      return this._def(r.varKinds.const, i, f, S);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(i, f, S) {
      return this._def(r.varKinds.let, i, f, S);
    }
    // `var` declaration with optional assignment
    var(i, f, S) {
      return this._def(r.varKinds.var, i, f, S);
    }
    // assignment code
    assign(i, f, S) {
      return this._leafNode(new u(i, f, S));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new c(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new w(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [S, O] of i)
        f.length > 1 && f.push(","), f.push(S), (S !== O || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, O));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(i, f, S) {
      if (this._blockNode(new m(i)), f && S)
        this.code(f).else().code(S).endIf();
      else if (f)
        this.code(f).endIf();
      else if (S)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(i) {
      return this._elseNode(new m(i));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new $());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, $);
    }
    _for(i, f) {
      return this._blockNode(i), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(i, f) {
      return this._for(new P(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, S, O, j = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const q = this._scope.toName(i);
      return this._for(new I(j, q, f, S), () => O(q));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, S, O = r.varKinds.const) {
      const j = this._scope.toName(i);
      if (this.opts.es5) {
        const q = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${q}.length`, (U) => {
          this.var(j, (0, t._)`${q}[${U}]`), S(j);
        });
      }
      return this._for(new R("of", O, j, f), () => S(j));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, S, O = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, S);
      const j = this._scope.toName(i);
      return this._for(new R("in", O, j, f), () => S(j));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(v);
    }
    // `label` statement
    label(i) {
      return this._leafNode(new d(i));
    }
    // `break` statement
    break(i) {
      return this._leafNode(new l(i));
    }
    // `return` statement
    return(i) {
      const f = new W();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(W);
    }
    // `try` statement
    try(i, f, S) {
      if (!f && !S)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const O = new se();
      if (this._blockNode(O), this.code(i), f) {
        const j = this.name("e");
        this._currNode = O.catch = new ae(j), f(j);
      }
      return S && (this._currNode = O.finally = new de(), this.code(S)), this._endBlockNode(ae, de);
    }
    // `throw` statement
    throw(i) {
      return this._leafNode(new h(i));
    }
    // start self-balancing block
    block(i, f) {
      return this._blockStarts.push(this._nodes.length), i && this.code(i).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(i) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const S = this._nodes.length - f;
      if (S < 0 || i !== void 0 && S !== i)
        throw new Error(`CodeGen: wrong number of nodes: ${S} vs ${i} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(i, f = t.nil, S, O) {
      return this._blockNode(new L(i, f, S)), O && this.code(O).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(L);
    }
    optimize(i = 1) {
      for (; i-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(i) {
      return this._currNode.nodes.push(i), this;
    }
    _blockNode(i) {
      this._currNode.nodes.push(i), this._nodes.push(i);
    }
    _endBlockNode(i, f) {
      const S = this._currNode;
      if (S instanceof i || f && S instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${i.kind}/${f.kind}` : i.kind}"`);
    }
    _elseNode(i) {
      const f = this._currNode;
      if (!(f instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = i, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const i = this._nodes;
      return i[i.length - 1];
    }
    set _currNode(i) {
      const f = this._nodes;
      f[f.length - 1] = i;
    }
  }
  e.CodeGen = F;
  function z(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) + (i[f] || 0);
    return y;
  }
  function oe(y, i) {
    return i instanceof t._CodeOrName ? z(y, i.names) : y;
  }
  function T(y, i, f) {
    if (y instanceof t.Name)
      return S(y);
    if (!O(y))
      return y;
    return new t._Code(y._items.reduce((j, q) => (q instanceof t.Name && (q = S(q)), q instanceof t._Code ? j.push(...q._items) : j.push(q), j), []));
    function S(j) {
      const q = f[j.str];
      return q === void 0 || i[j.str] !== 1 ? j : (delete i[j.str], q);
    }
    function O(j) {
      return j instanceof t._Code && j._items.some((q) => q instanceof t.Name && i[q.str] === 1 && f[q.str] !== void 0);
    }
  }
  function k(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) - (i[f] || 0);
  }
  function V(y) {
    return typeof y == "boolean" || typeof y == "number" || y === null ? !y : (0, t._)`!${b(y)}`;
  }
  e.not = V;
  const C = p(e.operators.AND);
  function G(...y) {
    return y.reduce(C);
  }
  e.and = G;
  const D = p(e.operators.OR);
  function N(...y) {
    return y.reduce(D);
  }
  e.or = N;
  function p(y) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${b(i)} ${y} ${b(f)}`;
  }
  function b(y) {
    return y instanceof t.Name ? y : (0, t._)`(${y})`;
  }
})(Y);
var A = {};
Object.defineProperty(A, "__esModule", { value: !0 });
A.checkStrictMode = A.getErrorPath = A.Type = A.useFunc = A.setEvaluated = A.evaluatedPropsToName = A.mergeEvaluated = A.eachItem = A.unescapeJsonPointer = A.escapeJsonPointer = A.escapeFragment = A.unescapeFragment = A.schemaRefOrVal = A.schemaHasRulesButRef = A.schemaHasRules = A.checkUnknownRules = A.alwaysValidSchema = A.toHash = void 0;
const ie = Y, Md = rn;
function Ld(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
A.toHash = Ld;
function Vd(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (el(e, t), !tl(t, e.self.RULES.all));
}
A.alwaysValidSchema = Vd;
function el(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const o in t)
    s[o] || sl(e, `unknown keyword: "${o}"`);
}
A.checkUnknownRules = el;
function tl(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
A.schemaHasRules = tl;
function Fd(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
A.schemaHasRulesButRef = Fd;
function Ud({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ie._)`${r}`;
  }
  return (0, ie._)`${e}${t}${(0, ie.getProperty)(n)}`;
}
A.schemaRefOrVal = Ud;
function zd(e) {
  return rl(decodeURIComponent(e));
}
A.unescapeFragment = zd;
function qd(e) {
  return encodeURIComponent(ho(e));
}
A.escapeFragment = qd;
function ho(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
A.escapeJsonPointer = ho;
function rl(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
A.unescapeJsonPointer = rl;
function Gd(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
A.eachItem = Gd;
function _i({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, o, a, u) => {
    const c = a === void 0 ? o : a instanceof ie.Name ? (o instanceof ie.Name ? e(s, o, a) : t(s, o, a), a) : o instanceof ie.Name ? (t(s, a, o), o) : r(o, a);
    return u === ie.Name && !(c instanceof ie.Name) ? n(s, c) : c;
  };
}
A.mergeEvaluated = {
  props: _i({
    mergeNames: (e, t, r) => e.if((0, ie._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ie._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ie._)`${r} || {}`).code((0, ie._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ie._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ie._)`${r} || {}`), mo(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: nl
  }),
  items: _i({
    mergeNames: (e, t, r) => e.if((0, ie._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ie._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ie._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ie._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function nl(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ie._)`{}`);
  return t !== void 0 && mo(e, r, t), r;
}
A.evaluatedPropsToName = nl;
function mo(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ie._)`${t}${(0, ie.getProperty)(n)}`, !0));
}
A.setEvaluated = mo;
const vi = {};
function Kd(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: vi[t.code] || (vi[t.code] = new Md._Code(t.code))
  });
}
A.useFunc = Kd;
var Ks;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Ks || (A.Type = Ks = {}));
function Hd(e, t, r) {
  if (e instanceof ie.Name) {
    const n = t === Ks.Num;
    return r ? n ? (0, ie._)`"[" + ${e} + "]"` : (0, ie._)`"['" + ${e} + "']"` : n ? (0, ie._)`"/" + ${e}` : (0, ie._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ie.getProperty)(e).toString() : "/" + ho(e);
}
A.getErrorPath = Hd;
function sl(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
A.checkStrictMode = sl;
var Fe = {};
Object.defineProperty(Fe, "__esModule", { value: !0 });
const Pe = Y, Bd = {
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
Fe.default = Bd;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = Y, r = A, n = Fe;
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: m }) => m ? (0, t.str)`"${$}" keyword must be ${m} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, m = e.keywordError, v, P) {
    const { it: I } = $, { gen: R, compositeRule: L, allErrors: W } = I, se = h($, m, v);
    P ?? (L || W) ? c(R, se) : d(I, (0, t._)`[${se}]`);
  }
  e.reportError = s;
  function o($, m = e.keywordError, v) {
    const { it: P } = $, { gen: I, compositeRule: R, allErrors: L } = P, W = h($, m, v);
    c(I, W), R || L || d(P, n.default.vErrors);
  }
  e.reportExtraError = o;
  function a($, m) {
    $.assign(n.default.errors, m), $.if((0, t._)`${n.default.vErrors} !== null`, () => $.if(m, () => $.assign((0, t._)`${n.default.vErrors}.length`, m), () => $.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function u({ gen: $, keyword: m, schemaValue: v, data: P, errsCount: I, it: R }) {
    if (I === void 0)
      throw new Error("ajv implementation error");
    const L = $.name("err");
    $.forRange("i", I, n.default.errors, (W) => {
      $.const(L, (0, t._)`${n.default.vErrors}[${W}]`), $.if((0, t._)`${L}.instancePath === undefined`, () => $.assign((0, t._)`${L}.instancePath`, (0, t.strConcat)(n.default.instancePath, R.errorPath))), $.assign((0, t._)`${L}.schemaPath`, (0, t.str)`${R.errSchemaPath}/${m}`), R.opts.verbose && ($.assign((0, t._)`${L}.schema`, v), $.assign((0, t._)`${L}.data`, P));
    });
  }
  e.extendErrors = u;
  function c($, m) {
    const v = $.const("err", m);
    $.if((0, t._)`${n.default.vErrors} === null`, () => $.assign(n.default.vErrors, (0, t._)`[${v}]`), (0, t._)`${n.default.vErrors}.push(${v})`), $.code((0, t._)`${n.default.errors}++`);
  }
  function d($, m) {
    const { gen: v, validateName: P, schemaEnv: I } = $;
    I.$async ? v.throw((0, t._)`new ${$.ValidationError}(${m})`) : (v.assign((0, t._)`${P}.errors`, m), v.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h($, m, v) {
    const { createErrors: P } = $.it;
    return P === !1 ? (0, t._)`{}` : w($, m, v);
  }
  function w($, m, v = {}) {
    const { gen: P, it: I } = $, R = [
      g(I, v),
      E($, v)
    ];
    return _($, m, R), P.object(...R);
  }
  function g({ errorPath: $ }, { instancePath: m }) {
    const v = m ? (0, t.str)`${$}${(0, r.getErrorPath)(m, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, v)];
  }
  function E({ keyword: $, it: { errSchemaPath: m } }, { schemaPath: v, parentSchema: P }) {
    let I = P ? m : (0, t.str)`${m}/${$}`;
    return v && (I = (0, t.str)`${I}${(0, r.getErrorPath)(v, r.Type.Str)}`), [l.schemaPath, I];
  }
  function _($, { params: m, message: v }, P) {
    const { keyword: I, data: R, schemaValue: L, it: W } = $, { opts: se, propertyName: ae, topSchemaRef: de, schemaPath: F } = W;
    P.push([l.keyword, I], [l.params, typeof m == "function" ? m($) : m || (0, t._)`{}`]), se.messages && P.push([l.message, typeof v == "function" ? v($) : v]), se.verbose && P.push([l.schema, L], [l.parentSchema, (0, t._)`${de}${F}`], [n.default.data, R]), ae && P.push([l.propertyName, ae]);
  }
})(sn);
Object.defineProperty(gr, "__esModule", { value: !0 });
gr.boolOrEmptySchema = gr.topBoolOrEmptySchema = void 0;
const Wd = sn, Xd = Y, Jd = Fe, Yd = {
  message: "boolean schema is false"
};
function xd(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? ol(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Jd.default.data) : (t.assign((0, Xd._)`${n}.errors`, null), t.return(!0));
}
gr.topBoolOrEmptySchema = xd;
function Zd(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), ol(e)) : r.var(t, !0);
}
gr.boolOrEmptySchema = Zd;
function ol(e, t) {
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
  (0, Wd.reportError)(s, Yd, void 0, t);
}
var ye = {}, tr = {};
Object.defineProperty(tr, "__esModule", { value: !0 });
tr.getRules = tr.isJSONType = void 0;
const Qd = ["string", "number", "integer", "boolean", "null", "object", "array"], ef = new Set(Qd);
function tf(e) {
  return typeof e == "string" && ef.has(e);
}
tr.isJSONType = tf;
function rf() {
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
tr.getRules = rf;
var lt = {};
Object.defineProperty(lt, "__esModule", { value: !0 });
lt.shouldUseRule = lt.shouldUseGroup = lt.schemaHasRulesForType = void 0;
function nf({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && al(e, n);
}
lt.schemaHasRulesForType = nf;
function al(e, t) {
  return t.rules.some((r) => il(e, r));
}
lt.shouldUseGroup = al;
function il(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
lt.shouldUseRule = il;
Object.defineProperty(ye, "__esModule", { value: !0 });
ye.reportTypeError = ye.checkDataTypes = ye.checkDataType = ye.coerceAndCheckDataType = ye.getJSONTypes = ye.getSchemaTypes = ye.DataType = void 0;
const sf = tr, of = lt, af = sn, x = Y, cl = A;
var mr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(mr || (ye.DataType = mr = {}));
function cf(e) {
  const t = ll(e.type);
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
ye.getSchemaTypes = cf;
function ll(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(sf.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ye.getJSONTypes = ll;
function lf(e, t) {
  const { gen: r, data: n, opts: s } = e, o = uf(t, s.coerceTypes), a = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, of.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const u = po(t, n, s.strictNumbers, mr.Wrong);
    r.if(u, () => {
      o.length ? df(e, t, o) : $o(e);
    });
  }
  return a;
}
ye.coerceAndCheckDataType = lf;
const ul = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function uf(e, t) {
  return t ? e.filter((r) => ul.has(r) || t === "array" && r === "array") : [];
}
function df(e, t, r) {
  const { gen: n, data: s, opts: o } = e, a = n.let("dataType", (0, x._)`typeof ${s}`), u = n.let("coerced", (0, x._)`undefined`);
  o.coerceTypes === "array" && n.if((0, x._)`${a} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, x._)`${s}[0]`).assign(a, (0, x._)`typeof ${s}`).if(po(t, s, o.strictNumbers), () => n.assign(u, s))), n.if((0, x._)`${u} !== undefined`);
  for (const d of r)
    (ul.has(d) || d === "array" && o.coerceTypes === "array") && c(d);
  n.else(), $o(e), n.endIf(), n.if((0, x._)`${u} !== undefined`, () => {
    n.assign(s, u), ff(e, u);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, x._)`${a} == "number" || ${a} == "boolean"`).assign(u, (0, x._)`"" + ${s}`).elseIf((0, x._)`${s} === null`).assign(u, (0, x._)`""`);
        return;
      case "number":
        n.elseIf((0, x._)`${a} == "boolean" || ${s} === null
              || (${a} == "string" && ${s} && ${s} == +${s})`).assign(u, (0, x._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, x._)`${a} === "boolean" || ${s} === null
              || (${a} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(u, (0, x._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, x._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(u, !1).elseIf((0, x._)`${s} === "true" || ${s} === 1`).assign(u, !0);
        return;
      case "null":
        n.elseIf((0, x._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(u, null);
        return;
      case "array":
        n.elseIf((0, x._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${s} === null`).assign(u, (0, x._)`[${s}]`);
    }
  }
}
function ff({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, x._)`${t} !== undefined`, () => e.assign((0, x._)`${t}[${r}]`, n));
}
function Hs(e, t, r, n = mr.Correct) {
  const s = n === mr.Correct ? x.operators.EQ : x.operators.NEQ;
  let o;
  switch (e) {
    case "null":
      return (0, x._)`${t} ${s} null`;
    case "array":
      o = (0, x._)`Array.isArray(${t})`;
      break;
    case "object":
      o = (0, x._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      o = a((0, x._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      o = a();
      break;
    default:
      return (0, x._)`typeof ${t} ${s} ${e}`;
  }
  return n === mr.Correct ? o : (0, x.not)(o);
  function a(u = x.nil) {
    return (0, x.and)((0, x._)`typeof ${t} == "number"`, u, r ? (0, x._)`isFinite(${t})` : x.nil);
  }
}
ye.checkDataType = Hs;
function po(e, t, r, n) {
  if (e.length === 1)
    return Hs(e[0], t, r, n);
  let s;
  const o = (0, cl.toHash)(e);
  if (o.array && o.object) {
    const a = (0, x._)`typeof ${t} != "object"`;
    s = o.null ? a : (0, x._)`!${t} || ${a}`, delete o.null, delete o.array, delete o.object;
  } else
    s = x.nil;
  o.number && delete o.integer;
  for (const a in o)
    s = (0, x.and)(s, Hs(a, t, r, n));
  return s;
}
ye.checkDataTypes = po;
const hf = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, x._)`{type: ${e}}` : (0, x._)`{type: ${t}}`
};
function $o(e) {
  const t = mf(e);
  (0, af.reportError)(t, hf);
}
ye.reportTypeError = $o;
function mf(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, cl.schemaRefOrVal)(e, n, "type");
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
var ts = {};
Object.defineProperty(ts, "__esModule", { value: !0 });
ts.assignDefaults = void 0;
const sr = Y, pf = A;
function $f(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      wi(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, o) => wi(e, o, s.default));
}
ts.assignDefaults = $f;
function wi(e, t, r) {
  const { gen: n, compositeRule: s, data: o, opts: a } = e;
  if (r === void 0)
    return;
  const u = (0, sr._)`${o}${(0, sr.getProperty)(t)}`;
  if (s) {
    (0, pf.checkStrictMode)(e, `default is ignored for: ${u}`);
    return;
  }
  let c = (0, sr._)`${u} === undefined`;
  a.useDefaults === "empty" && (c = (0, sr._)`${c} || ${u} === null || ${u} === ""`), n.if(c, (0, sr._)`${u} = ${(0, sr.stringify)(r)}`);
}
var rt = {}, te = {};
Object.defineProperty(te, "__esModule", { value: !0 });
te.validateUnion = te.validateArray = te.usePattern = te.callValidateCode = te.schemaProperties = te.allSchemaProperties = te.noPropertyInData = te.propertyInData = te.isOwnProperty = te.hasPropFunc = te.reportMissingProp = te.checkMissingProp = te.checkReportMissingProp = void 0;
const le = Y, yo = A, gt = Fe, yf = A;
function gf(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(_o(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, le._)`${t}` }, !0), e.error();
  });
}
te.checkReportMissingProp = gf;
function _f({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, le.or)(...n.map((o) => (0, le.and)(_o(e, t, o, r.ownProperties), (0, le._)`${s} = ${o}`)));
}
te.checkMissingProp = _f;
function vf(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
te.reportMissingProp = vf;
function dl(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, le._)`Object.prototype.hasOwnProperty`
  });
}
te.hasPropFunc = dl;
function go(e, t, r) {
  return (0, le._)`${dl(e)}.call(${t}, ${r})`;
}
te.isOwnProperty = go;
function wf(e, t, r, n) {
  const s = (0, le._)`${t}${(0, le.getProperty)(r)} !== undefined`;
  return n ? (0, le._)`${s} && ${go(e, t, r)}` : s;
}
te.propertyInData = wf;
function _o(e, t, r, n) {
  const s = (0, le._)`${t}${(0, le.getProperty)(r)} === undefined`;
  return n ? (0, le.or)(s, (0, le.not)(go(e, t, r))) : s;
}
te.noPropertyInData = _o;
function fl(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
te.allSchemaProperties = fl;
function Ef(e, t) {
  return fl(t).filter((r) => !(0, yo.alwaysValidSchema)(e, t[r]));
}
te.schemaProperties = Ef;
function Sf({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: o }, it: a }, u, c, d) {
  const l = d ? (0, le._)`${e}, ${t}, ${n}${s}` : t, h = [
    [gt.default.instancePath, (0, le.strConcat)(gt.default.instancePath, o)],
    [gt.default.parentData, a.parentData],
    [gt.default.parentDataProperty, a.parentDataProperty],
    [gt.default.rootData, gt.default.rootData]
  ];
  a.opts.dynamicRef && h.push([gt.default.dynamicAnchors, gt.default.dynamicAnchors]);
  const w = (0, le._)`${l}, ${r.object(...h)}`;
  return c !== le.nil ? (0, le._)`${u}.call(${c}, ${w})` : (0, le._)`${u}(${w})`;
}
te.callValidateCode = Sf;
const bf = (0, le._)`new RegExp`;
function Pf({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, o = s(r, n);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, le._)`${s.code === "new RegExp" ? bf : (0, yf.useFunc)(e, s)}(${r}, ${n})`
  });
}
te.usePattern = Pf;
function Nf(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, o = t.name("valid");
  if (s.allErrors) {
    const u = t.let("valid", !0);
    return a(() => t.assign(u, !1)), u;
  }
  return t.var(o, !0), a(() => t.break()), o;
  function a(u) {
    const c = t.const("len", (0, le._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: yo.Type.Num
      }, o), t.if((0, le.not)(o), u);
    });
  }
}
te.validateArray = Nf;
function If(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, yo.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const a = t.let("valid", !1), u = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, u);
    t.assign(a, (0, le._)`${a} || ${u}`), e.mergeValidEvaluated(l, u) || t.if((0, le.not)(a));
  })), e.result(a, () => e.reset(), () => e.error(!0));
}
te.validateUnion = If;
Object.defineProperty(rt, "__esModule", { value: !0 });
rt.validateKeywordUsage = rt.validSchemaType = rt.funcKeywordCode = rt.macroKeywordCode = void 0;
const Oe = Y, Bt = Fe, Rf = te, Of = sn;
function Tf(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: o, it: a } = e, u = t.macro.call(a.self, s, o, a), c = hl(r, n, u);
  a.opts.validateSchema !== !1 && a.self.validateSchema(u, !0);
  const d = r.name("valid");
  e.subschema({
    schema: u,
    schemaPath: Oe.nil,
    errSchemaPath: `${a.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
rt.macroKeywordCode = Tf;
function jf(e, t) {
  var r;
  const { gen: n, keyword: s, schema: o, parentSchema: a, $data: u, it: c } = e;
  Af(c, t);
  const d = !u && t.compile ? t.compile.call(c.self, o, a, c) : t.validate, l = hl(n, s, d), h = n.let("valid");
  e.block$data(h, w), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function w() {
    if (t.errors === !1)
      _(), t.modifying && Ei(e), $(() => e.error());
    else {
      const m = t.async ? g() : E();
      t.modifying && Ei(e), $(() => kf(e, m));
    }
  }
  function g() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, Oe._)`await `), (v) => n.assign(h, !1).if((0, Oe._)`${v} instanceof ${c.ValidationError}`, () => n.assign(m, (0, Oe._)`${v}.errors`), () => n.throw(v))), m;
  }
  function E() {
    const m = (0, Oe._)`${l}.errors`;
    return n.assign(m, null), _(Oe.nil), m;
  }
  function _(m = t.async ? (0, Oe._)`await ` : Oe.nil) {
    const v = c.opts.passContext ? Bt.default.this : Bt.default.self, P = !("compile" in t && !u || t.schema === !1);
    n.assign(h, (0, Oe._)`${m}${(0, Rf.callValidateCode)(e, l, v, P)}`, t.modifying);
  }
  function $(m) {
    var v;
    n.if((0, Oe.not)((v = t.valid) !== null && v !== void 0 ? v : h), m);
  }
}
rt.funcKeywordCode = jf;
function Ei(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Oe._)`${n.parentData}[${n.parentDataProperty}]`));
}
function kf(e, t) {
  const { gen: r } = e;
  r.if((0, Oe._)`Array.isArray(${t})`, () => {
    r.assign(Bt.default.vErrors, (0, Oe._)`${Bt.default.vErrors} === null ? ${t} : ${Bt.default.vErrors}.concat(${t})`).assign(Bt.default.errors, (0, Oe._)`${Bt.default.vErrors}.length`), (0, Of.extendErrors)(e);
  }, () => e.error());
}
function Af({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function hl(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Oe.stringify)(r) });
}
function Cf(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
rt.validSchemaType = Cf;
function Df({ schema: e, opts: t, self: r, errSchemaPath: n }, s, o) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(o) : s.keyword !== o)
    throw new Error("ajv implementation error");
  const a = s.dependencies;
  if (a != null && a.some((u) => !Object.prototype.hasOwnProperty.call(e, u)))
    throw new Error(`parent schema must have dependencies of ${o}: ${a.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[o])) {
    const c = `keyword "${o}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
rt.validateKeywordUsage = Df;
var Rt = {};
Object.defineProperty(Rt, "__esModule", { value: !0 });
Rt.extendSubschemaMode = Rt.extendSubschemaData = Rt.getSubschema = void 0;
const et = Y, ml = A;
function Mf(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: o, topSchemaRef: a }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const u = e.schema[t];
    return r === void 0 ? {
      schema: u,
      schemaPath: (0, et._)`${e.schemaPath}${(0, et.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: u[r],
      schemaPath: (0, et._)`${e.schemaPath}${(0, et.getProperty)(t)}${(0, et.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, ml.escapeFragment)(r)}`
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
Rt.getSubschema = Mf;
function Lf(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: o, propertyName: a }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: u } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: l, opts: h } = t, w = u.let("data", (0, et._)`${t.data}${(0, et.getProperty)(r)}`, !0);
    c(w), e.errorPath = (0, et.str)`${d}${(0, ml.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, et._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof et.Name ? s : u.let("data", s, !0);
    c(d), a !== void 0 && (e.propertyName = a);
  }
  o && (e.dataTypes = o);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Rt.extendSubschemaData = Lf;
function Vf(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: o }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Rt.extendSubschemaMode = Vf;
var Ee = {}, rs = function e(t, r) {
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
}, pl = { exports: {} }, Nt = pl.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Tn(t, n, s, e, "", e);
};
Nt.keywords = {
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
Nt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Nt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Nt.skipKeywords = {
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
function Tn(e, t, r, n, s, o, a, u, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, o, a, u, c, d);
    for (var l in n) {
      var h = n[l];
      if (Array.isArray(h)) {
        if (l in Nt.arrayKeywords)
          for (var w = 0; w < h.length; w++)
            Tn(e, t, r, h[w], s + "/" + l + "/" + w, o, s, l, n, w);
      } else if (l in Nt.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            Tn(e, t, r, h[g], s + "/" + l + "/" + Ff(g), o, s, l, n, g);
      } else (l in Nt.keywords || e.allKeys && !(l in Nt.skipKeywords)) && Tn(e, t, r, h, s + "/" + l, o, s, l, n);
    }
    r(n, s, o, a, u, c, d);
  }
}
function Ff(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Uf = pl.exports;
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.getSchemaRefs = Ee.resolveUrl = Ee.normalizeId = Ee._getFullPath = Ee.getFullPath = Ee.inlineRef = void 0;
const zf = A, qf = rs, Gf = Uf, Kf = /* @__PURE__ */ new Set([
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
function Hf(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Bs(e) : t ? $l(e) <= t : !1;
}
Ee.inlineRef = Hf;
const Bf = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Bs(e) {
  for (const t in e) {
    if (Bf.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Bs) || typeof r == "object" && Bs(r))
      return !0;
  }
  return !1;
}
function $l(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Kf.has(r) && (typeof e[r] == "object" && (0, zf.eachItem)(e[r], (n) => t += $l(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function yl(e, t = "", r) {
  r !== !1 && (t = pr(t));
  const n = e.parse(t);
  return gl(e, n);
}
Ee.getFullPath = yl;
function gl(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ee._getFullPath = gl;
const Wf = /#\/?$/;
function pr(e) {
  return e ? e.replace(Wf, "") : "";
}
Ee.normalizeId = pr;
function Xf(e, t, r) {
  return r = pr(r), e.resolve(t, r);
}
Ee.resolveUrl = Xf;
const Jf = /^[a-z_][-a-z0-9._]*$/i;
function Yf(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = pr(e[r] || t), o = { "": s }, a = yl(n, s, !1), u = {}, c = /* @__PURE__ */ new Set();
  return Gf(e, { allKeys: !0 }, (h, w, g, E) => {
    if (E === void 0)
      return;
    const _ = a + w;
    let $ = o[E];
    typeof h[r] == "string" && ($ = m.call(this, h[r])), v.call(this, h.$anchor), v.call(this, h.$dynamicAnchor), o[w] = $;
    function m(P) {
      const I = this.opts.uriResolver.resolve;
      if (P = pr($ ? I($, P) : P), c.has(P))
        throw l(P);
      c.add(P);
      let R = this.refs[P];
      return typeof R == "string" && (R = this.refs[R]), typeof R == "object" ? d(h, R.schema, P) : P !== pr(_) && (P[0] === "#" ? (d(h, u[P], P), u[P] = h) : this.refs[P] = _), P;
    }
    function v(P) {
      if (typeof P == "string") {
        if (!Jf.test(P))
          throw new Error(`invalid anchor "${P}"`);
        m.call(this, `#${P}`);
      }
    }
  }), u;
  function d(h, w, g) {
    if (w !== void 0 && !qf(h, w))
      throw l(g);
  }
  function l(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ee.getSchemaRefs = Yf;
Object.defineProperty(Je, "__esModule", { value: !0 });
Je.getData = Je.KeywordCxt = Je.validateFunctionCode = void 0;
const _l = gr, Si = ye, vo = lt, qn = ye, xf = ts, Br = rt, Ss = Rt, K = Y, X = Fe, Zf = Ee, ut = A, Vr = sn;
function Qf(e) {
  if (El(e) && (Sl(e), wl(e))) {
    rh(e);
    return;
  }
  vl(e, () => (0, _l.topBoolOrEmptySchema)(e));
}
Je.validateFunctionCode = Qf;
function vl({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, o) {
  s.code.es5 ? e.func(t, (0, K._)`${X.default.data}, ${X.default.valCxt}`, n.$async, () => {
    e.code((0, K._)`"use strict"; ${bi(r, s)}`), th(e, s), e.code(o);
  }) : e.func(t, (0, K._)`${X.default.data}, ${eh(s)}`, n.$async, () => e.code(bi(r, s)).code(o));
}
function eh(e) {
  return (0, K._)`{${X.default.instancePath}="", ${X.default.parentData}, ${X.default.parentDataProperty}, ${X.default.rootData}=${X.default.data}${e.dynamicRef ? (0, K._)`, ${X.default.dynamicAnchors}={}` : K.nil}}={}`;
}
function th(e, t) {
  e.if(X.default.valCxt, () => {
    e.var(X.default.instancePath, (0, K._)`${X.default.valCxt}.${X.default.instancePath}`), e.var(X.default.parentData, (0, K._)`${X.default.valCxt}.${X.default.parentData}`), e.var(X.default.parentDataProperty, (0, K._)`${X.default.valCxt}.${X.default.parentDataProperty}`), e.var(X.default.rootData, (0, K._)`${X.default.valCxt}.${X.default.rootData}`), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, K._)`${X.default.valCxt}.${X.default.dynamicAnchors}`);
  }, () => {
    e.var(X.default.instancePath, (0, K._)`""`), e.var(X.default.parentData, (0, K._)`undefined`), e.var(X.default.parentDataProperty, (0, K._)`undefined`), e.var(X.default.rootData, X.default.data), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, K._)`{}`);
  });
}
function rh(e) {
  const { schema: t, opts: r, gen: n } = e;
  vl(e, () => {
    r.$comment && t.$comment && Pl(e), ih(e), n.let(X.default.vErrors, null), n.let(X.default.errors, 0), r.unevaluated && nh(e), bl(e), uh(e);
  });
}
function nh(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, K._)`${r}.evaluated`), t.if((0, K._)`${e.evaluated}.dynamicProps`, () => t.assign((0, K._)`${e.evaluated}.props`, (0, K._)`undefined`)), t.if((0, K._)`${e.evaluated}.dynamicItems`, () => t.assign((0, K._)`${e.evaluated}.items`, (0, K._)`undefined`));
}
function bi(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, K._)`/*# sourceURL=${r} */` : K.nil;
}
function sh(e, t) {
  if (El(e) && (Sl(e), wl(e))) {
    oh(e, t);
    return;
  }
  (0, _l.boolOrEmptySchema)(e, t);
}
function wl({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function El(e) {
  return typeof e.schema != "boolean";
}
function oh(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Pl(e), ch(e), lh(e);
  const o = n.const("_errs", X.default.errors);
  bl(e, o), n.var(t, (0, K._)`${o} === ${X.default.errors}`);
}
function Sl(e) {
  (0, ut.checkUnknownRules)(e), ah(e);
}
function bl(e, t) {
  if (e.opts.jtd)
    return Pi(e, [], !1, t);
  const r = (0, Si.getSchemaTypes)(e.schema), n = (0, Si.coerceAndCheckDataType)(e, r);
  Pi(e, r, !n, t);
}
function ah(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, ut.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function ih(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, ut.checkStrictMode)(e, "default is ignored in the schema root");
}
function ch(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, Zf.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function lh(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Pl({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const o = r.$comment;
  if (s.$comment === !0)
    e.code((0, K._)`${X.default.self}.logger.log(${o})`);
  else if (typeof s.$comment == "function") {
    const a = (0, K.str)`${n}/$comment`, u = e.scopeValue("root", { ref: t.root });
    e.code((0, K._)`${X.default.self}.opts.$comment(${o}, ${a}, ${u}.schema)`);
  }
}
function uh(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: o } = e;
  r.$async ? t.if((0, K._)`${X.default.errors} === 0`, () => t.return(X.default.data), () => t.throw((0, K._)`new ${s}(${X.default.vErrors})`)) : (t.assign((0, K._)`${n}.errors`, X.default.vErrors), o.unevaluated && dh(e), t.return((0, K._)`${X.default.errors} === 0`));
}
function dh({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof K.Name && e.assign((0, K._)`${t}.props`, r), n instanceof K.Name && e.assign((0, K._)`${t}.items`, n);
}
function Pi(e, t, r, n) {
  const { gen: s, schema: o, data: a, allErrors: u, opts: c, self: d } = e, { RULES: l } = d;
  if (o.$ref && (c.ignoreKeywordsWithRef || !(0, ut.schemaHasRulesButRef)(o, l))) {
    s.block(() => Rl(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || fh(e, t), s.block(() => {
    for (const w of l.rules)
      h(w);
    h(l.post);
  });
  function h(w) {
    (0, vo.shouldUseGroup)(o, w) && (w.type ? (s.if((0, qn.checkDataType)(w.type, a, c.strictNumbers)), Ni(e, w), t.length === 1 && t[0] === w.type && r && (s.else(), (0, qn.reportTypeError)(e)), s.endIf()) : Ni(e, w), u || s.if((0, K._)`${X.default.errors} === ${n || 0}`));
  }
}
function Ni(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, xf.assignDefaults)(e, t.type), r.block(() => {
    for (const o of t.rules)
      (0, vo.shouldUseRule)(n, o) && Rl(e, o.keyword, o.definition, t.type);
  });
}
function fh(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (hh(e, t), e.opts.allowUnionTypes || mh(e, t), ph(e, e.dataTypes));
}
function hh(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Nl(e.dataTypes, r) || wo(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), yh(e, t);
  }
}
function mh(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && wo(e, "use allowUnionTypes to allow union type keyword");
}
function ph(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, vo.shouldUseRule)(e.schema, s)) {
      const { type: o } = s.definition;
      o.length && !o.some((a) => $h(t, a)) && wo(e, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function $h(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Nl(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function yh(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Nl(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function wo(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, ut.checkStrictMode)(e, t, e.opts.strictTypes);
}
let Il = class {
  constructor(t, r, n) {
    if ((0, Br.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, ut.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Ol(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Br.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", X.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, K.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, K.not)(t), void 0, r);
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
    this.fail((0, K._)`${r} !== undefined && (${(0, K.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Vr.reportExtraError : Vr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Vr.reportError)(this, this.def.$dataError || Vr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Vr.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = K.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = K.nil, r = K.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: o, def: a } = this;
    n.if((0, K.or)((0, K._)`${s} === undefined`, r)), t !== K.nil && n.assign(t, !0), (o.length || a.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== K.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: o } = this;
    return (0, K.or)(a(), u());
    function a() {
      if (n.length) {
        if (!(r instanceof K.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, K._)`${(0, qn.checkDataTypes)(c, r, o.opts.strictNumbers, qn.DataType.Wrong)}`;
      }
      return K.nil;
    }
    function u() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, K._)`!${c}(${r})`;
      }
      return K.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Ss.getSubschema)(this.it, t);
    (0, Ss.extendSubschemaData)(n, this.it, t), (0, Ss.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return sh(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = ut.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = ut.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, K.Name)), !0;
  }
};
Je.KeywordCxt = Il;
function Rl(e, t, r, n) {
  const s = new Il(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Br.funcKeywordCode)(s, r) : "macro" in r ? (0, Br.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Br.funcKeywordCode)(s, r);
}
const gh = /^\/(?:[^~]|~0|~1)*$/, _h = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Ol(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, o;
  if (e === "")
    return X.default.rootData;
  if (e[0] === "/") {
    if (!gh.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, o = X.default.rootData;
  } else {
    const d = _h.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +d[1];
    if (s = d[2], s === "#") {
      if (l >= t)
        throw new Error(c("property/index", l));
      return n[t - l];
    }
    if (l > t)
      throw new Error(c("data", l));
    if (o = r[t - l], !s)
      return o;
  }
  let a = o;
  const u = s.split("/");
  for (const d of u)
    d && (o = (0, K._)`${o}${(0, K.getProperty)((0, ut.unescapeJsonPointer)(d))}`, a = (0, K._)`${a} && ${o}`);
  return a;
  function c(d, l) {
    return `Cannot access ${d} ${l} levels up, current level is ${t}`;
  }
}
Je.getData = Ol;
var on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
let vh = class extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
};
on.default = vh;
var Sr = {};
Object.defineProperty(Sr, "__esModule", { value: !0 });
const bs = Ee;
let wh = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, bs.resolveUrl)(t, r, n), this.missingSchema = (0, bs.normalizeId)((0, bs.getFullPath)(t, this.missingRef));
  }
};
Sr.default = wh;
var je = {};
Object.defineProperty(je, "__esModule", { value: !0 });
je.resolveSchema = je.getCompilingSchema = je.resolveRef = je.compileSchema = je.SchemaEnv = void 0;
const Ge = Y, Eh = on, Kt = Fe, We = Ee, Ii = A, Sh = Je;
let ns = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, We.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
je.SchemaEnv = ns;
function Eo(e) {
  const t = Tl.call(this, e);
  if (t)
    return t;
  const r = (0, We.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: o } = this.opts, a = new Ge.CodeGen(this.scope, { es5: n, lines: s, ownProperties: o });
  let u;
  e.$async && (u = a.scopeValue("Error", {
    ref: Eh.default,
    code: (0, Ge._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = a.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: a,
    allErrors: this.opts.allErrors,
    data: Kt.default.data,
    parentData: Kt.default.parentData,
    parentDataProperty: Kt.default.parentDataProperty,
    dataNames: [Kt.default.data],
    dataPathArr: [Ge.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: a.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Ge.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: u,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Ge.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Ge._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, Sh.validateFunctionCode)(d), a.optimize(this.opts.code.optimize);
    const h = a.toString();
    l = `${a.scopeRefs(Kt.default.scope)}return ${h}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const g = new Function(`${Kt.default.self}`, `${Kt.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: h, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: E, items: _ } = d;
      g.evaluated = {
        props: E instanceof Ge.Name ? void 0 : E,
        items: _ instanceof Ge.Name ? void 0 : _,
        dynamicProps: E instanceof Ge.Name,
        dynamicItems: _ instanceof Ge.Name
      }, g.source && (g.source.evaluated = (0, Ge.stringify)(g.evaluated));
    }
    return e.validate = g, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), h;
  } finally {
    this._compilations.delete(e);
  }
}
je.compileSchema = Eo;
function bh(e, t, r) {
  var n;
  r = (0, We.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let o = Ih.call(this, e, r);
  if (o === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: u } = this.opts;
    a && (o = new ns({ schema: a, schemaId: u, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[r] = Ph.call(this, o);
}
je.resolveRef = bh;
function Ph(e) {
  return (0, We.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Eo.call(this, e);
}
function Tl(e) {
  for (const t of this._compilations)
    if (Nh(t, e))
      return t;
}
je.getCompilingSchema = Tl;
function Nh(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Ih(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || ss.call(this, e, t);
}
function ss(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, We._getFullPath)(this.opts.uriResolver, r);
  let s = (0, We.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Ps.call(this, r, e);
  const o = (0, We.normalizeId)(n), a = this.refs[o] || this.schemas[o];
  if (typeof a == "string") {
    const u = ss.call(this, e, a);
    return typeof (u == null ? void 0 : u.schema) != "object" ? void 0 : Ps.call(this, r, u);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || Eo.call(this, a), o === (0, We.normalizeId)(t)) {
      const { schema: u } = a, { schemaId: c } = this.opts, d = u[c];
      return d && (s = (0, We.resolveUrl)(this.opts.uriResolver, s, d)), new ns({ schema: u, schemaId: c, root: e, baseId: s });
    }
    return Ps.call(this, r, a);
  }
}
je.resolveSchema = ss;
const Rh = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Ps(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const u of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Ii.unescapeFragment)(u)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !Rh.has(u) && d && (t = (0, We.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let o;
  if (typeof r != "boolean" && r.$ref && !(0, Ii.schemaHasRulesButRef)(r, this.RULES)) {
    const u = (0, We.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    o = ss.call(this, n, u);
  }
  const { schemaId: a } = this.opts;
  if (o = o || new ns({ schema: r, schemaId: a, root: n, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const Oh = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Th = "Meta-schema for $data reference (JSON AnySchema extension proposal)", jh = "object", kh = [
  "$data"
], Ah = {
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
}, Ch = !1, Dh = {
  $id: Oh,
  description: Th,
  type: jh,
  required: kh,
  properties: Ah,
  additionalProperties: Ch
};
var So = {}, os = { exports: {} };
const Mh = {
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
var Lh = {
  HEX: Mh
};
const { HEX: Vh } = Lh, Fh = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
function jl(e) {
  if (Al(e, ".") < 3)
    return { host: e, isIPV4: !1 };
  const t = e.match(Fh) || [], [r] = t;
  return r ? { host: zh(r, "."), isIPV4: !0 } : { host: e, isIPV4: !1 };
}
function Ri(e, t = !1) {
  let r = "", n = !0;
  for (const s of e) {
    if (Vh[s] === void 0) return;
    s !== "0" && n === !0 && (n = !1), n || (r += s);
  }
  return t && r.length === 0 && (r = "0"), r;
}
function Uh(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let o = !1, a = !1, u = !1;
  function c() {
    if (s.length) {
      if (o === !1) {
        const d = Ri(s);
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
    const l = e[d];
    if (!(l === "[" || l === "]"))
      if (l === ":") {
        if (a === !0 && (u = !0), !c())
          break;
        if (t++, n.push(":"), t > 7) {
          r.error = !0;
          break;
        }
        d - 1 >= 0 && e[d - 1] === ":" && (a = !0);
        continue;
      } else if (l === "%") {
        if (!c())
          break;
        o = !0;
      } else {
        s.push(l);
        continue;
      }
  }
  return s.length && (o ? r.zone = s.join("") : u ? n.push(s.join("")) : n.push(Ri(s))), r.address = n.join(""), r;
}
function kl(e) {
  if (Al(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = Uh(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, escapedHost: n, isIPV6: !0 };
  }
}
function zh(e, t) {
  let r = "", n = !0;
  const s = e.length;
  for (let o = 0; o < s; o++) {
    const a = e[o];
    a === "0" && n ? (o + 1 <= s && e[o + 1] === t || o + 1 === s) && (r += a, n = !1) : (a === t ? n = !0 : n = !1, r += a);
  }
  return r;
}
function Al(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
const Oi = /^\.\.?\//u, Ti = /^\/\.(?:\/|$)/u, ji = /^\/\.\.(?:\/|$)/u, qh = /^\/?(?:.|\n)*?(?=\/|$)/u;
function Gh(e) {
  const t = [];
  for (; e.length; )
    if (e.match(Oi))
      e = e.replace(Oi, "");
    else if (e.match(Ti))
      e = e.replace(Ti, "/");
    else if (e.match(ji))
      e = e.replace(ji, "/"), t.pop();
    else if (e === "." || e === "..")
      e = "";
    else {
      const r = e.match(qh);
      if (r) {
        const n = r[0];
        e = e.slice(n.length), t.push(n);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return t.join("");
}
function Kh(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function Hh(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    const n = jl(r);
    if (n.isIPV4)
      r = n.host;
    else {
      const s = kl(n.host);
      s.isIPV6 === !0 ? r = `[${s.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var Bh = {
  recomposeAuthority: Hh,
  normalizeComponentEncoding: Kh,
  removeDotSegments: Gh,
  normalizeIPv4: jl,
  normalizeIPv6: kl
};
const Wh = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, Xh = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Cl(e) {
  return typeof e.secure == "boolean" ? e.secure : String(e.scheme).toLowerCase() === "wss";
}
function Dl(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function Ml(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function Jh(e) {
  return e.secure = Cl(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function Yh(e) {
  if ((e.port === (Cl(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function xh(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(Xh);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, o = bo[s];
    e.path = void 0, o && (e = o.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function Zh(e, t) {
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, o = bo[s];
  o && (e = o.serialize(e, t));
  const a = e, u = e.nss;
  return a.path = `${n || t.nid}:${u}`, t.skipEscape = !0, a;
}
function Qh(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !Wh.test(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function em(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const Ll = {
  scheme: "http",
  domainHost: !0,
  parse: Dl,
  serialize: Ml
}, tm = {
  scheme: "https",
  domainHost: Ll.domainHost,
  parse: Dl,
  serialize: Ml
}, jn = {
  scheme: "ws",
  domainHost: !0,
  parse: Jh,
  serialize: Yh
}, rm = {
  scheme: "wss",
  domainHost: jn.domainHost,
  parse: jn.parse,
  serialize: jn.serialize
}, nm = {
  scheme: "urn",
  parse: xh,
  serialize: Zh,
  skipNormalize: !0
}, sm = {
  scheme: "urn:uuid",
  parse: Qh,
  serialize: em,
  skipNormalize: !0
}, bo = {
  http: Ll,
  https: tm,
  ws: jn,
  wss: rm,
  urn: nm,
  "urn:uuid": sm
};
var om = bo;
const { normalizeIPv6: am, normalizeIPv4: im, removeDotSegments: Gr, recomposeAuthority: cm, normalizeComponentEncoding: fn } = Bh, Po = om;
function lm(e, t) {
  return typeof e == "string" ? e = nt(ht(e, t), t) : typeof e == "object" && (e = ht(nt(e, t), t)), e;
}
function um(e, t, r) {
  const n = Object.assign({ scheme: "null" }, r), s = Vl(ht(e, n), ht(t, n), n, !0);
  return nt(s, { ...n, skipEscape: !0 });
}
function Vl(e, t, r, n) {
  const s = {};
  return n || (e = ht(nt(e, r), r), t = ht(nt(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Gr(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Gr(t.path || ""), s.query = t.query) : (t.path ? (t.path.charAt(0) === "/" ? s.path = Gr(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = Gr(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function dm(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = nt(fn(ht(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = nt(fn(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = nt(fn(ht(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = nt(fn(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function nt(e, t) {
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
  }, n = Object.assign({}, t), s = [], o = Po[(n.scheme || r.scheme || "").toLowerCase()];
  o && o.serialize && o.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const a = cm(r);
  if (a !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(a), r.path && r.path.charAt(0) !== "/" && s.push("/")), r.path !== void 0) {
    let u = r.path;
    !n.absolutePath && (!o || !o.absolutePath) && (u = Gr(u)), a === void 0 && (u = u.replace(/^\/\//u, "/%2F")), s.push(u);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const fm = Array.from({ length: 127 }, (e, t) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(t)));
function hm(e) {
  let t = 0;
  for (let r = 0, n = e.length; r < n; ++r)
    if (t = e.charCodeAt(r), t > 126 || fm[t])
      return !0;
  return !1;
}
const mm = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function ht(e, t) {
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
  const a = e.match(mm);
  if (a) {
    if (n.scheme = a[1], n.userinfo = a[3], n.host = a[4], n.port = parseInt(a[5], 10), n.path = a[6] || "", n.query = a[7], n.fragment = a[8], isNaN(n.port) && (n.port = a[5]), n.host) {
      const c = im(n.host);
      if (c.isIPV4 === !1) {
        const d = am(c.host);
        n.host = d.host.toLowerCase(), o = d.isIPV6;
      } else
        n.host = c.host, o = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const u = Po[(r.scheme || n.scheme || "").toLowerCase()];
    if (!r.unicodeSupport && (!u || !u.unicodeSupport) && n.host && (r.domainHost || u && u.domainHost) && o === !1 && hm(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (c) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + c;
      }
    (!u || u && !u.skipNormalize) && (s && n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), s && n.host !== void 0 && (n.host = unescape(n.host)), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), u && u.parse && u.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const No = {
  SCHEMES: Po,
  normalize: lm,
  resolve: um,
  resolveComponents: Vl,
  equal: dm,
  serialize: nt,
  parse: ht
};
os.exports = No;
os.exports.default = No;
os.exports.fastUri = No;
var Fl = os.exports;
Object.defineProperty(So, "__esModule", { value: !0 });
const Ul = Fl;
Ul.code = 'require("ajv/dist/runtime/uri").default';
So.default = Ul;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Je;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = Y;
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
  const n = on, s = Sr, o = tr, a = je, u = Y, c = Ee, d = ye, l = A, h = Dh, w = So, g = (N, p) => new RegExp(N, p);
  g.code = "new RegExp";
  const E = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
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
  }, v = 200;
  function P(N) {
    var p, b, y, i, f, S, O, j, q, U, ne, Me, Tt, jt, kt, At, Ct, Dt, Mt, Lt, Vt, Ft, Ut, zt, qt;
    const qe = N.strict, Gt = (p = N.code) === null || p === void 0 ? void 0 : p.optimize, kr = Gt === !0 || Gt === void 0 ? 1 : Gt || 0, Ar = (y = (b = N.code) === null || b === void 0 ? void 0 : b.regExp) !== null && y !== void 0 ? y : g, vs = (i = N.uriResolver) !== null && i !== void 0 ? i : w.default;
    return {
      strictSchema: (S = (f = N.strictSchema) !== null && f !== void 0 ? f : qe) !== null && S !== void 0 ? S : !0,
      strictNumbers: (j = (O = N.strictNumbers) !== null && O !== void 0 ? O : qe) !== null && j !== void 0 ? j : !0,
      strictTypes: (U = (q = N.strictTypes) !== null && q !== void 0 ? q : qe) !== null && U !== void 0 ? U : "log",
      strictTuples: (Me = (ne = N.strictTuples) !== null && ne !== void 0 ? ne : qe) !== null && Me !== void 0 ? Me : "log",
      strictRequired: (jt = (Tt = N.strictRequired) !== null && Tt !== void 0 ? Tt : qe) !== null && jt !== void 0 ? jt : !1,
      code: N.code ? { ...N.code, optimize: kr, regExp: Ar } : { optimize: kr, regExp: Ar },
      loopRequired: (kt = N.loopRequired) !== null && kt !== void 0 ? kt : v,
      loopEnum: (At = N.loopEnum) !== null && At !== void 0 ? At : v,
      meta: (Ct = N.meta) !== null && Ct !== void 0 ? Ct : !0,
      messages: (Dt = N.messages) !== null && Dt !== void 0 ? Dt : !0,
      inlineRefs: (Mt = N.inlineRefs) !== null && Mt !== void 0 ? Mt : !0,
      schemaId: (Lt = N.schemaId) !== null && Lt !== void 0 ? Lt : "$id",
      addUsedSchema: (Vt = N.addUsedSchema) !== null && Vt !== void 0 ? Vt : !0,
      validateSchema: (Ft = N.validateSchema) !== null && Ft !== void 0 ? Ft : !0,
      validateFormats: (Ut = N.validateFormats) !== null && Ut !== void 0 ? Ut : !0,
      unicodeRegExp: (zt = N.unicodeRegExp) !== null && zt !== void 0 ? zt : !0,
      int32range: (qt = N.int32range) !== null && qt !== void 0 ? qt : !0,
      uriResolver: vs
    };
  }
  class I {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...P(p) };
      const { es5: b, lines: y } = this.opts.code;
      this.scope = new u.ValueScope({ scope: {}, prefixes: _, es5: b, lines: y }), this.logger = z(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, o.getRules)(), R.call(this, $, p, "NOT SUPPORTED"), R.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = de.call(this), p.formats && se.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && ae.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), W.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: b, schemaId: y } = this.opts;
      let i = h;
      y === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), b && p && this.addMetaSchema(i, i[y], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: b } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[b] || p : void 0;
    }
    validate(p, b) {
      let y;
      if (typeof p == "string") {
        if (y = this.getSchema(p), !y)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        y = this.compile(p);
      const i = y(b);
      return "$async" in y || (this.errors = y.errors), i;
    }
    compile(p, b) {
      const y = this._addSchema(p, b);
      return y.validate || this._compileSchemaEnv(y);
    }
    compileAsync(p, b) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: y } = this.opts;
      return i.call(this, p, b);
      async function i(U, ne) {
        await f.call(this, U.$schema);
        const Me = this._addSchema(U, ne);
        return Me.validate || S.call(this, Me);
      }
      async function f(U) {
        U && !this.getSchema(U) && await i.call(this, { $ref: U }, !0);
      }
      async function S(U) {
        try {
          return this._compileSchemaEnv(U);
        } catch (ne) {
          if (!(ne instanceof s.default))
            throw ne;
          return O.call(this, ne), await j.call(this, ne.missingSchema), S.call(this, U);
        }
      }
      function O({ missingSchema: U, missingRef: ne }) {
        if (this.refs[U])
          throw new Error(`AnySchema ${U} is loaded but ${ne} cannot be resolved`);
      }
      async function j(U) {
        const ne = await q.call(this, U);
        this.refs[U] || await f.call(this, ne.$schema), this.refs[U] || this.addSchema(ne, U, b);
      }
      async function q(U) {
        const ne = this._loading[U];
        if (ne)
          return ne;
        try {
          return await (this._loading[U] = y(U));
        } finally {
          delete this._loading[U];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, b, y, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const S of p)
          this.addSchema(S, void 0, y, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: S } = this.opts;
        if (f = p[S], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return b = (0, c.normalizeId)(b || f), this._checkUnique(b), this.schemas[b] = this._addSchema(p, y, b, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, b, y = this.opts.validateSchema) {
      return this.addSchema(p, b, !0, y), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, b) {
      if (typeof p == "boolean")
        return !0;
      let y;
      if (y = p.$schema, y !== void 0 && typeof y != "string")
        throw new Error("$schema must be a string");
      if (y = y || this.opts.defaultMeta || this.defaultMeta(), !y)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate(y, p);
      if (!i && b) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return i;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(p) {
      let b;
      for (; typeof (b = L.call(this, p)) == "string"; )
        p = b;
      if (b === void 0) {
        const { schemaId: y } = this.opts, i = new a.SchemaEnv({ schema: {}, schemaId: y });
        if (b = a.resolveSchema.call(this, i, p), !b)
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
          const b = L.call(this, p);
          return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const b = p;
          this._cache.delete(b);
          let y = p[this.opts.schemaId];
          return y && (y = (0, c.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
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
      let y;
      if (typeof p == "string")
        y = p, typeof b == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), b.keyword = y);
      else if (typeof p == "object" && b === void 0) {
        if (b = p, y = b.keyword, Array.isArray(y) && !y.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (T.call(this, y, b), !b)
        return (0, l.eachItem)(y, (f) => k.call(this, f)), this;
      C.call(this, b);
      const i = {
        ...b,
        type: (0, d.getJSONTypes)(b.type),
        schemaType: (0, d.getJSONTypes)(b.schemaType)
      };
      return (0, l.eachItem)(y, i.type.length === 0 ? (f) => k.call(this, f, i) : (f) => i.type.forEach((S) => k.call(this, f, i, S))), this;
    }
    getKeyword(p) {
      const b = this.RULES.all[p];
      return typeof b == "object" ? b.definition : !!b;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: b } = this;
      delete b.keywords[p], delete b.all[p];
      for (const y of b.rules) {
        const i = y.rules.findIndex((f) => f.keyword === p);
        i >= 0 && y.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, b) {
      return typeof b == "string" && (b = new RegExp(b)), this.formats[p] = b, this;
    }
    errorsText(p = this.errors, { separator: b = ", ", dataVar: y = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${y}${i.instancePath} ${i.message}`).reduce((i, f) => i + b + f);
    }
    $dataMetaSchema(p, b) {
      const y = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of b) {
        const f = i.split("/").slice(1);
        let S = p;
        for (const O of f)
          S = S[O];
        for (const O in y) {
          const j = y[O];
          if (typeof j != "object")
            continue;
          const { $data: q } = j.definition, U = S[O];
          q && U && (S[O] = D(U));
        }
      }
      return p;
    }
    _removeAllSchemas(p, b) {
      for (const y in p) {
        const i = p[y];
        (!b || b.test(y)) && (typeof i == "string" ? delete p[y] : i && !i.meta && (this._cache.delete(i.schema), delete p[y]));
      }
    }
    _addSchema(p, b, y, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let S;
      const { schemaId: O } = this.opts;
      if (typeof p == "object")
        S = p[O];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let j = this._cache.get(p);
      if (j !== void 0)
        return j;
      y = (0, c.normalizeId)(S || y);
      const q = c.getSchemaRefs.call(this, p, y);
      return j = new a.SchemaEnv({ schema: p, schemaId: O, meta: b, baseId: y, localRefs: q }), this._cache.set(j.schema, j), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = j), i && this.validateSchema(p, !0), j;
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
  function R(N, p, b, y = "error") {
    for (const i in N) {
      const f = i;
      f in p && this.logger[y](`${b}: option ${i}. ${N[f]}`);
    }
  }
  function L(N) {
    return N = (0, c.normalizeId)(N), this.schemas[N] || this.refs[N];
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
  function se() {
    for (const N in this.opts.formats) {
      const p = this.opts.formats[N];
      p && this.addFormat(N, p);
    }
  }
  function ae(N) {
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
  function de() {
    const N = { ...this.opts };
    for (const p of E)
      delete N[p];
    return N;
  }
  const F = { log() {
  }, warn() {
  }, error() {
  } };
  function z(N) {
    if (N === !1)
      return F;
    if (N === void 0)
      return console;
    if (N.log && N.warn && N.error)
      return N;
    throw new Error("logger must implement log, warn and error methods");
  }
  const oe = /^[a-z_$][a-z0-9_$:-]*$/i;
  function T(N, p) {
    const { RULES: b } = this;
    if ((0, l.eachItem)(N, (y) => {
      if (b.keywords[y])
        throw new Error(`Keyword ${y} is already defined`);
      if (!oe.test(y))
        throw new Error(`Keyword ${y} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(N, p, b) {
    var y;
    const i = p == null ? void 0 : p.post;
    if (b && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let S = i ? f.post : f.rules.find(({ type: j }) => j === b);
    if (S || (S = { type: b, rules: [] }, f.rules.push(S)), f.keywords[N] = !0, !p)
      return;
    const O = {
      keyword: N,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? V.call(this, S, O, p.before) : S.rules.push(O), f.all[N] = O, (y = p.implements) === null || y === void 0 || y.forEach((j) => this.addKeyword(j));
  }
  function V(N, p, b) {
    const y = N.rules.findIndex((i) => i.keyword === b);
    y >= 0 ? N.rules.splice(y, 0, p) : (N.rules.push(p), this.logger.warn(`rule ${b} is not defined`));
  }
  function C(N) {
    let { metaSchema: p } = N;
    p !== void 0 && (N.$data && this.opts.$data && (p = D(p)), N.validateSchema = this.compile(p, !0));
  }
  const G = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function D(N) {
    return { anyOf: [N, G] };
  }
})(Qc);
var Io = {}, Ro = {}, Oo = {};
Object.defineProperty(Oo, "__esModule", { value: !0 });
const pm = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Oo.default = pm;
var mt = {};
Object.defineProperty(mt, "__esModule", { value: !0 });
mt.callRef = mt.getValidate = void 0;
const $m = Sr, ki = te, Ae = Y, or = Fe, Ai = je, hn = A, ym = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: o, validateName: a, opts: u, self: c } = n, { root: d } = o;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const l = Ai.resolveRef.call(c, d, s, r);
    if (l === void 0)
      throw new $m.default(n.opts.uriResolver, s, r);
    if (l instanceof Ai.SchemaEnv)
      return w(l);
    return g(l);
    function h() {
      if (o === d)
        return kn(e, a, o, o.$async);
      const E = t.scopeValue("root", { ref: d });
      return kn(e, (0, Ae._)`${E}.validate`, d, d.$async);
    }
    function w(E) {
      const _ = zl(e, E);
      kn(e, _, E, E.$async);
    }
    function g(E) {
      const _ = t.scopeValue("schema", u.code.source === !0 ? { ref: E, code: (0, Ae.stringify)(E) } : { ref: E }), $ = t.name("valid"), m = e.subschema({
        schema: E,
        dataTypes: [],
        schemaPath: Ae.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, $);
      e.mergeEvaluated(m), e.ok($);
    }
  }
};
function zl(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ae._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
mt.getValidate = zl;
function kn(e, t, r, n) {
  const { gen: s, it: o } = e, { allErrors: a, schemaEnv: u, opts: c } = o, d = c.passContext ? or.default.this : Ae.nil;
  n ? l() : h();
  function l() {
    if (!u.$async)
      throw new Error("async schema referenced by sync schema");
    const E = s.let("valid");
    s.try(() => {
      s.code((0, Ae._)`await ${(0, ki.callValidateCode)(e, t, d)}`), g(t), a || s.assign(E, !0);
    }, (_) => {
      s.if((0, Ae._)`!(${_} instanceof ${o.ValidationError})`, () => s.throw(_)), w(_), a || s.assign(E, !1);
    }), e.ok(E);
  }
  function h() {
    e.result((0, ki.callValidateCode)(e, t, d), () => g(t), () => w(t));
  }
  function w(E) {
    const _ = (0, Ae._)`${E}.errors`;
    s.assign(or.default.vErrors, (0, Ae._)`${or.default.vErrors} === null ? ${_} : ${or.default.vErrors}.concat(${_})`), s.assign(or.default.errors, (0, Ae._)`${or.default.vErrors}.length`);
  }
  function g(E) {
    var _;
    if (!o.opts.unevaluated)
      return;
    const $ = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (o.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (o.props = hn.mergeEvaluated.props(s, $.props, o.props));
      else {
        const m = s.var("props", (0, Ae._)`${E}.evaluated.props`);
        o.props = hn.mergeEvaluated.props(s, m, o.props, Ae.Name);
      }
    if (o.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (o.items = hn.mergeEvaluated.items(s, $.items, o.items));
      else {
        const m = s.var("items", (0, Ae._)`${E}.evaluated.items`);
        o.items = hn.mergeEvaluated.items(s, m, o.items, Ae.Name);
      }
  }
}
mt.callRef = kn;
mt.default = ym;
Object.defineProperty(Ro, "__esModule", { value: !0 });
const gm = Oo, _m = mt, vm = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  gm.default,
  _m.default
];
Ro.default = vm;
var To = {}, jo = {};
Object.defineProperty(jo, "__esModule", { value: !0 });
const Gn = Y, _t = Gn.operators, Kn = {
  maximum: { okStr: "<=", ok: _t.LTE, fail: _t.GT },
  minimum: { okStr: ">=", ok: _t.GTE, fail: _t.LT },
  exclusiveMaximum: { okStr: "<", ok: _t.LT, fail: _t.GTE },
  exclusiveMinimum: { okStr: ">", ok: _t.GT, fail: _t.LTE }
}, wm = {
  message: ({ keyword: e, schemaCode: t }) => (0, Gn.str)`must be ${Kn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Gn._)`{comparison: ${Kn[e].okStr}, limit: ${t}}`
}, Em = {
  keyword: Object.keys(Kn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: wm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Gn._)`${r} ${Kn[t].fail} ${n} || isNaN(${r})`);
  }
};
jo.default = Em;
var ko = {};
Object.defineProperty(ko, "__esModule", { value: !0 });
const Wr = Y, Sm = {
  message: ({ schemaCode: e }) => (0, Wr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Wr._)`{multipleOf: ${e}}`
}, bm = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Sm,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, o = s.opts.multipleOfPrecision, a = t.let("res"), u = o ? (0, Wr._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, Wr._)`${a} !== parseInt(${a})`;
    e.fail$data((0, Wr._)`(${n} === 0 || (${a} = ${r}/${n}, ${u}))`);
  }
};
ko.default = bm;
var Ao = {}, Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
function ql(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Co.default = ql;
ql.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Ao, "__esModule", { value: !0 });
const Wt = Y, Pm = A, Nm = Co, Im = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Wt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Wt._)`{limit: ${e}}`
}, Rm = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Im,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, o = t === "maxLength" ? Wt.operators.GT : Wt.operators.LT, a = s.opts.unicode === !1 ? (0, Wt._)`${r}.length` : (0, Wt._)`${(0, Pm.useFunc)(e.gen, Nm.default)}(${r})`;
    e.fail$data((0, Wt._)`${a} ${o} ${n}`);
  }
};
Ao.default = Rm;
var Do = {};
Object.defineProperty(Do, "__esModule", { value: !0 });
const Om = te, Hn = Y, Tm = {
  message: ({ schemaCode: e }) => (0, Hn.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Hn._)`{pattern: ${e}}`
}, jm = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Tm,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: o } = e, a = o.opts.unicodeRegExp ? "u" : "", u = r ? (0, Hn._)`(new RegExp(${s}, ${a}))` : (0, Om.usePattern)(e, n);
    e.fail$data((0, Hn._)`!${u}.test(${t})`);
  }
};
Do.default = jm;
var Mo = {};
Object.defineProperty(Mo, "__esModule", { value: !0 });
const Xr = Y, km = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Xr.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Xr._)`{limit: ${e}}`
}, Am = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: km,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Xr.operators.GT : Xr.operators.LT;
    e.fail$data((0, Xr._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Mo.default = Am;
var Lo = {};
Object.defineProperty(Lo, "__esModule", { value: !0 });
const Fr = te, Jr = Y, Cm = A, Dm = {
  message: ({ params: { missingProperty: e } }) => (0, Jr.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Jr._)`{missingProperty: ${e}}`
}, Mm = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Dm,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: o, it: a } = e, { opts: u } = a;
    if (!o && r.length === 0)
      return;
    const c = r.length >= u.loopRequired;
    if (a.allErrors ? d() : l(), u.strictRequired) {
      const g = e.parentSchema.properties, { definedProperties: E } = e.it;
      for (const _ of r)
        if ((g == null ? void 0 : g[_]) === void 0 && !E.has(_)) {
          const $ = a.schemaEnv.baseId + a.errSchemaPath, m = `required property "${_}" is not defined at "${$}" (strictRequired)`;
          (0, Cm.checkStrictMode)(a, m, a.opts.strictRequired);
        }
    }
    function d() {
      if (c || o)
        e.block$data(Jr.nil, h);
      else
        for (const g of r)
          (0, Fr.checkReportMissingProp)(e, g);
    }
    function l() {
      const g = t.let("missing");
      if (c || o) {
        const E = t.let("valid", !0);
        e.block$data(E, () => w(g, E)), e.ok(E);
      } else
        t.if((0, Fr.checkMissingProp)(e, r, g)), (0, Fr.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, Fr.noPropertyInData)(t, s, g, u.ownProperties), () => e.error());
      });
    }
    function w(g, E) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(E, (0, Fr.propertyInData)(t, s, g, u.ownProperties)), t.if((0, Jr.not)(E), () => {
          e.error(), t.break();
        });
      }, Jr.nil);
    }
  }
};
Lo.default = Mm;
var Vo = {};
Object.defineProperty(Vo, "__esModule", { value: !0 });
const Yr = Y, Lm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Yr.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Yr._)`{limit: ${e}}`
}, Vm = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Lm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? Yr.operators.GT : Yr.operators.LT;
    e.fail$data((0, Yr._)`${r}.length ${s} ${n}`);
  }
};
Vo.default = Vm;
var Fo = {}, an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
const Gl = rs;
Gl.code = 'require("ajv/dist/runtime/equal").default';
an.default = Gl;
Object.defineProperty(Fo, "__esModule", { value: !0 });
const Ns = ye, ve = Y, Fm = A, Um = an, zm = {
  message: ({ params: { i: e, j: t } }) => (0, ve.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, ve._)`{i: ${e}, j: ${t}}`
}, qm = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: zm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: o, schemaCode: a, it: u } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = o.items ? (0, Ns.getSchemaTypes)(o.items) : [];
    e.block$data(c, l, (0, ve._)`${a} === false`), e.ok(c);
    function l() {
      const E = t.let("i", (0, ve._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: E, j: _ }), t.assign(c, !0), t.if((0, ve._)`${E} > 1`, () => (h() ? w : g)(E, _));
    }
    function h() {
      return d.length > 0 && !d.some((E) => E === "object" || E === "array");
    }
    function w(E, _) {
      const $ = t.name("item"), m = (0, Ns.checkDataTypes)(d, $, u.opts.strictNumbers, Ns.DataType.Wrong), v = t.const("indices", (0, ve._)`{}`);
      t.for((0, ve._)`;${E}--;`, () => {
        t.let($, (0, ve._)`${r}[${E}]`), t.if(m, (0, ve._)`continue`), d.length > 1 && t.if((0, ve._)`typeof ${$} == "string"`, (0, ve._)`${$} += "_"`), t.if((0, ve._)`typeof ${v}[${$}] == "number"`, () => {
          t.assign(_, (0, ve._)`${v}[${$}]`), e.error(), t.assign(c, !1).break();
        }).code((0, ve._)`${v}[${$}] = ${E}`);
      });
    }
    function g(E, _) {
      const $ = (0, Fm.useFunc)(t, Um.default), m = t.name("outer");
      t.label(m).for((0, ve._)`;${E}--;`, () => t.for((0, ve._)`${_} = ${E}; ${_}--;`, () => t.if((0, ve._)`${$}(${r}[${E}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Fo.default = qm;
var Uo = {};
Object.defineProperty(Uo, "__esModule", { value: !0 });
const Ws = Y, Gm = A, Km = an, Hm = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Ws._)`{allowedValue: ${e}}`
}, Bm = {
  keyword: "const",
  $data: !0,
  error: Hm,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: o } = e;
    n || o && typeof o == "object" ? e.fail$data((0, Ws._)`!${(0, Gm.useFunc)(t, Km.default)}(${r}, ${s})`) : e.fail((0, Ws._)`${o} !== ${r}`);
  }
};
Uo.default = Bm;
var zo = {};
Object.defineProperty(zo, "__esModule", { value: !0 });
const Kr = Y, Wm = A, Xm = an, Jm = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Kr._)`{allowedValues: ${e}}`
}, Ym = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Jm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const u = s.length >= a.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, Wm.useFunc)(t, Xm.default));
    let l;
    if (u || n)
      l = t.let("valid"), e.block$data(l, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", o);
      l = (0, Kr.or)(...s.map((E, _) => w(g, _)));
    }
    e.pass(l);
    function h() {
      t.assign(l, !1), t.forOf("v", o, (g) => t.if((0, Kr._)`${d()}(${r}, ${g})`, () => t.assign(l, !0).break()));
    }
    function w(g, E) {
      const _ = s[E];
      return typeof _ == "object" && _ !== null ? (0, Kr._)`${d()}(${r}, ${g}[${E}])` : (0, Kr._)`${r} === ${_}`;
    }
  }
};
zo.default = Ym;
Object.defineProperty(To, "__esModule", { value: !0 });
const xm = jo, Zm = ko, Qm = Ao, ep = Do, tp = Mo, rp = Lo, np = Vo, sp = Fo, op = Uo, ap = zo, ip = [
  // number
  xm.default,
  Zm.default,
  // string
  Qm.default,
  ep.default,
  // object
  tp.default,
  rp.default,
  // array
  np.default,
  sp.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  op.default,
  ap.default
];
To.default = ip;
var qo = {}, br = {};
Object.defineProperty(br, "__esModule", { value: !0 });
br.validateAdditionalItems = void 0;
const Xt = Y, Xs = A, cp = {
  message: ({ params: { len: e } }) => (0, Xt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Xt._)`{limit: ${e}}`
}, lp = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: cp,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Xs.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Kl(e, n);
  }
};
function Kl(e, t) {
  const { gen: r, schema: n, data: s, keyword: o, it: a } = e;
  a.items = !0;
  const u = r.const("len", (0, Xt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Xt._)`${u} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Xs.alwaysValidSchema)(a, n)) {
    const d = r.var("valid", (0, Xt._)`${u} <= ${t.length}`);
    r.if((0, Xt.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, u, (l) => {
      e.subschema({ keyword: o, dataProp: l, dataPropType: Xs.Type.Num }, d), a.allErrors || r.if((0, Xt.not)(d), () => r.break());
    });
  }
}
br.validateAdditionalItems = Kl;
br.default = lp;
var Go = {}, Pr = {};
Object.defineProperty(Pr, "__esModule", { value: !0 });
Pr.validateTuple = void 0;
const Ci = Y, An = A, up = te, dp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Hl(e, "additionalItems", t);
    r.items = !0, !(0, An.alwaysValidSchema)(r, t) && e.ok((0, up.validateArray)(e));
  }
};
function Hl(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: o, keyword: a, it: u } = e;
  l(s), u.opts.unevaluated && r.length && u.items !== !0 && (u.items = An.mergeEvaluated.items(n, r.length, u.items));
  const c = n.name("valid"), d = n.const("len", (0, Ci._)`${o}.length`);
  r.forEach((h, w) => {
    (0, An.alwaysValidSchema)(u, h) || (n.if((0, Ci._)`${d} > ${w}`, () => e.subschema({
      keyword: a,
      schemaProp: w,
      dataProp: w
    }, c)), e.ok(c));
  });
  function l(h) {
    const { opts: w, errSchemaPath: g } = u, E = r.length, _ = E === h.minItems && (E === h.maxItems || h[t] === !1);
    if (w.strictTuples && !_) {
      const $ = `"${a}" is ${E}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, An.checkStrictMode)(u, $, w.strictTuples);
    }
  }
}
Pr.validateTuple = Hl;
Pr.default = dp;
Object.defineProperty(Go, "__esModule", { value: !0 });
const fp = Pr, hp = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, fp.validateTuple)(e, "items")
};
Go.default = hp;
var Ko = {};
Object.defineProperty(Ko, "__esModule", { value: !0 });
const Di = Y, mp = A, pp = te, $p = br, yp = {
  message: ({ params: { len: e } }) => (0, Di.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Di._)`{limit: ${e}}`
}, gp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: yp,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, mp.alwaysValidSchema)(n, t) && (s ? (0, $p.validateAdditionalItems)(e, s) : e.ok((0, pp.validateArray)(e)));
  }
};
Ko.default = gp;
var Ho = {};
Object.defineProperty(Ho, "__esModule", { value: !0 });
const Ue = Y, mn = A, _p = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ue.str)`must contain at least ${e} valid item(s)` : (0, Ue.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ue._)`{minContains: ${e}}` : (0, Ue._)`{minContains: ${e}, maxContains: ${t}}`
}, vp = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: _p,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    let a, u;
    const { minContains: c, maxContains: d } = n;
    o.opts.next ? (a = c === void 0 ? 1 : c, u = d) : a = 1;
    const l = t.const("len", (0, Ue._)`${s}.length`);
    if (e.setParams({ min: a, max: u }), u === void 0 && a === 0) {
      (0, mn.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (u !== void 0 && a > u) {
      (0, mn.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, mn.alwaysValidSchema)(o, r)) {
      let _ = (0, Ue._)`${l} >= ${a}`;
      u !== void 0 && (_ = (0, Ue._)`${_} && ${l} <= ${u}`), e.pass(_);
      return;
    }
    o.items = !0;
    const h = t.name("valid");
    u === void 0 && a === 1 ? g(h, () => t.if(h, () => t.break())) : a === 0 ? (t.let(h, !0), u !== void 0 && t.if((0, Ue._)`${s}.length > 0`, w)) : (t.let(h, !1), w()), e.result(h, () => e.reset());
    function w() {
      const _ = t.name("_valid"), $ = t.let("count", 0);
      g(_, () => t.if(_, () => E($)));
    }
    function g(_, $) {
      t.forRange("i", 0, l, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: mn.Type.Num,
          compositeRule: !0
        }, _), $();
      });
    }
    function E(_) {
      t.code((0, Ue._)`${_}++`), u === void 0 ? t.if((0, Ue._)`${_} >= ${a}`, () => t.assign(h, !0).break()) : (t.if((0, Ue._)`${_} > ${u}`, () => t.assign(h, !1).break()), a === 1 ? t.assign(h, !0) : t.if((0, Ue._)`${_} >= ${a}`, () => t.assign(h, !0)));
    }
  }
};
Ho.default = vp;
var as = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = Y, r = A, n = te;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: l } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: l, missingProperty: h } }) => (0, t._)`{property: ${c},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${l}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [d, l] = o(c);
      a(c, d), u(c, l);
    }
  };
  function o({ schema: c }) {
    const d = {}, l = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const w = Array.isArray(c[h]) ? d : l;
      w[h] = c[h];
    }
    return [d, l];
  }
  function a(c, d = c.schema) {
    const { gen: l, data: h, it: w } = c;
    if (Object.keys(d).length === 0)
      return;
    const g = l.let("missing");
    for (const E in d) {
      const _ = d[E];
      if (_.length === 0)
        continue;
      const $ = (0, n.propertyInData)(l, h, E, w.opts.ownProperties);
      c.setParams({
        property: E,
        depsCount: _.length,
        deps: _.join(", ")
      }), w.allErrors ? l.if($, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (l.if((0, t._)`${$} && (${(0, n.checkMissingProp)(c, _, g)})`), (0, n.reportMissingProp)(c, g), l.else());
    }
  }
  e.validatePropertyDeps = a;
  function u(c, d = c.schema) {
    const { gen: l, data: h, keyword: w, it: g } = c, E = l.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)(g, d[_]) || (l.if(
        (0, n.propertyInData)(l, h, _, g.opts.ownProperties),
        () => {
          const $ = c.subschema({ keyword: w, schemaProp: _ }, E);
          c.mergeValidEvaluated($, E);
        },
        () => l.var(E, !0)
        // TODO var
      ), c.ok(E));
  }
  e.validateSchemaDeps = u, e.default = s;
})(as);
var Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
const Bl = Y, wp = A, Ep = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Bl._)`{propertyName: ${e.propertyName}}`
}, Sp = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Ep,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, wp.alwaysValidSchema)(s, r))
      return;
    const o = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, o), t.if((0, Bl.not)(o), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
Bo.default = Sp;
var is = {};
Object.defineProperty(is, "__esModule", { value: !0 });
const pn = te, He = Y, bp = Fe, $n = A, Pp = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, He._)`{additionalProperty: ${e.additionalProperty}}`
}, Np = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Pp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: o, it: a } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: u, opts: c } = a;
    if (a.props = !0, c.removeAdditional !== "all" && (0, $n.alwaysValidSchema)(a, r))
      return;
    const d = (0, pn.allSchemaProperties)(n.properties), l = (0, pn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, He._)`${o} === ${bp.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !l.length ? E($) : t.if(w($), () => E($));
      });
    }
    function w($) {
      let m;
      if (d.length > 8) {
        const v = (0, $n.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, pn.isOwnProperty)(t, v, $);
      } else d.length ? m = (0, He.or)(...d.map((v) => (0, He._)`${$} === ${v}`)) : m = He.nil;
      return l.length && (m = (0, He.or)(m, ...l.map((v) => (0, He._)`${(0, pn.usePattern)(e, v)}.test(${$})`))), (0, He.not)(m);
    }
    function g($) {
      t.code((0, He._)`delete ${s}[${$}]`);
    }
    function E($) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        g($);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: $ }), e.error(), u || t.break();
        return;
      }
      if (typeof r == "object" && !(0, $n.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_($, m, !1), t.if((0, He.not)(m), () => {
          e.reset(), g($);
        })) : (_($, m), u || t.if((0, He.not)(m), () => t.break()));
      }
    }
    function _($, m, v) {
      const P = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: $n.Type.Str
      };
      v === !1 && Object.assign(P, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(P, m);
    }
  }
};
is.default = Np;
var Wo = {};
Object.defineProperty(Wo, "__esModule", { value: !0 });
const Ip = Je, Mi = te, Is = A, Li = is, Rp = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Li.default.code(new Ip.KeywordCxt(o, Li.default, "additionalProperties"));
    const a = (0, Mi.allSchemaProperties)(r);
    for (const h of a)
      o.definedProperties.add(h);
    o.opts.unevaluated && a.length && o.props !== !0 && (o.props = Is.mergeEvaluated.props(t, (0, Is.toHash)(a), o.props));
    const u = a.filter((h) => !(0, Is.alwaysValidSchema)(o, r[h]));
    if (u.length === 0)
      return;
    const c = t.name("valid");
    for (const h of u)
      d(h) ? l(h) : (t.if((0, Mi.propertyInData)(t, s, h, o.opts.ownProperties)), l(h), o.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return o.opts.useDefaults && !o.compositeRule && r[h].default !== void 0;
    }
    function l(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
Wo.default = Rp;
var Xo = {};
Object.defineProperty(Xo, "__esModule", { value: !0 });
const Vi = te, yn = Y, Fi = A, Ui = A, Op = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: o } = e, { opts: a } = o, u = (0, Vi.allSchemaProperties)(r), c = u.filter((_) => (0, Fi.alwaysValidSchema)(o, r[_]));
    if (u.length === 0 || c.length === u.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const d = a.strictSchema && !a.allowMatchingProperties && s.properties, l = t.name("valid");
    o.props !== !0 && !(o.props instanceof yn.Name) && (o.props = (0, Ui.evaluatedPropsToName)(t, o.props));
    const { props: h } = o;
    w();
    function w() {
      for (const _ of u)
        d && g(_), o.allErrors ? E(_) : (t.var(l, !0), E(_), t.if(l));
    }
    function g(_) {
      for (const $ in d)
        new RegExp(_).test($) && (0, Fi.checkStrictMode)(o, `property ${$} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function E(_) {
      t.forIn("key", n, ($) => {
        t.if((0, yn._)`${(0, Vi.usePattern)(e, _)}.test(${$})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: $,
            dataPropType: Ui.Type.Str
          }, l), o.opts.unevaluated && h !== !0 ? t.assign((0, yn._)`${h}[${$}]`, !0) : !m && !o.allErrors && t.if((0, yn.not)(l), () => t.break());
        });
      });
    }
  }
};
Xo.default = Op;
var Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
const Tp = A, jp = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Tp.alwaysValidSchema)(n, r)) {
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
Jo.default = jp;
var Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
const kp = te, Ap = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: kp.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Yo.default = Ap;
var xo = {};
Object.defineProperty(xo, "__esModule", { value: !0 });
const Cn = Y, Cp = A, Dp = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Cn._)`{passingSchemas: ${e.passing}}`
}, Mp = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Dp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const o = r, a = t.let("valid", !1), u = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: u }), t.block(d), e.result(a, () => e.reset(), () => e.error(!0));
    function d() {
      o.forEach((l, h) => {
        let w;
        (0, Cp.alwaysValidSchema)(s, l) ? t.var(c, !0) : w = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, Cn._)`${c} && ${a}`).assign(a, !1).assign(u, (0, Cn._)`[${u}, ${h}]`).else(), t.if(c, () => {
          t.assign(a, !0), t.assign(u, h), w && e.mergeEvaluated(w, Cn.Name);
        });
      });
    }
  }
};
xo.default = Mp;
var Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
const Lp = A, Vp = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((o, a) => {
      if ((0, Lp.alwaysValidSchema)(n, o))
        return;
      const u = e.subschema({ keyword: "allOf", schemaProp: a }, s);
      e.ok(s), e.mergeEvaluated(u);
    });
  }
};
Zo.default = Vp;
var Qo = {};
Object.defineProperty(Qo, "__esModule", { value: !0 });
const Bn = Y, Wl = A, Fp = {
  message: ({ params: e }) => (0, Bn.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Bn._)`{failingKeyword: ${e.ifClause}}`
}, Up = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Fp,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Wl.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = zi(n, "then"), o = zi(n, "else");
    if (!s && !o)
      return;
    const a = t.let("valid", !0), u = t.name("_valid");
    if (c(), e.reset(), s && o) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(u, d("then", l), d("else", l));
    } else s ? t.if(u, d("then")) : t.if((0, Bn.not)(u), d("else"));
    e.pass(a, () => e.error(!0));
    function c() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, u);
      e.mergeEvaluated(l);
    }
    function d(l, h) {
      return () => {
        const w = e.subschema({ keyword: l }, u);
        t.assign(a, u), e.mergeValidEvaluated(w, a), h ? t.assign(h, (0, Bn._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function zi(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Wl.alwaysValidSchema)(e, r);
}
Qo.default = Up;
var ea = {};
Object.defineProperty(ea, "__esModule", { value: !0 });
const zp = A, qp = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, zp.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
ea.default = qp;
Object.defineProperty(qo, "__esModule", { value: !0 });
const Gp = br, Kp = Go, Hp = Pr, Bp = Ko, Wp = Ho, Xp = as, Jp = Bo, Yp = is, xp = Wo, Zp = Xo, Qp = Jo, e$ = Yo, t$ = xo, r$ = Zo, n$ = Qo, s$ = ea;
function o$(e = !1) {
  const t = [
    // any
    Qp.default,
    e$.default,
    t$.default,
    r$.default,
    n$.default,
    s$.default,
    // object
    Jp.default,
    Yp.default,
    Xp.default,
    xp.default,
    Zp.default
  ];
  return e ? t.push(Kp.default, Bp.default) : t.push(Gp.default, Hp.default), t.push(Wp.default), t;
}
qo.default = o$;
var ta = {}, Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.dynamicAnchor = void 0;
const Rs = Y, a$ = Fe, qi = je, i$ = mt, c$ = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => Xl(e, e.schema)
};
function Xl(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, Rs._)`${a$.default.dynamicAnchors}${(0, Rs.getProperty)(t)}`, o = n.errSchemaPath === "#" ? n.validateName : l$(e);
  r.if((0, Rs._)`!${s}`, () => r.assign(s, o));
}
Nr.dynamicAnchor = Xl;
function l$(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: o, localRefs: a, meta: u } = t.root, { schemaId: c } = n.opts, d = new qi.SchemaEnv({ schema: r, schemaId: c, root: s, baseId: o, localRefs: a, meta: u });
  return qi.compileSchema.call(n, d), (0, i$.getValidate)(e, d);
}
Nr.default = c$;
var Ir = {};
Object.defineProperty(Ir, "__esModule", { value: !0 });
Ir.dynamicRef = void 0;
const Gi = Y, u$ = Fe, Ki = mt, d$ = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => Jl(e, e.schema)
};
function Jl(e, t) {
  const { gen: r, keyword: n, it: s } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const o = t.slice(1);
  if (s.allErrors)
    a();
  else {
    const c = r.let("valid", !1);
    a(c), e.ok(c);
  }
  function a(c) {
    if (s.schemaEnv.root.dynamicAnchors[o]) {
      const d = r.let("_v", (0, Gi._)`${u$.default.dynamicAnchors}${(0, Gi.getProperty)(o)}`);
      r.if(d, u(d, c), u(s.validateName, c));
    } else
      u(s.validateName, c)();
  }
  function u(c, d) {
    return d ? () => r.block(() => {
      (0, Ki.callRef)(e, c), r.let(d, !0);
    }) : () => (0, Ki.callRef)(e, c);
  }
}
Ir.dynamicRef = Jl;
Ir.default = d$;
var ra = {};
Object.defineProperty(ra, "__esModule", { value: !0 });
const f$ = Nr, h$ = A, m$ = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, f$.dynamicAnchor)(e, "") : (0, h$.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
ra.default = m$;
var na = {};
Object.defineProperty(na, "__esModule", { value: !0 });
const p$ = Ir, $$ = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, p$.dynamicRef)(e, e.schema)
};
na.default = $$;
Object.defineProperty(ta, "__esModule", { value: !0 });
const y$ = Nr, g$ = Ir, _$ = ra, v$ = na, w$ = [y$.default, g$.default, _$.default, v$.default];
ta.default = w$;
var sa = {}, oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
const Hi = as, E$ = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Hi.error,
  code: (e) => (0, Hi.validatePropertyDeps)(e)
};
oa.default = E$;
var aa = {};
Object.defineProperty(aa, "__esModule", { value: !0 });
const S$ = as, b$ = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, S$.validateSchemaDeps)(e)
};
aa.default = b$;
var ia = {};
Object.defineProperty(ia, "__esModule", { value: !0 });
const P$ = A, N$ = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, P$.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
ia.default = N$;
Object.defineProperty(sa, "__esModule", { value: !0 });
const I$ = oa, R$ = aa, O$ = ia, T$ = [I$.default, R$.default, O$.default];
sa.default = T$;
var ca = {}, la = {};
Object.defineProperty(la, "__esModule", { value: !0 });
const Et = Y, Bi = A, j$ = Fe, k$ = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, Et._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, A$ = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: k$,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: o } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: a, props: u } = o;
    u instanceof Et.Name ? t.if((0, Et._)`${u} !== true`, () => t.forIn("key", n, (h) => t.if(d(u, h), () => c(h)))) : u !== !0 && t.forIn("key", n, (h) => u === void 0 ? c(h) : t.if(l(u, h), () => c(h))), o.props = !0, e.ok((0, Et._)`${s} === ${j$.default.errors}`);
    function c(h) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: h }), e.error(), a || t.break();
        return;
      }
      if (!(0, Bi.alwaysValidSchema)(o, r)) {
        const w = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: Bi.Type.Str
        }, w), a || t.if((0, Et.not)(w), () => t.break());
      }
    }
    function d(h, w) {
      return (0, Et._)`!${h} || !${h}[${w}]`;
    }
    function l(h, w) {
      const g = [];
      for (const E in h)
        h[E] === !0 && g.push((0, Et._)`${w} !== ${E}`);
      return (0, Et.and)(...g);
    }
  }
};
la.default = A$;
var ua = {};
Object.defineProperty(ua, "__esModule", { value: !0 });
const Jt = Y, Wi = A, C$ = {
  message: ({ params: { len: e } }) => (0, Jt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Jt._)`{limit: ${e}}`
}, D$ = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: C$,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, o = s.items || 0;
    if (o === !0)
      return;
    const a = t.const("len", (0, Jt._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: o }), e.fail((0, Jt._)`${a} > ${o}`);
    else if (typeof r == "object" && !(0, Wi.alwaysValidSchema)(s, r)) {
      const c = t.var("valid", (0, Jt._)`${a} <= ${o}`);
      t.if((0, Jt.not)(c), () => u(c, o)), e.ok(c);
    }
    s.items = !0;
    function u(c, d) {
      t.forRange("i", d, a, (l) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: Wi.Type.Num }, c), s.allErrors || t.if((0, Jt.not)(c), () => t.break());
      });
    }
  }
};
ua.default = D$;
Object.defineProperty(ca, "__esModule", { value: !0 });
const M$ = la, L$ = ua, V$ = [M$.default, L$.default];
ca.default = V$;
var da = {}, fa = {};
Object.defineProperty(fa, "__esModule", { value: !0 });
const me = Y, F$ = {
  message: ({ schemaCode: e }) => (0, me.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, me._)`{format: ${e}}`
}, U$ = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: F$,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: o, schemaCode: a, it: u } = e, { opts: c, errSchemaPath: d, schemaEnv: l, self: h } = u;
    if (!c.validateFormats)
      return;
    s ? w() : g();
    function w() {
      const E = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, me._)`${E}[${a}]`), $ = r.let("fType"), m = r.let("format");
      r.if((0, me._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign($, (0, me._)`${_}.type || "string"`).assign(m, (0, me._)`${_}.validate`), () => r.assign($, (0, me._)`"string"`).assign(m, _)), e.fail$data((0, me.or)(v(), P()));
      function v() {
        return c.strictSchema === !1 ? me.nil : (0, me._)`${a} && !${m}`;
      }
      function P() {
        const I = l.$async ? (0, me._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, me._)`${m}(${n})`, R = (0, me._)`(typeof ${m} == "function" ? ${I} : ${m}.test(${n}))`;
        return (0, me._)`${m} && ${m} !== true && ${$} === ${t} && !${R}`;
      }
    }
    function g() {
      const E = h.formats[o];
      if (!E) {
        v();
        return;
      }
      if (E === !0)
        return;
      const [_, $, m] = P(E);
      _ === t && e.pass(I());
      function v() {
        if (c.strictSchema === !1) {
          h.logger.warn(R());
          return;
        }
        throw new Error(R());
        function R() {
          return `unknown format "${o}" ignored in schema at path "${d}"`;
        }
      }
      function P(R) {
        const L = R instanceof RegExp ? (0, me.regexpCode)(R) : c.code.formats ? (0, me._)`${c.code.formats}${(0, me.getProperty)(o)}` : void 0, W = r.scopeValue("formats", { key: o, ref: R, code: L });
        return typeof R == "object" && !(R instanceof RegExp) ? [R.type || "string", R.validate, (0, me._)`${W}.validate`] : ["string", R, W];
      }
      function I() {
        if (typeof E == "object" && !(E instanceof RegExp) && E.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, me._)`await ${m}(${n})`;
        }
        return typeof $ == "function" ? (0, me._)`${m}(${n})` : (0, me._)`${m}.test(${n})`;
      }
    }
  }
};
fa.default = U$;
Object.defineProperty(da, "__esModule", { value: !0 });
const z$ = fa, q$ = [z$.default];
da.default = q$;
var _r = {};
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.contentVocabulary = _r.metadataVocabulary = void 0;
_r.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
_r.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Io, "__esModule", { value: !0 });
const G$ = Ro, K$ = To, H$ = qo, B$ = ta, W$ = sa, X$ = ca, J$ = da, Xi = _r, Y$ = [
  B$.default,
  G$.default,
  K$.default,
  (0, H$.default)(!0),
  J$.default,
  Xi.metadataVocabulary,
  Xi.contentVocabulary,
  W$.default,
  X$.default
];
Io.default = Y$;
var ha = {}, cs = {};
Object.defineProperty(cs, "__esModule", { value: !0 });
cs.DiscrError = void 0;
var Ji;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Ji || (cs.DiscrError = Ji = {}));
Object.defineProperty(ha, "__esModule", { value: !0 });
const dr = Y, Js = cs, Yi = je, x$ = Sr, Z$ = A, Q$ = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Js.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, dr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, ey = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Q$,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: o } = e, { oneOf: a } = s;
    if (!o.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const u = n.propertyName;
    if (typeof u != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!a)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, dr._)`${r}${(0, dr.getProperty)(u)}`);
    t.if((0, dr._)`typeof ${d} == "string"`, () => l(), () => e.error(!1, { discrError: Js.DiscrError.Tag, tag: d, tagName: u })), e.ok(c);
    function l() {
      const g = w();
      t.if(!1);
      for (const E in g)
        t.elseIf((0, dr._)`${d} === ${E}`), t.assign(c, h(g[E]));
      t.else(), e.error(!1, { discrError: Js.DiscrError.Mapping, tag: d, tagName: u }), t.endIf();
    }
    function h(g) {
      const E = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: g }, E);
      return e.mergeEvaluated(_, dr.Name), E;
    }
    function w() {
      var g;
      const E = {}, _ = m(s);
      let $ = !0;
      for (let I = 0; I < a.length; I++) {
        let R = a[I];
        if (R != null && R.$ref && !(0, Z$.schemaHasRulesButRef)(R, o.self.RULES)) {
          const W = R.$ref;
          if (R = Yi.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, W), R instanceof Yi.SchemaEnv && (R = R.schema), R === void 0)
            throw new x$.default(o.opts.uriResolver, o.baseId, W);
        }
        const L = (g = R == null ? void 0 : R.properties) === null || g === void 0 ? void 0 : g[u];
        if (typeof L != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${u}"`);
        $ = $ && (_ || m(R)), v(L, I);
      }
      if (!$)
        throw new Error(`discriminator: "${u}" must be required`);
      return E;
      function m({ required: I }) {
        return Array.isArray(I) && I.includes(u);
      }
      function v(I, R) {
        if (I.const)
          P(I.const, R);
        else if (I.enum)
          for (const L of I.enum)
            P(L, R);
        else
          throw new Error(`discriminator: "properties/${u}" must have "const" or "enum"`);
      }
      function P(I, R) {
        if (typeof I != "string" || I in E)
          throw new Error(`discriminator: "${u}" values must be unique strings`);
        E[I] = R;
      }
    }
  }
};
ha.default = ey;
var ma = {};
const ty = "https://json-schema.org/draft/2020-12/schema", ry = "https://json-schema.org/draft/2020-12/schema", ny = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, sy = "meta", oy = "Core and Validation specifications meta-schema", ay = [
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
], iy = [
  "object",
  "boolean"
], cy = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", ly = {
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
}, uy = {
  $schema: ty,
  $id: ry,
  $vocabulary: ny,
  $dynamicAnchor: sy,
  title: oy,
  allOf: ay,
  type: iy,
  $comment: cy,
  properties: ly
}, dy = "https://json-schema.org/draft/2020-12/schema", fy = "https://json-schema.org/draft/2020-12/meta/applicator", hy = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, my = "meta", py = "Applicator vocabulary meta-schema", $y = [
  "object",
  "boolean"
], yy = {
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
}, gy = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, _y = {
  $schema: dy,
  $id: fy,
  $vocabulary: hy,
  $dynamicAnchor: my,
  title: py,
  type: $y,
  properties: yy,
  $defs: gy
}, vy = "https://json-schema.org/draft/2020-12/schema", wy = "https://json-schema.org/draft/2020-12/meta/unevaluated", Ey = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, Sy = "meta", by = "Unevaluated applicator vocabulary meta-schema", Py = [
  "object",
  "boolean"
], Ny = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, Iy = {
  $schema: vy,
  $id: wy,
  $vocabulary: Ey,
  $dynamicAnchor: Sy,
  title: by,
  type: Py,
  properties: Ny
}, Ry = "https://json-schema.org/draft/2020-12/schema", Oy = "https://json-schema.org/draft/2020-12/meta/content", Ty = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, jy = "meta", ky = "Content vocabulary meta-schema", Ay = [
  "object",
  "boolean"
], Cy = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, Dy = {
  $schema: Ry,
  $id: Oy,
  $vocabulary: Ty,
  $dynamicAnchor: jy,
  title: ky,
  type: Ay,
  properties: Cy
}, My = "https://json-schema.org/draft/2020-12/schema", Ly = "https://json-schema.org/draft/2020-12/meta/core", Vy = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, Fy = "meta", Uy = "Core vocabulary meta-schema", zy = [
  "object",
  "boolean"
], qy = {
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
}, Gy = {
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
}, Ky = {
  $schema: My,
  $id: Ly,
  $vocabulary: Vy,
  $dynamicAnchor: Fy,
  title: Uy,
  type: zy,
  properties: qy,
  $defs: Gy
}, Hy = "https://json-schema.org/draft/2020-12/schema", By = "https://json-schema.org/draft/2020-12/meta/format-annotation", Wy = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, Xy = "meta", Jy = "Format vocabulary meta-schema for annotation results", Yy = [
  "object",
  "boolean"
], xy = {
  format: {
    type: "string"
  }
}, Zy = {
  $schema: Hy,
  $id: By,
  $vocabulary: Wy,
  $dynamicAnchor: Xy,
  title: Jy,
  type: Yy,
  properties: xy
}, Qy = "https://json-schema.org/draft/2020-12/schema", e0 = "https://json-schema.org/draft/2020-12/meta/meta-data", t0 = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, r0 = "meta", n0 = "Meta-data vocabulary meta-schema", s0 = [
  "object",
  "boolean"
], o0 = {
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
}, a0 = {
  $schema: Qy,
  $id: e0,
  $vocabulary: t0,
  $dynamicAnchor: r0,
  title: n0,
  type: s0,
  properties: o0
}, i0 = "https://json-schema.org/draft/2020-12/schema", c0 = "https://json-schema.org/draft/2020-12/meta/validation", l0 = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, u0 = "meta", d0 = "Validation vocabulary meta-schema", f0 = [
  "object",
  "boolean"
], h0 = {
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
}, m0 = {
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
}, p0 = {
  $schema: i0,
  $id: c0,
  $vocabulary: l0,
  $dynamicAnchor: u0,
  title: d0,
  type: f0,
  properties: h0,
  $defs: m0
};
Object.defineProperty(ma, "__esModule", { value: !0 });
const $0 = uy, y0 = _y, g0 = Iy, _0 = Dy, v0 = Ky, w0 = Zy, E0 = a0, S0 = p0, b0 = ["/properties"];
function P0(e) {
  return [
    $0,
    y0,
    g0,
    _0,
    v0,
    t(this, w0),
    E0,
    t(this, S0)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, b0) : n;
  }
}
ma.default = P0;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = Qc, n = Io, s = ha, o = ma, a = "https://json-schema.org/draft/2020-12/schema";
  class u extends r.default {
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
      const { $data: g, meta: E } = this.opts;
      E && (o.default.call(this, g), this.refs["http://json-schema.org/schema"] = a);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
    }
  }
  t.Ajv2020 = u, e.exports = t = u, e.exports.Ajv2020 = u, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = u;
  var c = Je;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var d = Y;
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
  var l = on;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return l.default;
  } });
  var h = Sr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(qs, qs.exports);
var N0 = qs.exports, Ys = { exports: {} }, Yl = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(F, z) {
    return { validate: F, compare: z };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(o, a),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(c(!0), d),
    "date-time": t(w(!0), g),
    "iso-time": t(c(), l),
    "iso-date-time": t(w(), E),
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
    regex: de,
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
    int32: { type: "number", validate: L },
    // signed 64 bit integer
    int64: { type: "number", validate: W },
    // C-type float
    float: { type: "number", validate: se },
    // C-type double
    double: { type: "number", validate: se },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, a),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, d),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, g),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, l),
    "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, E),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(F) {
    return F % 4 === 0 && (F % 100 !== 0 || F % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function o(F) {
    const z = n.exec(F);
    if (!z)
      return !1;
    const oe = +z[1], T = +z[2], k = +z[3];
    return T >= 1 && T <= 12 && k >= 1 && k <= (T === 2 && r(oe) ? 29 : s[T]);
  }
  function a(F, z) {
    if (F && z)
      return F > z ? 1 : F < z ? -1 : 0;
  }
  const u = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(F) {
    return function(oe) {
      const T = u.exec(oe);
      if (!T)
        return !1;
      const k = +T[1], V = +T[2], C = +T[3], G = T[4], D = T[5] === "-" ? -1 : 1, N = +(T[6] || 0), p = +(T[7] || 0);
      if (N > 23 || p > 59 || F && !G)
        return !1;
      if (k <= 23 && V <= 59 && C < 60)
        return !0;
      const b = V - p * D, y = k - N * D - (b < 0 ? 1 : 0);
      return (y === 23 || y === -1) && (b === 59 || b === -1) && C < 61;
    };
  }
  function d(F, z) {
    if (!(F && z))
      return;
    const oe = (/* @__PURE__ */ new Date("2020-01-01T" + F)).valueOf(), T = (/* @__PURE__ */ new Date("2020-01-01T" + z)).valueOf();
    if (oe && T)
      return oe - T;
  }
  function l(F, z) {
    if (!(F && z))
      return;
    const oe = u.exec(F), T = u.exec(z);
    if (oe && T)
      return F = oe[1] + oe[2] + oe[3], z = T[1] + T[2] + T[3], F > z ? 1 : F < z ? -1 : 0;
  }
  const h = /t|\s/i;
  function w(F) {
    const z = c(F);
    return function(T) {
      const k = T.split(h);
      return k.length === 2 && o(k[0]) && z(k[1]);
    };
  }
  function g(F, z) {
    if (!(F && z))
      return;
    const oe = new Date(F).valueOf(), T = new Date(z).valueOf();
    if (oe && T)
      return oe - T;
  }
  function E(F, z) {
    if (!(F && z))
      return;
    const [oe, T] = F.split(h), [k, V] = z.split(h), C = a(oe, k);
    if (C !== void 0)
      return C || d(T, V);
  }
  const _ = /\/|:/, $ = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(F) {
    return _.test(F) && $.test(F);
  }
  const v = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function P(F) {
    return v.lastIndex = 0, v.test(F);
  }
  const I = -2147483648, R = 2 ** 31 - 1;
  function L(F) {
    return Number.isInteger(F) && F <= R && F >= I;
  }
  function W(F) {
    return Number.isInteger(F);
  }
  function se() {
    return !0;
  }
  const ae = /[^\\]\\Z/;
  function de(F) {
    if (ae.test(F))
      return !1;
    try {
      return new RegExp(F), !0;
    } catch {
      return !1;
    }
  }
})(Yl);
var xl = {}, xs = { exports: {} }, Zl = {}, Ye = {}, vr = {}, cn = {}, ee = {}, nn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(v) {
      if (super(), !e.IDENTIFIER.test(v))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = v;
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
    constructor(v) {
      super(), this._items = typeof v == "string" ? [v] : v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const v = this._items[0];
      return v === "" || v === '""';
    }
    get str() {
      var v;
      return (v = this._str) !== null && v !== void 0 ? v : this._str = this._items.reduce((P, I) => `${P}${I}`, "");
    }
    get names() {
      var v;
      return (v = this._names) !== null && v !== void 0 ? v : this._names = this._items.reduce((P, I) => (I instanceof r && (P[I.str] = (P[I.str] || 0) + 1), P), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...v) {
    const P = [m[0]];
    let I = 0;
    for (; I < v.length; )
      u(P, v[I]), P.push(m[++I]);
    return new n(P);
  }
  e._ = s;
  const o = new n("+");
  function a(m, ...v) {
    const P = [g(m[0])];
    let I = 0;
    for (; I < v.length; )
      P.push(o), u(P, v[I]), P.push(o, g(m[++I]));
    return c(P), new n(P);
  }
  e.str = a;
  function u(m, v) {
    v instanceof n ? m.push(...v._items) : v instanceof r ? m.push(v) : m.push(h(v));
  }
  e.addCodeArg = u;
  function c(m) {
    let v = 1;
    for (; v < m.length - 1; ) {
      if (m[v] === o) {
        const P = d(m[v - 1], m[v + 1]);
        if (P !== void 0) {
          m.splice(v - 1, 3, P);
          continue;
        }
        m[v++] = "+";
      }
      v++;
    }
  }
  function d(m, v) {
    if (v === '""')
      return m;
    if (m === '""')
      return v;
    if (typeof m == "string")
      return v instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof v != "string" ? `${m.slice(0, -1)}${v}"` : v[0] === '"' ? m.slice(0, -1) + v.slice(1) : void 0;
    if (typeof v == "string" && v[0] === '"' && !(m instanceof r))
      return `"${m}${v.slice(1)}`;
  }
  function l(m, v) {
    return v.emptyStr() ? m : m.emptyStr() ? v : a`${m}${v}`;
  }
  e.strConcat = l;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : g(Array.isArray(m) ? m.join(",") : m);
  }
  function w(m) {
    return new n(g(m));
  }
  e.stringify = w;
  function g(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = g;
  function E(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = E;
  function _(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = _;
  function $(m) {
    return new n(m.toString());
  }
  e.regexpCode = $;
})(nn);
var Zs = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = nn;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: l } = {}) {
      this._names = {}, this._prefixes = d, this._parent = l;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const l = this._names[d] || this._nameGroup(d);
      return `${d}${l.index++}`;
    }
    _nameGroup(d) {
      var l, h;
      if (!((h = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class o extends t.Name {
    constructor(d, l) {
      super(l), this.prefix = d;
    }
    setValue(d, { property: l, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(l)}[${h}]`;
    }
  }
  e.ValueScopeName = o;
  const a = (0, t._)`\n`;
  class u extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? a : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new o(d, this._newName(d));
    }
    value(d, l) {
      var h;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const w = this.toName(d), { prefix: g } = w, E = (h = l.key) !== null && h !== void 0 ? h : l.ref;
      let _ = this._values[g];
      if (_) {
        const v = _.get(E);
        if (v)
          return v;
      } else
        _ = this._values[g] = /* @__PURE__ */ new Map();
      _.set(E, w);
      const $ = this._scope[g] || (this._scope[g] = []), m = $.length;
      return $[m] = l.ref, w.setValue(l, { property: g, itemIndex: m }), w;
    }
    getValue(d, l) {
      const h = this._values[d];
      if (h)
        return h.get(l);
    }
    scopeRefs(d, l = this._values) {
      return this._reduceValues(l, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, l, h) {
      return this._reduceValues(d, (w) => {
        if (w.value === void 0)
          throw new Error(`CodeGen: name "${w}" has no value`);
        return w.value.code;
      }, l, h);
    }
    _reduceValues(d, l, h = {}, w) {
      let g = t.nil;
      for (const E in d) {
        const _ = d[E];
        if (!_)
          continue;
        const $ = h[E] = h[E] || /* @__PURE__ */ new Map();
        _.forEach((m) => {
          if ($.has(m))
            return;
          $.set(m, n.Started);
          let v = l(m);
          if (v) {
            const P = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            g = (0, t._)`${g}${P} ${m} = ${v};${this.opts._n}`;
          } else if (v = w == null ? void 0 : w(m))
            g = (0, t._)`${g}${v}${this.opts._n}`;
          else
            throw new r(m);
          $.set(m, n.Completed);
        });
      }
      return g;
    }
  }
  e.ValueScope = u;
})(Zs);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = nn, r = Zs;
  var n = nn;
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
  var s = Zs;
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
    optimizeNames(i, f) {
      return this;
    }
  }
  class a extends o {
    constructor(i, f, S) {
      super(), this.varKind = i, this.name = f, this.rhs = S;
    }
    render({ es5: i, _n: f }) {
      const S = i ? r.varKinds.var : this.varKind, O = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${S} ${this.name}${O};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = T(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class u extends o {
    constructor(i, f, S) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = S;
    }
    render({ _n: i }) {
      return `${this.lhs} = ${this.rhs};` + i;
    }
    optimizeNames(i, f) {
      if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
        return this.rhs = T(this.rhs, i, f), this;
    }
    get names() {
      const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return oe(i, this.rhs);
    }
  }
  class c extends u {
    constructor(i, f, S, O) {
      super(i, S, O), this.op = f;
    }
    render({ _n: i }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + i;
    }
  }
  class d extends o {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `${this.label}:` + i;
    }
  }
  class l extends o {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `break${this.label ? ` ${this.label}` : ""};` + i;
    }
  }
  class h extends o {
    constructor(i) {
      super(), this.error = i;
    }
    render({ _n: i }) {
      return `throw ${this.error};` + i;
    }
    get names() {
      return this.error.names;
    }
  }
  class w extends o {
    constructor(i) {
      super(), this.code = i;
    }
    render({ _n: i }) {
      return `${this.code};` + i;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(i, f) {
      return this.code = T(this.code, i, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class g extends o {
    constructor(i = []) {
      super(), this.nodes = i;
    }
    render(i) {
      return this.nodes.reduce((f, S) => f + S.render(i), "");
    }
    optimizeNodes() {
      const { nodes: i } = this;
      let f = i.length;
      for (; f--; ) {
        const S = i[f].optimizeNodes();
        Array.isArray(S) ? i.splice(f, 1, ...S) : S ? i[f] = S : i.splice(f, 1);
      }
      return i.length > 0 ? this : void 0;
    }
    optimizeNames(i, f) {
      const { nodes: S } = this;
      let O = S.length;
      for (; O--; ) {
        const j = S[O];
        j.optimizeNames(i, f) || (k(i, j.names), S.splice(O, 1));
      }
      return S.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => z(i, f.names), {});
    }
  }
  class E extends g {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class _ extends g {
  }
  class $ extends E {
  }
  $.kind = "else";
  class m extends E {
    constructor(i, f) {
      super(f), this.condition = i;
    }
    render(i) {
      let f = `if(${this.condition})` + super.render(i);
      return this.else && (f += "else " + this.else.render(i)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const i = this.condition;
      if (i === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const S = f.optimizeNodes();
        f = this.else = Array.isArray(S) ? new $(S) : S;
      }
      if (f)
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(V(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var S;
      if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = T(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return oe(i, this.condition), this.else && z(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class v extends E {
  }
  v.kind = "for";
  class P extends v {
    constructor(i) {
      super(), this.iteration = i;
    }
    render(i) {
      return `for(${this.iteration})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iteration = T(this.iteration, i, f), this;
    }
    get names() {
      return z(super.names, this.iteration.names);
    }
  }
  class I extends v {
    constructor(i, f, S, O) {
      super(), this.varKind = i, this.name = f, this.from = S, this.to = O;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: S, from: O, to: j } = this;
      return `for(${f} ${S}=${O}; ${S}<${j}; ${S}++)` + super.render(i);
    }
    get names() {
      const i = oe(super.names, this.from);
      return oe(i, this.to);
    }
  }
  class R extends v {
    constructor(i, f, S, O) {
      super(), this.loop = i, this.varKind = f, this.name = S, this.iterable = O;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = T(this.iterable, i, f), this;
    }
    get names() {
      return z(super.names, this.iterable.names);
    }
  }
  class L extends E {
    constructor(i, f, S) {
      super(), this.name = i, this.args = f, this.async = S;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  L.kind = "func";
  class W extends g {
    render(i) {
      return "return " + super.render(i);
    }
  }
  W.kind = "return";
  class se extends E {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var S, O;
      return super.optimizeNames(i, f), (S = this.catch) === null || S === void 0 || S.optimizeNames(i, f), (O = this.finally) === null || O === void 0 || O.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && z(i, this.catch.names), this.finally && z(i, this.finally.names), i;
    }
  }
  class ae extends E {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  ae.kind = "catch";
  class de extends E {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  de.kind = "finally";
  class F {
    constructor(i, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = i, this._scope = new r.Scope({ parent: i }), this._nodes = [new _()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(i) {
      return this._scope.name(i);
    }
    // reserves unique name in the external scope
    scopeName(i) {
      return this._extScope.name(i);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(i, f) {
      const S = this._extScope.value(i, f);
      return (this._values[S.prefix] || (this._values[S.prefix] = /* @__PURE__ */ new Set())).add(S), S;
    }
    getScopeValue(i, f) {
      return this._extScope.getValue(i, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(i) {
      return this._extScope.scopeRefs(i, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(i, f, S, O) {
      const j = this._scope.toName(f);
      return S !== void 0 && O && (this._constants[j.str] = S), this._leafNode(new a(i, j, S)), j;
    }
    // `const` declaration (`var` in es5 mode)
    const(i, f, S) {
      return this._def(r.varKinds.const, i, f, S);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(i, f, S) {
      return this._def(r.varKinds.let, i, f, S);
    }
    // `var` declaration with optional assignment
    var(i, f, S) {
      return this._def(r.varKinds.var, i, f, S);
    }
    // assignment code
    assign(i, f, S) {
      return this._leafNode(new u(i, f, S));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new c(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new w(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [S, O] of i)
        f.length > 1 && f.push(","), f.push(S), (S !== O || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, O));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(i, f, S) {
      if (this._blockNode(new m(i)), f && S)
        this.code(f).else().code(S).endIf();
      else if (f)
        this.code(f).endIf();
      else if (S)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(i) {
      return this._elseNode(new m(i));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new $());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, $);
    }
    _for(i, f) {
      return this._blockNode(i), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(i, f) {
      return this._for(new P(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, S, O, j = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const q = this._scope.toName(i);
      return this._for(new I(j, q, f, S), () => O(q));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, S, O = r.varKinds.const) {
      const j = this._scope.toName(i);
      if (this.opts.es5) {
        const q = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${q}.length`, (U) => {
          this.var(j, (0, t._)`${q}[${U}]`), S(j);
        });
      }
      return this._for(new R("of", O, j, f), () => S(j));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, S, O = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, S);
      const j = this._scope.toName(i);
      return this._for(new R("in", O, j, f), () => S(j));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(v);
    }
    // `label` statement
    label(i) {
      return this._leafNode(new d(i));
    }
    // `break` statement
    break(i) {
      return this._leafNode(new l(i));
    }
    // `return` statement
    return(i) {
      const f = new W();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(W);
    }
    // `try` statement
    try(i, f, S) {
      if (!f && !S)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const O = new se();
      if (this._blockNode(O), this.code(i), f) {
        const j = this.name("e");
        this._currNode = O.catch = new ae(j), f(j);
      }
      return S && (this._currNode = O.finally = new de(), this.code(S)), this._endBlockNode(ae, de);
    }
    // `throw` statement
    throw(i) {
      return this._leafNode(new h(i));
    }
    // start self-balancing block
    block(i, f) {
      return this._blockStarts.push(this._nodes.length), i && this.code(i).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(i) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const S = this._nodes.length - f;
      if (S < 0 || i !== void 0 && S !== i)
        throw new Error(`CodeGen: wrong number of nodes: ${S} vs ${i} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(i, f = t.nil, S, O) {
      return this._blockNode(new L(i, f, S)), O && this.code(O).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(L);
    }
    optimize(i = 1) {
      for (; i-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(i) {
      return this._currNode.nodes.push(i), this;
    }
    _blockNode(i) {
      this._currNode.nodes.push(i), this._nodes.push(i);
    }
    _endBlockNode(i, f) {
      const S = this._currNode;
      if (S instanceof i || f && S instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${i.kind}/${f.kind}` : i.kind}"`);
    }
    _elseNode(i) {
      const f = this._currNode;
      if (!(f instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = i, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const i = this._nodes;
      return i[i.length - 1];
    }
    set _currNode(i) {
      const f = this._nodes;
      f[f.length - 1] = i;
    }
  }
  e.CodeGen = F;
  function z(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) + (i[f] || 0);
    return y;
  }
  function oe(y, i) {
    return i instanceof t._CodeOrName ? z(y, i.names) : y;
  }
  function T(y, i, f) {
    if (y instanceof t.Name)
      return S(y);
    if (!O(y))
      return y;
    return new t._Code(y._items.reduce((j, q) => (q instanceof t.Name && (q = S(q)), q instanceof t._Code ? j.push(...q._items) : j.push(q), j), []));
    function S(j) {
      const q = f[j.str];
      return q === void 0 || i[j.str] !== 1 ? j : (delete i[j.str], q);
    }
    function O(j) {
      return j instanceof t._Code && j._items.some((q) => q instanceof t.Name && i[q.str] === 1 && f[q.str] !== void 0);
    }
  }
  function k(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) - (i[f] || 0);
  }
  function V(y) {
    return typeof y == "boolean" || typeof y == "number" || y === null ? !y : (0, t._)`!${b(y)}`;
  }
  e.not = V;
  const C = p(e.operators.AND);
  function G(...y) {
    return y.reduce(C);
  }
  e.and = G;
  const D = p(e.operators.OR);
  function N(...y) {
    return y.reduce(D);
  }
  e.or = N;
  function p(y) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${b(i)} ${y} ${b(f)}`;
  }
  function b(y) {
    return y instanceof t.Name ? y : (0, t._)`(${y})`;
  }
})(ee);
var M = {};
Object.defineProperty(M, "__esModule", { value: !0 });
M.checkStrictMode = M.getErrorPath = M.Type = M.useFunc = M.setEvaluated = M.evaluatedPropsToName = M.mergeEvaluated = M.eachItem = M.unescapeJsonPointer = M.escapeJsonPointer = M.escapeFragment = M.unescapeFragment = M.schemaRefOrVal = M.schemaHasRulesButRef = M.schemaHasRules = M.checkUnknownRules = M.alwaysValidSchema = M.toHash = void 0;
const ce = ee, I0 = nn;
function R0(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
M.toHash = R0;
function O0(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Ql(e, t), !eu(t, e.self.RULES.all));
}
M.alwaysValidSchema = O0;
function Ql(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const o in t)
    s[o] || nu(e, `unknown keyword: "${o}"`);
}
M.checkUnknownRules = Ql;
function eu(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
M.schemaHasRules = eu;
function T0(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
M.schemaHasRulesButRef = T0;
function j0({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ce._)`${r}`;
  }
  return (0, ce._)`${e}${t}${(0, ce.getProperty)(n)}`;
}
M.schemaRefOrVal = j0;
function k0(e) {
  return tu(decodeURIComponent(e));
}
M.unescapeFragment = k0;
function A0(e) {
  return encodeURIComponent(pa(e));
}
M.escapeFragment = A0;
function pa(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
M.escapeJsonPointer = pa;
function tu(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
M.unescapeJsonPointer = tu;
function C0(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
M.eachItem = C0;
function xi({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, o, a, u) => {
    const c = a === void 0 ? o : a instanceof ce.Name ? (o instanceof ce.Name ? e(s, o, a) : t(s, o, a), a) : o instanceof ce.Name ? (t(s, a, o), o) : r(o, a);
    return u === ce.Name && !(c instanceof ce.Name) ? n(s, c) : c;
  };
}
M.mergeEvaluated = {
  props: xi({
    mergeNames: (e, t, r) => e.if((0, ce._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ce._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ce._)`${r} || {}`).code((0, ce._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ce._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ce._)`${r} || {}`), $a(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: ru
  }),
  items: xi({
    mergeNames: (e, t, r) => e.if((0, ce._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ce._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ce._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ce._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function ru(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ce._)`{}`);
  return t !== void 0 && $a(e, r, t), r;
}
M.evaluatedPropsToName = ru;
function $a(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ce._)`${t}${(0, ce.getProperty)(n)}`, !0));
}
M.setEvaluated = $a;
const Zi = {};
function D0(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Zi[t.code] || (Zi[t.code] = new I0._Code(t.code))
  });
}
M.useFunc = D0;
var Qs;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Qs || (M.Type = Qs = {}));
function M0(e, t, r) {
  if (e instanceof ce.Name) {
    const n = t === Qs.Num;
    return r ? n ? (0, ce._)`"[" + ${e} + "]"` : (0, ce._)`"['" + ${e} + "']"` : n ? (0, ce._)`"/" + ${e}` : (0, ce._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ce.getProperty)(e).toString() : "/" + pa(e);
}
M.getErrorPath = M0;
function nu(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
M.checkStrictMode = nu;
var ot = {};
Object.defineProperty(ot, "__esModule", { value: !0 });
const Ne = ee, L0 = {
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
ot.default = L0;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = ee, r = M, n = ot;
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: m }) => m ? (0, t.str)`"${$}" keyword must be ${m} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, m = e.keywordError, v, P) {
    const { it: I } = $, { gen: R, compositeRule: L, allErrors: W } = I, se = h($, m, v);
    P ?? (L || W) ? c(R, se) : d(I, (0, t._)`[${se}]`);
  }
  e.reportError = s;
  function o($, m = e.keywordError, v) {
    const { it: P } = $, { gen: I, compositeRule: R, allErrors: L } = P, W = h($, m, v);
    c(I, W), R || L || d(P, n.default.vErrors);
  }
  e.reportExtraError = o;
  function a($, m) {
    $.assign(n.default.errors, m), $.if((0, t._)`${n.default.vErrors} !== null`, () => $.if(m, () => $.assign((0, t._)`${n.default.vErrors}.length`, m), () => $.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function u({ gen: $, keyword: m, schemaValue: v, data: P, errsCount: I, it: R }) {
    if (I === void 0)
      throw new Error("ajv implementation error");
    const L = $.name("err");
    $.forRange("i", I, n.default.errors, (W) => {
      $.const(L, (0, t._)`${n.default.vErrors}[${W}]`), $.if((0, t._)`${L}.instancePath === undefined`, () => $.assign((0, t._)`${L}.instancePath`, (0, t.strConcat)(n.default.instancePath, R.errorPath))), $.assign((0, t._)`${L}.schemaPath`, (0, t.str)`${R.errSchemaPath}/${m}`), R.opts.verbose && ($.assign((0, t._)`${L}.schema`, v), $.assign((0, t._)`${L}.data`, P));
    });
  }
  e.extendErrors = u;
  function c($, m) {
    const v = $.const("err", m);
    $.if((0, t._)`${n.default.vErrors} === null`, () => $.assign(n.default.vErrors, (0, t._)`[${v}]`), (0, t._)`${n.default.vErrors}.push(${v})`), $.code((0, t._)`${n.default.errors}++`);
  }
  function d($, m) {
    const { gen: v, validateName: P, schemaEnv: I } = $;
    I.$async ? v.throw((0, t._)`new ${$.ValidationError}(${m})`) : (v.assign((0, t._)`${P}.errors`, m), v.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h($, m, v) {
    const { createErrors: P } = $.it;
    return P === !1 ? (0, t._)`{}` : w($, m, v);
  }
  function w($, m, v = {}) {
    const { gen: P, it: I } = $, R = [
      g(I, v),
      E($, v)
    ];
    return _($, m, R), P.object(...R);
  }
  function g({ errorPath: $ }, { instancePath: m }) {
    const v = m ? (0, t.str)`${$}${(0, r.getErrorPath)(m, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, v)];
  }
  function E({ keyword: $, it: { errSchemaPath: m } }, { schemaPath: v, parentSchema: P }) {
    let I = P ? m : (0, t.str)`${m}/${$}`;
    return v && (I = (0, t.str)`${I}${(0, r.getErrorPath)(v, r.Type.Str)}`), [l.schemaPath, I];
  }
  function _($, { params: m, message: v }, P) {
    const { keyword: I, data: R, schemaValue: L, it: W } = $, { opts: se, propertyName: ae, topSchemaRef: de, schemaPath: F } = W;
    P.push([l.keyword, I], [l.params, typeof m == "function" ? m($) : m || (0, t._)`{}`]), se.messages && P.push([l.message, typeof v == "function" ? v($) : v]), se.verbose && P.push([l.schema, L], [l.parentSchema, (0, t._)`${de}${F}`], [n.default.data, R]), ae && P.push([l.propertyName, ae]);
  }
})(cn);
Object.defineProperty(vr, "__esModule", { value: !0 });
vr.boolOrEmptySchema = vr.topBoolOrEmptySchema = void 0;
const V0 = cn, F0 = ee, U0 = ot, z0 = {
  message: "boolean schema is false"
};
function q0(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? su(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(U0.default.data) : (t.assign((0, F0._)`${n}.errors`, null), t.return(!0));
}
vr.topBoolOrEmptySchema = q0;
function G0(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), su(e)) : r.var(t, !0);
}
vr.boolOrEmptySchema = G0;
function su(e, t) {
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
  (0, V0.reportError)(s, z0, void 0, t);
}
var ge = {}, rr = {};
Object.defineProperty(rr, "__esModule", { value: !0 });
rr.getRules = rr.isJSONType = void 0;
const K0 = ["string", "number", "integer", "boolean", "null", "object", "array"], H0 = new Set(K0);
function B0(e) {
  return typeof e == "string" && H0.has(e);
}
rr.isJSONType = B0;
function W0() {
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
rr.getRules = W0;
var dt = {};
Object.defineProperty(dt, "__esModule", { value: !0 });
dt.shouldUseRule = dt.shouldUseGroup = dt.schemaHasRulesForType = void 0;
function X0({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && ou(e, n);
}
dt.schemaHasRulesForType = X0;
function ou(e, t) {
  return t.rules.some((r) => au(e, r));
}
dt.shouldUseGroup = ou;
function au(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
dt.shouldUseRule = au;
Object.defineProperty(ge, "__esModule", { value: !0 });
ge.reportTypeError = ge.checkDataTypes = ge.checkDataType = ge.coerceAndCheckDataType = ge.getJSONTypes = ge.getSchemaTypes = ge.DataType = void 0;
const J0 = rr, Y0 = dt, x0 = cn, Z = ee, iu = M;
var $r;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})($r || (ge.DataType = $r = {}));
function Z0(e) {
  const t = cu(e.type);
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
ge.getSchemaTypes = Z0;
function cu(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(J0.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ge.getJSONTypes = cu;
function Q0(e, t) {
  const { gen: r, data: n, opts: s } = e, o = eg(t, s.coerceTypes), a = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, Y0.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const u = ya(t, n, s.strictNumbers, $r.Wrong);
    r.if(u, () => {
      o.length ? tg(e, t, o) : ga(e);
    });
  }
  return a;
}
ge.coerceAndCheckDataType = Q0;
const lu = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function eg(e, t) {
  return t ? e.filter((r) => lu.has(r) || t === "array" && r === "array") : [];
}
function tg(e, t, r) {
  const { gen: n, data: s, opts: o } = e, a = n.let("dataType", (0, Z._)`typeof ${s}`), u = n.let("coerced", (0, Z._)`undefined`);
  o.coerceTypes === "array" && n.if((0, Z._)`${a} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, Z._)`${s}[0]`).assign(a, (0, Z._)`typeof ${s}`).if(ya(t, s, o.strictNumbers), () => n.assign(u, s))), n.if((0, Z._)`${u} !== undefined`);
  for (const d of r)
    (lu.has(d) || d === "array" && o.coerceTypes === "array") && c(d);
  n.else(), ga(e), n.endIf(), n.if((0, Z._)`${u} !== undefined`, () => {
    n.assign(s, u), rg(e, u);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, Z._)`${a} == "number" || ${a} == "boolean"`).assign(u, (0, Z._)`"" + ${s}`).elseIf((0, Z._)`${s} === null`).assign(u, (0, Z._)`""`);
        return;
      case "number":
        n.elseIf((0, Z._)`${a} == "boolean" || ${s} === null
              || (${a} == "string" && ${s} && ${s} == +${s})`).assign(u, (0, Z._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, Z._)`${a} === "boolean" || ${s} === null
              || (${a} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(u, (0, Z._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, Z._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(u, !1).elseIf((0, Z._)`${s} === "true" || ${s} === 1`).assign(u, !0);
        return;
      case "null":
        n.elseIf((0, Z._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(u, null);
        return;
      case "array":
        n.elseIf((0, Z._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${s} === null`).assign(u, (0, Z._)`[${s}]`);
    }
  }
}
function rg({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, Z._)`${t} !== undefined`, () => e.assign((0, Z._)`${t}[${r}]`, n));
}
function eo(e, t, r, n = $r.Correct) {
  const s = n === $r.Correct ? Z.operators.EQ : Z.operators.NEQ;
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
  return n === $r.Correct ? o : (0, Z.not)(o);
  function a(u = Z.nil) {
    return (0, Z.and)((0, Z._)`typeof ${t} == "number"`, u, r ? (0, Z._)`isFinite(${t})` : Z.nil);
  }
}
ge.checkDataType = eo;
function ya(e, t, r, n) {
  if (e.length === 1)
    return eo(e[0], t, r, n);
  let s;
  const o = (0, iu.toHash)(e);
  if (o.array && o.object) {
    const a = (0, Z._)`typeof ${t} != "object"`;
    s = o.null ? a : (0, Z._)`!${t} || ${a}`, delete o.null, delete o.array, delete o.object;
  } else
    s = Z.nil;
  o.number && delete o.integer;
  for (const a in o)
    s = (0, Z.and)(s, eo(a, t, r, n));
  return s;
}
ge.checkDataTypes = ya;
const ng = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, Z._)`{type: ${e}}` : (0, Z._)`{type: ${t}}`
};
function ga(e) {
  const t = sg(e);
  (0, x0.reportError)(t, ng);
}
ge.reportTypeError = ga;
function sg(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, iu.schemaRefOrVal)(e, n, "type");
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
var ls = {};
Object.defineProperty(ls, "__esModule", { value: !0 });
ls.assignDefaults = void 0;
const ar = ee, og = M;
function ag(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Qi(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, o) => Qi(e, o, s.default));
}
ls.assignDefaults = ag;
function Qi(e, t, r) {
  const { gen: n, compositeRule: s, data: o, opts: a } = e;
  if (r === void 0)
    return;
  const u = (0, ar._)`${o}${(0, ar.getProperty)(t)}`;
  if (s) {
    (0, og.checkStrictMode)(e, `default is ignored for: ${u}`);
    return;
  }
  let c = (0, ar._)`${u} === undefined`;
  a.useDefaults === "empty" && (c = (0, ar._)`${c} || ${u} === null || ${u} === ""`), n.if(c, (0, ar._)`${u} = ${(0, ar.stringify)(r)}`);
}
var st = {}, re = {};
Object.defineProperty(re, "__esModule", { value: !0 });
re.validateUnion = re.validateArray = re.usePattern = re.callValidateCode = re.schemaProperties = re.allSchemaProperties = re.noPropertyInData = re.propertyInData = re.isOwnProperty = re.hasPropFunc = re.reportMissingProp = re.checkMissingProp = re.checkReportMissingProp = void 0;
const ue = ee, _a = M, vt = ot, ig = M;
function cg(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(wa(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, ue._)`${t}` }, !0), e.error();
  });
}
re.checkReportMissingProp = cg;
function lg({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, ue.or)(...n.map((o) => (0, ue.and)(wa(e, t, o, r.ownProperties), (0, ue._)`${s} = ${o}`)));
}
re.checkMissingProp = lg;
function ug(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
re.reportMissingProp = ug;
function uu(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ue._)`Object.prototype.hasOwnProperty`
  });
}
re.hasPropFunc = uu;
function va(e, t, r) {
  return (0, ue._)`${uu(e)}.call(${t}, ${r})`;
}
re.isOwnProperty = va;
function dg(e, t, r, n) {
  const s = (0, ue._)`${t}${(0, ue.getProperty)(r)} !== undefined`;
  return n ? (0, ue._)`${s} && ${va(e, t, r)}` : s;
}
re.propertyInData = dg;
function wa(e, t, r, n) {
  const s = (0, ue._)`${t}${(0, ue.getProperty)(r)} === undefined`;
  return n ? (0, ue.or)(s, (0, ue.not)(va(e, t, r))) : s;
}
re.noPropertyInData = wa;
function du(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
re.allSchemaProperties = du;
function fg(e, t) {
  return du(t).filter((r) => !(0, _a.alwaysValidSchema)(e, t[r]));
}
re.schemaProperties = fg;
function hg({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: o }, it: a }, u, c, d) {
  const l = d ? (0, ue._)`${e}, ${t}, ${n}${s}` : t, h = [
    [vt.default.instancePath, (0, ue.strConcat)(vt.default.instancePath, o)],
    [vt.default.parentData, a.parentData],
    [vt.default.parentDataProperty, a.parentDataProperty],
    [vt.default.rootData, vt.default.rootData]
  ];
  a.opts.dynamicRef && h.push([vt.default.dynamicAnchors, vt.default.dynamicAnchors]);
  const w = (0, ue._)`${l}, ${r.object(...h)}`;
  return c !== ue.nil ? (0, ue._)`${u}.call(${c}, ${w})` : (0, ue._)`${u}(${w})`;
}
re.callValidateCode = hg;
const mg = (0, ue._)`new RegExp`;
function pg({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, o = s(r, n);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, ue._)`${s.code === "new RegExp" ? mg : (0, ig.useFunc)(e, s)}(${r}, ${n})`
  });
}
re.usePattern = pg;
function $g(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, o = t.name("valid");
  if (s.allErrors) {
    const u = t.let("valid", !0);
    return a(() => t.assign(u, !1)), u;
  }
  return t.var(o, !0), a(() => t.break()), o;
  function a(u) {
    const c = t.const("len", (0, ue._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: _a.Type.Num
      }, o), t.if((0, ue.not)(o), u);
    });
  }
}
re.validateArray = $g;
function yg(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, _a.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const a = t.let("valid", !1), u = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, u);
    t.assign(a, (0, ue._)`${a} || ${u}`), e.mergeValidEvaluated(l, u) || t.if((0, ue.not)(a));
  })), e.result(a, () => e.reset(), () => e.error(!0));
}
re.validateUnion = yg;
Object.defineProperty(st, "__esModule", { value: !0 });
st.validateKeywordUsage = st.validSchemaType = st.funcKeywordCode = st.macroKeywordCode = void 0;
const Te = ee, Yt = ot, gg = re, _g = cn;
function vg(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: o, it: a } = e, u = t.macro.call(a.self, s, o, a), c = fu(r, n, u);
  a.opts.validateSchema !== !1 && a.self.validateSchema(u, !0);
  const d = r.name("valid");
  e.subschema({
    schema: u,
    schemaPath: Te.nil,
    errSchemaPath: `${a.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
st.macroKeywordCode = vg;
function wg(e, t) {
  var r;
  const { gen: n, keyword: s, schema: o, parentSchema: a, $data: u, it: c } = e;
  Sg(c, t);
  const d = !u && t.compile ? t.compile.call(c.self, o, a, c) : t.validate, l = fu(n, s, d), h = n.let("valid");
  e.block$data(h, w), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function w() {
    if (t.errors === !1)
      _(), t.modifying && ec(e), $(() => e.error());
    else {
      const m = t.async ? g() : E();
      t.modifying && ec(e), $(() => Eg(e, m));
    }
  }
  function g() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, Te._)`await `), (v) => n.assign(h, !1).if((0, Te._)`${v} instanceof ${c.ValidationError}`, () => n.assign(m, (0, Te._)`${v}.errors`), () => n.throw(v))), m;
  }
  function E() {
    const m = (0, Te._)`${l}.errors`;
    return n.assign(m, null), _(Te.nil), m;
  }
  function _(m = t.async ? (0, Te._)`await ` : Te.nil) {
    const v = c.opts.passContext ? Yt.default.this : Yt.default.self, P = !("compile" in t && !u || t.schema === !1);
    n.assign(h, (0, Te._)`${m}${(0, gg.callValidateCode)(e, l, v, P)}`, t.modifying);
  }
  function $(m) {
    var v;
    n.if((0, Te.not)((v = t.valid) !== null && v !== void 0 ? v : h), m);
  }
}
st.funcKeywordCode = wg;
function ec(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Te._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Eg(e, t) {
  const { gen: r } = e;
  r.if((0, Te._)`Array.isArray(${t})`, () => {
    r.assign(Yt.default.vErrors, (0, Te._)`${Yt.default.vErrors} === null ? ${t} : ${Yt.default.vErrors}.concat(${t})`).assign(Yt.default.errors, (0, Te._)`${Yt.default.vErrors}.length`), (0, _g.extendErrors)(e);
  }, () => e.error());
}
function Sg({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function fu(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Te.stringify)(r) });
}
function bg(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
st.validSchemaType = bg;
function Pg({ schema: e, opts: t, self: r, errSchemaPath: n }, s, o) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(o) : s.keyword !== o)
    throw new Error("ajv implementation error");
  const a = s.dependencies;
  if (a != null && a.some((u) => !Object.prototype.hasOwnProperty.call(e, u)))
    throw new Error(`parent schema must have dependencies of ${o}: ${a.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[o])) {
    const c = `keyword "${o}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
st.validateKeywordUsage = Pg;
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.extendSubschemaMode = Ot.extendSubschemaData = Ot.getSubschema = void 0;
const tt = ee, hu = M;
function Ng(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: o, topSchemaRef: a }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const u = e.schema[t];
    return r === void 0 ? {
      schema: u,
      schemaPath: (0, tt._)`${e.schemaPath}${(0, tt.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: u[r],
      schemaPath: (0, tt._)`${e.schemaPath}${(0, tt.getProperty)(t)}${(0, tt.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, hu.escapeFragment)(r)}`
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
Ot.getSubschema = Ng;
function Ig(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: o, propertyName: a }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: u } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: l, opts: h } = t, w = u.let("data", (0, tt._)`${t.data}${(0, tt.getProperty)(r)}`, !0);
    c(w), e.errorPath = (0, tt.str)`${d}${(0, hu.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, tt._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof tt.Name ? s : u.let("data", s, !0);
    c(d), a !== void 0 && (e.propertyName = a);
  }
  o && (e.dataTypes = o);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Ot.extendSubschemaData = Ig;
function Rg(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: o }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Ot.extendSubschemaMode = Rg;
var Se = {}, mu = { exports: {} }, It = mu.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Dn(t, n, s, e, "", e);
};
It.keywords = {
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
It.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
It.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
It.skipKeywords = {
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
function Dn(e, t, r, n, s, o, a, u, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, o, a, u, c, d);
    for (var l in n) {
      var h = n[l];
      if (Array.isArray(h)) {
        if (l in It.arrayKeywords)
          for (var w = 0; w < h.length; w++)
            Dn(e, t, r, h[w], s + "/" + l + "/" + w, o, s, l, n, w);
      } else if (l in It.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            Dn(e, t, r, h[g], s + "/" + l + "/" + Og(g), o, s, l, n, g);
      } else (l in It.keywords || e.allKeys && !(l in It.skipKeywords)) && Dn(e, t, r, h, s + "/" + l, o, s, l, n);
    }
    r(n, s, o, a, u, c, d);
  }
}
function Og(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Tg = mu.exports;
Object.defineProperty(Se, "__esModule", { value: !0 });
Se.getSchemaRefs = Se.resolveUrl = Se.normalizeId = Se._getFullPath = Se.getFullPath = Se.inlineRef = void 0;
const jg = M, kg = rs, Ag = Tg, Cg = /* @__PURE__ */ new Set([
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
function Dg(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !to(e) : t ? pu(e) <= t : !1;
}
Se.inlineRef = Dg;
const Mg = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function to(e) {
  for (const t in e) {
    if (Mg.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(to) || typeof r == "object" && to(r))
      return !0;
  }
  return !1;
}
function pu(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Cg.has(r) && (typeof e[r] == "object" && (0, jg.eachItem)(e[r], (n) => t += pu(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function $u(e, t = "", r) {
  r !== !1 && (t = yr(t));
  const n = e.parse(t);
  return yu(e, n);
}
Se.getFullPath = $u;
function yu(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Se._getFullPath = yu;
const Lg = /#\/?$/;
function yr(e) {
  return e ? e.replace(Lg, "") : "";
}
Se.normalizeId = yr;
function Vg(e, t, r) {
  return r = yr(r), e.resolve(t, r);
}
Se.resolveUrl = Vg;
const Fg = /^[a-z_][-a-z0-9._]*$/i;
function Ug(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = yr(e[r] || t), o = { "": s }, a = $u(n, s, !1), u = {}, c = /* @__PURE__ */ new Set();
  return Ag(e, { allKeys: !0 }, (h, w, g, E) => {
    if (E === void 0)
      return;
    const _ = a + w;
    let $ = o[E];
    typeof h[r] == "string" && ($ = m.call(this, h[r])), v.call(this, h.$anchor), v.call(this, h.$dynamicAnchor), o[w] = $;
    function m(P) {
      const I = this.opts.uriResolver.resolve;
      if (P = yr($ ? I($, P) : P), c.has(P))
        throw l(P);
      c.add(P);
      let R = this.refs[P];
      return typeof R == "string" && (R = this.refs[R]), typeof R == "object" ? d(h, R.schema, P) : P !== yr(_) && (P[0] === "#" ? (d(h, u[P], P), u[P] = h) : this.refs[P] = _), P;
    }
    function v(P) {
      if (typeof P == "string") {
        if (!Fg.test(P))
          throw new Error(`invalid anchor "${P}"`);
        m.call(this, `#${P}`);
      }
    }
  }), u;
  function d(h, w, g) {
    if (w !== void 0 && !kg(h, w))
      throw l(g);
  }
  function l(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Se.getSchemaRefs = Ug;
Object.defineProperty(Ye, "__esModule", { value: !0 });
Ye.getData = Ye.KeywordCxt = Ye.validateFunctionCode = void 0;
const gu = vr, tc = ge, Ea = dt, Wn = ge, zg = ls, xr = st, Os = Ot, H = ee, J = ot, qg = Se, ft = M, Ur = cn;
function Gg(e) {
  if (wu(e) && (Eu(e), vu(e))) {
    Bg(e);
    return;
  }
  _u(e, () => (0, gu.topBoolOrEmptySchema)(e));
}
Ye.validateFunctionCode = Gg;
function _u({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, o) {
  s.code.es5 ? e.func(t, (0, H._)`${J.default.data}, ${J.default.valCxt}`, n.$async, () => {
    e.code((0, H._)`"use strict"; ${rc(r, s)}`), Hg(e, s), e.code(o);
  }) : e.func(t, (0, H._)`${J.default.data}, ${Kg(s)}`, n.$async, () => e.code(rc(r, s)).code(o));
}
function Kg(e) {
  return (0, H._)`{${J.default.instancePath}="", ${J.default.parentData}, ${J.default.parentDataProperty}, ${J.default.rootData}=${J.default.data}${e.dynamicRef ? (0, H._)`, ${J.default.dynamicAnchors}={}` : H.nil}}={}`;
}
function Hg(e, t) {
  e.if(J.default.valCxt, () => {
    e.var(J.default.instancePath, (0, H._)`${J.default.valCxt}.${J.default.instancePath}`), e.var(J.default.parentData, (0, H._)`${J.default.valCxt}.${J.default.parentData}`), e.var(J.default.parentDataProperty, (0, H._)`${J.default.valCxt}.${J.default.parentDataProperty}`), e.var(J.default.rootData, (0, H._)`${J.default.valCxt}.${J.default.rootData}`), t.dynamicRef && e.var(J.default.dynamicAnchors, (0, H._)`${J.default.valCxt}.${J.default.dynamicAnchors}`);
  }, () => {
    e.var(J.default.instancePath, (0, H._)`""`), e.var(J.default.parentData, (0, H._)`undefined`), e.var(J.default.parentDataProperty, (0, H._)`undefined`), e.var(J.default.rootData, J.default.data), t.dynamicRef && e.var(J.default.dynamicAnchors, (0, H._)`{}`);
  });
}
function Bg(e) {
  const { schema: t, opts: r, gen: n } = e;
  _u(e, () => {
    r.$comment && t.$comment && bu(e), xg(e), n.let(J.default.vErrors, null), n.let(J.default.errors, 0), r.unevaluated && Wg(e), Su(e), e_(e);
  });
}
function Wg(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, H._)`${r}.evaluated`), t.if((0, H._)`${e.evaluated}.dynamicProps`, () => t.assign((0, H._)`${e.evaluated}.props`, (0, H._)`undefined`)), t.if((0, H._)`${e.evaluated}.dynamicItems`, () => t.assign((0, H._)`${e.evaluated}.items`, (0, H._)`undefined`));
}
function rc(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, H._)`/*# sourceURL=${r} */` : H.nil;
}
function Xg(e, t) {
  if (wu(e) && (Eu(e), vu(e))) {
    Jg(e, t);
    return;
  }
  (0, gu.boolOrEmptySchema)(e, t);
}
function vu({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function wu(e) {
  return typeof e.schema != "boolean";
}
function Jg(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && bu(e), Zg(e), Qg(e);
  const o = n.const("_errs", J.default.errors);
  Su(e, o), n.var(t, (0, H._)`${o} === ${J.default.errors}`);
}
function Eu(e) {
  (0, ft.checkUnknownRules)(e), Yg(e);
}
function Su(e, t) {
  if (e.opts.jtd)
    return nc(e, [], !1, t);
  const r = (0, tc.getSchemaTypes)(e.schema), n = (0, tc.coerceAndCheckDataType)(e, r);
  nc(e, r, !n, t);
}
function Yg(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, ft.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function xg(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, ft.checkStrictMode)(e, "default is ignored in the schema root");
}
function Zg(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, qg.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function Qg(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function bu({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const o = r.$comment;
  if (s.$comment === !0)
    e.code((0, H._)`${J.default.self}.logger.log(${o})`);
  else if (typeof s.$comment == "function") {
    const a = (0, H.str)`${n}/$comment`, u = e.scopeValue("root", { ref: t.root });
    e.code((0, H._)`${J.default.self}.opts.$comment(${o}, ${a}, ${u}.schema)`);
  }
}
function e_(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: o } = e;
  r.$async ? t.if((0, H._)`${J.default.errors} === 0`, () => t.return(J.default.data), () => t.throw((0, H._)`new ${s}(${J.default.vErrors})`)) : (t.assign((0, H._)`${n}.errors`, J.default.vErrors), o.unevaluated && t_(e), t.return((0, H._)`${J.default.errors} === 0`));
}
function t_({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof H.Name && e.assign((0, H._)`${t}.props`, r), n instanceof H.Name && e.assign((0, H._)`${t}.items`, n);
}
function nc(e, t, r, n) {
  const { gen: s, schema: o, data: a, allErrors: u, opts: c, self: d } = e, { RULES: l } = d;
  if (o.$ref && (c.ignoreKeywordsWithRef || !(0, ft.schemaHasRulesButRef)(o, l))) {
    s.block(() => Iu(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || r_(e, t), s.block(() => {
    for (const w of l.rules)
      h(w);
    h(l.post);
  });
  function h(w) {
    (0, Ea.shouldUseGroup)(o, w) && (w.type ? (s.if((0, Wn.checkDataType)(w.type, a, c.strictNumbers)), sc(e, w), t.length === 1 && t[0] === w.type && r && (s.else(), (0, Wn.reportTypeError)(e)), s.endIf()) : sc(e, w), u || s.if((0, H._)`${J.default.errors} === ${n || 0}`));
  }
}
function sc(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, zg.assignDefaults)(e, t.type), r.block(() => {
    for (const o of t.rules)
      (0, Ea.shouldUseRule)(n, o) && Iu(e, o.keyword, o.definition, t.type);
  });
}
function r_(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (n_(e, t), e.opts.allowUnionTypes || s_(e, t), o_(e, e.dataTypes));
}
function n_(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Pu(e.dataTypes, r) || Sa(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), i_(e, t);
  }
}
function s_(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Sa(e, "use allowUnionTypes to allow union type keyword");
}
function o_(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Ea.shouldUseRule)(e.schema, s)) {
      const { type: o } = s.definition;
      o.length && !o.some((a) => a_(t, a)) && Sa(e, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function a_(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Pu(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function i_(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Pu(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Sa(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, ft.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Nu {
  constructor(t, r, n) {
    if ((0, xr.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, ft.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Ru(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, xr.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", J.default.errors));
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
    return (0, H.or)(a(), u());
    function a() {
      if (n.length) {
        if (!(r instanceof H.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, H._)`${(0, Wn.checkDataTypes)(c, r, o.opts.strictNumbers, Wn.DataType.Wrong)}`;
      }
      return H.nil;
    }
    function u() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, H._)`!${c}(${r})`;
      }
      return H.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Os.getSubschema)(this.it, t);
    (0, Os.extendSubschemaData)(n, this.it, t), (0, Os.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return Xg(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = ft.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = ft.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, H.Name)), !0;
  }
}
Ye.KeywordCxt = Nu;
function Iu(e, t, r, n) {
  const s = new Nu(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, xr.funcKeywordCode)(s, r) : "macro" in r ? (0, xr.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, xr.funcKeywordCode)(s, r);
}
const c_ = /^\/(?:[^~]|~0|~1)*$/, l_ = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Ru(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, o;
  if (e === "")
    return J.default.rootData;
  if (e[0] === "/") {
    if (!c_.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, o = J.default.rootData;
  } else {
    const d = l_.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +d[1];
    if (s = d[2], s === "#") {
      if (l >= t)
        throw new Error(c("property/index", l));
      return n[t - l];
    }
    if (l > t)
      throw new Error(c("data", l));
    if (o = r[t - l], !s)
      return o;
  }
  let a = o;
  const u = s.split("/");
  for (const d of u)
    d && (o = (0, H._)`${o}${(0, H.getProperty)((0, ft.unescapeJsonPointer)(d))}`, a = (0, H._)`${a} && ${o}`);
  return a;
  function c(d, l) {
    return `Cannot access ${d} ${l} levels up, current level is ${t}`;
  }
}
Ye.getData = Ru;
var ln = {};
Object.defineProperty(ln, "__esModule", { value: !0 });
class u_ extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
ln.default = u_;
var Rr = {};
Object.defineProperty(Rr, "__esModule", { value: !0 });
const Ts = Se;
class d_ extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Ts.resolveUrl)(t, r, n), this.missingSchema = (0, Ts.normalizeId)((0, Ts.getFullPath)(t, this.missingRef));
  }
}
Rr.default = d_;
var De = {};
Object.defineProperty(De, "__esModule", { value: !0 });
De.resolveSchema = De.getCompilingSchema = De.resolveRef = De.compileSchema = De.SchemaEnv = void 0;
const Ke = ee, f_ = ln, Ht = ot, Xe = Se, oc = M, h_ = Ye;
class us {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Xe.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
De.SchemaEnv = us;
function ba(e) {
  const t = Ou.call(this, e);
  if (t)
    return t;
  const r = (0, Xe.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: o } = this.opts, a = new Ke.CodeGen(this.scope, { es5: n, lines: s, ownProperties: o });
  let u;
  e.$async && (u = a.scopeValue("Error", {
    ref: f_.default,
    code: (0, Ke._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = a.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: a,
    allErrors: this.opts.allErrors,
    data: Ht.default.data,
    parentData: Ht.default.parentData,
    parentDataProperty: Ht.default.parentDataProperty,
    dataNames: [Ht.default.data],
    dataPathArr: [Ke.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: a.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Ke.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: u,
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
  let l;
  try {
    this._compilations.add(e), (0, h_.validateFunctionCode)(d), a.optimize(this.opts.code.optimize);
    const h = a.toString();
    l = `${a.scopeRefs(Ht.default.scope)}return ${h}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const g = new Function(`${Ht.default.self}`, `${Ht.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: h, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: E, items: _ } = d;
      g.evaluated = {
        props: E instanceof Ke.Name ? void 0 : E,
        items: _ instanceof Ke.Name ? void 0 : _,
        dynamicProps: E instanceof Ke.Name,
        dynamicItems: _ instanceof Ke.Name
      }, g.source && (g.source.evaluated = (0, Ke.stringify)(g.evaluated));
    }
    return e.validate = g, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), h;
  } finally {
    this._compilations.delete(e);
  }
}
De.compileSchema = ba;
function m_(e, t, r) {
  var n;
  r = (0, Xe.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let o = y_.call(this, e, r);
  if (o === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: u } = this.opts;
    a && (o = new us({ schema: a, schemaId: u, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[r] = p_.call(this, o);
}
De.resolveRef = m_;
function p_(e) {
  return (0, Xe.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : ba.call(this, e);
}
function Ou(e) {
  for (const t of this._compilations)
    if ($_(t, e))
      return t;
}
De.getCompilingSchema = Ou;
function $_(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function y_(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || ds.call(this, e, t);
}
function ds(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Xe._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Xe.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return js.call(this, r, e);
  const o = (0, Xe.normalizeId)(n), a = this.refs[o] || this.schemas[o];
  if (typeof a == "string") {
    const u = ds.call(this, e, a);
    return typeof (u == null ? void 0 : u.schema) != "object" ? void 0 : js.call(this, r, u);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || ba.call(this, a), o === (0, Xe.normalizeId)(t)) {
      const { schema: u } = a, { schemaId: c } = this.opts, d = u[c];
      return d && (s = (0, Xe.resolveUrl)(this.opts.uriResolver, s, d)), new us({ schema: u, schemaId: c, root: e, baseId: s });
    }
    return js.call(this, r, a);
  }
}
De.resolveSchema = ds;
const g_ = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function js(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const u of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, oc.unescapeFragment)(u)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !g_.has(u) && d && (t = (0, Xe.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let o;
  if (typeof r != "boolean" && r.$ref && !(0, oc.schemaHasRulesButRef)(r, this.RULES)) {
    const u = (0, Xe.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    o = ds.call(this, n, u);
  }
  const { schemaId: a } = this.opts;
  if (o = o || new us({ schema: r, schemaId: a, root: n, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const __ = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", v_ = "Meta-schema for $data reference (JSON AnySchema extension proposal)", w_ = "object", E_ = [
  "$data"
], S_ = {
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
}, b_ = !1, P_ = {
  $id: __,
  description: v_,
  type: w_,
  required: E_,
  properties: S_,
  additionalProperties: b_
};
var Pa = {};
Object.defineProperty(Pa, "__esModule", { value: !0 });
const Tu = Fl;
Tu.code = 'require("ajv/dist/runtime/uri").default';
Pa.default = Tu;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Ye;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = ee;
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
  const n = ln, s = Rr, o = rr, a = De, u = ee, c = Se, d = ge, l = M, h = P_, w = Pa, g = (N, p) => new RegExp(N, p);
  g.code = "new RegExp";
  const E = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
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
  }, v = 200;
  function P(N) {
    var p, b, y, i, f, S, O, j, q, U, ne, Me, Tt, jt, kt, At, Ct, Dt, Mt, Lt, Vt, Ft, Ut, zt, qt;
    const qe = N.strict, Gt = (p = N.code) === null || p === void 0 ? void 0 : p.optimize, kr = Gt === !0 || Gt === void 0 ? 1 : Gt || 0, Ar = (y = (b = N.code) === null || b === void 0 ? void 0 : b.regExp) !== null && y !== void 0 ? y : g, vs = (i = N.uriResolver) !== null && i !== void 0 ? i : w.default;
    return {
      strictSchema: (S = (f = N.strictSchema) !== null && f !== void 0 ? f : qe) !== null && S !== void 0 ? S : !0,
      strictNumbers: (j = (O = N.strictNumbers) !== null && O !== void 0 ? O : qe) !== null && j !== void 0 ? j : !0,
      strictTypes: (U = (q = N.strictTypes) !== null && q !== void 0 ? q : qe) !== null && U !== void 0 ? U : "log",
      strictTuples: (Me = (ne = N.strictTuples) !== null && ne !== void 0 ? ne : qe) !== null && Me !== void 0 ? Me : "log",
      strictRequired: (jt = (Tt = N.strictRequired) !== null && Tt !== void 0 ? Tt : qe) !== null && jt !== void 0 ? jt : !1,
      code: N.code ? { ...N.code, optimize: kr, regExp: Ar } : { optimize: kr, regExp: Ar },
      loopRequired: (kt = N.loopRequired) !== null && kt !== void 0 ? kt : v,
      loopEnum: (At = N.loopEnum) !== null && At !== void 0 ? At : v,
      meta: (Ct = N.meta) !== null && Ct !== void 0 ? Ct : !0,
      messages: (Dt = N.messages) !== null && Dt !== void 0 ? Dt : !0,
      inlineRefs: (Mt = N.inlineRefs) !== null && Mt !== void 0 ? Mt : !0,
      schemaId: (Lt = N.schemaId) !== null && Lt !== void 0 ? Lt : "$id",
      addUsedSchema: (Vt = N.addUsedSchema) !== null && Vt !== void 0 ? Vt : !0,
      validateSchema: (Ft = N.validateSchema) !== null && Ft !== void 0 ? Ft : !0,
      validateFormats: (Ut = N.validateFormats) !== null && Ut !== void 0 ? Ut : !0,
      unicodeRegExp: (zt = N.unicodeRegExp) !== null && zt !== void 0 ? zt : !0,
      int32range: (qt = N.int32range) !== null && qt !== void 0 ? qt : !0,
      uriResolver: vs
    };
  }
  class I {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...P(p) };
      const { es5: b, lines: y } = this.opts.code;
      this.scope = new u.ValueScope({ scope: {}, prefixes: _, es5: b, lines: y }), this.logger = z(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, o.getRules)(), R.call(this, $, p, "NOT SUPPORTED"), R.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = de.call(this), p.formats && se.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && ae.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), W.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: b, schemaId: y } = this.opts;
      let i = h;
      y === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), b && p && this.addMetaSchema(i, i[y], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: b } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[b] || p : void 0;
    }
    validate(p, b) {
      let y;
      if (typeof p == "string") {
        if (y = this.getSchema(p), !y)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        y = this.compile(p);
      const i = y(b);
      return "$async" in y || (this.errors = y.errors), i;
    }
    compile(p, b) {
      const y = this._addSchema(p, b);
      return y.validate || this._compileSchemaEnv(y);
    }
    compileAsync(p, b) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: y } = this.opts;
      return i.call(this, p, b);
      async function i(U, ne) {
        await f.call(this, U.$schema);
        const Me = this._addSchema(U, ne);
        return Me.validate || S.call(this, Me);
      }
      async function f(U) {
        U && !this.getSchema(U) && await i.call(this, { $ref: U }, !0);
      }
      async function S(U) {
        try {
          return this._compileSchemaEnv(U);
        } catch (ne) {
          if (!(ne instanceof s.default))
            throw ne;
          return O.call(this, ne), await j.call(this, ne.missingSchema), S.call(this, U);
        }
      }
      function O({ missingSchema: U, missingRef: ne }) {
        if (this.refs[U])
          throw new Error(`AnySchema ${U} is loaded but ${ne} cannot be resolved`);
      }
      async function j(U) {
        const ne = await q.call(this, U);
        this.refs[U] || await f.call(this, ne.$schema), this.refs[U] || this.addSchema(ne, U, b);
      }
      async function q(U) {
        const ne = this._loading[U];
        if (ne)
          return ne;
        try {
          return await (this._loading[U] = y(U));
        } finally {
          delete this._loading[U];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, b, y, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const S of p)
          this.addSchema(S, void 0, y, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: S } = this.opts;
        if (f = p[S], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return b = (0, c.normalizeId)(b || f), this._checkUnique(b), this.schemas[b] = this._addSchema(p, y, b, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, b, y = this.opts.validateSchema) {
      return this.addSchema(p, b, !0, y), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, b) {
      if (typeof p == "boolean")
        return !0;
      let y;
      if (y = p.$schema, y !== void 0 && typeof y != "string")
        throw new Error("$schema must be a string");
      if (y = y || this.opts.defaultMeta || this.defaultMeta(), !y)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate(y, p);
      if (!i && b) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return i;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(p) {
      let b;
      for (; typeof (b = L.call(this, p)) == "string"; )
        p = b;
      if (b === void 0) {
        const { schemaId: y } = this.opts, i = new a.SchemaEnv({ schema: {}, schemaId: y });
        if (b = a.resolveSchema.call(this, i, p), !b)
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
          const b = L.call(this, p);
          return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const b = p;
          this._cache.delete(b);
          let y = p[this.opts.schemaId];
          return y && (y = (0, c.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
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
      let y;
      if (typeof p == "string")
        y = p, typeof b == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), b.keyword = y);
      else if (typeof p == "object" && b === void 0) {
        if (b = p, y = b.keyword, Array.isArray(y) && !y.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (T.call(this, y, b), !b)
        return (0, l.eachItem)(y, (f) => k.call(this, f)), this;
      C.call(this, b);
      const i = {
        ...b,
        type: (0, d.getJSONTypes)(b.type),
        schemaType: (0, d.getJSONTypes)(b.schemaType)
      };
      return (0, l.eachItem)(y, i.type.length === 0 ? (f) => k.call(this, f, i) : (f) => i.type.forEach((S) => k.call(this, f, i, S))), this;
    }
    getKeyword(p) {
      const b = this.RULES.all[p];
      return typeof b == "object" ? b.definition : !!b;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: b } = this;
      delete b.keywords[p], delete b.all[p];
      for (const y of b.rules) {
        const i = y.rules.findIndex((f) => f.keyword === p);
        i >= 0 && y.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, b) {
      return typeof b == "string" && (b = new RegExp(b)), this.formats[p] = b, this;
    }
    errorsText(p = this.errors, { separator: b = ", ", dataVar: y = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${y}${i.instancePath} ${i.message}`).reduce((i, f) => i + b + f);
    }
    $dataMetaSchema(p, b) {
      const y = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of b) {
        const f = i.split("/").slice(1);
        let S = p;
        for (const O of f)
          S = S[O];
        for (const O in y) {
          const j = y[O];
          if (typeof j != "object")
            continue;
          const { $data: q } = j.definition, U = S[O];
          q && U && (S[O] = D(U));
        }
      }
      return p;
    }
    _removeAllSchemas(p, b) {
      for (const y in p) {
        const i = p[y];
        (!b || b.test(y)) && (typeof i == "string" ? delete p[y] : i && !i.meta && (this._cache.delete(i.schema), delete p[y]));
      }
    }
    _addSchema(p, b, y, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let S;
      const { schemaId: O } = this.opts;
      if (typeof p == "object")
        S = p[O];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let j = this._cache.get(p);
      if (j !== void 0)
        return j;
      y = (0, c.normalizeId)(S || y);
      const q = c.getSchemaRefs.call(this, p, y);
      return j = new a.SchemaEnv({ schema: p, schemaId: O, meta: b, baseId: y, localRefs: q }), this._cache.set(j.schema, j), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = j), i && this.validateSchema(p, !0), j;
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
  function R(N, p, b, y = "error") {
    for (const i in N) {
      const f = i;
      f in p && this.logger[y](`${b}: option ${i}. ${N[f]}`);
    }
  }
  function L(N) {
    return N = (0, c.normalizeId)(N), this.schemas[N] || this.refs[N];
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
  function se() {
    for (const N in this.opts.formats) {
      const p = this.opts.formats[N];
      p && this.addFormat(N, p);
    }
  }
  function ae(N) {
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
  function de() {
    const N = { ...this.opts };
    for (const p of E)
      delete N[p];
    return N;
  }
  const F = { log() {
  }, warn() {
  }, error() {
  } };
  function z(N) {
    if (N === !1)
      return F;
    if (N === void 0)
      return console;
    if (N.log && N.warn && N.error)
      return N;
    throw new Error("logger must implement log, warn and error methods");
  }
  const oe = /^[a-z_$][a-z0-9_$:-]*$/i;
  function T(N, p) {
    const { RULES: b } = this;
    if ((0, l.eachItem)(N, (y) => {
      if (b.keywords[y])
        throw new Error(`Keyword ${y} is already defined`);
      if (!oe.test(y))
        throw new Error(`Keyword ${y} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(N, p, b) {
    var y;
    const i = p == null ? void 0 : p.post;
    if (b && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let S = i ? f.post : f.rules.find(({ type: j }) => j === b);
    if (S || (S = { type: b, rules: [] }, f.rules.push(S)), f.keywords[N] = !0, !p)
      return;
    const O = {
      keyword: N,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? V.call(this, S, O, p.before) : S.rules.push(O), f.all[N] = O, (y = p.implements) === null || y === void 0 || y.forEach((j) => this.addKeyword(j));
  }
  function V(N, p, b) {
    const y = N.rules.findIndex((i) => i.keyword === b);
    y >= 0 ? N.rules.splice(y, 0, p) : (N.rules.push(p), this.logger.warn(`rule ${b} is not defined`));
  }
  function C(N) {
    let { metaSchema: p } = N;
    p !== void 0 && (N.$data && this.opts.$data && (p = D(p)), N.validateSchema = this.compile(p, !0));
  }
  const G = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function D(N) {
    return { anyOf: [N, G] };
  }
})(Zl);
var Na = {}, Ia = {}, Ra = {};
Object.defineProperty(Ra, "__esModule", { value: !0 });
const N_ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Ra.default = N_;
var nr = {};
Object.defineProperty(nr, "__esModule", { value: !0 });
nr.callRef = nr.getValidate = void 0;
const I_ = Rr, ac = re, Ce = ee, ir = ot, ic = De, gn = M, R_ = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: o, validateName: a, opts: u, self: c } = n, { root: d } = o;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const l = ic.resolveRef.call(c, d, s, r);
    if (l === void 0)
      throw new I_.default(n.opts.uriResolver, s, r);
    if (l instanceof ic.SchemaEnv)
      return w(l);
    return g(l);
    function h() {
      if (o === d)
        return Mn(e, a, o, o.$async);
      const E = t.scopeValue("root", { ref: d });
      return Mn(e, (0, Ce._)`${E}.validate`, d, d.$async);
    }
    function w(E) {
      const _ = ju(e, E);
      Mn(e, _, E, E.$async);
    }
    function g(E) {
      const _ = t.scopeValue("schema", u.code.source === !0 ? { ref: E, code: (0, Ce.stringify)(E) } : { ref: E }), $ = t.name("valid"), m = e.subschema({
        schema: E,
        dataTypes: [],
        schemaPath: Ce.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, $);
      e.mergeEvaluated(m), e.ok($);
    }
  }
};
function ju(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ce._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
nr.getValidate = ju;
function Mn(e, t, r, n) {
  const { gen: s, it: o } = e, { allErrors: a, schemaEnv: u, opts: c } = o, d = c.passContext ? ir.default.this : Ce.nil;
  n ? l() : h();
  function l() {
    if (!u.$async)
      throw new Error("async schema referenced by sync schema");
    const E = s.let("valid");
    s.try(() => {
      s.code((0, Ce._)`await ${(0, ac.callValidateCode)(e, t, d)}`), g(t), a || s.assign(E, !0);
    }, (_) => {
      s.if((0, Ce._)`!(${_} instanceof ${o.ValidationError})`, () => s.throw(_)), w(_), a || s.assign(E, !1);
    }), e.ok(E);
  }
  function h() {
    e.result((0, ac.callValidateCode)(e, t, d), () => g(t), () => w(t));
  }
  function w(E) {
    const _ = (0, Ce._)`${E}.errors`;
    s.assign(ir.default.vErrors, (0, Ce._)`${ir.default.vErrors} === null ? ${_} : ${ir.default.vErrors}.concat(${_})`), s.assign(ir.default.errors, (0, Ce._)`${ir.default.vErrors}.length`);
  }
  function g(E) {
    var _;
    if (!o.opts.unevaluated)
      return;
    const $ = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (o.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (o.props = gn.mergeEvaluated.props(s, $.props, o.props));
      else {
        const m = s.var("props", (0, Ce._)`${E}.evaluated.props`);
        o.props = gn.mergeEvaluated.props(s, m, o.props, Ce.Name);
      }
    if (o.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (o.items = gn.mergeEvaluated.items(s, $.items, o.items));
      else {
        const m = s.var("items", (0, Ce._)`${E}.evaluated.items`);
        o.items = gn.mergeEvaluated.items(s, m, o.items, Ce.Name);
      }
  }
}
nr.callRef = Mn;
nr.default = R_;
Object.defineProperty(Ia, "__esModule", { value: !0 });
const O_ = Ra, T_ = nr, j_ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  O_.default,
  T_.default
];
Ia.default = j_;
var Oa = {}, Ta = {};
Object.defineProperty(Ta, "__esModule", { value: !0 });
const Xn = ee, wt = Xn.operators, Jn = {
  maximum: { okStr: "<=", ok: wt.LTE, fail: wt.GT },
  minimum: { okStr: ">=", ok: wt.GTE, fail: wt.LT },
  exclusiveMaximum: { okStr: "<", ok: wt.LT, fail: wt.GTE },
  exclusiveMinimum: { okStr: ">", ok: wt.GT, fail: wt.LTE }
}, k_ = {
  message: ({ keyword: e, schemaCode: t }) => (0, Xn.str)`must be ${Jn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Xn._)`{comparison: ${Jn[e].okStr}, limit: ${t}}`
}, A_ = {
  keyword: Object.keys(Jn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: k_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Xn._)`${r} ${Jn[t].fail} ${n} || isNaN(${r})`);
  }
};
Ta.default = A_;
var ja = {};
Object.defineProperty(ja, "__esModule", { value: !0 });
const Zr = ee, C_ = {
  message: ({ schemaCode: e }) => (0, Zr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Zr._)`{multipleOf: ${e}}`
}, D_ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: C_,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, o = s.opts.multipleOfPrecision, a = t.let("res"), u = o ? (0, Zr._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, Zr._)`${a} !== parseInt(${a})`;
    e.fail$data((0, Zr._)`(${n} === 0 || (${a} = ${r}/${n}, ${u}))`);
  }
};
ja.default = D_;
var ka = {}, Aa = {};
Object.defineProperty(Aa, "__esModule", { value: !0 });
function ku(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Aa.default = ku;
ku.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(ka, "__esModule", { value: !0 });
const xt = ee, M_ = M, L_ = Aa, V_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, xt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, xt._)`{limit: ${e}}`
}, F_ = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: V_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, o = t === "maxLength" ? xt.operators.GT : xt.operators.LT, a = s.opts.unicode === !1 ? (0, xt._)`${r}.length` : (0, xt._)`${(0, M_.useFunc)(e.gen, L_.default)}(${r})`;
    e.fail$data((0, xt._)`${a} ${o} ${n}`);
  }
};
ka.default = F_;
var Ca = {};
Object.defineProperty(Ca, "__esModule", { value: !0 });
const U_ = re, Yn = ee, z_ = {
  message: ({ schemaCode: e }) => (0, Yn.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Yn._)`{pattern: ${e}}`
}, q_ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: z_,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: o } = e, a = o.opts.unicodeRegExp ? "u" : "", u = r ? (0, Yn._)`(new RegExp(${s}, ${a}))` : (0, U_.usePattern)(e, n);
    e.fail$data((0, Yn._)`!${u}.test(${t})`);
  }
};
Ca.default = q_;
var Da = {};
Object.defineProperty(Da, "__esModule", { value: !0 });
const Qr = ee, G_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Qr.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Qr._)`{limit: ${e}}`
}, K_ = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: G_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Qr.operators.GT : Qr.operators.LT;
    e.fail$data((0, Qr._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Da.default = K_;
var Ma = {};
Object.defineProperty(Ma, "__esModule", { value: !0 });
const zr = re, en = ee, H_ = M, B_ = {
  message: ({ params: { missingProperty: e } }) => (0, en.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, en._)`{missingProperty: ${e}}`
}, W_ = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: B_,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: o, it: a } = e, { opts: u } = a;
    if (!o && r.length === 0)
      return;
    const c = r.length >= u.loopRequired;
    if (a.allErrors ? d() : l(), u.strictRequired) {
      const g = e.parentSchema.properties, { definedProperties: E } = e.it;
      for (const _ of r)
        if ((g == null ? void 0 : g[_]) === void 0 && !E.has(_)) {
          const $ = a.schemaEnv.baseId + a.errSchemaPath, m = `required property "${_}" is not defined at "${$}" (strictRequired)`;
          (0, H_.checkStrictMode)(a, m, a.opts.strictRequired);
        }
    }
    function d() {
      if (c || o)
        e.block$data(en.nil, h);
      else
        for (const g of r)
          (0, zr.checkReportMissingProp)(e, g);
    }
    function l() {
      const g = t.let("missing");
      if (c || o) {
        const E = t.let("valid", !0);
        e.block$data(E, () => w(g, E)), e.ok(E);
      } else
        t.if((0, zr.checkMissingProp)(e, r, g)), (0, zr.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, zr.noPropertyInData)(t, s, g, u.ownProperties), () => e.error());
      });
    }
    function w(g, E) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(E, (0, zr.propertyInData)(t, s, g, u.ownProperties)), t.if((0, en.not)(E), () => {
          e.error(), t.break();
        });
      }, en.nil);
    }
  }
};
Ma.default = W_;
var La = {};
Object.defineProperty(La, "__esModule", { value: !0 });
const tn = ee, X_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, tn.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, tn._)`{limit: ${e}}`
}, J_ = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: X_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? tn.operators.GT : tn.operators.LT;
    e.fail$data((0, tn._)`${r}.length ${s} ${n}`);
  }
};
La.default = J_;
var Va = {}, un = {};
Object.defineProperty(un, "__esModule", { value: !0 });
const Au = rs;
Au.code = 'require("ajv/dist/runtime/equal").default';
un.default = Au;
Object.defineProperty(Va, "__esModule", { value: !0 });
const ks = ge, we = ee, Y_ = M, x_ = un, Z_ = {
  message: ({ params: { i: e, j: t } }) => (0, we.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, we._)`{i: ${e}, j: ${t}}`
}, Q_ = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Z_,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: o, schemaCode: a, it: u } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = o.items ? (0, ks.getSchemaTypes)(o.items) : [];
    e.block$data(c, l, (0, we._)`${a} === false`), e.ok(c);
    function l() {
      const E = t.let("i", (0, we._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: E, j: _ }), t.assign(c, !0), t.if((0, we._)`${E} > 1`, () => (h() ? w : g)(E, _));
    }
    function h() {
      return d.length > 0 && !d.some((E) => E === "object" || E === "array");
    }
    function w(E, _) {
      const $ = t.name("item"), m = (0, ks.checkDataTypes)(d, $, u.opts.strictNumbers, ks.DataType.Wrong), v = t.const("indices", (0, we._)`{}`);
      t.for((0, we._)`;${E}--;`, () => {
        t.let($, (0, we._)`${r}[${E}]`), t.if(m, (0, we._)`continue`), d.length > 1 && t.if((0, we._)`typeof ${$} == "string"`, (0, we._)`${$} += "_"`), t.if((0, we._)`typeof ${v}[${$}] == "number"`, () => {
          t.assign(_, (0, we._)`${v}[${$}]`), e.error(), t.assign(c, !1).break();
        }).code((0, we._)`${v}[${$}] = ${E}`);
      });
    }
    function g(E, _) {
      const $ = (0, Y_.useFunc)(t, x_.default), m = t.name("outer");
      t.label(m).for((0, we._)`;${E}--;`, () => t.for((0, we._)`${_} = ${E}; ${_}--;`, () => t.if((0, we._)`${$}(${r}[${E}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Va.default = Q_;
var Fa = {};
Object.defineProperty(Fa, "__esModule", { value: !0 });
const ro = ee, ev = M, tv = un, rv = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, ro._)`{allowedValue: ${e}}`
}, nv = {
  keyword: "const",
  $data: !0,
  error: rv,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: o } = e;
    n || o && typeof o == "object" ? e.fail$data((0, ro._)`!${(0, ev.useFunc)(t, tv.default)}(${r}, ${s})`) : e.fail((0, ro._)`${o} !== ${r}`);
  }
};
Fa.default = nv;
var Ua = {};
Object.defineProperty(Ua, "__esModule", { value: !0 });
const Hr = ee, sv = M, ov = un, av = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Hr._)`{allowedValues: ${e}}`
}, iv = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: av,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const u = s.length >= a.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, sv.useFunc)(t, ov.default));
    let l;
    if (u || n)
      l = t.let("valid"), e.block$data(l, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", o);
      l = (0, Hr.or)(...s.map((E, _) => w(g, _)));
    }
    e.pass(l);
    function h() {
      t.assign(l, !1), t.forOf("v", o, (g) => t.if((0, Hr._)`${d()}(${r}, ${g})`, () => t.assign(l, !0).break()));
    }
    function w(g, E) {
      const _ = s[E];
      return typeof _ == "object" && _ !== null ? (0, Hr._)`${d()}(${r}, ${g}[${E}])` : (0, Hr._)`${r} === ${_}`;
    }
  }
};
Ua.default = iv;
Object.defineProperty(Oa, "__esModule", { value: !0 });
const cv = Ta, lv = ja, uv = ka, dv = Ca, fv = Da, hv = Ma, mv = La, pv = Va, $v = Fa, yv = Ua, gv = [
  // number
  cv.default,
  lv.default,
  // string
  uv.default,
  dv.default,
  // object
  fv.default,
  hv.default,
  // array
  mv.default,
  pv.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  $v.default,
  yv.default
];
Oa.default = gv;
var za = {}, Or = {};
Object.defineProperty(Or, "__esModule", { value: !0 });
Or.validateAdditionalItems = void 0;
const Zt = ee, no = M, _v = {
  message: ({ params: { len: e } }) => (0, Zt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Zt._)`{limit: ${e}}`
}, vv = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: _v,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, no.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Cu(e, n);
  }
};
function Cu(e, t) {
  const { gen: r, schema: n, data: s, keyword: o, it: a } = e;
  a.items = !0;
  const u = r.const("len", (0, Zt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Zt._)`${u} <= ${t.length}`);
  else if (typeof n == "object" && !(0, no.alwaysValidSchema)(a, n)) {
    const d = r.var("valid", (0, Zt._)`${u} <= ${t.length}`);
    r.if((0, Zt.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, u, (l) => {
      e.subschema({ keyword: o, dataProp: l, dataPropType: no.Type.Num }, d), a.allErrors || r.if((0, Zt.not)(d), () => r.break());
    });
  }
}
Or.validateAdditionalItems = Cu;
Or.default = vv;
var qa = {}, Tr = {};
Object.defineProperty(Tr, "__esModule", { value: !0 });
Tr.validateTuple = void 0;
const cc = ee, Ln = M, wv = re, Ev = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Du(e, "additionalItems", t);
    r.items = !0, !(0, Ln.alwaysValidSchema)(r, t) && e.ok((0, wv.validateArray)(e));
  }
};
function Du(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: o, keyword: a, it: u } = e;
  l(s), u.opts.unevaluated && r.length && u.items !== !0 && (u.items = Ln.mergeEvaluated.items(n, r.length, u.items));
  const c = n.name("valid"), d = n.const("len", (0, cc._)`${o}.length`);
  r.forEach((h, w) => {
    (0, Ln.alwaysValidSchema)(u, h) || (n.if((0, cc._)`${d} > ${w}`, () => e.subschema({
      keyword: a,
      schemaProp: w,
      dataProp: w
    }, c)), e.ok(c));
  });
  function l(h) {
    const { opts: w, errSchemaPath: g } = u, E = r.length, _ = E === h.minItems && (E === h.maxItems || h[t] === !1);
    if (w.strictTuples && !_) {
      const $ = `"${a}" is ${E}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, Ln.checkStrictMode)(u, $, w.strictTuples);
    }
  }
}
Tr.validateTuple = Du;
Tr.default = Ev;
Object.defineProperty(qa, "__esModule", { value: !0 });
const Sv = Tr, bv = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, Sv.validateTuple)(e, "items")
};
qa.default = bv;
var Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
const lc = ee, Pv = M, Nv = re, Iv = Or, Rv = {
  message: ({ params: { len: e } }) => (0, lc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, lc._)`{limit: ${e}}`
}, Ov = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Rv,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, Pv.alwaysValidSchema)(n, t) && (s ? (0, Iv.validateAdditionalItems)(e, s) : e.ok((0, Nv.validateArray)(e)));
  }
};
Ga.default = Ov;
var Ka = {};
Object.defineProperty(Ka, "__esModule", { value: !0 });
const ze = ee, _n = M, Tv = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, ze.str)`must contain at least ${e} valid item(s)` : (0, ze.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, ze._)`{minContains: ${e}}` : (0, ze._)`{minContains: ${e}, maxContains: ${t}}`
}, jv = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Tv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    let a, u;
    const { minContains: c, maxContains: d } = n;
    o.opts.next ? (a = c === void 0 ? 1 : c, u = d) : a = 1;
    const l = t.const("len", (0, ze._)`${s}.length`);
    if (e.setParams({ min: a, max: u }), u === void 0 && a === 0) {
      (0, _n.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (u !== void 0 && a > u) {
      (0, _n.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, _n.alwaysValidSchema)(o, r)) {
      let _ = (0, ze._)`${l} >= ${a}`;
      u !== void 0 && (_ = (0, ze._)`${_} && ${l} <= ${u}`), e.pass(_);
      return;
    }
    o.items = !0;
    const h = t.name("valid");
    u === void 0 && a === 1 ? g(h, () => t.if(h, () => t.break())) : a === 0 ? (t.let(h, !0), u !== void 0 && t.if((0, ze._)`${s}.length > 0`, w)) : (t.let(h, !1), w()), e.result(h, () => e.reset());
    function w() {
      const _ = t.name("_valid"), $ = t.let("count", 0);
      g(_, () => t.if(_, () => E($)));
    }
    function g(_, $) {
      t.forRange("i", 0, l, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: _n.Type.Num,
          compositeRule: !0
        }, _), $();
      });
    }
    function E(_) {
      t.code((0, ze._)`${_}++`), u === void 0 ? t.if((0, ze._)`${_} >= ${a}`, () => t.assign(h, !0).break()) : (t.if((0, ze._)`${_} > ${u}`, () => t.assign(h, !1).break()), a === 1 ? t.assign(h, !0) : t.if((0, ze._)`${_} >= ${a}`, () => t.assign(h, !0)));
    }
  }
};
Ka.default = jv;
var Mu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = ee, r = M, n = re;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: l } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: l, missingProperty: h } }) => (0, t._)`{property: ${c},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${l}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [d, l] = o(c);
      a(c, d), u(c, l);
    }
  };
  function o({ schema: c }) {
    const d = {}, l = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const w = Array.isArray(c[h]) ? d : l;
      w[h] = c[h];
    }
    return [d, l];
  }
  function a(c, d = c.schema) {
    const { gen: l, data: h, it: w } = c;
    if (Object.keys(d).length === 0)
      return;
    const g = l.let("missing");
    for (const E in d) {
      const _ = d[E];
      if (_.length === 0)
        continue;
      const $ = (0, n.propertyInData)(l, h, E, w.opts.ownProperties);
      c.setParams({
        property: E,
        depsCount: _.length,
        deps: _.join(", ")
      }), w.allErrors ? l.if($, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (l.if((0, t._)`${$} && (${(0, n.checkMissingProp)(c, _, g)})`), (0, n.reportMissingProp)(c, g), l.else());
    }
  }
  e.validatePropertyDeps = a;
  function u(c, d = c.schema) {
    const { gen: l, data: h, keyword: w, it: g } = c, E = l.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)(g, d[_]) || (l.if(
        (0, n.propertyInData)(l, h, _, g.opts.ownProperties),
        () => {
          const $ = c.subschema({ keyword: w, schemaProp: _ }, E);
          c.mergeValidEvaluated($, E);
        },
        () => l.var(E, !0)
        // TODO var
      ), c.ok(E));
  }
  e.validateSchemaDeps = u, e.default = s;
})(Mu);
var Ha = {};
Object.defineProperty(Ha, "__esModule", { value: !0 });
const Lu = ee, kv = M, Av = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Lu._)`{propertyName: ${e.propertyName}}`
}, Cv = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Av,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, kv.alwaysValidSchema)(s, r))
      return;
    const o = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, o), t.if((0, Lu.not)(o), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
Ha.default = Cv;
var fs = {};
Object.defineProperty(fs, "__esModule", { value: !0 });
const vn = re, Be = ee, Dv = ot, wn = M, Mv = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Be._)`{additionalProperty: ${e.additionalProperty}}`
}, Lv = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Mv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: o, it: a } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: u, opts: c } = a;
    if (a.props = !0, c.removeAdditional !== "all" && (0, wn.alwaysValidSchema)(a, r))
      return;
    const d = (0, vn.allSchemaProperties)(n.properties), l = (0, vn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Be._)`${o} === ${Dv.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !l.length ? E($) : t.if(w($), () => E($));
      });
    }
    function w($) {
      let m;
      if (d.length > 8) {
        const v = (0, wn.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, vn.isOwnProperty)(t, v, $);
      } else d.length ? m = (0, Be.or)(...d.map((v) => (0, Be._)`${$} === ${v}`)) : m = Be.nil;
      return l.length && (m = (0, Be.or)(m, ...l.map((v) => (0, Be._)`${(0, vn.usePattern)(e, v)}.test(${$})`))), (0, Be.not)(m);
    }
    function g($) {
      t.code((0, Be._)`delete ${s}[${$}]`);
    }
    function E($) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        g($);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: $ }), e.error(), u || t.break();
        return;
      }
      if (typeof r == "object" && !(0, wn.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_($, m, !1), t.if((0, Be.not)(m), () => {
          e.reset(), g($);
        })) : (_($, m), u || t.if((0, Be.not)(m), () => t.break()));
      }
    }
    function _($, m, v) {
      const P = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: wn.Type.Str
      };
      v === !1 && Object.assign(P, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(P, m);
    }
  }
};
fs.default = Lv;
var Ba = {};
Object.defineProperty(Ba, "__esModule", { value: !0 });
const Vv = Ye, uc = re, As = M, dc = fs, Fv = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && dc.default.code(new Vv.KeywordCxt(o, dc.default, "additionalProperties"));
    const a = (0, uc.allSchemaProperties)(r);
    for (const h of a)
      o.definedProperties.add(h);
    o.opts.unevaluated && a.length && o.props !== !0 && (o.props = As.mergeEvaluated.props(t, (0, As.toHash)(a), o.props));
    const u = a.filter((h) => !(0, As.alwaysValidSchema)(o, r[h]));
    if (u.length === 0)
      return;
    const c = t.name("valid");
    for (const h of u)
      d(h) ? l(h) : (t.if((0, uc.propertyInData)(t, s, h, o.opts.ownProperties)), l(h), o.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return o.opts.useDefaults && !o.compositeRule && r[h].default !== void 0;
    }
    function l(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
Ba.default = Fv;
var Wa = {};
Object.defineProperty(Wa, "__esModule", { value: !0 });
const fc = re, En = ee, hc = M, mc = M, Uv = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: o } = e, { opts: a } = o, u = (0, fc.allSchemaProperties)(r), c = u.filter((_) => (0, hc.alwaysValidSchema)(o, r[_]));
    if (u.length === 0 || c.length === u.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const d = a.strictSchema && !a.allowMatchingProperties && s.properties, l = t.name("valid");
    o.props !== !0 && !(o.props instanceof En.Name) && (o.props = (0, mc.evaluatedPropsToName)(t, o.props));
    const { props: h } = o;
    w();
    function w() {
      for (const _ of u)
        d && g(_), o.allErrors ? E(_) : (t.var(l, !0), E(_), t.if(l));
    }
    function g(_) {
      for (const $ in d)
        new RegExp(_).test($) && (0, hc.checkStrictMode)(o, `property ${$} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function E(_) {
      t.forIn("key", n, ($) => {
        t.if((0, En._)`${(0, fc.usePattern)(e, _)}.test(${$})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: $,
            dataPropType: mc.Type.Str
          }, l), o.opts.unevaluated && h !== !0 ? t.assign((0, En._)`${h}[${$}]`, !0) : !m && !o.allErrors && t.if((0, En.not)(l), () => t.break());
        });
      });
    }
  }
};
Wa.default = Uv;
var Xa = {};
Object.defineProperty(Xa, "__esModule", { value: !0 });
const zv = M, qv = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, zv.alwaysValidSchema)(n, r)) {
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
Xa.default = qv;
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
const Gv = re, Kv = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Gv.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Ja.default = Kv;
var Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
const Vn = ee, Hv = M, Bv = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Vn._)`{passingSchemas: ${e.passing}}`
}, Wv = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Bv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const o = r, a = t.let("valid", !1), u = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: u }), t.block(d), e.result(a, () => e.reset(), () => e.error(!0));
    function d() {
      o.forEach((l, h) => {
        let w;
        (0, Hv.alwaysValidSchema)(s, l) ? t.var(c, !0) : w = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, Vn._)`${c} && ${a}`).assign(a, !1).assign(u, (0, Vn._)`[${u}, ${h}]`).else(), t.if(c, () => {
          t.assign(a, !0), t.assign(u, h), w && e.mergeEvaluated(w, Vn.Name);
        });
      });
    }
  }
};
Ya.default = Wv;
var xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
const Xv = M, Jv = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((o, a) => {
      if ((0, Xv.alwaysValidSchema)(n, o))
        return;
      const u = e.subschema({ keyword: "allOf", schemaProp: a }, s);
      e.ok(s), e.mergeEvaluated(u);
    });
  }
};
xa.default = Jv;
var Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
const xn = ee, Vu = M, Yv = {
  message: ({ params: e }) => (0, xn.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, xn._)`{failingKeyword: ${e.ifClause}}`
}, xv = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Yv,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Vu.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = pc(n, "then"), o = pc(n, "else");
    if (!s && !o)
      return;
    const a = t.let("valid", !0), u = t.name("_valid");
    if (c(), e.reset(), s && o) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(u, d("then", l), d("else", l));
    } else s ? t.if(u, d("then")) : t.if((0, xn.not)(u), d("else"));
    e.pass(a, () => e.error(!0));
    function c() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, u);
      e.mergeEvaluated(l);
    }
    function d(l, h) {
      return () => {
        const w = e.subschema({ keyword: l }, u);
        t.assign(a, u), e.mergeValidEvaluated(w, a), h ? t.assign(h, (0, xn._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function pc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Vu.alwaysValidSchema)(e, r);
}
Za.default = xv;
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
const Zv = M, Qv = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Zv.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Qa.default = Qv;
Object.defineProperty(za, "__esModule", { value: !0 });
const ew = Or, tw = qa, rw = Tr, nw = Ga, sw = Ka, ow = Mu, aw = Ha, iw = fs, cw = Ba, lw = Wa, uw = Xa, dw = Ja, fw = Ya, hw = xa, mw = Za, pw = Qa;
function $w(e = !1) {
  const t = [
    // any
    uw.default,
    dw.default,
    fw.default,
    hw.default,
    mw.default,
    pw.default,
    // object
    aw.default,
    iw.default,
    ow.default,
    cw.default,
    lw.default
  ];
  return e ? t.push(tw.default, nw.default) : t.push(ew.default, rw.default), t.push(sw.default), t;
}
za.default = $w;
var ei = {}, ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
const pe = ee, yw = {
  message: ({ schemaCode: e }) => (0, pe.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, pe._)`{format: ${e}}`
}, gw = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: yw,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: o, schemaCode: a, it: u } = e, { opts: c, errSchemaPath: d, schemaEnv: l, self: h } = u;
    if (!c.validateFormats)
      return;
    s ? w() : g();
    function w() {
      const E = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, pe._)`${E}[${a}]`), $ = r.let("fType"), m = r.let("format");
      r.if((0, pe._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign($, (0, pe._)`${_}.type || "string"`).assign(m, (0, pe._)`${_}.validate`), () => r.assign($, (0, pe._)`"string"`).assign(m, _)), e.fail$data((0, pe.or)(v(), P()));
      function v() {
        return c.strictSchema === !1 ? pe.nil : (0, pe._)`${a} && !${m}`;
      }
      function P() {
        const I = l.$async ? (0, pe._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, pe._)`${m}(${n})`, R = (0, pe._)`(typeof ${m} == "function" ? ${I} : ${m}.test(${n}))`;
        return (0, pe._)`${m} && ${m} !== true && ${$} === ${t} && !${R}`;
      }
    }
    function g() {
      const E = h.formats[o];
      if (!E) {
        v();
        return;
      }
      if (E === !0)
        return;
      const [_, $, m] = P(E);
      _ === t && e.pass(I());
      function v() {
        if (c.strictSchema === !1) {
          h.logger.warn(R());
          return;
        }
        throw new Error(R());
        function R() {
          return `unknown format "${o}" ignored in schema at path "${d}"`;
        }
      }
      function P(R) {
        const L = R instanceof RegExp ? (0, pe.regexpCode)(R) : c.code.formats ? (0, pe._)`${c.code.formats}${(0, pe.getProperty)(o)}` : void 0, W = r.scopeValue("formats", { key: o, ref: R, code: L });
        return typeof R == "object" && !(R instanceof RegExp) ? [R.type || "string", R.validate, (0, pe._)`${W}.validate`] : ["string", R, W];
      }
      function I() {
        if (typeof E == "object" && !(E instanceof RegExp) && E.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, pe._)`await ${m}(${n})`;
        }
        return typeof $ == "function" ? (0, pe._)`${m}(${n})` : (0, pe._)`${m}.test(${n})`;
      }
    }
  }
};
ti.default = gw;
Object.defineProperty(ei, "__esModule", { value: !0 });
const _w = ti, vw = [_w.default];
ei.default = vw;
var wr = {};
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.contentVocabulary = wr.metadataVocabulary = void 0;
wr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
wr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Na, "__esModule", { value: !0 });
const ww = Ia, Ew = Oa, Sw = za, bw = ei, $c = wr, Pw = [
  ww.default,
  Ew.default,
  (0, Sw.default)(),
  bw.default,
  $c.metadataVocabulary,
  $c.contentVocabulary
];
Na.default = Pw;
var ri = {}, hs = {};
Object.defineProperty(hs, "__esModule", { value: !0 });
hs.DiscrError = void 0;
var yc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(yc || (hs.DiscrError = yc = {}));
Object.defineProperty(ri, "__esModule", { value: !0 });
const fr = ee, so = hs, gc = De, Nw = Rr, Iw = M, Rw = {
  message: ({ params: { discrError: e, tagName: t } }) => e === so.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, fr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, Ow = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Rw,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: o } = e, { oneOf: a } = s;
    if (!o.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const u = n.propertyName;
    if (typeof u != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!a)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, fr._)`${r}${(0, fr.getProperty)(u)}`);
    t.if((0, fr._)`typeof ${d} == "string"`, () => l(), () => e.error(!1, { discrError: so.DiscrError.Tag, tag: d, tagName: u })), e.ok(c);
    function l() {
      const g = w();
      t.if(!1);
      for (const E in g)
        t.elseIf((0, fr._)`${d} === ${E}`), t.assign(c, h(g[E]));
      t.else(), e.error(!1, { discrError: so.DiscrError.Mapping, tag: d, tagName: u }), t.endIf();
    }
    function h(g) {
      const E = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: g }, E);
      return e.mergeEvaluated(_, fr.Name), E;
    }
    function w() {
      var g;
      const E = {}, _ = m(s);
      let $ = !0;
      for (let I = 0; I < a.length; I++) {
        let R = a[I];
        if (R != null && R.$ref && !(0, Iw.schemaHasRulesButRef)(R, o.self.RULES)) {
          const W = R.$ref;
          if (R = gc.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, W), R instanceof gc.SchemaEnv && (R = R.schema), R === void 0)
            throw new Nw.default(o.opts.uriResolver, o.baseId, W);
        }
        const L = (g = R == null ? void 0 : R.properties) === null || g === void 0 ? void 0 : g[u];
        if (typeof L != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${u}"`);
        $ = $ && (_ || m(R)), v(L, I);
      }
      if (!$)
        throw new Error(`discriminator: "${u}" must be required`);
      return E;
      function m({ required: I }) {
        return Array.isArray(I) && I.includes(u);
      }
      function v(I, R) {
        if (I.const)
          P(I.const, R);
        else if (I.enum)
          for (const L of I.enum)
            P(L, R);
        else
          throw new Error(`discriminator: "properties/${u}" must have "const" or "enum"`);
      }
      function P(I, R) {
        if (typeof I != "string" || I in E)
          throw new Error(`discriminator: "${u}" values must be unique strings`);
        E[I] = R;
      }
    }
  }
};
ri.default = Ow;
const Tw = "http://json-schema.org/draft-07/schema#", jw = "http://json-schema.org/draft-07/schema#", kw = "Core schema meta-schema", Aw = {
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
}, Cw = [
  "object",
  "boolean"
], Dw = {
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
}, Mw = {
  $schema: Tw,
  $id: jw,
  title: kw,
  definitions: Aw,
  type: Cw,
  properties: Dw,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = Zl, n = Na, s = ri, o = Mw, a = ["/properties"], u = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((E) => this.addVocabulary(E)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const E = this.opts.$data ? this.$dataMetaSchema(o, a) : o;
      this.addMetaSchema(E, u, !1), this.refs["http://json-schema.org/schema"] = u;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(u) ? u : void 0);
    }
  }
  t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var d = Ye;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var l = ee;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return l._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return l.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return l.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return l.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return l.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return l.CodeGen;
  } });
  var h = ln;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var w = Rr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return w.default;
  } });
})(xs, xs.exports);
var Lw = xs.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = Lw, r = ee, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, o = {
    message: ({ keyword: u, schemaCode: c }) => (0, r.str)`should be ${s[u].okStr} ${c}`,
    params: ({ keyword: u, schemaCode: c }) => (0, r._)`{comparison: ${s[u].okStr}, limit: ${c}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: o,
    code(u) {
      const { gen: c, data: d, schemaCode: l, keyword: h, it: w } = u, { opts: g, self: E } = w;
      if (!g.validateFormats)
        return;
      const _ = new t.KeywordCxt(w, E.RULES.all.format.definition, "format");
      _.$data ? $() : m();
      function $() {
        const P = c.scopeValue("formats", {
          ref: E.formats,
          code: g.code.formats
        }), I = c.const("fmt", (0, r._)`${P}[${_.schemaCode}]`);
        u.fail$data((0, r.or)((0, r._)`typeof ${I} != "object"`, (0, r._)`${I} instanceof RegExp`, (0, r._)`typeof ${I}.compare != "function"`, v(I)));
      }
      function m() {
        const P = _.schema, I = E.formats[P];
        if (!I || I === !0)
          return;
        if (typeof I != "object" || I instanceof RegExp || typeof I.compare != "function")
          throw new Error(`"${h}": format "${P}" does not define "compare" function`);
        const R = c.scopeValue("formats", {
          key: P,
          ref: I,
          code: g.code.formats ? (0, r._)`${g.code.formats}${(0, r.getProperty)(P)}` : void 0
        });
        u.fail$data(v(R));
      }
      function v(P) {
        return (0, r._)`${P}.compare(${d}, ${l}) ${s[h].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const a = (u) => (u.addKeyword(e.formatLimitDefinition), u);
  e.default = a;
})(xl);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = Yl, n = xl, s = ee, o = new s.Name("fullFormats"), a = new s.Name("fastFormats"), u = (d, l = { keywords: !0 }) => {
    if (Array.isArray(l))
      return c(d, l, r.fullFormats, o), d;
    const [h, w] = l.mode === "fast" ? [r.fastFormats, a] : [r.fullFormats, o], g = l.formats || r.formatNames;
    return c(d, g, h, w), l.keywords && (0, n.default)(d), d;
  };
  u.get = (d, l = "full") => {
    const w = (l === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!w)
      throw new Error(`Unknown format "${d}"`);
    return w;
  };
  function c(d, l, h, w) {
    var g, E;
    (g = (E = d.opts.code).formats) !== null && g !== void 0 || (E.formats = (0, s._)`require("ajv-formats/dist/formats").${w}`);
    for (const _ of l)
      d.addFormat(_, h[_]);
  }
  e.exports = t = u, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = u;
})(Ys, Ys.exports);
var Vw = Ys.exports;
const Fw = /* @__PURE__ */ Zc(Vw), Uw = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), o = Object.getOwnPropertyDescriptor(t, r);
  !zw(s, o) && n || Object.defineProperty(e, r, o);
}, zw = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, qw = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, Gw = (e, t) => `/* Wrapped ${e}*/
${t}`, Kw = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), Hw = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), Bw = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = Gw.bind(null, n, t.toString());
  Object.defineProperty(s, "name", Hw);
  const { writable: o, enumerable: a, configurable: u } = Kw;
  Object.defineProperty(e, "toString", { value: s, writable: o, enumerable: a, configurable: u });
};
function Ww(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    Uw(e, t, s, r);
  return qw(e, t), Bw(e, t, n), e;
}
const _c = (e, t = {}) => {
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
  let a, u, c;
  const d = function(...l) {
    const h = this, w = () => {
      a = void 0, u && (clearTimeout(u), u = void 0), o && (c = e.apply(h, l));
    }, g = () => {
      u = void 0, a && (clearTimeout(a), a = void 0), o && (c = e.apply(h, l));
    }, E = s && !a;
    return clearTimeout(a), a = setTimeout(w, r), n > 0 && n !== Number.POSITIVE_INFINITY && !u && (u = setTimeout(g, n)), E && (c = e.apply(h, l)), c;
  };
  return Ww(d, e), d.cancel = () => {
    a && (clearTimeout(a), a = void 0), u && (clearTimeout(u), u = void 0);
  }, d;
};
var oo = { exports: {} };
const Xw = "2.0.0", Fu = 256, Jw = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, Yw = 16, xw = Fu - 6, Zw = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var ms = {
  MAX_LENGTH: Fu,
  MAX_SAFE_COMPONENT_LENGTH: Yw,
  MAX_SAFE_BUILD_LENGTH: xw,
  MAX_SAFE_INTEGER: Jw,
  RELEASE_TYPES: Zw,
  SEMVER_SPEC_VERSION: Xw,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Qw = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var ps = Qw;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = ms, o = ps;
  t = e.exports = {};
  const a = t.re = [], u = t.safeRe = [], c = t.src = [], d = t.safeSrc = [], l = t.t = {};
  let h = 0;
  const w = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", s],
    [w, n]
  ], E = ($) => {
    for (const [m, v] of g)
      $ = $.split(`${m}*`).join(`${m}{0,${v}}`).split(`${m}+`).join(`${m}{1,${v}}`);
    return $;
  }, _ = ($, m, v) => {
    const P = E(m), I = h++;
    o($, I, m), l[$] = I, c[I] = m, d[I] = P, a[I] = new RegExp(m, v ? "g" : void 0), u[I] = new RegExp(P, v ? "g" : void 0);
  };
  _("NUMERICIDENTIFIER", "0|[1-9]\\d*"), _("NUMERICIDENTIFIERLOOSE", "\\d+"), _("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${w}*`), _("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), _("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), _("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), _("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), _("BUILDIDENTIFIER", `${w}+`), _("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), _("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), _("FULL", `^${c[l.FULLPLAIN]}$`), _("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), _("LOOSE", `^${c[l.LOOSEPLAIN]}$`), _("GTLT", "((?:<|>)?=?)"), _("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), _("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), _("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), _("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), _("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), _("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), _("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), _("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), _("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), _("COERCERTL", c[l.COERCE], !0), _("COERCERTLFULL", c[l.COERCEFULL], !0), _("LONETILDE", "(?:~>?)"), _("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", _("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), _("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), _("LONECARET", "(?:\\^)"), _("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", _("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), _("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), _("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), _("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), _("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", _("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), _("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), _("STAR", "(<|>)?=?\\s*\\*"), _("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), _("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(oo, oo.exports);
var dn = oo.exports;
const eE = Object.freeze({ loose: !0 }), tE = Object.freeze({}), rE = (e) => e ? typeof e != "object" ? eE : e : tE;
var ni = rE;
const vc = /^[0-9]+$/, Uu = (e, t) => {
  const r = vc.test(e), n = vc.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, nE = (e, t) => Uu(t, e);
var zu = {
  compareIdentifiers: Uu,
  rcompareIdentifiers: nE
};
const Sn = ps, { MAX_LENGTH: wc, MAX_SAFE_INTEGER: bn } = ms, { safeRe: Pn, t: Nn } = dn, sE = ni, { compareIdentifiers: cr } = zu;
let oE = class Qe {
  constructor(t, r) {
    if (r = sE(r), t instanceof Qe) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > wc)
      throw new TypeError(
        `version is longer than ${wc} characters`
      );
    Sn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Pn[Nn.LOOSE] : Pn[Nn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > bn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > bn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > bn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const o = +s;
        if (o >= 0 && o < bn)
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
    if (Sn("SemVer.compare", this.version, this.options, t), !(t instanceof Qe)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new Qe(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof Qe || (t = new Qe(t, this.options)), cr(this.major, t.major) || cr(this.minor, t.minor) || cr(this.patch, t.patch);
  }
  comparePre(t) {
    if (t instanceof Qe || (t = new Qe(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = t.prerelease[r];
      if (Sn("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return cr(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof Qe || (t = new Qe(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (Sn("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return cr(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? Pn[Nn.PRERELEASELOOSE] : Pn[Nn.PRERELEASE]);
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
          n === !1 && (o = [r]), cr(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var ke = oE;
const Ec = ke, aE = (e, t, r = !1) => {
  if (e instanceof Ec)
    return e;
  try {
    return new Ec(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var jr = aE;
const iE = jr, cE = (e, t) => {
  const r = iE(e, t);
  return r ? r.version : null;
};
var lE = cE;
const uE = jr, dE = (e, t) => {
  const r = uE(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var fE = dE;
const Sc = ke, hE = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Sc(
      e instanceof Sc ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var mE = hE;
const bc = jr, pE = (e, t) => {
  const r = bc(e, null, !0), n = bc(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const o = s > 0, a = o ? r : n, u = o ? n : r, c = !!a.prerelease.length;
  if (!!u.prerelease.length && !c) {
    if (!u.patch && !u.minor)
      return "major";
    if (u.compareMain(a) === 0)
      return u.minor && !u.patch ? "minor" : "patch";
  }
  const l = c ? "pre" : "";
  return r.major !== n.major ? l + "major" : r.minor !== n.minor ? l + "minor" : r.patch !== n.patch ? l + "patch" : "prerelease";
};
var $E = pE;
const yE = ke, gE = (e, t) => new yE(e, t).major;
var _E = gE;
const vE = ke, wE = (e, t) => new vE(e, t).minor;
var EE = wE;
const SE = ke, bE = (e, t) => new SE(e, t).patch;
var PE = bE;
const NE = jr, IE = (e, t) => {
  const r = NE(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var RE = IE;
const Pc = ke, OE = (e, t, r) => new Pc(e, r).compare(new Pc(t, r));
var xe = OE;
const TE = xe, jE = (e, t, r) => TE(t, e, r);
var kE = jE;
const AE = xe, CE = (e, t) => AE(e, t, !0);
var DE = CE;
const Nc = ke, ME = (e, t, r) => {
  const n = new Nc(e, r), s = new Nc(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var si = ME;
const LE = si, VE = (e, t) => e.sort((r, n) => LE(r, n, t));
var FE = VE;
const UE = si, zE = (e, t) => e.sort((r, n) => UE(n, r, t));
var qE = zE;
const GE = xe, KE = (e, t, r) => GE(e, t, r) > 0;
var $s = KE;
const HE = xe, BE = (e, t, r) => HE(e, t, r) < 0;
var oi = BE;
const WE = xe, XE = (e, t, r) => WE(e, t, r) === 0;
var qu = XE;
const JE = xe, YE = (e, t, r) => JE(e, t, r) !== 0;
var Gu = YE;
const xE = xe, ZE = (e, t, r) => xE(e, t, r) >= 0;
var ai = ZE;
const QE = xe, e1 = (e, t, r) => QE(e, t, r) <= 0;
var ii = e1;
const t1 = qu, r1 = Gu, n1 = $s, s1 = ai, o1 = oi, a1 = ii, i1 = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return t1(e, r, n);
    case "!=":
      return r1(e, r, n);
    case ">":
      return n1(e, r, n);
    case ">=":
      return s1(e, r, n);
    case "<":
      return o1(e, r, n);
    case "<=":
      return a1(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Ku = i1;
const c1 = ke, l1 = jr, { safeRe: In, t: Rn } = dn, u1 = (e, t) => {
  if (e instanceof c1)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? In[Rn.COERCEFULL] : In[Rn.COERCE]);
  else {
    const c = t.includePrerelease ? In[Rn.COERCERTLFULL] : In[Rn.COERCERTL];
    let d;
    for (; (d = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), c.lastIndex = d.index + d[1].length + d[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", o = r[4] || "0", a = t.includePrerelease && r[5] ? `-${r[5]}` : "", u = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return l1(`${n}.${s}.${o}${a}${u}`, t);
};
var d1 = u1;
class f1 {
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
var h1 = f1, Cs, Ic;
function Ze() {
  if (Ic) return Cs;
  Ic = 1;
  const e = /\s+/g;
  class t {
    constructor(k, V) {
      if (V = s(V), k instanceof t)
        return k.loose === !!V.loose && k.includePrerelease === !!V.includePrerelease ? k : new t(k.raw, V);
      if (k instanceof o)
        return this.raw = k.value, this.set = [[k]], this.formatted = void 0, this;
      if (this.options = V, this.loose = !!V.loose, this.includePrerelease = !!V.includePrerelease, this.raw = k.trim().replace(e, " "), this.set = this.raw.split("||").map((C) => this.parseRange(C.trim())).filter((C) => C.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const C = this.set[0];
        if (this.set = this.set.filter((G) => !_(G[0])), this.set.length === 0)
          this.set = [C];
        else if (this.set.length > 1) {
          for (const G of this.set)
            if (G.length === 1 && $(G[0])) {
              this.set = [G];
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
          const V = this.set[k];
          for (let C = 0; C < V.length; C++)
            C > 0 && (this.formatted += " "), this.formatted += V[C].toString().trim();
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
      const C = ((this.options.includePrerelease && g) | (this.options.loose && E)) + ":" + k, G = n.get(C);
      if (G)
        return G;
      const D = this.options.loose, N = D ? c[d.HYPHENRANGELOOSE] : c[d.HYPHENRANGE];
      k = k.replace(N, z(this.options.includePrerelease)), a("hyphen replace", k), k = k.replace(c[d.COMPARATORTRIM], l), a("comparator trim", k), k = k.replace(c[d.TILDETRIM], h), a("tilde trim", k), k = k.replace(c[d.CARETTRIM], w), a("caret trim", k);
      let p = k.split(" ").map((f) => v(f, this.options)).join(" ").split(/\s+/).map((f) => F(f, this.options));
      D && (p = p.filter((f) => (a("loose invalid filter", f, this.options), !!f.match(c[d.COMPARATORLOOSE])))), a("range list", p);
      const b = /* @__PURE__ */ new Map(), y = p.map((f) => new o(f, this.options));
      for (const f of y) {
        if (_(f))
          return [f];
        b.set(f.value, f);
      }
      b.size > 1 && b.has("") && b.delete("");
      const i = [...b.values()];
      return n.set(C, i), i;
    }
    intersects(k, V) {
      if (!(k instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((C) => m(C, V) && k.set.some((G) => m(G, V) && C.every((D) => G.every((N) => D.intersects(N, V)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(k) {
      if (!k)
        return !1;
      if (typeof k == "string")
        try {
          k = new u(k, this.options);
        } catch {
          return !1;
        }
      for (let V = 0; V < this.set.length; V++)
        if (oe(this.set[V], k, this.options))
          return !0;
      return !1;
    }
  }
  Cs = t;
  const r = h1, n = new r(), s = ni, o = ys(), a = ps, u = ke, {
    safeRe: c,
    t: d,
    comparatorTrimReplace: l,
    tildeTrimReplace: h,
    caretTrimReplace: w
  } = dn, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: E } = ms, _ = (T) => T.value === "<0.0.0-0", $ = (T) => T.value === "", m = (T, k) => {
    let V = !0;
    const C = T.slice();
    let G = C.pop();
    for (; V && C.length; )
      V = C.every((D) => G.intersects(D, k)), G = C.pop();
    return V;
  }, v = (T, k) => (a("comp", T, k), T = L(T, k), a("caret", T), T = I(T, k), a("tildes", T), T = se(T, k), a("xrange", T), T = de(T, k), a("stars", T), T), P = (T) => !T || T.toLowerCase() === "x" || T === "*", I = (T, k) => T.trim().split(/\s+/).map((V) => R(V, k)).join(" "), R = (T, k) => {
    const V = k.loose ? c[d.TILDELOOSE] : c[d.TILDE];
    return T.replace(V, (C, G, D, N, p) => {
      a("tilde", T, C, G, D, N, p);
      let b;
      return P(G) ? b = "" : P(D) ? b = `>=${G}.0.0 <${+G + 1}.0.0-0` : P(N) ? b = `>=${G}.${D}.0 <${G}.${+D + 1}.0-0` : p ? (a("replaceTilde pr", p), b = `>=${G}.${D}.${N}-${p} <${G}.${+D + 1}.0-0`) : b = `>=${G}.${D}.${N} <${G}.${+D + 1}.0-0`, a("tilde return", b), b;
    });
  }, L = (T, k) => T.trim().split(/\s+/).map((V) => W(V, k)).join(" "), W = (T, k) => {
    a("caret", T, k);
    const V = k.loose ? c[d.CARETLOOSE] : c[d.CARET], C = k.includePrerelease ? "-0" : "";
    return T.replace(V, (G, D, N, p, b) => {
      a("caret", T, G, D, N, p, b);
      let y;
      return P(D) ? y = "" : P(N) ? y = `>=${D}.0.0${C} <${+D + 1}.0.0-0` : P(p) ? D === "0" ? y = `>=${D}.${N}.0${C} <${D}.${+N + 1}.0-0` : y = `>=${D}.${N}.0${C} <${+D + 1}.0.0-0` : b ? (a("replaceCaret pr", b), D === "0" ? N === "0" ? y = `>=${D}.${N}.${p}-${b} <${D}.${N}.${+p + 1}-0` : y = `>=${D}.${N}.${p}-${b} <${D}.${+N + 1}.0-0` : y = `>=${D}.${N}.${p}-${b} <${+D + 1}.0.0-0`) : (a("no pr"), D === "0" ? N === "0" ? y = `>=${D}.${N}.${p}${C} <${D}.${N}.${+p + 1}-0` : y = `>=${D}.${N}.${p}${C} <${D}.${+N + 1}.0-0` : y = `>=${D}.${N}.${p} <${+D + 1}.0.0-0`), a("caret return", y), y;
    });
  }, se = (T, k) => (a("replaceXRanges", T, k), T.split(/\s+/).map((V) => ae(V, k)).join(" ")), ae = (T, k) => {
    T = T.trim();
    const V = k.loose ? c[d.XRANGELOOSE] : c[d.XRANGE];
    return T.replace(V, (C, G, D, N, p, b) => {
      a("xRange", T, C, G, D, N, p, b);
      const y = P(D), i = y || P(N), f = i || P(p), S = f;
      return G === "=" && S && (G = ""), b = k.includePrerelease ? "-0" : "", y ? G === ">" || G === "<" ? C = "<0.0.0-0" : C = "*" : G && S ? (i && (N = 0), p = 0, G === ">" ? (G = ">=", i ? (D = +D + 1, N = 0, p = 0) : (N = +N + 1, p = 0)) : G === "<=" && (G = "<", i ? D = +D + 1 : N = +N + 1), G === "<" && (b = "-0"), C = `${G + D}.${N}.${p}${b}`) : i ? C = `>=${D}.0.0${b} <${+D + 1}.0.0-0` : f && (C = `>=${D}.${N}.0${b} <${D}.${+N + 1}.0-0`), a("xRange return", C), C;
    });
  }, de = (T, k) => (a("replaceStars", T, k), T.trim().replace(c[d.STAR], "")), F = (T, k) => (a("replaceGTE0", T, k), T.trim().replace(c[k.includePrerelease ? d.GTE0PRE : d.GTE0], "")), z = (T) => (k, V, C, G, D, N, p, b, y, i, f, S) => (P(C) ? V = "" : P(G) ? V = `>=${C}.0.0${T ? "-0" : ""}` : P(D) ? V = `>=${C}.${G}.0${T ? "-0" : ""}` : N ? V = `>=${V}` : V = `>=${V}${T ? "-0" : ""}`, P(y) ? b = "" : P(i) ? b = `<${+y + 1}.0.0-0` : P(f) ? b = `<${y}.${+i + 1}.0-0` : S ? b = `<=${y}.${i}.${f}-${S}` : T ? b = `<${y}.${i}.${+f + 1}-0` : b = `<=${b}`, `${V} ${b}`.trim()), oe = (T, k, V) => {
    for (let C = 0; C < T.length; C++)
      if (!T[C].test(k))
        return !1;
    if (k.prerelease.length && !V.includePrerelease) {
      for (let C = 0; C < T.length; C++)
        if (a(T[C].semver), T[C].semver !== o.ANY && T[C].semver.prerelease.length > 0) {
          const G = T[C].semver;
          if (G.major === k.major && G.minor === k.minor && G.patch === k.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Cs;
}
var Ds, Rc;
function ys() {
  if (Rc) return Ds;
  Rc = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(l, h) {
      if (h = r(h), l instanceof t) {
        if (l.loose === !!h.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), a("comparator", l, h), this.options = h, this.loose = !!h.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(l) {
      const h = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], w = l.match(h);
      if (!w)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = w[1] !== void 0 ? w[1] : "", this.operator === "=" && (this.operator = ""), w[2] ? this.semver = new u(w[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (a("Comparator.test", l, this.options.loose), this.semver === e || l === e)
        return !0;
      if (typeof l == "string")
        try {
          l = new u(l, this.options);
        } catch {
          return !1;
        }
      return o(l, this.operator, this.semver, this.options);
    }
    intersects(l, h) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(l.value, h).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new c(this.value, h).test(l.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || o(this.semver, "<", l.semver, h) && this.operator.startsWith(">") && l.operator.startsWith("<") || o(this.semver, ">", l.semver, h) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  Ds = t;
  const r = ni, { safeRe: n, t: s } = dn, o = Ku, a = ps, u = ke, c = Ze();
  return Ds;
}
const m1 = Ze(), p1 = (e, t, r) => {
  try {
    t = new m1(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var gs = p1;
const $1 = Ze(), y1 = (e, t) => new $1(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var g1 = y1;
const _1 = ke, v1 = Ze(), w1 = (e, t, r) => {
  let n = null, s = null, o = null;
  try {
    o = new v1(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || s.compare(a) === -1) && (n = a, s = new _1(n, r));
  }), n;
};
var E1 = w1;
const S1 = ke, b1 = Ze(), P1 = (e, t, r) => {
  let n = null, s = null, o = null;
  try {
    o = new b1(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || s.compare(a) === 1) && (n = a, s = new S1(n, r));
  }), n;
};
var N1 = P1;
const Ms = ke, I1 = Ze(), Oc = $s, R1 = (e, t) => {
  e = new I1(e, t);
  let r = new Ms("0.0.0");
  if (e.test(r) || (r = new Ms("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let o = null;
    s.forEach((a) => {
      const u = new Ms(a.semver.version);
      switch (a.operator) {
        case ">":
          u.prerelease.length === 0 ? u.patch++ : u.prerelease.push(0), u.raw = u.format();
        case "":
        case ">=":
          (!o || Oc(u, o)) && (o = u);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!r || Oc(r, o)) && (r = o);
  }
  return r && e.test(r) ? r : null;
};
var O1 = R1;
const T1 = Ze(), j1 = (e, t) => {
  try {
    return new T1(e, t).range || "*";
  } catch {
    return null;
  }
};
var k1 = j1;
const A1 = ke, Hu = ys(), { ANY: C1 } = Hu, D1 = Ze(), M1 = gs, Tc = $s, jc = oi, L1 = ii, V1 = ai, F1 = (e, t, r, n) => {
  e = new A1(e, n), t = new D1(t, n);
  let s, o, a, u, c;
  switch (r) {
    case ">":
      s = Tc, o = L1, a = jc, u = ">", c = ">=";
      break;
    case "<":
      s = jc, o = V1, a = Tc, u = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (M1(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const l = t.set[d];
    let h = null, w = null;
    if (l.forEach((g) => {
      g.semver === C1 && (g = new Hu(">=0.0.0")), h = h || g, w = w || g, s(g.semver, h.semver, n) ? h = g : a(g.semver, w.semver, n) && (w = g);
    }), h.operator === u || h.operator === c || (!w.operator || w.operator === u) && o(e, w.semver))
      return !1;
    if (w.operator === c && a(e, w.semver))
      return !1;
  }
  return !0;
};
var ci = F1;
const U1 = ci, z1 = (e, t, r) => U1(e, t, ">", r);
var q1 = z1;
const G1 = ci, K1 = (e, t, r) => G1(e, t, "<", r);
var H1 = K1;
const kc = Ze(), B1 = (e, t, r) => (e = new kc(e, r), t = new kc(t, r), e.intersects(t, r));
var W1 = B1;
const X1 = gs, J1 = xe;
var Y1 = (e, t, r) => {
  const n = [];
  let s = null, o = null;
  const a = e.sort((l, h) => J1(l, h, r));
  for (const l of a)
    X1(l, t, r) ? (o = l, s || (s = l)) : (o && n.push([s, o]), o = null, s = null);
  s && n.push([s, null]);
  const u = [];
  for (const [l, h] of n)
    l === h ? u.push(l) : !h && l === a[0] ? u.push("*") : h ? l === a[0] ? u.push(`<=${h}`) : u.push(`${l} - ${h}`) : u.push(`>=${l}`);
  const c = u.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < d.length ? c : t;
};
const Ac = Ze(), li = ys(), { ANY: Ls } = li, qr = gs, ui = xe, x1 = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Ac(e, r), t = new Ac(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const o of t.set) {
      const a = Q1(s, o, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, Z1 = [new li(">=0.0.0-0")], Cc = [new li(">=0.0.0")], Q1 = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Ls) {
    if (t.length === 1 && t[0].semver === Ls)
      return !0;
    r.includePrerelease ? e = Z1 : e = Cc;
  }
  if (t.length === 1 && t[0].semver === Ls) {
    if (r.includePrerelease)
      return !0;
    t = Cc;
  }
  const n = /* @__PURE__ */ new Set();
  let s, o;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? s = Dc(s, g, r) : g.operator === "<" || g.operator === "<=" ? o = Mc(o, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let a;
  if (s && o) {
    if (a = ui(s.semver, o.semver, r), a > 0)
      return null;
    if (a === 0 && (s.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const g of n) {
    if (s && !qr(g, String(s), r) || o && !qr(g, String(o), r))
      return null;
    for (const E of t)
      if (!qr(g, String(E), r))
        return !1;
    return !0;
  }
  let u, c, d, l, h = o && !r.includePrerelease && o.semver.prerelease.length ? o.semver : !1, w = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && o.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const g of t) {
    if (l = l || g.operator === ">" || g.operator === ">=", d = d || g.operator === "<" || g.operator === "<=", s) {
      if (w && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === w.major && g.semver.minor === w.minor && g.semver.patch === w.patch && (w = !1), g.operator === ">" || g.operator === ">=") {
        if (u = Dc(s, g, r), u === g && u !== s)
          return !1;
      } else if (s.operator === ">=" && !qr(s.semver, String(g), r))
        return !1;
    }
    if (o) {
      if (h && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === h.major && g.semver.minor === h.minor && g.semver.patch === h.patch && (h = !1), g.operator === "<" || g.operator === "<=") {
        if (c = Mc(o, g, r), c === g && c !== o)
          return !1;
      } else if (o.operator === "<=" && !qr(o.semver, String(g), r))
        return !1;
    }
    if (!g.operator && (o || s) && a !== 0)
      return !1;
  }
  return !(s && d && !o && a !== 0 || o && l && !s && a !== 0 || w || h);
}, Dc = (e, t, r) => {
  if (!e)
    return t;
  const n = ui(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Mc = (e, t, r) => {
  if (!e)
    return t;
  const n = ui(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var eS = x1;
const Vs = dn, Lc = ms, tS = ke, Vc = zu, rS = jr, nS = lE, sS = fE, oS = mE, aS = $E, iS = _E, cS = EE, lS = PE, uS = RE, dS = xe, fS = kE, hS = DE, mS = si, pS = FE, $S = qE, yS = $s, gS = oi, _S = qu, vS = Gu, wS = ai, ES = ii, SS = Ku, bS = d1, PS = ys(), NS = Ze(), IS = gs, RS = g1, OS = E1, TS = N1, jS = O1, kS = k1, AS = ci, CS = q1, DS = H1, MS = W1, LS = Y1, VS = eS;
var FS = {
  parse: rS,
  valid: nS,
  clean: sS,
  inc: oS,
  diff: aS,
  major: iS,
  minor: cS,
  patch: lS,
  prerelease: uS,
  compare: dS,
  rcompare: fS,
  compareLoose: hS,
  compareBuild: mS,
  sort: pS,
  rsort: $S,
  gt: yS,
  lt: gS,
  eq: _S,
  neq: vS,
  gte: wS,
  lte: ES,
  cmp: SS,
  coerce: bS,
  Comparator: PS,
  Range: NS,
  satisfies: IS,
  toComparators: RS,
  maxSatisfying: OS,
  minSatisfying: TS,
  minVersion: jS,
  validRange: kS,
  outside: AS,
  gtr: CS,
  ltr: DS,
  intersects: MS,
  simplifyRange: LS,
  subset: VS,
  SemVer: tS,
  re: Vs.re,
  src: Vs.src,
  tokens: Vs.t,
  SEMVER_SPEC_VERSION: Lc.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Lc.RELEASE_TYPES,
  compareIdentifiers: Vc.compareIdentifiers,
  rcompareIdentifiers: Vc.rcompareIdentifiers
};
const lr = /* @__PURE__ */ Zc(FS), US = Object.prototype.toString, zS = "[object Uint8Array]", qS = "[object ArrayBuffer]";
function Bu(e, t, r) {
  return e ? e.constructor === t ? !0 : US.call(e) === r : !1;
}
function Wu(e) {
  return Bu(e, Uint8Array, zS);
}
function GS(e) {
  return Bu(e, ArrayBuffer, qS);
}
function KS(e) {
  return Wu(e) || GS(e);
}
function HS(e) {
  if (!Wu(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function BS(e) {
  if (!KS(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Fc(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, o) => s + o.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    HS(s), r.set(s, n), n += s.length;
  return r;
}
const On = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Uc(e, t = "utf8") {
  return BS(e), On[t] ?? (On[t] = new globalThis.TextDecoder(t)), On[t].decode(e);
}
function WS(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const XS = new globalThis.TextEncoder();
function Fs(e) {
  return WS(e), XS.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const JS = Fw.default, zc = "aes-256-cbc", ur = () => /* @__PURE__ */ Object.create(null), YS = (e) => e != null, xS = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Fn = "__internal__", Us = `${Fn}.migrations.version`;
var Pt, it, Ve, ct;
class ZS {
  constructor(t = {}) {
    Cr(this, "path");
    Cr(this, "events");
    Dr(this, Pt);
    Dr(this, it);
    Dr(this, Ve);
    Dr(this, ct, {});
    Cr(this, "_deserialize", (t) => JSON.parse(t));
    Cr(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
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
      r.cwd = _d(r.projectName, { suffix: r.projectSuffix }).config;
    }
    if (Mr(this, Ve, r), r.schema ?? r.ajvOptions ?? r.rootSchema) {
      if (r.schema && typeof r.schema != "object")
        throw new TypeError("The `schema` option must be an object.");
      const a = new N0.Ajv2020({
        allErrors: !0,
        useDefaults: !0,
        ...r.ajvOptions
      });
      JS(a);
      const u = {
        ...r.rootSchema,
        type: "object",
        properties: r.schema
      };
      Mr(this, Pt, a.compile(u));
      for (const [c, d] of Object.entries(r.schema ?? {}))
        d != null && d.default && (fe(this, ct)[c] = d.default);
    }
    r.defaults && Mr(this, ct, {
      ...fe(this, ct),
      ...r.defaults
    }), r.serialize && (this._serialize = r.serialize), r.deserialize && (this._deserialize = r.deserialize), this.events = new EventTarget(), Mr(this, it, r.encryptionKey);
    const n = r.fileExtension ? `.${r.fileExtension}` : "";
    this.path = B.resolve(r.cwd, `${r.configName ?? "config"}${n}`);
    const s = this.store, o = Object.assign(ur(), r.defaults, s);
    if (r.migrations) {
      if (!r.projectVersion)
        throw new Error("Please specify the `projectVersion` option.");
      this._migrate(r.migrations, r.projectVersion, r.beforeEachMigration);
    }
    this._validate(o);
    try {
      ud.deepEqual(s, o);
    } catch {
      this.store = o;
    }
    r.watch && this._watch();
  }
  get(t, r) {
    if (fe(this, Ve).accessPropertiesByDotNotation)
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
      throw new TypeError(`Please don't use the ${Fn} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (o, a) => {
      xS(o, a), fe(this, Ve).accessPropertiesByDotNotation ? pi(n, o, a) : n[o] = a;
    };
    if (typeof t == "object") {
      const o = t;
      for (const [a, u] of Object.entries(o))
        s(a, u);
    } else
      s(t, r);
    this.store = n;
  }
  has(t) {
    return fe(this, Ve).accessPropertiesByDotNotation ? pd(this.store, t) : t in this.store;
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      YS(fe(this, ct)[r]) && this.set(r, fe(this, ct)[r]);
  }
  delete(t) {
    const { store: r } = this;
    fe(this, Ve).accessPropertiesByDotNotation ? md(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    this.store = ur();
    for (const t of Object.keys(fe(this, ct)))
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
      const t = Q.readFileSync(this.path, fe(this, it) ? null : "utf8"), r = this._encryptData(t), n = this._deserialize(r);
      return this._validate(n), Object.assign(ur(), n);
    } catch (t) {
      if ((t == null ? void 0 : t.code) === "ENOENT")
        return this._ensureDirectory(), ur();
      if (fe(this, Ve).clearInvalidConfig && t.name === "SyntaxError")
        return ur();
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
    if (!fe(this, it))
      return typeof t == "string" ? t : Uc(t);
    try {
      const r = t.slice(0, 16), n = Lr.pbkdf2Sync(fe(this, it), r.toString(), 1e4, 32, "sha512"), s = Lr.createDecipheriv(zc, n, r), o = t.slice(17), a = typeof o == "string" ? Fs(o) : o;
      return Uc(Fc([s.update(a), s.final()]));
    } catch {
    }
    return t.toString();
  }
  _handleChange(t, r) {
    let n = t();
    const s = () => {
      const o = n, a = t();
      ld(a, o) || (n = a, r.call(this, a, o));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(t) {
    if (!fe(this, Pt) || fe(this, Pt).call(this, t) || !fe(this, Pt).errors)
      return;
    const n = fe(this, Pt).errors.map(({ instancePath: s, message: o = "" }) => `\`${s.slice(1)}\` ${o}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    Q.mkdirSync(B.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    if (fe(this, it)) {
      const n = Lr.randomBytes(16), s = Lr.pbkdf2Sync(fe(this, it), n.toString(), 1e4, 32, "sha512"), o = Lr.createCipheriv(zc, s, n);
      r = Fc([n, Fs(":"), o.update(Fs(r)), o.final()]);
    }
    if (_e.env.SNAP)
      Q.writeFileSync(this.path, r, { mode: fe(this, Ve).configFileMode });
    else
      try {
        xc(this.path, r, { mode: fe(this, Ve).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          Q.writeFileSync(this.path, r, { mode: fe(this, Ve).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    this._ensureDirectory(), Q.existsSync(this.path) || this._write(ur()), _e.platform === "win32" ? Q.watch(this.path, { persistent: !1 }, _c(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 100 })) : Q.watchFile(this.path, { persistent: !1 }, _c(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 5e3 }));
  }
  _migrate(t, r, n) {
    let s = this._get(Us, "0.0.0");
    const o = Object.keys(t).filter((u) => this._shouldPerformMigration(u, s, r));
    let a = { ...this.store };
    for (const u of o)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: u,
          finalVersion: r,
          versions: o
        });
        const c = t[u];
        c == null || c(this), this._set(Us, u), s = u, a = { ...this.store };
      } catch (c) {
        throw this.store = a, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${c}`);
      }
    (this._isVersionInRangeFormat(s) || !lr.eq(s, r)) && this._set(Us, r);
  }
  _containsReservedKey(t) {
    return typeof t == "object" && Object.keys(t)[0] === Fn ? !0 : typeof t != "string" ? !1 : fe(this, Ve).accessPropertiesByDotNotation ? !!t.startsWith(`${Fn}.`) : !1;
  }
  _isVersionInRangeFormat(t) {
    return lr.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && lr.satisfies(r, t) ? !1 : lr.satisfies(n, t) : !(lr.lte(t, r) || lr.gt(t, n));
  }
  _get(t, r) {
    return hd(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    pi(n, t, r), this.store = n;
  }
}
Pt = new WeakMap(), it = new WeakMap(), Ve = new WeakMap(), ct = new WeakMap();
const { app: Un, ipcMain: ao, shell: QS } = Bc;
let qc = !1;
const Gc = () => {
  if (!ao || !Un)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: Un.getPath("userData"),
    appVersion: Un.getVersion()
  };
  return qc || (ao.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), qc = !0), e;
};
class eb extends ZS {
  constructor(t) {
    let r, n;
    if (_e.type === "renderer") {
      const s = Bc.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else ao && Un && ({ defaultCwd: r, appVersion: n } = Gc());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = B.isAbsolute(t.cwd) ? t.cwd : B.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    Gc();
  }
  async openInEditor() {
    const t = await QS.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const Xu = 67324752, Ju = 33639248, Yu = 101010256, tb = Object.prototype.hasOwnProperty;
function rb(e) {
  for (let t = e.length - 22; t >= 0; t--)
    if (e.readUInt32LE(t) === Yu)
      return t;
  throw new Error("End of central directory not found");
}
function xu(e) {
  const t = rb(e), r = e.readUInt32LE(t + 12), n = e.readUInt32LE(t + 16), s = [], o = /* @__PURE__ */ new Map();
  let a = n, u = 0;
  for (; a < n + r; ) {
    if (e.readUInt32LE(a) !== Ju)
      throw new Error("Invalid central directory signature");
    const d = e.readUInt16LE(a + 4), l = e.readUInt16LE(a + 6), h = e.readUInt16LE(a + 8), w = e.readUInt16LE(a + 10), g = e.readUInt16LE(a + 12), E = e.readUInt16LE(a + 14), _ = e.readUInt32LE(a + 16), $ = e.readUInt32LE(a + 20), m = e.readUInt32LE(a + 24), v = e.readUInt16LE(a + 28), P = e.readUInt16LE(a + 30), I = e.readUInt16LE(a + 32), R = e.readUInt16LE(a + 34), L = e.readUInt16LE(a + 36), W = e.readUInt32LE(a + 38), se = e.readUInt32LE(a + 42), ae = a + 46, de = ae + v, F = e.slice(ae, de).toString("utf8"), z = de, oe = z + P, T = e.slice(z, oe), k = oe, V = k + I, C = e.slice(k, V);
    if (e.readUInt32LE(se) !== Xu)
      throw new Error(`Invalid local header signature for ${F}`);
    const D = e.readUInt16LE(se + 26), N = e.readUInt16LE(se + 28), p = se + 30 + D + N, b = p + $, y = e.slice(p, b), i = e.slice(
      se + 30 + D,
      p
    ), f = {
      fileName: F,
      versionMadeBy: d,
      versionNeeded: l,
      generalPurpose: h,
      compressionMethod: w,
      lastModTime: g,
      lastModDate: E,
      crc32: _,
      compressedSize: $,
      uncompressedSize: m,
      diskNumberStart: R,
      internalAttrs: L,
      externalAttrs: W,
      extraField: T,
      fileComment: C,
      localExtraField: i,
      compressedData: y,
      localHeaderOffset: se,
      order: u
    };
    s.push(f), o.set(F, f), a = V, u += 1;
  }
  return { entries: s, entryMap: o };
}
function nb(e) {
  let t = 4294967295;
  for (let r = 0; r < e.length; r++) {
    const n = e[r];
    t = t >>> 8 ^ sb[(t ^ n) & 255];
  }
  return (t ^ 4294967295) >>> 0;
}
const sb = (() => {
  const e = new Uint32Array(256);
  for (let t = 0; t < 256; t++) {
    let r = t;
    for (let n = 0; n < 8; n++)
      r & 1 ? r = 3988292384 ^ r >>> 1 : r >>>= 1;
    e[t] = r >>> 0;
  }
  return e;
})();
function Zn(e) {
  if (e.compressionMethod === 0)
    return Buffer.from(e.compressedData);
  if (e.compressionMethod === 8)
    return Xc.inflateRawSync(e.compressedData);
  throw new Error(`Unsupported compression method: ${e.compressionMethod}`);
}
function ob(e, t) {
  if (t === 0)
    return e;
  if (t === 8)
    return Xc.deflateRawSync(e);
  throw new Error(`Unsupported compression method: ${t}`);
}
function io(e) {
  return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}
function ab(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function Zu(e) {
  const t = [], r = /<si>([\s\S]*?)<\/si>/g;
  let n;
  for (; (n = r.exec(e)) !== null; ) {
    const s = n[1], o = /<t[^>]*>([\s\S]*?)<\/t>/g;
    let a = "", u;
    for (; (u = o.exec(s)) !== null; )
      a += io(u[1]);
    t.push(a);
  }
  return t;
}
function Qu(e) {
  const t = {}, r = /(\w+)=\"([^\"]*)\"/g;
  let n;
  for (; (n = r.exec(e)) !== null; )
    t[n[1]] = n[2];
  return t;
}
function zs(e) {
  const t = Object.entries(e);
  return t.length === 0 ? "" : t.map(([r, n]) => `${r}="${n}"`).join(" ");
}
function ib(e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const n = e.charCodeAt(r);
    n >= 65 && n <= 90 ? t = t * 26 + (n - 64) : n >= 97 && n <= 122 && (t = t * 26 + (n - 96));
  }
  return t - 1;
}
function cb(e, t, r) {
  if (t === "s") {
    const s = e.match(/<v>([\s\S]*?)<\/v>/);
    if (!s) return "";
    const o = Number.parseInt(s[1], 10);
    return Number.isNaN(o) ? "" : r[o] ?? "";
  }
  if (t === "inlineStr") {
    const s = e.match(/<t[^>]*>([\s\S]*?)<\/t>/);
    return s ? io(s[1]) : "";
  }
  const n = e.match(/<v>([\s\S]*?)<\/v>/);
  return n ? io(n[1]) : "";
}
function ed(e) {
  return e == null ? !1 : typeof e == "string" ? e.trim().length > 0 : !0;
}
function lb(e, t, r) {
  const n = /* @__PURE__ */ new Map(), s = [];
  let o = 0;
  for (; ; ) {
    const c = e.indexOf("<c", o);
    if (c === -1) break;
    const d = e.indexOf(">", c);
    if (d === -1) break;
    let l = e.slice(c + 2, d), h = !1;
    l.endsWith("/") && (h = !0, l = l.slice(0, -1));
    const w = Qu(l), g = w.r;
    let E = "", _ = d + 1;
    if (!h) {
      const $ = e.indexOf("</c>", d);
      if ($ === -1) break;
      E = e.slice(d + 1, $), _ = $ + 4;
    }
    if (g) {
      const $ = /^([A-Z]+)(\d+)$/.exec(g);
      if ($) {
        const m = $[1], v = parseInt($[2], 10);
        if (m === "A") {
          const P = E.match(/<v>([\s\S]*?)<\/v>/);
          if (P) {
            const I = Number.parseInt(P[1], 10), R = t[I];
            R && n.set(v, R);
          }
        }
        if (m === "B") {
          const I = n.get(v) ?? (v === 1 ? "SFC" : void 0);
          if (I && tb.call(r, I)) {
            const R = r[I], L = { ...w }, W = zs(L);
            let se;
            if (!ed(R))
              se = `<c${W ? ` ${W}` : ""}/>`;
            else {
              const ae = `${R}`, de = Number(ae);
              if (ae.trim().length > 0 && !Number.isNaN(de)) {
                delete L.t;
                const z = zs(L);
                se = `<c${z ? ` ${z}` : ""}><v>${ae}</v></c>`;
              } else {
                L.t = "inlineStr";
                const z = zs(L);
                se = `<c${z ? ` ${z}` : ""}><is><t>${ab(ae)}</t></is></c>`;
              }
            }
            s.push({ start: c, end: _, text: se });
          }
        }
      }
    }
    o = _;
  }
  if (s.length === 0)
    return e;
  s.sort((c, d) => c.start - d.start);
  let a = "", u = 0;
  for (const c of s)
    a += e.slice(u, c.start), a += c.text, u = c.end;
  return a += e.slice(u), a;
}
function ub(e) {
  const t = [...e.entries].sort(
    (c, d) => c.localHeaderOffset - d.localHeaderOffset
  ), r = [];
  let n = 0;
  for (const c of t) {
    const d = Buffer.from(c.fileName, "utf8"), l = Buffer.alloc(30);
    l.writeUInt32LE(Xu, 0), l.writeUInt16LE(c.versionNeeded, 4), l.writeUInt16LE(c.generalPurpose, 6), l.writeUInt16LE(c.compressionMethod, 8), l.writeUInt16LE(c.lastModTime, 10), l.writeUInt16LE(c.lastModDate, 12), l.writeUInt32LE(c.crc32, 14), l.writeUInt32LE(c.compressedSize, 18), l.writeUInt32LE(c.uncompressedSize, 22), l.writeUInt16LE(d.length, 26), l.writeUInt16LE(c.localExtraField.length, 28), r.push(
      l,
      d,
      c.localExtraField,
      c.compressedData
    ), c.newLocalHeaderOffset = n, n += l.length + d.length + c.localExtraField.length + c.compressedData.length;
  }
  const s = n, o = [];
  for (const c of t) {
    const d = Buffer.from(c.fileName, "utf8"), l = Buffer.alloc(46);
    l.writeUInt32LE(Ju, 0), l.writeUInt16LE(c.versionMadeBy, 4), l.writeUInt16LE(c.versionNeeded, 6), l.writeUInt16LE(c.generalPurpose, 8), l.writeUInt16LE(c.compressionMethod, 10), l.writeUInt16LE(c.lastModTime, 12), l.writeUInt16LE(c.lastModDate, 14), l.writeUInt32LE(c.crc32, 16), l.writeUInt32LE(c.compressedSize, 20), l.writeUInt32LE(c.uncompressedSize, 24), l.writeUInt16LE(d.length, 28), l.writeUInt16LE(c.extraField.length, 30), l.writeUInt16LE(c.fileComment.length, 32), l.writeUInt16LE(c.diskNumberStart, 34), l.writeUInt16LE(c.internalAttrs, 36), l.writeUInt32LE(c.externalAttrs, 38), l.writeUInt32LE(c.newLocalHeaderOffset ?? 0, 42), o.push(
      l,
      d,
      c.extraField,
      c.fileComment
    ), n += l.length + d.length + c.extraField.length + c.fileComment.length;
  }
  const a = n - s, u = Buffer.alloc(22);
  return u.writeUInt32LE(Yu, 0), u.writeUInt16LE(0, 4), u.writeUInt16LE(0, 6), u.writeUInt16LE(t.length, 8), u.writeUInt16LE(t.length, 10), u.writeUInt32LE(a, 12), u.writeUInt32LE(s, 16), u.writeUInt16LE(0, 20), Buffer.concat([...r, ...o, u]);
}
function db(e, t) {
  const r = {};
  t && (r.SFC = t);
  for (const [n, s] of Object.entries(e))
    ed(s) && (r[n] = s);
  return r;
}
function fb(e, t, r) {
  if (!$e.existsSync(e))
    throw new Error(`Workbook not found: ${e}`);
  const n = $e.readFileSync(e), s = xu(n), o = s.entryMap.get("xl/worksheets/sheet1.xml"), a = s.entryMap.get("xl/sharedStrings.xml");
  if (!o || !a)
    throw new Error("Workbook is missing required worksheet or shared strings");
  const u = Zn(a).toString("utf8"), c = Zu(u), d = Zn(o).toString("utf8"), l = db(t, r), h = lb(
    d,
    c,
    l
  );
  if (h === d)
    return;
  const w = Buffer.from(h, "utf8"), g = ob(w, o.compressionMethod);
  o.compressedData = g, o.compressedSize = g.length, o.uncompressedSize = w.length, o.crc32 = nb(w);
  const E = ub(s), _ = `${e}.tmp`;
  $e.writeFileSync(_, E), $e.renameSync(_, e);
}
function hb(e, t = "xl/worksheets/sheet1.xml") {
  if (!$e.existsSync(e))
    throw new Error(`Workbook not found: ${e}`);
  const r = $e.readFileSync(e), n = xu(r), s = n.entryMap.get(t);
  if (!s)
    throw new Error(`Worksheet not found: ${t}`);
  const o = n.entryMap.get("xl/sharedStrings.xml"), a = o ? Zu(Zn(o).toString("utf8")) : [], u = Zn(s).toString("utf8"), c = [], d = /<row[^>]*>([\s\S]*?)<\/row>/g;
  let l;
  for (; (l = d.exec(u)) !== null; ) {
    const h = l[1], w = [];
    let g = -1;
    const E = /<c([^>]*)>([\s\S]*?)<\/c>/g;
    let _;
    for (; (_ = E.exec(h)) !== null; ) {
      const $ = _[1], m = _[2], v = Qu($), P = v.r;
      let I = -1;
      if (P) {
        const L = P.replace(/\d+/g, "");
        I = ib(L);
      } else
        I = w.length;
      if (I < 0)
        continue;
      const R = cb(m, v.t, a);
      w[I] = R, I > g && (g = I);
    }
    if (g >= 0)
      for (let $ = 0; $ <= g; $ += 1)
        w[$] === void 0 && (w[$] = "");
    c.push(w);
  }
  return c;
}
function mb(e) {
  const t = mi.join(e, "Input_Total.xlsx");
  if (!$e.existsSync(t)) {
    const r = mi.join(e, "Input_Plant.xlsx");
    if (!$e.existsSync(r))
      throw new Error("No template available to create Input_Total.xlsx");
    $e.copyFileSync(r, t);
  }
  return t;
}
id(import.meta.url);
const _s = B.dirname(cd(import.meta.url));
process.env.APP_ROOT = B.join(_s, "..");
const co = process.env.VITE_DEV_SERVER_URL, Ub = B.join(process.env.APP_ROOT, "dist-electron"), zn = B.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = co ? B.join(process.env.APP_ROOT, "public") : zn;
function pb() {
  return Qt.isPackaged ? B.join(process.resourcesPath, "third-party") : B.join(_s, "..", "third-party");
}
function td() {
  return Qt.isPackaged ? B.join(process.resourcesPath, "output") : B.join(_s, "..", "output");
}
function Kc(e) {
  $e.existsSync(e) || $e.mkdirSync(e, { recursive: !0 });
}
function $b(e, t) {
  return new Promise((r, n) => {
    var o, a;
    const s = dd(e, {
      cwd: t,
      windowsHide: !0
    });
    s.on("error", (u) => {
      n(u);
    }), (o = s.stdout) == null || o.on("data", (u) => {
      console.log(`[exe stdout] ${u}`);
    }), (a = s.stderr) == null || a.on("data", (u) => {
      console.error(`[exe stderr] ${u}`);
    }), s.on("close", (u) => {
      if (u === 0) {
        r();
        return;
      }
      n(new Error(`Executable exited with code ${u}`));
    });
  });
}
function Hc(e) {
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
function rd(e, t, r) {
  if (r < 0 || r >= t.length)
    return null;
  const n = e[r] ?? "", s = Number.parseFloat(n);
  if (!Number.isFinite(s))
    return null;
  const o = {};
  return t.forEach((a, u) => {
    if (u === r || !a) return;
    const c = e[u];
    if (c == null) {
      o[a] = "";
      return;
    }
    o[a] = `${c}`;
  }), { time: s, values: o };
}
function yb(e) {
  const r = $e.readFileSync(e, "utf-8").split(/\r?\n/).filter((a) => a.trim().length > 0);
  if (r.length === 0)
    return [];
  const n = Hc(r[0]), s = n.findIndex(
    (a) => a.toLowerCase() === "time"
  );
  if (s === -1)
    return console.warn("Output CSV missing Time column"), [];
  const o = [];
  for (let a = 1; a < r.length; a += 1) {
    const u = Hc(r[a]), c = rd(u, n, s);
    c && o.push(c);
  }
  return o;
}
function gb(e) {
  try {
    const t = hb(e);
    if (t.length === 0)
      return [];
    const r = t[0].map((o) => o.trim()), n = r.findIndex(
      (o) => o.toLowerCase() === "time"
    );
    if (n === -1)
      return console.warn("Workbook missing Time column"), [];
    const s = [];
    for (let o = 1; o < t.length; o += 1) {
      const a = t[o], u = rd(a, r, n);
      u && s.push(u);
    }
    return s;
  } catch (t) {
    return console.error("Failed to read simulation workbook", e, t), [];
  }
}
function _b(e) {
  const t = B.join(e, "Output_Total.xlsx");
  if ($e.existsSync(t)) {
    const n = gb(t);
    if (n.length > 0)
      return n;
  }
  const r = B.join(e, "Output_Total.csv");
  return $e.existsSync(r) ? yb(r) : [];
}
Er.handle("run-exe", async (e, t) => {
  const r = pb(), n = B.join(r, "MHySIM_HRS_Run.exe");
  if (!$e.existsSync(n)) {
    const w = `실행 파일을 찾을 수 없습니다:
` + n + `

패키징 시 extraResources에 third-party를 포함했는지 확인하세요.`;
    throw console.error("[run-exe] " + w), ad.showErrorBox("Executable missing", w), new Error(w);
  }
  const s = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, ""), o = td();
  Kc(o);
  const a = B.join(o, s);
  Kc(a);
  const u = a, c = $e.readdirSync(u).filter((w) => /^Output_\d+\.csv$/i.test(w));
  for (const w of c) {
    const g = B.extname(w), E = B.basename(w, g);
    let _ = 1, $ = `${E}-${_}${g}`;
    for (; $e.existsSync(B.join(u, $)); )
      _++, $ = `${E}-${_}${g}`;
    $e.renameSync(
      B.join(u, w),
      B.join(u, $)
    ), console.log(`📁 백업됨: ${w} → ${$}`);
  }
  try {
    const w = (t == null ? void 0 : t.values) ?? {}, g = (t == null ? void 0 : t.sfc) ?? null;
    if (Object.keys(w).length > 0 || g) {
      const _ = mb(r);
      fb(_, w, g);
    }
  } catch (w) {
    throw console.error("❌ Excel 업데이트 실패:", w), w;
  }
  let d = "EXE execution skipped: unsupported platform";
  if (process.platform === "win32")
    try {
      await $b(n, u), d = "EXE completed successfully";
    } catch (w) {
      throw console.error("❌ EXE 실행 실패:", w), w;
    }
  else
    console.warn(
      `run-exe called on unsupported platform (${process.platform}); executable skipped.`
    );
  const l = _b(u);
  return {
    status: d,
    frames: l.sort((w, g) => w.time - g.time)
  };
});
function vb(e) {
  const t = e.getFullYear(), r = `${e.getMonth() + 1}`.padStart(2, "0"), n = `${e.getDate()}`.padStart(2, "0");
  return `${t}-${r}-${n}`;
}
Er.handle("read-recent-logs", async () => {
  const e = td(), t = [], r = /* @__PURE__ */ new Date();
  for (let n = 0; n < 5; n += 1) {
    const s = new Date(r);
    s.setDate(r.getDate() - n);
    const o = vb(s), a = o.replace(/-/g, ""), u = B.join(e, a, "MHySIM.jsonl");
    let c = [];
    if ($e.existsSync(u))
      try {
        c = $e.readFileSync(u, "utf-8").split(/\r?\n/).map((l) => l.trim()).filter(Boolean).map((l) => {
          try {
            return JSON.parse(l);
          } catch (h) {
            return console.warn("Failed to parse log line", {
              logPath: u,
              line: l,
              error: h
            }), null;
          }
        }).filter((l) => l !== null);
      } catch (d) {
        console.error("Failed to read log file", u, d);
      }
    t.push({ date: o, entries: c });
  }
  return t;
});
const di = new eb();
Er.handle("electron-store-get", (e, t) => di.get(t));
Er.handle("electron-store-set", (e, t, r) => {
  di.set(t, r);
});
Er.handle("electron-store-delete", (e, t) => {
  di.delete(t);
});
Er.on("save-project-backup", (e, t, r) => {
  const n = B.join(Qt.getPath("userData"), `${r}.json`);
  try {
    $e.writeFileSync(n, JSON.stringify(t, null, 2), "utf-8"), console.log("✅ 프로젝트 백업 저장 완료:", n);
  } catch (s) {
    console.error("❌ 프로젝트 백업 저장 실패:", s);
  }
});
let St;
function nd() {
  St = new Wc({
    icon: B.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: B.join(_s, "preload.mjs")
    }
  }), St.webContents.on("did-finish-load", () => {
    St == null || St.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), co ? St.loadURL(co) : (console.log("RENDERER_DIST:", zn), console.log("index.html path:", B.join(zn, "index.html")), St.loadFile(B.join(zn, "index.html")));
}
Qt.on("window-all-closed", () => {
  process.platform !== "darwin" && (Qt.quit(), St = null);
});
Qt.on("activate", () => {
  Wc.getAllWindows().length === 0 && nd();
});
Qt.whenReady().then(nd);
export {
  Ub as MAIN_DIST,
  zn as RENDERER_DIST,
  co as VITE_DEV_SERVER_URL
};
