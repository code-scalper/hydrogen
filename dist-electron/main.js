var Gu = Object.defineProperty;
var ii = (e) => {
  throw TypeError(e);
};
var Ku = (e, t, r) => t in e ? Gu(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var jr = (e, t, r) => Ku(e, typeof t != "symbol" ? t + "" : t, r), ci = (e, t, r) => t.has(e) || ii("Cannot " + r);
var ue = (e, t, r) => (ci(e, t, "read from private field"), r ? r.call(e) : t.get(e)), kr = (e, t, r) => t.has(e) ? ii("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Ar = (e, t, r, n) => (ci(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
import Fc, { ipcMain as Wn, app as xr, BrowserWindow as zc } from "electron";
import { createRequire as Hu } from "node:module";
import { fileURLToPath as Ju } from "node:url";
import re from "node:path";
import Xu from "fs";
import _e from "node:process";
import { promisify as be, isDeepStrictEqual as Bu } from "node:util";
import Z from "node:fs";
import Cr from "node:crypto";
import Wu from "node:assert";
import Yn from "node:os";
const Zt = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, ys = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), Yu = new Set("0123456789");
function Qn(e) {
  const t = [];
  let r = "", n = "start", s = !1;
  for (const a of e)
    switch (a) {
      case "\\": {
        if (n === "index")
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        s && (r += a), n = "property", s = !s;
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
          s = !1, r += a;
          break;
        }
        if (ys.has(r))
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
          s = !1, r += a;
          break;
        }
        if (n === "property") {
          if (ys.has(r))
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
        if (n === "index" && !Yu.has(a))
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        n === "start" && (n = "property"), s && (s = !1, r += "\\"), r += a;
      }
    }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (ys.has(r))
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
function na(e, t) {
  if (typeof t != "number" && Array.isArray(e)) {
    const r = Number.parseInt(t, 10);
    return Number.isInteger(r) && e[r] === e[t];
  }
  return !1;
}
function Uc(e, t) {
  if (na(e, t))
    throw new Error("Cannot use string index");
}
function Qu(e, t, r) {
  if (!Zt(e) || typeof t != "string")
    return r === void 0 ? e : r;
  const n = Qn(t);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const a = n[s];
    if (na(e, a) ? e = s === n.length - 1 ? void 0 : null : e = e[a], e == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function li(e, t, r) {
  if (!Zt(e) || typeof t != "string")
    return e;
  const n = e, s = Qn(t);
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    Uc(e, o), a === s.length - 1 ? e[o] = r : Zt(e[o]) || (e[o] = typeof s[a + 1] == "number" ? [] : {}), e = e[o];
  }
  return n;
}
function Zu(e, t) {
  if (!Zt(e) || typeof t != "string")
    return !1;
  const r = Qn(t);
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (Uc(e, s), n === r.length - 1)
      return delete e[s], !0;
    if (e = e[s], !Zt(e))
      return !1;
  }
}
function xu(e, t) {
  if (!Zt(e) || typeof t != "string")
    return !1;
  const r = Qn(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!Zt(e) || !(n in e) || na(e, n))
      return !1;
    e = e[n];
  }
  return !0;
}
const bt = Yn.homedir(), sa = Yn.tmpdir(), { env: dr } = _e, ed = (e) => {
  const t = re.join(bt, "Library");
  return {
    data: re.join(t, "Application Support", e),
    config: re.join(t, "Preferences", e),
    cache: re.join(t, "Caches", e),
    log: re.join(t, "Logs", e),
    temp: re.join(sa, e)
  };
}, td = (e) => {
  const t = dr.APPDATA || re.join(bt, "AppData", "Roaming"), r = dr.LOCALAPPDATA || re.join(bt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: re.join(r, e, "Data"),
    config: re.join(t, e, "Config"),
    cache: re.join(r, e, "Cache"),
    log: re.join(r, e, "Log"),
    temp: re.join(sa, e)
  };
}, rd = (e) => {
  const t = re.basename(bt);
  return {
    data: re.join(dr.XDG_DATA_HOME || re.join(bt, ".local", "share"), e),
    config: re.join(dr.XDG_CONFIG_HOME || re.join(bt, ".config"), e),
    cache: re.join(dr.XDG_CACHE_HOME || re.join(bt, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: re.join(dr.XDG_STATE_HOME || re.join(bt, ".local", "state"), e),
    temp: re.join(sa, t, e)
  };
};
function nd(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), _e.platform === "darwin" ? ed(e) : _e.platform === "win32" ? td(e) : rd(e);
}
const mt = (e, t) => function(...n) {
  return e.apply(void 0, n).catch(t);
}, at = (e, t) => function(...n) {
  try {
    return e.apply(void 0, n);
  } catch (s) {
    return t(s);
  }
}, sd = _e.getuid ? !_e.getuid() : !1, ad = 1e4, Me = () => {
}, de = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!de.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !sd && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!de.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!de.isNodeError(e))
      throw e;
    if (!de.isChangeErrorOk(e))
      throw e;
  }
};
class od {
  constructor() {
    this.interval = 25, this.intervalId = void 0, this.limit = ad, this.queueActive = /* @__PURE__ */ new Set(), this.queueWaiting = /* @__PURE__ */ new Set(), this.init = () => {
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
const id = new od(), pt = (e, t) => function(n) {
  return function s(...a) {
    return id.schedule().then((o) => {
      const l = (d) => (o(), d), c = (d) => {
        if (o(), Date.now() >= n)
          throw d;
        if (t(d)) {
          const u = Math.round(100 * Math.random());
          return new Promise((b) => setTimeout(b, u)).then(() => s.apply(void 0, a));
        }
        throw d;
      };
      return e.apply(void 0, a).then(l, c);
    });
  };
}, $t = (e, t) => function(n) {
  return function s(...a) {
    try {
      return e.apply(void 0, a);
    } catch (o) {
      if (Date.now() > n)
        throw o;
      if (t(o))
        return s.apply(void 0, a);
      throw o;
    }
  };
}, Ne = {
  attempt: {
    /* ASYNC */
    chmod: mt(be(Z.chmod), de.onChangeError),
    chown: mt(be(Z.chown), de.onChangeError),
    close: mt(be(Z.close), Me),
    fsync: mt(be(Z.fsync), Me),
    mkdir: mt(be(Z.mkdir), Me),
    realpath: mt(be(Z.realpath), Me),
    stat: mt(be(Z.stat), Me),
    unlink: mt(be(Z.unlink), Me),
    /* SYNC */
    chmodSync: at(Z.chmodSync, de.onChangeError),
    chownSync: at(Z.chownSync, de.onChangeError),
    closeSync: at(Z.closeSync, Me),
    existsSync: at(Z.existsSync, Me),
    fsyncSync: at(Z.fsync, Me),
    mkdirSync: at(Z.mkdirSync, Me),
    realpathSync: at(Z.realpathSync, Me),
    statSync: at(Z.statSync, Me),
    unlinkSync: at(Z.unlinkSync, Me)
  },
  retry: {
    /* ASYNC */
    close: pt(be(Z.close), de.isRetriableError),
    fsync: pt(be(Z.fsync), de.isRetriableError),
    open: pt(be(Z.open), de.isRetriableError),
    readFile: pt(be(Z.readFile), de.isRetriableError),
    rename: pt(be(Z.rename), de.isRetriableError),
    stat: pt(be(Z.stat), de.isRetriableError),
    write: pt(be(Z.write), de.isRetriableError),
    writeFile: pt(be(Z.writeFile), de.isRetriableError),
    /* SYNC */
    closeSync: $t(Z.closeSync, de.isRetriableError),
    fsyncSync: $t(Z.fsyncSync, de.isRetriableError),
    openSync: $t(Z.openSync, de.isRetriableError),
    readFileSync: $t(Z.readFileSync, de.isRetriableError),
    renameSync: $t(Z.renameSync, de.isRetriableError),
    statSync: $t(Z.statSync, de.isRetriableError),
    writeSync: $t(Z.writeSync, de.isRetriableError),
    writeFileSync: $t(Z.writeFileSync, de.isRetriableError)
  }
}, cd = "utf8", ui = 438, ld = 511, ud = {}, dd = Yn.userInfo().uid, fd = Yn.userInfo().gid, hd = 1e3, md = !!_e.getuid;
_e.getuid && _e.getuid();
const di = 128, pd = (e) => e instanceof Error && "code" in e, fi = (e) => typeof e == "string", _s = (e) => e === void 0, $d = _e.platform === "linux", qc = _e.platform === "win32", aa = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
qc || aa.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
$d && aa.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
class yd {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (qc && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? _e.kill(_e.pid, "SIGTERM") : _e.kill(_e.pid, t));
      }
    }, this.hook = () => {
      _e.once("exit", () => this.exit());
      for (const t of aa)
        try {
          _e.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const _d = new yd(), gd = _d.register, Re = {
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
    Re.store[e] && (delete Re.store[e], Ne.attempt.unlink(e));
  },
  purgeSync: (e) => {
    Re.store[e] && (delete Re.store[e], Ne.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in Re.store)
      Re.purgeSync(e);
  },
  truncate: (e) => {
    const t = re.basename(e);
    if (t.length <= di)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - di;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
gd(Re.purgeSyncAll);
function Gc(e, t, r = ud) {
  if (fi(r))
    return Gc(e, t, { encoding: r });
  const n = Date.now() + ((r.timeout ?? hd) || -1);
  let s = null, a = null, o = null;
  try {
    const l = Ne.attempt.realpathSync(e), c = !!l;
    e = l || e, [a, s] = Re.get(e, r.tmpCreate || Re.create, r.tmpPurge !== !1);
    const d = md && _s(r.chown), u = _s(r.mode);
    if (c && (d || u)) {
      const h = Ne.attempt.statSync(e);
      h && (r = { ...r }, d && (r.chown = { uid: h.uid, gid: h.gid }), u && (r.mode = h.mode));
    }
    if (!c) {
      const h = re.dirname(e);
      Ne.attempt.mkdirSync(h, {
        mode: ld,
        recursive: !0
      });
    }
    o = Ne.retry.openSync(n)(a, "w", r.mode || ui), r.tmpCreated && r.tmpCreated(a), fi(t) ? Ne.retry.writeSync(n)(o, t, 0, r.encoding || cd) : _s(t) || Ne.retry.writeSync(n)(o, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Ne.retry.fsyncSync(n)(o) : Ne.attempt.fsync(o)), Ne.retry.closeSync(n)(o), o = null, r.chown && (r.chown.uid !== dd || r.chown.gid !== fd) && Ne.attempt.chownSync(a, r.chown.uid, r.chown.gid), r.mode && r.mode !== ui && Ne.attempt.chmodSync(a, r.mode);
    try {
      Ne.retry.renameSync(n)(a, e);
    } catch (h) {
      if (!pd(h) || h.code !== "ENAMETOOLONG")
        throw h;
      Ne.retry.renameSync(n)(a, Re.truncate(e));
    }
    s(), a = null;
  } finally {
    o && Ne.attempt.closeSync(o), a && Re.purge(a);
  }
}
function Kc(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ls = { exports: {} }, Hc = {}, Be = {}, $r = {}, rn = {}, W = {}, en = {};
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
      return (v = this._str) !== null && v !== void 0 ? v : this._str = this._items.reduce((N, R) => `${N}${R}`, "");
    }
    get names() {
      var v;
      return (v = this._names) !== null && v !== void 0 ? v : this._names = this._items.reduce((N, R) => (R instanceof r && (N[R.str] = (N[R.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...v) {
    const N = [m[0]];
    let R = 0;
    for (; R < v.length; )
      l(N, v[R]), N.push(m[++R]);
    return new n(N);
  }
  e._ = s;
  const a = new n("+");
  function o(m, ...v) {
    const N = [g(m[0])];
    let R = 0;
    for (; R < v.length; )
      N.push(a), l(N, v[R]), N.push(a, g(m[++R]));
    return c(N), new n(N);
  }
  e.str = o;
  function l(m, v) {
    v instanceof n ? m.push(...v._items) : v instanceof r ? m.push(v) : m.push(h(v));
  }
  e.addCodeArg = l;
  function c(m) {
    let v = 1;
    for (; v < m.length - 1; ) {
      if (m[v] === a) {
        const N = d(m[v - 1], m[v + 1]);
        if (N !== void 0) {
          m.splice(v - 1, 3, N);
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
  function u(m, v) {
    return v.emptyStr() ? m : m.emptyStr() ? v : o`${m}${v}`;
  }
  e.strConcat = u;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : g(Array.isArray(m) ? m.join(",") : m);
  }
  function b(m) {
    return new n(g(m));
  }
  e.stringify = b;
  function g(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = g;
  function w(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = w;
  function _(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = _;
  function y(m) {
    return new n(m.toString());
  }
  e.regexpCode = y;
})(en);
var Vs = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = en;
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
  class a extends t.Name {
    constructor(d, u) {
      super(u), this.prefix = d;
    }
    setValue(d, { property: u, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(u)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const o = (0, t._)`\n`;
  class l extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
    }
    value(d, u) {
      var h;
      if (u.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const b = this.toName(d), { prefix: g } = b, w = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let _ = this._values[g];
      if (_) {
        const v = _.get(w);
        if (v)
          return v;
      } else
        _ = this._values[g] = /* @__PURE__ */ new Map();
      _.set(w, b);
      const y = this._scope[g] || (this._scope[g] = []), m = y.length;
      return y[m] = u.ref, b.setValue(u, { property: g, itemIndex: m }), b;
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
      return this._reduceValues(d, (b) => {
        if (b.value === void 0)
          throw new Error(`CodeGen: name "${b}" has no value`);
        return b.value.code;
      }, u, h);
    }
    _reduceValues(d, u, h = {}, b) {
      let g = t.nil;
      for (const w in d) {
        const _ = d[w];
        if (!_)
          continue;
        const y = h[w] = h[w] || /* @__PURE__ */ new Map();
        _.forEach((m) => {
          if (y.has(m))
            return;
          y.set(m, n.Started);
          let v = u(m);
          if (v) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            g = (0, t._)`${g}${N} ${m} = ${v};${this.opts._n}`;
          } else if (v = b == null ? void 0 : b(m))
            g = (0, t._)`${g}${v}${this.opts._n}`;
          else
            throw new r(m);
          y.set(m, n.Completed);
        });
      }
      return g;
    }
  }
  e.ValueScope = l;
})(Vs);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = en, r = Vs;
  var n = en;
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
  var s = Vs;
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
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(i, f) {
      return this;
    }
  }
  class o extends a {
    constructor(i, f, E) {
      super(), this.varKind = i, this.name = f, this.rhs = E;
    }
    render({ es5: i, _n: f }) {
      const E = i ? r.varKinds.var : this.varKind, I = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${E} ${this.name}${I};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = T(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class l extends a {
    constructor(i, f, E) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = E;
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
      return se(i, this.rhs);
    }
  }
  class c extends l {
    constructor(i, f, E, I) {
      super(i, E, I), this.op = f;
    }
    render({ _n: i }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + i;
    }
  }
  class d extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `${this.label}:` + i;
    }
  }
  class u extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `break${this.label ? ` ${this.label}` : ""};` + i;
    }
  }
  class h extends a {
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
  class b extends a {
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
  class g extends a {
    constructor(i = []) {
      super(), this.nodes = i;
    }
    render(i) {
      return this.nodes.reduce((f, E) => f + E.render(i), "");
    }
    optimizeNodes() {
      const { nodes: i } = this;
      let f = i.length;
      for (; f--; ) {
        const E = i[f].optimizeNodes();
        Array.isArray(E) ? i.splice(f, 1, ...E) : E ? i[f] = E : i.splice(f, 1);
      }
      return i.length > 0 ? this : void 0;
    }
    optimizeNames(i, f) {
      const { nodes: E } = this;
      let I = E.length;
      for (; I--; ) {
        const j = E[I];
        j.optimizeNames(i, f) || (k(i, j.names), E.splice(I, 1));
      }
      return E.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => H(i, f.names), {});
    }
  }
  class w extends g {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class _ extends g {
  }
  class y extends w {
  }
  y.kind = "else";
  class m extends w {
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
        const E = f.optimizeNodes();
        f = this.else = Array.isArray(E) ? new y(E) : E;
      }
      if (f)
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(L(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var E;
      if (this.else = (E = this.else) === null || E === void 0 ? void 0 : E.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = T(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return se(i, this.condition), this.else && H(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class v extends w {
  }
  v.kind = "for";
  class N extends v {
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
      return H(super.names, this.iteration.names);
    }
  }
  class R extends v {
    constructor(i, f, E, I) {
      super(), this.varKind = i, this.name = f, this.from = E, this.to = I;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: E, from: I, to: j } = this;
      return `for(${f} ${E}=${I}; ${E}<${j}; ${E}++)` + super.render(i);
    }
    get names() {
      const i = se(super.names, this.from);
      return se(i, this.to);
    }
  }
  class O extends v {
    constructor(i, f, E, I) {
      super(), this.loop = i, this.varKind = f, this.name = E, this.iterable = I;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = T(this.iterable, i, f), this;
    }
    get names() {
      return H(super.names, this.iterable.names);
    }
  }
  class G extends w {
    constructor(i, f, E) {
      super(), this.name = i, this.args = f, this.async = E;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  G.kind = "func";
  class B extends g {
    render(i) {
      return "return " + super.render(i);
    }
  }
  B.kind = "return";
  class le extends w {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var E, I;
      return super.optimizeNames(i, f), (E = this.catch) === null || E === void 0 || E.optimizeNames(i, f), (I = this.finally) === null || I === void 0 || I.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && H(i, this.catch.names), this.finally && H(i, this.finally.names), i;
    }
  }
  class fe extends w {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  fe.kind = "catch";
  class pe extends w {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  pe.kind = "finally";
  class z {
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
      const E = this._extScope.value(i, f);
      return (this._values[E.prefix] || (this._values[E.prefix] = /* @__PURE__ */ new Set())).add(E), E;
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
    _def(i, f, E, I) {
      const j = this._scope.toName(f);
      return E !== void 0 && I && (this._constants[j.str] = E), this._leafNode(new o(i, j, E)), j;
    }
    // `const` declaration (`var` in es5 mode)
    const(i, f, E) {
      return this._def(r.varKinds.const, i, f, E);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(i, f, E) {
      return this._def(r.varKinds.let, i, f, E);
    }
    // `var` declaration with optional assignment
    var(i, f, E) {
      return this._def(r.varKinds.var, i, f, E);
    }
    // assignment code
    assign(i, f, E) {
      return this._leafNode(new l(i, f, E));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new c(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new b(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [E, I] of i)
        f.length > 1 && f.push(","), f.push(E), (E !== I || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, I));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(i, f, E) {
      if (this._blockNode(new m(i)), f && E)
        this.code(f).else().code(E).endIf();
      else if (f)
        this.code(f).endIf();
      else if (E)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(i) {
      return this._elseNode(new m(i));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new y());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, y);
    }
    _for(i, f) {
      return this._blockNode(i), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(i, f) {
      return this._for(new N(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, E, I, j = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const F = this._scope.toName(i);
      return this._for(new R(j, F, f, E), () => I(F));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, E, I = r.varKinds.const) {
      const j = this._scope.toName(i);
      if (this.opts.es5) {
        const F = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${F}.length`, (V) => {
          this.var(j, (0, t._)`${F}[${V}]`), E(j);
        });
      }
      return this._for(new O("of", I, j, f), () => E(j));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, E, I = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, E);
      const j = this._scope.toName(i);
      return this._for(new O("in", I, j, f), () => E(j));
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
      return this._leafNode(new u(i));
    }
    // `return` statement
    return(i) {
      const f = new B();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(B);
    }
    // `try` statement
    try(i, f, E) {
      if (!f && !E)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const I = new le();
      if (this._blockNode(I), this.code(i), f) {
        const j = this.name("e");
        this._currNode = I.catch = new fe(j), f(j);
      }
      return E && (this._currNode = I.finally = new pe(), this.code(E)), this._endBlockNode(fe, pe);
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
      const E = this._nodes.length - f;
      if (E < 0 || i !== void 0 && E !== i)
        throw new Error(`CodeGen: wrong number of nodes: ${E} vs ${i} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(i, f = t.nil, E, I) {
      return this._blockNode(new G(i, f, E)), I && this.code(I).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(G);
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
      const E = this._currNode;
      if (E instanceof i || f && E instanceof f)
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
  e.CodeGen = z;
  function H($, i) {
    for (const f in i)
      $[f] = ($[f] || 0) + (i[f] || 0);
    return $;
  }
  function se($, i) {
    return i instanceof t._CodeOrName ? H($, i.names) : $;
  }
  function T($, i, f) {
    if ($ instanceof t.Name)
      return E($);
    if (!I($))
      return $;
    return new t._Code($._items.reduce((j, F) => (F instanceof t.Name && (F = E(F)), F instanceof t._Code ? j.push(...F._items) : j.push(F), j), []));
    function E(j) {
      const F = f[j.str];
      return F === void 0 || i[j.str] !== 1 ? j : (delete i[j.str], F);
    }
    function I(j) {
      return j instanceof t._Code && j._items.some((F) => F instanceof t.Name && i[F.str] === 1 && f[F.str] !== void 0);
    }
  }
  function k($, i) {
    for (const f in i)
      $[f] = ($[f] || 0) - (i[f] || 0);
  }
  function L($) {
    return typeof $ == "boolean" || typeof $ == "number" || $ === null ? !$ : (0, t._)`!${S($)}`;
  }
  e.not = L;
  const D = p(e.operators.AND);
  function K(...$) {
    return $.reduce(D);
  }
  e.and = K;
  const M = p(e.operators.OR);
  function P(...$) {
    return $.reduce(M);
  }
  e.or = P;
  function p($) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${S(i)} ${$} ${S(f)}`;
  }
  function S($) {
    return $ instanceof t.Name ? $ : (0, t._)`(${$})`;
  }
})(W);
var A = {};
Object.defineProperty(A, "__esModule", { value: !0 });
A.checkStrictMode = A.getErrorPath = A.Type = A.useFunc = A.setEvaluated = A.evaluatedPropsToName = A.mergeEvaluated = A.eachItem = A.unescapeJsonPointer = A.escapeJsonPointer = A.escapeFragment = A.unescapeFragment = A.schemaRefOrVal = A.schemaHasRulesButRef = A.schemaHasRules = A.checkUnknownRules = A.alwaysValidSchema = A.toHash = void 0;
const ae = W, vd = en;
function wd(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
A.toHash = wd;
function Ed(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Jc(e, t), !Xc(t, e.self.RULES.all));
}
A.alwaysValidSchema = Ed;
function Jc(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || Yc(e, `unknown keyword: "${a}"`);
}
A.checkUnknownRules = Jc;
function Xc(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
A.schemaHasRules = Xc;
function bd(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
A.schemaHasRulesButRef = bd;
function Sd({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ae._)`${r}`;
  }
  return (0, ae._)`${e}${t}${(0, ae.getProperty)(n)}`;
}
A.schemaRefOrVal = Sd;
function Pd(e) {
  return Bc(decodeURIComponent(e));
}
A.unescapeFragment = Pd;
function Nd(e) {
  return encodeURIComponent(oa(e));
}
A.escapeFragment = Nd;
function oa(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
A.escapeJsonPointer = oa;
function Bc(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
A.unescapeJsonPointer = Bc;
function Rd(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
A.eachItem = Rd;
function hi({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, l) => {
    const c = o === void 0 ? a : o instanceof ae.Name ? (a instanceof ae.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof ae.Name ? (t(s, o, a), a) : r(a, o);
    return l === ae.Name && !(c instanceof ae.Name) ? n(s, c) : c;
  };
}
A.mergeEvaluated = {
  props: hi({
    mergeNames: (e, t, r) => e.if((0, ae._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ae._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ae._)`${r} || {}`).code((0, ae._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ae._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ae._)`${r} || {}`), ia(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Wc
  }),
  items: hi({
    mergeNames: (e, t, r) => e.if((0, ae._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ae._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ae._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ae._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Wc(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ae._)`{}`);
  return t !== void 0 && ia(e, r, t), r;
}
A.evaluatedPropsToName = Wc;
function ia(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ae._)`${t}${(0, ae.getProperty)(n)}`, !0));
}
A.setEvaluated = ia;
const mi = {};
function Od(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: mi[t.code] || (mi[t.code] = new vd._Code(t.code))
  });
}
A.useFunc = Od;
var Fs;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Fs || (A.Type = Fs = {}));
function Id(e, t, r) {
  if (e instanceof ae.Name) {
    const n = t === Fs.Num;
    return r ? n ? (0, ae._)`"[" + ${e} + "]"` : (0, ae._)`"['" + ${e} + "']"` : n ? (0, ae._)`"/" + ${e}` : (0, ae._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ae.getProperty)(e).toString() : "/" + oa(e);
}
A.getErrorPath = Id;
function Yc(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
A.checkStrictMode = Yc;
var Ve = {};
Object.defineProperty(Ve, "__esModule", { value: !0 });
const Se = W, Td = {
  // validation function arguments
  data: new Se.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Se.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Se.Name("instancePath"),
  parentData: new Se.Name("parentData"),
  parentDataProperty: new Se.Name("parentDataProperty"),
  rootData: new Se.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Se.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Se.Name("vErrors"),
  // null or array of validation errors
  errors: new Se.Name("errors"),
  // counter of validation errors
  this: new Se.Name("this"),
  // "globals"
  self: new Se.Name("self"),
  scope: new Se.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Se.Name("json"),
  jsonPos: new Se.Name("jsonPos"),
  jsonLen: new Se.Name("jsonLen"),
  jsonPart: new Se.Name("jsonPart")
};
Ve.default = Td;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = W, r = A, n = Ve;
  e.keywordError = {
    message: ({ keyword: y }) => (0, t.str)`must pass "${y}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: y, schemaType: m }) => m ? (0, t.str)`"${y}" keyword must be ${m} ($data)` : (0, t.str)`"${y}" keyword is invalid ($data)`
  };
  function s(y, m = e.keywordError, v, N) {
    const { it: R } = y, { gen: O, compositeRule: G, allErrors: B } = R, le = h(y, m, v);
    N ?? (G || B) ? c(O, le) : d(R, (0, t._)`[${le}]`);
  }
  e.reportError = s;
  function a(y, m = e.keywordError, v) {
    const { it: N } = y, { gen: R, compositeRule: O, allErrors: G } = N, B = h(y, m, v);
    c(R, B), O || G || d(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o(y, m) {
    y.assign(n.default.errors, m), y.if((0, t._)`${n.default.vErrors} !== null`, () => y.if(m, () => y.assign((0, t._)`${n.default.vErrors}.length`, m), () => y.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function l({ gen: y, keyword: m, schemaValue: v, data: N, errsCount: R, it: O }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const G = y.name("err");
    y.forRange("i", R, n.default.errors, (B) => {
      y.const(G, (0, t._)`${n.default.vErrors}[${B}]`), y.if((0, t._)`${G}.instancePath === undefined`, () => y.assign((0, t._)`${G}.instancePath`, (0, t.strConcat)(n.default.instancePath, O.errorPath))), y.assign((0, t._)`${G}.schemaPath`, (0, t.str)`${O.errSchemaPath}/${m}`), O.opts.verbose && (y.assign((0, t._)`${G}.schema`, v), y.assign((0, t._)`${G}.data`, N));
    });
  }
  e.extendErrors = l;
  function c(y, m) {
    const v = y.const("err", m);
    y.if((0, t._)`${n.default.vErrors} === null`, () => y.assign(n.default.vErrors, (0, t._)`[${v}]`), (0, t._)`${n.default.vErrors}.push(${v})`), y.code((0, t._)`${n.default.errors}++`);
  }
  function d(y, m) {
    const { gen: v, validateName: N, schemaEnv: R } = y;
    R.$async ? v.throw((0, t._)`new ${y.ValidationError}(${m})`) : (v.assign((0, t._)`${N}.errors`, m), v.return(!1));
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
  function h(y, m, v) {
    const { createErrors: N } = y.it;
    return N === !1 ? (0, t._)`{}` : b(y, m, v);
  }
  function b(y, m, v = {}) {
    const { gen: N, it: R } = y, O = [
      g(R, v),
      w(y, v)
    ];
    return _(y, m, O), N.object(...O);
  }
  function g({ errorPath: y }, { instancePath: m }) {
    const v = m ? (0, t.str)`${y}${(0, r.getErrorPath)(m, r.Type.Str)}` : y;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, v)];
  }
  function w({ keyword: y, it: { errSchemaPath: m } }, { schemaPath: v, parentSchema: N }) {
    let R = N ? m : (0, t.str)`${m}/${y}`;
    return v && (R = (0, t.str)`${R}${(0, r.getErrorPath)(v, r.Type.Str)}`), [u.schemaPath, R];
  }
  function _(y, { params: m, message: v }, N) {
    const { keyword: R, data: O, schemaValue: G, it: B } = y, { opts: le, propertyName: fe, topSchemaRef: pe, schemaPath: z } = B;
    N.push([u.keyword, R], [u.params, typeof m == "function" ? m(y) : m || (0, t._)`{}`]), le.messages && N.push([u.message, typeof v == "function" ? v(y) : v]), le.verbose && N.push([u.schema, G], [u.parentSchema, (0, t._)`${pe}${z}`], [n.default.data, O]), fe && N.push([u.propertyName, fe]);
  }
})(rn);
Object.defineProperty($r, "__esModule", { value: !0 });
$r.boolOrEmptySchema = $r.topBoolOrEmptySchema = void 0;
const jd = rn, kd = W, Ad = Ve, Cd = {
  message: "boolean schema is false"
};
function Dd(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Qc(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Ad.default.data) : (t.assign((0, kd._)`${n}.errors`, null), t.return(!0));
}
$r.topBoolOrEmptySchema = Dd;
function Md(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Qc(e)) : r.var(t, !0);
}
$r.boolOrEmptySchema = Md;
function Qc(e, t) {
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
  (0, jd.reportError)(s, Cd, void 0, t);
}
var $e = {}, xt = {};
Object.defineProperty(xt, "__esModule", { value: !0 });
xt.getRules = xt.isJSONType = void 0;
const Ld = ["string", "number", "integer", "boolean", "null", "object", "array"], Vd = new Set(Ld);
function Fd(e) {
  return typeof e == "string" && Vd.has(e);
}
xt.isJSONType = Fd;
function zd() {
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
xt.getRules = zd;
var ct = {};
Object.defineProperty(ct, "__esModule", { value: !0 });
ct.shouldUseRule = ct.shouldUseGroup = ct.schemaHasRulesForType = void 0;
function Ud({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Zc(e, n);
}
ct.schemaHasRulesForType = Ud;
function Zc(e, t) {
  return t.rules.some((r) => xc(e, r));
}
ct.shouldUseGroup = Zc;
function xc(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
ct.shouldUseRule = xc;
Object.defineProperty($e, "__esModule", { value: !0 });
$e.reportTypeError = $e.checkDataTypes = $e.checkDataType = $e.coerceAndCheckDataType = $e.getJSONTypes = $e.getSchemaTypes = $e.DataType = void 0;
const qd = xt, Gd = ct, Kd = rn, Y = W, el = A;
var fr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(fr || ($e.DataType = fr = {}));
function Hd(e) {
  const t = tl(e.type);
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
$e.getSchemaTypes = Hd;
function tl(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(qd.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
$e.getJSONTypes = tl;
function Jd(e, t) {
  const { gen: r, data: n, opts: s } = e, a = Xd(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, Gd.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const l = ca(t, n, s.strictNumbers, fr.Wrong);
    r.if(l, () => {
      a.length ? Bd(e, t, a) : la(e);
    });
  }
  return o;
}
$e.coerceAndCheckDataType = Jd;
const rl = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function Xd(e, t) {
  return t ? e.filter((r) => rl.has(r) || t === "array" && r === "array") : [];
}
function Bd(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, Y._)`typeof ${s}`), l = n.let("coerced", (0, Y._)`undefined`);
  a.coerceTypes === "array" && n.if((0, Y._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, Y._)`${s}[0]`).assign(o, (0, Y._)`typeof ${s}`).if(ca(t, s, a.strictNumbers), () => n.assign(l, s))), n.if((0, Y._)`${l} !== undefined`);
  for (const d of r)
    (rl.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), la(e), n.endIf(), n.if((0, Y._)`${l} !== undefined`, () => {
    n.assign(s, l), Wd(e, l);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, Y._)`${o} == "number" || ${o} == "boolean"`).assign(l, (0, Y._)`"" + ${s}`).elseIf((0, Y._)`${s} === null`).assign(l, (0, Y._)`""`);
        return;
      case "number":
        n.elseIf((0, Y._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, Y._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, Y._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, Y._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, Y._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, Y._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, Y._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, Y._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(l, (0, Y._)`[${s}]`);
    }
  }
}
function Wd({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, Y._)`${t} !== undefined`, () => e.assign((0, Y._)`${t}[${r}]`, n));
}
function zs(e, t, r, n = fr.Correct) {
  const s = n === fr.Correct ? Y.operators.EQ : Y.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, Y._)`${t} ${s} null`;
    case "array":
      a = (0, Y._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, Y._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, Y._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, Y._)`typeof ${t} ${s} ${e}`;
  }
  return n === fr.Correct ? a : (0, Y.not)(a);
  function o(l = Y.nil) {
    return (0, Y.and)((0, Y._)`typeof ${t} == "number"`, l, r ? (0, Y._)`isFinite(${t})` : Y.nil);
  }
}
$e.checkDataType = zs;
function ca(e, t, r, n) {
  if (e.length === 1)
    return zs(e[0], t, r, n);
  let s;
  const a = (0, el.toHash)(e);
  if (a.array && a.object) {
    const o = (0, Y._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, Y._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = Y.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, Y.and)(s, zs(o, t, r, n));
  return s;
}
$e.checkDataTypes = ca;
const Yd = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, Y._)`{type: ${e}}` : (0, Y._)`{type: ${t}}`
};
function la(e) {
  const t = Qd(e);
  (0, Kd.reportError)(t, Yd);
}
$e.reportTypeError = la;
function Qd(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, el.schemaRefOrVal)(e, n, "type");
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
var Zn = {};
Object.defineProperty(Zn, "__esModule", { value: !0 });
Zn.assignDefaults = void 0;
const rr = W, Zd = A;
function xd(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      pi(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => pi(e, a, s.default));
}
Zn.assignDefaults = xd;
function pi(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const l = (0, rr._)`${a}${(0, rr.getProperty)(t)}`;
  if (s) {
    (0, Zd.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let c = (0, rr._)`${l} === undefined`;
  o.useDefaults === "empty" && (c = (0, rr._)`${c} || ${l} === null || ${l} === ""`), n.if(c, (0, rr._)`${l} = ${(0, rr.stringify)(r)}`);
}
var tt = {}, ee = {};
Object.defineProperty(ee, "__esModule", { value: !0 });
ee.validateUnion = ee.validateArray = ee.usePattern = ee.callValidateCode = ee.schemaProperties = ee.allSchemaProperties = ee.noPropertyInData = ee.propertyInData = ee.isOwnProperty = ee.hasPropFunc = ee.reportMissingProp = ee.checkMissingProp = ee.checkReportMissingProp = void 0;
const ie = W, ua = A, yt = Ve, ef = A;
function tf(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(fa(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, ie._)`${t}` }, !0), e.error();
  });
}
ee.checkReportMissingProp = tf;
function rf({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, ie.or)(...n.map((a) => (0, ie.and)(fa(e, t, a, r.ownProperties), (0, ie._)`${s} = ${a}`)));
}
ee.checkMissingProp = rf;
function nf(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ee.reportMissingProp = nf;
function nl(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ie._)`Object.prototype.hasOwnProperty`
  });
}
ee.hasPropFunc = nl;
function da(e, t, r) {
  return (0, ie._)`${nl(e)}.call(${t}, ${r})`;
}
ee.isOwnProperty = da;
function sf(e, t, r, n) {
  const s = (0, ie._)`${t}${(0, ie.getProperty)(r)} !== undefined`;
  return n ? (0, ie._)`${s} && ${da(e, t, r)}` : s;
}
ee.propertyInData = sf;
function fa(e, t, r, n) {
  const s = (0, ie._)`${t}${(0, ie.getProperty)(r)} === undefined`;
  return n ? (0, ie.or)(s, (0, ie.not)(da(e, t, r))) : s;
}
ee.noPropertyInData = fa;
function sl(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ee.allSchemaProperties = sl;
function af(e, t) {
  return sl(t).filter((r) => !(0, ua.alwaysValidSchema)(e, t[r]));
}
ee.schemaProperties = af;
function of({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, l, c, d) {
  const u = d ? (0, ie._)`${e}, ${t}, ${n}${s}` : t, h = [
    [yt.default.instancePath, (0, ie.strConcat)(yt.default.instancePath, a)],
    [yt.default.parentData, o.parentData],
    [yt.default.parentDataProperty, o.parentDataProperty],
    [yt.default.rootData, yt.default.rootData]
  ];
  o.opts.dynamicRef && h.push([yt.default.dynamicAnchors, yt.default.dynamicAnchors]);
  const b = (0, ie._)`${u}, ${r.object(...h)}`;
  return c !== ie.nil ? (0, ie._)`${l}.call(${c}, ${b})` : (0, ie._)`${l}(${b})`;
}
ee.callValidateCode = of;
const cf = (0, ie._)`new RegExp`;
function lf({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, ie._)`${s.code === "new RegExp" ? cf : (0, ef.useFunc)(e, s)}(${r}, ${n})`
  });
}
ee.usePattern = lf;
function uf(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return o(() => t.assign(l, !1)), l;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(l) {
    const c = t.const("len", (0, ie._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: ua.Type.Num
      }, a), t.if((0, ie.not)(a), l);
    });
  }
}
ee.validateArray = uf;
function df(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, ua.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(o, (0, ie._)`${o} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, ie.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
ee.validateUnion = df;
Object.defineProperty(tt, "__esModule", { value: !0 });
tt.validateKeywordUsage = tt.validSchemaType = tt.funcKeywordCode = tt.macroKeywordCode = void 0;
const Oe = W, Ht = Ve, ff = ee, hf = rn;
function mf(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, l = t.macro.call(o.self, s, a, o), c = al(r, n, l);
  o.opts.validateSchema !== !1 && o.self.validateSchema(l, !0);
  const d = r.name("valid");
  e.subschema({
    schema: l,
    schemaPath: Oe.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
tt.macroKeywordCode = mf;
function pf(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: l, it: c } = e;
  yf(c, t);
  const d = !l && t.compile ? t.compile.call(c.self, a, o, c) : t.validate, u = al(n, s, d), h = n.let("valid");
  e.block$data(h, b), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function b() {
    if (t.errors === !1)
      _(), t.modifying && $i(e), y(() => e.error());
    else {
      const m = t.async ? g() : w();
      t.modifying && $i(e), y(() => $f(e, m));
    }
  }
  function g() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, Oe._)`await `), (v) => n.assign(h, !1).if((0, Oe._)`${v} instanceof ${c.ValidationError}`, () => n.assign(m, (0, Oe._)`${v}.errors`), () => n.throw(v))), m;
  }
  function w() {
    const m = (0, Oe._)`${u}.errors`;
    return n.assign(m, null), _(Oe.nil), m;
  }
  function _(m = t.async ? (0, Oe._)`await ` : Oe.nil) {
    const v = c.opts.passContext ? Ht.default.this : Ht.default.self, N = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, Oe._)`${m}${(0, ff.callValidateCode)(e, u, v, N)}`, t.modifying);
  }
  function y(m) {
    var v;
    n.if((0, Oe.not)((v = t.valid) !== null && v !== void 0 ? v : h), m);
  }
}
tt.funcKeywordCode = pf;
function $i(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Oe._)`${n.parentData}[${n.parentDataProperty}]`));
}
function $f(e, t) {
  const { gen: r } = e;
  r.if((0, Oe._)`Array.isArray(${t})`, () => {
    r.assign(Ht.default.vErrors, (0, Oe._)`${Ht.default.vErrors} === null ? ${t} : ${Ht.default.vErrors}.concat(${t})`).assign(Ht.default.errors, (0, Oe._)`${Ht.default.vErrors}.length`), (0, hf.extendErrors)(e);
  }, () => e.error());
}
function yf({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function al(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Oe.stringify)(r) });
}
function _f(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
tt.validSchemaType = _f;
function gf({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((l) => !Object.prototype.hasOwnProperty.call(e, l)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
tt.validateKeywordUsage = gf;
var Rt = {};
Object.defineProperty(Rt, "__esModule", { value: !0 });
Rt.extendSubschemaMode = Rt.extendSubschemaData = Rt.getSubschema = void 0;
const xe = W, ol = A;
function vf(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const l = e.schema[t];
    return r === void 0 ? {
      schema: l,
      schemaPath: (0, xe._)`${e.schemaPath}${(0, xe.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: l[r],
      schemaPath: (0, xe._)`${e.schemaPath}${(0, xe.getProperty)(t)}${(0, xe.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, ol.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: o,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Rt.getSubschema = vf;
function wf(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, b = l.let("data", (0, xe._)`${t.data}${(0, xe.getProperty)(r)}`, !0);
    c(b), e.errorPath = (0, xe.str)`${d}${(0, ol.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, xe._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof xe.Name ? s : l.let("data", s, !0);
    c(d), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Rt.extendSubschemaData = wf;
function Ef(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Rt.extendSubschemaMode = Ef;
var we = {}, xn = function e(t, r) {
  if (t === r) return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor) return !1;
    var n, s, a;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length) return !1;
      for (s = n; s-- !== 0; )
        if (!e(t[s], r[s])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
    if (a = Object.keys(t), n = a.length, n !== Object.keys(r).length) return !1;
    for (s = n; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, a[s])) return !1;
    for (s = n; s-- !== 0; ) {
      var o = a[s];
      if (!e(t[o], r[o])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, il = { exports: {} }, Pt = il.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  On(t, n, s, e, "", e);
};
Pt.keywords = {
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
Pt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Pt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Pt.skipKeywords = {
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
function On(e, t, r, n, s, a, o, l, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, l, c, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in Pt.arrayKeywords)
          for (var b = 0; b < h.length; b++)
            On(e, t, r, h[b], s + "/" + u + "/" + b, a, s, u, n, b);
      } else if (u in Pt.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            On(e, t, r, h[g], s + "/" + u + "/" + bf(g), a, s, u, n, g);
      } else (u in Pt.keywords || e.allKeys && !(u in Pt.skipKeywords)) && On(e, t, r, h, s + "/" + u, a, s, u, n);
    }
    r(n, s, a, o, l, c, d);
  }
}
function bf(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Sf = il.exports;
Object.defineProperty(we, "__esModule", { value: !0 });
we.getSchemaRefs = we.resolveUrl = we.normalizeId = we._getFullPath = we.getFullPath = we.inlineRef = void 0;
const Pf = A, Nf = xn, Rf = Sf, Of = /* @__PURE__ */ new Set([
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
function If(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Us(e) : t ? cl(e) <= t : !1;
}
we.inlineRef = If;
const Tf = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Us(e) {
  for (const t in e) {
    if (Tf.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Us) || typeof r == "object" && Us(r))
      return !0;
  }
  return !1;
}
function cl(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Of.has(r) && (typeof e[r] == "object" && (0, Pf.eachItem)(e[r], (n) => t += cl(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function ll(e, t = "", r) {
  r !== !1 && (t = hr(t));
  const n = e.parse(t);
  return ul(e, n);
}
we.getFullPath = ll;
function ul(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
we._getFullPath = ul;
const jf = /#\/?$/;
function hr(e) {
  return e ? e.replace(jf, "") : "";
}
we.normalizeId = hr;
function kf(e, t, r) {
  return r = hr(r), e.resolve(t, r);
}
we.resolveUrl = kf;
const Af = /^[a-z_][-a-z0-9._]*$/i;
function Cf(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = hr(e[r] || t), a = { "": s }, o = ll(n, s, !1), l = {}, c = /* @__PURE__ */ new Set();
  return Rf(e, { allKeys: !0 }, (h, b, g, w) => {
    if (w === void 0)
      return;
    const _ = o + b;
    let y = a[w];
    typeof h[r] == "string" && (y = m.call(this, h[r])), v.call(this, h.$anchor), v.call(this, h.$dynamicAnchor), a[b] = y;
    function m(N) {
      const R = this.opts.uriResolver.resolve;
      if (N = hr(y ? R(y, N) : N), c.has(N))
        throw u(N);
      c.add(N);
      let O = this.refs[N];
      return typeof O == "string" && (O = this.refs[O]), typeof O == "object" ? d(h, O.schema, N) : N !== hr(_) && (N[0] === "#" ? (d(h, l[N], N), l[N] = h) : this.refs[N] = _), N;
    }
    function v(N) {
      if (typeof N == "string") {
        if (!Af.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), l;
  function d(h, b, g) {
    if (b !== void 0 && !Nf(h, b))
      throw u(g);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
we.getSchemaRefs = Cf;
Object.defineProperty(Be, "__esModule", { value: !0 });
Be.getData = Be.KeywordCxt = Be.validateFunctionCode = void 0;
const dl = $r, yi = $e, ha = ct, Fn = $e, Df = Zn, Gr = tt, gs = Rt, U = W, J = Ve, Mf = we, lt = A, Dr = rn;
function Lf(e) {
  if (ml(e) && (pl(e), hl(e))) {
    zf(e);
    return;
  }
  fl(e, () => (0, dl.topBoolOrEmptySchema)(e));
}
Be.validateFunctionCode = Lf;
function fl({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, U._)`${J.default.data}, ${J.default.valCxt}`, n.$async, () => {
    e.code((0, U._)`"use strict"; ${_i(r, s)}`), Ff(e, s), e.code(a);
  }) : e.func(t, (0, U._)`${J.default.data}, ${Vf(s)}`, n.$async, () => e.code(_i(r, s)).code(a));
}
function Vf(e) {
  return (0, U._)`{${J.default.instancePath}="", ${J.default.parentData}, ${J.default.parentDataProperty}, ${J.default.rootData}=${J.default.data}${e.dynamicRef ? (0, U._)`, ${J.default.dynamicAnchors}={}` : U.nil}}={}`;
}
function Ff(e, t) {
  e.if(J.default.valCxt, () => {
    e.var(J.default.instancePath, (0, U._)`${J.default.valCxt}.${J.default.instancePath}`), e.var(J.default.parentData, (0, U._)`${J.default.valCxt}.${J.default.parentData}`), e.var(J.default.parentDataProperty, (0, U._)`${J.default.valCxt}.${J.default.parentDataProperty}`), e.var(J.default.rootData, (0, U._)`${J.default.valCxt}.${J.default.rootData}`), t.dynamicRef && e.var(J.default.dynamicAnchors, (0, U._)`${J.default.valCxt}.${J.default.dynamicAnchors}`);
  }, () => {
    e.var(J.default.instancePath, (0, U._)`""`), e.var(J.default.parentData, (0, U._)`undefined`), e.var(J.default.parentDataProperty, (0, U._)`undefined`), e.var(J.default.rootData, J.default.data), t.dynamicRef && e.var(J.default.dynamicAnchors, (0, U._)`{}`);
  });
}
function zf(e) {
  const { schema: t, opts: r, gen: n } = e;
  fl(e, () => {
    r.$comment && t.$comment && yl(e), Hf(e), n.let(J.default.vErrors, null), n.let(J.default.errors, 0), r.unevaluated && Uf(e), $l(e), Bf(e);
  });
}
function Uf(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, U._)`${r}.evaluated`), t.if((0, U._)`${e.evaluated}.dynamicProps`, () => t.assign((0, U._)`${e.evaluated}.props`, (0, U._)`undefined`)), t.if((0, U._)`${e.evaluated}.dynamicItems`, () => t.assign((0, U._)`${e.evaluated}.items`, (0, U._)`undefined`));
}
function _i(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, U._)`/*# sourceURL=${r} */` : U.nil;
}
function qf(e, t) {
  if (ml(e) && (pl(e), hl(e))) {
    Gf(e, t);
    return;
  }
  (0, dl.boolOrEmptySchema)(e, t);
}
function hl({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function ml(e) {
  return typeof e.schema != "boolean";
}
function Gf(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && yl(e), Jf(e), Xf(e);
  const a = n.const("_errs", J.default.errors);
  $l(e, a), n.var(t, (0, U._)`${a} === ${J.default.errors}`);
}
function pl(e) {
  (0, lt.checkUnknownRules)(e), Kf(e);
}
function $l(e, t) {
  if (e.opts.jtd)
    return gi(e, [], !1, t);
  const r = (0, yi.getSchemaTypes)(e.schema), n = (0, yi.coerceAndCheckDataType)(e, r);
  gi(e, r, !n, t);
}
function Kf(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, lt.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function Hf(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, lt.checkStrictMode)(e, "default is ignored in the schema root");
}
function Jf(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, Mf.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function Xf(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function yl({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, U._)`${J.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, U.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, U._)`${J.default.self}.opts.$comment(${a}, ${o}, ${l}.schema)`);
  }
}
function Bf(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, U._)`${J.default.errors} === 0`, () => t.return(J.default.data), () => t.throw((0, U._)`new ${s}(${J.default.vErrors})`)) : (t.assign((0, U._)`${n}.errors`, J.default.vErrors), a.unevaluated && Wf(e), t.return((0, U._)`${J.default.errors} === 0`));
}
function Wf({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof U.Name && e.assign((0, U._)`${t}.props`, r), n instanceof U.Name && e.assign((0, U._)`${t}.items`, n);
}
function gi(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: l, opts: c, self: d } = e, { RULES: u } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, lt.schemaHasRulesButRef)(a, u))) {
    s.block(() => vl(e, "$ref", u.all.$ref.definition));
    return;
  }
  c.jtd || Yf(e, t), s.block(() => {
    for (const b of u.rules)
      h(b);
    h(u.post);
  });
  function h(b) {
    (0, ha.shouldUseGroup)(a, b) && (b.type ? (s.if((0, Fn.checkDataType)(b.type, o, c.strictNumbers)), vi(e, b), t.length === 1 && t[0] === b.type && r && (s.else(), (0, Fn.reportTypeError)(e)), s.endIf()) : vi(e, b), l || s.if((0, U._)`${J.default.errors} === ${n || 0}`));
  }
}
function vi(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, Df.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, ha.shouldUseRule)(n, a) && vl(e, a.keyword, a.definition, t.type);
  });
}
function Yf(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (Qf(e, t), e.opts.allowUnionTypes || Zf(e, t), xf(e, e.dataTypes));
}
function Qf(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      _l(e.dataTypes, r) || ma(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), th(e, t);
  }
}
function Zf(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && ma(e, "use allowUnionTypes to allow union type keyword");
}
function xf(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, ha.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => eh(t, o)) && ma(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function eh(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function _l(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function th(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    _l(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function ma(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, lt.checkStrictMode)(e, t, e.opts.strictTypes);
}
let gl = class {
  constructor(t, r, n) {
    if ((0, Gr.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, lt.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", wl(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Gr.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", J.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, U.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, U.not)(t), void 0, r);
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
    this.fail((0, U._)`${r} !== undefined && (${(0, U.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Dr.reportExtraError : Dr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Dr.reportError)(this, this.def.$dataError || Dr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Dr.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = U.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = U.nil, r = U.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, U.or)((0, U._)`${s} === undefined`, r)), t !== U.nil && n.assign(t, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== U.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, U.or)(o(), l());
    function o() {
      if (n.length) {
        if (!(r instanceof U.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, U._)`${(0, Fn.checkDataTypes)(c, r, a.opts.strictNumbers, Fn.DataType.Wrong)}`;
      }
      return U.nil;
    }
    function l() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, U._)`!${c}(${r})`;
      }
      return U.nil;
    }
  }
  subschema(t, r) {
    const n = (0, gs.getSubschema)(this.it, t);
    (0, gs.extendSubschemaData)(n, this.it, t), (0, gs.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return qf(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = lt.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = lt.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, U.Name)), !0;
  }
};
Be.KeywordCxt = gl;
function vl(e, t, r, n) {
  const s = new gl(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Gr.funcKeywordCode)(s, r) : "macro" in r ? (0, Gr.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Gr.funcKeywordCode)(s, r);
}
const rh = /^\/(?:[^~]|~0|~1)*$/, nh = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function wl(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return J.default.rootData;
  if (e[0] === "/") {
    if (!rh.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = J.default.rootData;
  } else {
    const d = nh.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const u = +d[1];
    if (s = d[2], s === "#") {
      if (u >= t)
        throw new Error(c("property/index", u));
      return n[t - u];
    }
    if (u > t)
      throw new Error(c("data", u));
    if (a = r[t - u], !s)
      return a;
  }
  let o = a;
  const l = s.split("/");
  for (const d of l)
    d && (a = (0, U._)`${a}${(0, U.getProperty)((0, lt.unescapeJsonPointer)(d))}`, o = (0, U._)`${o} && ${a}`);
  return o;
  function c(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
Be.getData = wl;
var ln = {}, wi;
function pa() {
  if (wi) return ln;
  wi = 1, Object.defineProperty(ln, "__esModule", { value: !0 });
  class e extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return ln.default = e, ln;
}
var vr = {};
Object.defineProperty(vr, "__esModule", { value: !0 });
const vs = we;
let sh = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, vs.resolveUrl)(t, r, n), this.missingSchema = (0, vs.normalizeId)((0, vs.getFullPath)(t, this.missingRef));
  }
};
vr.default = sh;
var Te = {};
Object.defineProperty(Te, "__esModule", { value: !0 });
Te.resolveSchema = Te.getCompilingSchema = Te.resolveRef = Te.compileSchema = Te.SchemaEnv = void 0;
const qe = W, ah = pa(), Gt = Ve, Je = we, Ei = A, oh = Be;
let es = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Je.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
Te.SchemaEnv = es;
function $a(e) {
  const t = El.call(this, e);
  if (t)
    return t;
  const r = (0, Je.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new qe.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let l;
  e.$async && (l = o.scopeValue("Error", {
    ref: ah.default,
    code: (0, qe._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: Gt.default.data,
    parentData: Gt.default.parentData,
    parentDataProperty: Gt.default.parentDataProperty,
    dataNames: [Gt.default.data],
    dataPathArr: [qe.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, qe.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: l,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: qe.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, qe._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, oh.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    u = `${o.scopeRefs(Gt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const g = new Function(`${Gt.default.self}`, `${Gt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: _ } = d;
      g.evaluated = {
        props: w instanceof qe.Name ? void 0 : w,
        items: _ instanceof qe.Name ? void 0 : _,
        dynamicProps: w instanceof qe.Name,
        dynamicItems: _ instanceof qe.Name
      }, g.source && (g.source.evaluated = (0, qe.stringify)(g.evaluated));
    }
    return e.validate = g, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
Te.compileSchema = $a;
function ih(e, t, r) {
  var n;
  r = (0, Je.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = uh.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    o && (a = new es({ schema: o, schemaId: l, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = ch.call(this, a);
}
Te.resolveRef = ih;
function ch(e) {
  return (0, Je.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : $a.call(this, e);
}
function El(e) {
  for (const t of this._compilations)
    if (lh(t, e))
      return t;
}
Te.getCompilingSchema = El;
function lh(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function uh(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || ts.call(this, e, t);
}
function ts(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Je._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Je.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return ws.call(this, r, e);
  const a = (0, Je.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const l = ts.call(this, e, o);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : ws.call(this, r, l);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || $a.call(this, o), a === (0, Je.normalizeId)(t)) {
      const { schema: l } = o, { schemaId: c } = this.opts, d = l[c];
      return d && (s = (0, Je.resolveUrl)(this.opts.uriResolver, s, d)), new es({ schema: l, schemaId: c, root: e, baseId: s });
    }
    return ws.call(this, r, o);
  }
}
Te.resolveSchema = ts;
const dh = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function ws(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Ei.unescapeFragment)(l)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !dh.has(l) && d && (t = (0, Je.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, Ei.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, Je.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = ts.call(this, n, l);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new es({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const fh = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", hh = "Meta-schema for $data reference (JSON AnySchema extension proposal)", mh = "object", ph = [
  "$data"
], $h = {
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
}, yh = !1, _h = {
  $id: fh,
  description: hh,
  type: mh,
  required: ph,
  properties: $h,
  additionalProperties: yh
};
var ya = {}, rs = { exports: {} };
const gh = {
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
var vh = {
  HEX: gh
};
const { HEX: wh } = vh, Eh = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
function bl(e) {
  if (Pl(e, ".") < 3)
    return { host: e, isIPV4: !1 };
  const t = e.match(Eh) || [], [r] = t;
  return r ? { host: Sh(r, "."), isIPV4: !0 } : { host: e, isIPV4: !1 };
}
function bi(e, t = !1) {
  let r = "", n = !0;
  for (const s of e) {
    if (wh[s] === void 0) return;
    s !== "0" && n === !0 && (n = !1), n || (r += s);
  }
  return t && r.length === 0 && (r = "0"), r;
}
function bh(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, o = !1, l = !1;
  function c() {
    if (s.length) {
      if (a === !1) {
        const d = bi(s);
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
        if (o === !0 && (l = !0), !c())
          break;
        if (t++, n.push(":"), t > 7) {
          r.error = !0;
          break;
        }
        d - 1 >= 0 && e[d - 1] === ":" && (o = !0);
        continue;
      } else if (u === "%") {
        if (!c())
          break;
        a = !0;
      } else {
        s.push(u);
        continue;
      }
  }
  return s.length && (a ? r.zone = s.join("") : l ? n.push(s.join("")) : n.push(bi(s))), r.address = n.join(""), r;
}
function Sl(e) {
  if (Pl(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = bh(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, escapedHost: n, isIPV6: !0 };
  }
}
function Sh(e, t) {
  let r = "", n = !0;
  const s = e.length;
  for (let a = 0; a < s; a++) {
    const o = e[a];
    o === "0" && n ? (a + 1 <= s && e[a + 1] === t || a + 1 === s) && (r += o, n = !1) : (o === t ? n = !0 : n = !1, r += o);
  }
  return r;
}
function Pl(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
const Si = /^\.\.?\//u, Pi = /^\/\.(?:\/|$)/u, Ni = /^\/\.\.(?:\/|$)/u, Ph = /^\/?(?:.|\n)*?(?=\/|$)/u;
function Nh(e) {
  const t = [];
  for (; e.length; )
    if (e.match(Si))
      e = e.replace(Si, "");
    else if (e.match(Pi))
      e = e.replace(Pi, "/");
    else if (e.match(Ni))
      e = e.replace(Ni, "/"), t.pop();
    else if (e === "." || e === "..")
      e = "";
    else {
      const r = e.match(Ph);
      if (r) {
        const n = r[0];
        e = e.slice(n.length), t.push(n);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return t.join("");
}
function Rh(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function Oh(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    const n = bl(r);
    if (n.isIPV4)
      r = n.host;
    else {
      const s = Sl(n.host);
      s.isIPV6 === !0 ? r = `[${s.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var Ih = {
  recomposeAuthority: Oh,
  normalizeComponentEncoding: Rh,
  removeDotSegments: Nh,
  normalizeIPv4: bl,
  normalizeIPv6: Sl
};
const Th = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, jh = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Nl(e) {
  return typeof e.secure == "boolean" ? e.secure : String(e.scheme).toLowerCase() === "wss";
}
function Rl(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function Ol(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function kh(e) {
  return e.secure = Nl(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function Ah(e) {
  if ((e.port === (Nl(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function Ch(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(jh);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, a = _a[s];
    e.path = void 0, a && (e = a.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function Dh(e, t) {
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, a = _a[s];
  a && (e = a.serialize(e, t));
  const o = e, l = e.nss;
  return o.path = `${n || t.nid}:${l}`, t.skipEscape = !0, o;
}
function Mh(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !Th.test(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function Lh(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const Il = {
  scheme: "http",
  domainHost: !0,
  parse: Rl,
  serialize: Ol
}, Vh = {
  scheme: "https",
  domainHost: Il.domainHost,
  parse: Rl,
  serialize: Ol
}, In = {
  scheme: "ws",
  domainHost: !0,
  parse: kh,
  serialize: Ah
}, Fh = {
  scheme: "wss",
  domainHost: In.domainHost,
  parse: In.parse,
  serialize: In.serialize
}, zh = {
  scheme: "urn",
  parse: Ch,
  serialize: Dh,
  skipNormalize: !0
}, Uh = {
  scheme: "urn:uuid",
  parse: Mh,
  serialize: Lh,
  skipNormalize: !0
}, _a = {
  http: Il,
  https: Vh,
  ws: In,
  wss: Fh,
  urn: zh,
  "urn:uuid": Uh
};
var qh = _a;
const { normalizeIPv6: Gh, normalizeIPv4: Kh, removeDotSegments: zr, recomposeAuthority: Hh, normalizeComponentEncoding: un } = Ih, ga = qh;
function Jh(e, t) {
  return typeof e == "string" ? e = rt(ft(e, t), t) : typeof e == "object" && (e = ft(rt(e, t), t)), e;
}
function Xh(e, t, r) {
  const n = Object.assign({ scheme: "null" }, r), s = Tl(ft(e, n), ft(t, n), n, !0);
  return rt(s, { ...n, skipEscape: !0 });
}
function Tl(e, t, r, n) {
  const s = {};
  return n || (e = ft(rt(e, r), r), t = ft(rt(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = zr(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = zr(t.path || ""), s.query = t.query) : (t.path ? (t.path.charAt(0) === "/" ? s.path = zr(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = zr(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function Bh(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = rt(un(ft(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = rt(un(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = rt(un(ft(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = rt(un(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function rt(e, t) {
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
  }, n = Object.assign({}, t), s = [], a = ga[(n.scheme || r.scheme || "").toLowerCase()];
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const o = Hh(r);
  if (o !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(o), r.path && r.path.charAt(0) !== "/" && s.push("/")), r.path !== void 0) {
    let l = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (l = zr(l)), o === void 0 && (l = l.replace(/^\/\//u, "/%2F")), s.push(l);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const Wh = Array.from({ length: 127 }, (e, t) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(t)));
function Yh(e) {
  let t = 0;
  for (let r = 0, n = e.length; r < n; ++r)
    if (t = e.charCodeAt(r), t > 126 || Wh[t])
      return !0;
  return !1;
}
const Qh = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function ft(e, t) {
  const r = Object.assign({}, t), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  }, s = e.indexOf("%") !== -1;
  let a = !1;
  r.reference === "suffix" && (e = (r.scheme ? r.scheme + ":" : "") + "//" + e);
  const o = e.match(Qh);
  if (o) {
    if (n.scheme = o[1], n.userinfo = o[3], n.host = o[4], n.port = parseInt(o[5], 10), n.path = o[6] || "", n.query = o[7], n.fragment = o[8], isNaN(n.port) && (n.port = o[5]), n.host) {
      const c = Kh(n.host);
      if (c.isIPV4 === !1) {
        const d = Gh(c.host);
        n.host = d.host.toLowerCase(), a = d.isIPV6;
      } else
        n.host = c.host, a = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const l = ga[(r.scheme || n.scheme || "").toLowerCase()];
    if (!r.unicodeSupport && (!l || !l.unicodeSupport) && n.host && (r.domainHost || l && l.domainHost) && a === !1 && Yh(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (c) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + c;
      }
    (!l || l && !l.skipNormalize) && (s && n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), s && n.host !== void 0 && (n.host = unescape(n.host)), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), l && l.parse && l.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const va = {
  SCHEMES: ga,
  normalize: Jh,
  resolve: Xh,
  resolveComponents: Tl,
  equal: Bh,
  serialize: rt,
  parse: ft
};
rs.exports = va;
rs.exports.default = va;
rs.exports.fastUri = va;
var jl = rs.exports;
Object.defineProperty(ya, "__esModule", { value: !0 });
const kl = jl;
kl.code = 'require("ajv/dist/runtime/uri").default';
ya.default = kl;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Be;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = W;
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
  const n = pa(), s = vr, a = xt, o = Te, l = W, c = we, d = $e, u = A, h = _h, b = ya, g = (P, p) => new RegExp(P, p);
  g.code = "new RegExp";
  const w = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
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
  ]), y = {
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
  function N(P) {
    var p, S, $, i, f, E, I, j, F, V, ne, De, It, Tt, jt, kt, At, Ct, Dt, Mt, Lt, Vt, Ft, zt, Ut;
    const Ue = P.strict, qt = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, Ir = qt === !0 || qt === void 0 ? 1 : qt || 0, Tr = ($ = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && $ !== void 0 ? $ : g, $s = (i = P.uriResolver) !== null && i !== void 0 ? i : b.default;
    return {
      strictSchema: (E = (f = P.strictSchema) !== null && f !== void 0 ? f : Ue) !== null && E !== void 0 ? E : !0,
      strictNumbers: (j = (I = P.strictNumbers) !== null && I !== void 0 ? I : Ue) !== null && j !== void 0 ? j : !0,
      strictTypes: (V = (F = P.strictTypes) !== null && F !== void 0 ? F : Ue) !== null && V !== void 0 ? V : "log",
      strictTuples: (De = (ne = P.strictTuples) !== null && ne !== void 0 ? ne : Ue) !== null && De !== void 0 ? De : "log",
      strictRequired: (Tt = (It = P.strictRequired) !== null && It !== void 0 ? It : Ue) !== null && Tt !== void 0 ? Tt : !1,
      code: P.code ? { ...P.code, optimize: Ir, regExp: Tr } : { optimize: Ir, regExp: Tr },
      loopRequired: (jt = P.loopRequired) !== null && jt !== void 0 ? jt : v,
      loopEnum: (kt = P.loopEnum) !== null && kt !== void 0 ? kt : v,
      meta: (At = P.meta) !== null && At !== void 0 ? At : !0,
      messages: (Ct = P.messages) !== null && Ct !== void 0 ? Ct : !0,
      inlineRefs: (Dt = P.inlineRefs) !== null && Dt !== void 0 ? Dt : !0,
      schemaId: (Mt = P.schemaId) !== null && Mt !== void 0 ? Mt : "$id",
      addUsedSchema: (Lt = P.addUsedSchema) !== null && Lt !== void 0 ? Lt : !0,
      validateSchema: (Vt = P.validateSchema) !== null && Vt !== void 0 ? Vt : !0,
      validateFormats: (Ft = P.validateFormats) !== null && Ft !== void 0 ? Ft : !0,
      unicodeRegExp: (zt = P.unicodeRegExp) !== null && zt !== void 0 ? zt : !0,
      int32range: (Ut = P.int32range) !== null && Ut !== void 0 ? Ut : !0,
      uriResolver: $s
    };
  }
  class R {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...N(p) };
      const { es5: S, lines: $ } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: _, es5: S, lines: $ }), this.logger = H(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), O.call(this, y, p, "NOT SUPPORTED"), O.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = pe.call(this), p.formats && le.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && fe.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), B.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: S, schemaId: $ } = this.opts;
      let i = h;
      $ === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), S && p && this.addMetaSchema(i, i[$], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: S } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[S] || p : void 0;
    }
    validate(p, S) {
      let $;
      if (typeof p == "string") {
        if ($ = this.getSchema(p), !$)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        $ = this.compile(p);
      const i = $(S);
      return "$async" in $ || (this.errors = $.errors), i;
    }
    compile(p, S) {
      const $ = this._addSchema(p, S);
      return $.validate || this._compileSchemaEnv($);
    }
    compileAsync(p, S) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: $ } = this.opts;
      return i.call(this, p, S);
      async function i(V, ne) {
        await f.call(this, V.$schema);
        const De = this._addSchema(V, ne);
        return De.validate || E.call(this, De);
      }
      async function f(V) {
        V && !this.getSchema(V) && await i.call(this, { $ref: V }, !0);
      }
      async function E(V) {
        try {
          return this._compileSchemaEnv(V);
        } catch (ne) {
          if (!(ne instanceof s.default))
            throw ne;
          return I.call(this, ne), await j.call(this, ne.missingSchema), E.call(this, V);
        }
      }
      function I({ missingSchema: V, missingRef: ne }) {
        if (this.refs[V])
          throw new Error(`AnySchema ${V} is loaded but ${ne} cannot be resolved`);
      }
      async function j(V) {
        const ne = await F.call(this, V);
        this.refs[V] || await f.call(this, ne.$schema), this.refs[V] || this.addSchema(ne, V, S);
      }
      async function F(V) {
        const ne = this._loading[V];
        if (ne)
          return ne;
        try {
          return await (this._loading[V] = $(V));
        } finally {
          delete this._loading[V];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, S, $, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const E of p)
          this.addSchema(E, void 0, $, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: E } = this.opts;
        if (f = p[E], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${E} must be string`);
      }
      return S = (0, c.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(p, $, S, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, S, $ = this.opts.validateSchema) {
      return this.addSchema(p, S, !0, $), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, S) {
      if (typeof p == "boolean")
        return !0;
      let $;
      if ($ = p.$schema, $ !== void 0 && typeof $ != "string")
        throw new Error("$schema must be a string");
      if ($ = $ || this.opts.defaultMeta || this.defaultMeta(), !$)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate($, p);
      if (!i && S) {
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
      let S;
      for (; typeof (S = G.call(this, p)) == "string"; )
        p = S;
      if (S === void 0) {
        const { schemaId: $ } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: $ });
        if (S = o.resolveSchema.call(this, i, p), !S)
          return;
        this.refs[p] = S;
      }
      return S.validate || this._compileSchemaEnv(S);
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
          const S = G.call(this, p);
          return typeof S == "object" && this._cache.delete(S.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const S = p;
          this._cache.delete(S);
          let $ = p[this.opts.schemaId];
          return $ && ($ = (0, c.normalizeId)($), delete this.schemas[$], delete this.refs[$]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const S of p)
        this.addKeyword(S);
      return this;
    }
    addKeyword(p, S) {
      let $;
      if (typeof p == "string")
        $ = p, typeof S == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), S.keyword = $);
      else if (typeof p == "object" && S === void 0) {
        if (S = p, $ = S.keyword, Array.isArray($) && !$.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (T.call(this, $, S), !S)
        return (0, u.eachItem)($, (f) => k.call(this, f)), this;
      D.call(this, S);
      const i = {
        ...S,
        type: (0, d.getJSONTypes)(S.type),
        schemaType: (0, d.getJSONTypes)(S.schemaType)
      };
      return (0, u.eachItem)($, i.type.length === 0 ? (f) => k.call(this, f, i) : (f) => i.type.forEach((E) => k.call(this, f, i, E))), this;
    }
    getKeyword(p) {
      const S = this.RULES.all[p];
      return typeof S == "object" ? S.definition : !!S;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: S } = this;
      delete S.keywords[p], delete S.all[p];
      for (const $ of S.rules) {
        const i = $.rules.findIndex((f) => f.keyword === p);
        i >= 0 && $.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, S) {
      return typeof S == "string" && (S = new RegExp(S)), this.formats[p] = S, this;
    }
    errorsText(p = this.errors, { separator: S = ", ", dataVar: $ = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${$}${i.instancePath} ${i.message}`).reduce((i, f) => i + S + f);
    }
    $dataMetaSchema(p, S) {
      const $ = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of S) {
        const f = i.split("/").slice(1);
        let E = p;
        for (const I of f)
          E = E[I];
        for (const I in $) {
          const j = $[I];
          if (typeof j != "object")
            continue;
          const { $data: F } = j.definition, V = E[I];
          F && V && (E[I] = M(V));
        }
      }
      return p;
    }
    _removeAllSchemas(p, S) {
      for (const $ in p) {
        const i = p[$];
        (!S || S.test($)) && (typeof i == "string" ? delete p[$] : i && !i.meta && (this._cache.delete(i.schema), delete p[$]));
      }
    }
    _addSchema(p, S, $, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let E;
      const { schemaId: I } = this.opts;
      if (typeof p == "object")
        E = p[I];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let j = this._cache.get(p);
      if (j !== void 0)
        return j;
      $ = (0, c.normalizeId)(E || $);
      const F = c.getSchemaRefs.call(this, p, $);
      return j = new o.SchemaEnv({ schema: p, schemaId: I, meta: S, baseId: $, localRefs: F }), this._cache.set(j.schema, j), f && !$.startsWith("#") && ($ && this._checkUnique($), this.refs[$] = j), i && this.validateSchema(p, !0), j;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : o.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const S = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, p);
      } finally {
        this.opts = S;
      }
    }
  }
  R.ValidationError = n.default, R.MissingRefError = s.default, e.default = R;
  function O(P, p, S, $ = "error") {
    for (const i in P) {
      const f = i;
      f in p && this.logger[$](`${S}: option ${i}. ${P[f]}`);
    }
  }
  function G(P) {
    return P = (0, c.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function B() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const p in P)
          this.addSchema(P[p], p);
  }
  function le() {
    for (const P in this.opts.formats) {
      const p = this.opts.formats[P];
      p && this.addFormat(P, p);
    }
  }
  function fe(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in P) {
      const S = P[p];
      S.keyword || (S.keyword = p), this.addKeyword(S);
    }
  }
  function pe() {
    const P = { ...this.opts };
    for (const p of w)
      delete P[p];
    return P;
  }
  const z = { log() {
  }, warn() {
  }, error() {
  } };
  function H(P) {
    if (P === !1)
      return z;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const se = /^[a-z_$][a-z0-9_$:-]*$/i;
  function T(P, p) {
    const { RULES: S } = this;
    if ((0, u.eachItem)(P, ($) => {
      if (S.keywords[$])
        throw new Error(`Keyword ${$} is already defined`);
      if (!se.test($))
        throw new Error(`Keyword ${$} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(P, p, S) {
    var $;
    const i = p == null ? void 0 : p.post;
    if (S && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let E = i ? f.post : f.rules.find(({ type: j }) => j === S);
    if (E || (E = { type: S, rules: [] }, f.rules.push(E)), f.keywords[P] = !0, !p)
      return;
    const I = {
      keyword: P,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? L.call(this, E, I, p.before) : E.rules.push(I), f.all[P] = I, ($ = p.implements) === null || $ === void 0 || $.forEach((j) => this.addKeyword(j));
  }
  function L(P, p, S) {
    const $ = P.rules.findIndex((i) => i.keyword === S);
    $ >= 0 ? P.rules.splice($, 0, p) : (P.rules.push(p), this.logger.warn(`rule ${S} is not defined`));
  }
  function D(P) {
    let { metaSchema: p } = P;
    p !== void 0 && (P.$data && this.opts.$data && (p = M(p)), P.validateSchema = this.compile(p, !0));
  }
  const K = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function M(P) {
    return { anyOf: [P, K] };
  }
})(Hc);
var wa = {}, Ea = {}, ba = {};
Object.defineProperty(ba, "__esModule", { value: !0 });
const Zh = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
ba.default = Zh;
var ht = {};
Object.defineProperty(ht, "__esModule", { value: !0 });
ht.callRef = ht.getValidate = void 0;
const xh = vr, Ri = ee, ke = W, nr = Ve, Oi = Te, dn = A, em = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: l, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = Oi.resolveRef.call(c, d, s, r);
    if (u === void 0)
      throw new xh.default(n.opts.uriResolver, s, r);
    if (u instanceof Oi.SchemaEnv)
      return b(u);
    return g(u);
    function h() {
      if (a === d)
        return Tn(e, o, a, a.$async);
      const w = t.scopeValue("root", { ref: d });
      return Tn(e, (0, ke._)`${w}.validate`, d, d.$async);
    }
    function b(w) {
      const _ = Al(e, w);
      Tn(e, _, w, w.$async);
    }
    function g(w) {
      const _ = t.scopeValue("schema", l.code.source === !0 ? { ref: w, code: (0, ke.stringify)(w) } : { ref: w }), y = t.name("valid"), m = e.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: ke.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, y);
      e.mergeEvaluated(m), e.ok(y);
    }
  }
};
function Al(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, ke._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
ht.getValidate = Al;
function Tn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: l, opts: c } = a, d = c.passContext ? nr.default.this : ke.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, ke._)`await ${(0, Ri.callValidateCode)(e, t, d)}`), g(t), o || s.assign(w, !0);
    }, (_) => {
      s.if((0, ke._)`!(${_} instanceof ${a.ValidationError})`, () => s.throw(_)), b(_), o || s.assign(w, !1);
    }), e.ok(w);
  }
  function h() {
    e.result((0, Ri.callValidateCode)(e, t, d), () => g(t), () => b(t));
  }
  function b(w) {
    const _ = (0, ke._)`${w}.errors`;
    s.assign(nr.default.vErrors, (0, ke._)`${nr.default.vErrors} === null ? ${_} : ${nr.default.vErrors}.concat(${_})`), s.assign(nr.default.errors, (0, ke._)`${nr.default.vErrors}.length`);
  }
  function g(w) {
    var _;
    if (!a.opts.unevaluated)
      return;
    const y = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (a.props !== !0)
      if (y && !y.dynamicProps)
        y.props !== void 0 && (a.props = dn.mergeEvaluated.props(s, y.props, a.props));
      else {
        const m = s.var("props", (0, ke._)`${w}.evaluated.props`);
        a.props = dn.mergeEvaluated.props(s, m, a.props, ke.Name);
      }
    if (a.items !== !0)
      if (y && !y.dynamicItems)
        y.items !== void 0 && (a.items = dn.mergeEvaluated.items(s, y.items, a.items));
      else {
        const m = s.var("items", (0, ke._)`${w}.evaluated.items`);
        a.items = dn.mergeEvaluated.items(s, m, a.items, ke.Name);
      }
  }
}
ht.callRef = Tn;
ht.default = em;
Object.defineProperty(Ea, "__esModule", { value: !0 });
const tm = ba, rm = ht, nm = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  tm.default,
  rm.default
];
Ea.default = nm;
var Sa = {}, Pa = {};
Object.defineProperty(Pa, "__esModule", { value: !0 });
const zn = W, _t = zn.operators, Un = {
  maximum: { okStr: "<=", ok: _t.LTE, fail: _t.GT },
  minimum: { okStr: ">=", ok: _t.GTE, fail: _t.LT },
  exclusiveMaximum: { okStr: "<", ok: _t.LT, fail: _t.GTE },
  exclusiveMinimum: { okStr: ">", ok: _t.GT, fail: _t.LTE }
}, sm = {
  message: ({ keyword: e, schemaCode: t }) => (0, zn.str)`must be ${Un[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, zn._)`{comparison: ${Un[e].okStr}, limit: ${t}}`
}, am = {
  keyword: Object.keys(Un),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: sm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, zn._)`${r} ${Un[t].fail} ${n} || isNaN(${r})`);
  }
};
Pa.default = am;
var Na = {};
Object.defineProperty(Na, "__esModule", { value: !0 });
const Kr = W, om = {
  message: ({ schemaCode: e }) => (0, Kr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Kr._)`{multipleOf: ${e}}`
}, im = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: om,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), l = a ? (0, Kr._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, Kr._)`${o} !== parseInt(${o})`;
    e.fail$data((0, Kr._)`(${n} === 0 || (${o} = ${r}/${n}, ${l}))`);
  }
};
Na.default = im;
var Ra = {}, Oa = {};
Object.defineProperty(Oa, "__esModule", { value: !0 });
function Cl(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Oa.default = Cl;
Cl.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Ra, "__esModule", { value: !0 });
const Jt = W, cm = A, lm = Oa, um = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Jt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Jt._)`{limit: ${e}}`
}, dm = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: um,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? Jt.operators.GT : Jt.operators.LT, o = s.opts.unicode === !1 ? (0, Jt._)`${r}.length` : (0, Jt._)`${(0, cm.useFunc)(e.gen, lm.default)}(${r})`;
    e.fail$data((0, Jt._)`${o} ${a} ${n}`);
  }
};
Ra.default = dm;
var Ia = {};
Object.defineProperty(Ia, "__esModule", { value: !0 });
const fm = ee, qn = W, hm = {
  message: ({ schemaCode: e }) => (0, qn.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, qn._)`{pattern: ${e}}`
}, mm = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: hm,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: a } = e, o = a.opts.unicodeRegExp ? "u" : "", l = r ? (0, qn._)`(new RegExp(${s}, ${o}))` : (0, fm.usePattern)(e, n);
    e.fail$data((0, qn._)`!${l}.test(${t})`);
  }
};
Ia.default = mm;
var Ta = {};
Object.defineProperty(Ta, "__esModule", { value: !0 });
const Hr = W, pm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Hr.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Hr._)`{limit: ${e}}`
}, $m = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: pm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Hr.operators.GT : Hr.operators.LT;
    e.fail$data((0, Hr._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Ta.default = $m;
var ja = {};
Object.defineProperty(ja, "__esModule", { value: !0 });
const Mr = ee, Jr = W, ym = A, _m = {
  message: ({ params: { missingProperty: e } }) => (0, Jr.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Jr._)`{missingProperty: ${e}}`
}, gm = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: _m,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: l } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= l.loopRequired;
    if (o.allErrors ? d() : u(), l.strictRequired) {
      const g = e.parentSchema.properties, { definedProperties: w } = e.it;
      for (const _ of r)
        if ((g == null ? void 0 : g[_]) === void 0 && !w.has(_)) {
          const y = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${_}" is not defined at "${y}" (strictRequired)`;
          (0, ym.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(Jr.nil, h);
      else
        for (const g of r)
          (0, Mr.checkReportMissingProp)(e, g);
    }
    function u() {
      const g = t.let("missing");
      if (c || a) {
        const w = t.let("valid", !0);
        e.block$data(w, () => b(g, w)), e.ok(w);
      } else
        t.if((0, Mr.checkMissingProp)(e, r, g)), (0, Mr.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, Mr.noPropertyInData)(t, s, g, l.ownProperties), () => e.error());
      });
    }
    function b(g, w) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(w, (0, Mr.propertyInData)(t, s, g, l.ownProperties)), t.if((0, Jr.not)(w), () => {
          e.error(), t.break();
        });
      }, Jr.nil);
    }
  }
};
ja.default = gm;
var ka = {};
Object.defineProperty(ka, "__esModule", { value: !0 });
const Xr = W, vm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Xr.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Xr._)`{limit: ${e}}`
}, wm = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: vm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? Xr.operators.GT : Xr.operators.LT;
    e.fail$data((0, Xr._)`${r}.length ${s} ${n}`);
  }
};
ka.default = wm;
var Aa = {}, nn = {};
Object.defineProperty(nn, "__esModule", { value: !0 });
const Dl = xn;
Dl.code = 'require("ajv/dist/runtime/equal").default';
nn.default = Dl;
Object.defineProperty(Aa, "__esModule", { value: !0 });
const Es = $e, ge = W, Em = A, bm = nn, Sm = {
  message: ({ params: { i: e, j: t } }) => (0, ge.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, ge._)`{i: ${e}, j: ${t}}`
}, Pm = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Sm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: l } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, Es.getSchemaTypes)(a.items) : [];
    e.block$data(c, u, (0, ge._)`${o} === false`), e.ok(c);
    function u() {
      const w = t.let("i", (0, ge._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: w, j: _ }), t.assign(c, !0), t.if((0, ge._)`${w} > 1`, () => (h() ? b : g)(w, _));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function b(w, _) {
      const y = t.name("item"), m = (0, Es.checkDataTypes)(d, y, l.opts.strictNumbers, Es.DataType.Wrong), v = t.const("indices", (0, ge._)`{}`);
      t.for((0, ge._)`;${w}--;`, () => {
        t.let(y, (0, ge._)`${r}[${w}]`), t.if(m, (0, ge._)`continue`), d.length > 1 && t.if((0, ge._)`typeof ${y} == "string"`, (0, ge._)`${y} += "_"`), t.if((0, ge._)`typeof ${v}[${y}] == "number"`, () => {
          t.assign(_, (0, ge._)`${v}[${y}]`), e.error(), t.assign(c, !1).break();
        }).code((0, ge._)`${v}[${y}] = ${w}`);
      });
    }
    function g(w, _) {
      const y = (0, Em.useFunc)(t, bm.default), m = t.name("outer");
      t.label(m).for((0, ge._)`;${w}--;`, () => t.for((0, ge._)`${_} = ${w}; ${_}--;`, () => t.if((0, ge._)`${y}(${r}[${w}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Aa.default = Pm;
var Ca = {};
Object.defineProperty(Ca, "__esModule", { value: !0 });
const qs = W, Nm = A, Rm = nn, Om = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, qs._)`{allowedValue: ${e}}`
}, Im = {
  keyword: "const",
  $data: !0,
  error: Om,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, qs._)`!${(0, Nm.useFunc)(t, Rm.default)}(${r}, ${s})`) : e.fail((0, qs._)`${a} !== ${r}`);
  }
};
Ca.default = Im;
var Da = {};
Object.defineProperty(Da, "__esModule", { value: !0 });
const Ur = W, Tm = A, jm = nn, km = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Ur._)`{allowedValues: ${e}}`
}, Am = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: km,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, Tm.useFunc)(t, jm.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", a);
      u = (0, Ur.or)(...s.map((w, _) => b(g, _)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", a, (g) => t.if((0, Ur._)`${d()}(${r}, ${g})`, () => t.assign(u, !0).break()));
    }
    function b(g, w) {
      const _ = s[w];
      return typeof _ == "object" && _ !== null ? (0, Ur._)`${d()}(${r}, ${g}[${w}])` : (0, Ur._)`${r} === ${_}`;
    }
  }
};
Da.default = Am;
Object.defineProperty(Sa, "__esModule", { value: !0 });
const Cm = Pa, Dm = Na, Mm = Ra, Lm = Ia, Vm = Ta, Fm = ja, zm = ka, Um = Aa, qm = Ca, Gm = Da, Km = [
  // number
  Cm.default,
  Dm.default,
  // string
  Mm.default,
  Lm.default,
  // object
  Vm.default,
  Fm.default,
  // array
  zm.default,
  Um.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  qm.default,
  Gm.default
];
Sa.default = Km;
var Ma = {}, wr = {};
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.validateAdditionalItems = void 0;
const Xt = W, Gs = A, Hm = {
  message: ({ params: { len: e } }) => (0, Xt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Xt._)`{limit: ${e}}`
}, Jm = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Hm,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Gs.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Ml(e, n);
  }
};
function Ml(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const l = r.const("len", (0, Xt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Xt._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Gs.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, Xt._)`${l} <= ${t.length}`);
    r.if((0, Xt.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: a, dataProp: u, dataPropType: Gs.Type.Num }, d), o.allErrors || r.if((0, Xt.not)(d), () => r.break());
    });
  }
}
wr.validateAdditionalItems = Ml;
wr.default = Jm;
var La = {}, Er = {};
Object.defineProperty(Er, "__esModule", { value: !0 });
Er.validateTuple = void 0;
const Ii = W, jn = A, Xm = ee, Bm = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Ll(e, "additionalItems", t);
    r.items = !0, !(0, jn.alwaysValidSchema)(r, t) && e.ok((0, Xm.validateArray)(e));
  }
};
function Ll(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = jn.mergeEvaluated.items(n, r.length, l.items));
  const c = n.name("valid"), d = n.const("len", (0, Ii._)`${a}.length`);
  r.forEach((h, b) => {
    (0, jn.alwaysValidSchema)(l, h) || (n.if((0, Ii._)`${d} > ${b}`, () => e.subschema({
      keyword: o,
      schemaProp: b,
      dataProp: b
    }, c)), e.ok(c));
  });
  function u(h) {
    const { opts: b, errSchemaPath: g } = l, w = r.length, _ = w === h.minItems && (w === h.maxItems || h[t] === !1);
    if (b.strictTuples && !_) {
      const y = `"${o}" is ${w}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, jn.checkStrictMode)(l, y, b.strictTuples);
    }
  }
}
Er.validateTuple = Ll;
Er.default = Bm;
Object.defineProperty(La, "__esModule", { value: !0 });
const Wm = Er, Ym = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, Wm.validateTuple)(e, "items")
};
La.default = Ym;
var Va = {};
Object.defineProperty(Va, "__esModule", { value: !0 });
const Ti = W, Qm = A, Zm = ee, xm = wr, ep = {
  message: ({ params: { len: e } }) => (0, Ti.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Ti._)`{limit: ${e}}`
}, tp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: ep,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, Qm.alwaysValidSchema)(n, t) && (s ? (0, xm.validateAdditionalItems)(e, s) : e.ok((0, Zm.validateArray)(e)));
  }
};
Va.default = tp;
var Fa = {};
Object.defineProperty(Fa, "__esModule", { value: !0 });
const Fe = W, fn = A, rp = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Fe.str)`must contain at least ${e} valid item(s)` : (0, Fe.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Fe._)`{minContains: ${e}}` : (0, Fe._)`{minContains: ${e}, maxContains: ${t}}`
}, np = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: rp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, l;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, l = d) : o = 1;
    const u = t.const("len", (0, Fe._)`${s}.length`);
    if (e.setParams({ min: o, max: l }), l === void 0 && o === 0) {
      (0, fn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && o > l) {
      (0, fn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, fn.alwaysValidSchema)(a, r)) {
      let _ = (0, Fe._)`${u} >= ${o}`;
      l !== void 0 && (_ = (0, Fe._)`${_} && ${u} <= ${l}`), e.pass(_);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    l === void 0 && o === 1 ? g(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, Fe._)`${s}.length > 0`, b)) : (t.let(h, !1), b()), e.result(h, () => e.reset());
    function b() {
      const _ = t.name("_valid"), y = t.let("count", 0);
      g(_, () => t.if(_, () => w(y)));
    }
    function g(_, y) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: fn.Type.Num,
          compositeRule: !0
        }, _), y();
      });
    }
    function w(_) {
      t.code((0, Fe._)`${_}++`), l === void 0 ? t.if((0, Fe._)`${_} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, Fe._)`${_} > ${l}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, Fe._)`${_} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
Fa.default = np;
var ns = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = W, r = A, n = ee;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${c},
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
    code(c) {
      const [d, u] = a(c);
      o(c, d), l(c, u);
    }
  };
  function a({ schema: c }) {
    const d = {}, u = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const b = Array.isArray(c[h]) ? d : u;
      b[h] = c[h];
    }
    return [d, u];
  }
  function o(c, d = c.schema) {
    const { gen: u, data: h, it: b } = c;
    if (Object.keys(d).length === 0)
      return;
    const g = u.let("missing");
    for (const w in d) {
      const _ = d[w];
      if (_.length === 0)
        continue;
      const y = (0, n.propertyInData)(u, h, w, b.opts.ownProperties);
      c.setParams({
        property: w,
        depsCount: _.length,
        deps: _.join(", ")
      }), b.allErrors ? u.if(y, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (u.if((0, t._)`${y} && (${(0, n.checkMissingProp)(c, _, g)})`), (0, n.reportMissingProp)(c, g), u.else());
    }
  }
  e.validatePropertyDeps = o;
  function l(c, d = c.schema) {
    const { gen: u, data: h, keyword: b, it: g } = c, w = u.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)(g, d[_]) || (u.if(
        (0, n.propertyInData)(u, h, _, g.opts.ownProperties),
        () => {
          const y = c.subschema({ keyword: b, schemaProp: _ }, w);
          c.mergeValidEvaluated(y, w);
        },
        () => u.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  e.validateSchemaDeps = l, e.default = s;
})(ns);
var za = {};
Object.defineProperty(za, "__esModule", { value: !0 });
const Vl = W, sp = A, ap = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Vl._)`{propertyName: ${e.propertyName}}`
}, op = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: ap,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, sp.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, Vl.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
za.default = op;
var ss = {};
Object.defineProperty(ss, "__esModule", { value: !0 });
const hn = ee, Ke = W, ip = Ve, mn = A, cp = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Ke._)`{additionalProperty: ${e.additionalProperty}}`
}, lp = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: cp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, mn.alwaysValidSchema)(o, r))
      return;
    const d = (0, hn.allSchemaProperties)(n.properties), u = (0, hn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Ke._)`${a} === ${ip.default.errors}`);
    function h() {
      t.forIn("key", s, (y) => {
        !d.length && !u.length ? w(y) : t.if(b(y), () => w(y));
      });
    }
    function b(y) {
      let m;
      if (d.length > 8) {
        const v = (0, mn.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, hn.isOwnProperty)(t, v, y);
      } else d.length ? m = (0, Ke.or)(...d.map((v) => (0, Ke._)`${y} === ${v}`)) : m = Ke.nil;
      return u.length && (m = (0, Ke.or)(m, ...u.map((v) => (0, Ke._)`${(0, hn.usePattern)(e, v)}.test(${y})`))), (0, Ke.not)(m);
    }
    function g(y) {
      t.code((0, Ke._)`delete ${s}[${y}]`);
    }
    function w(y) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        g(y);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: y }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, mn.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_(y, m, !1), t.if((0, Ke.not)(m), () => {
          e.reset(), g(y);
        })) : (_(y, m), l || t.if((0, Ke.not)(m), () => t.break()));
      }
    }
    function _(y, m, v) {
      const N = {
        keyword: "additionalProperties",
        dataProp: y,
        dataPropType: mn.Type.Str
      };
      v === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
ss.default = lp;
var Ua = {};
Object.defineProperty(Ua, "__esModule", { value: !0 });
const up = Be, ji = ee, bs = A, ki = ss, dp = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && ki.default.code(new up.KeywordCxt(a, ki.default, "additionalProperties"));
    const o = (0, ji.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = bs.mergeEvaluated.props(t, (0, bs.toHash)(o), a.props));
    const l = o.filter((h) => !(0, bs.alwaysValidSchema)(a, r[h]));
    if (l.length === 0)
      return;
    const c = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, ji.propertyInData)(t, s, h, a.opts.ownProperties)), u(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
Ua.default = dp;
var qa = {};
Object.defineProperty(qa, "__esModule", { value: !0 });
const Ai = ee, pn = W, Ci = A, Di = A, fp = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, l = (0, Ai.allSchemaProperties)(r), c = l.filter((_) => (0, Ci.alwaysValidSchema)(a, r[_]));
    if (l.length === 0 || c.length === l.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, u = t.name("valid");
    a.props !== !0 && !(a.props instanceof pn.Name) && (a.props = (0, Di.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    b();
    function b() {
      for (const _ of l)
        d && g(_), a.allErrors ? w(_) : (t.var(u, !0), w(_), t.if(u));
    }
    function g(_) {
      for (const y in d)
        new RegExp(_).test(y) && (0, Ci.checkStrictMode)(a, `property ${y} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function w(_) {
      t.forIn("key", n, (y) => {
        t.if((0, pn._)`${(0, Ai.usePattern)(e, _)}.test(${y})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: y,
            dataPropType: Di.Type.Str
          }, u), a.opts.unevaluated && h !== !0 ? t.assign((0, pn._)`${h}[${y}]`, !0) : !m && !a.allErrors && t.if((0, pn.not)(u), () => t.break());
        });
      });
    }
  }
};
qa.default = fp;
var Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
const hp = A, mp = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, hp.alwaysValidSchema)(n, r)) {
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
Ga.default = mp;
var Ka = {};
Object.defineProperty(Ka, "__esModule", { value: !0 });
const pp = ee, $p = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: pp.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Ka.default = $p;
var Ha = {};
Object.defineProperty(Ha, "__esModule", { value: !0 });
const kn = W, yp = A, _p = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, kn._)`{passingSchemas: ${e.passing}}`
}, gp = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: _p,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), l = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: l }), t.block(d), e.result(o, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((u, h) => {
        let b;
        (0, yp.alwaysValidSchema)(s, u) ? t.var(c, !0) : b = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, kn._)`${c} && ${o}`).assign(o, !1).assign(l, (0, kn._)`[${l}, ${h}]`).else(), t.if(c, () => {
          t.assign(o, !0), t.assign(l, h), b && e.mergeEvaluated(b, kn.Name);
        });
      });
    }
  }
};
Ha.default = gp;
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
const vp = A, wp = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, vp.alwaysValidSchema)(n, a))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
Ja.default = wp;
var Xa = {};
Object.defineProperty(Xa, "__esModule", { value: !0 });
const Gn = W, Fl = A, Ep = {
  message: ({ params: e }) => (0, Gn.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Gn._)`{failingKeyword: ${e.ifClause}}`
}, bp = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Ep,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Fl.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Mi(n, "then"), a = Mi(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), l = t.name("_valid");
    if (c(), e.reset(), s && a) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, Gn.not)(l), d("else"));
    e.pass(o, () => e.error(!0));
    function c() {
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
        const b = e.subschema({ keyword: u }, l);
        t.assign(o, l), e.mergeValidEvaluated(b, o), h ? t.assign(h, (0, Gn._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function Mi(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Fl.alwaysValidSchema)(e, r);
}
Xa.default = bp;
var Ba = {};
Object.defineProperty(Ba, "__esModule", { value: !0 });
const Sp = A, Pp = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Sp.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Ba.default = Pp;
Object.defineProperty(Ma, "__esModule", { value: !0 });
const Np = wr, Rp = La, Op = Er, Ip = Va, Tp = Fa, jp = ns, kp = za, Ap = ss, Cp = Ua, Dp = qa, Mp = Ga, Lp = Ka, Vp = Ha, Fp = Ja, zp = Xa, Up = Ba;
function qp(e = !1) {
  const t = [
    // any
    Mp.default,
    Lp.default,
    Vp.default,
    Fp.default,
    zp.default,
    Up.default,
    // object
    kp.default,
    Ap.default,
    jp.default,
    Cp.default,
    Dp.default
  ];
  return e ? t.push(Rp.default, Ip.default) : t.push(Np.default, Op.default), t.push(Tp.default), t;
}
Ma.default = qp;
var Wa = {}, br = {};
Object.defineProperty(br, "__esModule", { value: !0 });
br.dynamicAnchor = void 0;
const Ss = W, Gp = Ve, Li = Te, Kp = ht, Hp = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => zl(e, e.schema)
};
function zl(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, Ss._)`${Gp.default.dynamicAnchors}${(0, Ss.getProperty)(t)}`, a = n.errSchemaPath === "#" ? n.validateName : Jp(e);
  r.if((0, Ss._)`!${s}`, () => r.assign(s, a));
}
br.dynamicAnchor = zl;
function Jp(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: a, localRefs: o, meta: l } = t.root, { schemaId: c } = n.opts, d = new Li.SchemaEnv({ schema: r, schemaId: c, root: s, baseId: a, localRefs: o, meta: l });
  return Li.compileSchema.call(n, d), (0, Kp.getValidate)(e, d);
}
br.default = Hp;
var Sr = {};
Object.defineProperty(Sr, "__esModule", { value: !0 });
Sr.dynamicRef = void 0;
const Vi = W, Xp = Ve, Fi = ht, Bp = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => Ul(e, e.schema)
};
function Ul(e, t) {
  const { gen: r, keyword: n, it: s } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const a = t.slice(1);
  if (s.allErrors)
    o();
  else {
    const c = r.let("valid", !1);
    o(c), e.ok(c);
  }
  function o(c) {
    if (s.schemaEnv.root.dynamicAnchors[a]) {
      const d = r.let("_v", (0, Vi._)`${Xp.default.dynamicAnchors}${(0, Vi.getProperty)(a)}`);
      r.if(d, l(d, c), l(s.validateName, c));
    } else
      l(s.validateName, c)();
  }
  function l(c, d) {
    return d ? () => r.block(() => {
      (0, Fi.callRef)(e, c), r.let(d, !0);
    }) : () => (0, Fi.callRef)(e, c);
  }
}
Sr.dynamicRef = Ul;
Sr.default = Bp;
var Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
const Wp = br, Yp = A, Qp = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, Wp.dynamicAnchor)(e, "") : (0, Yp.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
Ya.default = Qp;
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
const Zp = Sr, xp = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, Zp.dynamicRef)(e, e.schema)
};
Qa.default = xp;
Object.defineProperty(Wa, "__esModule", { value: !0 });
const e$ = br, t$ = Sr, r$ = Ya, n$ = Qa, s$ = [e$.default, t$.default, r$.default, n$.default];
Wa.default = s$;
var Za = {}, xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
const zi = ns, a$ = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: zi.error,
  code: (e) => (0, zi.validatePropertyDeps)(e)
};
xa.default = a$;
var eo = {};
Object.defineProperty(eo, "__esModule", { value: !0 });
const o$ = ns, i$ = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, o$.validateSchemaDeps)(e)
};
eo.default = i$;
var to = {};
Object.defineProperty(to, "__esModule", { value: !0 });
const c$ = A, l$ = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, c$.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
to.default = l$;
Object.defineProperty(Za, "__esModule", { value: !0 });
const u$ = xa, d$ = eo, f$ = to, h$ = [u$.default, d$.default, f$.default];
Za.default = h$;
var ro = {}, no = {};
Object.defineProperty(no, "__esModule", { value: !0 });
const wt = W, Ui = A, m$ = Ve, p$ = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, wt._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, $$ = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: p$,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: l } = a;
    l instanceof wt.Name ? t.if((0, wt._)`${l} !== true`, () => t.forIn("key", n, (h) => t.if(d(l, h), () => c(h)))) : l !== !0 && t.forIn("key", n, (h) => l === void 0 ? c(h) : t.if(u(l, h), () => c(h))), a.props = !0, e.ok((0, wt._)`${s} === ${m$.default.errors}`);
    function c(h) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: h }), e.error(), o || t.break();
        return;
      }
      if (!(0, Ui.alwaysValidSchema)(a, r)) {
        const b = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: Ui.Type.Str
        }, b), o || t.if((0, wt.not)(b), () => t.break());
      }
    }
    function d(h, b) {
      return (0, wt._)`!${h} || !${h}[${b}]`;
    }
    function u(h, b) {
      const g = [];
      for (const w in h)
        h[w] === !0 && g.push((0, wt._)`${b} !== ${w}`);
      return (0, wt.and)(...g);
    }
  }
};
no.default = $$;
var so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
const Bt = W, qi = A, y$ = {
  message: ({ params: { len: e } }) => (0, Bt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Bt._)`{limit: ${e}}`
}, _$ = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: y$,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, a = s.items || 0;
    if (a === !0)
      return;
    const o = t.const("len", (0, Bt._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: a }), e.fail((0, Bt._)`${o} > ${a}`);
    else if (typeof r == "object" && !(0, qi.alwaysValidSchema)(s, r)) {
      const c = t.var("valid", (0, Bt._)`${o} <= ${a}`);
      t.if((0, Bt.not)(c), () => l(c, a)), e.ok(c);
    }
    s.items = !0;
    function l(c, d) {
      t.forRange("i", d, o, (u) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: u, dataPropType: qi.Type.Num }, c), s.allErrors || t.if((0, Bt.not)(c), () => t.break());
      });
    }
  }
};
so.default = _$;
Object.defineProperty(ro, "__esModule", { value: !0 });
const g$ = no, v$ = so, w$ = [g$.default, v$.default];
ro.default = w$;
var ao = {}, oo = {};
Object.defineProperty(oo, "__esModule", { value: !0 });
const he = W, E$ = {
  message: ({ schemaCode: e }) => (0, he.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, he._)`{format: ${e}}`
}, b$ = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: E$,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: l } = e, { opts: c, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!c.validateFormats)
      return;
    s ? b() : g();
    function b() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, he._)`${w}[${o}]`), y = r.let("fType"), m = r.let("format");
      r.if((0, he._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign(y, (0, he._)`${_}.type || "string"`).assign(m, (0, he._)`${_}.validate`), () => r.assign(y, (0, he._)`"string"`).assign(m, _)), e.fail$data((0, he.or)(v(), N()));
      function v() {
        return c.strictSchema === !1 ? he.nil : (0, he._)`${o} && !${m}`;
      }
      function N() {
        const R = u.$async ? (0, he._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, he._)`${m}(${n})`, O = (0, he._)`(typeof ${m} == "function" ? ${R} : ${m}.test(${n}))`;
        return (0, he._)`${m} && ${m} !== true && ${y} === ${t} && !${O}`;
      }
    }
    function g() {
      const w = h.formats[a];
      if (!w) {
        v();
        return;
      }
      if (w === !0)
        return;
      const [_, y, m] = N(w);
      _ === t && e.pass(R());
      function v() {
        if (c.strictSchema === !1) {
          h.logger.warn(O());
          return;
        }
        throw new Error(O());
        function O() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function N(O) {
        const G = O instanceof RegExp ? (0, he.regexpCode)(O) : c.code.formats ? (0, he._)`${c.code.formats}${(0, he.getProperty)(a)}` : void 0, B = r.scopeValue("formats", { key: a, ref: O, code: G });
        return typeof O == "object" && !(O instanceof RegExp) ? [O.type || "string", O.validate, (0, he._)`${B}.validate`] : ["string", O, B];
      }
      function R() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, he._)`await ${m}(${n})`;
        }
        return typeof y == "function" ? (0, he._)`${m}(${n})` : (0, he._)`${m}.test(${n})`;
      }
    }
  }
};
oo.default = b$;
Object.defineProperty(ao, "__esModule", { value: !0 });
const S$ = oo, P$ = [S$.default];
ao.default = P$;
var yr = {};
Object.defineProperty(yr, "__esModule", { value: !0 });
yr.contentVocabulary = yr.metadataVocabulary = void 0;
yr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
yr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(wa, "__esModule", { value: !0 });
const N$ = Ea, R$ = Sa, O$ = Ma, I$ = Wa, T$ = Za, j$ = ro, k$ = ao, Gi = yr, A$ = [
  I$.default,
  N$.default,
  R$.default,
  (0, O$.default)(!0),
  k$.default,
  Gi.metadataVocabulary,
  Gi.contentVocabulary,
  T$.default,
  j$.default
];
wa.default = A$;
var io = {}, as = {};
Object.defineProperty(as, "__esModule", { value: !0 });
as.DiscrError = void 0;
var Ki;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Ki || (as.DiscrError = Ki = {}));
Object.defineProperty(io, "__esModule", { value: !0 });
const lr = W, Ks = as, Hi = Te, C$ = vr, D$ = A, M$ = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Ks.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, lr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, L$ = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: M$,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const l = n.propertyName;
    if (typeof l != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, lr._)`${r}${(0, lr.getProperty)(l)}`);
    t.if((0, lr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: Ks.DiscrError.Tag, tag: d, tagName: l })), e.ok(c);
    function u() {
      const g = b();
      t.if(!1);
      for (const w in g)
        t.elseIf((0, lr._)`${d} === ${w}`), t.assign(c, h(g[w]));
      t.else(), e.error(!1, { discrError: Ks.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(g) {
      const w = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: g }, w);
      return e.mergeEvaluated(_, lr.Name), w;
    }
    function b() {
      var g;
      const w = {}, _ = m(s);
      let y = !0;
      for (let R = 0; R < o.length; R++) {
        let O = o[R];
        if (O != null && O.$ref && !(0, D$.schemaHasRulesButRef)(O, a.self.RULES)) {
          const B = O.$ref;
          if (O = Hi.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, B), O instanceof Hi.SchemaEnv && (O = O.schema), O === void 0)
            throw new C$.default(a.opts.uriResolver, a.baseId, B);
        }
        const G = (g = O == null ? void 0 : O.properties) === null || g === void 0 ? void 0 : g[l];
        if (typeof G != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        y = y && (_ || m(O)), v(G, R);
      }
      if (!y)
        throw new Error(`discriminator: "${l}" must be required`);
      return w;
      function m({ required: R }) {
        return Array.isArray(R) && R.includes(l);
      }
      function v(R, O) {
        if (R.const)
          N(R.const, O);
        else if (R.enum)
          for (const G of R.enum)
            N(G, O);
        else
          throw new Error(`discriminator: "properties/${l}" must have "const" or "enum"`);
      }
      function N(R, O) {
        if (typeof R != "string" || R in w)
          throw new Error(`discriminator: "${l}" values must be unique strings`);
        w[R] = O;
      }
    }
  }
};
io.default = L$;
var co = {};
const V$ = "https://json-schema.org/draft/2020-12/schema", F$ = "https://json-schema.org/draft/2020-12/schema", z$ = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, U$ = "meta", q$ = "Core and Validation specifications meta-schema", G$ = [
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
], K$ = [
  "object",
  "boolean"
], H$ = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", J$ = {
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
}, X$ = {
  $schema: V$,
  $id: F$,
  $vocabulary: z$,
  $dynamicAnchor: U$,
  title: q$,
  allOf: G$,
  type: K$,
  $comment: H$,
  properties: J$
}, B$ = "https://json-schema.org/draft/2020-12/schema", W$ = "https://json-schema.org/draft/2020-12/meta/applicator", Y$ = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, Q$ = "meta", Z$ = "Applicator vocabulary meta-schema", x$ = [
  "object",
  "boolean"
], ey = {
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
}, ty = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, ry = {
  $schema: B$,
  $id: W$,
  $vocabulary: Y$,
  $dynamicAnchor: Q$,
  title: Z$,
  type: x$,
  properties: ey,
  $defs: ty
}, ny = "https://json-schema.org/draft/2020-12/schema", sy = "https://json-schema.org/draft/2020-12/meta/unevaluated", ay = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, oy = "meta", iy = "Unevaluated applicator vocabulary meta-schema", cy = [
  "object",
  "boolean"
], ly = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, uy = {
  $schema: ny,
  $id: sy,
  $vocabulary: ay,
  $dynamicAnchor: oy,
  title: iy,
  type: cy,
  properties: ly
}, dy = "https://json-schema.org/draft/2020-12/schema", fy = "https://json-schema.org/draft/2020-12/meta/content", hy = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, my = "meta", py = "Content vocabulary meta-schema", $y = [
  "object",
  "boolean"
], yy = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, _y = {
  $schema: dy,
  $id: fy,
  $vocabulary: hy,
  $dynamicAnchor: my,
  title: py,
  type: $y,
  properties: yy
}, gy = "https://json-schema.org/draft/2020-12/schema", vy = "https://json-schema.org/draft/2020-12/meta/core", wy = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, Ey = "meta", by = "Core vocabulary meta-schema", Sy = [
  "object",
  "boolean"
], Py = {
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
}, Ny = {
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
}, Ry = {
  $schema: gy,
  $id: vy,
  $vocabulary: wy,
  $dynamicAnchor: Ey,
  title: by,
  type: Sy,
  properties: Py,
  $defs: Ny
}, Oy = "https://json-schema.org/draft/2020-12/schema", Iy = "https://json-schema.org/draft/2020-12/meta/format-annotation", Ty = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, jy = "meta", ky = "Format vocabulary meta-schema for annotation results", Ay = [
  "object",
  "boolean"
], Cy = {
  format: {
    type: "string"
  }
}, Dy = {
  $schema: Oy,
  $id: Iy,
  $vocabulary: Ty,
  $dynamicAnchor: jy,
  title: ky,
  type: Ay,
  properties: Cy
}, My = "https://json-schema.org/draft/2020-12/schema", Ly = "https://json-schema.org/draft/2020-12/meta/meta-data", Vy = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, Fy = "meta", zy = "Meta-data vocabulary meta-schema", Uy = [
  "object",
  "boolean"
], qy = {
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
}, Gy = {
  $schema: My,
  $id: Ly,
  $vocabulary: Vy,
  $dynamicAnchor: Fy,
  title: zy,
  type: Uy,
  properties: qy
}, Ky = "https://json-schema.org/draft/2020-12/schema", Hy = "https://json-schema.org/draft/2020-12/meta/validation", Jy = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, Xy = "meta", By = "Validation vocabulary meta-schema", Wy = [
  "object",
  "boolean"
], Yy = {
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
}, Qy = {
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
}, Zy = {
  $schema: Ky,
  $id: Hy,
  $vocabulary: Jy,
  $dynamicAnchor: Xy,
  title: By,
  type: Wy,
  properties: Yy,
  $defs: Qy
};
Object.defineProperty(co, "__esModule", { value: !0 });
const xy = X$, e0 = ry, t0 = uy, r0 = _y, n0 = Ry, s0 = Dy, a0 = Gy, o0 = Zy, i0 = ["/properties"];
function c0(e) {
  return [
    xy,
    e0,
    t0,
    r0,
    n0,
    t(this, s0),
    a0,
    t(this, o0)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, i0) : n;
  }
}
co.default = c0;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = Hc, n = wa, s = io, a = co, o = "https://json-schema.org/draft/2020-12/schema";
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
      const { $data: g, meta: w } = this.opts;
      w && (a.default.call(this, g), this.refs["http://json-schema.org/schema"] = o);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
    }
  }
  t.Ajv2020 = l, e.exports = t = l, e.exports.Ajv2020 = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
  var c = Be;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var d = W;
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
  var u = pa();
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return u.default;
  } });
  var h = vr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(Ls, Ls.exports);
var l0 = Ls.exports, Hs = { exports: {} }, ql = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(z, H) {
    return { validate: z, compare: H };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(a, o),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(c(!0), d),
    "date-time": t(b(!0), g),
    "iso-time": t(c(), u),
    "iso-date-time": t(b(), w),
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
    regex: pe,
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
    byte: N,
    // signed 32 bit integer
    int32: { type: "number", validate: G },
    // signed 64 bit integer
    int64: { type: "number", validate: B },
    // C-type float
    float: { type: "number", validate: le },
    // C-type double
    double: { type: "number", validate: le },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, o),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, d),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, g),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, u),
    "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, w),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(z) {
    return z % 4 === 0 && (z % 100 !== 0 || z % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function a(z) {
    const H = n.exec(z);
    if (!H)
      return !1;
    const se = +H[1], T = +H[2], k = +H[3];
    return T >= 1 && T <= 12 && k >= 1 && k <= (T === 2 && r(se) ? 29 : s[T]);
  }
  function o(z, H) {
    if (z && H)
      return z > H ? 1 : z < H ? -1 : 0;
  }
  const l = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(z) {
    return function(se) {
      const T = l.exec(se);
      if (!T)
        return !1;
      const k = +T[1], L = +T[2], D = +T[3], K = T[4], M = T[5] === "-" ? -1 : 1, P = +(T[6] || 0), p = +(T[7] || 0);
      if (P > 23 || p > 59 || z && !K)
        return !1;
      if (k <= 23 && L <= 59 && D < 60)
        return !0;
      const S = L - p * M, $ = k - P * M - (S < 0 ? 1 : 0);
      return ($ === 23 || $ === -1) && (S === 59 || S === -1) && D < 61;
    };
  }
  function d(z, H) {
    if (!(z && H))
      return;
    const se = (/* @__PURE__ */ new Date("2020-01-01T" + z)).valueOf(), T = (/* @__PURE__ */ new Date("2020-01-01T" + H)).valueOf();
    if (se && T)
      return se - T;
  }
  function u(z, H) {
    if (!(z && H))
      return;
    const se = l.exec(z), T = l.exec(H);
    if (se && T)
      return z = se[1] + se[2] + se[3], H = T[1] + T[2] + T[3], z > H ? 1 : z < H ? -1 : 0;
  }
  const h = /t|\s/i;
  function b(z) {
    const H = c(z);
    return function(T) {
      const k = T.split(h);
      return k.length === 2 && a(k[0]) && H(k[1]);
    };
  }
  function g(z, H) {
    if (!(z && H))
      return;
    const se = new Date(z).valueOf(), T = new Date(H).valueOf();
    if (se && T)
      return se - T;
  }
  function w(z, H) {
    if (!(z && H))
      return;
    const [se, T] = z.split(h), [k, L] = H.split(h), D = o(se, k);
    if (D !== void 0)
      return D || d(T, L);
  }
  const _ = /\/|:/, y = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(z) {
    return _.test(z) && y.test(z);
  }
  const v = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function N(z) {
    return v.lastIndex = 0, v.test(z);
  }
  const R = -2147483648, O = 2 ** 31 - 1;
  function G(z) {
    return Number.isInteger(z) && z <= O && z >= R;
  }
  function B(z) {
    return Number.isInteger(z);
  }
  function le() {
    return !0;
  }
  const fe = /[^\\]\\Z/;
  function pe(z) {
    if (fe.test(z))
      return !1;
    try {
      return new RegExp(z), !0;
    } catch {
      return !1;
    }
  }
})(ql);
var Gl = {}, Js = { exports: {} }, Kl = {}, We = {}, _r = {}, sn = {}, x = {}, tn = {};
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
      return (v = this._str) !== null && v !== void 0 ? v : this._str = this._items.reduce((N, R) => `${N}${R}`, "");
    }
    get names() {
      var v;
      return (v = this._names) !== null && v !== void 0 ? v : this._names = this._items.reduce((N, R) => (R instanceof r && (N[R.str] = (N[R.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...v) {
    const N = [m[0]];
    let R = 0;
    for (; R < v.length; )
      l(N, v[R]), N.push(m[++R]);
    return new n(N);
  }
  e._ = s;
  const a = new n("+");
  function o(m, ...v) {
    const N = [g(m[0])];
    let R = 0;
    for (; R < v.length; )
      N.push(a), l(N, v[R]), N.push(a, g(m[++R]));
    return c(N), new n(N);
  }
  e.str = o;
  function l(m, v) {
    v instanceof n ? m.push(...v._items) : v instanceof r ? m.push(v) : m.push(h(v));
  }
  e.addCodeArg = l;
  function c(m) {
    let v = 1;
    for (; v < m.length - 1; ) {
      if (m[v] === a) {
        const N = d(m[v - 1], m[v + 1]);
        if (N !== void 0) {
          m.splice(v - 1, 3, N);
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
  function u(m, v) {
    return v.emptyStr() ? m : m.emptyStr() ? v : o`${m}${v}`;
  }
  e.strConcat = u;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : g(Array.isArray(m) ? m.join(",") : m);
  }
  function b(m) {
    return new n(g(m));
  }
  e.stringify = b;
  function g(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = g;
  function w(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = w;
  function _(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = _;
  function y(m) {
    return new n(m.toString());
  }
  e.regexpCode = y;
})(tn);
var Xs = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = tn;
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
  class a extends t.Name {
    constructor(d, u) {
      super(u), this.prefix = d;
    }
    setValue(d, { property: u, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(u)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const o = (0, t._)`\n`;
  class l extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
    }
    value(d, u) {
      var h;
      if (u.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const b = this.toName(d), { prefix: g } = b, w = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let _ = this._values[g];
      if (_) {
        const v = _.get(w);
        if (v)
          return v;
      } else
        _ = this._values[g] = /* @__PURE__ */ new Map();
      _.set(w, b);
      const y = this._scope[g] || (this._scope[g] = []), m = y.length;
      return y[m] = u.ref, b.setValue(u, { property: g, itemIndex: m }), b;
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
      return this._reduceValues(d, (b) => {
        if (b.value === void 0)
          throw new Error(`CodeGen: name "${b}" has no value`);
        return b.value.code;
      }, u, h);
    }
    _reduceValues(d, u, h = {}, b) {
      let g = t.nil;
      for (const w in d) {
        const _ = d[w];
        if (!_)
          continue;
        const y = h[w] = h[w] || /* @__PURE__ */ new Map();
        _.forEach((m) => {
          if (y.has(m))
            return;
          y.set(m, n.Started);
          let v = u(m);
          if (v) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            g = (0, t._)`${g}${N} ${m} = ${v};${this.opts._n}`;
          } else if (v = b == null ? void 0 : b(m))
            g = (0, t._)`${g}${v}${this.opts._n}`;
          else
            throw new r(m);
          y.set(m, n.Completed);
        });
      }
      return g;
    }
  }
  e.ValueScope = l;
})(Xs);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = tn, r = Xs;
  var n = tn;
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
  var s = Xs;
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
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(i, f) {
      return this;
    }
  }
  class o extends a {
    constructor(i, f, E) {
      super(), this.varKind = i, this.name = f, this.rhs = E;
    }
    render({ es5: i, _n: f }) {
      const E = i ? r.varKinds.var : this.varKind, I = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${E} ${this.name}${I};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = T(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class l extends a {
    constructor(i, f, E) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = E;
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
      return se(i, this.rhs);
    }
  }
  class c extends l {
    constructor(i, f, E, I) {
      super(i, E, I), this.op = f;
    }
    render({ _n: i }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + i;
    }
  }
  class d extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `${this.label}:` + i;
    }
  }
  class u extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `break${this.label ? ` ${this.label}` : ""};` + i;
    }
  }
  class h extends a {
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
  class b extends a {
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
  class g extends a {
    constructor(i = []) {
      super(), this.nodes = i;
    }
    render(i) {
      return this.nodes.reduce((f, E) => f + E.render(i), "");
    }
    optimizeNodes() {
      const { nodes: i } = this;
      let f = i.length;
      for (; f--; ) {
        const E = i[f].optimizeNodes();
        Array.isArray(E) ? i.splice(f, 1, ...E) : E ? i[f] = E : i.splice(f, 1);
      }
      return i.length > 0 ? this : void 0;
    }
    optimizeNames(i, f) {
      const { nodes: E } = this;
      let I = E.length;
      for (; I--; ) {
        const j = E[I];
        j.optimizeNames(i, f) || (k(i, j.names), E.splice(I, 1));
      }
      return E.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => H(i, f.names), {});
    }
  }
  class w extends g {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class _ extends g {
  }
  class y extends w {
  }
  y.kind = "else";
  class m extends w {
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
        const E = f.optimizeNodes();
        f = this.else = Array.isArray(E) ? new y(E) : E;
      }
      if (f)
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(L(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var E;
      if (this.else = (E = this.else) === null || E === void 0 ? void 0 : E.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = T(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return se(i, this.condition), this.else && H(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class v extends w {
  }
  v.kind = "for";
  class N extends v {
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
      return H(super.names, this.iteration.names);
    }
  }
  class R extends v {
    constructor(i, f, E, I) {
      super(), this.varKind = i, this.name = f, this.from = E, this.to = I;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: E, from: I, to: j } = this;
      return `for(${f} ${E}=${I}; ${E}<${j}; ${E}++)` + super.render(i);
    }
    get names() {
      const i = se(super.names, this.from);
      return se(i, this.to);
    }
  }
  class O extends v {
    constructor(i, f, E, I) {
      super(), this.loop = i, this.varKind = f, this.name = E, this.iterable = I;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = T(this.iterable, i, f), this;
    }
    get names() {
      return H(super.names, this.iterable.names);
    }
  }
  class G extends w {
    constructor(i, f, E) {
      super(), this.name = i, this.args = f, this.async = E;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  G.kind = "func";
  class B extends g {
    render(i) {
      return "return " + super.render(i);
    }
  }
  B.kind = "return";
  class le extends w {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var E, I;
      return super.optimizeNames(i, f), (E = this.catch) === null || E === void 0 || E.optimizeNames(i, f), (I = this.finally) === null || I === void 0 || I.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && H(i, this.catch.names), this.finally && H(i, this.finally.names), i;
    }
  }
  class fe extends w {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  fe.kind = "catch";
  class pe extends w {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  pe.kind = "finally";
  class z {
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
      const E = this._extScope.value(i, f);
      return (this._values[E.prefix] || (this._values[E.prefix] = /* @__PURE__ */ new Set())).add(E), E;
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
    _def(i, f, E, I) {
      const j = this._scope.toName(f);
      return E !== void 0 && I && (this._constants[j.str] = E), this._leafNode(new o(i, j, E)), j;
    }
    // `const` declaration (`var` in es5 mode)
    const(i, f, E) {
      return this._def(r.varKinds.const, i, f, E);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(i, f, E) {
      return this._def(r.varKinds.let, i, f, E);
    }
    // `var` declaration with optional assignment
    var(i, f, E) {
      return this._def(r.varKinds.var, i, f, E);
    }
    // assignment code
    assign(i, f, E) {
      return this._leafNode(new l(i, f, E));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new c(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new b(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [E, I] of i)
        f.length > 1 && f.push(","), f.push(E), (E !== I || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, I));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(i, f, E) {
      if (this._blockNode(new m(i)), f && E)
        this.code(f).else().code(E).endIf();
      else if (f)
        this.code(f).endIf();
      else if (E)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(i) {
      return this._elseNode(new m(i));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new y());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, y);
    }
    _for(i, f) {
      return this._blockNode(i), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(i, f) {
      return this._for(new N(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, E, I, j = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const F = this._scope.toName(i);
      return this._for(new R(j, F, f, E), () => I(F));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, E, I = r.varKinds.const) {
      const j = this._scope.toName(i);
      if (this.opts.es5) {
        const F = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${F}.length`, (V) => {
          this.var(j, (0, t._)`${F}[${V}]`), E(j);
        });
      }
      return this._for(new O("of", I, j, f), () => E(j));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, E, I = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, E);
      const j = this._scope.toName(i);
      return this._for(new O("in", I, j, f), () => E(j));
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
      return this._leafNode(new u(i));
    }
    // `return` statement
    return(i) {
      const f = new B();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(B);
    }
    // `try` statement
    try(i, f, E) {
      if (!f && !E)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const I = new le();
      if (this._blockNode(I), this.code(i), f) {
        const j = this.name("e");
        this._currNode = I.catch = new fe(j), f(j);
      }
      return E && (this._currNode = I.finally = new pe(), this.code(E)), this._endBlockNode(fe, pe);
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
      const E = this._nodes.length - f;
      if (E < 0 || i !== void 0 && E !== i)
        throw new Error(`CodeGen: wrong number of nodes: ${E} vs ${i} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(i, f = t.nil, E, I) {
      return this._blockNode(new G(i, f, E)), I && this.code(I).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(G);
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
      const E = this._currNode;
      if (E instanceof i || f && E instanceof f)
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
  e.CodeGen = z;
  function H($, i) {
    for (const f in i)
      $[f] = ($[f] || 0) + (i[f] || 0);
    return $;
  }
  function se($, i) {
    return i instanceof t._CodeOrName ? H($, i.names) : $;
  }
  function T($, i, f) {
    if ($ instanceof t.Name)
      return E($);
    if (!I($))
      return $;
    return new t._Code($._items.reduce((j, F) => (F instanceof t.Name && (F = E(F)), F instanceof t._Code ? j.push(...F._items) : j.push(F), j), []));
    function E(j) {
      const F = f[j.str];
      return F === void 0 || i[j.str] !== 1 ? j : (delete i[j.str], F);
    }
    function I(j) {
      return j instanceof t._Code && j._items.some((F) => F instanceof t.Name && i[F.str] === 1 && f[F.str] !== void 0);
    }
  }
  function k($, i) {
    for (const f in i)
      $[f] = ($[f] || 0) - (i[f] || 0);
  }
  function L($) {
    return typeof $ == "boolean" || typeof $ == "number" || $ === null ? !$ : (0, t._)`!${S($)}`;
  }
  e.not = L;
  const D = p(e.operators.AND);
  function K(...$) {
    return $.reduce(D);
  }
  e.and = K;
  const M = p(e.operators.OR);
  function P(...$) {
    return $.reduce(M);
  }
  e.or = P;
  function p($) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${S(i)} ${$} ${S(f)}`;
  }
  function S($) {
    return $ instanceof t.Name ? $ : (0, t._)`(${$})`;
  }
})(x);
var C = {};
Object.defineProperty(C, "__esModule", { value: !0 });
C.checkStrictMode = C.getErrorPath = C.Type = C.useFunc = C.setEvaluated = C.evaluatedPropsToName = C.mergeEvaluated = C.eachItem = C.unescapeJsonPointer = C.escapeJsonPointer = C.escapeFragment = C.unescapeFragment = C.schemaRefOrVal = C.schemaHasRulesButRef = C.schemaHasRules = C.checkUnknownRules = C.alwaysValidSchema = C.toHash = void 0;
const oe = x, u0 = tn;
function d0(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
C.toHash = d0;
function f0(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Hl(e, t), !Jl(t, e.self.RULES.all));
}
C.alwaysValidSchema = f0;
function Hl(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || Wl(e, `unknown keyword: "${a}"`);
}
C.checkUnknownRules = Hl;
function Jl(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
C.schemaHasRules = Jl;
function h0(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
C.schemaHasRulesButRef = h0;
function m0({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, oe._)`${r}`;
  }
  return (0, oe._)`${e}${t}${(0, oe.getProperty)(n)}`;
}
C.schemaRefOrVal = m0;
function p0(e) {
  return Xl(decodeURIComponent(e));
}
C.unescapeFragment = p0;
function $0(e) {
  return encodeURIComponent(lo(e));
}
C.escapeFragment = $0;
function lo(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
C.escapeJsonPointer = lo;
function Xl(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
C.unescapeJsonPointer = Xl;
function y0(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
C.eachItem = y0;
function Ji({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, l) => {
    const c = o === void 0 ? a : o instanceof oe.Name ? (a instanceof oe.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof oe.Name ? (t(s, o, a), a) : r(a, o);
    return l === oe.Name && !(c instanceof oe.Name) ? n(s, c) : c;
  };
}
C.mergeEvaluated = {
  props: Ji({
    mergeNames: (e, t, r) => e.if((0, oe._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, oe._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, oe._)`${r} || {}`).code((0, oe._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, oe._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, oe._)`${r} || {}`), uo(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Bl
  }),
  items: Ji({
    mergeNames: (e, t, r) => e.if((0, oe._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, oe._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, oe._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, oe._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Bl(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, oe._)`{}`);
  return t !== void 0 && uo(e, r, t), r;
}
C.evaluatedPropsToName = Bl;
function uo(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, oe._)`${t}${(0, oe.getProperty)(n)}`, !0));
}
C.setEvaluated = uo;
const Xi = {};
function _0(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Xi[t.code] || (Xi[t.code] = new u0._Code(t.code))
  });
}
C.useFunc = _0;
var Bs;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Bs || (C.Type = Bs = {}));
function g0(e, t, r) {
  if (e instanceof oe.Name) {
    const n = t === Bs.Num;
    return r ? n ? (0, oe._)`"[" + ${e} + "]"` : (0, oe._)`"['" + ${e} + "']"` : n ? (0, oe._)`"/" + ${e}` : (0, oe._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, oe.getProperty)(e).toString() : "/" + lo(e);
}
C.getErrorPath = g0;
function Wl(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
C.checkStrictMode = Wl;
var st = {};
Object.defineProperty(st, "__esModule", { value: !0 });
const Pe = x, v0 = {
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
st.default = v0;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = x, r = C, n = st;
  e.keywordError = {
    message: ({ keyword: y }) => (0, t.str)`must pass "${y}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: y, schemaType: m }) => m ? (0, t.str)`"${y}" keyword must be ${m} ($data)` : (0, t.str)`"${y}" keyword is invalid ($data)`
  };
  function s(y, m = e.keywordError, v, N) {
    const { it: R } = y, { gen: O, compositeRule: G, allErrors: B } = R, le = h(y, m, v);
    N ?? (G || B) ? c(O, le) : d(R, (0, t._)`[${le}]`);
  }
  e.reportError = s;
  function a(y, m = e.keywordError, v) {
    const { it: N } = y, { gen: R, compositeRule: O, allErrors: G } = N, B = h(y, m, v);
    c(R, B), O || G || d(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o(y, m) {
    y.assign(n.default.errors, m), y.if((0, t._)`${n.default.vErrors} !== null`, () => y.if(m, () => y.assign((0, t._)`${n.default.vErrors}.length`, m), () => y.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function l({ gen: y, keyword: m, schemaValue: v, data: N, errsCount: R, it: O }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const G = y.name("err");
    y.forRange("i", R, n.default.errors, (B) => {
      y.const(G, (0, t._)`${n.default.vErrors}[${B}]`), y.if((0, t._)`${G}.instancePath === undefined`, () => y.assign((0, t._)`${G}.instancePath`, (0, t.strConcat)(n.default.instancePath, O.errorPath))), y.assign((0, t._)`${G}.schemaPath`, (0, t.str)`${O.errSchemaPath}/${m}`), O.opts.verbose && (y.assign((0, t._)`${G}.schema`, v), y.assign((0, t._)`${G}.data`, N));
    });
  }
  e.extendErrors = l;
  function c(y, m) {
    const v = y.const("err", m);
    y.if((0, t._)`${n.default.vErrors} === null`, () => y.assign(n.default.vErrors, (0, t._)`[${v}]`), (0, t._)`${n.default.vErrors}.push(${v})`), y.code((0, t._)`${n.default.errors}++`);
  }
  function d(y, m) {
    const { gen: v, validateName: N, schemaEnv: R } = y;
    R.$async ? v.throw((0, t._)`new ${y.ValidationError}(${m})`) : (v.assign((0, t._)`${N}.errors`, m), v.return(!1));
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
  function h(y, m, v) {
    const { createErrors: N } = y.it;
    return N === !1 ? (0, t._)`{}` : b(y, m, v);
  }
  function b(y, m, v = {}) {
    const { gen: N, it: R } = y, O = [
      g(R, v),
      w(y, v)
    ];
    return _(y, m, O), N.object(...O);
  }
  function g({ errorPath: y }, { instancePath: m }) {
    const v = m ? (0, t.str)`${y}${(0, r.getErrorPath)(m, r.Type.Str)}` : y;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, v)];
  }
  function w({ keyword: y, it: { errSchemaPath: m } }, { schemaPath: v, parentSchema: N }) {
    let R = N ? m : (0, t.str)`${m}/${y}`;
    return v && (R = (0, t.str)`${R}${(0, r.getErrorPath)(v, r.Type.Str)}`), [u.schemaPath, R];
  }
  function _(y, { params: m, message: v }, N) {
    const { keyword: R, data: O, schemaValue: G, it: B } = y, { opts: le, propertyName: fe, topSchemaRef: pe, schemaPath: z } = B;
    N.push([u.keyword, R], [u.params, typeof m == "function" ? m(y) : m || (0, t._)`{}`]), le.messages && N.push([u.message, typeof v == "function" ? v(y) : v]), le.verbose && N.push([u.schema, G], [u.parentSchema, (0, t._)`${pe}${z}`], [n.default.data, O]), fe && N.push([u.propertyName, fe]);
  }
})(sn);
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.boolOrEmptySchema = _r.topBoolOrEmptySchema = void 0;
const w0 = sn, E0 = x, b0 = st, S0 = {
  message: "boolean schema is false"
};
function P0(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Yl(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(b0.default.data) : (t.assign((0, E0._)`${n}.errors`, null), t.return(!0));
}
_r.topBoolOrEmptySchema = P0;
function N0(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Yl(e)) : r.var(t, !0);
}
_r.boolOrEmptySchema = N0;
function Yl(e, t) {
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
  (0, w0.reportError)(s, S0, void 0, t);
}
var ye = {}, er = {};
Object.defineProperty(er, "__esModule", { value: !0 });
er.getRules = er.isJSONType = void 0;
const R0 = ["string", "number", "integer", "boolean", "null", "object", "array"], O0 = new Set(R0);
function I0(e) {
  return typeof e == "string" && O0.has(e);
}
er.isJSONType = I0;
function T0() {
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
er.getRules = T0;
var ut = {};
Object.defineProperty(ut, "__esModule", { value: !0 });
ut.shouldUseRule = ut.shouldUseGroup = ut.schemaHasRulesForType = void 0;
function j0({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Ql(e, n);
}
ut.schemaHasRulesForType = j0;
function Ql(e, t) {
  return t.rules.some((r) => Zl(e, r));
}
ut.shouldUseGroup = Ql;
function Zl(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
ut.shouldUseRule = Zl;
Object.defineProperty(ye, "__esModule", { value: !0 });
ye.reportTypeError = ye.checkDataTypes = ye.checkDataType = ye.coerceAndCheckDataType = ye.getJSONTypes = ye.getSchemaTypes = ye.DataType = void 0;
const k0 = er, A0 = ut, C0 = sn, Q = x, xl = C;
var mr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(mr || (ye.DataType = mr = {}));
function D0(e) {
  const t = eu(e.type);
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
ye.getSchemaTypes = D0;
function eu(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(k0.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ye.getJSONTypes = eu;
function M0(e, t) {
  const { gen: r, data: n, opts: s } = e, a = L0(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, A0.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const l = fo(t, n, s.strictNumbers, mr.Wrong);
    r.if(l, () => {
      a.length ? V0(e, t, a) : ho(e);
    });
  }
  return o;
}
ye.coerceAndCheckDataType = M0;
const tu = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function L0(e, t) {
  return t ? e.filter((r) => tu.has(r) || t === "array" && r === "array") : [];
}
function V0(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, Q._)`typeof ${s}`), l = n.let("coerced", (0, Q._)`undefined`);
  a.coerceTypes === "array" && n.if((0, Q._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, Q._)`${s}[0]`).assign(o, (0, Q._)`typeof ${s}`).if(fo(t, s, a.strictNumbers), () => n.assign(l, s))), n.if((0, Q._)`${l} !== undefined`);
  for (const d of r)
    (tu.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), ho(e), n.endIf(), n.if((0, Q._)`${l} !== undefined`, () => {
    n.assign(s, l), F0(e, l);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, Q._)`${o} == "number" || ${o} == "boolean"`).assign(l, (0, Q._)`"" + ${s}`).elseIf((0, Q._)`${s} === null`).assign(l, (0, Q._)`""`);
        return;
      case "number":
        n.elseIf((0, Q._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, Q._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, Q._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, Q._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, Q._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, Q._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, Q._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, Q._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(l, (0, Q._)`[${s}]`);
    }
  }
}
function F0({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, Q._)`${t} !== undefined`, () => e.assign((0, Q._)`${t}[${r}]`, n));
}
function Ws(e, t, r, n = mr.Correct) {
  const s = n === mr.Correct ? Q.operators.EQ : Q.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, Q._)`${t} ${s} null`;
    case "array":
      a = (0, Q._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, Q._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, Q._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, Q._)`typeof ${t} ${s} ${e}`;
  }
  return n === mr.Correct ? a : (0, Q.not)(a);
  function o(l = Q.nil) {
    return (0, Q.and)((0, Q._)`typeof ${t} == "number"`, l, r ? (0, Q._)`isFinite(${t})` : Q.nil);
  }
}
ye.checkDataType = Ws;
function fo(e, t, r, n) {
  if (e.length === 1)
    return Ws(e[0], t, r, n);
  let s;
  const a = (0, xl.toHash)(e);
  if (a.array && a.object) {
    const o = (0, Q._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, Q._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = Q.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, Q.and)(s, Ws(o, t, r, n));
  return s;
}
ye.checkDataTypes = fo;
const z0 = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, Q._)`{type: ${e}}` : (0, Q._)`{type: ${t}}`
};
function ho(e) {
  const t = U0(e);
  (0, C0.reportError)(t, z0);
}
ye.reportTypeError = ho;
function U0(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, xl.schemaRefOrVal)(e, n, "type");
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
const sr = x, q0 = C;
function G0(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Bi(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => Bi(e, a, s.default));
}
os.assignDefaults = G0;
function Bi(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const l = (0, sr._)`${a}${(0, sr.getProperty)(t)}`;
  if (s) {
    (0, q0.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let c = (0, sr._)`${l} === undefined`;
  o.useDefaults === "empty" && (c = (0, sr._)`${c} || ${l} === null || ${l} === ""`), n.if(c, (0, sr._)`${l} = ${(0, sr.stringify)(r)}`);
}
var nt = {}, te = {};
Object.defineProperty(te, "__esModule", { value: !0 });
te.validateUnion = te.validateArray = te.usePattern = te.callValidateCode = te.schemaProperties = te.allSchemaProperties = te.noPropertyInData = te.propertyInData = te.isOwnProperty = te.hasPropFunc = te.reportMissingProp = te.checkMissingProp = te.checkReportMissingProp = void 0;
const ce = x, mo = C, gt = st, K0 = C;
function H0(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if($o(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, ce._)`${t}` }, !0), e.error();
  });
}
te.checkReportMissingProp = H0;
function J0({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, ce.or)(...n.map((a) => (0, ce.and)($o(e, t, a, r.ownProperties), (0, ce._)`${s} = ${a}`)));
}
te.checkMissingProp = J0;
function X0(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
te.reportMissingProp = X0;
function ru(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ce._)`Object.prototype.hasOwnProperty`
  });
}
te.hasPropFunc = ru;
function po(e, t, r) {
  return (0, ce._)`${ru(e)}.call(${t}, ${r})`;
}
te.isOwnProperty = po;
function B0(e, t, r, n) {
  const s = (0, ce._)`${t}${(0, ce.getProperty)(r)} !== undefined`;
  return n ? (0, ce._)`${s} && ${po(e, t, r)}` : s;
}
te.propertyInData = B0;
function $o(e, t, r, n) {
  const s = (0, ce._)`${t}${(0, ce.getProperty)(r)} === undefined`;
  return n ? (0, ce.or)(s, (0, ce.not)(po(e, t, r))) : s;
}
te.noPropertyInData = $o;
function nu(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
te.allSchemaProperties = nu;
function W0(e, t) {
  return nu(t).filter((r) => !(0, mo.alwaysValidSchema)(e, t[r]));
}
te.schemaProperties = W0;
function Y0({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, l, c, d) {
  const u = d ? (0, ce._)`${e}, ${t}, ${n}${s}` : t, h = [
    [gt.default.instancePath, (0, ce.strConcat)(gt.default.instancePath, a)],
    [gt.default.parentData, o.parentData],
    [gt.default.parentDataProperty, o.parentDataProperty],
    [gt.default.rootData, gt.default.rootData]
  ];
  o.opts.dynamicRef && h.push([gt.default.dynamicAnchors, gt.default.dynamicAnchors]);
  const b = (0, ce._)`${u}, ${r.object(...h)}`;
  return c !== ce.nil ? (0, ce._)`${l}.call(${c}, ${b})` : (0, ce._)`${l}(${b})`;
}
te.callValidateCode = Y0;
const Q0 = (0, ce._)`new RegExp`;
function Z0({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, ce._)`${s.code === "new RegExp" ? Q0 : (0, K0.useFunc)(e, s)}(${r}, ${n})`
  });
}
te.usePattern = Z0;
function x0(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return o(() => t.assign(l, !1)), l;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(l) {
    const c = t.const("len", (0, ce._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: mo.Type.Num
      }, a), t.if((0, ce.not)(a), l);
    });
  }
}
te.validateArray = x0;
function e_(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, mo.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(o, (0, ce._)`${o} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, ce.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
te.validateUnion = e_;
Object.defineProperty(nt, "__esModule", { value: !0 });
nt.validateKeywordUsage = nt.validSchemaType = nt.funcKeywordCode = nt.macroKeywordCode = void 0;
const Ie = x, Wt = st, t_ = te, r_ = sn;
function n_(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, l = t.macro.call(o.self, s, a, o), c = su(r, n, l);
  o.opts.validateSchema !== !1 && o.self.validateSchema(l, !0);
  const d = r.name("valid");
  e.subschema({
    schema: l,
    schemaPath: Ie.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
nt.macroKeywordCode = n_;
function s_(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: l, it: c } = e;
  o_(c, t);
  const d = !l && t.compile ? t.compile.call(c.self, a, o, c) : t.validate, u = su(n, s, d), h = n.let("valid");
  e.block$data(h, b), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function b() {
    if (t.errors === !1)
      _(), t.modifying && Wi(e), y(() => e.error());
    else {
      const m = t.async ? g() : w();
      t.modifying && Wi(e), y(() => a_(e, m));
    }
  }
  function g() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, Ie._)`await `), (v) => n.assign(h, !1).if((0, Ie._)`${v} instanceof ${c.ValidationError}`, () => n.assign(m, (0, Ie._)`${v}.errors`), () => n.throw(v))), m;
  }
  function w() {
    const m = (0, Ie._)`${u}.errors`;
    return n.assign(m, null), _(Ie.nil), m;
  }
  function _(m = t.async ? (0, Ie._)`await ` : Ie.nil) {
    const v = c.opts.passContext ? Wt.default.this : Wt.default.self, N = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, Ie._)`${m}${(0, t_.callValidateCode)(e, u, v, N)}`, t.modifying);
  }
  function y(m) {
    var v;
    n.if((0, Ie.not)((v = t.valid) !== null && v !== void 0 ? v : h), m);
  }
}
nt.funcKeywordCode = s_;
function Wi(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Ie._)`${n.parentData}[${n.parentDataProperty}]`));
}
function a_(e, t) {
  const { gen: r } = e;
  r.if((0, Ie._)`Array.isArray(${t})`, () => {
    r.assign(Wt.default.vErrors, (0, Ie._)`${Wt.default.vErrors} === null ? ${t} : ${Wt.default.vErrors}.concat(${t})`).assign(Wt.default.errors, (0, Ie._)`${Wt.default.vErrors}.length`), (0, r_.extendErrors)(e);
  }, () => e.error());
}
function o_({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function su(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Ie.stringify)(r) });
}
function i_(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
nt.validSchemaType = i_;
function c_({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((l) => !Object.prototype.hasOwnProperty.call(e, l)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
nt.validateKeywordUsage = c_;
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.extendSubschemaMode = Ot.extendSubschemaData = Ot.getSubschema = void 0;
const et = x, au = C;
function l_(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const l = e.schema[t];
    return r === void 0 ? {
      schema: l,
      schemaPath: (0, et._)`${e.schemaPath}${(0, et.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: l[r],
      schemaPath: (0, et._)`${e.schemaPath}${(0, et.getProperty)(t)}${(0, et.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, au.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: o,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Ot.getSubschema = l_;
function u_(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, b = l.let("data", (0, et._)`${t.data}${(0, et.getProperty)(r)}`, !0);
    c(b), e.errorPath = (0, et.str)`${d}${(0, au.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, et._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof et.Name ? s : l.let("data", s, !0);
    c(d), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Ot.extendSubschemaData = u_;
function d_(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Ot.extendSubschemaMode = d_;
var Ee = {}, ou = { exports: {} }, Nt = ou.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  An(t, n, s, e, "", e);
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
function An(e, t, r, n, s, a, o, l, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, l, c, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in Nt.arrayKeywords)
          for (var b = 0; b < h.length; b++)
            An(e, t, r, h[b], s + "/" + u + "/" + b, a, s, u, n, b);
      } else if (u in Nt.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            An(e, t, r, h[g], s + "/" + u + "/" + f_(g), a, s, u, n, g);
      } else (u in Nt.keywords || e.allKeys && !(u in Nt.skipKeywords)) && An(e, t, r, h, s + "/" + u, a, s, u, n);
    }
    r(n, s, a, o, l, c, d);
  }
}
function f_(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var h_ = ou.exports;
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.getSchemaRefs = Ee.resolveUrl = Ee.normalizeId = Ee._getFullPath = Ee.getFullPath = Ee.inlineRef = void 0;
const m_ = C, p_ = xn, $_ = h_, y_ = /* @__PURE__ */ new Set([
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
function __(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Ys(e) : t ? iu(e) <= t : !1;
}
Ee.inlineRef = __;
const g_ = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Ys(e) {
  for (const t in e) {
    if (g_.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Ys) || typeof r == "object" && Ys(r))
      return !0;
  }
  return !1;
}
function iu(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !y_.has(r) && (typeof e[r] == "object" && (0, m_.eachItem)(e[r], (n) => t += iu(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function cu(e, t = "", r) {
  r !== !1 && (t = pr(t));
  const n = e.parse(t);
  return lu(e, n);
}
Ee.getFullPath = cu;
function lu(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ee._getFullPath = lu;
const v_ = /#\/?$/;
function pr(e) {
  return e ? e.replace(v_, "") : "";
}
Ee.normalizeId = pr;
function w_(e, t, r) {
  return r = pr(r), e.resolve(t, r);
}
Ee.resolveUrl = w_;
const E_ = /^[a-z_][-a-z0-9._]*$/i;
function b_(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = pr(e[r] || t), a = { "": s }, o = cu(n, s, !1), l = {}, c = /* @__PURE__ */ new Set();
  return $_(e, { allKeys: !0 }, (h, b, g, w) => {
    if (w === void 0)
      return;
    const _ = o + b;
    let y = a[w];
    typeof h[r] == "string" && (y = m.call(this, h[r])), v.call(this, h.$anchor), v.call(this, h.$dynamicAnchor), a[b] = y;
    function m(N) {
      const R = this.opts.uriResolver.resolve;
      if (N = pr(y ? R(y, N) : N), c.has(N))
        throw u(N);
      c.add(N);
      let O = this.refs[N];
      return typeof O == "string" && (O = this.refs[O]), typeof O == "object" ? d(h, O.schema, N) : N !== pr(_) && (N[0] === "#" ? (d(h, l[N], N), l[N] = h) : this.refs[N] = _), N;
    }
    function v(N) {
      if (typeof N == "string") {
        if (!E_.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), l;
  function d(h, b, g) {
    if (b !== void 0 && !p_(h, b))
      throw u(g);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ee.getSchemaRefs = b_;
Object.defineProperty(We, "__esModule", { value: !0 });
We.getData = We.KeywordCxt = We.validateFunctionCode = void 0;
const uu = _r, Yi = ye, yo = ut, Kn = ye, S_ = os, Br = nt, Ps = Ot, q = x, X = st, P_ = Ee, dt = C, Lr = sn;
function N_(e) {
  if (hu(e) && (mu(e), fu(e))) {
    I_(e);
    return;
  }
  du(e, () => (0, uu.topBoolOrEmptySchema)(e));
}
We.validateFunctionCode = N_;
function du({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, q._)`${X.default.data}, ${X.default.valCxt}`, n.$async, () => {
    e.code((0, q._)`"use strict"; ${Qi(r, s)}`), O_(e, s), e.code(a);
  }) : e.func(t, (0, q._)`${X.default.data}, ${R_(s)}`, n.$async, () => e.code(Qi(r, s)).code(a));
}
function R_(e) {
  return (0, q._)`{${X.default.instancePath}="", ${X.default.parentData}, ${X.default.parentDataProperty}, ${X.default.rootData}=${X.default.data}${e.dynamicRef ? (0, q._)`, ${X.default.dynamicAnchors}={}` : q.nil}}={}`;
}
function O_(e, t) {
  e.if(X.default.valCxt, () => {
    e.var(X.default.instancePath, (0, q._)`${X.default.valCxt}.${X.default.instancePath}`), e.var(X.default.parentData, (0, q._)`${X.default.valCxt}.${X.default.parentData}`), e.var(X.default.parentDataProperty, (0, q._)`${X.default.valCxt}.${X.default.parentDataProperty}`), e.var(X.default.rootData, (0, q._)`${X.default.valCxt}.${X.default.rootData}`), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, q._)`${X.default.valCxt}.${X.default.dynamicAnchors}`);
  }, () => {
    e.var(X.default.instancePath, (0, q._)`""`), e.var(X.default.parentData, (0, q._)`undefined`), e.var(X.default.parentDataProperty, (0, q._)`undefined`), e.var(X.default.rootData, X.default.data), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, q._)`{}`);
  });
}
function I_(e) {
  const { schema: t, opts: r, gen: n } = e;
  du(e, () => {
    r.$comment && t.$comment && $u(e), C_(e), n.let(X.default.vErrors, null), n.let(X.default.errors, 0), r.unevaluated && T_(e), pu(e), L_(e);
  });
}
function T_(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, q._)`${r}.evaluated`), t.if((0, q._)`${e.evaluated}.dynamicProps`, () => t.assign((0, q._)`${e.evaluated}.props`, (0, q._)`undefined`)), t.if((0, q._)`${e.evaluated}.dynamicItems`, () => t.assign((0, q._)`${e.evaluated}.items`, (0, q._)`undefined`));
}
function Qi(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, q._)`/*# sourceURL=${r} */` : q.nil;
}
function j_(e, t) {
  if (hu(e) && (mu(e), fu(e))) {
    k_(e, t);
    return;
  }
  (0, uu.boolOrEmptySchema)(e, t);
}
function fu({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function hu(e) {
  return typeof e.schema != "boolean";
}
function k_(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && $u(e), D_(e), M_(e);
  const a = n.const("_errs", X.default.errors);
  pu(e, a), n.var(t, (0, q._)`${a} === ${X.default.errors}`);
}
function mu(e) {
  (0, dt.checkUnknownRules)(e), A_(e);
}
function pu(e, t) {
  if (e.opts.jtd)
    return Zi(e, [], !1, t);
  const r = (0, Yi.getSchemaTypes)(e.schema), n = (0, Yi.coerceAndCheckDataType)(e, r);
  Zi(e, r, !n, t);
}
function A_(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, dt.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function C_(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, dt.checkStrictMode)(e, "default is ignored in the schema root");
}
function D_(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, P_.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function M_(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function $u({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, q._)`${X.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, q.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, q._)`${X.default.self}.opts.$comment(${a}, ${o}, ${l}.schema)`);
  }
}
function L_(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, q._)`${X.default.errors} === 0`, () => t.return(X.default.data), () => t.throw((0, q._)`new ${s}(${X.default.vErrors})`)) : (t.assign((0, q._)`${n}.errors`, X.default.vErrors), a.unevaluated && V_(e), t.return((0, q._)`${X.default.errors} === 0`));
}
function V_({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof q.Name && e.assign((0, q._)`${t}.props`, r), n instanceof q.Name && e.assign((0, q._)`${t}.items`, n);
}
function Zi(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: l, opts: c, self: d } = e, { RULES: u } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, dt.schemaHasRulesButRef)(a, u))) {
    s.block(() => gu(e, "$ref", u.all.$ref.definition));
    return;
  }
  c.jtd || F_(e, t), s.block(() => {
    for (const b of u.rules)
      h(b);
    h(u.post);
  });
  function h(b) {
    (0, yo.shouldUseGroup)(a, b) && (b.type ? (s.if((0, Kn.checkDataType)(b.type, o, c.strictNumbers)), xi(e, b), t.length === 1 && t[0] === b.type && r && (s.else(), (0, Kn.reportTypeError)(e)), s.endIf()) : xi(e, b), l || s.if((0, q._)`${X.default.errors} === ${n || 0}`));
  }
}
function xi(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, S_.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, yo.shouldUseRule)(n, a) && gu(e, a.keyword, a.definition, t.type);
  });
}
function F_(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (z_(e, t), e.opts.allowUnionTypes || U_(e, t), q_(e, e.dataTypes));
}
function z_(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      yu(e.dataTypes, r) || _o(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), K_(e, t);
  }
}
function U_(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && _o(e, "use allowUnionTypes to allow union type keyword");
}
function q_(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, yo.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => G_(t, o)) && _o(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function G_(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function yu(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function K_(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    yu(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function _o(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, dt.checkStrictMode)(e, t, e.opts.strictTypes);
}
class _u {
  constructor(t, r, n) {
    if ((0, Br.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, dt.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", vu(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Br.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", X.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, q.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, q.not)(t), void 0, r);
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
    this.fail((0, q._)`${r} !== undefined && (${(0, q.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Lr.reportExtraError : Lr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Lr.reportError)(this, this.def.$dataError || Lr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Lr.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = q.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = q.nil, r = q.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, q.or)((0, q._)`${s} === undefined`, r)), t !== q.nil && n.assign(t, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== q.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, q.or)(o(), l());
    function o() {
      if (n.length) {
        if (!(r instanceof q.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, q._)`${(0, Kn.checkDataTypes)(c, r, a.opts.strictNumbers, Kn.DataType.Wrong)}`;
      }
      return q.nil;
    }
    function l() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, q._)`!${c}(${r})`;
      }
      return q.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Ps.getSubschema)(this.it, t);
    (0, Ps.extendSubschemaData)(n, this.it, t), (0, Ps.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return j_(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = dt.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = dt.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, q.Name)), !0;
  }
}
We.KeywordCxt = _u;
function gu(e, t, r, n) {
  const s = new _u(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Br.funcKeywordCode)(s, r) : "macro" in r ? (0, Br.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Br.funcKeywordCode)(s, r);
}
const H_ = /^\/(?:[^~]|~0|~1)*$/, J_ = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function vu(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return X.default.rootData;
  if (e[0] === "/") {
    if (!H_.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = X.default.rootData;
  } else {
    const d = J_.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const u = +d[1];
    if (s = d[2], s === "#") {
      if (u >= t)
        throw new Error(c("property/index", u));
      return n[t - u];
    }
    if (u > t)
      throw new Error(c("data", u));
    if (a = r[t - u], !s)
      return a;
  }
  let o = a;
  const l = s.split("/");
  for (const d of l)
    d && (a = (0, q._)`${a}${(0, q.getProperty)((0, dt.unescapeJsonPointer)(d))}`, o = (0, q._)`${o} && ${a}`);
  return o;
  function c(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
We.getData = vu;
var an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
class X_ extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
an.default = X_;
var Pr = {};
Object.defineProperty(Pr, "__esModule", { value: !0 });
const Ns = Ee;
class B_ extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Ns.resolveUrl)(t, r, n), this.missingSchema = (0, Ns.normalizeId)((0, Ns.getFullPath)(t, this.missingRef));
  }
}
Pr.default = B_;
var Ce = {};
Object.defineProperty(Ce, "__esModule", { value: !0 });
Ce.resolveSchema = Ce.getCompilingSchema = Ce.resolveRef = Ce.compileSchema = Ce.SchemaEnv = void 0;
const Ge = x, W_ = an, Kt = st, Xe = Ee, ec = C, Y_ = We;
class is {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Xe.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Ce.SchemaEnv = is;
function go(e) {
  const t = wu.call(this, e);
  if (t)
    return t;
  const r = (0, Xe.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new Ge.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let l;
  e.$async && (l = o.scopeValue("Error", {
    ref: W_.default,
    code: (0, Ge._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: o,
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
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Ge.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: l,
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
  let u;
  try {
    this._compilations.add(e), (0, Y_.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    u = `${o.scopeRefs(Kt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const g = new Function(`${Kt.default.self}`, `${Kt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: _ } = d;
      g.evaluated = {
        props: w instanceof Ge.Name ? void 0 : w,
        items: _ instanceof Ge.Name ? void 0 : _,
        dynamicProps: w instanceof Ge.Name,
        dynamicItems: _ instanceof Ge.Name
      }, g.source && (g.source.evaluated = (0, Ge.stringify)(g.evaluated));
    }
    return e.validate = g, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
Ce.compileSchema = go;
function Q_(e, t, r) {
  var n;
  r = (0, Xe.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = eg.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    o && (a = new is({ schema: o, schemaId: l, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = Z_.call(this, a);
}
Ce.resolveRef = Q_;
function Z_(e) {
  return (0, Xe.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : go.call(this, e);
}
function wu(e) {
  for (const t of this._compilations)
    if (x_(t, e))
      return t;
}
Ce.getCompilingSchema = wu;
function x_(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function eg(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || cs.call(this, e, t);
}
function cs(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Xe._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Xe.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Rs.call(this, r, e);
  const a = (0, Xe.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const l = cs.call(this, e, o);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : Rs.call(this, r, l);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || go.call(this, o), a === (0, Xe.normalizeId)(t)) {
      const { schema: l } = o, { schemaId: c } = this.opts, d = l[c];
      return d && (s = (0, Xe.resolveUrl)(this.opts.uriResolver, s, d)), new is({ schema: l, schemaId: c, root: e, baseId: s });
    }
    return Rs.call(this, r, o);
  }
}
Ce.resolveSchema = cs;
const tg = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Rs(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, ec.unescapeFragment)(l)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !tg.has(l) && d && (t = (0, Xe.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, ec.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, Xe.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = cs.call(this, n, l);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new is({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const rg = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", ng = "Meta-schema for $data reference (JSON AnySchema extension proposal)", sg = "object", ag = [
  "$data"
], og = {
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
}, ig = !1, cg = {
  $id: rg,
  description: ng,
  type: sg,
  required: ag,
  properties: og,
  additionalProperties: ig
};
var vo = {};
Object.defineProperty(vo, "__esModule", { value: !0 });
const Eu = jl;
Eu.code = 'require("ajv/dist/runtime/uri").default';
vo.default = Eu;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = We;
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
  const n = an, s = Pr, a = er, o = Ce, l = x, c = Ee, d = ye, u = C, h = cg, b = vo, g = (P, p) => new RegExp(P, p);
  g.code = "new RegExp";
  const w = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
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
  ]), y = {
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
  function N(P) {
    var p, S, $, i, f, E, I, j, F, V, ne, De, It, Tt, jt, kt, At, Ct, Dt, Mt, Lt, Vt, Ft, zt, Ut;
    const Ue = P.strict, qt = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, Ir = qt === !0 || qt === void 0 ? 1 : qt || 0, Tr = ($ = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && $ !== void 0 ? $ : g, $s = (i = P.uriResolver) !== null && i !== void 0 ? i : b.default;
    return {
      strictSchema: (E = (f = P.strictSchema) !== null && f !== void 0 ? f : Ue) !== null && E !== void 0 ? E : !0,
      strictNumbers: (j = (I = P.strictNumbers) !== null && I !== void 0 ? I : Ue) !== null && j !== void 0 ? j : !0,
      strictTypes: (V = (F = P.strictTypes) !== null && F !== void 0 ? F : Ue) !== null && V !== void 0 ? V : "log",
      strictTuples: (De = (ne = P.strictTuples) !== null && ne !== void 0 ? ne : Ue) !== null && De !== void 0 ? De : "log",
      strictRequired: (Tt = (It = P.strictRequired) !== null && It !== void 0 ? It : Ue) !== null && Tt !== void 0 ? Tt : !1,
      code: P.code ? { ...P.code, optimize: Ir, regExp: Tr } : { optimize: Ir, regExp: Tr },
      loopRequired: (jt = P.loopRequired) !== null && jt !== void 0 ? jt : v,
      loopEnum: (kt = P.loopEnum) !== null && kt !== void 0 ? kt : v,
      meta: (At = P.meta) !== null && At !== void 0 ? At : !0,
      messages: (Ct = P.messages) !== null && Ct !== void 0 ? Ct : !0,
      inlineRefs: (Dt = P.inlineRefs) !== null && Dt !== void 0 ? Dt : !0,
      schemaId: (Mt = P.schemaId) !== null && Mt !== void 0 ? Mt : "$id",
      addUsedSchema: (Lt = P.addUsedSchema) !== null && Lt !== void 0 ? Lt : !0,
      validateSchema: (Vt = P.validateSchema) !== null && Vt !== void 0 ? Vt : !0,
      validateFormats: (Ft = P.validateFormats) !== null && Ft !== void 0 ? Ft : !0,
      unicodeRegExp: (zt = P.unicodeRegExp) !== null && zt !== void 0 ? zt : !0,
      int32range: (Ut = P.int32range) !== null && Ut !== void 0 ? Ut : !0,
      uriResolver: $s
    };
  }
  class R {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...N(p) };
      const { es5: S, lines: $ } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: _, es5: S, lines: $ }), this.logger = H(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), O.call(this, y, p, "NOT SUPPORTED"), O.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = pe.call(this), p.formats && le.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && fe.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), B.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: S, schemaId: $ } = this.opts;
      let i = h;
      $ === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), S && p && this.addMetaSchema(i, i[$], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: S } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[S] || p : void 0;
    }
    validate(p, S) {
      let $;
      if (typeof p == "string") {
        if ($ = this.getSchema(p), !$)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        $ = this.compile(p);
      const i = $(S);
      return "$async" in $ || (this.errors = $.errors), i;
    }
    compile(p, S) {
      const $ = this._addSchema(p, S);
      return $.validate || this._compileSchemaEnv($);
    }
    compileAsync(p, S) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: $ } = this.opts;
      return i.call(this, p, S);
      async function i(V, ne) {
        await f.call(this, V.$schema);
        const De = this._addSchema(V, ne);
        return De.validate || E.call(this, De);
      }
      async function f(V) {
        V && !this.getSchema(V) && await i.call(this, { $ref: V }, !0);
      }
      async function E(V) {
        try {
          return this._compileSchemaEnv(V);
        } catch (ne) {
          if (!(ne instanceof s.default))
            throw ne;
          return I.call(this, ne), await j.call(this, ne.missingSchema), E.call(this, V);
        }
      }
      function I({ missingSchema: V, missingRef: ne }) {
        if (this.refs[V])
          throw new Error(`AnySchema ${V} is loaded but ${ne} cannot be resolved`);
      }
      async function j(V) {
        const ne = await F.call(this, V);
        this.refs[V] || await f.call(this, ne.$schema), this.refs[V] || this.addSchema(ne, V, S);
      }
      async function F(V) {
        const ne = this._loading[V];
        if (ne)
          return ne;
        try {
          return await (this._loading[V] = $(V));
        } finally {
          delete this._loading[V];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, S, $, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const E of p)
          this.addSchema(E, void 0, $, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: E } = this.opts;
        if (f = p[E], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${E} must be string`);
      }
      return S = (0, c.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(p, $, S, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, S, $ = this.opts.validateSchema) {
      return this.addSchema(p, S, !0, $), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, S) {
      if (typeof p == "boolean")
        return !0;
      let $;
      if ($ = p.$schema, $ !== void 0 && typeof $ != "string")
        throw new Error("$schema must be a string");
      if ($ = $ || this.opts.defaultMeta || this.defaultMeta(), !$)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate($, p);
      if (!i && S) {
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
      let S;
      for (; typeof (S = G.call(this, p)) == "string"; )
        p = S;
      if (S === void 0) {
        const { schemaId: $ } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: $ });
        if (S = o.resolveSchema.call(this, i, p), !S)
          return;
        this.refs[p] = S;
      }
      return S.validate || this._compileSchemaEnv(S);
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
          const S = G.call(this, p);
          return typeof S == "object" && this._cache.delete(S.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const S = p;
          this._cache.delete(S);
          let $ = p[this.opts.schemaId];
          return $ && ($ = (0, c.normalizeId)($), delete this.schemas[$], delete this.refs[$]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const S of p)
        this.addKeyword(S);
      return this;
    }
    addKeyword(p, S) {
      let $;
      if (typeof p == "string")
        $ = p, typeof S == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), S.keyword = $);
      else if (typeof p == "object" && S === void 0) {
        if (S = p, $ = S.keyword, Array.isArray($) && !$.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (T.call(this, $, S), !S)
        return (0, u.eachItem)($, (f) => k.call(this, f)), this;
      D.call(this, S);
      const i = {
        ...S,
        type: (0, d.getJSONTypes)(S.type),
        schemaType: (0, d.getJSONTypes)(S.schemaType)
      };
      return (0, u.eachItem)($, i.type.length === 0 ? (f) => k.call(this, f, i) : (f) => i.type.forEach((E) => k.call(this, f, i, E))), this;
    }
    getKeyword(p) {
      const S = this.RULES.all[p];
      return typeof S == "object" ? S.definition : !!S;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: S } = this;
      delete S.keywords[p], delete S.all[p];
      for (const $ of S.rules) {
        const i = $.rules.findIndex((f) => f.keyword === p);
        i >= 0 && $.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, S) {
      return typeof S == "string" && (S = new RegExp(S)), this.formats[p] = S, this;
    }
    errorsText(p = this.errors, { separator: S = ", ", dataVar: $ = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${$}${i.instancePath} ${i.message}`).reduce((i, f) => i + S + f);
    }
    $dataMetaSchema(p, S) {
      const $ = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of S) {
        const f = i.split("/").slice(1);
        let E = p;
        for (const I of f)
          E = E[I];
        for (const I in $) {
          const j = $[I];
          if (typeof j != "object")
            continue;
          const { $data: F } = j.definition, V = E[I];
          F && V && (E[I] = M(V));
        }
      }
      return p;
    }
    _removeAllSchemas(p, S) {
      for (const $ in p) {
        const i = p[$];
        (!S || S.test($)) && (typeof i == "string" ? delete p[$] : i && !i.meta && (this._cache.delete(i.schema), delete p[$]));
      }
    }
    _addSchema(p, S, $, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let E;
      const { schemaId: I } = this.opts;
      if (typeof p == "object")
        E = p[I];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let j = this._cache.get(p);
      if (j !== void 0)
        return j;
      $ = (0, c.normalizeId)(E || $);
      const F = c.getSchemaRefs.call(this, p, $);
      return j = new o.SchemaEnv({ schema: p, schemaId: I, meta: S, baseId: $, localRefs: F }), this._cache.set(j.schema, j), f && !$.startsWith("#") && ($ && this._checkUnique($), this.refs[$] = j), i && this.validateSchema(p, !0), j;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : o.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const S = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, p);
      } finally {
        this.opts = S;
      }
    }
  }
  R.ValidationError = n.default, R.MissingRefError = s.default, e.default = R;
  function O(P, p, S, $ = "error") {
    for (const i in P) {
      const f = i;
      f in p && this.logger[$](`${S}: option ${i}. ${P[f]}`);
    }
  }
  function G(P) {
    return P = (0, c.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function B() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const p in P)
          this.addSchema(P[p], p);
  }
  function le() {
    for (const P in this.opts.formats) {
      const p = this.opts.formats[P];
      p && this.addFormat(P, p);
    }
  }
  function fe(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in P) {
      const S = P[p];
      S.keyword || (S.keyword = p), this.addKeyword(S);
    }
  }
  function pe() {
    const P = { ...this.opts };
    for (const p of w)
      delete P[p];
    return P;
  }
  const z = { log() {
  }, warn() {
  }, error() {
  } };
  function H(P) {
    if (P === !1)
      return z;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const se = /^[a-z_$][a-z0-9_$:-]*$/i;
  function T(P, p) {
    const { RULES: S } = this;
    if ((0, u.eachItem)(P, ($) => {
      if (S.keywords[$])
        throw new Error(`Keyword ${$} is already defined`);
      if (!se.test($))
        throw new Error(`Keyword ${$} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(P, p, S) {
    var $;
    const i = p == null ? void 0 : p.post;
    if (S && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let E = i ? f.post : f.rules.find(({ type: j }) => j === S);
    if (E || (E = { type: S, rules: [] }, f.rules.push(E)), f.keywords[P] = !0, !p)
      return;
    const I = {
      keyword: P,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? L.call(this, E, I, p.before) : E.rules.push(I), f.all[P] = I, ($ = p.implements) === null || $ === void 0 || $.forEach((j) => this.addKeyword(j));
  }
  function L(P, p, S) {
    const $ = P.rules.findIndex((i) => i.keyword === S);
    $ >= 0 ? P.rules.splice($, 0, p) : (P.rules.push(p), this.logger.warn(`rule ${S} is not defined`));
  }
  function D(P) {
    let { metaSchema: p } = P;
    p !== void 0 && (P.$data && this.opts.$data && (p = M(p)), P.validateSchema = this.compile(p, !0));
  }
  const K = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function M(P) {
    return { anyOf: [P, K] };
  }
})(Kl);
var wo = {}, Eo = {}, bo = {};
Object.defineProperty(bo, "__esModule", { value: !0 });
const lg = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
bo.default = lg;
var tr = {};
Object.defineProperty(tr, "__esModule", { value: !0 });
tr.callRef = tr.getValidate = void 0;
const ug = Pr, tc = te, Ae = x, ar = st, rc = Ce, $n = C, dg = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: l, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = rc.resolveRef.call(c, d, s, r);
    if (u === void 0)
      throw new ug.default(n.opts.uriResolver, s, r);
    if (u instanceof rc.SchemaEnv)
      return b(u);
    return g(u);
    function h() {
      if (a === d)
        return Cn(e, o, a, a.$async);
      const w = t.scopeValue("root", { ref: d });
      return Cn(e, (0, Ae._)`${w}.validate`, d, d.$async);
    }
    function b(w) {
      const _ = bu(e, w);
      Cn(e, _, w, w.$async);
    }
    function g(w) {
      const _ = t.scopeValue("schema", l.code.source === !0 ? { ref: w, code: (0, Ae.stringify)(w) } : { ref: w }), y = t.name("valid"), m = e.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: Ae.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, y);
      e.mergeEvaluated(m), e.ok(y);
    }
  }
};
function bu(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ae._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
tr.getValidate = bu;
function Cn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: l, opts: c } = a, d = c.passContext ? ar.default.this : Ae.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, Ae._)`await ${(0, tc.callValidateCode)(e, t, d)}`), g(t), o || s.assign(w, !0);
    }, (_) => {
      s.if((0, Ae._)`!(${_} instanceof ${a.ValidationError})`, () => s.throw(_)), b(_), o || s.assign(w, !1);
    }), e.ok(w);
  }
  function h() {
    e.result((0, tc.callValidateCode)(e, t, d), () => g(t), () => b(t));
  }
  function b(w) {
    const _ = (0, Ae._)`${w}.errors`;
    s.assign(ar.default.vErrors, (0, Ae._)`${ar.default.vErrors} === null ? ${_} : ${ar.default.vErrors}.concat(${_})`), s.assign(ar.default.errors, (0, Ae._)`${ar.default.vErrors}.length`);
  }
  function g(w) {
    var _;
    if (!a.opts.unevaluated)
      return;
    const y = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (a.props !== !0)
      if (y && !y.dynamicProps)
        y.props !== void 0 && (a.props = $n.mergeEvaluated.props(s, y.props, a.props));
      else {
        const m = s.var("props", (0, Ae._)`${w}.evaluated.props`);
        a.props = $n.mergeEvaluated.props(s, m, a.props, Ae.Name);
      }
    if (a.items !== !0)
      if (y && !y.dynamicItems)
        y.items !== void 0 && (a.items = $n.mergeEvaluated.items(s, y.items, a.items));
      else {
        const m = s.var("items", (0, Ae._)`${w}.evaluated.items`);
        a.items = $n.mergeEvaluated.items(s, m, a.items, Ae.Name);
      }
  }
}
tr.callRef = Cn;
tr.default = dg;
Object.defineProperty(Eo, "__esModule", { value: !0 });
const fg = bo, hg = tr, mg = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  fg.default,
  hg.default
];
Eo.default = mg;
var So = {}, Po = {};
Object.defineProperty(Po, "__esModule", { value: !0 });
const Hn = x, vt = Hn.operators, Jn = {
  maximum: { okStr: "<=", ok: vt.LTE, fail: vt.GT },
  minimum: { okStr: ">=", ok: vt.GTE, fail: vt.LT },
  exclusiveMaximum: { okStr: "<", ok: vt.LT, fail: vt.GTE },
  exclusiveMinimum: { okStr: ">", ok: vt.GT, fail: vt.LTE }
}, pg = {
  message: ({ keyword: e, schemaCode: t }) => (0, Hn.str)`must be ${Jn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Hn._)`{comparison: ${Jn[e].okStr}, limit: ${t}}`
}, $g = {
  keyword: Object.keys(Jn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: pg,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Hn._)`${r} ${Jn[t].fail} ${n} || isNaN(${r})`);
  }
};
Po.default = $g;
var No = {};
Object.defineProperty(No, "__esModule", { value: !0 });
const Wr = x, yg = {
  message: ({ schemaCode: e }) => (0, Wr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Wr._)`{multipleOf: ${e}}`
}, _g = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: yg,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), l = a ? (0, Wr._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, Wr._)`${o} !== parseInt(${o})`;
    e.fail$data((0, Wr._)`(${n} === 0 || (${o} = ${r}/${n}, ${l}))`);
  }
};
No.default = _g;
var Ro = {}, Oo = {};
Object.defineProperty(Oo, "__esModule", { value: !0 });
function Su(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Oo.default = Su;
Su.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Ro, "__esModule", { value: !0 });
const Yt = x, gg = C, vg = Oo, wg = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Yt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Yt._)`{limit: ${e}}`
}, Eg = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: wg,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? Yt.operators.GT : Yt.operators.LT, o = s.opts.unicode === !1 ? (0, Yt._)`${r}.length` : (0, Yt._)`${(0, gg.useFunc)(e.gen, vg.default)}(${r})`;
    e.fail$data((0, Yt._)`${o} ${a} ${n}`);
  }
};
Ro.default = Eg;
var Io = {};
Object.defineProperty(Io, "__esModule", { value: !0 });
const bg = te, Xn = x, Sg = {
  message: ({ schemaCode: e }) => (0, Xn.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Xn._)`{pattern: ${e}}`
}, Pg = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Sg,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: a } = e, o = a.opts.unicodeRegExp ? "u" : "", l = r ? (0, Xn._)`(new RegExp(${s}, ${o}))` : (0, bg.usePattern)(e, n);
    e.fail$data((0, Xn._)`!${l}.test(${t})`);
  }
};
Io.default = Pg;
var To = {};
Object.defineProperty(To, "__esModule", { value: !0 });
const Yr = x, Ng = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Yr.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Yr._)`{limit: ${e}}`
}, Rg = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Ng,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Yr.operators.GT : Yr.operators.LT;
    e.fail$data((0, Yr._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
To.default = Rg;
var jo = {};
Object.defineProperty(jo, "__esModule", { value: !0 });
const Vr = te, Qr = x, Og = C, Ig = {
  message: ({ params: { missingProperty: e } }) => (0, Qr.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Qr._)`{missingProperty: ${e}}`
}, Tg = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Ig,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: l } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= l.loopRequired;
    if (o.allErrors ? d() : u(), l.strictRequired) {
      const g = e.parentSchema.properties, { definedProperties: w } = e.it;
      for (const _ of r)
        if ((g == null ? void 0 : g[_]) === void 0 && !w.has(_)) {
          const y = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${_}" is not defined at "${y}" (strictRequired)`;
          (0, Og.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(Qr.nil, h);
      else
        for (const g of r)
          (0, Vr.checkReportMissingProp)(e, g);
    }
    function u() {
      const g = t.let("missing");
      if (c || a) {
        const w = t.let("valid", !0);
        e.block$data(w, () => b(g, w)), e.ok(w);
      } else
        t.if((0, Vr.checkMissingProp)(e, r, g)), (0, Vr.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, Vr.noPropertyInData)(t, s, g, l.ownProperties), () => e.error());
      });
    }
    function b(g, w) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(w, (0, Vr.propertyInData)(t, s, g, l.ownProperties)), t.if((0, Qr.not)(w), () => {
          e.error(), t.break();
        });
      }, Qr.nil);
    }
  }
};
jo.default = Tg;
var ko = {};
Object.defineProperty(ko, "__esModule", { value: !0 });
const Zr = x, jg = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Zr.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Zr._)`{limit: ${e}}`
}, kg = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: jg,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? Zr.operators.GT : Zr.operators.LT;
    e.fail$data((0, Zr._)`${r}.length ${s} ${n}`);
  }
};
ko.default = kg;
var Ao = {}, on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
const Pu = xn;
Pu.code = 'require("ajv/dist/runtime/equal").default';
on.default = Pu;
Object.defineProperty(Ao, "__esModule", { value: !0 });
const Os = ye, ve = x, Ag = C, Cg = on, Dg = {
  message: ({ params: { i: e, j: t } }) => (0, ve.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, ve._)`{i: ${e}, j: ${t}}`
}, Mg = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Dg,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: l } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, Os.getSchemaTypes)(a.items) : [];
    e.block$data(c, u, (0, ve._)`${o} === false`), e.ok(c);
    function u() {
      const w = t.let("i", (0, ve._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: w, j: _ }), t.assign(c, !0), t.if((0, ve._)`${w} > 1`, () => (h() ? b : g)(w, _));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function b(w, _) {
      const y = t.name("item"), m = (0, Os.checkDataTypes)(d, y, l.opts.strictNumbers, Os.DataType.Wrong), v = t.const("indices", (0, ve._)`{}`);
      t.for((0, ve._)`;${w}--;`, () => {
        t.let(y, (0, ve._)`${r}[${w}]`), t.if(m, (0, ve._)`continue`), d.length > 1 && t.if((0, ve._)`typeof ${y} == "string"`, (0, ve._)`${y} += "_"`), t.if((0, ve._)`typeof ${v}[${y}] == "number"`, () => {
          t.assign(_, (0, ve._)`${v}[${y}]`), e.error(), t.assign(c, !1).break();
        }).code((0, ve._)`${v}[${y}] = ${w}`);
      });
    }
    function g(w, _) {
      const y = (0, Ag.useFunc)(t, Cg.default), m = t.name("outer");
      t.label(m).for((0, ve._)`;${w}--;`, () => t.for((0, ve._)`${_} = ${w}; ${_}--;`, () => t.if((0, ve._)`${y}(${r}[${w}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Ao.default = Mg;
var Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
const Qs = x, Lg = C, Vg = on, Fg = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Qs._)`{allowedValue: ${e}}`
}, zg = {
  keyword: "const",
  $data: !0,
  error: Fg,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, Qs._)`!${(0, Lg.useFunc)(t, Vg.default)}(${r}, ${s})`) : e.fail((0, Qs._)`${a} !== ${r}`);
  }
};
Co.default = zg;
var Do = {};
Object.defineProperty(Do, "__esModule", { value: !0 });
const qr = x, Ug = C, qg = on, Gg = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, qr._)`{allowedValues: ${e}}`
}, Kg = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Gg,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, Ug.useFunc)(t, qg.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", a);
      u = (0, qr.or)(...s.map((w, _) => b(g, _)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", a, (g) => t.if((0, qr._)`${d()}(${r}, ${g})`, () => t.assign(u, !0).break()));
    }
    function b(g, w) {
      const _ = s[w];
      return typeof _ == "object" && _ !== null ? (0, qr._)`${d()}(${r}, ${g}[${w}])` : (0, qr._)`${r} === ${_}`;
    }
  }
};
Do.default = Kg;
Object.defineProperty(So, "__esModule", { value: !0 });
const Hg = Po, Jg = No, Xg = Ro, Bg = Io, Wg = To, Yg = jo, Qg = ko, Zg = Ao, xg = Co, ev = Do, tv = [
  // number
  Hg.default,
  Jg.default,
  // string
  Xg.default,
  Bg.default,
  // object
  Wg.default,
  Yg.default,
  // array
  Qg.default,
  Zg.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  xg.default,
  ev.default
];
So.default = tv;
var Mo = {}, Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.validateAdditionalItems = void 0;
const Qt = x, Zs = C, rv = {
  message: ({ params: { len: e } }) => (0, Qt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Qt._)`{limit: ${e}}`
}, nv = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: rv,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Zs.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Nu(e, n);
  }
};
function Nu(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const l = r.const("len", (0, Qt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Qt._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Zs.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, Qt._)`${l} <= ${t.length}`);
    r.if((0, Qt.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: a, dataProp: u, dataPropType: Zs.Type.Num }, d), o.allErrors || r.if((0, Qt.not)(d), () => r.break());
    });
  }
}
Nr.validateAdditionalItems = Nu;
Nr.default = nv;
var Lo = {}, Rr = {};
Object.defineProperty(Rr, "__esModule", { value: !0 });
Rr.validateTuple = void 0;
const nc = x, Dn = C, sv = te, av = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Ru(e, "additionalItems", t);
    r.items = !0, !(0, Dn.alwaysValidSchema)(r, t) && e.ok((0, sv.validateArray)(e));
  }
};
function Ru(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = Dn.mergeEvaluated.items(n, r.length, l.items));
  const c = n.name("valid"), d = n.const("len", (0, nc._)`${a}.length`);
  r.forEach((h, b) => {
    (0, Dn.alwaysValidSchema)(l, h) || (n.if((0, nc._)`${d} > ${b}`, () => e.subschema({
      keyword: o,
      schemaProp: b,
      dataProp: b
    }, c)), e.ok(c));
  });
  function u(h) {
    const { opts: b, errSchemaPath: g } = l, w = r.length, _ = w === h.minItems && (w === h.maxItems || h[t] === !1);
    if (b.strictTuples && !_) {
      const y = `"${o}" is ${w}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, Dn.checkStrictMode)(l, y, b.strictTuples);
    }
  }
}
Rr.validateTuple = Ru;
Rr.default = av;
Object.defineProperty(Lo, "__esModule", { value: !0 });
const ov = Rr, iv = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, ov.validateTuple)(e, "items")
};
Lo.default = iv;
var Vo = {};
Object.defineProperty(Vo, "__esModule", { value: !0 });
const sc = x, cv = C, lv = te, uv = Nr, dv = {
  message: ({ params: { len: e } }) => (0, sc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, sc._)`{limit: ${e}}`
}, fv = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: dv,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, cv.alwaysValidSchema)(n, t) && (s ? (0, uv.validateAdditionalItems)(e, s) : e.ok((0, lv.validateArray)(e)));
  }
};
Vo.default = fv;
var Fo = {};
Object.defineProperty(Fo, "__esModule", { value: !0 });
const ze = x, yn = C, hv = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, ze.str)`must contain at least ${e} valid item(s)` : (0, ze.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, ze._)`{minContains: ${e}}` : (0, ze._)`{minContains: ${e}, maxContains: ${t}}`
}, mv = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: hv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, l;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, l = d) : o = 1;
    const u = t.const("len", (0, ze._)`${s}.length`);
    if (e.setParams({ min: o, max: l }), l === void 0 && o === 0) {
      (0, yn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && o > l) {
      (0, yn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, yn.alwaysValidSchema)(a, r)) {
      let _ = (0, ze._)`${u} >= ${o}`;
      l !== void 0 && (_ = (0, ze._)`${_} && ${u} <= ${l}`), e.pass(_);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    l === void 0 && o === 1 ? g(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, ze._)`${s}.length > 0`, b)) : (t.let(h, !1), b()), e.result(h, () => e.reset());
    function b() {
      const _ = t.name("_valid"), y = t.let("count", 0);
      g(_, () => t.if(_, () => w(y)));
    }
    function g(_, y) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: yn.Type.Num,
          compositeRule: !0
        }, _), y();
      });
    }
    function w(_) {
      t.code((0, ze._)`${_}++`), l === void 0 ? t.if((0, ze._)`${_} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, ze._)`${_} > ${l}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, ze._)`${_} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
Fo.default = mv;
var Ou = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = x, r = C, n = te;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${c},
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
    code(c) {
      const [d, u] = a(c);
      o(c, d), l(c, u);
    }
  };
  function a({ schema: c }) {
    const d = {}, u = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const b = Array.isArray(c[h]) ? d : u;
      b[h] = c[h];
    }
    return [d, u];
  }
  function o(c, d = c.schema) {
    const { gen: u, data: h, it: b } = c;
    if (Object.keys(d).length === 0)
      return;
    const g = u.let("missing");
    for (const w in d) {
      const _ = d[w];
      if (_.length === 0)
        continue;
      const y = (0, n.propertyInData)(u, h, w, b.opts.ownProperties);
      c.setParams({
        property: w,
        depsCount: _.length,
        deps: _.join(", ")
      }), b.allErrors ? u.if(y, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (u.if((0, t._)`${y} && (${(0, n.checkMissingProp)(c, _, g)})`), (0, n.reportMissingProp)(c, g), u.else());
    }
  }
  e.validatePropertyDeps = o;
  function l(c, d = c.schema) {
    const { gen: u, data: h, keyword: b, it: g } = c, w = u.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)(g, d[_]) || (u.if(
        (0, n.propertyInData)(u, h, _, g.opts.ownProperties),
        () => {
          const y = c.subschema({ keyword: b, schemaProp: _ }, w);
          c.mergeValidEvaluated(y, w);
        },
        () => u.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  e.validateSchemaDeps = l, e.default = s;
})(Ou);
var zo = {};
Object.defineProperty(zo, "__esModule", { value: !0 });
const Iu = x, pv = C, $v = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Iu._)`{propertyName: ${e.propertyName}}`
}, yv = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: $v,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, pv.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, Iu.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
zo.default = yv;
var ls = {};
Object.defineProperty(ls, "__esModule", { value: !0 });
const _n = te, He = x, _v = st, gn = C, gv = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, He._)`{additionalProperty: ${e.additionalProperty}}`
}, vv = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: gv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, gn.alwaysValidSchema)(o, r))
      return;
    const d = (0, _n.allSchemaProperties)(n.properties), u = (0, _n.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, He._)`${a} === ${_v.default.errors}`);
    function h() {
      t.forIn("key", s, (y) => {
        !d.length && !u.length ? w(y) : t.if(b(y), () => w(y));
      });
    }
    function b(y) {
      let m;
      if (d.length > 8) {
        const v = (0, gn.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, _n.isOwnProperty)(t, v, y);
      } else d.length ? m = (0, He.or)(...d.map((v) => (0, He._)`${y} === ${v}`)) : m = He.nil;
      return u.length && (m = (0, He.or)(m, ...u.map((v) => (0, He._)`${(0, _n.usePattern)(e, v)}.test(${y})`))), (0, He.not)(m);
    }
    function g(y) {
      t.code((0, He._)`delete ${s}[${y}]`);
    }
    function w(y) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        g(y);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: y }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, gn.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_(y, m, !1), t.if((0, He.not)(m), () => {
          e.reset(), g(y);
        })) : (_(y, m), l || t.if((0, He.not)(m), () => t.break()));
      }
    }
    function _(y, m, v) {
      const N = {
        keyword: "additionalProperties",
        dataProp: y,
        dataPropType: gn.Type.Str
      };
      v === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
ls.default = vv;
var Uo = {};
Object.defineProperty(Uo, "__esModule", { value: !0 });
const wv = We, ac = te, Is = C, oc = ls, Ev = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && oc.default.code(new wv.KeywordCxt(a, oc.default, "additionalProperties"));
    const o = (0, ac.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Is.mergeEvaluated.props(t, (0, Is.toHash)(o), a.props));
    const l = o.filter((h) => !(0, Is.alwaysValidSchema)(a, r[h]));
    if (l.length === 0)
      return;
    const c = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, ac.propertyInData)(t, s, h, a.opts.ownProperties)), u(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
Uo.default = Ev;
var qo = {};
Object.defineProperty(qo, "__esModule", { value: !0 });
const ic = te, vn = x, cc = C, lc = C, bv = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, l = (0, ic.allSchemaProperties)(r), c = l.filter((_) => (0, cc.alwaysValidSchema)(a, r[_]));
    if (l.length === 0 || c.length === l.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, u = t.name("valid");
    a.props !== !0 && !(a.props instanceof vn.Name) && (a.props = (0, lc.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    b();
    function b() {
      for (const _ of l)
        d && g(_), a.allErrors ? w(_) : (t.var(u, !0), w(_), t.if(u));
    }
    function g(_) {
      for (const y in d)
        new RegExp(_).test(y) && (0, cc.checkStrictMode)(a, `property ${y} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function w(_) {
      t.forIn("key", n, (y) => {
        t.if((0, vn._)`${(0, ic.usePattern)(e, _)}.test(${y})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: y,
            dataPropType: lc.Type.Str
          }, u), a.opts.unevaluated && h !== !0 ? t.assign((0, vn._)`${h}[${y}]`, !0) : !m && !a.allErrors && t.if((0, vn.not)(u), () => t.break());
        });
      });
    }
  }
};
qo.default = bv;
var Go = {};
Object.defineProperty(Go, "__esModule", { value: !0 });
const Sv = C, Pv = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Sv.alwaysValidSchema)(n, r)) {
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
Go.default = Pv;
var Ko = {};
Object.defineProperty(Ko, "__esModule", { value: !0 });
const Nv = te, Rv = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Nv.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Ko.default = Rv;
var Ho = {};
Object.defineProperty(Ho, "__esModule", { value: !0 });
const Mn = x, Ov = C, Iv = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Mn._)`{passingSchemas: ${e.passing}}`
}, Tv = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Iv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), l = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: l }), t.block(d), e.result(o, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((u, h) => {
        let b;
        (0, Ov.alwaysValidSchema)(s, u) ? t.var(c, !0) : b = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, Mn._)`${c} && ${o}`).assign(o, !1).assign(l, (0, Mn._)`[${l}, ${h}]`).else(), t.if(c, () => {
          t.assign(o, !0), t.assign(l, h), b && e.mergeEvaluated(b, Mn.Name);
        });
      });
    }
  }
};
Ho.default = Tv;
var Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
const jv = C, kv = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, jv.alwaysValidSchema)(n, a))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
Jo.default = kv;
var Xo = {};
Object.defineProperty(Xo, "__esModule", { value: !0 });
const Bn = x, Tu = C, Av = {
  message: ({ params: e }) => (0, Bn.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Bn._)`{failingKeyword: ${e.ifClause}}`
}, Cv = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Av,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Tu.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = uc(n, "then"), a = uc(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), l = t.name("_valid");
    if (c(), e.reset(), s && a) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, Bn.not)(l), d("else"));
    e.pass(o, () => e.error(!0));
    function c() {
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
        const b = e.subschema({ keyword: u }, l);
        t.assign(o, l), e.mergeValidEvaluated(b, o), h ? t.assign(h, (0, Bn._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function uc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Tu.alwaysValidSchema)(e, r);
}
Xo.default = Cv;
var Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
const Dv = C, Mv = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Dv.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Bo.default = Mv;
Object.defineProperty(Mo, "__esModule", { value: !0 });
const Lv = Nr, Vv = Lo, Fv = Rr, zv = Vo, Uv = Fo, qv = Ou, Gv = zo, Kv = ls, Hv = Uo, Jv = qo, Xv = Go, Bv = Ko, Wv = Ho, Yv = Jo, Qv = Xo, Zv = Bo;
function xv(e = !1) {
  const t = [
    // any
    Xv.default,
    Bv.default,
    Wv.default,
    Yv.default,
    Qv.default,
    Zv.default,
    // object
    Gv.default,
    Kv.default,
    qv.default,
    Hv.default,
    Jv.default
  ];
  return e ? t.push(Vv.default, zv.default) : t.push(Lv.default, Fv.default), t.push(Uv.default), t;
}
Mo.default = xv;
var Wo = {}, Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
const me = x, ew = {
  message: ({ schemaCode: e }) => (0, me.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, me._)`{format: ${e}}`
}, tw = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: ew,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: l } = e, { opts: c, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!c.validateFormats)
      return;
    s ? b() : g();
    function b() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, me._)`${w}[${o}]`), y = r.let("fType"), m = r.let("format");
      r.if((0, me._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign(y, (0, me._)`${_}.type || "string"`).assign(m, (0, me._)`${_}.validate`), () => r.assign(y, (0, me._)`"string"`).assign(m, _)), e.fail$data((0, me.or)(v(), N()));
      function v() {
        return c.strictSchema === !1 ? me.nil : (0, me._)`${o} && !${m}`;
      }
      function N() {
        const R = u.$async ? (0, me._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, me._)`${m}(${n})`, O = (0, me._)`(typeof ${m} == "function" ? ${R} : ${m}.test(${n}))`;
        return (0, me._)`${m} && ${m} !== true && ${y} === ${t} && !${O}`;
      }
    }
    function g() {
      const w = h.formats[a];
      if (!w) {
        v();
        return;
      }
      if (w === !0)
        return;
      const [_, y, m] = N(w);
      _ === t && e.pass(R());
      function v() {
        if (c.strictSchema === !1) {
          h.logger.warn(O());
          return;
        }
        throw new Error(O());
        function O() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function N(O) {
        const G = O instanceof RegExp ? (0, me.regexpCode)(O) : c.code.formats ? (0, me._)`${c.code.formats}${(0, me.getProperty)(a)}` : void 0, B = r.scopeValue("formats", { key: a, ref: O, code: G });
        return typeof O == "object" && !(O instanceof RegExp) ? [O.type || "string", O.validate, (0, me._)`${B}.validate`] : ["string", O, B];
      }
      function R() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, me._)`await ${m}(${n})`;
        }
        return typeof y == "function" ? (0, me._)`${m}(${n})` : (0, me._)`${m}.test(${n})`;
      }
    }
  }
};
Yo.default = tw;
Object.defineProperty(Wo, "__esModule", { value: !0 });
const rw = Yo, nw = [rw.default];
Wo.default = nw;
var gr = {};
Object.defineProperty(gr, "__esModule", { value: !0 });
gr.contentVocabulary = gr.metadataVocabulary = void 0;
gr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
gr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(wo, "__esModule", { value: !0 });
const sw = Eo, aw = So, ow = Mo, iw = Wo, dc = gr, cw = [
  sw.default,
  aw.default,
  (0, ow.default)(),
  iw.default,
  dc.metadataVocabulary,
  dc.contentVocabulary
];
wo.default = cw;
var Qo = {}, us = {};
Object.defineProperty(us, "__esModule", { value: !0 });
us.DiscrError = void 0;
var fc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(fc || (us.DiscrError = fc = {}));
Object.defineProperty(Qo, "__esModule", { value: !0 });
const ur = x, xs = us, hc = Ce, lw = Pr, uw = C, dw = {
  message: ({ params: { discrError: e, tagName: t } }) => e === xs.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, ur._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, fw = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: dw,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const l = n.propertyName;
    if (typeof l != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, ur._)`${r}${(0, ur.getProperty)(l)}`);
    t.if((0, ur._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: xs.DiscrError.Tag, tag: d, tagName: l })), e.ok(c);
    function u() {
      const g = b();
      t.if(!1);
      for (const w in g)
        t.elseIf((0, ur._)`${d} === ${w}`), t.assign(c, h(g[w]));
      t.else(), e.error(!1, { discrError: xs.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(g) {
      const w = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: g }, w);
      return e.mergeEvaluated(_, ur.Name), w;
    }
    function b() {
      var g;
      const w = {}, _ = m(s);
      let y = !0;
      for (let R = 0; R < o.length; R++) {
        let O = o[R];
        if (O != null && O.$ref && !(0, uw.schemaHasRulesButRef)(O, a.self.RULES)) {
          const B = O.$ref;
          if (O = hc.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, B), O instanceof hc.SchemaEnv && (O = O.schema), O === void 0)
            throw new lw.default(a.opts.uriResolver, a.baseId, B);
        }
        const G = (g = O == null ? void 0 : O.properties) === null || g === void 0 ? void 0 : g[l];
        if (typeof G != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        y = y && (_ || m(O)), v(G, R);
      }
      if (!y)
        throw new Error(`discriminator: "${l}" must be required`);
      return w;
      function m({ required: R }) {
        return Array.isArray(R) && R.includes(l);
      }
      function v(R, O) {
        if (R.const)
          N(R.const, O);
        else if (R.enum)
          for (const G of R.enum)
            N(G, O);
        else
          throw new Error(`discriminator: "properties/${l}" must have "const" or "enum"`);
      }
      function N(R, O) {
        if (typeof R != "string" || R in w)
          throw new Error(`discriminator: "${l}" values must be unique strings`);
        w[R] = O;
      }
    }
  }
};
Qo.default = fw;
const hw = "http://json-schema.org/draft-07/schema#", mw = "http://json-schema.org/draft-07/schema#", pw = "Core schema meta-schema", $w = {
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
}, yw = [
  "object",
  "boolean"
], _w = {
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
}, gw = {
  $schema: hw,
  $id: mw,
  title: pw,
  definitions: $w,
  type: yw,
  properties: _w,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = Kl, n = wo, s = Qo, a = gw, o = ["/properties"], l = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((w) => this.addVocabulary(w)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const w = this.opts.$data ? this.$dataMetaSchema(a, o) : a;
      this.addMetaSchema(w, l, !1), this.refs["http://json-schema.org/schema"] = l;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(l) ? l : void 0);
    }
  }
  t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var d = We;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var u = x;
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
  var h = an;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var b = Pr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return b.default;
  } });
})(Js, Js.exports);
var vw = Js.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = vw, r = x, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, a = {
    message: ({ keyword: l, schemaCode: c }) => (0, r.str)`should be ${s[l].okStr} ${c}`,
    params: ({ keyword: l, schemaCode: c }) => (0, r._)`{comparison: ${s[l].okStr}, limit: ${c}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: a,
    code(l) {
      const { gen: c, data: d, schemaCode: u, keyword: h, it: b } = l, { opts: g, self: w } = b;
      if (!g.validateFormats)
        return;
      const _ = new t.KeywordCxt(b, w.RULES.all.format.definition, "format");
      _.$data ? y() : m();
      function y() {
        const N = c.scopeValue("formats", {
          ref: w.formats,
          code: g.code.formats
        }), R = c.const("fmt", (0, r._)`${N}[${_.schemaCode}]`);
        l.fail$data((0, r.or)((0, r._)`typeof ${R} != "object"`, (0, r._)`${R} instanceof RegExp`, (0, r._)`typeof ${R}.compare != "function"`, v(R)));
      }
      function m() {
        const N = _.schema, R = w.formats[N];
        if (!R || R === !0)
          return;
        if (typeof R != "object" || R instanceof RegExp || typeof R.compare != "function")
          throw new Error(`"${h}": format "${N}" does not define "compare" function`);
        const O = c.scopeValue("formats", {
          key: N,
          ref: R,
          code: g.code.formats ? (0, r._)`${g.code.formats}${(0, r.getProperty)(N)}` : void 0
        });
        l.fail$data(v(O));
      }
      function v(N) {
        return (0, r._)`${N}.compare(${d}, ${u}) ${s[h].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const o = (l) => (l.addKeyword(e.formatLimitDefinition), l);
  e.default = o;
})(Gl);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = ql, n = Gl, s = x, a = new s.Name("fullFormats"), o = new s.Name("fastFormats"), l = (d, u = { keywords: !0 }) => {
    if (Array.isArray(u))
      return c(d, u, r.fullFormats, a), d;
    const [h, b] = u.mode === "fast" ? [r.fastFormats, o] : [r.fullFormats, a], g = u.formats || r.formatNames;
    return c(d, g, h, b), u.keywords && (0, n.default)(d), d;
  };
  l.get = (d, u = "full") => {
    const b = (u === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!b)
      throw new Error(`Unknown format "${d}"`);
    return b;
  };
  function c(d, u, h, b) {
    var g, w;
    (g = (w = d.opts.code).formats) !== null && g !== void 0 || (w.formats = (0, s._)`require("ajv-formats/dist/formats").${b}`);
    for (const _ of u)
      d.addFormat(_, h[_]);
  }
  e.exports = t = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
})(Hs, Hs.exports);
var ww = Hs.exports;
const Ew = /* @__PURE__ */ Kc(ww), bw = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), a = Object.getOwnPropertyDescriptor(t, r);
  !Sw(s, a) && n || Object.defineProperty(e, r, a);
}, Sw = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, Pw = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, Nw = (e, t) => `/* Wrapped ${e}*/
${t}`, Rw = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), Ow = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), Iw = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = Nw.bind(null, n, t.toString());
  Object.defineProperty(s, "name", Ow);
  const { writable: a, enumerable: o, configurable: l } = Rw;
  Object.defineProperty(e, "toString", { value: s, writable: a, enumerable: o, configurable: l });
};
function Tw(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    bw(e, t, s, r);
  return Pw(e, t), Iw(e, t, n), e;
}
const mc = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: s = !1,
    after: a = !0
  } = t;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!s && !a)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let o, l, c;
  const d = function(...u) {
    const h = this, b = () => {
      o = void 0, l && (clearTimeout(l), l = void 0), a && (c = e.apply(h, u));
    }, g = () => {
      l = void 0, o && (clearTimeout(o), o = void 0), a && (c = e.apply(h, u));
    }, w = s && !o;
    return clearTimeout(o), o = setTimeout(b, r), n > 0 && n !== Number.POSITIVE_INFINITY && !l && (l = setTimeout(g, n)), w && (c = e.apply(h, u)), c;
  };
  return Tw(d, e), d.cancel = () => {
    o && (clearTimeout(o), o = void 0), l && (clearTimeout(l), l = void 0);
  }, d;
};
var ea = { exports: {} };
const jw = "2.0.0", ju = 256, kw = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, Aw = 16, Cw = ju - 6, Dw = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var ds = {
  MAX_LENGTH: ju,
  MAX_SAFE_COMPONENT_LENGTH: Aw,
  MAX_SAFE_BUILD_LENGTH: Cw,
  MAX_SAFE_INTEGER: kw,
  RELEASE_TYPES: Dw,
  SEMVER_SPEC_VERSION: jw,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Mw = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var fs = Mw;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = ds, a = fs;
  t = e.exports = {};
  const o = t.re = [], l = t.safeRe = [], c = t.src = [], d = t.safeSrc = [], u = t.t = {};
  let h = 0;
  const b = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", s],
    [b, n]
  ], w = (y) => {
    for (const [m, v] of g)
      y = y.split(`${m}*`).join(`${m}{0,${v}}`).split(`${m}+`).join(`${m}{1,${v}}`);
    return y;
  }, _ = (y, m, v) => {
    const N = w(m), R = h++;
    a(y, R, m), u[y] = R, c[R] = m, d[R] = N, o[R] = new RegExp(m, v ? "g" : void 0), l[R] = new RegExp(N, v ? "g" : void 0);
  };
  _("NUMERICIDENTIFIER", "0|[1-9]\\d*"), _("NUMERICIDENTIFIERLOOSE", "\\d+"), _("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${b}*`), _("MAINVERSION", `(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})`), _("MAINVERSIONLOOSE", `(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASEIDENTIFIER", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIER]})`), _("PRERELEASEIDENTIFIERLOOSE", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASE", `(?:-(${c[u.PRERELEASEIDENTIFIER]}(?:\\.${c[u.PRERELEASEIDENTIFIER]})*))`), _("PRERELEASELOOSE", `(?:-?(${c[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[u.PRERELEASEIDENTIFIERLOOSE]})*))`), _("BUILDIDENTIFIER", `${b}+`), _("BUILD", `(?:\\+(${c[u.BUILDIDENTIFIER]}(?:\\.${c[u.BUILDIDENTIFIER]})*))`), _("FULLPLAIN", `v?${c[u.MAINVERSION]}${c[u.PRERELEASE]}?${c[u.BUILD]}?`), _("FULL", `^${c[u.FULLPLAIN]}$`), _("LOOSEPLAIN", `[v=\\s]*${c[u.MAINVERSIONLOOSE]}${c[u.PRERELEASELOOSE]}?${c[u.BUILD]}?`), _("LOOSE", `^${c[u.LOOSEPLAIN]}$`), _("GTLT", "((?:<|>)?=?)"), _("XRANGEIDENTIFIERLOOSE", `${c[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), _("XRANGEIDENTIFIER", `${c[u.NUMERICIDENTIFIER]}|x|X|\\*`), _("XRANGEPLAIN", `[v=\\s]*(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:${c[u.PRERELEASE]})?${c[u.BUILD]}?)?)?`), _("XRANGEPLAINLOOSE", `[v=\\s]*(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:${c[u.PRERELEASELOOSE]})?${c[u.BUILD]}?)?)?`), _("XRANGE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAIN]}$`), _("XRANGELOOSE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAINLOOSE]}$`), _("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), _("COERCE", `${c[u.COERCEPLAIN]}(?:$|[^\\d])`), _("COERCEFULL", c[u.COERCEPLAIN] + `(?:${c[u.PRERELEASE]})?(?:${c[u.BUILD]})?(?:$|[^\\d])`), _("COERCERTL", c[u.COERCE], !0), _("COERCERTLFULL", c[u.COERCEFULL], !0), _("LONETILDE", "(?:~>?)"), _("TILDETRIM", `(\\s*)${c[u.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", _("TILDE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAIN]}$`), _("TILDELOOSE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAINLOOSE]}$`), _("LONECARET", "(?:\\^)"), _("CARETTRIM", `(\\s*)${c[u.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", _("CARET", `^${c[u.LONECARET]}${c[u.XRANGEPLAIN]}$`), _("CARETLOOSE", `^${c[u.LONECARET]}${c[u.XRANGEPLAINLOOSE]}$`), _("COMPARATORLOOSE", `^${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]})$|^$`), _("COMPARATOR", `^${c[u.GTLT]}\\s*(${c[u.FULLPLAIN]})$|^$`), _("COMPARATORTRIM", `(\\s*)${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]}|${c[u.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", _("HYPHENRANGE", `^\\s*(${c[u.XRANGEPLAIN]})\\s+-\\s+(${c[u.XRANGEPLAIN]})\\s*$`), _("HYPHENRANGELOOSE", `^\\s*(${c[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[u.XRANGEPLAINLOOSE]})\\s*$`), _("STAR", "(<|>)?=?\\s*\\*"), _("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), _("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(ea, ea.exports);
var cn = ea.exports;
const Lw = Object.freeze({ loose: !0 }), Vw = Object.freeze({}), Fw = (e) => e ? typeof e != "object" ? Lw : e : Vw;
var Zo = Fw;
const pc = /^[0-9]+$/, ku = (e, t) => {
  const r = pc.test(e), n = pc.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, zw = (e, t) => ku(t, e);
var Au = {
  compareIdentifiers: ku,
  rcompareIdentifiers: zw
};
const wn = fs, { MAX_LENGTH: $c, MAX_SAFE_INTEGER: En } = ds, { safeRe: bn, t: Sn } = cn, Uw = Zo, { compareIdentifiers: or } = Au;
let qw = class Ze {
  constructor(t, r) {
    if (r = Uw(r), t instanceof Ze) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > $c)
      throw new TypeError(
        `version is longer than ${$c} characters`
      );
    wn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? bn[Sn.LOOSE] : bn[Sn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > En || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > En || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > En || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < En)
          return a;
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
    if (wn("SemVer.compare", this.version, this.options, t), !(t instanceof Ze)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new Ze(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof Ze || (t = new Ze(t, this.options)), or(this.major, t.major) || or(this.minor, t.minor) || or(this.patch, t.patch);
  }
  comparePre(t) {
    if (t instanceof Ze || (t = new Ze(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = t.prerelease[r];
      if (wn("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return or(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof Ze || (t = new Ze(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (wn("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return or(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? bn[Sn.PRERELEASELOOSE] : bn[Sn.PRERELEASE]);
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
          let a = this.prerelease.length;
          for (; --a >= 0; )
            typeof this.prerelease[a] == "number" && (this.prerelease[a]++, a = -2);
          if (a === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(s);
          }
        }
        if (r) {
          let a = [r, s];
          n === !1 && (a = [r]), or(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var je = qw;
const yc = je, Gw = (e, t, r = !1) => {
  if (e instanceof yc)
    return e;
  try {
    return new yc(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Or = Gw;
const Kw = Or, Hw = (e, t) => {
  const r = Kw(e, t);
  return r ? r.version : null;
};
var Jw = Hw;
const Xw = Or, Bw = (e, t) => {
  const r = Xw(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var Ww = Bw;
const _c = je, Yw = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new _c(
      e instanceof _c ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var Qw = Yw;
const gc = Or, Zw = (e, t) => {
  const r = gc(e, null, !0), n = gc(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const a = s > 0, o = a ? r : n, l = a ? n : r, c = !!o.prerelease.length;
  if (!!l.prerelease.length && !c) {
    if (!l.patch && !l.minor)
      return "major";
    if (l.compareMain(o) === 0)
      return l.minor && !l.patch ? "minor" : "patch";
  }
  const u = c ? "pre" : "";
  return r.major !== n.major ? u + "major" : r.minor !== n.minor ? u + "minor" : r.patch !== n.patch ? u + "patch" : "prerelease";
};
var xw = Zw;
const eE = je, tE = (e, t) => new eE(e, t).major;
var rE = tE;
const nE = je, sE = (e, t) => new nE(e, t).minor;
var aE = sE;
const oE = je, iE = (e, t) => new oE(e, t).patch;
var cE = iE;
const lE = Or, uE = (e, t) => {
  const r = lE(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var dE = uE;
const vc = je, fE = (e, t, r) => new vc(e, r).compare(new vc(t, r));
var Ye = fE;
const hE = Ye, mE = (e, t, r) => hE(t, e, r);
var pE = mE;
const $E = Ye, yE = (e, t) => $E(e, t, !0);
var _E = yE;
const wc = je, gE = (e, t, r) => {
  const n = new wc(e, r), s = new wc(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var xo = gE;
const vE = xo, wE = (e, t) => e.sort((r, n) => vE(r, n, t));
var EE = wE;
const bE = xo, SE = (e, t) => e.sort((r, n) => bE(n, r, t));
var PE = SE;
const NE = Ye, RE = (e, t, r) => NE(e, t, r) > 0;
var hs = RE;
const OE = Ye, IE = (e, t, r) => OE(e, t, r) < 0;
var ei = IE;
const TE = Ye, jE = (e, t, r) => TE(e, t, r) === 0;
var Cu = jE;
const kE = Ye, AE = (e, t, r) => kE(e, t, r) !== 0;
var Du = AE;
const CE = Ye, DE = (e, t, r) => CE(e, t, r) >= 0;
var ti = DE;
const ME = Ye, LE = (e, t, r) => ME(e, t, r) <= 0;
var ri = LE;
const VE = Cu, FE = Du, zE = hs, UE = ti, qE = ei, GE = ri, KE = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return VE(e, r, n);
    case "!=":
      return FE(e, r, n);
    case ">":
      return zE(e, r, n);
    case ">=":
      return UE(e, r, n);
    case "<":
      return qE(e, r, n);
    case "<=":
      return GE(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Mu = KE;
const HE = je, JE = Or, { safeRe: Pn, t: Nn } = cn, XE = (e, t) => {
  if (e instanceof HE)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Pn[Nn.COERCEFULL] : Pn[Nn.COERCE]);
  else {
    const c = t.includePrerelease ? Pn[Nn.COERCERTLFULL] : Pn[Nn.COERCERTL];
    let d;
    for (; (d = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), c.lastIndex = d.index + d[1].length + d[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", l = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return JE(`${n}.${s}.${a}${o}${l}`, t);
};
var BE = XE;
class WE {
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
var YE = WE, Ts, Ec;
function Qe() {
  if (Ec) return Ts;
  Ec = 1;
  const e = /\s+/g;
  class t {
    constructor(k, L) {
      if (L = s(L), k instanceof t)
        return k.loose === !!L.loose && k.includePrerelease === !!L.includePrerelease ? k : new t(k.raw, L);
      if (k instanceof a)
        return this.raw = k.value, this.set = [[k]], this.formatted = void 0, this;
      if (this.options = L, this.loose = !!L.loose, this.includePrerelease = !!L.includePrerelease, this.raw = k.trim().replace(e, " "), this.set = this.raw.split("||").map((D) => this.parseRange(D.trim())).filter((D) => D.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const D = this.set[0];
        if (this.set = this.set.filter((K) => !_(K[0])), this.set.length === 0)
          this.set = [D];
        else if (this.set.length > 1) {
          for (const K of this.set)
            if (K.length === 1 && y(K[0])) {
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
          const L = this.set[k];
          for (let D = 0; D < L.length; D++)
            D > 0 && (this.formatted += " "), this.formatted += L[D].toString().trim();
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
      const D = ((this.options.includePrerelease && g) | (this.options.loose && w)) + ":" + k, K = n.get(D);
      if (K)
        return K;
      const M = this.options.loose, P = M ? c[d.HYPHENRANGELOOSE] : c[d.HYPHENRANGE];
      k = k.replace(P, H(this.options.includePrerelease)), o("hyphen replace", k), k = k.replace(c[d.COMPARATORTRIM], u), o("comparator trim", k), k = k.replace(c[d.TILDETRIM], h), o("tilde trim", k), k = k.replace(c[d.CARETTRIM], b), o("caret trim", k);
      let p = k.split(" ").map((f) => v(f, this.options)).join(" ").split(/\s+/).map((f) => z(f, this.options));
      M && (p = p.filter((f) => (o("loose invalid filter", f, this.options), !!f.match(c[d.COMPARATORLOOSE])))), o("range list", p);
      const S = /* @__PURE__ */ new Map(), $ = p.map((f) => new a(f, this.options));
      for (const f of $) {
        if (_(f))
          return [f];
        S.set(f.value, f);
      }
      S.size > 1 && S.has("") && S.delete("");
      const i = [...S.values()];
      return n.set(D, i), i;
    }
    intersects(k, L) {
      if (!(k instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((D) => m(D, L) && k.set.some((K) => m(K, L) && D.every((M) => K.every((P) => M.intersects(P, L)))));
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
      for (let L = 0; L < this.set.length; L++)
        if (se(this.set[L], k, this.options))
          return !0;
      return !1;
    }
  }
  Ts = t;
  const r = YE, n = new r(), s = Zo, a = ms(), o = fs, l = je, {
    safeRe: c,
    t: d,
    comparatorTrimReplace: u,
    tildeTrimReplace: h,
    caretTrimReplace: b
  } = cn, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: w } = ds, _ = (T) => T.value === "<0.0.0-0", y = (T) => T.value === "", m = (T, k) => {
    let L = !0;
    const D = T.slice();
    let K = D.pop();
    for (; L && D.length; )
      L = D.every((M) => K.intersects(M, k)), K = D.pop();
    return L;
  }, v = (T, k) => (o("comp", T, k), T = G(T, k), o("caret", T), T = R(T, k), o("tildes", T), T = le(T, k), o("xrange", T), T = pe(T, k), o("stars", T), T), N = (T) => !T || T.toLowerCase() === "x" || T === "*", R = (T, k) => T.trim().split(/\s+/).map((L) => O(L, k)).join(" "), O = (T, k) => {
    const L = k.loose ? c[d.TILDELOOSE] : c[d.TILDE];
    return T.replace(L, (D, K, M, P, p) => {
      o("tilde", T, D, K, M, P, p);
      let S;
      return N(K) ? S = "" : N(M) ? S = `>=${K}.0.0 <${+K + 1}.0.0-0` : N(P) ? S = `>=${K}.${M}.0 <${K}.${+M + 1}.0-0` : p ? (o("replaceTilde pr", p), S = `>=${K}.${M}.${P}-${p} <${K}.${+M + 1}.0-0`) : S = `>=${K}.${M}.${P} <${K}.${+M + 1}.0-0`, o("tilde return", S), S;
    });
  }, G = (T, k) => T.trim().split(/\s+/).map((L) => B(L, k)).join(" "), B = (T, k) => {
    o("caret", T, k);
    const L = k.loose ? c[d.CARETLOOSE] : c[d.CARET], D = k.includePrerelease ? "-0" : "";
    return T.replace(L, (K, M, P, p, S) => {
      o("caret", T, K, M, P, p, S);
      let $;
      return N(M) ? $ = "" : N(P) ? $ = `>=${M}.0.0${D} <${+M + 1}.0.0-0` : N(p) ? M === "0" ? $ = `>=${M}.${P}.0${D} <${M}.${+P + 1}.0-0` : $ = `>=${M}.${P}.0${D} <${+M + 1}.0.0-0` : S ? (o("replaceCaret pr", S), M === "0" ? P === "0" ? $ = `>=${M}.${P}.${p}-${S} <${M}.${P}.${+p + 1}-0` : $ = `>=${M}.${P}.${p}-${S} <${M}.${+P + 1}.0-0` : $ = `>=${M}.${P}.${p}-${S} <${+M + 1}.0.0-0`) : (o("no pr"), M === "0" ? P === "0" ? $ = `>=${M}.${P}.${p}${D} <${M}.${P}.${+p + 1}-0` : $ = `>=${M}.${P}.${p}${D} <${M}.${+P + 1}.0-0` : $ = `>=${M}.${P}.${p} <${+M + 1}.0.0-0`), o("caret return", $), $;
    });
  }, le = (T, k) => (o("replaceXRanges", T, k), T.split(/\s+/).map((L) => fe(L, k)).join(" ")), fe = (T, k) => {
    T = T.trim();
    const L = k.loose ? c[d.XRANGELOOSE] : c[d.XRANGE];
    return T.replace(L, (D, K, M, P, p, S) => {
      o("xRange", T, D, K, M, P, p, S);
      const $ = N(M), i = $ || N(P), f = i || N(p), E = f;
      return K === "=" && E && (K = ""), S = k.includePrerelease ? "-0" : "", $ ? K === ">" || K === "<" ? D = "<0.0.0-0" : D = "*" : K && E ? (i && (P = 0), p = 0, K === ">" ? (K = ">=", i ? (M = +M + 1, P = 0, p = 0) : (P = +P + 1, p = 0)) : K === "<=" && (K = "<", i ? M = +M + 1 : P = +P + 1), K === "<" && (S = "-0"), D = `${K + M}.${P}.${p}${S}`) : i ? D = `>=${M}.0.0${S} <${+M + 1}.0.0-0` : f && (D = `>=${M}.${P}.0${S} <${M}.${+P + 1}.0-0`), o("xRange return", D), D;
    });
  }, pe = (T, k) => (o("replaceStars", T, k), T.trim().replace(c[d.STAR], "")), z = (T, k) => (o("replaceGTE0", T, k), T.trim().replace(c[k.includePrerelease ? d.GTE0PRE : d.GTE0], "")), H = (T) => (k, L, D, K, M, P, p, S, $, i, f, E) => (N(D) ? L = "" : N(K) ? L = `>=${D}.0.0${T ? "-0" : ""}` : N(M) ? L = `>=${D}.${K}.0${T ? "-0" : ""}` : P ? L = `>=${L}` : L = `>=${L}${T ? "-0" : ""}`, N($) ? S = "" : N(i) ? S = `<${+$ + 1}.0.0-0` : N(f) ? S = `<${$}.${+i + 1}.0-0` : E ? S = `<=${$}.${i}.${f}-${E}` : T ? S = `<${$}.${i}.${+f + 1}-0` : S = `<=${S}`, `${L} ${S}`.trim()), se = (T, k, L) => {
    for (let D = 0; D < T.length; D++)
      if (!T[D].test(k))
        return !1;
    if (k.prerelease.length && !L.includePrerelease) {
      for (let D = 0; D < T.length; D++)
        if (o(T[D].semver), T[D].semver !== a.ANY && T[D].semver.prerelease.length > 0) {
          const K = T[D].semver;
          if (K.major === k.major && K.minor === k.minor && K.patch === k.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Ts;
}
var js, bc;
function ms() {
  if (bc) return js;
  bc = 1;
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
      u = u.trim().split(/\s+/).join(" "), o("comparator", u, h), this.options = h, this.loose = !!h.loose, this.parse(u), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(u) {
      const h = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], b = u.match(h);
      if (!b)
        throw new TypeError(`Invalid comparator: ${u}`);
      this.operator = b[1] !== void 0 ? b[1] : "", this.operator === "=" && (this.operator = ""), b[2] ? this.semver = new l(b[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(u) {
      if (o("Comparator.test", u, this.options.loose), this.semver === e || u === e)
        return !0;
      if (typeof u == "string")
        try {
          u = new l(u, this.options);
        } catch {
          return !1;
        }
      return a(u, this.operator, this.semver, this.options);
    }
    intersects(u, h) {
      if (!(u instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(u.value, h).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new c(this.value, h).test(u.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || a(this.semver, "<", u.semver, h) && this.operator.startsWith(">") && u.operator.startsWith("<") || a(this.semver, ">", u.semver, h) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  js = t;
  const r = Zo, { safeRe: n, t: s } = cn, a = Mu, o = fs, l = je, c = Qe();
  return js;
}
const QE = Qe(), ZE = (e, t, r) => {
  try {
    t = new QE(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var ps = ZE;
const xE = Qe(), e1 = (e, t) => new xE(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var t1 = e1;
const r1 = je, n1 = Qe(), s1 = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new n1(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === -1) && (n = o, s = new r1(n, r));
  }), n;
};
var a1 = s1;
const o1 = je, i1 = Qe(), c1 = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new i1(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === 1) && (n = o, s = new o1(n, r));
  }), n;
};
var l1 = c1;
const ks = je, u1 = Qe(), Sc = hs, d1 = (e, t) => {
  e = new u1(e, t);
  let r = new ks("0.0.0");
  if (e.test(r) || (r = new ks("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let a = null;
    s.forEach((o) => {
      const l = new ks(o.semver.version);
      switch (o.operator) {
        case ">":
          l.prerelease.length === 0 ? l.patch++ : l.prerelease.push(0), l.raw = l.format();
        case "":
        case ">=":
          (!a || Sc(l, a)) && (a = l);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || Sc(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var f1 = d1;
const h1 = Qe(), m1 = (e, t) => {
  try {
    return new h1(e, t).range || "*";
  } catch {
    return null;
  }
};
var p1 = m1;
const $1 = je, Lu = ms(), { ANY: y1 } = Lu, _1 = Qe(), g1 = ps, Pc = hs, Nc = ei, v1 = ri, w1 = ti, E1 = (e, t, r, n) => {
  e = new $1(e, n), t = new _1(t, n);
  let s, a, o, l, c;
  switch (r) {
    case ">":
      s = Pc, a = v1, o = Nc, l = ">", c = ">=";
      break;
    case "<":
      s = Nc, a = w1, o = Pc, l = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (g1(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const u = t.set[d];
    let h = null, b = null;
    if (u.forEach((g) => {
      g.semver === y1 && (g = new Lu(">=0.0.0")), h = h || g, b = b || g, s(g.semver, h.semver, n) ? h = g : o(g.semver, b.semver, n) && (b = g);
    }), h.operator === l || h.operator === c || (!b.operator || b.operator === l) && a(e, b.semver))
      return !1;
    if (b.operator === c && o(e, b.semver))
      return !1;
  }
  return !0;
};
var ni = E1;
const b1 = ni, S1 = (e, t, r) => b1(e, t, ">", r);
var P1 = S1;
const N1 = ni, R1 = (e, t, r) => N1(e, t, "<", r);
var O1 = R1;
const Rc = Qe(), I1 = (e, t, r) => (e = new Rc(e, r), t = new Rc(t, r), e.intersects(t, r));
var T1 = I1;
const j1 = ps, k1 = Ye;
var A1 = (e, t, r) => {
  const n = [];
  let s = null, a = null;
  const o = e.sort((u, h) => k1(u, h, r));
  for (const u of o)
    j1(u, t, r) ? (a = u, s || (s = u)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const l = [];
  for (const [u, h] of n)
    u === h ? l.push(u) : !h && u === o[0] ? l.push("*") : h ? u === o[0] ? l.push(`<=${h}`) : l.push(`${u} - ${h}`) : l.push(`>=${u}`);
  const c = l.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < d.length ? c : t;
};
const Oc = Qe(), si = ms(), { ANY: As } = si, Fr = ps, ai = Ye, C1 = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Oc(e, r), t = new Oc(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const a of t.set) {
      const o = M1(s, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, D1 = [new si(">=0.0.0-0")], Ic = [new si(">=0.0.0")], M1 = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === As) {
    if (t.length === 1 && t[0].semver === As)
      return !0;
    r.includePrerelease ? e = D1 : e = Ic;
  }
  if (t.length === 1 && t[0].semver === As) {
    if (r.includePrerelease)
      return !0;
    t = Ic;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? s = Tc(s, g, r) : g.operator === "<" || g.operator === "<=" ? a = jc(a, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let o;
  if (s && a) {
    if (o = ai(s.semver, a.semver, r), o > 0)
      return null;
    if (o === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const g of n) {
    if (s && !Fr(g, String(s), r) || a && !Fr(g, String(a), r))
      return null;
    for (const w of t)
      if (!Fr(g, String(w), r))
        return !1;
    return !0;
  }
  let l, c, d, u, h = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, b = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && a.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const g of t) {
    if (u = u || g.operator === ">" || g.operator === ">=", d = d || g.operator === "<" || g.operator === "<=", s) {
      if (b && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === b.major && g.semver.minor === b.minor && g.semver.patch === b.patch && (b = !1), g.operator === ">" || g.operator === ">=") {
        if (l = Tc(s, g, r), l === g && l !== s)
          return !1;
      } else if (s.operator === ">=" && !Fr(s.semver, String(g), r))
        return !1;
    }
    if (a) {
      if (h && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === h.major && g.semver.minor === h.minor && g.semver.patch === h.patch && (h = !1), g.operator === "<" || g.operator === "<=") {
        if (c = jc(a, g, r), c === g && c !== a)
          return !1;
      } else if (a.operator === "<=" && !Fr(a.semver, String(g), r))
        return !1;
    }
    if (!g.operator && (a || s) && o !== 0)
      return !1;
  }
  return !(s && d && !a && o !== 0 || a && u && !s && o !== 0 || b || h);
}, Tc = (e, t, r) => {
  if (!e)
    return t;
  const n = ai(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, jc = (e, t, r) => {
  if (!e)
    return t;
  const n = ai(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var L1 = C1;
const Cs = cn, kc = ds, V1 = je, Ac = Au, F1 = Or, z1 = Jw, U1 = Ww, q1 = Qw, G1 = xw, K1 = rE, H1 = aE, J1 = cE, X1 = dE, B1 = Ye, W1 = pE, Y1 = _E, Q1 = xo, Z1 = EE, x1 = PE, eb = hs, tb = ei, rb = Cu, nb = Du, sb = ti, ab = ri, ob = Mu, ib = BE, cb = ms(), lb = Qe(), ub = ps, db = t1, fb = a1, hb = l1, mb = f1, pb = p1, $b = ni, yb = P1, _b = O1, gb = T1, vb = A1, wb = L1;
var Eb = {
  parse: F1,
  valid: z1,
  clean: U1,
  inc: q1,
  diff: G1,
  major: K1,
  minor: H1,
  patch: J1,
  prerelease: X1,
  compare: B1,
  rcompare: W1,
  compareLoose: Y1,
  compareBuild: Q1,
  sort: Z1,
  rsort: x1,
  gt: eb,
  lt: tb,
  eq: rb,
  neq: nb,
  gte: sb,
  lte: ab,
  cmp: ob,
  coerce: ib,
  Comparator: cb,
  Range: lb,
  satisfies: ub,
  toComparators: db,
  maxSatisfying: fb,
  minSatisfying: hb,
  minVersion: mb,
  validRange: pb,
  outside: $b,
  gtr: yb,
  ltr: _b,
  intersects: gb,
  simplifyRange: vb,
  subset: wb,
  SemVer: V1,
  re: Cs.re,
  src: Cs.src,
  tokens: Cs.t,
  SEMVER_SPEC_VERSION: kc.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: kc.RELEASE_TYPES,
  compareIdentifiers: Ac.compareIdentifiers,
  rcompareIdentifiers: Ac.rcompareIdentifiers
};
const ir = /* @__PURE__ */ Kc(Eb), bb = Object.prototype.toString, Sb = "[object Uint8Array]", Pb = "[object ArrayBuffer]";
function Vu(e, t, r) {
  return e ? e.constructor === t ? !0 : bb.call(e) === r : !1;
}
function Fu(e) {
  return Vu(e, Uint8Array, Sb);
}
function Nb(e) {
  return Vu(e, ArrayBuffer, Pb);
}
function Rb(e) {
  return Fu(e) || Nb(e);
}
function Ob(e) {
  if (!Fu(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function Ib(e) {
  if (!Rb(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Cc(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    Ob(s), r.set(s, n), n += s.length;
  return r;
}
const Rn = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Dc(e, t = "utf8") {
  return Ib(e), Rn[t] ?? (Rn[t] = new globalThis.TextDecoder(t)), Rn[t].decode(e);
}
function Tb(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const jb = new globalThis.TextEncoder();
function Ds(e) {
  return Tb(e), jb.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const kb = Ew.default, Mc = "aes-256-cbc", cr = () => /* @__PURE__ */ Object.create(null), Ab = (e) => e != null, Cb = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Ln = "__internal__", Ms = `${Ln}.migrations.version`;
var St, ot, Le, it;
class Db {
  constructor(t = {}) {
    jr(this, "path");
    jr(this, "events");
    kr(this, St);
    kr(this, ot);
    kr(this, Le);
    kr(this, it, {});
    jr(this, "_deserialize", (t) => JSON.parse(t));
    jr(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
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
      r.cwd = nd(r.projectName, { suffix: r.projectSuffix }).config;
    }
    if (Ar(this, Le, r), r.schema ?? r.ajvOptions ?? r.rootSchema) {
      if (r.schema && typeof r.schema != "object")
        throw new TypeError("The `schema` option must be an object.");
      const o = new l0.Ajv2020({
        allErrors: !0,
        useDefaults: !0,
        ...r.ajvOptions
      });
      kb(o);
      const l = {
        ...r.rootSchema,
        type: "object",
        properties: r.schema
      };
      Ar(this, St, o.compile(l));
      for (const [c, d] of Object.entries(r.schema ?? {}))
        d != null && d.default && (ue(this, it)[c] = d.default);
    }
    r.defaults && Ar(this, it, {
      ...ue(this, it),
      ...r.defaults
    }), r.serialize && (this._serialize = r.serialize), r.deserialize && (this._deserialize = r.deserialize), this.events = new EventTarget(), Ar(this, ot, r.encryptionKey);
    const n = r.fileExtension ? `.${r.fileExtension}` : "";
    this.path = re.resolve(r.cwd, `${r.configName ?? "config"}${n}`);
    const s = this.store, a = Object.assign(cr(), r.defaults, s);
    if (r.migrations) {
      if (!r.projectVersion)
        throw new Error("Please specify the `projectVersion` option.");
      this._migrate(r.migrations, r.projectVersion, r.beforeEachMigration);
    }
    this._validate(a);
    try {
      Wu.deepEqual(s, a);
    } catch {
      this.store = a;
    }
    r.watch && this._watch();
  }
  get(t, r) {
    if (ue(this, Le).accessPropertiesByDotNotation)
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
      throw new TypeError(`Please don't use the ${Ln} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, o) => {
      Cb(a, o), ue(this, Le).accessPropertiesByDotNotation ? li(n, a, o) : n[a] = o;
    };
    if (typeof t == "object") {
      const a = t;
      for (const [o, l] of Object.entries(a))
        s(o, l);
    } else
      s(t, r);
    this.store = n;
  }
  has(t) {
    return ue(this, Le).accessPropertiesByDotNotation ? xu(this.store, t) : t in this.store;
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      Ab(ue(this, it)[r]) && this.set(r, ue(this, it)[r]);
  }
  delete(t) {
    const { store: r } = this;
    ue(this, Le).accessPropertiesByDotNotation ? Zu(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    this.store = cr();
    for (const t of Object.keys(ue(this, it)))
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
      const t = Z.readFileSync(this.path, ue(this, ot) ? null : "utf8"), r = this._encryptData(t), n = this._deserialize(r);
      return this._validate(n), Object.assign(cr(), n);
    } catch (t) {
      if ((t == null ? void 0 : t.code) === "ENOENT")
        return this._ensureDirectory(), cr();
      if (ue(this, Le).clearInvalidConfig && t.name === "SyntaxError")
        return cr();
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
    if (!ue(this, ot))
      return typeof t == "string" ? t : Dc(t);
    try {
      const r = t.slice(0, 16), n = Cr.pbkdf2Sync(ue(this, ot), r.toString(), 1e4, 32, "sha512"), s = Cr.createDecipheriv(Mc, n, r), a = t.slice(17), o = typeof a == "string" ? Ds(a) : a;
      return Dc(Cc([s.update(o), s.final()]));
    } catch {
    }
    return t.toString();
  }
  _handleChange(t, r) {
    let n = t();
    const s = () => {
      const a = n, o = t();
      Bu(o, a) || (n = o, r.call(this, o, a));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(t) {
    if (!ue(this, St) || ue(this, St).call(this, t) || !ue(this, St).errors)
      return;
    const n = ue(this, St).errors.map(({ instancePath: s, message: a = "" }) => `\`${s.slice(1)}\` ${a}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    Z.mkdirSync(re.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    if (ue(this, ot)) {
      const n = Cr.randomBytes(16), s = Cr.pbkdf2Sync(ue(this, ot), n.toString(), 1e4, 32, "sha512"), a = Cr.createCipheriv(Mc, s, n);
      r = Cc([n, Ds(":"), a.update(Ds(r)), a.final()]);
    }
    if (_e.env.SNAP)
      Z.writeFileSync(this.path, r, { mode: ue(this, Le).configFileMode });
    else
      try {
        Gc(this.path, r, { mode: ue(this, Le).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          Z.writeFileSync(this.path, r, { mode: ue(this, Le).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    this._ensureDirectory(), Z.existsSync(this.path) || this._write(cr()), _e.platform === "win32" ? Z.watch(this.path, { persistent: !1 }, mc(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 100 })) : Z.watchFile(this.path, { persistent: !1 }, mc(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 5e3 }));
  }
  _migrate(t, r, n) {
    let s = this._get(Ms, "0.0.0");
    const a = Object.keys(t).filter((l) => this._shouldPerformMigration(l, s, r));
    let o = { ...this.store };
    for (const l of a)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: l,
          finalVersion: r,
          versions: a
        });
        const c = t[l];
        c == null || c(this), this._set(Ms, l), s = l, o = { ...this.store };
      } catch (c) {
        throw this.store = o, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${c}`);
      }
    (this._isVersionInRangeFormat(s) || !ir.eq(s, r)) && this._set(Ms, r);
  }
  _containsReservedKey(t) {
    return typeof t == "object" && Object.keys(t)[0] === Ln ? !0 : typeof t != "string" ? !1 : ue(this, Le).accessPropertiesByDotNotation ? !!t.startsWith(`${Ln}.`) : !1;
  }
  _isVersionInRangeFormat(t) {
    return ir.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && ir.satisfies(r, t) ? !1 : ir.satisfies(n, t) : !(ir.lte(t, r) || ir.gt(t, n));
  }
  _get(t, r) {
    return Qu(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    li(n, t, r), this.store = n;
  }
}
St = new WeakMap(), ot = new WeakMap(), Le = new WeakMap(), it = new WeakMap();
const { app: Vn, ipcMain: ta, shell: Mb } = Fc;
let Lc = !1;
const Vc = () => {
  if (!ta || !Vn)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: Vn.getPath("userData"),
    appVersion: Vn.getVersion()
  };
  return Lc || (ta.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), Lc = !0), e;
};
class Lb extends Db {
  constructor(t) {
    let r, n;
    if (_e.type === "renderer") {
      const s = Fc.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else ta && Vn && ({ defaultCwd: r, appVersion: n } = Vc());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = re.isAbsolute(t.cwd) ? t.cwd : re.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    Vc();
  }
  async openInEditor() {
    const t = await Mb.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const oi = new Lb();
Wn.handle("electron-store-get", (e, t) => oi.get(t));
Wn.handle("electron-store-set", (e, t, r) => {
  oi.set(t, r);
});
Wn.handle("electron-store-delete", (e, t) => {
  oi.delete(t);
});
Wn.on("save-project-backup", (e, t, r) => {
  const n = re.join(xr.getPath("userData"), `${r}.json`);
  try {
    Xu.writeFileSync(n, JSON.stringify(t, null, 2), "utf-8"), console.log("✅ 프로젝트 백업 저장 완료:", n);
  } catch (s) {
    console.error("❌ 프로젝트 백업 저장 실패:", s);
  }
});
Hu(import.meta.url);
const zu = re.dirname(Ju(import.meta.url));
process.env.APP_ROOT = re.join(zu, "..");
const ra = process.env.VITE_DEV_SERVER_URL, xb = re.join(process.env.APP_ROOT, "dist-electron"), Uu = re.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = ra ? re.join(process.env.APP_ROOT, "public") : Uu;
let Et;
function qu() {
  Et = new zc({
    icon: re.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: re.join(zu, "preload.mjs")
    }
  }), Et.webContents.on("did-finish-load", () => {
    Et == null || Et.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), ra ? Et.loadURL(ra) : Et.loadFile(re.join(Uu, "index.html"));
}
xr.on("window-all-closed", () => {
  process.platform !== "darwin" && (xr.quit(), Et = null);
});
xr.on("activate", () => {
  zc.getAllWindows().length === 0 && qu();
});
xr.whenReady().then(qu);
export {
  xb as MAIN_DIST,
  Uu as RENDERER_DIST,
  ra as VITE_DEV_SERVER_URL
};
