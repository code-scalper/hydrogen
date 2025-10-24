var dd = Object.defineProperty;
var pi = (e) => {
  throw TypeError(e);
};
var fd = (e, t, r) => t in e ? dd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Cr = (e, t, r) => fd(e, typeof t != "symbol" ? t + "" : t, r), $i = (e, t, r) => t.has(e) || pi("Cannot " + r);
var he = (e, t, r) => ($i(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Dr = (e, t, r) => t.has(e) ? pi("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Mr = (e, t, r, n) => ($i(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
import Jc, { ipcMain as pt, dialog as hd, app as er, BrowserWindow as xc } from "electron";
import { createRequire as md } from "node:module";
import { fileURLToPath as pd } from "node:url";
import q from "node:path";
import ce from "fs";
import _e from "node:process";
import { promisify as be, isDeepStrictEqual as $d } from "node:util";
import ee from "node:fs";
import Lr from "node:crypto";
import yd from "node:assert";
import ts from "node:os";
import { spawn as gd } from "child_process";
import yi from "path";
import Yc from "zlib";
const tr = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, Ss = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), _d = new Set("0123456789");
function rs(e) {
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
        if (Ss.has(r))
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
          if (Ss.has(r))
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
        if (n === "index" && !_d.has(o))
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        n === "start" && (n = "property"), s && (s = !1, r += "\\"), r += o;
      }
    }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (Ss.has(r))
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
function ho(e, t) {
  if (typeof t != "number" && Array.isArray(e)) {
    const r = Number.parseInt(t, 10);
    return Number.isInteger(r) && e[r] === e[t];
  }
  return !1;
}
function Zc(e, t) {
  if (ho(e, t))
    throw new Error("Cannot use string index");
}
function vd(e, t, r) {
  if (!tr(e) || typeof t != "string")
    return r === void 0 ? e : r;
  const n = rs(t);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const o = n[s];
    if (ho(e, o) ? e = s === n.length - 1 ? void 0 : null : e = e[o], e == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function gi(e, t, r) {
  if (!tr(e) || typeof t != "string")
    return e;
  const n = e, s = rs(t);
  for (let o = 0; o < s.length; o++) {
    const a = s[o];
    Zc(e, a), o === s.length - 1 ? e[a] = r : tr(e[a]) || (e[a] = typeof s[o + 1] == "number" ? [] : {}), e = e[a];
  }
  return n;
}
function wd(e, t) {
  if (!tr(e) || typeof t != "string")
    return !1;
  const r = rs(t);
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (Zc(e, s), n === r.length - 1)
      return delete e[s], !0;
    if (e = e[s], !tr(e))
      return !1;
  }
}
function Ed(e, t) {
  if (!tr(e) || typeof t != "string")
    return !1;
  const r = rs(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!tr(e) || !(n in e) || ho(e, n))
      return !1;
    e = e[n];
  }
  return !0;
}
const Pt = ts.homedir(), mo = ts.tmpdir(), { env: mr } = _e, Sd = (e) => {
  const t = q.join(Pt, "Library");
  return {
    data: q.join(t, "Application Support", e),
    config: q.join(t, "Preferences", e),
    cache: q.join(t, "Caches", e),
    log: q.join(t, "Logs", e),
    temp: q.join(mo, e)
  };
}, bd = (e) => {
  const t = mr.APPDATA || q.join(Pt, "AppData", "Roaming"), r = mr.LOCALAPPDATA || q.join(Pt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: q.join(r, e, "Data"),
    config: q.join(t, e, "Config"),
    cache: q.join(r, e, "Cache"),
    log: q.join(r, e, "Log"),
    temp: q.join(mo, e)
  };
}, Pd = (e) => {
  const t = q.basename(Pt);
  return {
    data: q.join(mr.XDG_DATA_HOME || q.join(Pt, ".local", "share"), e),
    config: q.join(mr.XDG_CONFIG_HOME || q.join(Pt, ".config"), e),
    cache: q.join(mr.XDG_CACHE_HOME || q.join(Pt, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: q.join(mr.XDG_STATE_HOME || q.join(Pt, ".local", "state"), e),
    temp: q.join(mo, t, e)
  };
};
function Nd(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), _e.platform === "darwin" ? Sd(e) : _e.platform === "win32" ? bd(e) : Pd(e);
}
const $t = (e, t) => function(...n) {
  return e.apply(void 0, n).catch(t);
}, at = (e, t) => function(...n) {
  try {
    return e.apply(void 0, n);
  } catch (s) {
    return t(s);
  }
}, Id = _e.getuid ? !_e.getuid() : !1, Rd = 1e4, Le = () => {
}, me = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!me.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !Id && (t === "EINVAL" || t === "EPERM");
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
class Od {
  constructor() {
    this.interval = 25, this.intervalId = void 0, this.limit = Rd, this.queueActive = /* @__PURE__ */ new Set(), this.queueWaiting = /* @__PURE__ */ new Set(), this.init = () => {
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
const Td = new Od(), yt = (e, t) => function(n) {
  return function s(...o) {
    return Td.schedule().then((a) => {
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
}, gt = (e, t) => function(n) {
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
    chmod: $t(be(ee.chmod), me.onChangeError),
    chown: $t(be(ee.chown), me.onChangeError),
    close: $t(be(ee.close), Le),
    fsync: $t(be(ee.fsync), Le),
    mkdir: $t(be(ee.mkdir), Le),
    realpath: $t(be(ee.realpath), Le),
    stat: $t(be(ee.stat), Le),
    unlink: $t(be(ee.unlink), Le),
    /* SYNC */
    chmodSync: at(ee.chmodSync, me.onChangeError),
    chownSync: at(ee.chownSync, me.onChangeError),
    closeSync: at(ee.closeSync, Le),
    existsSync: at(ee.existsSync, Le),
    fsyncSync: at(ee.fsync, Le),
    mkdirSync: at(ee.mkdirSync, Le),
    realpathSync: at(ee.realpathSync, Le),
    statSync: at(ee.statSync, Le),
    unlinkSync: at(ee.unlinkSync, Le)
  },
  retry: {
    /* ASYNC */
    close: yt(be(ee.close), me.isRetriableError),
    fsync: yt(be(ee.fsync), me.isRetriableError),
    open: yt(be(ee.open), me.isRetriableError),
    readFile: yt(be(ee.readFile), me.isRetriableError),
    rename: yt(be(ee.rename), me.isRetriableError),
    stat: yt(be(ee.stat), me.isRetriableError),
    write: yt(be(ee.write), me.isRetriableError),
    writeFile: yt(be(ee.writeFile), me.isRetriableError),
    /* SYNC */
    closeSync: gt(ee.closeSync, me.isRetriableError),
    fsyncSync: gt(ee.fsyncSync, me.isRetriableError),
    openSync: gt(ee.openSync, me.isRetriableError),
    readFileSync: gt(ee.readFileSync, me.isRetriableError),
    renameSync: gt(ee.renameSync, me.isRetriableError),
    statSync: gt(ee.statSync, me.isRetriableError),
    writeSync: gt(ee.writeSync, me.isRetriableError),
    writeFileSync: gt(ee.writeFileSync, me.isRetriableError)
  }
}, jd = "utf8", _i = 438, kd = 511, Ad = {}, Cd = ts.userInfo().uid, Dd = ts.userInfo().gid, Md = 1e3, Ld = !!_e.getuid;
_e.getuid && _e.getuid();
const vi = 128, Vd = (e) => e instanceof Error && "code" in e, wi = (e) => typeof e == "string", bs = (e) => e === void 0, Fd = _e.platform === "linux", Qc = _e.platform === "win32", po = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
Qc || po.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
Fd && po.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
class Ud {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (Qc && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? _e.kill(_e.pid, "SIGTERM") : _e.kill(_e.pid, t));
      }
    }, this.hook = () => {
      _e.once("exit", () => this.exit());
      for (const t of po)
        try {
          _e.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const zd = new Ud(), qd = zd.register, Re = {
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
    const t = q.basename(e);
    if (t.length <= vi)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - vi;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
qd(Re.purgeSyncAll);
function el(e, t, r = Ad) {
  if (wi(r))
    return el(e, t, { encoding: r });
  const n = Date.now() + ((r.timeout ?? Md) || -1);
  let s = null, o = null, a = null;
  try {
    const l = Ie.attempt.realpathSync(e), i = !!l;
    e = l || e, [o, s] = Re.get(e, r.tmpCreate || Re.create, r.tmpPurge !== !1);
    const d = Ld && bs(r.chown), u = bs(r.mode);
    if (i && (d || u)) {
      const h = Ie.attempt.statSync(e);
      h && (r = { ...r }, d && (r.chown = { uid: h.uid, gid: h.gid }), u && (r.mode = h.mode));
    }
    if (!i) {
      const h = q.dirname(e);
      Ie.attempt.mkdirSync(h, {
        mode: kd,
        recursive: !0
      });
    }
    a = Ie.retry.openSync(n)(o, "w", r.mode || _i), r.tmpCreated && r.tmpCreated(o), wi(t) ? Ie.retry.writeSync(n)(a, t, 0, r.encoding || jd) : bs(t) || Ie.retry.writeSync(n)(a, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Ie.retry.fsyncSync(n)(a) : Ie.attempt.fsync(a)), Ie.retry.closeSync(n)(a), a = null, r.chown && (r.chown.uid !== Cd || r.chown.gid !== Dd) && Ie.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== _i && Ie.attempt.chmodSync(o, r.mode);
    try {
      Ie.retry.renameSync(n)(o, e);
    } catch (h) {
      if (!Vd(h) || h.code !== "ENAMETOOLONG")
        throw h;
      Ie.retry.renameSync(n)(o, Re.truncate(e));
    }
    s(), o = null;
  } finally {
    a && Ie.attempt.closeSync(a), o && Re.purge(o);
  }
}
function tl(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Hs = { exports: {} }, rl = {}, Je = {}, _r = {}, sn = {}, x = {}, rn = {};
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
    const P = [_(m[0])];
    let I = 0;
    for (; I < w.length; )
      P.push(o), l(P, w[I]), P.push(o, _(m[++I]));
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
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : _(Array.isArray(m) ? m.join(",") : m);
  }
  function E(m) {
    return new n(_(m));
  }
  e.stringify = E;
  function _(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = _;
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
})(rn);
var Bs = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = rn;
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
      const E = this.toName(d), { prefix: _ } = E, v = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let y = this._values[_];
      if (y) {
        const w = y.get(v);
        if (w)
          return w;
      } else
        y = this._values[_] = /* @__PURE__ */ new Map();
      y.set(v, E);
      const $ = this._scope[_] || (this._scope[_] = []), m = $.length;
      return $[m] = u.ref, E.setValue(u, { property: _, itemIndex: m }), E;
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
      let _ = t.nil;
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
            _ = (0, t._)`${_}${P} ${m} = ${w};${this.opts._n}`;
          } else if (w = E == null ? void 0 : E(m))
            _ = (0, t._)`${_}${w}${this.opts._n}`;
          else
            throw new r(m);
          $.set(m, n.Completed);
        });
      }
      return _;
    }
  }
  e.ValueScope = l;
})(Bs);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = rn, r = Bs;
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
  var s = Bs;
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
      return se(c, this.rhs);
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
  class _ extends o {
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
      return this.nodes.reduce((c, f) => z(c, f.names), {});
    }
  }
  class v extends _ {
    render(c) {
      return "{" + c._n + super.render(c) + "}" + c._n;
    }
  }
  class y extends _ {
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
        return c === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(F(c), f instanceof m ? [f] : f.nodes);
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
      return se(c, this.condition), this.else && z(c, this.else.names), c;
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
      return z(super.names, this.iteration.names);
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
      const c = se(super.names, this.from);
      return se(c, this.to);
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
      return z(super.names, this.iterable.names);
    }
  }
  class V extends v {
    constructor(c, f, S) {
      super(), this.name = c, this.args = f, this.async = S;
    }
    render(c) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(c);
    }
  }
  V.kind = "func";
  class W extends _ {
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
      return this.catch && z(c, this.catch.names), this.finally && z(c, this.finally.names), c;
    }
  }
  class ie extends v {
    constructor(c) {
      super(), this.error = c;
    }
    render(c) {
      return `catch(${this.error})` + super.render(c);
    }
  }
  ie.kind = "catch";
  class ae extends v {
    render(c) {
      return "finally" + super.render(c);
    }
  }
  ae.kind = "finally";
  class C {
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
        return this.forRange("_i", 0, (0, t._)`${G}.length`, (U) => {
          this.var(j, (0, t._)`${G}[${U}]`), S(j);
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
        this._currNode = T.catch = new ie(j), f(j);
      }
      return S && (this._currNode = T.finally = new ae(), this.code(S)), this._endBlockNode(ie, ae);
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
      return this._blockNode(new V(c, f, S)), T && this.code(T).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(V);
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
  e.CodeGen = C;
  function z(g, c) {
    for (const f in c)
      g[f] = (g[f] || 0) + (c[f] || 0);
    return g;
  }
  function se(g, c) {
    return c instanceof t._CodeOrName ? z(g, c.names) : g;
  }
  function O(g, c, f) {
    if (g instanceof t.Name)
      return S(g);
    if (!T(g))
      return g;
    return new t._Code(g._items.reduce((j, G) => (G instanceof t.Name && (G = S(G)), G instanceof t._Code ? j.push(...G._items) : j.push(G), j), []));
    function S(j) {
      const G = f[j.str];
      return G === void 0 || c[j.str] !== 1 ? j : (delete c[j.str], G);
    }
    function T(j) {
      return j instanceof t._Code && j._items.some((G) => G instanceof t.Name && c[G.str] === 1 && f[G.str] !== void 0);
    }
  }
  function k(g, c) {
    for (const f in c)
      g[f] = (g[f] || 0) - (c[f] || 0);
  }
  function F(g) {
    return typeof g == "boolean" || typeof g == "number" || g === null ? !g : (0, t._)`!${b(g)}`;
  }
  e.not = F;
  const D = p(e.operators.AND);
  function K(...g) {
    return g.reduce(D);
  }
  e.and = K;
  const M = p(e.operators.OR);
  function N(...g) {
    return g.reduce(M);
  }
  e.or = N;
  function p(g) {
    return (c, f) => c === t.nil ? f : f === t.nil ? c : (0, t._)`${b(c)} ${g} ${b(f)}`;
  }
  function b(g) {
    return g instanceof t.Name ? g : (0, t._)`(${g})`;
  }
})(x);
var A = {};
Object.defineProperty(A, "__esModule", { value: !0 });
A.checkStrictMode = A.getErrorPath = A.Type = A.useFunc = A.setEvaluated = A.evaluatedPropsToName = A.mergeEvaluated = A.eachItem = A.unescapeJsonPointer = A.escapeJsonPointer = A.escapeFragment = A.unescapeFragment = A.schemaRefOrVal = A.schemaHasRulesButRef = A.schemaHasRules = A.checkUnknownRules = A.alwaysValidSchema = A.toHash = void 0;
const le = x, Gd = rn;
function Kd(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
A.toHash = Kd;
function Hd(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (nl(e, t), !sl(t, e.self.RULES.all));
}
A.alwaysValidSchema = Hd;
function nl(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const o in t)
    s[o] || il(e, `unknown keyword: "${o}"`);
}
A.checkUnknownRules = nl;
function sl(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
A.schemaHasRules = sl;
function Bd(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
A.schemaHasRulesButRef = Bd;
function Wd({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, le._)`${r}`;
  }
  return (0, le._)`${e}${t}${(0, le.getProperty)(n)}`;
}
A.schemaRefOrVal = Wd;
function Xd(e) {
  return ol(decodeURIComponent(e));
}
A.unescapeFragment = Xd;
function Jd(e) {
  return encodeURIComponent($o(e));
}
A.escapeFragment = Jd;
function $o(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
A.escapeJsonPointer = $o;
function ol(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
A.unescapeJsonPointer = ol;
function xd(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
A.eachItem = xd;
function Ei({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, o, a, l) => {
    const i = a === void 0 ? o : a instanceof le.Name ? (o instanceof le.Name ? e(s, o, a) : t(s, o, a), a) : o instanceof le.Name ? (t(s, a, o), o) : r(o, a);
    return l === le.Name && !(i instanceof le.Name) ? n(s, i) : i;
  };
}
A.mergeEvaluated = {
  props: Ei({
    mergeNames: (e, t, r) => e.if((0, le._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, le._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, le._)`${r} || {}`).code((0, le._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, le._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, le._)`${r} || {}`), yo(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: al
  }),
  items: Ei({
    mergeNames: (e, t, r) => e.if((0, le._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, le._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, le._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, le._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function al(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, le._)`{}`);
  return t !== void 0 && yo(e, r, t), r;
}
A.evaluatedPropsToName = al;
function yo(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, le._)`${t}${(0, le.getProperty)(n)}`, !0));
}
A.setEvaluated = yo;
const Si = {};
function Yd(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Si[t.code] || (Si[t.code] = new Gd._Code(t.code))
  });
}
A.useFunc = Yd;
var Ws;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Ws || (A.Type = Ws = {}));
function Zd(e, t, r) {
  if (e instanceof le.Name) {
    const n = t === Ws.Num;
    return r ? n ? (0, le._)`"[" + ${e} + "]"` : (0, le._)`"['" + ${e} + "']"` : n ? (0, le._)`"/" + ${e}` : (0, le._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, le.getProperty)(e).toString() : "/" + $o(e);
}
A.getErrorPath = Zd;
function il(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
A.checkStrictMode = il;
var Fe = {};
Object.defineProperty(Fe, "__esModule", { value: !0 });
const Pe = x, Qd = {
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
Fe.default = Qd;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = x, r = A, n = Fe;
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: m }) => m ? (0, t.str)`"${$}" keyword must be ${m} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, m = e.keywordError, w, P) {
    const { it: I } = $, { gen: R, compositeRule: V, allErrors: W } = I, Y = h($, m, w);
    P ?? (V || W) ? i(R, Y) : d(I, (0, t._)`[${Y}]`);
  }
  e.reportError = s;
  function o($, m = e.keywordError, w) {
    const { it: P } = $, { gen: I, compositeRule: R, allErrors: V } = P, W = h($, m, w);
    i(I, W), R || V || d(P, n.default.vErrors);
  }
  e.reportExtraError = o;
  function a($, m) {
    $.assign(n.default.errors, m), $.if((0, t._)`${n.default.vErrors} !== null`, () => $.if(m, () => $.assign((0, t._)`${n.default.vErrors}.length`, m), () => $.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function l({ gen: $, keyword: m, schemaValue: w, data: P, errsCount: I, it: R }) {
    if (I === void 0)
      throw new Error("ajv implementation error");
    const V = $.name("err");
    $.forRange("i", I, n.default.errors, (W) => {
      $.const(V, (0, t._)`${n.default.vErrors}[${W}]`), $.if((0, t._)`${V}.instancePath === undefined`, () => $.assign((0, t._)`${V}.instancePath`, (0, t.strConcat)(n.default.instancePath, R.errorPath))), $.assign((0, t._)`${V}.schemaPath`, (0, t.str)`${R.errSchemaPath}/${m}`), R.opts.verbose && ($.assign((0, t._)`${V}.schema`, w), $.assign((0, t._)`${V}.data`, P));
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
      _(I, w),
      v($, w)
    ];
    return y($, m, R), P.object(...R);
  }
  function _({ errorPath: $ }, { instancePath: m }) {
    const w = m ? (0, t.str)`${$}${(0, r.getErrorPath)(m, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, w)];
  }
  function v({ keyword: $, it: { errSchemaPath: m } }, { schemaPath: w, parentSchema: P }) {
    let I = P ? m : (0, t.str)`${m}/${$}`;
    return w && (I = (0, t.str)`${I}${(0, r.getErrorPath)(w, r.Type.Str)}`), [u.schemaPath, I];
  }
  function y($, { params: m, message: w }, P) {
    const { keyword: I, data: R, schemaValue: V, it: W } = $, { opts: Y, propertyName: ie, topSchemaRef: ae, schemaPath: C } = W;
    P.push([u.keyword, I], [u.params, typeof m == "function" ? m($) : m || (0, t._)`{}`]), Y.messages && P.push([u.message, typeof w == "function" ? w($) : w]), Y.verbose && P.push([u.schema, V], [u.parentSchema, (0, t._)`${ae}${C}`], [n.default.data, R]), ie && P.push([u.propertyName, ie]);
  }
})(sn);
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.boolOrEmptySchema = _r.topBoolOrEmptySchema = void 0;
const ef = sn, tf = x, rf = Fe, nf = {
  message: "boolean schema is false"
};
function sf(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? cl(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(rf.default.data) : (t.assign((0, tf._)`${n}.errors`, null), t.return(!0));
}
_r.topBoolOrEmptySchema = sf;
function of(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), cl(e)) : r.var(t, !0);
}
_r.boolOrEmptySchema = of;
function cl(e, t) {
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
  (0, ef.reportError)(s, nf, void 0, t);
}
var ye = {}, rr = {};
Object.defineProperty(rr, "__esModule", { value: !0 });
rr.getRules = rr.isJSONType = void 0;
const af = ["string", "number", "integer", "boolean", "null", "object", "array"], cf = new Set(af);
function lf(e) {
  return typeof e == "string" && cf.has(e);
}
rr.isJSONType = lf;
function uf() {
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
rr.getRules = uf;
var lt = {};
Object.defineProperty(lt, "__esModule", { value: !0 });
lt.shouldUseRule = lt.shouldUseGroup = lt.schemaHasRulesForType = void 0;
function df({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && ll(e, n);
}
lt.schemaHasRulesForType = df;
function ll(e, t) {
  return t.rules.some((r) => ul(e, r));
}
lt.shouldUseGroup = ll;
function ul(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
lt.shouldUseRule = ul;
Object.defineProperty(ye, "__esModule", { value: !0 });
ye.reportTypeError = ye.checkDataTypes = ye.checkDataType = ye.coerceAndCheckDataType = ye.getJSONTypes = ye.getSchemaTypes = ye.DataType = void 0;
const ff = rr, hf = lt, mf = sn, Z = x, dl = A;
var pr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(pr || (ye.DataType = pr = {}));
function pf(e) {
  const t = fl(e.type);
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
ye.getSchemaTypes = pf;
function fl(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(ff.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ye.getJSONTypes = fl;
function $f(e, t) {
  const { gen: r, data: n, opts: s } = e, o = yf(t, s.coerceTypes), a = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, hf.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const l = go(t, n, s.strictNumbers, pr.Wrong);
    r.if(l, () => {
      o.length ? gf(e, t, o) : _o(e);
    });
  }
  return a;
}
ye.coerceAndCheckDataType = $f;
const hl = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function yf(e, t) {
  return t ? e.filter((r) => hl.has(r) || t === "array" && r === "array") : [];
}
function gf(e, t, r) {
  const { gen: n, data: s, opts: o } = e, a = n.let("dataType", (0, Z._)`typeof ${s}`), l = n.let("coerced", (0, Z._)`undefined`);
  o.coerceTypes === "array" && n.if((0, Z._)`${a} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, Z._)`${s}[0]`).assign(a, (0, Z._)`typeof ${s}`).if(go(t, s, o.strictNumbers), () => n.assign(l, s))), n.if((0, Z._)`${l} !== undefined`);
  for (const d of r)
    (hl.has(d) || d === "array" && o.coerceTypes === "array") && i(d);
  n.else(), _o(e), n.endIf(), n.if((0, Z._)`${l} !== undefined`, () => {
    n.assign(s, l), _f(e, l);
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
function _f({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, Z._)`${t} !== undefined`, () => e.assign((0, Z._)`${t}[${r}]`, n));
}
function Xs(e, t, r, n = pr.Correct) {
  const s = n === pr.Correct ? Z.operators.EQ : Z.operators.NEQ;
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
  return n === pr.Correct ? o : (0, Z.not)(o);
  function a(l = Z.nil) {
    return (0, Z.and)((0, Z._)`typeof ${t} == "number"`, l, r ? (0, Z._)`isFinite(${t})` : Z.nil);
  }
}
ye.checkDataType = Xs;
function go(e, t, r, n) {
  if (e.length === 1)
    return Xs(e[0], t, r, n);
  let s;
  const o = (0, dl.toHash)(e);
  if (o.array && o.object) {
    const a = (0, Z._)`typeof ${t} != "object"`;
    s = o.null ? a : (0, Z._)`!${t} || ${a}`, delete o.null, delete o.array, delete o.object;
  } else
    s = Z.nil;
  o.number && delete o.integer;
  for (const a in o)
    s = (0, Z.and)(s, Xs(a, t, r, n));
  return s;
}
ye.checkDataTypes = go;
const vf = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, Z._)`{type: ${e}}` : (0, Z._)`{type: ${t}}`
};
function _o(e) {
  const t = wf(e);
  (0, mf.reportError)(t, vf);
}
ye.reportTypeError = _o;
function wf(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, dl.schemaRefOrVal)(e, n, "type");
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
var ns = {};
Object.defineProperty(ns, "__esModule", { value: !0 });
ns.assignDefaults = void 0;
const or = x, Ef = A;
function Sf(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      bi(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, o) => bi(e, o, s.default));
}
ns.assignDefaults = Sf;
function bi(e, t, r) {
  const { gen: n, compositeRule: s, data: o, opts: a } = e;
  if (r === void 0)
    return;
  const l = (0, or._)`${o}${(0, or.getProperty)(t)}`;
  if (s) {
    (0, Ef.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let i = (0, or._)`${l} === undefined`;
  a.useDefaults === "empty" && (i = (0, or._)`${i} || ${l} === null || ${l} === ""`), n.if(i, (0, or._)`${l} = ${(0, or.stringify)(r)}`);
}
var rt = {}, re = {};
Object.defineProperty(re, "__esModule", { value: !0 });
re.validateUnion = re.validateArray = re.usePattern = re.callValidateCode = re.schemaProperties = re.allSchemaProperties = re.noPropertyInData = re.propertyInData = re.isOwnProperty = re.hasPropFunc = re.reportMissingProp = re.checkMissingProp = re.checkReportMissingProp = void 0;
const de = x, vo = A, _t = Fe, bf = A;
function Pf(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Eo(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, de._)`${t}` }, !0), e.error();
  });
}
re.checkReportMissingProp = Pf;
function Nf({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, de.or)(...n.map((o) => (0, de.and)(Eo(e, t, o, r.ownProperties), (0, de._)`${s} = ${o}`)));
}
re.checkMissingProp = Nf;
function If(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
re.reportMissingProp = If;
function ml(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, de._)`Object.prototype.hasOwnProperty`
  });
}
re.hasPropFunc = ml;
function wo(e, t, r) {
  return (0, de._)`${ml(e)}.call(${t}, ${r})`;
}
re.isOwnProperty = wo;
function Rf(e, t, r, n) {
  const s = (0, de._)`${t}${(0, de.getProperty)(r)} !== undefined`;
  return n ? (0, de._)`${s} && ${wo(e, t, r)}` : s;
}
re.propertyInData = Rf;
function Eo(e, t, r, n) {
  const s = (0, de._)`${t}${(0, de.getProperty)(r)} === undefined`;
  return n ? (0, de.or)(s, (0, de.not)(wo(e, t, r))) : s;
}
re.noPropertyInData = Eo;
function pl(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
re.allSchemaProperties = pl;
function Of(e, t) {
  return pl(t).filter((r) => !(0, vo.alwaysValidSchema)(e, t[r]));
}
re.schemaProperties = Of;
function Tf({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: o }, it: a }, l, i, d) {
  const u = d ? (0, de._)`${e}, ${t}, ${n}${s}` : t, h = [
    [_t.default.instancePath, (0, de.strConcat)(_t.default.instancePath, o)],
    [_t.default.parentData, a.parentData],
    [_t.default.parentDataProperty, a.parentDataProperty],
    [_t.default.rootData, _t.default.rootData]
  ];
  a.opts.dynamicRef && h.push([_t.default.dynamicAnchors, _t.default.dynamicAnchors]);
  const E = (0, de._)`${u}, ${r.object(...h)}`;
  return i !== de.nil ? (0, de._)`${l}.call(${i}, ${E})` : (0, de._)`${l}(${E})`;
}
re.callValidateCode = Tf;
const jf = (0, de._)`new RegExp`;
function kf({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, o = s(r, n);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, de._)`${s.code === "new RegExp" ? jf : (0, bf.useFunc)(e, s)}(${r}, ${n})`
  });
}
re.usePattern = kf;
function Af(e) {
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
        dataPropType: vo.Type.Num
      }, o), t.if((0, de.not)(o), l);
    });
  }
}
re.validateArray = Af;
function Cf(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((i) => (0, vo.alwaysValidSchema)(s, i)) && !s.opts.unevaluated)
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
re.validateUnion = Cf;
Object.defineProperty(rt, "__esModule", { value: !0 });
rt.validateKeywordUsage = rt.validSchemaType = rt.funcKeywordCode = rt.macroKeywordCode = void 0;
const Oe = x, Wt = Fe, Df = re, Mf = sn;
function Lf(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: o, it: a } = e, l = t.macro.call(a.self, s, o, a), i = $l(r, n, l);
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
rt.macroKeywordCode = Lf;
function Vf(e, t) {
  var r;
  const { gen: n, keyword: s, schema: o, parentSchema: a, $data: l, it: i } = e;
  Uf(i, t);
  const d = !l && t.compile ? t.compile.call(i.self, o, a, i) : t.validate, u = $l(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      y(), t.modifying && Pi(e), $(() => e.error());
    else {
      const m = t.async ? _() : v();
      t.modifying && Pi(e), $(() => Ff(e, m));
    }
  }
  function _() {
    const m = n.let("ruleErrs", null);
    return n.try(() => y((0, Oe._)`await `), (w) => n.assign(h, !1).if((0, Oe._)`${w} instanceof ${i.ValidationError}`, () => n.assign(m, (0, Oe._)`${w}.errors`), () => n.throw(w))), m;
  }
  function v() {
    const m = (0, Oe._)`${u}.errors`;
    return n.assign(m, null), y(Oe.nil), m;
  }
  function y(m = t.async ? (0, Oe._)`await ` : Oe.nil) {
    const w = i.opts.passContext ? Wt.default.this : Wt.default.self, P = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, Oe._)`${m}${(0, Df.callValidateCode)(e, u, w, P)}`, t.modifying);
  }
  function $(m) {
    var w;
    n.if((0, Oe.not)((w = t.valid) !== null && w !== void 0 ? w : h), m);
  }
}
rt.funcKeywordCode = Vf;
function Pi(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Oe._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Ff(e, t) {
  const { gen: r } = e;
  r.if((0, Oe._)`Array.isArray(${t})`, () => {
    r.assign(Wt.default.vErrors, (0, Oe._)`${Wt.default.vErrors} === null ? ${t} : ${Wt.default.vErrors}.concat(${t})`).assign(Wt.default.errors, (0, Oe._)`${Wt.default.vErrors}.length`), (0, Mf.extendErrors)(e);
  }, () => e.error());
}
function Uf({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function $l(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Oe.stringify)(r) });
}
function zf(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
rt.validSchemaType = zf;
function qf({ schema: e, opts: t, self: r, errSchemaPath: n }, s, o) {
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
rt.validateKeywordUsage = qf;
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.extendSubschemaMode = Ot.extendSubschemaData = Ot.getSubschema = void 0;
const et = x, yl = A;
function Gf(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: o, topSchemaRef: a }) {
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
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, yl.escapeFragment)(r)}`
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
Ot.getSubschema = Gf;
function Kf(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: o, propertyName: a }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, E = l.let("data", (0, et._)`${t.data}${(0, et.getProperty)(r)}`, !0);
    i(E), e.errorPath = (0, et.str)`${d}${(0, yl.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, et._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof et.Name ? s : l.let("data", s, !0);
    i(d), a !== void 0 && (e.propertyName = a);
  }
  o && (e.dataTypes = o);
  function i(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Ot.extendSubschemaData = Kf;
function Hf(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: o }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Ot.extendSubschemaMode = Hf;
var Ee = {}, ss = function e(t, r) {
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
}, gl = { exports: {} }, It = gl.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  jn(t, n, s, e, "", e);
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
function jn(e, t, r, n, s, o, a, l, i, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, o, a, l, i, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in It.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            jn(e, t, r, h[E], s + "/" + u + "/" + E, o, s, u, n, E);
      } else if (u in It.propsKeywords) {
        if (h && typeof h == "object")
          for (var _ in h)
            jn(e, t, r, h[_], s + "/" + u + "/" + Bf(_), o, s, u, n, _);
      } else (u in It.keywords || e.allKeys && !(u in It.skipKeywords)) && jn(e, t, r, h, s + "/" + u, o, s, u, n);
    }
    r(n, s, o, a, l, i, d);
  }
}
function Bf(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Wf = gl.exports;
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.getSchemaRefs = Ee.resolveUrl = Ee.normalizeId = Ee._getFullPath = Ee.getFullPath = Ee.inlineRef = void 0;
const Xf = A, Jf = ss, xf = Wf, Yf = /* @__PURE__ */ new Set([
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
function Zf(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Js(e) : t ? _l(e) <= t : !1;
}
Ee.inlineRef = Zf;
const Qf = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Js(e) {
  for (const t in e) {
    if (Qf.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Js) || typeof r == "object" && Js(r))
      return !0;
  }
  return !1;
}
function _l(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Yf.has(r) && (typeof e[r] == "object" && (0, Xf.eachItem)(e[r], (n) => t += _l(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function vl(e, t = "", r) {
  r !== !1 && (t = $r(t));
  const n = e.parse(t);
  return wl(e, n);
}
Ee.getFullPath = vl;
function wl(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ee._getFullPath = wl;
const eh = /#\/?$/;
function $r(e) {
  return e ? e.replace(eh, "") : "";
}
Ee.normalizeId = $r;
function th(e, t, r) {
  return r = $r(r), e.resolve(t, r);
}
Ee.resolveUrl = th;
const rh = /^[a-z_][-a-z0-9._]*$/i;
function nh(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = $r(e[r] || t), o = { "": s }, a = vl(n, s, !1), l = {}, i = /* @__PURE__ */ new Set();
  return xf(e, { allKeys: !0 }, (h, E, _, v) => {
    if (v === void 0)
      return;
    const y = a + E;
    let $ = o[v];
    typeof h[r] == "string" && ($ = m.call(this, h[r])), w.call(this, h.$anchor), w.call(this, h.$dynamicAnchor), o[E] = $;
    function m(P) {
      const I = this.opts.uriResolver.resolve;
      if (P = $r($ ? I($, P) : P), i.has(P))
        throw u(P);
      i.add(P);
      let R = this.refs[P];
      return typeof R == "string" && (R = this.refs[R]), typeof R == "object" ? d(h, R.schema, P) : P !== $r(y) && (P[0] === "#" ? (d(h, l[P], P), l[P] = h) : this.refs[P] = y), P;
    }
    function w(P) {
      if (typeof P == "string") {
        if (!rh.test(P))
          throw new Error(`invalid anchor "${P}"`);
        m.call(this, `#${P}`);
      }
    }
  }), l;
  function d(h, E, _) {
    if (E !== void 0 && !Jf(h, E))
      throw u(_);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ee.getSchemaRefs = nh;
Object.defineProperty(Je, "__esModule", { value: !0 });
Je.getData = Je.KeywordCxt = Je.validateFunctionCode = void 0;
const El = _r, Ni = ye, So = lt, Gn = ye, sh = ns, Br = rt, Ps = Ot, H = x, X = Fe, oh = Ee, ut = A, Vr = sn;
function ah(e) {
  if (Pl(e) && (Nl(e), bl(e))) {
    lh(e);
    return;
  }
  Sl(e, () => (0, El.topBoolOrEmptySchema)(e));
}
Je.validateFunctionCode = ah;
function Sl({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, o) {
  s.code.es5 ? e.func(t, (0, H._)`${X.default.data}, ${X.default.valCxt}`, n.$async, () => {
    e.code((0, H._)`"use strict"; ${Ii(r, s)}`), ch(e, s), e.code(o);
  }) : e.func(t, (0, H._)`${X.default.data}, ${ih(s)}`, n.$async, () => e.code(Ii(r, s)).code(o));
}
function ih(e) {
  return (0, H._)`{${X.default.instancePath}="", ${X.default.parentData}, ${X.default.parentDataProperty}, ${X.default.rootData}=${X.default.data}${e.dynamicRef ? (0, H._)`, ${X.default.dynamicAnchors}={}` : H.nil}}={}`;
}
function ch(e, t) {
  e.if(X.default.valCxt, () => {
    e.var(X.default.instancePath, (0, H._)`${X.default.valCxt}.${X.default.instancePath}`), e.var(X.default.parentData, (0, H._)`${X.default.valCxt}.${X.default.parentData}`), e.var(X.default.parentDataProperty, (0, H._)`${X.default.valCxt}.${X.default.parentDataProperty}`), e.var(X.default.rootData, (0, H._)`${X.default.valCxt}.${X.default.rootData}`), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, H._)`${X.default.valCxt}.${X.default.dynamicAnchors}`);
  }, () => {
    e.var(X.default.instancePath, (0, H._)`""`), e.var(X.default.parentData, (0, H._)`undefined`), e.var(X.default.parentDataProperty, (0, H._)`undefined`), e.var(X.default.rootData, X.default.data), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, H._)`{}`);
  });
}
function lh(e) {
  const { schema: t, opts: r, gen: n } = e;
  Sl(e, () => {
    r.$comment && t.$comment && Rl(e), mh(e), n.let(X.default.vErrors, null), n.let(X.default.errors, 0), r.unevaluated && uh(e), Il(e), yh(e);
  });
}
function uh(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, H._)`${r}.evaluated`), t.if((0, H._)`${e.evaluated}.dynamicProps`, () => t.assign((0, H._)`${e.evaluated}.props`, (0, H._)`undefined`)), t.if((0, H._)`${e.evaluated}.dynamicItems`, () => t.assign((0, H._)`${e.evaluated}.items`, (0, H._)`undefined`));
}
function Ii(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, H._)`/*# sourceURL=${r} */` : H.nil;
}
function dh(e, t) {
  if (Pl(e) && (Nl(e), bl(e))) {
    fh(e, t);
    return;
  }
  (0, El.boolOrEmptySchema)(e, t);
}
function bl({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Pl(e) {
  return typeof e.schema != "boolean";
}
function fh(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Rl(e), ph(e), $h(e);
  const o = n.const("_errs", X.default.errors);
  Il(e, o), n.var(t, (0, H._)`${o} === ${X.default.errors}`);
}
function Nl(e) {
  (0, ut.checkUnknownRules)(e), hh(e);
}
function Il(e, t) {
  if (e.opts.jtd)
    return Ri(e, [], !1, t);
  const r = (0, Ni.getSchemaTypes)(e.schema), n = (0, Ni.coerceAndCheckDataType)(e, r);
  Ri(e, r, !n, t);
}
function hh(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, ut.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function mh(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, ut.checkStrictMode)(e, "default is ignored in the schema root");
}
function ph(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, oh.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function $h(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Rl({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const o = r.$comment;
  if (s.$comment === !0)
    e.code((0, H._)`${X.default.self}.logger.log(${o})`);
  else if (typeof s.$comment == "function") {
    const a = (0, H.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, H._)`${X.default.self}.opts.$comment(${o}, ${a}, ${l}.schema)`);
  }
}
function yh(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: o } = e;
  r.$async ? t.if((0, H._)`${X.default.errors} === 0`, () => t.return(X.default.data), () => t.throw((0, H._)`new ${s}(${X.default.vErrors})`)) : (t.assign((0, H._)`${n}.errors`, X.default.vErrors), o.unevaluated && gh(e), t.return((0, H._)`${X.default.errors} === 0`));
}
function gh({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof H.Name && e.assign((0, H._)`${t}.props`, r), n instanceof H.Name && e.assign((0, H._)`${t}.items`, n);
}
function Ri(e, t, r, n) {
  const { gen: s, schema: o, data: a, allErrors: l, opts: i, self: d } = e, { RULES: u } = d;
  if (o.$ref && (i.ignoreKeywordsWithRef || !(0, ut.schemaHasRulesButRef)(o, u))) {
    s.block(() => jl(e, "$ref", u.all.$ref.definition));
    return;
  }
  i.jtd || _h(e, t), s.block(() => {
    for (const E of u.rules)
      h(E);
    h(u.post);
  });
  function h(E) {
    (0, So.shouldUseGroup)(o, E) && (E.type ? (s.if((0, Gn.checkDataType)(E.type, a, i.strictNumbers)), Oi(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, Gn.reportTypeError)(e)), s.endIf()) : Oi(e, E), l || s.if((0, H._)`${X.default.errors} === ${n || 0}`));
  }
}
function Oi(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, sh.assignDefaults)(e, t.type), r.block(() => {
    for (const o of t.rules)
      (0, So.shouldUseRule)(n, o) && jl(e, o.keyword, o.definition, t.type);
  });
}
function _h(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (vh(e, t), e.opts.allowUnionTypes || wh(e, t), Eh(e, e.dataTypes));
}
function vh(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Ol(e.dataTypes, r) || bo(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), bh(e, t);
  }
}
function wh(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && bo(e, "use allowUnionTypes to allow union type keyword");
}
function Eh(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, So.shouldUseRule)(e.schema, s)) {
      const { type: o } = s.definition;
      o.length && !o.some((a) => Sh(t, a)) && bo(e, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function Sh(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Ol(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function bh(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Ol(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function bo(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, ut.checkStrictMode)(e, t, e.opts.strictTypes);
}
let Tl = class {
  constructor(t, r, n) {
    if ((0, Br.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, ut.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", kl(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Br.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
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
        return (0, H._)`${(0, Gn.checkDataTypes)(i, r, o.opts.strictNumbers, Gn.DataType.Wrong)}`;
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
    const n = (0, Ps.getSubschema)(this.it, t);
    (0, Ps.extendSubschemaData)(n, this.it, t), (0, Ps.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return dh(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = ut.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = ut.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, H.Name)), !0;
  }
};
Je.KeywordCxt = Tl;
function jl(e, t, r, n) {
  const s = new Tl(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Br.funcKeywordCode)(s, r) : "macro" in r ? (0, Br.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Br.funcKeywordCode)(s, r);
}
const Ph = /^\/(?:[^~]|~0|~1)*$/, Nh = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function kl(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, o;
  if (e === "")
    return X.default.rootData;
  if (e[0] === "/") {
    if (!Ph.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, o = X.default.rootData;
  } else {
    const d = Nh.exec(e);
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
    d && (o = (0, H._)`${o}${(0, H.getProperty)((0, ut.unescapeJsonPointer)(d))}`, a = (0, H._)`${a} && ${o}`);
  return a;
  function i(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
Je.getData = kl;
var on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
let Ih = class extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
};
on.default = Ih;
var Sr = {};
Object.defineProperty(Sr, "__esModule", { value: !0 });
const Ns = Ee;
let Rh = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Ns.resolveUrl)(t, r, n), this.missingSchema = (0, Ns.normalizeId)((0, Ns.getFullPath)(t, this.missingRef));
  }
};
Sr.default = Rh;
var je = {};
Object.defineProperty(je, "__esModule", { value: !0 });
je.resolveSchema = je.getCompilingSchema = je.resolveRef = je.compileSchema = je.SchemaEnv = void 0;
const Ge = x, Oh = on, Ht = Fe, We = Ee, Ti = A, Th = Je;
let os = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, We.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
je.SchemaEnv = os;
function Po(e) {
  const t = Al.call(this, e);
  if (t)
    return t;
  const r = (0, We.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: o } = this.opts, a = new Ge.CodeGen(this.scope, { es5: n, lines: s, ownProperties: o });
  let l;
  e.$async && (l = a.scopeValue("Error", {
    ref: Oh.default,
    code: (0, Ge._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const i = a.scopeName("validate");
  e.validateName = i;
  const d = {
    gen: a,
    allErrors: this.opts.allErrors,
    data: Ht.default.data,
    parentData: Ht.default.parentData,
    parentDataProperty: Ht.default.parentDataProperty,
    dataNames: [Ht.default.data],
    dataPathArr: [Ge.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: a.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Ge.stringify)(e.schema) } : { ref: e.schema }),
    validateName: i,
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
    this._compilations.add(e), (0, Th.validateFunctionCode)(d), a.optimize(this.opts.code.optimize);
    const h = a.toString();
    u = `${a.scopeRefs(Ht.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const _ = new Function(`${Ht.default.self}`, `${Ht.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(i, { ref: _ }), _.errors = null, _.schema = e.schema, _.schemaEnv = e, e.$async && (_.$async = !0), this.opts.code.source === !0 && (_.source = { validateName: i, validateCode: h, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: v, items: y } = d;
      _.evaluated = {
        props: v instanceof Ge.Name ? void 0 : v,
        items: y instanceof Ge.Name ? void 0 : y,
        dynamicProps: v instanceof Ge.Name,
        dynamicItems: y instanceof Ge.Name
      }, _.source && (_.source.evaluated = (0, Ge.stringify)(_.evaluated));
    }
    return e.validate = _, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
je.compileSchema = Po;
function jh(e, t, r) {
  var n;
  r = (0, We.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let o = Ch.call(this, e, r);
  if (o === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    a && (o = new os({ schema: a, schemaId: l, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[r] = kh.call(this, o);
}
je.resolveRef = jh;
function kh(e) {
  return (0, We.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Po.call(this, e);
}
function Al(e) {
  for (const t of this._compilations)
    if (Ah(t, e))
      return t;
}
je.getCompilingSchema = Al;
function Ah(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Ch(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || as.call(this, e, t);
}
function as(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, We._getFullPath)(this.opts.uriResolver, r);
  let s = (0, We.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Is.call(this, r, e);
  const o = (0, We.normalizeId)(n), a = this.refs[o] || this.schemas[o];
  if (typeof a == "string") {
    const l = as.call(this, e, a);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : Is.call(this, r, l);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || Po.call(this, a), o === (0, We.normalizeId)(t)) {
      const { schema: l } = a, { schemaId: i } = this.opts, d = l[i];
      return d && (s = (0, We.resolveUrl)(this.opts.uriResolver, s, d)), new os({ schema: l, schemaId: i, root: e, baseId: s });
    }
    return Is.call(this, r, a);
  }
}
je.resolveSchema = as;
const Dh = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Is(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const i = r[(0, Ti.unescapeFragment)(l)];
    if (i === void 0)
      return;
    r = i;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !Dh.has(l) && d && (t = (0, We.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let o;
  if (typeof r != "boolean" && r.$ref && !(0, Ti.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, We.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    o = as.call(this, n, l);
  }
  const { schemaId: a } = this.opts;
  if (o = o || new os({ schema: r, schemaId: a, root: n, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const Mh = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Lh = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Vh = "object", Fh = [
  "$data"
], Uh = {
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
}, zh = !1, qh = {
  $id: Mh,
  description: Lh,
  type: Vh,
  required: Fh,
  properties: Uh,
  additionalProperties: zh
};
var No = {}, is = { exports: {} };
const Gh = {
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
var Kh = {
  HEX: Gh
};
const { HEX: Hh } = Kh, Bh = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
function Cl(e) {
  if (Ml(e, ".") < 3)
    return { host: e, isIPV4: !1 };
  const t = e.match(Bh) || [], [r] = t;
  return r ? { host: Xh(r, "."), isIPV4: !0 } : { host: e, isIPV4: !1 };
}
function ji(e, t = !1) {
  let r = "", n = !0;
  for (const s of e) {
    if (Hh[s] === void 0) return;
    s !== "0" && n === !0 && (n = !1), n || (r += s);
  }
  return t && r.length === 0 && (r = "0"), r;
}
function Wh(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let o = !1, a = !1, l = !1;
  function i() {
    if (s.length) {
      if (o === !1) {
        const d = ji(s);
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
  return s.length && (o ? r.zone = s.join("") : l ? n.push(s.join("")) : n.push(ji(s))), r.address = n.join(""), r;
}
function Dl(e) {
  if (Ml(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = Wh(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, escapedHost: n, isIPV6: !0 };
  }
}
function Xh(e, t) {
  let r = "", n = !0;
  const s = e.length;
  for (let o = 0; o < s; o++) {
    const a = e[o];
    a === "0" && n ? (o + 1 <= s && e[o + 1] === t || o + 1 === s) && (r += a, n = !1) : (a === t ? n = !0 : n = !1, r += a);
  }
  return r;
}
function Ml(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
const ki = /^\.\.?\//u, Ai = /^\/\.(?:\/|$)/u, Ci = /^\/\.\.(?:\/|$)/u, Jh = /^\/?(?:.|\n)*?(?=\/|$)/u;
function xh(e) {
  const t = [];
  for (; e.length; )
    if (e.match(ki))
      e = e.replace(ki, "");
    else if (e.match(Ai))
      e = e.replace(Ai, "/");
    else if (e.match(Ci))
      e = e.replace(Ci, "/"), t.pop();
    else if (e === "." || e === "..")
      e = "";
    else {
      const r = e.match(Jh);
      if (r) {
        const n = r[0];
        e = e.slice(n.length), t.push(n);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return t.join("");
}
function Yh(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function Zh(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    const n = Cl(r);
    if (n.isIPV4)
      r = n.host;
    else {
      const s = Dl(n.host);
      s.isIPV6 === !0 ? r = `[${s.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var Qh = {
  recomposeAuthority: Zh,
  normalizeComponentEncoding: Yh,
  removeDotSegments: xh,
  normalizeIPv4: Cl,
  normalizeIPv6: Dl
};
const em = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, tm = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Ll(e) {
  return typeof e.secure == "boolean" ? e.secure : String(e.scheme).toLowerCase() === "wss";
}
function Vl(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function Fl(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function rm(e) {
  return e.secure = Ll(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function nm(e) {
  if ((e.port === (Ll(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function sm(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(tm);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, o = Io[s];
    e.path = void 0, o && (e = o.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function om(e, t) {
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, o = Io[s];
  o && (e = o.serialize(e, t));
  const a = e, l = e.nss;
  return a.path = `${n || t.nid}:${l}`, t.skipEscape = !0, a;
}
function am(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !em.test(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function im(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const Ul = {
  scheme: "http",
  domainHost: !0,
  parse: Vl,
  serialize: Fl
}, cm = {
  scheme: "https",
  domainHost: Ul.domainHost,
  parse: Vl,
  serialize: Fl
}, kn = {
  scheme: "ws",
  domainHost: !0,
  parse: rm,
  serialize: nm
}, lm = {
  scheme: "wss",
  domainHost: kn.domainHost,
  parse: kn.parse,
  serialize: kn.serialize
}, um = {
  scheme: "urn",
  parse: sm,
  serialize: om,
  skipNormalize: !0
}, dm = {
  scheme: "urn:uuid",
  parse: am,
  serialize: im,
  skipNormalize: !0
}, Io = {
  http: Ul,
  https: cm,
  ws: kn,
  wss: lm,
  urn: um,
  "urn:uuid": dm
};
var fm = Io;
const { normalizeIPv6: hm, normalizeIPv4: mm, removeDotSegments: Gr, recomposeAuthority: pm, normalizeComponentEncoding: hn } = Qh, Ro = fm;
function $m(e, t) {
  return typeof e == "string" ? e = nt(ht(e, t), t) : typeof e == "object" && (e = ht(nt(e, t), t)), e;
}
function ym(e, t, r) {
  const n = Object.assign({ scheme: "null" }, r), s = zl(ht(e, n), ht(t, n), n, !0);
  return nt(s, { ...n, skipEscape: !0 });
}
function zl(e, t, r, n) {
  const s = {};
  return n || (e = ht(nt(e, r), r), t = ht(nt(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Gr(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Gr(t.path || ""), s.query = t.query) : (t.path ? (t.path.charAt(0) === "/" ? s.path = Gr(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = Gr(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function gm(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = nt(hn(ht(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = nt(hn(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = nt(hn(ht(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = nt(hn(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
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
  }, n = Object.assign({}, t), s = [], o = Ro[(n.scheme || r.scheme || "").toLowerCase()];
  o && o.serialize && o.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const a = pm(r);
  if (a !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(a), r.path && r.path.charAt(0) !== "/" && s.push("/")), r.path !== void 0) {
    let l = r.path;
    !n.absolutePath && (!o || !o.absolutePath) && (l = Gr(l)), a === void 0 && (l = l.replace(/^\/\//u, "/%2F")), s.push(l);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const _m = Array.from({ length: 127 }, (e, t) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(t)));
function vm(e) {
  let t = 0;
  for (let r = 0, n = e.length; r < n; ++r)
    if (t = e.charCodeAt(r), t > 126 || _m[t])
      return !0;
  return !1;
}
const wm = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
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
  const a = e.match(wm);
  if (a) {
    if (n.scheme = a[1], n.userinfo = a[3], n.host = a[4], n.port = parseInt(a[5], 10), n.path = a[6] || "", n.query = a[7], n.fragment = a[8], isNaN(n.port) && (n.port = a[5]), n.host) {
      const i = mm(n.host);
      if (i.isIPV4 === !1) {
        const d = hm(i.host);
        n.host = d.host.toLowerCase(), o = d.isIPV6;
      } else
        n.host = i.host, o = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const l = Ro[(r.scheme || n.scheme || "").toLowerCase()];
    if (!r.unicodeSupport && (!l || !l.unicodeSupport) && n.host && (r.domainHost || l && l.domainHost) && o === !1 && vm(n.host))
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
const Oo = {
  SCHEMES: Ro,
  normalize: $m,
  resolve: ym,
  resolveComponents: zl,
  equal: gm,
  serialize: nt,
  parse: ht
};
is.exports = Oo;
is.exports.default = Oo;
is.exports.fastUri = Oo;
var ql = is.exports;
Object.defineProperty(No, "__esModule", { value: !0 });
const Gl = ql;
Gl.code = 'require("ajv/dist/runtime/uri").default';
No.default = Gl;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Je;
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
  const n = on, s = Sr, o = rr, a = je, l = x, i = Ee, d = ye, u = A, h = qh, E = No, _ = (N, p) => new RegExp(N, p);
  _.code = "new RegExp";
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
    var p, b, g, c, f, S, T, j, G, U, oe, Me, jt, kt, At, Ct, Dt, Mt, Lt, Vt, Ft, Ut, zt, qt, Gt;
    const qe = N.strict, Kt = (p = N.code) === null || p === void 0 ? void 0 : p.optimize, kr = Kt === !0 || Kt === void 0 ? 1 : Kt || 0, Ar = (g = (b = N.code) === null || b === void 0 ? void 0 : b.regExp) !== null && g !== void 0 ? g : _, Es = (c = N.uriResolver) !== null && c !== void 0 ? c : E.default;
    return {
      strictSchema: (S = (f = N.strictSchema) !== null && f !== void 0 ? f : qe) !== null && S !== void 0 ? S : !0,
      strictNumbers: (j = (T = N.strictNumbers) !== null && T !== void 0 ? T : qe) !== null && j !== void 0 ? j : !0,
      strictTypes: (U = (G = N.strictTypes) !== null && G !== void 0 ? G : qe) !== null && U !== void 0 ? U : "log",
      strictTuples: (Me = (oe = N.strictTuples) !== null && oe !== void 0 ? oe : qe) !== null && Me !== void 0 ? Me : "log",
      strictRequired: (kt = (jt = N.strictRequired) !== null && jt !== void 0 ? jt : qe) !== null && kt !== void 0 ? kt : !1,
      code: N.code ? { ...N.code, optimize: kr, regExp: Ar } : { optimize: kr, regExp: Ar },
      loopRequired: (At = N.loopRequired) !== null && At !== void 0 ? At : w,
      loopEnum: (Ct = N.loopEnum) !== null && Ct !== void 0 ? Ct : w,
      meta: (Dt = N.meta) !== null && Dt !== void 0 ? Dt : !0,
      messages: (Mt = N.messages) !== null && Mt !== void 0 ? Mt : !0,
      inlineRefs: (Lt = N.inlineRefs) !== null && Lt !== void 0 ? Lt : !0,
      schemaId: (Vt = N.schemaId) !== null && Vt !== void 0 ? Vt : "$id",
      addUsedSchema: (Ft = N.addUsedSchema) !== null && Ft !== void 0 ? Ft : !0,
      validateSchema: (Ut = N.validateSchema) !== null && Ut !== void 0 ? Ut : !0,
      validateFormats: (zt = N.validateFormats) !== null && zt !== void 0 ? zt : !0,
      unicodeRegExp: (qt = N.unicodeRegExp) !== null && qt !== void 0 ? qt : !0,
      int32range: (Gt = N.int32range) !== null && Gt !== void 0 ? Gt : !0,
      uriResolver: Es
    };
  }
  class I {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...P(p) };
      const { es5: b, lines: g } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: y, es5: b, lines: g }), this.logger = z(p.logger);
      const c = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, o.getRules)(), R.call(this, $, p, "NOT SUPPORTED"), R.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ae.call(this), p.formats && Y.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && ie.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), W.call(this), p.validateFormats = c;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: b, schemaId: g } = this.opts;
      let c = h;
      g === "id" && (c = { ...h }, c.id = c.$id, delete c.$id), b && p && this.addMetaSchema(c, c[g], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: b } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[b] || p : void 0;
    }
    validate(p, b) {
      let g;
      if (typeof p == "string") {
        if (g = this.getSchema(p), !g)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        g = this.compile(p);
      const c = g(b);
      return "$async" in g || (this.errors = g.errors), c;
    }
    compile(p, b) {
      const g = this._addSchema(p, b);
      return g.validate || this._compileSchemaEnv(g);
    }
    compileAsync(p, b) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: g } = this.opts;
      return c.call(this, p, b);
      async function c(U, oe) {
        await f.call(this, U.$schema);
        const Me = this._addSchema(U, oe);
        return Me.validate || S.call(this, Me);
      }
      async function f(U) {
        U && !this.getSchema(U) && await c.call(this, { $ref: U }, !0);
      }
      async function S(U) {
        try {
          return this._compileSchemaEnv(U);
        } catch (oe) {
          if (!(oe instanceof s.default))
            throw oe;
          return T.call(this, oe), await j.call(this, oe.missingSchema), S.call(this, U);
        }
      }
      function T({ missingSchema: U, missingRef: oe }) {
        if (this.refs[U])
          throw new Error(`AnySchema ${U} is loaded but ${oe} cannot be resolved`);
      }
      async function j(U) {
        const oe = await G.call(this, U);
        this.refs[U] || await f.call(this, oe.$schema), this.refs[U] || this.addSchema(oe, U, b);
      }
      async function G(U) {
        const oe = this._loading[U];
        if (oe)
          return oe;
        try {
          return await (this._loading[U] = g(U));
        } finally {
          delete this._loading[U];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, b, g, c = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const S of p)
          this.addSchema(S, void 0, g, c);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: S } = this.opts;
        if (f = p[S], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return b = (0, i.normalizeId)(b || f), this._checkUnique(b), this.schemas[b] = this._addSchema(p, g, b, c, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, b, g = this.opts.validateSchema) {
      return this.addSchema(p, b, !0, g), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, b) {
      if (typeof p == "boolean")
        return !0;
      let g;
      if (g = p.$schema, g !== void 0 && typeof g != "string")
        throw new Error("$schema must be a string");
      if (g = g || this.opts.defaultMeta || this.defaultMeta(), !g)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const c = this.validate(g, p);
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
      for (; typeof (b = V.call(this, p)) == "string"; )
        p = b;
      if (b === void 0) {
        const { schemaId: g } = this.opts, c = new a.SchemaEnv({ schema: {}, schemaId: g });
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
          const b = V.call(this, p);
          return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const b = p;
          this._cache.delete(b);
          let g = p[this.opts.schemaId];
          return g && (g = (0, i.normalizeId)(g), delete this.schemas[g], delete this.refs[g]), this;
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
      let g;
      if (typeof p == "string")
        g = p, typeof b == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), b.keyword = g);
      else if (typeof p == "object" && b === void 0) {
        if (b = p, g = b.keyword, Array.isArray(g) && !g.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (O.call(this, g, b), !b)
        return (0, u.eachItem)(g, (f) => k.call(this, f)), this;
      D.call(this, b);
      const c = {
        ...b,
        type: (0, d.getJSONTypes)(b.type),
        schemaType: (0, d.getJSONTypes)(b.schemaType)
      };
      return (0, u.eachItem)(g, c.type.length === 0 ? (f) => k.call(this, f, c) : (f) => c.type.forEach((S) => k.call(this, f, c, S))), this;
    }
    getKeyword(p) {
      const b = this.RULES.all[p];
      return typeof b == "object" ? b.definition : !!b;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: b } = this;
      delete b.keywords[p], delete b.all[p];
      for (const g of b.rules) {
        const c = g.rules.findIndex((f) => f.keyword === p);
        c >= 0 && g.rules.splice(c, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, b) {
      return typeof b == "string" && (b = new RegExp(b)), this.formats[p] = b, this;
    }
    errorsText(p = this.errors, { separator: b = ", ", dataVar: g = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((c) => `${g}${c.instancePath} ${c.message}`).reduce((c, f) => c + b + f);
    }
    $dataMetaSchema(p, b) {
      const g = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const c of b) {
        const f = c.split("/").slice(1);
        let S = p;
        for (const T of f)
          S = S[T];
        for (const T in g) {
          const j = g[T];
          if (typeof j != "object")
            continue;
          const { $data: G } = j.definition, U = S[T];
          G && U && (S[T] = M(U));
        }
      }
      return p;
    }
    _removeAllSchemas(p, b) {
      for (const g in p) {
        const c = p[g];
        (!b || b.test(g)) && (typeof c == "string" ? delete p[g] : c && !c.meta && (this._cache.delete(c.schema), delete p[g]));
      }
    }
    _addSchema(p, b, g, c = this.opts.validateSchema, f = this.opts.addUsedSchema) {
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
      g = (0, i.normalizeId)(S || g);
      const G = i.getSchemaRefs.call(this, p, g);
      return j = new a.SchemaEnv({ schema: p, schemaId: T, meta: b, baseId: g, localRefs: G }), this._cache.set(j.schema, j), f && !g.startsWith("#") && (g && this._checkUnique(g), this.refs[g] = j), c && this.validateSchema(p, !0), j;
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
  function R(N, p, b, g = "error") {
    for (const c in N) {
      const f = c;
      f in p && this.logger[g](`${b}: option ${c}. ${N[f]}`);
    }
  }
  function V(N) {
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
  function ie(N) {
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
  function ae() {
    const N = { ...this.opts };
    for (const p of v)
      delete N[p];
    return N;
  }
  const C = { log() {
  }, warn() {
  }, error() {
  } };
  function z(N) {
    if (N === !1)
      return C;
    if (N === void 0)
      return console;
    if (N.log && N.warn && N.error)
      return N;
    throw new Error("logger must implement log, warn and error methods");
  }
  const se = /^[a-z_$][a-z0-9_$:-]*$/i;
  function O(N, p) {
    const { RULES: b } = this;
    if ((0, u.eachItem)(N, (g) => {
      if (b.keywords[g])
        throw new Error(`Keyword ${g} is already defined`);
      if (!se.test(g))
        throw new Error(`Keyword ${g} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(N, p, b) {
    var g;
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
    p.before ? F.call(this, S, T, p.before) : S.rules.push(T), f.all[N] = T, (g = p.implements) === null || g === void 0 || g.forEach((j) => this.addKeyword(j));
  }
  function F(N, p, b) {
    const g = N.rules.findIndex((c) => c.keyword === b);
    g >= 0 ? N.rules.splice(g, 0, p) : (N.rules.push(p), this.logger.warn(`rule ${b} is not defined`));
  }
  function D(N) {
    let { metaSchema: p } = N;
    p !== void 0 && (N.$data && this.opts.$data && (p = M(p)), N.validateSchema = this.compile(p, !0));
  }
  const K = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function M(N) {
    return { anyOf: [N, K] };
  }
})(rl);
var To = {}, jo = {}, ko = {};
Object.defineProperty(ko, "__esModule", { value: !0 });
const Em = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
ko.default = Em;
var mt = {};
Object.defineProperty(mt, "__esModule", { value: !0 });
mt.callRef = mt.getValidate = void 0;
const Sm = Sr, Di = re, Ae = x, ar = Fe, Mi = je, mn = A, bm = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: o, validateName: a, opts: l, self: i } = n, { root: d } = o;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = Mi.resolveRef.call(i, d, s, r);
    if (u === void 0)
      throw new Sm.default(n.opts.uriResolver, s, r);
    if (u instanceof Mi.SchemaEnv)
      return E(u);
    return _(u);
    function h() {
      if (o === d)
        return An(e, a, o, o.$async);
      const v = t.scopeValue("root", { ref: d });
      return An(e, (0, Ae._)`${v}.validate`, d, d.$async);
    }
    function E(v) {
      const y = Kl(e, v);
      An(e, y, v, v.$async);
    }
    function _(v) {
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
function Kl(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ae._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
mt.getValidate = Kl;
function An(e, t, r, n) {
  const { gen: s, it: o } = e, { allErrors: a, schemaEnv: l, opts: i } = o, d = i.passContext ? ar.default.this : Ae.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, Ae._)`await ${(0, Di.callValidateCode)(e, t, d)}`), _(t), a || s.assign(v, !0);
    }, (y) => {
      s.if((0, Ae._)`!(${y} instanceof ${o.ValidationError})`, () => s.throw(y)), E(y), a || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, Di.callValidateCode)(e, t, d), () => _(t), () => E(t));
  }
  function E(v) {
    const y = (0, Ae._)`${v}.errors`;
    s.assign(ar.default.vErrors, (0, Ae._)`${ar.default.vErrors} === null ? ${y} : ${ar.default.vErrors}.concat(${y})`), s.assign(ar.default.errors, (0, Ae._)`${ar.default.vErrors}.length`);
  }
  function _(v) {
    var y;
    if (!o.opts.unevaluated)
      return;
    const $ = (y = r == null ? void 0 : r.validate) === null || y === void 0 ? void 0 : y.evaluated;
    if (o.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (o.props = mn.mergeEvaluated.props(s, $.props, o.props));
      else {
        const m = s.var("props", (0, Ae._)`${v}.evaluated.props`);
        o.props = mn.mergeEvaluated.props(s, m, o.props, Ae.Name);
      }
    if (o.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (o.items = mn.mergeEvaluated.items(s, $.items, o.items));
      else {
        const m = s.var("items", (0, Ae._)`${v}.evaluated.items`);
        o.items = mn.mergeEvaluated.items(s, m, o.items, Ae.Name);
      }
  }
}
mt.callRef = An;
mt.default = bm;
Object.defineProperty(jo, "__esModule", { value: !0 });
const Pm = ko, Nm = mt, Im = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  Pm.default,
  Nm.default
];
jo.default = Im;
var Ao = {}, Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
const Kn = x, vt = Kn.operators, Hn = {
  maximum: { okStr: "<=", ok: vt.LTE, fail: vt.GT },
  minimum: { okStr: ">=", ok: vt.GTE, fail: vt.LT },
  exclusiveMaximum: { okStr: "<", ok: vt.LT, fail: vt.GTE },
  exclusiveMinimum: { okStr: ">", ok: vt.GT, fail: vt.LTE }
}, Rm = {
  message: ({ keyword: e, schemaCode: t }) => (0, Kn.str)`must be ${Hn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Kn._)`{comparison: ${Hn[e].okStr}, limit: ${t}}`
}, Om = {
  keyword: Object.keys(Hn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Rm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Kn._)`${r} ${Hn[t].fail} ${n} || isNaN(${r})`);
  }
};
Co.default = Om;
var Do = {};
Object.defineProperty(Do, "__esModule", { value: !0 });
const Wr = x, Tm = {
  message: ({ schemaCode: e }) => (0, Wr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Wr._)`{multipleOf: ${e}}`
}, jm = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Tm,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, o = s.opts.multipleOfPrecision, a = t.let("res"), l = o ? (0, Wr._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, Wr._)`${a} !== parseInt(${a})`;
    e.fail$data((0, Wr._)`(${n} === 0 || (${a} = ${r}/${n}, ${l}))`);
  }
};
Do.default = jm;
var Mo = {}, Lo = {};
Object.defineProperty(Lo, "__esModule", { value: !0 });
function Hl(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Lo.default = Hl;
Hl.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Mo, "__esModule", { value: !0 });
const Xt = x, km = A, Am = Lo, Cm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Xt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Xt._)`{limit: ${e}}`
}, Dm = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Cm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, o = t === "maxLength" ? Xt.operators.GT : Xt.operators.LT, a = s.opts.unicode === !1 ? (0, Xt._)`${r}.length` : (0, Xt._)`${(0, km.useFunc)(e.gen, Am.default)}(${r})`;
    e.fail$data((0, Xt._)`${a} ${o} ${n}`);
  }
};
Mo.default = Dm;
var Vo = {};
Object.defineProperty(Vo, "__esModule", { value: !0 });
const Mm = re, Bn = x, Lm = {
  message: ({ schemaCode: e }) => (0, Bn.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Bn._)`{pattern: ${e}}`
}, Vm = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Lm,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: o } = e, a = o.opts.unicodeRegExp ? "u" : "", l = r ? (0, Bn._)`(new RegExp(${s}, ${a}))` : (0, Mm.usePattern)(e, n);
    e.fail$data((0, Bn._)`!${l}.test(${t})`);
  }
};
Vo.default = Vm;
var Fo = {};
Object.defineProperty(Fo, "__esModule", { value: !0 });
const Xr = x, Fm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Xr.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Xr._)`{limit: ${e}}`
}, Um = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Fm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Xr.operators.GT : Xr.operators.LT;
    e.fail$data((0, Xr._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Fo.default = Um;
var Uo = {};
Object.defineProperty(Uo, "__esModule", { value: !0 });
const Fr = re, Jr = x, zm = A, qm = {
  message: ({ params: { missingProperty: e } }) => (0, Jr.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Jr._)`{missingProperty: ${e}}`
}, Gm = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: qm,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: o, it: a } = e, { opts: l } = a;
    if (!o && r.length === 0)
      return;
    const i = r.length >= l.loopRequired;
    if (a.allErrors ? d() : u(), l.strictRequired) {
      const _ = e.parentSchema.properties, { definedProperties: v } = e.it;
      for (const y of r)
        if ((_ == null ? void 0 : _[y]) === void 0 && !v.has(y)) {
          const $ = a.schemaEnv.baseId + a.errSchemaPath, m = `required property "${y}" is not defined at "${$}" (strictRequired)`;
          (0, zm.checkStrictMode)(a, m, a.opts.strictRequired);
        }
    }
    function d() {
      if (i || o)
        e.block$data(Jr.nil, h);
      else
        for (const _ of r)
          (0, Fr.checkReportMissingProp)(e, _);
    }
    function u() {
      const _ = t.let("missing");
      if (i || o) {
        const v = t.let("valid", !0);
        e.block$data(v, () => E(_, v)), e.ok(v);
      } else
        t.if((0, Fr.checkMissingProp)(e, r, _)), (0, Fr.reportMissingProp)(e, _), t.else();
    }
    function h() {
      t.forOf("prop", n, (_) => {
        e.setParams({ missingProperty: _ }), t.if((0, Fr.noPropertyInData)(t, s, _, l.ownProperties), () => e.error());
      });
    }
    function E(_, v) {
      e.setParams({ missingProperty: _ }), t.forOf(_, n, () => {
        t.assign(v, (0, Fr.propertyInData)(t, s, _, l.ownProperties)), t.if((0, Jr.not)(v), () => {
          e.error(), t.break();
        });
      }, Jr.nil);
    }
  }
};
Uo.default = Gm;
var zo = {};
Object.defineProperty(zo, "__esModule", { value: !0 });
const xr = x, Km = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, xr.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, xr._)`{limit: ${e}}`
}, Hm = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Km,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? xr.operators.GT : xr.operators.LT;
    e.fail$data((0, xr._)`${r}.length ${s} ${n}`);
  }
};
zo.default = Hm;
var qo = {}, an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
const Bl = ss;
Bl.code = 'require("ajv/dist/runtime/equal").default';
an.default = Bl;
Object.defineProperty(qo, "__esModule", { value: !0 });
const Rs = ye, ve = x, Bm = A, Wm = an, Xm = {
  message: ({ params: { i: e, j: t } }) => (0, ve.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, ve._)`{i: ${e}, j: ${t}}`
}, Jm = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Xm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: o, schemaCode: a, it: l } = e;
    if (!n && !s)
      return;
    const i = t.let("valid"), d = o.items ? (0, Rs.getSchemaTypes)(o.items) : [];
    e.block$data(i, u, (0, ve._)`${a} === false`), e.ok(i);
    function u() {
      const v = t.let("i", (0, ve._)`${r}.length`), y = t.let("j");
      e.setParams({ i: v, j: y }), t.assign(i, !0), t.if((0, ve._)`${v} > 1`, () => (h() ? E : _)(v, y));
    }
    function h() {
      return d.length > 0 && !d.some((v) => v === "object" || v === "array");
    }
    function E(v, y) {
      const $ = t.name("item"), m = (0, Rs.checkDataTypes)(d, $, l.opts.strictNumbers, Rs.DataType.Wrong), w = t.const("indices", (0, ve._)`{}`);
      t.for((0, ve._)`;${v}--;`, () => {
        t.let($, (0, ve._)`${r}[${v}]`), t.if(m, (0, ve._)`continue`), d.length > 1 && t.if((0, ve._)`typeof ${$} == "string"`, (0, ve._)`${$} += "_"`), t.if((0, ve._)`typeof ${w}[${$}] == "number"`, () => {
          t.assign(y, (0, ve._)`${w}[${$}]`), e.error(), t.assign(i, !1).break();
        }).code((0, ve._)`${w}[${$}] = ${v}`);
      });
    }
    function _(v, y) {
      const $ = (0, Bm.useFunc)(t, Wm.default), m = t.name("outer");
      t.label(m).for((0, ve._)`;${v}--;`, () => t.for((0, ve._)`${y} = ${v}; ${y}--;`, () => t.if((0, ve._)`${$}(${r}[${v}], ${r}[${y}])`, () => {
        e.error(), t.assign(i, !1).break(m);
      })));
    }
  }
};
qo.default = Jm;
var Go = {};
Object.defineProperty(Go, "__esModule", { value: !0 });
const xs = x, xm = A, Ym = an, Zm = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, xs._)`{allowedValue: ${e}}`
}, Qm = {
  keyword: "const",
  $data: !0,
  error: Zm,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: o } = e;
    n || o && typeof o == "object" ? e.fail$data((0, xs._)`!${(0, xm.useFunc)(t, Ym.default)}(${r}, ${s})`) : e.fail((0, xs._)`${o} !== ${r}`);
  }
};
Go.default = Qm;
var Ko = {};
Object.defineProperty(Ko, "__esModule", { value: !0 });
const Kr = x, ep = A, tp = an, rp = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Kr._)`{allowedValues: ${e}}`
}, np = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: rp,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= a.opts.loopEnum;
    let i;
    const d = () => i ?? (i = (0, ep.useFunc)(t, tp.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const _ = t.const("vSchema", o);
      u = (0, Kr.or)(...s.map((v, y) => E(_, y)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", o, (_) => t.if((0, Kr._)`${d()}(${r}, ${_})`, () => t.assign(u, !0).break()));
    }
    function E(_, v) {
      const y = s[v];
      return typeof y == "object" && y !== null ? (0, Kr._)`${d()}(${r}, ${_}[${v}])` : (0, Kr._)`${r} === ${y}`;
    }
  }
};
Ko.default = np;
Object.defineProperty(Ao, "__esModule", { value: !0 });
const sp = Co, op = Do, ap = Mo, ip = Vo, cp = Fo, lp = Uo, up = zo, dp = qo, fp = Go, hp = Ko, mp = [
  // number
  sp.default,
  op.default,
  // string
  ap.default,
  ip.default,
  // object
  cp.default,
  lp.default,
  // array
  up.default,
  dp.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  fp.default,
  hp.default
];
Ao.default = mp;
var Ho = {}, br = {};
Object.defineProperty(br, "__esModule", { value: !0 });
br.validateAdditionalItems = void 0;
const Jt = x, Ys = A, pp = {
  message: ({ params: { len: e } }) => (0, Jt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Jt._)`{limit: ${e}}`
}, $p = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: pp,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Ys.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Wl(e, n);
  }
};
function Wl(e, t) {
  const { gen: r, schema: n, data: s, keyword: o, it: a } = e;
  a.items = !0;
  const l = r.const("len", (0, Jt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Jt._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Ys.alwaysValidSchema)(a, n)) {
    const d = r.var("valid", (0, Jt._)`${l} <= ${t.length}`);
    r.if((0, Jt.not)(d), () => i(d)), e.ok(d);
  }
  function i(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: o, dataProp: u, dataPropType: Ys.Type.Num }, d), a.allErrors || r.if((0, Jt.not)(d), () => r.break());
    });
  }
}
br.validateAdditionalItems = Wl;
br.default = $p;
var Bo = {}, Pr = {};
Object.defineProperty(Pr, "__esModule", { value: !0 });
Pr.validateTuple = void 0;
const Li = x, Cn = A, yp = re, gp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Xl(e, "additionalItems", t);
    r.items = !0, !(0, Cn.alwaysValidSchema)(r, t) && e.ok((0, yp.validateArray)(e));
  }
};
function Xl(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: o, keyword: a, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = Cn.mergeEvaluated.items(n, r.length, l.items));
  const i = n.name("valid"), d = n.const("len", (0, Li._)`${o}.length`);
  r.forEach((h, E) => {
    (0, Cn.alwaysValidSchema)(l, h) || (n.if((0, Li._)`${d} > ${E}`, () => e.subschema({
      keyword: a,
      schemaProp: E,
      dataProp: E
    }, i)), e.ok(i));
  });
  function u(h) {
    const { opts: E, errSchemaPath: _ } = l, v = r.length, y = v === h.minItems && (v === h.maxItems || h[t] === !1);
    if (E.strictTuples && !y) {
      const $ = `"${a}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${_}"`;
      (0, Cn.checkStrictMode)(l, $, E.strictTuples);
    }
  }
}
Pr.validateTuple = Xl;
Pr.default = gp;
Object.defineProperty(Bo, "__esModule", { value: !0 });
const _p = Pr, vp = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, _p.validateTuple)(e, "items")
};
Bo.default = vp;
var Wo = {};
Object.defineProperty(Wo, "__esModule", { value: !0 });
const Vi = x, wp = A, Ep = re, Sp = br, bp = {
  message: ({ params: { len: e } }) => (0, Vi.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Vi._)`{limit: ${e}}`
}, Pp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: bp,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, wp.alwaysValidSchema)(n, t) && (s ? (0, Sp.validateAdditionalItems)(e, s) : e.ok((0, Ep.validateArray)(e)));
  }
};
Wo.default = Pp;
var Xo = {};
Object.defineProperty(Xo, "__esModule", { value: !0 });
const Ue = x, pn = A, Np = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ue.str)`must contain at least ${e} valid item(s)` : (0, Ue.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ue._)`{minContains: ${e}}` : (0, Ue._)`{minContains: ${e}, maxContains: ${t}}`
}, Ip = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Np,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    let a, l;
    const { minContains: i, maxContains: d } = n;
    o.opts.next ? (a = i === void 0 ? 1 : i, l = d) : a = 1;
    const u = t.const("len", (0, Ue._)`${s}.length`);
    if (e.setParams({ min: a, max: l }), l === void 0 && a === 0) {
      (0, pn.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && a > l) {
      (0, pn.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, pn.alwaysValidSchema)(o, r)) {
      let y = (0, Ue._)`${u} >= ${a}`;
      l !== void 0 && (y = (0, Ue._)`${y} && ${u} <= ${l}`), e.pass(y);
      return;
    }
    o.items = !0;
    const h = t.name("valid");
    l === void 0 && a === 1 ? _(h, () => t.if(h, () => t.break())) : a === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, Ue._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const y = t.name("_valid"), $ = t.let("count", 0);
      _(y, () => t.if(y, () => v($)));
    }
    function _(y, $) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: pn.Type.Num,
          compositeRule: !0
        }, y), $();
      });
    }
    function v(y) {
      t.code((0, Ue._)`${y}++`), l === void 0 ? t.if((0, Ue._)`${y} >= ${a}`, () => t.assign(h, !0).break()) : (t.if((0, Ue._)`${y} > ${l}`, () => t.assign(h, !1).break()), a === 1 ? t.assign(h, !0) : t.if((0, Ue._)`${y} >= ${a}`, () => t.assign(h, !0)));
    }
  }
};
Xo.default = Ip;
var cs = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = x, r = A, n = re;
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
    const _ = u.let("missing");
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
      }) : (u.if((0, t._)`${$} && (${(0, n.checkMissingProp)(i, y, _)})`), (0, n.reportMissingProp)(i, _), u.else());
    }
  }
  e.validatePropertyDeps = a;
  function l(i, d = i.schema) {
    const { gen: u, data: h, keyword: E, it: _ } = i, v = u.name("valid");
    for (const y in d)
      (0, r.alwaysValidSchema)(_, d[y]) || (u.if(
        (0, n.propertyInData)(u, h, y, _.opts.ownProperties),
        () => {
          const $ = i.subschema({ keyword: E, schemaProp: y }, v);
          i.mergeValidEvaluated($, v);
        },
        () => u.var(v, !0)
        // TODO var
      ), i.ok(v));
  }
  e.validateSchemaDeps = l, e.default = s;
})(cs);
var Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
const Jl = x, Rp = A, Op = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Jl._)`{propertyName: ${e.propertyName}}`
}, Tp = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Op,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Rp.alwaysValidSchema)(s, r))
      return;
    const o = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, o), t.if((0, Jl.not)(o), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
Jo.default = Tp;
var ls = {};
Object.defineProperty(ls, "__esModule", { value: !0 });
const $n = re, He = x, jp = Fe, yn = A, kp = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, He._)`{additionalProperty: ${e.additionalProperty}}`
}, Ap = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: kp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: o, it: a } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: i } = a;
    if (a.props = !0, i.removeAdditional !== "all" && (0, yn.alwaysValidSchema)(a, r))
      return;
    const d = (0, $n.allSchemaProperties)(n.properties), u = (0, $n.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, He._)`${o} === ${jp.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !u.length ? v($) : t.if(E($), () => v($));
      });
    }
    function E($) {
      let m;
      if (d.length > 8) {
        const w = (0, yn.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, $n.isOwnProperty)(t, w, $);
      } else d.length ? m = (0, He.or)(...d.map((w) => (0, He._)`${$} === ${w}`)) : m = He.nil;
      return u.length && (m = (0, He.or)(m, ...u.map((w) => (0, He._)`${(0, $n.usePattern)(e, w)}.test(${$})`))), (0, He.not)(m);
    }
    function _($) {
      t.code((0, He._)`delete ${s}[${$}]`);
    }
    function v($) {
      if (i.removeAdditional === "all" || i.removeAdditional && r === !1) {
        _($);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: $ }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, yn.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        i.removeAdditional === "failing" ? (y($, m, !1), t.if((0, He.not)(m), () => {
          e.reset(), _($);
        })) : (y($, m), l || t.if((0, He.not)(m), () => t.break()));
      }
    }
    function y($, m, w) {
      const P = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: yn.Type.Str
      };
      w === !1 && Object.assign(P, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(P, m);
    }
  }
};
ls.default = Ap;
var xo = {};
Object.defineProperty(xo, "__esModule", { value: !0 });
const Cp = Je, Fi = re, Os = A, Ui = ls, Dp = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Ui.default.code(new Cp.KeywordCxt(o, Ui.default, "additionalProperties"));
    const a = (0, Fi.allSchemaProperties)(r);
    for (const h of a)
      o.definedProperties.add(h);
    o.opts.unevaluated && a.length && o.props !== !0 && (o.props = Os.mergeEvaluated.props(t, (0, Os.toHash)(a), o.props));
    const l = a.filter((h) => !(0, Os.alwaysValidSchema)(o, r[h]));
    if (l.length === 0)
      return;
    const i = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, Fi.propertyInData)(t, s, h, o.opts.ownProperties)), u(h), o.allErrors || t.else().var(i, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(i);
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
xo.default = Dp;
var Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
const zi = re, gn = x, qi = A, Gi = A, Mp = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: o } = e, { opts: a } = o, l = (0, zi.allSchemaProperties)(r), i = l.filter((y) => (0, qi.alwaysValidSchema)(o, r[y]));
    if (l.length === 0 || i.length === l.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const d = a.strictSchema && !a.allowMatchingProperties && s.properties, u = t.name("valid");
    o.props !== !0 && !(o.props instanceof gn.Name) && (o.props = (0, Gi.evaluatedPropsToName)(t, o.props));
    const { props: h } = o;
    E();
    function E() {
      for (const y of l)
        d && _(y), o.allErrors ? v(y) : (t.var(u, !0), v(y), t.if(u));
    }
    function _(y) {
      for (const $ in d)
        new RegExp(y).test($) && (0, qi.checkStrictMode)(o, `property ${$} matches pattern ${y} (use allowMatchingProperties)`);
    }
    function v(y) {
      t.forIn("key", n, ($) => {
        t.if((0, gn._)`${(0, zi.usePattern)(e, y)}.test(${$})`, () => {
          const m = i.includes(y);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: y,
            dataProp: $,
            dataPropType: Gi.Type.Str
          }, u), o.opts.unevaluated && h !== !0 ? t.assign((0, gn._)`${h}[${$}]`, !0) : !m && !o.allErrors && t.if((0, gn.not)(u), () => t.break());
        });
      });
    }
  }
};
Yo.default = Mp;
var Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
const Lp = A, Vp = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Lp.alwaysValidSchema)(n, r)) {
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
Zo.default = Vp;
var Qo = {};
Object.defineProperty(Qo, "__esModule", { value: !0 });
const Fp = re, Up = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Fp.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Qo.default = Up;
var ea = {};
Object.defineProperty(ea, "__esModule", { value: !0 });
const Dn = x, zp = A, qp = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Dn._)`{passingSchemas: ${e.passing}}`
}, Gp = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: qp,
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
        (0, zp.alwaysValidSchema)(s, u) ? t.var(i, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, i), h > 0 && t.if((0, Dn._)`${i} && ${a}`).assign(a, !1).assign(l, (0, Dn._)`[${l}, ${h}]`).else(), t.if(i, () => {
          t.assign(a, !0), t.assign(l, h), E && e.mergeEvaluated(E, Dn.Name);
        });
      });
    }
  }
};
ea.default = Gp;
var ta = {};
Object.defineProperty(ta, "__esModule", { value: !0 });
const Kp = A, Hp = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((o, a) => {
      if ((0, Kp.alwaysValidSchema)(n, o))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: a }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
ta.default = Hp;
var ra = {};
Object.defineProperty(ra, "__esModule", { value: !0 });
const Wn = x, xl = A, Bp = {
  message: ({ params: e }) => (0, Wn.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Wn._)`{failingKeyword: ${e.ifClause}}`
}, Wp = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Bp,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, xl.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Ki(n, "then"), o = Ki(n, "else");
    if (!s && !o)
      return;
    const a = t.let("valid", !0), l = t.name("_valid");
    if (i(), e.reset(), s && o) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, Wn.not)(l), d("else"));
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
        t.assign(a, l), e.mergeValidEvaluated(E, a), h ? t.assign(h, (0, Wn._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function Ki(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, xl.alwaysValidSchema)(e, r);
}
ra.default = Wp;
var na = {};
Object.defineProperty(na, "__esModule", { value: !0 });
const Xp = A, Jp = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Xp.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
na.default = Jp;
Object.defineProperty(Ho, "__esModule", { value: !0 });
const xp = br, Yp = Bo, Zp = Pr, Qp = Wo, e$ = Xo, t$ = cs, r$ = Jo, n$ = ls, s$ = xo, o$ = Yo, a$ = Zo, i$ = Qo, c$ = ea, l$ = ta, u$ = ra, d$ = na;
function f$(e = !1) {
  const t = [
    // any
    a$.default,
    i$.default,
    c$.default,
    l$.default,
    u$.default,
    d$.default,
    // object
    r$.default,
    n$.default,
    t$.default,
    s$.default,
    o$.default
  ];
  return e ? t.push(Yp.default, Qp.default) : t.push(xp.default, Zp.default), t.push(e$.default), t;
}
Ho.default = f$;
var sa = {}, Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.dynamicAnchor = void 0;
const Ts = x, h$ = Fe, Hi = je, m$ = mt, p$ = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => Yl(e, e.schema)
};
function Yl(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, Ts._)`${h$.default.dynamicAnchors}${(0, Ts.getProperty)(t)}`, o = n.errSchemaPath === "#" ? n.validateName : $$(e);
  r.if((0, Ts._)`!${s}`, () => r.assign(s, o));
}
Nr.dynamicAnchor = Yl;
function $$(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: o, localRefs: a, meta: l } = t.root, { schemaId: i } = n.opts, d = new Hi.SchemaEnv({ schema: r, schemaId: i, root: s, baseId: o, localRefs: a, meta: l });
  return Hi.compileSchema.call(n, d), (0, m$.getValidate)(e, d);
}
Nr.default = p$;
var Ir = {};
Object.defineProperty(Ir, "__esModule", { value: !0 });
Ir.dynamicRef = void 0;
const Bi = x, y$ = Fe, Wi = mt, g$ = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => Zl(e, e.schema)
};
function Zl(e, t) {
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
      const d = r.let("_v", (0, Bi._)`${y$.default.dynamicAnchors}${(0, Bi.getProperty)(o)}`);
      r.if(d, l(d, i), l(s.validateName, i));
    } else
      l(s.validateName, i)();
  }
  function l(i, d) {
    return d ? () => r.block(() => {
      (0, Wi.callRef)(e, i), r.let(d, !0);
    }) : () => (0, Wi.callRef)(e, i);
  }
}
Ir.dynamicRef = Zl;
Ir.default = g$;
var oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
const _$ = Nr, v$ = A, w$ = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, _$.dynamicAnchor)(e, "") : (0, v$.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
oa.default = w$;
var aa = {};
Object.defineProperty(aa, "__esModule", { value: !0 });
const E$ = Ir, S$ = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, E$.dynamicRef)(e, e.schema)
};
aa.default = S$;
Object.defineProperty(sa, "__esModule", { value: !0 });
const b$ = Nr, P$ = Ir, N$ = oa, I$ = aa, R$ = [b$.default, P$.default, N$.default, I$.default];
sa.default = R$;
var ia = {}, ca = {};
Object.defineProperty(ca, "__esModule", { value: !0 });
const Xi = cs, O$ = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Xi.error,
  code: (e) => (0, Xi.validatePropertyDeps)(e)
};
ca.default = O$;
var la = {};
Object.defineProperty(la, "__esModule", { value: !0 });
const T$ = cs, j$ = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, T$.validateSchemaDeps)(e)
};
la.default = j$;
var ua = {};
Object.defineProperty(ua, "__esModule", { value: !0 });
const k$ = A, A$ = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, k$.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
ua.default = A$;
Object.defineProperty(ia, "__esModule", { value: !0 });
const C$ = ca, D$ = la, M$ = ua, L$ = [C$.default, D$.default, M$.default];
ia.default = L$;
var da = {}, fa = {};
Object.defineProperty(fa, "__esModule", { value: !0 });
const St = x, Ji = A, V$ = Fe, F$ = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, St._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, U$ = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: F$,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: o } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: a, props: l } = o;
    l instanceof St.Name ? t.if((0, St._)`${l} !== true`, () => t.forIn("key", n, (h) => t.if(d(l, h), () => i(h)))) : l !== !0 && t.forIn("key", n, (h) => l === void 0 ? i(h) : t.if(u(l, h), () => i(h))), o.props = !0, e.ok((0, St._)`${s} === ${V$.default.errors}`);
    function i(h) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: h }), e.error(), a || t.break();
        return;
      }
      if (!(0, Ji.alwaysValidSchema)(o, r)) {
        const E = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: Ji.Type.Str
        }, E), a || t.if((0, St.not)(E), () => t.break());
      }
    }
    function d(h, E) {
      return (0, St._)`!${h} || !${h}[${E}]`;
    }
    function u(h, E) {
      const _ = [];
      for (const v in h)
        h[v] === !0 && _.push((0, St._)`${E} !== ${v}`);
      return (0, St.and)(..._);
    }
  }
};
fa.default = U$;
var ha = {};
Object.defineProperty(ha, "__esModule", { value: !0 });
const xt = x, xi = A, z$ = {
  message: ({ params: { len: e } }) => (0, xt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, xt._)`{limit: ${e}}`
}, q$ = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: z$,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, o = s.items || 0;
    if (o === !0)
      return;
    const a = t.const("len", (0, xt._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: o }), e.fail((0, xt._)`${a} > ${o}`);
    else if (typeof r == "object" && !(0, xi.alwaysValidSchema)(s, r)) {
      const i = t.var("valid", (0, xt._)`${a} <= ${o}`);
      t.if((0, xt.not)(i), () => l(i, o)), e.ok(i);
    }
    s.items = !0;
    function l(i, d) {
      t.forRange("i", d, a, (u) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: u, dataPropType: xi.Type.Num }, i), s.allErrors || t.if((0, xt.not)(i), () => t.break());
      });
    }
  }
};
ha.default = q$;
Object.defineProperty(da, "__esModule", { value: !0 });
const G$ = fa, K$ = ha, H$ = [G$.default, K$.default];
da.default = H$;
var ma = {}, pa = {};
Object.defineProperty(pa, "__esModule", { value: !0 });
const pe = x, B$ = {
  message: ({ schemaCode: e }) => (0, pe.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, pe._)`{format: ${e}}`
}, W$ = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: B$,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: o, schemaCode: a, it: l } = e, { opts: i, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!i.validateFormats)
      return;
    s ? E() : _();
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
    function _() {
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
        const V = R instanceof RegExp ? (0, pe.regexpCode)(R) : i.code.formats ? (0, pe._)`${i.code.formats}${(0, pe.getProperty)(o)}` : void 0, W = r.scopeValue("formats", { key: o, ref: R, code: V });
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
pa.default = W$;
Object.defineProperty(ma, "__esModule", { value: !0 });
const X$ = pa, J$ = [X$.default];
ma.default = J$;
var vr = {};
Object.defineProperty(vr, "__esModule", { value: !0 });
vr.contentVocabulary = vr.metadataVocabulary = void 0;
vr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
vr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(To, "__esModule", { value: !0 });
const x$ = jo, Y$ = Ao, Z$ = Ho, Q$ = sa, ey = ia, ty = da, ry = ma, Yi = vr, ny = [
  Q$.default,
  x$.default,
  Y$.default,
  (0, Z$.default)(!0),
  ry.default,
  Yi.metadataVocabulary,
  Yi.contentVocabulary,
  ey.default,
  ty.default
];
To.default = ny;
var $a = {}, us = {};
Object.defineProperty(us, "__esModule", { value: !0 });
us.DiscrError = void 0;
var Zi;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Zi || (us.DiscrError = Zi = {}));
Object.defineProperty($a, "__esModule", { value: !0 });
const fr = x, Zs = us, Qi = je, sy = Sr, oy = A, ay = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Zs.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, fr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, iy = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: ay,
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
    const i = t.let("valid", !1), d = t.const("tag", (0, fr._)`${r}${(0, fr.getProperty)(l)}`);
    t.if((0, fr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: Zs.DiscrError.Tag, tag: d, tagName: l })), e.ok(i);
    function u() {
      const _ = E();
      t.if(!1);
      for (const v in _)
        t.elseIf((0, fr._)`${d} === ${v}`), t.assign(i, h(_[v]));
      t.else(), e.error(!1, { discrError: Zs.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(_) {
      const v = t.name("valid"), y = e.subschema({ keyword: "oneOf", schemaProp: _ }, v);
      return e.mergeEvaluated(y, fr.Name), v;
    }
    function E() {
      var _;
      const v = {}, y = m(s);
      let $ = !0;
      for (let I = 0; I < a.length; I++) {
        let R = a[I];
        if (R != null && R.$ref && !(0, oy.schemaHasRulesButRef)(R, o.self.RULES)) {
          const W = R.$ref;
          if (R = Qi.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, W), R instanceof Qi.SchemaEnv && (R = R.schema), R === void 0)
            throw new sy.default(o.opts.uriResolver, o.baseId, W);
        }
        const V = (_ = R == null ? void 0 : R.properties) === null || _ === void 0 ? void 0 : _[l];
        if (typeof V != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        $ = $ && (y || m(R)), w(V, I);
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
          for (const V of I.enum)
            P(V, R);
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
$a.default = iy;
var ya = {};
const cy = "https://json-schema.org/draft/2020-12/schema", ly = "https://json-schema.org/draft/2020-12/schema", uy = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, dy = "meta", fy = "Core and Validation specifications meta-schema", hy = [
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
], my = [
  "object",
  "boolean"
], py = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", $y = {
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
}, yy = {
  $schema: cy,
  $id: ly,
  $vocabulary: uy,
  $dynamicAnchor: dy,
  title: fy,
  allOf: hy,
  type: my,
  $comment: py,
  properties: $y
}, gy = "https://json-schema.org/draft/2020-12/schema", _y = "https://json-schema.org/draft/2020-12/meta/applicator", vy = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, wy = "meta", Ey = "Applicator vocabulary meta-schema", Sy = [
  "object",
  "boolean"
], by = {
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
}, Py = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, Ny = {
  $schema: gy,
  $id: _y,
  $vocabulary: vy,
  $dynamicAnchor: wy,
  title: Ey,
  type: Sy,
  properties: by,
  $defs: Py
}, Iy = "https://json-schema.org/draft/2020-12/schema", Ry = "https://json-schema.org/draft/2020-12/meta/unevaluated", Oy = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, Ty = "meta", jy = "Unevaluated applicator vocabulary meta-schema", ky = [
  "object",
  "boolean"
], Ay = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, Cy = {
  $schema: Iy,
  $id: Ry,
  $vocabulary: Oy,
  $dynamicAnchor: Ty,
  title: jy,
  type: ky,
  properties: Ay
}, Dy = "https://json-schema.org/draft/2020-12/schema", My = "https://json-schema.org/draft/2020-12/meta/content", Ly = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Vy = "meta", Fy = "Content vocabulary meta-schema", Uy = [
  "object",
  "boolean"
], zy = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, qy = {
  $schema: Dy,
  $id: My,
  $vocabulary: Ly,
  $dynamicAnchor: Vy,
  title: Fy,
  type: Uy,
  properties: zy
}, Gy = "https://json-schema.org/draft/2020-12/schema", Ky = "https://json-schema.org/draft/2020-12/meta/core", Hy = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, By = "meta", Wy = "Core vocabulary meta-schema", Xy = [
  "object",
  "boolean"
], Jy = {
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
}, xy = {
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
}, Yy = {
  $schema: Gy,
  $id: Ky,
  $vocabulary: Hy,
  $dynamicAnchor: By,
  title: Wy,
  type: Xy,
  properties: Jy,
  $defs: xy
}, Zy = "https://json-schema.org/draft/2020-12/schema", Qy = "https://json-schema.org/draft/2020-12/meta/format-annotation", eg = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, tg = "meta", rg = "Format vocabulary meta-schema for annotation results", ng = [
  "object",
  "boolean"
], sg = {
  format: {
    type: "string"
  }
}, og = {
  $schema: Zy,
  $id: Qy,
  $vocabulary: eg,
  $dynamicAnchor: tg,
  title: rg,
  type: ng,
  properties: sg
}, ag = "https://json-schema.org/draft/2020-12/schema", ig = "https://json-schema.org/draft/2020-12/meta/meta-data", cg = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, lg = "meta", ug = "Meta-data vocabulary meta-schema", dg = [
  "object",
  "boolean"
], fg = {
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
}, hg = {
  $schema: ag,
  $id: ig,
  $vocabulary: cg,
  $dynamicAnchor: lg,
  title: ug,
  type: dg,
  properties: fg
}, mg = "https://json-schema.org/draft/2020-12/schema", pg = "https://json-schema.org/draft/2020-12/meta/validation", $g = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, yg = "meta", gg = "Validation vocabulary meta-schema", _g = [
  "object",
  "boolean"
], vg = {
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
}, wg = {
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
}, Eg = {
  $schema: mg,
  $id: pg,
  $vocabulary: $g,
  $dynamicAnchor: yg,
  title: gg,
  type: _g,
  properties: vg,
  $defs: wg
};
Object.defineProperty(ya, "__esModule", { value: !0 });
const Sg = yy, bg = Ny, Pg = Cy, Ng = qy, Ig = Yy, Rg = og, Og = hg, Tg = Eg, jg = ["/properties"];
function kg(e) {
  return [
    Sg,
    bg,
    Pg,
    Ng,
    Ig,
    t(this, Rg),
    Og,
    t(this, Tg)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, jg) : n;
  }
}
ya.default = kg;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = rl, n = To, s = $a, o = ya, a = "https://json-schema.org/draft/2020-12/schema";
  class l extends r.default {
    constructor(_ = {}) {
      super({
        ..._,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((_) => this.addVocabulary(_)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: _, meta: v } = this.opts;
      v && (o.default.call(this, _), this.refs["http://json-schema.org/schema"] = a);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
    }
  }
  t.Ajv2020 = l, e.exports = t = l, e.exports.Ajv2020 = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
  var i = Je;
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
  var u = on;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return u.default;
  } });
  var h = Sr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(Hs, Hs.exports);
var Ag = Hs.exports, Qs = { exports: {} }, Ql = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(C, z) {
    return { validate: C, compare: z };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(o, a),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(i(!0), d),
    "date-time": t(E(!0), _),
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
    regex: ae,
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
    int32: { type: "number", validate: V },
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
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, _),
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
  function r(C) {
    return C % 4 === 0 && (C % 100 !== 0 || C % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function o(C) {
    const z = n.exec(C);
    if (!z)
      return !1;
    const se = +z[1], O = +z[2], k = +z[3];
    return O >= 1 && O <= 12 && k >= 1 && k <= (O === 2 && r(se) ? 29 : s[O]);
  }
  function a(C, z) {
    if (C && z)
      return C > z ? 1 : C < z ? -1 : 0;
  }
  const l = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function i(C) {
    return function(se) {
      const O = l.exec(se);
      if (!O)
        return !1;
      const k = +O[1], F = +O[2], D = +O[3], K = O[4], M = O[5] === "-" ? -1 : 1, N = +(O[6] || 0), p = +(O[7] || 0);
      if (N > 23 || p > 59 || C && !K)
        return !1;
      if (k <= 23 && F <= 59 && D < 60)
        return !0;
      const b = F - p * M, g = k - N * M - (b < 0 ? 1 : 0);
      return (g === 23 || g === -1) && (b === 59 || b === -1) && D < 61;
    };
  }
  function d(C, z) {
    if (!(C && z))
      return;
    const se = (/* @__PURE__ */ new Date("2020-01-01T" + C)).valueOf(), O = (/* @__PURE__ */ new Date("2020-01-01T" + z)).valueOf();
    if (se && O)
      return se - O;
  }
  function u(C, z) {
    if (!(C && z))
      return;
    const se = l.exec(C), O = l.exec(z);
    if (se && O)
      return C = se[1] + se[2] + se[3], z = O[1] + O[2] + O[3], C > z ? 1 : C < z ? -1 : 0;
  }
  const h = /t|\s/i;
  function E(C) {
    const z = i(C);
    return function(O) {
      const k = O.split(h);
      return k.length === 2 && o(k[0]) && z(k[1]);
    };
  }
  function _(C, z) {
    if (!(C && z))
      return;
    const se = new Date(C).valueOf(), O = new Date(z).valueOf();
    if (se && O)
      return se - O;
  }
  function v(C, z) {
    if (!(C && z))
      return;
    const [se, O] = C.split(h), [k, F] = z.split(h), D = a(se, k);
    if (D !== void 0)
      return D || d(O, F);
  }
  const y = /\/|:/, $ = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(C) {
    return y.test(C) && $.test(C);
  }
  const w = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function P(C) {
    return w.lastIndex = 0, w.test(C);
  }
  const I = -2147483648, R = 2 ** 31 - 1;
  function V(C) {
    return Number.isInteger(C) && C <= R && C >= I;
  }
  function W(C) {
    return Number.isInteger(C);
  }
  function Y() {
    return !0;
  }
  const ie = /[^\\]\\Z/;
  function ae(C) {
    if (ie.test(C))
      return !1;
    try {
      return new RegExp(C), !0;
    } catch {
      return !1;
    }
  }
})(Ql);
var eu = {}, eo = { exports: {} }, tu = {}, xe = {}, wr = {}, cn = {}, te = {}, nn = {};
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
    const P = [_(m[0])];
    let I = 0;
    for (; I < w.length; )
      P.push(o), l(P, w[I]), P.push(o, _(m[++I]));
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
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : _(Array.isArray(m) ? m.join(",") : m);
  }
  function E(m) {
    return new n(_(m));
  }
  e.stringify = E;
  function _(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = _;
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
})(nn);
var to = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = nn;
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
      const E = this.toName(d), { prefix: _ } = E, v = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let y = this._values[_];
      if (y) {
        const w = y.get(v);
        if (w)
          return w;
      } else
        y = this._values[_] = /* @__PURE__ */ new Map();
      y.set(v, E);
      const $ = this._scope[_] || (this._scope[_] = []), m = $.length;
      return $[m] = u.ref, E.setValue(u, { property: _, itemIndex: m }), E;
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
      let _ = t.nil;
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
            _ = (0, t._)`${_}${P} ${m} = ${w};${this.opts._n}`;
          } else if (w = E == null ? void 0 : E(m))
            _ = (0, t._)`${_}${w}${this.opts._n}`;
          else
            throw new r(m);
          $.set(m, n.Completed);
        });
      }
      return _;
    }
  }
  e.ValueScope = l;
})(to);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = nn, r = to;
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
  var s = to;
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
      return se(c, this.rhs);
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
  class _ extends o {
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
      return this.nodes.reduce((c, f) => z(c, f.names), {});
    }
  }
  class v extends _ {
    render(c) {
      return "{" + c._n + super.render(c) + "}" + c._n;
    }
  }
  class y extends _ {
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
        return c === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(F(c), f instanceof m ? [f] : f.nodes);
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
      return se(c, this.condition), this.else && z(c, this.else.names), c;
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
      return z(super.names, this.iteration.names);
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
      const c = se(super.names, this.from);
      return se(c, this.to);
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
      return z(super.names, this.iterable.names);
    }
  }
  class V extends v {
    constructor(c, f, S) {
      super(), this.name = c, this.args = f, this.async = S;
    }
    render(c) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(c);
    }
  }
  V.kind = "func";
  class W extends _ {
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
      return this.catch && z(c, this.catch.names), this.finally && z(c, this.finally.names), c;
    }
  }
  class ie extends v {
    constructor(c) {
      super(), this.error = c;
    }
    render(c) {
      return `catch(${this.error})` + super.render(c);
    }
  }
  ie.kind = "catch";
  class ae extends v {
    render(c) {
      return "finally" + super.render(c);
    }
  }
  ae.kind = "finally";
  class C {
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
        return this.forRange("_i", 0, (0, t._)`${G}.length`, (U) => {
          this.var(j, (0, t._)`${G}[${U}]`), S(j);
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
        this._currNode = T.catch = new ie(j), f(j);
      }
      return S && (this._currNode = T.finally = new ae(), this.code(S)), this._endBlockNode(ie, ae);
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
      return this._blockNode(new V(c, f, S)), T && this.code(T).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(V);
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
  e.CodeGen = C;
  function z(g, c) {
    for (const f in c)
      g[f] = (g[f] || 0) + (c[f] || 0);
    return g;
  }
  function se(g, c) {
    return c instanceof t._CodeOrName ? z(g, c.names) : g;
  }
  function O(g, c, f) {
    if (g instanceof t.Name)
      return S(g);
    if (!T(g))
      return g;
    return new t._Code(g._items.reduce((j, G) => (G instanceof t.Name && (G = S(G)), G instanceof t._Code ? j.push(...G._items) : j.push(G), j), []));
    function S(j) {
      const G = f[j.str];
      return G === void 0 || c[j.str] !== 1 ? j : (delete c[j.str], G);
    }
    function T(j) {
      return j instanceof t._Code && j._items.some((G) => G instanceof t.Name && c[G.str] === 1 && f[G.str] !== void 0);
    }
  }
  function k(g, c) {
    for (const f in c)
      g[f] = (g[f] || 0) - (c[f] || 0);
  }
  function F(g) {
    return typeof g == "boolean" || typeof g == "number" || g === null ? !g : (0, t._)`!${b(g)}`;
  }
  e.not = F;
  const D = p(e.operators.AND);
  function K(...g) {
    return g.reduce(D);
  }
  e.and = K;
  const M = p(e.operators.OR);
  function N(...g) {
    return g.reduce(M);
  }
  e.or = N;
  function p(g) {
    return (c, f) => c === t.nil ? f : f === t.nil ? c : (0, t._)`${b(c)} ${g} ${b(f)}`;
  }
  function b(g) {
    return g instanceof t.Name ? g : (0, t._)`(${g})`;
  }
})(te);
var L = {};
Object.defineProperty(L, "__esModule", { value: !0 });
L.checkStrictMode = L.getErrorPath = L.Type = L.useFunc = L.setEvaluated = L.evaluatedPropsToName = L.mergeEvaluated = L.eachItem = L.unescapeJsonPointer = L.escapeJsonPointer = L.escapeFragment = L.unescapeFragment = L.schemaRefOrVal = L.schemaHasRulesButRef = L.schemaHasRules = L.checkUnknownRules = L.alwaysValidSchema = L.toHash = void 0;
const ue = te, Cg = nn;
function Dg(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
L.toHash = Dg;
function Mg(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (ru(e, t), !nu(t, e.self.RULES.all));
}
L.alwaysValidSchema = Mg;
function ru(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const o in t)
    s[o] || au(e, `unknown keyword: "${o}"`);
}
L.checkUnknownRules = ru;
function nu(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
L.schemaHasRules = nu;
function Lg(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
L.schemaHasRulesButRef = Lg;
function Vg({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ue._)`${r}`;
  }
  return (0, ue._)`${e}${t}${(0, ue.getProperty)(n)}`;
}
L.schemaRefOrVal = Vg;
function Fg(e) {
  return su(decodeURIComponent(e));
}
L.unescapeFragment = Fg;
function Ug(e) {
  return encodeURIComponent(ga(e));
}
L.escapeFragment = Ug;
function ga(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
L.escapeJsonPointer = ga;
function su(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
L.unescapeJsonPointer = su;
function zg(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
L.eachItem = zg;
function ec({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, o, a, l) => {
    const i = a === void 0 ? o : a instanceof ue.Name ? (o instanceof ue.Name ? e(s, o, a) : t(s, o, a), a) : o instanceof ue.Name ? (t(s, a, o), o) : r(o, a);
    return l === ue.Name && !(i instanceof ue.Name) ? n(s, i) : i;
  };
}
L.mergeEvaluated = {
  props: ec({
    mergeNames: (e, t, r) => e.if((0, ue._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ue._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ue._)`${r} || {}`).code((0, ue._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ue._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ue._)`${r} || {}`), _a(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: ou
  }),
  items: ec({
    mergeNames: (e, t, r) => e.if((0, ue._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ue._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ue._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ue._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function ou(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ue._)`{}`);
  return t !== void 0 && _a(e, r, t), r;
}
L.evaluatedPropsToName = ou;
function _a(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ue._)`${t}${(0, ue.getProperty)(n)}`, !0));
}
L.setEvaluated = _a;
const tc = {};
function qg(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: tc[t.code] || (tc[t.code] = new Cg._Code(t.code))
  });
}
L.useFunc = qg;
var ro;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(ro || (L.Type = ro = {}));
function Gg(e, t, r) {
  if (e instanceof ue.Name) {
    const n = t === ro.Num;
    return r ? n ? (0, ue._)`"[" + ${e} + "]"` : (0, ue._)`"['" + ${e} + "']"` : n ? (0, ue._)`"/" + ${e}` : (0, ue._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ue.getProperty)(e).toString() : "/" + ga(e);
}
L.getErrorPath = Gg;
function au(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
L.checkStrictMode = au;
var ot = {};
Object.defineProperty(ot, "__esModule", { value: !0 });
const Ne = te, Kg = {
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
ot.default = Kg;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = te, r = L, n = ot;
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: m }) => m ? (0, t.str)`"${$}" keyword must be ${m} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, m = e.keywordError, w, P) {
    const { it: I } = $, { gen: R, compositeRule: V, allErrors: W } = I, Y = h($, m, w);
    P ?? (V || W) ? i(R, Y) : d(I, (0, t._)`[${Y}]`);
  }
  e.reportError = s;
  function o($, m = e.keywordError, w) {
    const { it: P } = $, { gen: I, compositeRule: R, allErrors: V } = P, W = h($, m, w);
    i(I, W), R || V || d(P, n.default.vErrors);
  }
  e.reportExtraError = o;
  function a($, m) {
    $.assign(n.default.errors, m), $.if((0, t._)`${n.default.vErrors} !== null`, () => $.if(m, () => $.assign((0, t._)`${n.default.vErrors}.length`, m), () => $.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function l({ gen: $, keyword: m, schemaValue: w, data: P, errsCount: I, it: R }) {
    if (I === void 0)
      throw new Error("ajv implementation error");
    const V = $.name("err");
    $.forRange("i", I, n.default.errors, (W) => {
      $.const(V, (0, t._)`${n.default.vErrors}[${W}]`), $.if((0, t._)`${V}.instancePath === undefined`, () => $.assign((0, t._)`${V}.instancePath`, (0, t.strConcat)(n.default.instancePath, R.errorPath))), $.assign((0, t._)`${V}.schemaPath`, (0, t.str)`${R.errSchemaPath}/${m}`), R.opts.verbose && ($.assign((0, t._)`${V}.schema`, w), $.assign((0, t._)`${V}.data`, P));
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
      _(I, w),
      v($, w)
    ];
    return y($, m, R), P.object(...R);
  }
  function _({ errorPath: $ }, { instancePath: m }) {
    const w = m ? (0, t.str)`${$}${(0, r.getErrorPath)(m, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, w)];
  }
  function v({ keyword: $, it: { errSchemaPath: m } }, { schemaPath: w, parentSchema: P }) {
    let I = P ? m : (0, t.str)`${m}/${$}`;
    return w && (I = (0, t.str)`${I}${(0, r.getErrorPath)(w, r.Type.Str)}`), [u.schemaPath, I];
  }
  function y($, { params: m, message: w }, P) {
    const { keyword: I, data: R, schemaValue: V, it: W } = $, { opts: Y, propertyName: ie, topSchemaRef: ae, schemaPath: C } = W;
    P.push([u.keyword, I], [u.params, typeof m == "function" ? m($) : m || (0, t._)`{}`]), Y.messages && P.push([u.message, typeof w == "function" ? w($) : w]), Y.verbose && P.push([u.schema, V], [u.parentSchema, (0, t._)`${ae}${C}`], [n.default.data, R]), ie && P.push([u.propertyName, ie]);
  }
})(cn);
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.boolOrEmptySchema = wr.topBoolOrEmptySchema = void 0;
const Hg = cn, Bg = te, Wg = ot, Xg = {
  message: "boolean schema is false"
};
function Jg(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? iu(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Wg.default.data) : (t.assign((0, Bg._)`${n}.errors`, null), t.return(!0));
}
wr.topBoolOrEmptySchema = Jg;
function xg(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), iu(e)) : r.var(t, !0);
}
wr.boolOrEmptySchema = xg;
function iu(e, t) {
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
  (0, Hg.reportError)(s, Xg, void 0, t);
}
var ge = {}, nr = {};
Object.defineProperty(nr, "__esModule", { value: !0 });
nr.getRules = nr.isJSONType = void 0;
const Yg = ["string", "number", "integer", "boolean", "null", "object", "array"], Zg = new Set(Yg);
function Qg(e) {
  return typeof e == "string" && Zg.has(e);
}
nr.isJSONType = Qg;
function e0() {
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
nr.getRules = e0;
var dt = {};
Object.defineProperty(dt, "__esModule", { value: !0 });
dt.shouldUseRule = dt.shouldUseGroup = dt.schemaHasRulesForType = void 0;
function t0({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && cu(e, n);
}
dt.schemaHasRulesForType = t0;
function cu(e, t) {
  return t.rules.some((r) => lu(e, r));
}
dt.shouldUseGroup = cu;
function lu(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
dt.shouldUseRule = lu;
Object.defineProperty(ge, "__esModule", { value: !0 });
ge.reportTypeError = ge.checkDataTypes = ge.checkDataType = ge.coerceAndCheckDataType = ge.getJSONTypes = ge.getSchemaTypes = ge.DataType = void 0;
const r0 = nr, n0 = dt, s0 = cn, Q = te, uu = L;
var yr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(yr || (ge.DataType = yr = {}));
function o0(e) {
  const t = du(e.type);
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
ge.getSchemaTypes = o0;
function du(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(r0.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ge.getJSONTypes = du;
function a0(e, t) {
  const { gen: r, data: n, opts: s } = e, o = i0(t, s.coerceTypes), a = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, n0.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const l = va(t, n, s.strictNumbers, yr.Wrong);
    r.if(l, () => {
      o.length ? c0(e, t, o) : wa(e);
    });
  }
  return a;
}
ge.coerceAndCheckDataType = a0;
const fu = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function i0(e, t) {
  return t ? e.filter((r) => fu.has(r) || t === "array" && r === "array") : [];
}
function c0(e, t, r) {
  const { gen: n, data: s, opts: o } = e, a = n.let("dataType", (0, Q._)`typeof ${s}`), l = n.let("coerced", (0, Q._)`undefined`);
  o.coerceTypes === "array" && n.if((0, Q._)`${a} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, Q._)`${s}[0]`).assign(a, (0, Q._)`typeof ${s}`).if(va(t, s, o.strictNumbers), () => n.assign(l, s))), n.if((0, Q._)`${l} !== undefined`);
  for (const d of r)
    (fu.has(d) || d === "array" && o.coerceTypes === "array") && i(d);
  n.else(), wa(e), n.endIf(), n.if((0, Q._)`${l} !== undefined`, () => {
    n.assign(s, l), l0(e, l);
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
function l0({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, Q._)`${t} !== undefined`, () => e.assign((0, Q._)`${t}[${r}]`, n));
}
function no(e, t, r, n = yr.Correct) {
  const s = n === yr.Correct ? Q.operators.EQ : Q.operators.NEQ;
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
  return n === yr.Correct ? o : (0, Q.not)(o);
  function a(l = Q.nil) {
    return (0, Q.and)((0, Q._)`typeof ${t} == "number"`, l, r ? (0, Q._)`isFinite(${t})` : Q.nil);
  }
}
ge.checkDataType = no;
function va(e, t, r, n) {
  if (e.length === 1)
    return no(e[0], t, r, n);
  let s;
  const o = (0, uu.toHash)(e);
  if (o.array && o.object) {
    const a = (0, Q._)`typeof ${t} != "object"`;
    s = o.null ? a : (0, Q._)`!${t} || ${a}`, delete o.null, delete o.array, delete o.object;
  } else
    s = Q.nil;
  o.number && delete o.integer;
  for (const a in o)
    s = (0, Q.and)(s, no(a, t, r, n));
  return s;
}
ge.checkDataTypes = va;
const u0 = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, Q._)`{type: ${e}}` : (0, Q._)`{type: ${t}}`
};
function wa(e) {
  const t = d0(e);
  (0, s0.reportError)(t, u0);
}
ge.reportTypeError = wa;
function d0(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, uu.schemaRefOrVal)(e, n, "type");
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
var ds = {};
Object.defineProperty(ds, "__esModule", { value: !0 });
ds.assignDefaults = void 0;
const ir = te, f0 = L;
function h0(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      rc(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, o) => rc(e, o, s.default));
}
ds.assignDefaults = h0;
function rc(e, t, r) {
  const { gen: n, compositeRule: s, data: o, opts: a } = e;
  if (r === void 0)
    return;
  const l = (0, ir._)`${o}${(0, ir.getProperty)(t)}`;
  if (s) {
    (0, f0.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let i = (0, ir._)`${l} === undefined`;
  a.useDefaults === "empty" && (i = (0, ir._)`${i} || ${l} === null || ${l} === ""`), n.if(i, (0, ir._)`${l} = ${(0, ir.stringify)(r)}`);
}
var st = {}, ne = {};
Object.defineProperty(ne, "__esModule", { value: !0 });
ne.validateUnion = ne.validateArray = ne.usePattern = ne.callValidateCode = ne.schemaProperties = ne.allSchemaProperties = ne.noPropertyInData = ne.propertyInData = ne.isOwnProperty = ne.hasPropFunc = ne.reportMissingProp = ne.checkMissingProp = ne.checkReportMissingProp = void 0;
const fe = te, Ea = L, wt = ot, m0 = L;
function p0(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(ba(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, fe._)`${t}` }, !0), e.error();
  });
}
ne.checkReportMissingProp = p0;
function $0({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, fe.or)(...n.map((o) => (0, fe.and)(ba(e, t, o, r.ownProperties), (0, fe._)`${s} = ${o}`)));
}
ne.checkMissingProp = $0;
function y0(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ne.reportMissingProp = y0;
function hu(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, fe._)`Object.prototype.hasOwnProperty`
  });
}
ne.hasPropFunc = hu;
function Sa(e, t, r) {
  return (0, fe._)`${hu(e)}.call(${t}, ${r})`;
}
ne.isOwnProperty = Sa;
function g0(e, t, r, n) {
  const s = (0, fe._)`${t}${(0, fe.getProperty)(r)} !== undefined`;
  return n ? (0, fe._)`${s} && ${Sa(e, t, r)}` : s;
}
ne.propertyInData = g0;
function ba(e, t, r, n) {
  const s = (0, fe._)`${t}${(0, fe.getProperty)(r)} === undefined`;
  return n ? (0, fe.or)(s, (0, fe.not)(Sa(e, t, r))) : s;
}
ne.noPropertyInData = ba;
function mu(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ne.allSchemaProperties = mu;
function _0(e, t) {
  return mu(t).filter((r) => !(0, Ea.alwaysValidSchema)(e, t[r]));
}
ne.schemaProperties = _0;
function v0({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: o }, it: a }, l, i, d) {
  const u = d ? (0, fe._)`${e}, ${t}, ${n}${s}` : t, h = [
    [wt.default.instancePath, (0, fe.strConcat)(wt.default.instancePath, o)],
    [wt.default.parentData, a.parentData],
    [wt.default.parentDataProperty, a.parentDataProperty],
    [wt.default.rootData, wt.default.rootData]
  ];
  a.opts.dynamicRef && h.push([wt.default.dynamicAnchors, wt.default.dynamicAnchors]);
  const E = (0, fe._)`${u}, ${r.object(...h)}`;
  return i !== fe.nil ? (0, fe._)`${l}.call(${i}, ${E})` : (0, fe._)`${l}(${E})`;
}
ne.callValidateCode = v0;
const w0 = (0, fe._)`new RegExp`;
function E0({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, o = s(r, n);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, fe._)`${s.code === "new RegExp" ? w0 : (0, m0.useFunc)(e, s)}(${r}, ${n})`
  });
}
ne.usePattern = E0;
function S0(e) {
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
        dataPropType: Ea.Type.Num
      }, o), t.if((0, fe.not)(o), l);
    });
  }
}
ne.validateArray = S0;
function b0(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((i) => (0, Ea.alwaysValidSchema)(s, i)) && !s.opts.unevaluated)
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
ne.validateUnion = b0;
Object.defineProperty(st, "__esModule", { value: !0 });
st.validateKeywordUsage = st.validSchemaType = st.funcKeywordCode = st.macroKeywordCode = void 0;
const Te = te, Yt = ot, P0 = ne, N0 = cn;
function I0(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: o, it: a } = e, l = t.macro.call(a.self, s, o, a), i = pu(r, n, l);
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
st.macroKeywordCode = I0;
function R0(e, t) {
  var r;
  const { gen: n, keyword: s, schema: o, parentSchema: a, $data: l, it: i } = e;
  T0(i, t);
  const d = !l && t.compile ? t.compile.call(i.self, o, a, i) : t.validate, u = pu(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      y(), t.modifying && nc(e), $(() => e.error());
    else {
      const m = t.async ? _() : v();
      t.modifying && nc(e), $(() => O0(e, m));
    }
  }
  function _() {
    const m = n.let("ruleErrs", null);
    return n.try(() => y((0, Te._)`await `), (w) => n.assign(h, !1).if((0, Te._)`${w} instanceof ${i.ValidationError}`, () => n.assign(m, (0, Te._)`${w}.errors`), () => n.throw(w))), m;
  }
  function v() {
    const m = (0, Te._)`${u}.errors`;
    return n.assign(m, null), y(Te.nil), m;
  }
  function y(m = t.async ? (0, Te._)`await ` : Te.nil) {
    const w = i.opts.passContext ? Yt.default.this : Yt.default.self, P = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, Te._)`${m}${(0, P0.callValidateCode)(e, u, w, P)}`, t.modifying);
  }
  function $(m) {
    var w;
    n.if((0, Te.not)((w = t.valid) !== null && w !== void 0 ? w : h), m);
  }
}
st.funcKeywordCode = R0;
function nc(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Te._)`${n.parentData}[${n.parentDataProperty}]`));
}
function O0(e, t) {
  const { gen: r } = e;
  r.if((0, Te._)`Array.isArray(${t})`, () => {
    r.assign(Yt.default.vErrors, (0, Te._)`${Yt.default.vErrors} === null ? ${t} : ${Yt.default.vErrors}.concat(${t})`).assign(Yt.default.errors, (0, Te._)`${Yt.default.vErrors}.length`), (0, N0.extendErrors)(e);
  }, () => e.error());
}
function T0({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function pu(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Te.stringify)(r) });
}
function j0(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
st.validSchemaType = j0;
function k0({ schema: e, opts: t, self: r, errSchemaPath: n }, s, o) {
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
st.validateKeywordUsage = k0;
var Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
Tt.extendSubschemaMode = Tt.extendSubschemaData = Tt.getSubschema = void 0;
const tt = te, $u = L;
function A0(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: o, topSchemaRef: a }) {
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
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, $u.escapeFragment)(r)}`
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
Tt.getSubschema = A0;
function C0(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: o, propertyName: a }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, E = l.let("data", (0, tt._)`${t.data}${(0, tt.getProperty)(r)}`, !0);
    i(E), e.errorPath = (0, tt.str)`${d}${(0, $u.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, tt._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
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
Tt.extendSubschemaData = C0;
function D0(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: o }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Tt.extendSubschemaMode = D0;
var Se = {}, yu = { exports: {} }, Rt = yu.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Mn(t, n, s, e, "", e);
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
function Mn(e, t, r, n, s, o, a, l, i, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, o, a, l, i, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in Rt.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            Mn(e, t, r, h[E], s + "/" + u + "/" + E, o, s, u, n, E);
      } else if (u in Rt.propsKeywords) {
        if (h && typeof h == "object")
          for (var _ in h)
            Mn(e, t, r, h[_], s + "/" + u + "/" + M0(_), o, s, u, n, _);
      } else (u in Rt.keywords || e.allKeys && !(u in Rt.skipKeywords)) && Mn(e, t, r, h, s + "/" + u, o, s, u, n);
    }
    r(n, s, o, a, l, i, d);
  }
}
function M0(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var L0 = yu.exports;
Object.defineProperty(Se, "__esModule", { value: !0 });
Se.getSchemaRefs = Se.resolveUrl = Se.normalizeId = Se._getFullPath = Se.getFullPath = Se.inlineRef = void 0;
const V0 = L, F0 = ss, U0 = L0, z0 = /* @__PURE__ */ new Set([
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
function q0(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !so(e) : t ? gu(e) <= t : !1;
}
Se.inlineRef = q0;
const G0 = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function so(e) {
  for (const t in e) {
    if (G0.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(so) || typeof r == "object" && so(r))
      return !0;
  }
  return !1;
}
function gu(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !z0.has(r) && (typeof e[r] == "object" && (0, V0.eachItem)(e[r], (n) => t += gu(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function _u(e, t = "", r) {
  r !== !1 && (t = gr(t));
  const n = e.parse(t);
  return vu(e, n);
}
Se.getFullPath = _u;
function vu(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Se._getFullPath = vu;
const K0 = /#\/?$/;
function gr(e) {
  return e ? e.replace(K0, "") : "";
}
Se.normalizeId = gr;
function H0(e, t, r) {
  return r = gr(r), e.resolve(t, r);
}
Se.resolveUrl = H0;
const B0 = /^[a-z_][-a-z0-9._]*$/i;
function W0(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = gr(e[r] || t), o = { "": s }, a = _u(n, s, !1), l = {}, i = /* @__PURE__ */ new Set();
  return U0(e, { allKeys: !0 }, (h, E, _, v) => {
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
        if (!B0.test(P))
          throw new Error(`invalid anchor "${P}"`);
        m.call(this, `#${P}`);
      }
    }
  }), l;
  function d(h, E, _) {
    if (E !== void 0 && !F0(h, E))
      throw u(_);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Se.getSchemaRefs = W0;
Object.defineProperty(xe, "__esModule", { value: !0 });
xe.getData = xe.KeywordCxt = xe.validateFunctionCode = void 0;
const wu = wr, sc = ge, Pa = dt, Xn = ge, X0 = ds, Yr = st, js = Tt, B = te, J = ot, J0 = Se, ft = L, Ur = cn;
function x0(e) {
  if (bu(e) && (Pu(e), Su(e))) {
    Q0(e);
    return;
  }
  Eu(e, () => (0, wu.topBoolOrEmptySchema)(e));
}
xe.validateFunctionCode = x0;
function Eu({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, o) {
  s.code.es5 ? e.func(t, (0, B._)`${J.default.data}, ${J.default.valCxt}`, n.$async, () => {
    e.code((0, B._)`"use strict"; ${oc(r, s)}`), Z0(e, s), e.code(o);
  }) : e.func(t, (0, B._)`${J.default.data}, ${Y0(s)}`, n.$async, () => e.code(oc(r, s)).code(o));
}
function Y0(e) {
  return (0, B._)`{${J.default.instancePath}="", ${J.default.parentData}, ${J.default.parentDataProperty}, ${J.default.rootData}=${J.default.data}${e.dynamicRef ? (0, B._)`, ${J.default.dynamicAnchors}={}` : B.nil}}={}`;
}
function Z0(e, t) {
  e.if(J.default.valCxt, () => {
    e.var(J.default.instancePath, (0, B._)`${J.default.valCxt}.${J.default.instancePath}`), e.var(J.default.parentData, (0, B._)`${J.default.valCxt}.${J.default.parentData}`), e.var(J.default.parentDataProperty, (0, B._)`${J.default.valCxt}.${J.default.parentDataProperty}`), e.var(J.default.rootData, (0, B._)`${J.default.valCxt}.${J.default.rootData}`), t.dynamicRef && e.var(J.default.dynamicAnchors, (0, B._)`${J.default.valCxt}.${J.default.dynamicAnchors}`);
  }, () => {
    e.var(J.default.instancePath, (0, B._)`""`), e.var(J.default.parentData, (0, B._)`undefined`), e.var(J.default.parentDataProperty, (0, B._)`undefined`), e.var(J.default.rootData, J.default.data), t.dynamicRef && e.var(J.default.dynamicAnchors, (0, B._)`{}`);
  });
}
function Q0(e) {
  const { schema: t, opts: r, gen: n } = e;
  Eu(e, () => {
    r.$comment && t.$comment && Iu(e), s_(e), n.let(J.default.vErrors, null), n.let(J.default.errors, 0), r.unevaluated && e_(e), Nu(e), i_(e);
  });
}
function e_(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, B._)`${r}.evaluated`), t.if((0, B._)`${e.evaluated}.dynamicProps`, () => t.assign((0, B._)`${e.evaluated}.props`, (0, B._)`undefined`)), t.if((0, B._)`${e.evaluated}.dynamicItems`, () => t.assign((0, B._)`${e.evaluated}.items`, (0, B._)`undefined`));
}
function oc(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, B._)`/*# sourceURL=${r} */` : B.nil;
}
function t_(e, t) {
  if (bu(e) && (Pu(e), Su(e))) {
    r_(e, t);
    return;
  }
  (0, wu.boolOrEmptySchema)(e, t);
}
function Su({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function bu(e) {
  return typeof e.schema != "boolean";
}
function r_(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Iu(e), o_(e), a_(e);
  const o = n.const("_errs", J.default.errors);
  Nu(e, o), n.var(t, (0, B._)`${o} === ${J.default.errors}`);
}
function Pu(e) {
  (0, ft.checkUnknownRules)(e), n_(e);
}
function Nu(e, t) {
  if (e.opts.jtd)
    return ac(e, [], !1, t);
  const r = (0, sc.getSchemaTypes)(e.schema), n = (0, sc.coerceAndCheckDataType)(e, r);
  ac(e, r, !n, t);
}
function n_(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, ft.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function s_(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, ft.checkStrictMode)(e, "default is ignored in the schema root");
}
function o_(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, J0.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function a_(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Iu({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const o = r.$comment;
  if (s.$comment === !0)
    e.code((0, B._)`${J.default.self}.logger.log(${o})`);
  else if (typeof s.$comment == "function") {
    const a = (0, B.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, B._)`${J.default.self}.opts.$comment(${o}, ${a}, ${l}.schema)`);
  }
}
function i_(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: o } = e;
  r.$async ? t.if((0, B._)`${J.default.errors} === 0`, () => t.return(J.default.data), () => t.throw((0, B._)`new ${s}(${J.default.vErrors})`)) : (t.assign((0, B._)`${n}.errors`, J.default.vErrors), o.unevaluated && c_(e), t.return((0, B._)`${J.default.errors} === 0`));
}
function c_({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof B.Name && e.assign((0, B._)`${t}.props`, r), n instanceof B.Name && e.assign((0, B._)`${t}.items`, n);
}
function ac(e, t, r, n) {
  const { gen: s, schema: o, data: a, allErrors: l, opts: i, self: d } = e, { RULES: u } = d;
  if (o.$ref && (i.ignoreKeywordsWithRef || !(0, ft.schemaHasRulesButRef)(o, u))) {
    s.block(() => Tu(e, "$ref", u.all.$ref.definition));
    return;
  }
  i.jtd || l_(e, t), s.block(() => {
    for (const E of u.rules)
      h(E);
    h(u.post);
  });
  function h(E) {
    (0, Pa.shouldUseGroup)(o, E) && (E.type ? (s.if((0, Xn.checkDataType)(E.type, a, i.strictNumbers)), ic(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, Xn.reportTypeError)(e)), s.endIf()) : ic(e, E), l || s.if((0, B._)`${J.default.errors} === ${n || 0}`));
  }
}
function ic(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, X0.assignDefaults)(e, t.type), r.block(() => {
    for (const o of t.rules)
      (0, Pa.shouldUseRule)(n, o) && Tu(e, o.keyword, o.definition, t.type);
  });
}
function l_(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (u_(e, t), e.opts.allowUnionTypes || d_(e, t), f_(e, e.dataTypes));
}
function u_(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Ru(e.dataTypes, r) || Na(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), m_(e, t);
  }
}
function d_(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Na(e, "use allowUnionTypes to allow union type keyword");
}
function f_(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Pa.shouldUseRule)(e.schema, s)) {
      const { type: o } = s.definition;
      o.length && !o.some((a) => h_(t, a)) && Na(e, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function h_(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Ru(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function m_(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Ru(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Na(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, ft.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Ou {
  constructor(t, r, n) {
    if ((0, Yr.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, ft.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", ju(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Yr.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
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
        return (0, B._)`${(0, Xn.checkDataTypes)(i, r, o.opts.strictNumbers, Xn.DataType.Wrong)}`;
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
    const n = (0, js.getSubschema)(this.it, t);
    (0, js.extendSubschemaData)(n, this.it, t), (0, js.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return t_(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = ft.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = ft.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, B.Name)), !0;
  }
}
xe.KeywordCxt = Ou;
function Tu(e, t, r, n) {
  const s = new Ou(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Yr.funcKeywordCode)(s, r) : "macro" in r ? (0, Yr.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Yr.funcKeywordCode)(s, r);
}
const p_ = /^\/(?:[^~]|~0|~1)*$/, $_ = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function ju(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, o;
  if (e === "")
    return J.default.rootData;
  if (e[0] === "/") {
    if (!p_.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, o = J.default.rootData;
  } else {
    const d = $_.exec(e);
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
    d && (o = (0, B._)`${o}${(0, B.getProperty)((0, ft.unescapeJsonPointer)(d))}`, a = (0, B._)`${a} && ${o}`);
  return a;
  function i(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
xe.getData = ju;
var ln = {};
Object.defineProperty(ln, "__esModule", { value: !0 });
class y_ extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
ln.default = y_;
var Rr = {};
Object.defineProperty(Rr, "__esModule", { value: !0 });
const ks = Se;
class g_ extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, ks.resolveUrl)(t, r, n), this.missingSchema = (0, ks.normalizeId)((0, ks.getFullPath)(t, this.missingRef));
  }
}
Rr.default = g_;
var De = {};
Object.defineProperty(De, "__esModule", { value: !0 });
De.resolveSchema = De.getCompilingSchema = De.resolveRef = De.compileSchema = De.SchemaEnv = void 0;
const Ke = te, __ = ln, Bt = ot, Xe = Se, cc = L, v_ = xe;
class fs {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Xe.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
De.SchemaEnv = fs;
function Ia(e) {
  const t = ku.call(this, e);
  if (t)
    return t;
  const r = (0, Xe.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: o } = this.opts, a = new Ke.CodeGen(this.scope, { es5: n, lines: s, ownProperties: o });
  let l;
  e.$async && (l = a.scopeValue("Error", {
    ref: __.default,
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
    this._compilations.add(e), (0, v_.validateFunctionCode)(d), a.optimize(this.opts.code.optimize);
    const h = a.toString();
    u = `${a.scopeRefs(Bt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const _ = new Function(`${Bt.default.self}`, `${Bt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(i, { ref: _ }), _.errors = null, _.schema = e.schema, _.schemaEnv = e, e.$async && (_.$async = !0), this.opts.code.source === !0 && (_.source = { validateName: i, validateCode: h, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: v, items: y } = d;
      _.evaluated = {
        props: v instanceof Ke.Name ? void 0 : v,
        items: y instanceof Ke.Name ? void 0 : y,
        dynamicProps: v instanceof Ke.Name,
        dynamicItems: y instanceof Ke.Name
      }, _.source && (_.source.evaluated = (0, Ke.stringify)(_.evaluated));
    }
    return e.validate = _, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
De.compileSchema = Ia;
function w_(e, t, r) {
  var n;
  r = (0, Xe.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let o = b_.call(this, e, r);
  if (o === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    a && (o = new fs({ schema: a, schemaId: l, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[r] = E_.call(this, o);
}
De.resolveRef = w_;
function E_(e) {
  return (0, Xe.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Ia.call(this, e);
}
function ku(e) {
  for (const t of this._compilations)
    if (S_(t, e))
      return t;
}
De.getCompilingSchema = ku;
function S_(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function b_(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || hs.call(this, e, t);
}
function hs(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Xe._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Xe.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return As.call(this, r, e);
  const o = (0, Xe.normalizeId)(n), a = this.refs[o] || this.schemas[o];
  if (typeof a == "string") {
    const l = hs.call(this, e, a);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : As.call(this, r, l);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || Ia.call(this, a), o === (0, Xe.normalizeId)(t)) {
      const { schema: l } = a, { schemaId: i } = this.opts, d = l[i];
      return d && (s = (0, Xe.resolveUrl)(this.opts.uriResolver, s, d)), new fs({ schema: l, schemaId: i, root: e, baseId: s });
    }
    return As.call(this, r, a);
  }
}
De.resolveSchema = hs;
const P_ = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function As(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const i = r[(0, cc.unescapeFragment)(l)];
    if (i === void 0)
      return;
    r = i;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !P_.has(l) && d && (t = (0, Xe.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let o;
  if (typeof r != "boolean" && r.$ref && !(0, cc.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, Xe.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    o = hs.call(this, n, l);
  }
  const { schemaId: a } = this.opts;
  if (o = o || new fs({ schema: r, schemaId: a, root: n, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const N_ = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", I_ = "Meta-schema for $data reference (JSON AnySchema extension proposal)", R_ = "object", O_ = [
  "$data"
], T_ = {
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
}, j_ = !1, k_ = {
  $id: N_,
  description: I_,
  type: R_,
  required: O_,
  properties: T_,
  additionalProperties: j_
};
var Ra = {};
Object.defineProperty(Ra, "__esModule", { value: !0 });
const Au = ql;
Au.code = 'require("ajv/dist/runtime/uri").default';
Ra.default = Au;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = xe;
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
  const n = ln, s = Rr, o = nr, a = De, l = te, i = Se, d = ge, u = L, h = k_, E = Ra, _ = (N, p) => new RegExp(N, p);
  _.code = "new RegExp";
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
    var p, b, g, c, f, S, T, j, G, U, oe, Me, jt, kt, At, Ct, Dt, Mt, Lt, Vt, Ft, Ut, zt, qt, Gt;
    const qe = N.strict, Kt = (p = N.code) === null || p === void 0 ? void 0 : p.optimize, kr = Kt === !0 || Kt === void 0 ? 1 : Kt || 0, Ar = (g = (b = N.code) === null || b === void 0 ? void 0 : b.regExp) !== null && g !== void 0 ? g : _, Es = (c = N.uriResolver) !== null && c !== void 0 ? c : E.default;
    return {
      strictSchema: (S = (f = N.strictSchema) !== null && f !== void 0 ? f : qe) !== null && S !== void 0 ? S : !0,
      strictNumbers: (j = (T = N.strictNumbers) !== null && T !== void 0 ? T : qe) !== null && j !== void 0 ? j : !0,
      strictTypes: (U = (G = N.strictTypes) !== null && G !== void 0 ? G : qe) !== null && U !== void 0 ? U : "log",
      strictTuples: (Me = (oe = N.strictTuples) !== null && oe !== void 0 ? oe : qe) !== null && Me !== void 0 ? Me : "log",
      strictRequired: (kt = (jt = N.strictRequired) !== null && jt !== void 0 ? jt : qe) !== null && kt !== void 0 ? kt : !1,
      code: N.code ? { ...N.code, optimize: kr, regExp: Ar } : { optimize: kr, regExp: Ar },
      loopRequired: (At = N.loopRequired) !== null && At !== void 0 ? At : w,
      loopEnum: (Ct = N.loopEnum) !== null && Ct !== void 0 ? Ct : w,
      meta: (Dt = N.meta) !== null && Dt !== void 0 ? Dt : !0,
      messages: (Mt = N.messages) !== null && Mt !== void 0 ? Mt : !0,
      inlineRefs: (Lt = N.inlineRefs) !== null && Lt !== void 0 ? Lt : !0,
      schemaId: (Vt = N.schemaId) !== null && Vt !== void 0 ? Vt : "$id",
      addUsedSchema: (Ft = N.addUsedSchema) !== null && Ft !== void 0 ? Ft : !0,
      validateSchema: (Ut = N.validateSchema) !== null && Ut !== void 0 ? Ut : !0,
      validateFormats: (zt = N.validateFormats) !== null && zt !== void 0 ? zt : !0,
      unicodeRegExp: (qt = N.unicodeRegExp) !== null && qt !== void 0 ? qt : !0,
      int32range: (Gt = N.int32range) !== null && Gt !== void 0 ? Gt : !0,
      uriResolver: Es
    };
  }
  class I {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...P(p) };
      const { es5: b, lines: g } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: y, es5: b, lines: g }), this.logger = z(p.logger);
      const c = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, o.getRules)(), R.call(this, $, p, "NOT SUPPORTED"), R.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ae.call(this), p.formats && Y.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && ie.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), W.call(this), p.validateFormats = c;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: b, schemaId: g } = this.opts;
      let c = h;
      g === "id" && (c = { ...h }, c.id = c.$id, delete c.$id), b && p && this.addMetaSchema(c, c[g], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: b } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[b] || p : void 0;
    }
    validate(p, b) {
      let g;
      if (typeof p == "string") {
        if (g = this.getSchema(p), !g)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        g = this.compile(p);
      const c = g(b);
      return "$async" in g || (this.errors = g.errors), c;
    }
    compile(p, b) {
      const g = this._addSchema(p, b);
      return g.validate || this._compileSchemaEnv(g);
    }
    compileAsync(p, b) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: g } = this.opts;
      return c.call(this, p, b);
      async function c(U, oe) {
        await f.call(this, U.$schema);
        const Me = this._addSchema(U, oe);
        return Me.validate || S.call(this, Me);
      }
      async function f(U) {
        U && !this.getSchema(U) && await c.call(this, { $ref: U }, !0);
      }
      async function S(U) {
        try {
          return this._compileSchemaEnv(U);
        } catch (oe) {
          if (!(oe instanceof s.default))
            throw oe;
          return T.call(this, oe), await j.call(this, oe.missingSchema), S.call(this, U);
        }
      }
      function T({ missingSchema: U, missingRef: oe }) {
        if (this.refs[U])
          throw new Error(`AnySchema ${U} is loaded but ${oe} cannot be resolved`);
      }
      async function j(U) {
        const oe = await G.call(this, U);
        this.refs[U] || await f.call(this, oe.$schema), this.refs[U] || this.addSchema(oe, U, b);
      }
      async function G(U) {
        const oe = this._loading[U];
        if (oe)
          return oe;
        try {
          return await (this._loading[U] = g(U));
        } finally {
          delete this._loading[U];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, b, g, c = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const S of p)
          this.addSchema(S, void 0, g, c);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: S } = this.opts;
        if (f = p[S], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return b = (0, i.normalizeId)(b || f), this._checkUnique(b), this.schemas[b] = this._addSchema(p, g, b, c, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, b, g = this.opts.validateSchema) {
      return this.addSchema(p, b, !0, g), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, b) {
      if (typeof p == "boolean")
        return !0;
      let g;
      if (g = p.$schema, g !== void 0 && typeof g != "string")
        throw new Error("$schema must be a string");
      if (g = g || this.opts.defaultMeta || this.defaultMeta(), !g)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const c = this.validate(g, p);
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
      for (; typeof (b = V.call(this, p)) == "string"; )
        p = b;
      if (b === void 0) {
        const { schemaId: g } = this.opts, c = new a.SchemaEnv({ schema: {}, schemaId: g });
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
          const b = V.call(this, p);
          return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const b = p;
          this._cache.delete(b);
          let g = p[this.opts.schemaId];
          return g && (g = (0, i.normalizeId)(g), delete this.schemas[g], delete this.refs[g]), this;
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
      let g;
      if (typeof p == "string")
        g = p, typeof b == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), b.keyword = g);
      else if (typeof p == "object" && b === void 0) {
        if (b = p, g = b.keyword, Array.isArray(g) && !g.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (O.call(this, g, b), !b)
        return (0, u.eachItem)(g, (f) => k.call(this, f)), this;
      D.call(this, b);
      const c = {
        ...b,
        type: (0, d.getJSONTypes)(b.type),
        schemaType: (0, d.getJSONTypes)(b.schemaType)
      };
      return (0, u.eachItem)(g, c.type.length === 0 ? (f) => k.call(this, f, c) : (f) => c.type.forEach((S) => k.call(this, f, c, S))), this;
    }
    getKeyword(p) {
      const b = this.RULES.all[p];
      return typeof b == "object" ? b.definition : !!b;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: b } = this;
      delete b.keywords[p], delete b.all[p];
      for (const g of b.rules) {
        const c = g.rules.findIndex((f) => f.keyword === p);
        c >= 0 && g.rules.splice(c, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, b) {
      return typeof b == "string" && (b = new RegExp(b)), this.formats[p] = b, this;
    }
    errorsText(p = this.errors, { separator: b = ", ", dataVar: g = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((c) => `${g}${c.instancePath} ${c.message}`).reduce((c, f) => c + b + f);
    }
    $dataMetaSchema(p, b) {
      const g = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const c of b) {
        const f = c.split("/").slice(1);
        let S = p;
        for (const T of f)
          S = S[T];
        for (const T in g) {
          const j = g[T];
          if (typeof j != "object")
            continue;
          const { $data: G } = j.definition, U = S[T];
          G && U && (S[T] = M(U));
        }
      }
      return p;
    }
    _removeAllSchemas(p, b) {
      for (const g in p) {
        const c = p[g];
        (!b || b.test(g)) && (typeof c == "string" ? delete p[g] : c && !c.meta && (this._cache.delete(c.schema), delete p[g]));
      }
    }
    _addSchema(p, b, g, c = this.opts.validateSchema, f = this.opts.addUsedSchema) {
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
      g = (0, i.normalizeId)(S || g);
      const G = i.getSchemaRefs.call(this, p, g);
      return j = new a.SchemaEnv({ schema: p, schemaId: T, meta: b, baseId: g, localRefs: G }), this._cache.set(j.schema, j), f && !g.startsWith("#") && (g && this._checkUnique(g), this.refs[g] = j), c && this.validateSchema(p, !0), j;
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
  function R(N, p, b, g = "error") {
    for (const c in N) {
      const f = c;
      f in p && this.logger[g](`${b}: option ${c}. ${N[f]}`);
    }
  }
  function V(N) {
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
  function ie(N) {
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
  function ae() {
    const N = { ...this.opts };
    for (const p of v)
      delete N[p];
    return N;
  }
  const C = { log() {
  }, warn() {
  }, error() {
  } };
  function z(N) {
    if (N === !1)
      return C;
    if (N === void 0)
      return console;
    if (N.log && N.warn && N.error)
      return N;
    throw new Error("logger must implement log, warn and error methods");
  }
  const se = /^[a-z_$][a-z0-9_$:-]*$/i;
  function O(N, p) {
    const { RULES: b } = this;
    if ((0, u.eachItem)(N, (g) => {
      if (b.keywords[g])
        throw new Error(`Keyword ${g} is already defined`);
      if (!se.test(g))
        throw new Error(`Keyword ${g} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(N, p, b) {
    var g;
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
    p.before ? F.call(this, S, T, p.before) : S.rules.push(T), f.all[N] = T, (g = p.implements) === null || g === void 0 || g.forEach((j) => this.addKeyword(j));
  }
  function F(N, p, b) {
    const g = N.rules.findIndex((c) => c.keyword === b);
    g >= 0 ? N.rules.splice(g, 0, p) : (N.rules.push(p), this.logger.warn(`rule ${b} is not defined`));
  }
  function D(N) {
    let { metaSchema: p } = N;
    p !== void 0 && (N.$data && this.opts.$data && (p = M(p)), N.validateSchema = this.compile(p, !0));
  }
  const K = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function M(N) {
    return { anyOf: [N, K] };
  }
})(tu);
var Oa = {}, Ta = {}, ja = {};
Object.defineProperty(ja, "__esModule", { value: !0 });
const A_ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
ja.default = A_;
var sr = {};
Object.defineProperty(sr, "__esModule", { value: !0 });
sr.callRef = sr.getValidate = void 0;
const C_ = Rr, lc = ne, Ce = te, cr = ot, uc = De, _n = L, D_ = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: o, validateName: a, opts: l, self: i } = n, { root: d } = o;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = uc.resolveRef.call(i, d, s, r);
    if (u === void 0)
      throw new C_.default(n.opts.uriResolver, s, r);
    if (u instanceof uc.SchemaEnv)
      return E(u);
    return _(u);
    function h() {
      if (o === d)
        return Ln(e, a, o, o.$async);
      const v = t.scopeValue("root", { ref: d });
      return Ln(e, (0, Ce._)`${v}.validate`, d, d.$async);
    }
    function E(v) {
      const y = Cu(e, v);
      Ln(e, y, v, v.$async);
    }
    function _(v) {
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
function Cu(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ce._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
sr.getValidate = Cu;
function Ln(e, t, r, n) {
  const { gen: s, it: o } = e, { allErrors: a, schemaEnv: l, opts: i } = o, d = i.passContext ? cr.default.this : Ce.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, Ce._)`await ${(0, lc.callValidateCode)(e, t, d)}`), _(t), a || s.assign(v, !0);
    }, (y) => {
      s.if((0, Ce._)`!(${y} instanceof ${o.ValidationError})`, () => s.throw(y)), E(y), a || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, lc.callValidateCode)(e, t, d), () => _(t), () => E(t));
  }
  function E(v) {
    const y = (0, Ce._)`${v}.errors`;
    s.assign(cr.default.vErrors, (0, Ce._)`${cr.default.vErrors} === null ? ${y} : ${cr.default.vErrors}.concat(${y})`), s.assign(cr.default.errors, (0, Ce._)`${cr.default.vErrors}.length`);
  }
  function _(v) {
    var y;
    if (!o.opts.unevaluated)
      return;
    const $ = (y = r == null ? void 0 : r.validate) === null || y === void 0 ? void 0 : y.evaluated;
    if (o.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (o.props = _n.mergeEvaluated.props(s, $.props, o.props));
      else {
        const m = s.var("props", (0, Ce._)`${v}.evaluated.props`);
        o.props = _n.mergeEvaluated.props(s, m, o.props, Ce.Name);
      }
    if (o.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (o.items = _n.mergeEvaluated.items(s, $.items, o.items));
      else {
        const m = s.var("items", (0, Ce._)`${v}.evaluated.items`);
        o.items = _n.mergeEvaluated.items(s, m, o.items, Ce.Name);
      }
  }
}
sr.callRef = Ln;
sr.default = D_;
Object.defineProperty(Ta, "__esModule", { value: !0 });
const M_ = ja, L_ = sr, V_ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  M_.default,
  L_.default
];
Ta.default = V_;
var ka = {}, Aa = {};
Object.defineProperty(Aa, "__esModule", { value: !0 });
const Jn = te, Et = Jn.operators, xn = {
  maximum: { okStr: "<=", ok: Et.LTE, fail: Et.GT },
  minimum: { okStr: ">=", ok: Et.GTE, fail: Et.LT },
  exclusiveMaximum: { okStr: "<", ok: Et.LT, fail: Et.GTE },
  exclusiveMinimum: { okStr: ">", ok: Et.GT, fail: Et.LTE }
}, F_ = {
  message: ({ keyword: e, schemaCode: t }) => (0, Jn.str)`must be ${xn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Jn._)`{comparison: ${xn[e].okStr}, limit: ${t}}`
}, U_ = {
  keyword: Object.keys(xn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: F_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Jn._)`${r} ${xn[t].fail} ${n} || isNaN(${r})`);
  }
};
Aa.default = U_;
var Ca = {};
Object.defineProperty(Ca, "__esModule", { value: !0 });
const Zr = te, z_ = {
  message: ({ schemaCode: e }) => (0, Zr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Zr._)`{multipleOf: ${e}}`
}, q_ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: z_,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, o = s.opts.multipleOfPrecision, a = t.let("res"), l = o ? (0, Zr._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, Zr._)`${a} !== parseInt(${a})`;
    e.fail$data((0, Zr._)`(${n} === 0 || (${a} = ${r}/${n}, ${l}))`);
  }
};
Ca.default = q_;
var Da = {}, Ma = {};
Object.defineProperty(Ma, "__esModule", { value: !0 });
function Du(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Ma.default = Du;
Du.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Da, "__esModule", { value: !0 });
const Zt = te, G_ = L, K_ = Ma, H_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Zt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Zt._)`{limit: ${e}}`
}, B_ = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: H_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, o = t === "maxLength" ? Zt.operators.GT : Zt.operators.LT, a = s.opts.unicode === !1 ? (0, Zt._)`${r}.length` : (0, Zt._)`${(0, G_.useFunc)(e.gen, K_.default)}(${r})`;
    e.fail$data((0, Zt._)`${a} ${o} ${n}`);
  }
};
Da.default = B_;
var La = {};
Object.defineProperty(La, "__esModule", { value: !0 });
const W_ = ne, Yn = te, X_ = {
  message: ({ schemaCode: e }) => (0, Yn.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Yn._)`{pattern: ${e}}`
}, J_ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: X_,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: o } = e, a = o.opts.unicodeRegExp ? "u" : "", l = r ? (0, Yn._)`(new RegExp(${s}, ${a}))` : (0, W_.usePattern)(e, n);
    e.fail$data((0, Yn._)`!${l}.test(${t})`);
  }
};
La.default = J_;
var Va = {};
Object.defineProperty(Va, "__esModule", { value: !0 });
const Qr = te, x_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Qr.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Qr._)`{limit: ${e}}`
}, Y_ = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: x_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Qr.operators.GT : Qr.operators.LT;
    e.fail$data((0, Qr._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Va.default = Y_;
var Fa = {};
Object.defineProperty(Fa, "__esModule", { value: !0 });
const zr = ne, en = te, Z_ = L, Q_ = {
  message: ({ params: { missingProperty: e } }) => (0, en.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, en._)`{missingProperty: ${e}}`
}, ev = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Q_,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: o, it: a } = e, { opts: l } = a;
    if (!o && r.length === 0)
      return;
    const i = r.length >= l.loopRequired;
    if (a.allErrors ? d() : u(), l.strictRequired) {
      const _ = e.parentSchema.properties, { definedProperties: v } = e.it;
      for (const y of r)
        if ((_ == null ? void 0 : _[y]) === void 0 && !v.has(y)) {
          const $ = a.schemaEnv.baseId + a.errSchemaPath, m = `required property "${y}" is not defined at "${$}" (strictRequired)`;
          (0, Z_.checkStrictMode)(a, m, a.opts.strictRequired);
        }
    }
    function d() {
      if (i || o)
        e.block$data(en.nil, h);
      else
        for (const _ of r)
          (0, zr.checkReportMissingProp)(e, _);
    }
    function u() {
      const _ = t.let("missing");
      if (i || o) {
        const v = t.let("valid", !0);
        e.block$data(v, () => E(_, v)), e.ok(v);
      } else
        t.if((0, zr.checkMissingProp)(e, r, _)), (0, zr.reportMissingProp)(e, _), t.else();
    }
    function h() {
      t.forOf("prop", n, (_) => {
        e.setParams({ missingProperty: _ }), t.if((0, zr.noPropertyInData)(t, s, _, l.ownProperties), () => e.error());
      });
    }
    function E(_, v) {
      e.setParams({ missingProperty: _ }), t.forOf(_, n, () => {
        t.assign(v, (0, zr.propertyInData)(t, s, _, l.ownProperties)), t.if((0, en.not)(v), () => {
          e.error(), t.break();
        });
      }, en.nil);
    }
  }
};
Fa.default = ev;
var Ua = {};
Object.defineProperty(Ua, "__esModule", { value: !0 });
const tn = te, tv = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, tn.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, tn._)`{limit: ${e}}`
}, rv = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: tv,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? tn.operators.GT : tn.operators.LT;
    e.fail$data((0, tn._)`${r}.length ${s} ${n}`);
  }
};
Ua.default = rv;
var za = {}, un = {};
Object.defineProperty(un, "__esModule", { value: !0 });
const Mu = ss;
Mu.code = 'require("ajv/dist/runtime/equal").default';
un.default = Mu;
Object.defineProperty(za, "__esModule", { value: !0 });
const Cs = ge, we = te, nv = L, sv = un, ov = {
  message: ({ params: { i: e, j: t } }) => (0, we.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, we._)`{i: ${e}, j: ${t}}`
}, av = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: ov,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: o, schemaCode: a, it: l } = e;
    if (!n && !s)
      return;
    const i = t.let("valid"), d = o.items ? (0, Cs.getSchemaTypes)(o.items) : [];
    e.block$data(i, u, (0, we._)`${a} === false`), e.ok(i);
    function u() {
      const v = t.let("i", (0, we._)`${r}.length`), y = t.let("j");
      e.setParams({ i: v, j: y }), t.assign(i, !0), t.if((0, we._)`${v} > 1`, () => (h() ? E : _)(v, y));
    }
    function h() {
      return d.length > 0 && !d.some((v) => v === "object" || v === "array");
    }
    function E(v, y) {
      const $ = t.name("item"), m = (0, Cs.checkDataTypes)(d, $, l.opts.strictNumbers, Cs.DataType.Wrong), w = t.const("indices", (0, we._)`{}`);
      t.for((0, we._)`;${v}--;`, () => {
        t.let($, (0, we._)`${r}[${v}]`), t.if(m, (0, we._)`continue`), d.length > 1 && t.if((0, we._)`typeof ${$} == "string"`, (0, we._)`${$} += "_"`), t.if((0, we._)`typeof ${w}[${$}] == "number"`, () => {
          t.assign(y, (0, we._)`${w}[${$}]`), e.error(), t.assign(i, !1).break();
        }).code((0, we._)`${w}[${$}] = ${v}`);
      });
    }
    function _(v, y) {
      const $ = (0, nv.useFunc)(t, sv.default), m = t.name("outer");
      t.label(m).for((0, we._)`;${v}--;`, () => t.for((0, we._)`${y} = ${v}; ${y}--;`, () => t.if((0, we._)`${$}(${r}[${v}], ${r}[${y}])`, () => {
        e.error(), t.assign(i, !1).break(m);
      })));
    }
  }
};
za.default = av;
var qa = {};
Object.defineProperty(qa, "__esModule", { value: !0 });
const oo = te, iv = L, cv = un, lv = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, oo._)`{allowedValue: ${e}}`
}, uv = {
  keyword: "const",
  $data: !0,
  error: lv,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: o } = e;
    n || o && typeof o == "object" ? e.fail$data((0, oo._)`!${(0, iv.useFunc)(t, cv.default)}(${r}, ${s})`) : e.fail((0, oo._)`${o} !== ${r}`);
  }
};
qa.default = uv;
var Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
const Hr = te, dv = L, fv = un, hv = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Hr._)`{allowedValues: ${e}}`
}, mv = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: hv,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= a.opts.loopEnum;
    let i;
    const d = () => i ?? (i = (0, dv.useFunc)(t, fv.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const _ = t.const("vSchema", o);
      u = (0, Hr.or)(...s.map((v, y) => E(_, y)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", o, (_) => t.if((0, Hr._)`${d()}(${r}, ${_})`, () => t.assign(u, !0).break()));
    }
    function E(_, v) {
      const y = s[v];
      return typeof y == "object" && y !== null ? (0, Hr._)`${d()}(${r}, ${_}[${v}])` : (0, Hr._)`${r} === ${y}`;
    }
  }
};
Ga.default = mv;
Object.defineProperty(ka, "__esModule", { value: !0 });
const pv = Aa, $v = Ca, yv = Da, gv = La, _v = Va, vv = Fa, wv = Ua, Ev = za, Sv = qa, bv = Ga, Pv = [
  // number
  pv.default,
  $v.default,
  // string
  yv.default,
  gv.default,
  // object
  _v.default,
  vv.default,
  // array
  wv.default,
  Ev.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Sv.default,
  bv.default
];
ka.default = Pv;
var Ka = {}, Or = {};
Object.defineProperty(Or, "__esModule", { value: !0 });
Or.validateAdditionalItems = void 0;
const Qt = te, ao = L, Nv = {
  message: ({ params: { len: e } }) => (0, Qt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Qt._)`{limit: ${e}}`
}, Iv = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Nv,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, ao.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Lu(e, n);
  }
};
function Lu(e, t) {
  const { gen: r, schema: n, data: s, keyword: o, it: a } = e;
  a.items = !0;
  const l = r.const("len", (0, Qt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Qt._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, ao.alwaysValidSchema)(a, n)) {
    const d = r.var("valid", (0, Qt._)`${l} <= ${t.length}`);
    r.if((0, Qt.not)(d), () => i(d)), e.ok(d);
  }
  function i(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: o, dataProp: u, dataPropType: ao.Type.Num }, d), a.allErrors || r.if((0, Qt.not)(d), () => r.break());
    });
  }
}
Or.validateAdditionalItems = Lu;
Or.default = Iv;
var Ha = {}, Tr = {};
Object.defineProperty(Tr, "__esModule", { value: !0 });
Tr.validateTuple = void 0;
const dc = te, Vn = L, Rv = ne, Ov = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Vu(e, "additionalItems", t);
    r.items = !0, !(0, Vn.alwaysValidSchema)(r, t) && e.ok((0, Rv.validateArray)(e));
  }
};
function Vu(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: o, keyword: a, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = Vn.mergeEvaluated.items(n, r.length, l.items));
  const i = n.name("valid"), d = n.const("len", (0, dc._)`${o}.length`);
  r.forEach((h, E) => {
    (0, Vn.alwaysValidSchema)(l, h) || (n.if((0, dc._)`${d} > ${E}`, () => e.subschema({
      keyword: a,
      schemaProp: E,
      dataProp: E
    }, i)), e.ok(i));
  });
  function u(h) {
    const { opts: E, errSchemaPath: _ } = l, v = r.length, y = v === h.minItems && (v === h.maxItems || h[t] === !1);
    if (E.strictTuples && !y) {
      const $ = `"${a}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${_}"`;
      (0, Vn.checkStrictMode)(l, $, E.strictTuples);
    }
  }
}
Tr.validateTuple = Vu;
Tr.default = Ov;
Object.defineProperty(Ha, "__esModule", { value: !0 });
const Tv = Tr, jv = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, Tv.validateTuple)(e, "items")
};
Ha.default = jv;
var Ba = {};
Object.defineProperty(Ba, "__esModule", { value: !0 });
const fc = te, kv = L, Av = ne, Cv = Or, Dv = {
  message: ({ params: { len: e } }) => (0, fc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, fc._)`{limit: ${e}}`
}, Mv = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Dv,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, kv.alwaysValidSchema)(n, t) && (s ? (0, Cv.validateAdditionalItems)(e, s) : e.ok((0, Av.validateArray)(e)));
  }
};
Ba.default = Mv;
var Wa = {};
Object.defineProperty(Wa, "__esModule", { value: !0 });
const ze = te, vn = L, Lv = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, ze.str)`must contain at least ${e} valid item(s)` : (0, ze.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, ze._)`{minContains: ${e}}` : (0, ze._)`{minContains: ${e}, maxContains: ${t}}`
}, Vv = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Lv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    let a, l;
    const { minContains: i, maxContains: d } = n;
    o.opts.next ? (a = i === void 0 ? 1 : i, l = d) : a = 1;
    const u = t.const("len", (0, ze._)`${s}.length`);
    if (e.setParams({ min: a, max: l }), l === void 0 && a === 0) {
      (0, vn.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && a > l) {
      (0, vn.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, vn.alwaysValidSchema)(o, r)) {
      let y = (0, ze._)`${u} >= ${a}`;
      l !== void 0 && (y = (0, ze._)`${y} && ${u} <= ${l}`), e.pass(y);
      return;
    }
    o.items = !0;
    const h = t.name("valid");
    l === void 0 && a === 1 ? _(h, () => t.if(h, () => t.break())) : a === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, ze._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const y = t.name("_valid"), $ = t.let("count", 0);
      _(y, () => t.if(y, () => v($)));
    }
    function _(y, $) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: vn.Type.Num,
          compositeRule: !0
        }, y), $();
      });
    }
    function v(y) {
      t.code((0, ze._)`${y}++`), l === void 0 ? t.if((0, ze._)`${y} >= ${a}`, () => t.assign(h, !0).break()) : (t.if((0, ze._)`${y} > ${l}`, () => t.assign(h, !1).break()), a === 1 ? t.assign(h, !0) : t.if((0, ze._)`${y} >= ${a}`, () => t.assign(h, !0)));
    }
  }
};
Wa.default = Vv;
var Fu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = te, r = L, n = ne;
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
    const _ = u.let("missing");
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
      }) : (u.if((0, t._)`${$} && (${(0, n.checkMissingProp)(i, y, _)})`), (0, n.reportMissingProp)(i, _), u.else());
    }
  }
  e.validatePropertyDeps = a;
  function l(i, d = i.schema) {
    const { gen: u, data: h, keyword: E, it: _ } = i, v = u.name("valid");
    for (const y in d)
      (0, r.alwaysValidSchema)(_, d[y]) || (u.if(
        (0, n.propertyInData)(u, h, y, _.opts.ownProperties),
        () => {
          const $ = i.subschema({ keyword: E, schemaProp: y }, v);
          i.mergeValidEvaluated($, v);
        },
        () => u.var(v, !0)
        // TODO var
      ), i.ok(v));
  }
  e.validateSchemaDeps = l, e.default = s;
})(Fu);
var Xa = {};
Object.defineProperty(Xa, "__esModule", { value: !0 });
const Uu = te, Fv = L, Uv = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Uu._)`{propertyName: ${e.propertyName}}`
}, zv = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Uv,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Fv.alwaysValidSchema)(s, r))
      return;
    const o = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, o), t.if((0, Uu.not)(o), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
Xa.default = zv;
var ms = {};
Object.defineProperty(ms, "__esModule", { value: !0 });
const wn = ne, Be = te, qv = ot, En = L, Gv = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Be._)`{additionalProperty: ${e.additionalProperty}}`
}, Kv = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Gv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: o, it: a } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: i } = a;
    if (a.props = !0, i.removeAdditional !== "all" && (0, En.alwaysValidSchema)(a, r))
      return;
    const d = (0, wn.allSchemaProperties)(n.properties), u = (0, wn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Be._)`${o} === ${qv.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !u.length ? v($) : t.if(E($), () => v($));
      });
    }
    function E($) {
      let m;
      if (d.length > 8) {
        const w = (0, En.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, wn.isOwnProperty)(t, w, $);
      } else d.length ? m = (0, Be.or)(...d.map((w) => (0, Be._)`${$} === ${w}`)) : m = Be.nil;
      return u.length && (m = (0, Be.or)(m, ...u.map((w) => (0, Be._)`${(0, wn.usePattern)(e, w)}.test(${$})`))), (0, Be.not)(m);
    }
    function _($) {
      t.code((0, Be._)`delete ${s}[${$}]`);
    }
    function v($) {
      if (i.removeAdditional === "all" || i.removeAdditional && r === !1) {
        _($);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: $ }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, En.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        i.removeAdditional === "failing" ? (y($, m, !1), t.if((0, Be.not)(m), () => {
          e.reset(), _($);
        })) : (y($, m), l || t.if((0, Be.not)(m), () => t.break()));
      }
    }
    function y($, m, w) {
      const P = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: En.Type.Str
      };
      w === !1 && Object.assign(P, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(P, m);
    }
  }
};
ms.default = Kv;
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
const Hv = xe, hc = ne, Ds = L, mc = ms, Bv = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && mc.default.code(new Hv.KeywordCxt(o, mc.default, "additionalProperties"));
    const a = (0, hc.allSchemaProperties)(r);
    for (const h of a)
      o.definedProperties.add(h);
    o.opts.unevaluated && a.length && o.props !== !0 && (o.props = Ds.mergeEvaluated.props(t, (0, Ds.toHash)(a), o.props));
    const l = a.filter((h) => !(0, Ds.alwaysValidSchema)(o, r[h]));
    if (l.length === 0)
      return;
    const i = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, hc.propertyInData)(t, s, h, o.opts.ownProperties)), u(h), o.allErrors || t.else().var(i, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(i);
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
Ja.default = Bv;
var xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
const pc = ne, Sn = te, $c = L, yc = L, Wv = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: o } = e, { opts: a } = o, l = (0, pc.allSchemaProperties)(r), i = l.filter((y) => (0, $c.alwaysValidSchema)(o, r[y]));
    if (l.length === 0 || i.length === l.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const d = a.strictSchema && !a.allowMatchingProperties && s.properties, u = t.name("valid");
    o.props !== !0 && !(o.props instanceof Sn.Name) && (o.props = (0, yc.evaluatedPropsToName)(t, o.props));
    const { props: h } = o;
    E();
    function E() {
      for (const y of l)
        d && _(y), o.allErrors ? v(y) : (t.var(u, !0), v(y), t.if(u));
    }
    function _(y) {
      for (const $ in d)
        new RegExp(y).test($) && (0, $c.checkStrictMode)(o, `property ${$} matches pattern ${y} (use allowMatchingProperties)`);
    }
    function v(y) {
      t.forIn("key", n, ($) => {
        t.if((0, Sn._)`${(0, pc.usePattern)(e, y)}.test(${$})`, () => {
          const m = i.includes(y);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: y,
            dataProp: $,
            dataPropType: yc.Type.Str
          }, u), o.opts.unevaluated && h !== !0 ? t.assign((0, Sn._)`${h}[${$}]`, !0) : !m && !o.allErrors && t.if((0, Sn.not)(u), () => t.break());
        });
      });
    }
  }
};
xa.default = Wv;
var Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
const Xv = L, Jv = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Xv.alwaysValidSchema)(n, r)) {
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
Ya.default = Jv;
var Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
const xv = ne, Yv = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: xv.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Za.default = Yv;
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
const Fn = te, Zv = L, Qv = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Fn._)`{passingSchemas: ${e.passing}}`
}, ew = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Qv,
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
        (0, Zv.alwaysValidSchema)(s, u) ? t.var(i, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, i), h > 0 && t.if((0, Fn._)`${i} && ${a}`).assign(a, !1).assign(l, (0, Fn._)`[${l}, ${h}]`).else(), t.if(i, () => {
          t.assign(a, !0), t.assign(l, h), E && e.mergeEvaluated(E, Fn.Name);
        });
      });
    }
  }
};
Qa.default = ew;
var ei = {};
Object.defineProperty(ei, "__esModule", { value: !0 });
const tw = L, rw = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((o, a) => {
      if ((0, tw.alwaysValidSchema)(n, o))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: a }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
ei.default = rw;
var ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
const Zn = te, zu = L, nw = {
  message: ({ params: e }) => (0, Zn.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Zn._)`{failingKeyword: ${e.ifClause}}`
}, sw = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: nw,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, zu.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = gc(n, "then"), o = gc(n, "else");
    if (!s && !o)
      return;
    const a = t.let("valid", !0), l = t.name("_valid");
    if (i(), e.reset(), s && o) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, Zn.not)(l), d("else"));
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
        t.assign(a, l), e.mergeValidEvaluated(E, a), h ? t.assign(h, (0, Zn._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function gc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, zu.alwaysValidSchema)(e, r);
}
ti.default = sw;
var ri = {};
Object.defineProperty(ri, "__esModule", { value: !0 });
const ow = L, aw = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, ow.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
ri.default = aw;
Object.defineProperty(Ka, "__esModule", { value: !0 });
const iw = Or, cw = Ha, lw = Tr, uw = Ba, dw = Wa, fw = Fu, hw = Xa, mw = ms, pw = Ja, $w = xa, yw = Ya, gw = Za, _w = Qa, vw = ei, ww = ti, Ew = ri;
function Sw(e = !1) {
  const t = [
    // any
    yw.default,
    gw.default,
    _w.default,
    vw.default,
    ww.default,
    Ew.default,
    // object
    hw.default,
    mw.default,
    fw.default,
    pw.default,
    $w.default
  ];
  return e ? t.push(cw.default, uw.default) : t.push(iw.default, lw.default), t.push(dw.default), t;
}
Ka.default = Sw;
var ni = {}, si = {};
Object.defineProperty(si, "__esModule", { value: !0 });
const $e = te, bw = {
  message: ({ schemaCode: e }) => (0, $e.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, $e._)`{format: ${e}}`
}, Pw = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: bw,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: o, schemaCode: a, it: l } = e, { opts: i, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!i.validateFormats)
      return;
    s ? E() : _();
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
    function _() {
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
        const V = R instanceof RegExp ? (0, $e.regexpCode)(R) : i.code.formats ? (0, $e._)`${i.code.formats}${(0, $e.getProperty)(o)}` : void 0, W = r.scopeValue("formats", { key: o, ref: R, code: V });
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
si.default = Pw;
Object.defineProperty(ni, "__esModule", { value: !0 });
const Nw = si, Iw = [Nw.default];
ni.default = Iw;
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
Object.defineProperty(Oa, "__esModule", { value: !0 });
const Rw = Ta, Ow = ka, Tw = Ka, jw = ni, _c = Er, kw = [
  Rw.default,
  Ow.default,
  (0, Tw.default)(),
  jw.default,
  _c.metadataVocabulary,
  _c.contentVocabulary
];
Oa.default = kw;
var oi = {}, ps = {};
Object.defineProperty(ps, "__esModule", { value: !0 });
ps.DiscrError = void 0;
var vc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(vc || (ps.DiscrError = vc = {}));
Object.defineProperty(oi, "__esModule", { value: !0 });
const hr = te, io = ps, wc = De, Aw = Rr, Cw = L, Dw = {
  message: ({ params: { discrError: e, tagName: t } }) => e === io.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, hr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, Mw = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Dw,
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
    const i = t.let("valid", !1), d = t.const("tag", (0, hr._)`${r}${(0, hr.getProperty)(l)}`);
    t.if((0, hr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: io.DiscrError.Tag, tag: d, tagName: l })), e.ok(i);
    function u() {
      const _ = E();
      t.if(!1);
      for (const v in _)
        t.elseIf((0, hr._)`${d} === ${v}`), t.assign(i, h(_[v]));
      t.else(), e.error(!1, { discrError: io.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(_) {
      const v = t.name("valid"), y = e.subschema({ keyword: "oneOf", schemaProp: _ }, v);
      return e.mergeEvaluated(y, hr.Name), v;
    }
    function E() {
      var _;
      const v = {}, y = m(s);
      let $ = !0;
      for (let I = 0; I < a.length; I++) {
        let R = a[I];
        if (R != null && R.$ref && !(0, Cw.schemaHasRulesButRef)(R, o.self.RULES)) {
          const W = R.$ref;
          if (R = wc.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, W), R instanceof wc.SchemaEnv && (R = R.schema), R === void 0)
            throw new Aw.default(o.opts.uriResolver, o.baseId, W);
        }
        const V = (_ = R == null ? void 0 : R.properties) === null || _ === void 0 ? void 0 : _[l];
        if (typeof V != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        $ = $ && (y || m(R)), w(V, I);
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
          for (const V of I.enum)
            P(V, R);
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
oi.default = Mw;
const Lw = "http://json-schema.org/draft-07/schema#", Vw = "http://json-schema.org/draft-07/schema#", Fw = "Core schema meta-schema", Uw = {
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
}, zw = [
  "object",
  "boolean"
], qw = {
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
}, Gw = {
  $schema: Lw,
  $id: Vw,
  title: Fw,
  definitions: Uw,
  type: zw,
  properties: qw,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = tu, n = Oa, s = oi, o = Gw, a = ["/properties"], l = "http://json-schema.org/draft-07/schema";
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
  var d = xe;
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
  var h = ln;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var E = Rr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return E.default;
  } });
})(eo, eo.exports);
var Kw = eo.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = Kw, r = te, n = r.operators, s = {
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
      const { gen: i, data: d, schemaCode: u, keyword: h, it: E } = l, { opts: _, self: v } = E;
      if (!_.validateFormats)
        return;
      const y = new t.KeywordCxt(E, v.RULES.all.format.definition, "format");
      y.$data ? $() : m();
      function $() {
        const P = i.scopeValue("formats", {
          ref: v.formats,
          code: _.code.formats
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
          code: _.code.formats ? (0, r._)`${_.code.formats}${(0, r.getProperty)(P)}` : void 0
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
})(eu);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = Ql, n = eu, s = te, o = new s.Name("fullFormats"), a = new s.Name("fastFormats"), l = (d, u = { keywords: !0 }) => {
    if (Array.isArray(u))
      return i(d, u, r.fullFormats, o), d;
    const [h, E] = u.mode === "fast" ? [r.fastFormats, a] : [r.fullFormats, o], _ = u.formats || r.formatNames;
    return i(d, _, h, E), u.keywords && (0, n.default)(d), d;
  };
  l.get = (d, u = "full") => {
    const E = (u === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!E)
      throw new Error(`Unknown format "${d}"`);
    return E;
  };
  function i(d, u, h, E) {
    var _, v;
    (_ = (v = d.opts.code).formats) !== null && _ !== void 0 || (v.formats = (0, s._)`require("ajv-formats/dist/formats").${E}`);
    for (const y of u)
      d.addFormat(y, h[y]);
  }
  e.exports = t = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
})(Qs, Qs.exports);
var Hw = Qs.exports;
const Bw = /* @__PURE__ */ tl(Hw), Ww = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), o = Object.getOwnPropertyDescriptor(t, r);
  !Xw(s, o) && n || Object.defineProperty(e, r, o);
}, Xw = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, Jw = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, xw = (e, t) => `/* Wrapped ${e}*/
${t}`, Yw = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), Zw = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), Qw = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = xw.bind(null, n, t.toString());
  Object.defineProperty(s, "name", Zw);
  const { writable: o, enumerable: a, configurable: l } = Yw;
  Object.defineProperty(e, "toString", { value: s, writable: o, enumerable: a, configurable: l });
};
function eE(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    Ww(e, t, s, r);
  return Jw(e, t), Qw(e, t, n), e;
}
const Ec = (e, t = {}) => {
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
    }, _ = () => {
      l = void 0, a && (clearTimeout(a), a = void 0), o && (i = e.apply(h, u));
    }, v = s && !a;
    return clearTimeout(a), a = setTimeout(E, r), n > 0 && n !== Number.POSITIVE_INFINITY && !l && (l = setTimeout(_, n)), v && (i = e.apply(h, u)), i;
  };
  return eE(d, e), d.cancel = () => {
    a && (clearTimeout(a), a = void 0), l && (clearTimeout(l), l = void 0);
  }, d;
};
var co = { exports: {} };
const tE = "2.0.0", qu = 256, rE = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, nE = 16, sE = qu - 6, oE = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var $s = {
  MAX_LENGTH: qu,
  MAX_SAFE_COMPONENT_LENGTH: nE,
  MAX_SAFE_BUILD_LENGTH: sE,
  MAX_SAFE_INTEGER: rE,
  RELEASE_TYPES: oE,
  SEMVER_SPEC_VERSION: tE,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const aE = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var ys = aE;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = $s, o = ys;
  t = e.exports = {};
  const a = t.re = [], l = t.safeRe = [], i = t.src = [], d = t.safeSrc = [], u = t.t = {};
  let h = 0;
  const E = "[a-zA-Z0-9-]", _ = [
    ["\\s", 1],
    ["\\d", s],
    [E, n]
  ], v = ($) => {
    for (const [m, w] of _)
      $ = $.split(`${m}*`).join(`${m}{0,${w}}`).split(`${m}+`).join(`${m}{1,${w}}`);
    return $;
  }, y = ($, m, w) => {
    const P = v(m), I = h++;
    o($, I, m), u[$] = I, i[I] = m, d[I] = P, a[I] = new RegExp(m, w ? "g" : void 0), l[I] = new RegExp(P, w ? "g" : void 0);
  };
  y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${E}*`), y("MAINVERSION", `(${i[u.NUMERICIDENTIFIER]})\\.(${i[u.NUMERICIDENTIFIER]})\\.(${i[u.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${i[u.NUMERICIDENTIFIERLOOSE]})\\.(${i[u.NUMERICIDENTIFIERLOOSE]})\\.(${i[u.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${i[u.NONNUMERICIDENTIFIER]}|${i[u.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${i[u.NONNUMERICIDENTIFIER]}|${i[u.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${i[u.PRERELEASEIDENTIFIER]}(?:\\.${i[u.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${i[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${i[u.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${E}+`), y("BUILD", `(?:\\+(${i[u.BUILDIDENTIFIER]}(?:\\.${i[u.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${i[u.MAINVERSION]}${i[u.PRERELEASE]}?${i[u.BUILD]}?`), y("FULL", `^${i[u.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${i[u.MAINVERSIONLOOSE]}${i[u.PRERELEASELOOSE]}?${i[u.BUILD]}?`), y("LOOSE", `^${i[u.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${i[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${i[u.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${i[u.XRANGEIDENTIFIER]})(?:\\.(${i[u.XRANGEIDENTIFIER]})(?:\\.(${i[u.XRANGEIDENTIFIER]})(?:${i[u.PRERELEASE]})?${i[u.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${i[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${i[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${i[u.XRANGEIDENTIFIERLOOSE]})(?:${i[u.PRERELEASELOOSE]})?${i[u.BUILD]}?)?)?`), y("XRANGE", `^${i[u.GTLT]}\\s*${i[u.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${i[u.GTLT]}\\s*${i[u.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), y("COERCE", `${i[u.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", i[u.COERCEPLAIN] + `(?:${i[u.PRERELEASE]})?(?:${i[u.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", i[u.COERCE], !0), y("COERCERTLFULL", i[u.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${i[u.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", y("TILDE", `^${i[u.LONETILDE]}${i[u.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${i[u.LONETILDE]}${i[u.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${i[u.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", y("CARET", `^${i[u.LONECARET]}${i[u.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${i[u.LONECARET]}${i[u.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${i[u.GTLT]}\\s*(${i[u.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${i[u.GTLT]}\\s*(${i[u.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${i[u.GTLT]}\\s*(${i[u.LOOSEPLAIN]}|${i[u.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${i[u.XRANGEPLAIN]})\\s+-\\s+(${i[u.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${i[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${i[u.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(co, co.exports);
var dn = co.exports;
const iE = Object.freeze({ loose: !0 }), cE = Object.freeze({}), lE = (e) => e ? typeof e != "object" ? iE : e : cE;
var ai = lE;
const Sc = /^[0-9]+$/, Gu = (e, t) => {
  const r = Sc.test(e), n = Sc.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, uE = (e, t) => Gu(t, e);
var Ku = {
  compareIdentifiers: Gu,
  rcompareIdentifiers: uE
};
const bn = ys, { MAX_LENGTH: bc, MAX_SAFE_INTEGER: Pn } = $s, { safeRe: Nn, t: In } = dn, dE = ai, { compareIdentifiers: lr } = Ku;
let fE = class Qe {
  constructor(t, r) {
    if (r = dE(r), t instanceof Qe) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > bc)
      throw new TypeError(
        `version is longer than ${bc} characters`
      );
    bn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Nn[In.LOOSE] : Nn[In.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Pn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Pn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Pn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const o = +s;
        if (o >= 0 && o < Pn)
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
    if (bn("SemVer.compare", this.version, this.options, t), !(t instanceof Qe)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new Qe(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof Qe || (t = new Qe(t, this.options)), lr(this.major, t.major) || lr(this.minor, t.minor) || lr(this.patch, t.patch);
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
      if (bn("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return lr(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof Qe || (t = new Qe(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (bn("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return lr(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? Nn[In.PRERELEASELOOSE] : Nn[In.PRERELEASE]);
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
          n === !1 && (o = [r]), lr(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var ke = fE;
const Pc = ke, hE = (e, t, r = !1) => {
  if (e instanceof Pc)
    return e;
  try {
    return new Pc(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var jr = hE;
const mE = jr, pE = (e, t) => {
  const r = mE(e, t);
  return r ? r.version : null;
};
var $E = pE;
const yE = jr, gE = (e, t) => {
  const r = yE(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var _E = gE;
const Nc = ke, vE = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Nc(
      e instanceof Nc ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var wE = vE;
const Ic = jr, EE = (e, t) => {
  const r = Ic(e, null, !0), n = Ic(t, null, !0), s = r.compare(n);
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
var SE = EE;
const bE = ke, PE = (e, t) => new bE(e, t).major;
var NE = PE;
const IE = ke, RE = (e, t) => new IE(e, t).minor;
var OE = RE;
const TE = ke, jE = (e, t) => new TE(e, t).patch;
var kE = jE;
const AE = jr, CE = (e, t) => {
  const r = AE(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var DE = CE;
const Rc = ke, ME = (e, t, r) => new Rc(e, r).compare(new Rc(t, r));
var Ye = ME;
const LE = Ye, VE = (e, t, r) => LE(t, e, r);
var FE = VE;
const UE = Ye, zE = (e, t) => UE(e, t, !0);
var qE = zE;
const Oc = ke, GE = (e, t, r) => {
  const n = new Oc(e, r), s = new Oc(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var ii = GE;
const KE = ii, HE = (e, t) => e.sort((r, n) => KE(r, n, t));
var BE = HE;
const WE = ii, XE = (e, t) => e.sort((r, n) => WE(n, r, t));
var JE = XE;
const xE = Ye, YE = (e, t, r) => xE(e, t, r) > 0;
var gs = YE;
const ZE = Ye, QE = (e, t, r) => ZE(e, t, r) < 0;
var ci = QE;
const e1 = Ye, t1 = (e, t, r) => e1(e, t, r) === 0;
var Hu = t1;
const r1 = Ye, n1 = (e, t, r) => r1(e, t, r) !== 0;
var Bu = n1;
const s1 = Ye, o1 = (e, t, r) => s1(e, t, r) >= 0;
var li = o1;
const a1 = Ye, i1 = (e, t, r) => a1(e, t, r) <= 0;
var ui = i1;
const c1 = Hu, l1 = Bu, u1 = gs, d1 = li, f1 = ci, h1 = ui, m1 = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return c1(e, r, n);
    case "!=":
      return l1(e, r, n);
    case ">":
      return u1(e, r, n);
    case ">=":
      return d1(e, r, n);
    case "<":
      return f1(e, r, n);
    case "<=":
      return h1(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Wu = m1;
const p1 = ke, $1 = jr, { safeRe: Rn, t: On } = dn, y1 = (e, t) => {
  if (e instanceof p1)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Rn[On.COERCEFULL] : Rn[On.COERCE]);
  else {
    const i = t.includePrerelease ? Rn[On.COERCERTLFULL] : Rn[On.COERCERTL];
    let d;
    for (; (d = i.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), i.lastIndex = d.index + d[1].length + d[2].length;
    i.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", o = r[4] || "0", a = t.includePrerelease && r[5] ? `-${r[5]}` : "", l = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return $1(`${n}.${s}.${o}${a}${l}`, t);
};
var g1 = y1;
class _1 {
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
var v1 = _1, Ms, Tc;
function Ze() {
  if (Tc) return Ms;
  Tc = 1;
  const e = /\s+/g;
  class t {
    constructor(k, F) {
      if (F = s(F), k instanceof t)
        return k.loose === !!F.loose && k.includePrerelease === !!F.includePrerelease ? k : new t(k.raw, F);
      if (k instanceof o)
        return this.raw = k.value, this.set = [[k]], this.formatted = void 0, this;
      if (this.options = F, this.loose = !!F.loose, this.includePrerelease = !!F.includePrerelease, this.raw = k.trim().replace(e, " "), this.set = this.raw.split("||").map((D) => this.parseRange(D.trim())).filter((D) => D.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const D = this.set[0];
        if (this.set = this.set.filter((K) => !y(K[0])), this.set.length === 0)
          this.set = [D];
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
          const F = this.set[k];
          for (let D = 0; D < F.length; D++)
            D > 0 && (this.formatted += " "), this.formatted += F[D].toString().trim();
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
      const D = ((this.options.includePrerelease && _) | (this.options.loose && v)) + ":" + k, K = n.get(D);
      if (K)
        return K;
      const M = this.options.loose, N = M ? i[d.HYPHENRANGELOOSE] : i[d.HYPHENRANGE];
      k = k.replace(N, z(this.options.includePrerelease)), a("hyphen replace", k), k = k.replace(i[d.COMPARATORTRIM], u), a("comparator trim", k), k = k.replace(i[d.TILDETRIM], h), a("tilde trim", k), k = k.replace(i[d.CARETTRIM], E), a("caret trim", k);
      let p = k.split(" ").map((f) => w(f, this.options)).join(" ").split(/\s+/).map((f) => C(f, this.options));
      M && (p = p.filter((f) => (a("loose invalid filter", f, this.options), !!f.match(i[d.COMPARATORLOOSE])))), a("range list", p);
      const b = /* @__PURE__ */ new Map(), g = p.map((f) => new o(f, this.options));
      for (const f of g) {
        if (y(f))
          return [f];
        b.set(f.value, f);
      }
      b.size > 1 && b.has("") && b.delete("");
      const c = [...b.values()];
      return n.set(D, c), c;
    }
    intersects(k, F) {
      if (!(k instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((D) => m(D, F) && k.set.some((K) => m(K, F) && D.every((M) => K.every((N) => M.intersects(N, F)))));
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
      for (let F = 0; F < this.set.length; F++)
        if (se(this.set[F], k, this.options))
          return !0;
      return !1;
    }
  }
  Ms = t;
  const r = v1, n = new r(), s = ai, o = _s(), a = ys, l = ke, {
    safeRe: i,
    t: d,
    comparatorTrimReplace: u,
    tildeTrimReplace: h,
    caretTrimReplace: E
  } = dn, { FLAG_INCLUDE_PRERELEASE: _, FLAG_LOOSE: v } = $s, y = (O) => O.value === "<0.0.0-0", $ = (O) => O.value === "", m = (O, k) => {
    let F = !0;
    const D = O.slice();
    let K = D.pop();
    for (; F && D.length; )
      F = D.every((M) => K.intersects(M, k)), K = D.pop();
    return F;
  }, w = (O, k) => (a("comp", O, k), O = V(O, k), a("caret", O), O = I(O, k), a("tildes", O), O = Y(O, k), a("xrange", O), O = ae(O, k), a("stars", O), O), P = (O) => !O || O.toLowerCase() === "x" || O === "*", I = (O, k) => O.trim().split(/\s+/).map((F) => R(F, k)).join(" "), R = (O, k) => {
    const F = k.loose ? i[d.TILDELOOSE] : i[d.TILDE];
    return O.replace(F, (D, K, M, N, p) => {
      a("tilde", O, D, K, M, N, p);
      let b;
      return P(K) ? b = "" : P(M) ? b = `>=${K}.0.0 <${+K + 1}.0.0-0` : P(N) ? b = `>=${K}.${M}.0 <${K}.${+M + 1}.0-0` : p ? (a("replaceTilde pr", p), b = `>=${K}.${M}.${N}-${p} <${K}.${+M + 1}.0-0`) : b = `>=${K}.${M}.${N} <${K}.${+M + 1}.0-0`, a("tilde return", b), b;
    });
  }, V = (O, k) => O.trim().split(/\s+/).map((F) => W(F, k)).join(" "), W = (O, k) => {
    a("caret", O, k);
    const F = k.loose ? i[d.CARETLOOSE] : i[d.CARET], D = k.includePrerelease ? "-0" : "";
    return O.replace(F, (K, M, N, p, b) => {
      a("caret", O, K, M, N, p, b);
      let g;
      return P(M) ? g = "" : P(N) ? g = `>=${M}.0.0${D} <${+M + 1}.0.0-0` : P(p) ? M === "0" ? g = `>=${M}.${N}.0${D} <${M}.${+N + 1}.0-0` : g = `>=${M}.${N}.0${D} <${+M + 1}.0.0-0` : b ? (a("replaceCaret pr", b), M === "0" ? N === "0" ? g = `>=${M}.${N}.${p}-${b} <${M}.${N}.${+p + 1}-0` : g = `>=${M}.${N}.${p}-${b} <${M}.${+N + 1}.0-0` : g = `>=${M}.${N}.${p}-${b} <${+M + 1}.0.0-0`) : (a("no pr"), M === "0" ? N === "0" ? g = `>=${M}.${N}.${p}${D} <${M}.${N}.${+p + 1}-0` : g = `>=${M}.${N}.${p}${D} <${M}.${+N + 1}.0-0` : g = `>=${M}.${N}.${p} <${+M + 1}.0.0-0`), a("caret return", g), g;
    });
  }, Y = (O, k) => (a("replaceXRanges", O, k), O.split(/\s+/).map((F) => ie(F, k)).join(" ")), ie = (O, k) => {
    O = O.trim();
    const F = k.loose ? i[d.XRANGELOOSE] : i[d.XRANGE];
    return O.replace(F, (D, K, M, N, p, b) => {
      a("xRange", O, D, K, M, N, p, b);
      const g = P(M), c = g || P(N), f = c || P(p), S = f;
      return K === "=" && S && (K = ""), b = k.includePrerelease ? "-0" : "", g ? K === ">" || K === "<" ? D = "<0.0.0-0" : D = "*" : K && S ? (c && (N = 0), p = 0, K === ">" ? (K = ">=", c ? (M = +M + 1, N = 0, p = 0) : (N = +N + 1, p = 0)) : K === "<=" && (K = "<", c ? M = +M + 1 : N = +N + 1), K === "<" && (b = "-0"), D = `${K + M}.${N}.${p}${b}`) : c ? D = `>=${M}.0.0${b} <${+M + 1}.0.0-0` : f && (D = `>=${M}.${N}.0${b} <${M}.${+N + 1}.0-0`), a("xRange return", D), D;
    });
  }, ae = (O, k) => (a("replaceStars", O, k), O.trim().replace(i[d.STAR], "")), C = (O, k) => (a("replaceGTE0", O, k), O.trim().replace(i[k.includePrerelease ? d.GTE0PRE : d.GTE0], "")), z = (O) => (k, F, D, K, M, N, p, b, g, c, f, S) => (P(D) ? F = "" : P(K) ? F = `>=${D}.0.0${O ? "-0" : ""}` : P(M) ? F = `>=${D}.${K}.0${O ? "-0" : ""}` : N ? F = `>=${F}` : F = `>=${F}${O ? "-0" : ""}`, P(g) ? b = "" : P(c) ? b = `<${+g + 1}.0.0-0` : P(f) ? b = `<${g}.${+c + 1}.0-0` : S ? b = `<=${g}.${c}.${f}-${S}` : O ? b = `<${g}.${c}.${+f + 1}-0` : b = `<=${b}`, `${F} ${b}`.trim()), se = (O, k, F) => {
    for (let D = 0; D < O.length; D++)
      if (!O[D].test(k))
        return !1;
    if (k.prerelease.length && !F.includePrerelease) {
      for (let D = 0; D < O.length; D++)
        if (a(O[D].semver), O[D].semver !== o.ANY && O[D].semver.prerelease.length > 0) {
          const K = O[D].semver;
          if (K.major === k.major && K.minor === k.minor && K.patch === k.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Ms;
}
var Ls, jc;
function _s() {
  if (jc) return Ls;
  jc = 1;
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
  Ls = t;
  const r = ai, { safeRe: n, t: s } = dn, o = Wu, a = ys, l = ke, i = Ze();
  return Ls;
}
const w1 = Ze(), E1 = (e, t, r) => {
  try {
    t = new w1(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var vs = E1;
const S1 = Ze(), b1 = (e, t) => new S1(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var P1 = b1;
const N1 = ke, I1 = Ze(), R1 = (e, t, r) => {
  let n = null, s = null, o = null;
  try {
    o = new I1(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || s.compare(a) === -1) && (n = a, s = new N1(n, r));
  }), n;
};
var O1 = R1;
const T1 = ke, j1 = Ze(), k1 = (e, t, r) => {
  let n = null, s = null, o = null;
  try {
    o = new j1(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || s.compare(a) === 1) && (n = a, s = new T1(n, r));
  }), n;
};
var A1 = k1;
const Vs = ke, C1 = Ze(), kc = gs, D1 = (e, t) => {
  e = new C1(e, t);
  let r = new Vs("0.0.0");
  if (e.test(r) || (r = new Vs("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let o = null;
    s.forEach((a) => {
      const l = new Vs(a.semver.version);
      switch (a.operator) {
        case ">":
          l.prerelease.length === 0 ? l.patch++ : l.prerelease.push(0), l.raw = l.format();
        case "":
        case ">=":
          (!o || kc(l, o)) && (o = l);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!r || kc(r, o)) && (r = o);
  }
  return r && e.test(r) ? r : null;
};
var M1 = D1;
const L1 = Ze(), V1 = (e, t) => {
  try {
    return new L1(e, t).range || "*";
  } catch {
    return null;
  }
};
var F1 = V1;
const U1 = ke, Xu = _s(), { ANY: z1 } = Xu, q1 = Ze(), G1 = vs, Ac = gs, Cc = ci, K1 = ui, H1 = li, B1 = (e, t, r, n) => {
  e = new U1(e, n), t = new q1(t, n);
  let s, o, a, l, i;
  switch (r) {
    case ">":
      s = Ac, o = K1, a = Cc, l = ">", i = ">=";
      break;
    case "<":
      s = Cc, o = H1, a = Ac, l = "<", i = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (G1(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const u = t.set[d];
    let h = null, E = null;
    if (u.forEach((_) => {
      _.semver === z1 && (_ = new Xu(">=0.0.0")), h = h || _, E = E || _, s(_.semver, h.semver, n) ? h = _ : a(_.semver, E.semver, n) && (E = _);
    }), h.operator === l || h.operator === i || (!E.operator || E.operator === l) && o(e, E.semver))
      return !1;
    if (E.operator === i && a(e, E.semver))
      return !1;
  }
  return !0;
};
var di = B1;
const W1 = di, X1 = (e, t, r) => W1(e, t, ">", r);
var J1 = X1;
const x1 = di, Y1 = (e, t, r) => x1(e, t, "<", r);
var Z1 = Y1;
const Dc = Ze(), Q1 = (e, t, r) => (e = new Dc(e, r), t = new Dc(t, r), e.intersects(t, r));
var eS = Q1;
const tS = vs, rS = Ye;
var nS = (e, t, r) => {
  const n = [];
  let s = null, o = null;
  const a = e.sort((u, h) => rS(u, h, r));
  for (const u of a)
    tS(u, t, r) ? (o = u, s || (s = u)) : (o && n.push([s, o]), o = null, s = null);
  s && n.push([s, null]);
  const l = [];
  for (const [u, h] of n)
    u === h ? l.push(u) : !h && u === a[0] ? l.push("*") : h ? u === a[0] ? l.push(`<=${h}`) : l.push(`${u} - ${h}`) : l.push(`>=${u}`);
  const i = l.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return i.length < d.length ? i : t;
};
const Mc = Ze(), fi = _s(), { ANY: Fs } = fi, qr = vs, hi = Ye, sS = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Mc(e, r), t = new Mc(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const o of t.set) {
      const a = aS(s, o, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, oS = [new fi(">=0.0.0-0")], Lc = [new fi(">=0.0.0")], aS = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Fs) {
    if (t.length === 1 && t[0].semver === Fs)
      return !0;
    r.includePrerelease ? e = oS : e = Lc;
  }
  if (t.length === 1 && t[0].semver === Fs) {
    if (r.includePrerelease)
      return !0;
    t = Lc;
  }
  const n = /* @__PURE__ */ new Set();
  let s, o;
  for (const _ of e)
    _.operator === ">" || _.operator === ">=" ? s = Vc(s, _, r) : _.operator === "<" || _.operator === "<=" ? o = Fc(o, _, r) : n.add(_.semver);
  if (n.size > 1)
    return null;
  let a;
  if (s && o) {
    if (a = hi(s.semver, o.semver, r), a > 0)
      return null;
    if (a === 0 && (s.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const _ of n) {
    if (s && !qr(_, String(s), r) || o && !qr(_, String(o), r))
      return null;
    for (const v of t)
      if (!qr(_, String(v), r))
        return !1;
    return !0;
  }
  let l, i, d, u, h = o && !r.includePrerelease && o.semver.prerelease.length ? o.semver : !1, E = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && o.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const _ of t) {
    if (u = u || _.operator === ">" || _.operator === ">=", d = d || _.operator === "<" || _.operator === "<=", s) {
      if (E && _.semver.prerelease && _.semver.prerelease.length && _.semver.major === E.major && _.semver.minor === E.minor && _.semver.patch === E.patch && (E = !1), _.operator === ">" || _.operator === ">=") {
        if (l = Vc(s, _, r), l === _ && l !== s)
          return !1;
      } else if (s.operator === ">=" && !qr(s.semver, String(_), r))
        return !1;
    }
    if (o) {
      if (h && _.semver.prerelease && _.semver.prerelease.length && _.semver.major === h.major && _.semver.minor === h.minor && _.semver.patch === h.patch && (h = !1), _.operator === "<" || _.operator === "<=") {
        if (i = Fc(o, _, r), i === _ && i !== o)
          return !1;
      } else if (o.operator === "<=" && !qr(o.semver, String(_), r))
        return !1;
    }
    if (!_.operator && (o || s) && a !== 0)
      return !1;
  }
  return !(s && d && !o && a !== 0 || o && u && !s && a !== 0 || E || h);
}, Vc = (e, t, r) => {
  if (!e)
    return t;
  const n = hi(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Fc = (e, t, r) => {
  if (!e)
    return t;
  const n = hi(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var iS = sS;
const Us = dn, Uc = $s, cS = ke, zc = Ku, lS = jr, uS = $E, dS = _E, fS = wE, hS = SE, mS = NE, pS = OE, $S = kE, yS = DE, gS = Ye, _S = FE, vS = qE, wS = ii, ES = BE, SS = JE, bS = gs, PS = ci, NS = Hu, IS = Bu, RS = li, OS = ui, TS = Wu, jS = g1, kS = _s(), AS = Ze(), CS = vs, DS = P1, MS = O1, LS = A1, VS = M1, FS = F1, US = di, zS = J1, qS = Z1, GS = eS, KS = nS, HS = iS;
var BS = {
  parse: lS,
  valid: uS,
  clean: dS,
  inc: fS,
  diff: hS,
  major: mS,
  minor: pS,
  patch: $S,
  prerelease: yS,
  compare: gS,
  rcompare: _S,
  compareLoose: vS,
  compareBuild: wS,
  sort: ES,
  rsort: SS,
  gt: bS,
  lt: PS,
  eq: NS,
  neq: IS,
  gte: RS,
  lte: OS,
  cmp: TS,
  coerce: jS,
  Comparator: kS,
  Range: AS,
  satisfies: CS,
  toComparators: DS,
  maxSatisfying: MS,
  minSatisfying: LS,
  minVersion: VS,
  validRange: FS,
  outside: US,
  gtr: zS,
  ltr: qS,
  intersects: GS,
  simplifyRange: KS,
  subset: HS,
  SemVer: cS,
  re: Us.re,
  src: Us.src,
  tokens: Us.t,
  SEMVER_SPEC_VERSION: Uc.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Uc.RELEASE_TYPES,
  compareIdentifiers: zc.compareIdentifiers,
  rcompareIdentifiers: zc.rcompareIdentifiers
};
const ur = /* @__PURE__ */ tl(BS), WS = Object.prototype.toString, XS = "[object Uint8Array]", JS = "[object ArrayBuffer]";
function Ju(e, t, r) {
  return e ? e.constructor === t ? !0 : WS.call(e) === r : !1;
}
function xu(e) {
  return Ju(e, Uint8Array, XS);
}
function xS(e) {
  return Ju(e, ArrayBuffer, JS);
}
function YS(e) {
  return xu(e) || xS(e);
}
function ZS(e) {
  if (!xu(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function QS(e) {
  if (!YS(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function qc(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, o) => s + o.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    ZS(s), r.set(s, n), n += s.length;
  return r;
}
const Tn = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Gc(e, t = "utf8") {
  return QS(e), Tn[t] ?? (Tn[t] = new globalThis.TextDecoder(t)), Tn[t].decode(e);
}
function eb(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const tb = new globalThis.TextEncoder();
function zs(e) {
  return eb(e), tb.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const rb = Bw.default, Kc = "aes-256-cbc", dr = () => /* @__PURE__ */ Object.create(null), nb = (e) => e != null, sb = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Un = "__internal__", qs = `${Un}.migrations.version`;
var Nt, it, Ve, ct;
class ob {
  constructor(t = {}) {
    Cr(this, "path");
    Cr(this, "events");
    Dr(this, Nt);
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
      r.cwd = Nd(r.projectName, { suffix: r.projectSuffix }).config;
    }
    if (Mr(this, Ve, r), r.schema ?? r.ajvOptions ?? r.rootSchema) {
      if (r.schema && typeof r.schema != "object")
        throw new TypeError("The `schema` option must be an object.");
      const a = new Ag.Ajv2020({
        allErrors: !0,
        useDefaults: !0,
        ...r.ajvOptions
      });
      rb(a);
      const l = {
        ...r.rootSchema,
        type: "object",
        properties: r.schema
      };
      Mr(this, Nt, a.compile(l));
      for (const [i, d] of Object.entries(r.schema ?? {}))
        d != null && d.default && (he(this, ct)[i] = d.default);
    }
    r.defaults && Mr(this, ct, {
      ...he(this, ct),
      ...r.defaults
    }), r.serialize && (this._serialize = r.serialize), r.deserialize && (this._deserialize = r.deserialize), this.events = new EventTarget(), Mr(this, it, r.encryptionKey);
    const n = r.fileExtension ? `.${r.fileExtension}` : "";
    this.path = q.resolve(r.cwd, `${r.configName ?? "config"}${n}`);
    const s = this.store, o = Object.assign(dr(), r.defaults, s);
    if (r.migrations) {
      if (!r.projectVersion)
        throw new Error("Please specify the `projectVersion` option.");
      this._migrate(r.migrations, r.projectVersion, r.beforeEachMigration);
    }
    this._validate(o);
    try {
      yd.deepEqual(s, o);
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
      throw new TypeError(`Please don't use the ${Un} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (o, a) => {
      sb(o, a), he(this, Ve).accessPropertiesByDotNotation ? gi(n, o, a) : n[o] = a;
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
    return he(this, Ve).accessPropertiesByDotNotation ? Ed(this.store, t) : t in this.store;
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      nb(he(this, ct)[r]) && this.set(r, he(this, ct)[r]);
  }
  delete(t) {
    const { store: r } = this;
    he(this, Ve).accessPropertiesByDotNotation ? wd(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    this.store = dr();
    for (const t of Object.keys(he(this, ct)))
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
      const t = ee.readFileSync(this.path, he(this, it) ? null : "utf8"), r = this._encryptData(t), n = this._deserialize(r);
      return this._validate(n), Object.assign(dr(), n);
    } catch (t) {
      if ((t == null ? void 0 : t.code) === "ENOENT")
        return this._ensureDirectory(), dr();
      if (he(this, Ve).clearInvalidConfig && t.name === "SyntaxError")
        return dr();
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
    if (!he(this, it))
      return typeof t == "string" ? t : Gc(t);
    try {
      const r = t.slice(0, 16), n = Lr.pbkdf2Sync(he(this, it), r.toString(), 1e4, 32, "sha512"), s = Lr.createDecipheriv(Kc, n, r), o = t.slice(17), a = typeof o == "string" ? zs(o) : o;
      return Gc(qc([s.update(a), s.final()]));
    } catch {
    }
    return t.toString();
  }
  _handleChange(t, r) {
    let n = t();
    const s = () => {
      const o = n, a = t();
      $d(a, o) || (n = a, r.call(this, a, o));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(t) {
    if (!he(this, Nt) || he(this, Nt).call(this, t) || !he(this, Nt).errors)
      return;
    const n = he(this, Nt).errors.map(({ instancePath: s, message: o = "" }) => `\`${s.slice(1)}\` ${o}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    ee.mkdirSync(q.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    if (he(this, it)) {
      const n = Lr.randomBytes(16), s = Lr.pbkdf2Sync(he(this, it), n.toString(), 1e4, 32, "sha512"), o = Lr.createCipheriv(Kc, s, n);
      r = qc([n, zs(":"), o.update(zs(r)), o.final()]);
    }
    if (_e.env.SNAP)
      ee.writeFileSync(this.path, r, { mode: he(this, Ve).configFileMode });
    else
      try {
        el(this.path, r, { mode: he(this, Ve).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          ee.writeFileSync(this.path, r, { mode: he(this, Ve).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    this._ensureDirectory(), ee.existsSync(this.path) || this._write(dr()), _e.platform === "win32" ? ee.watch(this.path, { persistent: !1 }, Ec(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 100 })) : ee.watchFile(this.path, { persistent: !1 }, Ec(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 5e3 }));
  }
  _migrate(t, r, n) {
    let s = this._get(qs, "0.0.0");
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
        i == null || i(this), this._set(qs, l), s = l, a = { ...this.store };
      } catch (i) {
        throw this.store = a, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${i}`);
      }
    (this._isVersionInRangeFormat(s) || !ur.eq(s, r)) && this._set(qs, r);
  }
  _containsReservedKey(t) {
    return typeof t == "object" && Object.keys(t)[0] === Un ? !0 : typeof t != "string" ? !1 : he(this, Ve).accessPropertiesByDotNotation ? !!t.startsWith(`${Un}.`) : !1;
  }
  _isVersionInRangeFormat(t) {
    return ur.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && ur.satisfies(r, t) ? !1 : ur.satisfies(n, t) : !(ur.lte(t, r) || ur.gt(t, n));
  }
  _get(t, r) {
    return vd(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    gi(n, t, r), this.store = n;
  }
}
Nt = new WeakMap(), it = new WeakMap(), Ve = new WeakMap(), ct = new WeakMap();
const { app: zn, ipcMain: lo, shell: ab } = Jc;
let Hc = !1;
const Bc = () => {
  if (!lo || !zn)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: zn.getPath("userData"),
    appVersion: zn.getVersion()
  };
  return Hc || (lo.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), Hc = !0), e;
};
class ib extends ob {
  constructor(t) {
    let r, n;
    if (_e.type === "renderer") {
      const s = Jc.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else lo && zn && ({ defaultCwd: r, appVersion: n } = Bc());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = q.isAbsolute(t.cwd) ? t.cwd : q.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    Bc();
  }
  async openInEditor() {
    const t = await ab.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const Yu = 67324752, Zu = 33639248, Qu = 101010256, cb = Object.prototype.hasOwnProperty;
function lb(e) {
  for (let t = e.length - 22; t >= 0; t--)
    if (e.readUInt32LE(t) === Qu)
      return t;
  throw new Error("End of central directory not found");
}
function ed(e) {
  const t = lb(e), r = e.readUInt32LE(t + 12), n = e.readUInt32LE(t + 16), s = [], o = /* @__PURE__ */ new Map();
  let a = n, l = 0;
  for (; a < n + r; ) {
    if (e.readUInt32LE(a) !== Zu)
      throw new Error("Invalid central directory signature");
    const d = e.readUInt16LE(a + 4), u = e.readUInt16LE(a + 6), h = e.readUInt16LE(a + 8), E = e.readUInt16LE(a + 10), _ = e.readUInt16LE(a + 12), v = e.readUInt16LE(a + 14), y = e.readUInt32LE(a + 16), $ = e.readUInt32LE(a + 20), m = e.readUInt32LE(a + 24), w = e.readUInt16LE(a + 28), P = e.readUInt16LE(a + 30), I = e.readUInt16LE(a + 32), R = e.readUInt16LE(a + 34), V = e.readUInt16LE(a + 36), W = e.readUInt32LE(a + 38), Y = e.readUInt32LE(a + 42), ie = a + 46, ae = ie + w, C = e.slice(ie, ae).toString("utf8"), z = ae, se = z + P, O = e.slice(z, se), k = se, F = k + I, D = e.slice(k, F);
    if (e.readUInt32LE(Y) !== Yu)
      throw new Error(`Invalid local header signature for ${C}`);
    const M = e.readUInt16LE(Y + 26), N = e.readUInt16LE(Y + 28), p = Y + 30 + M + N, b = p + $, g = e.slice(p, b), c = e.slice(
      Y + 30 + M,
      p
    ), f = {
      fileName: C,
      versionMadeBy: d,
      versionNeeded: u,
      generalPurpose: h,
      compressionMethod: E,
      lastModTime: _,
      lastModDate: v,
      crc32: y,
      compressedSize: $,
      uncompressedSize: m,
      diskNumberStart: R,
      internalAttrs: V,
      externalAttrs: W,
      extraField: O,
      fileComment: D,
      localExtraField: c,
      compressedData: g,
      localHeaderOffset: Y,
      order: l
    };
    s.push(f), o.set(C, f), a = F, l += 1;
  }
  return { entries: s, entryMap: o };
}
function ub(e) {
  let t = 4294967295;
  for (let r = 0; r < e.length; r++) {
    const n = e[r];
    t = t >>> 8 ^ db[(t ^ n) & 255];
  }
  return (t ^ 4294967295) >>> 0;
}
const db = (() => {
  const e = new Uint32Array(256);
  for (let t = 0; t < 256; t++) {
    let r = t;
    for (let n = 0; n < 8; n++)
      r & 1 ? r = 3988292384 ^ r >>> 1 : r >>>= 1;
    e[t] = r >>> 0;
  }
  return e;
})();
function Qn(e) {
  if (e.compressionMethod === 0)
    return Buffer.from(e.compressedData);
  if (e.compressionMethod === 8)
    return Yc.inflateRawSync(e.compressedData);
  throw new Error(`Unsupported compression method: ${e.compressionMethod}`);
}
function fb(e, t) {
  if (t === 0)
    return e;
  if (t === 8)
    return Yc.deflateRawSync(e);
  throw new Error(`Unsupported compression method: ${t}`);
}
function uo(e) {
  return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}
function hb(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function td(e) {
  const t = [], r = /<si>([\s\S]*?)<\/si>/g;
  let n;
  for (; (n = r.exec(e)) !== null; ) {
    const s = n[1], o = /<t[^>]*>([\s\S]*?)<\/t>/g;
    let a = "", l;
    for (; (l = o.exec(s)) !== null; )
      a += uo(l[1]);
    t.push(a);
  }
  return t;
}
function rd(e) {
  const t = {}, r = /(\w+)=\"([^\"]*)\"/g;
  let n;
  for (; (n = r.exec(e)) !== null; )
    t[n[1]] = n[2];
  return t;
}
function Gs(e) {
  const t = Object.entries(e);
  return t.length === 0 ? "" : t.map(([r, n]) => `${r}="${n}"`).join(" ");
}
function nd(e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const n = e.charCodeAt(r);
    n >= 65 && n <= 90 ? t = t * 26 + (n - 64) : n >= 97 && n <= 122 && (t = t * 26 + (n - 96));
  }
  return t - 1;
}
function mb(e, t, r) {
  if (t === "s") {
    const s = e.match(/<v>([\s\S]*?)<\/v>/);
    if (!s) return "";
    const o = Number.parseInt(s[1], 10);
    return Number.isNaN(o) ? "" : r[o] ?? "";
  }
  if (t === "inlineStr") {
    const s = e.match(/<t[^>]*>([\s\S]*?)<\/t>/);
    return s ? uo(s[1]) : "";
  }
  const n = e.match(/<v>([\s\S]*?)<\/v>/);
  return n ? uo(n[1]) : "";
}
function sd(e) {
  return e == null ? !1 : typeof e == "string" ? e.trim().length > 0 : !0;
}
function pb(e, t, r) {
  const n = /* @__PURE__ */ new Map(), s = [];
  let o = 0;
  for (; ; ) {
    const i = e.indexOf("<c", o);
    if (i === -1) break;
    const d = e.indexOf(">", i);
    if (d === -1) break;
    let u = e.slice(i + 2, d), h = !1;
    u.endsWith("/") && (h = !0, u = u.slice(0, -1));
    const E = rd(u), _ = E.r;
    let v = "", y = d + 1;
    if (!h) {
      const $ = e.indexOf("</c>", d);
      if ($ === -1) break;
      v = e.slice(d + 1, $), y = $ + 4;
    }
    if (_) {
      const $ = /^([A-Z]+)(\d+)$/.exec(_);
      if ($) {
        const m = $[1], w = parseInt($[2], 10), P = nd(m);
        if (P === 0) {
          const I = v.match(/<v>([\s\S]*?)<\/v>/);
          if (I) {
            const R = Number.parseInt(I[1], 10), V = t[R];
            V && n.set(w, V.trim());
          }
        } else if (P === 1) {
          const I = n.get(w), R = (Y) => {
            if (!Y) return;
            const ie = /* @__PURE__ */ new Set();
            ie.add(Y);
            const ae = Y.trim();
            ae && ie.add(ae);
            const C = ae.replace(/[()]/g, "").trim();
            if (C && ie.add(C), ae.startsWith("(") && ae.endsWith(")")) {
              const z = ae.slice(1, -1).trim();
              z && ie.add(z);
            }
            for (const z of ie)
              if (cb.call(r, z))
                return r[z];
          }, V = I ?? (w === 1 ? "SFC" : void 0), W = R(V);
          if (V && W !== void 0) {
            const Y = { ...E }, ie = Gs(Y);
            let ae;
            if (!sd(W))
              ae = `<c${ie ? ` ${ie}` : ""}/>`;
            else {
              const C = `${W}`, z = Number(C);
              if (C.trim().length > 0 && !Number.isNaN(z)) {
                delete Y.t;
                const O = Gs(Y);
                ae = `<c${O ? ` ${O}` : ""}><v>${C}</v></c>`;
              } else {
                Y.t = "inlineStr";
                const O = Gs(Y);
                ae = `<c${O ? ` ${O}` : ""}><is><t>${hb(C)}</t></is></c>`;
              }
            }
            s.push({ start: i, end: y, text: ae });
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
function $b(e) {
  const t = [...e.entries].sort(
    (i, d) => i.localHeaderOffset - d.localHeaderOffset
  ), r = [];
  let n = 0;
  for (const i of t) {
    const d = Buffer.from(i.fileName, "utf8"), u = Buffer.alloc(30);
    u.writeUInt32LE(Yu, 0), u.writeUInt16LE(i.versionNeeded, 4), u.writeUInt16LE(i.generalPurpose, 6), u.writeUInt16LE(i.compressionMethod, 8), u.writeUInt16LE(i.lastModTime, 10), u.writeUInt16LE(i.lastModDate, 12), u.writeUInt32LE(i.crc32, 14), u.writeUInt32LE(i.compressedSize, 18), u.writeUInt32LE(i.uncompressedSize, 22), u.writeUInt16LE(d.length, 26), u.writeUInt16LE(i.localExtraField.length, 28), r.push(
      u,
      d,
      i.localExtraField,
      i.compressedData
    ), i.newLocalHeaderOffset = n, n += u.length + d.length + i.localExtraField.length + i.compressedData.length;
  }
  const s = n, o = [];
  for (const i of t) {
    const d = Buffer.from(i.fileName, "utf8"), u = Buffer.alloc(46);
    u.writeUInt32LE(Zu, 0), u.writeUInt16LE(i.versionMadeBy, 4), u.writeUInt16LE(i.versionNeeded, 6), u.writeUInt16LE(i.generalPurpose, 8), u.writeUInt16LE(i.compressionMethod, 10), u.writeUInt16LE(i.lastModTime, 12), u.writeUInt16LE(i.lastModDate, 14), u.writeUInt32LE(i.crc32, 16), u.writeUInt32LE(i.compressedSize, 20), u.writeUInt32LE(i.uncompressedSize, 24), u.writeUInt16LE(d.length, 28), u.writeUInt16LE(i.extraField.length, 30), u.writeUInt16LE(i.fileComment.length, 32), u.writeUInt16LE(i.diskNumberStart, 34), u.writeUInt16LE(i.internalAttrs, 36), u.writeUInt32LE(i.externalAttrs, 38), u.writeUInt32LE(i.newLocalHeaderOffset ?? 0, 42), o.push(
      u,
      d,
      i.extraField,
      i.fileComment
    ), n += u.length + d.length + i.extraField.length + i.fileComment.length;
  }
  const a = n - s, l = Buffer.alloc(22);
  return l.writeUInt32LE(Qu, 0), l.writeUInt16LE(0, 4), l.writeUInt16LE(0, 6), l.writeUInt16LE(t.length, 8), l.writeUInt16LE(t.length, 10), l.writeUInt32LE(a, 12), l.writeUInt32LE(s, 16), l.writeUInt16LE(0, 20), Buffer.concat([...r, ...o, l]);
}
function yb(e, t) {
  const r = {};
  t && (r.SFC = t);
  for (const [n, s] of Object.entries(e))
    sd(s) && (r[n] = s);
  return r;
}
function gb(e, t, r) {
  if (!ce.existsSync(e))
    throw new Error(`Workbook not found: ${e}`);
  const n = ce.readFileSync(e), s = ed(n), o = s.entryMap.get("xl/worksheets/sheet1.xml"), a = s.entryMap.get("xl/sharedStrings.xml");
  if (!o || !a)
    throw new Error("Workbook is missing required worksheet or shared strings");
  const l = Qn(a).toString("utf8"), i = td(l), d = Qn(o).toString("utf8"), u = yb(t, r), h = pb(
    d,
    i,
    u
  );
  if (h === d)
    return;
  const E = Buffer.from(h, "utf8"), _ = fb(E, o.compressionMethod);
  o.compressedData = _, o.compressedSize = _.length, o.uncompressedSize = E.length, o.crc32 = ub(E);
  const v = $b(s), y = `${e}.tmp`;
  ce.writeFileSync(y, v), ce.renameSync(y, e);
}
function _b(e, t = "xl/worksheets/sheet1.xml") {
  if (!ce.existsSync(e))
    throw new Error(`Workbook not found: ${e}`);
  const r = ce.readFileSync(e), n = ed(r), s = n.entryMap.get(t);
  if (!s)
    throw new Error(`Worksheet not found: ${t}`);
  const o = n.entryMap.get("xl/sharedStrings.xml"), a = o ? td(Qn(o).toString("utf8")) : [], l = Qn(s).toString("utf8"), i = [], d = /<row[^>]*>([\s\S]*?)<\/row>/g;
  let u;
  for (; (u = d.exec(l)) !== null; ) {
    const h = u[1], E = [];
    let _ = -1;
    const v = /<c([^>]*)>([\s\S]*?)<\/c>/g;
    let y;
    for (; (y = v.exec(h)) !== null; ) {
      const $ = y[1], m = y[2], w = rd($), P = w.r;
      let I = -1;
      if (P) {
        const V = P.replace(/\d+/g, "");
        I = nd(V);
      } else
        I = E.length;
      if (I < 0)
        continue;
      const R = mb(m, w.t, a);
      E[I] = R, I > _ && (_ = I);
    }
    if (_ >= 0)
      for (let $ = 0; $ <= _; $ += 1)
        E[$] === void 0 && (E[$] = "");
    i.push(E);
  }
  return i;
}
function vb(e) {
  const t = yi.join(e, "Input_Total.xlsx");
  if (!ce.existsSync(t)) {
    const r = yi.join(e, "Input_Plant.xlsx");
    if (!ce.existsSync(r))
      throw new Error("No template available to create Input_Total.xlsx");
    ce.copyFileSync(r, t);
  }
  return t;
}
md(import.meta.url);
const ws = q.dirname(pd(import.meta.url));
process.env.APP_ROOT = q.join(ws, "..");
const fo = process.env.VITE_DEV_SERVER_URL, Xb = q.join(process.env.APP_ROOT, "dist-electron"), qn = q.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = fo ? q.join(process.env.APP_ROOT, "public") : qn;
function wb() {
  return er.isPackaged ? q.join(process.resourcesPath, "third-party") : q.join(ws, "..", "third-party");
}
function fn() {
  return er.isPackaged ? q.join(process.resourcesPath, "output") : q.join(ws, "..", "output");
}
function Wc(e) {
  ce.existsSync(e) || ce.mkdirSync(e, { recursive: !0 });
}
function od(e) {
  if (!e) return null;
  const t = e.replace(/[^0-9]/g, "");
  return t.length === 8 ? t : null;
}
function Eb(e = "Asia/Seoul") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: e,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(/* @__PURE__ */ new Date()).replace(/-/g, "");
}
function ad(e, t) {
  const r = (o) => {
    if (!o) return null;
    const a = q.join(e, o);
    return ce.existsSync(a) && ce.statSync(a).isDirectory() ? { dir: a, date: o } : null;
  }, n = od(t), s = r(n);
  if (s)
    return s;
  try {
    const a = ce.readdirSync(e, { withFileTypes: !0 }).filter((l) => l.isDirectory() && /^\d{8}$/.test(l.name)).map((l) => l.name).sort().at(-1) ?? null;
    return a ? { dir: q.join(e, a), date: a } : null;
  } catch (o) {
    return console.error("Failed to resolve output directory", e, o), null;
  }
}
function Sb(e, t) {
  return new Promise((r, n) => {
    var o, a;
    const s = gd(e, {
      cwd: t,
      windowsHide: !0
    });
    s.on("error", (l) => {
      n(l);
    }), (o = s.stdout) == null || o.on("data", (l) => {
      console.log(`[exe stdout] ${l}`);
    }), (a = s.stderr) == null || a.on("data", (l) => {
      console.error(`[exe stderr] ${l}`);
    }), s.on("close", (l) => {
      if (l === 0) {
        r();
        return;
      }
      n(new Error(`Executable exited with code ${l}`));
    });
  });
}
function es(e) {
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
function id(e, t, r) {
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
function bb(e) {
  const r = ce.readFileSync(e, "utf-8").split(/\r?\n/).filter((a) => a.trim().length > 0);
  if (r.length === 0)
    return [];
  const n = es(r[0]), s = n.findIndex(
    (a) => a.toLowerCase() === "time"
  );
  if (s === -1)
    return console.warn("Output CSV missing Time column"), [];
  const o = [];
  for (let a = 1; a < r.length; a += 1) {
    const l = es(r[a]), i = id(l, n, s);
    i && o.push(i);
  }
  return o;
}
function Pb(e) {
  try {
    const t = _b(e);
    if (t.length === 0)
      return [];
    const r = t[0].map((o) => o.trim()), n = r.findIndex(
      (o) => o.toLowerCase() === "time"
    );
    if (n === -1)
      return console.warn("Workbook missing Time column"), [];
    const s = [];
    for (let o = 1; o < t.length; o += 1) {
      const a = t[o], l = id(a, r, n);
      l && s.push(l);
    }
    return s;
  } catch (t) {
    return console.error("Failed to read simulation workbook", e, t), [];
  }
}
function cd(e) {
  const t = q.join(e, "Output_Total.xlsx");
  if (ce.existsSync(t)) {
    const n = Pb(t);
    if (n.length > 0)
      return n;
  }
  const r = q.join(e, "Output_Total.csv");
  return ce.existsSync(r) ? bb(r) : [];
}
const Nb = /* @__PURE__ */ new Set([
  "-1.#IND",
  "-1.#QNAN",
  "NAN",
  "INF",
  "+INF",
  "-INF"
]);
function ld(e) {
  if (!e) return null;
  const t = e.replace(/,/g, "").trim();
  if (!t || Nb.has(t.toUpperCase()))
    return null;
  const r = Number.parseFloat(t);
  return Number.isFinite(r) ? r : null;
}
function Ks(e) {
  if (!ce.existsSync(e))
    return [];
  const r = ce.readFileSync(e, "utf-8").split(/\r?\n/).filter((o) => o.trim().length > 0);
  if (r.length <= 1)
    return [];
  const n = es(r[0]), s = [];
  for (let o = 1; o < r.length; o += 1) {
    const a = es(r[o]), l = {};
    n.forEach((i, d) => {
      i && (l[i] = a[d] ?? "");
    }), s.push(l);
  }
  return s;
}
function Xc(e) {
  const t = {};
  for (const [r, n] of Object.entries(e)) {
    const s = ld(n);
    if (s !== null) {
      t[r] = s;
      continue;
    }
    const o = n.trim();
    t[r] = o.length > 0 ? o : null;
  }
  return t;
}
function Ib(e) {
  const t = q.join(e, "Output_EE2.csv"), r = q.join(e, "Output_EE3.csv"), n = q.join(e, "Output_EE1.csv"), s = {}, o = Ks(t);
  for (const i of o) {
    const d = Object.entries(i);
    if (d.length === 0) continue;
    const [u, h] = d[0], E = (i.Variable ?? i[u] ?? "").trim();
    if (!E) continue;
    let _ = "";
    "Value" in i ? _ = i.Value ?? "" : d.length > 1 && (_ = d[1][1]);
    const v = ld(_);
    s[E] = v !== null ? v : _.trim() || null;
  }
  const a = Ks(r).map(Xc), l = Ks(n).map(Xc);
  return { report: s, cashflow: a, coefficients: l };
}
pt.handle("run-exe", async (e, t) => {
  const r = wb(), n = q.join(r, "MHySIM_HRS_Run.exe");
  if (!ce.existsSync(n)) {
    const v = `실행 파일을 찾을 수 없습니다:
` + n + `

패키징 시 extraResources에 third-party를 포함했는지 확인하세요.`;
    throw console.error("[run-exe] " + v), hd.showErrorBox("Executable missing", v), new Error(v);
  }
  const s = Eb(), o = fn();
  Wc(o);
  const a = q.join(o, s);
  Wc(a);
  const l = a, i = (t == null ? void 0 : t.skipExe) ?? !1, d = s, u = ce.readdirSync(l).filter((v) => /^Output_\d+\.csv$/i.test(v));
  for (const v of u) {
    const y = q.extname(v), $ = q.basename(v, y);
    let m = 1, w = `${$}-${m}${y}`;
    for (; ce.existsSync(q.join(l, w)); )
      m++, w = `${$}-${m}${y}`;
    ce.renameSync(
      q.join(l, v),
      q.join(l, w)
    ), console.log(`📁 백업됨: ${v} → ${w}`);
  }
  try {
    const v = (t == null ? void 0 : t.values) ?? {}, y = (t == null ? void 0 : t.sfc) ?? null;
    if (Object.keys(v).length > 0 || y) {
      const m = vb(r);
      gb(m, v, y);
      try {
        const w = q.join(l, "Input_Total.xlsx");
        ce.copyFileSync(m, w), console.log("📄 Input_Total.xlsx copied to", w);
      } catch (w) {
        console.error("⚠️ Failed to copy Input_Total workbook", w);
      }
    }
  } catch (v) {
    throw console.error("❌ Excel 업데이트 실패:", v), v;
  }
  try {
    const v = q.join(l, "MHySIM.log");
    ce.existsSync(v) && ce.writeFileSync(v, "");
  } catch (v) {
    console.warn("⚠️ 진행 로그 초기화 실패", v);
  }
  let h;
  if (i)
    h = "EXE skipped by user toggle", console.info("[run-exe] Execution skipped by user toggle");
  else if (process.platform === "win32")
    try {
      await Sb(n, l), h = "EXE completed successfully";
    } catch (v) {
      throw console.error("❌ EXE 실행 실패:", v), v;
    }
  else
    h = `EXE execution skipped: unsupported platform (${process.platform})`, console.warn(
      `run-exe called on unsupported platform (${process.platform}); executable skipped.`
    );
  const E = cd(l);
  return {
    status: h,
    frames: E.sort((v, y) => v.time - y.time),
    outputDate: d,
    outputDir: l
  };
});
pt.handle(
  "read-output-data",
  async (e, t) => {
    const r = fn(), n = ad(r, (t == null ? void 0 : t.date) ?? null);
    if (!n)
      return { frames: [], date: null };
    try {
      return { frames: cd(n.dir).sort(
        (o, a) => o.time - a.time
      ), date: n.date };
    } catch (s) {
      return console.error("Failed to read output data", n, s), { frames: [], date: n.date };
    }
  }
);
pt.handle(
  "read-progress-log",
  async (e, t) => {
    const r = fn(), n = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, ""), o = od((t == null ? void 0 : t.date) ?? null) ?? n, a = q.join(r, o), l = q.join(a, "MHySIM.log");
    if (!ce.existsSync(l))
      return {
        date: o,
        exists: !1,
        raw: "",
        updatedAt: null
      };
    try {
      const i = ce.readFileSync(l, "utf-8"), d = ce.statSync(l);
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
function Rb(e) {
  const t = e.getFullYear(), r = `${e.getMonth() + 1}`.padStart(2, "0"), n = `${e.getDate()}`.padStart(2, "0");
  return `${t}-${r}-${n}`;
}
pt.handle("read-recent-logs", async () => {
  const e = fn(), t = [], r = /* @__PURE__ */ new Date();
  for (let n = 0; n < 5; n += 1) {
    const s = new Date(r);
    s.setDate(r.getDate() - n);
    const o = Rb(s), a = o.replace(/-/g, ""), l = q.join(e, a, "MHySIM.jsonl");
    let i = [];
    if (ce.existsSync(l))
      try {
        i = ce.readFileSync(l, "utf-8").split(/\r?\n/).map((u) => u.trim()).filter(Boolean).map((u) => {
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
pt.handle(
  "read-economic-evaluation",
  async (e, t) => {
    const r = fn(), n = ad(r, (t == null ? void 0 : t.date) ?? null);
    if (!n)
      return {
        date: null,
        report: {},
        cashflow: [],
        coefficients: []
      };
    try {
      const s = Ib(n.dir);
      return {
        date: n.date,
        report: s.report,
        cashflow: s.cashflow,
        coefficients: s.coefficients
      };
    } catch (s) {
      return console.error("Failed to read economic evaluation outputs", n, s), {
        date: n.date,
        report: {},
        cashflow: [],
        coefficients: []
      };
    }
  }
);
const mi = new ib();
pt.handle("electron-store-get", (e, t) => mi.get(t));
pt.handle("electron-store-set", (e, t, r) => {
  mi.set(t, r);
});
pt.handle("electron-store-delete", (e, t) => {
  mi.delete(t);
});
pt.on("save-project-backup", (e, t, r) => {
  const n = q.join(er.getPath("userData"), `${r}.json`);
  try {
    ce.writeFileSync(n, JSON.stringify(t, null, 2), "utf-8"), console.log("✅ 프로젝트 백업 저장 완료:", n);
  } catch (s) {
    console.error("❌ 프로젝트 백업 저장 실패:", s);
  }
});
let bt;
function ud() {
  bt = new xc({
    icon: q.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: q.join(ws, "preload.mjs")
    }
  }), bt.webContents.on("did-finish-load", () => {
    bt == null || bt.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), fo ? bt.loadURL(fo) : (console.log("RENDERER_DIST:", qn), console.log("index.html path:", q.join(qn, "index.html")), bt.loadFile(q.join(qn, "index.html")));
}
er.on("window-all-closed", () => {
  process.platform !== "darwin" && (er.quit(), bt = null);
});
er.on("activate", () => {
  xc.getAllWindows().length === 0 && ud();
});
er.whenReady().then(ud);
export {
  Xb as MAIN_DIST,
  qn as RENDERER_DIST,
  fo as VITE_DEV_SERVER_URL
};
