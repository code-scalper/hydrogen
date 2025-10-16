var od = Object.defineProperty;
var hi = (e) => {
  throw TypeError(e);
};
var ad = (e, t, r) => t in e ? od(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Cr = (e, t, r) => ad(e, typeof t != "symbol" ? t + "" : t, r), mi = (e, t, r) => t.has(e) || hi("Cannot " + r);
var fe = (e, t, r) => (mi(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Dr = (e, t, r) => t.has(e) ? hi("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Mr = (e, t, r, n) => (mi(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
import Wc, { ipcMain as sr, dialog as id, app as Qt, BrowserWindow as Xc } from "electron";
import { createRequire as cd } from "node:module";
import { fileURLToPath as ld } from "node:url";
import B from "node:path";
import me from "fs";
import _e from "node:process";
import { promisify as be, isDeepStrictEqual as ud } from "node:util";
import Q from "node:fs";
import Lr from "node:crypto";
import dd from "node:assert";
import Qn from "node:os";
import { spawn as fd } from "child_process";
import pi from "path";
import Jc from "zlib";
const er = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, ws = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), hd = new Set("0123456789");
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
        if (n === "index" && !hd.has(o))
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
function Yc(e, t) {
  if (lo(e, t))
    throw new Error("Cannot use string index");
}
function md(e, t, r) {
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
function $i(e, t, r) {
  if (!er(e) || typeof t != "string")
    return e;
  const n = e, s = es(t);
  for (let o = 0; o < s.length; o++) {
    const a = s[o];
    Yc(e, a), o === s.length - 1 ? e[a] = r : er(e[a]) || (e[a] = typeof s[o + 1] == "number" ? [] : {}), e = e[a];
  }
  return n;
}
function pd(e, t) {
  if (!er(e) || typeof t != "string")
    return !1;
  const r = es(t);
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (Yc(e, s), n === r.length - 1)
      return delete e[s], !0;
    if (e = e[s], !er(e))
      return !1;
  }
}
function $d(e, t) {
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
const bt = Qn.homedir(), uo = Qn.tmpdir(), { env: mr } = _e, yd = (e) => {
  const t = B.join(bt, "Library");
  return {
    data: B.join(t, "Application Support", e),
    config: B.join(t, "Preferences", e),
    cache: B.join(t, "Caches", e),
    log: B.join(t, "Logs", e),
    temp: B.join(uo, e)
  };
}, gd = (e) => {
  const t = mr.APPDATA || B.join(bt, "AppData", "Roaming"), r = mr.LOCALAPPDATA || B.join(bt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: B.join(r, e, "Data"),
    config: B.join(t, e, "Config"),
    cache: B.join(r, e, "Cache"),
    log: B.join(r, e, "Log"),
    temp: B.join(uo, e)
  };
}, _d = (e) => {
  const t = B.basename(bt);
  return {
    data: B.join(mr.XDG_DATA_HOME || B.join(bt, ".local", "share"), e),
    config: B.join(mr.XDG_CONFIG_HOME || B.join(bt, ".config"), e),
    cache: B.join(mr.XDG_CACHE_HOME || B.join(bt, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: B.join(mr.XDG_STATE_HOME || B.join(bt, ".local", "state"), e),
    temp: B.join(uo, t, e)
  };
};
function vd(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), _e.platform === "darwin" ? yd(e) : _e.platform === "win32" ? gd(e) : _d(e);
}
const pt = (e, t) => function(...n) {
  return e.apply(void 0, n).catch(t);
}, at = (e, t) => function(...n) {
  try {
    return e.apply(void 0, n);
  } catch (s) {
    return t(s);
  }
}, wd = _e.getuid ? !_e.getuid() : !1, Ed = 1e4, Le = () => {
}, he = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!he.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !wd && (t === "EINVAL" || t === "EPERM");
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
class Sd {
  constructor() {
    this.interval = 25, this.intervalId = void 0, this.limit = Ed, this.queueActive = /* @__PURE__ */ new Set(), this.queueWaiting = /* @__PURE__ */ new Set(), this.init = () => {
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
const bd = new Sd(), $t = (e, t) => function(n) {
  return function s(...o) {
    return bd.schedule().then((a) => {
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
}, Pd = "utf8", yi = 438, Nd = 511, Id = {}, Rd = Qn.userInfo().uid, Od = Qn.userInfo().gid, Td = 1e3, jd = !!_e.getuid;
_e.getuid && _e.getuid();
const gi = 128, kd = (e) => e instanceof Error && "code" in e, _i = (e) => typeof e == "string", Es = (e) => e === void 0, Ad = _e.platform === "linux", xc = _e.platform === "win32", fo = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
xc || fo.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
Ad && fo.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
class Cd {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (xc && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? _e.kill(_e.pid, "SIGTERM") : _e.kill(_e.pid, t));
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
const Dd = new Cd(), Md = Dd.register, Re = {
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
    if (t.length <= gi)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - gi;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
Md(Re.purgeSyncAll);
function Zc(e, t, r = Id) {
  if (_i(r))
    return Zc(e, t, { encoding: r });
  const n = Date.now() + ((r.timeout ?? Td) || -1);
  let s = null, o = null, a = null;
  try {
    const l = Ie.attempt.realpathSync(e), i = !!l;
    e = l || e, [o, s] = Re.get(e, r.tmpCreate || Re.create, r.tmpPurge !== !1);
    const d = jd && Es(r.chown), u = Es(r.mode);
    if (i && (d || u)) {
      const h = Ie.attempt.statSync(e);
      h && (r = { ...r }, d && (r.chown = { uid: h.uid, gid: h.gid }), u && (r.mode = h.mode));
    }
    if (!i) {
      const h = B.dirname(e);
      Ie.attempt.mkdirSync(h, {
        mode: Nd,
        recursive: !0
      });
    }
    a = Ie.retry.openSync(n)(o, "w", r.mode || yi), r.tmpCreated && r.tmpCreated(o), _i(t) ? Ie.retry.writeSync(n)(a, t, 0, r.encoding || Pd) : Es(t) || Ie.retry.writeSync(n)(a, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Ie.retry.fsyncSync(n)(a) : Ie.attempt.fsync(a)), Ie.retry.closeSync(n)(a), a = null, r.chown && (r.chown.uid !== Rd || r.chown.gid !== Od) && Ie.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== yi && Ie.attempt.chmodSync(o, r.mode);
    try {
      Ie.retry.renameSync(n)(o, e);
    } catch (h) {
      if (!kd(h) || h.code !== "ENAMETOOLONG")
        throw h;
      Ie.retry.renameSync(n)(o, Re.truncate(e));
    }
    s(), o = null;
  } finally {
    a && Ie.attempt.closeSync(a), o && Re.purge(o);
  }
}
function Qc(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var qs = { exports: {} }, el = {}, Je = {}, _r = {}, sn = {}, Y = {}, rn = {};
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
  function g(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = g;
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
      let g = this._values[_];
      if (g) {
        const w = g.get(v);
        if (w)
          return w;
      } else
        g = this._values[_] = /* @__PURE__ */ new Map();
      g.set(v, E);
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
        const g = d[v];
        if (!g)
          continue;
        const $ = h[v] = h[v] || /* @__PURE__ */ new Map();
        g.forEach((m) => {
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
    optimizeNames(c, f) {
      return this;
    }
  }
  class a extends o {
    constructor(c, f, S) {
      super(), this.varKind = c, this.name = f, this.rhs = S;
    }
    render({ es5: c, _n: f }) {
      const S = c ? r.varKinds.var : this.varKind, O = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${S} ${this.name}${O};` + f;
    }
    optimizeNames(c, f) {
      if (c[this.name.str])
        return this.rhs && (this.rhs = T(this.rhs, c, f)), this;
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
        return this.rhs = T(this.rhs, c, f), this;
    }
    get names() {
      const c = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return oe(c, this.rhs);
    }
  }
  class i extends l {
    constructor(c, f, S, O) {
      super(c, S, O), this.op = f;
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
      return this.code = T(this.code, c, f), this;
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
      let O = S.length;
      for (; O--; ) {
        const j = S[O];
        j.optimizeNames(c, f) || (k(c, j.names), S.splice(O, 1));
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
  class g extends _ {
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
        return c === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(V(c), f instanceof m ? [f] : f.nodes);
      if (!(c === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(c, f) {
      var S;
      if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(c, f), !!(super.optimizeNames(c, f) || this.else))
        return this.condition = T(this.condition, c, f), this;
    }
    get names() {
      const c = super.names;
      return oe(c, this.condition), this.else && z(c, this.else.names), c;
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
        return this.iteration = T(this.iteration, c, f), this;
    }
    get names() {
      return z(super.names, this.iteration.names);
    }
  }
  class I extends w {
    constructor(c, f, S, O) {
      super(), this.varKind = c, this.name = f, this.from = S, this.to = O;
    }
    render(c) {
      const f = c.es5 ? r.varKinds.var : this.varKind, { name: S, from: O, to: j } = this;
      return `for(${f} ${S}=${O}; ${S}<${j}; ${S}++)` + super.render(c);
    }
    get names() {
      const c = oe(super.names, this.from);
      return oe(c, this.to);
    }
  }
  class R extends w {
    constructor(c, f, S, O) {
      super(), this.loop = c, this.varKind = f, this.name = S, this.iterable = O;
    }
    render(c) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(c);
    }
    optimizeNames(c, f) {
      if (super.optimizeNames(c, f))
        return this.iterable = T(this.iterable, c, f), this;
    }
    get names() {
      return z(super.names, this.iterable.names);
    }
  }
  class L extends v {
    constructor(c, f, S) {
      super(), this.name = c, this.args = f, this.async = S;
    }
    render(c) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(c);
    }
  }
  L.kind = "func";
  class W extends _ {
    render(c) {
      return "return " + super.render(c);
    }
  }
  W.kind = "return";
  class se extends v {
    render(c) {
      let f = "try" + super.render(c);
      return this.catch && (f += this.catch.render(c)), this.finally && (f += this.finally.render(c)), f;
    }
    optimizeNodes() {
      var c, f;
      return super.optimizeNodes(), (c = this.catch) === null || c === void 0 || c.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(c, f) {
      var S, O;
      return super.optimizeNames(c, f), (S = this.catch) === null || S === void 0 || S.optimizeNames(c, f), (O = this.finally) === null || O === void 0 || O.optimizeNames(c, f), this;
    }
    get names() {
      const c = super.names;
      return this.catch && z(c, this.catch.names), this.finally && z(c, this.finally.names), c;
    }
  }
  class ae extends v {
    constructor(c) {
      super(), this.error = c;
    }
    render(c) {
      return `catch(${this.error})` + super.render(c);
    }
  }
  ae.kind = "catch";
  class de extends v {
    render(c) {
      return "finally" + super.render(c);
    }
  }
  de.kind = "finally";
  class F {
    constructor(c, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = c, this._scope = new r.Scope({ parent: c }), this._nodes = [new g()];
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
    _def(c, f, S, O) {
      const j = this._scope.toName(f);
      return S !== void 0 && O && (this._constants[j.str] = S), this._leafNode(new a(c, j, S)), j;
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
      for (const [S, O] of c)
        f.length > 1 && f.push(","), f.push(S), (S !== O || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, O));
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
    forRange(c, f, S, O, j = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const q = this._scope.toName(c);
      return this._for(new I(j, q, f, S), () => O(q));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(c, f, S, O = r.varKinds.const) {
      const j = this._scope.toName(c);
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
    forIn(c, f, S, O = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(c, (0, t._)`Object.keys(${f})`, S);
      const j = this._scope.toName(c);
      return this._for(new R("in", O, j, f), () => S(j));
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
      const O = new se();
      if (this._blockNode(O), this.code(c), f) {
        const j = this.name("e");
        this._currNode = O.catch = new ae(j), f(j);
      }
      return S && (this._currNode = O.finally = new de(), this.code(S)), this._endBlockNode(ae, de);
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
    func(c, f = t.nil, S, O) {
      return this._blockNode(new L(c, f, S)), O && this.code(O).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(L);
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
  e.CodeGen = F;
  function z(y, c) {
    for (const f in c)
      y[f] = (y[f] || 0) + (c[f] || 0);
    return y;
  }
  function oe(y, c) {
    return c instanceof t._CodeOrName ? z(y, c.names) : y;
  }
  function T(y, c, f) {
    if (y instanceof t.Name)
      return S(y);
    if (!O(y))
      return y;
    return new t._Code(y._items.reduce((j, q) => (q instanceof t.Name && (q = S(q)), q instanceof t._Code ? j.push(...q._items) : j.push(q), j), []));
    function S(j) {
      const q = f[j.str];
      return q === void 0 || c[j.str] !== 1 ? j : (delete c[j.str], q);
    }
    function O(j) {
      return j instanceof t._Code && j._items.some((q) => q instanceof t.Name && c[q.str] === 1 && f[q.str] !== void 0);
    }
  }
  function k(y, c) {
    for (const f in c)
      y[f] = (y[f] || 0) - (c[f] || 0);
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
    return (c, f) => c === t.nil ? f : f === t.nil ? c : (0, t._)`${b(c)} ${y} ${b(f)}`;
  }
  function b(y) {
    return y instanceof t.Name ? y : (0, t._)`(${y})`;
  }
})(Y);
var A = {};
Object.defineProperty(A, "__esModule", { value: !0 });
A.checkStrictMode = A.getErrorPath = A.Type = A.useFunc = A.setEvaluated = A.evaluatedPropsToName = A.mergeEvaluated = A.eachItem = A.unescapeJsonPointer = A.escapeJsonPointer = A.escapeFragment = A.unescapeFragment = A.schemaRefOrVal = A.schemaHasRulesButRef = A.schemaHasRules = A.checkUnknownRules = A.alwaysValidSchema = A.toHash = void 0;
const ie = Y, Ld = rn;
function Vd(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
A.toHash = Vd;
function Fd(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (tl(e, t), !rl(t, e.self.RULES.all));
}
A.alwaysValidSchema = Fd;
function tl(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const o in t)
    s[o] || ol(e, `unknown keyword: "${o}"`);
}
A.checkUnknownRules = tl;
function rl(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
A.schemaHasRules = rl;
function Ud(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
A.schemaHasRulesButRef = Ud;
function zd({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ie._)`${r}`;
  }
  return (0, ie._)`${e}${t}${(0, ie.getProperty)(n)}`;
}
A.schemaRefOrVal = zd;
function qd(e) {
  return nl(decodeURIComponent(e));
}
A.unescapeFragment = qd;
function Gd(e) {
  return encodeURIComponent(ho(e));
}
A.escapeFragment = Gd;
function ho(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
A.escapeJsonPointer = ho;
function nl(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
A.unescapeJsonPointer = nl;
function Kd(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
A.eachItem = Kd;
function vi({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, o, a, l) => {
    const i = a === void 0 ? o : a instanceof ie.Name ? (o instanceof ie.Name ? e(s, o, a) : t(s, o, a), a) : o instanceof ie.Name ? (t(s, a, o), o) : r(o, a);
    return l === ie.Name && !(i instanceof ie.Name) ? n(s, i) : i;
  };
}
A.mergeEvaluated = {
  props: vi({
    mergeNames: (e, t, r) => e.if((0, ie._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ie._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ie._)`${r} || {}`).code((0, ie._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ie._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ie._)`${r} || {}`), mo(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: sl
  }),
  items: vi({
    mergeNames: (e, t, r) => e.if((0, ie._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ie._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ie._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ie._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function sl(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ie._)`{}`);
  return t !== void 0 && mo(e, r, t), r;
}
A.evaluatedPropsToName = sl;
function mo(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ie._)`${t}${(0, ie.getProperty)(n)}`, !0));
}
A.setEvaluated = mo;
const wi = {};
function Hd(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: wi[t.code] || (wi[t.code] = new Ld._Code(t.code))
  });
}
A.useFunc = Hd;
var Ks;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Ks || (A.Type = Ks = {}));
function Bd(e, t, r) {
  if (e instanceof ie.Name) {
    const n = t === Ks.Num;
    return r ? n ? (0, ie._)`"[" + ${e} + "]"` : (0, ie._)`"['" + ${e} + "']"` : n ? (0, ie._)`"/" + ${e}` : (0, ie._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ie.getProperty)(e).toString() : "/" + ho(e);
}
A.getErrorPath = Bd;
function ol(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
A.checkStrictMode = ol;
var Fe = {};
Object.defineProperty(Fe, "__esModule", { value: !0 });
const Pe = Y, Wd = {
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
Fe.default = Wd;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = Y, r = A, n = Fe;
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: m }) => m ? (0, t.str)`"${$}" keyword must be ${m} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, m = e.keywordError, w, P) {
    const { it: I } = $, { gen: R, compositeRule: L, allErrors: W } = I, se = h($, m, w);
    P ?? (L || W) ? i(R, se) : d(I, (0, t._)`[${se}]`);
  }
  e.reportError = s;
  function o($, m = e.keywordError, w) {
    const { it: P } = $, { gen: I, compositeRule: R, allErrors: L } = P, W = h($, m, w);
    i(I, W), R || L || d(P, n.default.vErrors);
  }
  e.reportExtraError = o;
  function a($, m) {
    $.assign(n.default.errors, m), $.if((0, t._)`${n.default.vErrors} !== null`, () => $.if(m, () => $.assign((0, t._)`${n.default.vErrors}.length`, m), () => $.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function l({ gen: $, keyword: m, schemaValue: w, data: P, errsCount: I, it: R }) {
    if (I === void 0)
      throw new Error("ajv implementation error");
    const L = $.name("err");
    $.forRange("i", I, n.default.errors, (W) => {
      $.const(L, (0, t._)`${n.default.vErrors}[${W}]`), $.if((0, t._)`${L}.instancePath === undefined`, () => $.assign((0, t._)`${L}.instancePath`, (0, t.strConcat)(n.default.instancePath, R.errorPath))), $.assign((0, t._)`${L}.schemaPath`, (0, t.str)`${R.errSchemaPath}/${m}`), R.opts.verbose && ($.assign((0, t._)`${L}.schema`, w), $.assign((0, t._)`${L}.data`, P));
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
    return g($, m, R), P.object(...R);
  }
  function _({ errorPath: $ }, { instancePath: m }) {
    const w = m ? (0, t.str)`${$}${(0, r.getErrorPath)(m, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, w)];
  }
  function v({ keyword: $, it: { errSchemaPath: m } }, { schemaPath: w, parentSchema: P }) {
    let I = P ? m : (0, t.str)`${m}/${$}`;
    return w && (I = (0, t.str)`${I}${(0, r.getErrorPath)(w, r.Type.Str)}`), [u.schemaPath, I];
  }
  function g($, { params: m, message: w }, P) {
    const { keyword: I, data: R, schemaValue: L, it: W } = $, { opts: se, propertyName: ae, topSchemaRef: de, schemaPath: F } = W;
    P.push([u.keyword, I], [u.params, typeof m == "function" ? m($) : m || (0, t._)`{}`]), se.messages && P.push([u.message, typeof w == "function" ? w($) : w]), se.verbose && P.push([u.schema, L], [u.parentSchema, (0, t._)`${de}${F}`], [n.default.data, R]), ae && P.push([u.propertyName, ae]);
  }
})(sn);
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.boolOrEmptySchema = _r.topBoolOrEmptySchema = void 0;
const Xd = sn, Jd = Y, Yd = Fe, xd = {
  message: "boolean schema is false"
};
function Zd(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? al(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Yd.default.data) : (t.assign((0, Jd._)`${n}.errors`, null), t.return(!0));
}
_r.topBoolOrEmptySchema = Zd;
function Qd(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), al(e)) : r.var(t, !0);
}
_r.boolOrEmptySchema = Qd;
function al(e, t) {
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
  (0, Xd.reportError)(s, xd, void 0, t);
}
var ye = {}, tr = {};
Object.defineProperty(tr, "__esModule", { value: !0 });
tr.getRules = tr.isJSONType = void 0;
const ef = ["string", "number", "integer", "boolean", "null", "object", "array"], tf = new Set(ef);
function rf(e) {
  return typeof e == "string" && tf.has(e);
}
tr.isJSONType = rf;
function nf() {
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
tr.getRules = nf;
var lt = {};
Object.defineProperty(lt, "__esModule", { value: !0 });
lt.shouldUseRule = lt.shouldUseGroup = lt.schemaHasRulesForType = void 0;
function sf({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && il(e, n);
}
lt.schemaHasRulesForType = sf;
function il(e, t) {
  return t.rules.some((r) => cl(e, r));
}
lt.shouldUseGroup = il;
function cl(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
lt.shouldUseRule = cl;
Object.defineProperty(ye, "__esModule", { value: !0 });
ye.reportTypeError = ye.checkDataTypes = ye.checkDataType = ye.coerceAndCheckDataType = ye.getJSONTypes = ye.getSchemaTypes = ye.DataType = void 0;
const of = tr, af = lt, cf = sn, x = Y, ll = A;
var pr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(pr || (ye.DataType = pr = {}));
function lf(e) {
  const t = ul(e.type);
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
ye.getSchemaTypes = lf;
function ul(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(of.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ye.getJSONTypes = ul;
function uf(e, t) {
  const { gen: r, data: n, opts: s } = e, o = df(t, s.coerceTypes), a = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, af.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const l = po(t, n, s.strictNumbers, pr.Wrong);
    r.if(l, () => {
      o.length ? ff(e, t, o) : $o(e);
    });
  }
  return a;
}
ye.coerceAndCheckDataType = uf;
const dl = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function df(e, t) {
  return t ? e.filter((r) => dl.has(r) || t === "array" && r === "array") : [];
}
function ff(e, t, r) {
  const { gen: n, data: s, opts: o } = e, a = n.let("dataType", (0, x._)`typeof ${s}`), l = n.let("coerced", (0, x._)`undefined`);
  o.coerceTypes === "array" && n.if((0, x._)`${a} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, x._)`${s}[0]`).assign(a, (0, x._)`typeof ${s}`).if(po(t, s, o.strictNumbers), () => n.assign(l, s))), n.if((0, x._)`${l} !== undefined`);
  for (const d of r)
    (dl.has(d) || d === "array" && o.coerceTypes === "array") && i(d);
  n.else(), $o(e), n.endIf(), n.if((0, x._)`${l} !== undefined`, () => {
    n.assign(s, l), hf(e, l);
  });
  function i(d) {
    switch (d) {
      case "string":
        n.elseIf((0, x._)`${a} == "number" || ${a} == "boolean"`).assign(l, (0, x._)`"" + ${s}`).elseIf((0, x._)`${s} === null`).assign(l, (0, x._)`""`);
        return;
      case "number":
        n.elseIf((0, x._)`${a} == "boolean" || ${s} === null
              || (${a} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, x._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, x._)`${a} === "boolean" || ${s} === null
              || (${a} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, x._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, x._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, x._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, x._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, x._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${s} === null`).assign(l, (0, x._)`[${s}]`);
    }
  }
}
function hf({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, x._)`${t} !== undefined`, () => e.assign((0, x._)`${t}[${r}]`, n));
}
function Hs(e, t, r, n = pr.Correct) {
  const s = n === pr.Correct ? x.operators.EQ : x.operators.NEQ;
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
  return n === pr.Correct ? o : (0, x.not)(o);
  function a(l = x.nil) {
    return (0, x.and)((0, x._)`typeof ${t} == "number"`, l, r ? (0, x._)`isFinite(${t})` : x.nil);
  }
}
ye.checkDataType = Hs;
function po(e, t, r, n) {
  if (e.length === 1)
    return Hs(e[0], t, r, n);
  let s;
  const o = (0, ll.toHash)(e);
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
const mf = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, x._)`{type: ${e}}` : (0, x._)`{type: ${t}}`
};
function $o(e) {
  const t = pf(e);
  (0, cf.reportError)(t, mf);
}
ye.reportTypeError = $o;
function pf(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, ll.schemaRefOrVal)(e, n, "type");
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
const or = Y, $f = A;
function yf(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Ei(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, o) => Ei(e, o, s.default));
}
ts.assignDefaults = yf;
function Ei(e, t, r) {
  const { gen: n, compositeRule: s, data: o, opts: a } = e;
  if (r === void 0)
    return;
  const l = (0, or._)`${o}${(0, or.getProperty)(t)}`;
  if (s) {
    (0, $f.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let i = (0, or._)`${l} === undefined`;
  a.useDefaults === "empty" && (i = (0, or._)`${i} || ${l} === null || ${l} === ""`), n.if(i, (0, or._)`${l} = ${(0, or.stringify)(r)}`);
}
var rt = {}, te = {};
Object.defineProperty(te, "__esModule", { value: !0 });
te.validateUnion = te.validateArray = te.usePattern = te.callValidateCode = te.schemaProperties = te.allSchemaProperties = te.noPropertyInData = te.propertyInData = te.isOwnProperty = te.hasPropFunc = te.reportMissingProp = te.checkMissingProp = te.checkReportMissingProp = void 0;
const le = Y, yo = A, gt = Fe, gf = A;
function _f(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(_o(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, le._)`${t}` }, !0), e.error();
  });
}
te.checkReportMissingProp = _f;
function vf({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, le.or)(...n.map((o) => (0, le.and)(_o(e, t, o, r.ownProperties), (0, le._)`${s} = ${o}`)));
}
te.checkMissingProp = vf;
function wf(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
te.reportMissingProp = wf;
function fl(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, le._)`Object.prototype.hasOwnProperty`
  });
}
te.hasPropFunc = fl;
function go(e, t, r) {
  return (0, le._)`${fl(e)}.call(${t}, ${r})`;
}
te.isOwnProperty = go;
function Ef(e, t, r, n) {
  const s = (0, le._)`${t}${(0, le.getProperty)(r)} !== undefined`;
  return n ? (0, le._)`${s} && ${go(e, t, r)}` : s;
}
te.propertyInData = Ef;
function _o(e, t, r, n) {
  const s = (0, le._)`${t}${(0, le.getProperty)(r)} === undefined`;
  return n ? (0, le.or)(s, (0, le.not)(go(e, t, r))) : s;
}
te.noPropertyInData = _o;
function hl(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
te.allSchemaProperties = hl;
function Sf(e, t) {
  return hl(t).filter((r) => !(0, yo.alwaysValidSchema)(e, t[r]));
}
te.schemaProperties = Sf;
function bf({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: o }, it: a }, l, i, d) {
  const u = d ? (0, le._)`${e}, ${t}, ${n}${s}` : t, h = [
    [gt.default.instancePath, (0, le.strConcat)(gt.default.instancePath, o)],
    [gt.default.parentData, a.parentData],
    [gt.default.parentDataProperty, a.parentDataProperty],
    [gt.default.rootData, gt.default.rootData]
  ];
  a.opts.dynamicRef && h.push([gt.default.dynamicAnchors, gt.default.dynamicAnchors]);
  const E = (0, le._)`${u}, ${r.object(...h)}`;
  return i !== le.nil ? (0, le._)`${l}.call(${i}, ${E})` : (0, le._)`${l}(${E})`;
}
te.callValidateCode = bf;
const Pf = (0, le._)`new RegExp`;
function Nf({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, o = s(r, n);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, le._)`${s.code === "new RegExp" ? Pf : (0, gf.useFunc)(e, s)}(${r}, ${n})`
  });
}
te.usePattern = Nf;
function If(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, o = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return a(() => t.assign(l, !1)), l;
  }
  return t.var(o, !0), a(() => t.break()), o;
  function a(l) {
    const i = t.const("len", (0, le._)`${r}.length`);
    t.forRange("i", 0, i, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: yo.Type.Num
      }, o), t.if((0, le.not)(o), l);
    });
  }
}
te.validateArray = If;
function Rf(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((i) => (0, yo.alwaysValidSchema)(s, i)) && !s.opts.unevaluated)
    return;
  const a = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((i, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(a, (0, le._)`${a} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, le.not)(a));
  })), e.result(a, () => e.reset(), () => e.error(!0));
}
te.validateUnion = Rf;
Object.defineProperty(rt, "__esModule", { value: !0 });
rt.validateKeywordUsage = rt.validSchemaType = rt.funcKeywordCode = rt.macroKeywordCode = void 0;
const Oe = Y, Bt = Fe, Of = te, Tf = sn;
function jf(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: o, it: a } = e, l = t.macro.call(a.self, s, o, a), i = ml(r, n, l);
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
rt.macroKeywordCode = jf;
function kf(e, t) {
  var r;
  const { gen: n, keyword: s, schema: o, parentSchema: a, $data: l, it: i } = e;
  Cf(i, t);
  const d = !l && t.compile ? t.compile.call(i.self, o, a, i) : t.validate, u = ml(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      g(), t.modifying && Si(e), $(() => e.error());
    else {
      const m = t.async ? _() : v();
      t.modifying && Si(e), $(() => Af(e, m));
    }
  }
  function _() {
    const m = n.let("ruleErrs", null);
    return n.try(() => g((0, Oe._)`await `), (w) => n.assign(h, !1).if((0, Oe._)`${w} instanceof ${i.ValidationError}`, () => n.assign(m, (0, Oe._)`${w}.errors`), () => n.throw(w))), m;
  }
  function v() {
    const m = (0, Oe._)`${u}.errors`;
    return n.assign(m, null), g(Oe.nil), m;
  }
  function g(m = t.async ? (0, Oe._)`await ` : Oe.nil) {
    const w = i.opts.passContext ? Bt.default.this : Bt.default.self, P = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, Oe._)`${m}${(0, Of.callValidateCode)(e, u, w, P)}`, t.modifying);
  }
  function $(m) {
    var w;
    n.if((0, Oe.not)((w = t.valid) !== null && w !== void 0 ? w : h), m);
  }
}
rt.funcKeywordCode = kf;
function Si(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Oe._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Af(e, t) {
  const { gen: r } = e;
  r.if((0, Oe._)`Array.isArray(${t})`, () => {
    r.assign(Bt.default.vErrors, (0, Oe._)`${Bt.default.vErrors} === null ? ${t} : ${Bt.default.vErrors}.concat(${t})`).assign(Bt.default.errors, (0, Oe._)`${Bt.default.vErrors}.length`), (0, Tf.extendErrors)(e);
  }, () => e.error());
}
function Cf({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function ml(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Oe.stringify)(r) });
}
function Df(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
rt.validSchemaType = Df;
function Mf({ schema: e, opts: t, self: r, errSchemaPath: n }, s, o) {
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
rt.validateKeywordUsage = Mf;
var Rt = {};
Object.defineProperty(Rt, "__esModule", { value: !0 });
Rt.extendSubschemaMode = Rt.extendSubschemaData = Rt.getSubschema = void 0;
const et = Y, pl = A;
function Lf(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: o, topSchemaRef: a }) {
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
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, pl.escapeFragment)(r)}`
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
Rt.getSubschema = Lf;
function Vf(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: o, propertyName: a }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, E = l.let("data", (0, et._)`${t.data}${(0, et.getProperty)(r)}`, !0);
    i(E), e.errorPath = (0, et.str)`${d}${(0, pl.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, et._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
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
Rt.extendSubschemaData = Vf;
function Ff(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: o }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Rt.extendSubschemaMode = Ff;
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
}, $l = { exports: {} }, Nt = $l.exports = function(e, t, r) {
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
function Tn(e, t, r, n, s, o, a, l, i, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, o, a, l, i, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in Nt.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            Tn(e, t, r, h[E], s + "/" + u + "/" + E, o, s, u, n, E);
      } else if (u in Nt.propsKeywords) {
        if (h && typeof h == "object")
          for (var _ in h)
            Tn(e, t, r, h[_], s + "/" + u + "/" + Uf(_), o, s, u, n, _);
      } else (u in Nt.keywords || e.allKeys && !(u in Nt.skipKeywords)) && Tn(e, t, r, h, s + "/" + u, o, s, u, n);
    }
    r(n, s, o, a, l, i, d);
  }
}
function Uf(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var zf = $l.exports;
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.getSchemaRefs = Ee.resolveUrl = Ee.normalizeId = Ee._getFullPath = Ee.getFullPath = Ee.inlineRef = void 0;
const qf = A, Gf = rs, Kf = zf, Hf = /* @__PURE__ */ new Set([
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
function Bf(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Bs(e) : t ? yl(e) <= t : !1;
}
Ee.inlineRef = Bf;
const Wf = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Bs(e) {
  for (const t in e) {
    if (Wf.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Bs) || typeof r == "object" && Bs(r))
      return !0;
  }
  return !1;
}
function yl(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Hf.has(r) && (typeof e[r] == "object" && (0, qf.eachItem)(e[r], (n) => t += yl(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function gl(e, t = "", r) {
  r !== !1 && (t = $r(t));
  const n = e.parse(t);
  return _l(e, n);
}
Ee.getFullPath = gl;
function _l(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ee._getFullPath = _l;
const Xf = /#\/?$/;
function $r(e) {
  return e ? e.replace(Xf, "") : "";
}
Ee.normalizeId = $r;
function Jf(e, t, r) {
  return r = $r(r), e.resolve(t, r);
}
Ee.resolveUrl = Jf;
const Yf = /^[a-z_][-a-z0-9._]*$/i;
function xf(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = $r(e[r] || t), o = { "": s }, a = gl(n, s, !1), l = {}, i = /* @__PURE__ */ new Set();
  return Kf(e, { allKeys: !0 }, (h, E, _, v) => {
    if (v === void 0)
      return;
    const g = a + E;
    let $ = o[v];
    typeof h[r] == "string" && ($ = m.call(this, h[r])), w.call(this, h.$anchor), w.call(this, h.$dynamicAnchor), o[E] = $;
    function m(P) {
      const I = this.opts.uriResolver.resolve;
      if (P = $r($ ? I($, P) : P), i.has(P))
        throw u(P);
      i.add(P);
      let R = this.refs[P];
      return typeof R == "string" && (R = this.refs[R]), typeof R == "object" ? d(h, R.schema, P) : P !== $r(g) && (P[0] === "#" ? (d(h, l[P], P), l[P] = h) : this.refs[P] = g), P;
    }
    function w(P) {
      if (typeof P == "string") {
        if (!Yf.test(P))
          throw new Error(`invalid anchor "${P}"`);
        m.call(this, `#${P}`);
      }
    }
  }), l;
  function d(h, E, _) {
    if (E !== void 0 && !Gf(h, E))
      throw u(_);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ee.getSchemaRefs = xf;
Object.defineProperty(Je, "__esModule", { value: !0 });
Je.getData = Je.KeywordCxt = Je.validateFunctionCode = void 0;
const vl = _r, bi = ye, vo = lt, qn = ye, Zf = ts, Br = rt, Ss = Rt, K = Y, X = Fe, Qf = Ee, ut = A, Vr = sn;
function eh(e) {
  if (Sl(e) && (bl(e), El(e))) {
    nh(e);
    return;
  }
  wl(e, () => (0, vl.topBoolOrEmptySchema)(e));
}
Je.validateFunctionCode = eh;
function wl({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, o) {
  s.code.es5 ? e.func(t, (0, K._)`${X.default.data}, ${X.default.valCxt}`, n.$async, () => {
    e.code((0, K._)`"use strict"; ${Pi(r, s)}`), rh(e, s), e.code(o);
  }) : e.func(t, (0, K._)`${X.default.data}, ${th(s)}`, n.$async, () => e.code(Pi(r, s)).code(o));
}
function th(e) {
  return (0, K._)`{${X.default.instancePath}="", ${X.default.parentData}, ${X.default.parentDataProperty}, ${X.default.rootData}=${X.default.data}${e.dynamicRef ? (0, K._)`, ${X.default.dynamicAnchors}={}` : K.nil}}={}`;
}
function rh(e, t) {
  e.if(X.default.valCxt, () => {
    e.var(X.default.instancePath, (0, K._)`${X.default.valCxt}.${X.default.instancePath}`), e.var(X.default.parentData, (0, K._)`${X.default.valCxt}.${X.default.parentData}`), e.var(X.default.parentDataProperty, (0, K._)`${X.default.valCxt}.${X.default.parentDataProperty}`), e.var(X.default.rootData, (0, K._)`${X.default.valCxt}.${X.default.rootData}`), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, K._)`${X.default.valCxt}.${X.default.dynamicAnchors}`);
  }, () => {
    e.var(X.default.instancePath, (0, K._)`""`), e.var(X.default.parentData, (0, K._)`undefined`), e.var(X.default.parentDataProperty, (0, K._)`undefined`), e.var(X.default.rootData, X.default.data), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, K._)`{}`);
  });
}
function nh(e) {
  const { schema: t, opts: r, gen: n } = e;
  wl(e, () => {
    r.$comment && t.$comment && Nl(e), ch(e), n.let(X.default.vErrors, null), n.let(X.default.errors, 0), r.unevaluated && sh(e), Pl(e), dh(e);
  });
}
function sh(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, K._)`${r}.evaluated`), t.if((0, K._)`${e.evaluated}.dynamicProps`, () => t.assign((0, K._)`${e.evaluated}.props`, (0, K._)`undefined`)), t.if((0, K._)`${e.evaluated}.dynamicItems`, () => t.assign((0, K._)`${e.evaluated}.items`, (0, K._)`undefined`));
}
function Pi(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, K._)`/*# sourceURL=${r} */` : K.nil;
}
function oh(e, t) {
  if (Sl(e) && (bl(e), El(e))) {
    ah(e, t);
    return;
  }
  (0, vl.boolOrEmptySchema)(e, t);
}
function El({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Sl(e) {
  return typeof e.schema != "boolean";
}
function ah(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Nl(e), lh(e), uh(e);
  const o = n.const("_errs", X.default.errors);
  Pl(e, o), n.var(t, (0, K._)`${o} === ${X.default.errors}`);
}
function bl(e) {
  (0, ut.checkUnknownRules)(e), ih(e);
}
function Pl(e, t) {
  if (e.opts.jtd)
    return Ni(e, [], !1, t);
  const r = (0, bi.getSchemaTypes)(e.schema), n = (0, bi.coerceAndCheckDataType)(e, r);
  Ni(e, r, !n, t);
}
function ih(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, ut.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function ch(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, ut.checkStrictMode)(e, "default is ignored in the schema root");
}
function lh(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, Qf.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function uh(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Nl({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const o = r.$comment;
  if (s.$comment === !0)
    e.code((0, K._)`${X.default.self}.logger.log(${o})`);
  else if (typeof s.$comment == "function") {
    const a = (0, K.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, K._)`${X.default.self}.opts.$comment(${o}, ${a}, ${l}.schema)`);
  }
}
function dh(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: o } = e;
  r.$async ? t.if((0, K._)`${X.default.errors} === 0`, () => t.return(X.default.data), () => t.throw((0, K._)`new ${s}(${X.default.vErrors})`)) : (t.assign((0, K._)`${n}.errors`, X.default.vErrors), o.unevaluated && fh(e), t.return((0, K._)`${X.default.errors} === 0`));
}
function fh({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof K.Name && e.assign((0, K._)`${t}.props`, r), n instanceof K.Name && e.assign((0, K._)`${t}.items`, n);
}
function Ni(e, t, r, n) {
  const { gen: s, schema: o, data: a, allErrors: l, opts: i, self: d } = e, { RULES: u } = d;
  if (o.$ref && (i.ignoreKeywordsWithRef || !(0, ut.schemaHasRulesButRef)(o, u))) {
    s.block(() => Ol(e, "$ref", u.all.$ref.definition));
    return;
  }
  i.jtd || hh(e, t), s.block(() => {
    for (const E of u.rules)
      h(E);
    h(u.post);
  });
  function h(E) {
    (0, vo.shouldUseGroup)(o, E) && (E.type ? (s.if((0, qn.checkDataType)(E.type, a, i.strictNumbers)), Ii(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, qn.reportTypeError)(e)), s.endIf()) : Ii(e, E), l || s.if((0, K._)`${X.default.errors} === ${n || 0}`));
  }
}
function Ii(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, Zf.assignDefaults)(e, t.type), r.block(() => {
    for (const o of t.rules)
      (0, vo.shouldUseRule)(n, o) && Ol(e, o.keyword, o.definition, t.type);
  });
}
function hh(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (mh(e, t), e.opts.allowUnionTypes || ph(e, t), $h(e, e.dataTypes));
}
function mh(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Il(e.dataTypes, r) || wo(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), gh(e, t);
  }
}
function ph(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && wo(e, "use allowUnionTypes to allow union type keyword");
}
function $h(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, vo.shouldUseRule)(e.schema, s)) {
      const { type: o } = s.definition;
      o.length && !o.some((a) => yh(t, a)) && wo(e, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function yh(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Il(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function gh(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Il(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function wo(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, ut.checkStrictMode)(e, t, e.opts.strictTypes);
}
let Rl = class {
  constructor(t, r, n) {
    if ((0, Br.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, ut.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Tl(this.$data, t));
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
    return (0, K.or)(a(), l());
    function a() {
      if (n.length) {
        if (!(r instanceof K.Name))
          throw new Error("ajv implementation error");
        const i = Array.isArray(n) ? n : [n];
        return (0, K._)`${(0, qn.checkDataTypes)(i, r, o.opts.strictNumbers, qn.DataType.Wrong)}`;
      }
      return K.nil;
    }
    function l() {
      if (s.validateSchema) {
        const i = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, K._)`!${i}(${r})`;
      }
      return K.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Ss.getSubschema)(this.it, t);
    (0, Ss.extendSubschemaData)(n, this.it, t), (0, Ss.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return oh(s, r), s;
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
Je.KeywordCxt = Rl;
function Ol(e, t, r, n) {
  const s = new Rl(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Br.funcKeywordCode)(s, r) : "macro" in r ? (0, Br.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Br.funcKeywordCode)(s, r);
}
const _h = /^\/(?:[^~]|~0|~1)*$/, vh = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Tl(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, o;
  if (e === "")
    return X.default.rootData;
  if (e[0] === "/") {
    if (!_h.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, o = X.default.rootData;
  } else {
    const d = vh.exec(e);
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
    d && (o = (0, K._)`${o}${(0, K.getProperty)((0, ut.unescapeJsonPointer)(d))}`, a = (0, K._)`${a} && ${o}`);
  return a;
  function i(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
Je.getData = Tl;
var on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
let wh = class extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
};
on.default = wh;
var Sr = {};
Object.defineProperty(Sr, "__esModule", { value: !0 });
const bs = Ee;
let Eh = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, bs.resolveUrl)(t, r, n), this.missingSchema = (0, bs.normalizeId)((0, bs.getFullPath)(t, this.missingRef));
  }
};
Sr.default = Eh;
var je = {};
Object.defineProperty(je, "__esModule", { value: !0 });
je.resolveSchema = je.getCompilingSchema = je.resolveRef = je.compileSchema = je.SchemaEnv = void 0;
const Ge = Y, Sh = on, Kt = Fe, We = Ee, Ri = A, bh = Je;
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
  const t = jl.call(this, e);
  if (t)
    return t;
  const r = (0, We.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: o } = this.opts, a = new Ge.CodeGen(this.scope, { es5: n, lines: s, ownProperties: o });
  let l;
  e.$async && (l = a.scopeValue("Error", {
    ref: Sh.default,
    code: (0, Ge._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const i = a.scopeName("validate");
  e.validateName = i;
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
    this._compilations.add(e), (0, bh.validateFunctionCode)(d), a.optimize(this.opts.code.optimize);
    const h = a.toString();
    u = `${a.scopeRefs(Kt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const _ = new Function(`${Kt.default.self}`, `${Kt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(i, { ref: _ }), _.errors = null, _.schema = e.schema, _.schemaEnv = e, e.$async && (_.$async = !0), this.opts.code.source === !0 && (_.source = { validateName: i, validateCode: h, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: v, items: g } = d;
      _.evaluated = {
        props: v instanceof Ge.Name ? void 0 : v,
        items: g instanceof Ge.Name ? void 0 : g,
        dynamicProps: v instanceof Ge.Name,
        dynamicItems: g instanceof Ge.Name
      }, _.source && (_.source.evaluated = (0, Ge.stringify)(_.evaluated));
    }
    return e.validate = _, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
je.compileSchema = Eo;
function Ph(e, t, r) {
  var n;
  r = (0, We.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let o = Rh.call(this, e, r);
  if (o === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    a && (o = new ns({ schema: a, schemaId: l, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[r] = Nh.call(this, o);
}
je.resolveRef = Ph;
function Nh(e) {
  return (0, We.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Eo.call(this, e);
}
function jl(e) {
  for (const t of this._compilations)
    if (Ih(t, e))
      return t;
}
je.getCompilingSchema = jl;
function Ih(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Rh(e, t) {
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
    const l = ss.call(this, e, a);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : Ps.call(this, r, l);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || Eo.call(this, a), o === (0, We.normalizeId)(t)) {
      const { schema: l } = a, { schemaId: i } = this.opts, d = l[i];
      return d && (s = (0, We.resolveUrl)(this.opts.uriResolver, s, d)), new ns({ schema: l, schemaId: i, root: e, baseId: s });
    }
    return Ps.call(this, r, a);
  }
}
je.resolveSchema = ss;
const Oh = /* @__PURE__ */ new Set([
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
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const i = r[(0, Ri.unescapeFragment)(l)];
    if (i === void 0)
      return;
    r = i;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !Oh.has(l) && d && (t = (0, We.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let o;
  if (typeof r != "boolean" && r.$ref && !(0, Ri.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, We.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    o = ss.call(this, n, l);
  }
  const { schemaId: a } = this.opts;
  if (o = o || new ns({ schema: r, schemaId: a, root: n, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const Th = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", jh = "Meta-schema for $data reference (JSON AnySchema extension proposal)", kh = "object", Ah = [
  "$data"
], Ch = {
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
}, Dh = !1, Mh = {
  $id: Th,
  description: jh,
  type: kh,
  required: Ah,
  properties: Ch,
  additionalProperties: Dh
};
var So = {}, os = { exports: {} };
const Lh = {
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
var Vh = {
  HEX: Lh
};
const { HEX: Fh } = Vh, Uh = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
function kl(e) {
  if (Cl(e, ".") < 3)
    return { host: e, isIPV4: !1 };
  const t = e.match(Uh) || [], [r] = t;
  return r ? { host: qh(r, "."), isIPV4: !0 } : { host: e, isIPV4: !1 };
}
function Oi(e, t = !1) {
  let r = "", n = !0;
  for (const s of e) {
    if (Fh[s] === void 0) return;
    s !== "0" && n === !0 && (n = !1), n || (r += s);
  }
  return t && r.length === 0 && (r = "0"), r;
}
function zh(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let o = !1, a = !1, l = !1;
  function i() {
    if (s.length) {
      if (o === !1) {
        const d = Oi(s);
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
  return s.length && (o ? r.zone = s.join("") : l ? n.push(s.join("")) : n.push(Oi(s))), r.address = n.join(""), r;
}
function Al(e) {
  if (Cl(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = zh(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, escapedHost: n, isIPV6: !0 };
  }
}
function qh(e, t) {
  let r = "", n = !0;
  const s = e.length;
  for (let o = 0; o < s; o++) {
    const a = e[o];
    a === "0" && n ? (o + 1 <= s && e[o + 1] === t || o + 1 === s) && (r += a, n = !1) : (a === t ? n = !0 : n = !1, r += a);
  }
  return r;
}
function Cl(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
const Ti = /^\.\.?\//u, ji = /^\/\.(?:\/|$)/u, ki = /^\/\.\.(?:\/|$)/u, Gh = /^\/?(?:.|\n)*?(?=\/|$)/u;
function Kh(e) {
  const t = [];
  for (; e.length; )
    if (e.match(Ti))
      e = e.replace(Ti, "");
    else if (e.match(ji))
      e = e.replace(ji, "/");
    else if (e.match(ki))
      e = e.replace(ki, "/"), t.pop();
    else if (e === "." || e === "..")
      e = "";
    else {
      const r = e.match(Gh);
      if (r) {
        const n = r[0];
        e = e.slice(n.length), t.push(n);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return t.join("");
}
function Hh(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function Bh(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    const n = kl(r);
    if (n.isIPV4)
      r = n.host;
    else {
      const s = Al(n.host);
      s.isIPV6 === !0 ? r = `[${s.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var Wh = {
  recomposeAuthority: Bh,
  normalizeComponentEncoding: Hh,
  removeDotSegments: Kh,
  normalizeIPv4: kl,
  normalizeIPv6: Al
};
const Xh = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, Jh = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Dl(e) {
  return typeof e.secure == "boolean" ? e.secure : String(e.scheme).toLowerCase() === "wss";
}
function Ml(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function Ll(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function Yh(e) {
  return e.secure = Dl(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function xh(e) {
  if ((e.port === (Dl(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function Zh(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(Jh);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, o = bo[s];
    e.path = void 0, o && (e = o.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function Qh(e, t) {
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, o = bo[s];
  o && (e = o.serialize(e, t));
  const a = e, l = e.nss;
  return a.path = `${n || t.nid}:${l}`, t.skipEscape = !0, a;
}
function em(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !Xh.test(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function tm(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const Vl = {
  scheme: "http",
  domainHost: !0,
  parse: Ml,
  serialize: Ll
}, rm = {
  scheme: "https",
  domainHost: Vl.domainHost,
  parse: Ml,
  serialize: Ll
}, jn = {
  scheme: "ws",
  domainHost: !0,
  parse: Yh,
  serialize: xh
}, nm = {
  scheme: "wss",
  domainHost: jn.domainHost,
  parse: jn.parse,
  serialize: jn.serialize
}, sm = {
  scheme: "urn",
  parse: Zh,
  serialize: Qh,
  skipNormalize: !0
}, om = {
  scheme: "urn:uuid",
  parse: em,
  serialize: tm,
  skipNormalize: !0
}, bo = {
  http: Vl,
  https: rm,
  ws: jn,
  wss: nm,
  urn: sm,
  "urn:uuid": om
};
var am = bo;
const { normalizeIPv6: im, normalizeIPv4: cm, removeDotSegments: Gr, recomposeAuthority: lm, normalizeComponentEncoding: fn } = Wh, Po = am;
function um(e, t) {
  return typeof e == "string" ? e = nt(ht(e, t), t) : typeof e == "object" && (e = ht(nt(e, t), t)), e;
}
function dm(e, t, r) {
  const n = Object.assign({ scheme: "null" }, r), s = Fl(ht(e, n), ht(t, n), n, !0);
  return nt(s, { ...n, skipEscape: !0 });
}
function Fl(e, t, r, n) {
  const s = {};
  return n || (e = ht(nt(e, r), r), t = ht(nt(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Gr(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Gr(t.path || ""), s.query = t.query) : (t.path ? (t.path.charAt(0) === "/" ? s.path = Gr(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = Gr(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function fm(e, t, r) {
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
  const a = lm(r);
  if (a !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(a), r.path && r.path.charAt(0) !== "/" && s.push("/")), r.path !== void 0) {
    let l = r.path;
    !n.absolutePath && (!o || !o.absolutePath) && (l = Gr(l)), a === void 0 && (l = l.replace(/^\/\//u, "/%2F")), s.push(l);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const hm = Array.from({ length: 127 }, (e, t) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(t)));
function mm(e) {
  let t = 0;
  for (let r = 0, n = e.length; r < n; ++r)
    if (t = e.charCodeAt(r), t > 126 || hm[t])
      return !0;
  return !1;
}
const pm = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
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
  const a = e.match(pm);
  if (a) {
    if (n.scheme = a[1], n.userinfo = a[3], n.host = a[4], n.port = parseInt(a[5], 10), n.path = a[6] || "", n.query = a[7], n.fragment = a[8], isNaN(n.port) && (n.port = a[5]), n.host) {
      const i = cm(n.host);
      if (i.isIPV4 === !1) {
        const d = im(i.host);
        n.host = d.host.toLowerCase(), o = d.isIPV6;
      } else
        n.host = i.host, o = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const l = Po[(r.scheme || n.scheme || "").toLowerCase()];
    if (!r.unicodeSupport && (!l || !l.unicodeSupport) && n.host && (r.domainHost || l && l.domainHost) && o === !1 && mm(n.host))
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
const No = {
  SCHEMES: Po,
  normalize: um,
  resolve: dm,
  resolveComponents: Fl,
  equal: fm,
  serialize: nt,
  parse: ht
};
os.exports = No;
os.exports.default = No;
os.exports.fastUri = No;
var Ul = os.exports;
Object.defineProperty(So, "__esModule", { value: !0 });
const zl = Ul;
zl.code = 'require("ajv/dist/runtime/uri").default';
So.default = zl;
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
  const n = on, s = Sr, o = tr, a = je, l = Y, i = Ee, d = ye, u = A, h = Mh, E = So, _ = (N, p) => new RegExp(N, p);
  _.code = "new RegExp";
  const v = ["removeAdditional", "useDefaults", "coerceTypes"], g = /* @__PURE__ */ new Set([
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
    var p, b, y, c, f, S, O, j, q, U, ne, Me, Tt, jt, kt, At, Ct, Dt, Mt, Lt, Vt, Ft, Ut, zt, qt;
    const qe = N.strict, Gt = (p = N.code) === null || p === void 0 ? void 0 : p.optimize, kr = Gt === !0 || Gt === void 0 ? 1 : Gt || 0, Ar = (y = (b = N.code) === null || b === void 0 ? void 0 : b.regExp) !== null && y !== void 0 ? y : _, vs = (c = N.uriResolver) !== null && c !== void 0 ? c : E.default;
    return {
      strictSchema: (S = (f = N.strictSchema) !== null && f !== void 0 ? f : qe) !== null && S !== void 0 ? S : !0,
      strictNumbers: (j = (O = N.strictNumbers) !== null && O !== void 0 ? O : qe) !== null && j !== void 0 ? j : !0,
      strictTypes: (U = (q = N.strictTypes) !== null && q !== void 0 ? q : qe) !== null && U !== void 0 ? U : "log",
      strictTuples: (Me = (ne = N.strictTuples) !== null && ne !== void 0 ? ne : qe) !== null && Me !== void 0 ? Me : "log",
      strictRequired: (jt = (Tt = N.strictRequired) !== null && Tt !== void 0 ? Tt : qe) !== null && jt !== void 0 ? jt : !1,
      code: N.code ? { ...N.code, optimize: kr, regExp: Ar } : { optimize: kr, regExp: Ar },
      loopRequired: (kt = N.loopRequired) !== null && kt !== void 0 ? kt : w,
      loopEnum: (At = N.loopEnum) !== null && At !== void 0 ? At : w,
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
      this.scope = new l.ValueScope({ scope: {}, prefixes: g, es5: b, lines: y }), this.logger = z(p.logger);
      const c = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, o.getRules)(), R.call(this, $, p, "NOT SUPPORTED"), R.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = de.call(this), p.formats && se.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && ae.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), W.call(this), p.validateFormats = c;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: b, schemaId: y } = this.opts;
      let c = h;
      y === "id" && (c = { ...h }, c.id = c.$id, delete c.$id), b && p && this.addMetaSchema(c, c[y], !1);
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
      const c = y(b);
      return "$async" in y || (this.errors = y.errors), c;
    }
    compile(p, b) {
      const y = this._addSchema(p, b);
      return y.validate || this._compileSchemaEnv(y);
    }
    compileAsync(p, b) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: y } = this.opts;
      return c.call(this, p, b);
      async function c(U, ne) {
        await f.call(this, U.$schema);
        const Me = this._addSchema(U, ne);
        return Me.validate || S.call(this, Me);
      }
      async function f(U) {
        U && !this.getSchema(U) && await c.call(this, { $ref: U }, !0);
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
    addSchema(p, b, y, c = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const S of p)
          this.addSchema(S, void 0, y, c);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: S } = this.opts;
        if (f = p[S], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return b = (0, i.normalizeId)(b || f), this._checkUnique(b), this.schemas[b] = this._addSchema(p, y, b, c, !0), this;
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
      const c = this.validate(y, p);
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
      for (; typeof (b = L.call(this, p)) == "string"; )
        p = b;
      if (b === void 0) {
        const { schemaId: y } = this.opts, c = new a.SchemaEnv({ schema: {}, schemaId: y });
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
          const b = L.call(this, p);
          return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const b = p;
          this._cache.delete(b);
          let y = p[this.opts.schemaId];
          return y && (y = (0, i.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
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
        return (0, u.eachItem)(y, (f) => k.call(this, f)), this;
      C.call(this, b);
      const c = {
        ...b,
        type: (0, d.getJSONTypes)(b.type),
        schemaType: (0, d.getJSONTypes)(b.schemaType)
      };
      return (0, u.eachItem)(y, c.type.length === 0 ? (f) => k.call(this, f, c) : (f) => c.type.forEach((S) => k.call(this, f, c, S))), this;
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
        const c = y.rules.findIndex((f) => f.keyword === p);
        c >= 0 && y.rules.splice(c, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, b) {
      return typeof b == "string" && (b = new RegExp(b)), this.formats[p] = b, this;
    }
    errorsText(p = this.errors, { separator: b = ", ", dataVar: y = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((c) => `${y}${c.instancePath} ${c.message}`).reduce((c, f) => c + b + f);
    }
    $dataMetaSchema(p, b) {
      const y = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const c of b) {
        const f = c.split("/").slice(1);
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
        const c = p[y];
        (!b || b.test(y)) && (typeof c == "string" ? delete p[y] : c && !c.meta && (this._cache.delete(c.schema), delete p[y]));
      }
    }
    _addSchema(p, b, y, c = this.opts.validateSchema, f = this.opts.addUsedSchema) {
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
      y = (0, i.normalizeId)(S || y);
      const q = i.getSchemaRefs.call(this, p, y);
      return j = new a.SchemaEnv({ schema: p, schemaId: O, meta: b, baseId: y, localRefs: q }), this._cache.set(j.schema, j), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = j), c && this.validateSchema(p, !0), j;
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
    for (const c in N) {
      const f = c;
      f in p && this.logger[y](`${b}: option ${c}. ${N[f]}`);
    }
  }
  function L(N) {
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
    for (const p of v)
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
    if ((0, u.eachItem)(N, (y) => {
      if (b.keywords[y])
        throw new Error(`Keyword ${y} is already defined`);
      if (!oe.test(y))
        throw new Error(`Keyword ${y} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(N, p, b) {
    var y;
    const c = p == null ? void 0 : p.post;
    if (b && c)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let S = c ? f.post : f.rules.find(({ type: j }) => j === b);
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
    const y = N.rules.findIndex((c) => c.keyword === b);
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
})(el);
var Io = {}, Ro = {}, Oo = {};
Object.defineProperty(Oo, "__esModule", { value: !0 });
const $m = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Oo.default = $m;
var mt = {};
Object.defineProperty(mt, "__esModule", { value: !0 });
mt.callRef = mt.getValidate = void 0;
const ym = Sr, Ai = te, Ae = Y, ar = Fe, Ci = je, hn = A, gm = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: o, validateName: a, opts: l, self: i } = n, { root: d } = o;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = Ci.resolveRef.call(i, d, s, r);
    if (u === void 0)
      throw new ym.default(n.opts.uriResolver, s, r);
    if (u instanceof Ci.SchemaEnv)
      return E(u);
    return _(u);
    function h() {
      if (o === d)
        return kn(e, a, o, o.$async);
      const v = t.scopeValue("root", { ref: d });
      return kn(e, (0, Ae._)`${v}.validate`, d, d.$async);
    }
    function E(v) {
      const g = ql(e, v);
      kn(e, g, v, v.$async);
    }
    function _(v) {
      const g = t.scopeValue("schema", l.code.source === !0 ? { ref: v, code: (0, Ae.stringify)(v) } : { ref: v }), $ = t.name("valid"), m = e.subschema({
        schema: v,
        dataTypes: [],
        schemaPath: Ae.nil,
        topSchemaRef: g,
        errSchemaPath: r
      }, $);
      e.mergeEvaluated(m), e.ok($);
    }
  }
};
function ql(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ae._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
mt.getValidate = ql;
function kn(e, t, r, n) {
  const { gen: s, it: o } = e, { allErrors: a, schemaEnv: l, opts: i } = o, d = i.passContext ? ar.default.this : Ae.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, Ae._)`await ${(0, Ai.callValidateCode)(e, t, d)}`), _(t), a || s.assign(v, !0);
    }, (g) => {
      s.if((0, Ae._)`!(${g} instanceof ${o.ValidationError})`, () => s.throw(g)), E(g), a || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, Ai.callValidateCode)(e, t, d), () => _(t), () => E(t));
  }
  function E(v) {
    const g = (0, Ae._)`${v}.errors`;
    s.assign(ar.default.vErrors, (0, Ae._)`${ar.default.vErrors} === null ? ${g} : ${ar.default.vErrors}.concat(${g})`), s.assign(ar.default.errors, (0, Ae._)`${ar.default.vErrors}.length`);
  }
  function _(v) {
    var g;
    if (!o.opts.unevaluated)
      return;
    const $ = (g = r == null ? void 0 : r.validate) === null || g === void 0 ? void 0 : g.evaluated;
    if (o.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (o.props = hn.mergeEvaluated.props(s, $.props, o.props));
      else {
        const m = s.var("props", (0, Ae._)`${v}.evaluated.props`);
        o.props = hn.mergeEvaluated.props(s, m, o.props, Ae.Name);
      }
    if (o.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (o.items = hn.mergeEvaluated.items(s, $.items, o.items));
      else {
        const m = s.var("items", (0, Ae._)`${v}.evaluated.items`);
        o.items = hn.mergeEvaluated.items(s, m, o.items, Ae.Name);
      }
  }
}
mt.callRef = kn;
mt.default = gm;
Object.defineProperty(Ro, "__esModule", { value: !0 });
const _m = Oo, vm = mt, wm = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  _m.default,
  vm.default
];
Ro.default = wm;
var To = {}, jo = {};
Object.defineProperty(jo, "__esModule", { value: !0 });
const Gn = Y, _t = Gn.operators, Kn = {
  maximum: { okStr: "<=", ok: _t.LTE, fail: _t.GT },
  minimum: { okStr: ">=", ok: _t.GTE, fail: _t.LT },
  exclusiveMaximum: { okStr: "<", ok: _t.LT, fail: _t.GTE },
  exclusiveMinimum: { okStr: ">", ok: _t.GT, fail: _t.LTE }
}, Em = {
  message: ({ keyword: e, schemaCode: t }) => (0, Gn.str)`must be ${Kn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Gn._)`{comparison: ${Kn[e].okStr}, limit: ${t}}`
}, Sm = {
  keyword: Object.keys(Kn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Em,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Gn._)`${r} ${Kn[t].fail} ${n} || isNaN(${r})`);
  }
};
jo.default = Sm;
var ko = {};
Object.defineProperty(ko, "__esModule", { value: !0 });
const Wr = Y, bm = {
  message: ({ schemaCode: e }) => (0, Wr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Wr._)`{multipleOf: ${e}}`
}, Pm = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: bm,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, o = s.opts.multipleOfPrecision, a = t.let("res"), l = o ? (0, Wr._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, Wr._)`${a} !== parseInt(${a})`;
    e.fail$data((0, Wr._)`(${n} === 0 || (${a} = ${r}/${n}, ${l}))`);
  }
};
ko.default = Pm;
var Ao = {}, Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
function Gl(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Co.default = Gl;
Gl.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Ao, "__esModule", { value: !0 });
const Wt = Y, Nm = A, Im = Co, Rm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Wt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Wt._)`{limit: ${e}}`
}, Om = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Rm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, o = t === "maxLength" ? Wt.operators.GT : Wt.operators.LT, a = s.opts.unicode === !1 ? (0, Wt._)`${r}.length` : (0, Wt._)`${(0, Nm.useFunc)(e.gen, Im.default)}(${r})`;
    e.fail$data((0, Wt._)`${a} ${o} ${n}`);
  }
};
Ao.default = Om;
var Do = {};
Object.defineProperty(Do, "__esModule", { value: !0 });
const Tm = te, Hn = Y, jm = {
  message: ({ schemaCode: e }) => (0, Hn.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Hn._)`{pattern: ${e}}`
}, km = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: jm,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: o } = e, a = o.opts.unicodeRegExp ? "u" : "", l = r ? (0, Hn._)`(new RegExp(${s}, ${a}))` : (0, Tm.usePattern)(e, n);
    e.fail$data((0, Hn._)`!${l}.test(${t})`);
  }
};
Do.default = km;
var Mo = {};
Object.defineProperty(Mo, "__esModule", { value: !0 });
const Xr = Y, Am = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Xr.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Xr._)`{limit: ${e}}`
}, Cm = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Am,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Xr.operators.GT : Xr.operators.LT;
    e.fail$data((0, Xr._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Mo.default = Cm;
var Lo = {};
Object.defineProperty(Lo, "__esModule", { value: !0 });
const Fr = te, Jr = Y, Dm = A, Mm = {
  message: ({ params: { missingProperty: e } }) => (0, Jr.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Jr._)`{missingProperty: ${e}}`
}, Lm = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Mm,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: o, it: a } = e, { opts: l } = a;
    if (!o && r.length === 0)
      return;
    const i = r.length >= l.loopRequired;
    if (a.allErrors ? d() : u(), l.strictRequired) {
      const _ = e.parentSchema.properties, { definedProperties: v } = e.it;
      for (const g of r)
        if ((_ == null ? void 0 : _[g]) === void 0 && !v.has(g)) {
          const $ = a.schemaEnv.baseId + a.errSchemaPath, m = `required property "${g}" is not defined at "${$}" (strictRequired)`;
          (0, Dm.checkStrictMode)(a, m, a.opts.strictRequired);
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
Lo.default = Lm;
var Vo = {};
Object.defineProperty(Vo, "__esModule", { value: !0 });
const Yr = Y, Vm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Yr.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Yr._)`{limit: ${e}}`
}, Fm = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Vm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? Yr.operators.GT : Yr.operators.LT;
    e.fail$data((0, Yr._)`${r}.length ${s} ${n}`);
  }
};
Vo.default = Fm;
var Fo = {}, an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
const Kl = rs;
Kl.code = 'require("ajv/dist/runtime/equal").default';
an.default = Kl;
Object.defineProperty(Fo, "__esModule", { value: !0 });
const Ns = ye, ve = Y, Um = A, zm = an, qm = {
  message: ({ params: { i: e, j: t } }) => (0, ve.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, ve._)`{i: ${e}, j: ${t}}`
}, Gm = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: qm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: o, schemaCode: a, it: l } = e;
    if (!n && !s)
      return;
    const i = t.let("valid"), d = o.items ? (0, Ns.getSchemaTypes)(o.items) : [];
    e.block$data(i, u, (0, ve._)`${a} === false`), e.ok(i);
    function u() {
      const v = t.let("i", (0, ve._)`${r}.length`), g = t.let("j");
      e.setParams({ i: v, j: g }), t.assign(i, !0), t.if((0, ve._)`${v} > 1`, () => (h() ? E : _)(v, g));
    }
    function h() {
      return d.length > 0 && !d.some((v) => v === "object" || v === "array");
    }
    function E(v, g) {
      const $ = t.name("item"), m = (0, Ns.checkDataTypes)(d, $, l.opts.strictNumbers, Ns.DataType.Wrong), w = t.const("indices", (0, ve._)`{}`);
      t.for((0, ve._)`;${v}--;`, () => {
        t.let($, (0, ve._)`${r}[${v}]`), t.if(m, (0, ve._)`continue`), d.length > 1 && t.if((0, ve._)`typeof ${$} == "string"`, (0, ve._)`${$} += "_"`), t.if((0, ve._)`typeof ${w}[${$}] == "number"`, () => {
          t.assign(g, (0, ve._)`${w}[${$}]`), e.error(), t.assign(i, !1).break();
        }).code((0, ve._)`${w}[${$}] = ${v}`);
      });
    }
    function _(v, g) {
      const $ = (0, Um.useFunc)(t, zm.default), m = t.name("outer");
      t.label(m).for((0, ve._)`;${v}--;`, () => t.for((0, ve._)`${g} = ${v}; ${g}--;`, () => t.if((0, ve._)`${$}(${r}[${v}], ${r}[${g}])`, () => {
        e.error(), t.assign(i, !1).break(m);
      })));
    }
  }
};
Fo.default = Gm;
var Uo = {};
Object.defineProperty(Uo, "__esModule", { value: !0 });
const Ws = Y, Km = A, Hm = an, Bm = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Ws._)`{allowedValue: ${e}}`
}, Wm = {
  keyword: "const",
  $data: !0,
  error: Bm,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: o } = e;
    n || o && typeof o == "object" ? e.fail$data((0, Ws._)`!${(0, Km.useFunc)(t, Hm.default)}(${r}, ${s})`) : e.fail((0, Ws._)`${o} !== ${r}`);
  }
};
Uo.default = Wm;
var zo = {};
Object.defineProperty(zo, "__esModule", { value: !0 });
const Kr = Y, Xm = A, Jm = an, Ym = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Kr._)`{allowedValues: ${e}}`
}, xm = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Ym,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= a.opts.loopEnum;
    let i;
    const d = () => i ?? (i = (0, Xm.useFunc)(t, Jm.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const _ = t.const("vSchema", o);
      u = (0, Kr.or)(...s.map((v, g) => E(_, g)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", o, (_) => t.if((0, Kr._)`${d()}(${r}, ${_})`, () => t.assign(u, !0).break()));
    }
    function E(_, v) {
      const g = s[v];
      return typeof g == "object" && g !== null ? (0, Kr._)`${d()}(${r}, ${_}[${v}])` : (0, Kr._)`${r} === ${g}`;
    }
  }
};
zo.default = xm;
Object.defineProperty(To, "__esModule", { value: !0 });
const Zm = jo, Qm = ko, ep = Ao, tp = Do, rp = Mo, np = Lo, sp = Vo, op = Fo, ap = Uo, ip = zo, cp = [
  // number
  Zm.default,
  Qm.default,
  // string
  ep.default,
  tp.default,
  // object
  rp.default,
  np.default,
  // array
  sp.default,
  op.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  ap.default,
  ip.default
];
To.default = cp;
var qo = {}, br = {};
Object.defineProperty(br, "__esModule", { value: !0 });
br.validateAdditionalItems = void 0;
const Xt = Y, Xs = A, lp = {
  message: ({ params: { len: e } }) => (0, Xt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Xt._)`{limit: ${e}}`
}, up = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: lp,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Xs.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Hl(e, n);
  }
};
function Hl(e, t) {
  const { gen: r, schema: n, data: s, keyword: o, it: a } = e;
  a.items = !0;
  const l = r.const("len", (0, Xt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Xt._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Xs.alwaysValidSchema)(a, n)) {
    const d = r.var("valid", (0, Xt._)`${l} <= ${t.length}`);
    r.if((0, Xt.not)(d), () => i(d)), e.ok(d);
  }
  function i(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: o, dataProp: u, dataPropType: Xs.Type.Num }, d), a.allErrors || r.if((0, Xt.not)(d), () => r.break());
    });
  }
}
br.validateAdditionalItems = Hl;
br.default = up;
var Go = {}, Pr = {};
Object.defineProperty(Pr, "__esModule", { value: !0 });
Pr.validateTuple = void 0;
const Di = Y, An = A, dp = te, fp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Bl(e, "additionalItems", t);
    r.items = !0, !(0, An.alwaysValidSchema)(r, t) && e.ok((0, dp.validateArray)(e));
  }
};
function Bl(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: o, keyword: a, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = An.mergeEvaluated.items(n, r.length, l.items));
  const i = n.name("valid"), d = n.const("len", (0, Di._)`${o}.length`);
  r.forEach((h, E) => {
    (0, An.alwaysValidSchema)(l, h) || (n.if((0, Di._)`${d} > ${E}`, () => e.subschema({
      keyword: a,
      schemaProp: E,
      dataProp: E
    }, i)), e.ok(i));
  });
  function u(h) {
    const { opts: E, errSchemaPath: _ } = l, v = r.length, g = v === h.minItems && (v === h.maxItems || h[t] === !1);
    if (E.strictTuples && !g) {
      const $ = `"${a}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${_}"`;
      (0, An.checkStrictMode)(l, $, E.strictTuples);
    }
  }
}
Pr.validateTuple = Bl;
Pr.default = fp;
Object.defineProperty(Go, "__esModule", { value: !0 });
const hp = Pr, mp = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, hp.validateTuple)(e, "items")
};
Go.default = mp;
var Ko = {};
Object.defineProperty(Ko, "__esModule", { value: !0 });
const Mi = Y, pp = A, $p = te, yp = br, gp = {
  message: ({ params: { len: e } }) => (0, Mi.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Mi._)`{limit: ${e}}`
}, _p = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: gp,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, pp.alwaysValidSchema)(n, t) && (s ? (0, yp.validateAdditionalItems)(e, s) : e.ok((0, $p.validateArray)(e)));
  }
};
Ko.default = _p;
var Ho = {};
Object.defineProperty(Ho, "__esModule", { value: !0 });
const Ue = Y, mn = A, vp = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ue.str)`must contain at least ${e} valid item(s)` : (0, Ue.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ue._)`{minContains: ${e}}` : (0, Ue._)`{minContains: ${e}, maxContains: ${t}}`
}, wp = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: vp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    let a, l;
    const { minContains: i, maxContains: d } = n;
    o.opts.next ? (a = i === void 0 ? 1 : i, l = d) : a = 1;
    const u = t.const("len", (0, Ue._)`${s}.length`);
    if (e.setParams({ min: a, max: l }), l === void 0 && a === 0) {
      (0, mn.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && a > l) {
      (0, mn.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, mn.alwaysValidSchema)(o, r)) {
      let g = (0, Ue._)`${u} >= ${a}`;
      l !== void 0 && (g = (0, Ue._)`${g} && ${u} <= ${l}`), e.pass(g);
      return;
    }
    o.items = !0;
    const h = t.name("valid");
    l === void 0 && a === 1 ? _(h, () => t.if(h, () => t.break())) : a === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, Ue._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const g = t.name("_valid"), $ = t.let("count", 0);
      _(g, () => t.if(g, () => v($)));
    }
    function _(g, $) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: mn.Type.Num,
          compositeRule: !0
        }, g), $();
      });
    }
    function v(g) {
      t.code((0, Ue._)`${g}++`), l === void 0 ? t.if((0, Ue._)`${g} >= ${a}`, () => t.assign(h, !0).break()) : (t.if((0, Ue._)`${g} > ${l}`, () => t.assign(h, !1).break()), a === 1 ? t.assign(h, !0) : t.if((0, Ue._)`${g} >= ${a}`, () => t.assign(h, !0)));
    }
  }
};
Ho.default = wp;
var as = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = Y, r = A, n = te;
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
      const g = d[v];
      if (g.length === 0)
        continue;
      const $ = (0, n.propertyInData)(u, h, v, E.opts.ownProperties);
      i.setParams({
        property: v,
        depsCount: g.length,
        deps: g.join(", ")
      }), E.allErrors ? u.if($, () => {
        for (const m of g)
          (0, n.checkReportMissingProp)(i, m);
      }) : (u.if((0, t._)`${$} && (${(0, n.checkMissingProp)(i, g, _)})`), (0, n.reportMissingProp)(i, _), u.else());
    }
  }
  e.validatePropertyDeps = a;
  function l(i, d = i.schema) {
    const { gen: u, data: h, keyword: E, it: _ } = i, v = u.name("valid");
    for (const g in d)
      (0, r.alwaysValidSchema)(_, d[g]) || (u.if(
        (0, n.propertyInData)(u, h, g, _.opts.ownProperties),
        () => {
          const $ = i.subschema({ keyword: E, schemaProp: g }, v);
          i.mergeValidEvaluated($, v);
        },
        () => u.var(v, !0)
        // TODO var
      ), i.ok(v));
  }
  e.validateSchemaDeps = l, e.default = s;
})(as);
var Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
const Wl = Y, Ep = A, Sp = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Wl._)`{propertyName: ${e.propertyName}}`
}, bp = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Sp,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Ep.alwaysValidSchema)(s, r))
      return;
    const o = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, o), t.if((0, Wl.not)(o), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
Bo.default = bp;
var is = {};
Object.defineProperty(is, "__esModule", { value: !0 });
const pn = te, He = Y, Pp = Fe, $n = A, Np = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, He._)`{additionalProperty: ${e.additionalProperty}}`
}, Ip = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Np,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: o, it: a } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: i } = a;
    if (a.props = !0, i.removeAdditional !== "all" && (0, $n.alwaysValidSchema)(a, r))
      return;
    const d = (0, pn.allSchemaProperties)(n.properties), u = (0, pn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, He._)`${o} === ${Pp.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !u.length ? v($) : t.if(E($), () => v($));
      });
    }
    function E($) {
      let m;
      if (d.length > 8) {
        const w = (0, $n.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, pn.isOwnProperty)(t, w, $);
      } else d.length ? m = (0, He.or)(...d.map((w) => (0, He._)`${$} === ${w}`)) : m = He.nil;
      return u.length && (m = (0, He.or)(m, ...u.map((w) => (0, He._)`${(0, pn.usePattern)(e, w)}.test(${$})`))), (0, He.not)(m);
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
      if (typeof r == "object" && !(0, $n.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        i.removeAdditional === "failing" ? (g($, m, !1), t.if((0, He.not)(m), () => {
          e.reset(), _($);
        })) : (g($, m), l || t.if((0, He.not)(m), () => t.break()));
      }
    }
    function g($, m, w) {
      const P = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: $n.Type.Str
      };
      w === !1 && Object.assign(P, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(P, m);
    }
  }
};
is.default = Ip;
var Wo = {};
Object.defineProperty(Wo, "__esModule", { value: !0 });
const Rp = Je, Li = te, Is = A, Vi = is, Op = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Vi.default.code(new Rp.KeywordCxt(o, Vi.default, "additionalProperties"));
    const a = (0, Li.allSchemaProperties)(r);
    for (const h of a)
      o.definedProperties.add(h);
    o.opts.unevaluated && a.length && o.props !== !0 && (o.props = Is.mergeEvaluated.props(t, (0, Is.toHash)(a), o.props));
    const l = a.filter((h) => !(0, Is.alwaysValidSchema)(o, r[h]));
    if (l.length === 0)
      return;
    const i = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, Li.propertyInData)(t, s, h, o.opts.ownProperties)), u(h), o.allErrors || t.else().var(i, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(i);
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
Wo.default = Op;
var Xo = {};
Object.defineProperty(Xo, "__esModule", { value: !0 });
const Fi = te, yn = Y, Ui = A, zi = A, Tp = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: o } = e, { opts: a } = o, l = (0, Fi.allSchemaProperties)(r), i = l.filter((g) => (0, Ui.alwaysValidSchema)(o, r[g]));
    if (l.length === 0 || i.length === l.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const d = a.strictSchema && !a.allowMatchingProperties && s.properties, u = t.name("valid");
    o.props !== !0 && !(o.props instanceof yn.Name) && (o.props = (0, zi.evaluatedPropsToName)(t, o.props));
    const { props: h } = o;
    E();
    function E() {
      for (const g of l)
        d && _(g), o.allErrors ? v(g) : (t.var(u, !0), v(g), t.if(u));
    }
    function _(g) {
      for (const $ in d)
        new RegExp(g).test($) && (0, Ui.checkStrictMode)(o, `property ${$} matches pattern ${g} (use allowMatchingProperties)`);
    }
    function v(g) {
      t.forIn("key", n, ($) => {
        t.if((0, yn._)`${(0, Fi.usePattern)(e, g)}.test(${$})`, () => {
          const m = i.includes(g);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: g,
            dataProp: $,
            dataPropType: zi.Type.Str
          }, u), o.opts.unevaluated && h !== !0 ? t.assign((0, yn._)`${h}[${$}]`, !0) : !m && !o.allErrors && t.if((0, yn.not)(u), () => t.break());
        });
      });
    }
  }
};
Xo.default = Tp;
var Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
const jp = A, kp = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, jp.alwaysValidSchema)(n, r)) {
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
Jo.default = kp;
var Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
const Ap = te, Cp = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Ap.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Yo.default = Cp;
var xo = {};
Object.defineProperty(xo, "__esModule", { value: !0 });
const Cn = Y, Dp = A, Mp = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Cn._)`{passingSchemas: ${e.passing}}`
}, Lp = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Mp,
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
        (0, Dp.alwaysValidSchema)(s, u) ? t.var(i, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, i), h > 0 && t.if((0, Cn._)`${i} && ${a}`).assign(a, !1).assign(l, (0, Cn._)`[${l}, ${h}]`).else(), t.if(i, () => {
          t.assign(a, !0), t.assign(l, h), E && e.mergeEvaluated(E, Cn.Name);
        });
      });
    }
  }
};
xo.default = Lp;
var Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
const Vp = A, Fp = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((o, a) => {
      if ((0, Vp.alwaysValidSchema)(n, o))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: a }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
Zo.default = Fp;
var Qo = {};
Object.defineProperty(Qo, "__esModule", { value: !0 });
const Bn = Y, Xl = A, Up = {
  message: ({ params: e }) => (0, Bn.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Bn._)`{failingKeyword: ${e.ifClause}}`
}, zp = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Up,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Xl.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = qi(n, "then"), o = qi(n, "else");
    if (!s && !o)
      return;
    const a = t.let("valid", !0), l = t.name("_valid");
    if (i(), e.reset(), s && o) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, Bn.not)(l), d("else"));
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
        t.assign(a, l), e.mergeValidEvaluated(E, a), h ? t.assign(h, (0, Bn._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function qi(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Xl.alwaysValidSchema)(e, r);
}
Qo.default = zp;
var ea = {};
Object.defineProperty(ea, "__esModule", { value: !0 });
const qp = A, Gp = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, qp.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
ea.default = Gp;
Object.defineProperty(qo, "__esModule", { value: !0 });
const Kp = br, Hp = Go, Bp = Pr, Wp = Ko, Xp = Ho, Jp = as, Yp = Bo, xp = is, Zp = Wo, Qp = Xo, e$ = Jo, t$ = Yo, r$ = xo, n$ = Zo, s$ = Qo, o$ = ea;
function a$(e = !1) {
  const t = [
    // any
    e$.default,
    t$.default,
    r$.default,
    n$.default,
    s$.default,
    o$.default,
    // object
    Yp.default,
    xp.default,
    Jp.default,
    Zp.default,
    Qp.default
  ];
  return e ? t.push(Hp.default, Wp.default) : t.push(Kp.default, Bp.default), t.push(Xp.default), t;
}
qo.default = a$;
var ta = {}, Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.dynamicAnchor = void 0;
const Rs = Y, i$ = Fe, Gi = je, c$ = mt, l$ = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => Jl(e, e.schema)
};
function Jl(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, Rs._)`${i$.default.dynamicAnchors}${(0, Rs.getProperty)(t)}`, o = n.errSchemaPath === "#" ? n.validateName : u$(e);
  r.if((0, Rs._)`!${s}`, () => r.assign(s, o));
}
Nr.dynamicAnchor = Jl;
function u$(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: o, localRefs: a, meta: l } = t.root, { schemaId: i } = n.opts, d = new Gi.SchemaEnv({ schema: r, schemaId: i, root: s, baseId: o, localRefs: a, meta: l });
  return Gi.compileSchema.call(n, d), (0, c$.getValidate)(e, d);
}
Nr.default = l$;
var Ir = {};
Object.defineProperty(Ir, "__esModule", { value: !0 });
Ir.dynamicRef = void 0;
const Ki = Y, d$ = Fe, Hi = mt, f$ = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => Yl(e, e.schema)
};
function Yl(e, t) {
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
      const d = r.let("_v", (0, Ki._)`${d$.default.dynamicAnchors}${(0, Ki.getProperty)(o)}`);
      r.if(d, l(d, i), l(s.validateName, i));
    } else
      l(s.validateName, i)();
  }
  function l(i, d) {
    return d ? () => r.block(() => {
      (0, Hi.callRef)(e, i), r.let(d, !0);
    }) : () => (0, Hi.callRef)(e, i);
  }
}
Ir.dynamicRef = Yl;
Ir.default = f$;
var ra = {};
Object.defineProperty(ra, "__esModule", { value: !0 });
const h$ = Nr, m$ = A, p$ = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, h$.dynamicAnchor)(e, "") : (0, m$.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
ra.default = p$;
var na = {};
Object.defineProperty(na, "__esModule", { value: !0 });
const $$ = Ir, y$ = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, $$.dynamicRef)(e, e.schema)
};
na.default = y$;
Object.defineProperty(ta, "__esModule", { value: !0 });
const g$ = Nr, _$ = Ir, v$ = ra, w$ = na, E$ = [g$.default, _$.default, v$.default, w$.default];
ta.default = E$;
var sa = {}, oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
const Bi = as, S$ = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Bi.error,
  code: (e) => (0, Bi.validatePropertyDeps)(e)
};
oa.default = S$;
var aa = {};
Object.defineProperty(aa, "__esModule", { value: !0 });
const b$ = as, P$ = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, b$.validateSchemaDeps)(e)
};
aa.default = P$;
var ia = {};
Object.defineProperty(ia, "__esModule", { value: !0 });
const N$ = A, I$ = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, N$.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
ia.default = I$;
Object.defineProperty(sa, "__esModule", { value: !0 });
const R$ = oa, O$ = aa, T$ = ia, j$ = [R$.default, O$.default, T$.default];
sa.default = j$;
var ca = {}, la = {};
Object.defineProperty(la, "__esModule", { value: !0 });
const Et = Y, Wi = A, k$ = Fe, A$ = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, Et._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, C$ = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: A$,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: o } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: a, props: l } = o;
    l instanceof Et.Name ? t.if((0, Et._)`${l} !== true`, () => t.forIn("key", n, (h) => t.if(d(l, h), () => i(h)))) : l !== !0 && t.forIn("key", n, (h) => l === void 0 ? i(h) : t.if(u(l, h), () => i(h))), o.props = !0, e.ok((0, Et._)`${s} === ${k$.default.errors}`);
    function i(h) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: h }), e.error(), a || t.break();
        return;
      }
      if (!(0, Wi.alwaysValidSchema)(o, r)) {
        const E = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: Wi.Type.Str
        }, E), a || t.if((0, Et.not)(E), () => t.break());
      }
    }
    function d(h, E) {
      return (0, Et._)`!${h} || !${h}[${E}]`;
    }
    function u(h, E) {
      const _ = [];
      for (const v in h)
        h[v] === !0 && _.push((0, Et._)`${E} !== ${v}`);
      return (0, Et.and)(..._);
    }
  }
};
la.default = C$;
var ua = {};
Object.defineProperty(ua, "__esModule", { value: !0 });
const Jt = Y, Xi = A, D$ = {
  message: ({ params: { len: e } }) => (0, Jt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Jt._)`{limit: ${e}}`
}, M$ = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: D$,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, o = s.items || 0;
    if (o === !0)
      return;
    const a = t.const("len", (0, Jt._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: o }), e.fail((0, Jt._)`${a} > ${o}`);
    else if (typeof r == "object" && !(0, Xi.alwaysValidSchema)(s, r)) {
      const i = t.var("valid", (0, Jt._)`${a} <= ${o}`);
      t.if((0, Jt.not)(i), () => l(i, o)), e.ok(i);
    }
    s.items = !0;
    function l(i, d) {
      t.forRange("i", d, a, (u) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: u, dataPropType: Xi.Type.Num }, i), s.allErrors || t.if((0, Jt.not)(i), () => t.break());
      });
    }
  }
};
ua.default = M$;
Object.defineProperty(ca, "__esModule", { value: !0 });
const L$ = la, V$ = ua, F$ = [L$.default, V$.default];
ca.default = F$;
var da = {}, fa = {};
Object.defineProperty(fa, "__esModule", { value: !0 });
const pe = Y, U$ = {
  message: ({ schemaCode: e }) => (0, pe.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, pe._)`{format: ${e}}`
}, z$ = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: U$,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: o, schemaCode: a, it: l } = e, { opts: i, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!i.validateFormats)
      return;
    s ? E() : _();
    function E() {
      const v = r.scopeValue("formats", {
        ref: h.formats,
        code: i.code.formats
      }), g = r.const("fDef", (0, pe._)`${v}[${a}]`), $ = r.let("fType"), m = r.let("format");
      r.if((0, pe._)`typeof ${g} == "object" && !(${g} instanceof RegExp)`, () => r.assign($, (0, pe._)`${g}.type || "string"`).assign(m, (0, pe._)`${g}.validate`), () => r.assign($, (0, pe._)`"string"`).assign(m, g)), e.fail$data((0, pe.or)(w(), P()));
      function w() {
        return i.strictSchema === !1 ? pe.nil : (0, pe._)`${a} && !${m}`;
      }
      function P() {
        const I = u.$async ? (0, pe._)`(${g}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, pe._)`${m}(${n})`, R = (0, pe._)`(typeof ${m} == "function" ? ${I} : ${m}.test(${n}))`;
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
      const [g, $, m] = P(v);
      g === t && e.pass(I());
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
        const L = R instanceof RegExp ? (0, pe.regexpCode)(R) : i.code.formats ? (0, pe._)`${i.code.formats}${(0, pe.getProperty)(o)}` : void 0, W = r.scopeValue("formats", { key: o, ref: R, code: L });
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
fa.default = z$;
Object.defineProperty(da, "__esModule", { value: !0 });
const q$ = fa, G$ = [q$.default];
da.default = G$;
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
Object.defineProperty(Io, "__esModule", { value: !0 });
const K$ = Ro, H$ = To, B$ = qo, W$ = ta, X$ = sa, J$ = ca, Y$ = da, Ji = vr, x$ = [
  W$.default,
  K$.default,
  H$.default,
  (0, B$.default)(!0),
  Y$.default,
  Ji.metadataVocabulary,
  Ji.contentVocabulary,
  X$.default,
  J$.default
];
Io.default = x$;
var ha = {}, cs = {};
Object.defineProperty(cs, "__esModule", { value: !0 });
cs.DiscrError = void 0;
var Yi;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Yi || (cs.DiscrError = Yi = {}));
Object.defineProperty(ha, "__esModule", { value: !0 });
const fr = Y, Js = cs, xi = je, Z$ = Sr, Q$ = A, ey = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Js.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, fr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, ty = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: ey,
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
    t.if((0, fr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: Js.DiscrError.Tag, tag: d, tagName: l })), e.ok(i);
    function u() {
      const _ = E();
      t.if(!1);
      for (const v in _)
        t.elseIf((0, fr._)`${d} === ${v}`), t.assign(i, h(_[v]));
      t.else(), e.error(!1, { discrError: Js.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(_) {
      const v = t.name("valid"), g = e.subschema({ keyword: "oneOf", schemaProp: _ }, v);
      return e.mergeEvaluated(g, fr.Name), v;
    }
    function E() {
      var _;
      const v = {}, g = m(s);
      let $ = !0;
      for (let I = 0; I < a.length; I++) {
        let R = a[I];
        if (R != null && R.$ref && !(0, Q$.schemaHasRulesButRef)(R, o.self.RULES)) {
          const W = R.$ref;
          if (R = xi.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, W), R instanceof xi.SchemaEnv && (R = R.schema), R === void 0)
            throw new Z$.default(o.opts.uriResolver, o.baseId, W);
        }
        const L = (_ = R == null ? void 0 : R.properties) === null || _ === void 0 ? void 0 : _[l];
        if (typeof L != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        $ = $ && (g || m(R)), w(L, I);
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
          for (const L of I.enum)
            P(L, R);
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
ha.default = ty;
var ma = {};
const ry = "https://json-schema.org/draft/2020-12/schema", ny = "https://json-schema.org/draft/2020-12/schema", sy = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, oy = "meta", ay = "Core and Validation specifications meta-schema", iy = [
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
], cy = [
  "object",
  "boolean"
], ly = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", uy = {
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
}, dy = {
  $schema: ry,
  $id: ny,
  $vocabulary: sy,
  $dynamicAnchor: oy,
  title: ay,
  allOf: iy,
  type: cy,
  $comment: ly,
  properties: uy
}, fy = "https://json-schema.org/draft/2020-12/schema", hy = "https://json-schema.org/draft/2020-12/meta/applicator", my = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, py = "meta", $y = "Applicator vocabulary meta-schema", yy = [
  "object",
  "boolean"
], gy = {
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
}, _y = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, vy = {
  $schema: fy,
  $id: hy,
  $vocabulary: my,
  $dynamicAnchor: py,
  title: $y,
  type: yy,
  properties: gy,
  $defs: _y
}, wy = "https://json-schema.org/draft/2020-12/schema", Ey = "https://json-schema.org/draft/2020-12/meta/unevaluated", Sy = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, by = "meta", Py = "Unevaluated applicator vocabulary meta-schema", Ny = [
  "object",
  "boolean"
], Iy = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, Ry = {
  $schema: wy,
  $id: Ey,
  $vocabulary: Sy,
  $dynamicAnchor: by,
  title: Py,
  type: Ny,
  properties: Iy
}, Oy = "https://json-schema.org/draft/2020-12/schema", Ty = "https://json-schema.org/draft/2020-12/meta/content", jy = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, ky = "meta", Ay = "Content vocabulary meta-schema", Cy = [
  "object",
  "boolean"
], Dy = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, My = {
  $schema: Oy,
  $id: Ty,
  $vocabulary: jy,
  $dynamicAnchor: ky,
  title: Ay,
  type: Cy,
  properties: Dy
}, Ly = "https://json-schema.org/draft/2020-12/schema", Vy = "https://json-schema.org/draft/2020-12/meta/core", Fy = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, Uy = "meta", zy = "Core vocabulary meta-schema", qy = [
  "object",
  "boolean"
], Gy = {
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
}, Ky = {
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
}, Hy = {
  $schema: Ly,
  $id: Vy,
  $vocabulary: Fy,
  $dynamicAnchor: Uy,
  title: zy,
  type: qy,
  properties: Gy,
  $defs: Ky
}, By = "https://json-schema.org/draft/2020-12/schema", Wy = "https://json-schema.org/draft/2020-12/meta/format-annotation", Xy = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, Jy = "meta", Yy = "Format vocabulary meta-schema for annotation results", xy = [
  "object",
  "boolean"
], Zy = {
  format: {
    type: "string"
  }
}, Qy = {
  $schema: By,
  $id: Wy,
  $vocabulary: Xy,
  $dynamicAnchor: Jy,
  title: Yy,
  type: xy,
  properties: Zy
}, e0 = "https://json-schema.org/draft/2020-12/schema", t0 = "https://json-schema.org/draft/2020-12/meta/meta-data", r0 = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, n0 = "meta", s0 = "Meta-data vocabulary meta-schema", o0 = [
  "object",
  "boolean"
], a0 = {
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
}, i0 = {
  $schema: e0,
  $id: t0,
  $vocabulary: r0,
  $dynamicAnchor: n0,
  title: s0,
  type: o0,
  properties: a0
}, c0 = "https://json-schema.org/draft/2020-12/schema", l0 = "https://json-schema.org/draft/2020-12/meta/validation", u0 = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, d0 = "meta", f0 = "Validation vocabulary meta-schema", h0 = [
  "object",
  "boolean"
], m0 = {
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
}, p0 = {
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
}, $0 = {
  $schema: c0,
  $id: l0,
  $vocabulary: u0,
  $dynamicAnchor: d0,
  title: f0,
  type: h0,
  properties: m0,
  $defs: p0
};
Object.defineProperty(ma, "__esModule", { value: !0 });
const y0 = dy, g0 = vy, _0 = Ry, v0 = My, w0 = Hy, E0 = Qy, S0 = i0, b0 = $0, P0 = ["/properties"];
function N0(e) {
  return [
    y0,
    g0,
    _0,
    v0,
    w0,
    t(this, E0),
    S0,
    t(this, b0)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, P0) : n;
  }
}
ma.default = N0;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = el, n = Io, s = ha, o = ma, a = "https://json-schema.org/draft/2020-12/schema";
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
  var u = on;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return u.default;
  } });
  var h = Sr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(qs, qs.exports);
var I0 = qs.exports, Ys = { exports: {} }, xl = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(F, z) {
    return { validate: F, compare: z };
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
  const l = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function i(F) {
    return function(oe) {
      const T = l.exec(oe);
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
  function u(F, z) {
    if (!(F && z))
      return;
    const oe = l.exec(F), T = l.exec(z);
    if (oe && T)
      return F = oe[1] + oe[2] + oe[3], z = T[1] + T[2] + T[3], F > z ? 1 : F < z ? -1 : 0;
  }
  const h = /t|\s/i;
  function E(F) {
    const z = i(F);
    return function(T) {
      const k = T.split(h);
      return k.length === 2 && o(k[0]) && z(k[1]);
    };
  }
  function _(F, z) {
    if (!(F && z))
      return;
    const oe = new Date(F).valueOf(), T = new Date(z).valueOf();
    if (oe && T)
      return oe - T;
  }
  function v(F, z) {
    if (!(F && z))
      return;
    const [oe, T] = F.split(h), [k, V] = z.split(h), C = a(oe, k);
    if (C !== void 0)
      return C || d(T, V);
  }
  const g = /\/|:/, $ = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(F) {
    return g.test(F) && $.test(F);
  }
  const w = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function P(F) {
    return w.lastIndex = 0, w.test(F);
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
})(xl);
var Zl = {}, xs = { exports: {} }, Ql = {}, Ye = {}, wr = {}, cn = {}, ee = {}, nn = {};
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
  function g(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = g;
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
      let g = this._values[_];
      if (g) {
        const w = g.get(v);
        if (w)
          return w;
      } else
        g = this._values[_] = /* @__PURE__ */ new Map();
      g.set(v, E);
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
        const g = d[v];
        if (!g)
          continue;
        const $ = h[v] = h[v] || /* @__PURE__ */ new Map();
        g.forEach((m) => {
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
    optimizeNames(c, f) {
      return this;
    }
  }
  class a extends o {
    constructor(c, f, S) {
      super(), this.varKind = c, this.name = f, this.rhs = S;
    }
    render({ es5: c, _n: f }) {
      const S = c ? r.varKinds.var : this.varKind, O = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${S} ${this.name}${O};` + f;
    }
    optimizeNames(c, f) {
      if (c[this.name.str])
        return this.rhs && (this.rhs = T(this.rhs, c, f)), this;
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
        return this.rhs = T(this.rhs, c, f), this;
    }
    get names() {
      const c = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return oe(c, this.rhs);
    }
  }
  class i extends l {
    constructor(c, f, S, O) {
      super(c, S, O), this.op = f;
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
      return this.code = T(this.code, c, f), this;
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
      let O = S.length;
      for (; O--; ) {
        const j = S[O];
        j.optimizeNames(c, f) || (k(c, j.names), S.splice(O, 1));
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
  class g extends _ {
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
        return c === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(V(c), f instanceof m ? [f] : f.nodes);
      if (!(c === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(c, f) {
      var S;
      if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(c, f), !!(super.optimizeNames(c, f) || this.else))
        return this.condition = T(this.condition, c, f), this;
    }
    get names() {
      const c = super.names;
      return oe(c, this.condition), this.else && z(c, this.else.names), c;
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
        return this.iteration = T(this.iteration, c, f), this;
    }
    get names() {
      return z(super.names, this.iteration.names);
    }
  }
  class I extends w {
    constructor(c, f, S, O) {
      super(), this.varKind = c, this.name = f, this.from = S, this.to = O;
    }
    render(c) {
      const f = c.es5 ? r.varKinds.var : this.varKind, { name: S, from: O, to: j } = this;
      return `for(${f} ${S}=${O}; ${S}<${j}; ${S}++)` + super.render(c);
    }
    get names() {
      const c = oe(super.names, this.from);
      return oe(c, this.to);
    }
  }
  class R extends w {
    constructor(c, f, S, O) {
      super(), this.loop = c, this.varKind = f, this.name = S, this.iterable = O;
    }
    render(c) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(c);
    }
    optimizeNames(c, f) {
      if (super.optimizeNames(c, f))
        return this.iterable = T(this.iterable, c, f), this;
    }
    get names() {
      return z(super.names, this.iterable.names);
    }
  }
  class L extends v {
    constructor(c, f, S) {
      super(), this.name = c, this.args = f, this.async = S;
    }
    render(c) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(c);
    }
  }
  L.kind = "func";
  class W extends _ {
    render(c) {
      return "return " + super.render(c);
    }
  }
  W.kind = "return";
  class se extends v {
    render(c) {
      let f = "try" + super.render(c);
      return this.catch && (f += this.catch.render(c)), this.finally && (f += this.finally.render(c)), f;
    }
    optimizeNodes() {
      var c, f;
      return super.optimizeNodes(), (c = this.catch) === null || c === void 0 || c.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(c, f) {
      var S, O;
      return super.optimizeNames(c, f), (S = this.catch) === null || S === void 0 || S.optimizeNames(c, f), (O = this.finally) === null || O === void 0 || O.optimizeNames(c, f), this;
    }
    get names() {
      const c = super.names;
      return this.catch && z(c, this.catch.names), this.finally && z(c, this.finally.names), c;
    }
  }
  class ae extends v {
    constructor(c) {
      super(), this.error = c;
    }
    render(c) {
      return `catch(${this.error})` + super.render(c);
    }
  }
  ae.kind = "catch";
  class de extends v {
    render(c) {
      return "finally" + super.render(c);
    }
  }
  de.kind = "finally";
  class F {
    constructor(c, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = c, this._scope = new r.Scope({ parent: c }), this._nodes = [new g()];
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
    _def(c, f, S, O) {
      const j = this._scope.toName(f);
      return S !== void 0 && O && (this._constants[j.str] = S), this._leafNode(new a(c, j, S)), j;
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
      for (const [S, O] of c)
        f.length > 1 && f.push(","), f.push(S), (S !== O || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, O));
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
    forRange(c, f, S, O, j = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const q = this._scope.toName(c);
      return this._for(new I(j, q, f, S), () => O(q));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(c, f, S, O = r.varKinds.const) {
      const j = this._scope.toName(c);
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
    forIn(c, f, S, O = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(c, (0, t._)`Object.keys(${f})`, S);
      const j = this._scope.toName(c);
      return this._for(new R("in", O, j, f), () => S(j));
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
      const O = new se();
      if (this._blockNode(O), this.code(c), f) {
        const j = this.name("e");
        this._currNode = O.catch = new ae(j), f(j);
      }
      return S && (this._currNode = O.finally = new de(), this.code(S)), this._endBlockNode(ae, de);
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
    func(c, f = t.nil, S, O) {
      return this._blockNode(new L(c, f, S)), O && this.code(O).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(L);
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
  e.CodeGen = F;
  function z(y, c) {
    for (const f in c)
      y[f] = (y[f] || 0) + (c[f] || 0);
    return y;
  }
  function oe(y, c) {
    return c instanceof t._CodeOrName ? z(y, c.names) : y;
  }
  function T(y, c, f) {
    if (y instanceof t.Name)
      return S(y);
    if (!O(y))
      return y;
    return new t._Code(y._items.reduce((j, q) => (q instanceof t.Name && (q = S(q)), q instanceof t._Code ? j.push(...q._items) : j.push(q), j), []));
    function S(j) {
      const q = f[j.str];
      return q === void 0 || c[j.str] !== 1 ? j : (delete c[j.str], q);
    }
    function O(j) {
      return j instanceof t._Code && j._items.some((q) => q instanceof t.Name && c[q.str] === 1 && f[q.str] !== void 0);
    }
  }
  function k(y, c) {
    for (const f in c)
      y[f] = (y[f] || 0) - (c[f] || 0);
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
    return (c, f) => c === t.nil ? f : f === t.nil ? c : (0, t._)`${b(c)} ${y} ${b(f)}`;
  }
  function b(y) {
    return y instanceof t.Name ? y : (0, t._)`(${y})`;
  }
})(ee);
var M = {};
Object.defineProperty(M, "__esModule", { value: !0 });
M.checkStrictMode = M.getErrorPath = M.Type = M.useFunc = M.setEvaluated = M.evaluatedPropsToName = M.mergeEvaluated = M.eachItem = M.unescapeJsonPointer = M.escapeJsonPointer = M.escapeFragment = M.unescapeFragment = M.schemaRefOrVal = M.schemaHasRulesButRef = M.schemaHasRules = M.checkUnknownRules = M.alwaysValidSchema = M.toHash = void 0;
const ce = ee, R0 = nn;
function O0(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
M.toHash = O0;
function T0(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (eu(e, t), !tu(t, e.self.RULES.all));
}
M.alwaysValidSchema = T0;
function eu(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const o in t)
    s[o] || su(e, `unknown keyword: "${o}"`);
}
M.checkUnknownRules = eu;
function tu(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
M.schemaHasRules = tu;
function j0(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
M.schemaHasRulesButRef = j0;
function k0({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ce._)`${r}`;
  }
  return (0, ce._)`${e}${t}${(0, ce.getProperty)(n)}`;
}
M.schemaRefOrVal = k0;
function A0(e) {
  return ru(decodeURIComponent(e));
}
M.unescapeFragment = A0;
function C0(e) {
  return encodeURIComponent(pa(e));
}
M.escapeFragment = C0;
function pa(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
M.escapeJsonPointer = pa;
function ru(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
M.unescapeJsonPointer = ru;
function D0(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
M.eachItem = D0;
function Zi({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, o, a, l) => {
    const i = a === void 0 ? o : a instanceof ce.Name ? (o instanceof ce.Name ? e(s, o, a) : t(s, o, a), a) : o instanceof ce.Name ? (t(s, a, o), o) : r(o, a);
    return l === ce.Name && !(i instanceof ce.Name) ? n(s, i) : i;
  };
}
M.mergeEvaluated = {
  props: Zi({
    mergeNames: (e, t, r) => e.if((0, ce._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ce._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ce._)`${r} || {}`).code((0, ce._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ce._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ce._)`${r} || {}`), $a(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: nu
  }),
  items: Zi({
    mergeNames: (e, t, r) => e.if((0, ce._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ce._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ce._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ce._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function nu(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ce._)`{}`);
  return t !== void 0 && $a(e, r, t), r;
}
M.evaluatedPropsToName = nu;
function $a(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ce._)`${t}${(0, ce.getProperty)(n)}`, !0));
}
M.setEvaluated = $a;
const Qi = {};
function M0(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Qi[t.code] || (Qi[t.code] = new R0._Code(t.code))
  });
}
M.useFunc = M0;
var Qs;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Qs || (M.Type = Qs = {}));
function L0(e, t, r) {
  if (e instanceof ce.Name) {
    const n = t === Qs.Num;
    return r ? n ? (0, ce._)`"[" + ${e} + "]"` : (0, ce._)`"['" + ${e} + "']"` : n ? (0, ce._)`"/" + ${e}` : (0, ce._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ce.getProperty)(e).toString() : "/" + pa(e);
}
M.getErrorPath = L0;
function su(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
M.checkStrictMode = su;
var ot = {};
Object.defineProperty(ot, "__esModule", { value: !0 });
const Ne = ee, V0 = {
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
ot.default = V0;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = ee, r = M, n = ot;
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: m }) => m ? (0, t.str)`"${$}" keyword must be ${m} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, m = e.keywordError, w, P) {
    const { it: I } = $, { gen: R, compositeRule: L, allErrors: W } = I, se = h($, m, w);
    P ?? (L || W) ? i(R, se) : d(I, (0, t._)`[${se}]`);
  }
  e.reportError = s;
  function o($, m = e.keywordError, w) {
    const { it: P } = $, { gen: I, compositeRule: R, allErrors: L } = P, W = h($, m, w);
    i(I, W), R || L || d(P, n.default.vErrors);
  }
  e.reportExtraError = o;
  function a($, m) {
    $.assign(n.default.errors, m), $.if((0, t._)`${n.default.vErrors} !== null`, () => $.if(m, () => $.assign((0, t._)`${n.default.vErrors}.length`, m), () => $.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function l({ gen: $, keyword: m, schemaValue: w, data: P, errsCount: I, it: R }) {
    if (I === void 0)
      throw new Error("ajv implementation error");
    const L = $.name("err");
    $.forRange("i", I, n.default.errors, (W) => {
      $.const(L, (0, t._)`${n.default.vErrors}[${W}]`), $.if((0, t._)`${L}.instancePath === undefined`, () => $.assign((0, t._)`${L}.instancePath`, (0, t.strConcat)(n.default.instancePath, R.errorPath))), $.assign((0, t._)`${L}.schemaPath`, (0, t.str)`${R.errSchemaPath}/${m}`), R.opts.verbose && ($.assign((0, t._)`${L}.schema`, w), $.assign((0, t._)`${L}.data`, P));
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
    return g($, m, R), P.object(...R);
  }
  function _({ errorPath: $ }, { instancePath: m }) {
    const w = m ? (0, t.str)`${$}${(0, r.getErrorPath)(m, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, w)];
  }
  function v({ keyword: $, it: { errSchemaPath: m } }, { schemaPath: w, parentSchema: P }) {
    let I = P ? m : (0, t.str)`${m}/${$}`;
    return w && (I = (0, t.str)`${I}${(0, r.getErrorPath)(w, r.Type.Str)}`), [u.schemaPath, I];
  }
  function g($, { params: m, message: w }, P) {
    const { keyword: I, data: R, schemaValue: L, it: W } = $, { opts: se, propertyName: ae, topSchemaRef: de, schemaPath: F } = W;
    P.push([u.keyword, I], [u.params, typeof m == "function" ? m($) : m || (0, t._)`{}`]), se.messages && P.push([u.message, typeof w == "function" ? w($) : w]), se.verbose && P.push([u.schema, L], [u.parentSchema, (0, t._)`${de}${F}`], [n.default.data, R]), ae && P.push([u.propertyName, ae]);
  }
})(cn);
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.boolOrEmptySchema = wr.topBoolOrEmptySchema = void 0;
const F0 = cn, U0 = ee, z0 = ot, q0 = {
  message: "boolean schema is false"
};
function G0(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? ou(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(z0.default.data) : (t.assign((0, U0._)`${n}.errors`, null), t.return(!0));
}
wr.topBoolOrEmptySchema = G0;
function K0(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), ou(e)) : r.var(t, !0);
}
wr.boolOrEmptySchema = K0;
function ou(e, t) {
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
  (0, F0.reportError)(s, q0, void 0, t);
}
var ge = {}, rr = {};
Object.defineProperty(rr, "__esModule", { value: !0 });
rr.getRules = rr.isJSONType = void 0;
const H0 = ["string", "number", "integer", "boolean", "null", "object", "array"], B0 = new Set(H0);
function W0(e) {
  return typeof e == "string" && B0.has(e);
}
rr.isJSONType = W0;
function X0() {
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
rr.getRules = X0;
var dt = {};
Object.defineProperty(dt, "__esModule", { value: !0 });
dt.shouldUseRule = dt.shouldUseGroup = dt.schemaHasRulesForType = void 0;
function J0({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && au(e, n);
}
dt.schemaHasRulesForType = J0;
function au(e, t) {
  return t.rules.some((r) => iu(e, r));
}
dt.shouldUseGroup = au;
function iu(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
dt.shouldUseRule = iu;
Object.defineProperty(ge, "__esModule", { value: !0 });
ge.reportTypeError = ge.checkDataTypes = ge.checkDataType = ge.coerceAndCheckDataType = ge.getJSONTypes = ge.getSchemaTypes = ge.DataType = void 0;
const Y0 = rr, x0 = dt, Z0 = cn, Z = ee, cu = M;
var yr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(yr || (ge.DataType = yr = {}));
function Q0(e) {
  const t = lu(e.type);
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
ge.getSchemaTypes = Q0;
function lu(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(Y0.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ge.getJSONTypes = lu;
function eg(e, t) {
  const { gen: r, data: n, opts: s } = e, o = tg(t, s.coerceTypes), a = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, x0.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const l = ya(t, n, s.strictNumbers, yr.Wrong);
    r.if(l, () => {
      o.length ? rg(e, t, o) : ga(e);
    });
  }
  return a;
}
ge.coerceAndCheckDataType = eg;
const uu = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function tg(e, t) {
  return t ? e.filter((r) => uu.has(r) || t === "array" && r === "array") : [];
}
function rg(e, t, r) {
  const { gen: n, data: s, opts: o } = e, a = n.let("dataType", (0, Z._)`typeof ${s}`), l = n.let("coerced", (0, Z._)`undefined`);
  o.coerceTypes === "array" && n.if((0, Z._)`${a} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, Z._)`${s}[0]`).assign(a, (0, Z._)`typeof ${s}`).if(ya(t, s, o.strictNumbers), () => n.assign(l, s))), n.if((0, Z._)`${l} !== undefined`);
  for (const d of r)
    (uu.has(d) || d === "array" && o.coerceTypes === "array") && i(d);
  n.else(), ga(e), n.endIf(), n.if((0, Z._)`${l} !== undefined`, () => {
    n.assign(s, l), ng(e, l);
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
function ng({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, Z._)`${t} !== undefined`, () => e.assign((0, Z._)`${t}[${r}]`, n));
}
function eo(e, t, r, n = yr.Correct) {
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
ge.checkDataType = eo;
function ya(e, t, r, n) {
  if (e.length === 1)
    return eo(e[0], t, r, n);
  let s;
  const o = (0, cu.toHash)(e);
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
const sg = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, Z._)`{type: ${e}}` : (0, Z._)`{type: ${t}}`
};
function ga(e) {
  const t = og(e);
  (0, Z0.reportError)(t, sg);
}
ge.reportTypeError = ga;
function og(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, cu.schemaRefOrVal)(e, n, "type");
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
const ir = ee, ag = M;
function ig(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      ec(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, o) => ec(e, o, s.default));
}
ls.assignDefaults = ig;
function ec(e, t, r) {
  const { gen: n, compositeRule: s, data: o, opts: a } = e;
  if (r === void 0)
    return;
  const l = (0, ir._)`${o}${(0, ir.getProperty)(t)}`;
  if (s) {
    (0, ag.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let i = (0, ir._)`${l} === undefined`;
  a.useDefaults === "empty" && (i = (0, ir._)`${i} || ${l} === null || ${l} === ""`), n.if(i, (0, ir._)`${l} = ${(0, ir.stringify)(r)}`);
}
var st = {}, re = {};
Object.defineProperty(re, "__esModule", { value: !0 });
re.validateUnion = re.validateArray = re.usePattern = re.callValidateCode = re.schemaProperties = re.allSchemaProperties = re.noPropertyInData = re.propertyInData = re.isOwnProperty = re.hasPropFunc = re.reportMissingProp = re.checkMissingProp = re.checkReportMissingProp = void 0;
const ue = ee, _a = M, vt = ot, cg = M;
function lg(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(wa(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, ue._)`${t}` }, !0), e.error();
  });
}
re.checkReportMissingProp = lg;
function ug({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, ue.or)(...n.map((o) => (0, ue.and)(wa(e, t, o, r.ownProperties), (0, ue._)`${s} = ${o}`)));
}
re.checkMissingProp = ug;
function dg(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
re.reportMissingProp = dg;
function du(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ue._)`Object.prototype.hasOwnProperty`
  });
}
re.hasPropFunc = du;
function va(e, t, r) {
  return (0, ue._)`${du(e)}.call(${t}, ${r})`;
}
re.isOwnProperty = va;
function fg(e, t, r, n) {
  const s = (0, ue._)`${t}${(0, ue.getProperty)(r)} !== undefined`;
  return n ? (0, ue._)`${s} && ${va(e, t, r)}` : s;
}
re.propertyInData = fg;
function wa(e, t, r, n) {
  const s = (0, ue._)`${t}${(0, ue.getProperty)(r)} === undefined`;
  return n ? (0, ue.or)(s, (0, ue.not)(va(e, t, r))) : s;
}
re.noPropertyInData = wa;
function fu(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
re.allSchemaProperties = fu;
function hg(e, t) {
  return fu(t).filter((r) => !(0, _a.alwaysValidSchema)(e, t[r]));
}
re.schemaProperties = hg;
function mg({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: o }, it: a }, l, i, d) {
  const u = d ? (0, ue._)`${e}, ${t}, ${n}${s}` : t, h = [
    [vt.default.instancePath, (0, ue.strConcat)(vt.default.instancePath, o)],
    [vt.default.parentData, a.parentData],
    [vt.default.parentDataProperty, a.parentDataProperty],
    [vt.default.rootData, vt.default.rootData]
  ];
  a.opts.dynamicRef && h.push([vt.default.dynamicAnchors, vt.default.dynamicAnchors]);
  const E = (0, ue._)`${u}, ${r.object(...h)}`;
  return i !== ue.nil ? (0, ue._)`${l}.call(${i}, ${E})` : (0, ue._)`${l}(${E})`;
}
re.callValidateCode = mg;
const pg = (0, ue._)`new RegExp`;
function $g({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, o = s(r, n);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, ue._)`${s.code === "new RegExp" ? pg : (0, cg.useFunc)(e, s)}(${r}, ${n})`
  });
}
re.usePattern = $g;
function yg(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, o = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return a(() => t.assign(l, !1)), l;
  }
  return t.var(o, !0), a(() => t.break()), o;
  function a(l) {
    const i = t.const("len", (0, ue._)`${r}.length`);
    t.forRange("i", 0, i, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: _a.Type.Num
      }, o), t.if((0, ue.not)(o), l);
    });
  }
}
re.validateArray = yg;
function gg(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((i) => (0, _a.alwaysValidSchema)(s, i)) && !s.opts.unevaluated)
    return;
  const a = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((i, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(a, (0, ue._)`${a} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, ue.not)(a));
  })), e.result(a, () => e.reset(), () => e.error(!0));
}
re.validateUnion = gg;
Object.defineProperty(st, "__esModule", { value: !0 });
st.validateKeywordUsage = st.validSchemaType = st.funcKeywordCode = st.macroKeywordCode = void 0;
const Te = ee, Yt = ot, _g = re, vg = cn;
function wg(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: o, it: a } = e, l = t.macro.call(a.self, s, o, a), i = hu(r, n, l);
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
st.macroKeywordCode = wg;
function Eg(e, t) {
  var r;
  const { gen: n, keyword: s, schema: o, parentSchema: a, $data: l, it: i } = e;
  bg(i, t);
  const d = !l && t.compile ? t.compile.call(i.self, o, a, i) : t.validate, u = hu(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      g(), t.modifying && tc(e), $(() => e.error());
    else {
      const m = t.async ? _() : v();
      t.modifying && tc(e), $(() => Sg(e, m));
    }
  }
  function _() {
    const m = n.let("ruleErrs", null);
    return n.try(() => g((0, Te._)`await `), (w) => n.assign(h, !1).if((0, Te._)`${w} instanceof ${i.ValidationError}`, () => n.assign(m, (0, Te._)`${w}.errors`), () => n.throw(w))), m;
  }
  function v() {
    const m = (0, Te._)`${u}.errors`;
    return n.assign(m, null), g(Te.nil), m;
  }
  function g(m = t.async ? (0, Te._)`await ` : Te.nil) {
    const w = i.opts.passContext ? Yt.default.this : Yt.default.self, P = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, Te._)`${m}${(0, _g.callValidateCode)(e, u, w, P)}`, t.modifying);
  }
  function $(m) {
    var w;
    n.if((0, Te.not)((w = t.valid) !== null && w !== void 0 ? w : h), m);
  }
}
st.funcKeywordCode = Eg;
function tc(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Te._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Sg(e, t) {
  const { gen: r } = e;
  r.if((0, Te._)`Array.isArray(${t})`, () => {
    r.assign(Yt.default.vErrors, (0, Te._)`${Yt.default.vErrors} === null ? ${t} : ${Yt.default.vErrors}.concat(${t})`).assign(Yt.default.errors, (0, Te._)`${Yt.default.vErrors}.length`), (0, vg.extendErrors)(e);
  }, () => e.error());
}
function bg({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function hu(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Te.stringify)(r) });
}
function Pg(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
st.validSchemaType = Pg;
function Ng({ schema: e, opts: t, self: r, errSchemaPath: n }, s, o) {
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
st.validateKeywordUsage = Ng;
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.extendSubschemaMode = Ot.extendSubschemaData = Ot.getSubschema = void 0;
const tt = ee, mu = M;
function Ig(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: o, topSchemaRef: a }) {
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
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, mu.escapeFragment)(r)}`
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
Ot.getSubschema = Ig;
function Rg(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: o, propertyName: a }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, E = l.let("data", (0, tt._)`${t.data}${(0, tt.getProperty)(r)}`, !0);
    i(E), e.errorPath = (0, tt.str)`${d}${(0, mu.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, tt._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
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
Ot.extendSubschemaData = Rg;
function Og(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: o }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Ot.extendSubschemaMode = Og;
var Se = {}, pu = { exports: {} }, It = pu.exports = function(e, t, r) {
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
function Dn(e, t, r, n, s, o, a, l, i, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, o, a, l, i, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in It.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            Dn(e, t, r, h[E], s + "/" + u + "/" + E, o, s, u, n, E);
      } else if (u in It.propsKeywords) {
        if (h && typeof h == "object")
          for (var _ in h)
            Dn(e, t, r, h[_], s + "/" + u + "/" + Tg(_), o, s, u, n, _);
      } else (u in It.keywords || e.allKeys && !(u in It.skipKeywords)) && Dn(e, t, r, h, s + "/" + u, o, s, u, n);
    }
    r(n, s, o, a, l, i, d);
  }
}
function Tg(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var jg = pu.exports;
Object.defineProperty(Se, "__esModule", { value: !0 });
Se.getSchemaRefs = Se.resolveUrl = Se.normalizeId = Se._getFullPath = Se.getFullPath = Se.inlineRef = void 0;
const kg = M, Ag = rs, Cg = jg, Dg = /* @__PURE__ */ new Set([
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
function Mg(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !to(e) : t ? $u(e) <= t : !1;
}
Se.inlineRef = Mg;
const Lg = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function to(e) {
  for (const t in e) {
    if (Lg.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(to) || typeof r == "object" && to(r))
      return !0;
  }
  return !1;
}
function $u(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Dg.has(r) && (typeof e[r] == "object" && (0, kg.eachItem)(e[r], (n) => t += $u(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function yu(e, t = "", r) {
  r !== !1 && (t = gr(t));
  const n = e.parse(t);
  return gu(e, n);
}
Se.getFullPath = yu;
function gu(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Se._getFullPath = gu;
const Vg = /#\/?$/;
function gr(e) {
  return e ? e.replace(Vg, "") : "";
}
Se.normalizeId = gr;
function Fg(e, t, r) {
  return r = gr(r), e.resolve(t, r);
}
Se.resolveUrl = Fg;
const Ug = /^[a-z_][-a-z0-9._]*$/i;
function zg(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = gr(e[r] || t), o = { "": s }, a = yu(n, s, !1), l = {}, i = /* @__PURE__ */ new Set();
  return Cg(e, { allKeys: !0 }, (h, E, _, v) => {
    if (v === void 0)
      return;
    const g = a + E;
    let $ = o[v];
    typeof h[r] == "string" && ($ = m.call(this, h[r])), w.call(this, h.$anchor), w.call(this, h.$dynamicAnchor), o[E] = $;
    function m(P) {
      const I = this.opts.uriResolver.resolve;
      if (P = gr($ ? I($, P) : P), i.has(P))
        throw u(P);
      i.add(P);
      let R = this.refs[P];
      return typeof R == "string" && (R = this.refs[R]), typeof R == "object" ? d(h, R.schema, P) : P !== gr(g) && (P[0] === "#" ? (d(h, l[P], P), l[P] = h) : this.refs[P] = g), P;
    }
    function w(P) {
      if (typeof P == "string") {
        if (!Ug.test(P))
          throw new Error(`invalid anchor "${P}"`);
        m.call(this, `#${P}`);
      }
    }
  }), l;
  function d(h, E, _) {
    if (E !== void 0 && !Ag(h, E))
      throw u(_);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Se.getSchemaRefs = zg;
Object.defineProperty(Ye, "__esModule", { value: !0 });
Ye.getData = Ye.KeywordCxt = Ye.validateFunctionCode = void 0;
const _u = wr, rc = ge, Ea = dt, Wn = ge, qg = ls, xr = st, Os = Ot, H = ee, J = ot, Gg = Se, ft = M, Ur = cn;
function Kg(e) {
  if (Eu(e) && (Su(e), wu(e))) {
    Wg(e);
    return;
  }
  vu(e, () => (0, _u.topBoolOrEmptySchema)(e));
}
Ye.validateFunctionCode = Kg;
function vu({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, o) {
  s.code.es5 ? e.func(t, (0, H._)`${J.default.data}, ${J.default.valCxt}`, n.$async, () => {
    e.code((0, H._)`"use strict"; ${nc(r, s)}`), Bg(e, s), e.code(o);
  }) : e.func(t, (0, H._)`${J.default.data}, ${Hg(s)}`, n.$async, () => e.code(nc(r, s)).code(o));
}
function Hg(e) {
  return (0, H._)`{${J.default.instancePath}="", ${J.default.parentData}, ${J.default.parentDataProperty}, ${J.default.rootData}=${J.default.data}${e.dynamicRef ? (0, H._)`, ${J.default.dynamicAnchors}={}` : H.nil}}={}`;
}
function Bg(e, t) {
  e.if(J.default.valCxt, () => {
    e.var(J.default.instancePath, (0, H._)`${J.default.valCxt}.${J.default.instancePath}`), e.var(J.default.parentData, (0, H._)`${J.default.valCxt}.${J.default.parentData}`), e.var(J.default.parentDataProperty, (0, H._)`${J.default.valCxt}.${J.default.parentDataProperty}`), e.var(J.default.rootData, (0, H._)`${J.default.valCxt}.${J.default.rootData}`), t.dynamicRef && e.var(J.default.dynamicAnchors, (0, H._)`${J.default.valCxt}.${J.default.dynamicAnchors}`);
  }, () => {
    e.var(J.default.instancePath, (0, H._)`""`), e.var(J.default.parentData, (0, H._)`undefined`), e.var(J.default.parentDataProperty, (0, H._)`undefined`), e.var(J.default.rootData, J.default.data), t.dynamicRef && e.var(J.default.dynamicAnchors, (0, H._)`{}`);
  });
}
function Wg(e) {
  const { schema: t, opts: r, gen: n } = e;
  vu(e, () => {
    r.$comment && t.$comment && Pu(e), Zg(e), n.let(J.default.vErrors, null), n.let(J.default.errors, 0), r.unevaluated && Xg(e), bu(e), t_(e);
  });
}
function Xg(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, H._)`${r}.evaluated`), t.if((0, H._)`${e.evaluated}.dynamicProps`, () => t.assign((0, H._)`${e.evaluated}.props`, (0, H._)`undefined`)), t.if((0, H._)`${e.evaluated}.dynamicItems`, () => t.assign((0, H._)`${e.evaluated}.items`, (0, H._)`undefined`));
}
function nc(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, H._)`/*# sourceURL=${r} */` : H.nil;
}
function Jg(e, t) {
  if (Eu(e) && (Su(e), wu(e))) {
    Yg(e, t);
    return;
  }
  (0, _u.boolOrEmptySchema)(e, t);
}
function wu({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Eu(e) {
  return typeof e.schema != "boolean";
}
function Yg(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Pu(e), Qg(e), e_(e);
  const o = n.const("_errs", J.default.errors);
  bu(e, o), n.var(t, (0, H._)`${o} === ${J.default.errors}`);
}
function Su(e) {
  (0, ft.checkUnknownRules)(e), xg(e);
}
function bu(e, t) {
  if (e.opts.jtd)
    return sc(e, [], !1, t);
  const r = (0, rc.getSchemaTypes)(e.schema), n = (0, rc.coerceAndCheckDataType)(e, r);
  sc(e, r, !n, t);
}
function xg(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, ft.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function Zg(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, ft.checkStrictMode)(e, "default is ignored in the schema root");
}
function Qg(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, Gg.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function e_(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Pu({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const o = r.$comment;
  if (s.$comment === !0)
    e.code((0, H._)`${J.default.self}.logger.log(${o})`);
  else if (typeof s.$comment == "function") {
    const a = (0, H.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, H._)`${J.default.self}.opts.$comment(${o}, ${a}, ${l}.schema)`);
  }
}
function t_(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: o } = e;
  r.$async ? t.if((0, H._)`${J.default.errors} === 0`, () => t.return(J.default.data), () => t.throw((0, H._)`new ${s}(${J.default.vErrors})`)) : (t.assign((0, H._)`${n}.errors`, J.default.vErrors), o.unevaluated && r_(e), t.return((0, H._)`${J.default.errors} === 0`));
}
function r_({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof H.Name && e.assign((0, H._)`${t}.props`, r), n instanceof H.Name && e.assign((0, H._)`${t}.items`, n);
}
function sc(e, t, r, n) {
  const { gen: s, schema: o, data: a, allErrors: l, opts: i, self: d } = e, { RULES: u } = d;
  if (o.$ref && (i.ignoreKeywordsWithRef || !(0, ft.schemaHasRulesButRef)(o, u))) {
    s.block(() => Ru(e, "$ref", u.all.$ref.definition));
    return;
  }
  i.jtd || n_(e, t), s.block(() => {
    for (const E of u.rules)
      h(E);
    h(u.post);
  });
  function h(E) {
    (0, Ea.shouldUseGroup)(o, E) && (E.type ? (s.if((0, Wn.checkDataType)(E.type, a, i.strictNumbers)), oc(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, Wn.reportTypeError)(e)), s.endIf()) : oc(e, E), l || s.if((0, H._)`${J.default.errors} === ${n || 0}`));
  }
}
function oc(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, qg.assignDefaults)(e, t.type), r.block(() => {
    for (const o of t.rules)
      (0, Ea.shouldUseRule)(n, o) && Ru(e, o.keyword, o.definition, t.type);
  });
}
function n_(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (s_(e, t), e.opts.allowUnionTypes || o_(e, t), a_(e, e.dataTypes));
}
function s_(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Nu(e.dataTypes, r) || Sa(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), c_(e, t);
  }
}
function o_(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Sa(e, "use allowUnionTypes to allow union type keyword");
}
function a_(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Ea.shouldUseRule)(e.schema, s)) {
      const { type: o } = s.definition;
      o.length && !o.some((a) => i_(t, a)) && Sa(e, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function i_(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Nu(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function c_(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Nu(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Sa(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, ft.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Iu {
  constructor(t, r, n) {
    if ((0, xr.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, ft.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Ou(this.$data, t));
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
    return (0, H.or)(a(), l());
    function a() {
      if (n.length) {
        if (!(r instanceof H.Name))
          throw new Error("ajv implementation error");
        const i = Array.isArray(n) ? n : [n];
        return (0, H._)`${(0, Wn.checkDataTypes)(i, r, o.opts.strictNumbers, Wn.DataType.Wrong)}`;
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
    const n = (0, Os.getSubschema)(this.it, t);
    (0, Os.extendSubschemaData)(n, this.it, t), (0, Os.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return Jg(s, r), s;
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
Ye.KeywordCxt = Iu;
function Ru(e, t, r, n) {
  const s = new Iu(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, xr.funcKeywordCode)(s, r) : "macro" in r ? (0, xr.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, xr.funcKeywordCode)(s, r);
}
const l_ = /^\/(?:[^~]|~0|~1)*$/, u_ = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Ou(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, o;
  if (e === "")
    return J.default.rootData;
  if (e[0] === "/") {
    if (!l_.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, o = J.default.rootData;
  } else {
    const d = u_.exec(e);
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
    d && (o = (0, H._)`${o}${(0, H.getProperty)((0, ft.unescapeJsonPointer)(d))}`, a = (0, H._)`${a} && ${o}`);
  return a;
  function i(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
Ye.getData = Ou;
var ln = {};
Object.defineProperty(ln, "__esModule", { value: !0 });
class d_ extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
ln.default = d_;
var Rr = {};
Object.defineProperty(Rr, "__esModule", { value: !0 });
const Ts = Se;
class f_ extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Ts.resolveUrl)(t, r, n), this.missingSchema = (0, Ts.normalizeId)((0, Ts.getFullPath)(t, this.missingRef));
  }
}
Rr.default = f_;
var De = {};
Object.defineProperty(De, "__esModule", { value: !0 });
De.resolveSchema = De.getCompilingSchema = De.resolveRef = De.compileSchema = De.SchemaEnv = void 0;
const Ke = ee, h_ = ln, Ht = ot, Xe = Se, ac = M, m_ = Ye;
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
  const t = Tu.call(this, e);
  if (t)
    return t;
  const r = (0, Xe.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: o } = this.opts, a = new Ke.CodeGen(this.scope, { es5: n, lines: s, ownProperties: o });
  let l;
  e.$async && (l = a.scopeValue("Error", {
    ref: h_.default,
    code: (0, Ke._)`require("ajv/dist/runtime/validation_error").default`
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
    this._compilations.add(e), (0, m_.validateFunctionCode)(d), a.optimize(this.opts.code.optimize);
    const h = a.toString();
    u = `${a.scopeRefs(Ht.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const _ = new Function(`${Ht.default.self}`, `${Ht.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(i, { ref: _ }), _.errors = null, _.schema = e.schema, _.schemaEnv = e, e.$async && (_.$async = !0), this.opts.code.source === !0 && (_.source = { validateName: i, validateCode: h, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: v, items: g } = d;
      _.evaluated = {
        props: v instanceof Ke.Name ? void 0 : v,
        items: g instanceof Ke.Name ? void 0 : g,
        dynamicProps: v instanceof Ke.Name,
        dynamicItems: g instanceof Ke.Name
      }, _.source && (_.source.evaluated = (0, Ke.stringify)(_.evaluated));
    }
    return e.validate = _, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
De.compileSchema = ba;
function p_(e, t, r) {
  var n;
  r = (0, Xe.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let o = g_.call(this, e, r);
  if (o === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    a && (o = new us({ schema: a, schemaId: l, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[r] = $_.call(this, o);
}
De.resolveRef = p_;
function $_(e) {
  return (0, Xe.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : ba.call(this, e);
}
function Tu(e) {
  for (const t of this._compilations)
    if (y_(t, e))
      return t;
}
De.getCompilingSchema = Tu;
function y_(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function g_(e, t) {
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
    const l = ds.call(this, e, a);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : js.call(this, r, l);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || ba.call(this, a), o === (0, Xe.normalizeId)(t)) {
      const { schema: l } = a, { schemaId: i } = this.opts, d = l[i];
      return d && (s = (0, Xe.resolveUrl)(this.opts.uriResolver, s, d)), new us({ schema: l, schemaId: i, root: e, baseId: s });
    }
    return js.call(this, r, a);
  }
}
De.resolveSchema = ds;
const __ = /* @__PURE__ */ new Set([
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
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const i = r[(0, ac.unescapeFragment)(l)];
    if (i === void 0)
      return;
    r = i;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !__.has(l) && d && (t = (0, Xe.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let o;
  if (typeof r != "boolean" && r.$ref && !(0, ac.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, Xe.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    o = ds.call(this, n, l);
  }
  const { schemaId: a } = this.opts;
  if (o = o || new us({ schema: r, schemaId: a, root: n, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const v_ = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", w_ = "Meta-schema for $data reference (JSON AnySchema extension proposal)", E_ = "object", S_ = [
  "$data"
], b_ = {
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
}, P_ = !1, N_ = {
  $id: v_,
  description: w_,
  type: E_,
  required: S_,
  properties: b_,
  additionalProperties: P_
};
var Pa = {};
Object.defineProperty(Pa, "__esModule", { value: !0 });
const ju = Ul;
ju.code = 'require("ajv/dist/runtime/uri").default';
Pa.default = ju;
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
  const n = ln, s = Rr, o = rr, a = De, l = ee, i = Se, d = ge, u = M, h = N_, E = Pa, _ = (N, p) => new RegExp(N, p);
  _.code = "new RegExp";
  const v = ["removeAdditional", "useDefaults", "coerceTypes"], g = /* @__PURE__ */ new Set([
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
    var p, b, y, c, f, S, O, j, q, U, ne, Me, Tt, jt, kt, At, Ct, Dt, Mt, Lt, Vt, Ft, Ut, zt, qt;
    const qe = N.strict, Gt = (p = N.code) === null || p === void 0 ? void 0 : p.optimize, kr = Gt === !0 || Gt === void 0 ? 1 : Gt || 0, Ar = (y = (b = N.code) === null || b === void 0 ? void 0 : b.regExp) !== null && y !== void 0 ? y : _, vs = (c = N.uriResolver) !== null && c !== void 0 ? c : E.default;
    return {
      strictSchema: (S = (f = N.strictSchema) !== null && f !== void 0 ? f : qe) !== null && S !== void 0 ? S : !0,
      strictNumbers: (j = (O = N.strictNumbers) !== null && O !== void 0 ? O : qe) !== null && j !== void 0 ? j : !0,
      strictTypes: (U = (q = N.strictTypes) !== null && q !== void 0 ? q : qe) !== null && U !== void 0 ? U : "log",
      strictTuples: (Me = (ne = N.strictTuples) !== null && ne !== void 0 ? ne : qe) !== null && Me !== void 0 ? Me : "log",
      strictRequired: (jt = (Tt = N.strictRequired) !== null && Tt !== void 0 ? Tt : qe) !== null && jt !== void 0 ? jt : !1,
      code: N.code ? { ...N.code, optimize: kr, regExp: Ar } : { optimize: kr, regExp: Ar },
      loopRequired: (kt = N.loopRequired) !== null && kt !== void 0 ? kt : w,
      loopEnum: (At = N.loopEnum) !== null && At !== void 0 ? At : w,
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
      this.scope = new l.ValueScope({ scope: {}, prefixes: g, es5: b, lines: y }), this.logger = z(p.logger);
      const c = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, o.getRules)(), R.call(this, $, p, "NOT SUPPORTED"), R.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = de.call(this), p.formats && se.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && ae.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), W.call(this), p.validateFormats = c;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: b, schemaId: y } = this.opts;
      let c = h;
      y === "id" && (c = { ...h }, c.id = c.$id, delete c.$id), b && p && this.addMetaSchema(c, c[y], !1);
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
      const c = y(b);
      return "$async" in y || (this.errors = y.errors), c;
    }
    compile(p, b) {
      const y = this._addSchema(p, b);
      return y.validate || this._compileSchemaEnv(y);
    }
    compileAsync(p, b) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: y } = this.opts;
      return c.call(this, p, b);
      async function c(U, ne) {
        await f.call(this, U.$schema);
        const Me = this._addSchema(U, ne);
        return Me.validate || S.call(this, Me);
      }
      async function f(U) {
        U && !this.getSchema(U) && await c.call(this, { $ref: U }, !0);
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
    addSchema(p, b, y, c = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const S of p)
          this.addSchema(S, void 0, y, c);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: S } = this.opts;
        if (f = p[S], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return b = (0, i.normalizeId)(b || f), this._checkUnique(b), this.schemas[b] = this._addSchema(p, y, b, c, !0), this;
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
      const c = this.validate(y, p);
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
      for (; typeof (b = L.call(this, p)) == "string"; )
        p = b;
      if (b === void 0) {
        const { schemaId: y } = this.opts, c = new a.SchemaEnv({ schema: {}, schemaId: y });
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
          const b = L.call(this, p);
          return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const b = p;
          this._cache.delete(b);
          let y = p[this.opts.schemaId];
          return y && (y = (0, i.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
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
        return (0, u.eachItem)(y, (f) => k.call(this, f)), this;
      C.call(this, b);
      const c = {
        ...b,
        type: (0, d.getJSONTypes)(b.type),
        schemaType: (0, d.getJSONTypes)(b.schemaType)
      };
      return (0, u.eachItem)(y, c.type.length === 0 ? (f) => k.call(this, f, c) : (f) => c.type.forEach((S) => k.call(this, f, c, S))), this;
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
        const c = y.rules.findIndex((f) => f.keyword === p);
        c >= 0 && y.rules.splice(c, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, b) {
      return typeof b == "string" && (b = new RegExp(b)), this.formats[p] = b, this;
    }
    errorsText(p = this.errors, { separator: b = ", ", dataVar: y = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((c) => `${y}${c.instancePath} ${c.message}`).reduce((c, f) => c + b + f);
    }
    $dataMetaSchema(p, b) {
      const y = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const c of b) {
        const f = c.split("/").slice(1);
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
        const c = p[y];
        (!b || b.test(y)) && (typeof c == "string" ? delete p[y] : c && !c.meta && (this._cache.delete(c.schema), delete p[y]));
      }
    }
    _addSchema(p, b, y, c = this.opts.validateSchema, f = this.opts.addUsedSchema) {
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
      y = (0, i.normalizeId)(S || y);
      const q = i.getSchemaRefs.call(this, p, y);
      return j = new a.SchemaEnv({ schema: p, schemaId: O, meta: b, baseId: y, localRefs: q }), this._cache.set(j.schema, j), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = j), c && this.validateSchema(p, !0), j;
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
    for (const c in N) {
      const f = c;
      f in p && this.logger[y](`${b}: option ${c}. ${N[f]}`);
    }
  }
  function L(N) {
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
    for (const p of v)
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
    if ((0, u.eachItem)(N, (y) => {
      if (b.keywords[y])
        throw new Error(`Keyword ${y} is already defined`);
      if (!oe.test(y))
        throw new Error(`Keyword ${y} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(N, p, b) {
    var y;
    const c = p == null ? void 0 : p.post;
    if (b && c)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let S = c ? f.post : f.rules.find(({ type: j }) => j === b);
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
    const y = N.rules.findIndex((c) => c.keyword === b);
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
})(Ql);
var Na = {}, Ia = {}, Ra = {};
Object.defineProperty(Ra, "__esModule", { value: !0 });
const I_ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Ra.default = I_;
var nr = {};
Object.defineProperty(nr, "__esModule", { value: !0 });
nr.callRef = nr.getValidate = void 0;
const R_ = Rr, ic = re, Ce = ee, cr = ot, cc = De, gn = M, O_ = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: o, validateName: a, opts: l, self: i } = n, { root: d } = o;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = cc.resolveRef.call(i, d, s, r);
    if (u === void 0)
      throw new R_.default(n.opts.uriResolver, s, r);
    if (u instanceof cc.SchemaEnv)
      return E(u);
    return _(u);
    function h() {
      if (o === d)
        return Mn(e, a, o, o.$async);
      const v = t.scopeValue("root", { ref: d });
      return Mn(e, (0, Ce._)`${v}.validate`, d, d.$async);
    }
    function E(v) {
      const g = ku(e, v);
      Mn(e, g, v, v.$async);
    }
    function _(v) {
      const g = t.scopeValue("schema", l.code.source === !0 ? { ref: v, code: (0, Ce.stringify)(v) } : { ref: v }), $ = t.name("valid"), m = e.subschema({
        schema: v,
        dataTypes: [],
        schemaPath: Ce.nil,
        topSchemaRef: g,
        errSchemaPath: r
      }, $);
      e.mergeEvaluated(m), e.ok($);
    }
  }
};
function ku(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ce._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
nr.getValidate = ku;
function Mn(e, t, r, n) {
  const { gen: s, it: o } = e, { allErrors: a, schemaEnv: l, opts: i } = o, d = i.passContext ? cr.default.this : Ce.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, Ce._)`await ${(0, ic.callValidateCode)(e, t, d)}`), _(t), a || s.assign(v, !0);
    }, (g) => {
      s.if((0, Ce._)`!(${g} instanceof ${o.ValidationError})`, () => s.throw(g)), E(g), a || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, ic.callValidateCode)(e, t, d), () => _(t), () => E(t));
  }
  function E(v) {
    const g = (0, Ce._)`${v}.errors`;
    s.assign(cr.default.vErrors, (0, Ce._)`${cr.default.vErrors} === null ? ${g} : ${cr.default.vErrors}.concat(${g})`), s.assign(cr.default.errors, (0, Ce._)`${cr.default.vErrors}.length`);
  }
  function _(v) {
    var g;
    if (!o.opts.unevaluated)
      return;
    const $ = (g = r == null ? void 0 : r.validate) === null || g === void 0 ? void 0 : g.evaluated;
    if (o.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (o.props = gn.mergeEvaluated.props(s, $.props, o.props));
      else {
        const m = s.var("props", (0, Ce._)`${v}.evaluated.props`);
        o.props = gn.mergeEvaluated.props(s, m, o.props, Ce.Name);
      }
    if (o.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (o.items = gn.mergeEvaluated.items(s, $.items, o.items));
      else {
        const m = s.var("items", (0, Ce._)`${v}.evaluated.items`);
        o.items = gn.mergeEvaluated.items(s, m, o.items, Ce.Name);
      }
  }
}
nr.callRef = Mn;
nr.default = O_;
Object.defineProperty(Ia, "__esModule", { value: !0 });
const T_ = Ra, j_ = nr, k_ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  T_.default,
  j_.default
];
Ia.default = k_;
var Oa = {}, Ta = {};
Object.defineProperty(Ta, "__esModule", { value: !0 });
const Xn = ee, wt = Xn.operators, Jn = {
  maximum: { okStr: "<=", ok: wt.LTE, fail: wt.GT },
  minimum: { okStr: ">=", ok: wt.GTE, fail: wt.LT },
  exclusiveMaximum: { okStr: "<", ok: wt.LT, fail: wt.GTE },
  exclusiveMinimum: { okStr: ">", ok: wt.GT, fail: wt.LTE }
}, A_ = {
  message: ({ keyword: e, schemaCode: t }) => (0, Xn.str)`must be ${Jn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Xn._)`{comparison: ${Jn[e].okStr}, limit: ${t}}`
}, C_ = {
  keyword: Object.keys(Jn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: A_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Xn._)`${r} ${Jn[t].fail} ${n} || isNaN(${r})`);
  }
};
Ta.default = C_;
var ja = {};
Object.defineProperty(ja, "__esModule", { value: !0 });
const Zr = ee, D_ = {
  message: ({ schemaCode: e }) => (0, Zr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Zr._)`{multipleOf: ${e}}`
}, M_ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: D_,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, o = s.opts.multipleOfPrecision, a = t.let("res"), l = o ? (0, Zr._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, Zr._)`${a} !== parseInt(${a})`;
    e.fail$data((0, Zr._)`(${n} === 0 || (${a} = ${r}/${n}, ${l}))`);
  }
};
ja.default = M_;
var ka = {}, Aa = {};
Object.defineProperty(Aa, "__esModule", { value: !0 });
function Au(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Aa.default = Au;
Au.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(ka, "__esModule", { value: !0 });
const xt = ee, L_ = M, V_ = Aa, F_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, xt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, xt._)`{limit: ${e}}`
}, U_ = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: F_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, o = t === "maxLength" ? xt.operators.GT : xt.operators.LT, a = s.opts.unicode === !1 ? (0, xt._)`${r}.length` : (0, xt._)`${(0, L_.useFunc)(e.gen, V_.default)}(${r})`;
    e.fail$data((0, xt._)`${a} ${o} ${n}`);
  }
};
ka.default = U_;
var Ca = {};
Object.defineProperty(Ca, "__esModule", { value: !0 });
const z_ = re, Yn = ee, q_ = {
  message: ({ schemaCode: e }) => (0, Yn.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Yn._)`{pattern: ${e}}`
}, G_ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: q_,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: o } = e, a = o.opts.unicodeRegExp ? "u" : "", l = r ? (0, Yn._)`(new RegExp(${s}, ${a}))` : (0, z_.usePattern)(e, n);
    e.fail$data((0, Yn._)`!${l}.test(${t})`);
  }
};
Ca.default = G_;
var Da = {};
Object.defineProperty(Da, "__esModule", { value: !0 });
const Qr = ee, K_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Qr.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Qr._)`{limit: ${e}}`
}, H_ = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: K_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Qr.operators.GT : Qr.operators.LT;
    e.fail$data((0, Qr._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Da.default = H_;
var Ma = {};
Object.defineProperty(Ma, "__esModule", { value: !0 });
const zr = re, en = ee, B_ = M, W_ = {
  message: ({ params: { missingProperty: e } }) => (0, en.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, en._)`{missingProperty: ${e}}`
}, X_ = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: W_,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: o, it: a } = e, { opts: l } = a;
    if (!o && r.length === 0)
      return;
    const i = r.length >= l.loopRequired;
    if (a.allErrors ? d() : u(), l.strictRequired) {
      const _ = e.parentSchema.properties, { definedProperties: v } = e.it;
      for (const g of r)
        if ((_ == null ? void 0 : _[g]) === void 0 && !v.has(g)) {
          const $ = a.schemaEnv.baseId + a.errSchemaPath, m = `required property "${g}" is not defined at "${$}" (strictRequired)`;
          (0, B_.checkStrictMode)(a, m, a.opts.strictRequired);
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
Ma.default = X_;
var La = {};
Object.defineProperty(La, "__esModule", { value: !0 });
const tn = ee, J_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, tn.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, tn._)`{limit: ${e}}`
}, Y_ = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: J_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? tn.operators.GT : tn.operators.LT;
    e.fail$data((0, tn._)`${r}.length ${s} ${n}`);
  }
};
La.default = Y_;
var Va = {}, un = {};
Object.defineProperty(un, "__esModule", { value: !0 });
const Cu = rs;
Cu.code = 'require("ajv/dist/runtime/equal").default';
un.default = Cu;
Object.defineProperty(Va, "__esModule", { value: !0 });
const ks = ge, we = ee, x_ = M, Z_ = un, Q_ = {
  message: ({ params: { i: e, j: t } }) => (0, we.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, we._)`{i: ${e}, j: ${t}}`
}, ev = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Q_,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: o, schemaCode: a, it: l } = e;
    if (!n && !s)
      return;
    const i = t.let("valid"), d = o.items ? (0, ks.getSchemaTypes)(o.items) : [];
    e.block$data(i, u, (0, we._)`${a} === false`), e.ok(i);
    function u() {
      const v = t.let("i", (0, we._)`${r}.length`), g = t.let("j");
      e.setParams({ i: v, j: g }), t.assign(i, !0), t.if((0, we._)`${v} > 1`, () => (h() ? E : _)(v, g));
    }
    function h() {
      return d.length > 0 && !d.some((v) => v === "object" || v === "array");
    }
    function E(v, g) {
      const $ = t.name("item"), m = (0, ks.checkDataTypes)(d, $, l.opts.strictNumbers, ks.DataType.Wrong), w = t.const("indices", (0, we._)`{}`);
      t.for((0, we._)`;${v}--;`, () => {
        t.let($, (0, we._)`${r}[${v}]`), t.if(m, (0, we._)`continue`), d.length > 1 && t.if((0, we._)`typeof ${$} == "string"`, (0, we._)`${$} += "_"`), t.if((0, we._)`typeof ${w}[${$}] == "number"`, () => {
          t.assign(g, (0, we._)`${w}[${$}]`), e.error(), t.assign(i, !1).break();
        }).code((0, we._)`${w}[${$}] = ${v}`);
      });
    }
    function _(v, g) {
      const $ = (0, x_.useFunc)(t, Z_.default), m = t.name("outer");
      t.label(m).for((0, we._)`;${v}--;`, () => t.for((0, we._)`${g} = ${v}; ${g}--;`, () => t.if((0, we._)`${$}(${r}[${v}], ${r}[${g}])`, () => {
        e.error(), t.assign(i, !1).break(m);
      })));
    }
  }
};
Va.default = ev;
var Fa = {};
Object.defineProperty(Fa, "__esModule", { value: !0 });
const ro = ee, tv = M, rv = un, nv = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, ro._)`{allowedValue: ${e}}`
}, sv = {
  keyword: "const",
  $data: !0,
  error: nv,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: o } = e;
    n || o && typeof o == "object" ? e.fail$data((0, ro._)`!${(0, tv.useFunc)(t, rv.default)}(${r}, ${s})`) : e.fail((0, ro._)`${o} !== ${r}`);
  }
};
Fa.default = sv;
var Ua = {};
Object.defineProperty(Ua, "__esModule", { value: !0 });
const Hr = ee, ov = M, av = un, iv = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Hr._)`{allowedValues: ${e}}`
}, cv = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: iv,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= a.opts.loopEnum;
    let i;
    const d = () => i ?? (i = (0, ov.useFunc)(t, av.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const _ = t.const("vSchema", o);
      u = (0, Hr.or)(...s.map((v, g) => E(_, g)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", o, (_) => t.if((0, Hr._)`${d()}(${r}, ${_})`, () => t.assign(u, !0).break()));
    }
    function E(_, v) {
      const g = s[v];
      return typeof g == "object" && g !== null ? (0, Hr._)`${d()}(${r}, ${_}[${v}])` : (0, Hr._)`${r} === ${g}`;
    }
  }
};
Ua.default = cv;
Object.defineProperty(Oa, "__esModule", { value: !0 });
const lv = Ta, uv = ja, dv = ka, fv = Ca, hv = Da, mv = Ma, pv = La, $v = Va, yv = Fa, gv = Ua, _v = [
  // number
  lv.default,
  uv.default,
  // string
  dv.default,
  fv.default,
  // object
  hv.default,
  mv.default,
  // array
  pv.default,
  $v.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  yv.default,
  gv.default
];
Oa.default = _v;
var za = {}, Or = {};
Object.defineProperty(Or, "__esModule", { value: !0 });
Or.validateAdditionalItems = void 0;
const Zt = ee, no = M, vv = {
  message: ({ params: { len: e } }) => (0, Zt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Zt._)`{limit: ${e}}`
}, wv = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: vv,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, no.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Du(e, n);
  }
};
function Du(e, t) {
  const { gen: r, schema: n, data: s, keyword: o, it: a } = e;
  a.items = !0;
  const l = r.const("len", (0, Zt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Zt._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, no.alwaysValidSchema)(a, n)) {
    const d = r.var("valid", (0, Zt._)`${l} <= ${t.length}`);
    r.if((0, Zt.not)(d), () => i(d)), e.ok(d);
  }
  function i(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: o, dataProp: u, dataPropType: no.Type.Num }, d), a.allErrors || r.if((0, Zt.not)(d), () => r.break());
    });
  }
}
Or.validateAdditionalItems = Du;
Or.default = wv;
var qa = {}, Tr = {};
Object.defineProperty(Tr, "__esModule", { value: !0 });
Tr.validateTuple = void 0;
const lc = ee, Ln = M, Ev = re, Sv = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Mu(e, "additionalItems", t);
    r.items = !0, !(0, Ln.alwaysValidSchema)(r, t) && e.ok((0, Ev.validateArray)(e));
  }
};
function Mu(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: o, keyword: a, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = Ln.mergeEvaluated.items(n, r.length, l.items));
  const i = n.name("valid"), d = n.const("len", (0, lc._)`${o}.length`);
  r.forEach((h, E) => {
    (0, Ln.alwaysValidSchema)(l, h) || (n.if((0, lc._)`${d} > ${E}`, () => e.subschema({
      keyword: a,
      schemaProp: E,
      dataProp: E
    }, i)), e.ok(i));
  });
  function u(h) {
    const { opts: E, errSchemaPath: _ } = l, v = r.length, g = v === h.minItems && (v === h.maxItems || h[t] === !1);
    if (E.strictTuples && !g) {
      const $ = `"${a}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${_}"`;
      (0, Ln.checkStrictMode)(l, $, E.strictTuples);
    }
  }
}
Tr.validateTuple = Mu;
Tr.default = Sv;
Object.defineProperty(qa, "__esModule", { value: !0 });
const bv = Tr, Pv = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, bv.validateTuple)(e, "items")
};
qa.default = Pv;
var Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
const uc = ee, Nv = M, Iv = re, Rv = Or, Ov = {
  message: ({ params: { len: e } }) => (0, uc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, uc._)`{limit: ${e}}`
}, Tv = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Ov,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, Nv.alwaysValidSchema)(n, t) && (s ? (0, Rv.validateAdditionalItems)(e, s) : e.ok((0, Iv.validateArray)(e)));
  }
};
Ga.default = Tv;
var Ka = {};
Object.defineProperty(Ka, "__esModule", { value: !0 });
const ze = ee, _n = M, jv = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, ze.str)`must contain at least ${e} valid item(s)` : (0, ze.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, ze._)`{minContains: ${e}}` : (0, ze._)`{minContains: ${e}, maxContains: ${t}}`
}, kv = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: jv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    let a, l;
    const { minContains: i, maxContains: d } = n;
    o.opts.next ? (a = i === void 0 ? 1 : i, l = d) : a = 1;
    const u = t.const("len", (0, ze._)`${s}.length`);
    if (e.setParams({ min: a, max: l }), l === void 0 && a === 0) {
      (0, _n.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && a > l) {
      (0, _n.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, _n.alwaysValidSchema)(o, r)) {
      let g = (0, ze._)`${u} >= ${a}`;
      l !== void 0 && (g = (0, ze._)`${g} && ${u} <= ${l}`), e.pass(g);
      return;
    }
    o.items = !0;
    const h = t.name("valid");
    l === void 0 && a === 1 ? _(h, () => t.if(h, () => t.break())) : a === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, ze._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const g = t.name("_valid"), $ = t.let("count", 0);
      _(g, () => t.if(g, () => v($)));
    }
    function _(g, $) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: _n.Type.Num,
          compositeRule: !0
        }, g), $();
      });
    }
    function v(g) {
      t.code((0, ze._)`${g}++`), l === void 0 ? t.if((0, ze._)`${g} >= ${a}`, () => t.assign(h, !0).break()) : (t.if((0, ze._)`${g} > ${l}`, () => t.assign(h, !1).break()), a === 1 ? t.assign(h, !0) : t.if((0, ze._)`${g} >= ${a}`, () => t.assign(h, !0)));
    }
  }
};
Ka.default = kv;
var Lu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = ee, r = M, n = re;
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
      const g = d[v];
      if (g.length === 0)
        continue;
      const $ = (0, n.propertyInData)(u, h, v, E.opts.ownProperties);
      i.setParams({
        property: v,
        depsCount: g.length,
        deps: g.join(", ")
      }), E.allErrors ? u.if($, () => {
        for (const m of g)
          (0, n.checkReportMissingProp)(i, m);
      }) : (u.if((0, t._)`${$} && (${(0, n.checkMissingProp)(i, g, _)})`), (0, n.reportMissingProp)(i, _), u.else());
    }
  }
  e.validatePropertyDeps = a;
  function l(i, d = i.schema) {
    const { gen: u, data: h, keyword: E, it: _ } = i, v = u.name("valid");
    for (const g in d)
      (0, r.alwaysValidSchema)(_, d[g]) || (u.if(
        (0, n.propertyInData)(u, h, g, _.opts.ownProperties),
        () => {
          const $ = i.subschema({ keyword: E, schemaProp: g }, v);
          i.mergeValidEvaluated($, v);
        },
        () => u.var(v, !0)
        // TODO var
      ), i.ok(v));
  }
  e.validateSchemaDeps = l, e.default = s;
})(Lu);
var Ha = {};
Object.defineProperty(Ha, "__esModule", { value: !0 });
const Vu = ee, Av = M, Cv = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Vu._)`{propertyName: ${e.propertyName}}`
}, Dv = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Cv,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Av.alwaysValidSchema)(s, r))
      return;
    const o = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, o), t.if((0, Vu.not)(o), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
Ha.default = Dv;
var fs = {};
Object.defineProperty(fs, "__esModule", { value: !0 });
const vn = re, Be = ee, Mv = ot, wn = M, Lv = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Be._)`{additionalProperty: ${e.additionalProperty}}`
}, Vv = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Lv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: o, it: a } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: i } = a;
    if (a.props = !0, i.removeAdditional !== "all" && (0, wn.alwaysValidSchema)(a, r))
      return;
    const d = (0, vn.allSchemaProperties)(n.properties), u = (0, vn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Be._)`${o} === ${Mv.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !u.length ? v($) : t.if(E($), () => v($));
      });
    }
    function E($) {
      let m;
      if (d.length > 8) {
        const w = (0, wn.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, vn.isOwnProperty)(t, w, $);
      } else d.length ? m = (0, Be.or)(...d.map((w) => (0, Be._)`${$} === ${w}`)) : m = Be.nil;
      return u.length && (m = (0, Be.or)(m, ...u.map((w) => (0, Be._)`${(0, vn.usePattern)(e, w)}.test(${$})`))), (0, Be.not)(m);
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
      if (typeof r == "object" && !(0, wn.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        i.removeAdditional === "failing" ? (g($, m, !1), t.if((0, Be.not)(m), () => {
          e.reset(), _($);
        })) : (g($, m), l || t.if((0, Be.not)(m), () => t.break()));
      }
    }
    function g($, m, w) {
      const P = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: wn.Type.Str
      };
      w === !1 && Object.assign(P, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(P, m);
    }
  }
};
fs.default = Vv;
var Ba = {};
Object.defineProperty(Ba, "__esModule", { value: !0 });
const Fv = Ye, dc = re, As = M, fc = fs, Uv = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && fc.default.code(new Fv.KeywordCxt(o, fc.default, "additionalProperties"));
    const a = (0, dc.allSchemaProperties)(r);
    for (const h of a)
      o.definedProperties.add(h);
    o.opts.unevaluated && a.length && o.props !== !0 && (o.props = As.mergeEvaluated.props(t, (0, As.toHash)(a), o.props));
    const l = a.filter((h) => !(0, As.alwaysValidSchema)(o, r[h]));
    if (l.length === 0)
      return;
    const i = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, dc.propertyInData)(t, s, h, o.opts.ownProperties)), u(h), o.allErrors || t.else().var(i, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(i);
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
Ba.default = Uv;
var Wa = {};
Object.defineProperty(Wa, "__esModule", { value: !0 });
const hc = re, En = ee, mc = M, pc = M, zv = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: o } = e, { opts: a } = o, l = (0, hc.allSchemaProperties)(r), i = l.filter((g) => (0, mc.alwaysValidSchema)(o, r[g]));
    if (l.length === 0 || i.length === l.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const d = a.strictSchema && !a.allowMatchingProperties && s.properties, u = t.name("valid");
    o.props !== !0 && !(o.props instanceof En.Name) && (o.props = (0, pc.evaluatedPropsToName)(t, o.props));
    const { props: h } = o;
    E();
    function E() {
      for (const g of l)
        d && _(g), o.allErrors ? v(g) : (t.var(u, !0), v(g), t.if(u));
    }
    function _(g) {
      for (const $ in d)
        new RegExp(g).test($) && (0, mc.checkStrictMode)(o, `property ${$} matches pattern ${g} (use allowMatchingProperties)`);
    }
    function v(g) {
      t.forIn("key", n, ($) => {
        t.if((0, En._)`${(0, hc.usePattern)(e, g)}.test(${$})`, () => {
          const m = i.includes(g);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: g,
            dataProp: $,
            dataPropType: pc.Type.Str
          }, u), o.opts.unevaluated && h !== !0 ? t.assign((0, En._)`${h}[${$}]`, !0) : !m && !o.allErrors && t.if((0, En.not)(u), () => t.break());
        });
      });
    }
  }
};
Wa.default = zv;
var Xa = {};
Object.defineProperty(Xa, "__esModule", { value: !0 });
const qv = M, Gv = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, qv.alwaysValidSchema)(n, r)) {
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
Xa.default = Gv;
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
const Kv = re, Hv = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Kv.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Ja.default = Hv;
var Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
const Vn = ee, Bv = M, Wv = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Vn._)`{passingSchemas: ${e.passing}}`
}, Xv = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Wv,
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
        (0, Bv.alwaysValidSchema)(s, u) ? t.var(i, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, i), h > 0 && t.if((0, Vn._)`${i} && ${a}`).assign(a, !1).assign(l, (0, Vn._)`[${l}, ${h}]`).else(), t.if(i, () => {
          t.assign(a, !0), t.assign(l, h), E && e.mergeEvaluated(E, Vn.Name);
        });
      });
    }
  }
};
Ya.default = Xv;
var xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
const Jv = M, Yv = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((o, a) => {
      if ((0, Jv.alwaysValidSchema)(n, o))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: a }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
xa.default = Yv;
var Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
const xn = ee, Fu = M, xv = {
  message: ({ params: e }) => (0, xn.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, xn._)`{failingKeyword: ${e.ifClause}}`
}, Zv = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: xv,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Fu.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = $c(n, "then"), o = $c(n, "else");
    if (!s && !o)
      return;
    const a = t.let("valid", !0), l = t.name("_valid");
    if (i(), e.reset(), s && o) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, xn.not)(l), d("else"));
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
        t.assign(a, l), e.mergeValidEvaluated(E, a), h ? t.assign(h, (0, xn._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function $c(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Fu.alwaysValidSchema)(e, r);
}
Za.default = Zv;
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
const Qv = M, ew = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Qv.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Qa.default = ew;
Object.defineProperty(za, "__esModule", { value: !0 });
const tw = Or, rw = qa, nw = Tr, sw = Ga, ow = Ka, aw = Lu, iw = Ha, cw = fs, lw = Ba, uw = Wa, dw = Xa, fw = Ja, hw = Ya, mw = xa, pw = Za, $w = Qa;
function yw(e = !1) {
  const t = [
    // any
    dw.default,
    fw.default,
    hw.default,
    mw.default,
    pw.default,
    $w.default,
    // object
    iw.default,
    cw.default,
    aw.default,
    lw.default,
    uw.default
  ];
  return e ? t.push(rw.default, sw.default) : t.push(tw.default, nw.default), t.push(ow.default), t;
}
za.default = yw;
var ei = {}, ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
const $e = ee, gw = {
  message: ({ schemaCode: e }) => (0, $e.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, $e._)`{format: ${e}}`
}, _w = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: gw,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: o, schemaCode: a, it: l } = e, { opts: i, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!i.validateFormats)
      return;
    s ? E() : _();
    function E() {
      const v = r.scopeValue("formats", {
        ref: h.formats,
        code: i.code.formats
      }), g = r.const("fDef", (0, $e._)`${v}[${a}]`), $ = r.let("fType"), m = r.let("format");
      r.if((0, $e._)`typeof ${g} == "object" && !(${g} instanceof RegExp)`, () => r.assign($, (0, $e._)`${g}.type || "string"`).assign(m, (0, $e._)`${g}.validate`), () => r.assign($, (0, $e._)`"string"`).assign(m, g)), e.fail$data((0, $e.or)(w(), P()));
      function w() {
        return i.strictSchema === !1 ? $e.nil : (0, $e._)`${a} && !${m}`;
      }
      function P() {
        const I = u.$async ? (0, $e._)`(${g}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, $e._)`${m}(${n})`, R = (0, $e._)`(typeof ${m} == "function" ? ${I} : ${m}.test(${n}))`;
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
      const [g, $, m] = P(v);
      g === t && e.pass(I());
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
        const L = R instanceof RegExp ? (0, $e.regexpCode)(R) : i.code.formats ? (0, $e._)`${i.code.formats}${(0, $e.getProperty)(o)}` : void 0, W = r.scopeValue("formats", { key: o, ref: R, code: L });
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
ti.default = _w;
Object.defineProperty(ei, "__esModule", { value: !0 });
const vw = ti, ww = [vw.default];
ei.default = ww;
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
Object.defineProperty(Na, "__esModule", { value: !0 });
const Ew = Ia, Sw = Oa, bw = za, Pw = ei, yc = Er, Nw = [
  Ew.default,
  Sw.default,
  (0, bw.default)(),
  Pw.default,
  yc.metadataVocabulary,
  yc.contentVocabulary
];
Na.default = Nw;
var ri = {}, hs = {};
Object.defineProperty(hs, "__esModule", { value: !0 });
hs.DiscrError = void 0;
var gc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(gc || (hs.DiscrError = gc = {}));
Object.defineProperty(ri, "__esModule", { value: !0 });
const hr = ee, so = hs, _c = De, Iw = Rr, Rw = M, Ow = {
  message: ({ params: { discrError: e, tagName: t } }) => e === so.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, hr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, Tw = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Ow,
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
    t.if((0, hr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: so.DiscrError.Tag, tag: d, tagName: l })), e.ok(i);
    function u() {
      const _ = E();
      t.if(!1);
      for (const v in _)
        t.elseIf((0, hr._)`${d} === ${v}`), t.assign(i, h(_[v]));
      t.else(), e.error(!1, { discrError: so.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(_) {
      const v = t.name("valid"), g = e.subschema({ keyword: "oneOf", schemaProp: _ }, v);
      return e.mergeEvaluated(g, hr.Name), v;
    }
    function E() {
      var _;
      const v = {}, g = m(s);
      let $ = !0;
      for (let I = 0; I < a.length; I++) {
        let R = a[I];
        if (R != null && R.$ref && !(0, Rw.schemaHasRulesButRef)(R, o.self.RULES)) {
          const W = R.$ref;
          if (R = _c.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, W), R instanceof _c.SchemaEnv && (R = R.schema), R === void 0)
            throw new Iw.default(o.opts.uriResolver, o.baseId, W);
        }
        const L = (_ = R == null ? void 0 : R.properties) === null || _ === void 0 ? void 0 : _[l];
        if (typeof L != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        $ = $ && (g || m(R)), w(L, I);
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
          for (const L of I.enum)
            P(L, R);
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
ri.default = Tw;
const jw = "http://json-schema.org/draft-07/schema#", kw = "http://json-schema.org/draft-07/schema#", Aw = "Core schema meta-schema", Cw = {
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
}, Dw = [
  "object",
  "boolean"
], Mw = {
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
}, Lw = {
  $schema: jw,
  $id: kw,
  title: Aw,
  definitions: Cw,
  type: Dw,
  properties: Mw,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = Ql, n = Na, s = ri, o = Lw, a = ["/properties"], l = "http://json-schema.org/draft-07/schema";
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
  var u = ee;
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
})(xs, xs.exports);
var Vw = xs.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = Vw, r = ee, n = r.operators, s = {
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
      const g = new t.KeywordCxt(E, v.RULES.all.format.definition, "format");
      g.$data ? $() : m();
      function $() {
        const P = i.scopeValue("formats", {
          ref: v.formats,
          code: _.code.formats
        }), I = i.const("fmt", (0, r._)`${P}[${g.schemaCode}]`);
        l.fail$data((0, r.or)((0, r._)`typeof ${I} != "object"`, (0, r._)`${I} instanceof RegExp`, (0, r._)`typeof ${I}.compare != "function"`, w(I)));
      }
      function m() {
        const P = g.schema, I = v.formats[P];
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
})(Zl);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = xl, n = Zl, s = ee, o = new s.Name("fullFormats"), a = new s.Name("fastFormats"), l = (d, u = { keywords: !0 }) => {
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
    for (const g of u)
      d.addFormat(g, h[g]);
  }
  e.exports = t = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
})(Ys, Ys.exports);
var Fw = Ys.exports;
const Uw = /* @__PURE__ */ Qc(Fw), zw = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), o = Object.getOwnPropertyDescriptor(t, r);
  !qw(s, o) && n || Object.defineProperty(e, r, o);
}, qw = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, Gw = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, Kw = (e, t) => `/* Wrapped ${e}*/
${t}`, Hw = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), Bw = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), Ww = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = Kw.bind(null, n, t.toString());
  Object.defineProperty(s, "name", Bw);
  const { writable: o, enumerable: a, configurable: l } = Hw;
  Object.defineProperty(e, "toString", { value: s, writable: o, enumerable: a, configurable: l });
};
function Xw(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    zw(e, t, s, r);
  return Gw(e, t), Ww(e, t, n), e;
}
const vc = (e, t = {}) => {
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
  return Xw(d, e), d.cancel = () => {
    a && (clearTimeout(a), a = void 0), l && (clearTimeout(l), l = void 0);
  }, d;
};
var oo = { exports: {} };
const Jw = "2.0.0", Uu = 256, Yw = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, xw = 16, Zw = Uu - 6, Qw = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var ms = {
  MAX_LENGTH: Uu,
  MAX_SAFE_COMPONENT_LENGTH: xw,
  MAX_SAFE_BUILD_LENGTH: Zw,
  MAX_SAFE_INTEGER: Yw,
  RELEASE_TYPES: Qw,
  SEMVER_SPEC_VERSION: Jw,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const eE = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var ps = eE;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = ms, o = ps;
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
  }, g = ($, m, w) => {
    const P = v(m), I = h++;
    o($, I, m), u[$] = I, i[I] = m, d[I] = P, a[I] = new RegExp(m, w ? "g" : void 0), l[I] = new RegExp(P, w ? "g" : void 0);
  };
  g("NUMERICIDENTIFIER", "0|[1-9]\\d*"), g("NUMERICIDENTIFIERLOOSE", "\\d+"), g("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${E}*`), g("MAINVERSION", `(${i[u.NUMERICIDENTIFIER]})\\.(${i[u.NUMERICIDENTIFIER]})\\.(${i[u.NUMERICIDENTIFIER]})`), g("MAINVERSIONLOOSE", `(${i[u.NUMERICIDENTIFIERLOOSE]})\\.(${i[u.NUMERICIDENTIFIERLOOSE]})\\.(${i[u.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASEIDENTIFIER", `(?:${i[u.NONNUMERICIDENTIFIER]}|${i[u.NUMERICIDENTIFIER]})`), g("PRERELEASEIDENTIFIERLOOSE", `(?:${i[u.NONNUMERICIDENTIFIER]}|${i[u.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASE", `(?:-(${i[u.PRERELEASEIDENTIFIER]}(?:\\.${i[u.PRERELEASEIDENTIFIER]})*))`), g("PRERELEASELOOSE", `(?:-?(${i[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${i[u.PRERELEASEIDENTIFIERLOOSE]})*))`), g("BUILDIDENTIFIER", `${E}+`), g("BUILD", `(?:\\+(${i[u.BUILDIDENTIFIER]}(?:\\.${i[u.BUILDIDENTIFIER]})*))`), g("FULLPLAIN", `v?${i[u.MAINVERSION]}${i[u.PRERELEASE]}?${i[u.BUILD]}?`), g("FULL", `^${i[u.FULLPLAIN]}$`), g("LOOSEPLAIN", `[v=\\s]*${i[u.MAINVERSIONLOOSE]}${i[u.PRERELEASELOOSE]}?${i[u.BUILD]}?`), g("LOOSE", `^${i[u.LOOSEPLAIN]}$`), g("GTLT", "((?:<|>)?=?)"), g("XRANGEIDENTIFIERLOOSE", `${i[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), g("XRANGEIDENTIFIER", `${i[u.NUMERICIDENTIFIER]}|x|X|\\*`), g("XRANGEPLAIN", `[v=\\s]*(${i[u.XRANGEIDENTIFIER]})(?:\\.(${i[u.XRANGEIDENTIFIER]})(?:\\.(${i[u.XRANGEIDENTIFIER]})(?:${i[u.PRERELEASE]})?${i[u.BUILD]}?)?)?`), g("XRANGEPLAINLOOSE", `[v=\\s]*(${i[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${i[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${i[u.XRANGEIDENTIFIERLOOSE]})(?:${i[u.PRERELEASELOOSE]})?${i[u.BUILD]}?)?)?`), g("XRANGE", `^${i[u.GTLT]}\\s*${i[u.XRANGEPLAIN]}$`), g("XRANGELOOSE", `^${i[u.GTLT]}\\s*${i[u.XRANGEPLAINLOOSE]}$`), g("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), g("COERCE", `${i[u.COERCEPLAIN]}(?:$|[^\\d])`), g("COERCEFULL", i[u.COERCEPLAIN] + `(?:${i[u.PRERELEASE]})?(?:${i[u.BUILD]})?(?:$|[^\\d])`), g("COERCERTL", i[u.COERCE], !0), g("COERCERTLFULL", i[u.COERCEFULL], !0), g("LONETILDE", "(?:~>?)"), g("TILDETRIM", `(\\s*)${i[u.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", g("TILDE", `^${i[u.LONETILDE]}${i[u.XRANGEPLAIN]}$`), g("TILDELOOSE", `^${i[u.LONETILDE]}${i[u.XRANGEPLAINLOOSE]}$`), g("LONECARET", "(?:\\^)"), g("CARETTRIM", `(\\s*)${i[u.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", g("CARET", `^${i[u.LONECARET]}${i[u.XRANGEPLAIN]}$`), g("CARETLOOSE", `^${i[u.LONECARET]}${i[u.XRANGEPLAINLOOSE]}$`), g("COMPARATORLOOSE", `^${i[u.GTLT]}\\s*(${i[u.LOOSEPLAIN]})$|^$`), g("COMPARATOR", `^${i[u.GTLT]}\\s*(${i[u.FULLPLAIN]})$|^$`), g("COMPARATORTRIM", `(\\s*)${i[u.GTLT]}\\s*(${i[u.LOOSEPLAIN]}|${i[u.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", g("HYPHENRANGE", `^\\s*(${i[u.XRANGEPLAIN]})\\s+-\\s+(${i[u.XRANGEPLAIN]})\\s*$`), g("HYPHENRANGELOOSE", `^\\s*(${i[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${i[u.XRANGEPLAINLOOSE]})\\s*$`), g("STAR", "(<|>)?=?\\s*\\*"), g("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), g("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(oo, oo.exports);
var dn = oo.exports;
const tE = Object.freeze({ loose: !0 }), rE = Object.freeze({}), nE = (e) => e ? typeof e != "object" ? tE : e : rE;
var ni = nE;
const wc = /^[0-9]+$/, zu = (e, t) => {
  const r = wc.test(e), n = wc.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, sE = (e, t) => zu(t, e);
var qu = {
  compareIdentifiers: zu,
  rcompareIdentifiers: sE
};
const Sn = ps, { MAX_LENGTH: Ec, MAX_SAFE_INTEGER: bn } = ms, { safeRe: Pn, t: Nn } = dn, oE = ni, { compareIdentifiers: lr } = qu;
let aE = class Qe {
  constructor(t, r) {
    if (r = oE(r), t instanceof Qe) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Ec)
      throw new TypeError(
        `version is longer than ${Ec} characters`
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
      if (Sn("prerelease compare", r, n, s), n === void 0 && s === void 0)
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
      if (Sn("build compare", r, n, s), n === void 0 && s === void 0)
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
var ke = aE;
const Sc = ke, iE = (e, t, r = !1) => {
  if (e instanceof Sc)
    return e;
  try {
    return new Sc(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var jr = iE;
const cE = jr, lE = (e, t) => {
  const r = cE(e, t);
  return r ? r.version : null;
};
var uE = lE;
const dE = jr, fE = (e, t) => {
  const r = dE(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var hE = fE;
const bc = ke, mE = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new bc(
      e instanceof bc ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var pE = mE;
const Pc = jr, $E = (e, t) => {
  const r = Pc(e, null, !0), n = Pc(t, null, !0), s = r.compare(n);
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
var yE = $E;
const gE = ke, _E = (e, t) => new gE(e, t).major;
var vE = _E;
const wE = ke, EE = (e, t) => new wE(e, t).minor;
var SE = EE;
const bE = ke, PE = (e, t) => new bE(e, t).patch;
var NE = PE;
const IE = jr, RE = (e, t) => {
  const r = IE(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var OE = RE;
const Nc = ke, TE = (e, t, r) => new Nc(e, r).compare(new Nc(t, r));
var xe = TE;
const jE = xe, kE = (e, t, r) => jE(t, e, r);
var AE = kE;
const CE = xe, DE = (e, t) => CE(e, t, !0);
var ME = DE;
const Ic = ke, LE = (e, t, r) => {
  const n = new Ic(e, r), s = new Ic(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var si = LE;
const VE = si, FE = (e, t) => e.sort((r, n) => VE(r, n, t));
var UE = FE;
const zE = si, qE = (e, t) => e.sort((r, n) => zE(n, r, t));
var GE = qE;
const KE = xe, HE = (e, t, r) => KE(e, t, r) > 0;
var $s = HE;
const BE = xe, WE = (e, t, r) => BE(e, t, r) < 0;
var oi = WE;
const XE = xe, JE = (e, t, r) => XE(e, t, r) === 0;
var Gu = JE;
const YE = xe, xE = (e, t, r) => YE(e, t, r) !== 0;
var Ku = xE;
const ZE = xe, QE = (e, t, r) => ZE(e, t, r) >= 0;
var ai = QE;
const e1 = xe, t1 = (e, t, r) => e1(e, t, r) <= 0;
var ii = t1;
const r1 = Gu, n1 = Ku, s1 = $s, o1 = ai, a1 = oi, i1 = ii, c1 = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return r1(e, r, n);
    case "!=":
      return n1(e, r, n);
    case ">":
      return s1(e, r, n);
    case ">=":
      return o1(e, r, n);
    case "<":
      return a1(e, r, n);
    case "<=":
      return i1(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Hu = c1;
const l1 = ke, u1 = jr, { safeRe: In, t: Rn } = dn, d1 = (e, t) => {
  if (e instanceof l1)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? In[Rn.COERCEFULL] : In[Rn.COERCE]);
  else {
    const i = t.includePrerelease ? In[Rn.COERCERTLFULL] : In[Rn.COERCERTL];
    let d;
    for (; (d = i.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), i.lastIndex = d.index + d[1].length + d[2].length;
    i.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", o = r[4] || "0", a = t.includePrerelease && r[5] ? `-${r[5]}` : "", l = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return u1(`${n}.${s}.${o}${a}${l}`, t);
};
var f1 = d1;
class h1 {
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
var m1 = h1, Cs, Rc;
function Ze() {
  if (Rc) return Cs;
  Rc = 1;
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
        if (this.set = this.set.filter((G) => !g(G[0])), this.set.length === 0)
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
      const C = ((this.options.includePrerelease && _) | (this.options.loose && v)) + ":" + k, G = n.get(C);
      if (G)
        return G;
      const D = this.options.loose, N = D ? i[d.HYPHENRANGELOOSE] : i[d.HYPHENRANGE];
      k = k.replace(N, z(this.options.includePrerelease)), a("hyphen replace", k), k = k.replace(i[d.COMPARATORTRIM], u), a("comparator trim", k), k = k.replace(i[d.TILDETRIM], h), a("tilde trim", k), k = k.replace(i[d.CARETTRIM], E), a("caret trim", k);
      let p = k.split(" ").map((f) => w(f, this.options)).join(" ").split(/\s+/).map((f) => F(f, this.options));
      D && (p = p.filter((f) => (a("loose invalid filter", f, this.options), !!f.match(i[d.COMPARATORLOOSE])))), a("range list", p);
      const b = /* @__PURE__ */ new Map(), y = p.map((f) => new o(f, this.options));
      for (const f of y) {
        if (g(f))
          return [f];
        b.set(f.value, f);
      }
      b.size > 1 && b.has("") && b.delete("");
      const c = [...b.values()];
      return n.set(C, c), c;
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
          k = new l(k, this.options);
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
  const r = m1, n = new r(), s = ni, o = ys(), a = ps, l = ke, {
    safeRe: i,
    t: d,
    comparatorTrimReplace: u,
    tildeTrimReplace: h,
    caretTrimReplace: E
  } = dn, { FLAG_INCLUDE_PRERELEASE: _, FLAG_LOOSE: v } = ms, g = (T) => T.value === "<0.0.0-0", $ = (T) => T.value === "", m = (T, k) => {
    let V = !0;
    const C = T.slice();
    let G = C.pop();
    for (; V && C.length; )
      V = C.every((D) => G.intersects(D, k)), G = C.pop();
    return V;
  }, w = (T, k) => (a("comp", T, k), T = L(T, k), a("caret", T), T = I(T, k), a("tildes", T), T = se(T, k), a("xrange", T), T = de(T, k), a("stars", T), T), P = (T) => !T || T.toLowerCase() === "x" || T === "*", I = (T, k) => T.trim().split(/\s+/).map((V) => R(V, k)).join(" "), R = (T, k) => {
    const V = k.loose ? i[d.TILDELOOSE] : i[d.TILDE];
    return T.replace(V, (C, G, D, N, p) => {
      a("tilde", T, C, G, D, N, p);
      let b;
      return P(G) ? b = "" : P(D) ? b = `>=${G}.0.0 <${+G + 1}.0.0-0` : P(N) ? b = `>=${G}.${D}.0 <${G}.${+D + 1}.0-0` : p ? (a("replaceTilde pr", p), b = `>=${G}.${D}.${N}-${p} <${G}.${+D + 1}.0-0`) : b = `>=${G}.${D}.${N} <${G}.${+D + 1}.0-0`, a("tilde return", b), b;
    });
  }, L = (T, k) => T.trim().split(/\s+/).map((V) => W(V, k)).join(" "), W = (T, k) => {
    a("caret", T, k);
    const V = k.loose ? i[d.CARETLOOSE] : i[d.CARET], C = k.includePrerelease ? "-0" : "";
    return T.replace(V, (G, D, N, p, b) => {
      a("caret", T, G, D, N, p, b);
      let y;
      return P(D) ? y = "" : P(N) ? y = `>=${D}.0.0${C} <${+D + 1}.0.0-0` : P(p) ? D === "0" ? y = `>=${D}.${N}.0${C} <${D}.${+N + 1}.0-0` : y = `>=${D}.${N}.0${C} <${+D + 1}.0.0-0` : b ? (a("replaceCaret pr", b), D === "0" ? N === "0" ? y = `>=${D}.${N}.${p}-${b} <${D}.${N}.${+p + 1}-0` : y = `>=${D}.${N}.${p}-${b} <${D}.${+N + 1}.0-0` : y = `>=${D}.${N}.${p}-${b} <${+D + 1}.0.0-0`) : (a("no pr"), D === "0" ? N === "0" ? y = `>=${D}.${N}.${p}${C} <${D}.${N}.${+p + 1}-0` : y = `>=${D}.${N}.${p}${C} <${D}.${+N + 1}.0-0` : y = `>=${D}.${N}.${p} <${+D + 1}.0.0-0`), a("caret return", y), y;
    });
  }, se = (T, k) => (a("replaceXRanges", T, k), T.split(/\s+/).map((V) => ae(V, k)).join(" ")), ae = (T, k) => {
    T = T.trim();
    const V = k.loose ? i[d.XRANGELOOSE] : i[d.XRANGE];
    return T.replace(V, (C, G, D, N, p, b) => {
      a("xRange", T, C, G, D, N, p, b);
      const y = P(D), c = y || P(N), f = c || P(p), S = f;
      return G === "=" && S && (G = ""), b = k.includePrerelease ? "-0" : "", y ? G === ">" || G === "<" ? C = "<0.0.0-0" : C = "*" : G && S ? (c && (N = 0), p = 0, G === ">" ? (G = ">=", c ? (D = +D + 1, N = 0, p = 0) : (N = +N + 1, p = 0)) : G === "<=" && (G = "<", c ? D = +D + 1 : N = +N + 1), G === "<" && (b = "-0"), C = `${G + D}.${N}.${p}${b}`) : c ? C = `>=${D}.0.0${b} <${+D + 1}.0.0-0` : f && (C = `>=${D}.${N}.0${b} <${D}.${+N + 1}.0-0`), a("xRange return", C), C;
    });
  }, de = (T, k) => (a("replaceStars", T, k), T.trim().replace(i[d.STAR], "")), F = (T, k) => (a("replaceGTE0", T, k), T.trim().replace(i[k.includePrerelease ? d.GTE0PRE : d.GTE0], "")), z = (T) => (k, V, C, G, D, N, p, b, y, c, f, S) => (P(C) ? V = "" : P(G) ? V = `>=${C}.0.0${T ? "-0" : ""}` : P(D) ? V = `>=${C}.${G}.0${T ? "-0" : ""}` : N ? V = `>=${V}` : V = `>=${V}${T ? "-0" : ""}`, P(y) ? b = "" : P(c) ? b = `<${+y + 1}.0.0-0` : P(f) ? b = `<${y}.${+c + 1}.0-0` : S ? b = `<=${y}.${c}.${f}-${S}` : T ? b = `<${y}.${c}.${+f + 1}-0` : b = `<=${b}`, `${V} ${b}`.trim()), oe = (T, k, V) => {
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
var Ds, Oc;
function ys() {
  if (Oc) return Ds;
  Oc = 1;
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
  Ds = t;
  const r = ni, { safeRe: n, t: s } = dn, o = Hu, a = ps, l = ke, i = Ze();
  return Ds;
}
const p1 = Ze(), $1 = (e, t, r) => {
  try {
    t = new p1(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var gs = $1;
const y1 = Ze(), g1 = (e, t) => new y1(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var _1 = g1;
const v1 = ke, w1 = Ze(), E1 = (e, t, r) => {
  let n = null, s = null, o = null;
  try {
    o = new w1(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || s.compare(a) === -1) && (n = a, s = new v1(n, r));
  }), n;
};
var S1 = E1;
const b1 = ke, P1 = Ze(), N1 = (e, t, r) => {
  let n = null, s = null, o = null;
  try {
    o = new P1(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || s.compare(a) === 1) && (n = a, s = new b1(n, r));
  }), n;
};
var I1 = N1;
const Ms = ke, R1 = Ze(), Tc = $s, O1 = (e, t) => {
  e = new R1(e, t);
  let r = new Ms("0.0.0");
  if (e.test(r) || (r = new Ms("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let o = null;
    s.forEach((a) => {
      const l = new Ms(a.semver.version);
      switch (a.operator) {
        case ">":
          l.prerelease.length === 0 ? l.patch++ : l.prerelease.push(0), l.raw = l.format();
        case "":
        case ">=":
          (!o || Tc(l, o)) && (o = l);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!r || Tc(r, o)) && (r = o);
  }
  return r && e.test(r) ? r : null;
};
var T1 = O1;
const j1 = Ze(), k1 = (e, t) => {
  try {
    return new j1(e, t).range || "*";
  } catch {
    return null;
  }
};
var A1 = k1;
const C1 = ke, Bu = ys(), { ANY: D1 } = Bu, M1 = Ze(), L1 = gs, jc = $s, kc = oi, V1 = ii, F1 = ai, U1 = (e, t, r, n) => {
  e = new C1(e, n), t = new M1(t, n);
  let s, o, a, l, i;
  switch (r) {
    case ">":
      s = jc, o = V1, a = kc, l = ">", i = ">=";
      break;
    case "<":
      s = kc, o = F1, a = jc, l = "<", i = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (L1(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const u = t.set[d];
    let h = null, E = null;
    if (u.forEach((_) => {
      _.semver === D1 && (_ = new Bu(">=0.0.0")), h = h || _, E = E || _, s(_.semver, h.semver, n) ? h = _ : a(_.semver, E.semver, n) && (E = _);
    }), h.operator === l || h.operator === i || (!E.operator || E.operator === l) && o(e, E.semver))
      return !1;
    if (E.operator === i && a(e, E.semver))
      return !1;
  }
  return !0;
};
var ci = U1;
const z1 = ci, q1 = (e, t, r) => z1(e, t, ">", r);
var G1 = q1;
const K1 = ci, H1 = (e, t, r) => K1(e, t, "<", r);
var B1 = H1;
const Ac = Ze(), W1 = (e, t, r) => (e = new Ac(e, r), t = new Ac(t, r), e.intersects(t, r));
var X1 = W1;
const J1 = gs, Y1 = xe;
var x1 = (e, t, r) => {
  const n = [];
  let s = null, o = null;
  const a = e.sort((u, h) => Y1(u, h, r));
  for (const u of a)
    J1(u, t, r) ? (o = u, s || (s = u)) : (o && n.push([s, o]), o = null, s = null);
  s && n.push([s, null]);
  const l = [];
  for (const [u, h] of n)
    u === h ? l.push(u) : !h && u === a[0] ? l.push("*") : h ? u === a[0] ? l.push(`<=${h}`) : l.push(`${u} - ${h}`) : l.push(`>=${u}`);
  const i = l.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return i.length < d.length ? i : t;
};
const Cc = Ze(), li = ys(), { ANY: Ls } = li, qr = gs, ui = xe, Z1 = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Cc(e, r), t = new Cc(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const o of t.set) {
      const a = eS(s, o, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, Q1 = [new li(">=0.0.0-0")], Dc = [new li(">=0.0.0")], eS = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Ls) {
    if (t.length === 1 && t[0].semver === Ls)
      return !0;
    r.includePrerelease ? e = Q1 : e = Dc;
  }
  if (t.length === 1 && t[0].semver === Ls) {
    if (r.includePrerelease)
      return !0;
    t = Dc;
  }
  const n = /* @__PURE__ */ new Set();
  let s, o;
  for (const _ of e)
    _.operator === ">" || _.operator === ">=" ? s = Mc(s, _, r) : _.operator === "<" || _.operator === "<=" ? o = Lc(o, _, r) : n.add(_.semver);
  if (n.size > 1)
    return null;
  let a;
  if (s && o) {
    if (a = ui(s.semver, o.semver, r), a > 0)
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
        if (l = Mc(s, _, r), l === _ && l !== s)
          return !1;
      } else if (s.operator === ">=" && !qr(s.semver, String(_), r))
        return !1;
    }
    if (o) {
      if (h && _.semver.prerelease && _.semver.prerelease.length && _.semver.major === h.major && _.semver.minor === h.minor && _.semver.patch === h.patch && (h = !1), _.operator === "<" || _.operator === "<=") {
        if (i = Lc(o, _, r), i === _ && i !== o)
          return !1;
      } else if (o.operator === "<=" && !qr(o.semver, String(_), r))
        return !1;
    }
    if (!_.operator && (o || s) && a !== 0)
      return !1;
  }
  return !(s && d && !o && a !== 0 || o && u && !s && a !== 0 || E || h);
}, Mc = (e, t, r) => {
  if (!e)
    return t;
  const n = ui(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Lc = (e, t, r) => {
  if (!e)
    return t;
  const n = ui(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var tS = Z1;
const Vs = dn, Vc = ms, rS = ke, Fc = qu, nS = jr, sS = uE, oS = hE, aS = pE, iS = yE, cS = vE, lS = SE, uS = NE, dS = OE, fS = xe, hS = AE, mS = ME, pS = si, $S = UE, yS = GE, gS = $s, _S = oi, vS = Gu, wS = Ku, ES = ai, SS = ii, bS = Hu, PS = f1, NS = ys(), IS = Ze(), RS = gs, OS = _1, TS = S1, jS = I1, kS = T1, AS = A1, CS = ci, DS = G1, MS = B1, LS = X1, VS = x1, FS = tS;
var US = {
  parse: nS,
  valid: sS,
  clean: oS,
  inc: aS,
  diff: iS,
  major: cS,
  minor: lS,
  patch: uS,
  prerelease: dS,
  compare: fS,
  rcompare: hS,
  compareLoose: mS,
  compareBuild: pS,
  sort: $S,
  rsort: yS,
  gt: gS,
  lt: _S,
  eq: vS,
  neq: wS,
  gte: ES,
  lte: SS,
  cmp: bS,
  coerce: PS,
  Comparator: NS,
  Range: IS,
  satisfies: RS,
  toComparators: OS,
  maxSatisfying: TS,
  minSatisfying: jS,
  minVersion: kS,
  validRange: AS,
  outside: CS,
  gtr: DS,
  ltr: MS,
  intersects: LS,
  simplifyRange: VS,
  subset: FS,
  SemVer: rS,
  re: Vs.re,
  src: Vs.src,
  tokens: Vs.t,
  SEMVER_SPEC_VERSION: Vc.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Vc.RELEASE_TYPES,
  compareIdentifiers: Fc.compareIdentifiers,
  rcompareIdentifiers: Fc.rcompareIdentifiers
};
const ur = /* @__PURE__ */ Qc(US), zS = Object.prototype.toString, qS = "[object Uint8Array]", GS = "[object ArrayBuffer]";
function Wu(e, t, r) {
  return e ? e.constructor === t ? !0 : zS.call(e) === r : !1;
}
function Xu(e) {
  return Wu(e, Uint8Array, qS);
}
function KS(e) {
  return Wu(e, ArrayBuffer, GS);
}
function HS(e) {
  return Xu(e) || KS(e);
}
function BS(e) {
  if (!Xu(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function WS(e) {
  if (!HS(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Uc(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, o) => s + o.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    BS(s), r.set(s, n), n += s.length;
  return r;
}
const On = {
  utf8: new globalThis.TextDecoder("utf8")
};
function zc(e, t = "utf8") {
  return WS(e), On[t] ?? (On[t] = new globalThis.TextDecoder(t)), On[t].decode(e);
}
function XS(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const JS = new globalThis.TextEncoder();
function Fs(e) {
  return XS(e), JS.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const YS = Uw.default, qc = "aes-256-cbc", dr = () => /* @__PURE__ */ Object.create(null), xS = (e) => e != null, ZS = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Fn = "__internal__", Us = `${Fn}.migrations.version`;
var Pt, it, Ve, ct;
class QS {
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
      r.cwd = vd(r.projectName, { suffix: r.projectSuffix }).config;
    }
    if (Mr(this, Ve, r), r.schema ?? r.ajvOptions ?? r.rootSchema) {
      if (r.schema && typeof r.schema != "object")
        throw new TypeError("The `schema` option must be an object.");
      const a = new I0.Ajv2020({
        allErrors: !0,
        useDefaults: !0,
        ...r.ajvOptions
      });
      YS(a);
      const l = {
        ...r.rootSchema,
        type: "object",
        properties: r.schema
      };
      Mr(this, Pt, a.compile(l));
      for (const [i, d] of Object.entries(r.schema ?? {}))
        d != null && d.default && (fe(this, ct)[i] = d.default);
    }
    r.defaults && Mr(this, ct, {
      ...fe(this, ct),
      ...r.defaults
    }), r.serialize && (this._serialize = r.serialize), r.deserialize && (this._deserialize = r.deserialize), this.events = new EventTarget(), Mr(this, it, r.encryptionKey);
    const n = r.fileExtension ? `.${r.fileExtension}` : "";
    this.path = B.resolve(r.cwd, `${r.configName ?? "config"}${n}`);
    const s = this.store, o = Object.assign(dr(), r.defaults, s);
    if (r.migrations) {
      if (!r.projectVersion)
        throw new Error("Please specify the `projectVersion` option.");
      this._migrate(r.migrations, r.projectVersion, r.beforeEachMigration);
    }
    this._validate(o);
    try {
      dd.deepEqual(s, o);
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
      ZS(o, a), fe(this, Ve).accessPropertiesByDotNotation ? $i(n, o, a) : n[o] = a;
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
    return fe(this, Ve).accessPropertiesByDotNotation ? $d(this.store, t) : t in this.store;
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      xS(fe(this, ct)[r]) && this.set(r, fe(this, ct)[r]);
  }
  delete(t) {
    const { store: r } = this;
    fe(this, Ve).accessPropertiesByDotNotation ? pd(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    this.store = dr();
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
      return this._validate(n), Object.assign(dr(), n);
    } catch (t) {
      if ((t == null ? void 0 : t.code) === "ENOENT")
        return this._ensureDirectory(), dr();
      if (fe(this, Ve).clearInvalidConfig && t.name === "SyntaxError")
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
    if (!fe(this, it))
      return typeof t == "string" ? t : zc(t);
    try {
      const r = t.slice(0, 16), n = Lr.pbkdf2Sync(fe(this, it), r.toString(), 1e4, 32, "sha512"), s = Lr.createDecipheriv(qc, n, r), o = t.slice(17), a = typeof o == "string" ? Fs(o) : o;
      return zc(Uc([s.update(a), s.final()]));
    } catch {
    }
    return t.toString();
  }
  _handleChange(t, r) {
    let n = t();
    const s = () => {
      const o = n, a = t();
      ud(a, o) || (n = a, r.call(this, a, o));
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
      const n = Lr.randomBytes(16), s = Lr.pbkdf2Sync(fe(this, it), n.toString(), 1e4, 32, "sha512"), o = Lr.createCipheriv(qc, s, n);
      r = Uc([n, Fs(":"), o.update(Fs(r)), o.final()]);
    }
    if (_e.env.SNAP)
      Q.writeFileSync(this.path, r, { mode: fe(this, Ve).configFileMode });
    else
      try {
        Zc(this.path, r, { mode: fe(this, Ve).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          Q.writeFileSync(this.path, r, { mode: fe(this, Ve).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    this._ensureDirectory(), Q.existsSync(this.path) || this._write(dr()), _e.platform === "win32" ? Q.watch(this.path, { persistent: !1 }, vc(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 100 })) : Q.watchFile(this.path, { persistent: !1 }, vc(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 5e3 }));
  }
  _migrate(t, r, n) {
    let s = this._get(Us, "0.0.0");
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
        i == null || i(this), this._set(Us, l), s = l, a = { ...this.store };
      } catch (i) {
        throw this.store = a, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${i}`);
      }
    (this._isVersionInRangeFormat(s) || !ur.eq(s, r)) && this._set(Us, r);
  }
  _containsReservedKey(t) {
    return typeof t == "object" && Object.keys(t)[0] === Fn ? !0 : typeof t != "string" ? !1 : fe(this, Ve).accessPropertiesByDotNotation ? !!t.startsWith(`${Fn}.`) : !1;
  }
  _isVersionInRangeFormat(t) {
    return ur.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && ur.satisfies(r, t) ? !1 : ur.satisfies(n, t) : !(ur.lte(t, r) || ur.gt(t, n));
  }
  _get(t, r) {
    return md(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    $i(n, t, r), this.store = n;
  }
}
Pt = new WeakMap(), it = new WeakMap(), Ve = new WeakMap(), ct = new WeakMap();
const { app: Un, ipcMain: ao, shell: eb } = Wc;
let Gc = !1;
const Kc = () => {
  if (!ao || !Un)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: Un.getPath("userData"),
    appVersion: Un.getVersion()
  };
  return Gc || (ao.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), Gc = !0), e;
};
class tb extends QS {
  constructor(t) {
    let r, n;
    if (_e.type === "renderer") {
      const s = Wc.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else ao && Un && ({ defaultCwd: r, appVersion: n } = Kc());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = B.isAbsolute(t.cwd) ? t.cwd : B.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    Kc();
  }
  async openInEditor() {
    const t = await eb.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const Ju = 67324752, Yu = 33639248, xu = 101010256, rb = Object.prototype.hasOwnProperty;
function nb(e) {
  for (let t = e.length - 22; t >= 0; t--)
    if (e.readUInt32LE(t) === xu)
      return t;
  throw new Error("End of central directory not found");
}
function Zu(e) {
  const t = nb(e), r = e.readUInt32LE(t + 12), n = e.readUInt32LE(t + 16), s = [], o = /* @__PURE__ */ new Map();
  let a = n, l = 0;
  for (; a < n + r; ) {
    if (e.readUInt32LE(a) !== Yu)
      throw new Error("Invalid central directory signature");
    const d = e.readUInt16LE(a + 4), u = e.readUInt16LE(a + 6), h = e.readUInt16LE(a + 8), E = e.readUInt16LE(a + 10), _ = e.readUInt16LE(a + 12), v = e.readUInt16LE(a + 14), g = e.readUInt32LE(a + 16), $ = e.readUInt32LE(a + 20), m = e.readUInt32LE(a + 24), w = e.readUInt16LE(a + 28), P = e.readUInt16LE(a + 30), I = e.readUInt16LE(a + 32), R = e.readUInt16LE(a + 34), L = e.readUInt16LE(a + 36), W = e.readUInt32LE(a + 38), se = e.readUInt32LE(a + 42), ae = a + 46, de = ae + w, F = e.slice(ae, de).toString("utf8"), z = de, oe = z + P, T = e.slice(z, oe), k = oe, V = k + I, C = e.slice(k, V);
    if (e.readUInt32LE(se) !== Ju)
      throw new Error(`Invalid local header signature for ${F}`);
    const D = e.readUInt16LE(se + 26), N = e.readUInt16LE(se + 28), p = se + 30 + D + N, b = p + $, y = e.slice(p, b), c = e.slice(
      se + 30 + D,
      p
    ), f = {
      fileName: F,
      versionMadeBy: d,
      versionNeeded: u,
      generalPurpose: h,
      compressionMethod: E,
      lastModTime: _,
      lastModDate: v,
      crc32: g,
      compressedSize: $,
      uncompressedSize: m,
      diskNumberStart: R,
      internalAttrs: L,
      externalAttrs: W,
      extraField: T,
      fileComment: C,
      localExtraField: c,
      compressedData: y,
      localHeaderOffset: se,
      order: l
    };
    s.push(f), o.set(F, f), a = V, l += 1;
  }
  return { entries: s, entryMap: o };
}
function sb(e) {
  let t = 4294967295;
  for (let r = 0; r < e.length; r++) {
    const n = e[r];
    t = t >>> 8 ^ ob[(t ^ n) & 255];
  }
  return (t ^ 4294967295) >>> 0;
}
const ob = (() => {
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
    return Jc.inflateRawSync(e.compressedData);
  throw new Error(`Unsupported compression method: ${e.compressionMethod}`);
}
function ab(e, t) {
  if (t === 0)
    return e;
  if (t === 8)
    return Jc.deflateRawSync(e);
  throw new Error(`Unsupported compression method: ${t}`);
}
function io(e) {
  return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}
function ib(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function Qu(e) {
  const t = [], r = /<si>([\s\S]*?)<\/si>/g;
  let n;
  for (; (n = r.exec(e)) !== null; ) {
    const s = n[1], o = /<t[^>]*>([\s\S]*?)<\/t>/g;
    let a = "", l;
    for (; (l = o.exec(s)) !== null; )
      a += io(l[1]);
    t.push(a);
  }
  return t;
}
function ed(e) {
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
function cb(e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const n = e.charCodeAt(r);
    n >= 65 && n <= 90 ? t = t * 26 + (n - 64) : n >= 97 && n <= 122 && (t = t * 26 + (n - 96));
  }
  return t - 1;
}
function lb(e, t, r) {
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
function td(e) {
  return e == null ? !1 : typeof e == "string" ? e.trim().length > 0 : !0;
}
function ub(e, t, r) {
  const n = /* @__PURE__ */ new Map(), s = [];
  let o = 0;
  for (; ; ) {
    const i = e.indexOf("<c", o);
    if (i === -1) break;
    const d = e.indexOf(">", i);
    if (d === -1) break;
    let u = e.slice(i + 2, d), h = !1;
    u.endsWith("/") && (h = !0, u = u.slice(0, -1));
    const E = ed(u), _ = E.r;
    let v = "", g = d + 1;
    if (!h) {
      const $ = e.indexOf("</c>", d);
      if ($ === -1) break;
      v = e.slice(d + 1, $), g = $ + 4;
    }
    if (_) {
      const $ = /^([A-Z]+)(\d+)$/.exec(_);
      if ($) {
        const m = $[1], w = parseInt($[2], 10);
        if (m === "A") {
          const P = v.match(/<v>([\s\S]*?)<\/v>/);
          if (P) {
            const I = Number.parseInt(P[1], 10), R = t[I];
            R && n.set(w, R);
          }
        }
        if (m === "B") {
          const I = n.get(w) ?? (w === 1 ? "SFC" : void 0);
          if (I && rb.call(r, I)) {
            const R = r[I], L = { ...E }, W = zs(L);
            let se;
            if (!td(R))
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
                se = `<c${z ? ` ${z}` : ""}><is><t>${ib(ae)}</t></is></c>`;
              }
            }
            s.push({ start: i, end: g, text: se });
          }
        }
      }
    }
    o = g;
  }
  if (s.length === 0)
    return e;
  s.sort((i, d) => i.start - d.start);
  let a = "", l = 0;
  for (const i of s)
    a += e.slice(l, i.start), a += i.text, l = i.end;
  return a += e.slice(l), a;
}
function db(e) {
  const t = [...e.entries].sort(
    (i, d) => i.localHeaderOffset - d.localHeaderOffset
  ), r = [];
  let n = 0;
  for (const i of t) {
    const d = Buffer.from(i.fileName, "utf8"), u = Buffer.alloc(30);
    u.writeUInt32LE(Ju, 0), u.writeUInt16LE(i.versionNeeded, 4), u.writeUInt16LE(i.generalPurpose, 6), u.writeUInt16LE(i.compressionMethod, 8), u.writeUInt16LE(i.lastModTime, 10), u.writeUInt16LE(i.lastModDate, 12), u.writeUInt32LE(i.crc32, 14), u.writeUInt32LE(i.compressedSize, 18), u.writeUInt32LE(i.uncompressedSize, 22), u.writeUInt16LE(d.length, 26), u.writeUInt16LE(i.localExtraField.length, 28), r.push(
      u,
      d,
      i.localExtraField,
      i.compressedData
    ), i.newLocalHeaderOffset = n, n += u.length + d.length + i.localExtraField.length + i.compressedData.length;
  }
  const s = n, o = [];
  for (const i of t) {
    const d = Buffer.from(i.fileName, "utf8"), u = Buffer.alloc(46);
    u.writeUInt32LE(Yu, 0), u.writeUInt16LE(i.versionMadeBy, 4), u.writeUInt16LE(i.versionNeeded, 6), u.writeUInt16LE(i.generalPurpose, 8), u.writeUInt16LE(i.compressionMethod, 10), u.writeUInt16LE(i.lastModTime, 12), u.writeUInt16LE(i.lastModDate, 14), u.writeUInt32LE(i.crc32, 16), u.writeUInt32LE(i.compressedSize, 20), u.writeUInt32LE(i.uncompressedSize, 24), u.writeUInt16LE(d.length, 28), u.writeUInt16LE(i.extraField.length, 30), u.writeUInt16LE(i.fileComment.length, 32), u.writeUInt16LE(i.diskNumberStart, 34), u.writeUInt16LE(i.internalAttrs, 36), u.writeUInt32LE(i.externalAttrs, 38), u.writeUInt32LE(i.newLocalHeaderOffset ?? 0, 42), o.push(
      u,
      d,
      i.extraField,
      i.fileComment
    ), n += u.length + d.length + i.extraField.length + i.fileComment.length;
  }
  const a = n - s, l = Buffer.alloc(22);
  return l.writeUInt32LE(xu, 0), l.writeUInt16LE(0, 4), l.writeUInt16LE(0, 6), l.writeUInt16LE(t.length, 8), l.writeUInt16LE(t.length, 10), l.writeUInt32LE(a, 12), l.writeUInt32LE(s, 16), l.writeUInt16LE(0, 20), Buffer.concat([...r, ...o, l]);
}
function fb(e, t) {
  const r = {};
  t && (r.SFC = t);
  for (const [n, s] of Object.entries(e))
    td(s) && (r[n] = s);
  return r;
}
function hb(e, t, r) {
  if (!me.existsSync(e))
    throw new Error(`Workbook not found: ${e}`);
  const n = me.readFileSync(e), s = Zu(n), o = s.entryMap.get("xl/worksheets/sheet1.xml"), a = s.entryMap.get("xl/sharedStrings.xml");
  if (!o || !a)
    throw new Error("Workbook is missing required worksheet or shared strings");
  const l = Zn(a).toString("utf8"), i = Qu(l), d = Zn(o).toString("utf8"), u = fb(t, r), h = ub(
    d,
    i,
    u
  );
  if (h === d)
    return;
  const E = Buffer.from(h, "utf8"), _ = ab(E, o.compressionMethod);
  o.compressedData = _, o.compressedSize = _.length, o.uncompressedSize = E.length, o.crc32 = sb(E);
  const v = db(s), g = `${e}.tmp`;
  me.writeFileSync(g, v), me.renameSync(g, e);
}
function mb(e, t = "xl/worksheets/sheet1.xml") {
  if (!me.existsSync(e))
    throw new Error(`Workbook not found: ${e}`);
  const r = me.readFileSync(e), n = Zu(r), s = n.entryMap.get(t);
  if (!s)
    throw new Error(`Worksheet not found: ${t}`);
  const o = n.entryMap.get("xl/sharedStrings.xml"), a = o ? Qu(Zn(o).toString("utf8")) : [], l = Zn(s).toString("utf8"), i = [], d = /<row[^>]*>([\s\S]*?)<\/row>/g;
  let u;
  for (; (u = d.exec(l)) !== null; ) {
    const h = u[1], E = [];
    let _ = -1;
    const v = /<c([^>]*)>([\s\S]*?)<\/c>/g;
    let g;
    for (; (g = v.exec(h)) !== null; ) {
      const $ = g[1], m = g[2], w = ed($), P = w.r;
      let I = -1;
      if (P) {
        const L = P.replace(/\d+/g, "");
        I = cb(L);
      } else
        I = E.length;
      if (I < 0)
        continue;
      const R = lb(m, w.t, a);
      E[I] = R, I > _ && (_ = I);
    }
    if (_ >= 0)
      for (let $ = 0; $ <= _; $ += 1)
        E[$] === void 0 && (E[$] = "");
    i.push(E);
  }
  return i;
}
function pb(e) {
  const t = pi.join(e, "Input_Total.xlsx");
  if (!me.existsSync(t)) {
    const r = pi.join(e, "Input_Plant.xlsx");
    if (!me.existsSync(r))
      throw new Error("No template available to create Input_Total.xlsx");
    me.copyFileSync(r, t);
  }
  return t;
}
cd(import.meta.url);
const _s = B.dirname(ld(import.meta.url));
process.env.APP_ROOT = B.join(_s, "..");
const co = process.env.VITE_DEV_SERVER_URL, Ub = B.join(process.env.APP_ROOT, "dist-electron"), zn = B.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = co ? B.join(process.env.APP_ROOT, "public") : zn;
function $b() {
  return Qt.isPackaged ? B.join(process.resourcesPath, "third-party") : B.join(_s, "..", "third-party");
}
function di() {
  return Qt.isPackaged ? B.join(process.resourcesPath, "output") : B.join(_s, "..", "output");
}
function Hc(e) {
  me.existsSync(e) || me.mkdirSync(e, { recursive: !0 });
}
function yb(e, t) {
  return new Promise((r, n) => {
    var o, a;
    const s = fd(e, {
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
function Bc(e) {
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
function gb(e) {
  const r = me.readFileSync(e, "utf-8").split(/\r?\n/).filter((a) => a.trim().length > 0);
  if (r.length === 0)
    return [];
  const n = Bc(r[0]), s = n.findIndex(
    (a) => a.toLowerCase() === "time"
  );
  if (s === -1)
    return console.warn("Output CSV missing Time column"), [];
  const o = [];
  for (let a = 1; a < r.length; a += 1) {
    const l = Bc(r[a]), i = rd(l, n, s);
    i && o.push(i);
  }
  return o;
}
function _b(e) {
  try {
    const t = mb(e);
    if (t.length === 0)
      return [];
    const r = t[0].map((o) => o.trim()), n = r.findIndex(
      (o) => o.toLowerCase() === "time"
    );
    if (n === -1)
      return console.warn("Workbook missing Time column"), [];
    const s = [];
    for (let o = 1; o < t.length; o += 1) {
      const a = t[o], l = rd(a, r, n);
      l && s.push(l);
    }
    return s;
  } catch (t) {
    return console.error("Failed to read simulation workbook", e, t), [];
  }
}
function nd(e) {
  const t = B.join(e, "Output_Total.xlsx");
  if (me.existsSync(t)) {
    const n = _b(t);
    if (n.length > 0)
      return n;
  }
  const r = B.join(e, "Output_Total.csv");
  return me.existsSync(r) ? gb(r) : [];
}
sr.handle("run-exe", async (e, t) => {
  const r = $b(), n = B.join(r, "MHySIM_HRS_Run.exe");
  if (!me.existsSync(n)) {
    const v = `실행 파일을 찾을 수 없습니다:
` + n + `

패키징 시 extraResources에 third-party를 포함했는지 확인하세요.`;
    throw console.error("[run-exe] " + v), id.showErrorBox("Executable missing", v), new Error(v);
  }
  const s = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, ""), o = di();
  Hc(o);
  const a = B.join(o, s);
  Hc(a);
  const l = a, i = (t == null ? void 0 : t.skipExe) ?? !1, d = s, u = me.readdirSync(l).filter((v) => /^Output_\d+\.csv$/i.test(v));
  for (const v of u) {
    const g = B.extname(v), $ = B.basename(v, g);
    let m = 1, w = `${$}-${m}${g}`;
    for (; me.existsSync(B.join(l, w)); )
      m++, w = `${$}-${m}${g}`;
    me.renameSync(
      B.join(l, v),
      B.join(l, w)
    ), console.log(`📁 백업됨: ${v} → ${w}`);
  }
  try {
    const v = (t == null ? void 0 : t.values) ?? {}, g = (t == null ? void 0 : t.sfc) ?? null;
    if (Object.keys(v).length > 0 || g) {
      const m = pb(r);
      hb(m, v, g);
    }
  } catch (v) {
    throw console.error("❌ Excel 업데이트 실패:", v), v;
  }
  let h;
  if (i)
    h = "EXE skipped by user toggle", console.info("[run-exe] Execution skipped by user toggle");
  else if (process.platform === "win32")
    try {
      await yb(n, l), h = "EXE completed successfully";
    } catch (v) {
      throw console.error("❌ EXE 실행 실패:", v), v;
    }
  else
    h = `EXE execution skipped: unsupported platform (${process.platform})`, console.warn(
      `run-exe called on unsupported platform (${process.platform}); executable skipped.`
    );
  const E = nd(l);
  return {
    status: h,
    frames: E.sort((v, g) => v.time - g.time),
    outputDate: d,
    outputDir: l
  };
});
sr.handle(
  "read-output-data",
  async (e, t) => {
    const r = di(), n = (l) => {
      if (!l) return null;
      const i = l.replace(/[^0-9]/g, "");
      return i.length === 8 ? i : null;
    }, s = (l) => {
      if (!l) return null;
      const i = B.join(r, l);
      return me.existsSync(i) && me.statSync(i).isDirectory() ? { dir: i, date: l } : null;
    }, o = n(t == null ? void 0 : t.date);
    let a = s(o ?? void 0);
    if (!a)
      try {
        const i = me.readdirSync(r, { withFileTypes: !0 }).filter((d) => d.isDirectory() && /^\d{8}$/.test(d.name)).map((d) => d.name).sort().at(-1) ?? null;
        i && (a = { dir: B.join(r, i), date: i });
      } catch (l) {
        console.error("Failed to scan output directory", r, l);
      }
    if (!a)
      return { frames: [], date: null };
    try {
      return { frames: nd(a.dir).sort(
        (i, d) => i.time - d.time
      ), date: a.date };
    } catch (l) {
      return console.error("Failed to read output data", a, l), { frames: [], date: a.date };
    }
  }
);
function vb(e) {
  const t = e.getFullYear(), r = `${e.getMonth() + 1}`.padStart(2, "0"), n = `${e.getDate()}`.padStart(2, "0");
  return `${t}-${r}-${n}`;
}
sr.handle("read-recent-logs", async () => {
  const e = di(), t = [], r = /* @__PURE__ */ new Date();
  for (let n = 0; n < 5; n += 1) {
    const s = new Date(r);
    s.setDate(r.getDate() - n);
    const o = vb(s), a = o.replace(/-/g, ""), l = B.join(e, a, "MHySIM.jsonl");
    let i = [];
    if (me.existsSync(l))
      try {
        i = me.readFileSync(l, "utf-8").split(/\r?\n/).map((u) => u.trim()).filter(Boolean).map((u) => {
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
const fi = new tb();
sr.handle("electron-store-get", (e, t) => fi.get(t));
sr.handle("electron-store-set", (e, t, r) => {
  fi.set(t, r);
});
sr.handle("electron-store-delete", (e, t) => {
  fi.delete(t);
});
sr.on("save-project-backup", (e, t, r) => {
  const n = B.join(Qt.getPath("userData"), `${r}.json`);
  try {
    me.writeFileSync(n, JSON.stringify(t, null, 2), "utf-8"), console.log("✅ 프로젝트 백업 저장 완료:", n);
  } catch (s) {
    console.error("❌ 프로젝트 백업 저장 실패:", s);
  }
});
let St;
function sd() {
  St = new Xc({
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
  Xc.getAllWindows().length === 0 && sd();
});
Qt.whenReady().then(sd);
export {
  Ub as MAIN_DIST,
  zn as RENDERER_DIST,
  co as VITE_DEV_SERVER_URL
};
