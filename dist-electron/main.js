var pd = Object.defineProperty;
var gi = (e) => {
  throw TypeError(e);
};
var $d = (e, t, r) => t in e ? pd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Dr = (e, t, r) => $d(e, typeof t != "symbol" ? t + "" : t, r), _i = (e, t, r) => t.has(e) || gi("Cannot " + r);
var he = (e, t, r) => (_i(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Mr = (e, t, r) => t.has(e) ? gi("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Lr = (e, t, r, n) => (_i(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
import Zc, { ipcMain as pt, dialog as yd, app as er, BrowserWindow as Qc } from "electron";
import { createRequire as gd } from "node:module";
import { fileURLToPath as _d } from "node:url";
import z from "node:path";
import oe from "fs";
import _e from "node:process";
import { promisify as be, isDeepStrictEqual as vd } from "node:util";
import ee from "node:fs";
import Vr from "node:crypto";
import wd from "node:assert";
import ns from "node:os";
import { spawn as Ed } from "child_process";
import Gn from "path";
import el from "zlib";
const tr = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, Ps = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), Sd = new Set("0123456789");
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
        if (Ps.has(r))
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
          if (Ps.has(r))
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
        if (n === "index" && !Sd.has(o))
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        n === "start" && (n = "property"), s && (s = !1, r += "\\"), r += o;
      }
    }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (Ps.has(r))
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
function po(e, t) {
  if (typeof t != "number" && Array.isArray(e)) {
    const r = Number.parseInt(t, 10);
    return Number.isInteger(r) && e[r] === e[t];
  }
  return !1;
}
function tl(e, t) {
  if (po(e, t))
    throw new Error("Cannot use string index");
}
function bd(e, t, r) {
  if (!tr(e) || typeof t != "string")
    return r === void 0 ? e : r;
  const n = ss(t);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const o = n[s];
    if (po(e, o) ? e = s === n.length - 1 ? void 0 : null : e = e[o], e == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function vi(e, t, r) {
  if (!tr(e) || typeof t != "string")
    return e;
  const n = e, s = ss(t);
  for (let o = 0; o < s.length; o++) {
    const a = s[o];
    tl(e, a), o === s.length - 1 ? e[a] = r : tr(e[a]) || (e[a] = typeof s[o + 1] == "number" ? [] : {}), e = e[a];
  }
  return n;
}
function Pd(e, t) {
  if (!tr(e) || typeof t != "string")
    return !1;
  const r = ss(t);
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (tl(e, s), n === r.length - 1)
      return delete e[s], !0;
    if (e = e[s], !tr(e))
      return !1;
  }
}
function Nd(e, t) {
  if (!tr(e) || typeof t != "string")
    return !1;
  const r = ss(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!tr(e) || !(n in e) || po(e, n))
      return !1;
    e = e[n];
  }
  return !0;
}
const Pt = ns.homedir(), $o = ns.tmpdir(), { env: mr } = _e, Id = (e) => {
  const t = z.join(Pt, "Library");
  return {
    data: z.join(t, "Application Support", e),
    config: z.join(t, "Preferences", e),
    cache: z.join(t, "Caches", e),
    log: z.join(t, "Logs", e),
    temp: z.join($o, e)
  };
}, Rd = (e) => {
  const t = mr.APPDATA || z.join(Pt, "AppData", "Roaming"), r = mr.LOCALAPPDATA || z.join(Pt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: z.join(r, e, "Data"),
    config: z.join(t, e, "Config"),
    cache: z.join(r, e, "Cache"),
    log: z.join(r, e, "Log"),
    temp: z.join($o, e)
  };
}, Od = (e) => {
  const t = z.basename(Pt);
  return {
    data: z.join(mr.XDG_DATA_HOME || z.join(Pt, ".local", "share"), e),
    config: z.join(mr.XDG_CONFIG_HOME || z.join(Pt, ".config"), e),
    cache: z.join(mr.XDG_CACHE_HOME || z.join(Pt, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: z.join(mr.XDG_STATE_HOME || z.join(Pt, ".local", "state"), e),
    temp: z.join($o, t, e)
  };
};
function Td(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), _e.platform === "darwin" ? Id(e) : _e.platform === "win32" ? Rd(e) : Od(e);
}
const $t = (e, t) => function(...n) {
  return e.apply(void 0, n).catch(t);
}, at = (e, t) => function(...n) {
  try {
    return e.apply(void 0, n);
  } catch (s) {
    return t(s);
  }
}, jd = _e.getuid ? !_e.getuid() : !1, kd = 1e4, Le = () => {
}, me = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!me.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !jd && (t === "EINVAL" || t === "EPERM");
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
class Ad {
  constructor() {
    this.interval = 25, this.intervalId = void 0, this.limit = kd, this.queueActive = /* @__PURE__ */ new Set(), this.queueWaiting = /* @__PURE__ */ new Set(), this.init = () => {
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
const Cd = new Ad(), yt = (e, t) => function(n) {
  return function s(...o) {
    return Cd.schedule().then((a) => {
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
}, Dd = "utf8", wi = 438, Md = 511, Ld = {}, Vd = ns.userInfo().uid, Fd = ns.userInfo().gid, Ud = 1e3, zd = !!_e.getuid;
_e.getuid && _e.getuid();
const Ei = 128, qd = (e) => e instanceof Error && "code" in e, Si = (e) => typeof e == "string", Ns = (e) => e === void 0, Kd = _e.platform === "linux", rl = _e.platform === "win32", yo = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
rl || yo.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
Kd && yo.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
class Gd {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (rl && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? _e.kill(_e.pid, "SIGTERM") : _e.kill(_e.pid, t));
      }
    }, this.hook = () => {
      _e.once("exit", () => this.exit());
      for (const t of yo)
        try {
          _e.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const Hd = new Gd(), Bd = Hd.register, Re = {
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
    const t = z.basename(e);
    if (t.length <= Ei)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - Ei;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
Bd(Re.purgeSyncAll);
function nl(e, t, r = Ld) {
  if (Si(r))
    return nl(e, t, { encoding: r });
  const n = Date.now() + ((r.timeout ?? Ud) || -1);
  let s = null, o = null, a = null;
  try {
    const l = Ie.attempt.realpathSync(e), i = !!l;
    e = l || e, [o, s] = Re.get(e, r.tmpCreate || Re.create, r.tmpPurge !== !1);
    const d = zd && Ns(r.chown), u = Ns(r.mode);
    if (i && (d || u)) {
      const h = Ie.attempt.statSync(e);
      h && (r = { ...r }, d && (r.chown = { uid: h.uid, gid: h.gid }), u && (r.mode = h.mode));
    }
    if (!i) {
      const h = z.dirname(e);
      Ie.attempt.mkdirSync(h, {
        mode: Md,
        recursive: !0
      });
    }
    a = Ie.retry.openSync(n)(o, "w", r.mode || wi), r.tmpCreated && r.tmpCreated(o), Si(t) ? Ie.retry.writeSync(n)(a, t, 0, r.encoding || Dd) : Ns(t) || Ie.retry.writeSync(n)(a, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Ie.retry.fsyncSync(n)(a) : Ie.attempt.fsync(a)), Ie.retry.closeSync(n)(a), a = null, r.chown && (r.chown.uid !== Vd || r.chown.gid !== Fd) && Ie.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== wi && Ie.attempt.chmodSync(o, r.mode);
    try {
      Ie.retry.renameSync(n)(o, e);
    } catch (h) {
      if (!qd(h) || h.code !== "ENAMETOOLONG")
        throw h;
      Ie.retry.renameSync(n)(o, Re.truncate(e));
    }
    s(), o = null;
  } finally {
    a && Ie.attempt.closeSync(a), o && Re.purge(o);
  }
}
function sl(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ws = { exports: {} }, ol = {}, Je = {}, _r = {}, on = {}, Y = {}, nn = {};
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
})(nn);
var Xs = {};
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
})(Xs);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = nn, r = Xs;
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
      return x(c, this.rhs);
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
      let O = S.length;
      for (; O--; ) {
        const j = S[O];
        j.optimizeNames(c, f) || (k(c, j.names), S.splice(O, 1));
      }
      return S.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((c, f) => B(c, f.names), {});
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
      return x(c, this.condition), this.else && B(c, this.else.names), c;
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
      return B(super.names, this.iteration.names);
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
      const c = x(super.names, this.from);
      return x(c, this.to);
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
      return B(super.names, this.iterable.names);
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
  class W extends g {
    render(c) {
      return "return " + super.render(c);
    }
  }
  W.kind = "return";
  class ae extends v {
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
      return this.catch && B(c, this.catch.names), this.finally && B(c, this.finally.names), c;
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
  class ce extends v {
    render(c) {
      return "finally" + super.render(c);
    }
  }
  ce.kind = "finally";
  class F {
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
      const O = new ae();
      if (this._blockNode(O), this.code(c), f) {
        const j = this.name("e");
        this._currNode = O.catch = new ie(j), f(j);
      }
      return S && (this._currNode = O.finally = new ce(), this.code(S)), this._endBlockNode(ie, ce);
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
  function B(_, c) {
    for (const f in c)
      _[f] = (_[f] || 0) + (c[f] || 0);
    return _;
  }
  function x(_, c) {
    return c instanceof t._CodeOrName ? B(_, c.names) : _;
  }
  function T(_, c, f) {
    if (_ instanceof t.Name)
      return S(_);
    if (!O(_))
      return _;
    return new t._Code(_._items.reduce((j, q) => (q instanceof t.Name && (q = S(q)), q instanceof t._Code ? j.push(...q._items) : j.push(q), j), []));
    function S(j) {
      const q = f[j.str];
      return q === void 0 || c[j.str] !== 1 ? j : (delete c[j.str], q);
    }
    function O(j) {
      return j instanceof t._Code && j._items.some((q) => q instanceof t.Name && c[q.str] === 1 && f[q.str] !== void 0);
    }
  }
  function k(_, c) {
    for (const f in c)
      _[f] = (_[f] || 0) - (c[f] || 0);
  }
  function V(_) {
    return typeof _ == "boolean" || typeof _ == "number" || _ === null ? !_ : (0, t._)`!${b(_)}`;
  }
  e.not = V;
  const C = p(e.operators.AND);
  function K(..._) {
    return _.reduce(C);
  }
  e.and = K;
  const D = p(e.operators.OR);
  function N(..._) {
    return _.reduce(D);
  }
  e.or = N;
  function p(_) {
    return (c, f) => c === t.nil ? f : f === t.nil ? c : (0, t._)`${b(c)} ${_} ${b(f)}`;
  }
  function b(_) {
    return _ instanceof t.Name ? _ : (0, t._)`(${_})`;
  }
})(Y);
var A = {};
Object.defineProperty(A, "__esModule", { value: !0 });
A.checkStrictMode = A.getErrorPath = A.Type = A.useFunc = A.setEvaluated = A.evaluatedPropsToName = A.mergeEvaluated = A.eachItem = A.unescapeJsonPointer = A.escapeJsonPointer = A.escapeFragment = A.unescapeFragment = A.schemaRefOrVal = A.schemaHasRulesButRef = A.schemaHasRules = A.checkUnknownRules = A.alwaysValidSchema = A.toHash = void 0;
const le = Y, Wd = nn;
function Xd(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
A.toHash = Xd;
function Jd(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (al(e, t), !il(t, e.self.RULES.all));
}
A.alwaysValidSchema = Jd;
function al(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const o in t)
    s[o] || ul(e, `unknown keyword: "${o}"`);
}
A.checkUnknownRules = al;
function il(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
A.schemaHasRules = il;
function xd(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
A.schemaHasRulesButRef = xd;
function Yd({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, le._)`${r}`;
  }
  return (0, le._)`${e}${t}${(0, le.getProperty)(n)}`;
}
A.schemaRefOrVal = Yd;
function Zd(e) {
  return cl(decodeURIComponent(e));
}
A.unescapeFragment = Zd;
function Qd(e) {
  return encodeURIComponent(go(e));
}
A.escapeFragment = Qd;
function go(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
A.escapeJsonPointer = go;
function cl(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
A.unescapeJsonPointer = cl;
function ef(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
A.eachItem = ef;
function bi({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, o, a, l) => {
    const i = a === void 0 ? o : a instanceof le.Name ? (o instanceof le.Name ? e(s, o, a) : t(s, o, a), a) : o instanceof le.Name ? (t(s, a, o), o) : r(o, a);
    return l === le.Name && !(i instanceof le.Name) ? n(s, i) : i;
  };
}
A.mergeEvaluated = {
  props: bi({
    mergeNames: (e, t, r) => e.if((0, le._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, le._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, le._)`${r} || {}`).code((0, le._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, le._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, le._)`${r} || {}`), _o(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: ll
  }),
  items: bi({
    mergeNames: (e, t, r) => e.if((0, le._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, le._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, le._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, le._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function ll(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, le._)`{}`);
  return t !== void 0 && _o(e, r, t), r;
}
A.evaluatedPropsToName = ll;
function _o(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, le._)`${t}${(0, le.getProperty)(n)}`, !0));
}
A.setEvaluated = _o;
const Pi = {};
function tf(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Pi[t.code] || (Pi[t.code] = new Wd._Code(t.code))
  });
}
A.useFunc = tf;
var Js;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Js || (A.Type = Js = {}));
function rf(e, t, r) {
  if (e instanceof le.Name) {
    const n = t === Js.Num;
    return r ? n ? (0, le._)`"[" + ${e} + "]"` : (0, le._)`"['" + ${e} + "']"` : n ? (0, le._)`"/" + ${e}` : (0, le._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, le.getProperty)(e).toString() : "/" + go(e);
}
A.getErrorPath = rf;
function ul(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
A.checkStrictMode = ul;
var Fe = {};
Object.defineProperty(Fe, "__esModule", { value: !0 });
const Pe = Y, nf = {
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
Fe.default = nf;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = Y, r = A, n = Fe;
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: m }) => m ? (0, t.str)`"${$}" keyword must be ${m} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, m = e.keywordError, w, P) {
    const { it: I } = $, { gen: R, compositeRule: L, allErrors: W } = I, ae = h($, m, w);
    P ?? (L || W) ? i(R, ae) : d(I, (0, t._)`[${ae}]`);
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
    const { keyword: I, data: R, schemaValue: L, it: W } = $, { opts: ae, propertyName: ie, topSchemaRef: ce, schemaPath: F } = W;
    P.push([u.keyword, I], [u.params, typeof m == "function" ? m($) : m || (0, t._)`{}`]), ae.messages && P.push([u.message, typeof w == "function" ? w($) : w]), ae.verbose && P.push([u.schema, L], [u.parentSchema, (0, t._)`${ce}${F}`], [n.default.data, R]), ie && P.push([u.propertyName, ie]);
  }
})(on);
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.boolOrEmptySchema = _r.topBoolOrEmptySchema = void 0;
const sf = on, of = Y, af = Fe, cf = {
  message: "boolean schema is false"
};
function lf(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? dl(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(af.default.data) : (t.assign((0, of._)`${n}.errors`, null), t.return(!0));
}
_r.topBoolOrEmptySchema = lf;
function uf(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), dl(e)) : r.var(t, !0);
}
_r.boolOrEmptySchema = uf;
function dl(e, t) {
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
  (0, sf.reportError)(s, cf, void 0, t);
}
var ye = {}, rr = {};
Object.defineProperty(rr, "__esModule", { value: !0 });
rr.getRules = rr.isJSONType = void 0;
const df = ["string", "number", "integer", "boolean", "null", "object", "array"], ff = new Set(df);
function hf(e) {
  return typeof e == "string" && ff.has(e);
}
rr.isJSONType = hf;
function mf() {
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
rr.getRules = mf;
var lt = {};
Object.defineProperty(lt, "__esModule", { value: !0 });
lt.shouldUseRule = lt.shouldUseGroup = lt.schemaHasRulesForType = void 0;
function pf({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && fl(e, n);
}
lt.schemaHasRulesForType = pf;
function fl(e, t) {
  return t.rules.some((r) => hl(e, r));
}
lt.shouldUseGroup = fl;
function hl(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
lt.shouldUseRule = hl;
Object.defineProperty(ye, "__esModule", { value: !0 });
ye.reportTypeError = ye.checkDataTypes = ye.checkDataType = ye.coerceAndCheckDataType = ye.getJSONTypes = ye.getSchemaTypes = ye.DataType = void 0;
const $f = rr, yf = lt, gf = on, Z = Y, ml = A;
var pr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(pr || (ye.DataType = pr = {}));
function _f(e) {
  const t = pl(e.type);
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
ye.getSchemaTypes = _f;
function pl(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every($f.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ye.getJSONTypes = pl;
function vf(e, t) {
  const { gen: r, data: n, opts: s } = e, o = wf(t, s.coerceTypes), a = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, yf.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const l = vo(t, n, s.strictNumbers, pr.Wrong);
    r.if(l, () => {
      o.length ? Ef(e, t, o) : wo(e);
    });
  }
  return a;
}
ye.coerceAndCheckDataType = vf;
const $l = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function wf(e, t) {
  return t ? e.filter((r) => $l.has(r) || t === "array" && r === "array") : [];
}
function Ef(e, t, r) {
  const { gen: n, data: s, opts: o } = e, a = n.let("dataType", (0, Z._)`typeof ${s}`), l = n.let("coerced", (0, Z._)`undefined`);
  o.coerceTypes === "array" && n.if((0, Z._)`${a} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, Z._)`${s}[0]`).assign(a, (0, Z._)`typeof ${s}`).if(vo(t, s, o.strictNumbers), () => n.assign(l, s))), n.if((0, Z._)`${l} !== undefined`);
  for (const d of r)
    ($l.has(d) || d === "array" && o.coerceTypes === "array") && i(d);
  n.else(), wo(e), n.endIf(), n.if((0, Z._)`${l} !== undefined`, () => {
    n.assign(s, l), Sf(e, l);
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
function Sf({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, Z._)`${t} !== undefined`, () => e.assign((0, Z._)`${t}[${r}]`, n));
}
function xs(e, t, r, n = pr.Correct) {
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
ye.checkDataType = xs;
function vo(e, t, r, n) {
  if (e.length === 1)
    return xs(e[0], t, r, n);
  let s;
  const o = (0, ml.toHash)(e);
  if (o.array && o.object) {
    const a = (0, Z._)`typeof ${t} != "object"`;
    s = o.null ? a : (0, Z._)`!${t} || ${a}`, delete o.null, delete o.array, delete o.object;
  } else
    s = Z.nil;
  o.number && delete o.integer;
  for (const a in o)
    s = (0, Z.and)(s, xs(a, t, r, n));
  return s;
}
ye.checkDataTypes = vo;
const bf = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, Z._)`{type: ${e}}` : (0, Z._)`{type: ${t}}`
};
function wo(e) {
  const t = Pf(e);
  (0, gf.reportError)(t, bf);
}
ye.reportTypeError = wo;
function Pf(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, ml.schemaRefOrVal)(e, n, "type");
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
const or = Y, Nf = A;
function If(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Ni(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, o) => Ni(e, o, s.default));
}
os.assignDefaults = If;
function Ni(e, t, r) {
  const { gen: n, compositeRule: s, data: o, opts: a } = e;
  if (r === void 0)
    return;
  const l = (0, or._)`${o}${(0, or.getProperty)(t)}`;
  if (s) {
    (0, Nf.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let i = (0, or._)`${l} === undefined`;
  a.useDefaults === "empty" && (i = (0, or._)`${i} || ${l} === null || ${l} === ""`), n.if(i, (0, or._)`${l} = ${(0, or.stringify)(r)}`);
}
var rt = {}, re = {};
Object.defineProperty(re, "__esModule", { value: !0 });
re.validateUnion = re.validateArray = re.usePattern = re.callValidateCode = re.schemaProperties = re.allSchemaProperties = re.noPropertyInData = re.propertyInData = re.isOwnProperty = re.hasPropFunc = re.reportMissingProp = re.checkMissingProp = re.checkReportMissingProp = void 0;
const de = Y, Eo = A, _t = Fe, Rf = A;
function Of(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(bo(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, de._)`${t}` }, !0), e.error();
  });
}
re.checkReportMissingProp = Of;
function Tf({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, de.or)(...n.map((o) => (0, de.and)(bo(e, t, o, r.ownProperties), (0, de._)`${s} = ${o}`)));
}
re.checkMissingProp = Tf;
function jf(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
re.reportMissingProp = jf;
function yl(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, de._)`Object.prototype.hasOwnProperty`
  });
}
re.hasPropFunc = yl;
function So(e, t, r) {
  return (0, de._)`${yl(e)}.call(${t}, ${r})`;
}
re.isOwnProperty = So;
function kf(e, t, r, n) {
  const s = (0, de._)`${t}${(0, de.getProperty)(r)} !== undefined`;
  return n ? (0, de._)`${s} && ${So(e, t, r)}` : s;
}
re.propertyInData = kf;
function bo(e, t, r, n) {
  const s = (0, de._)`${t}${(0, de.getProperty)(r)} === undefined`;
  return n ? (0, de.or)(s, (0, de.not)(So(e, t, r))) : s;
}
re.noPropertyInData = bo;
function gl(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
re.allSchemaProperties = gl;
function Af(e, t) {
  return gl(t).filter((r) => !(0, Eo.alwaysValidSchema)(e, t[r]));
}
re.schemaProperties = Af;
function Cf({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: o }, it: a }, l, i, d) {
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
re.callValidateCode = Cf;
const Df = (0, de._)`new RegExp`;
function Mf({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, o = s(r, n);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, de._)`${s.code === "new RegExp" ? Df : (0, Rf.useFunc)(e, s)}(${r}, ${n})`
  });
}
re.usePattern = Mf;
function Lf(e) {
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
        dataPropType: Eo.Type.Num
      }, o), t.if((0, de.not)(o), l);
    });
  }
}
re.validateArray = Lf;
function Vf(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((i) => (0, Eo.alwaysValidSchema)(s, i)) && !s.opts.unevaluated)
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
re.validateUnion = Vf;
Object.defineProperty(rt, "__esModule", { value: !0 });
rt.validateKeywordUsage = rt.validSchemaType = rt.funcKeywordCode = rt.macroKeywordCode = void 0;
const Oe = Y, Wt = Fe, Ff = re, Uf = on;
function zf(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: o, it: a } = e, l = t.macro.call(a.self, s, o, a), i = _l(r, n, l);
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
rt.macroKeywordCode = zf;
function qf(e, t) {
  var r;
  const { gen: n, keyword: s, schema: o, parentSchema: a, $data: l, it: i } = e;
  Gf(i, t);
  const d = !l && t.compile ? t.compile.call(i.self, o, a, i) : t.validate, u = _l(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      y(), t.modifying && Ii(e), $(() => e.error());
    else {
      const m = t.async ? g() : v();
      t.modifying && Ii(e), $(() => Kf(e, m));
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
    const w = i.opts.passContext ? Wt.default.this : Wt.default.self, P = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, Oe._)`${m}${(0, Ff.callValidateCode)(e, u, w, P)}`, t.modifying);
  }
  function $(m) {
    var w;
    n.if((0, Oe.not)((w = t.valid) !== null && w !== void 0 ? w : h), m);
  }
}
rt.funcKeywordCode = qf;
function Ii(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Oe._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Kf(e, t) {
  const { gen: r } = e;
  r.if((0, Oe._)`Array.isArray(${t})`, () => {
    r.assign(Wt.default.vErrors, (0, Oe._)`${Wt.default.vErrors} === null ? ${t} : ${Wt.default.vErrors}.concat(${t})`).assign(Wt.default.errors, (0, Oe._)`${Wt.default.vErrors}.length`), (0, Uf.extendErrors)(e);
  }, () => e.error());
}
function Gf({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function _l(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Oe.stringify)(r) });
}
function Hf(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
rt.validSchemaType = Hf;
function Bf({ schema: e, opts: t, self: r, errSchemaPath: n }, s, o) {
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
rt.validateKeywordUsage = Bf;
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.extendSubschemaMode = Ot.extendSubschemaData = Ot.getSubschema = void 0;
const et = Y, vl = A;
function Wf(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: o, topSchemaRef: a }) {
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
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, vl.escapeFragment)(r)}`
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
Ot.getSubschema = Wf;
function Xf(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: o, propertyName: a }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, E = l.let("data", (0, et._)`${t.data}${(0, et.getProperty)(r)}`, !0);
    i(E), e.errorPath = (0, et.str)`${d}${(0, vl.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, et._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
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
Ot.extendSubschemaData = Xf;
function Jf(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: o }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Ot.extendSubschemaMode = Jf;
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
}, wl = { exports: {} }, It = wl.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  kn(t, n, s, e, "", e);
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
function kn(e, t, r, n, s, o, a, l, i, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, o, a, l, i, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in It.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            kn(e, t, r, h[E], s + "/" + u + "/" + E, o, s, u, n, E);
      } else if (u in It.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            kn(e, t, r, h[g], s + "/" + u + "/" + xf(g), o, s, u, n, g);
      } else (u in It.keywords || e.allKeys && !(u in It.skipKeywords)) && kn(e, t, r, h, s + "/" + u, o, s, u, n);
    }
    r(n, s, o, a, l, i, d);
  }
}
function xf(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Yf = wl.exports;
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.getSchemaRefs = Ee.resolveUrl = Ee.normalizeId = Ee._getFullPath = Ee.getFullPath = Ee.inlineRef = void 0;
const Zf = A, Qf = as, eh = Yf, th = /* @__PURE__ */ new Set([
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
function rh(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Ys(e) : t ? El(e) <= t : !1;
}
Ee.inlineRef = rh;
const nh = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Ys(e) {
  for (const t in e) {
    if (nh.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Ys) || typeof r == "object" && Ys(r))
      return !0;
  }
  return !1;
}
function El(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !th.has(r) && (typeof e[r] == "object" && (0, Zf.eachItem)(e[r], (n) => t += El(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Sl(e, t = "", r) {
  r !== !1 && (t = $r(t));
  const n = e.parse(t);
  return bl(e, n);
}
Ee.getFullPath = Sl;
function bl(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ee._getFullPath = bl;
const sh = /#\/?$/;
function $r(e) {
  return e ? e.replace(sh, "") : "";
}
Ee.normalizeId = $r;
function oh(e, t, r) {
  return r = $r(r), e.resolve(t, r);
}
Ee.resolveUrl = oh;
const ah = /^[a-z_][-a-z0-9._]*$/i;
function ih(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = $r(e[r] || t), o = { "": s }, a = Sl(n, s, !1), l = {}, i = /* @__PURE__ */ new Set();
  return eh(e, { allKeys: !0 }, (h, E, g, v) => {
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
        if (!ah.test(P))
          throw new Error(`invalid anchor "${P}"`);
        m.call(this, `#${P}`);
      }
    }
  }), l;
  function d(h, E, g) {
    if (E !== void 0 && !Qf(h, E))
      throw u(g);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ee.getSchemaRefs = ih;
Object.defineProperty(Je, "__esModule", { value: !0 });
Je.getData = Je.KeywordCxt = Je.validateFunctionCode = void 0;
const Pl = _r, Ri = ye, Po = lt, Hn = ye, ch = os, Wr = rt, Is = Ot, G = Y, X = Fe, lh = Ee, ut = A, Fr = on;
function uh(e) {
  if (Rl(e) && (Ol(e), Il(e))) {
    hh(e);
    return;
  }
  Nl(e, () => (0, Pl.topBoolOrEmptySchema)(e));
}
Je.validateFunctionCode = uh;
function Nl({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, o) {
  s.code.es5 ? e.func(t, (0, G._)`${X.default.data}, ${X.default.valCxt}`, n.$async, () => {
    e.code((0, G._)`"use strict"; ${Oi(r, s)}`), fh(e, s), e.code(o);
  }) : e.func(t, (0, G._)`${X.default.data}, ${dh(s)}`, n.$async, () => e.code(Oi(r, s)).code(o));
}
function dh(e) {
  return (0, G._)`{${X.default.instancePath}="", ${X.default.parentData}, ${X.default.parentDataProperty}, ${X.default.rootData}=${X.default.data}${e.dynamicRef ? (0, G._)`, ${X.default.dynamicAnchors}={}` : G.nil}}={}`;
}
function fh(e, t) {
  e.if(X.default.valCxt, () => {
    e.var(X.default.instancePath, (0, G._)`${X.default.valCxt}.${X.default.instancePath}`), e.var(X.default.parentData, (0, G._)`${X.default.valCxt}.${X.default.parentData}`), e.var(X.default.parentDataProperty, (0, G._)`${X.default.valCxt}.${X.default.parentDataProperty}`), e.var(X.default.rootData, (0, G._)`${X.default.valCxt}.${X.default.rootData}`), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, G._)`${X.default.valCxt}.${X.default.dynamicAnchors}`);
  }, () => {
    e.var(X.default.instancePath, (0, G._)`""`), e.var(X.default.parentData, (0, G._)`undefined`), e.var(X.default.parentDataProperty, (0, G._)`undefined`), e.var(X.default.rootData, X.default.data), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, G._)`{}`);
  });
}
function hh(e) {
  const { schema: t, opts: r, gen: n } = e;
  Nl(e, () => {
    r.$comment && t.$comment && jl(e), gh(e), n.let(X.default.vErrors, null), n.let(X.default.errors, 0), r.unevaluated && mh(e), Tl(e), wh(e);
  });
}
function mh(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, G._)`${r}.evaluated`), t.if((0, G._)`${e.evaluated}.dynamicProps`, () => t.assign((0, G._)`${e.evaluated}.props`, (0, G._)`undefined`)), t.if((0, G._)`${e.evaluated}.dynamicItems`, () => t.assign((0, G._)`${e.evaluated}.items`, (0, G._)`undefined`));
}
function Oi(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, G._)`/*# sourceURL=${r} */` : G.nil;
}
function ph(e, t) {
  if (Rl(e) && (Ol(e), Il(e))) {
    $h(e, t);
    return;
  }
  (0, Pl.boolOrEmptySchema)(e, t);
}
function Il({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Rl(e) {
  return typeof e.schema != "boolean";
}
function $h(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && jl(e), _h(e), vh(e);
  const o = n.const("_errs", X.default.errors);
  Tl(e, o), n.var(t, (0, G._)`${o} === ${X.default.errors}`);
}
function Ol(e) {
  (0, ut.checkUnknownRules)(e), yh(e);
}
function Tl(e, t) {
  if (e.opts.jtd)
    return Ti(e, [], !1, t);
  const r = (0, Ri.getSchemaTypes)(e.schema), n = (0, Ri.coerceAndCheckDataType)(e, r);
  Ti(e, r, !n, t);
}
function yh(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, ut.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function gh(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, ut.checkStrictMode)(e, "default is ignored in the schema root");
}
function _h(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, lh.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function vh(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function jl({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const o = r.$comment;
  if (s.$comment === !0)
    e.code((0, G._)`${X.default.self}.logger.log(${o})`);
  else if (typeof s.$comment == "function") {
    const a = (0, G.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, G._)`${X.default.self}.opts.$comment(${o}, ${a}, ${l}.schema)`);
  }
}
function wh(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: o } = e;
  r.$async ? t.if((0, G._)`${X.default.errors} === 0`, () => t.return(X.default.data), () => t.throw((0, G._)`new ${s}(${X.default.vErrors})`)) : (t.assign((0, G._)`${n}.errors`, X.default.vErrors), o.unevaluated && Eh(e), t.return((0, G._)`${X.default.errors} === 0`));
}
function Eh({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof G.Name && e.assign((0, G._)`${t}.props`, r), n instanceof G.Name && e.assign((0, G._)`${t}.items`, n);
}
function Ti(e, t, r, n) {
  const { gen: s, schema: o, data: a, allErrors: l, opts: i, self: d } = e, { RULES: u } = d;
  if (o.$ref && (i.ignoreKeywordsWithRef || !(0, ut.schemaHasRulesButRef)(o, u))) {
    s.block(() => Cl(e, "$ref", u.all.$ref.definition));
    return;
  }
  i.jtd || Sh(e, t), s.block(() => {
    for (const E of u.rules)
      h(E);
    h(u.post);
  });
  function h(E) {
    (0, Po.shouldUseGroup)(o, E) && (E.type ? (s.if((0, Hn.checkDataType)(E.type, a, i.strictNumbers)), ji(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, Hn.reportTypeError)(e)), s.endIf()) : ji(e, E), l || s.if((0, G._)`${X.default.errors} === ${n || 0}`));
  }
}
function ji(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, ch.assignDefaults)(e, t.type), r.block(() => {
    for (const o of t.rules)
      (0, Po.shouldUseRule)(n, o) && Cl(e, o.keyword, o.definition, t.type);
  });
}
function Sh(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (bh(e, t), e.opts.allowUnionTypes || Ph(e, t), Nh(e, e.dataTypes));
}
function bh(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      kl(e.dataTypes, r) || No(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), Rh(e, t);
  }
}
function Ph(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && No(e, "use allowUnionTypes to allow union type keyword");
}
function Nh(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Po.shouldUseRule)(e.schema, s)) {
      const { type: o } = s.definition;
      o.length && !o.some((a) => Ih(t, a)) && No(e, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function Ih(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function kl(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function Rh(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    kl(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function No(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, ut.checkStrictMode)(e, t, e.opts.strictTypes);
}
let Al = class {
  constructor(t, r, n) {
    if ((0, Wr.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, ut.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Dl(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Wr.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", X.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, G.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, G.not)(t), void 0, r);
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
    this.fail((0, G._)`${r} !== undefined && (${(0, G.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Fr.reportExtraError : Fr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Fr.reportError)(this, this.def.$dataError || Fr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Fr.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = G.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = G.nil, r = G.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: o, def: a } = this;
    n.if((0, G.or)((0, G._)`${s} === undefined`, r)), t !== G.nil && n.assign(t, !0), (o.length || a.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== G.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: o } = this;
    return (0, G.or)(a(), l());
    function a() {
      if (n.length) {
        if (!(r instanceof G.Name))
          throw new Error("ajv implementation error");
        const i = Array.isArray(n) ? n : [n];
        return (0, G._)`${(0, Hn.checkDataTypes)(i, r, o.opts.strictNumbers, Hn.DataType.Wrong)}`;
      }
      return G.nil;
    }
    function l() {
      if (s.validateSchema) {
        const i = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, G._)`!${i}(${r})`;
      }
      return G.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Is.getSubschema)(this.it, t);
    (0, Is.extendSubschemaData)(n, this.it, t), (0, Is.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return ph(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = ut.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = ut.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, G.Name)), !0;
  }
};
Je.KeywordCxt = Al;
function Cl(e, t, r, n) {
  const s = new Al(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Wr.funcKeywordCode)(s, r) : "macro" in r ? (0, Wr.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Wr.funcKeywordCode)(s, r);
}
const Oh = /^\/(?:[^~]|~0|~1)*$/, Th = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Dl(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, o;
  if (e === "")
    return X.default.rootData;
  if (e[0] === "/") {
    if (!Oh.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, o = X.default.rootData;
  } else {
    const d = Th.exec(e);
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
    d && (o = (0, G._)`${o}${(0, G.getProperty)((0, ut.unescapeJsonPointer)(d))}`, a = (0, G._)`${a} && ${o}`);
  return a;
  function i(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
Je.getData = Dl;
var an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
let jh = class extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
};
an.default = jh;
var br = {};
Object.defineProperty(br, "__esModule", { value: !0 });
const Rs = Ee;
let kh = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Rs.resolveUrl)(t, r, n), this.missingSchema = (0, Rs.normalizeId)((0, Rs.getFullPath)(t, this.missingRef));
  }
};
br.default = kh;
var je = {};
Object.defineProperty(je, "__esModule", { value: !0 });
je.resolveSchema = je.getCompilingSchema = je.resolveRef = je.compileSchema = je.SchemaEnv = void 0;
const Ke = Y, Ah = an, Ht = Fe, We = Ee, ki = A, Ch = Je;
let is = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, We.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
je.SchemaEnv = is;
function Io(e) {
  const t = Ml.call(this, e);
  if (t)
    return t;
  const r = (0, We.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: o } = this.opts, a = new Ke.CodeGen(this.scope, { es5: n, lines: s, ownProperties: o });
  let l;
  e.$async && (l = a.scopeValue("Error", {
    ref: Ah.default,
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
    this._compilations.add(e), (0, Ch.validateFunctionCode)(d), a.optimize(this.opts.code.optimize);
    const h = a.toString();
    u = `${a.scopeRefs(Ht.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const g = new Function(`${Ht.default.self}`, `${Ht.default.scope}`, u)(this, this.scope.get());
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
je.compileSchema = Io;
function Dh(e, t, r) {
  var n;
  r = (0, We.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let o = Vh.call(this, e, r);
  if (o === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    a && (o = new is({ schema: a, schemaId: l, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[r] = Mh.call(this, o);
}
je.resolveRef = Dh;
function Mh(e) {
  return (0, We.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Io.call(this, e);
}
function Ml(e) {
  for (const t of this._compilations)
    if (Lh(t, e))
      return t;
}
je.getCompilingSchema = Ml;
function Lh(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Vh(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || cs.call(this, e, t);
}
function cs(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, We._getFullPath)(this.opts.uriResolver, r);
  let s = (0, We.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Os.call(this, r, e);
  const o = (0, We.normalizeId)(n), a = this.refs[o] || this.schemas[o];
  if (typeof a == "string") {
    const l = cs.call(this, e, a);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : Os.call(this, r, l);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || Io.call(this, a), o === (0, We.normalizeId)(t)) {
      const { schema: l } = a, { schemaId: i } = this.opts, d = l[i];
      return d && (s = (0, We.resolveUrl)(this.opts.uriResolver, s, d)), new is({ schema: l, schemaId: i, root: e, baseId: s });
    }
    return Os.call(this, r, a);
  }
}
je.resolveSchema = cs;
const Fh = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Os(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const i = r[(0, ki.unescapeFragment)(l)];
    if (i === void 0)
      return;
    r = i;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !Fh.has(l) && d && (t = (0, We.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let o;
  if (typeof r != "boolean" && r.$ref && !(0, ki.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, We.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    o = cs.call(this, n, l);
  }
  const { schemaId: a } = this.opts;
  if (o = o || new is({ schema: r, schemaId: a, root: n, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const Uh = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", zh = "Meta-schema for $data reference (JSON AnySchema extension proposal)", qh = "object", Kh = [
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
}, Hh = !1, Bh = {
  $id: Uh,
  description: zh,
  type: qh,
  required: Kh,
  properties: Gh,
  additionalProperties: Hh
};
var Ro = {}, ls = { exports: {} };
const Wh = {
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
var Xh = {
  HEX: Wh
};
const { HEX: Jh } = Xh, xh = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
function Ll(e) {
  if (Fl(e, ".") < 3)
    return { host: e, isIPV4: !1 };
  const t = e.match(xh) || [], [r] = t;
  return r ? { host: Zh(r, "."), isIPV4: !0 } : { host: e, isIPV4: !1 };
}
function Ai(e, t = !1) {
  let r = "", n = !0;
  for (const s of e) {
    if (Jh[s] === void 0) return;
    s !== "0" && n === !0 && (n = !1), n || (r += s);
  }
  return t && r.length === 0 && (r = "0"), r;
}
function Yh(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let o = !1, a = !1, l = !1;
  function i() {
    if (s.length) {
      if (o === !1) {
        const d = Ai(s);
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
  return s.length && (o ? r.zone = s.join("") : l ? n.push(s.join("")) : n.push(Ai(s))), r.address = n.join(""), r;
}
function Vl(e) {
  if (Fl(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = Yh(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, escapedHost: n, isIPV6: !0 };
  }
}
function Zh(e, t) {
  let r = "", n = !0;
  const s = e.length;
  for (let o = 0; o < s; o++) {
    const a = e[o];
    a === "0" && n ? (o + 1 <= s && e[o + 1] === t || o + 1 === s) && (r += a, n = !1) : (a === t ? n = !0 : n = !1, r += a);
  }
  return r;
}
function Fl(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
const Ci = /^\.\.?\//u, Di = /^\/\.(?:\/|$)/u, Mi = /^\/\.\.(?:\/|$)/u, Qh = /^\/?(?:.|\n)*?(?=\/|$)/u;
function em(e) {
  const t = [];
  for (; e.length; )
    if (e.match(Ci))
      e = e.replace(Ci, "");
    else if (e.match(Di))
      e = e.replace(Di, "/");
    else if (e.match(Mi))
      e = e.replace(Mi, "/"), t.pop();
    else if (e === "." || e === "..")
      e = "";
    else {
      const r = e.match(Qh);
      if (r) {
        const n = r[0];
        e = e.slice(n.length), t.push(n);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return t.join("");
}
function tm(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function rm(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    const n = Ll(r);
    if (n.isIPV4)
      r = n.host;
    else {
      const s = Vl(n.host);
      s.isIPV6 === !0 ? r = `[${s.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var nm = {
  recomposeAuthority: rm,
  normalizeComponentEncoding: tm,
  removeDotSegments: em,
  normalizeIPv4: Ll,
  normalizeIPv6: Vl
};
const sm = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, om = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Ul(e) {
  return typeof e.secure == "boolean" ? e.secure : String(e.scheme).toLowerCase() === "wss";
}
function zl(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function ql(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function am(e) {
  return e.secure = Ul(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function im(e) {
  if ((e.port === (Ul(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function cm(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(om);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, o = Oo[s];
    e.path = void 0, o && (e = o.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function lm(e, t) {
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, o = Oo[s];
  o && (e = o.serialize(e, t));
  const a = e, l = e.nss;
  return a.path = `${n || t.nid}:${l}`, t.skipEscape = !0, a;
}
function um(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !sm.test(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function dm(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const Kl = {
  scheme: "http",
  domainHost: !0,
  parse: zl,
  serialize: ql
}, fm = {
  scheme: "https",
  domainHost: Kl.domainHost,
  parse: zl,
  serialize: ql
}, An = {
  scheme: "ws",
  domainHost: !0,
  parse: am,
  serialize: im
}, hm = {
  scheme: "wss",
  domainHost: An.domainHost,
  parse: An.parse,
  serialize: An.serialize
}, mm = {
  scheme: "urn",
  parse: cm,
  serialize: lm,
  skipNormalize: !0
}, pm = {
  scheme: "urn:uuid",
  parse: um,
  serialize: dm,
  skipNormalize: !0
}, Oo = {
  http: Kl,
  https: fm,
  ws: An,
  wss: hm,
  urn: mm,
  "urn:uuid": pm
};
var $m = Oo;
const { normalizeIPv6: ym, normalizeIPv4: gm, removeDotSegments: Gr, recomposeAuthority: _m, normalizeComponentEncoding: mn } = nm, To = $m;
function vm(e, t) {
  return typeof e == "string" ? e = nt(ht(e, t), t) : typeof e == "object" && (e = ht(nt(e, t), t)), e;
}
function wm(e, t, r) {
  const n = Object.assign({ scheme: "null" }, r), s = Gl(ht(e, n), ht(t, n), n, !0);
  return nt(s, { ...n, skipEscape: !0 });
}
function Gl(e, t, r, n) {
  const s = {};
  return n || (e = ht(nt(e, r), r), t = ht(nt(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Gr(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Gr(t.path || ""), s.query = t.query) : (t.path ? (t.path.charAt(0) === "/" ? s.path = Gr(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = Gr(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function Em(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = nt(mn(ht(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = nt(mn(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = nt(mn(ht(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = nt(mn(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
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
  }, n = Object.assign({}, t), s = [], o = To[(n.scheme || r.scheme || "").toLowerCase()];
  o && o.serialize && o.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const a = _m(r);
  if (a !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(a), r.path && r.path.charAt(0) !== "/" && s.push("/")), r.path !== void 0) {
    let l = r.path;
    !n.absolutePath && (!o || !o.absolutePath) && (l = Gr(l)), a === void 0 && (l = l.replace(/^\/\//u, "/%2F")), s.push(l);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const Sm = Array.from({ length: 127 }, (e, t) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(t)));
function bm(e) {
  let t = 0;
  for (let r = 0, n = e.length; r < n; ++r)
    if (t = e.charCodeAt(r), t > 126 || Sm[t])
      return !0;
  return !1;
}
const Pm = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
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
  const a = e.match(Pm);
  if (a) {
    if (n.scheme = a[1], n.userinfo = a[3], n.host = a[4], n.port = parseInt(a[5], 10), n.path = a[6] || "", n.query = a[7], n.fragment = a[8], isNaN(n.port) && (n.port = a[5]), n.host) {
      const i = gm(n.host);
      if (i.isIPV4 === !1) {
        const d = ym(i.host);
        n.host = d.host.toLowerCase(), o = d.isIPV6;
      } else
        n.host = i.host, o = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const l = To[(r.scheme || n.scheme || "").toLowerCase()];
    if (!r.unicodeSupport && (!l || !l.unicodeSupport) && n.host && (r.domainHost || l && l.domainHost) && o === !1 && bm(n.host))
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
const jo = {
  SCHEMES: To,
  normalize: vm,
  resolve: wm,
  resolveComponents: Gl,
  equal: Em,
  serialize: nt,
  parse: ht
};
ls.exports = jo;
ls.exports.default = jo;
ls.exports.fastUri = jo;
var Hl = ls.exports;
Object.defineProperty(Ro, "__esModule", { value: !0 });
const Bl = Hl;
Bl.code = 'require("ajv/dist/runtime/uri").default';
Ro.default = Bl;
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
  const n = an, s = br, o = rr, a = je, l = Y, i = Ee, d = ye, u = A, h = Bh, E = Ro, g = (N, p) => new RegExp(N, p);
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
    var p, b, _, c, f, S, O, j, q, U, se, Me, jt, kt, At, Ct, Dt, Mt, Lt, Vt, Ft, Ut, zt, qt, Kt;
    const qe = N.strict, Gt = (p = N.code) === null || p === void 0 ? void 0 : p.optimize, Ar = Gt === !0 || Gt === void 0 ? 1 : Gt || 0, Cr = (_ = (b = N.code) === null || b === void 0 ? void 0 : b.regExp) !== null && _ !== void 0 ? _ : g, bs = (c = N.uriResolver) !== null && c !== void 0 ? c : E.default;
    return {
      strictSchema: (S = (f = N.strictSchema) !== null && f !== void 0 ? f : qe) !== null && S !== void 0 ? S : !0,
      strictNumbers: (j = (O = N.strictNumbers) !== null && O !== void 0 ? O : qe) !== null && j !== void 0 ? j : !0,
      strictTypes: (U = (q = N.strictTypes) !== null && q !== void 0 ? q : qe) !== null && U !== void 0 ? U : "log",
      strictTuples: (Me = (se = N.strictTuples) !== null && se !== void 0 ? se : qe) !== null && Me !== void 0 ? Me : "log",
      strictRequired: (kt = (jt = N.strictRequired) !== null && jt !== void 0 ? jt : qe) !== null && kt !== void 0 ? kt : !1,
      code: N.code ? { ...N.code, optimize: Ar, regExp: Cr } : { optimize: Ar, regExp: Cr },
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
      int32range: (Kt = N.int32range) !== null && Kt !== void 0 ? Kt : !0,
      uriResolver: bs
    };
  }
  class I {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...P(p) };
      const { es5: b, lines: _ } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: y, es5: b, lines: _ }), this.logger = B(p.logger);
      const c = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, o.getRules)(), R.call(this, $, p, "NOT SUPPORTED"), R.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ce.call(this), p.formats && ae.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && ie.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), W.call(this), p.validateFormats = c;
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
      async function c(U, se) {
        await f.call(this, U.$schema);
        const Me = this._addSchema(U, se);
        return Me.validate || S.call(this, Me);
      }
      async function f(U) {
        U && !this.getSchema(U) && await c.call(this, { $ref: U }, !0);
      }
      async function S(U) {
        try {
          return this._compileSchemaEnv(U);
        } catch (se) {
          if (!(se instanceof s.default))
            throw se;
          return O.call(this, se), await j.call(this, se.missingSchema), S.call(this, U);
        }
      }
      function O({ missingSchema: U, missingRef: se }) {
        if (this.refs[U])
          throw new Error(`AnySchema ${U} is loaded but ${se} cannot be resolved`);
      }
      async function j(U) {
        const se = await q.call(this, U);
        this.refs[U] || await f.call(this, se.$schema), this.refs[U] || this.addSchema(se, U, b);
      }
      async function q(U) {
        const se = this._loading[U];
        if (se)
          return se;
        try {
          return await (this._loading[U] = _(U));
        } finally {
          delete this._loading[U];
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
      for (; typeof (b = L.call(this, p)) == "string"; )
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
          const b = L.call(this, p);
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
      if (T.call(this, _, b), !b)
        return (0, u.eachItem)(_, (f) => k.call(this, f)), this;
      C.call(this, b);
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
        for (const O of f)
          S = S[O];
        for (const O in _) {
          const j = _[O];
          if (typeof j != "object")
            continue;
          const { $data: q } = j.definition, U = S[O];
          q && U && (S[O] = D(U));
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
      _ = (0, i.normalizeId)(S || _);
      const q = i.getSchemaRefs.call(this, p, _);
      return j = new a.SchemaEnv({ schema: p, schemaId: O, meta: b, baseId: _, localRefs: q }), this._cache.set(j.schema, j), f && !_.startsWith("#") && (_ && this._checkUnique(_), this.refs[_] = j), c && this.validateSchema(p, !0), j;
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
  function ae() {
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
  function ce() {
    const N = { ...this.opts };
    for (const p of v)
      delete N[p];
    return N;
  }
  const F = { log() {
  }, warn() {
  }, error() {
  } };
  function B(N) {
    if (N === !1)
      return F;
    if (N === void 0)
      return console;
    if (N.log && N.warn && N.error)
      return N;
    throw new Error("logger must implement log, warn and error methods");
  }
  const x = /^[a-z_$][a-z0-9_$:-]*$/i;
  function T(N, p) {
    const { RULES: b } = this;
    if ((0, u.eachItem)(N, (_) => {
      if (b.keywords[_])
        throw new Error(`Keyword ${_} is already defined`);
      if (!x.test(_))
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
    const O = {
      keyword: N,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? V.call(this, S, O, p.before) : S.rules.push(O), f.all[N] = O, (_ = p.implements) === null || _ === void 0 || _.forEach((j) => this.addKeyword(j));
  }
  function V(N, p, b) {
    const _ = N.rules.findIndex((c) => c.keyword === b);
    _ >= 0 ? N.rules.splice(_, 0, p) : (N.rules.push(p), this.logger.warn(`rule ${b} is not defined`));
  }
  function C(N) {
    let { metaSchema: p } = N;
    p !== void 0 && (N.$data && this.opts.$data && (p = D(p)), N.validateSchema = this.compile(p, !0));
  }
  const K = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function D(N) {
    return { anyOf: [N, K] };
  }
})(ol);
var ko = {}, Ao = {}, Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
const Nm = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Co.default = Nm;
var mt = {};
Object.defineProperty(mt, "__esModule", { value: !0 });
mt.callRef = mt.getValidate = void 0;
const Im = br, Li = re, Ae = Y, ar = Fe, Vi = je, pn = A, Rm = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: o, validateName: a, opts: l, self: i } = n, { root: d } = o;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = Vi.resolveRef.call(i, d, s, r);
    if (u === void 0)
      throw new Im.default(n.opts.uriResolver, s, r);
    if (u instanceof Vi.SchemaEnv)
      return E(u);
    return g(u);
    function h() {
      if (o === d)
        return Cn(e, a, o, o.$async);
      const v = t.scopeValue("root", { ref: d });
      return Cn(e, (0, Ae._)`${v}.validate`, d, d.$async);
    }
    function E(v) {
      const y = Wl(e, v);
      Cn(e, y, v, v.$async);
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
function Wl(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ae._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
mt.getValidate = Wl;
function Cn(e, t, r, n) {
  const { gen: s, it: o } = e, { allErrors: a, schemaEnv: l, opts: i } = o, d = i.passContext ? ar.default.this : Ae.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, Ae._)`await ${(0, Li.callValidateCode)(e, t, d)}`), g(t), a || s.assign(v, !0);
    }, (y) => {
      s.if((0, Ae._)`!(${y} instanceof ${o.ValidationError})`, () => s.throw(y)), E(y), a || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, Li.callValidateCode)(e, t, d), () => g(t), () => E(t));
  }
  function E(v) {
    const y = (0, Ae._)`${v}.errors`;
    s.assign(ar.default.vErrors, (0, Ae._)`${ar.default.vErrors} === null ? ${y} : ${ar.default.vErrors}.concat(${y})`), s.assign(ar.default.errors, (0, Ae._)`${ar.default.vErrors}.length`);
  }
  function g(v) {
    var y;
    if (!o.opts.unevaluated)
      return;
    const $ = (y = r == null ? void 0 : r.validate) === null || y === void 0 ? void 0 : y.evaluated;
    if (o.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (o.props = pn.mergeEvaluated.props(s, $.props, o.props));
      else {
        const m = s.var("props", (0, Ae._)`${v}.evaluated.props`);
        o.props = pn.mergeEvaluated.props(s, m, o.props, Ae.Name);
      }
    if (o.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (o.items = pn.mergeEvaluated.items(s, $.items, o.items));
      else {
        const m = s.var("items", (0, Ae._)`${v}.evaluated.items`);
        o.items = pn.mergeEvaluated.items(s, m, o.items, Ae.Name);
      }
  }
}
mt.callRef = Cn;
mt.default = Rm;
Object.defineProperty(Ao, "__esModule", { value: !0 });
const Om = Co, Tm = mt, jm = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  Om.default,
  Tm.default
];
Ao.default = jm;
var Do = {}, Mo = {};
Object.defineProperty(Mo, "__esModule", { value: !0 });
const Bn = Y, vt = Bn.operators, Wn = {
  maximum: { okStr: "<=", ok: vt.LTE, fail: vt.GT },
  minimum: { okStr: ">=", ok: vt.GTE, fail: vt.LT },
  exclusiveMaximum: { okStr: "<", ok: vt.LT, fail: vt.GTE },
  exclusiveMinimum: { okStr: ">", ok: vt.GT, fail: vt.LTE }
}, km = {
  message: ({ keyword: e, schemaCode: t }) => (0, Bn.str)`must be ${Wn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Bn._)`{comparison: ${Wn[e].okStr}, limit: ${t}}`
}, Am = {
  keyword: Object.keys(Wn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: km,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Bn._)`${r} ${Wn[t].fail} ${n} || isNaN(${r})`);
  }
};
Mo.default = Am;
var Lo = {};
Object.defineProperty(Lo, "__esModule", { value: !0 });
const Xr = Y, Cm = {
  message: ({ schemaCode: e }) => (0, Xr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Xr._)`{multipleOf: ${e}}`
}, Dm = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Cm,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, o = s.opts.multipleOfPrecision, a = t.let("res"), l = o ? (0, Xr._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, Xr._)`${a} !== parseInt(${a})`;
    e.fail$data((0, Xr._)`(${n} === 0 || (${a} = ${r}/${n}, ${l}))`);
  }
};
Lo.default = Dm;
var Vo = {}, Fo = {};
Object.defineProperty(Fo, "__esModule", { value: !0 });
function Xl(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Fo.default = Xl;
Xl.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Vo, "__esModule", { value: !0 });
const Xt = Y, Mm = A, Lm = Fo, Vm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Xt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Xt._)`{limit: ${e}}`
}, Fm = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Vm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, o = t === "maxLength" ? Xt.operators.GT : Xt.operators.LT, a = s.opts.unicode === !1 ? (0, Xt._)`${r}.length` : (0, Xt._)`${(0, Mm.useFunc)(e.gen, Lm.default)}(${r})`;
    e.fail$data((0, Xt._)`${a} ${o} ${n}`);
  }
};
Vo.default = Fm;
var Uo = {};
Object.defineProperty(Uo, "__esModule", { value: !0 });
const Um = re, Xn = Y, zm = {
  message: ({ schemaCode: e }) => (0, Xn.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Xn._)`{pattern: ${e}}`
}, qm = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: zm,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: o } = e, a = o.opts.unicodeRegExp ? "u" : "", l = r ? (0, Xn._)`(new RegExp(${s}, ${a}))` : (0, Um.usePattern)(e, n);
    e.fail$data((0, Xn._)`!${l}.test(${t})`);
  }
};
Uo.default = qm;
var zo = {};
Object.defineProperty(zo, "__esModule", { value: !0 });
const Jr = Y, Km = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Jr.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Jr._)`{limit: ${e}}`
}, Gm = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Km,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Jr.operators.GT : Jr.operators.LT;
    e.fail$data((0, Jr._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
zo.default = Gm;
var qo = {};
Object.defineProperty(qo, "__esModule", { value: !0 });
const Ur = re, xr = Y, Hm = A, Bm = {
  message: ({ params: { missingProperty: e } }) => (0, xr.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, xr._)`{missingProperty: ${e}}`
}, Wm = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Bm,
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
          (0, Hm.checkStrictMode)(a, m, a.opts.strictRequired);
        }
    }
    function d() {
      if (i || o)
        e.block$data(xr.nil, h);
      else
        for (const g of r)
          (0, Ur.checkReportMissingProp)(e, g);
    }
    function u() {
      const g = t.let("missing");
      if (i || o) {
        const v = t.let("valid", !0);
        e.block$data(v, () => E(g, v)), e.ok(v);
      } else
        t.if((0, Ur.checkMissingProp)(e, r, g)), (0, Ur.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, Ur.noPropertyInData)(t, s, g, l.ownProperties), () => e.error());
      });
    }
    function E(g, v) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(v, (0, Ur.propertyInData)(t, s, g, l.ownProperties)), t.if((0, xr.not)(v), () => {
          e.error(), t.break();
        });
      }, xr.nil);
    }
  }
};
qo.default = Wm;
var Ko = {};
Object.defineProperty(Ko, "__esModule", { value: !0 });
const Yr = Y, Xm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Yr.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Yr._)`{limit: ${e}}`
}, Jm = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Xm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? Yr.operators.GT : Yr.operators.LT;
    e.fail$data((0, Yr._)`${r}.length ${s} ${n}`);
  }
};
Ko.default = Jm;
var Go = {}, cn = {};
Object.defineProperty(cn, "__esModule", { value: !0 });
const Jl = as;
Jl.code = 'require("ajv/dist/runtime/equal").default';
cn.default = Jl;
Object.defineProperty(Go, "__esModule", { value: !0 });
const Ts = ye, ve = Y, xm = A, Ym = cn, Zm = {
  message: ({ params: { i: e, j: t } }) => (0, ve.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, ve._)`{i: ${e}, j: ${t}}`
}, Qm = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Zm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: o, schemaCode: a, it: l } = e;
    if (!n && !s)
      return;
    const i = t.let("valid"), d = o.items ? (0, Ts.getSchemaTypes)(o.items) : [];
    e.block$data(i, u, (0, ve._)`${a} === false`), e.ok(i);
    function u() {
      const v = t.let("i", (0, ve._)`${r}.length`), y = t.let("j");
      e.setParams({ i: v, j: y }), t.assign(i, !0), t.if((0, ve._)`${v} > 1`, () => (h() ? E : g)(v, y));
    }
    function h() {
      return d.length > 0 && !d.some((v) => v === "object" || v === "array");
    }
    function E(v, y) {
      const $ = t.name("item"), m = (0, Ts.checkDataTypes)(d, $, l.opts.strictNumbers, Ts.DataType.Wrong), w = t.const("indices", (0, ve._)`{}`);
      t.for((0, ve._)`;${v}--;`, () => {
        t.let($, (0, ve._)`${r}[${v}]`), t.if(m, (0, ve._)`continue`), d.length > 1 && t.if((0, ve._)`typeof ${$} == "string"`, (0, ve._)`${$} += "_"`), t.if((0, ve._)`typeof ${w}[${$}] == "number"`, () => {
          t.assign(y, (0, ve._)`${w}[${$}]`), e.error(), t.assign(i, !1).break();
        }).code((0, ve._)`${w}[${$}] = ${v}`);
      });
    }
    function g(v, y) {
      const $ = (0, xm.useFunc)(t, Ym.default), m = t.name("outer");
      t.label(m).for((0, ve._)`;${v}--;`, () => t.for((0, ve._)`${y} = ${v}; ${y}--;`, () => t.if((0, ve._)`${$}(${r}[${v}], ${r}[${y}])`, () => {
        e.error(), t.assign(i, !1).break(m);
      })));
    }
  }
};
Go.default = Qm;
var Ho = {};
Object.defineProperty(Ho, "__esModule", { value: !0 });
const Zs = Y, ep = A, tp = cn, rp = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Zs._)`{allowedValue: ${e}}`
}, np = {
  keyword: "const",
  $data: !0,
  error: rp,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: o } = e;
    n || o && typeof o == "object" ? e.fail$data((0, Zs._)`!${(0, ep.useFunc)(t, tp.default)}(${r}, ${s})`) : e.fail((0, Zs._)`${o} !== ${r}`);
  }
};
Ho.default = np;
var Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
const Hr = Y, sp = A, op = cn, ap = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Hr._)`{allowedValues: ${e}}`
}, ip = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: ap,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= a.opts.loopEnum;
    let i;
    const d = () => i ?? (i = (0, sp.useFunc)(t, op.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", o);
      u = (0, Hr.or)(...s.map((v, y) => E(g, y)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", o, (g) => t.if((0, Hr._)`${d()}(${r}, ${g})`, () => t.assign(u, !0).break()));
    }
    function E(g, v) {
      const y = s[v];
      return typeof y == "object" && y !== null ? (0, Hr._)`${d()}(${r}, ${g}[${v}])` : (0, Hr._)`${r} === ${y}`;
    }
  }
};
Bo.default = ip;
Object.defineProperty(Do, "__esModule", { value: !0 });
const cp = Mo, lp = Lo, up = Vo, dp = Uo, fp = zo, hp = qo, mp = Ko, pp = Go, $p = Ho, yp = Bo, gp = [
  // number
  cp.default,
  lp.default,
  // string
  up.default,
  dp.default,
  // object
  fp.default,
  hp.default,
  // array
  mp.default,
  pp.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  $p.default,
  yp.default
];
Do.default = gp;
var Wo = {}, Pr = {};
Object.defineProperty(Pr, "__esModule", { value: !0 });
Pr.validateAdditionalItems = void 0;
const Jt = Y, Qs = A, _p = {
  message: ({ params: { len: e } }) => (0, Jt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Jt._)`{limit: ${e}}`
}, vp = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: _p,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Qs.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    xl(e, n);
  }
};
function xl(e, t) {
  const { gen: r, schema: n, data: s, keyword: o, it: a } = e;
  a.items = !0;
  const l = r.const("len", (0, Jt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Jt._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Qs.alwaysValidSchema)(a, n)) {
    const d = r.var("valid", (0, Jt._)`${l} <= ${t.length}`);
    r.if((0, Jt.not)(d), () => i(d)), e.ok(d);
  }
  function i(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: o, dataProp: u, dataPropType: Qs.Type.Num }, d), a.allErrors || r.if((0, Jt.not)(d), () => r.break());
    });
  }
}
Pr.validateAdditionalItems = xl;
Pr.default = vp;
var Xo = {}, Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.validateTuple = void 0;
const Fi = Y, Dn = A, wp = re, Ep = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Yl(e, "additionalItems", t);
    r.items = !0, !(0, Dn.alwaysValidSchema)(r, t) && e.ok((0, wp.validateArray)(e));
  }
};
function Yl(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: o, keyword: a, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = Dn.mergeEvaluated.items(n, r.length, l.items));
  const i = n.name("valid"), d = n.const("len", (0, Fi._)`${o}.length`);
  r.forEach((h, E) => {
    (0, Dn.alwaysValidSchema)(l, h) || (n.if((0, Fi._)`${d} > ${E}`, () => e.subschema({
      keyword: a,
      schemaProp: E,
      dataProp: E
    }, i)), e.ok(i));
  });
  function u(h) {
    const { opts: E, errSchemaPath: g } = l, v = r.length, y = v === h.minItems && (v === h.maxItems || h[t] === !1);
    if (E.strictTuples && !y) {
      const $ = `"${a}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, Dn.checkStrictMode)(l, $, E.strictTuples);
    }
  }
}
Nr.validateTuple = Yl;
Nr.default = Ep;
Object.defineProperty(Xo, "__esModule", { value: !0 });
const Sp = Nr, bp = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, Sp.validateTuple)(e, "items")
};
Xo.default = bp;
var Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
const Ui = Y, Pp = A, Np = re, Ip = Pr, Rp = {
  message: ({ params: { len: e } }) => (0, Ui.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Ui._)`{limit: ${e}}`
}, Op = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Rp,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, Pp.alwaysValidSchema)(n, t) && (s ? (0, Ip.validateAdditionalItems)(e, s) : e.ok((0, Np.validateArray)(e)));
  }
};
Jo.default = Op;
var xo = {};
Object.defineProperty(xo, "__esModule", { value: !0 });
const Ue = Y, $n = A, Tp = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ue.str)`must contain at least ${e} valid item(s)` : (0, Ue.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ue._)`{minContains: ${e}}` : (0, Ue._)`{minContains: ${e}, maxContains: ${t}}`
}, jp = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Tp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    let a, l;
    const { minContains: i, maxContains: d } = n;
    o.opts.next ? (a = i === void 0 ? 1 : i, l = d) : a = 1;
    const u = t.const("len", (0, Ue._)`${s}.length`);
    if (e.setParams({ min: a, max: l }), l === void 0 && a === 0) {
      (0, $n.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && a > l) {
      (0, $n.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, $n.alwaysValidSchema)(o, r)) {
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
          dataPropType: $n.Type.Num,
          compositeRule: !0
        }, y), $();
      });
    }
    function v(y) {
      t.code((0, Ue._)`${y}++`), l === void 0 ? t.if((0, Ue._)`${y} >= ${a}`, () => t.assign(h, !0).break()) : (t.if((0, Ue._)`${y} > ${l}`, () => t.assign(h, !1).break()), a === 1 ? t.assign(h, !0) : t.if((0, Ue._)`${y} >= ${a}`, () => t.assign(h, !0)));
    }
  }
};
xo.default = jp;
var us = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = Y, r = A, n = re;
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
var Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
const Zl = Y, kp = A, Ap = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Zl._)`{propertyName: ${e.propertyName}}`
}, Cp = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Ap,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, kp.alwaysValidSchema)(s, r))
      return;
    const o = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, o), t.if((0, Zl.not)(o), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
Yo.default = Cp;
var ds = {};
Object.defineProperty(ds, "__esModule", { value: !0 });
const yn = re, He = Y, Dp = Fe, gn = A, Mp = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, He._)`{additionalProperty: ${e.additionalProperty}}`
}, Lp = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Mp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: o, it: a } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: i } = a;
    if (a.props = !0, i.removeAdditional !== "all" && (0, gn.alwaysValidSchema)(a, r))
      return;
    const d = (0, yn.allSchemaProperties)(n.properties), u = (0, yn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, He._)`${o} === ${Dp.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !u.length ? v($) : t.if(E($), () => v($));
      });
    }
    function E($) {
      let m;
      if (d.length > 8) {
        const w = (0, gn.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, yn.isOwnProperty)(t, w, $);
      } else d.length ? m = (0, He.or)(...d.map((w) => (0, He._)`${$} === ${w}`)) : m = He.nil;
      return u.length && (m = (0, He.or)(m, ...u.map((w) => (0, He._)`${(0, yn.usePattern)(e, w)}.test(${$})`))), (0, He.not)(m);
    }
    function g($) {
      t.code((0, He._)`delete ${s}[${$}]`);
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
      if (typeof r == "object" && !(0, gn.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        i.removeAdditional === "failing" ? (y($, m, !1), t.if((0, He.not)(m), () => {
          e.reset(), g($);
        })) : (y($, m), l || t.if((0, He.not)(m), () => t.break()));
      }
    }
    function y($, m, w) {
      const P = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: gn.Type.Str
      };
      w === !1 && Object.assign(P, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(P, m);
    }
  }
};
ds.default = Lp;
var Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
const Vp = Je, zi = re, js = A, qi = ds, Fp = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && qi.default.code(new Vp.KeywordCxt(o, qi.default, "additionalProperties"));
    const a = (0, zi.allSchemaProperties)(r);
    for (const h of a)
      o.definedProperties.add(h);
    o.opts.unevaluated && a.length && o.props !== !0 && (o.props = js.mergeEvaluated.props(t, (0, js.toHash)(a), o.props));
    const l = a.filter((h) => !(0, js.alwaysValidSchema)(o, r[h]));
    if (l.length === 0)
      return;
    const i = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, zi.propertyInData)(t, s, h, o.opts.ownProperties)), u(h), o.allErrors || t.else().var(i, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(i);
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
Zo.default = Fp;
var Qo = {};
Object.defineProperty(Qo, "__esModule", { value: !0 });
const Ki = re, _n = Y, Gi = A, Hi = A, Up = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: o } = e, { opts: a } = o, l = (0, Ki.allSchemaProperties)(r), i = l.filter((y) => (0, Gi.alwaysValidSchema)(o, r[y]));
    if (l.length === 0 || i.length === l.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const d = a.strictSchema && !a.allowMatchingProperties && s.properties, u = t.name("valid");
    o.props !== !0 && !(o.props instanceof _n.Name) && (o.props = (0, Hi.evaluatedPropsToName)(t, o.props));
    const { props: h } = o;
    E();
    function E() {
      for (const y of l)
        d && g(y), o.allErrors ? v(y) : (t.var(u, !0), v(y), t.if(u));
    }
    function g(y) {
      for (const $ in d)
        new RegExp(y).test($) && (0, Gi.checkStrictMode)(o, `property ${$} matches pattern ${y} (use allowMatchingProperties)`);
    }
    function v(y) {
      t.forIn("key", n, ($) => {
        t.if((0, _n._)`${(0, Ki.usePattern)(e, y)}.test(${$})`, () => {
          const m = i.includes(y);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: y,
            dataProp: $,
            dataPropType: Hi.Type.Str
          }, u), o.opts.unevaluated && h !== !0 ? t.assign((0, _n._)`${h}[${$}]`, !0) : !m && !o.allErrors && t.if((0, _n.not)(u), () => t.break());
        });
      });
    }
  }
};
Qo.default = Up;
var ea = {};
Object.defineProperty(ea, "__esModule", { value: !0 });
const zp = A, qp = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, zp.alwaysValidSchema)(n, r)) {
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
ea.default = qp;
var ta = {};
Object.defineProperty(ta, "__esModule", { value: !0 });
const Kp = re, Gp = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Kp.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
ta.default = Gp;
var ra = {};
Object.defineProperty(ra, "__esModule", { value: !0 });
const Mn = Y, Hp = A, Bp = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Mn._)`{passingSchemas: ${e.passing}}`
}, Wp = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Bp,
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
        (0, Hp.alwaysValidSchema)(s, u) ? t.var(i, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, i), h > 0 && t.if((0, Mn._)`${i} && ${a}`).assign(a, !1).assign(l, (0, Mn._)`[${l}, ${h}]`).else(), t.if(i, () => {
          t.assign(a, !0), t.assign(l, h), E && e.mergeEvaluated(E, Mn.Name);
        });
      });
    }
  }
};
ra.default = Wp;
var na = {};
Object.defineProperty(na, "__esModule", { value: !0 });
const Xp = A, Jp = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((o, a) => {
      if ((0, Xp.alwaysValidSchema)(n, o))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: a }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
na.default = Jp;
var sa = {};
Object.defineProperty(sa, "__esModule", { value: !0 });
const Jn = Y, Ql = A, xp = {
  message: ({ params: e }) => (0, Jn.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Jn._)`{failingKeyword: ${e.ifClause}}`
}, Yp = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: xp,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Ql.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Bi(n, "then"), o = Bi(n, "else");
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
function Bi(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Ql.alwaysValidSchema)(e, r);
}
sa.default = Yp;
var oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
const Zp = A, Qp = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Zp.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
oa.default = Qp;
Object.defineProperty(Wo, "__esModule", { value: !0 });
const e$ = Pr, t$ = Xo, r$ = Nr, n$ = Jo, s$ = xo, o$ = us, a$ = Yo, i$ = ds, c$ = Zo, l$ = Qo, u$ = ea, d$ = ta, f$ = ra, h$ = na, m$ = sa, p$ = oa;
function $$(e = !1) {
  const t = [
    // any
    u$.default,
    d$.default,
    f$.default,
    h$.default,
    m$.default,
    p$.default,
    // object
    a$.default,
    i$.default,
    o$.default,
    c$.default,
    l$.default
  ];
  return e ? t.push(t$.default, n$.default) : t.push(e$.default, r$.default), t.push(s$.default), t;
}
Wo.default = $$;
var aa = {}, Ir = {};
Object.defineProperty(Ir, "__esModule", { value: !0 });
Ir.dynamicAnchor = void 0;
const ks = Y, y$ = Fe, Wi = je, g$ = mt, _$ = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => eu(e, e.schema)
};
function eu(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, ks._)`${y$.default.dynamicAnchors}${(0, ks.getProperty)(t)}`, o = n.errSchemaPath === "#" ? n.validateName : v$(e);
  r.if((0, ks._)`!${s}`, () => r.assign(s, o));
}
Ir.dynamicAnchor = eu;
function v$(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: o, localRefs: a, meta: l } = t.root, { schemaId: i } = n.opts, d = new Wi.SchemaEnv({ schema: r, schemaId: i, root: s, baseId: o, localRefs: a, meta: l });
  return Wi.compileSchema.call(n, d), (0, g$.getValidate)(e, d);
}
Ir.default = _$;
var Rr = {};
Object.defineProperty(Rr, "__esModule", { value: !0 });
Rr.dynamicRef = void 0;
const Xi = Y, w$ = Fe, Ji = mt, E$ = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => tu(e, e.schema)
};
function tu(e, t) {
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
      const d = r.let("_v", (0, Xi._)`${w$.default.dynamicAnchors}${(0, Xi.getProperty)(o)}`);
      r.if(d, l(d, i), l(s.validateName, i));
    } else
      l(s.validateName, i)();
  }
  function l(i, d) {
    return d ? () => r.block(() => {
      (0, Ji.callRef)(e, i), r.let(d, !0);
    }) : () => (0, Ji.callRef)(e, i);
  }
}
Rr.dynamicRef = tu;
Rr.default = E$;
var ia = {};
Object.defineProperty(ia, "__esModule", { value: !0 });
const S$ = Ir, b$ = A, P$ = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, S$.dynamicAnchor)(e, "") : (0, b$.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
ia.default = P$;
var ca = {};
Object.defineProperty(ca, "__esModule", { value: !0 });
const N$ = Rr, I$ = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, N$.dynamicRef)(e, e.schema)
};
ca.default = I$;
Object.defineProperty(aa, "__esModule", { value: !0 });
const R$ = Ir, O$ = Rr, T$ = ia, j$ = ca, k$ = [R$.default, O$.default, T$.default, j$.default];
aa.default = k$;
var la = {}, ua = {};
Object.defineProperty(ua, "__esModule", { value: !0 });
const xi = us, A$ = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: xi.error,
  code: (e) => (0, xi.validatePropertyDeps)(e)
};
ua.default = A$;
var da = {};
Object.defineProperty(da, "__esModule", { value: !0 });
const C$ = us, D$ = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, C$.validateSchemaDeps)(e)
};
da.default = D$;
var fa = {};
Object.defineProperty(fa, "__esModule", { value: !0 });
const M$ = A, L$ = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, M$.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
fa.default = L$;
Object.defineProperty(la, "__esModule", { value: !0 });
const V$ = ua, F$ = da, U$ = fa, z$ = [V$.default, F$.default, U$.default];
la.default = z$;
var ha = {}, ma = {};
Object.defineProperty(ma, "__esModule", { value: !0 });
const St = Y, Yi = A, q$ = Fe, K$ = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, St._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, G$ = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: K$,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: o } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: a, props: l } = o;
    l instanceof St.Name ? t.if((0, St._)`${l} !== true`, () => t.forIn("key", n, (h) => t.if(d(l, h), () => i(h)))) : l !== !0 && t.forIn("key", n, (h) => l === void 0 ? i(h) : t.if(u(l, h), () => i(h))), o.props = !0, e.ok((0, St._)`${s} === ${q$.default.errors}`);
    function i(h) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: h }), e.error(), a || t.break();
        return;
      }
      if (!(0, Yi.alwaysValidSchema)(o, r)) {
        const E = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: Yi.Type.Str
        }, E), a || t.if((0, St.not)(E), () => t.break());
      }
    }
    function d(h, E) {
      return (0, St._)`!${h} || !${h}[${E}]`;
    }
    function u(h, E) {
      const g = [];
      for (const v in h)
        h[v] === !0 && g.push((0, St._)`${E} !== ${v}`);
      return (0, St.and)(...g);
    }
  }
};
ma.default = G$;
var pa = {};
Object.defineProperty(pa, "__esModule", { value: !0 });
const xt = Y, Zi = A, H$ = {
  message: ({ params: { len: e } }) => (0, xt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, xt._)`{limit: ${e}}`
}, B$ = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: H$,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, o = s.items || 0;
    if (o === !0)
      return;
    const a = t.const("len", (0, xt._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: o }), e.fail((0, xt._)`${a} > ${o}`);
    else if (typeof r == "object" && !(0, Zi.alwaysValidSchema)(s, r)) {
      const i = t.var("valid", (0, xt._)`${a} <= ${o}`);
      t.if((0, xt.not)(i), () => l(i, o)), e.ok(i);
    }
    s.items = !0;
    function l(i, d) {
      t.forRange("i", d, a, (u) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: u, dataPropType: Zi.Type.Num }, i), s.allErrors || t.if((0, xt.not)(i), () => t.break());
      });
    }
  }
};
pa.default = B$;
Object.defineProperty(ha, "__esModule", { value: !0 });
const W$ = ma, X$ = pa, J$ = [W$.default, X$.default];
ha.default = J$;
var $a = {}, ya = {};
Object.defineProperty(ya, "__esModule", { value: !0 });
const pe = Y, x$ = {
  message: ({ schemaCode: e }) => (0, pe.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, pe._)`{format: ${e}}`
}, Y$ = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: x$,
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
ya.default = Y$;
Object.defineProperty($a, "__esModule", { value: !0 });
const Z$ = ya, Q$ = [Z$.default];
$a.default = Q$;
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
Object.defineProperty(ko, "__esModule", { value: !0 });
const ey = Ao, ty = Do, ry = Wo, ny = aa, sy = la, oy = ha, ay = $a, Qi = vr, iy = [
  ny.default,
  ey.default,
  ty.default,
  (0, ry.default)(!0),
  ay.default,
  Qi.metadataVocabulary,
  Qi.contentVocabulary,
  sy.default,
  oy.default
];
ko.default = iy;
var ga = {}, fs = {};
Object.defineProperty(fs, "__esModule", { value: !0 });
fs.DiscrError = void 0;
var ec;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(ec || (fs.DiscrError = ec = {}));
Object.defineProperty(ga, "__esModule", { value: !0 });
const fr = Y, eo = fs, tc = je, cy = br, ly = A, uy = {
  message: ({ params: { discrError: e, tagName: t } }) => e === eo.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, fr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, dy = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: uy,
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
    t.if((0, fr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: eo.DiscrError.Tag, tag: d, tagName: l })), e.ok(i);
    function u() {
      const g = E();
      t.if(!1);
      for (const v in g)
        t.elseIf((0, fr._)`${d} === ${v}`), t.assign(i, h(g[v]));
      t.else(), e.error(!1, { discrError: eo.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(g) {
      const v = t.name("valid"), y = e.subschema({ keyword: "oneOf", schemaProp: g }, v);
      return e.mergeEvaluated(y, fr.Name), v;
    }
    function E() {
      var g;
      const v = {}, y = m(s);
      let $ = !0;
      for (let I = 0; I < a.length; I++) {
        let R = a[I];
        if (R != null && R.$ref && !(0, ly.schemaHasRulesButRef)(R, o.self.RULES)) {
          const W = R.$ref;
          if (R = tc.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, W), R instanceof tc.SchemaEnv && (R = R.schema), R === void 0)
            throw new cy.default(o.opts.uriResolver, o.baseId, W);
        }
        const L = (g = R == null ? void 0 : R.properties) === null || g === void 0 ? void 0 : g[l];
        if (typeof L != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        $ = $ && (y || m(R)), w(L, I);
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
ga.default = dy;
var _a = {};
const fy = "https://json-schema.org/draft/2020-12/schema", hy = "https://json-schema.org/draft/2020-12/schema", my = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, py = "meta", $y = "Core and Validation specifications meta-schema", yy = [
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
], gy = [
  "object",
  "boolean"
], _y = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", vy = {
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
}, wy = {
  $schema: fy,
  $id: hy,
  $vocabulary: my,
  $dynamicAnchor: py,
  title: $y,
  allOf: yy,
  type: gy,
  $comment: _y,
  properties: vy
}, Ey = "https://json-schema.org/draft/2020-12/schema", Sy = "https://json-schema.org/draft/2020-12/meta/applicator", by = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, Py = "meta", Ny = "Applicator vocabulary meta-schema", Iy = [
  "object",
  "boolean"
], Ry = {
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
}, Oy = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, Ty = {
  $schema: Ey,
  $id: Sy,
  $vocabulary: by,
  $dynamicAnchor: Py,
  title: Ny,
  type: Iy,
  properties: Ry,
  $defs: Oy
}, jy = "https://json-schema.org/draft/2020-12/schema", ky = "https://json-schema.org/draft/2020-12/meta/unevaluated", Ay = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, Cy = "meta", Dy = "Unevaluated applicator vocabulary meta-schema", My = [
  "object",
  "boolean"
], Ly = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, Vy = {
  $schema: jy,
  $id: ky,
  $vocabulary: Ay,
  $dynamicAnchor: Cy,
  title: Dy,
  type: My,
  properties: Ly
}, Fy = "https://json-schema.org/draft/2020-12/schema", Uy = "https://json-schema.org/draft/2020-12/meta/content", zy = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, qy = "meta", Ky = "Content vocabulary meta-schema", Gy = [
  "object",
  "boolean"
], Hy = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, By = {
  $schema: Fy,
  $id: Uy,
  $vocabulary: zy,
  $dynamicAnchor: qy,
  title: Ky,
  type: Gy,
  properties: Hy
}, Wy = "https://json-schema.org/draft/2020-12/schema", Xy = "https://json-schema.org/draft/2020-12/meta/core", Jy = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, xy = "meta", Yy = "Core vocabulary meta-schema", Zy = [
  "object",
  "boolean"
], Qy = {
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
}, eg = {
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
}, tg = {
  $schema: Wy,
  $id: Xy,
  $vocabulary: Jy,
  $dynamicAnchor: xy,
  title: Yy,
  type: Zy,
  properties: Qy,
  $defs: eg
}, rg = "https://json-schema.org/draft/2020-12/schema", ng = "https://json-schema.org/draft/2020-12/meta/format-annotation", sg = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, og = "meta", ag = "Format vocabulary meta-schema for annotation results", ig = [
  "object",
  "boolean"
], cg = {
  format: {
    type: "string"
  }
}, lg = {
  $schema: rg,
  $id: ng,
  $vocabulary: sg,
  $dynamicAnchor: og,
  title: ag,
  type: ig,
  properties: cg
}, ug = "https://json-schema.org/draft/2020-12/schema", dg = "https://json-schema.org/draft/2020-12/meta/meta-data", fg = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, hg = "meta", mg = "Meta-data vocabulary meta-schema", pg = [
  "object",
  "boolean"
], $g = {
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
}, yg = {
  $schema: ug,
  $id: dg,
  $vocabulary: fg,
  $dynamicAnchor: hg,
  title: mg,
  type: pg,
  properties: $g
}, gg = "https://json-schema.org/draft/2020-12/schema", _g = "https://json-schema.org/draft/2020-12/meta/validation", vg = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, wg = "meta", Eg = "Validation vocabulary meta-schema", Sg = [
  "object",
  "boolean"
], bg = {
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
}, Pg = {
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
}, Ng = {
  $schema: gg,
  $id: _g,
  $vocabulary: vg,
  $dynamicAnchor: wg,
  title: Eg,
  type: Sg,
  properties: bg,
  $defs: Pg
};
Object.defineProperty(_a, "__esModule", { value: !0 });
const Ig = wy, Rg = Ty, Og = Vy, Tg = By, jg = tg, kg = lg, Ag = yg, Cg = Ng, Dg = ["/properties"];
function Mg(e) {
  return [
    Ig,
    Rg,
    Og,
    Tg,
    jg,
    t(this, kg),
    Ag,
    t(this, Cg)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, Dg) : n;
  }
}
_a.default = Mg;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = ol, n = ko, s = ga, o = _a, a = "https://json-schema.org/draft/2020-12/schema";
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
  var u = an;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return u.default;
  } });
  var h = br;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(Ws, Ws.exports);
var Lg = Ws.exports, to = { exports: {} }, ru = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(F, B) {
    return { validate: F, compare: B };
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
    regex: ce,
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
    float: { type: "number", validate: ae },
    // C-type double
    double: { type: "number", validate: ae },
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
  function r(F) {
    return F % 4 === 0 && (F % 100 !== 0 || F % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function o(F) {
    const B = n.exec(F);
    if (!B)
      return !1;
    const x = +B[1], T = +B[2], k = +B[3];
    return T >= 1 && T <= 12 && k >= 1 && k <= (T === 2 && r(x) ? 29 : s[T]);
  }
  function a(F, B) {
    if (F && B)
      return F > B ? 1 : F < B ? -1 : 0;
  }
  const l = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function i(F) {
    return function(x) {
      const T = l.exec(x);
      if (!T)
        return !1;
      const k = +T[1], V = +T[2], C = +T[3], K = T[4], D = T[5] === "-" ? -1 : 1, N = +(T[6] || 0), p = +(T[7] || 0);
      if (N > 23 || p > 59 || F && !K)
        return !1;
      if (k <= 23 && V <= 59 && C < 60)
        return !0;
      const b = V - p * D, _ = k - N * D - (b < 0 ? 1 : 0);
      return (_ === 23 || _ === -1) && (b === 59 || b === -1) && C < 61;
    };
  }
  function d(F, B) {
    if (!(F && B))
      return;
    const x = (/* @__PURE__ */ new Date("2020-01-01T" + F)).valueOf(), T = (/* @__PURE__ */ new Date("2020-01-01T" + B)).valueOf();
    if (x && T)
      return x - T;
  }
  function u(F, B) {
    if (!(F && B))
      return;
    const x = l.exec(F), T = l.exec(B);
    if (x && T)
      return F = x[1] + x[2] + x[3], B = T[1] + T[2] + T[3], F > B ? 1 : F < B ? -1 : 0;
  }
  const h = /t|\s/i;
  function E(F) {
    const B = i(F);
    return function(T) {
      const k = T.split(h);
      return k.length === 2 && o(k[0]) && B(k[1]);
    };
  }
  function g(F, B) {
    if (!(F && B))
      return;
    const x = new Date(F).valueOf(), T = new Date(B).valueOf();
    if (x && T)
      return x - T;
  }
  function v(F, B) {
    if (!(F && B))
      return;
    const [x, T] = F.split(h), [k, V] = B.split(h), C = a(x, k);
    if (C !== void 0)
      return C || d(T, V);
  }
  const y = /\/|:/, $ = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(F) {
    return y.test(F) && $.test(F);
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
  function ae() {
    return !0;
  }
  const ie = /[^\\]\\Z/;
  function ce(F) {
    if (ie.test(F))
      return !1;
    try {
      return new RegExp(F), !0;
    } catch {
      return !1;
    }
  }
})(ru);
var nu = {}, ro = { exports: {} }, su = {}, xe = {}, wr = {}, ln = {}, te = {}, sn = {};
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
})(sn);
var no = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = sn;
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
})(no);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = sn, r = no;
  var n = sn;
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
  var s = no;
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
      return x(c, this.rhs);
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
      let O = S.length;
      for (; O--; ) {
        const j = S[O];
        j.optimizeNames(c, f) || (k(c, j.names), S.splice(O, 1));
      }
      return S.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((c, f) => B(c, f.names), {});
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
      return x(c, this.condition), this.else && B(c, this.else.names), c;
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
      return B(super.names, this.iteration.names);
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
      const c = x(super.names, this.from);
      return x(c, this.to);
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
      return B(super.names, this.iterable.names);
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
  class W extends g {
    render(c) {
      return "return " + super.render(c);
    }
  }
  W.kind = "return";
  class ae extends v {
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
      return this.catch && B(c, this.catch.names), this.finally && B(c, this.finally.names), c;
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
  class ce extends v {
    render(c) {
      return "finally" + super.render(c);
    }
  }
  ce.kind = "finally";
  class F {
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
      const O = new ae();
      if (this._blockNode(O), this.code(c), f) {
        const j = this.name("e");
        this._currNode = O.catch = new ie(j), f(j);
      }
      return S && (this._currNode = O.finally = new ce(), this.code(S)), this._endBlockNode(ie, ce);
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
  function B(_, c) {
    for (const f in c)
      _[f] = (_[f] || 0) + (c[f] || 0);
    return _;
  }
  function x(_, c) {
    return c instanceof t._CodeOrName ? B(_, c.names) : _;
  }
  function T(_, c, f) {
    if (_ instanceof t.Name)
      return S(_);
    if (!O(_))
      return _;
    return new t._Code(_._items.reduce((j, q) => (q instanceof t.Name && (q = S(q)), q instanceof t._Code ? j.push(...q._items) : j.push(q), j), []));
    function S(j) {
      const q = f[j.str];
      return q === void 0 || c[j.str] !== 1 ? j : (delete c[j.str], q);
    }
    function O(j) {
      return j instanceof t._Code && j._items.some((q) => q instanceof t.Name && c[q.str] === 1 && f[q.str] !== void 0);
    }
  }
  function k(_, c) {
    for (const f in c)
      _[f] = (_[f] || 0) - (c[f] || 0);
  }
  function V(_) {
    return typeof _ == "boolean" || typeof _ == "number" || _ === null ? !_ : (0, t._)`!${b(_)}`;
  }
  e.not = V;
  const C = p(e.operators.AND);
  function K(..._) {
    return _.reduce(C);
  }
  e.and = K;
  const D = p(e.operators.OR);
  function N(..._) {
    return _.reduce(D);
  }
  e.or = N;
  function p(_) {
    return (c, f) => c === t.nil ? f : f === t.nil ? c : (0, t._)`${b(c)} ${_} ${b(f)}`;
  }
  function b(_) {
    return _ instanceof t.Name ? _ : (0, t._)`(${_})`;
  }
})(te);
var M = {};
Object.defineProperty(M, "__esModule", { value: !0 });
M.checkStrictMode = M.getErrorPath = M.Type = M.useFunc = M.setEvaluated = M.evaluatedPropsToName = M.mergeEvaluated = M.eachItem = M.unescapeJsonPointer = M.escapeJsonPointer = M.escapeFragment = M.unescapeFragment = M.schemaRefOrVal = M.schemaHasRulesButRef = M.schemaHasRules = M.checkUnknownRules = M.alwaysValidSchema = M.toHash = void 0;
const ue = te, Vg = sn;
function Fg(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
M.toHash = Fg;
function Ug(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (ou(e, t), !au(t, e.self.RULES.all));
}
M.alwaysValidSchema = Ug;
function ou(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const o in t)
    s[o] || lu(e, `unknown keyword: "${o}"`);
}
M.checkUnknownRules = ou;
function au(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
M.schemaHasRules = au;
function zg(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
M.schemaHasRulesButRef = zg;
function qg({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ue._)`${r}`;
  }
  return (0, ue._)`${e}${t}${(0, ue.getProperty)(n)}`;
}
M.schemaRefOrVal = qg;
function Kg(e) {
  return iu(decodeURIComponent(e));
}
M.unescapeFragment = Kg;
function Gg(e) {
  return encodeURIComponent(va(e));
}
M.escapeFragment = Gg;
function va(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
M.escapeJsonPointer = va;
function iu(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
M.unescapeJsonPointer = iu;
function Hg(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
M.eachItem = Hg;
function rc({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, o, a, l) => {
    const i = a === void 0 ? o : a instanceof ue.Name ? (o instanceof ue.Name ? e(s, o, a) : t(s, o, a), a) : o instanceof ue.Name ? (t(s, a, o), o) : r(o, a);
    return l === ue.Name && !(i instanceof ue.Name) ? n(s, i) : i;
  };
}
M.mergeEvaluated = {
  props: rc({
    mergeNames: (e, t, r) => e.if((0, ue._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ue._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ue._)`${r} || {}`).code((0, ue._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ue._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ue._)`${r} || {}`), wa(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: cu
  }),
  items: rc({
    mergeNames: (e, t, r) => e.if((0, ue._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ue._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ue._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ue._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function cu(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ue._)`{}`);
  return t !== void 0 && wa(e, r, t), r;
}
M.evaluatedPropsToName = cu;
function wa(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ue._)`${t}${(0, ue.getProperty)(n)}`, !0));
}
M.setEvaluated = wa;
const nc = {};
function Bg(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: nc[t.code] || (nc[t.code] = new Vg._Code(t.code))
  });
}
M.useFunc = Bg;
var so;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(so || (M.Type = so = {}));
function Wg(e, t, r) {
  if (e instanceof ue.Name) {
    const n = t === so.Num;
    return r ? n ? (0, ue._)`"[" + ${e} + "]"` : (0, ue._)`"['" + ${e} + "']"` : n ? (0, ue._)`"/" + ${e}` : (0, ue._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ue.getProperty)(e).toString() : "/" + va(e);
}
M.getErrorPath = Wg;
function lu(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
M.checkStrictMode = lu;
var ot = {};
Object.defineProperty(ot, "__esModule", { value: !0 });
const Ne = te, Xg = {
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
ot.default = Xg;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = te, r = M, n = ot;
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: m }) => m ? (0, t.str)`"${$}" keyword must be ${m} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, m = e.keywordError, w, P) {
    const { it: I } = $, { gen: R, compositeRule: L, allErrors: W } = I, ae = h($, m, w);
    P ?? (L || W) ? i(R, ae) : d(I, (0, t._)`[${ae}]`);
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
    const { keyword: I, data: R, schemaValue: L, it: W } = $, { opts: ae, propertyName: ie, topSchemaRef: ce, schemaPath: F } = W;
    P.push([u.keyword, I], [u.params, typeof m == "function" ? m($) : m || (0, t._)`{}`]), ae.messages && P.push([u.message, typeof w == "function" ? w($) : w]), ae.verbose && P.push([u.schema, L], [u.parentSchema, (0, t._)`${ce}${F}`], [n.default.data, R]), ie && P.push([u.propertyName, ie]);
  }
})(ln);
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.boolOrEmptySchema = wr.topBoolOrEmptySchema = void 0;
const Jg = ln, xg = te, Yg = ot, Zg = {
  message: "boolean schema is false"
};
function Qg(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? uu(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Yg.default.data) : (t.assign((0, xg._)`${n}.errors`, null), t.return(!0));
}
wr.topBoolOrEmptySchema = Qg;
function e0(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), uu(e)) : r.var(t, !0);
}
wr.boolOrEmptySchema = e0;
function uu(e, t) {
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
  (0, Jg.reportError)(s, Zg, void 0, t);
}
var ge = {}, nr = {};
Object.defineProperty(nr, "__esModule", { value: !0 });
nr.getRules = nr.isJSONType = void 0;
const t0 = ["string", "number", "integer", "boolean", "null", "object", "array"], r0 = new Set(t0);
function n0(e) {
  return typeof e == "string" && r0.has(e);
}
nr.isJSONType = n0;
function s0() {
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
nr.getRules = s0;
var dt = {};
Object.defineProperty(dt, "__esModule", { value: !0 });
dt.shouldUseRule = dt.shouldUseGroup = dt.schemaHasRulesForType = void 0;
function o0({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && du(e, n);
}
dt.schemaHasRulesForType = o0;
function du(e, t) {
  return t.rules.some((r) => fu(e, r));
}
dt.shouldUseGroup = du;
function fu(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
dt.shouldUseRule = fu;
Object.defineProperty(ge, "__esModule", { value: !0 });
ge.reportTypeError = ge.checkDataTypes = ge.checkDataType = ge.coerceAndCheckDataType = ge.getJSONTypes = ge.getSchemaTypes = ge.DataType = void 0;
const a0 = nr, i0 = dt, c0 = ln, Q = te, hu = M;
var yr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(yr || (ge.DataType = yr = {}));
function l0(e) {
  const t = mu(e.type);
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
ge.getSchemaTypes = l0;
function mu(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(a0.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ge.getJSONTypes = mu;
function u0(e, t) {
  const { gen: r, data: n, opts: s } = e, o = d0(t, s.coerceTypes), a = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, i0.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const l = Ea(t, n, s.strictNumbers, yr.Wrong);
    r.if(l, () => {
      o.length ? f0(e, t, o) : Sa(e);
    });
  }
  return a;
}
ge.coerceAndCheckDataType = u0;
const pu = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function d0(e, t) {
  return t ? e.filter((r) => pu.has(r) || t === "array" && r === "array") : [];
}
function f0(e, t, r) {
  const { gen: n, data: s, opts: o } = e, a = n.let("dataType", (0, Q._)`typeof ${s}`), l = n.let("coerced", (0, Q._)`undefined`);
  o.coerceTypes === "array" && n.if((0, Q._)`${a} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, Q._)`${s}[0]`).assign(a, (0, Q._)`typeof ${s}`).if(Ea(t, s, o.strictNumbers), () => n.assign(l, s))), n.if((0, Q._)`${l} !== undefined`);
  for (const d of r)
    (pu.has(d) || d === "array" && o.coerceTypes === "array") && i(d);
  n.else(), Sa(e), n.endIf(), n.if((0, Q._)`${l} !== undefined`, () => {
    n.assign(s, l), h0(e, l);
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
function h0({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, Q._)`${t} !== undefined`, () => e.assign((0, Q._)`${t}[${r}]`, n));
}
function oo(e, t, r, n = yr.Correct) {
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
ge.checkDataType = oo;
function Ea(e, t, r, n) {
  if (e.length === 1)
    return oo(e[0], t, r, n);
  let s;
  const o = (0, hu.toHash)(e);
  if (o.array && o.object) {
    const a = (0, Q._)`typeof ${t} != "object"`;
    s = o.null ? a : (0, Q._)`!${t} || ${a}`, delete o.null, delete o.array, delete o.object;
  } else
    s = Q.nil;
  o.number && delete o.integer;
  for (const a in o)
    s = (0, Q.and)(s, oo(a, t, r, n));
  return s;
}
ge.checkDataTypes = Ea;
const m0 = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, Q._)`{type: ${e}}` : (0, Q._)`{type: ${t}}`
};
function Sa(e) {
  const t = p0(e);
  (0, c0.reportError)(t, m0);
}
ge.reportTypeError = Sa;
function p0(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, hu.schemaRefOrVal)(e, n, "type");
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
const ir = te, $0 = M;
function y0(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      sc(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, o) => sc(e, o, s.default));
}
hs.assignDefaults = y0;
function sc(e, t, r) {
  const { gen: n, compositeRule: s, data: o, opts: a } = e;
  if (r === void 0)
    return;
  const l = (0, ir._)`${o}${(0, ir.getProperty)(t)}`;
  if (s) {
    (0, $0.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let i = (0, ir._)`${l} === undefined`;
  a.useDefaults === "empty" && (i = (0, ir._)`${i} || ${l} === null || ${l} === ""`), n.if(i, (0, ir._)`${l} = ${(0, ir.stringify)(r)}`);
}
var st = {}, ne = {};
Object.defineProperty(ne, "__esModule", { value: !0 });
ne.validateUnion = ne.validateArray = ne.usePattern = ne.callValidateCode = ne.schemaProperties = ne.allSchemaProperties = ne.noPropertyInData = ne.propertyInData = ne.isOwnProperty = ne.hasPropFunc = ne.reportMissingProp = ne.checkMissingProp = ne.checkReportMissingProp = void 0;
const fe = te, ba = M, wt = ot, g0 = M;
function _0(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Na(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, fe._)`${t}` }, !0), e.error();
  });
}
ne.checkReportMissingProp = _0;
function v0({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, fe.or)(...n.map((o) => (0, fe.and)(Na(e, t, o, r.ownProperties), (0, fe._)`${s} = ${o}`)));
}
ne.checkMissingProp = v0;
function w0(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ne.reportMissingProp = w0;
function $u(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, fe._)`Object.prototype.hasOwnProperty`
  });
}
ne.hasPropFunc = $u;
function Pa(e, t, r) {
  return (0, fe._)`${$u(e)}.call(${t}, ${r})`;
}
ne.isOwnProperty = Pa;
function E0(e, t, r, n) {
  const s = (0, fe._)`${t}${(0, fe.getProperty)(r)} !== undefined`;
  return n ? (0, fe._)`${s} && ${Pa(e, t, r)}` : s;
}
ne.propertyInData = E0;
function Na(e, t, r, n) {
  const s = (0, fe._)`${t}${(0, fe.getProperty)(r)} === undefined`;
  return n ? (0, fe.or)(s, (0, fe.not)(Pa(e, t, r))) : s;
}
ne.noPropertyInData = Na;
function yu(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ne.allSchemaProperties = yu;
function S0(e, t) {
  return yu(t).filter((r) => !(0, ba.alwaysValidSchema)(e, t[r]));
}
ne.schemaProperties = S0;
function b0({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: o }, it: a }, l, i, d) {
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
ne.callValidateCode = b0;
const P0 = (0, fe._)`new RegExp`;
function N0({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, o = s(r, n);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, fe._)`${s.code === "new RegExp" ? P0 : (0, g0.useFunc)(e, s)}(${r}, ${n})`
  });
}
ne.usePattern = N0;
function I0(e) {
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
        dataPropType: ba.Type.Num
      }, o), t.if((0, fe.not)(o), l);
    });
  }
}
ne.validateArray = I0;
function R0(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((i) => (0, ba.alwaysValidSchema)(s, i)) && !s.opts.unevaluated)
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
ne.validateUnion = R0;
Object.defineProperty(st, "__esModule", { value: !0 });
st.validateKeywordUsage = st.validSchemaType = st.funcKeywordCode = st.macroKeywordCode = void 0;
const Te = te, Yt = ot, O0 = ne, T0 = ln;
function j0(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: o, it: a } = e, l = t.macro.call(a.self, s, o, a), i = gu(r, n, l);
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
st.macroKeywordCode = j0;
function k0(e, t) {
  var r;
  const { gen: n, keyword: s, schema: o, parentSchema: a, $data: l, it: i } = e;
  C0(i, t);
  const d = !l && t.compile ? t.compile.call(i.self, o, a, i) : t.validate, u = gu(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      y(), t.modifying && oc(e), $(() => e.error());
    else {
      const m = t.async ? g() : v();
      t.modifying && oc(e), $(() => A0(e, m));
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
    const w = i.opts.passContext ? Yt.default.this : Yt.default.self, P = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, Te._)`${m}${(0, O0.callValidateCode)(e, u, w, P)}`, t.modifying);
  }
  function $(m) {
    var w;
    n.if((0, Te.not)((w = t.valid) !== null && w !== void 0 ? w : h), m);
  }
}
st.funcKeywordCode = k0;
function oc(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Te._)`${n.parentData}[${n.parentDataProperty}]`));
}
function A0(e, t) {
  const { gen: r } = e;
  r.if((0, Te._)`Array.isArray(${t})`, () => {
    r.assign(Yt.default.vErrors, (0, Te._)`${Yt.default.vErrors} === null ? ${t} : ${Yt.default.vErrors}.concat(${t})`).assign(Yt.default.errors, (0, Te._)`${Yt.default.vErrors}.length`), (0, T0.extendErrors)(e);
  }, () => e.error());
}
function C0({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function gu(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Te.stringify)(r) });
}
function D0(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
st.validSchemaType = D0;
function M0({ schema: e, opts: t, self: r, errSchemaPath: n }, s, o) {
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
st.validateKeywordUsage = M0;
var Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
Tt.extendSubschemaMode = Tt.extendSubschemaData = Tt.getSubschema = void 0;
const tt = te, _u = M;
function L0(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: o, topSchemaRef: a }) {
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
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, _u.escapeFragment)(r)}`
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
Tt.getSubschema = L0;
function V0(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: o, propertyName: a }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, E = l.let("data", (0, tt._)`${t.data}${(0, tt.getProperty)(r)}`, !0);
    i(E), e.errorPath = (0, tt.str)`${d}${(0, _u.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, tt._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
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
Tt.extendSubschemaData = V0;
function F0(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: o }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Tt.extendSubschemaMode = F0;
var Se = {}, vu = { exports: {} }, Rt = vu.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Ln(t, n, s, e, "", e);
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
function Ln(e, t, r, n, s, o, a, l, i, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, o, a, l, i, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in Rt.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            Ln(e, t, r, h[E], s + "/" + u + "/" + E, o, s, u, n, E);
      } else if (u in Rt.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            Ln(e, t, r, h[g], s + "/" + u + "/" + U0(g), o, s, u, n, g);
      } else (u in Rt.keywords || e.allKeys && !(u in Rt.skipKeywords)) && Ln(e, t, r, h, s + "/" + u, o, s, u, n);
    }
    r(n, s, o, a, l, i, d);
  }
}
function U0(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var z0 = vu.exports;
Object.defineProperty(Se, "__esModule", { value: !0 });
Se.getSchemaRefs = Se.resolveUrl = Se.normalizeId = Se._getFullPath = Se.getFullPath = Se.inlineRef = void 0;
const q0 = M, K0 = as, G0 = z0, H0 = /* @__PURE__ */ new Set([
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
function B0(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !ao(e) : t ? wu(e) <= t : !1;
}
Se.inlineRef = B0;
const W0 = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function ao(e) {
  for (const t in e) {
    if (W0.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(ao) || typeof r == "object" && ao(r))
      return !0;
  }
  return !1;
}
function wu(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !H0.has(r) && (typeof e[r] == "object" && (0, q0.eachItem)(e[r], (n) => t += wu(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Eu(e, t = "", r) {
  r !== !1 && (t = gr(t));
  const n = e.parse(t);
  return Su(e, n);
}
Se.getFullPath = Eu;
function Su(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Se._getFullPath = Su;
const X0 = /#\/?$/;
function gr(e) {
  return e ? e.replace(X0, "") : "";
}
Se.normalizeId = gr;
function J0(e, t, r) {
  return r = gr(r), e.resolve(t, r);
}
Se.resolveUrl = J0;
const x0 = /^[a-z_][-a-z0-9._]*$/i;
function Y0(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = gr(e[r] || t), o = { "": s }, a = Eu(n, s, !1), l = {}, i = /* @__PURE__ */ new Set();
  return G0(e, { allKeys: !0 }, (h, E, g, v) => {
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
        if (!x0.test(P))
          throw new Error(`invalid anchor "${P}"`);
        m.call(this, `#${P}`);
      }
    }
  }), l;
  function d(h, E, g) {
    if (E !== void 0 && !K0(h, E))
      throw u(g);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Se.getSchemaRefs = Y0;
Object.defineProperty(xe, "__esModule", { value: !0 });
xe.getData = xe.KeywordCxt = xe.validateFunctionCode = void 0;
const bu = wr, ac = ge, Ia = dt, xn = ge, Z0 = hs, Zr = st, As = Tt, H = te, J = ot, Q0 = Se, ft = M, zr = ln;
function e_(e) {
  if (Iu(e) && (Ru(e), Nu(e))) {
    n_(e);
    return;
  }
  Pu(e, () => (0, bu.topBoolOrEmptySchema)(e));
}
xe.validateFunctionCode = e_;
function Pu({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, o) {
  s.code.es5 ? e.func(t, (0, H._)`${J.default.data}, ${J.default.valCxt}`, n.$async, () => {
    e.code((0, H._)`"use strict"; ${ic(r, s)}`), r_(e, s), e.code(o);
  }) : e.func(t, (0, H._)`${J.default.data}, ${t_(s)}`, n.$async, () => e.code(ic(r, s)).code(o));
}
function t_(e) {
  return (0, H._)`{${J.default.instancePath}="", ${J.default.parentData}, ${J.default.parentDataProperty}, ${J.default.rootData}=${J.default.data}${e.dynamicRef ? (0, H._)`, ${J.default.dynamicAnchors}={}` : H.nil}}={}`;
}
function r_(e, t) {
  e.if(J.default.valCxt, () => {
    e.var(J.default.instancePath, (0, H._)`${J.default.valCxt}.${J.default.instancePath}`), e.var(J.default.parentData, (0, H._)`${J.default.valCxt}.${J.default.parentData}`), e.var(J.default.parentDataProperty, (0, H._)`${J.default.valCxt}.${J.default.parentDataProperty}`), e.var(J.default.rootData, (0, H._)`${J.default.valCxt}.${J.default.rootData}`), t.dynamicRef && e.var(J.default.dynamicAnchors, (0, H._)`${J.default.valCxt}.${J.default.dynamicAnchors}`);
  }, () => {
    e.var(J.default.instancePath, (0, H._)`""`), e.var(J.default.parentData, (0, H._)`undefined`), e.var(J.default.parentDataProperty, (0, H._)`undefined`), e.var(J.default.rootData, J.default.data), t.dynamicRef && e.var(J.default.dynamicAnchors, (0, H._)`{}`);
  });
}
function n_(e) {
  const { schema: t, opts: r, gen: n } = e;
  Pu(e, () => {
    r.$comment && t.$comment && Tu(e), c_(e), n.let(J.default.vErrors, null), n.let(J.default.errors, 0), r.unevaluated && s_(e), Ou(e), d_(e);
  });
}
function s_(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, H._)`${r}.evaluated`), t.if((0, H._)`${e.evaluated}.dynamicProps`, () => t.assign((0, H._)`${e.evaluated}.props`, (0, H._)`undefined`)), t.if((0, H._)`${e.evaluated}.dynamicItems`, () => t.assign((0, H._)`${e.evaluated}.items`, (0, H._)`undefined`));
}
function ic(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, H._)`/*# sourceURL=${r} */` : H.nil;
}
function o_(e, t) {
  if (Iu(e) && (Ru(e), Nu(e))) {
    a_(e, t);
    return;
  }
  (0, bu.boolOrEmptySchema)(e, t);
}
function Nu({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Iu(e) {
  return typeof e.schema != "boolean";
}
function a_(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Tu(e), l_(e), u_(e);
  const o = n.const("_errs", J.default.errors);
  Ou(e, o), n.var(t, (0, H._)`${o} === ${J.default.errors}`);
}
function Ru(e) {
  (0, ft.checkUnknownRules)(e), i_(e);
}
function Ou(e, t) {
  if (e.opts.jtd)
    return cc(e, [], !1, t);
  const r = (0, ac.getSchemaTypes)(e.schema), n = (0, ac.coerceAndCheckDataType)(e, r);
  cc(e, r, !n, t);
}
function i_(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, ft.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function c_(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, ft.checkStrictMode)(e, "default is ignored in the schema root");
}
function l_(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, Q0.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function u_(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Tu({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const o = r.$comment;
  if (s.$comment === !0)
    e.code((0, H._)`${J.default.self}.logger.log(${o})`);
  else if (typeof s.$comment == "function") {
    const a = (0, H.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, H._)`${J.default.self}.opts.$comment(${o}, ${a}, ${l}.schema)`);
  }
}
function d_(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: o } = e;
  r.$async ? t.if((0, H._)`${J.default.errors} === 0`, () => t.return(J.default.data), () => t.throw((0, H._)`new ${s}(${J.default.vErrors})`)) : (t.assign((0, H._)`${n}.errors`, J.default.vErrors), o.unevaluated && f_(e), t.return((0, H._)`${J.default.errors} === 0`));
}
function f_({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof H.Name && e.assign((0, H._)`${t}.props`, r), n instanceof H.Name && e.assign((0, H._)`${t}.items`, n);
}
function cc(e, t, r, n) {
  const { gen: s, schema: o, data: a, allErrors: l, opts: i, self: d } = e, { RULES: u } = d;
  if (o.$ref && (i.ignoreKeywordsWithRef || !(0, ft.schemaHasRulesButRef)(o, u))) {
    s.block(() => Au(e, "$ref", u.all.$ref.definition));
    return;
  }
  i.jtd || h_(e, t), s.block(() => {
    for (const E of u.rules)
      h(E);
    h(u.post);
  });
  function h(E) {
    (0, Ia.shouldUseGroup)(o, E) && (E.type ? (s.if((0, xn.checkDataType)(E.type, a, i.strictNumbers)), lc(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, xn.reportTypeError)(e)), s.endIf()) : lc(e, E), l || s.if((0, H._)`${J.default.errors} === ${n || 0}`));
  }
}
function lc(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, Z0.assignDefaults)(e, t.type), r.block(() => {
    for (const o of t.rules)
      (0, Ia.shouldUseRule)(n, o) && Au(e, o.keyword, o.definition, t.type);
  });
}
function h_(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (m_(e, t), e.opts.allowUnionTypes || p_(e, t), $_(e, e.dataTypes));
}
function m_(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      ju(e.dataTypes, r) || Ra(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), g_(e, t);
  }
}
function p_(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Ra(e, "use allowUnionTypes to allow union type keyword");
}
function $_(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Ia.shouldUseRule)(e.schema, s)) {
      const { type: o } = s.definition;
      o.length && !o.some((a) => y_(t, a)) && Ra(e, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function y_(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function ju(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function g_(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    ju(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Ra(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, ft.checkStrictMode)(e, t, e.opts.strictTypes);
}
class ku {
  constructor(t, r, n) {
    if ((0, Zr.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, ft.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Cu(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Zr.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
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
    (t ? zr.reportExtraError : zr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, zr.reportError)(this, this.def.$dataError || zr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, zr.resetErrorsCount)(this.gen, this.errsCount);
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
        return (0, H._)`${(0, xn.checkDataTypes)(i, r, o.opts.strictNumbers, xn.DataType.Wrong)}`;
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
    const n = (0, As.getSubschema)(this.it, t);
    (0, As.extendSubschemaData)(n, this.it, t), (0, As.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return o_(s, r), s;
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
xe.KeywordCxt = ku;
function Au(e, t, r, n) {
  const s = new ku(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Zr.funcKeywordCode)(s, r) : "macro" in r ? (0, Zr.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Zr.funcKeywordCode)(s, r);
}
const __ = /^\/(?:[^~]|~0|~1)*$/, v_ = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Cu(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, o;
  if (e === "")
    return J.default.rootData;
  if (e[0] === "/") {
    if (!__.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, o = J.default.rootData;
  } else {
    const d = v_.exec(e);
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
xe.getData = Cu;
var un = {};
Object.defineProperty(un, "__esModule", { value: !0 });
class w_ extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
un.default = w_;
var Or = {};
Object.defineProperty(Or, "__esModule", { value: !0 });
const Cs = Se;
class E_ extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Cs.resolveUrl)(t, r, n), this.missingSchema = (0, Cs.normalizeId)((0, Cs.getFullPath)(t, this.missingRef));
  }
}
Or.default = E_;
var De = {};
Object.defineProperty(De, "__esModule", { value: !0 });
De.resolveSchema = De.getCompilingSchema = De.resolveRef = De.compileSchema = De.SchemaEnv = void 0;
const Ge = te, S_ = un, Bt = ot, Xe = Se, uc = M, b_ = xe;
class ms {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Xe.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
De.SchemaEnv = ms;
function Oa(e) {
  const t = Du.call(this, e);
  if (t)
    return t;
  const r = (0, Xe.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: o } = this.opts, a = new Ge.CodeGen(this.scope, { es5: n, lines: s, ownProperties: o });
  let l;
  e.$async && (l = a.scopeValue("Error", {
    ref: S_.default,
    code: (0, Ge._)`require("ajv/dist/runtime/validation_error").default`
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
    this._compilations.add(e), (0, b_.validateFunctionCode)(d), a.optimize(this.opts.code.optimize);
    const h = a.toString();
    u = `${a.scopeRefs(Bt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const g = new Function(`${Bt.default.self}`, `${Bt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(i, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: i, validateCode: h, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: v, items: y } = d;
      g.evaluated = {
        props: v instanceof Ge.Name ? void 0 : v,
        items: y instanceof Ge.Name ? void 0 : y,
        dynamicProps: v instanceof Ge.Name,
        dynamicItems: y instanceof Ge.Name
      }, g.source && (g.source.evaluated = (0, Ge.stringify)(g.evaluated));
    }
    return e.validate = g, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
De.compileSchema = Oa;
function P_(e, t, r) {
  var n;
  r = (0, Xe.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let o = R_.call(this, e, r);
  if (o === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    a && (o = new ms({ schema: a, schemaId: l, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[r] = N_.call(this, o);
}
De.resolveRef = P_;
function N_(e) {
  return (0, Xe.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Oa.call(this, e);
}
function Du(e) {
  for (const t of this._compilations)
    if (I_(t, e))
      return t;
}
De.getCompilingSchema = Du;
function I_(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function R_(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || ps.call(this, e, t);
}
function ps(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Xe._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Xe.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Ds.call(this, r, e);
  const o = (0, Xe.normalizeId)(n), a = this.refs[o] || this.schemas[o];
  if (typeof a == "string") {
    const l = ps.call(this, e, a);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : Ds.call(this, r, l);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || Oa.call(this, a), o === (0, Xe.normalizeId)(t)) {
      const { schema: l } = a, { schemaId: i } = this.opts, d = l[i];
      return d && (s = (0, Xe.resolveUrl)(this.opts.uriResolver, s, d)), new ms({ schema: l, schemaId: i, root: e, baseId: s });
    }
    return Ds.call(this, r, a);
  }
}
De.resolveSchema = ps;
const O_ = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Ds(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const i = r[(0, uc.unescapeFragment)(l)];
    if (i === void 0)
      return;
    r = i;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !O_.has(l) && d && (t = (0, Xe.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let o;
  if (typeof r != "boolean" && r.$ref && !(0, uc.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, Xe.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    o = ps.call(this, n, l);
  }
  const { schemaId: a } = this.opts;
  if (o = o || new ms({ schema: r, schemaId: a, root: n, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const T_ = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", j_ = "Meta-schema for $data reference (JSON AnySchema extension proposal)", k_ = "object", A_ = [
  "$data"
], C_ = {
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
}, D_ = !1, M_ = {
  $id: T_,
  description: j_,
  type: k_,
  required: A_,
  properties: C_,
  additionalProperties: D_
};
var Ta = {};
Object.defineProperty(Ta, "__esModule", { value: !0 });
const Mu = Hl;
Mu.code = 'require("ajv/dist/runtime/uri").default';
Ta.default = Mu;
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
  const n = un, s = Or, o = nr, a = De, l = te, i = Se, d = ge, u = M, h = M_, E = Ta, g = (N, p) => new RegExp(N, p);
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
    var p, b, _, c, f, S, O, j, q, U, se, Me, jt, kt, At, Ct, Dt, Mt, Lt, Vt, Ft, Ut, zt, qt, Kt;
    const qe = N.strict, Gt = (p = N.code) === null || p === void 0 ? void 0 : p.optimize, Ar = Gt === !0 || Gt === void 0 ? 1 : Gt || 0, Cr = (_ = (b = N.code) === null || b === void 0 ? void 0 : b.regExp) !== null && _ !== void 0 ? _ : g, bs = (c = N.uriResolver) !== null && c !== void 0 ? c : E.default;
    return {
      strictSchema: (S = (f = N.strictSchema) !== null && f !== void 0 ? f : qe) !== null && S !== void 0 ? S : !0,
      strictNumbers: (j = (O = N.strictNumbers) !== null && O !== void 0 ? O : qe) !== null && j !== void 0 ? j : !0,
      strictTypes: (U = (q = N.strictTypes) !== null && q !== void 0 ? q : qe) !== null && U !== void 0 ? U : "log",
      strictTuples: (Me = (se = N.strictTuples) !== null && se !== void 0 ? se : qe) !== null && Me !== void 0 ? Me : "log",
      strictRequired: (kt = (jt = N.strictRequired) !== null && jt !== void 0 ? jt : qe) !== null && kt !== void 0 ? kt : !1,
      code: N.code ? { ...N.code, optimize: Ar, regExp: Cr } : { optimize: Ar, regExp: Cr },
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
      int32range: (Kt = N.int32range) !== null && Kt !== void 0 ? Kt : !0,
      uriResolver: bs
    };
  }
  class I {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...P(p) };
      const { es5: b, lines: _ } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: y, es5: b, lines: _ }), this.logger = B(p.logger);
      const c = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, o.getRules)(), R.call(this, $, p, "NOT SUPPORTED"), R.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ce.call(this), p.formats && ae.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && ie.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), W.call(this), p.validateFormats = c;
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
      async function c(U, se) {
        await f.call(this, U.$schema);
        const Me = this._addSchema(U, se);
        return Me.validate || S.call(this, Me);
      }
      async function f(U) {
        U && !this.getSchema(U) && await c.call(this, { $ref: U }, !0);
      }
      async function S(U) {
        try {
          return this._compileSchemaEnv(U);
        } catch (se) {
          if (!(se instanceof s.default))
            throw se;
          return O.call(this, se), await j.call(this, se.missingSchema), S.call(this, U);
        }
      }
      function O({ missingSchema: U, missingRef: se }) {
        if (this.refs[U])
          throw new Error(`AnySchema ${U} is loaded but ${se} cannot be resolved`);
      }
      async function j(U) {
        const se = await q.call(this, U);
        this.refs[U] || await f.call(this, se.$schema), this.refs[U] || this.addSchema(se, U, b);
      }
      async function q(U) {
        const se = this._loading[U];
        if (se)
          return se;
        try {
          return await (this._loading[U] = _(U));
        } finally {
          delete this._loading[U];
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
      for (; typeof (b = L.call(this, p)) == "string"; )
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
          const b = L.call(this, p);
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
      if (T.call(this, _, b), !b)
        return (0, u.eachItem)(_, (f) => k.call(this, f)), this;
      C.call(this, b);
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
        for (const O of f)
          S = S[O];
        for (const O in _) {
          const j = _[O];
          if (typeof j != "object")
            continue;
          const { $data: q } = j.definition, U = S[O];
          q && U && (S[O] = D(U));
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
      _ = (0, i.normalizeId)(S || _);
      const q = i.getSchemaRefs.call(this, p, _);
      return j = new a.SchemaEnv({ schema: p, schemaId: O, meta: b, baseId: _, localRefs: q }), this._cache.set(j.schema, j), f && !_.startsWith("#") && (_ && this._checkUnique(_), this.refs[_] = j), c && this.validateSchema(p, !0), j;
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
  function ae() {
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
  function ce() {
    const N = { ...this.opts };
    for (const p of v)
      delete N[p];
    return N;
  }
  const F = { log() {
  }, warn() {
  }, error() {
  } };
  function B(N) {
    if (N === !1)
      return F;
    if (N === void 0)
      return console;
    if (N.log && N.warn && N.error)
      return N;
    throw new Error("logger must implement log, warn and error methods");
  }
  const x = /^[a-z_$][a-z0-9_$:-]*$/i;
  function T(N, p) {
    const { RULES: b } = this;
    if ((0, u.eachItem)(N, (_) => {
      if (b.keywords[_])
        throw new Error(`Keyword ${_} is already defined`);
      if (!x.test(_))
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
    const O = {
      keyword: N,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? V.call(this, S, O, p.before) : S.rules.push(O), f.all[N] = O, (_ = p.implements) === null || _ === void 0 || _.forEach((j) => this.addKeyword(j));
  }
  function V(N, p, b) {
    const _ = N.rules.findIndex((c) => c.keyword === b);
    _ >= 0 ? N.rules.splice(_, 0, p) : (N.rules.push(p), this.logger.warn(`rule ${b} is not defined`));
  }
  function C(N) {
    let { metaSchema: p } = N;
    p !== void 0 && (N.$data && this.opts.$data && (p = D(p)), N.validateSchema = this.compile(p, !0));
  }
  const K = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function D(N) {
    return { anyOf: [N, K] };
  }
})(su);
var ja = {}, ka = {}, Aa = {};
Object.defineProperty(Aa, "__esModule", { value: !0 });
const L_ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Aa.default = L_;
var sr = {};
Object.defineProperty(sr, "__esModule", { value: !0 });
sr.callRef = sr.getValidate = void 0;
const V_ = Or, dc = ne, Ce = te, cr = ot, fc = De, vn = M, F_ = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: o, validateName: a, opts: l, self: i } = n, { root: d } = o;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = fc.resolveRef.call(i, d, s, r);
    if (u === void 0)
      throw new V_.default(n.opts.uriResolver, s, r);
    if (u instanceof fc.SchemaEnv)
      return E(u);
    return g(u);
    function h() {
      if (o === d)
        return Vn(e, a, o, o.$async);
      const v = t.scopeValue("root", { ref: d });
      return Vn(e, (0, Ce._)`${v}.validate`, d, d.$async);
    }
    function E(v) {
      const y = Lu(e, v);
      Vn(e, y, v, v.$async);
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
function Lu(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ce._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
sr.getValidate = Lu;
function Vn(e, t, r, n) {
  const { gen: s, it: o } = e, { allErrors: a, schemaEnv: l, opts: i } = o, d = i.passContext ? cr.default.this : Ce.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, Ce._)`await ${(0, dc.callValidateCode)(e, t, d)}`), g(t), a || s.assign(v, !0);
    }, (y) => {
      s.if((0, Ce._)`!(${y} instanceof ${o.ValidationError})`, () => s.throw(y)), E(y), a || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, dc.callValidateCode)(e, t, d), () => g(t), () => E(t));
  }
  function E(v) {
    const y = (0, Ce._)`${v}.errors`;
    s.assign(cr.default.vErrors, (0, Ce._)`${cr.default.vErrors} === null ? ${y} : ${cr.default.vErrors}.concat(${y})`), s.assign(cr.default.errors, (0, Ce._)`${cr.default.vErrors}.length`);
  }
  function g(v) {
    var y;
    if (!o.opts.unevaluated)
      return;
    const $ = (y = r == null ? void 0 : r.validate) === null || y === void 0 ? void 0 : y.evaluated;
    if (o.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (o.props = vn.mergeEvaluated.props(s, $.props, o.props));
      else {
        const m = s.var("props", (0, Ce._)`${v}.evaluated.props`);
        o.props = vn.mergeEvaluated.props(s, m, o.props, Ce.Name);
      }
    if (o.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (o.items = vn.mergeEvaluated.items(s, $.items, o.items));
      else {
        const m = s.var("items", (0, Ce._)`${v}.evaluated.items`);
        o.items = vn.mergeEvaluated.items(s, m, o.items, Ce.Name);
      }
  }
}
sr.callRef = Vn;
sr.default = F_;
Object.defineProperty(ka, "__esModule", { value: !0 });
const U_ = Aa, z_ = sr, q_ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  U_.default,
  z_.default
];
ka.default = q_;
var Ca = {}, Da = {};
Object.defineProperty(Da, "__esModule", { value: !0 });
const Yn = te, Et = Yn.operators, Zn = {
  maximum: { okStr: "<=", ok: Et.LTE, fail: Et.GT },
  minimum: { okStr: ">=", ok: Et.GTE, fail: Et.LT },
  exclusiveMaximum: { okStr: "<", ok: Et.LT, fail: Et.GTE },
  exclusiveMinimum: { okStr: ">", ok: Et.GT, fail: Et.LTE }
}, K_ = {
  message: ({ keyword: e, schemaCode: t }) => (0, Yn.str)`must be ${Zn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Yn._)`{comparison: ${Zn[e].okStr}, limit: ${t}}`
}, G_ = {
  keyword: Object.keys(Zn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: K_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Yn._)`${r} ${Zn[t].fail} ${n} || isNaN(${r})`);
  }
};
Da.default = G_;
var Ma = {};
Object.defineProperty(Ma, "__esModule", { value: !0 });
const Qr = te, H_ = {
  message: ({ schemaCode: e }) => (0, Qr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Qr._)`{multipleOf: ${e}}`
}, B_ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: H_,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, o = s.opts.multipleOfPrecision, a = t.let("res"), l = o ? (0, Qr._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, Qr._)`${a} !== parseInt(${a})`;
    e.fail$data((0, Qr._)`(${n} === 0 || (${a} = ${r}/${n}, ${l}))`);
  }
};
Ma.default = B_;
var La = {}, Va = {};
Object.defineProperty(Va, "__esModule", { value: !0 });
function Vu(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Va.default = Vu;
Vu.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(La, "__esModule", { value: !0 });
const Zt = te, W_ = M, X_ = Va, J_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Zt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Zt._)`{limit: ${e}}`
}, x_ = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: J_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, o = t === "maxLength" ? Zt.operators.GT : Zt.operators.LT, a = s.opts.unicode === !1 ? (0, Zt._)`${r}.length` : (0, Zt._)`${(0, W_.useFunc)(e.gen, X_.default)}(${r})`;
    e.fail$data((0, Zt._)`${a} ${o} ${n}`);
  }
};
La.default = x_;
var Fa = {};
Object.defineProperty(Fa, "__esModule", { value: !0 });
const Y_ = ne, Qn = te, Z_ = {
  message: ({ schemaCode: e }) => (0, Qn.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Qn._)`{pattern: ${e}}`
}, Q_ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Z_,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: o } = e, a = o.opts.unicodeRegExp ? "u" : "", l = r ? (0, Qn._)`(new RegExp(${s}, ${a}))` : (0, Y_.usePattern)(e, n);
    e.fail$data((0, Qn._)`!${l}.test(${t})`);
  }
};
Fa.default = Q_;
var Ua = {};
Object.defineProperty(Ua, "__esModule", { value: !0 });
const en = te, ev = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, en.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, en._)`{limit: ${e}}`
}, tv = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: ev,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? en.operators.GT : en.operators.LT;
    e.fail$data((0, en._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Ua.default = tv;
var za = {};
Object.defineProperty(za, "__esModule", { value: !0 });
const qr = ne, tn = te, rv = M, nv = {
  message: ({ params: { missingProperty: e } }) => (0, tn.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, tn._)`{missingProperty: ${e}}`
}, sv = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: nv,
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
          (0, rv.checkStrictMode)(a, m, a.opts.strictRequired);
        }
    }
    function d() {
      if (i || o)
        e.block$data(tn.nil, h);
      else
        for (const g of r)
          (0, qr.checkReportMissingProp)(e, g);
    }
    function u() {
      const g = t.let("missing");
      if (i || o) {
        const v = t.let("valid", !0);
        e.block$data(v, () => E(g, v)), e.ok(v);
      } else
        t.if((0, qr.checkMissingProp)(e, r, g)), (0, qr.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, qr.noPropertyInData)(t, s, g, l.ownProperties), () => e.error());
      });
    }
    function E(g, v) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(v, (0, qr.propertyInData)(t, s, g, l.ownProperties)), t.if((0, tn.not)(v), () => {
          e.error(), t.break();
        });
      }, tn.nil);
    }
  }
};
za.default = sv;
var qa = {};
Object.defineProperty(qa, "__esModule", { value: !0 });
const rn = te, ov = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, rn.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, rn._)`{limit: ${e}}`
}, av = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: ov,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? rn.operators.GT : rn.operators.LT;
    e.fail$data((0, rn._)`${r}.length ${s} ${n}`);
  }
};
qa.default = av;
var Ka = {}, dn = {};
Object.defineProperty(dn, "__esModule", { value: !0 });
const Fu = as;
Fu.code = 'require("ajv/dist/runtime/equal").default';
dn.default = Fu;
Object.defineProperty(Ka, "__esModule", { value: !0 });
const Ms = ge, we = te, iv = M, cv = dn, lv = {
  message: ({ params: { i: e, j: t } }) => (0, we.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, we._)`{i: ${e}, j: ${t}}`
}, uv = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: lv,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: o, schemaCode: a, it: l } = e;
    if (!n && !s)
      return;
    const i = t.let("valid"), d = o.items ? (0, Ms.getSchemaTypes)(o.items) : [];
    e.block$data(i, u, (0, we._)`${a} === false`), e.ok(i);
    function u() {
      const v = t.let("i", (0, we._)`${r}.length`), y = t.let("j");
      e.setParams({ i: v, j: y }), t.assign(i, !0), t.if((0, we._)`${v} > 1`, () => (h() ? E : g)(v, y));
    }
    function h() {
      return d.length > 0 && !d.some((v) => v === "object" || v === "array");
    }
    function E(v, y) {
      const $ = t.name("item"), m = (0, Ms.checkDataTypes)(d, $, l.opts.strictNumbers, Ms.DataType.Wrong), w = t.const("indices", (0, we._)`{}`);
      t.for((0, we._)`;${v}--;`, () => {
        t.let($, (0, we._)`${r}[${v}]`), t.if(m, (0, we._)`continue`), d.length > 1 && t.if((0, we._)`typeof ${$} == "string"`, (0, we._)`${$} += "_"`), t.if((0, we._)`typeof ${w}[${$}] == "number"`, () => {
          t.assign(y, (0, we._)`${w}[${$}]`), e.error(), t.assign(i, !1).break();
        }).code((0, we._)`${w}[${$}] = ${v}`);
      });
    }
    function g(v, y) {
      const $ = (0, iv.useFunc)(t, cv.default), m = t.name("outer");
      t.label(m).for((0, we._)`;${v}--;`, () => t.for((0, we._)`${y} = ${v}; ${y}--;`, () => t.if((0, we._)`${$}(${r}[${v}], ${r}[${y}])`, () => {
        e.error(), t.assign(i, !1).break(m);
      })));
    }
  }
};
Ka.default = uv;
var Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
const io = te, dv = M, fv = dn, hv = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, io._)`{allowedValue: ${e}}`
}, mv = {
  keyword: "const",
  $data: !0,
  error: hv,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: o } = e;
    n || o && typeof o == "object" ? e.fail$data((0, io._)`!${(0, dv.useFunc)(t, fv.default)}(${r}, ${s})`) : e.fail((0, io._)`${o} !== ${r}`);
  }
};
Ga.default = mv;
var Ha = {};
Object.defineProperty(Ha, "__esModule", { value: !0 });
const Br = te, pv = M, $v = dn, yv = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Br._)`{allowedValues: ${e}}`
}, gv = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: yv,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= a.opts.loopEnum;
    let i;
    const d = () => i ?? (i = (0, pv.useFunc)(t, $v.default));
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
Ha.default = gv;
Object.defineProperty(Ca, "__esModule", { value: !0 });
const _v = Da, vv = Ma, wv = La, Ev = Fa, Sv = Ua, bv = za, Pv = qa, Nv = Ka, Iv = Ga, Rv = Ha, Ov = [
  // number
  _v.default,
  vv.default,
  // string
  wv.default,
  Ev.default,
  // object
  Sv.default,
  bv.default,
  // array
  Pv.default,
  Nv.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Iv.default,
  Rv.default
];
Ca.default = Ov;
var Ba = {}, Tr = {};
Object.defineProperty(Tr, "__esModule", { value: !0 });
Tr.validateAdditionalItems = void 0;
const Qt = te, co = M, Tv = {
  message: ({ params: { len: e } }) => (0, Qt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Qt._)`{limit: ${e}}`
}, jv = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Tv,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, co.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Uu(e, n);
  }
};
function Uu(e, t) {
  const { gen: r, schema: n, data: s, keyword: o, it: a } = e;
  a.items = !0;
  const l = r.const("len", (0, Qt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Qt._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, co.alwaysValidSchema)(a, n)) {
    const d = r.var("valid", (0, Qt._)`${l} <= ${t.length}`);
    r.if((0, Qt.not)(d), () => i(d)), e.ok(d);
  }
  function i(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: o, dataProp: u, dataPropType: co.Type.Num }, d), a.allErrors || r.if((0, Qt.not)(d), () => r.break());
    });
  }
}
Tr.validateAdditionalItems = Uu;
Tr.default = jv;
var Wa = {}, jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.validateTuple = void 0;
const hc = te, Fn = M, kv = ne, Av = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return zu(e, "additionalItems", t);
    r.items = !0, !(0, Fn.alwaysValidSchema)(r, t) && e.ok((0, kv.validateArray)(e));
  }
};
function zu(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: o, keyword: a, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = Fn.mergeEvaluated.items(n, r.length, l.items));
  const i = n.name("valid"), d = n.const("len", (0, hc._)`${o}.length`);
  r.forEach((h, E) => {
    (0, Fn.alwaysValidSchema)(l, h) || (n.if((0, hc._)`${d} > ${E}`, () => e.subschema({
      keyword: a,
      schemaProp: E,
      dataProp: E
    }, i)), e.ok(i));
  });
  function u(h) {
    const { opts: E, errSchemaPath: g } = l, v = r.length, y = v === h.minItems && (v === h.maxItems || h[t] === !1);
    if (E.strictTuples && !y) {
      const $ = `"${a}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, Fn.checkStrictMode)(l, $, E.strictTuples);
    }
  }
}
jr.validateTuple = zu;
jr.default = Av;
Object.defineProperty(Wa, "__esModule", { value: !0 });
const Cv = jr, Dv = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, Cv.validateTuple)(e, "items")
};
Wa.default = Dv;
var Xa = {};
Object.defineProperty(Xa, "__esModule", { value: !0 });
const mc = te, Mv = M, Lv = ne, Vv = Tr, Fv = {
  message: ({ params: { len: e } }) => (0, mc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, mc._)`{limit: ${e}}`
}, Uv = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Fv,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, Mv.alwaysValidSchema)(n, t) && (s ? (0, Vv.validateAdditionalItems)(e, s) : e.ok((0, Lv.validateArray)(e)));
  }
};
Xa.default = Uv;
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
const ze = te, wn = M, zv = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, ze.str)`must contain at least ${e} valid item(s)` : (0, ze.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, ze._)`{minContains: ${e}}` : (0, ze._)`{minContains: ${e}, maxContains: ${t}}`
}, qv = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: zv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    let a, l;
    const { minContains: i, maxContains: d } = n;
    o.opts.next ? (a = i === void 0 ? 1 : i, l = d) : a = 1;
    const u = t.const("len", (0, ze._)`${s}.length`);
    if (e.setParams({ min: a, max: l }), l === void 0 && a === 0) {
      (0, wn.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && a > l) {
      (0, wn.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, wn.alwaysValidSchema)(o, r)) {
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
          dataPropType: wn.Type.Num,
          compositeRule: !0
        }, y), $();
      });
    }
    function v(y) {
      t.code((0, ze._)`${y}++`), l === void 0 ? t.if((0, ze._)`${y} >= ${a}`, () => t.assign(h, !0).break()) : (t.if((0, ze._)`${y} > ${l}`, () => t.assign(h, !1).break()), a === 1 ? t.assign(h, !0) : t.if((0, ze._)`${y} >= ${a}`, () => t.assign(h, !0)));
    }
  }
};
Ja.default = qv;
var qu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = te, r = M, n = ne;
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
})(qu);
var xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
const Ku = te, Kv = M, Gv = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Ku._)`{propertyName: ${e.propertyName}}`
}, Hv = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Gv,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Kv.alwaysValidSchema)(s, r))
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
xa.default = Hv;
var $s = {};
Object.defineProperty($s, "__esModule", { value: !0 });
const En = ne, Be = te, Bv = ot, Sn = M, Wv = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Be._)`{additionalProperty: ${e.additionalProperty}}`
}, Xv = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Wv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: o, it: a } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: i } = a;
    if (a.props = !0, i.removeAdditional !== "all" && (0, Sn.alwaysValidSchema)(a, r))
      return;
    const d = (0, En.allSchemaProperties)(n.properties), u = (0, En.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Be._)`${o} === ${Bv.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !u.length ? v($) : t.if(E($), () => v($));
      });
    }
    function E($) {
      let m;
      if (d.length > 8) {
        const w = (0, Sn.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, En.isOwnProperty)(t, w, $);
      } else d.length ? m = (0, Be.or)(...d.map((w) => (0, Be._)`${$} === ${w}`)) : m = Be.nil;
      return u.length && (m = (0, Be.or)(m, ...u.map((w) => (0, Be._)`${(0, En.usePattern)(e, w)}.test(${$})`))), (0, Be.not)(m);
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
      if (typeof r == "object" && !(0, Sn.alwaysValidSchema)(a, r)) {
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
        dataPropType: Sn.Type.Str
      };
      w === !1 && Object.assign(P, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(P, m);
    }
  }
};
$s.default = Xv;
var Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
const Jv = xe, pc = ne, Ls = M, $c = $s, xv = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && $c.default.code(new Jv.KeywordCxt(o, $c.default, "additionalProperties"));
    const a = (0, pc.allSchemaProperties)(r);
    for (const h of a)
      o.definedProperties.add(h);
    o.opts.unevaluated && a.length && o.props !== !0 && (o.props = Ls.mergeEvaluated.props(t, (0, Ls.toHash)(a), o.props));
    const l = a.filter((h) => !(0, Ls.alwaysValidSchema)(o, r[h]));
    if (l.length === 0)
      return;
    const i = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, pc.propertyInData)(t, s, h, o.opts.ownProperties)), u(h), o.allErrors || t.else().var(i, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(i);
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
Ya.default = xv;
var Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
const yc = ne, bn = te, gc = M, _c = M, Yv = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: o } = e, { opts: a } = o, l = (0, yc.allSchemaProperties)(r), i = l.filter((y) => (0, gc.alwaysValidSchema)(o, r[y]));
    if (l.length === 0 || i.length === l.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const d = a.strictSchema && !a.allowMatchingProperties && s.properties, u = t.name("valid");
    o.props !== !0 && !(o.props instanceof bn.Name) && (o.props = (0, _c.evaluatedPropsToName)(t, o.props));
    const { props: h } = o;
    E();
    function E() {
      for (const y of l)
        d && g(y), o.allErrors ? v(y) : (t.var(u, !0), v(y), t.if(u));
    }
    function g(y) {
      for (const $ in d)
        new RegExp(y).test($) && (0, gc.checkStrictMode)(o, `property ${$} matches pattern ${y} (use allowMatchingProperties)`);
    }
    function v(y) {
      t.forIn("key", n, ($) => {
        t.if((0, bn._)`${(0, yc.usePattern)(e, y)}.test(${$})`, () => {
          const m = i.includes(y);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: y,
            dataProp: $,
            dataPropType: _c.Type.Str
          }, u), o.opts.unevaluated && h !== !0 ? t.assign((0, bn._)`${h}[${$}]`, !0) : !m && !o.allErrors && t.if((0, bn.not)(u), () => t.break());
        });
      });
    }
  }
};
Za.default = Yv;
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
const Zv = M, Qv = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Zv.alwaysValidSchema)(n, r)) {
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
Qa.default = Qv;
var ei = {};
Object.defineProperty(ei, "__esModule", { value: !0 });
const ew = ne, tw = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: ew.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
ei.default = tw;
var ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
const Un = te, rw = M, nw = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Un._)`{passingSchemas: ${e.passing}}`
}, sw = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: nw,
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
        (0, rw.alwaysValidSchema)(s, u) ? t.var(i, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, i), h > 0 && t.if((0, Un._)`${i} && ${a}`).assign(a, !1).assign(l, (0, Un._)`[${l}, ${h}]`).else(), t.if(i, () => {
          t.assign(a, !0), t.assign(l, h), E && e.mergeEvaluated(E, Un.Name);
        });
      });
    }
  }
};
ti.default = sw;
var ri = {};
Object.defineProperty(ri, "__esModule", { value: !0 });
const ow = M, aw = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((o, a) => {
      if ((0, ow.alwaysValidSchema)(n, o))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: a }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
ri.default = aw;
var ni = {};
Object.defineProperty(ni, "__esModule", { value: !0 });
const es = te, Gu = M, iw = {
  message: ({ params: e }) => (0, es.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, es._)`{failingKeyword: ${e.ifClause}}`
}, cw = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: iw,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Gu.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = vc(n, "then"), o = vc(n, "else");
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
function vc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Gu.alwaysValidSchema)(e, r);
}
ni.default = cw;
var si = {};
Object.defineProperty(si, "__esModule", { value: !0 });
const lw = M, uw = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, lw.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
si.default = uw;
Object.defineProperty(Ba, "__esModule", { value: !0 });
const dw = Tr, fw = Wa, hw = jr, mw = Xa, pw = Ja, $w = qu, yw = xa, gw = $s, _w = Ya, vw = Za, ww = Qa, Ew = ei, Sw = ti, bw = ri, Pw = ni, Nw = si;
function Iw(e = !1) {
  const t = [
    // any
    ww.default,
    Ew.default,
    Sw.default,
    bw.default,
    Pw.default,
    Nw.default,
    // object
    yw.default,
    gw.default,
    $w.default,
    _w.default,
    vw.default
  ];
  return e ? t.push(fw.default, mw.default) : t.push(dw.default, hw.default), t.push(pw.default), t;
}
Ba.default = Iw;
var oi = {}, ai = {};
Object.defineProperty(ai, "__esModule", { value: !0 });
const $e = te, Rw = {
  message: ({ schemaCode: e }) => (0, $e.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, $e._)`{format: ${e}}`
}, Ow = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Rw,
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
ai.default = Ow;
Object.defineProperty(oi, "__esModule", { value: !0 });
const Tw = ai, jw = [Tw.default];
oi.default = jw;
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
Object.defineProperty(ja, "__esModule", { value: !0 });
const kw = ka, Aw = Ca, Cw = Ba, Dw = oi, wc = Er, Mw = [
  kw.default,
  Aw.default,
  (0, Cw.default)(),
  Dw.default,
  wc.metadataVocabulary,
  wc.contentVocabulary
];
ja.default = Mw;
var ii = {}, ys = {};
Object.defineProperty(ys, "__esModule", { value: !0 });
ys.DiscrError = void 0;
var Ec;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Ec || (ys.DiscrError = Ec = {}));
Object.defineProperty(ii, "__esModule", { value: !0 });
const hr = te, lo = ys, Sc = De, Lw = Or, Vw = M, Fw = {
  message: ({ params: { discrError: e, tagName: t } }) => e === lo.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, hr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, Uw = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Fw,
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
    t.if((0, hr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: lo.DiscrError.Tag, tag: d, tagName: l })), e.ok(i);
    function u() {
      const g = E();
      t.if(!1);
      for (const v in g)
        t.elseIf((0, hr._)`${d} === ${v}`), t.assign(i, h(g[v]));
      t.else(), e.error(!1, { discrError: lo.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(g) {
      const v = t.name("valid"), y = e.subschema({ keyword: "oneOf", schemaProp: g }, v);
      return e.mergeEvaluated(y, hr.Name), v;
    }
    function E() {
      var g;
      const v = {}, y = m(s);
      let $ = !0;
      for (let I = 0; I < a.length; I++) {
        let R = a[I];
        if (R != null && R.$ref && !(0, Vw.schemaHasRulesButRef)(R, o.self.RULES)) {
          const W = R.$ref;
          if (R = Sc.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, W), R instanceof Sc.SchemaEnv && (R = R.schema), R === void 0)
            throw new Lw.default(o.opts.uriResolver, o.baseId, W);
        }
        const L = (g = R == null ? void 0 : R.properties) === null || g === void 0 ? void 0 : g[l];
        if (typeof L != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        $ = $ && (y || m(R)), w(L, I);
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
ii.default = Uw;
const zw = "http://json-schema.org/draft-07/schema#", qw = "http://json-schema.org/draft-07/schema#", Kw = "Core schema meta-schema", Gw = {
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
}, Hw = [
  "object",
  "boolean"
], Bw = {
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
}, Ww = {
  $schema: zw,
  $id: qw,
  title: Kw,
  definitions: Gw,
  type: Hw,
  properties: Bw,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = su, n = ja, s = ii, o = Ww, a = ["/properties"], l = "http://json-schema.org/draft-07/schema";
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
  var h = un;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var E = Or;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return E.default;
  } });
})(ro, ro.exports);
var Xw = ro.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = Xw, r = te, n = r.operators, s = {
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
})(nu);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = ru, n = nu, s = te, o = new s.Name("fullFormats"), a = new s.Name("fastFormats"), l = (d, u = { keywords: !0 }) => {
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
})(to, to.exports);
var Jw = to.exports;
const xw = /* @__PURE__ */ sl(Jw), Yw = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), o = Object.getOwnPropertyDescriptor(t, r);
  !Zw(s, o) && n || Object.defineProperty(e, r, o);
}, Zw = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, Qw = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, eE = (e, t) => `/* Wrapped ${e}*/
${t}`, tE = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), rE = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), nE = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = eE.bind(null, n, t.toString());
  Object.defineProperty(s, "name", rE);
  const { writable: o, enumerable: a, configurable: l } = tE;
  Object.defineProperty(e, "toString", { value: s, writable: o, enumerable: a, configurable: l });
};
function sE(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    Yw(e, t, s, r);
  return Qw(e, t), nE(e, t, n), e;
}
const bc = (e, t = {}) => {
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
  return sE(d, e), d.cancel = () => {
    a && (clearTimeout(a), a = void 0), l && (clearTimeout(l), l = void 0);
  }, d;
};
var uo = { exports: {} };
const oE = "2.0.0", Hu = 256, aE = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, iE = 16, cE = Hu - 6, lE = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var gs = {
  MAX_LENGTH: Hu,
  MAX_SAFE_COMPONENT_LENGTH: iE,
  MAX_SAFE_BUILD_LENGTH: cE,
  MAX_SAFE_INTEGER: aE,
  RELEASE_TYPES: lE,
  SEMVER_SPEC_VERSION: oE,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const uE = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var _s = uE;
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
})(uo, uo.exports);
var fn = uo.exports;
const dE = Object.freeze({ loose: !0 }), fE = Object.freeze({}), hE = (e) => e ? typeof e != "object" ? dE : e : fE;
var ci = hE;
const Pc = /^[0-9]+$/, Bu = (e, t) => {
  const r = Pc.test(e), n = Pc.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, mE = (e, t) => Bu(t, e);
var Wu = {
  compareIdentifiers: Bu,
  rcompareIdentifiers: mE
};
const Pn = _s, { MAX_LENGTH: Nc, MAX_SAFE_INTEGER: Nn } = gs, { safeRe: In, t: Rn } = fn, pE = ci, { compareIdentifiers: lr } = Wu;
let $E = class Qe {
  constructor(t, r) {
    if (r = pE(r), t instanceof Qe) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Nc)
      throw new TypeError(
        `version is longer than ${Nc} characters`
      );
    Pn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? In[Rn.LOOSE] : In[Rn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Nn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Nn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Nn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const o = +s;
        if (o >= 0 && o < Nn)
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
    if (Pn("SemVer.compare", this.version, this.options, t), !(t instanceof Qe)) {
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
      if (Pn("prerelease compare", r, n, s), n === void 0 && s === void 0)
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
      if (Pn("build compare", r, n, s), n === void 0 && s === void 0)
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
        const s = `-${r}`.match(this.options.loose ? In[Rn.PRERELEASELOOSE] : In[Rn.PRERELEASE]);
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
var ke = $E;
const Ic = ke, yE = (e, t, r = !1) => {
  if (e instanceof Ic)
    return e;
  try {
    return new Ic(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var kr = yE;
const gE = kr, _E = (e, t) => {
  const r = gE(e, t);
  return r ? r.version : null;
};
var vE = _E;
const wE = kr, EE = (e, t) => {
  const r = wE(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var SE = EE;
const Rc = ke, bE = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Rc(
      e instanceof Rc ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var PE = bE;
const Oc = kr, NE = (e, t) => {
  const r = Oc(e, null, !0), n = Oc(t, null, !0), s = r.compare(n);
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
var IE = NE;
const RE = ke, OE = (e, t) => new RE(e, t).major;
var TE = OE;
const jE = ke, kE = (e, t) => new jE(e, t).minor;
var AE = kE;
const CE = ke, DE = (e, t) => new CE(e, t).patch;
var ME = DE;
const LE = kr, VE = (e, t) => {
  const r = LE(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var FE = VE;
const Tc = ke, UE = (e, t, r) => new Tc(e, r).compare(new Tc(t, r));
var Ye = UE;
const zE = Ye, qE = (e, t, r) => zE(t, e, r);
var KE = qE;
const GE = Ye, HE = (e, t) => GE(e, t, !0);
var BE = HE;
const jc = ke, WE = (e, t, r) => {
  const n = new jc(e, r), s = new jc(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var li = WE;
const XE = li, JE = (e, t) => e.sort((r, n) => XE(r, n, t));
var xE = JE;
const YE = li, ZE = (e, t) => e.sort((r, n) => YE(n, r, t));
var QE = ZE;
const e1 = Ye, t1 = (e, t, r) => e1(e, t, r) > 0;
var vs = t1;
const r1 = Ye, n1 = (e, t, r) => r1(e, t, r) < 0;
var ui = n1;
const s1 = Ye, o1 = (e, t, r) => s1(e, t, r) === 0;
var Xu = o1;
const a1 = Ye, i1 = (e, t, r) => a1(e, t, r) !== 0;
var Ju = i1;
const c1 = Ye, l1 = (e, t, r) => c1(e, t, r) >= 0;
var di = l1;
const u1 = Ye, d1 = (e, t, r) => u1(e, t, r) <= 0;
var fi = d1;
const f1 = Xu, h1 = Ju, m1 = vs, p1 = di, $1 = ui, y1 = fi, g1 = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return f1(e, r, n);
    case "!=":
      return h1(e, r, n);
    case ">":
      return m1(e, r, n);
    case ">=":
      return p1(e, r, n);
    case "<":
      return $1(e, r, n);
    case "<=":
      return y1(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var xu = g1;
const _1 = ke, v1 = kr, { safeRe: On, t: Tn } = fn, w1 = (e, t) => {
  if (e instanceof _1)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? On[Tn.COERCEFULL] : On[Tn.COERCE]);
  else {
    const i = t.includePrerelease ? On[Tn.COERCERTLFULL] : On[Tn.COERCERTL];
    let d;
    for (; (d = i.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), i.lastIndex = d.index + d[1].length + d[2].length;
    i.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", o = r[4] || "0", a = t.includePrerelease && r[5] ? `-${r[5]}` : "", l = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return v1(`${n}.${s}.${o}${a}${l}`, t);
};
var E1 = w1;
class S1 {
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
var b1 = S1, Vs, kc;
function Ze() {
  if (kc) return Vs;
  kc = 1;
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
        if (this.set = this.set.filter((K) => !y(K[0])), this.set.length === 0)
          this.set = [C];
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
      const C = ((this.options.includePrerelease && g) | (this.options.loose && v)) + ":" + k, K = n.get(C);
      if (K)
        return K;
      const D = this.options.loose, N = D ? i[d.HYPHENRANGELOOSE] : i[d.HYPHENRANGE];
      k = k.replace(N, B(this.options.includePrerelease)), a("hyphen replace", k), k = k.replace(i[d.COMPARATORTRIM], u), a("comparator trim", k), k = k.replace(i[d.TILDETRIM], h), a("tilde trim", k), k = k.replace(i[d.CARETTRIM], E), a("caret trim", k);
      let p = k.split(" ").map((f) => w(f, this.options)).join(" ").split(/\s+/).map((f) => F(f, this.options));
      D && (p = p.filter((f) => (a("loose invalid filter", f, this.options), !!f.match(i[d.COMPARATORLOOSE])))), a("range list", p);
      const b = /* @__PURE__ */ new Map(), _ = p.map((f) => new o(f, this.options));
      for (const f of _) {
        if (y(f))
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
      return this.set.some((C) => m(C, V) && k.set.some((K) => m(K, V) && C.every((D) => K.every((N) => D.intersects(N, V)))));
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
        if (x(this.set[V], k, this.options))
          return !0;
      return !1;
    }
  }
  Vs = t;
  const r = b1, n = new r(), s = ci, o = ws(), a = _s, l = ke, {
    safeRe: i,
    t: d,
    comparatorTrimReplace: u,
    tildeTrimReplace: h,
    caretTrimReplace: E
  } = fn, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: v } = gs, y = (T) => T.value === "<0.0.0-0", $ = (T) => T.value === "", m = (T, k) => {
    let V = !0;
    const C = T.slice();
    let K = C.pop();
    for (; V && C.length; )
      V = C.every((D) => K.intersects(D, k)), K = C.pop();
    return V;
  }, w = (T, k) => (a("comp", T, k), T = L(T, k), a("caret", T), T = I(T, k), a("tildes", T), T = ae(T, k), a("xrange", T), T = ce(T, k), a("stars", T), T), P = (T) => !T || T.toLowerCase() === "x" || T === "*", I = (T, k) => T.trim().split(/\s+/).map((V) => R(V, k)).join(" "), R = (T, k) => {
    const V = k.loose ? i[d.TILDELOOSE] : i[d.TILDE];
    return T.replace(V, (C, K, D, N, p) => {
      a("tilde", T, C, K, D, N, p);
      let b;
      return P(K) ? b = "" : P(D) ? b = `>=${K}.0.0 <${+K + 1}.0.0-0` : P(N) ? b = `>=${K}.${D}.0 <${K}.${+D + 1}.0-0` : p ? (a("replaceTilde pr", p), b = `>=${K}.${D}.${N}-${p} <${K}.${+D + 1}.0-0`) : b = `>=${K}.${D}.${N} <${K}.${+D + 1}.0-0`, a("tilde return", b), b;
    });
  }, L = (T, k) => T.trim().split(/\s+/).map((V) => W(V, k)).join(" "), W = (T, k) => {
    a("caret", T, k);
    const V = k.loose ? i[d.CARETLOOSE] : i[d.CARET], C = k.includePrerelease ? "-0" : "";
    return T.replace(V, (K, D, N, p, b) => {
      a("caret", T, K, D, N, p, b);
      let _;
      return P(D) ? _ = "" : P(N) ? _ = `>=${D}.0.0${C} <${+D + 1}.0.0-0` : P(p) ? D === "0" ? _ = `>=${D}.${N}.0${C} <${D}.${+N + 1}.0-0` : _ = `>=${D}.${N}.0${C} <${+D + 1}.0.0-0` : b ? (a("replaceCaret pr", b), D === "0" ? N === "0" ? _ = `>=${D}.${N}.${p}-${b} <${D}.${N}.${+p + 1}-0` : _ = `>=${D}.${N}.${p}-${b} <${D}.${+N + 1}.0-0` : _ = `>=${D}.${N}.${p}-${b} <${+D + 1}.0.0-0`) : (a("no pr"), D === "0" ? N === "0" ? _ = `>=${D}.${N}.${p}${C} <${D}.${N}.${+p + 1}-0` : _ = `>=${D}.${N}.${p}${C} <${D}.${+N + 1}.0-0` : _ = `>=${D}.${N}.${p} <${+D + 1}.0.0-0`), a("caret return", _), _;
    });
  }, ae = (T, k) => (a("replaceXRanges", T, k), T.split(/\s+/).map((V) => ie(V, k)).join(" ")), ie = (T, k) => {
    T = T.trim();
    const V = k.loose ? i[d.XRANGELOOSE] : i[d.XRANGE];
    return T.replace(V, (C, K, D, N, p, b) => {
      a("xRange", T, C, K, D, N, p, b);
      const _ = P(D), c = _ || P(N), f = c || P(p), S = f;
      return K === "=" && S && (K = ""), b = k.includePrerelease ? "-0" : "", _ ? K === ">" || K === "<" ? C = "<0.0.0-0" : C = "*" : K && S ? (c && (N = 0), p = 0, K === ">" ? (K = ">=", c ? (D = +D + 1, N = 0, p = 0) : (N = +N + 1, p = 0)) : K === "<=" && (K = "<", c ? D = +D + 1 : N = +N + 1), K === "<" && (b = "-0"), C = `${K + D}.${N}.${p}${b}`) : c ? C = `>=${D}.0.0${b} <${+D + 1}.0.0-0` : f && (C = `>=${D}.${N}.0${b} <${D}.${+N + 1}.0-0`), a("xRange return", C), C;
    });
  }, ce = (T, k) => (a("replaceStars", T, k), T.trim().replace(i[d.STAR], "")), F = (T, k) => (a("replaceGTE0", T, k), T.trim().replace(i[k.includePrerelease ? d.GTE0PRE : d.GTE0], "")), B = (T) => (k, V, C, K, D, N, p, b, _, c, f, S) => (P(C) ? V = "" : P(K) ? V = `>=${C}.0.0${T ? "-0" : ""}` : P(D) ? V = `>=${C}.${K}.0${T ? "-0" : ""}` : N ? V = `>=${V}` : V = `>=${V}${T ? "-0" : ""}`, P(_) ? b = "" : P(c) ? b = `<${+_ + 1}.0.0-0` : P(f) ? b = `<${_}.${+c + 1}.0-0` : S ? b = `<=${_}.${c}.${f}-${S}` : T ? b = `<${_}.${c}.${+f + 1}-0` : b = `<=${b}`, `${V} ${b}`.trim()), x = (T, k, V) => {
    for (let C = 0; C < T.length; C++)
      if (!T[C].test(k))
        return !1;
    if (k.prerelease.length && !V.includePrerelease) {
      for (let C = 0; C < T.length; C++)
        if (a(T[C].semver), T[C].semver !== o.ANY && T[C].semver.prerelease.length > 0) {
          const K = T[C].semver;
          if (K.major === k.major && K.minor === k.minor && K.patch === k.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Vs;
}
var Fs, Ac;
function ws() {
  if (Ac) return Fs;
  Ac = 1;
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
  Fs = t;
  const r = ci, { safeRe: n, t: s } = fn, o = xu, a = _s, l = ke, i = Ze();
  return Fs;
}
const P1 = Ze(), N1 = (e, t, r) => {
  try {
    t = new P1(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Es = N1;
const I1 = Ze(), R1 = (e, t) => new I1(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var O1 = R1;
const T1 = ke, j1 = Ze(), k1 = (e, t, r) => {
  let n = null, s = null, o = null;
  try {
    o = new j1(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || s.compare(a) === -1) && (n = a, s = new T1(n, r));
  }), n;
};
var A1 = k1;
const C1 = ke, D1 = Ze(), M1 = (e, t, r) => {
  let n = null, s = null, o = null;
  try {
    o = new D1(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || s.compare(a) === 1) && (n = a, s = new C1(n, r));
  }), n;
};
var L1 = M1;
const Us = ke, V1 = Ze(), Cc = vs, F1 = (e, t) => {
  e = new V1(e, t);
  let r = new Us("0.0.0");
  if (e.test(r) || (r = new Us("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let o = null;
    s.forEach((a) => {
      const l = new Us(a.semver.version);
      switch (a.operator) {
        case ">":
          l.prerelease.length === 0 ? l.patch++ : l.prerelease.push(0), l.raw = l.format();
        case "":
        case ">=":
          (!o || Cc(l, o)) && (o = l);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!r || Cc(r, o)) && (r = o);
  }
  return r && e.test(r) ? r : null;
};
var U1 = F1;
const z1 = Ze(), q1 = (e, t) => {
  try {
    return new z1(e, t).range || "*";
  } catch {
    return null;
  }
};
var K1 = q1;
const G1 = ke, Yu = ws(), { ANY: H1 } = Yu, B1 = Ze(), W1 = Es, Dc = vs, Mc = ui, X1 = fi, J1 = di, x1 = (e, t, r, n) => {
  e = new G1(e, n), t = new B1(t, n);
  let s, o, a, l, i;
  switch (r) {
    case ">":
      s = Dc, o = X1, a = Mc, l = ">", i = ">=";
      break;
    case "<":
      s = Mc, o = J1, a = Dc, l = "<", i = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (W1(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const u = t.set[d];
    let h = null, E = null;
    if (u.forEach((g) => {
      g.semver === H1 && (g = new Yu(">=0.0.0")), h = h || g, E = E || g, s(g.semver, h.semver, n) ? h = g : a(g.semver, E.semver, n) && (E = g);
    }), h.operator === l || h.operator === i || (!E.operator || E.operator === l) && o(e, E.semver))
      return !1;
    if (E.operator === i && a(e, E.semver))
      return !1;
  }
  return !0;
};
var hi = x1;
const Y1 = hi, Z1 = (e, t, r) => Y1(e, t, ">", r);
var Q1 = Z1;
const eS = hi, tS = (e, t, r) => eS(e, t, "<", r);
var rS = tS;
const Lc = Ze(), nS = (e, t, r) => (e = new Lc(e, r), t = new Lc(t, r), e.intersects(t, r));
var sS = nS;
const oS = Es, aS = Ye;
var iS = (e, t, r) => {
  const n = [];
  let s = null, o = null;
  const a = e.sort((u, h) => aS(u, h, r));
  for (const u of a)
    oS(u, t, r) ? (o = u, s || (s = u)) : (o && n.push([s, o]), o = null, s = null);
  s && n.push([s, null]);
  const l = [];
  for (const [u, h] of n)
    u === h ? l.push(u) : !h && u === a[0] ? l.push("*") : h ? u === a[0] ? l.push(`<=${h}`) : l.push(`${u} - ${h}`) : l.push(`>=${u}`);
  const i = l.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return i.length < d.length ? i : t;
};
const Vc = Ze(), mi = ws(), { ANY: zs } = mi, Kr = Es, pi = Ye, cS = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Vc(e, r), t = new Vc(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const o of t.set) {
      const a = uS(s, o, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, lS = [new mi(">=0.0.0-0")], Fc = [new mi(">=0.0.0")], uS = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === zs) {
    if (t.length === 1 && t[0].semver === zs)
      return !0;
    r.includePrerelease ? e = lS : e = Fc;
  }
  if (t.length === 1 && t[0].semver === zs) {
    if (r.includePrerelease)
      return !0;
    t = Fc;
  }
  const n = /* @__PURE__ */ new Set();
  let s, o;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? s = Uc(s, g, r) : g.operator === "<" || g.operator === "<=" ? o = zc(o, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let a;
  if (s && o) {
    if (a = pi(s.semver, o.semver, r), a > 0)
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
        if (l = Uc(s, g, r), l === g && l !== s)
          return !1;
      } else if (s.operator === ">=" && !Kr(s.semver, String(g), r))
        return !1;
    }
    if (o) {
      if (h && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === h.major && g.semver.minor === h.minor && g.semver.patch === h.patch && (h = !1), g.operator === "<" || g.operator === "<=") {
        if (i = zc(o, g, r), i === g && i !== o)
          return !1;
      } else if (o.operator === "<=" && !Kr(o.semver, String(g), r))
        return !1;
    }
    if (!g.operator && (o || s) && a !== 0)
      return !1;
  }
  return !(s && d && !o && a !== 0 || o && u && !s && a !== 0 || E || h);
}, Uc = (e, t, r) => {
  if (!e)
    return t;
  const n = pi(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, zc = (e, t, r) => {
  if (!e)
    return t;
  const n = pi(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var dS = cS;
const qs = fn, qc = gs, fS = ke, Kc = Wu, hS = kr, mS = vE, pS = SE, $S = PE, yS = IE, gS = TE, _S = AE, vS = ME, wS = FE, ES = Ye, SS = KE, bS = BE, PS = li, NS = xE, IS = QE, RS = vs, OS = ui, TS = Xu, jS = Ju, kS = di, AS = fi, CS = xu, DS = E1, MS = ws(), LS = Ze(), VS = Es, FS = O1, US = A1, zS = L1, qS = U1, KS = K1, GS = hi, HS = Q1, BS = rS, WS = sS, XS = iS, JS = dS;
var xS = {
  parse: hS,
  valid: mS,
  clean: pS,
  inc: $S,
  diff: yS,
  major: gS,
  minor: _S,
  patch: vS,
  prerelease: wS,
  compare: ES,
  rcompare: SS,
  compareLoose: bS,
  compareBuild: PS,
  sort: NS,
  rsort: IS,
  gt: RS,
  lt: OS,
  eq: TS,
  neq: jS,
  gte: kS,
  lte: AS,
  cmp: CS,
  coerce: DS,
  Comparator: MS,
  Range: LS,
  satisfies: VS,
  toComparators: FS,
  maxSatisfying: US,
  minSatisfying: zS,
  minVersion: qS,
  validRange: KS,
  outside: GS,
  gtr: HS,
  ltr: BS,
  intersects: WS,
  simplifyRange: XS,
  subset: JS,
  SemVer: fS,
  re: qs.re,
  src: qs.src,
  tokens: qs.t,
  SEMVER_SPEC_VERSION: qc.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: qc.RELEASE_TYPES,
  compareIdentifiers: Kc.compareIdentifiers,
  rcompareIdentifiers: Kc.rcompareIdentifiers
};
const ur = /* @__PURE__ */ sl(xS), YS = Object.prototype.toString, ZS = "[object Uint8Array]", QS = "[object ArrayBuffer]";
function Zu(e, t, r) {
  return e ? e.constructor === t ? !0 : YS.call(e) === r : !1;
}
function Qu(e) {
  return Zu(e, Uint8Array, ZS);
}
function eb(e) {
  return Zu(e, ArrayBuffer, QS);
}
function tb(e) {
  return Qu(e) || eb(e);
}
function rb(e) {
  if (!Qu(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function nb(e) {
  if (!tb(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Gc(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, o) => s + o.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    rb(s), r.set(s, n), n += s.length;
  return r;
}
const jn = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Hc(e, t = "utf8") {
  return nb(e), jn[t] ?? (jn[t] = new globalThis.TextDecoder(t)), jn[t].decode(e);
}
function sb(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const ob = new globalThis.TextEncoder();
function Ks(e) {
  return sb(e), ob.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const ab = xw.default, Bc = "aes-256-cbc", dr = () => /* @__PURE__ */ Object.create(null), ib = (e) => e != null, cb = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, zn = "__internal__", Gs = `${zn}.migrations.version`;
var Nt, it, Ve, ct;
class lb {
  constructor(t = {}) {
    Dr(this, "path");
    Dr(this, "events");
    Mr(this, Nt);
    Mr(this, it);
    Mr(this, Ve);
    Mr(this, ct, {});
    Dr(this, "_deserialize", (t) => JSON.parse(t));
    Dr(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
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
      r.cwd = Td(r.projectName, { suffix: r.projectSuffix }).config;
    }
    if (Lr(this, Ve, r), r.schema ?? r.ajvOptions ?? r.rootSchema) {
      if (r.schema && typeof r.schema != "object")
        throw new TypeError("The `schema` option must be an object.");
      const a = new Lg.Ajv2020({
        allErrors: !0,
        useDefaults: !0,
        ...r.ajvOptions
      });
      ab(a);
      const l = {
        ...r.rootSchema,
        type: "object",
        properties: r.schema
      };
      Lr(this, Nt, a.compile(l));
      for (const [i, d] of Object.entries(r.schema ?? {}))
        d != null && d.default && (he(this, ct)[i] = d.default);
    }
    r.defaults && Lr(this, ct, {
      ...he(this, ct),
      ...r.defaults
    }), r.serialize && (this._serialize = r.serialize), r.deserialize && (this._deserialize = r.deserialize), this.events = new EventTarget(), Lr(this, it, r.encryptionKey);
    const n = r.fileExtension ? `.${r.fileExtension}` : "";
    this.path = z.resolve(r.cwd, `${r.configName ?? "config"}${n}`);
    const s = this.store, o = Object.assign(dr(), r.defaults, s);
    if (r.migrations) {
      if (!r.projectVersion)
        throw new Error("Please specify the `projectVersion` option.");
      this._migrate(r.migrations, r.projectVersion, r.beforeEachMigration);
    }
    this._validate(o);
    try {
      wd.deepEqual(s, o);
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
      throw new TypeError(`Please don't use the ${zn} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (o, a) => {
      cb(o, a), he(this, Ve).accessPropertiesByDotNotation ? vi(n, o, a) : n[o] = a;
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
    return he(this, Ve).accessPropertiesByDotNotation ? Nd(this.store, t) : t in this.store;
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      ib(he(this, ct)[r]) && this.set(r, he(this, ct)[r]);
  }
  delete(t) {
    const { store: r } = this;
    he(this, Ve).accessPropertiesByDotNotation ? Pd(r, t) : delete r[t], this.store = r;
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
      return typeof t == "string" ? t : Hc(t);
    try {
      const r = t.slice(0, 16), n = Vr.pbkdf2Sync(he(this, it), r.toString(), 1e4, 32, "sha512"), s = Vr.createDecipheriv(Bc, n, r), o = t.slice(17), a = typeof o == "string" ? Ks(o) : o;
      return Hc(Gc([s.update(a), s.final()]));
    } catch {
    }
    return t.toString();
  }
  _handleChange(t, r) {
    let n = t();
    const s = () => {
      const o = n, a = t();
      vd(a, o) || (n = a, r.call(this, a, o));
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
    ee.mkdirSync(z.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    if (he(this, it)) {
      const n = Vr.randomBytes(16), s = Vr.pbkdf2Sync(he(this, it), n.toString(), 1e4, 32, "sha512"), o = Vr.createCipheriv(Bc, s, n);
      r = Gc([n, Ks(":"), o.update(Ks(r)), o.final()]);
    }
    if (_e.env.SNAP)
      ee.writeFileSync(this.path, r, { mode: he(this, Ve).configFileMode });
    else
      try {
        nl(this.path, r, { mode: he(this, Ve).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          ee.writeFileSync(this.path, r, { mode: he(this, Ve).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    this._ensureDirectory(), ee.existsSync(this.path) || this._write(dr()), _e.platform === "win32" ? ee.watch(this.path, { persistent: !1 }, bc(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 100 })) : ee.watchFile(this.path, { persistent: !1 }, bc(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 5e3 }));
  }
  _migrate(t, r, n) {
    let s = this._get(Gs, "0.0.0");
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
        i == null || i(this), this._set(Gs, l), s = l, a = { ...this.store };
      } catch (i) {
        throw this.store = a, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${i}`);
      }
    (this._isVersionInRangeFormat(s) || !ur.eq(s, r)) && this._set(Gs, r);
  }
  _containsReservedKey(t) {
    return typeof t == "object" && Object.keys(t)[0] === zn ? !0 : typeof t != "string" ? !1 : he(this, Ve).accessPropertiesByDotNotation ? !!t.startsWith(`${zn}.`) : !1;
  }
  _isVersionInRangeFormat(t) {
    return ur.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && ur.satisfies(r, t) ? !1 : ur.satisfies(n, t) : !(ur.lte(t, r) || ur.gt(t, n));
  }
  _get(t, r) {
    return bd(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    vi(n, t, r), this.store = n;
  }
}
Nt = new WeakMap(), it = new WeakMap(), Ve = new WeakMap(), ct = new WeakMap();
const { app: qn, ipcMain: fo, shell: ub } = Zc;
let Wc = !1;
const Xc = () => {
  if (!fo || !qn)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: qn.getPath("userData"),
    appVersion: qn.getVersion()
  };
  return Wc || (fo.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), Wc = !0), e;
};
class db extends lb {
  constructor(t) {
    let r, n;
    if (_e.type === "renderer") {
      const s = Zc.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else fo && qn && ({ defaultCwd: r, appVersion: n } = Xc());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = z.isAbsolute(t.cwd) ? t.cwd : z.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    Xc();
  }
  async openInEditor() {
    const t = await ub.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const ed = 67324752, td = 33639248, rd = 101010256, fb = Object.prototype.hasOwnProperty;
function hb(e) {
  for (let t = e.length - 22; t >= 0; t--)
    if (e.readUInt32LE(t) === rd)
      return t;
  throw new Error("End of central directory not found");
}
function $i(e) {
  const t = hb(e), r = e.readUInt32LE(t + 12), n = e.readUInt32LE(t + 16), s = [], o = /* @__PURE__ */ new Map();
  let a = n, l = 0;
  for (; a < n + r; ) {
    if (e.readUInt32LE(a) !== td)
      throw new Error("Invalid central directory signature");
    const d = e.readUInt16LE(a + 4), u = e.readUInt16LE(a + 6), h = e.readUInt16LE(a + 8), E = e.readUInt16LE(a + 10), g = e.readUInt16LE(a + 12), v = e.readUInt16LE(a + 14), y = e.readUInt32LE(a + 16), $ = e.readUInt32LE(a + 20), m = e.readUInt32LE(a + 24), w = e.readUInt16LE(a + 28), P = e.readUInt16LE(a + 30), I = e.readUInt16LE(a + 32), R = e.readUInt16LE(a + 34), L = e.readUInt16LE(a + 36), W = e.readUInt32LE(a + 38), ae = e.readUInt32LE(a + 42), ie = a + 46, ce = ie + w, F = e.slice(ie, ce).toString("utf8"), B = ce, x = B + P, T = e.slice(B, x), k = x, V = k + I, C = e.slice(k, V);
    if (e.readUInt32LE(ae) !== ed)
      throw new Error(`Invalid local header signature for ${F}`);
    const D = e.readUInt16LE(ae + 26), N = e.readUInt16LE(ae + 28), p = ae + 30 + D + N, b = p + $, _ = e.slice(p, b), c = e.slice(
      ae + 30 + D,
      p
    ), f = {
      fileName: F,
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
      internalAttrs: L,
      externalAttrs: W,
      extraField: T,
      fileComment: C,
      localExtraField: c,
      compressedData: _,
      localHeaderOffset: ae,
      order: l
    };
    s.push(f), o.set(F, f), a = V, l += 1;
  }
  return { entries: s, entryMap: o };
}
function nd(e) {
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
function Sr(e) {
  if (e.compressionMethod === 0)
    return Buffer.from(e.compressedData);
  if (e.compressionMethod === 8)
    return el.inflateRawSync(e.compressedData);
  throw new Error(`Unsupported compression method: ${e.compressionMethod}`);
}
function sd(e, t) {
  if (t === 0)
    return e;
  if (t === 8)
    return el.deflateRawSync(e);
  throw new Error(`Unsupported compression method: ${t}`);
}
function ho(e) {
  return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}
function pb(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function od(e) {
  const t = [], r = /<si>([\s\S]*?)<\/si>/g;
  let n;
  for (; (n = r.exec(e)) !== null; ) {
    const s = n[1], o = /<t[^>]*>([\s\S]*?)<\/t>/g;
    let a = "", l;
    for (; (l = o.exec(s)) !== null; )
      a += ho(l[1]);
    t.push(a);
  }
  return t;
}
function ts(e) {
  const t = {}, r = /(\w+)=\"([^\"]*)\"/g;
  let n;
  for (; (n = r.exec(e)) !== null; )
    t[n[1]] = n[2];
  return t;
}
function Hs(e) {
  const t = Object.entries(e);
  return t.length === 0 ? "" : t.map(([r, n]) => `${r}="${n}"`).join(" ");
}
function ad(e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const n = e.charCodeAt(r);
    n >= 65 && n <= 90 ? t = t * 26 + (n - 64) : n >= 97 && n <= 122 && (t = t * 26 + (n - 96));
  }
  return t - 1;
}
function $b(e, t, r) {
  if (t === "s") {
    const s = e.match(/<v>([\s\S]*?)<\/v>/);
    if (!s) return "";
    const o = Number.parseInt(s[1], 10);
    return Number.isNaN(o) ? "" : r[o] ?? "";
  }
  if (t === "inlineStr") {
    const s = e.match(/<t[^>]*>([\s\S]*?)<\/t>/);
    return s ? ho(s[1]) : "";
  }
  const n = e.match(/<v>([\s\S]*?)<\/v>/);
  return n ? ho(n[1]) : "";
}
function id(e) {
  return e == null ? !1 : typeof e == "string" ? e.trim().length > 0 : !0;
}
function yb(e, t, r) {
  const n = /* @__PURE__ */ new Map(), s = [];
  let o = 0;
  for (; ; ) {
    const i = e.indexOf("<c", o);
    if (i === -1) break;
    const d = e.indexOf(">", i);
    if (d === -1) break;
    let u = e.slice(i + 2, d), h = !1;
    u.endsWith("/") && (h = !0, u = u.slice(0, -1));
    const E = ts(u), g = E.r;
    let v = "", y = d + 1;
    if (!h) {
      const $ = e.indexOf("</c>", d);
      if ($ === -1) break;
      v = e.slice(d + 1, $), y = $ + 4;
    }
    if (g) {
      const $ = /^([A-Z]+)(\d+)$/.exec(g);
      if ($) {
        const m = $[1], w = parseInt($[2], 10), P = ad(m);
        if (P === 0) {
          const I = v.match(/<v>([\s\S]*?)<\/v>/);
          if (I) {
            const R = Number.parseInt(I[1], 10), L = t[R];
            L && n.set(w, L);
          }
        } else if (P === 1) {
          const R = n.get(w) ?? (w === 1 ? "SFC" : void 0);
          if (R && fb.call(r, R)) {
            const L = r[R], W = { ...E }, ae = Hs(W);
            let ie;
            if (!id(L))
              ie = `<c${ae ? ` ${ae}` : ""}/>`;
            else {
              const ce = `${L}`, F = Number(ce);
              if (ce.trim().length > 0 && !Number.isNaN(F)) {
                delete W.t;
                const x = Hs(W);
                ie = `<c${x ? ` ${x}` : ""}><v>${ce}</v></c>`;
              } else {
                W.t = "inlineStr";
                const x = Hs(W);
                ie = `<c${x ? ` ${x}` : ""}><is><t>${pb(ce)}</t></is></c>`;
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
function cd(e) {
  const t = [...e.entries].sort(
    (i, d) => i.localHeaderOffset - d.localHeaderOffset
  ), r = [];
  let n = 0;
  for (const i of t) {
    const d = Buffer.from(i.fileName, "utf8"), u = Buffer.alloc(30);
    u.writeUInt32LE(ed, 0), u.writeUInt16LE(i.versionNeeded, 4), u.writeUInt16LE(i.generalPurpose, 6), u.writeUInt16LE(i.compressionMethod, 8), u.writeUInt16LE(i.lastModTime, 10), u.writeUInt16LE(i.lastModDate, 12), u.writeUInt32LE(i.crc32, 14), u.writeUInt32LE(i.compressedSize, 18), u.writeUInt32LE(i.uncompressedSize, 22), u.writeUInt16LE(d.length, 26), u.writeUInt16LE(i.localExtraField.length, 28), r.push(
      u,
      d,
      i.localExtraField,
      i.compressedData
    ), i.newLocalHeaderOffset = n, n += u.length + d.length + i.localExtraField.length + i.compressedData.length;
  }
  const s = n, o = [];
  for (const i of t) {
    const d = Buffer.from(i.fileName, "utf8"), u = Buffer.alloc(46);
    u.writeUInt32LE(td, 0), u.writeUInt16LE(i.versionMadeBy, 4), u.writeUInt16LE(i.versionNeeded, 6), u.writeUInt16LE(i.generalPurpose, 8), u.writeUInt16LE(i.compressionMethod, 10), u.writeUInt16LE(i.lastModTime, 12), u.writeUInt16LE(i.lastModDate, 14), u.writeUInt32LE(i.crc32, 16), u.writeUInt32LE(i.compressedSize, 20), u.writeUInt32LE(i.uncompressedSize, 24), u.writeUInt16LE(d.length, 28), u.writeUInt16LE(i.extraField.length, 30), u.writeUInt16LE(i.fileComment.length, 32), u.writeUInt16LE(i.diskNumberStart, 34), u.writeUInt16LE(i.internalAttrs, 36), u.writeUInt32LE(i.externalAttrs, 38), u.writeUInt32LE(i.newLocalHeaderOffset ?? 0, 42), o.push(
      u,
      d,
      i.extraField,
      i.fileComment
    ), n += u.length + d.length + i.extraField.length + i.fileComment.length;
  }
  const a = n - s, l = Buffer.alloc(22);
  return l.writeUInt32LE(rd, 0), l.writeUInt16LE(0, 4), l.writeUInt16LE(0, 6), l.writeUInt16LE(t.length, 8), l.writeUInt16LE(t.length, 10), l.writeUInt32LE(a, 12), l.writeUInt32LE(s, 16), l.writeUInt16LE(0, 20), Buffer.concat([...r, ...o, l]);
}
function gb(e, t) {
  const r = {};
  t && (r.SFC = t);
  for (const [n, s] of Object.entries(e))
    id(s) && (r[n] = s);
  return r;
}
function _b(e, t, r) {
  if (!oe.existsSync(e))
    throw new Error(`Workbook not found: ${e}`);
  const n = oe.readFileSync(e), s = $i(n), o = s.entryMap.get("xl/worksheets/sheet1.xml"), a = s.entryMap.get("xl/sharedStrings.xml");
  if (!o || !a)
    throw new Error("Workbook is missing required worksheet or shared strings");
  const l = Sr(a).toString("utf8"), i = od(l), d = Sr(o).toString("utf8"), u = gb(t, r), h = yb(
    d,
    i,
    u
  );
  if (h === d)
    return;
  const E = Buffer.from(h, "utf8"), g = sd(E, o.compressionMethod);
  o.compressedData = g, o.compressedSize = g.length, o.uncompressedSize = E.length, o.crc32 = nd(E);
  const v = cd(s), y = `${e}.tmp`;
  oe.writeFileSync(y, v), oe.renameSync(y, e);
}
function vb(e, t = "xl/worksheets/sheet1.xml") {
  if (!oe.existsSync(e))
    throw new Error(`Workbook not found: ${e}`);
  const r = oe.readFileSync(e), n = $i(r), s = n.entryMap.get(t);
  if (!s)
    throw new Error(`Worksheet not found: ${t}`);
  const o = n.entryMap.get("xl/sharedStrings.xml"), a = o ? od(Sr(o).toString("utf8")) : [], l = Sr(s).toString("utf8"), i = [], d = /<row[^>]*>([\s\S]*?)<\/row>/g;
  let u;
  for (; (u = d.exec(l)) !== null; ) {
    const h = u[1], E = [];
    let g = -1;
    const v = /<c([^>]*)>([\s\S]*?)<\/c>/g;
    let y;
    for (; (y = v.exec(h)) !== null; ) {
      const $ = y[1], m = y[2], w = ts($), P = w.r;
      let I = -1;
      if (P) {
        const L = P.replace(/\d+/g, "");
        I = ad(L);
      } else
        I = E.length;
      if (I < 0)
        continue;
      const R = $b(m, w.t, a);
      E[I] = R, I > g && (g = I);
    }
    if (g >= 0)
      for (let $ = 0; $ <= g; $ += 1)
        E[$] === void 0 && (E[$] = "");
    i.push(E);
  }
  return i;
}
function wb(e) {
  const t = Gn.join(e, "Input_Total.xlsx");
  if (!oe.existsSync(t)) {
    const r = Gn.join(e, "Input_Plant.xlsx");
    if (!oe.existsSync(r))
      throw new Error("No template available to create Input_Total.xlsx");
    oe.copyFileSync(r, t);
  }
  return t;
}
function Jc(e, t) {
  const r = Buffer.from(t, "utf8"), n = sd(r, e.compressionMethod);
  e.compressedData = n, e.compressedSize = n.length, e.uncompressedSize = r.length, e.crc32 = nd(r);
}
function Eb(e, t) {
  const r = e.entryMap.get("xl/workbook.xml");
  if (!r)
    return;
  const n = Sr(r).toString("utf8"), s = new RegExp(
    `<sheet[^>]*name="${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*/>`,
    "i"
  ), o = n.match(s);
  if (!o)
    return;
  const a = o[0], l = a.replace(/^<sheet\s*/i, "").replace(/\s*\/?\>$/i, "").trim(), d = ts(l)["r:id"];
  let u = n.replace(a, "");
  u = u.replace(/\n\s*\n+/g, `
`), Jc(r, u);
  let h = null;
  if (d) {
    const E = e.entryMap.get("xl/_rels/workbook.xml.rels");
    if (E) {
      const g = Sr(E).toString("utf8"), v = new RegExp(
        `<Relationship[^>]*Id="${d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*/>`,
        "i"
      ), y = g.match(v);
      if (y) {
        const $ = y[0].replace(/^<Relationship\s*/i, "").replace(/\s*\/?\>$/i, "").trim(), m = ts($);
        h = m.Target ? m.Target.replace(/^\//, "") : null;
        const w = g.replace(y[0], "");
        Jc(E, w);
      }
    }
  }
  if (h) {
    let E = h.replace(/\\/g, "/");
    E.startsWith("xl/") || (E = Gn.posix.join("xl", E)), E = Gn.posix.normalize(E), e.entryMap.delete(E);
    const g = e.entries.findIndex(
      (v) => v.fileName === E
    );
    g >= 0 && e.entries.splice(g, 1);
  }
}
function Sb(e, t, r = "Meta") {
  if (!oe.existsSync(e))
    throw new Error(`Workbook not found: ${e}`);
  const n = oe.readFileSync(e), s = $i(n);
  Eb(s, r);
  const o = cd(s), a = `${t}.tmp`;
  oe.writeFileSync(a, o), oe.renameSync(a, t);
}
gd(import.meta.url);
const Ss = z.dirname(_d(import.meta.url));
process.env.APP_ROOT = z.join(Ss, "..");
const mo = process.env.VITE_DEV_SERVER_URL, Yb = z.join(process.env.APP_ROOT, "dist-electron"), Kn = z.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = mo ? z.join(process.env.APP_ROOT, "public") : Kn;
function bb() {
  return er.isPackaged ? z.join(process.resourcesPath, "third-party") : z.join(Ss, "..", "third-party");
}
function hn() {
  return er.isPackaged ? z.join(process.resourcesPath, "output") : z.join(Ss, "..", "output");
}
function xc(e) {
  oe.existsSync(e) || oe.mkdirSync(e, { recursive: !0 });
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
function ud(e, t) {
  const r = (o) => {
    if (!o) return null;
    const a = z.join(e, o);
    return oe.existsSync(a) && oe.statSync(a).isDirectory() ? { dir: a, date: o } : null;
  }, n = ld(t), s = r(n);
  if (s)
    return s;
  try {
    const a = oe.readdirSync(e, { withFileTypes: !0 }).filter((l) => l.isDirectory() && /^\d{8}$/.test(l.name)).map((l) => l.name).sort().at(-1) ?? null;
    return a ? { dir: z.join(e, a), date: a } : null;
  } catch (o) {
    return console.error("Failed to resolve output directory", e, o), null;
  }
}
function Nb(e, t) {
  return new Promise((r, n) => {
    var o, a;
    const s = Ed(e, {
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
function dd(e, t, r) {
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
function Ib(e) {
  const r = oe.readFileSync(e, "utf-8").split(/\r?\n/).filter((a) => a.trim().length > 0);
  if (r.length === 0)
    return [];
  const n = rs(r[0]), s = n.findIndex(
    (a) => a.toLowerCase() === "time"
  );
  if (s === -1)
    return console.warn("Output CSV missing Time column"), [];
  const o = [];
  for (let a = 1; a < r.length; a += 1) {
    const l = rs(r[a]), i = dd(l, n, s);
    i && o.push(i);
  }
  return o;
}
function Rb(e) {
  try {
    const t = vb(e);
    if (t.length === 0)
      return [];
    const r = t[0].map((o) => o.trim()), n = r.findIndex(
      (o) => o.toLowerCase() === "time"
    );
    if (n === -1)
      return console.warn("Workbook missing Time column"), [];
    const s = [];
    for (let o = 1; o < t.length; o += 1) {
      const a = t[o], l = dd(a, r, n);
      l && s.push(l);
    }
    return s;
  } catch (t) {
    return console.error("Failed to read simulation workbook", e, t), [];
  }
}
function fd(e) {
  const t = z.join(e, "Output_Total.xlsx");
  if (oe.existsSync(t)) {
    const n = Rb(t);
    if (n.length > 0)
      return n;
  }
  const r = z.join(e, "Output_Total.csv");
  return oe.existsSync(r) ? Ib(r) : [];
}
const Ob = /* @__PURE__ */ new Set([
  "-1.#IND",
  "-1.#QNAN",
  "NAN",
  "INF",
  "+INF",
  "-INF"
]);
function hd(e) {
  if (!e) return null;
  const t = e.replace(/,/g, "").trim();
  if (!t || Ob.has(t.toUpperCase()))
    return null;
  const r = Number.parseFloat(t);
  return Number.isFinite(r) ? r : null;
}
function Bs(e) {
  if (!oe.existsSync(e))
    return [];
  const r = oe.readFileSync(e, "utf-8").split(/\r?\n/).filter((o) => o.trim().length > 0);
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
    const s = hd(n);
    if (s !== null) {
      t[r] = s;
      continue;
    }
    const o = n.trim();
    t[r] = o.length > 0 ? o : null;
  }
  return t;
}
function Tb(e) {
  const t = z.join(e, "Output_EE2.csv"), r = z.join(e, "Output_EE3.csv"), n = z.join(e, "Output_EE1.csv"), s = {}, o = Bs(t);
  for (const i of o) {
    const d = Object.entries(i);
    if (d.length === 0) continue;
    const [u, h] = d[0], E = (i.Variable ?? i[u] ?? "").trim();
    if (!E) continue;
    let g = "";
    "Value" in i ? g = i.Value ?? "" : d.length > 1 && (g = d[1][1]);
    const v = hd(g);
    s[E] = v !== null ? v : g.trim() || null;
  }
  const a = Bs(r).map(Yc), l = Bs(n).map(Yc);
  return { report: s, cashflow: a, coefficients: l };
}
pt.handle("run-exe", async (e, t) => {
  const r = bb(), n = z.join(r, "MHySIM_HRS_Run.exe");
  if (!oe.existsSync(n)) {
    const v = `실행 파일을 찾을 수 없습니다:
` + n + `

패키징 시 extraResources에 third-party를 포함했는지 확인하세요.`;
    throw console.error("[run-exe] " + v), yd.showErrorBox("Executable missing", v), new Error(v);
  }
  const s = Pb(), o = hn();
  xc(o);
  const a = z.join(o, s);
  xc(a);
  const l = a, i = (t == null ? void 0 : t.skipExe) ?? !1, d = s, u = oe.readdirSync(l).filter((v) => /^Output_\d+\.csv$/i.test(v));
  for (const v of u) {
    const y = z.extname(v), $ = z.basename(v, y);
    let m = 1, w = `${$}-${m}${y}`;
    for (; oe.existsSync(z.join(l, w)); )
      m++, w = `${$}-${m}${y}`;
    oe.renameSync(
      z.join(l, v),
      z.join(l, w)
    ), console.log(`📁 백업됨: ${v} → ${w}`);
  }
  try {
    const v = (t == null ? void 0 : t.values) ?? {}, y = (t == null ? void 0 : t.sfc) ?? null;
    if (Object.keys(v).length > 0 || y) {
      const m = wb(r);
      _b(m, v, y);
      try {
        const w = z.join(l, "Input_Total.xlsx");
        Sb(m, w, "Meta"), console.log("📄 Input_Total.xlsx copied to", w);
      } catch (w) {
        console.error("⚠️ Failed to copy Input_Total workbook", w);
      }
    }
  } catch (v) {
    throw console.error("❌ Excel 업데이트 실패:", v), v;
  }
  try {
    const v = z.join(l, "MHySIM.log");
    oe.existsSync(v) && oe.writeFileSync(v, "");
  } catch (v) {
    console.warn("⚠️ 진행 로그 초기화 실패", v);
  }
  let h;
  if (i)
    h = "EXE skipped by user toggle", console.info("[run-exe] Execution skipped by user toggle");
  else if (process.platform === "win32")
    try {
      await Nb(n, l), h = "EXE completed successfully";
    } catch (v) {
      throw console.error("❌ EXE 실행 실패:", v), v;
    }
  else
    h = `EXE execution skipped: unsupported platform (${process.platform})`, console.warn(
      `run-exe called on unsupported platform (${process.platform}); executable skipped.`
    );
  const E = fd(l);
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
    const r = hn(), n = ud(r, (t == null ? void 0 : t.date) ?? null);
    if (!n)
      return { frames: [], date: null };
    try {
      return { frames: fd(n.dir).sort(
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
    const r = hn(), n = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, ""), o = ld((t == null ? void 0 : t.date) ?? null) ?? n, a = z.join(r, o), l = z.join(a, "MHySIM.log");
    if (!oe.existsSync(l))
      return {
        date: o,
        exists: !1,
        raw: "",
        updatedAt: null
      };
    try {
      const i = oe.readFileSync(l, "utf-8"), d = oe.statSync(l);
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
function jb(e) {
  const t = e.getFullYear(), r = `${e.getMonth() + 1}`.padStart(2, "0"), n = `${e.getDate()}`.padStart(2, "0");
  return `${t}-${r}-${n}`;
}
pt.handle("read-recent-logs", async () => {
  const e = hn(), t = [], r = /* @__PURE__ */ new Date();
  for (let n = 0; n < 5; n += 1) {
    const s = new Date(r);
    s.setDate(r.getDate() - n);
    const o = jb(s), a = o.replace(/-/g, ""), l = z.join(e, a, "MHySIM.jsonl");
    let i = [];
    if (oe.existsSync(l))
      try {
        i = oe.readFileSync(l, "utf-8").split(/\r?\n/).map((u) => u.trim()).filter(Boolean).map((u) => {
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
    const r = hn(), n = ud(r, (t == null ? void 0 : t.date) ?? null);
    if (!n)
      return {
        date: null,
        report: {},
        cashflow: [],
        coefficients: []
      };
    try {
      const s = Tb(n.dir);
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
const yi = new db();
pt.handle("electron-store-get", (e, t) => yi.get(t));
pt.handle("electron-store-set", (e, t, r) => {
  yi.set(t, r);
});
pt.handle("electron-store-delete", (e, t) => {
  yi.delete(t);
});
pt.on("save-project-backup", (e, t, r) => {
  const n = z.join(er.getPath("userData"), `${r}.json`);
  try {
    oe.writeFileSync(n, JSON.stringify(t, null, 2), "utf-8"), console.log("✅ 프로젝트 백업 저장 완료:", n);
  } catch (s) {
    console.error("❌ 프로젝트 백업 저장 실패:", s);
  }
});
let bt;
function md() {
  bt = new Qc({
    icon: z.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: z.join(Ss, "preload.mjs")
    }
  }), bt.webContents.on("did-finish-load", () => {
    bt == null || bt.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), mo ? bt.loadURL(mo) : (console.log("RENDERER_DIST:", Kn), console.log("index.html path:", z.join(Kn, "index.html")), bt.loadFile(z.join(Kn, "index.html")));
}
er.on("window-all-closed", () => {
  process.platform !== "darwin" && (er.quit(), bt = null);
});
er.on("activate", () => {
  Qc.getAllWindows().length === 0 && md();
});
er.whenReady().then(md);
export {
  Yb as MAIN_DIST,
  Kn as RENDERER_DIST,
  mo as VITE_DEV_SERVER_URL
};
