var $u = Object.defineProperty;
var Wo = (e) => {
  throw TypeError(e);
};
var yu = (e, t, r) => t in e ? $u(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Sr = (e, t, r) => yu(e, typeof t != "symbol" ? t + "" : t, r), Yo = (e, t, r) => t.has(e) || Wo("Cannot " + r);
var me = (e, t, r) => (Yo(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Pr = (e, t, r) => t.has(e) ? Wo("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Nr = (e, t, r, n) => (Yo(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
import Rc, { ipcMain as Fn, app as Hr, BrowserWindow as Oc } from "electron";
import { createRequire as _u } from "node:module";
import { fileURLToPath as gu } from "node:url";
import ae from "node:path";
import vu from "fs";
import be from "node:process";
import { promisify as je, isDeepStrictEqual as wu } from "node:util";
import ne from "node:fs";
import Rr from "node:crypto";
import Eu from "node:assert";
import zn from "node:os";
const Xt = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, is = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), bu = new Set("0123456789");
function Un(e) {
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
        if (is.has(r))
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
          if (is.has(r))
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
        if (n === "index" && !bu.has(a))
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        n === "start" && (n = "property"), s && (s = !1, r += "\\"), r += a;
      }
    }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (is.has(r))
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
function Xs(e, t) {
  if (typeof t != "number" && Array.isArray(e)) {
    const r = Number.parseInt(t, 10);
    return Number.isInteger(r) && e[r] === e[t];
  }
  return !1;
}
function Ic(e, t) {
  if (Xs(e, t))
    throw new Error("Cannot use string index");
}
function Su(e, t, r) {
  if (!Xt(e) || typeof t != "string")
    return r === void 0 ? e : r;
  const n = Un(t);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const a = n[s];
    if (Xs(e, a) ? e = s === n.length - 1 ? void 0 : null : e = e[a], e == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function Qo(e, t, r) {
  if (!Xt(e) || typeof t != "string")
    return e;
  const n = e, s = Un(t);
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    Ic(e, o), a === s.length - 1 ? e[o] = r : Xt(e[o]) || (e[o] = typeof s[a + 1] == "number" ? [] : {}), e = e[o];
  }
  return n;
}
function Pu(e, t) {
  if (!Xt(e) || typeof t != "string")
    return !1;
  const r = Un(t);
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (Ic(e, s), n === r.length - 1)
      return delete e[s], !0;
    if (e = e[s], !Xt(e))
      return !1;
  }
}
function Nu(e, t) {
  if (!Xt(e) || typeof t != "string")
    return !1;
  const r = Un(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!Xt(e) || !(n in e) || Xs(e, n))
      return !1;
    e = e[n];
  }
  return !0;
}
const Tt = zn.homedir(), Bs = zn.tmpdir(), { env: ar } = be, Ru = (e) => {
  const t = ae.join(Tt, "Library");
  return {
    data: ae.join(t, "Application Support", e),
    config: ae.join(t, "Preferences", e),
    cache: ae.join(t, "Caches", e),
    log: ae.join(t, "Logs", e),
    temp: ae.join(Bs, e)
  };
}, Ou = (e) => {
  const t = ar.APPDATA || ae.join(Tt, "AppData", "Roaming"), r = ar.LOCALAPPDATA || ae.join(Tt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: ae.join(r, e, "Data"),
    config: ae.join(t, e, "Config"),
    cache: ae.join(r, e, "Cache"),
    log: ae.join(r, e, "Log"),
    temp: ae.join(Bs, e)
  };
}, Iu = (e) => {
  const t = ae.basename(Tt);
  return {
    data: ae.join(ar.XDG_DATA_HOME || ae.join(Tt, ".local", "share"), e),
    config: ae.join(ar.XDG_CONFIG_HOME || ae.join(Tt, ".config"), e),
    cache: ae.join(ar.XDG_CACHE_HOME || ae.join(Tt, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: ae.join(ar.XDG_STATE_HOME || ae.join(Tt, ".local", "state"), e),
    temp: ae.join(Bs, t, e)
  };
};
function Tu(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), be.platform === "darwin" ? Ru(e) : be.platform === "win32" ? Ou(e) : Iu(e);
}
const wt = (e, t) => function(...n) {
  return e.apply(void 0, n).catch(t);
}, dt = (e, t) => function(...n) {
  try {
    return e.apply(void 0, n);
  } catch (s) {
    return t(s);
  }
}, ju = be.getuid ? !be.getuid() : !1, ku = 1e4, Ge = () => {
}, pe = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!pe.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !ju && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!pe.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!pe.isNodeError(e))
      throw e;
    if (!pe.isChangeErrorOk(e))
      throw e;
  }
};
class Au {
  constructor() {
    this.interval = 25, this.intervalId = void 0, this.limit = ku, this.queueActive = /* @__PURE__ */ new Set(), this.queueWaiting = /* @__PURE__ */ new Set(), this.init = () => {
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
const Cu = new Au(), Et = (e, t) => function(n) {
  return function s(...a) {
    return Cu.schedule().then((o) => {
      const c = (u) => (o(), u), l = (u) => {
        if (o(), Date.now() >= n)
          throw u;
        if (t(u)) {
          const d = Math.round(100 * Math.random());
          return new Promise((E) => setTimeout(E, d)).then(() => s.apply(void 0, a));
        }
        throw u;
      };
      return e.apply(void 0, a).then(c, l);
    });
  };
}, bt = (e, t) => function(n) {
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
}, Ce = {
  attempt: {
    /* ASYNC */
    chmod: wt(je(ne.chmod), pe.onChangeError),
    chown: wt(je(ne.chown), pe.onChangeError),
    close: wt(je(ne.close), Ge),
    fsync: wt(je(ne.fsync), Ge),
    mkdir: wt(je(ne.mkdir), Ge),
    realpath: wt(je(ne.realpath), Ge),
    stat: wt(je(ne.stat), Ge),
    unlink: wt(je(ne.unlink), Ge),
    /* SYNC */
    chmodSync: dt(ne.chmodSync, pe.onChangeError),
    chownSync: dt(ne.chownSync, pe.onChangeError),
    closeSync: dt(ne.closeSync, Ge),
    existsSync: dt(ne.existsSync, Ge),
    fsyncSync: dt(ne.fsync, Ge),
    mkdirSync: dt(ne.mkdirSync, Ge),
    realpathSync: dt(ne.realpathSync, Ge),
    statSync: dt(ne.statSync, Ge),
    unlinkSync: dt(ne.unlinkSync, Ge)
  },
  retry: {
    /* ASYNC */
    close: Et(je(ne.close), pe.isRetriableError),
    fsync: Et(je(ne.fsync), pe.isRetriableError),
    open: Et(je(ne.open), pe.isRetriableError),
    readFile: Et(je(ne.readFile), pe.isRetriableError),
    rename: Et(je(ne.rename), pe.isRetriableError),
    stat: Et(je(ne.stat), pe.isRetriableError),
    write: Et(je(ne.write), pe.isRetriableError),
    writeFile: Et(je(ne.writeFile), pe.isRetriableError),
    /* SYNC */
    closeSync: bt(ne.closeSync, pe.isRetriableError),
    fsyncSync: bt(ne.fsyncSync, pe.isRetriableError),
    openSync: bt(ne.openSync, pe.isRetriableError),
    readFileSync: bt(ne.readFileSync, pe.isRetriableError),
    renameSync: bt(ne.renameSync, pe.isRetriableError),
    statSync: bt(ne.statSync, pe.isRetriableError),
    writeSync: bt(ne.writeSync, pe.isRetriableError),
    writeFileSync: bt(ne.writeFileSync, pe.isRetriableError)
  }
}, Du = "utf8", Zo = 438, Mu = 511, Vu = {}, Lu = zn.userInfo().uid, Fu = zn.userInfo().gid, zu = 1e3, Uu = !!be.getuid;
be.getuid && be.getuid();
const xo = 128, qu = (e) => e instanceof Error && "code" in e, ei = (e) => typeof e == "string", cs = (e) => e === void 0, Gu = be.platform === "linux", Tc = be.platform === "win32", Ws = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
Tc || Ws.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
Gu && Ws.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
class Ku {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (Tc && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? be.kill(be.pid, "SIGTERM") : be.kill(be.pid, t));
      }
    }, this.hook = () => {
      be.once("exit", () => this.exit());
      for (const t of Ws)
        try {
          be.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const Hu = new Ku(), Ju = Hu.register, De = {
  /* VARIABLES */
  store: {},
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${s}`;
  },
  get: (e, t, r = !0) => {
    const n = De.truncate(t(e));
    return n in De.store ? De.get(e, t, r) : (De.store[n] = r, [n, () => delete De.store[n]]);
  },
  purge: (e) => {
    De.store[e] && (delete De.store[e], Ce.attempt.unlink(e));
  },
  purgeSync: (e) => {
    De.store[e] && (delete De.store[e], Ce.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in De.store)
      De.purgeSync(e);
  },
  truncate: (e) => {
    const t = ae.basename(e);
    if (t.length <= xo)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - xo;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
Ju(De.purgeSyncAll);
function jc(e, t, r = Vu) {
  if (ei(r))
    return jc(e, t, { encoding: r });
  const n = Date.now() + ((r.timeout ?? zu) || -1);
  let s = null, a = null, o = null;
  try {
    const c = Ce.attempt.realpathSync(e), l = !!c;
    e = c || e, [a, s] = De.get(e, r.tmpCreate || De.create, r.tmpPurge !== !1);
    const u = Uu && cs(r.chown), d = cs(r.mode);
    if (l && (u || d)) {
      const h = Ce.attempt.statSync(e);
      h && (r = { ...r }, u && (r.chown = { uid: h.uid, gid: h.gid }), d && (r.mode = h.mode));
    }
    if (!l) {
      const h = ae.dirname(e);
      Ce.attempt.mkdirSync(h, {
        mode: Mu,
        recursive: !0
      });
    }
    o = Ce.retry.openSync(n)(a, "w", r.mode || Zo), r.tmpCreated && r.tmpCreated(a), ei(t) ? Ce.retry.writeSync(n)(o, t, 0, r.encoding || Du) : cs(t) || Ce.retry.writeSync(n)(o, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Ce.retry.fsyncSync(n)(o) : Ce.attempt.fsync(o)), Ce.retry.closeSync(n)(o), o = null, r.chown && (r.chown.uid !== Lu || r.chown.gid !== Fu) && Ce.attempt.chownSync(a, r.chown.uid, r.chown.gid), r.mode && r.mode !== Zo && Ce.attempt.chmodSync(a, r.mode);
    try {
      Ce.retry.renameSync(n)(a, e);
    } catch (h) {
      if (!qu(h) || h.code !== "ENAMETOOLONG")
        throw h;
      Ce.retry.renameSync(n)(a, De.truncate(e));
    }
    s(), a = null;
  } finally {
    o && Ce.attempt.closeSync(o), a && De.purge(a);
  }
}
function kc(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ns = { exports: {} }, Ac = {}, ft = {}, Lt = {}, Br = {}, ee = {}, Jr = {};
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
      c(P, w[I]), P.push(m[++I]);
    return new n(P);
  }
  e._ = s;
  const a = new n("+");
  function o(m, ...w) {
    const P = [y(m[0])];
    let I = 0;
    for (; I < w.length; )
      P.push(a), c(P, w[I]), P.push(a, y(m[++I]));
    return l(P), new n(P);
  }
  e.str = o;
  function c(m, w) {
    w instanceof n ? m.push(...w._items) : w instanceof r ? m.push(w) : m.push(h(w));
  }
  e.addCodeArg = c;
  function l(m) {
    let w = 1;
    for (; w < m.length - 1; ) {
      if (m[w] === a) {
        const P = u(m[w - 1], m[w + 1]);
        if (P !== void 0) {
          m.splice(w - 1, 3, P);
          continue;
        }
        m[w++] = "+";
      }
      w++;
    }
  }
  function u(m, w) {
    if (w === '""')
      return m;
    if (m === '""')
      return w;
    if (typeof m == "string")
      return w instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof w != "string" ? `${m.slice(0, -1)}${w}"` : w[0] === '"' ? m.slice(0, -1) + w.slice(1) : void 0;
    if (typeof w == "string" && w[0] === '"' && !(m instanceof r))
      return `"${m}${w.slice(1)}`;
  }
  function d(m, w) {
    return w.emptyStr() ? m : m.emptyStr() ? w : o`${m}${w}`;
  }
  e.strConcat = d;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : y(Array.isArray(m) ? m.join(",") : m);
  }
  function E(m) {
    return new n(y(m));
  }
  e.stringify = E;
  function y(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = y;
  function $(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = $;
  function v(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = v;
  function _(m) {
    return new n(m.toString());
  }
  e.regexpCode = _;
})(Jr);
var Rs = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = Jr;
  class r extends Error {
    constructor(u) {
      super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
    }
  }
  var n;
  (function(l) {
    l[l.Started = 0] = "Started", l[l.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: u, parent: d } = {}) {
      this._names = {}, this._prefixes = u, this._parent = d;
    }
    toName(u) {
      return u instanceof t.Name ? u : this.name(u);
    }
    name(u) {
      return new t.Name(this._newName(u));
    }
    _newName(u) {
      const d = this._names[u] || this._nameGroup(u);
      return `${u}${d.index++}`;
    }
    _nameGroup(u) {
      var d, h;
      if (!((h = (d = this._parent) === null || d === void 0 ? void 0 : d._prefixes) === null || h === void 0) && h.has(u) || this._prefixes && !this._prefixes.has(u))
        throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
      return this._names[u] = { prefix: u, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(u, d) {
      super(d), this.prefix = u;
    }
    setValue(u, { property: d, itemIndex: h }) {
      this.value = u, this.scopePath = (0, t._)`.${new t.Name(d)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const o = (0, t._)`\n`;
  class c extends s {
    constructor(u) {
      super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(u) {
      return new a(u, this._newName(u));
    }
    value(u, d) {
      var h;
      if (d.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const E = this.toName(u), { prefix: y } = E, $ = (h = d.key) !== null && h !== void 0 ? h : d.ref;
      let v = this._values[y];
      if (v) {
        const w = v.get($);
        if (w)
          return w;
      } else
        v = this._values[y] = /* @__PURE__ */ new Map();
      v.set($, E);
      const _ = this._scope[y] || (this._scope[y] = []), m = _.length;
      return _[m] = d.ref, E.setValue(d, { property: y, itemIndex: m }), E;
    }
    getValue(u, d) {
      const h = this._values[u];
      if (h)
        return h.get(d);
    }
    scopeRefs(u, d = this._values) {
      return this._reduceValues(d, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${u}${h.scopePath}`;
      });
    }
    scopeCode(u = this._values, d, h) {
      return this._reduceValues(u, (E) => {
        if (E.value === void 0)
          throw new Error(`CodeGen: name "${E}" has no value`);
        return E.value.code;
      }, d, h);
    }
    _reduceValues(u, d, h = {}, E) {
      let y = t.nil;
      for (const $ in u) {
        const v = u[$];
        if (!v)
          continue;
        const _ = h[$] = h[$] || /* @__PURE__ */ new Map();
        v.forEach((m) => {
          if (_.has(m))
            return;
          _.set(m, n.Started);
          let w = d(m);
          if (w) {
            const P = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            y = (0, t._)`${y}${P} ${m} = ${w};${this.opts._n}`;
          } else if (w = E == null ? void 0 : E(m))
            y = (0, t._)`${y}${w}${this.opts._n}`;
          else
            throw new r(m);
          _.set(m, n.Completed);
        });
      }
      return y;
    }
  }
  e.ValueScope = c;
})(Rs);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Jr, r = Rs;
  var n = Jr;
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
  var s = Rs;
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
    constructor(i, f, b) {
      super(), this.varKind = i, this.name = f, this.rhs = b;
    }
    render({ es5: i, _n: f }) {
      const b = i ? r.varKinds.var : this.varKind, k = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${b} ${this.name}${k};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = j(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class c extends a {
    constructor(i, f, b) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = b;
    }
    render({ _n: i }) {
      return `${this.lhs} = ${this.rhs};` + i;
    }
    optimizeNames(i, f) {
      if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
        return this.rhs = j(this.rhs, i, f), this;
    }
    get names() {
      const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return Q(i, this.rhs);
    }
  }
  class l extends c {
    constructor(i, f, b, k) {
      super(i, b, k), this.op = f;
    }
    render({ _n: i }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + i;
    }
  }
  class u extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `${this.label}:` + i;
    }
  }
  class d extends a {
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
  class E extends a {
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
      return this.code = j(this.code, i, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class y extends a {
    constructor(i = []) {
      super(), this.nodes = i;
    }
    render(i) {
      return this.nodes.reduce((f, b) => f + b.render(i), "");
    }
    optimizeNodes() {
      const { nodes: i } = this;
      let f = i.length;
      for (; f--; ) {
        const b = i[f].optimizeNodes();
        Array.isArray(b) ? i.splice(f, 1, ...b) : b ? i[f] = b : i.splice(f, 1);
      }
      return i.length > 0 ? this : void 0;
    }
    optimizeNames(i, f) {
      const { nodes: b } = this;
      let k = b.length;
      for (; k--; ) {
        const A = b[k];
        A.optimizeNames(i, f) || (D(i, A.names), b.splice(k, 1));
      }
      return b.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => W(i, f.names), {});
    }
  }
  class $ extends y {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class v extends y {
  }
  class _ extends $ {
  }
  _.kind = "else";
  class m extends $ {
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
        const b = f.optimizeNodes();
        f = this.else = Array.isArray(b) ? new _(b) : b;
      }
      if (f)
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(U(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var b;
      if (this.else = (b = this.else) === null || b === void 0 ? void 0 : b.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = j(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return Q(i, this.condition), this.else && W(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class w extends $ {
  }
  w.kind = "for";
  class P extends w {
    constructor(i) {
      super(), this.iteration = i;
    }
    render(i) {
      return `for(${this.iteration})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iteration = j(this.iteration, i, f), this;
    }
    get names() {
      return W(super.names, this.iteration.names);
    }
  }
  class I extends w {
    constructor(i, f, b, k) {
      super(), this.varKind = i, this.name = f, this.from = b, this.to = k;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: b, from: k, to: A } = this;
      return `for(${f} ${b}=${k}; ${b}<${A}; ${b}++)` + super.render(i);
    }
    get names() {
      const i = Q(super.names, this.from);
      return Q(i, this.to);
    }
  }
  class T extends w {
    constructor(i, f, b, k) {
      super(), this.loop = i, this.varKind = f, this.name = b, this.iterable = k;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = j(this.iterable, i, f), this;
    }
    get names() {
      return W(super.names, this.iterable.names);
    }
  }
  class K extends $ {
    constructor(i, f, b) {
      super(), this.name = i, this.args = f, this.async = b;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  K.kind = "func";
  class Y extends y {
    render(i) {
      return "return " + super.render(i);
    }
  }
  Y.kind = "return";
  class ce extends $ {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var b, k;
      return super.optimizeNames(i, f), (b = this.catch) === null || b === void 0 || b.optimizeNames(i, f), (k = this.finally) === null || k === void 0 || k.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && W(i, this.catch.names), this.finally && W(i, this.finally.names), i;
    }
  }
  class de extends $ {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  de.kind = "catch";
  class $e extends $ {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  $e.kind = "finally";
  class G {
    constructor(i, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = i, this._scope = new r.Scope({ parent: i }), this._nodes = [new v()];
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
      const b = this._extScope.value(i, f);
      return (this._values[b.prefix] || (this._values[b.prefix] = /* @__PURE__ */ new Set())).add(b), b;
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
    _def(i, f, b, k) {
      const A = this._scope.toName(f);
      return b !== void 0 && k && (this._constants[A.str] = b), this._leafNode(new o(i, A, b)), A;
    }
    // `const` declaration (`var` in es5 mode)
    const(i, f, b) {
      return this._def(r.varKinds.const, i, f, b);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(i, f, b) {
      return this._def(r.varKinds.let, i, f, b);
    }
    // `var` declaration with optional assignment
    var(i, f, b) {
      return this._def(r.varKinds.var, i, f, b);
    }
    // assignment code
    assign(i, f, b) {
      return this._leafNode(new c(i, f, b));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new l(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new E(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [b, k] of i)
        f.length > 1 && f.push(","), f.push(b), (b !== k || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, k));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(i, f, b) {
      if (this._blockNode(new m(i)), f && b)
        this.code(f).else().code(b).endIf();
      else if (f)
        this.code(f).endIf();
      else if (b)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(i) {
      return this._elseNode(new m(i));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new _());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, _);
    }
    _for(i, f) {
      return this._blockNode(i), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(i, f) {
      return this._for(new P(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, b, k, A = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const H = this._scope.toName(i);
      return this._for(new I(A, H, f, b), () => k(H));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, k = r.varKinds.const) {
      const A = this._scope.toName(i);
      if (this.opts.es5) {
        const H = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${H}.length`, (q) => {
          this.var(A, (0, t._)`${H}[${q}]`), b(A);
        });
      }
      return this._for(new T("of", k, A, f), () => b(A));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, b, k = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, b);
      const A = this._scope.toName(i);
      return this._for(new T("in", k, A, f), () => b(A));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(w);
    }
    // `label` statement
    label(i) {
      return this._leafNode(new u(i));
    }
    // `break` statement
    break(i) {
      return this._leafNode(new d(i));
    }
    // `return` statement
    return(i) {
      const f = new Y();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(Y);
    }
    // `try` statement
    try(i, f, b) {
      if (!f && !b)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const k = new ce();
      if (this._blockNode(k), this.code(i), f) {
        const A = this.name("e");
        this._currNode = k.catch = new de(A), f(A);
      }
      return b && (this._currNode = k.finally = new $e(), this.code(b)), this._endBlockNode(de, $e);
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
      const b = this._nodes.length - f;
      if (b < 0 || i !== void 0 && b !== i)
        throw new Error(`CodeGen: wrong number of nodes: ${b} vs ${i} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(i, f = t.nil, b, k) {
      return this._blockNode(new K(i, f, b)), k && this.code(k).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(K);
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
      const b = this._currNode;
      if (b instanceof i || f && b instanceof f)
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
  e.CodeGen = G;
  function W(g, i) {
    for (const f in i)
      g[f] = (g[f] || 0) + (i[f] || 0);
    return g;
  }
  function Q(g, i) {
    return i instanceof t._CodeOrName ? W(g, i.names) : g;
  }
  function j(g, i, f) {
    if (g instanceof t.Name)
      return b(g);
    if (!k(g))
      return g;
    return new t._Code(g._items.reduce((A, H) => (H instanceof t.Name && (H = b(H)), H instanceof t._Code ? A.push(...H._items) : A.push(H), A), []));
    function b(A) {
      const H = f[A.str];
      return H === void 0 || i[A.str] !== 1 ? A : (delete i[A.str], H);
    }
    function k(A) {
      return A instanceof t._Code && A._items.some((H) => H instanceof t.Name && i[H.str] === 1 && f[H.str] !== void 0);
    }
  }
  function D(g, i) {
    for (const f in i)
      g[f] = (g[f] || 0) - (i[f] || 0);
  }
  function U(g) {
    return typeof g == "boolean" || typeof g == "number" || g === null ? !g : (0, t._)`!${S(g)}`;
  }
  e.not = U;
  const L = p(e.operators.AND);
  function X(...g) {
    return g.reduce(L);
  }
  e.and = X;
  const z = p(e.operators.OR);
  function N(...g) {
    return g.reduce(z);
  }
  e.or = N;
  function p(g) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${S(i)} ${g} ${S(f)}`;
  }
  function S(g) {
    return g instanceof t.Name ? g : (0, t._)`(${g})`;
  }
})(ee);
var V = {};
Object.defineProperty(V, "__esModule", { value: !0 });
V.checkStrictMode = V.getErrorPath = V.Type = V.useFunc = V.setEvaluated = V.evaluatedPropsToName = V.mergeEvaluated = V.eachItem = V.unescapeJsonPointer = V.escapeJsonPointer = V.escapeFragment = V.unescapeFragment = V.schemaRefOrVal = V.schemaHasRulesButRef = V.schemaHasRules = V.checkUnknownRules = V.alwaysValidSchema = V.toHash = void 0;
const le = ee, Xu = Jr;
function Bu(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
V.toHash = Bu;
function Wu(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Cc(e, t), !Dc(t, e.self.RULES.all));
}
V.alwaysValidSchema = Wu;
function Cc(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || Lc(e, `unknown keyword: "${a}"`);
}
V.checkUnknownRules = Cc;
function Dc(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
V.schemaHasRules = Dc;
function Yu(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
V.schemaHasRulesButRef = Yu;
function Qu({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, le._)`${r}`;
  }
  return (0, le._)`${e}${t}${(0, le.getProperty)(n)}`;
}
V.schemaRefOrVal = Qu;
function Zu(e) {
  return Mc(decodeURIComponent(e));
}
V.unescapeFragment = Zu;
function xu(e) {
  return encodeURIComponent(Ys(e));
}
V.escapeFragment = xu;
function Ys(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
V.escapeJsonPointer = Ys;
function Mc(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
V.unescapeJsonPointer = Mc;
function ed(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
V.eachItem = ed;
function ti({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, c) => {
    const l = o === void 0 ? a : o instanceof le.Name ? (a instanceof le.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof le.Name ? (t(s, o, a), a) : r(a, o);
    return c === le.Name && !(l instanceof le.Name) ? n(s, l) : l;
  };
}
V.mergeEvaluated = {
  props: ti({
    mergeNames: (e, t, r) => e.if((0, le._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, le._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, le._)`${r} || {}`).code((0, le._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, le._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, le._)`${r} || {}`), Qs(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Vc
  }),
  items: ti({
    mergeNames: (e, t, r) => e.if((0, le._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, le._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, le._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, le._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Vc(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, le._)`{}`);
  return t !== void 0 && Qs(e, r, t), r;
}
V.evaluatedPropsToName = Vc;
function Qs(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, le._)`${t}${(0, le.getProperty)(n)}`, !0));
}
V.setEvaluated = Qs;
const ri = {};
function td(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: ri[t.code] || (ri[t.code] = new Xu._Code(t.code))
  });
}
V.useFunc = td;
var Os;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Os || (V.Type = Os = {}));
function rd(e, t, r) {
  if (e instanceof le.Name) {
    const n = t === Os.Num;
    return r ? n ? (0, le._)`"[" + ${e} + "]"` : (0, le._)`"['" + ${e} + "']"` : n ? (0, le._)`"/" + ${e}` : (0, le._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, le.getProperty)(e).toString() : "/" + Ys(e);
}
V.getErrorPath = rd;
function Lc(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
V.checkStrictMode = Lc;
var He = {};
Object.defineProperty(He, "__esModule", { value: !0 });
const ke = ee, nd = {
  // validation function arguments
  data: new ke.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new ke.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new ke.Name("instancePath"),
  parentData: new ke.Name("parentData"),
  parentDataProperty: new ke.Name("parentDataProperty"),
  rootData: new ke.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new ke.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new ke.Name("vErrors"),
  // null or array of validation errors
  errors: new ke.Name("errors"),
  // counter of validation errors
  this: new ke.Name("this"),
  // "globals"
  self: new ke.Name("self"),
  scope: new ke.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new ke.Name("json"),
  jsonPos: new ke.Name("jsonPos"),
  jsonLen: new ke.Name("jsonLen"),
  jsonPart: new ke.Name("jsonPart")
};
He.default = nd;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = ee, r = V, n = He;
  e.keywordError = {
    message: ({ keyword: _ }) => (0, t.str)`must pass "${_}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: _, schemaType: m }) => m ? (0, t.str)`"${_}" keyword must be ${m} ($data)` : (0, t.str)`"${_}" keyword is invalid ($data)`
  };
  function s(_, m = e.keywordError, w, P) {
    const { it: I } = _, { gen: T, compositeRule: K, allErrors: Y } = I, ce = h(_, m, w);
    P ?? (K || Y) ? l(T, ce) : u(I, (0, t._)`[${ce}]`);
  }
  e.reportError = s;
  function a(_, m = e.keywordError, w) {
    const { it: P } = _, { gen: I, compositeRule: T, allErrors: K } = P, Y = h(_, m, w);
    l(I, Y), T || K || u(P, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o(_, m) {
    _.assign(n.default.errors, m), _.if((0, t._)`${n.default.vErrors} !== null`, () => _.if(m, () => _.assign((0, t._)`${n.default.vErrors}.length`, m), () => _.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function c({ gen: _, keyword: m, schemaValue: w, data: P, errsCount: I, it: T }) {
    if (I === void 0)
      throw new Error("ajv implementation error");
    const K = _.name("err");
    _.forRange("i", I, n.default.errors, (Y) => {
      _.const(K, (0, t._)`${n.default.vErrors}[${Y}]`), _.if((0, t._)`${K}.instancePath === undefined`, () => _.assign((0, t._)`${K}.instancePath`, (0, t.strConcat)(n.default.instancePath, T.errorPath))), _.assign((0, t._)`${K}.schemaPath`, (0, t.str)`${T.errSchemaPath}/${m}`), T.opts.verbose && (_.assign((0, t._)`${K}.schema`, w), _.assign((0, t._)`${K}.data`, P));
    });
  }
  e.extendErrors = c;
  function l(_, m) {
    const w = _.const("err", m);
    _.if((0, t._)`${n.default.vErrors} === null`, () => _.assign(n.default.vErrors, (0, t._)`[${w}]`), (0, t._)`${n.default.vErrors}.push(${w})`), _.code((0, t._)`${n.default.errors}++`);
  }
  function u(_, m) {
    const { gen: w, validateName: P, schemaEnv: I } = _;
    I.$async ? w.throw((0, t._)`new ${_.ValidationError}(${m})`) : (w.assign((0, t._)`${P}.errors`, m), w.return(!1));
  }
  const d = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h(_, m, w) {
    const { createErrors: P } = _.it;
    return P === !1 ? (0, t._)`{}` : E(_, m, w);
  }
  function E(_, m, w = {}) {
    const { gen: P, it: I } = _, T = [
      y(I, w),
      $(_, w)
    ];
    return v(_, m, T), P.object(...T);
  }
  function y({ errorPath: _ }, { instancePath: m }) {
    const w = m ? (0, t.str)`${_}${(0, r.getErrorPath)(m, r.Type.Str)}` : _;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, w)];
  }
  function $({ keyword: _, it: { errSchemaPath: m } }, { schemaPath: w, parentSchema: P }) {
    let I = P ? m : (0, t.str)`${m}/${_}`;
    return w && (I = (0, t.str)`${I}${(0, r.getErrorPath)(w, r.Type.Str)}`), [d.schemaPath, I];
  }
  function v(_, { params: m, message: w }, P) {
    const { keyword: I, data: T, schemaValue: K, it: Y } = _, { opts: ce, propertyName: de, topSchemaRef: $e, schemaPath: G } = Y;
    P.push([d.keyword, I], [d.params, typeof m == "function" ? m(_) : m || (0, t._)`{}`]), ce.messages && P.push([d.message, typeof w == "function" ? w(_) : w]), ce.verbose && P.push([d.schema, K], [d.parentSchema, (0, t._)`${$e}${G}`], [n.default.data, T]), de && P.push([d.propertyName, de]);
  }
})(Br);
var ni;
function sd() {
  if (ni) return Lt;
  ni = 1, Object.defineProperty(Lt, "__esModule", { value: !0 }), Lt.boolOrEmptySchema = Lt.topBoolOrEmptySchema = void 0;
  const e = Br, t = ee, r = He, n = {
    message: "boolean schema is false"
  };
  function s(c) {
    const { gen: l, schema: u, validateName: d } = c;
    u === !1 ? o(c, !1) : typeof u == "object" && u.$async === !0 ? l.return(r.default.data) : (l.assign((0, t._)`${d}.errors`, null), l.return(!0));
  }
  Lt.topBoolOrEmptySchema = s;
  function a(c, l) {
    const { gen: u, schema: d } = c;
    d === !1 ? (u.var(l, !1), o(c)) : u.var(l, !0);
  }
  Lt.boolOrEmptySchema = a;
  function o(c, l) {
    const { gen: u, data: d } = c, h = {
      gen: u,
      keyword: "false schema",
      data: d,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: c
    };
    (0, e.reportError)(h, n, void 0, l);
  }
  return Lt;
}
var we = {}, Bt = {};
Object.defineProperty(Bt, "__esModule", { value: !0 });
Bt.getRules = Bt.isJSONType = void 0;
const ad = ["string", "number", "integer", "boolean", "null", "object", "array"], od = new Set(ad);
function id(e) {
  return typeof e == "string" && od.has(e);
}
Bt.isJSONType = id;
function cd() {
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
Bt.getRules = cd;
var $t = {};
Object.defineProperty($t, "__esModule", { value: !0 });
$t.shouldUseRule = $t.shouldUseGroup = $t.schemaHasRulesForType = void 0;
function ld({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Fc(e, n);
}
$t.schemaHasRulesForType = ld;
function Fc(e, t) {
  return t.rules.some((r) => zc(e, r));
}
$t.shouldUseGroup = Fc;
function zc(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
$t.shouldUseRule = zc;
Object.defineProperty(we, "__esModule", { value: !0 });
we.reportTypeError = we.checkDataTypes = we.checkDataType = we.coerceAndCheckDataType = we.getJSONTypes = we.getSchemaTypes = we.DataType = void 0;
const ud = Bt, dd = $t, fd = Br, te = ee, Uc = V;
var or;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(or || (we.DataType = or = {}));
function hd(e) {
  const t = qc(e.type);
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
we.getSchemaTypes = hd;
function qc(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(ud.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
we.getJSONTypes = qc;
function md(e, t) {
  const { gen: r, data: n, opts: s } = e, a = pd(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, dd.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const c = Zs(t, n, s.strictNumbers, or.Wrong);
    r.if(c, () => {
      a.length ? $d(e, t, a) : xs(e);
    });
  }
  return o;
}
we.coerceAndCheckDataType = md;
const Gc = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function pd(e, t) {
  return t ? e.filter((r) => Gc.has(r) || t === "array" && r === "array") : [];
}
function $d(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, te._)`typeof ${s}`), c = n.let("coerced", (0, te._)`undefined`);
  a.coerceTypes === "array" && n.if((0, te._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, te._)`${s}[0]`).assign(o, (0, te._)`typeof ${s}`).if(Zs(t, s, a.strictNumbers), () => n.assign(c, s))), n.if((0, te._)`${c} !== undefined`);
  for (const u of r)
    (Gc.has(u) || u === "array" && a.coerceTypes === "array") && l(u);
  n.else(), xs(e), n.endIf(), n.if((0, te._)`${c} !== undefined`, () => {
    n.assign(s, c), yd(e, c);
  });
  function l(u) {
    switch (u) {
      case "string":
        n.elseIf((0, te._)`${o} == "number" || ${o} == "boolean"`).assign(c, (0, te._)`"" + ${s}`).elseIf((0, te._)`${s} === null`).assign(c, (0, te._)`""`);
        return;
      case "number":
        n.elseIf((0, te._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(c, (0, te._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, te._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(c, (0, te._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, te._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(c, !1).elseIf((0, te._)`${s} === "true" || ${s} === 1`).assign(c, !0);
        return;
      case "null":
        n.elseIf((0, te._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(c, null);
        return;
      case "array":
        n.elseIf((0, te._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(c, (0, te._)`[${s}]`);
    }
  }
}
function yd({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, te._)`${t} !== undefined`, () => e.assign((0, te._)`${t}[${r}]`, n));
}
function Is(e, t, r, n = or.Correct) {
  const s = n === or.Correct ? te.operators.EQ : te.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, te._)`${t} ${s} null`;
    case "array":
      a = (0, te._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, te._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, te._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, te._)`typeof ${t} ${s} ${e}`;
  }
  return n === or.Correct ? a : (0, te.not)(a);
  function o(c = te.nil) {
    return (0, te.and)((0, te._)`typeof ${t} == "number"`, c, r ? (0, te._)`isFinite(${t})` : te.nil);
  }
}
we.checkDataType = Is;
function Zs(e, t, r, n) {
  if (e.length === 1)
    return Is(e[0], t, r, n);
  let s;
  const a = (0, Uc.toHash)(e);
  if (a.array && a.object) {
    const o = (0, te._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, te._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = te.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, te.and)(s, Is(o, t, r, n));
  return s;
}
we.checkDataTypes = Zs;
const _d = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, te._)`{type: ${e}}` : (0, te._)`{type: ${t}}`
};
function xs(e) {
  const t = gd(e);
  (0, fd.reportError)(t, _d);
}
we.reportTypeError = xs;
function gd(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Uc.schemaRefOrVal)(e, n, "type");
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
var Or = {}, si;
function vd() {
  if (si) return Or;
  si = 1, Object.defineProperty(Or, "__esModule", { value: !0 }), Or.assignDefaults = void 0;
  const e = ee, t = V;
  function r(s, a) {
    const { properties: o, items: c } = s.schema;
    if (a === "object" && o)
      for (const l in o)
        n(s, l, o[l].default);
    else a === "array" && Array.isArray(c) && c.forEach((l, u) => n(s, u, l.default));
  }
  Or.assignDefaults = r;
  function n(s, a, o) {
    const { gen: c, compositeRule: l, data: u, opts: d } = s;
    if (o === void 0)
      return;
    const h = (0, e._)`${u}${(0, e.getProperty)(a)}`;
    if (l) {
      (0, t.checkStrictMode)(s, `default is ignored for: ${h}`);
      return;
    }
    let E = (0, e._)`${h} === undefined`;
    d.useDefaults === "empty" && (E = (0, e._)`${E} || ${h} === null || ${h} === ""`), c.if(E, (0, e._)`${h} = ${(0, e.stringify)(o)}`);
  }
  return Or;
}
var We = {}, oe = {};
Object.defineProperty(oe, "__esModule", { value: !0 });
oe.validateUnion = oe.validateArray = oe.usePattern = oe.callValidateCode = oe.schemaProperties = oe.allSchemaProperties = oe.noPropertyInData = oe.propertyInData = oe.isOwnProperty = oe.hasPropFunc = oe.reportMissingProp = oe.checkMissingProp = oe.checkReportMissingProp = void 0;
const fe = ee, ea = V, St = He, wd = V;
function Ed(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(ra(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, fe._)`${t}` }, !0), e.error();
  });
}
oe.checkReportMissingProp = Ed;
function bd({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, fe.or)(...n.map((a) => (0, fe.and)(ra(e, t, a, r.ownProperties), (0, fe._)`${s} = ${a}`)));
}
oe.checkMissingProp = bd;
function Sd(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
oe.reportMissingProp = Sd;
function Kc(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, fe._)`Object.prototype.hasOwnProperty`
  });
}
oe.hasPropFunc = Kc;
function ta(e, t, r) {
  return (0, fe._)`${Kc(e)}.call(${t}, ${r})`;
}
oe.isOwnProperty = ta;
function Pd(e, t, r, n) {
  const s = (0, fe._)`${t}${(0, fe.getProperty)(r)} !== undefined`;
  return n ? (0, fe._)`${s} && ${ta(e, t, r)}` : s;
}
oe.propertyInData = Pd;
function ra(e, t, r, n) {
  const s = (0, fe._)`${t}${(0, fe.getProperty)(r)} === undefined`;
  return n ? (0, fe.or)(s, (0, fe.not)(ta(e, t, r))) : s;
}
oe.noPropertyInData = ra;
function Hc(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
oe.allSchemaProperties = Hc;
function Nd(e, t) {
  return Hc(t).filter((r) => !(0, ea.alwaysValidSchema)(e, t[r]));
}
oe.schemaProperties = Nd;
function Rd({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, c, l, u) {
  const d = u ? (0, fe._)`${e}, ${t}, ${n}${s}` : t, h = [
    [St.default.instancePath, (0, fe.strConcat)(St.default.instancePath, a)],
    [St.default.parentData, o.parentData],
    [St.default.parentDataProperty, o.parentDataProperty],
    [St.default.rootData, St.default.rootData]
  ];
  o.opts.dynamicRef && h.push([St.default.dynamicAnchors, St.default.dynamicAnchors]);
  const E = (0, fe._)`${d}, ${r.object(...h)}`;
  return l !== fe.nil ? (0, fe._)`${c}.call(${l}, ${E})` : (0, fe._)`${c}(${E})`;
}
oe.callValidateCode = Rd;
const Od = (0, fe._)`new RegExp`;
function Id({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, fe._)`${s.code === "new RegExp" ? Od : (0, wd.useFunc)(e, s)}(${r}, ${n})`
  });
}
oe.usePattern = Id;
function Td(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const c = t.let("valid", !0);
    return o(() => t.assign(c, !1)), c;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(c) {
    const l = t.const("len", (0, fe._)`${r}.length`);
    t.forRange("i", 0, l, (u) => {
      e.subschema({
        keyword: n,
        dataProp: u,
        dataPropType: ea.Type.Num
      }, a), t.if((0, fe.not)(a), c);
    });
  }
}
oe.validateArray = Td;
function jd(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((l) => (0, ea.alwaysValidSchema)(s, l)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), c = t.name("_valid");
  t.block(() => r.forEach((l, u) => {
    const d = e.subschema({
      keyword: n,
      schemaProp: u,
      compositeRule: !0
    }, c);
    t.assign(o, (0, fe._)`${o} || ${c}`), e.mergeValidEvaluated(d, c) || t.if((0, fe.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
oe.validateUnion = jd;
var ai;
function kd() {
  if (ai) return We;
  ai = 1, Object.defineProperty(We, "__esModule", { value: !0 }), We.validateKeywordUsage = We.validSchemaType = We.funcKeywordCode = We.macroKeywordCode = void 0;
  const e = ee, t = He, r = oe, n = Br;
  function s(E, y) {
    const { gen: $, keyword: v, schema: _, parentSchema: m, it: w } = E, P = y.macro.call(w.self, _, m, w), I = u($, v, P);
    w.opts.validateSchema !== !1 && w.self.validateSchema(P, !0);
    const T = $.name("valid");
    E.subschema({
      schema: P,
      schemaPath: e.nil,
      errSchemaPath: `${w.errSchemaPath}/${v}`,
      topSchemaRef: I,
      compositeRule: !0
    }, T), E.pass(T, () => E.error(!0));
  }
  We.macroKeywordCode = s;
  function a(E, y) {
    var $;
    const { gen: v, keyword: _, schema: m, parentSchema: w, $data: P, it: I } = E;
    l(I, y);
    const T = !P && y.compile ? y.compile.call(I.self, m, w, I) : y.validate, K = u(v, _, T), Y = v.let("valid");
    E.block$data(Y, ce), E.ok(($ = y.valid) !== null && $ !== void 0 ? $ : Y);
    function ce() {
      if (y.errors === !1)
        G(), y.modifying && o(E), W(() => E.error());
      else {
        const Q = y.async ? de() : $e();
        y.modifying && o(E), W(() => c(E, Q));
      }
    }
    function de() {
      const Q = v.let("ruleErrs", null);
      return v.try(() => G((0, e._)`await `), (j) => v.assign(Y, !1).if((0, e._)`${j} instanceof ${I.ValidationError}`, () => v.assign(Q, (0, e._)`${j}.errors`), () => v.throw(j))), Q;
    }
    function $e() {
      const Q = (0, e._)`${K}.errors`;
      return v.assign(Q, null), G(e.nil), Q;
    }
    function G(Q = y.async ? (0, e._)`await ` : e.nil) {
      const j = I.opts.passContext ? t.default.this : t.default.self, D = !("compile" in y && !P || y.schema === !1);
      v.assign(Y, (0, e._)`${Q}${(0, r.callValidateCode)(E, K, j, D)}`, y.modifying);
    }
    function W(Q) {
      var j;
      v.if((0, e.not)((j = y.valid) !== null && j !== void 0 ? j : Y), Q);
    }
  }
  We.funcKeywordCode = a;
  function o(E) {
    const { gen: y, data: $, it: v } = E;
    y.if(v.parentData, () => y.assign($, (0, e._)`${v.parentData}[${v.parentDataProperty}]`));
  }
  function c(E, y) {
    const { gen: $ } = E;
    $.if((0, e._)`Array.isArray(${y})`, () => {
      $.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${y} : ${t.default.vErrors}.concat(${y})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, n.extendErrors)(E);
    }, () => E.error());
  }
  function l({ schemaEnv: E }, y) {
    if (y.async && !E.$async)
      throw new Error("async keyword in sync schema");
  }
  function u(E, y, $) {
    if ($ === void 0)
      throw new Error(`keyword "${y}" failed to compile`);
    return E.scopeValue("keyword", typeof $ == "function" ? { ref: $ } : { ref: $, code: (0, e.stringify)($) });
  }
  function d(E, y, $ = !1) {
    return !y.length || y.some((v) => v === "array" ? Array.isArray(E) : v === "object" ? E && typeof E == "object" && !Array.isArray(E) : typeof E == v || $ && typeof E > "u");
  }
  We.validSchemaType = d;
  function h({ schema: E, opts: y, self: $, errSchemaPath: v }, _, m) {
    if (Array.isArray(_.keyword) ? !_.keyword.includes(m) : _.keyword !== m)
      throw new Error("ajv implementation error");
    const w = _.dependencies;
    if (w != null && w.some((P) => !Object.prototype.hasOwnProperty.call(E, P)))
      throw new Error(`parent schema must have dependencies of ${m}: ${w.join(",")}`);
    if (_.validateSchema && !_.validateSchema(E[m])) {
      const I = `keyword "${m}" value is invalid at path "${v}": ` + $.errorsText(_.validateSchema.errors);
      if (y.validateSchema === "log")
        $.logger.error(I);
      else
        throw new Error(I);
    }
  }
  return We.validateKeywordUsage = h, We;
}
var ht = {}, oi;
function Ad() {
  if (oi) return ht;
  oi = 1, Object.defineProperty(ht, "__esModule", { value: !0 }), ht.extendSubschemaMode = ht.extendSubschemaData = ht.getSubschema = void 0;
  const e = ee, t = V;
  function r(a, { keyword: o, schemaProp: c, schema: l, schemaPath: u, errSchemaPath: d, topSchemaRef: h }) {
    if (o !== void 0 && l !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (o !== void 0) {
      const E = a.schema[o];
      return c === void 0 ? {
        schema: E,
        schemaPath: (0, e._)`${a.schemaPath}${(0, e.getProperty)(o)}`,
        errSchemaPath: `${a.errSchemaPath}/${o}`
      } : {
        schema: E[c],
        schemaPath: (0, e._)`${a.schemaPath}${(0, e.getProperty)(o)}${(0, e.getProperty)(c)}`,
        errSchemaPath: `${a.errSchemaPath}/${o}/${(0, t.escapeFragment)(c)}`
      };
    }
    if (l !== void 0) {
      if (u === void 0 || d === void 0 || h === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: l,
        schemaPath: u,
        topSchemaRef: h,
        errSchemaPath: d
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  ht.getSubschema = r;
  function n(a, o, { dataProp: c, dataPropType: l, data: u, dataTypes: d, propertyName: h }) {
    if (u !== void 0 && c !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: E } = o;
    if (c !== void 0) {
      const { errorPath: $, dataPathArr: v, opts: _ } = o, m = E.let("data", (0, e._)`${o.data}${(0, e.getProperty)(c)}`, !0);
      y(m), a.errorPath = (0, e.str)`${$}${(0, t.getErrorPath)(c, l, _.jsPropertySyntax)}`, a.parentDataProperty = (0, e._)`${c}`, a.dataPathArr = [...v, a.parentDataProperty];
    }
    if (u !== void 0) {
      const $ = u instanceof e.Name ? u : E.let("data", u, !0);
      y($), h !== void 0 && (a.propertyName = h);
    }
    d && (a.dataTypes = d);
    function y($) {
      a.data = $, a.dataLevel = o.dataLevel + 1, a.dataTypes = [], o.definedProperties = /* @__PURE__ */ new Set(), a.parentData = o.data, a.dataNames = [...o.dataNames, $];
    }
  }
  ht.extendSubschemaData = n;
  function s(a, { jtdDiscriminator: o, jtdMetadata: c, compositeRule: l, createErrors: u, allErrors: d }) {
    l !== void 0 && (a.compositeRule = l), u !== void 0 && (a.createErrors = u), d !== void 0 && (a.allErrors = d), a.jtdDiscriminator = o, a.jtdMetadata = c;
  }
  return ht.extendSubschemaMode = s, ht;
}
var Oe = {}, qn = function e(t, r) {
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
}, Jc = { exports: {} }, kt = Jc.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  _n(t, n, s, e, "", e);
};
kt.keywords = {
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
kt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
kt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
kt.skipKeywords = {
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
function _n(e, t, r, n, s, a, o, c, l, u) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, c, l, u);
    for (var d in n) {
      var h = n[d];
      if (Array.isArray(h)) {
        if (d in kt.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            _n(e, t, r, h[E], s + "/" + d + "/" + E, a, s, d, n, E);
      } else if (d in kt.propsKeywords) {
        if (h && typeof h == "object")
          for (var y in h)
            _n(e, t, r, h[y], s + "/" + d + "/" + Cd(y), a, s, d, n, y);
      } else (d in kt.keywords || e.allKeys && !(d in kt.skipKeywords)) && _n(e, t, r, h, s + "/" + d, a, s, d, n);
    }
    r(n, s, a, o, c, l, u);
  }
}
function Cd(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Dd = Jc.exports;
Object.defineProperty(Oe, "__esModule", { value: !0 });
Oe.getSchemaRefs = Oe.resolveUrl = Oe.normalizeId = Oe._getFullPath = Oe.getFullPath = Oe.inlineRef = void 0;
const Md = V, Vd = qn, Ld = Dd, Fd = /* @__PURE__ */ new Set([
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
function zd(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Ts(e) : t ? Xc(e) <= t : !1;
}
Oe.inlineRef = zd;
const Ud = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Ts(e) {
  for (const t in e) {
    if (Ud.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Ts) || typeof r == "object" && Ts(r))
      return !0;
  }
  return !1;
}
function Xc(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Fd.has(r) && (typeof e[r] == "object" && (0, Md.eachItem)(e[r], (n) => t += Xc(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Bc(e, t = "", r) {
  r !== !1 && (t = ir(t));
  const n = e.parse(t);
  return Wc(e, n);
}
Oe.getFullPath = Bc;
function Wc(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Oe._getFullPath = Wc;
const qd = /#\/?$/;
function ir(e) {
  return e ? e.replace(qd, "") : "";
}
Oe.normalizeId = ir;
function Gd(e, t, r) {
  return r = ir(r), e.resolve(t, r);
}
Oe.resolveUrl = Gd;
const Kd = /^[a-z_][-a-z0-9._]*$/i;
function Hd(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = ir(e[r] || t), a = { "": s }, o = Bc(n, s, !1), c = {}, l = /* @__PURE__ */ new Set();
  return Ld(e, { allKeys: !0 }, (h, E, y, $) => {
    if ($ === void 0)
      return;
    const v = o + E;
    let _ = a[$];
    typeof h[r] == "string" && (_ = m.call(this, h[r])), w.call(this, h.$anchor), w.call(this, h.$dynamicAnchor), a[E] = _;
    function m(P) {
      const I = this.opts.uriResolver.resolve;
      if (P = ir(_ ? I(_, P) : P), l.has(P))
        throw d(P);
      l.add(P);
      let T = this.refs[P];
      return typeof T == "string" && (T = this.refs[T]), typeof T == "object" ? u(h, T.schema, P) : P !== ir(v) && (P[0] === "#" ? (u(h, c[P], P), c[P] = h) : this.refs[P] = v), P;
    }
    function w(P) {
      if (typeof P == "string") {
        if (!Kd.test(P))
          throw new Error(`invalid anchor "${P}"`);
        m.call(this, `#${P}`);
      }
    }
  }), c;
  function u(h, E, y) {
    if (E !== void 0 && !Vd(h, E))
      throw d(y);
  }
  function d(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Oe.getSchemaRefs = Hd;
var ii;
function Gn() {
  if (ii) return ft;
  ii = 1, Object.defineProperty(ft, "__esModule", { value: !0 }), ft.getData = ft.KeywordCxt = ft.validateFunctionCode = void 0;
  const e = sd(), t = we, r = $t, n = we, s = vd(), a = kd(), o = Ad(), c = ee, l = He, u = Oe, d = V, h = Br;
  function E(R) {
    if (T(R) && (Y(R), I(R))) {
      _(R);
      return;
    }
    y(R, () => (0, e.topBoolOrEmptySchema)(R));
  }
  ft.validateFunctionCode = E;
  function y({ gen: R, validateName: O, schema: C, schemaEnv: M, opts: J }, x) {
    J.code.es5 ? R.func(O, (0, c._)`${l.default.data}, ${l.default.valCxt}`, M.$async, () => {
      R.code((0, c._)`"use strict"; ${w(C, J)}`), v(R, J), R.code(x);
    }) : R.func(O, (0, c._)`${l.default.data}, ${$(J)}`, M.$async, () => R.code(w(C, J)).code(x));
  }
  function $(R) {
    return (0, c._)`{${l.default.instancePath}="", ${l.default.parentData}, ${l.default.parentDataProperty}, ${l.default.rootData}=${l.default.data}${R.dynamicRef ? (0, c._)`, ${l.default.dynamicAnchors}={}` : c.nil}}={}`;
  }
  function v(R, O) {
    R.if(l.default.valCxt, () => {
      R.var(l.default.instancePath, (0, c._)`${l.default.valCxt}.${l.default.instancePath}`), R.var(l.default.parentData, (0, c._)`${l.default.valCxt}.${l.default.parentData}`), R.var(l.default.parentDataProperty, (0, c._)`${l.default.valCxt}.${l.default.parentDataProperty}`), R.var(l.default.rootData, (0, c._)`${l.default.valCxt}.${l.default.rootData}`), O.dynamicRef && R.var(l.default.dynamicAnchors, (0, c._)`${l.default.valCxt}.${l.default.dynamicAnchors}`);
    }, () => {
      R.var(l.default.instancePath, (0, c._)`""`), R.var(l.default.parentData, (0, c._)`undefined`), R.var(l.default.parentDataProperty, (0, c._)`undefined`), R.var(l.default.rootData, l.default.data), O.dynamicRef && R.var(l.default.dynamicAnchors, (0, c._)`{}`);
    });
  }
  function _(R) {
    const { schema: O, opts: C, gen: M } = R;
    y(R, () => {
      C.$comment && O.$comment && Q(R), $e(R), M.let(l.default.vErrors, null), M.let(l.default.errors, 0), C.unevaluated && m(R), ce(R), j(R);
    });
  }
  function m(R) {
    const { gen: O, validateName: C } = R;
    R.evaluated = O.const("evaluated", (0, c._)`${C}.evaluated`), O.if((0, c._)`${R.evaluated}.dynamicProps`, () => O.assign((0, c._)`${R.evaluated}.props`, (0, c._)`undefined`)), O.if((0, c._)`${R.evaluated}.dynamicItems`, () => O.assign((0, c._)`${R.evaluated}.items`, (0, c._)`undefined`));
  }
  function w(R, O) {
    const C = typeof R == "object" && R[O.schemaId];
    return C && (O.code.source || O.code.process) ? (0, c._)`/*# sourceURL=${C} */` : c.nil;
  }
  function P(R, O) {
    if (T(R) && (Y(R), I(R))) {
      K(R, O);
      return;
    }
    (0, e.boolOrEmptySchema)(R, O);
  }
  function I({ schema: R, self: O }) {
    if (typeof R == "boolean")
      return !R;
    for (const C in R)
      if (O.RULES.all[C])
        return !0;
    return !1;
  }
  function T(R) {
    return typeof R.schema != "boolean";
  }
  function K(R, O) {
    const { schema: C, gen: M, opts: J } = R;
    J.$comment && C.$comment && Q(R), G(R), W(R);
    const x = M.const("_errs", l.default.errors);
    ce(R, x), M.var(O, (0, c._)`${x} === ${l.default.errors}`);
  }
  function Y(R) {
    (0, d.checkUnknownRules)(R), de(R);
  }
  function ce(R, O) {
    if (R.opts.jtd)
      return U(R, [], !1, O);
    const C = (0, t.getSchemaTypes)(R.schema), M = (0, t.coerceAndCheckDataType)(R, C);
    U(R, C, !M, O);
  }
  function de(R) {
    const { schema: O, errSchemaPath: C, opts: M, self: J } = R;
    O.$ref && M.ignoreKeywordsWithRef && (0, d.schemaHasRulesButRef)(O, J.RULES) && J.logger.warn(`$ref: keywords ignored in schema at path "${C}"`);
  }
  function $e(R) {
    const { schema: O, opts: C } = R;
    O.default !== void 0 && C.useDefaults && C.strictSchema && (0, d.checkStrictMode)(R, "default is ignored in the schema root");
  }
  function G(R) {
    const O = R.schema[R.opts.schemaId];
    O && (R.baseId = (0, u.resolveUrl)(R.opts.uriResolver, R.baseId, O));
  }
  function W(R) {
    if (R.schema.$async && !R.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function Q({ gen: R, schemaEnv: O, schema: C, errSchemaPath: M, opts: J }) {
    const x = C.$comment;
    if (J.$comment === !0)
      R.code((0, c._)`${l.default.self}.logger.log(${x})`);
    else if (typeof J.$comment == "function") {
      const ye = (0, c.str)`${M}/$comment`, Me = R.scopeValue("root", { ref: O.root });
      R.code((0, c._)`${l.default.self}.opts.$comment(${x}, ${ye}, ${Me}.schema)`);
    }
  }
  function j(R) {
    const { gen: O, schemaEnv: C, validateName: M, ValidationError: J, opts: x } = R;
    C.$async ? O.if((0, c._)`${l.default.errors} === 0`, () => O.return(l.default.data), () => O.throw((0, c._)`new ${J}(${l.default.vErrors})`)) : (O.assign((0, c._)`${M}.errors`, l.default.vErrors), x.unevaluated && D(R), O.return((0, c._)`${l.default.errors} === 0`));
  }
  function D({ gen: R, evaluated: O, props: C, items: M }) {
    C instanceof c.Name && R.assign((0, c._)`${O}.props`, C), M instanceof c.Name && R.assign((0, c._)`${O}.items`, M);
  }
  function U(R, O, C, M) {
    const { gen: J, schema: x, data: ye, allErrors: Me, opts: Se, self: Pe } = R, { RULES: _e } = Pe;
    if (x.$ref && (Se.ignoreKeywordsWithRef || !(0, d.schemaHasRulesButRef)(x, _e))) {
      J.block(() => k(R, "$ref", _e.all.$ref.definition));
      return;
    }
    Se.jtd || X(R, O), J.block(() => {
      for (const Te of _e.rules)
        at(Te);
      at(_e.post);
    });
    function at(Te) {
      (0, r.shouldUseGroup)(x, Te) && (Te.type ? (J.if((0, n.checkDataType)(Te.type, ye, Se.strictNumbers)), L(R, Te), O.length === 1 && O[0] === Te.type && C && (J.else(), (0, n.reportTypeError)(R)), J.endIf()) : L(R, Te), Me || J.if((0, c._)`${l.default.errors} === ${M || 0}`));
    }
  }
  function L(R, O) {
    const { gen: C, schema: M, opts: { useDefaults: J } } = R;
    J && (0, s.assignDefaults)(R, O.type), C.block(() => {
      for (const x of O.rules)
        (0, r.shouldUseRule)(M, x) && k(R, x.keyword, x.definition, O.type);
    });
  }
  function X(R, O) {
    R.schemaEnv.meta || !R.opts.strictTypes || (z(R, O), R.opts.allowUnionTypes || N(R, O), p(R, R.dataTypes));
  }
  function z(R, O) {
    if (O.length) {
      if (!R.dataTypes.length) {
        R.dataTypes = O;
        return;
      }
      O.forEach((C) => {
        g(R.dataTypes, C) || f(R, `type "${C}" not allowed by context "${R.dataTypes.join(",")}"`);
      }), i(R, O);
    }
  }
  function N(R, O) {
    O.length > 1 && !(O.length === 2 && O.includes("null")) && f(R, "use allowUnionTypes to allow union type keyword");
  }
  function p(R, O) {
    const C = R.self.RULES.all;
    for (const M in C) {
      const J = C[M];
      if (typeof J == "object" && (0, r.shouldUseRule)(R.schema, J)) {
        const { type: x } = J.definition;
        x.length && !x.some((ye) => S(O, ye)) && f(R, `missing type "${x.join(",")}" for keyword "${M}"`);
      }
    }
  }
  function S(R, O) {
    return R.includes(O) || O === "number" && R.includes("integer");
  }
  function g(R, O) {
    return R.includes(O) || O === "integer" && R.includes("number");
  }
  function i(R, O) {
    const C = [];
    for (const M of R.dataTypes)
      g(O, M) ? C.push(M) : O.includes("integer") && M === "number" && C.push("integer");
    R.dataTypes = C;
  }
  function f(R, O) {
    const C = R.schemaEnv.baseId + R.errSchemaPath;
    O += ` at "${C}" (strictTypes)`, (0, d.checkStrictMode)(R, O, R.opts.strictTypes);
  }
  class b {
    constructor(O, C, M) {
      if ((0, a.validateKeywordUsage)(O, C, M), this.gen = O.gen, this.allErrors = O.allErrors, this.keyword = M, this.data = O.data, this.schema = O.schema[M], this.$data = C.$data && O.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, d.schemaRefOrVal)(O, this.schema, M, this.$data), this.schemaType = C.schemaType, this.parentSchema = O.schema, this.params = {}, this.it = O, this.def = C, this.$data)
        this.schemaCode = O.gen.const("vSchema", q(this.$data, O));
      else if (this.schemaCode = this.schemaValue, !(0, a.validSchemaType)(this.schema, C.schemaType, C.allowUndefined))
        throw new Error(`${M} value must be ${JSON.stringify(C.schemaType)}`);
      ("code" in C ? C.trackErrors : C.errors !== !1) && (this.errsCount = O.gen.const("_errs", l.default.errors));
    }
    result(O, C, M) {
      this.failResult((0, c.not)(O), C, M);
    }
    failResult(O, C, M) {
      this.gen.if(O), M ? M() : this.error(), C ? (this.gen.else(), C(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(O, C) {
      this.failResult((0, c.not)(O), void 0, C);
    }
    fail(O) {
      if (O === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(O), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(O) {
      if (!this.$data)
        return this.fail(O);
      const { schemaCode: C } = this;
      this.fail((0, c._)`${C} !== undefined && (${(0, c.or)(this.invalid$data(), O)})`);
    }
    error(O, C, M) {
      if (C) {
        this.setParams(C), this._error(O, M), this.setParams({});
        return;
      }
      this._error(O, M);
    }
    _error(O, C) {
      (O ? h.reportExtraError : h.reportError)(this, this.def.error, C);
    }
    $dataError() {
      (0, h.reportError)(this, this.def.$dataError || h.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, h.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(O) {
      this.allErrors || this.gen.if(O);
    }
    setParams(O, C) {
      C ? Object.assign(this.params, O) : this.params = O;
    }
    block$data(O, C, M = c.nil) {
      this.gen.block(() => {
        this.check$data(O, M), C();
      });
    }
    check$data(O = c.nil, C = c.nil) {
      if (!this.$data)
        return;
      const { gen: M, schemaCode: J, schemaType: x, def: ye } = this;
      M.if((0, c.or)((0, c._)`${J} === undefined`, C)), O !== c.nil && M.assign(O, !0), (x.length || ye.validateSchema) && (M.elseIf(this.invalid$data()), this.$dataError(), O !== c.nil && M.assign(O, !1)), M.else();
    }
    invalid$data() {
      const { gen: O, schemaCode: C, schemaType: M, def: J, it: x } = this;
      return (0, c.or)(ye(), Me());
      function ye() {
        if (M.length) {
          if (!(C instanceof c.Name))
            throw new Error("ajv implementation error");
          const Se = Array.isArray(M) ? M : [M];
          return (0, c._)`${(0, n.checkDataTypes)(Se, C, x.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return c.nil;
      }
      function Me() {
        if (J.validateSchema) {
          const Se = O.scopeValue("validate$data", { ref: J.validateSchema });
          return (0, c._)`!${Se}(${C})`;
        }
        return c.nil;
      }
    }
    subschema(O, C) {
      const M = (0, o.getSubschema)(this.it, O);
      (0, o.extendSubschemaData)(M, this.it, O), (0, o.extendSubschemaMode)(M, O);
      const J = { ...this.it, ...M, items: void 0, props: void 0 };
      return P(J, C), J;
    }
    mergeEvaluated(O, C) {
      const { it: M, gen: J } = this;
      M.opts.unevaluated && (M.props !== !0 && O.props !== void 0 && (M.props = d.mergeEvaluated.props(J, O.props, M.props, C)), M.items !== !0 && O.items !== void 0 && (M.items = d.mergeEvaluated.items(J, O.items, M.items, C)));
    }
    mergeValidEvaluated(O, C) {
      const { it: M, gen: J } = this;
      if (M.opts.unevaluated && (M.props !== !0 || M.items !== !0))
        return J.if(C, () => this.mergeEvaluated(O, c.Name)), !0;
    }
  }
  ft.KeywordCxt = b;
  function k(R, O, C, M) {
    const J = new b(R, C, O);
    "code" in C ? C.code(J, M) : J.$data && C.validate ? (0, a.funcKeywordCode)(J, C) : "macro" in C ? (0, a.macroKeywordCode)(J, C) : (C.compile || C.validate) && (0, a.funcKeywordCode)(J, C);
  }
  const A = /^\/(?:[^~]|~0|~1)*$/, H = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function q(R, { dataLevel: O, dataNames: C, dataPathArr: M }) {
    let J, x;
    if (R === "")
      return l.default.rootData;
    if (R[0] === "/") {
      if (!A.test(R))
        throw new Error(`Invalid JSON-pointer: ${R}`);
      J = R, x = l.default.rootData;
    } else {
      const Pe = H.exec(R);
      if (!Pe)
        throw new Error(`Invalid JSON-pointer: ${R}`);
      const _e = +Pe[1];
      if (J = Pe[2], J === "#") {
        if (_e >= O)
          throw new Error(Se("property/index", _e));
        return M[O - _e];
      }
      if (_e > O)
        throw new Error(Se("data", _e));
      if (x = C[O - _e], !J)
        return x;
    }
    let ye = x;
    const Me = J.split("/");
    for (const Pe of Me)
      Pe && (x = (0, c._)`${x}${(0, c.getProperty)((0, d.unescapeJsonPointer)(Pe))}`, ye = (0, c._)`${ye} && ${x}`);
    return ye;
    function Se(Pe, _e) {
      return `Cannot access ${Pe} ${_e} levels up, current level is ${O}`;
    }
  }
  return ft.getData = q, ft;
}
var en = {}, ci;
function na() {
  if (ci) return en;
  ci = 1, Object.defineProperty(en, "__esModule", { value: !0 });
  class e extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return en.default = e, en;
}
var hr = {};
Object.defineProperty(hr, "__esModule", { value: !0 });
const ls = Oe;
let Jd = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, ls.resolveUrl)(t, r, n), this.missingSchema = (0, ls.normalizeId)((0, ls.getFullPath)(t, this.missingRef));
  }
};
hr.default = Jd;
var Le = {};
Object.defineProperty(Le, "__esModule", { value: !0 });
Le.resolveSchema = Le.getCompilingSchema = Le.resolveRef = Le.compileSchema = Le.SchemaEnv = void 0;
const Ye = ee, Xd = na(), Ft = He, et = Oe, li = V, Bd = Gn();
let Kn = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, et.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
Le.SchemaEnv = Kn;
function sa(e) {
  const t = Yc.call(this, e);
  if (t)
    return t;
  const r = (0, et.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new Ye.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let c;
  e.$async && (c = o.scopeValue("Error", {
    ref: Xd.default,
    code: (0, Ye._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const l = o.scopeName("validate");
  e.validateName = l;
  const u = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: Ft.default.data,
    parentData: Ft.default.parentData,
    parentDataProperty: Ft.default.parentDataProperty,
    dataNames: [Ft.default.data],
    dataPathArr: [Ye.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Ye.stringify)(e.schema) } : { ref: e.schema }),
    validateName: l,
    ValidationError: c,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Ye.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Ye._)`""`,
    opts: this.opts,
    self: this
  };
  let d;
  try {
    this._compilations.add(e), (0, Bd.validateFunctionCode)(u), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    d = `${o.scopeRefs(Ft.default.scope)}return ${h}`, this.opts.code.process && (d = this.opts.code.process(d, e));
    const y = new Function(`${Ft.default.self}`, `${Ft.default.scope}`, d)(this, this.scope.get());
    if (this.scope.value(l, { ref: y }), y.errors = null, y.schema = e.schema, y.schemaEnv = e, e.$async && (y.$async = !0), this.opts.code.source === !0 && (y.source = { validateName: l, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: $, items: v } = u;
      y.evaluated = {
        props: $ instanceof Ye.Name ? void 0 : $,
        items: v instanceof Ye.Name ? void 0 : v,
        dynamicProps: $ instanceof Ye.Name,
        dynamicItems: v instanceof Ye.Name
      }, y.source && (y.source.evaluated = (0, Ye.stringify)(y.evaluated));
    }
    return e.validate = y, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, d && this.logger.error("Error compiling schema, function code:", d), h;
  } finally {
    this._compilations.delete(e);
  }
}
Le.compileSchema = sa;
function Wd(e, t, r) {
  var n;
  r = (0, et.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = Zd.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: c } = this.opts;
    o && (a = new Kn({ schema: o, schemaId: c, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = Yd.call(this, a);
}
Le.resolveRef = Wd;
function Yd(e) {
  return (0, et.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : sa.call(this, e);
}
function Yc(e) {
  for (const t of this._compilations)
    if (Qd(t, e))
      return t;
}
Le.getCompilingSchema = Yc;
function Qd(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Zd(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Hn.call(this, e, t);
}
function Hn(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, et._getFullPath)(this.opts.uriResolver, r);
  let s = (0, et.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return us.call(this, r, e);
  const a = (0, et.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const c = Hn.call(this, e, o);
    return typeof (c == null ? void 0 : c.schema) != "object" ? void 0 : us.call(this, r, c);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || sa.call(this, o), a === (0, et.normalizeId)(t)) {
      const { schema: c } = o, { schemaId: l } = this.opts, u = c[l];
      return u && (s = (0, et.resolveUrl)(this.opts.uriResolver, s, u)), new Kn({ schema: c, schemaId: l, root: e, baseId: s });
    }
    return us.call(this, r, o);
  }
}
Le.resolveSchema = Hn;
const xd = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function us(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const c of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const l = r[(0, li.unescapeFragment)(c)];
    if (l === void 0)
      return;
    r = l;
    const u = typeof r == "object" && r[this.opts.schemaId];
    !xd.has(c) && u && (t = (0, et.resolveUrl)(this.opts.uriResolver, t, u));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, li.schemaHasRulesButRef)(r, this.RULES)) {
    const c = (0, et.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = Hn.call(this, n, c);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new Kn({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const ef = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", tf = "Meta-schema for $data reference (JSON AnySchema extension proposal)", rf = "object", nf = [
  "$data"
], sf = {
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
}, af = !1, of = {
  $id: ef,
  description: tf,
  type: rf,
  required: nf,
  properties: sf,
  additionalProperties: af
};
var aa = {}, Jn = { exports: {} };
const cf = {
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
var lf = {
  HEX: cf
};
const { HEX: uf } = lf, df = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
function Qc(e) {
  if (xc(e, ".") < 3)
    return { host: e, isIPV4: !1 };
  const t = e.match(df) || [], [r] = t;
  return r ? { host: hf(r, "."), isIPV4: !0 } : { host: e, isIPV4: !1 };
}
function js(e, t = !1) {
  let r = "", n = !0;
  for (const s of e) {
    if (uf[s] === void 0) return;
    s !== "0" && n === !0 && (n = !1), n || (r += s);
  }
  return t && r.length === 0 && (r = "0"), r;
}
function ff(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, o = !1, c = !1;
  function l() {
    if (s.length) {
      if (a === !1) {
        const u = js(s);
        if (u !== void 0)
          n.push(u);
        else
          return r.error = !0, !1;
      }
      s.length = 0;
    }
    return !0;
  }
  for (let u = 0; u < e.length; u++) {
    const d = e[u];
    if (!(d === "[" || d === "]"))
      if (d === ":") {
        if (o === !0 && (c = !0), !l())
          break;
        if (t++, n.push(":"), t > 7) {
          r.error = !0;
          break;
        }
        u - 1 >= 0 && e[u - 1] === ":" && (o = !0);
        continue;
      } else if (d === "%") {
        if (!l())
          break;
        a = !0;
      } else {
        s.push(d);
        continue;
      }
  }
  return s.length && (a ? r.zone = s.join("") : c ? n.push(s.join("")) : n.push(js(s))), r.address = n.join(""), r;
}
function Zc(e) {
  if (xc(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = ff(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, escapedHost: n, isIPV6: !0 };
  }
}
function hf(e, t) {
  let r = "", n = !0;
  const s = e.length;
  for (let a = 0; a < s; a++) {
    const o = e[a];
    o === "0" && n ? (a + 1 <= s && e[a + 1] === t || a + 1 === s) && (r += o, n = !1) : (o === t ? n = !0 : n = !1, r += o);
  }
  return r;
}
function xc(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
const ui = /^\.\.?\//u, di = /^\/\.(?:\/|$)/u, fi = /^\/\.\.(?:\/|$)/u, mf = /^\/?(?:.|\n)*?(?=\/|$)/u;
function pf(e) {
  const t = [];
  for (; e.length; )
    if (e.match(ui))
      e = e.replace(ui, "");
    else if (e.match(di))
      e = e.replace(di, "/");
    else if (e.match(fi))
      e = e.replace(fi, "/"), t.pop();
    else if (e === "." || e === "..")
      e = "";
    else {
      const r = e.match(mf);
      if (r) {
        const n = r[0];
        e = e.slice(n.length), t.push(n);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return t.join("");
}
function $f(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function yf(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    const n = Qc(r);
    if (n.isIPV4)
      r = n.host;
    else {
      const s = Zc(n.host);
      s.isIPV6 === !0 ? r = `[${s.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var _f = {
  recomposeAuthority: yf,
  normalizeComponentEncoding: $f,
  removeDotSegments: pf,
  normalizeIPv4: Qc,
  normalizeIPv6: Zc,
  stringArrayToHexStripped: js
};
const gf = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, vf = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function el(e) {
  return typeof e.secure == "boolean" ? e.secure : String(e.scheme).toLowerCase() === "wss";
}
function tl(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function rl(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function wf(e) {
  return e.secure = el(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function Ef(e) {
  if ((e.port === (el(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function bf(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(vf);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, a = oa[s];
    e.path = void 0, a && (e = a.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function Sf(e, t) {
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, a = oa[s];
  a && (e = a.serialize(e, t));
  const o = e, c = e.nss;
  return o.path = `${n || t.nid}:${c}`, t.skipEscape = !0, o;
}
function Pf(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !gf.test(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function Nf(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const nl = {
  scheme: "http",
  domainHost: !0,
  parse: tl,
  serialize: rl
}, Rf = {
  scheme: "https",
  domainHost: nl.domainHost,
  parse: tl,
  serialize: rl
}, gn = {
  scheme: "ws",
  domainHost: !0,
  parse: wf,
  serialize: Ef
}, Of = {
  scheme: "wss",
  domainHost: gn.domainHost,
  parse: gn.parse,
  serialize: gn.serialize
}, If = {
  scheme: "urn",
  parse: bf,
  serialize: Sf,
  skipNormalize: !0
}, Tf = {
  scheme: "urn:uuid",
  parse: Pf,
  serialize: Nf,
  skipNormalize: !0
}, oa = {
  http: nl,
  https: Rf,
  ws: gn,
  wss: Of,
  urn: If,
  "urn:uuid": Tf
};
var jf = oa;
const { normalizeIPv6: kf, normalizeIPv4: Af, removeDotSegments: Ar, recomposeAuthority: Cf, normalizeComponentEncoding: tn } = _f, ia = jf;
function Df(e, t) {
  return typeof e == "string" ? e = ct(gt(e, t), t) : typeof e == "object" && (e = gt(ct(e, t), t)), e;
}
function Mf(e, t, r) {
  const n = Object.assign({ scheme: "null" }, r), s = sl(gt(e, n), gt(t, n), n, !0);
  return ct(s, { ...n, skipEscape: !0 });
}
function sl(e, t, r, n) {
  const s = {};
  return n || (e = gt(ct(e, r), r), t = gt(ct(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Ar(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Ar(t.path || ""), s.query = t.query) : (t.path ? (t.path.charAt(0) === "/" ? s.path = Ar(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = Ar(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function Vf(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = ct(tn(gt(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = ct(tn(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = ct(tn(gt(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = ct(tn(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function ct(e, t) {
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
  }, n = Object.assign({}, t), s = [], a = ia[(n.scheme || r.scheme || "").toLowerCase()];
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const o = Cf(r);
  if (o !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(o), r.path && r.path.charAt(0) !== "/" && s.push("/")), r.path !== void 0) {
    let c = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (c = Ar(c)), o === void 0 && (c = c.replace(/^\/\//u, "/%2F")), s.push(c);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const Lf = Array.from({ length: 127 }, (e, t) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(t)));
function Ff(e) {
  let t = 0;
  for (let r = 0, n = e.length; r < n; ++r)
    if (t = e.charCodeAt(r), t > 126 || Lf[t])
      return !0;
  return !1;
}
const zf = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function gt(e, t) {
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
  const o = e.match(zf);
  if (o) {
    if (n.scheme = o[1], n.userinfo = o[3], n.host = o[4], n.port = parseInt(o[5], 10), n.path = o[6] || "", n.query = o[7], n.fragment = o[8], isNaN(n.port) && (n.port = o[5]), n.host) {
      const l = Af(n.host);
      if (l.isIPV4 === !1) {
        const u = kf(l.host);
        n.host = u.host.toLowerCase(), a = u.isIPV6;
      } else
        n.host = l.host, a = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const c = ia[(r.scheme || n.scheme || "").toLowerCase()];
    if (!r.unicodeSupport && (!c || !c.unicodeSupport) && n.host && (r.domainHost || c && c.domainHost) && a === !1 && Ff(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (l) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + l;
      }
    (!c || c && !c.skipNormalize) && (s && n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), s && n.host !== void 0 && (n.host = unescape(n.host)), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), c && c.parse && c.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const ca = {
  SCHEMES: ia,
  normalize: Df,
  resolve: Mf,
  resolveComponents: sl,
  equal: Vf,
  serialize: ct,
  parse: gt
};
Jn.exports = ca;
Jn.exports.default = ca;
Jn.exports.fastUri = ca;
var al = Jn.exports;
Object.defineProperty(aa, "__esModule", { value: !0 });
const ol = al;
ol.code = 'require("ajv/dist/runtime/uri").default';
aa.default = ol;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Gn();
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
  const n = na(), s = hr, a = Bt, o = Le, c = ee, l = Oe, u = we, d = V, h = of, E = aa, y = (N, p) => new RegExp(N, p);
  y.code = "new RegExp";
  const $ = ["removeAdditional", "useDefaults", "coerceTypes"], v = /* @__PURE__ */ new Set([
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
  ]), _ = {
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
    var p, S, g, i, f, b, k, A, H, q, R, O, C, M, J, x, ye, Me, Se, Pe, _e, at, Te, Dt, Mt;
    const Be = N.strict, Vt = (p = N.code) === null || p === void 0 ? void 0 : p.optimize, Er = Vt === !0 || Vt === void 0 ? 1 : Vt || 0, br = (g = (S = N.code) === null || S === void 0 ? void 0 : S.regExp) !== null && g !== void 0 ? g : y, os = (i = N.uriResolver) !== null && i !== void 0 ? i : E.default;
    return {
      strictSchema: (b = (f = N.strictSchema) !== null && f !== void 0 ? f : Be) !== null && b !== void 0 ? b : !0,
      strictNumbers: (A = (k = N.strictNumbers) !== null && k !== void 0 ? k : Be) !== null && A !== void 0 ? A : !0,
      strictTypes: (q = (H = N.strictTypes) !== null && H !== void 0 ? H : Be) !== null && q !== void 0 ? q : "log",
      strictTuples: (O = (R = N.strictTuples) !== null && R !== void 0 ? R : Be) !== null && O !== void 0 ? O : "log",
      strictRequired: (M = (C = N.strictRequired) !== null && C !== void 0 ? C : Be) !== null && M !== void 0 ? M : !1,
      code: N.code ? { ...N.code, optimize: Er, regExp: br } : { optimize: Er, regExp: br },
      loopRequired: (J = N.loopRequired) !== null && J !== void 0 ? J : w,
      loopEnum: (x = N.loopEnum) !== null && x !== void 0 ? x : w,
      meta: (ye = N.meta) !== null && ye !== void 0 ? ye : !0,
      messages: (Me = N.messages) !== null && Me !== void 0 ? Me : !0,
      inlineRefs: (Se = N.inlineRefs) !== null && Se !== void 0 ? Se : !0,
      schemaId: (Pe = N.schemaId) !== null && Pe !== void 0 ? Pe : "$id",
      addUsedSchema: (_e = N.addUsedSchema) !== null && _e !== void 0 ? _e : !0,
      validateSchema: (at = N.validateSchema) !== null && at !== void 0 ? at : !0,
      validateFormats: (Te = N.validateFormats) !== null && Te !== void 0 ? Te : !0,
      unicodeRegExp: (Dt = N.unicodeRegExp) !== null && Dt !== void 0 ? Dt : !0,
      int32range: (Mt = N.int32range) !== null && Mt !== void 0 ? Mt : !0,
      uriResolver: os
    };
  }
  class I {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...P(p) };
      const { es5: S, lines: g } = this.opts.code;
      this.scope = new c.ValueScope({ scope: {}, prefixes: v, es5: S, lines: g }), this.logger = W(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), T.call(this, _, p, "NOT SUPPORTED"), T.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = $e.call(this), p.formats && ce.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && de.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), Y.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: S, schemaId: g } = this.opts;
      let i = h;
      g === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), S && p && this.addMetaSchema(i, i[g], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: S } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[S] || p : void 0;
    }
    validate(p, S) {
      let g;
      if (typeof p == "string") {
        if (g = this.getSchema(p), !g)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        g = this.compile(p);
      const i = g(S);
      return "$async" in g || (this.errors = g.errors), i;
    }
    compile(p, S) {
      const g = this._addSchema(p, S);
      return g.validate || this._compileSchemaEnv(g);
    }
    compileAsync(p, S) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: g } = this.opts;
      return i.call(this, p, S);
      async function i(q, R) {
        await f.call(this, q.$schema);
        const O = this._addSchema(q, R);
        return O.validate || b.call(this, O);
      }
      async function f(q) {
        q && !this.getSchema(q) && await i.call(this, { $ref: q }, !0);
      }
      async function b(q) {
        try {
          return this._compileSchemaEnv(q);
        } catch (R) {
          if (!(R instanceof s.default))
            throw R;
          return k.call(this, R), await A.call(this, R.missingSchema), b.call(this, q);
        }
      }
      function k({ missingSchema: q, missingRef: R }) {
        if (this.refs[q])
          throw new Error(`AnySchema ${q} is loaded but ${R} cannot be resolved`);
      }
      async function A(q) {
        const R = await H.call(this, q);
        this.refs[q] || await f.call(this, R.$schema), this.refs[q] || this.addSchema(R, q, S);
      }
      async function H(q) {
        const R = this._loading[q];
        if (R)
          return R;
        try {
          return await (this._loading[q] = g(q));
        } finally {
          delete this._loading[q];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, S, g, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const b of p)
          this.addSchema(b, void 0, g, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: b } = this.opts;
        if (f = p[b], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${b} must be string`);
      }
      return S = (0, l.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(p, g, S, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, S, g = this.opts.validateSchema) {
      return this.addSchema(p, S, !0, g), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, S) {
      if (typeof p == "boolean")
        return !0;
      let g;
      if (g = p.$schema, g !== void 0 && typeof g != "string")
        throw new Error("$schema must be a string");
      if (g = g || this.opts.defaultMeta || this.defaultMeta(), !g)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate(g, p);
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
      for (; typeof (S = K.call(this, p)) == "string"; )
        p = S;
      if (S === void 0) {
        const { schemaId: g } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: g });
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
          const S = K.call(this, p);
          return typeof S == "object" && this._cache.delete(S.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const S = p;
          this._cache.delete(S);
          let g = p[this.opts.schemaId];
          return g && (g = (0, l.normalizeId)(g), delete this.schemas[g], delete this.refs[g]), this;
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
      let g;
      if (typeof p == "string")
        g = p, typeof S == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), S.keyword = g);
      else if (typeof p == "object" && S === void 0) {
        if (S = p, g = S.keyword, Array.isArray(g) && !g.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (j.call(this, g, S), !S)
        return (0, d.eachItem)(g, (f) => D.call(this, f)), this;
      L.call(this, S);
      const i = {
        ...S,
        type: (0, u.getJSONTypes)(S.type),
        schemaType: (0, u.getJSONTypes)(S.schemaType)
      };
      return (0, d.eachItem)(g, i.type.length === 0 ? (f) => D.call(this, f, i) : (f) => i.type.forEach((b) => D.call(this, f, i, b))), this;
    }
    getKeyword(p) {
      const S = this.RULES.all[p];
      return typeof S == "object" ? S.definition : !!S;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: S } = this;
      delete S.keywords[p], delete S.all[p];
      for (const g of S.rules) {
        const i = g.rules.findIndex((f) => f.keyword === p);
        i >= 0 && g.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, S) {
      return typeof S == "string" && (S = new RegExp(S)), this.formats[p] = S, this;
    }
    errorsText(p = this.errors, { separator: S = ", ", dataVar: g = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${g}${i.instancePath} ${i.message}`).reduce((i, f) => i + S + f);
    }
    $dataMetaSchema(p, S) {
      const g = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of S) {
        const f = i.split("/").slice(1);
        let b = p;
        for (const k of f)
          b = b[k];
        for (const k in g) {
          const A = g[k];
          if (typeof A != "object")
            continue;
          const { $data: H } = A.definition, q = b[k];
          H && q && (b[k] = z(q));
        }
      }
      return p;
    }
    _removeAllSchemas(p, S) {
      for (const g in p) {
        const i = p[g];
        (!S || S.test(g)) && (typeof i == "string" ? delete p[g] : i && !i.meta && (this._cache.delete(i.schema), delete p[g]));
      }
    }
    _addSchema(p, S, g, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let b;
      const { schemaId: k } = this.opts;
      if (typeof p == "object")
        b = p[k];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let A = this._cache.get(p);
      if (A !== void 0)
        return A;
      g = (0, l.normalizeId)(b || g);
      const H = l.getSchemaRefs.call(this, p, g);
      return A = new o.SchemaEnv({ schema: p, schemaId: k, meta: S, baseId: g, localRefs: H }), this._cache.set(A.schema, A), f && !g.startsWith("#") && (g && this._checkUnique(g), this.refs[g] = A), i && this.validateSchema(p, !0), A;
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
  I.ValidationError = n.default, I.MissingRefError = s.default, e.default = I;
  function T(N, p, S, g = "error") {
    for (const i in N) {
      const f = i;
      f in p && this.logger[g](`${S}: option ${i}. ${N[f]}`);
    }
  }
  function K(N) {
    return N = (0, l.normalizeId)(N), this.schemas[N] || this.refs[N];
  }
  function Y() {
    const N = this.opts.schemas;
    if (N)
      if (Array.isArray(N))
        this.addSchema(N);
      else
        for (const p in N)
          this.addSchema(N[p], p);
  }
  function ce() {
    for (const N in this.opts.formats) {
      const p = this.opts.formats[N];
      p && this.addFormat(N, p);
    }
  }
  function de(N) {
    if (Array.isArray(N)) {
      this.addVocabulary(N);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in N) {
      const S = N[p];
      S.keyword || (S.keyword = p), this.addKeyword(S);
    }
  }
  function $e() {
    const N = { ...this.opts };
    for (const p of $)
      delete N[p];
    return N;
  }
  const G = { log() {
  }, warn() {
  }, error() {
  } };
  function W(N) {
    if (N === !1)
      return G;
    if (N === void 0)
      return console;
    if (N.log && N.warn && N.error)
      return N;
    throw new Error("logger must implement log, warn and error methods");
  }
  const Q = /^[a-z_$][a-z0-9_$:-]*$/i;
  function j(N, p) {
    const { RULES: S } = this;
    if ((0, d.eachItem)(N, (g) => {
      if (S.keywords[g])
        throw new Error(`Keyword ${g} is already defined`);
      if (!Q.test(g))
        throw new Error(`Keyword ${g} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function D(N, p, S) {
    var g;
    const i = p == null ? void 0 : p.post;
    if (S && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let b = i ? f.post : f.rules.find(({ type: A }) => A === S);
    if (b || (b = { type: S, rules: [] }, f.rules.push(b)), f.keywords[N] = !0, !p)
      return;
    const k = {
      keyword: N,
      definition: {
        ...p,
        type: (0, u.getJSONTypes)(p.type),
        schemaType: (0, u.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? U.call(this, b, k, p.before) : b.rules.push(k), f.all[N] = k, (g = p.implements) === null || g === void 0 || g.forEach((A) => this.addKeyword(A));
  }
  function U(N, p, S) {
    const g = N.rules.findIndex((i) => i.keyword === S);
    g >= 0 ? N.rules.splice(g, 0, p) : (N.rules.push(p), this.logger.warn(`rule ${S} is not defined`));
  }
  function L(N) {
    let { metaSchema: p } = N;
    p !== void 0 && (N.$data && this.opts.$data && (p = z(p)), N.validateSchema = this.compile(p, !0));
  }
  const X = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function z(N) {
    return { anyOf: [N, X] };
  }
})(Ac);
var la = {}, ua = {}, da = {};
Object.defineProperty(da, "__esModule", { value: !0 });
const Uf = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
da.default = Uf;
var vt = {};
Object.defineProperty(vt, "__esModule", { value: !0 });
vt.callRef = vt.getValidate = void 0;
const qf = hr, hi = oe, ze = ee, Qt = He, mi = Le, rn = V, Gf = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: c, self: l } = n, { root: u } = a;
    if ((r === "#" || r === "#/") && s === u.baseId)
      return h();
    const d = mi.resolveRef.call(l, u, s, r);
    if (d === void 0)
      throw new qf.default(n.opts.uriResolver, s, r);
    if (d instanceof mi.SchemaEnv)
      return E(d);
    return y(d);
    function h() {
      if (a === u)
        return vn(e, o, a, a.$async);
      const $ = t.scopeValue("root", { ref: u });
      return vn(e, (0, ze._)`${$}.validate`, u, u.$async);
    }
    function E($) {
      const v = il(e, $);
      vn(e, v, $, $.$async);
    }
    function y($) {
      const v = t.scopeValue("schema", c.code.source === !0 ? { ref: $, code: (0, ze.stringify)($) } : { ref: $ }), _ = t.name("valid"), m = e.subschema({
        schema: $,
        dataTypes: [],
        schemaPath: ze.nil,
        topSchemaRef: v,
        errSchemaPath: r
      }, _);
      e.mergeEvaluated(m), e.ok(_);
    }
  }
};
function il(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, ze._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
vt.getValidate = il;
function vn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: c, opts: l } = a, u = l.passContext ? Qt.default.this : ze.nil;
  n ? d() : h();
  function d() {
    if (!c.$async)
      throw new Error("async schema referenced by sync schema");
    const $ = s.let("valid");
    s.try(() => {
      s.code((0, ze._)`await ${(0, hi.callValidateCode)(e, t, u)}`), y(t), o || s.assign($, !0);
    }, (v) => {
      s.if((0, ze._)`!(${v} instanceof ${a.ValidationError})`, () => s.throw(v)), E(v), o || s.assign($, !1);
    }), e.ok($);
  }
  function h() {
    e.result((0, hi.callValidateCode)(e, t, u), () => y(t), () => E(t));
  }
  function E($) {
    const v = (0, ze._)`${$}.errors`;
    s.assign(Qt.default.vErrors, (0, ze._)`${Qt.default.vErrors} === null ? ${v} : ${Qt.default.vErrors}.concat(${v})`), s.assign(Qt.default.errors, (0, ze._)`${Qt.default.vErrors}.length`);
  }
  function y($) {
    var v;
    if (!a.opts.unevaluated)
      return;
    const _ = (v = r == null ? void 0 : r.validate) === null || v === void 0 ? void 0 : v.evaluated;
    if (a.props !== !0)
      if (_ && !_.dynamicProps)
        _.props !== void 0 && (a.props = rn.mergeEvaluated.props(s, _.props, a.props));
      else {
        const m = s.var("props", (0, ze._)`${$}.evaluated.props`);
        a.props = rn.mergeEvaluated.props(s, m, a.props, ze.Name);
      }
    if (a.items !== !0)
      if (_ && !_.dynamicItems)
        _.items !== void 0 && (a.items = rn.mergeEvaluated.items(s, _.items, a.items));
      else {
        const m = s.var("items", (0, ze._)`${$}.evaluated.items`);
        a.items = rn.mergeEvaluated.items(s, m, a.items, ze.Name);
      }
  }
}
vt.callRef = vn;
vt.default = Gf;
Object.defineProperty(ua, "__esModule", { value: !0 });
const Kf = da, Hf = vt, Jf = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  Kf.default,
  Hf.default
];
ua.default = Jf;
var fa = {}, ha = {};
Object.defineProperty(ha, "__esModule", { value: !0 });
const Tn = ee, Pt = Tn.operators, jn = {
  maximum: { okStr: "<=", ok: Pt.LTE, fail: Pt.GT },
  minimum: { okStr: ">=", ok: Pt.GTE, fail: Pt.LT },
  exclusiveMaximum: { okStr: "<", ok: Pt.LT, fail: Pt.GTE },
  exclusiveMinimum: { okStr: ">", ok: Pt.GT, fail: Pt.LTE }
}, Xf = {
  message: ({ keyword: e, schemaCode: t }) => (0, Tn.str)`must be ${jn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Tn._)`{comparison: ${jn[e].okStr}, limit: ${t}}`
}, Bf = {
  keyword: Object.keys(jn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Xf,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Tn._)`${r} ${jn[t].fail} ${n} || isNaN(${r})`);
  }
};
ha.default = Bf;
var ma = {};
Object.defineProperty(ma, "__esModule", { value: !0 });
const Mr = ee, Wf = {
  message: ({ schemaCode: e }) => (0, Mr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Mr._)`{multipleOf: ${e}}`
}, Yf = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Wf,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), c = a ? (0, Mr._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, Mr._)`${o} !== parseInt(${o})`;
    e.fail$data((0, Mr._)`(${n} === 0 || (${o} = ${r}/${n}, ${c}))`);
  }
};
ma.default = Yf;
var pa = {}, $a = {};
Object.defineProperty($a, "__esModule", { value: !0 });
function cl(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
$a.default = cl;
cl.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(pa, "__esModule", { value: !0 });
const Ut = ee, Qf = V, Zf = $a, xf = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Ut.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Ut._)`{limit: ${e}}`
}, eh = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: xf,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? Ut.operators.GT : Ut.operators.LT, o = s.opts.unicode === !1 ? (0, Ut._)`${r}.length` : (0, Ut._)`${(0, Qf.useFunc)(e.gen, Zf.default)}(${r})`;
    e.fail$data((0, Ut._)`${o} ${a} ${n}`);
  }
};
pa.default = eh;
var ya = {};
Object.defineProperty(ya, "__esModule", { value: !0 });
const th = oe, kn = ee, rh = {
  message: ({ schemaCode: e }) => (0, kn.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, kn._)`{pattern: ${e}}`
}, nh = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: rh,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: a } = e, o = a.opts.unicodeRegExp ? "u" : "", c = r ? (0, kn._)`(new RegExp(${s}, ${o}))` : (0, th.usePattern)(e, n);
    e.fail$data((0, kn._)`!${c}.test(${t})`);
  }
};
ya.default = nh;
var _a = {};
Object.defineProperty(_a, "__esModule", { value: !0 });
const Vr = ee, sh = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Vr.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Vr._)`{limit: ${e}}`
}, ah = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: sh,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Vr.operators.GT : Vr.operators.LT;
    e.fail$data((0, Vr._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
_a.default = ah;
var ga = {};
Object.defineProperty(ga, "__esModule", { value: !0 });
const Ir = oe, Lr = ee, oh = V, ih = {
  message: ({ params: { missingProperty: e } }) => (0, Lr.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Lr._)`{missingProperty: ${e}}`
}, ch = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: ih,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: c } = o;
    if (!a && r.length === 0)
      return;
    const l = r.length >= c.loopRequired;
    if (o.allErrors ? u() : d(), c.strictRequired) {
      const y = e.parentSchema.properties, { definedProperties: $ } = e.it;
      for (const v of r)
        if ((y == null ? void 0 : y[v]) === void 0 && !$.has(v)) {
          const _ = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${v}" is not defined at "${_}" (strictRequired)`;
          (0, oh.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function u() {
      if (l || a)
        e.block$data(Lr.nil, h);
      else
        for (const y of r)
          (0, Ir.checkReportMissingProp)(e, y);
    }
    function d() {
      const y = t.let("missing");
      if (l || a) {
        const $ = t.let("valid", !0);
        e.block$data($, () => E(y, $)), e.ok($);
      } else
        t.if((0, Ir.checkMissingProp)(e, r, y)), (0, Ir.reportMissingProp)(e, y), t.else();
    }
    function h() {
      t.forOf("prop", n, (y) => {
        e.setParams({ missingProperty: y }), t.if((0, Ir.noPropertyInData)(t, s, y, c.ownProperties), () => e.error());
      });
    }
    function E(y, $) {
      e.setParams({ missingProperty: y }), t.forOf(y, n, () => {
        t.assign($, (0, Ir.propertyInData)(t, s, y, c.ownProperties)), t.if((0, Lr.not)($), () => {
          e.error(), t.break();
        });
      }, Lr.nil);
    }
  }
};
ga.default = ch;
var va = {};
Object.defineProperty(va, "__esModule", { value: !0 });
const Fr = ee, lh = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Fr.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Fr._)`{limit: ${e}}`
}, uh = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: lh,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? Fr.operators.GT : Fr.operators.LT;
    e.fail$data((0, Fr._)`${r}.length ${s} ${n}`);
  }
};
va.default = uh;
var wa = {}, Wr = {};
Object.defineProperty(Wr, "__esModule", { value: !0 });
const ll = qn;
ll.code = 'require("ajv/dist/runtime/equal").default';
Wr.default = ll;
Object.defineProperty(wa, "__esModule", { value: !0 });
const ds = we, Ne = ee, dh = V, fh = Wr, hh = {
  message: ({ params: { i: e, j: t } }) => (0, Ne.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Ne._)`{i: ${e}, j: ${t}}`
}, mh = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: hh,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: c } = e;
    if (!n && !s)
      return;
    const l = t.let("valid"), u = a.items ? (0, ds.getSchemaTypes)(a.items) : [];
    e.block$data(l, d, (0, Ne._)`${o} === false`), e.ok(l);
    function d() {
      const $ = t.let("i", (0, Ne._)`${r}.length`), v = t.let("j");
      e.setParams({ i: $, j: v }), t.assign(l, !0), t.if((0, Ne._)`${$} > 1`, () => (h() ? E : y)($, v));
    }
    function h() {
      return u.length > 0 && !u.some(($) => $ === "object" || $ === "array");
    }
    function E($, v) {
      const _ = t.name("item"), m = (0, ds.checkDataTypes)(u, _, c.opts.strictNumbers, ds.DataType.Wrong), w = t.const("indices", (0, Ne._)`{}`);
      t.for((0, Ne._)`;${$}--;`, () => {
        t.let(_, (0, Ne._)`${r}[${$}]`), t.if(m, (0, Ne._)`continue`), u.length > 1 && t.if((0, Ne._)`typeof ${_} == "string"`, (0, Ne._)`${_} += "_"`), t.if((0, Ne._)`typeof ${w}[${_}] == "number"`, () => {
          t.assign(v, (0, Ne._)`${w}[${_}]`), e.error(), t.assign(l, !1).break();
        }).code((0, Ne._)`${w}[${_}] = ${$}`);
      });
    }
    function y($, v) {
      const _ = (0, dh.useFunc)(t, fh.default), m = t.name("outer");
      t.label(m).for((0, Ne._)`;${$}--;`, () => t.for((0, Ne._)`${v} = ${$}; ${v}--;`, () => t.if((0, Ne._)`${_}(${r}[${$}], ${r}[${v}])`, () => {
        e.error(), t.assign(l, !1).break(m);
      })));
    }
  }
};
wa.default = mh;
var Ea = {};
Object.defineProperty(Ea, "__esModule", { value: !0 });
const ks = ee, ph = V, $h = Wr, yh = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, ks._)`{allowedValue: ${e}}`
}, _h = {
  keyword: "const",
  $data: !0,
  error: yh,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, ks._)`!${(0, ph.useFunc)(t, $h.default)}(${r}, ${s})`) : e.fail((0, ks._)`${a} !== ${r}`);
  }
};
Ea.default = _h;
var ba = {};
Object.defineProperty(ba, "__esModule", { value: !0 });
const Cr = ee, gh = V, vh = Wr, wh = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Cr._)`{allowedValues: ${e}}`
}, Eh = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: wh,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const c = s.length >= o.opts.loopEnum;
    let l;
    const u = () => l ?? (l = (0, gh.useFunc)(t, vh.default));
    let d;
    if (c || n)
      d = t.let("valid"), e.block$data(d, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const y = t.const("vSchema", a);
      d = (0, Cr.or)(...s.map(($, v) => E(y, v)));
    }
    e.pass(d);
    function h() {
      t.assign(d, !1), t.forOf("v", a, (y) => t.if((0, Cr._)`${u()}(${r}, ${y})`, () => t.assign(d, !0).break()));
    }
    function E(y, $) {
      const v = s[$];
      return typeof v == "object" && v !== null ? (0, Cr._)`${u()}(${r}, ${y}[${$}])` : (0, Cr._)`${r} === ${v}`;
    }
  }
};
ba.default = Eh;
Object.defineProperty(fa, "__esModule", { value: !0 });
const bh = ha, Sh = ma, Ph = pa, Nh = ya, Rh = _a, Oh = ga, Ih = va, Th = wa, jh = Ea, kh = ba, Ah = [
  // number
  bh.default,
  Sh.default,
  // string
  Ph.default,
  Nh.default,
  // object
  Rh.default,
  Oh.default,
  // array
  Ih.default,
  Th.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  jh.default,
  kh.default
];
fa.default = Ah;
var Sa = {}, mr = {};
Object.defineProperty(mr, "__esModule", { value: !0 });
mr.validateAdditionalItems = void 0;
const qt = ee, As = V, Ch = {
  message: ({ params: { len: e } }) => (0, qt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, qt._)`{limit: ${e}}`
}, Dh = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Ch,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, As.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    ul(e, n);
  }
};
function ul(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const c = r.const("len", (0, qt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, qt._)`${c} <= ${t.length}`);
  else if (typeof n == "object" && !(0, As.alwaysValidSchema)(o, n)) {
    const u = r.var("valid", (0, qt._)`${c} <= ${t.length}`);
    r.if((0, qt.not)(u), () => l(u)), e.ok(u);
  }
  function l(u) {
    r.forRange("i", t.length, c, (d) => {
      e.subschema({ keyword: a, dataProp: d, dataPropType: As.Type.Num }, u), o.allErrors || r.if((0, qt.not)(u), () => r.break());
    });
  }
}
mr.validateAdditionalItems = ul;
mr.default = Dh;
var Pa = {}, pr = {};
Object.defineProperty(pr, "__esModule", { value: !0 });
pr.validateTuple = void 0;
const pi = ee, wn = V, Mh = oe, Vh = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return dl(e, "additionalItems", t);
    r.items = !0, !(0, wn.alwaysValidSchema)(r, t) && e.ok((0, Mh.validateArray)(e));
  }
};
function dl(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: c } = e;
  d(s), c.opts.unevaluated && r.length && c.items !== !0 && (c.items = wn.mergeEvaluated.items(n, r.length, c.items));
  const l = n.name("valid"), u = n.const("len", (0, pi._)`${a}.length`);
  r.forEach((h, E) => {
    (0, wn.alwaysValidSchema)(c, h) || (n.if((0, pi._)`${u} > ${E}`, () => e.subschema({
      keyword: o,
      schemaProp: E,
      dataProp: E
    }, l)), e.ok(l));
  });
  function d(h) {
    const { opts: E, errSchemaPath: y } = c, $ = r.length, v = $ === h.minItems && ($ === h.maxItems || h[t] === !1);
    if (E.strictTuples && !v) {
      const _ = `"${o}" is ${$}-tuple, but minItems or maxItems/${t} are not specified or different at path "${y}"`;
      (0, wn.checkStrictMode)(c, _, E.strictTuples);
    }
  }
}
pr.validateTuple = dl;
pr.default = Vh;
Object.defineProperty(Pa, "__esModule", { value: !0 });
const Lh = pr, Fh = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, Lh.validateTuple)(e, "items")
};
Pa.default = Fh;
var Na = {};
Object.defineProperty(Na, "__esModule", { value: !0 });
const $i = ee, zh = V, Uh = oe, qh = mr, Gh = {
  message: ({ params: { len: e } }) => (0, $i.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, $i._)`{limit: ${e}}`
}, Kh = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Gh,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, zh.alwaysValidSchema)(n, t) && (s ? (0, qh.validateAdditionalItems)(e, s) : e.ok((0, Uh.validateArray)(e)));
  }
};
Na.default = Kh;
var Ra = {};
Object.defineProperty(Ra, "__esModule", { value: !0 });
const Je = ee, nn = V, Hh = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Je.str)`must contain at least ${e} valid item(s)` : (0, Je.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Je._)`{minContains: ${e}}` : (0, Je._)`{minContains: ${e}, maxContains: ${t}}`
}, Jh = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Hh,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, c;
    const { minContains: l, maxContains: u } = n;
    a.opts.next ? (o = l === void 0 ? 1 : l, c = u) : o = 1;
    const d = t.const("len", (0, Je._)`${s}.length`);
    if (e.setParams({ min: o, max: c }), c === void 0 && o === 0) {
      (0, nn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (c !== void 0 && o > c) {
      (0, nn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, nn.alwaysValidSchema)(a, r)) {
      let v = (0, Je._)`${d} >= ${o}`;
      c !== void 0 && (v = (0, Je._)`${v} && ${d} <= ${c}`), e.pass(v);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    c === void 0 && o === 1 ? y(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), c !== void 0 && t.if((0, Je._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const v = t.name("_valid"), _ = t.let("count", 0);
      y(v, () => t.if(v, () => $(_)));
    }
    function y(v, _) {
      t.forRange("i", 0, d, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: nn.Type.Num,
          compositeRule: !0
        }, v), _();
      });
    }
    function $(v) {
      t.code((0, Je._)`${v}++`), c === void 0 ? t.if((0, Je._)`${v} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, Je._)`${v} > ${c}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, Je._)`${v} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
Ra.default = Jh;
var Xn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = ee, r = V, n = oe;
  e.error = {
    message: ({ params: { property: l, depsCount: u, deps: d } }) => {
      const h = u === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${d} when property ${l} is present`;
    },
    params: ({ params: { property: l, depsCount: u, deps: d, missingProperty: h } }) => (0, t._)`{property: ${l},
    missingProperty: ${h},
    depsCount: ${u},
    deps: ${d}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(l) {
      const [u, d] = a(l);
      o(l, u), c(l, d);
    }
  };
  function a({ schema: l }) {
    const u = {}, d = {};
    for (const h in l) {
      if (h === "__proto__")
        continue;
      const E = Array.isArray(l[h]) ? u : d;
      E[h] = l[h];
    }
    return [u, d];
  }
  function o(l, u = l.schema) {
    const { gen: d, data: h, it: E } = l;
    if (Object.keys(u).length === 0)
      return;
    const y = d.let("missing");
    for (const $ in u) {
      const v = u[$];
      if (v.length === 0)
        continue;
      const _ = (0, n.propertyInData)(d, h, $, E.opts.ownProperties);
      l.setParams({
        property: $,
        depsCount: v.length,
        deps: v.join(", ")
      }), E.allErrors ? d.if(_, () => {
        for (const m of v)
          (0, n.checkReportMissingProp)(l, m);
      }) : (d.if((0, t._)`${_} && (${(0, n.checkMissingProp)(l, v, y)})`), (0, n.reportMissingProp)(l, y), d.else());
    }
  }
  e.validatePropertyDeps = o;
  function c(l, u = l.schema) {
    const { gen: d, data: h, keyword: E, it: y } = l, $ = d.name("valid");
    for (const v in u)
      (0, r.alwaysValidSchema)(y, u[v]) || (d.if(
        (0, n.propertyInData)(d, h, v, y.opts.ownProperties),
        () => {
          const _ = l.subschema({ keyword: E, schemaProp: v }, $);
          l.mergeValidEvaluated(_, $);
        },
        () => d.var($, !0)
        // TODO var
      ), l.ok($));
  }
  e.validateSchemaDeps = c, e.default = s;
})(Xn);
var Oa = {};
Object.defineProperty(Oa, "__esModule", { value: !0 });
const fl = ee, Xh = V, Bh = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, fl._)`{propertyName: ${e.propertyName}}`
}, Wh = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Bh,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Xh.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, fl.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
Oa.default = Wh;
var Bn = {};
Object.defineProperty(Bn, "__esModule", { value: !0 });
const sn = oe, Ze = ee, Yh = He, an = V, Qh = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Ze._)`{additionalProperty: ${e.additionalProperty}}`
}, Zh = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Qh,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: c, opts: l } = o;
    if (o.props = !0, l.removeAdditional !== "all" && (0, an.alwaysValidSchema)(o, r))
      return;
    const u = (0, sn.allSchemaProperties)(n.properties), d = (0, sn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Ze._)`${a} === ${Yh.default.errors}`);
    function h() {
      t.forIn("key", s, (_) => {
        !u.length && !d.length ? $(_) : t.if(E(_), () => $(_));
      });
    }
    function E(_) {
      let m;
      if (u.length > 8) {
        const w = (0, an.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, sn.isOwnProperty)(t, w, _);
      } else u.length ? m = (0, Ze.or)(...u.map((w) => (0, Ze._)`${_} === ${w}`)) : m = Ze.nil;
      return d.length && (m = (0, Ze.or)(m, ...d.map((w) => (0, Ze._)`${(0, sn.usePattern)(e, w)}.test(${_})`))), (0, Ze.not)(m);
    }
    function y(_) {
      t.code((0, Ze._)`delete ${s}[${_}]`);
    }
    function $(_) {
      if (l.removeAdditional === "all" || l.removeAdditional && r === !1) {
        y(_);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: _ }), e.error(), c || t.break();
        return;
      }
      if (typeof r == "object" && !(0, an.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        l.removeAdditional === "failing" ? (v(_, m, !1), t.if((0, Ze.not)(m), () => {
          e.reset(), y(_);
        })) : (v(_, m), c || t.if((0, Ze.not)(m), () => t.break()));
      }
    }
    function v(_, m, w) {
      const P = {
        keyword: "additionalProperties",
        dataProp: _,
        dataPropType: an.Type.Str
      };
      w === !1 && Object.assign(P, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(P, m);
    }
  }
};
Bn.default = Zh;
var Ia = {};
Object.defineProperty(Ia, "__esModule", { value: !0 });
const xh = Gn(), yi = oe, fs = V, _i = Bn, em = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && _i.default.code(new xh.KeywordCxt(a, _i.default, "additionalProperties"));
    const o = (0, yi.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = fs.mergeEvaluated.props(t, (0, fs.toHash)(o), a.props));
    const c = o.filter((h) => !(0, fs.alwaysValidSchema)(a, r[h]));
    if (c.length === 0)
      return;
    const l = t.name("valid");
    for (const h of c)
      u(h) ? d(h) : (t.if((0, yi.propertyInData)(t, s, h, a.opts.ownProperties)), d(h), a.allErrors || t.else().var(l, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(l);
    function u(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function d(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, l);
    }
  }
};
Ia.default = em;
var Ta = {};
Object.defineProperty(Ta, "__esModule", { value: !0 });
const gi = oe, on = ee, vi = V, wi = V, tm = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, c = (0, gi.allSchemaProperties)(r), l = c.filter((v) => (0, vi.alwaysValidSchema)(a, r[v]));
    if (c.length === 0 || l.length === c.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const u = o.strictSchema && !o.allowMatchingProperties && s.properties, d = t.name("valid");
    a.props !== !0 && !(a.props instanceof on.Name) && (a.props = (0, wi.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    E();
    function E() {
      for (const v of c)
        u && y(v), a.allErrors ? $(v) : (t.var(d, !0), $(v), t.if(d));
    }
    function y(v) {
      for (const _ in u)
        new RegExp(v).test(_) && (0, vi.checkStrictMode)(a, `property ${_} matches pattern ${v} (use allowMatchingProperties)`);
    }
    function $(v) {
      t.forIn("key", n, (_) => {
        t.if((0, on._)`${(0, gi.usePattern)(e, v)}.test(${_})`, () => {
          const m = l.includes(v);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: v,
            dataProp: _,
            dataPropType: wi.Type.Str
          }, d), a.opts.unevaluated && h !== !0 ? t.assign((0, on._)`${h}[${_}]`, !0) : !m && !a.allErrors && t.if((0, on.not)(d), () => t.break());
        });
      });
    }
  }
};
Ta.default = tm;
var ja = {};
Object.defineProperty(ja, "__esModule", { value: !0 });
const rm = V, nm = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, rm.alwaysValidSchema)(n, r)) {
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
ja.default = nm;
var ka = {};
Object.defineProperty(ka, "__esModule", { value: !0 });
const sm = oe, am = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: sm.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
ka.default = am;
var Aa = {};
Object.defineProperty(Aa, "__esModule", { value: !0 });
const En = ee, om = V, im = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, En._)`{passingSchemas: ${e.passing}}`
}, cm = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: im,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), c = t.let("passing", null), l = t.name("_valid");
    e.setParams({ passing: c }), t.block(u), e.result(o, () => e.reset(), () => e.error(!0));
    function u() {
      a.forEach((d, h) => {
        let E;
        (0, om.alwaysValidSchema)(s, d) ? t.var(l, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, l), h > 0 && t.if((0, En._)`${l} && ${o}`).assign(o, !1).assign(c, (0, En._)`[${c}, ${h}]`).else(), t.if(l, () => {
          t.assign(o, !0), t.assign(c, h), E && e.mergeEvaluated(E, En.Name);
        });
      });
    }
  }
};
Aa.default = cm;
var Ca = {};
Object.defineProperty(Ca, "__esModule", { value: !0 });
const lm = V, um = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, lm.alwaysValidSchema)(n, a))
        return;
      const c = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(c);
    });
  }
};
Ca.default = um;
var Da = {};
Object.defineProperty(Da, "__esModule", { value: !0 });
const An = ee, hl = V, dm = {
  message: ({ params: e }) => (0, An.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, An._)`{failingKeyword: ${e.ifClause}}`
}, fm = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: dm,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, hl.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Ei(n, "then"), a = Ei(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), c = t.name("_valid");
    if (l(), e.reset(), s && a) {
      const d = t.let("ifClause");
      e.setParams({ ifClause: d }), t.if(c, u("then", d), u("else", d));
    } else s ? t.if(c, u("then")) : t.if((0, An.not)(c), u("else"));
    e.pass(o, () => e.error(!0));
    function l() {
      const d = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, c);
      e.mergeEvaluated(d);
    }
    function u(d, h) {
      return () => {
        const E = e.subschema({ keyword: d }, c);
        t.assign(o, c), e.mergeValidEvaluated(E, o), h ? t.assign(h, (0, An._)`${d}`) : e.setParams({ ifClause: d });
      };
    }
  }
};
function Ei(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, hl.alwaysValidSchema)(e, r);
}
Da.default = fm;
var Ma = {};
Object.defineProperty(Ma, "__esModule", { value: !0 });
const hm = V, mm = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, hm.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Ma.default = mm;
Object.defineProperty(Sa, "__esModule", { value: !0 });
const pm = mr, $m = Pa, ym = pr, _m = Na, gm = Ra, vm = Xn, wm = Oa, Em = Bn, bm = Ia, Sm = Ta, Pm = ja, Nm = ka, Rm = Aa, Om = Ca, Im = Da, Tm = Ma;
function jm(e = !1) {
  const t = [
    // any
    Pm.default,
    Nm.default,
    Rm.default,
    Om.default,
    Im.default,
    Tm.default,
    // object
    wm.default,
    Em.default,
    vm.default,
    bm.default,
    Sm.default
  ];
  return e ? t.push($m.default, _m.default) : t.push(pm.default, ym.default), t.push(gm.default), t;
}
Sa.default = jm;
var Va = {}, $r = {};
Object.defineProperty($r, "__esModule", { value: !0 });
$r.dynamicAnchor = void 0;
const hs = ee, km = He, bi = Le, Am = vt, Cm = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => ml(e, e.schema)
};
function ml(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, hs._)`${km.default.dynamicAnchors}${(0, hs.getProperty)(t)}`, a = n.errSchemaPath === "#" ? n.validateName : Dm(e);
  r.if((0, hs._)`!${s}`, () => r.assign(s, a));
}
$r.dynamicAnchor = ml;
function Dm(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: a, localRefs: o, meta: c } = t.root, { schemaId: l } = n.opts, u = new bi.SchemaEnv({ schema: r, schemaId: l, root: s, baseId: a, localRefs: o, meta: c });
  return bi.compileSchema.call(n, u), (0, Am.getValidate)(e, u);
}
$r.default = Cm;
var yr = {};
Object.defineProperty(yr, "__esModule", { value: !0 });
yr.dynamicRef = void 0;
const Si = ee, Mm = He, Pi = vt, Vm = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => pl(e, e.schema)
};
function pl(e, t) {
  const { gen: r, keyword: n, it: s } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const a = t.slice(1);
  if (s.allErrors)
    o();
  else {
    const l = r.let("valid", !1);
    o(l), e.ok(l);
  }
  function o(l) {
    if (s.schemaEnv.root.dynamicAnchors[a]) {
      const u = r.let("_v", (0, Si._)`${Mm.default.dynamicAnchors}${(0, Si.getProperty)(a)}`);
      r.if(u, c(u, l), c(s.validateName, l));
    } else
      c(s.validateName, l)();
  }
  function c(l, u) {
    return u ? () => r.block(() => {
      (0, Pi.callRef)(e, l), r.let(u, !0);
    }) : () => (0, Pi.callRef)(e, l);
  }
}
yr.dynamicRef = pl;
yr.default = Vm;
var La = {};
Object.defineProperty(La, "__esModule", { value: !0 });
const Lm = $r, Fm = V, zm = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, Lm.dynamicAnchor)(e, "") : (0, Fm.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
La.default = zm;
var Fa = {};
Object.defineProperty(Fa, "__esModule", { value: !0 });
const Um = yr, qm = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, Um.dynamicRef)(e, e.schema)
};
Fa.default = qm;
Object.defineProperty(Va, "__esModule", { value: !0 });
const Gm = $r, Km = yr, Hm = La, Jm = Fa, Xm = [Gm.default, Km.default, Hm.default, Jm.default];
Va.default = Xm;
var za = {}, Ua = {};
Object.defineProperty(Ua, "__esModule", { value: !0 });
const Ni = Xn, Bm = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Ni.error,
  code: (e) => (0, Ni.validatePropertyDeps)(e)
};
Ua.default = Bm;
var qa = {};
Object.defineProperty(qa, "__esModule", { value: !0 });
const Wm = Xn, Ym = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, Wm.validateSchemaDeps)(e)
};
qa.default = Ym;
var Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
const Qm = V, Zm = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, Qm.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
Ga.default = Zm;
Object.defineProperty(za, "__esModule", { value: !0 });
const xm = Ua, ep = qa, tp = Ga, rp = [xm.default, ep.default, tp.default];
za.default = rp;
var Ka = {}, Ha = {};
Object.defineProperty(Ha, "__esModule", { value: !0 });
const Ot = ee, Ri = V, np = He, sp = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, Ot._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, ap = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: sp,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: c } = a;
    c instanceof Ot.Name ? t.if((0, Ot._)`${c} !== true`, () => t.forIn("key", n, (h) => t.if(u(c, h), () => l(h)))) : c !== !0 && t.forIn("key", n, (h) => c === void 0 ? l(h) : t.if(d(c, h), () => l(h))), a.props = !0, e.ok((0, Ot._)`${s} === ${np.default.errors}`);
    function l(h) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: h }), e.error(), o || t.break();
        return;
      }
      if (!(0, Ri.alwaysValidSchema)(a, r)) {
        const E = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: Ri.Type.Str
        }, E), o || t.if((0, Ot.not)(E), () => t.break());
      }
    }
    function u(h, E) {
      return (0, Ot._)`!${h} || !${h}[${E}]`;
    }
    function d(h, E) {
      const y = [];
      for (const $ in h)
        h[$] === !0 && y.push((0, Ot._)`${E} !== ${$}`);
      return (0, Ot.and)(...y);
    }
  }
};
Ha.default = ap;
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
const Gt = ee, Oi = V, op = {
  message: ({ params: { len: e } }) => (0, Gt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Gt._)`{limit: ${e}}`
}, ip = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: op,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, a = s.items || 0;
    if (a === !0)
      return;
    const o = t.const("len", (0, Gt._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: a }), e.fail((0, Gt._)`${o} > ${a}`);
    else if (typeof r == "object" && !(0, Oi.alwaysValidSchema)(s, r)) {
      const l = t.var("valid", (0, Gt._)`${o} <= ${a}`);
      t.if((0, Gt.not)(l), () => c(l, a)), e.ok(l);
    }
    s.items = !0;
    function c(l, u) {
      t.forRange("i", u, o, (d) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: d, dataPropType: Oi.Type.Num }, l), s.allErrors || t.if((0, Gt.not)(l), () => t.break());
      });
    }
  }
};
Ja.default = ip;
Object.defineProperty(Ka, "__esModule", { value: !0 });
const cp = Ha, lp = Ja, up = [cp.default, lp.default];
Ka.default = up;
var Xa = {}, Ba = {};
Object.defineProperty(Ba, "__esModule", { value: !0 });
const ge = ee, dp = {
  message: ({ schemaCode: e }) => (0, ge.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, ge._)`{format: ${e}}`
}, fp = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: dp,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: c } = e, { opts: l, errSchemaPath: u, schemaEnv: d, self: h } = c;
    if (!l.validateFormats)
      return;
    s ? E() : y();
    function E() {
      const $ = r.scopeValue("formats", {
        ref: h.formats,
        code: l.code.formats
      }), v = r.const("fDef", (0, ge._)`${$}[${o}]`), _ = r.let("fType"), m = r.let("format");
      r.if((0, ge._)`typeof ${v} == "object" && !(${v} instanceof RegExp)`, () => r.assign(_, (0, ge._)`${v}.type || "string"`).assign(m, (0, ge._)`${v}.validate`), () => r.assign(_, (0, ge._)`"string"`).assign(m, v)), e.fail$data((0, ge.or)(w(), P()));
      function w() {
        return l.strictSchema === !1 ? ge.nil : (0, ge._)`${o} && !${m}`;
      }
      function P() {
        const I = d.$async ? (0, ge._)`(${v}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, ge._)`${m}(${n})`, T = (0, ge._)`(typeof ${m} == "function" ? ${I} : ${m}.test(${n}))`;
        return (0, ge._)`${m} && ${m} !== true && ${_} === ${t} && !${T}`;
      }
    }
    function y() {
      const $ = h.formats[a];
      if (!$) {
        w();
        return;
      }
      if ($ === !0)
        return;
      const [v, _, m] = P($);
      v === t && e.pass(I());
      function w() {
        if (l.strictSchema === !1) {
          h.logger.warn(T());
          return;
        }
        throw new Error(T());
        function T() {
          return `unknown format "${a}" ignored in schema at path "${u}"`;
        }
      }
      function P(T) {
        const K = T instanceof RegExp ? (0, ge.regexpCode)(T) : l.code.formats ? (0, ge._)`${l.code.formats}${(0, ge.getProperty)(a)}` : void 0, Y = r.scopeValue("formats", { key: a, ref: T, code: K });
        return typeof T == "object" && !(T instanceof RegExp) ? [T.type || "string", T.validate, (0, ge._)`${Y}.validate`] : ["string", T, Y];
      }
      function I() {
        if (typeof $ == "object" && !($ instanceof RegExp) && $.async) {
          if (!d.$async)
            throw new Error("async format in sync schema");
          return (0, ge._)`await ${m}(${n})`;
        }
        return typeof _ == "function" ? (0, ge._)`${m}(${n})` : (0, ge._)`${m}.test(${n})`;
      }
    }
  }
};
Ba.default = fp;
Object.defineProperty(Xa, "__esModule", { value: !0 });
const hp = Ba, mp = [hp.default];
Xa.default = mp;
var ur = {};
Object.defineProperty(ur, "__esModule", { value: !0 });
ur.contentVocabulary = ur.metadataVocabulary = void 0;
ur.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
ur.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(la, "__esModule", { value: !0 });
const pp = ua, $p = fa, yp = Sa, _p = Va, gp = za, vp = Ka, wp = Xa, Ii = ur, Ep = [
  _p.default,
  pp.default,
  $p.default,
  (0, yp.default)(!0),
  wp.default,
  Ii.metadataVocabulary,
  Ii.contentVocabulary,
  gp.default,
  vp.default
];
la.default = Ep;
var Wa = {}, Wn = {};
Object.defineProperty(Wn, "__esModule", { value: !0 });
Wn.DiscrError = void 0;
var Ti;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Ti || (Wn.DiscrError = Ti = {}));
Object.defineProperty(Wa, "__esModule", { value: !0 });
const nr = ee, Cs = Wn, ji = Le, bp = hr, Sp = V, Pp = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Cs.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, nr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, Np = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Pp,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const c = n.propertyName;
    if (typeof c != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const l = t.let("valid", !1), u = t.const("tag", (0, nr._)`${r}${(0, nr.getProperty)(c)}`);
    t.if((0, nr._)`typeof ${u} == "string"`, () => d(), () => e.error(!1, { discrError: Cs.DiscrError.Tag, tag: u, tagName: c })), e.ok(l);
    function d() {
      const y = E();
      t.if(!1);
      for (const $ in y)
        t.elseIf((0, nr._)`${u} === ${$}`), t.assign(l, h(y[$]));
      t.else(), e.error(!1, { discrError: Cs.DiscrError.Mapping, tag: u, tagName: c }), t.endIf();
    }
    function h(y) {
      const $ = t.name("valid"), v = e.subschema({ keyword: "oneOf", schemaProp: y }, $);
      return e.mergeEvaluated(v, nr.Name), $;
    }
    function E() {
      var y;
      const $ = {}, v = m(s);
      let _ = !0;
      for (let I = 0; I < o.length; I++) {
        let T = o[I];
        if (T != null && T.$ref && !(0, Sp.schemaHasRulesButRef)(T, a.self.RULES)) {
          const Y = T.$ref;
          if (T = ji.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, Y), T instanceof ji.SchemaEnv && (T = T.schema), T === void 0)
            throw new bp.default(a.opts.uriResolver, a.baseId, Y);
        }
        const K = (y = T == null ? void 0 : T.properties) === null || y === void 0 ? void 0 : y[c];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${c}"`);
        _ = _ && (v || m(T)), w(K, I);
      }
      if (!_)
        throw new Error(`discriminator: "${c}" must be required`);
      return $;
      function m({ required: I }) {
        return Array.isArray(I) && I.includes(c);
      }
      function w(I, T) {
        if (I.const)
          P(I.const, T);
        else if (I.enum)
          for (const K of I.enum)
            P(K, T);
        else
          throw new Error(`discriminator: "properties/${c}" must have "const" or "enum"`);
      }
      function P(I, T) {
        if (typeof I != "string" || I in $)
          throw new Error(`discriminator: "${c}" values must be unique strings`);
        $[I] = T;
      }
    }
  }
};
Wa.default = Np;
var Ya = {};
const Rp = "https://json-schema.org/draft/2020-12/schema", Op = "https://json-schema.org/draft/2020-12/schema", Ip = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Tp = "meta", jp = "Core and Validation specifications meta-schema", kp = [
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
], Ap = [
  "object",
  "boolean"
], Cp = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", Dp = {
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
}, Mp = {
  $schema: Rp,
  $id: Op,
  $vocabulary: Ip,
  $dynamicAnchor: Tp,
  title: jp,
  allOf: kp,
  type: Ap,
  $comment: Cp,
  properties: Dp
}, Vp = "https://json-schema.org/draft/2020-12/schema", Lp = "https://json-schema.org/draft/2020-12/meta/applicator", Fp = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, zp = "meta", Up = "Applicator vocabulary meta-schema", qp = [
  "object",
  "boolean"
], Gp = {
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
}, Kp = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, Hp = {
  $schema: Vp,
  $id: Lp,
  $vocabulary: Fp,
  $dynamicAnchor: zp,
  title: Up,
  type: qp,
  properties: Gp,
  $defs: Kp
}, Jp = "https://json-schema.org/draft/2020-12/schema", Xp = "https://json-schema.org/draft/2020-12/meta/unevaluated", Bp = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, Wp = "meta", Yp = "Unevaluated applicator vocabulary meta-schema", Qp = [
  "object",
  "boolean"
], Zp = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, xp = {
  $schema: Jp,
  $id: Xp,
  $vocabulary: Bp,
  $dynamicAnchor: Wp,
  title: Yp,
  type: Qp,
  properties: Zp
}, e$ = "https://json-schema.org/draft/2020-12/schema", t$ = "https://json-schema.org/draft/2020-12/meta/content", r$ = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, n$ = "meta", s$ = "Content vocabulary meta-schema", a$ = [
  "object",
  "boolean"
], o$ = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, i$ = {
  $schema: e$,
  $id: t$,
  $vocabulary: r$,
  $dynamicAnchor: n$,
  title: s$,
  type: a$,
  properties: o$
}, c$ = "https://json-schema.org/draft/2020-12/schema", l$ = "https://json-schema.org/draft/2020-12/meta/core", u$ = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, d$ = "meta", f$ = "Core vocabulary meta-schema", h$ = [
  "object",
  "boolean"
], m$ = {
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
}, p$ = {
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
}, $$ = {
  $schema: c$,
  $id: l$,
  $vocabulary: u$,
  $dynamicAnchor: d$,
  title: f$,
  type: h$,
  properties: m$,
  $defs: p$
}, y$ = "https://json-schema.org/draft/2020-12/schema", _$ = "https://json-schema.org/draft/2020-12/meta/format-annotation", g$ = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, v$ = "meta", w$ = "Format vocabulary meta-schema for annotation results", E$ = [
  "object",
  "boolean"
], b$ = {
  format: {
    type: "string"
  }
}, S$ = {
  $schema: y$,
  $id: _$,
  $vocabulary: g$,
  $dynamicAnchor: v$,
  title: w$,
  type: E$,
  properties: b$
}, P$ = "https://json-schema.org/draft/2020-12/schema", N$ = "https://json-schema.org/draft/2020-12/meta/meta-data", R$ = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, O$ = "meta", I$ = "Meta-data vocabulary meta-schema", T$ = [
  "object",
  "boolean"
], j$ = {
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
}, k$ = {
  $schema: P$,
  $id: N$,
  $vocabulary: R$,
  $dynamicAnchor: O$,
  title: I$,
  type: T$,
  properties: j$
}, A$ = "https://json-schema.org/draft/2020-12/schema", C$ = "https://json-schema.org/draft/2020-12/meta/validation", D$ = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, M$ = "meta", V$ = "Validation vocabulary meta-schema", L$ = [
  "object",
  "boolean"
], F$ = {
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
}, z$ = {
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
}, U$ = {
  $schema: A$,
  $id: C$,
  $vocabulary: D$,
  $dynamicAnchor: M$,
  title: V$,
  type: L$,
  properties: F$,
  $defs: z$
};
Object.defineProperty(Ya, "__esModule", { value: !0 });
const q$ = Mp, G$ = Hp, K$ = xp, H$ = i$, J$ = $$, X$ = S$, B$ = k$, W$ = U$, Y$ = ["/properties"];
function Q$(e) {
  return [
    q$,
    G$,
    K$,
    H$,
    J$,
    t(this, X$),
    B$,
    t(this, W$)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, Y$) : n;
  }
}
Ya.default = Q$;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = Ac, n = la, s = Wa, a = Ya, o = "https://json-schema.org/draft/2020-12/schema";
  class c extends r.default {
    constructor(y = {}) {
      super({
        ...y,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((y) => this.addVocabulary(y)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: y, meta: $ } = this.opts;
      $ && (a.default.call(this, y), this.refs["http://json-schema.org/schema"] = o);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
    }
  }
  t.Ajv2020 = c, e.exports = t = c, e.exports.Ajv2020 = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var l = Gn();
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return l.KeywordCxt;
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
  var d = na();
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return d.default;
  } });
  var h = hr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(Ns, Ns.exports);
var Z$ = Ns.exports, Ds = { exports: {} }, $l = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(G, W) {
    return { validate: G, compare: W };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(a, o),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(l(!0), u),
    "date-time": t(E(!0), y),
    "iso-time": t(l(), d),
    "iso-date-time": t(E(), $),
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
    regex: $e,
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
    int32: { type: "number", validate: K },
    // signed 64 bit integer
    int64: { type: "number", validate: Y },
    // C-type float
    float: { type: "number", validate: ce },
    // C-type double
    double: { type: "number", validate: ce },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, o),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, u),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, y),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, d),
    "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, $),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(G) {
    return G % 4 === 0 && (G % 100 !== 0 || G % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function a(G) {
    const W = n.exec(G);
    if (!W)
      return !1;
    const Q = +W[1], j = +W[2], D = +W[3];
    return j >= 1 && j <= 12 && D >= 1 && D <= (j === 2 && r(Q) ? 29 : s[j]);
  }
  function o(G, W) {
    if (G && W)
      return G > W ? 1 : G < W ? -1 : 0;
  }
  const c = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function l(G) {
    return function(Q) {
      const j = c.exec(Q);
      if (!j)
        return !1;
      const D = +j[1], U = +j[2], L = +j[3], X = j[4], z = j[5] === "-" ? -1 : 1, N = +(j[6] || 0), p = +(j[7] || 0);
      if (N > 23 || p > 59 || G && !X)
        return !1;
      if (D <= 23 && U <= 59 && L < 60)
        return !0;
      const S = U - p * z, g = D - N * z - (S < 0 ? 1 : 0);
      return (g === 23 || g === -1) && (S === 59 || S === -1) && L < 61;
    };
  }
  function u(G, W) {
    if (!(G && W))
      return;
    const Q = (/* @__PURE__ */ new Date("2020-01-01T" + G)).valueOf(), j = (/* @__PURE__ */ new Date("2020-01-01T" + W)).valueOf();
    if (Q && j)
      return Q - j;
  }
  function d(G, W) {
    if (!(G && W))
      return;
    const Q = c.exec(G), j = c.exec(W);
    if (Q && j)
      return G = Q[1] + Q[2] + Q[3], W = j[1] + j[2] + j[3], G > W ? 1 : G < W ? -1 : 0;
  }
  const h = /t|\s/i;
  function E(G) {
    const W = l(G);
    return function(j) {
      const D = j.split(h);
      return D.length === 2 && a(D[0]) && W(D[1]);
    };
  }
  function y(G, W) {
    if (!(G && W))
      return;
    const Q = new Date(G).valueOf(), j = new Date(W).valueOf();
    if (Q && j)
      return Q - j;
  }
  function $(G, W) {
    if (!(G && W))
      return;
    const [Q, j] = G.split(h), [D, U] = W.split(h), L = o(Q, D);
    if (L !== void 0)
      return L || u(j, U);
  }
  const v = /\/|:/, _ = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(G) {
    return v.test(G) && _.test(G);
  }
  const w = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function P(G) {
    return w.lastIndex = 0, w.test(G);
  }
  const I = -(2 ** 31), T = 2 ** 31 - 1;
  function K(G) {
    return Number.isInteger(G) && G <= T && G >= I;
  }
  function Y(G) {
    return Number.isInteger(G);
  }
  function ce() {
    return !0;
  }
  const de = /[^\\]\\Z/;
  function $e(G) {
    if (de.test(G))
      return !1;
    try {
      return new RegExp(G), !0;
    } catch {
      return !1;
    }
  }
})($l);
var yl = {}, Ms = { exports: {} }, _l = {}, rt = {}, dr = {}, Yr = {}, se = {}, Xr = {};
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
      c(P, w[I]), P.push(m[++I]);
    return new n(P);
  }
  e._ = s;
  const a = new n("+");
  function o(m, ...w) {
    const P = [y(m[0])];
    let I = 0;
    for (; I < w.length; )
      P.push(a), c(P, w[I]), P.push(a, y(m[++I]));
    return l(P), new n(P);
  }
  e.str = o;
  function c(m, w) {
    w instanceof n ? m.push(...w._items) : w instanceof r ? m.push(w) : m.push(h(w));
  }
  e.addCodeArg = c;
  function l(m) {
    let w = 1;
    for (; w < m.length - 1; ) {
      if (m[w] === a) {
        const P = u(m[w - 1], m[w + 1]);
        if (P !== void 0) {
          m.splice(w - 1, 3, P);
          continue;
        }
        m[w++] = "+";
      }
      w++;
    }
  }
  function u(m, w) {
    if (w === '""')
      return m;
    if (m === '""')
      return w;
    if (typeof m == "string")
      return w instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof w != "string" ? `${m.slice(0, -1)}${w}"` : w[0] === '"' ? m.slice(0, -1) + w.slice(1) : void 0;
    if (typeof w == "string" && w[0] === '"' && !(m instanceof r))
      return `"${m}${w.slice(1)}`;
  }
  function d(m, w) {
    return w.emptyStr() ? m : m.emptyStr() ? w : o`${m}${w}`;
  }
  e.strConcat = d;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : y(Array.isArray(m) ? m.join(",") : m);
  }
  function E(m) {
    return new n(y(m));
  }
  e.stringify = E;
  function y(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = y;
  function $(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = $;
  function v(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = v;
  function _(m) {
    return new n(m.toString());
  }
  e.regexpCode = _;
})(Xr);
var Vs = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = Xr;
  class r extends Error {
    constructor(u) {
      super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
    }
  }
  var n;
  (function(l) {
    l[l.Started = 0] = "Started", l[l.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: u, parent: d } = {}) {
      this._names = {}, this._prefixes = u, this._parent = d;
    }
    toName(u) {
      return u instanceof t.Name ? u : this.name(u);
    }
    name(u) {
      return new t.Name(this._newName(u));
    }
    _newName(u) {
      const d = this._names[u] || this._nameGroup(u);
      return `${u}${d.index++}`;
    }
    _nameGroup(u) {
      var d, h;
      if (!((h = (d = this._parent) === null || d === void 0 ? void 0 : d._prefixes) === null || h === void 0) && h.has(u) || this._prefixes && !this._prefixes.has(u))
        throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
      return this._names[u] = { prefix: u, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(u, d) {
      super(d), this.prefix = u;
    }
    setValue(u, { property: d, itemIndex: h }) {
      this.value = u, this.scopePath = (0, t._)`.${new t.Name(d)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const o = (0, t._)`\n`;
  class c extends s {
    constructor(u) {
      super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(u) {
      return new a(u, this._newName(u));
    }
    value(u, d) {
      var h;
      if (d.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const E = this.toName(u), { prefix: y } = E, $ = (h = d.key) !== null && h !== void 0 ? h : d.ref;
      let v = this._values[y];
      if (v) {
        const w = v.get($);
        if (w)
          return w;
      } else
        v = this._values[y] = /* @__PURE__ */ new Map();
      v.set($, E);
      const _ = this._scope[y] || (this._scope[y] = []), m = _.length;
      return _[m] = d.ref, E.setValue(d, { property: y, itemIndex: m }), E;
    }
    getValue(u, d) {
      const h = this._values[u];
      if (h)
        return h.get(d);
    }
    scopeRefs(u, d = this._values) {
      return this._reduceValues(d, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${u}${h.scopePath}`;
      });
    }
    scopeCode(u = this._values, d, h) {
      return this._reduceValues(u, (E) => {
        if (E.value === void 0)
          throw new Error(`CodeGen: name "${E}" has no value`);
        return E.value.code;
      }, d, h);
    }
    _reduceValues(u, d, h = {}, E) {
      let y = t.nil;
      for (const $ in u) {
        const v = u[$];
        if (!v)
          continue;
        const _ = h[$] = h[$] || /* @__PURE__ */ new Map();
        v.forEach((m) => {
          if (_.has(m))
            return;
          _.set(m, n.Started);
          let w = d(m);
          if (w) {
            const P = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            y = (0, t._)`${y}${P} ${m} = ${w};${this.opts._n}`;
          } else if (w = E == null ? void 0 : E(m))
            y = (0, t._)`${y}${w}${this.opts._n}`;
          else
            throw new r(m);
          _.set(m, n.Completed);
        });
      }
      return y;
    }
  }
  e.ValueScope = c;
})(Vs);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Xr, r = Vs;
  var n = Xr;
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
    constructor(i, f, b) {
      super(), this.varKind = i, this.name = f, this.rhs = b;
    }
    render({ es5: i, _n: f }) {
      const b = i ? r.varKinds.var : this.varKind, k = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${b} ${this.name}${k};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = j(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class c extends a {
    constructor(i, f, b) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = b;
    }
    render({ _n: i }) {
      return `${this.lhs} = ${this.rhs};` + i;
    }
    optimizeNames(i, f) {
      if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
        return this.rhs = j(this.rhs, i, f), this;
    }
    get names() {
      const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return Q(i, this.rhs);
    }
  }
  class l extends c {
    constructor(i, f, b, k) {
      super(i, b, k), this.op = f;
    }
    render({ _n: i }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + i;
    }
  }
  class u extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `${this.label}:` + i;
    }
  }
  class d extends a {
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
  class E extends a {
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
      return this.code = j(this.code, i, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class y extends a {
    constructor(i = []) {
      super(), this.nodes = i;
    }
    render(i) {
      return this.nodes.reduce((f, b) => f + b.render(i), "");
    }
    optimizeNodes() {
      const { nodes: i } = this;
      let f = i.length;
      for (; f--; ) {
        const b = i[f].optimizeNodes();
        Array.isArray(b) ? i.splice(f, 1, ...b) : b ? i[f] = b : i.splice(f, 1);
      }
      return i.length > 0 ? this : void 0;
    }
    optimizeNames(i, f) {
      const { nodes: b } = this;
      let k = b.length;
      for (; k--; ) {
        const A = b[k];
        A.optimizeNames(i, f) || (D(i, A.names), b.splice(k, 1));
      }
      return b.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => W(i, f.names), {});
    }
  }
  class $ extends y {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class v extends y {
  }
  class _ extends $ {
  }
  _.kind = "else";
  class m extends $ {
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
        const b = f.optimizeNodes();
        f = this.else = Array.isArray(b) ? new _(b) : b;
      }
      if (f)
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(U(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var b;
      if (this.else = (b = this.else) === null || b === void 0 ? void 0 : b.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = j(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return Q(i, this.condition), this.else && W(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class w extends $ {
  }
  w.kind = "for";
  class P extends w {
    constructor(i) {
      super(), this.iteration = i;
    }
    render(i) {
      return `for(${this.iteration})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iteration = j(this.iteration, i, f), this;
    }
    get names() {
      return W(super.names, this.iteration.names);
    }
  }
  class I extends w {
    constructor(i, f, b, k) {
      super(), this.varKind = i, this.name = f, this.from = b, this.to = k;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: b, from: k, to: A } = this;
      return `for(${f} ${b}=${k}; ${b}<${A}; ${b}++)` + super.render(i);
    }
    get names() {
      const i = Q(super.names, this.from);
      return Q(i, this.to);
    }
  }
  class T extends w {
    constructor(i, f, b, k) {
      super(), this.loop = i, this.varKind = f, this.name = b, this.iterable = k;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = j(this.iterable, i, f), this;
    }
    get names() {
      return W(super.names, this.iterable.names);
    }
  }
  class K extends $ {
    constructor(i, f, b) {
      super(), this.name = i, this.args = f, this.async = b;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  K.kind = "func";
  class Y extends y {
    render(i) {
      return "return " + super.render(i);
    }
  }
  Y.kind = "return";
  class ce extends $ {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var b, k;
      return super.optimizeNames(i, f), (b = this.catch) === null || b === void 0 || b.optimizeNames(i, f), (k = this.finally) === null || k === void 0 || k.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && W(i, this.catch.names), this.finally && W(i, this.finally.names), i;
    }
  }
  class de extends $ {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  de.kind = "catch";
  class $e extends $ {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  $e.kind = "finally";
  class G {
    constructor(i, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = i, this._scope = new r.Scope({ parent: i }), this._nodes = [new v()];
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
      const b = this._extScope.value(i, f);
      return (this._values[b.prefix] || (this._values[b.prefix] = /* @__PURE__ */ new Set())).add(b), b;
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
    _def(i, f, b, k) {
      const A = this._scope.toName(f);
      return b !== void 0 && k && (this._constants[A.str] = b), this._leafNode(new o(i, A, b)), A;
    }
    // `const` declaration (`var` in es5 mode)
    const(i, f, b) {
      return this._def(r.varKinds.const, i, f, b);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(i, f, b) {
      return this._def(r.varKinds.let, i, f, b);
    }
    // `var` declaration with optional assignment
    var(i, f, b) {
      return this._def(r.varKinds.var, i, f, b);
    }
    // assignment code
    assign(i, f, b) {
      return this._leafNode(new c(i, f, b));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new l(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new E(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [b, k] of i)
        f.length > 1 && f.push(","), f.push(b), (b !== k || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, k));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(i, f, b) {
      if (this._blockNode(new m(i)), f && b)
        this.code(f).else().code(b).endIf();
      else if (f)
        this.code(f).endIf();
      else if (b)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(i) {
      return this._elseNode(new m(i));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new _());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, _);
    }
    _for(i, f) {
      return this._blockNode(i), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(i, f) {
      return this._for(new P(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, b, k, A = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const H = this._scope.toName(i);
      return this._for(new I(A, H, f, b), () => k(H));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, k = r.varKinds.const) {
      const A = this._scope.toName(i);
      if (this.opts.es5) {
        const H = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${H}.length`, (q) => {
          this.var(A, (0, t._)`${H}[${q}]`), b(A);
        });
      }
      return this._for(new T("of", k, A, f), () => b(A));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, b, k = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, b);
      const A = this._scope.toName(i);
      return this._for(new T("in", k, A, f), () => b(A));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(w);
    }
    // `label` statement
    label(i) {
      return this._leafNode(new u(i));
    }
    // `break` statement
    break(i) {
      return this._leafNode(new d(i));
    }
    // `return` statement
    return(i) {
      const f = new Y();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(Y);
    }
    // `try` statement
    try(i, f, b) {
      if (!f && !b)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const k = new ce();
      if (this._blockNode(k), this.code(i), f) {
        const A = this.name("e");
        this._currNode = k.catch = new de(A), f(A);
      }
      return b && (this._currNode = k.finally = new $e(), this.code(b)), this._endBlockNode(de, $e);
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
      const b = this._nodes.length - f;
      if (b < 0 || i !== void 0 && b !== i)
        throw new Error(`CodeGen: wrong number of nodes: ${b} vs ${i} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(i, f = t.nil, b, k) {
      return this._blockNode(new K(i, f, b)), k && this.code(k).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(K);
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
      const b = this._currNode;
      if (b instanceof i || f && b instanceof f)
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
  e.CodeGen = G;
  function W(g, i) {
    for (const f in i)
      g[f] = (g[f] || 0) + (i[f] || 0);
    return g;
  }
  function Q(g, i) {
    return i instanceof t._CodeOrName ? W(g, i.names) : g;
  }
  function j(g, i, f) {
    if (g instanceof t.Name)
      return b(g);
    if (!k(g))
      return g;
    return new t._Code(g._items.reduce((A, H) => (H instanceof t.Name && (H = b(H)), H instanceof t._Code ? A.push(...H._items) : A.push(H), A), []));
    function b(A) {
      const H = f[A.str];
      return H === void 0 || i[A.str] !== 1 ? A : (delete i[A.str], H);
    }
    function k(A) {
      return A instanceof t._Code && A._items.some((H) => H instanceof t.Name && i[H.str] === 1 && f[H.str] !== void 0);
    }
  }
  function D(g, i) {
    for (const f in i)
      g[f] = (g[f] || 0) - (i[f] || 0);
  }
  function U(g) {
    return typeof g == "boolean" || typeof g == "number" || g === null ? !g : (0, t._)`!${S(g)}`;
  }
  e.not = U;
  const L = p(e.operators.AND);
  function X(...g) {
    return g.reduce(L);
  }
  e.and = X;
  const z = p(e.operators.OR);
  function N(...g) {
    return g.reduce(z);
  }
  e.or = N;
  function p(g) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${S(i)} ${g} ${S(f)}`;
  }
  function S(g) {
    return g instanceof t.Name ? g : (0, t._)`(${g})`;
  }
})(se);
var F = {};
Object.defineProperty(F, "__esModule", { value: !0 });
F.checkStrictMode = F.getErrorPath = F.Type = F.useFunc = F.setEvaluated = F.evaluatedPropsToName = F.mergeEvaluated = F.eachItem = F.unescapeJsonPointer = F.escapeJsonPointer = F.escapeFragment = F.unescapeFragment = F.schemaRefOrVal = F.schemaHasRulesButRef = F.schemaHasRules = F.checkUnknownRules = F.alwaysValidSchema = F.toHash = void 0;
const ue = se, x$ = Xr;
function ey(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
F.toHash = ey;
function ty(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (gl(e, t), !vl(t, e.self.RULES.all));
}
F.alwaysValidSchema = ty;
function gl(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || bl(e, `unknown keyword: "${a}"`);
}
F.checkUnknownRules = gl;
function vl(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
F.schemaHasRules = vl;
function ry(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
F.schemaHasRulesButRef = ry;
function ny({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ue._)`${r}`;
  }
  return (0, ue._)`${e}${t}${(0, ue.getProperty)(n)}`;
}
F.schemaRefOrVal = ny;
function sy(e) {
  return wl(decodeURIComponent(e));
}
F.unescapeFragment = sy;
function ay(e) {
  return encodeURIComponent(Qa(e));
}
F.escapeFragment = ay;
function Qa(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
F.escapeJsonPointer = Qa;
function wl(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
F.unescapeJsonPointer = wl;
function oy(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
F.eachItem = oy;
function ki({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, c) => {
    const l = o === void 0 ? a : o instanceof ue.Name ? (a instanceof ue.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof ue.Name ? (t(s, o, a), a) : r(a, o);
    return c === ue.Name && !(l instanceof ue.Name) ? n(s, l) : l;
  };
}
F.mergeEvaluated = {
  props: ki({
    mergeNames: (e, t, r) => e.if((0, ue._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ue._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ue._)`${r} || {}`).code((0, ue._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ue._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ue._)`${r} || {}`), Za(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: El
  }),
  items: ki({
    mergeNames: (e, t, r) => e.if((0, ue._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ue._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ue._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ue._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function El(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ue._)`{}`);
  return t !== void 0 && Za(e, r, t), r;
}
F.evaluatedPropsToName = El;
function Za(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ue._)`${t}${(0, ue.getProperty)(n)}`, !0));
}
F.setEvaluated = Za;
const Ai = {};
function iy(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Ai[t.code] || (Ai[t.code] = new x$._Code(t.code))
  });
}
F.useFunc = iy;
var Ls;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Ls || (F.Type = Ls = {}));
function cy(e, t, r) {
  if (e instanceof ue.Name) {
    const n = t === Ls.Num;
    return r ? n ? (0, ue._)`"[" + ${e} + "]"` : (0, ue._)`"['" + ${e} + "']"` : n ? (0, ue._)`"/" + ${e}` : (0, ue._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ue.getProperty)(e).toString() : "/" + Qa(e);
}
F.getErrorPath = cy;
function bl(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
F.checkStrictMode = bl;
var ut = {};
Object.defineProperty(ut, "__esModule", { value: !0 });
const Ae = se, ly = {
  // validation function arguments
  data: new Ae.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Ae.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Ae.Name("instancePath"),
  parentData: new Ae.Name("parentData"),
  parentDataProperty: new Ae.Name("parentDataProperty"),
  rootData: new Ae.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Ae.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Ae.Name("vErrors"),
  // null or array of validation errors
  errors: new Ae.Name("errors"),
  // counter of validation errors
  this: new Ae.Name("this"),
  // "globals"
  self: new Ae.Name("self"),
  scope: new Ae.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Ae.Name("json"),
  jsonPos: new Ae.Name("jsonPos"),
  jsonLen: new Ae.Name("jsonLen"),
  jsonPart: new Ae.Name("jsonPart")
};
ut.default = ly;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = se, r = F, n = ut;
  e.keywordError = {
    message: ({ keyword: _ }) => (0, t.str)`must pass "${_}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: _, schemaType: m }) => m ? (0, t.str)`"${_}" keyword must be ${m} ($data)` : (0, t.str)`"${_}" keyword is invalid ($data)`
  };
  function s(_, m = e.keywordError, w, P) {
    const { it: I } = _, { gen: T, compositeRule: K, allErrors: Y } = I, ce = h(_, m, w);
    P ?? (K || Y) ? l(T, ce) : u(I, (0, t._)`[${ce}]`);
  }
  e.reportError = s;
  function a(_, m = e.keywordError, w) {
    const { it: P } = _, { gen: I, compositeRule: T, allErrors: K } = P, Y = h(_, m, w);
    l(I, Y), T || K || u(P, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o(_, m) {
    _.assign(n.default.errors, m), _.if((0, t._)`${n.default.vErrors} !== null`, () => _.if(m, () => _.assign((0, t._)`${n.default.vErrors}.length`, m), () => _.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function c({ gen: _, keyword: m, schemaValue: w, data: P, errsCount: I, it: T }) {
    if (I === void 0)
      throw new Error("ajv implementation error");
    const K = _.name("err");
    _.forRange("i", I, n.default.errors, (Y) => {
      _.const(K, (0, t._)`${n.default.vErrors}[${Y}]`), _.if((0, t._)`${K}.instancePath === undefined`, () => _.assign((0, t._)`${K}.instancePath`, (0, t.strConcat)(n.default.instancePath, T.errorPath))), _.assign((0, t._)`${K}.schemaPath`, (0, t.str)`${T.errSchemaPath}/${m}`), T.opts.verbose && (_.assign((0, t._)`${K}.schema`, w), _.assign((0, t._)`${K}.data`, P));
    });
  }
  e.extendErrors = c;
  function l(_, m) {
    const w = _.const("err", m);
    _.if((0, t._)`${n.default.vErrors} === null`, () => _.assign(n.default.vErrors, (0, t._)`[${w}]`), (0, t._)`${n.default.vErrors}.push(${w})`), _.code((0, t._)`${n.default.errors}++`);
  }
  function u(_, m) {
    const { gen: w, validateName: P, schemaEnv: I } = _;
    I.$async ? w.throw((0, t._)`new ${_.ValidationError}(${m})`) : (w.assign((0, t._)`${P}.errors`, m), w.return(!1));
  }
  const d = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h(_, m, w) {
    const { createErrors: P } = _.it;
    return P === !1 ? (0, t._)`{}` : E(_, m, w);
  }
  function E(_, m, w = {}) {
    const { gen: P, it: I } = _, T = [
      y(I, w),
      $(_, w)
    ];
    return v(_, m, T), P.object(...T);
  }
  function y({ errorPath: _ }, { instancePath: m }) {
    const w = m ? (0, t.str)`${_}${(0, r.getErrorPath)(m, r.Type.Str)}` : _;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, w)];
  }
  function $({ keyword: _, it: { errSchemaPath: m } }, { schemaPath: w, parentSchema: P }) {
    let I = P ? m : (0, t.str)`${m}/${_}`;
    return w && (I = (0, t.str)`${I}${(0, r.getErrorPath)(w, r.Type.Str)}`), [d.schemaPath, I];
  }
  function v(_, { params: m, message: w }, P) {
    const { keyword: I, data: T, schemaValue: K, it: Y } = _, { opts: ce, propertyName: de, topSchemaRef: $e, schemaPath: G } = Y;
    P.push([d.keyword, I], [d.params, typeof m == "function" ? m(_) : m || (0, t._)`{}`]), ce.messages && P.push([d.message, typeof w == "function" ? w(_) : w]), ce.verbose && P.push([d.schema, K], [d.parentSchema, (0, t._)`${$e}${G}`], [n.default.data, T]), de && P.push([d.propertyName, de]);
  }
})(Yr);
Object.defineProperty(dr, "__esModule", { value: !0 });
dr.boolOrEmptySchema = dr.topBoolOrEmptySchema = void 0;
const uy = Yr, dy = se, fy = ut, hy = {
  message: "boolean schema is false"
};
function my(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Sl(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(fy.default.data) : (t.assign((0, dy._)`${n}.errors`, null), t.return(!0));
}
dr.topBoolOrEmptySchema = my;
function py(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Sl(e)) : r.var(t, !0);
}
dr.boolOrEmptySchema = py;
function Sl(e, t) {
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
  (0, uy.reportError)(s, hy, void 0, t);
}
var Ee = {}, Wt = {};
Object.defineProperty(Wt, "__esModule", { value: !0 });
Wt.getRules = Wt.isJSONType = void 0;
const $y = ["string", "number", "integer", "boolean", "null", "object", "array"], yy = new Set($y);
function _y(e) {
  return typeof e == "string" && yy.has(e);
}
Wt.isJSONType = _y;
function gy() {
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
Wt.getRules = gy;
var yt = {};
Object.defineProperty(yt, "__esModule", { value: !0 });
yt.shouldUseRule = yt.shouldUseGroup = yt.schemaHasRulesForType = void 0;
function vy({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Pl(e, n);
}
yt.schemaHasRulesForType = vy;
function Pl(e, t) {
  return t.rules.some((r) => Nl(e, r));
}
yt.shouldUseGroup = Pl;
function Nl(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
yt.shouldUseRule = Nl;
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.reportTypeError = Ee.checkDataTypes = Ee.checkDataType = Ee.coerceAndCheckDataType = Ee.getJSONTypes = Ee.getSchemaTypes = Ee.DataType = void 0;
const wy = Wt, Ey = yt, by = Yr, re = se, Rl = F;
var cr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(cr || (Ee.DataType = cr = {}));
function Sy(e) {
  const t = Ol(e.type);
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
Ee.getSchemaTypes = Sy;
function Ol(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(wy.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
Ee.getJSONTypes = Ol;
function Py(e, t) {
  const { gen: r, data: n, opts: s } = e, a = Ny(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, Ey.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const c = xa(t, n, s.strictNumbers, cr.Wrong);
    r.if(c, () => {
      a.length ? Ry(e, t, a) : eo(e);
    });
  }
  return o;
}
Ee.coerceAndCheckDataType = Py;
const Il = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function Ny(e, t) {
  return t ? e.filter((r) => Il.has(r) || t === "array" && r === "array") : [];
}
function Ry(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, re._)`typeof ${s}`), c = n.let("coerced", (0, re._)`undefined`);
  a.coerceTypes === "array" && n.if((0, re._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, re._)`${s}[0]`).assign(o, (0, re._)`typeof ${s}`).if(xa(t, s, a.strictNumbers), () => n.assign(c, s))), n.if((0, re._)`${c} !== undefined`);
  for (const u of r)
    (Il.has(u) || u === "array" && a.coerceTypes === "array") && l(u);
  n.else(), eo(e), n.endIf(), n.if((0, re._)`${c} !== undefined`, () => {
    n.assign(s, c), Oy(e, c);
  });
  function l(u) {
    switch (u) {
      case "string":
        n.elseIf((0, re._)`${o} == "number" || ${o} == "boolean"`).assign(c, (0, re._)`"" + ${s}`).elseIf((0, re._)`${s} === null`).assign(c, (0, re._)`""`);
        return;
      case "number":
        n.elseIf((0, re._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(c, (0, re._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, re._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(c, (0, re._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, re._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(c, !1).elseIf((0, re._)`${s} === "true" || ${s} === 1`).assign(c, !0);
        return;
      case "null":
        n.elseIf((0, re._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(c, null);
        return;
      case "array":
        n.elseIf((0, re._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(c, (0, re._)`[${s}]`);
    }
  }
}
function Oy({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, re._)`${t} !== undefined`, () => e.assign((0, re._)`${t}[${r}]`, n));
}
function Fs(e, t, r, n = cr.Correct) {
  const s = n === cr.Correct ? re.operators.EQ : re.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, re._)`${t} ${s} null`;
    case "array":
      a = (0, re._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, re._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, re._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, re._)`typeof ${t} ${s} ${e}`;
  }
  return n === cr.Correct ? a : (0, re.not)(a);
  function o(c = re.nil) {
    return (0, re.and)((0, re._)`typeof ${t} == "number"`, c, r ? (0, re._)`isFinite(${t})` : re.nil);
  }
}
Ee.checkDataType = Fs;
function xa(e, t, r, n) {
  if (e.length === 1)
    return Fs(e[0], t, r, n);
  let s;
  const a = (0, Rl.toHash)(e);
  if (a.array && a.object) {
    const o = (0, re._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, re._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = re.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, re.and)(s, Fs(o, t, r, n));
  return s;
}
Ee.checkDataTypes = xa;
const Iy = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, re._)`{type: ${e}}` : (0, re._)`{type: ${t}}`
};
function eo(e) {
  const t = Ty(e);
  (0, by.reportError)(t, Iy);
}
Ee.reportTypeError = eo;
function Ty(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Rl.schemaRefOrVal)(e, n, "type");
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
var Yn = {};
Object.defineProperty(Yn, "__esModule", { value: !0 });
Yn.assignDefaults = void 0;
const Zt = se, jy = F;
function ky(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Ci(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => Ci(e, a, s.default));
}
Yn.assignDefaults = ky;
function Ci(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const c = (0, Zt._)`${a}${(0, Zt.getProperty)(t)}`;
  if (s) {
    (0, jy.checkStrictMode)(e, `default is ignored for: ${c}`);
    return;
  }
  let l = (0, Zt._)`${c} === undefined`;
  o.useDefaults === "empty" && (l = (0, Zt._)`${l} || ${c} === null || ${c} === ""`), n.if(l, (0, Zt._)`${c} = ${(0, Zt.stringify)(r)}`);
}
var lt = {}, ie = {};
Object.defineProperty(ie, "__esModule", { value: !0 });
ie.validateUnion = ie.validateArray = ie.usePattern = ie.callValidateCode = ie.schemaProperties = ie.allSchemaProperties = ie.noPropertyInData = ie.propertyInData = ie.isOwnProperty = ie.hasPropFunc = ie.reportMissingProp = ie.checkMissingProp = ie.checkReportMissingProp = void 0;
const he = se, to = F, Nt = ut, Ay = F;
function Cy(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(no(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, he._)`${t}` }, !0), e.error();
  });
}
ie.checkReportMissingProp = Cy;
function Dy({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, he.or)(...n.map((a) => (0, he.and)(no(e, t, a, r.ownProperties), (0, he._)`${s} = ${a}`)));
}
ie.checkMissingProp = Dy;
function My(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ie.reportMissingProp = My;
function Tl(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, he._)`Object.prototype.hasOwnProperty`
  });
}
ie.hasPropFunc = Tl;
function ro(e, t, r) {
  return (0, he._)`${Tl(e)}.call(${t}, ${r})`;
}
ie.isOwnProperty = ro;
function Vy(e, t, r, n) {
  const s = (0, he._)`${t}${(0, he.getProperty)(r)} !== undefined`;
  return n ? (0, he._)`${s} && ${ro(e, t, r)}` : s;
}
ie.propertyInData = Vy;
function no(e, t, r, n) {
  const s = (0, he._)`${t}${(0, he.getProperty)(r)} === undefined`;
  return n ? (0, he.or)(s, (0, he.not)(ro(e, t, r))) : s;
}
ie.noPropertyInData = no;
function jl(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ie.allSchemaProperties = jl;
function Ly(e, t) {
  return jl(t).filter((r) => !(0, to.alwaysValidSchema)(e, t[r]));
}
ie.schemaProperties = Ly;
function Fy({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, c, l, u) {
  const d = u ? (0, he._)`${e}, ${t}, ${n}${s}` : t, h = [
    [Nt.default.instancePath, (0, he.strConcat)(Nt.default.instancePath, a)],
    [Nt.default.parentData, o.parentData],
    [Nt.default.parentDataProperty, o.parentDataProperty],
    [Nt.default.rootData, Nt.default.rootData]
  ];
  o.opts.dynamicRef && h.push([Nt.default.dynamicAnchors, Nt.default.dynamicAnchors]);
  const E = (0, he._)`${d}, ${r.object(...h)}`;
  return l !== he.nil ? (0, he._)`${c}.call(${l}, ${E})` : (0, he._)`${c}(${E})`;
}
ie.callValidateCode = Fy;
const zy = (0, he._)`new RegExp`;
function Uy({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, he._)`${s.code === "new RegExp" ? zy : (0, Ay.useFunc)(e, s)}(${r}, ${n})`
  });
}
ie.usePattern = Uy;
function qy(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const c = t.let("valid", !0);
    return o(() => t.assign(c, !1)), c;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(c) {
    const l = t.const("len", (0, he._)`${r}.length`);
    t.forRange("i", 0, l, (u) => {
      e.subschema({
        keyword: n,
        dataProp: u,
        dataPropType: to.Type.Num
      }, a), t.if((0, he.not)(a), c);
    });
  }
}
ie.validateArray = qy;
function Gy(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((l) => (0, to.alwaysValidSchema)(s, l)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), c = t.name("_valid");
  t.block(() => r.forEach((l, u) => {
    const d = e.subschema({
      keyword: n,
      schemaProp: u,
      compositeRule: !0
    }, c);
    t.assign(o, (0, he._)`${o} || ${c}`), e.mergeValidEvaluated(d, c) || t.if((0, he.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
ie.validateUnion = Gy;
Object.defineProperty(lt, "__esModule", { value: !0 });
lt.validateKeywordUsage = lt.validSchemaType = lt.funcKeywordCode = lt.macroKeywordCode = void 0;
const Ve = se, Kt = ut, Ky = ie, Hy = Yr;
function Jy(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, c = t.macro.call(o.self, s, a, o), l = kl(r, n, c);
  o.opts.validateSchema !== !1 && o.self.validateSchema(c, !0);
  const u = r.name("valid");
  e.subschema({
    schema: c,
    schemaPath: Ve.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: l,
    compositeRule: !0
  }, u), e.pass(u, () => e.error(!0));
}
lt.macroKeywordCode = Jy;
function Xy(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: c, it: l } = e;
  Wy(l, t);
  const u = !c && t.compile ? t.compile.call(l.self, a, o, l) : t.validate, d = kl(n, s, u), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      v(), t.modifying && Di(e), _(() => e.error());
    else {
      const m = t.async ? y() : $();
      t.modifying && Di(e), _(() => By(e, m));
    }
  }
  function y() {
    const m = n.let("ruleErrs", null);
    return n.try(() => v((0, Ve._)`await `), (w) => n.assign(h, !1).if((0, Ve._)`${w} instanceof ${l.ValidationError}`, () => n.assign(m, (0, Ve._)`${w}.errors`), () => n.throw(w))), m;
  }
  function $() {
    const m = (0, Ve._)`${d}.errors`;
    return n.assign(m, null), v(Ve.nil), m;
  }
  function v(m = t.async ? (0, Ve._)`await ` : Ve.nil) {
    const w = l.opts.passContext ? Kt.default.this : Kt.default.self, P = !("compile" in t && !c || t.schema === !1);
    n.assign(h, (0, Ve._)`${m}${(0, Ky.callValidateCode)(e, d, w, P)}`, t.modifying);
  }
  function _(m) {
    var w;
    n.if((0, Ve.not)((w = t.valid) !== null && w !== void 0 ? w : h), m);
  }
}
lt.funcKeywordCode = Xy;
function Di(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Ve._)`${n.parentData}[${n.parentDataProperty}]`));
}
function By(e, t) {
  const { gen: r } = e;
  r.if((0, Ve._)`Array.isArray(${t})`, () => {
    r.assign(Kt.default.vErrors, (0, Ve._)`${Kt.default.vErrors} === null ? ${t} : ${Kt.default.vErrors}.concat(${t})`).assign(Kt.default.errors, (0, Ve._)`${Kt.default.vErrors}.length`), (0, Hy.extendErrors)(e);
  }, () => e.error());
}
function Wy({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function kl(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Ve.stringify)(r) });
}
function Yy(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
lt.validSchemaType = Yy;
function Qy({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((c) => !Object.prototype.hasOwnProperty.call(e, c)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const l = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(l);
    else
      throw new Error(l);
  }
}
lt.validateKeywordUsage = Qy;
var Ct = {};
Object.defineProperty(Ct, "__esModule", { value: !0 });
Ct.extendSubschemaMode = Ct.extendSubschemaData = Ct.getSubschema = void 0;
const it = se, Al = F;
function Zy(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const c = e.schema[t];
    return r === void 0 ? {
      schema: c,
      schemaPath: (0, it._)`${e.schemaPath}${(0, it.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: c[r],
      schemaPath: (0, it._)`${e.schemaPath}${(0, it.getProperty)(t)}${(0, it.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Al.escapeFragment)(r)}`
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
Ct.getSubschema = Zy;
function xy(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: c } = t;
  if (r !== void 0) {
    const { errorPath: u, dataPathArr: d, opts: h } = t, E = c.let("data", (0, it._)`${t.data}${(0, it.getProperty)(r)}`, !0);
    l(E), e.errorPath = (0, it.str)`${u}${(0, Al.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, it._)`${r}`, e.dataPathArr = [...d, e.parentDataProperty];
  }
  if (s !== void 0) {
    const u = s instanceof it.Name ? s : c.let("data", s, !0);
    l(u), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function l(u) {
    e.data = u, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, u];
  }
}
Ct.extendSubschemaData = xy;
function e0(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Ct.extendSubschemaMode = e0;
var Ie = {}, Cl = { exports: {} }, At = Cl.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  bn(t, n, s, e, "", e);
};
At.keywords = {
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
At.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
At.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
At.skipKeywords = {
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
function bn(e, t, r, n, s, a, o, c, l, u) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, c, l, u);
    for (var d in n) {
      var h = n[d];
      if (Array.isArray(h)) {
        if (d in At.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            bn(e, t, r, h[E], s + "/" + d + "/" + E, a, s, d, n, E);
      } else if (d in At.propsKeywords) {
        if (h && typeof h == "object")
          for (var y in h)
            bn(e, t, r, h[y], s + "/" + d + "/" + t0(y), a, s, d, n, y);
      } else (d in At.keywords || e.allKeys && !(d in At.skipKeywords)) && bn(e, t, r, h, s + "/" + d, a, s, d, n);
    }
    r(n, s, a, o, c, l, u);
  }
}
function t0(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var r0 = Cl.exports;
Object.defineProperty(Ie, "__esModule", { value: !0 });
Ie.getSchemaRefs = Ie.resolveUrl = Ie.normalizeId = Ie._getFullPath = Ie.getFullPath = Ie.inlineRef = void 0;
const n0 = F, s0 = qn, a0 = r0, o0 = /* @__PURE__ */ new Set([
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
function i0(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !zs(e) : t ? Dl(e) <= t : !1;
}
Ie.inlineRef = i0;
const c0 = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function zs(e) {
  for (const t in e) {
    if (c0.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(zs) || typeof r == "object" && zs(r))
      return !0;
  }
  return !1;
}
function Dl(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !o0.has(r) && (typeof e[r] == "object" && (0, n0.eachItem)(e[r], (n) => t += Dl(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Ml(e, t = "", r) {
  r !== !1 && (t = lr(t));
  const n = e.parse(t);
  return Vl(e, n);
}
Ie.getFullPath = Ml;
function Vl(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ie._getFullPath = Vl;
const l0 = /#\/?$/;
function lr(e) {
  return e ? e.replace(l0, "") : "";
}
Ie.normalizeId = lr;
function u0(e, t, r) {
  return r = lr(r), e.resolve(t, r);
}
Ie.resolveUrl = u0;
const d0 = /^[a-z_][-a-z0-9._]*$/i;
function f0(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = lr(e[r] || t), a = { "": s }, o = Ml(n, s, !1), c = {}, l = /* @__PURE__ */ new Set();
  return a0(e, { allKeys: !0 }, (h, E, y, $) => {
    if ($ === void 0)
      return;
    const v = o + E;
    let _ = a[$];
    typeof h[r] == "string" && (_ = m.call(this, h[r])), w.call(this, h.$anchor), w.call(this, h.$dynamicAnchor), a[E] = _;
    function m(P) {
      const I = this.opts.uriResolver.resolve;
      if (P = lr(_ ? I(_, P) : P), l.has(P))
        throw d(P);
      l.add(P);
      let T = this.refs[P];
      return typeof T == "string" && (T = this.refs[T]), typeof T == "object" ? u(h, T.schema, P) : P !== lr(v) && (P[0] === "#" ? (u(h, c[P], P), c[P] = h) : this.refs[P] = v), P;
    }
    function w(P) {
      if (typeof P == "string") {
        if (!d0.test(P))
          throw new Error(`invalid anchor "${P}"`);
        m.call(this, `#${P}`);
      }
    }
  }), c;
  function u(h, E, y) {
    if (E !== void 0 && !s0(h, E))
      throw d(y);
  }
  function d(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ie.getSchemaRefs = f0;
Object.defineProperty(rt, "__esModule", { value: !0 });
rt.getData = rt.KeywordCxt = rt.validateFunctionCode = void 0;
const Ll = dr, Mi = Ee, so = yt, Cn = Ee, h0 = Yn, zr = lt, ms = Ct, B = se, Z = ut, m0 = Ie, _t = F, Tr = Yr;
function p0(e) {
  if (Ul(e) && (ql(e), zl(e))) {
    _0(e);
    return;
  }
  Fl(e, () => (0, Ll.topBoolOrEmptySchema)(e));
}
rt.validateFunctionCode = p0;
function Fl({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, B._)`${Z.default.data}, ${Z.default.valCxt}`, n.$async, () => {
    e.code((0, B._)`"use strict"; ${Vi(r, s)}`), y0(e, s), e.code(a);
  }) : e.func(t, (0, B._)`${Z.default.data}, ${$0(s)}`, n.$async, () => e.code(Vi(r, s)).code(a));
}
function $0(e) {
  return (0, B._)`{${Z.default.instancePath}="", ${Z.default.parentData}, ${Z.default.parentDataProperty}, ${Z.default.rootData}=${Z.default.data}${e.dynamicRef ? (0, B._)`, ${Z.default.dynamicAnchors}={}` : B.nil}}={}`;
}
function y0(e, t) {
  e.if(Z.default.valCxt, () => {
    e.var(Z.default.instancePath, (0, B._)`${Z.default.valCxt}.${Z.default.instancePath}`), e.var(Z.default.parentData, (0, B._)`${Z.default.valCxt}.${Z.default.parentData}`), e.var(Z.default.parentDataProperty, (0, B._)`${Z.default.valCxt}.${Z.default.parentDataProperty}`), e.var(Z.default.rootData, (0, B._)`${Z.default.valCxt}.${Z.default.rootData}`), t.dynamicRef && e.var(Z.default.dynamicAnchors, (0, B._)`${Z.default.valCxt}.${Z.default.dynamicAnchors}`);
  }, () => {
    e.var(Z.default.instancePath, (0, B._)`""`), e.var(Z.default.parentData, (0, B._)`undefined`), e.var(Z.default.parentDataProperty, (0, B._)`undefined`), e.var(Z.default.rootData, Z.default.data), t.dynamicRef && e.var(Z.default.dynamicAnchors, (0, B._)`{}`);
  });
}
function _0(e) {
  const { schema: t, opts: r, gen: n } = e;
  Fl(e, () => {
    r.$comment && t.$comment && Kl(e), b0(e), n.let(Z.default.vErrors, null), n.let(Z.default.errors, 0), r.unevaluated && g0(e), Gl(e), N0(e);
  });
}
function g0(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, B._)`${r}.evaluated`), t.if((0, B._)`${e.evaluated}.dynamicProps`, () => t.assign((0, B._)`${e.evaluated}.props`, (0, B._)`undefined`)), t.if((0, B._)`${e.evaluated}.dynamicItems`, () => t.assign((0, B._)`${e.evaluated}.items`, (0, B._)`undefined`));
}
function Vi(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, B._)`/*# sourceURL=${r} */` : B.nil;
}
function v0(e, t) {
  if (Ul(e) && (ql(e), zl(e))) {
    w0(e, t);
    return;
  }
  (0, Ll.boolOrEmptySchema)(e, t);
}
function zl({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Ul(e) {
  return typeof e.schema != "boolean";
}
function w0(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Kl(e), S0(e), P0(e);
  const a = n.const("_errs", Z.default.errors);
  Gl(e, a), n.var(t, (0, B._)`${a} === ${Z.default.errors}`);
}
function ql(e) {
  (0, _t.checkUnknownRules)(e), E0(e);
}
function Gl(e, t) {
  if (e.opts.jtd)
    return Li(e, [], !1, t);
  const r = (0, Mi.getSchemaTypes)(e.schema), n = (0, Mi.coerceAndCheckDataType)(e, r);
  Li(e, r, !n, t);
}
function E0(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, _t.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function b0(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, _t.checkStrictMode)(e, "default is ignored in the schema root");
}
function S0(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, m0.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function P0(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Kl({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, B._)`${Z.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, B.str)`${n}/$comment`, c = e.scopeValue("root", { ref: t.root });
    e.code((0, B._)`${Z.default.self}.opts.$comment(${a}, ${o}, ${c}.schema)`);
  }
}
function N0(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, B._)`${Z.default.errors} === 0`, () => t.return(Z.default.data), () => t.throw((0, B._)`new ${s}(${Z.default.vErrors})`)) : (t.assign((0, B._)`${n}.errors`, Z.default.vErrors), a.unevaluated && R0(e), t.return((0, B._)`${Z.default.errors} === 0`));
}
function R0({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof B.Name && e.assign((0, B._)`${t}.props`, r), n instanceof B.Name && e.assign((0, B._)`${t}.items`, n);
}
function Li(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: c, opts: l, self: u } = e, { RULES: d } = u;
  if (a.$ref && (l.ignoreKeywordsWithRef || !(0, _t.schemaHasRulesButRef)(a, d))) {
    s.block(() => Xl(e, "$ref", d.all.$ref.definition));
    return;
  }
  l.jtd || O0(e, t), s.block(() => {
    for (const E of d.rules)
      h(E);
    h(d.post);
  });
  function h(E) {
    (0, so.shouldUseGroup)(a, E) && (E.type ? (s.if((0, Cn.checkDataType)(E.type, o, l.strictNumbers)), Fi(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, Cn.reportTypeError)(e)), s.endIf()) : Fi(e, E), c || s.if((0, B._)`${Z.default.errors} === ${n || 0}`));
  }
}
function Fi(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, h0.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, so.shouldUseRule)(n, a) && Xl(e, a.keyword, a.definition, t.type);
  });
}
function O0(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (I0(e, t), e.opts.allowUnionTypes || T0(e, t), j0(e, e.dataTypes));
}
function I0(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Hl(e.dataTypes, r) || ao(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), A0(e, t);
  }
}
function T0(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && ao(e, "use allowUnionTypes to allow union type keyword");
}
function j0(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, so.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => k0(t, o)) && ao(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function k0(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Hl(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function A0(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Hl(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function ao(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, _t.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Jl {
  constructor(t, r, n) {
    if ((0, zr.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, _t.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Bl(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, zr.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", Z.default.errors));
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
    (t ? Tr.reportExtraError : Tr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Tr.reportError)(this, this.def.$dataError || Tr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Tr.resetErrorsCount)(this.gen, this.errsCount);
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
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, B.or)((0, B._)`${s} === undefined`, r)), t !== B.nil && n.assign(t, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== B.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, B.or)(o(), c());
    function o() {
      if (n.length) {
        if (!(r instanceof B.Name))
          throw new Error("ajv implementation error");
        const l = Array.isArray(n) ? n : [n];
        return (0, B._)`${(0, Cn.checkDataTypes)(l, r, a.opts.strictNumbers, Cn.DataType.Wrong)}`;
      }
      return B.nil;
    }
    function c() {
      if (s.validateSchema) {
        const l = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, B._)`!${l}(${r})`;
      }
      return B.nil;
    }
  }
  subschema(t, r) {
    const n = (0, ms.getSubschema)(this.it, t);
    (0, ms.extendSubschemaData)(n, this.it, t), (0, ms.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return v0(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = _t.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = _t.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, B.Name)), !0;
  }
}
rt.KeywordCxt = Jl;
function Xl(e, t, r, n) {
  const s = new Jl(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, zr.funcKeywordCode)(s, r) : "macro" in r ? (0, zr.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, zr.funcKeywordCode)(s, r);
}
const C0 = /^\/(?:[^~]|~0|~1)*$/, D0 = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Bl(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return Z.default.rootData;
  if (e[0] === "/") {
    if (!C0.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = Z.default.rootData;
  } else {
    const u = D0.exec(e);
    if (!u)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const d = +u[1];
    if (s = u[2], s === "#") {
      if (d >= t)
        throw new Error(l("property/index", d));
      return n[t - d];
    }
    if (d > t)
      throw new Error(l("data", d));
    if (a = r[t - d], !s)
      return a;
  }
  let o = a;
  const c = s.split("/");
  for (const u of c)
    u && (a = (0, B._)`${a}${(0, B.getProperty)((0, _t.unescapeJsonPointer)(u))}`, o = (0, B._)`${o} && ${a}`);
  return o;
  function l(u, d) {
    return `Cannot access ${u} ${d} levels up, current level is ${t}`;
  }
}
rt.getData = Bl;
var Qr = {};
Object.defineProperty(Qr, "__esModule", { value: !0 });
class M0 extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
Qr.default = M0;
var _r = {};
Object.defineProperty(_r, "__esModule", { value: !0 });
const ps = Ie;
class V0 extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, ps.resolveUrl)(t, r, n), this.missingSchema = (0, ps.normalizeId)((0, ps.getFullPath)(t, this.missingRef));
  }
}
_r.default = V0;
var qe = {};
Object.defineProperty(qe, "__esModule", { value: !0 });
qe.resolveSchema = qe.getCompilingSchema = qe.resolveRef = qe.compileSchema = qe.SchemaEnv = void 0;
const Qe = se, L0 = Qr, zt = ut, tt = Ie, zi = F, F0 = rt;
class Qn {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, tt.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
qe.SchemaEnv = Qn;
function oo(e) {
  const t = Wl.call(this, e);
  if (t)
    return t;
  const r = (0, tt.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new Qe.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let c;
  e.$async && (c = o.scopeValue("Error", {
    ref: L0.default,
    code: (0, Qe._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const l = o.scopeName("validate");
  e.validateName = l;
  const u = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: zt.default.data,
    parentData: zt.default.parentData,
    parentDataProperty: zt.default.parentDataProperty,
    dataNames: [zt.default.data],
    dataPathArr: [Qe.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Qe.stringify)(e.schema) } : { ref: e.schema }),
    validateName: l,
    ValidationError: c,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Qe.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Qe._)`""`,
    opts: this.opts,
    self: this
  };
  let d;
  try {
    this._compilations.add(e), (0, F0.validateFunctionCode)(u), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    d = `${o.scopeRefs(zt.default.scope)}return ${h}`, this.opts.code.process && (d = this.opts.code.process(d, e));
    const y = new Function(`${zt.default.self}`, `${zt.default.scope}`, d)(this, this.scope.get());
    if (this.scope.value(l, { ref: y }), y.errors = null, y.schema = e.schema, y.schemaEnv = e, e.$async && (y.$async = !0), this.opts.code.source === !0 && (y.source = { validateName: l, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: $, items: v } = u;
      y.evaluated = {
        props: $ instanceof Qe.Name ? void 0 : $,
        items: v instanceof Qe.Name ? void 0 : v,
        dynamicProps: $ instanceof Qe.Name,
        dynamicItems: v instanceof Qe.Name
      }, y.source && (y.source.evaluated = (0, Qe.stringify)(y.evaluated));
    }
    return e.validate = y, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, d && this.logger.error("Error compiling schema, function code:", d), h;
  } finally {
    this._compilations.delete(e);
  }
}
qe.compileSchema = oo;
function z0(e, t, r) {
  var n;
  r = (0, tt.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = G0.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: c } = this.opts;
    o && (a = new Qn({ schema: o, schemaId: c, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = U0.call(this, a);
}
qe.resolveRef = z0;
function U0(e) {
  return (0, tt.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : oo.call(this, e);
}
function Wl(e) {
  for (const t of this._compilations)
    if (q0(t, e))
      return t;
}
qe.getCompilingSchema = Wl;
function q0(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function G0(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Zn.call(this, e, t);
}
function Zn(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, tt._getFullPath)(this.opts.uriResolver, r);
  let s = (0, tt.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return $s.call(this, r, e);
  const a = (0, tt.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const c = Zn.call(this, e, o);
    return typeof (c == null ? void 0 : c.schema) != "object" ? void 0 : $s.call(this, r, c);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || oo.call(this, o), a === (0, tt.normalizeId)(t)) {
      const { schema: c } = o, { schemaId: l } = this.opts, u = c[l];
      return u && (s = (0, tt.resolveUrl)(this.opts.uriResolver, s, u)), new Qn({ schema: c, schemaId: l, root: e, baseId: s });
    }
    return $s.call(this, r, o);
  }
}
qe.resolveSchema = Zn;
const K0 = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function $s(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const c of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const l = r[(0, zi.unescapeFragment)(c)];
    if (l === void 0)
      return;
    r = l;
    const u = typeof r == "object" && r[this.opts.schemaId];
    !K0.has(c) && u && (t = (0, tt.resolveUrl)(this.opts.uriResolver, t, u));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, zi.schemaHasRulesButRef)(r, this.RULES)) {
    const c = (0, tt.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = Zn.call(this, n, c);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new Qn({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const H0 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", J0 = "Meta-schema for $data reference (JSON AnySchema extension proposal)", X0 = "object", B0 = [
  "$data"
], W0 = {
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
}, Y0 = !1, Q0 = {
  $id: H0,
  description: J0,
  type: X0,
  required: B0,
  properties: W0,
  additionalProperties: Y0
};
var io = {};
Object.defineProperty(io, "__esModule", { value: !0 });
const Yl = al;
Yl.code = 'require("ajv/dist/runtime/uri").default';
io.default = Yl;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = rt;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = se;
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
  const n = Qr, s = _r, a = Wt, o = qe, c = se, l = Ie, u = Ee, d = F, h = Q0, E = io, y = (N, p) => new RegExp(N, p);
  y.code = "new RegExp";
  const $ = ["removeAdditional", "useDefaults", "coerceTypes"], v = /* @__PURE__ */ new Set([
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
  ]), _ = {
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
    var p, S, g, i, f, b, k, A, H, q, R, O, C, M, J, x, ye, Me, Se, Pe, _e, at, Te, Dt, Mt;
    const Be = N.strict, Vt = (p = N.code) === null || p === void 0 ? void 0 : p.optimize, Er = Vt === !0 || Vt === void 0 ? 1 : Vt || 0, br = (g = (S = N.code) === null || S === void 0 ? void 0 : S.regExp) !== null && g !== void 0 ? g : y, os = (i = N.uriResolver) !== null && i !== void 0 ? i : E.default;
    return {
      strictSchema: (b = (f = N.strictSchema) !== null && f !== void 0 ? f : Be) !== null && b !== void 0 ? b : !0,
      strictNumbers: (A = (k = N.strictNumbers) !== null && k !== void 0 ? k : Be) !== null && A !== void 0 ? A : !0,
      strictTypes: (q = (H = N.strictTypes) !== null && H !== void 0 ? H : Be) !== null && q !== void 0 ? q : "log",
      strictTuples: (O = (R = N.strictTuples) !== null && R !== void 0 ? R : Be) !== null && O !== void 0 ? O : "log",
      strictRequired: (M = (C = N.strictRequired) !== null && C !== void 0 ? C : Be) !== null && M !== void 0 ? M : !1,
      code: N.code ? { ...N.code, optimize: Er, regExp: br } : { optimize: Er, regExp: br },
      loopRequired: (J = N.loopRequired) !== null && J !== void 0 ? J : w,
      loopEnum: (x = N.loopEnum) !== null && x !== void 0 ? x : w,
      meta: (ye = N.meta) !== null && ye !== void 0 ? ye : !0,
      messages: (Me = N.messages) !== null && Me !== void 0 ? Me : !0,
      inlineRefs: (Se = N.inlineRefs) !== null && Se !== void 0 ? Se : !0,
      schemaId: (Pe = N.schemaId) !== null && Pe !== void 0 ? Pe : "$id",
      addUsedSchema: (_e = N.addUsedSchema) !== null && _e !== void 0 ? _e : !0,
      validateSchema: (at = N.validateSchema) !== null && at !== void 0 ? at : !0,
      validateFormats: (Te = N.validateFormats) !== null && Te !== void 0 ? Te : !0,
      unicodeRegExp: (Dt = N.unicodeRegExp) !== null && Dt !== void 0 ? Dt : !0,
      int32range: (Mt = N.int32range) !== null && Mt !== void 0 ? Mt : !0,
      uriResolver: os
    };
  }
  class I {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...P(p) };
      const { es5: S, lines: g } = this.opts.code;
      this.scope = new c.ValueScope({ scope: {}, prefixes: v, es5: S, lines: g }), this.logger = W(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), T.call(this, _, p, "NOT SUPPORTED"), T.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = $e.call(this), p.formats && ce.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && de.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), Y.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: S, schemaId: g } = this.opts;
      let i = h;
      g === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), S && p && this.addMetaSchema(i, i[g], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: S } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[S] || p : void 0;
    }
    validate(p, S) {
      let g;
      if (typeof p == "string") {
        if (g = this.getSchema(p), !g)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        g = this.compile(p);
      const i = g(S);
      return "$async" in g || (this.errors = g.errors), i;
    }
    compile(p, S) {
      const g = this._addSchema(p, S);
      return g.validate || this._compileSchemaEnv(g);
    }
    compileAsync(p, S) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: g } = this.opts;
      return i.call(this, p, S);
      async function i(q, R) {
        await f.call(this, q.$schema);
        const O = this._addSchema(q, R);
        return O.validate || b.call(this, O);
      }
      async function f(q) {
        q && !this.getSchema(q) && await i.call(this, { $ref: q }, !0);
      }
      async function b(q) {
        try {
          return this._compileSchemaEnv(q);
        } catch (R) {
          if (!(R instanceof s.default))
            throw R;
          return k.call(this, R), await A.call(this, R.missingSchema), b.call(this, q);
        }
      }
      function k({ missingSchema: q, missingRef: R }) {
        if (this.refs[q])
          throw new Error(`AnySchema ${q} is loaded but ${R} cannot be resolved`);
      }
      async function A(q) {
        const R = await H.call(this, q);
        this.refs[q] || await f.call(this, R.$schema), this.refs[q] || this.addSchema(R, q, S);
      }
      async function H(q) {
        const R = this._loading[q];
        if (R)
          return R;
        try {
          return await (this._loading[q] = g(q));
        } finally {
          delete this._loading[q];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, S, g, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const b of p)
          this.addSchema(b, void 0, g, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: b } = this.opts;
        if (f = p[b], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${b} must be string`);
      }
      return S = (0, l.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(p, g, S, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, S, g = this.opts.validateSchema) {
      return this.addSchema(p, S, !0, g), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, S) {
      if (typeof p == "boolean")
        return !0;
      let g;
      if (g = p.$schema, g !== void 0 && typeof g != "string")
        throw new Error("$schema must be a string");
      if (g = g || this.opts.defaultMeta || this.defaultMeta(), !g)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate(g, p);
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
      for (; typeof (S = K.call(this, p)) == "string"; )
        p = S;
      if (S === void 0) {
        const { schemaId: g } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: g });
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
          const S = K.call(this, p);
          return typeof S == "object" && this._cache.delete(S.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const S = p;
          this._cache.delete(S);
          let g = p[this.opts.schemaId];
          return g && (g = (0, l.normalizeId)(g), delete this.schemas[g], delete this.refs[g]), this;
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
      let g;
      if (typeof p == "string")
        g = p, typeof S == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), S.keyword = g);
      else if (typeof p == "object" && S === void 0) {
        if (S = p, g = S.keyword, Array.isArray(g) && !g.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (j.call(this, g, S), !S)
        return (0, d.eachItem)(g, (f) => D.call(this, f)), this;
      L.call(this, S);
      const i = {
        ...S,
        type: (0, u.getJSONTypes)(S.type),
        schemaType: (0, u.getJSONTypes)(S.schemaType)
      };
      return (0, d.eachItem)(g, i.type.length === 0 ? (f) => D.call(this, f, i) : (f) => i.type.forEach((b) => D.call(this, f, i, b))), this;
    }
    getKeyword(p) {
      const S = this.RULES.all[p];
      return typeof S == "object" ? S.definition : !!S;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: S } = this;
      delete S.keywords[p], delete S.all[p];
      for (const g of S.rules) {
        const i = g.rules.findIndex((f) => f.keyword === p);
        i >= 0 && g.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, S) {
      return typeof S == "string" && (S = new RegExp(S)), this.formats[p] = S, this;
    }
    errorsText(p = this.errors, { separator: S = ", ", dataVar: g = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${g}${i.instancePath} ${i.message}`).reduce((i, f) => i + S + f);
    }
    $dataMetaSchema(p, S) {
      const g = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of S) {
        const f = i.split("/").slice(1);
        let b = p;
        for (const k of f)
          b = b[k];
        for (const k in g) {
          const A = g[k];
          if (typeof A != "object")
            continue;
          const { $data: H } = A.definition, q = b[k];
          H && q && (b[k] = z(q));
        }
      }
      return p;
    }
    _removeAllSchemas(p, S) {
      for (const g in p) {
        const i = p[g];
        (!S || S.test(g)) && (typeof i == "string" ? delete p[g] : i && !i.meta && (this._cache.delete(i.schema), delete p[g]));
      }
    }
    _addSchema(p, S, g, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let b;
      const { schemaId: k } = this.opts;
      if (typeof p == "object")
        b = p[k];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let A = this._cache.get(p);
      if (A !== void 0)
        return A;
      g = (0, l.normalizeId)(b || g);
      const H = l.getSchemaRefs.call(this, p, g);
      return A = new o.SchemaEnv({ schema: p, schemaId: k, meta: S, baseId: g, localRefs: H }), this._cache.set(A.schema, A), f && !g.startsWith("#") && (g && this._checkUnique(g), this.refs[g] = A), i && this.validateSchema(p, !0), A;
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
  I.ValidationError = n.default, I.MissingRefError = s.default, e.default = I;
  function T(N, p, S, g = "error") {
    for (const i in N) {
      const f = i;
      f in p && this.logger[g](`${S}: option ${i}. ${N[f]}`);
    }
  }
  function K(N) {
    return N = (0, l.normalizeId)(N), this.schemas[N] || this.refs[N];
  }
  function Y() {
    const N = this.opts.schemas;
    if (N)
      if (Array.isArray(N))
        this.addSchema(N);
      else
        for (const p in N)
          this.addSchema(N[p], p);
  }
  function ce() {
    for (const N in this.opts.formats) {
      const p = this.opts.formats[N];
      p && this.addFormat(N, p);
    }
  }
  function de(N) {
    if (Array.isArray(N)) {
      this.addVocabulary(N);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in N) {
      const S = N[p];
      S.keyword || (S.keyword = p), this.addKeyword(S);
    }
  }
  function $e() {
    const N = { ...this.opts };
    for (const p of $)
      delete N[p];
    return N;
  }
  const G = { log() {
  }, warn() {
  }, error() {
  } };
  function W(N) {
    if (N === !1)
      return G;
    if (N === void 0)
      return console;
    if (N.log && N.warn && N.error)
      return N;
    throw new Error("logger must implement log, warn and error methods");
  }
  const Q = /^[a-z_$][a-z0-9_$:-]*$/i;
  function j(N, p) {
    const { RULES: S } = this;
    if ((0, d.eachItem)(N, (g) => {
      if (S.keywords[g])
        throw new Error(`Keyword ${g} is already defined`);
      if (!Q.test(g))
        throw new Error(`Keyword ${g} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function D(N, p, S) {
    var g;
    const i = p == null ? void 0 : p.post;
    if (S && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let b = i ? f.post : f.rules.find(({ type: A }) => A === S);
    if (b || (b = { type: S, rules: [] }, f.rules.push(b)), f.keywords[N] = !0, !p)
      return;
    const k = {
      keyword: N,
      definition: {
        ...p,
        type: (0, u.getJSONTypes)(p.type),
        schemaType: (0, u.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? U.call(this, b, k, p.before) : b.rules.push(k), f.all[N] = k, (g = p.implements) === null || g === void 0 || g.forEach((A) => this.addKeyword(A));
  }
  function U(N, p, S) {
    const g = N.rules.findIndex((i) => i.keyword === S);
    g >= 0 ? N.rules.splice(g, 0, p) : (N.rules.push(p), this.logger.warn(`rule ${S} is not defined`));
  }
  function L(N) {
    let { metaSchema: p } = N;
    p !== void 0 && (N.$data && this.opts.$data && (p = z(p)), N.validateSchema = this.compile(p, !0));
  }
  const X = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function z(N) {
    return { anyOf: [N, X] };
  }
})(_l);
var co = {}, lo = {}, uo = {};
Object.defineProperty(uo, "__esModule", { value: !0 });
const Z0 = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
uo.default = Z0;
var Yt = {};
Object.defineProperty(Yt, "__esModule", { value: !0 });
Yt.callRef = Yt.getValidate = void 0;
const x0 = _r, Ui = ie, Ue = se, xt = ut, qi = qe, cn = F, e_ = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: c, self: l } = n, { root: u } = a;
    if ((r === "#" || r === "#/") && s === u.baseId)
      return h();
    const d = qi.resolveRef.call(l, u, s, r);
    if (d === void 0)
      throw new x0.default(n.opts.uriResolver, s, r);
    if (d instanceof qi.SchemaEnv)
      return E(d);
    return y(d);
    function h() {
      if (a === u)
        return Sn(e, o, a, a.$async);
      const $ = t.scopeValue("root", { ref: u });
      return Sn(e, (0, Ue._)`${$}.validate`, u, u.$async);
    }
    function E($) {
      const v = Ql(e, $);
      Sn(e, v, $, $.$async);
    }
    function y($) {
      const v = t.scopeValue("schema", c.code.source === !0 ? { ref: $, code: (0, Ue.stringify)($) } : { ref: $ }), _ = t.name("valid"), m = e.subschema({
        schema: $,
        dataTypes: [],
        schemaPath: Ue.nil,
        topSchemaRef: v,
        errSchemaPath: r
      }, _);
      e.mergeEvaluated(m), e.ok(_);
    }
  }
};
function Ql(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ue._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Yt.getValidate = Ql;
function Sn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: c, opts: l } = a, u = l.passContext ? xt.default.this : Ue.nil;
  n ? d() : h();
  function d() {
    if (!c.$async)
      throw new Error("async schema referenced by sync schema");
    const $ = s.let("valid");
    s.try(() => {
      s.code((0, Ue._)`await ${(0, Ui.callValidateCode)(e, t, u)}`), y(t), o || s.assign($, !0);
    }, (v) => {
      s.if((0, Ue._)`!(${v} instanceof ${a.ValidationError})`, () => s.throw(v)), E(v), o || s.assign($, !1);
    }), e.ok($);
  }
  function h() {
    e.result((0, Ui.callValidateCode)(e, t, u), () => y(t), () => E(t));
  }
  function E($) {
    const v = (0, Ue._)`${$}.errors`;
    s.assign(xt.default.vErrors, (0, Ue._)`${xt.default.vErrors} === null ? ${v} : ${xt.default.vErrors}.concat(${v})`), s.assign(xt.default.errors, (0, Ue._)`${xt.default.vErrors}.length`);
  }
  function y($) {
    var v;
    if (!a.opts.unevaluated)
      return;
    const _ = (v = r == null ? void 0 : r.validate) === null || v === void 0 ? void 0 : v.evaluated;
    if (a.props !== !0)
      if (_ && !_.dynamicProps)
        _.props !== void 0 && (a.props = cn.mergeEvaluated.props(s, _.props, a.props));
      else {
        const m = s.var("props", (0, Ue._)`${$}.evaluated.props`);
        a.props = cn.mergeEvaluated.props(s, m, a.props, Ue.Name);
      }
    if (a.items !== !0)
      if (_ && !_.dynamicItems)
        _.items !== void 0 && (a.items = cn.mergeEvaluated.items(s, _.items, a.items));
      else {
        const m = s.var("items", (0, Ue._)`${$}.evaluated.items`);
        a.items = cn.mergeEvaluated.items(s, m, a.items, Ue.Name);
      }
  }
}
Yt.callRef = Sn;
Yt.default = e_;
Object.defineProperty(lo, "__esModule", { value: !0 });
const t_ = uo, r_ = Yt, n_ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  t_.default,
  r_.default
];
lo.default = n_;
var fo = {}, ho = {};
Object.defineProperty(ho, "__esModule", { value: !0 });
const Dn = se, Rt = Dn.operators, Mn = {
  maximum: { okStr: "<=", ok: Rt.LTE, fail: Rt.GT },
  minimum: { okStr: ">=", ok: Rt.GTE, fail: Rt.LT },
  exclusiveMaximum: { okStr: "<", ok: Rt.LT, fail: Rt.GTE },
  exclusiveMinimum: { okStr: ">", ok: Rt.GT, fail: Rt.LTE }
}, s_ = {
  message: ({ keyword: e, schemaCode: t }) => (0, Dn.str)`must be ${Mn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Dn._)`{comparison: ${Mn[e].okStr}, limit: ${t}}`
}, a_ = {
  keyword: Object.keys(Mn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: s_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Dn._)`${r} ${Mn[t].fail} ${n} || isNaN(${r})`);
  }
};
ho.default = a_;
var mo = {};
Object.defineProperty(mo, "__esModule", { value: !0 });
const Ur = se, o_ = {
  message: ({ schemaCode: e }) => (0, Ur.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Ur._)`{multipleOf: ${e}}`
}, i_ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: o_,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), c = a ? (0, Ur._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, Ur._)`${o} !== parseInt(${o})`;
    e.fail$data((0, Ur._)`(${n} === 0 || (${o} = ${r}/${n}, ${c}))`);
  }
};
mo.default = i_;
var po = {}, $o = {};
Object.defineProperty($o, "__esModule", { value: !0 });
function Zl(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
$o.default = Zl;
Zl.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(po, "__esModule", { value: !0 });
const Ht = se, c_ = F, l_ = $o, u_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Ht.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Ht._)`{limit: ${e}}`
}, d_ = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: u_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? Ht.operators.GT : Ht.operators.LT, o = s.opts.unicode === !1 ? (0, Ht._)`${r}.length` : (0, Ht._)`${(0, c_.useFunc)(e.gen, l_.default)}(${r})`;
    e.fail$data((0, Ht._)`${o} ${a} ${n}`);
  }
};
po.default = d_;
var yo = {};
Object.defineProperty(yo, "__esModule", { value: !0 });
const f_ = ie, Vn = se, h_ = {
  message: ({ schemaCode: e }) => (0, Vn.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Vn._)`{pattern: ${e}}`
}, m_ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: h_,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: a } = e, o = a.opts.unicodeRegExp ? "u" : "", c = r ? (0, Vn._)`(new RegExp(${s}, ${o}))` : (0, f_.usePattern)(e, n);
    e.fail$data((0, Vn._)`!${c}.test(${t})`);
  }
};
yo.default = m_;
var _o = {};
Object.defineProperty(_o, "__esModule", { value: !0 });
const qr = se, p_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, qr.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, qr._)`{limit: ${e}}`
}, $_ = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: p_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? qr.operators.GT : qr.operators.LT;
    e.fail$data((0, qr._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
_o.default = $_;
var go = {};
Object.defineProperty(go, "__esModule", { value: !0 });
const jr = ie, Gr = se, y_ = F, __ = {
  message: ({ params: { missingProperty: e } }) => (0, Gr.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Gr._)`{missingProperty: ${e}}`
}, g_ = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: __,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: c } = o;
    if (!a && r.length === 0)
      return;
    const l = r.length >= c.loopRequired;
    if (o.allErrors ? u() : d(), c.strictRequired) {
      const y = e.parentSchema.properties, { definedProperties: $ } = e.it;
      for (const v of r)
        if ((y == null ? void 0 : y[v]) === void 0 && !$.has(v)) {
          const _ = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${v}" is not defined at "${_}" (strictRequired)`;
          (0, y_.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function u() {
      if (l || a)
        e.block$data(Gr.nil, h);
      else
        for (const y of r)
          (0, jr.checkReportMissingProp)(e, y);
    }
    function d() {
      const y = t.let("missing");
      if (l || a) {
        const $ = t.let("valid", !0);
        e.block$data($, () => E(y, $)), e.ok($);
      } else
        t.if((0, jr.checkMissingProp)(e, r, y)), (0, jr.reportMissingProp)(e, y), t.else();
    }
    function h() {
      t.forOf("prop", n, (y) => {
        e.setParams({ missingProperty: y }), t.if((0, jr.noPropertyInData)(t, s, y, c.ownProperties), () => e.error());
      });
    }
    function E(y, $) {
      e.setParams({ missingProperty: y }), t.forOf(y, n, () => {
        t.assign($, (0, jr.propertyInData)(t, s, y, c.ownProperties)), t.if((0, Gr.not)($), () => {
          e.error(), t.break();
        });
      }, Gr.nil);
    }
  }
};
go.default = g_;
var vo = {};
Object.defineProperty(vo, "__esModule", { value: !0 });
const Kr = se, v_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Kr.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Kr._)`{limit: ${e}}`
}, w_ = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: v_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? Kr.operators.GT : Kr.operators.LT;
    e.fail$data((0, Kr._)`${r}.length ${s} ${n}`);
  }
};
vo.default = w_;
var wo = {}, Zr = {};
Object.defineProperty(Zr, "__esModule", { value: !0 });
const xl = qn;
xl.code = 'require("ajv/dist/runtime/equal").default';
Zr.default = xl;
Object.defineProperty(wo, "__esModule", { value: !0 });
const ys = Ee, Re = se, E_ = F, b_ = Zr, S_ = {
  message: ({ params: { i: e, j: t } }) => (0, Re.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Re._)`{i: ${e}, j: ${t}}`
}, P_ = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: S_,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: c } = e;
    if (!n && !s)
      return;
    const l = t.let("valid"), u = a.items ? (0, ys.getSchemaTypes)(a.items) : [];
    e.block$data(l, d, (0, Re._)`${o} === false`), e.ok(l);
    function d() {
      const $ = t.let("i", (0, Re._)`${r}.length`), v = t.let("j");
      e.setParams({ i: $, j: v }), t.assign(l, !0), t.if((0, Re._)`${$} > 1`, () => (h() ? E : y)($, v));
    }
    function h() {
      return u.length > 0 && !u.some(($) => $ === "object" || $ === "array");
    }
    function E($, v) {
      const _ = t.name("item"), m = (0, ys.checkDataTypes)(u, _, c.opts.strictNumbers, ys.DataType.Wrong), w = t.const("indices", (0, Re._)`{}`);
      t.for((0, Re._)`;${$}--;`, () => {
        t.let(_, (0, Re._)`${r}[${$}]`), t.if(m, (0, Re._)`continue`), u.length > 1 && t.if((0, Re._)`typeof ${_} == "string"`, (0, Re._)`${_} += "_"`), t.if((0, Re._)`typeof ${w}[${_}] == "number"`, () => {
          t.assign(v, (0, Re._)`${w}[${_}]`), e.error(), t.assign(l, !1).break();
        }).code((0, Re._)`${w}[${_}] = ${$}`);
      });
    }
    function y($, v) {
      const _ = (0, E_.useFunc)(t, b_.default), m = t.name("outer");
      t.label(m).for((0, Re._)`;${$}--;`, () => t.for((0, Re._)`${v} = ${$}; ${v}--;`, () => t.if((0, Re._)`${_}(${r}[${$}], ${r}[${v}])`, () => {
        e.error(), t.assign(l, !1).break(m);
      })));
    }
  }
};
wo.default = P_;
var Eo = {};
Object.defineProperty(Eo, "__esModule", { value: !0 });
const Us = se, N_ = F, R_ = Zr, O_ = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Us._)`{allowedValue: ${e}}`
}, I_ = {
  keyword: "const",
  $data: !0,
  error: O_,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, Us._)`!${(0, N_.useFunc)(t, R_.default)}(${r}, ${s})`) : e.fail((0, Us._)`${a} !== ${r}`);
  }
};
Eo.default = I_;
var bo = {};
Object.defineProperty(bo, "__esModule", { value: !0 });
const Dr = se, T_ = F, j_ = Zr, k_ = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Dr._)`{allowedValues: ${e}}`
}, A_ = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: k_,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const c = s.length >= o.opts.loopEnum;
    let l;
    const u = () => l ?? (l = (0, T_.useFunc)(t, j_.default));
    let d;
    if (c || n)
      d = t.let("valid"), e.block$data(d, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const y = t.const("vSchema", a);
      d = (0, Dr.or)(...s.map(($, v) => E(y, v)));
    }
    e.pass(d);
    function h() {
      t.assign(d, !1), t.forOf("v", a, (y) => t.if((0, Dr._)`${u()}(${r}, ${y})`, () => t.assign(d, !0).break()));
    }
    function E(y, $) {
      const v = s[$];
      return typeof v == "object" && v !== null ? (0, Dr._)`${u()}(${r}, ${y}[${$}])` : (0, Dr._)`${r} === ${v}`;
    }
  }
};
bo.default = A_;
Object.defineProperty(fo, "__esModule", { value: !0 });
const C_ = ho, D_ = mo, M_ = po, V_ = yo, L_ = _o, F_ = go, z_ = vo, U_ = wo, q_ = Eo, G_ = bo, K_ = [
  // number
  C_.default,
  D_.default,
  // string
  M_.default,
  V_.default,
  // object
  L_.default,
  F_.default,
  // array
  z_.default,
  U_.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  q_.default,
  G_.default
];
fo.default = K_;
var So = {}, gr = {};
Object.defineProperty(gr, "__esModule", { value: !0 });
gr.validateAdditionalItems = void 0;
const Jt = se, qs = F, H_ = {
  message: ({ params: { len: e } }) => (0, Jt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Jt._)`{limit: ${e}}`
}, J_ = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: H_,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, qs.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    eu(e, n);
  }
};
function eu(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const c = r.const("len", (0, Jt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Jt._)`${c} <= ${t.length}`);
  else if (typeof n == "object" && !(0, qs.alwaysValidSchema)(o, n)) {
    const u = r.var("valid", (0, Jt._)`${c} <= ${t.length}`);
    r.if((0, Jt.not)(u), () => l(u)), e.ok(u);
  }
  function l(u) {
    r.forRange("i", t.length, c, (d) => {
      e.subschema({ keyword: a, dataProp: d, dataPropType: qs.Type.Num }, u), o.allErrors || r.if((0, Jt.not)(u), () => r.break());
    });
  }
}
gr.validateAdditionalItems = eu;
gr.default = J_;
var Po = {}, vr = {};
Object.defineProperty(vr, "__esModule", { value: !0 });
vr.validateTuple = void 0;
const Gi = se, Pn = F, X_ = ie, B_ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return tu(e, "additionalItems", t);
    r.items = !0, !(0, Pn.alwaysValidSchema)(r, t) && e.ok((0, X_.validateArray)(e));
  }
};
function tu(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: c } = e;
  d(s), c.opts.unevaluated && r.length && c.items !== !0 && (c.items = Pn.mergeEvaluated.items(n, r.length, c.items));
  const l = n.name("valid"), u = n.const("len", (0, Gi._)`${a}.length`);
  r.forEach((h, E) => {
    (0, Pn.alwaysValidSchema)(c, h) || (n.if((0, Gi._)`${u} > ${E}`, () => e.subschema({
      keyword: o,
      schemaProp: E,
      dataProp: E
    }, l)), e.ok(l));
  });
  function d(h) {
    const { opts: E, errSchemaPath: y } = c, $ = r.length, v = $ === h.minItems && ($ === h.maxItems || h[t] === !1);
    if (E.strictTuples && !v) {
      const _ = `"${o}" is ${$}-tuple, but minItems or maxItems/${t} are not specified or different at path "${y}"`;
      (0, Pn.checkStrictMode)(c, _, E.strictTuples);
    }
  }
}
vr.validateTuple = tu;
vr.default = B_;
Object.defineProperty(Po, "__esModule", { value: !0 });
const W_ = vr, Y_ = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, W_.validateTuple)(e, "items")
};
Po.default = Y_;
var No = {};
Object.defineProperty(No, "__esModule", { value: !0 });
const Ki = se, Q_ = F, Z_ = ie, x_ = gr, eg = {
  message: ({ params: { len: e } }) => (0, Ki.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Ki._)`{limit: ${e}}`
}, tg = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: eg,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, Q_.alwaysValidSchema)(n, t) && (s ? (0, x_.validateAdditionalItems)(e, s) : e.ok((0, Z_.validateArray)(e)));
  }
};
No.default = tg;
var Ro = {};
Object.defineProperty(Ro, "__esModule", { value: !0 });
const Xe = se, ln = F, rg = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Xe.str)`must contain at least ${e} valid item(s)` : (0, Xe.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Xe._)`{minContains: ${e}}` : (0, Xe._)`{minContains: ${e}, maxContains: ${t}}`
}, ng = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: rg,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, c;
    const { minContains: l, maxContains: u } = n;
    a.opts.next ? (o = l === void 0 ? 1 : l, c = u) : o = 1;
    const d = t.const("len", (0, Xe._)`${s}.length`);
    if (e.setParams({ min: o, max: c }), c === void 0 && o === 0) {
      (0, ln.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (c !== void 0 && o > c) {
      (0, ln.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, ln.alwaysValidSchema)(a, r)) {
      let v = (0, Xe._)`${d} >= ${o}`;
      c !== void 0 && (v = (0, Xe._)`${v} && ${d} <= ${c}`), e.pass(v);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    c === void 0 && o === 1 ? y(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), c !== void 0 && t.if((0, Xe._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const v = t.name("_valid"), _ = t.let("count", 0);
      y(v, () => t.if(v, () => $(_)));
    }
    function y(v, _) {
      t.forRange("i", 0, d, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: ln.Type.Num,
          compositeRule: !0
        }, v), _();
      });
    }
    function $(v) {
      t.code((0, Xe._)`${v}++`), c === void 0 ? t.if((0, Xe._)`${v} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, Xe._)`${v} > ${c}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, Xe._)`${v} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
Ro.default = ng;
var ru = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = se, r = F, n = ie;
  e.error = {
    message: ({ params: { property: l, depsCount: u, deps: d } }) => {
      const h = u === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${d} when property ${l} is present`;
    },
    params: ({ params: { property: l, depsCount: u, deps: d, missingProperty: h } }) => (0, t._)`{property: ${l},
    missingProperty: ${h},
    depsCount: ${u},
    deps: ${d}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(l) {
      const [u, d] = a(l);
      o(l, u), c(l, d);
    }
  };
  function a({ schema: l }) {
    const u = {}, d = {};
    for (const h in l) {
      if (h === "__proto__")
        continue;
      const E = Array.isArray(l[h]) ? u : d;
      E[h] = l[h];
    }
    return [u, d];
  }
  function o(l, u = l.schema) {
    const { gen: d, data: h, it: E } = l;
    if (Object.keys(u).length === 0)
      return;
    const y = d.let("missing");
    for (const $ in u) {
      const v = u[$];
      if (v.length === 0)
        continue;
      const _ = (0, n.propertyInData)(d, h, $, E.opts.ownProperties);
      l.setParams({
        property: $,
        depsCount: v.length,
        deps: v.join(", ")
      }), E.allErrors ? d.if(_, () => {
        for (const m of v)
          (0, n.checkReportMissingProp)(l, m);
      }) : (d.if((0, t._)`${_} && (${(0, n.checkMissingProp)(l, v, y)})`), (0, n.reportMissingProp)(l, y), d.else());
    }
  }
  e.validatePropertyDeps = o;
  function c(l, u = l.schema) {
    const { gen: d, data: h, keyword: E, it: y } = l, $ = d.name("valid");
    for (const v in u)
      (0, r.alwaysValidSchema)(y, u[v]) || (d.if(
        (0, n.propertyInData)(d, h, v, y.opts.ownProperties),
        () => {
          const _ = l.subschema({ keyword: E, schemaProp: v }, $);
          l.mergeValidEvaluated(_, $);
        },
        () => d.var($, !0)
        // TODO var
      ), l.ok($));
  }
  e.validateSchemaDeps = c, e.default = s;
})(ru);
var Oo = {};
Object.defineProperty(Oo, "__esModule", { value: !0 });
const nu = se, sg = F, ag = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, nu._)`{propertyName: ${e.propertyName}}`
}, og = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: ag,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, sg.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, nu.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
Oo.default = og;
var xn = {};
Object.defineProperty(xn, "__esModule", { value: !0 });
const un = ie, xe = se, ig = ut, dn = F, cg = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, xe._)`{additionalProperty: ${e.additionalProperty}}`
}, lg = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: cg,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: c, opts: l } = o;
    if (o.props = !0, l.removeAdditional !== "all" && (0, dn.alwaysValidSchema)(o, r))
      return;
    const u = (0, un.allSchemaProperties)(n.properties), d = (0, un.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, xe._)`${a} === ${ig.default.errors}`);
    function h() {
      t.forIn("key", s, (_) => {
        !u.length && !d.length ? $(_) : t.if(E(_), () => $(_));
      });
    }
    function E(_) {
      let m;
      if (u.length > 8) {
        const w = (0, dn.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, un.isOwnProperty)(t, w, _);
      } else u.length ? m = (0, xe.or)(...u.map((w) => (0, xe._)`${_} === ${w}`)) : m = xe.nil;
      return d.length && (m = (0, xe.or)(m, ...d.map((w) => (0, xe._)`${(0, un.usePattern)(e, w)}.test(${_})`))), (0, xe.not)(m);
    }
    function y(_) {
      t.code((0, xe._)`delete ${s}[${_}]`);
    }
    function $(_) {
      if (l.removeAdditional === "all" || l.removeAdditional && r === !1) {
        y(_);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: _ }), e.error(), c || t.break();
        return;
      }
      if (typeof r == "object" && !(0, dn.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        l.removeAdditional === "failing" ? (v(_, m, !1), t.if((0, xe.not)(m), () => {
          e.reset(), y(_);
        })) : (v(_, m), c || t.if((0, xe.not)(m), () => t.break()));
      }
    }
    function v(_, m, w) {
      const P = {
        keyword: "additionalProperties",
        dataProp: _,
        dataPropType: dn.Type.Str
      };
      w === !1 && Object.assign(P, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(P, m);
    }
  }
};
xn.default = lg;
var Io = {};
Object.defineProperty(Io, "__esModule", { value: !0 });
const ug = rt, Hi = ie, _s = F, Ji = xn, dg = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Ji.default.code(new ug.KeywordCxt(a, Ji.default, "additionalProperties"));
    const o = (0, Hi.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = _s.mergeEvaluated.props(t, (0, _s.toHash)(o), a.props));
    const c = o.filter((h) => !(0, _s.alwaysValidSchema)(a, r[h]));
    if (c.length === 0)
      return;
    const l = t.name("valid");
    for (const h of c)
      u(h) ? d(h) : (t.if((0, Hi.propertyInData)(t, s, h, a.opts.ownProperties)), d(h), a.allErrors || t.else().var(l, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(l);
    function u(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function d(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, l);
    }
  }
};
Io.default = dg;
var To = {};
Object.defineProperty(To, "__esModule", { value: !0 });
const Xi = ie, fn = se, Bi = F, Wi = F, fg = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, c = (0, Xi.allSchemaProperties)(r), l = c.filter((v) => (0, Bi.alwaysValidSchema)(a, r[v]));
    if (c.length === 0 || l.length === c.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const u = o.strictSchema && !o.allowMatchingProperties && s.properties, d = t.name("valid");
    a.props !== !0 && !(a.props instanceof fn.Name) && (a.props = (0, Wi.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    E();
    function E() {
      for (const v of c)
        u && y(v), a.allErrors ? $(v) : (t.var(d, !0), $(v), t.if(d));
    }
    function y(v) {
      for (const _ in u)
        new RegExp(v).test(_) && (0, Bi.checkStrictMode)(a, `property ${_} matches pattern ${v} (use allowMatchingProperties)`);
    }
    function $(v) {
      t.forIn("key", n, (_) => {
        t.if((0, fn._)`${(0, Xi.usePattern)(e, v)}.test(${_})`, () => {
          const m = l.includes(v);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: v,
            dataProp: _,
            dataPropType: Wi.Type.Str
          }, d), a.opts.unevaluated && h !== !0 ? t.assign((0, fn._)`${h}[${_}]`, !0) : !m && !a.allErrors && t.if((0, fn.not)(d), () => t.break());
        });
      });
    }
  }
};
To.default = fg;
var jo = {};
Object.defineProperty(jo, "__esModule", { value: !0 });
const hg = F, mg = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, hg.alwaysValidSchema)(n, r)) {
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
jo.default = mg;
var ko = {};
Object.defineProperty(ko, "__esModule", { value: !0 });
const pg = ie, $g = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: pg.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
ko.default = $g;
var Ao = {};
Object.defineProperty(Ao, "__esModule", { value: !0 });
const Nn = se, yg = F, _g = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Nn._)`{passingSchemas: ${e.passing}}`
}, gg = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: _g,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), c = t.let("passing", null), l = t.name("_valid");
    e.setParams({ passing: c }), t.block(u), e.result(o, () => e.reset(), () => e.error(!0));
    function u() {
      a.forEach((d, h) => {
        let E;
        (0, yg.alwaysValidSchema)(s, d) ? t.var(l, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, l), h > 0 && t.if((0, Nn._)`${l} && ${o}`).assign(o, !1).assign(c, (0, Nn._)`[${c}, ${h}]`).else(), t.if(l, () => {
          t.assign(o, !0), t.assign(c, h), E && e.mergeEvaluated(E, Nn.Name);
        });
      });
    }
  }
};
Ao.default = gg;
var Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
const vg = F, wg = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, vg.alwaysValidSchema)(n, a))
        return;
      const c = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(c);
    });
  }
};
Co.default = wg;
var Do = {};
Object.defineProperty(Do, "__esModule", { value: !0 });
const Ln = se, su = F, Eg = {
  message: ({ params: e }) => (0, Ln.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Ln._)`{failingKeyword: ${e.ifClause}}`
}, bg = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Eg,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, su.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Yi(n, "then"), a = Yi(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), c = t.name("_valid");
    if (l(), e.reset(), s && a) {
      const d = t.let("ifClause");
      e.setParams({ ifClause: d }), t.if(c, u("then", d), u("else", d));
    } else s ? t.if(c, u("then")) : t.if((0, Ln.not)(c), u("else"));
    e.pass(o, () => e.error(!0));
    function l() {
      const d = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, c);
      e.mergeEvaluated(d);
    }
    function u(d, h) {
      return () => {
        const E = e.subschema({ keyword: d }, c);
        t.assign(o, c), e.mergeValidEvaluated(E, o), h ? t.assign(h, (0, Ln._)`${d}`) : e.setParams({ ifClause: d });
      };
    }
  }
};
function Yi(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, su.alwaysValidSchema)(e, r);
}
Do.default = bg;
var Mo = {};
Object.defineProperty(Mo, "__esModule", { value: !0 });
const Sg = F, Pg = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Sg.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Mo.default = Pg;
Object.defineProperty(So, "__esModule", { value: !0 });
const Ng = gr, Rg = Po, Og = vr, Ig = No, Tg = Ro, jg = ru, kg = Oo, Ag = xn, Cg = Io, Dg = To, Mg = jo, Vg = ko, Lg = Ao, Fg = Co, zg = Do, Ug = Mo;
function qg(e = !1) {
  const t = [
    // any
    Mg.default,
    Vg.default,
    Lg.default,
    Fg.default,
    zg.default,
    Ug.default,
    // object
    kg.default,
    Ag.default,
    jg.default,
    Cg.default,
    Dg.default
  ];
  return e ? t.push(Rg.default, Ig.default) : t.push(Ng.default, Og.default), t.push(Tg.default), t;
}
So.default = qg;
var Vo = {}, Lo = {};
Object.defineProperty(Lo, "__esModule", { value: !0 });
const ve = se, Gg = {
  message: ({ schemaCode: e }) => (0, ve.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, ve._)`{format: ${e}}`
}, Kg = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Gg,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: c } = e, { opts: l, errSchemaPath: u, schemaEnv: d, self: h } = c;
    if (!l.validateFormats)
      return;
    s ? E() : y();
    function E() {
      const $ = r.scopeValue("formats", {
        ref: h.formats,
        code: l.code.formats
      }), v = r.const("fDef", (0, ve._)`${$}[${o}]`), _ = r.let("fType"), m = r.let("format");
      r.if((0, ve._)`typeof ${v} == "object" && !(${v} instanceof RegExp)`, () => r.assign(_, (0, ve._)`${v}.type || "string"`).assign(m, (0, ve._)`${v}.validate`), () => r.assign(_, (0, ve._)`"string"`).assign(m, v)), e.fail$data((0, ve.or)(w(), P()));
      function w() {
        return l.strictSchema === !1 ? ve.nil : (0, ve._)`${o} && !${m}`;
      }
      function P() {
        const I = d.$async ? (0, ve._)`(${v}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, ve._)`${m}(${n})`, T = (0, ve._)`(typeof ${m} == "function" ? ${I} : ${m}.test(${n}))`;
        return (0, ve._)`${m} && ${m} !== true && ${_} === ${t} && !${T}`;
      }
    }
    function y() {
      const $ = h.formats[a];
      if (!$) {
        w();
        return;
      }
      if ($ === !0)
        return;
      const [v, _, m] = P($);
      v === t && e.pass(I());
      function w() {
        if (l.strictSchema === !1) {
          h.logger.warn(T());
          return;
        }
        throw new Error(T());
        function T() {
          return `unknown format "${a}" ignored in schema at path "${u}"`;
        }
      }
      function P(T) {
        const K = T instanceof RegExp ? (0, ve.regexpCode)(T) : l.code.formats ? (0, ve._)`${l.code.formats}${(0, ve.getProperty)(a)}` : void 0, Y = r.scopeValue("formats", { key: a, ref: T, code: K });
        return typeof T == "object" && !(T instanceof RegExp) ? [T.type || "string", T.validate, (0, ve._)`${Y}.validate`] : ["string", T, Y];
      }
      function I() {
        if (typeof $ == "object" && !($ instanceof RegExp) && $.async) {
          if (!d.$async)
            throw new Error("async format in sync schema");
          return (0, ve._)`await ${m}(${n})`;
        }
        return typeof _ == "function" ? (0, ve._)`${m}(${n})` : (0, ve._)`${m}.test(${n})`;
      }
    }
  }
};
Lo.default = Kg;
Object.defineProperty(Vo, "__esModule", { value: !0 });
const Hg = Lo, Jg = [Hg.default];
Vo.default = Jg;
var fr = {};
Object.defineProperty(fr, "__esModule", { value: !0 });
fr.contentVocabulary = fr.metadataVocabulary = void 0;
fr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
fr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(co, "__esModule", { value: !0 });
const Xg = lo, Bg = fo, Wg = So, Yg = Vo, Qi = fr, Qg = [
  Xg.default,
  Bg.default,
  (0, Wg.default)(),
  Yg.default,
  Qi.metadataVocabulary,
  Qi.contentVocabulary
];
co.default = Qg;
var Fo = {}, es = {};
Object.defineProperty(es, "__esModule", { value: !0 });
es.DiscrError = void 0;
var Zi;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Zi || (es.DiscrError = Zi = {}));
Object.defineProperty(Fo, "__esModule", { value: !0 });
const sr = se, Gs = es, xi = qe, Zg = _r, xg = F, ev = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Gs.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, sr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, tv = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: ev,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const c = n.propertyName;
    if (typeof c != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const l = t.let("valid", !1), u = t.const("tag", (0, sr._)`${r}${(0, sr.getProperty)(c)}`);
    t.if((0, sr._)`typeof ${u} == "string"`, () => d(), () => e.error(!1, { discrError: Gs.DiscrError.Tag, tag: u, tagName: c })), e.ok(l);
    function d() {
      const y = E();
      t.if(!1);
      for (const $ in y)
        t.elseIf((0, sr._)`${u} === ${$}`), t.assign(l, h(y[$]));
      t.else(), e.error(!1, { discrError: Gs.DiscrError.Mapping, tag: u, tagName: c }), t.endIf();
    }
    function h(y) {
      const $ = t.name("valid"), v = e.subschema({ keyword: "oneOf", schemaProp: y }, $);
      return e.mergeEvaluated(v, sr.Name), $;
    }
    function E() {
      var y;
      const $ = {}, v = m(s);
      let _ = !0;
      for (let I = 0; I < o.length; I++) {
        let T = o[I];
        if (T != null && T.$ref && !(0, xg.schemaHasRulesButRef)(T, a.self.RULES)) {
          const Y = T.$ref;
          if (T = xi.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, Y), T instanceof xi.SchemaEnv && (T = T.schema), T === void 0)
            throw new Zg.default(a.opts.uriResolver, a.baseId, Y);
        }
        const K = (y = T == null ? void 0 : T.properties) === null || y === void 0 ? void 0 : y[c];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${c}"`);
        _ = _ && (v || m(T)), w(K, I);
      }
      if (!_)
        throw new Error(`discriminator: "${c}" must be required`);
      return $;
      function m({ required: I }) {
        return Array.isArray(I) && I.includes(c);
      }
      function w(I, T) {
        if (I.const)
          P(I.const, T);
        else if (I.enum)
          for (const K of I.enum)
            P(K, T);
        else
          throw new Error(`discriminator: "properties/${c}" must have "const" or "enum"`);
      }
      function P(I, T) {
        if (typeof I != "string" || I in $)
          throw new Error(`discriminator: "${c}" values must be unique strings`);
        $[I] = T;
      }
    }
  }
};
Fo.default = tv;
const rv = "http://json-schema.org/draft-07/schema#", nv = "http://json-schema.org/draft-07/schema#", sv = "Core schema meta-schema", av = {
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
}, ov = [
  "object",
  "boolean"
], iv = {
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
}, cv = {
  $schema: rv,
  $id: nv,
  title: sv,
  definitions: av,
  type: ov,
  properties: iv,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = _l, n = co, s = Fo, a = cv, o = ["/properties"], c = "http://json-schema.org/draft-07/schema";
  class l extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach(($) => this.addVocabulary($)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const $ = this.opts.$data ? this.$dataMetaSchema(a, o) : a;
      this.addMetaSchema($, c, !1), this.refs["http://json-schema.org/schema"] = c;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(c) ? c : void 0);
    }
  }
  t.Ajv = l, e.exports = t = l, e.exports.Ajv = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
  var u = rt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return u.KeywordCxt;
  } });
  var d = se;
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
  var h = Qr;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var E = _r;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return E.default;
  } });
})(Ms, Ms.exports);
var lv = Ms.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = lv, r = se, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, a = {
    message: ({ keyword: c, schemaCode: l }) => (0, r.str)`should be ${s[c].okStr} ${l}`,
    params: ({ keyword: c, schemaCode: l }) => (0, r._)`{comparison: ${s[c].okStr}, limit: ${l}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: a,
    code(c) {
      const { gen: l, data: u, schemaCode: d, keyword: h, it: E } = c, { opts: y, self: $ } = E;
      if (!y.validateFormats)
        return;
      const v = new t.KeywordCxt(E, $.RULES.all.format.definition, "format");
      v.$data ? _() : m();
      function _() {
        const P = l.scopeValue("formats", {
          ref: $.formats,
          code: y.code.formats
        }), I = l.const("fmt", (0, r._)`${P}[${v.schemaCode}]`);
        c.fail$data((0, r.or)((0, r._)`typeof ${I} != "object"`, (0, r._)`${I} instanceof RegExp`, (0, r._)`typeof ${I}.compare != "function"`, w(I)));
      }
      function m() {
        const P = v.schema, I = $.formats[P];
        if (!I || I === !0)
          return;
        if (typeof I != "object" || I instanceof RegExp || typeof I.compare != "function")
          throw new Error(`"${h}": format "${P}" does not define "compare" function`);
        const T = l.scopeValue("formats", {
          key: P,
          ref: I,
          code: y.code.formats ? (0, r._)`${y.code.formats}${(0, r.getProperty)(P)}` : void 0
        });
        c.fail$data(w(T));
      }
      function w(P) {
        return (0, r._)`${P}.compare(${u}, ${d}) ${s[h].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const o = (c) => (c.addKeyword(e.formatLimitDefinition), c);
  e.default = o;
})(yl);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = $l, n = yl, s = se, a = new s.Name("fullFormats"), o = new s.Name("fastFormats"), c = (u, d = { keywords: !0 }) => {
    if (Array.isArray(d))
      return l(u, d, r.fullFormats, a), u;
    const [h, E] = d.mode === "fast" ? [r.fastFormats, o] : [r.fullFormats, a], y = d.formats || r.formatNames;
    return l(u, y, h, E), d.keywords && (0, n.default)(u), u;
  };
  c.get = (u, d = "full") => {
    const E = (d === "fast" ? r.fastFormats : r.fullFormats)[u];
    if (!E)
      throw new Error(`Unknown format "${u}"`);
    return E;
  };
  function l(u, d, h, E) {
    var y, $;
    (y = ($ = u.opts.code).formats) !== null && y !== void 0 || ($.formats = (0, s._)`require("ajv-formats/dist/formats").${E}`);
    for (const v of d)
      u.addFormat(v, h[v]);
  }
  e.exports = t = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
})(Ds, Ds.exports);
var uv = Ds.exports;
const dv = /* @__PURE__ */ kc(uv), fv = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), a = Object.getOwnPropertyDescriptor(t, r);
  !hv(s, a) && n || Object.defineProperty(e, r, a);
}, hv = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, mv = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, pv = (e, t) => `/* Wrapped ${e}*/
${t}`, $v = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), yv = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), _v = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = pv.bind(null, n, t.toString());
  Object.defineProperty(s, "name", yv);
  const { writable: a, enumerable: o, configurable: c } = $v;
  Object.defineProperty(e, "toString", { value: s, writable: a, enumerable: o, configurable: c });
};
function gv(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    fv(e, t, s, r);
  return mv(e, t), _v(e, t, n), e;
}
const ec = (e, t = {}) => {
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
  let o, c, l;
  const u = function(...d) {
    const h = this, E = () => {
      o = void 0, c && (clearTimeout(c), c = void 0), a && (l = e.apply(h, d));
    }, y = () => {
      c = void 0, o && (clearTimeout(o), o = void 0), a && (l = e.apply(h, d));
    }, $ = s && !o;
    return clearTimeout(o), o = setTimeout(E, r), n > 0 && n !== Number.POSITIVE_INFINITY && !c && (c = setTimeout(y, n)), $ && (l = e.apply(h, d)), l;
  };
  return gv(u, e), u.cancel = () => {
    o && (clearTimeout(o), o = void 0), c && (clearTimeout(c), c = void 0);
  }, u;
};
var Ks = { exports: {} };
const vv = "2.0.0", au = 256, wv = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, Ev = 16, bv = au - 6, Sv = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var ts = {
  MAX_LENGTH: au,
  MAX_SAFE_COMPONENT_LENGTH: Ev,
  MAX_SAFE_BUILD_LENGTH: bv,
  MAX_SAFE_INTEGER: wv,
  RELEASE_TYPES: Sv,
  SEMVER_SPEC_VERSION: vv,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Pv = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var rs = Pv;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = ts, a = rs;
  t = e.exports = {};
  const o = t.re = [], c = t.safeRe = [], l = t.src = [], u = t.t = {};
  let d = 0;
  const h = "[a-zA-Z0-9-]", E = [
    ["\\s", 1],
    ["\\d", s],
    [h, n]
  ], y = (v) => {
    for (const [_, m] of E)
      v = v.split(`${_}*`).join(`${_}{0,${m}}`).split(`${_}+`).join(`${_}{1,${m}}`);
    return v;
  }, $ = (v, _, m) => {
    const w = y(_), P = d++;
    a(v, P, _), u[v] = P, l[P] = _, o[P] = new RegExp(_, m ? "g" : void 0), c[P] = new RegExp(w, m ? "g" : void 0);
  };
  $("NUMERICIDENTIFIER", "0|[1-9]\\d*"), $("NUMERICIDENTIFIERLOOSE", "\\d+"), $("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), $("MAINVERSION", `(${l[u.NUMERICIDENTIFIER]})\\.(${l[u.NUMERICIDENTIFIER]})\\.(${l[u.NUMERICIDENTIFIER]})`), $("MAINVERSIONLOOSE", `(${l[u.NUMERICIDENTIFIERLOOSE]})\\.(${l[u.NUMERICIDENTIFIERLOOSE]})\\.(${l[u.NUMERICIDENTIFIERLOOSE]})`), $("PRERELEASEIDENTIFIER", `(?:${l[u.NUMERICIDENTIFIER]}|${l[u.NONNUMERICIDENTIFIER]})`), $("PRERELEASEIDENTIFIERLOOSE", `(?:${l[u.NUMERICIDENTIFIERLOOSE]}|${l[u.NONNUMERICIDENTIFIER]})`), $("PRERELEASE", `(?:-(${l[u.PRERELEASEIDENTIFIER]}(?:\\.${l[u.PRERELEASEIDENTIFIER]})*))`), $("PRERELEASELOOSE", `(?:-?(${l[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[u.PRERELEASEIDENTIFIERLOOSE]})*))`), $("BUILDIDENTIFIER", `${h}+`), $("BUILD", `(?:\\+(${l[u.BUILDIDENTIFIER]}(?:\\.${l[u.BUILDIDENTIFIER]})*))`), $("FULLPLAIN", `v?${l[u.MAINVERSION]}${l[u.PRERELEASE]}?${l[u.BUILD]}?`), $("FULL", `^${l[u.FULLPLAIN]}$`), $("LOOSEPLAIN", `[v=\\s]*${l[u.MAINVERSIONLOOSE]}${l[u.PRERELEASELOOSE]}?${l[u.BUILD]}?`), $("LOOSE", `^${l[u.LOOSEPLAIN]}$`), $("GTLT", "((?:<|>)?=?)"), $("XRANGEIDENTIFIERLOOSE", `${l[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), $("XRANGEIDENTIFIER", `${l[u.NUMERICIDENTIFIER]}|x|X|\\*`), $("XRANGEPLAIN", `[v=\\s]*(${l[u.XRANGEIDENTIFIER]})(?:\\.(${l[u.XRANGEIDENTIFIER]})(?:\\.(${l[u.XRANGEIDENTIFIER]})(?:${l[u.PRERELEASE]})?${l[u.BUILD]}?)?)?`), $("XRANGEPLAINLOOSE", `[v=\\s]*(${l[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[u.XRANGEIDENTIFIERLOOSE]})(?:${l[u.PRERELEASELOOSE]})?${l[u.BUILD]}?)?)?`), $("XRANGE", `^${l[u.GTLT]}\\s*${l[u.XRANGEPLAIN]}$`), $("XRANGELOOSE", `^${l[u.GTLT]}\\s*${l[u.XRANGEPLAINLOOSE]}$`), $("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), $("COERCE", `${l[u.COERCEPLAIN]}(?:$|[^\\d])`), $("COERCEFULL", l[u.COERCEPLAIN] + `(?:${l[u.PRERELEASE]})?(?:${l[u.BUILD]})?(?:$|[^\\d])`), $("COERCERTL", l[u.COERCE], !0), $("COERCERTLFULL", l[u.COERCEFULL], !0), $("LONETILDE", "(?:~>?)"), $("TILDETRIM", `(\\s*)${l[u.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", $("TILDE", `^${l[u.LONETILDE]}${l[u.XRANGEPLAIN]}$`), $("TILDELOOSE", `^${l[u.LONETILDE]}${l[u.XRANGEPLAINLOOSE]}$`), $("LONECARET", "(?:\\^)"), $("CARETTRIM", `(\\s*)${l[u.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", $("CARET", `^${l[u.LONECARET]}${l[u.XRANGEPLAIN]}$`), $("CARETLOOSE", `^${l[u.LONECARET]}${l[u.XRANGEPLAINLOOSE]}$`), $("COMPARATORLOOSE", `^${l[u.GTLT]}\\s*(${l[u.LOOSEPLAIN]})$|^$`), $("COMPARATOR", `^${l[u.GTLT]}\\s*(${l[u.FULLPLAIN]})$|^$`), $("COMPARATORTRIM", `(\\s*)${l[u.GTLT]}\\s*(${l[u.LOOSEPLAIN]}|${l[u.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", $("HYPHENRANGE", `^\\s*(${l[u.XRANGEPLAIN]})\\s+-\\s+(${l[u.XRANGEPLAIN]})\\s*$`), $("HYPHENRANGELOOSE", `^\\s*(${l[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[u.XRANGEPLAINLOOSE]})\\s*$`), $("STAR", "(<|>)?=?\\s*\\*"), $("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), $("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Ks, Ks.exports);
var xr = Ks.exports;
const Nv = Object.freeze({ loose: !0 }), Rv = Object.freeze({}), Ov = (e) => e ? typeof e != "object" ? Nv : e : Rv;
var zo = Ov;
const tc = /^[0-9]+$/, ou = (e, t) => {
  const r = tc.test(e), n = tc.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, Iv = (e, t) => ou(t, e);
var iu = {
  compareIdentifiers: ou,
  rcompareIdentifiers: Iv
};
const hn = rs, { MAX_LENGTH: rc, MAX_SAFE_INTEGER: mn } = ts, { safeRe: nc, t: sc } = xr, Tv = zo, { compareIdentifiers: er } = iu;
let jv = class ot {
  constructor(t, r) {
    if (r = Tv(r), t instanceof ot) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > rc)
      throw new TypeError(
        `version is longer than ${rc} characters`
      );
    hn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? nc[sc.LOOSE] : nc[sc.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > mn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > mn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > mn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < mn)
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
    if (hn("SemVer.compare", this.version, this.options, t), !(t instanceof ot)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new ot(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof ot || (t = new ot(t, this.options)), er(this.major, t.major) || er(this.minor, t.minor) || er(this.patch, t.patch);
  }
  comparePre(t) {
    if (t instanceof ot || (t = new ot(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = t.prerelease[r];
      if (hn("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return er(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof ot || (t = new ot(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (hn("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return er(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
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
        if (!r && n === !1)
          throw new Error("invalid increment argument: identifier is empty");
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
          n === !1 && (a = [r]), er(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Fe = jv;
const ac = Fe, kv = (e, t, r = !1) => {
  if (e instanceof ac)
    return e;
  try {
    return new ac(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var wr = kv;
const Av = wr, Cv = (e, t) => {
  const r = Av(e, t);
  return r ? r.version : null;
};
var Dv = Cv;
const Mv = wr, Vv = (e, t) => {
  const r = Mv(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var Lv = Vv;
const oc = Fe, Fv = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new oc(
      e instanceof oc ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var zv = Fv;
const ic = wr, Uv = (e, t) => {
  const r = ic(e, null, !0), n = ic(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const a = s > 0, o = a ? r : n, c = a ? n : r, l = !!o.prerelease.length;
  if (!!c.prerelease.length && !l)
    return !c.patch && !c.minor ? "major" : o.patch ? "patch" : o.minor ? "minor" : "major";
  const d = l ? "pre" : "";
  return r.major !== n.major ? d + "major" : r.minor !== n.minor ? d + "minor" : r.patch !== n.patch ? d + "patch" : "prerelease";
};
var qv = Uv;
const Gv = Fe, Kv = (e, t) => new Gv(e, t).major;
var Hv = Kv;
const Jv = Fe, Xv = (e, t) => new Jv(e, t).minor;
var Bv = Xv;
const Wv = Fe, Yv = (e, t) => new Wv(e, t).patch;
var Qv = Yv;
const Zv = wr, xv = (e, t) => {
  const r = Zv(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var ew = xv;
const cc = Fe, tw = (e, t, r) => new cc(e, r).compare(new cc(t, r));
var nt = tw;
const rw = nt, nw = (e, t, r) => rw(t, e, r);
var sw = nw;
const aw = nt, ow = (e, t) => aw(e, t, !0);
var iw = ow;
const lc = Fe, cw = (e, t, r) => {
  const n = new lc(e, r), s = new lc(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var Uo = cw;
const lw = Uo, uw = (e, t) => e.sort((r, n) => lw(r, n, t));
var dw = uw;
const fw = Uo, hw = (e, t) => e.sort((r, n) => fw(n, r, t));
var mw = hw;
const pw = nt, $w = (e, t, r) => pw(e, t, r) > 0;
var ns = $w;
const yw = nt, _w = (e, t, r) => yw(e, t, r) < 0;
var qo = _w;
const gw = nt, vw = (e, t, r) => gw(e, t, r) === 0;
var cu = vw;
const ww = nt, Ew = (e, t, r) => ww(e, t, r) !== 0;
var lu = Ew;
const bw = nt, Sw = (e, t, r) => bw(e, t, r) >= 0;
var Go = Sw;
const Pw = nt, Nw = (e, t, r) => Pw(e, t, r) <= 0;
var Ko = Nw;
const Rw = cu, Ow = lu, Iw = ns, Tw = Go, jw = qo, kw = Ko, Aw = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return Rw(e, r, n);
    case "!=":
      return Ow(e, r, n);
    case ">":
      return Iw(e, r, n);
    case ">=":
      return Tw(e, r, n);
    case "<":
      return jw(e, r, n);
    case "<=":
      return kw(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var uu = Aw;
const Cw = Fe, Dw = wr, { safeRe: pn, t: $n } = xr, Mw = (e, t) => {
  if (e instanceof Cw)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? pn[$n.COERCEFULL] : pn[$n.COERCE]);
  else {
    const l = t.includePrerelease ? pn[$n.COERCERTLFULL] : pn[$n.COERCERTL];
    let u;
    for (; (u = l.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || u.index + u[0].length !== r.index + r[0].length) && (r = u), l.lastIndex = u.index + u[1].length + u[2].length;
    l.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", c = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return Dw(`${n}.${s}.${a}${o}${c}`, t);
};
var Vw = Mw;
class Lw {
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
var Fw = Lw, gs, uc;
function st() {
  if (uc) return gs;
  uc = 1;
  const e = /\s+/g;
  class t {
    constructor(D, U) {
      if (U = s(U), D instanceof t)
        return D.loose === !!U.loose && D.includePrerelease === !!U.includePrerelease ? D : new t(D.raw, U);
      if (D instanceof a)
        return this.raw = D.value, this.set = [[D]], this.formatted = void 0, this;
      if (this.options = U, this.loose = !!U.loose, this.includePrerelease = !!U.includePrerelease, this.raw = D.trim().replace(e, " "), this.set = this.raw.split("||").map((L) => this.parseRange(L.trim())).filter((L) => L.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const L = this.set[0];
        if (this.set = this.set.filter((X) => !v(X[0])), this.set.length === 0)
          this.set = [L];
        else if (this.set.length > 1) {
          for (const X of this.set)
            if (X.length === 1 && _(X[0])) {
              this.set = [X];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let D = 0; D < this.set.length; D++) {
          D > 0 && (this.formatted += "||");
          const U = this.set[D];
          for (let L = 0; L < U.length; L++)
            L > 0 && (this.formatted += " "), this.formatted += U[L].toString().trim();
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
    parseRange(D) {
      const L = ((this.options.includePrerelease && y) | (this.options.loose && $)) + ":" + D, X = n.get(L);
      if (X)
        return X;
      const z = this.options.loose, N = z ? l[u.HYPHENRANGELOOSE] : l[u.HYPHENRANGE];
      D = D.replace(N, W(this.options.includePrerelease)), o("hyphen replace", D), D = D.replace(l[u.COMPARATORTRIM], d), o("comparator trim", D), D = D.replace(l[u.TILDETRIM], h), o("tilde trim", D), D = D.replace(l[u.CARETTRIM], E), o("caret trim", D);
      let p = D.split(" ").map((f) => w(f, this.options)).join(" ").split(/\s+/).map((f) => G(f, this.options));
      z && (p = p.filter((f) => (o("loose invalid filter", f, this.options), !!f.match(l[u.COMPARATORLOOSE])))), o("range list", p);
      const S = /* @__PURE__ */ new Map(), g = p.map((f) => new a(f, this.options));
      for (const f of g) {
        if (v(f))
          return [f];
        S.set(f.value, f);
      }
      S.size > 1 && S.has("") && S.delete("");
      const i = [...S.values()];
      return n.set(L, i), i;
    }
    intersects(D, U) {
      if (!(D instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((L) => m(L, U) && D.set.some((X) => m(X, U) && L.every((z) => X.every((N) => z.intersects(N, U)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(D) {
      if (!D)
        return !1;
      if (typeof D == "string")
        try {
          D = new c(D, this.options);
        } catch {
          return !1;
        }
      for (let U = 0; U < this.set.length; U++)
        if (Q(this.set[U], D, this.options))
          return !0;
      return !1;
    }
  }
  gs = t;
  const r = Fw, n = new r(), s = zo, a = ss(), o = rs, c = Fe, {
    safeRe: l,
    t: u,
    comparatorTrimReplace: d,
    tildeTrimReplace: h,
    caretTrimReplace: E
  } = xr, { FLAG_INCLUDE_PRERELEASE: y, FLAG_LOOSE: $ } = ts, v = (j) => j.value === "<0.0.0-0", _ = (j) => j.value === "", m = (j, D) => {
    let U = !0;
    const L = j.slice();
    let X = L.pop();
    for (; U && L.length; )
      U = L.every((z) => X.intersects(z, D)), X = L.pop();
    return U;
  }, w = (j, D) => (o("comp", j, D), j = K(j, D), o("caret", j), j = I(j, D), o("tildes", j), j = ce(j, D), o("xrange", j), j = $e(j, D), o("stars", j), j), P = (j) => !j || j.toLowerCase() === "x" || j === "*", I = (j, D) => j.trim().split(/\s+/).map((U) => T(U, D)).join(" "), T = (j, D) => {
    const U = D.loose ? l[u.TILDELOOSE] : l[u.TILDE];
    return j.replace(U, (L, X, z, N, p) => {
      o("tilde", j, L, X, z, N, p);
      let S;
      return P(X) ? S = "" : P(z) ? S = `>=${X}.0.0 <${+X + 1}.0.0-0` : P(N) ? S = `>=${X}.${z}.0 <${X}.${+z + 1}.0-0` : p ? (o("replaceTilde pr", p), S = `>=${X}.${z}.${N}-${p} <${X}.${+z + 1}.0-0`) : S = `>=${X}.${z}.${N} <${X}.${+z + 1}.0-0`, o("tilde return", S), S;
    });
  }, K = (j, D) => j.trim().split(/\s+/).map((U) => Y(U, D)).join(" "), Y = (j, D) => {
    o("caret", j, D);
    const U = D.loose ? l[u.CARETLOOSE] : l[u.CARET], L = D.includePrerelease ? "-0" : "";
    return j.replace(U, (X, z, N, p, S) => {
      o("caret", j, X, z, N, p, S);
      let g;
      return P(z) ? g = "" : P(N) ? g = `>=${z}.0.0${L} <${+z + 1}.0.0-0` : P(p) ? z === "0" ? g = `>=${z}.${N}.0${L} <${z}.${+N + 1}.0-0` : g = `>=${z}.${N}.0${L} <${+z + 1}.0.0-0` : S ? (o("replaceCaret pr", S), z === "0" ? N === "0" ? g = `>=${z}.${N}.${p}-${S} <${z}.${N}.${+p + 1}-0` : g = `>=${z}.${N}.${p}-${S} <${z}.${+N + 1}.0-0` : g = `>=${z}.${N}.${p}-${S} <${+z + 1}.0.0-0`) : (o("no pr"), z === "0" ? N === "0" ? g = `>=${z}.${N}.${p}${L} <${z}.${N}.${+p + 1}-0` : g = `>=${z}.${N}.${p}${L} <${z}.${+N + 1}.0-0` : g = `>=${z}.${N}.${p} <${+z + 1}.0.0-0`), o("caret return", g), g;
    });
  }, ce = (j, D) => (o("replaceXRanges", j, D), j.split(/\s+/).map((U) => de(U, D)).join(" ")), de = (j, D) => {
    j = j.trim();
    const U = D.loose ? l[u.XRANGELOOSE] : l[u.XRANGE];
    return j.replace(U, (L, X, z, N, p, S) => {
      o("xRange", j, L, X, z, N, p, S);
      const g = P(z), i = g || P(N), f = i || P(p), b = f;
      return X === "=" && b && (X = ""), S = D.includePrerelease ? "-0" : "", g ? X === ">" || X === "<" ? L = "<0.0.0-0" : L = "*" : X && b ? (i && (N = 0), p = 0, X === ">" ? (X = ">=", i ? (z = +z + 1, N = 0, p = 0) : (N = +N + 1, p = 0)) : X === "<=" && (X = "<", i ? z = +z + 1 : N = +N + 1), X === "<" && (S = "-0"), L = `${X + z}.${N}.${p}${S}`) : i ? L = `>=${z}.0.0${S} <${+z + 1}.0.0-0` : f && (L = `>=${z}.${N}.0${S} <${z}.${+N + 1}.0-0`), o("xRange return", L), L;
    });
  }, $e = (j, D) => (o("replaceStars", j, D), j.trim().replace(l[u.STAR], "")), G = (j, D) => (o("replaceGTE0", j, D), j.trim().replace(l[D.includePrerelease ? u.GTE0PRE : u.GTE0], "")), W = (j) => (D, U, L, X, z, N, p, S, g, i, f, b) => (P(L) ? U = "" : P(X) ? U = `>=${L}.0.0${j ? "-0" : ""}` : P(z) ? U = `>=${L}.${X}.0${j ? "-0" : ""}` : N ? U = `>=${U}` : U = `>=${U}${j ? "-0" : ""}`, P(g) ? S = "" : P(i) ? S = `<${+g + 1}.0.0-0` : P(f) ? S = `<${g}.${+i + 1}.0-0` : b ? S = `<=${g}.${i}.${f}-${b}` : j ? S = `<${g}.${i}.${+f + 1}-0` : S = `<=${S}`, `${U} ${S}`.trim()), Q = (j, D, U) => {
    for (let L = 0; L < j.length; L++)
      if (!j[L].test(D))
        return !1;
    if (D.prerelease.length && !U.includePrerelease) {
      for (let L = 0; L < j.length; L++)
        if (o(j[L].semver), j[L].semver !== a.ANY && j[L].semver.prerelease.length > 0) {
          const X = j[L].semver;
          if (X.major === D.major && X.minor === D.minor && X.patch === D.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return gs;
}
var vs, dc;
function ss() {
  if (dc) return vs;
  dc = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(d, h) {
      if (h = r(h), d instanceof t) {
        if (d.loose === !!h.loose)
          return d;
        d = d.value;
      }
      d = d.trim().split(/\s+/).join(" "), o("comparator", d, h), this.options = h, this.loose = !!h.loose, this.parse(d), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(d) {
      const h = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], E = d.match(h);
      if (!E)
        throw new TypeError(`Invalid comparator: ${d}`);
      this.operator = E[1] !== void 0 ? E[1] : "", this.operator === "=" && (this.operator = ""), E[2] ? this.semver = new c(E[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(d) {
      if (o("Comparator.test", d, this.options.loose), this.semver === e || d === e)
        return !0;
      if (typeof d == "string")
        try {
          d = new c(d, this.options);
        } catch {
          return !1;
        }
      return a(d, this.operator, this.semver, this.options);
    }
    intersects(d, h) {
      if (!(d instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new l(d.value, h).test(this.value) : d.operator === "" ? d.value === "" ? !0 : new l(this.value, h).test(d.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || d.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || d.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && d.operator.startsWith(">") || this.operator.startsWith("<") && d.operator.startsWith("<") || this.semver.version === d.semver.version && this.operator.includes("=") && d.operator.includes("=") || a(this.semver, "<", d.semver, h) && this.operator.startsWith(">") && d.operator.startsWith("<") || a(this.semver, ">", d.semver, h) && this.operator.startsWith("<") && d.operator.startsWith(">")));
    }
  }
  vs = t;
  const r = zo, { safeRe: n, t: s } = xr, a = uu, o = rs, c = Fe, l = st();
  return vs;
}
const zw = st(), Uw = (e, t, r) => {
  try {
    t = new zw(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var as = Uw;
const qw = st(), Gw = (e, t) => new qw(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var Kw = Gw;
const Hw = Fe, Jw = st(), Xw = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new Jw(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === -1) && (n = o, s = new Hw(n, r));
  }), n;
};
var Bw = Xw;
const Ww = Fe, Yw = st(), Qw = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new Yw(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === 1) && (n = o, s = new Ww(n, r));
  }), n;
};
var Zw = Qw;
const ws = Fe, xw = st(), fc = ns, eE = (e, t) => {
  e = new xw(e, t);
  let r = new ws("0.0.0");
  if (e.test(r) || (r = new ws("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let a = null;
    s.forEach((o) => {
      const c = new ws(o.semver.version);
      switch (o.operator) {
        case ">":
          c.prerelease.length === 0 ? c.patch++ : c.prerelease.push(0), c.raw = c.format();
        case "":
        case ">=":
          (!a || fc(c, a)) && (a = c);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || fc(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var tE = eE;
const rE = st(), nE = (e, t) => {
  try {
    return new rE(e, t).range || "*";
  } catch {
    return null;
  }
};
var sE = nE;
const aE = Fe, du = ss(), { ANY: oE } = du, iE = st(), cE = as, hc = ns, mc = qo, lE = Ko, uE = Go, dE = (e, t, r, n) => {
  e = new aE(e, n), t = new iE(t, n);
  let s, a, o, c, l;
  switch (r) {
    case ">":
      s = hc, a = lE, o = mc, c = ">", l = ">=";
      break;
    case "<":
      s = mc, a = uE, o = hc, c = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (cE(e, t, n))
    return !1;
  for (let u = 0; u < t.set.length; ++u) {
    const d = t.set[u];
    let h = null, E = null;
    if (d.forEach((y) => {
      y.semver === oE && (y = new du(">=0.0.0")), h = h || y, E = E || y, s(y.semver, h.semver, n) ? h = y : o(y.semver, E.semver, n) && (E = y);
    }), h.operator === c || h.operator === l || (!E.operator || E.operator === c) && a(e, E.semver))
      return !1;
    if (E.operator === l && o(e, E.semver))
      return !1;
  }
  return !0;
};
var Ho = dE;
const fE = Ho, hE = (e, t, r) => fE(e, t, ">", r);
var mE = hE;
const pE = Ho, $E = (e, t, r) => pE(e, t, "<", r);
var yE = $E;
const pc = st(), _E = (e, t, r) => (e = new pc(e, r), t = new pc(t, r), e.intersects(t, r));
var gE = _E;
const vE = as, wE = nt;
var EE = (e, t, r) => {
  const n = [];
  let s = null, a = null;
  const o = e.sort((d, h) => wE(d, h, r));
  for (const d of o)
    vE(d, t, r) ? (a = d, s || (s = d)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const c = [];
  for (const [d, h] of n)
    d === h ? c.push(d) : !h && d === o[0] ? c.push("*") : h ? d === o[0] ? c.push(`<=${h}`) : c.push(`${d} - ${h}`) : c.push(`>=${d}`);
  const l = c.join(" || "), u = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < u.length ? l : t;
};
const $c = st(), Jo = ss(), { ANY: Es } = Jo, kr = as, Xo = nt, bE = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new $c(e, r), t = new $c(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const a of t.set) {
      const o = PE(s, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, SE = [new Jo(">=0.0.0-0")], yc = [new Jo(">=0.0.0")], PE = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Es) {
    if (t.length === 1 && t[0].semver === Es)
      return !0;
    r.includePrerelease ? e = SE : e = yc;
  }
  if (t.length === 1 && t[0].semver === Es) {
    if (r.includePrerelease)
      return !0;
    t = yc;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const y of e)
    y.operator === ">" || y.operator === ">=" ? s = _c(s, y, r) : y.operator === "<" || y.operator === "<=" ? a = gc(a, y, r) : n.add(y.semver);
  if (n.size > 1)
    return null;
  let o;
  if (s && a) {
    if (o = Xo(s.semver, a.semver, r), o > 0)
      return null;
    if (o === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const y of n) {
    if (s && !kr(y, String(s), r) || a && !kr(y, String(a), r))
      return null;
    for (const $ of t)
      if (!kr(y, String($), r))
        return !1;
    return !0;
  }
  let c, l, u, d, h = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, E = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && a.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const y of t) {
    if (d = d || y.operator === ">" || y.operator === ">=", u = u || y.operator === "<" || y.operator === "<=", s) {
      if (E && y.semver.prerelease && y.semver.prerelease.length && y.semver.major === E.major && y.semver.minor === E.minor && y.semver.patch === E.patch && (E = !1), y.operator === ">" || y.operator === ">=") {
        if (c = _c(s, y, r), c === y && c !== s)
          return !1;
      } else if (s.operator === ">=" && !kr(s.semver, String(y), r))
        return !1;
    }
    if (a) {
      if (h && y.semver.prerelease && y.semver.prerelease.length && y.semver.major === h.major && y.semver.minor === h.minor && y.semver.patch === h.patch && (h = !1), y.operator === "<" || y.operator === "<=") {
        if (l = gc(a, y, r), l === y && l !== a)
          return !1;
      } else if (a.operator === "<=" && !kr(a.semver, String(y), r))
        return !1;
    }
    if (!y.operator && (a || s) && o !== 0)
      return !1;
  }
  return !(s && u && !a && o !== 0 || a && d && !s && o !== 0 || E || h);
}, _c = (e, t, r) => {
  if (!e)
    return t;
  const n = Xo(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, gc = (e, t, r) => {
  if (!e)
    return t;
  const n = Xo(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var NE = bE;
const bs = xr, vc = ts, RE = Fe, wc = iu, OE = wr, IE = Dv, TE = Lv, jE = zv, kE = qv, AE = Hv, CE = Bv, DE = Qv, ME = ew, VE = nt, LE = sw, FE = iw, zE = Uo, UE = dw, qE = mw, GE = ns, KE = qo, HE = cu, JE = lu, XE = Go, BE = Ko, WE = uu, YE = Vw, QE = ss(), ZE = st(), xE = as, eb = Kw, tb = Bw, rb = Zw, nb = tE, sb = sE, ab = Ho, ob = mE, ib = yE, cb = gE, lb = EE, ub = NE;
var db = {
  parse: OE,
  valid: IE,
  clean: TE,
  inc: jE,
  diff: kE,
  major: AE,
  minor: CE,
  patch: DE,
  prerelease: ME,
  compare: VE,
  rcompare: LE,
  compareLoose: FE,
  compareBuild: zE,
  sort: UE,
  rsort: qE,
  gt: GE,
  lt: KE,
  eq: HE,
  neq: JE,
  gte: XE,
  lte: BE,
  cmp: WE,
  coerce: YE,
  Comparator: QE,
  Range: ZE,
  satisfies: xE,
  toComparators: eb,
  maxSatisfying: tb,
  minSatisfying: rb,
  minVersion: nb,
  validRange: sb,
  outside: ab,
  gtr: ob,
  ltr: ib,
  intersects: cb,
  simplifyRange: lb,
  subset: ub,
  SemVer: RE,
  re: bs.re,
  src: bs.src,
  tokens: bs.t,
  SEMVER_SPEC_VERSION: vc.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: vc.RELEASE_TYPES,
  compareIdentifiers: wc.compareIdentifiers,
  rcompareIdentifiers: wc.rcompareIdentifiers
};
const tr = /* @__PURE__ */ kc(db), fb = Object.prototype.toString, hb = "[object Uint8Array]", mb = "[object ArrayBuffer]";
function fu(e, t, r) {
  return e ? e.constructor === t ? !0 : fb.call(e) === r : !1;
}
function hu(e) {
  return fu(e, Uint8Array, hb);
}
function pb(e) {
  return fu(e, ArrayBuffer, mb);
}
function $b(e) {
  return hu(e) || pb(e);
}
function yb(e) {
  if (!hu(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function _b(e) {
  if (!$b(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Ec(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    yb(s), r.set(s, n), n += s.length;
  return r;
}
const yn = {
  utf8: new globalThis.TextDecoder("utf8")
};
function bc(e, t = "utf8") {
  return _b(e), yn[t] ?? (yn[t] = new globalThis.TextDecoder(t)), yn[t].decode(e);
}
function gb(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const vb = new globalThis.TextEncoder();
function Ss(e) {
  return gb(e), vb.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const wb = dv.default, Sc = "aes-256-cbc", rr = () => /* @__PURE__ */ Object.create(null), Eb = (e) => e != null, bb = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Rn = "__internal__", Ps = `${Rn}.migrations.version`;
var jt, mt, Ke, pt;
class Sb {
  constructor(t = {}) {
    Sr(this, "path");
    Sr(this, "events");
    Pr(this, jt);
    Pr(this, mt);
    Pr(this, Ke);
    Pr(this, pt, {});
    Sr(this, "_deserialize", (t) => JSON.parse(t));
    Sr(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
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
      r.cwd = Tu(r.projectName, { suffix: r.projectSuffix }).config;
    }
    if (Nr(this, Ke, r), r.schema ?? r.ajvOptions ?? r.rootSchema) {
      if (r.schema && typeof r.schema != "object")
        throw new TypeError("The `schema` option must be an object.");
      const o = new Z$.Ajv2020({
        allErrors: !0,
        useDefaults: !0,
        ...r.ajvOptions
      });
      wb(o);
      const c = {
        ...r.rootSchema,
        type: "object",
        properties: r.schema
      };
      Nr(this, jt, o.compile(c));
      for (const [l, u] of Object.entries(r.schema ?? {}))
        u != null && u.default && (me(this, pt)[l] = u.default);
    }
    r.defaults && Nr(this, pt, {
      ...me(this, pt),
      ...r.defaults
    }), r.serialize && (this._serialize = r.serialize), r.deserialize && (this._deserialize = r.deserialize), this.events = new EventTarget(), Nr(this, mt, r.encryptionKey);
    const n = r.fileExtension ? `.${r.fileExtension}` : "";
    this.path = ae.resolve(r.cwd, `${r.configName ?? "config"}${n}`);
    const s = this.store, a = Object.assign(rr(), r.defaults, s);
    if (r.migrations) {
      if (!r.projectVersion)
        throw new Error("Please specify the `projectVersion` option.");
      this._migrate(r.migrations, r.projectVersion, r.beforeEachMigration);
    }
    this._validate(a);
    try {
      Eu.deepEqual(s, a);
    } catch {
      this.store = a;
    }
    r.watch && this._watch();
  }
  get(t, r) {
    if (me(this, Ke).accessPropertiesByDotNotation)
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
      throw new TypeError(`Please don't use the ${Rn} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, o) => {
      bb(a, o), me(this, Ke).accessPropertiesByDotNotation ? Qo(n, a, o) : n[a] = o;
    };
    if (typeof t == "object") {
      const a = t;
      for (const [o, c] of Object.entries(a))
        s(o, c);
    } else
      s(t, r);
    this.store = n;
  }
  /**
      Check if an item exists.
  
      @param key - The key of the item to check.
      */
  has(t) {
    return me(this, Ke).accessPropertiesByDotNotation ? Nu(this.store, t) : t in this.store;
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      Eb(me(this, pt)[r]) && this.set(r, me(this, pt)[r]);
  }
  delete(t) {
    const { store: r } = this;
    me(this, Ke).accessPropertiesByDotNotation ? Pu(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    this.store = rr();
    for (const t of Object.keys(me(this, pt)))
      this.reset(t);
  }
  /**
      Watches the given `key`, calling `callback` on any changes.
  
      @param key - The key to watch.
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
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
  get store() {
    try {
      const t = ne.readFileSync(this.path, me(this, mt) ? null : "utf8"), r = this._encryptData(t), n = this._deserialize(r);
      return this._validate(n), Object.assign(rr(), n);
    } catch (t) {
      if ((t == null ? void 0 : t.code) === "ENOENT")
        return this._ensureDirectory(), rr();
      if (me(this, Ke).clearInvalidConfig && t.name === "SyntaxError")
        return rr();
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
    if (!me(this, mt))
      return typeof t == "string" ? t : bc(t);
    try {
      const r = t.slice(0, 16), n = Rr.pbkdf2Sync(me(this, mt), r.toString(), 1e4, 32, "sha512"), s = Rr.createDecipheriv(Sc, n, r), a = t.slice(17), o = typeof a == "string" ? Ss(a) : a;
      return bc(Ec([s.update(o), s.final()]));
    } catch {
    }
    return t.toString();
  }
  _handleChange(t, r) {
    let n = t();
    const s = () => {
      const a = n, o = t();
      wu(o, a) || (n = o, r.call(this, o, a));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(t) {
    if (!me(this, jt) || me(this, jt).call(this, t) || !me(this, jt).errors)
      return;
    const n = me(this, jt).errors.map(({ instancePath: s, message: a = "" }) => `\`${s.slice(1)}\` ${a}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    ne.mkdirSync(ae.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    if (me(this, mt)) {
      const n = Rr.randomBytes(16), s = Rr.pbkdf2Sync(me(this, mt), n.toString(), 1e4, 32, "sha512"), a = Rr.createCipheriv(Sc, s, n);
      r = Ec([n, Ss(":"), a.update(Ss(r)), a.final()]);
    }
    if (be.env.SNAP)
      ne.writeFileSync(this.path, r, { mode: me(this, Ke).configFileMode });
    else
      try {
        jc(this.path, r, { mode: me(this, Ke).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          ne.writeFileSync(this.path, r, { mode: me(this, Ke).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    this._ensureDirectory(), ne.existsSync(this.path) || this._write(rr()), be.platform === "win32" ? ne.watch(this.path, { persistent: !1 }, ec(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 100 })) : ne.watchFile(this.path, { persistent: !1 }, ec(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 5e3 }));
  }
  _migrate(t, r, n) {
    let s = this._get(Ps, "0.0.0");
    const a = Object.keys(t).filter((c) => this._shouldPerformMigration(c, s, r));
    let o = { ...this.store };
    for (const c of a)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: c,
          finalVersion: r,
          versions: a
        });
        const l = t[c];
        l == null || l(this), this._set(Ps, c), s = c, o = { ...this.store };
      } catch (l) {
        throw this.store = o, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${l}`);
      }
    (this._isVersionInRangeFormat(s) || !tr.eq(s, r)) && this._set(Ps, r);
  }
  _containsReservedKey(t) {
    return typeof t == "object" && Object.keys(t)[0] === Rn ? !0 : typeof t != "string" ? !1 : me(this, Ke).accessPropertiesByDotNotation ? !!t.startsWith(`${Rn}.`) : !1;
  }
  _isVersionInRangeFormat(t) {
    return tr.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && tr.satisfies(r, t) ? !1 : tr.satisfies(n, t) : !(tr.lte(t, r) || tr.gt(t, n));
  }
  _get(t, r) {
    return Su(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    Qo(n, t, r), this.store = n;
  }
}
jt = new WeakMap(), mt = new WeakMap(), Ke = new WeakMap(), pt = new WeakMap();
const { app: On, ipcMain: Hs, shell: Pb } = Rc;
let Pc = !1;
const Nc = () => {
  if (!Hs || !On)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: On.getPath("userData"),
    appVersion: On.getVersion()
  };
  return Pc || (Hs.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), Pc = !0), e;
};
class Nb extends Sb {
  constructor(t) {
    let r, n;
    if (be.type === "renderer") {
      const s = Rc.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else Hs && On && ({ defaultCwd: r, appVersion: n } = Nc());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = ae.isAbsolute(t.cwd) ? t.cwd : ae.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    Nc();
  }
  async openInEditor() {
    const t = await Pb.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const Bo = new Nb();
Fn.handle("electron-store-get", (e, t) => Bo.get(t));
Fn.handle("electron-store-set", (e, t, r) => {
  Bo.set(t, r);
});
Fn.handle("electron-store-delete", (e, t) => {
  Bo.delete(t);
});
Fn.on("save-project-backup", (e, t, r) => {
  const n = ae.join(Hr.getPath("userData"), `${r}.json`);
  try {
    vu.writeFileSync(n, JSON.stringify(t, null, 2), "utf-8"), console.log("✅ 프로젝트 백업 저장 완료:", n);
  } catch (s) {
    console.error("❌ 프로젝트 백업 저장 실패:", s);
  }
});
_u(import.meta.url);
const mu = ae.dirname(gu(import.meta.url));
process.env.APP_ROOT = ae.join(mu, "..");
const Js = process.env.VITE_DEV_SERVER_URL, Ub = ae.join(process.env.APP_ROOT, "dist-electron"), In = ae.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Js ? ae.join(process.env.APP_ROOT, "public") : In;
let It;
function pu() {
  It = new Oc({
    icon: ae.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: ae.join(mu, "preload.mjs")
    }
  }), It.webContents.on("did-finish-load", () => {
    It == null || It.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), Js ? It.loadURL(Js) : (console.log("RENDERER_DIST:", In), console.log("index.html path:", ae.join(In, "index.html")), It.loadFile(ae.join(In, "index.html")));
}
Hr.on("window-all-closed", () => {
  process.platform !== "darwin" && (Hr.quit(), It = null);
});
Hr.on("activate", () => {
  Oc.getAllWindows().length === 0 && pu();
});
Hr.whenReady().then(pu);
export {
  Ub as MAIN_DIST,
  In as RENDERER_DIST,
  Js as VITE_DEV_SERVER_URL
};
