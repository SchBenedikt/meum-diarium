var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count4, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var isWorkerdProcessV2 = globalThis.Cloudflare.compatibilityFlags.enable_nodejs_process_v2;
var unenvProcess = new Process({
  env: globalProcess.env,
  // `hrtime` is only available from workerd process v2
  hrtime: isWorkerdProcessV2 ? workerdProcess.hrtime : hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  // Always implemented by workerd
  env,
  // Only implemented in workerd v2
  hrtime: hrtime3,
  // Always implemented by workerd
  nextTick
} = unenvProcess;
var {
  _channel,
  _disconnect,
  _events,
  _eventsCount,
  _handleQueue,
  _maxListeners,
  _pendingMessage,
  _send,
  assert: assert2,
  disconnect,
  mainModule
} = unenvProcess;
var {
  // @ts-expect-error `_debugEnd` is missing typings
  _debugEnd,
  // @ts-expect-error `_debugProcess` is missing typings
  _debugProcess,
  // @ts-expect-error `_exiting` is missing typings
  _exiting,
  // @ts-expect-error `_fatalException` is missing typings
  _fatalException,
  // @ts-expect-error `_getActiveHandles` is missing typings
  _getActiveHandles,
  // @ts-expect-error `_getActiveRequests` is missing typings
  _getActiveRequests,
  // @ts-expect-error `_kill` is missing typings
  _kill,
  // @ts-expect-error `_linkedBinding` is missing typings
  _linkedBinding,
  // @ts-expect-error `_preload_modules` is missing typings
  _preload_modules,
  // @ts-expect-error `_rawDebug` is missing typings
  _rawDebug,
  // @ts-expect-error `_startProfilerIdleNotifier` is missing typings
  _startProfilerIdleNotifier,
  // @ts-expect-error `_stopProfilerIdleNotifier` is missing typings
  _stopProfilerIdleNotifier,
  // @ts-expect-error `_tickCallback` is missing typings
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  availableMemory,
  // @ts-expect-error `binding` is missing typings
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  // @ts-expect-error `domain` is missing typings
  domain,
  emit,
  emitWarning,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  // @ts-expect-error `initgroups` is missing typings
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  memoryUsage,
  // @ts-expect-error `moduleLoadList` is missing typings
  moduleLoadList,
  off,
  on,
  once,
  // @ts-expect-error `openStdin` is missing typings
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  // @ts-expect-error `reallyExit` is missing typings
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = isWorkerdProcessV2 ? workerdProcess : unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// ../node_modules/drizzle-orm/entity.js
var entityKind = Symbol.for("drizzle:entityKind");
var hasOwnEntityKind = Symbol.for("drizzle:hasOwnEntityKind");
function is(value, type) {
  if (!value || typeof value !== "object") {
    return false;
  }
  if (value instanceof type) {
    return true;
  }
  if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
    throw new Error(
      `Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  }
  let cls = Object.getPrototypeOf(value).constructor;
  if (cls) {
    while (cls) {
      if (entityKind in cls && cls[entityKind] === type[entityKind]) {
        return true;
      }
      cls = Object.getPrototypeOf(cls);
    }
  }
  return false;
}
__name(is, "is");

// ../node_modules/drizzle-orm/logger.js
var ConsoleLogWriter = class {
  static {
    __name(this, "ConsoleLogWriter");
  }
  static [entityKind] = "ConsoleLogWriter";
  write(message) {
    console.log(message);
  }
};
var DefaultLogger = class {
  static {
    __name(this, "DefaultLogger");
  }
  static [entityKind] = "DefaultLogger";
  writer;
  constructor(config2) {
    this.writer = config2?.writer ?? new ConsoleLogWriter();
  }
  logQuery(query, params) {
    const stringifiedParams = params.map((p) => {
      try {
        return JSON.stringify(p);
      } catch {
        return String(p);
      }
    });
    const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
    this.writer.write(`Query: ${query}${paramsStr}`);
  }
};
var NoopLogger = class {
  static {
    __name(this, "NoopLogger");
  }
  static [entityKind] = "NoopLogger";
  logQuery() {
  }
};

// ../node_modules/drizzle-orm/table.utils.js
var TableName = Symbol.for("drizzle:Name");

// ../node_modules/drizzle-orm/table.js
var Schema = Symbol.for("drizzle:Schema");
var Columns = Symbol.for("drizzle:Columns");
var ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
var OriginalName = Symbol.for("drizzle:OriginalName");
var BaseName = Symbol.for("drizzle:BaseName");
var IsAlias = Symbol.for("drizzle:IsAlias");
var ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
var IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
var Table = class {
  static {
    __name(this, "Table");
  }
  static [entityKind] = "Table";
  /** @internal */
  static Symbol = {
    Name: TableName,
    Schema,
    OriginalName,
    Columns,
    ExtraConfigColumns,
    BaseName,
    IsAlias,
    ExtraConfigBuilder
  };
  /**
   * @internal
   * Can be changed if the table is aliased.
   */
  [TableName];
  /**
   * @internal
   * Used to store the original name of the table, before any aliasing.
   */
  [OriginalName];
  /** @internal */
  [Schema];
  /** @internal */
  [Columns];
  /** @internal */
  [ExtraConfigColumns];
  /**
   *  @internal
   * Used to store the table name before the transformation via the `tableCreator` functions.
   */
  [BaseName];
  /** @internal */
  [IsAlias] = false;
  /** @internal */
  [IsDrizzleTable] = true;
  /** @internal */
  [ExtraConfigBuilder] = void 0;
  constructor(name, schema, baseName) {
    this[TableName] = this[OriginalName] = name;
    this[Schema] = schema;
    this[BaseName] = baseName;
  }
};
function getTableName(table3) {
  return table3[TableName];
}
__name(getTableName, "getTableName");
function getTableUniqueName(table3) {
  return `${table3[Schema] ?? "public"}.${table3[TableName]}`;
}
__name(getTableUniqueName, "getTableUniqueName");

// ../node_modules/drizzle-orm/column.js
var Column = class {
  static {
    __name(this, "Column");
  }
  constructor(table3, config2) {
    this.table = table3;
    this.config = config2;
    this.name = config2.name;
    this.keyAsName = config2.keyAsName;
    this.notNull = config2.notNull;
    this.default = config2.default;
    this.defaultFn = config2.defaultFn;
    this.onUpdateFn = config2.onUpdateFn;
    this.hasDefault = config2.hasDefault;
    this.primary = config2.primaryKey;
    this.isUnique = config2.isUnique;
    this.uniqueName = config2.uniqueName;
    this.uniqueType = config2.uniqueType;
    this.dataType = config2.dataType;
    this.columnType = config2.columnType;
    this.generated = config2.generated;
    this.generatedIdentity = config2.generatedIdentity;
  }
  static [entityKind] = "Column";
  name;
  keyAsName;
  primary;
  notNull;
  default;
  defaultFn;
  onUpdateFn;
  hasDefault;
  isUnique;
  uniqueName;
  uniqueType;
  dataType;
  columnType;
  enumValues = void 0;
  generated = void 0;
  generatedIdentity = void 0;
  config;
  mapFromDriverValue(value) {
    return value;
  }
  mapToDriverValue(value) {
    return value;
  }
  // ** @internal */
  shouldDisableInsert() {
    return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
  }
};

// ../node_modules/drizzle-orm/column-builder.js
var ColumnBuilder = class {
  static {
    __name(this, "ColumnBuilder");
  }
  static [entityKind] = "ColumnBuilder";
  config;
  constructor(name, dataType, columnType) {
    this.config = {
      name,
      keyAsName: name === "",
      notNull: false,
      default: void 0,
      hasDefault: false,
      primaryKey: false,
      isUnique: false,
      uniqueName: void 0,
      uniqueType: void 0,
      dataType,
      columnType,
      generated: void 0
    };
  }
  /**
   * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
   *
   * @example
   * ```ts
   * const users = pgTable('users', {
   * 	id: integer('id').$type<UserId>().primaryKey(),
   * 	details: json('details').$type<UserDetails>().notNull(),
   * });
   * ```
   */
  $type() {
    return this;
  }
  /**
   * Adds a `not null` clause to the column definition.
   *
   * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
   */
  notNull() {
    this.config.notNull = true;
    return this;
  }
  /**
   * Adds a `default <value>` clause to the column definition.
   *
   * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
   *
   * If you need to set a dynamic default value, use {@link $defaultFn} instead.
   */
  default(value) {
    this.config.default = value;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Adds a dynamic default value to the column.
   * The function will be called when the row is inserted, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $defaultFn(fn) {
    this.config.defaultFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Alias for {@link $defaultFn}.
   */
  $default = this.$defaultFn;
  /**
   * Adds a dynamic update value to the column.
   * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
   * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $onUpdateFn(fn) {
    this.config.onUpdateFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Alias for {@link $onUpdateFn}.
   */
  $onUpdate = this.$onUpdateFn;
  /**
   * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
   *
   * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
   */
  primaryKey() {
    this.config.primaryKey = true;
    this.config.notNull = true;
    return this;
  }
  /** @internal Sets the name of the column to the key within the table definition if a name was not given. */
  setName(name) {
    if (this.config.name !== "") return;
    this.config.name = name;
  }
};

// ../node_modules/drizzle-orm/pg-core/foreign-keys.js
var ForeignKeyBuilder = class {
  static {
    __name(this, "ForeignKeyBuilder");
  }
  static [entityKind] = "PgForeignKeyBuilder";
  /** @internal */
  reference;
  /** @internal */
  _onUpdate = "no action";
  /** @internal */
  _onDelete = "no action";
  constructor(config2, actions) {
    this.reference = () => {
      const { name, columns, foreignColumns } = config2();
      return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action === void 0 ? "no action" : action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action === void 0 ? "no action" : action;
    return this;
  }
  /** @internal */
  build(table3) {
    return new ForeignKey(table3, this);
  }
};
var ForeignKey = class {
  static {
    __name(this, "ForeignKey");
  }
  constructor(table3, builder) {
    this.table = table3;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  static [entityKind] = "PgForeignKey";
  reference;
  onUpdate;
  onDelete;
  getName() {
    const { name, columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[TableName],
      ...columnNames,
      foreignColumns[0].table[TableName],
      ...foreignColumnNames
    ];
    return name ?? `${chunks.join("_")}_fk`;
  }
};

// ../node_modules/drizzle-orm/tracing-utils.js
function iife(fn, ...args) {
  return fn(...args);
}
__name(iife, "iife");

// ../node_modules/drizzle-orm/pg-core/unique-constraint.js
function uniqueKeyName(table3, columns) {
  return `${table3[TableName]}_${columns.join("_")}_unique`;
}
__name(uniqueKeyName, "uniqueKeyName");
var UniqueConstraintBuilder = class {
  static {
    __name(this, "UniqueConstraintBuilder");
  }
  constructor(columns, name) {
    this.name = name;
    this.columns = columns;
  }
  static [entityKind] = "PgUniqueConstraintBuilder";
  /** @internal */
  columns;
  /** @internal */
  nullsNotDistinctConfig = false;
  nullsNotDistinct() {
    this.nullsNotDistinctConfig = true;
    return this;
  }
  /** @internal */
  build(table3) {
    return new UniqueConstraint(table3, this.columns, this.nullsNotDistinctConfig, this.name);
  }
};
var UniqueOnConstraintBuilder = class {
  static {
    __name(this, "UniqueOnConstraintBuilder");
  }
  static [entityKind] = "PgUniqueOnConstraintBuilder";
  /** @internal */
  name;
  constructor(name) {
    this.name = name;
  }
  on(...columns) {
    return new UniqueConstraintBuilder(columns, this.name);
  }
};
var UniqueConstraint = class {
  static {
    __name(this, "UniqueConstraint");
  }
  constructor(table3, columns, nullsNotDistinct, name) {
    this.table = table3;
    this.columns = columns;
    this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
    this.nullsNotDistinct = nullsNotDistinct;
  }
  static [entityKind] = "PgUniqueConstraint";
  columns;
  name;
  nullsNotDistinct = false;
  getName() {
    return this.name;
  }
};

// ../node_modules/drizzle-orm/pg-core/utils/array.js
function parsePgArrayValue(arrayString, startFrom, inQuotes) {
  for (let i = startFrom; i < arrayString.length; i++) {
    const char = arrayString[i];
    if (char === "\\") {
      i++;
      continue;
    }
    if (char === '"') {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
    }
    if (inQuotes) {
      continue;
    }
    if (char === "," || char === "}") {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
    }
  }
  return [arrayString.slice(startFrom).replace(/\\/g, ""), arrayString.length];
}
__name(parsePgArrayValue, "parsePgArrayValue");
function parsePgNestedArray(arrayString, startFrom = 0) {
  const result = [];
  let i = startFrom;
  let lastCharIsComma = false;
  while (i < arrayString.length) {
    const char = arrayString[i];
    if (char === ",") {
      if (lastCharIsComma || i === startFrom) {
        result.push("");
      }
      lastCharIsComma = true;
      i++;
      continue;
    }
    lastCharIsComma = false;
    if (char === "\\") {
      i += 2;
      continue;
    }
    if (char === '"') {
      const [value2, startFrom2] = parsePgArrayValue(arrayString, i + 1, true);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    if (char === "}") {
      return [result, i + 1];
    }
    if (char === "{") {
      const [value2, startFrom2] = parsePgNestedArray(arrayString, i + 1);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
    result.push(value);
    i = newStartFrom;
  }
  return [result, i];
}
__name(parsePgNestedArray, "parsePgNestedArray");
function parsePgArray(arrayString) {
  const [result] = parsePgNestedArray(arrayString, 1);
  return result;
}
__name(parsePgArray, "parsePgArray");
function makePgArray(array) {
  return `{${array.map((item) => {
    if (Array.isArray(item)) {
      return makePgArray(item);
    }
    if (typeof item === "string") {
      return `"${item.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return `${item}`;
  }).join(",")}}`;
}
__name(makePgArray, "makePgArray");

// ../node_modules/drizzle-orm/pg-core/columns/common.js
var PgColumnBuilder = class extends ColumnBuilder {
  static {
    __name(this, "PgColumnBuilder");
  }
  foreignKeyConfigs = [];
  static [entityKind] = "PgColumnBuilder";
  array(size) {
    return new PgArrayBuilder(this.config.name, this, size);
  }
  references(ref2, actions = {}) {
    this.foreignKeyConfigs.push({ ref: ref2, actions });
    return this;
  }
  unique(name, config2) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    this.config.uniqueType = config2?.nulls;
    return this;
  }
  generatedAlwaysAs(as) {
    this.config.generated = {
      as,
      type: "always",
      mode: "stored"
    };
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table3) {
    return this.foreignKeyConfigs.map(({ ref: ref2, actions }) => {
      return iife(
        (ref22, actions2) => {
          const builder = new ForeignKeyBuilder(() => {
            const foreignColumn = ref22();
            return { columns: [column], foreignColumns: [foreignColumn] };
          });
          if (actions2.onUpdate) {
            builder.onUpdate(actions2.onUpdate);
          }
          if (actions2.onDelete) {
            builder.onDelete(actions2.onDelete);
          }
          return builder.build(table3);
        },
        ref2,
        actions
      );
    });
  }
  /** @internal */
  buildExtraConfigColumn(table3) {
    return new ExtraConfigColumn(table3, this.config);
  }
};
var PgColumn = class extends Column {
  static {
    __name(this, "PgColumn");
  }
  constructor(table3, config2) {
    if (!config2.uniqueName) {
      config2.uniqueName = uniqueKeyName(table3, [config2.name]);
    }
    super(table3, config2);
    this.table = table3;
  }
  static [entityKind] = "PgColumn";
};
var ExtraConfigColumn = class extends PgColumn {
  static {
    __name(this, "ExtraConfigColumn");
  }
  static [entityKind] = "ExtraConfigColumn";
  getSQLType() {
    return this.getSQLType();
  }
  indexConfig = {
    order: this.config.order ?? "asc",
    nulls: this.config.nulls ?? "last",
    opClass: this.config.opClass
  };
  defaultConfig = {
    order: "asc",
    nulls: "last",
    opClass: void 0
  };
  asc() {
    this.indexConfig.order = "asc";
    return this;
  }
  desc() {
    this.indexConfig.order = "desc";
    return this;
  }
  nullsFirst() {
    this.indexConfig.nulls = "first";
    return this;
  }
  nullsLast() {
    this.indexConfig.nulls = "last";
    return this;
  }
  /**
   * ### PostgreSQL documentation quote
   *
   * > An operator class with optional parameters can be specified for each column of an index.
   * The operator class identifies the operators to be used by the index for that column.
   * For example, a B-tree index on four-byte integers would use the int4_ops class;
   * this operator class includes comparison functions for four-byte integers.
   * In practice the default operator class for the column's data type is usually sufficient.
   * The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
   * For example, we might want to sort a complex-number data type either by absolute value or by real part.
   * We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
   * More information about operator classes check:
   *
   * ### Useful links
   * https://www.postgresql.org/docs/current/sql-createindex.html
   *
   * https://www.postgresql.org/docs/current/indexes-opclass.html
   *
   * https://www.postgresql.org/docs/current/xindex.html
   *
   * ### Additional types
   * If you have the `pg_vector` extension installed in your database, you can use the
   * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
   *
   * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
   *
   * @param opClass
   * @returns
   */
  op(opClass) {
    this.indexConfig.opClass = opClass;
    return this;
  }
};
var IndexedColumn = class {
  static {
    __name(this, "IndexedColumn");
  }
  static [entityKind] = "IndexedColumn";
  constructor(name, keyAsName, type, indexConfig) {
    this.name = name;
    this.keyAsName = keyAsName;
    this.type = type;
    this.indexConfig = indexConfig;
  }
  name;
  keyAsName;
  type;
  indexConfig;
};
var PgArrayBuilder = class extends PgColumnBuilder {
  static {
    __name(this, "PgArrayBuilder");
  }
  static [entityKind] = "PgArrayBuilder";
  constructor(name, baseBuilder, size) {
    super(name, "array", "PgArray");
    this.config.baseBuilder = baseBuilder;
    this.config.size = size;
  }
  /** @internal */
  build(table3) {
    const baseColumn = this.config.baseBuilder.build(table3);
    return new PgArray(
      table3,
      this.config,
      baseColumn
    );
  }
};
var PgArray = class _PgArray extends PgColumn {
  static {
    __name(this, "PgArray");
  }
  constructor(table3, config2, baseColumn, range) {
    super(table3, config2);
    this.baseColumn = baseColumn;
    this.range = range;
    this.size = config2.size;
  }
  size;
  static [entityKind] = "PgArray";
  getSQLType() {
    return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      value = parsePgArray(value);
    }
    return value.map((v) => this.baseColumn.mapFromDriverValue(v));
  }
  mapToDriverValue(value, isNestedArray = false) {
    const a = value.map(
      (v) => v === null ? null : is(this.baseColumn, _PgArray) ? this.baseColumn.mapToDriverValue(v, true) : this.baseColumn.mapToDriverValue(v)
    );
    if (isNestedArray) return a;
    return makePgArray(a);
  }
};

// ../node_modules/drizzle-orm/pg-core/columns/enum.js
var PgEnumObjectColumnBuilder = class extends PgColumnBuilder {
  static {
    __name(this, "PgEnumObjectColumnBuilder");
  }
  static [entityKind] = "PgEnumObjectColumnBuilder";
  constructor(name, enumInstance) {
    super(name, "string", "PgEnumObjectColumn");
    this.config.enum = enumInstance;
  }
  /** @internal */
  build(table3) {
    return new PgEnumObjectColumn(
      table3,
      this.config
    );
  }
};
var PgEnumObjectColumn = class extends PgColumn {
  static {
    __name(this, "PgEnumObjectColumn");
  }
  static [entityKind] = "PgEnumObjectColumn";
  enum;
  enumValues = this.config.enum.enumValues;
  constructor(table3, config2) {
    super(table3, config2);
    this.enum = config2.enum;
  }
  getSQLType() {
    return this.enum.enumName;
  }
};
var isPgEnumSym = Symbol.for("drizzle:isPgEnum");
function isPgEnum(obj) {
  return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}
__name(isPgEnum, "isPgEnum");
var PgEnumColumnBuilder = class extends PgColumnBuilder {
  static {
    __name(this, "PgEnumColumnBuilder");
  }
  static [entityKind] = "PgEnumColumnBuilder";
  constructor(name, enumInstance) {
    super(name, "string", "PgEnumColumn");
    this.config.enum = enumInstance;
  }
  /** @internal */
  build(table3) {
    return new PgEnumColumn(
      table3,
      this.config
    );
  }
};
var PgEnumColumn = class extends PgColumn {
  static {
    __name(this, "PgEnumColumn");
  }
  static [entityKind] = "PgEnumColumn";
  enum = this.config.enum;
  enumValues = this.config.enum.enumValues;
  constructor(table3, config2) {
    super(table3, config2);
    this.enum = config2.enum;
  }
  getSQLType() {
    return this.enum.enumName;
  }
};

// ../node_modules/drizzle-orm/subquery.js
var Subquery = class {
  static {
    __name(this, "Subquery");
  }
  static [entityKind] = "Subquery";
  constructor(sql2, fields, alias, isWith = false, usedTables = []) {
    this._ = {
      brand: "Subquery",
      sql: sql2,
      selectedFields: fields,
      alias,
      isWith,
      usedTables
    };
  }
  // getSQL(): SQL<unknown> {
  // 	return new SQL([this]);
  // }
};
var WithSubquery = class extends Subquery {
  static {
    __name(this, "WithSubquery");
  }
  static [entityKind] = "WithSubquery";
};

// ../node_modules/drizzle-orm/version.js
var version2 = "0.45.1";

// ../node_modules/drizzle-orm/tracing.js
var otel;
var rawTracer;
var tracer = {
  startActiveSpan(name, fn) {
    if (!otel) {
      return fn();
    }
    if (!rawTracer) {
      rawTracer = otel.trace.getTracer("drizzle-orm", version2);
    }
    return iife(
      (otel2, rawTracer2) => rawTracer2.startActiveSpan(
        name,
        (span) => {
          try {
            return fn(span);
          } catch (e) {
            span.setStatus({
              code: otel2.SpanStatusCode.ERROR,
              message: e instanceof Error ? e.message : "Unknown error"
              // eslint-disable-line no-instanceof/no-instanceof
            });
            throw e;
          } finally {
            span.end();
          }
        }
      ),
      otel,
      rawTracer
    );
  }
};

// ../node_modules/drizzle-orm/view-common.js
var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");

// ../node_modules/drizzle-orm/sql/sql.js
var FakePrimitiveParam = class {
  static {
    __name(this, "FakePrimitiveParam");
  }
  static [entityKind] = "FakePrimitiveParam";
};
function isSQLWrapper(value) {
  return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
__name(isSQLWrapper, "isSQLWrapper");
function mergeQueries(queries) {
  const result = { sql: "", params: [] };
  for (const query of queries) {
    result.sql += query.sql;
    result.params.push(...query.params);
    if (query.typings?.length) {
      if (!result.typings) {
        result.typings = [];
      }
      result.typings.push(...query.typings);
    }
  }
  return result;
}
__name(mergeQueries, "mergeQueries");
var StringChunk = class {
  static {
    __name(this, "StringChunk");
  }
  static [entityKind] = "StringChunk";
  value;
  constructor(value) {
    this.value = Array.isArray(value) ? value : [value];
  }
  getSQL() {
    return new SQL([this]);
  }
};
var SQL = class _SQL {
  static {
    __name(this, "SQL");
  }
  constructor(queryChunks) {
    this.queryChunks = queryChunks;
    for (const chunk of queryChunks) {
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        this.usedTables.push(
          schemaName === void 0 ? chunk[Table.Symbol.Name] : schemaName + "." + chunk[Table.Symbol.Name]
        );
      }
    }
  }
  static [entityKind] = "SQL";
  /** @internal */
  decoder = noopDecoder;
  shouldInlineParams = false;
  /** @internal */
  usedTables = [];
  append(query) {
    this.queryChunks.push(...query.queryChunks);
    return this;
  }
  toQuery(config2) {
    return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
      const query = this.buildQueryFromSourceParams(this.queryChunks, config2);
      span?.setAttributes({
        "drizzle.query.text": query.sql,
        "drizzle.query.params": JSON.stringify(query.params)
      });
      return query;
    });
  }
  buildQueryFromSourceParams(chunks, _config) {
    const config2 = Object.assign({}, _config, {
      inlineParams: _config.inlineParams || this.shouldInlineParams,
      paramStartIndex: _config.paramStartIndex || { value: 0 }
    });
    const {
      casing,
      escapeName,
      escapeParam,
      prepareTyping,
      inlineParams,
      paramStartIndex
    } = config2;
    return mergeQueries(chunks.map((chunk) => {
      if (is(chunk, StringChunk)) {
        return { sql: chunk.value.join(""), params: [] };
      }
      if (is(chunk, Name)) {
        return { sql: escapeName(chunk.value), params: [] };
      }
      if (chunk === void 0) {
        return { sql: "", params: [] };
      }
      if (Array.isArray(chunk)) {
        const result = [new StringChunk("(")];
        for (const [i, p] of chunk.entries()) {
          result.push(p);
          if (i < chunk.length - 1) {
            result.push(new StringChunk(", "));
          }
        }
        result.push(new StringChunk(")"));
        return this.buildQueryFromSourceParams(result, config2);
      }
      if (is(chunk, _SQL)) {
        return this.buildQueryFromSourceParams(chunk.queryChunks, {
          ...config2,
          inlineParams: inlineParams || chunk.shouldInlineParams
        });
      }
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        const tableName = chunk[Table.Symbol.Name];
        return {
          sql: schemaName === void 0 || chunk[IsAlias] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
          params: []
        };
      }
      if (is(chunk, Column)) {
        const columnName = casing.getColumnCasing(chunk);
        if (_config.invokeSource === "indexes") {
          return { sql: escapeName(columnName), params: [] };
        }
        const schemaName = chunk.table[Table.Symbol.Schema];
        return {
          sql: chunk.table[IsAlias] || schemaName === void 0 ? escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName),
          params: []
        };
      }
      if (is(chunk, View)) {
        const schemaName = chunk[ViewBaseConfig].schema;
        const viewName = chunk[ViewBaseConfig].name;
        return {
          sql: schemaName === void 0 || chunk[ViewBaseConfig].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
          params: []
        };
      }
      if (is(chunk, Param)) {
        if (is(chunk.value, Placeholder)) {
          return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
        }
        const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
        if (is(mappedValue, _SQL)) {
          return this.buildQueryFromSourceParams([mappedValue], config2);
        }
        if (inlineParams) {
          return { sql: this.mapInlineParam(mappedValue, config2), params: [] };
        }
        let typings = ["none"];
        if (prepareTyping) {
          typings = [prepareTyping(chunk.encoder)];
        }
        return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
      }
      if (is(chunk, Placeholder)) {
        return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
      }
      if (is(chunk, _SQL.Aliased) && chunk.fieldAlias !== void 0) {
        return { sql: escapeName(chunk.fieldAlias), params: [] };
      }
      if (is(chunk, Subquery)) {
        if (chunk._.isWith) {
          return { sql: escapeName(chunk._.alias), params: [] };
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk._.sql,
          new StringChunk(") "),
          new Name(chunk._.alias)
        ], config2);
      }
      if (isPgEnum(chunk)) {
        if (chunk.schema) {
          return { sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName), params: [] };
        }
        return { sql: escapeName(chunk.enumName), params: [] };
      }
      if (isSQLWrapper(chunk)) {
        if (chunk.shouldOmitSQLParens?.()) {
          return this.buildQueryFromSourceParams([chunk.getSQL()], config2);
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk.getSQL(),
          new StringChunk(")")
        ], config2);
      }
      if (inlineParams) {
        return { sql: this.mapInlineParam(chunk, config2), params: [] };
      }
      return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
    }));
  }
  mapInlineParam(chunk, { escapeString: escapeString2 }) {
    if (chunk === null) {
      return "null";
    }
    if (typeof chunk === "number" || typeof chunk === "boolean") {
      return chunk.toString();
    }
    if (typeof chunk === "string") {
      return escapeString2(chunk);
    }
    if (typeof chunk === "object") {
      const mappedValueAsString = chunk.toString();
      if (mappedValueAsString === "[object Object]") {
        return escapeString2(JSON.stringify(chunk));
      }
      return escapeString2(mappedValueAsString);
    }
    throw new Error("Unexpected param value: " + chunk);
  }
  getSQL() {
    return this;
  }
  as(alias) {
    if (alias === void 0) {
      return this;
    }
    return new _SQL.Aliased(this, alias);
  }
  mapWith(decoder) {
    this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
    return this;
  }
  inlineParams() {
    this.shouldInlineParams = true;
    return this;
  }
  /**
   * This method is used to conditionally include a part of the query.
   *
   * @param condition - Condition to check
   * @returns itself if the condition is `true`, otherwise `undefined`
   */
  if(condition) {
    return condition ? this : void 0;
  }
};
var Name = class {
  static {
    __name(this, "Name");
  }
  constructor(value) {
    this.value = value;
  }
  static [entityKind] = "Name";
  brand;
  getSQL() {
    return new SQL([this]);
  }
};
function isDriverValueEncoder(value) {
  return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
__name(isDriverValueEncoder, "isDriverValueEncoder");
var noopDecoder = {
  mapFromDriverValue: /* @__PURE__ */ __name((value) => value, "mapFromDriverValue")
};
var noopEncoder = {
  mapToDriverValue: /* @__PURE__ */ __name((value) => value, "mapToDriverValue")
};
var noopMapper = {
  ...noopDecoder,
  ...noopEncoder
};
var Param = class {
  static {
    __name(this, "Param");
  }
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(value, encoder = noopEncoder) {
    this.value = value;
    this.encoder = encoder;
  }
  static [entityKind] = "Param";
  brand;
  getSQL() {
    return new SQL([this]);
  }
};
function sql(strings, ...params) {
  const queryChunks = [];
  if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
    queryChunks.push(new StringChunk(strings[0]));
  }
  for (const [paramIndex, param2] of params.entries()) {
    queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
  }
  return new SQL(queryChunks);
}
__name(sql, "sql");
((sql2) => {
  function empty() {
    return new SQL([]);
  }
  __name(empty, "empty");
  sql2.empty = empty;
  function fromList(list) {
    return new SQL(list);
  }
  __name(fromList, "fromList");
  sql2.fromList = fromList;
  function raw(str) {
    return new SQL([new StringChunk(str)]);
  }
  __name(raw, "raw");
  sql2.raw = raw;
  function join(chunks, separator) {
    const result = [];
    for (const [i, chunk] of chunks.entries()) {
      if (i > 0 && separator !== void 0) {
        result.push(separator);
      }
      result.push(chunk);
    }
    return new SQL(result);
  }
  __name(join, "join");
  sql2.join = join;
  function identifier(value) {
    return new Name(value);
  }
  __name(identifier, "identifier");
  sql2.identifier = identifier;
  function placeholder2(name2) {
    return new Placeholder(name2);
  }
  __name(placeholder2, "placeholder2");
  sql2.placeholder = placeholder2;
  function param2(value, encoder) {
    return new Param(value, encoder);
  }
  __name(param2, "param2");
  sql2.param = param2;
})(sql || (sql = {}));
((SQL2) => {
  class Aliased {
    static {
      __name(this, "Aliased");
    }
    constructor(sql2, fieldAlias) {
      this.sql = sql2;
      this.fieldAlias = fieldAlias;
    }
    static [entityKind] = "SQL.Aliased";
    /** @internal */
    isSelectionField = false;
    getSQL() {
      return this.sql;
    }
    /** @internal */
    clone() {
      return new Aliased(this.sql, this.fieldAlias);
    }
  }
  SQL2.Aliased = Aliased;
})(SQL || (SQL = {}));
var Placeholder = class {
  static {
    __name(this, "Placeholder");
  }
  constructor(name2) {
    this.name = name2;
  }
  static [entityKind] = "Placeholder";
  getSQL() {
    return new SQL([this]);
  }
};
function fillPlaceholders(params, values) {
  return params.map((p) => {
    if (is(p, Placeholder)) {
      if (!(p.name in values)) {
        throw new Error(`No value for placeholder "${p.name}" was provided`);
      }
      return values[p.name];
    }
    if (is(p, Param) && is(p.value, Placeholder)) {
      if (!(p.value.name in values)) {
        throw new Error(`No value for placeholder "${p.value.name}" was provided`);
      }
      return p.encoder.mapToDriverValue(values[p.value.name]);
    }
    return p;
  });
}
__name(fillPlaceholders, "fillPlaceholders");
var IsDrizzleView = Symbol.for("drizzle:IsDrizzleView");
var View = class {
  static {
    __name(this, "View");
  }
  static [entityKind] = "View";
  /** @internal */
  [ViewBaseConfig];
  /** @internal */
  [IsDrizzleView] = true;
  constructor({ name: name2, schema, selectedFields, query }) {
    this[ViewBaseConfig] = {
      name: name2,
      originalName: name2,
      schema,
      selectedFields,
      query,
      isExisting: !query,
      isAlias: false
    };
  }
  getSQL() {
    return new SQL([this]);
  }
};
Column.prototype.getSQL = function() {
  return new SQL([this]);
};
Table.prototype.getSQL = function() {
  return new SQL([this]);
};
Subquery.prototype.getSQL = function() {
  return new SQL([this]);
};

// ../node_modules/drizzle-orm/utils.js
function mapResultRow(columns, row, joinsNotNullableMap) {
  const nullifyMap = {};
  const result = columns.reduce(
    (result2, { path, field }, columnIndex) => {
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else if (is(field, Subquery)) {
        decoder = field._.sql.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      let node = result2;
      for (const [pathChunkIndex, pathChunk] of path.entries()) {
        if (pathChunkIndex < path.length - 1) {
          if (!(pathChunk in node)) {
            node[pathChunk] = {};
          }
          node = node[pathChunk];
        } else {
          const rawValue = row[columnIndex];
          const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
          if (joinsNotNullableMap && is(field, Column) && path.length === 2) {
            const objectName = path[0];
            if (!(objectName in nullifyMap)) {
              nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
            } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== getTableName(field.table)) {
              nullifyMap[objectName] = false;
            }
          }
        }
      }
      return result2;
    },
    {}
  );
  if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
    for (const [objectName, tableName] of Object.entries(nullifyMap)) {
      if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
        result[objectName] = null;
      }
    }
  }
  return result;
}
__name(mapResultRow, "mapResultRow");
function orderSelectedFields(fields, pathPrefix) {
  return Object.entries(fields).reduce((result, [name, field]) => {
    if (typeof name !== "string") {
      return result;
    }
    const newPath = pathPrefix ? [...pathPrefix, name] : [name];
    if (is(field, Column) || is(field, SQL) || is(field, SQL.Aliased) || is(field, Subquery)) {
      result.push({ path: newPath, field });
    } else if (is(field, Table)) {
      result.push(...orderSelectedFields(field[Table.Symbol.Columns], newPath));
    } else {
      result.push(...orderSelectedFields(field, newPath));
    }
    return result;
  }, []);
}
__name(orderSelectedFields, "orderSelectedFields");
function haveSameKeys(left, right) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  for (const [index2, key] of leftKeys.entries()) {
    if (key !== rightKeys[index2]) {
      return false;
    }
  }
  return true;
}
__name(haveSameKeys, "haveSameKeys");
function mapUpdateSet(table3, values) {
  const entries = Object.entries(values).filter(([, value]) => value !== void 0).map(([key, value]) => {
    if (is(value, SQL) || is(value, Column)) {
      return [key, value];
    } else {
      return [key, new Param(value, table3[Table.Symbol.Columns][key])];
    }
  });
  if (entries.length === 0) {
    throw new Error("No values to set");
  }
  return Object.fromEntries(entries);
}
__name(mapUpdateSet, "mapUpdateSet");
function applyMixins(baseClass, extendedClasses) {
  for (const extendedClass of extendedClasses) {
    for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
      if (name === "constructor") continue;
      Object.defineProperty(
        baseClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null)
      );
    }
  }
}
__name(applyMixins, "applyMixins");
function getTableColumns(table3) {
  return table3[Table.Symbol.Columns];
}
__name(getTableColumns, "getTableColumns");
function getTableLikeName(table3) {
  return is(table3, Subquery) ? table3._.alias : is(table3, View) ? table3[ViewBaseConfig].name : is(table3, SQL) ? void 0 : table3[Table.Symbol.IsAlias] ? table3[Table.Symbol.Name] : table3[Table.Symbol.BaseName];
}
__name(getTableLikeName, "getTableLikeName");
function getColumnNameAndConfig(a, b) {
  return {
    name: typeof a === "string" && a.length > 0 ? a : "",
    config: typeof a === "object" ? a : b
  };
}
__name(getColumnNameAndConfig, "getColumnNameAndConfig");
var textDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder();

// ../node_modules/drizzle-orm/pg-core/table.js
var InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");
var EnableRLS = Symbol.for("drizzle:EnableRLS");
var PgTable = class extends Table {
  static {
    __name(this, "PgTable");
  }
  static [entityKind] = "PgTable";
  /** @internal */
  static Symbol = Object.assign({}, Table.Symbol, {
    InlineForeignKeys,
    EnableRLS
  });
  /**@internal */
  [InlineForeignKeys] = [];
  /** @internal */
  [EnableRLS] = false;
  /** @internal */
  [Table.Symbol.ExtraConfigBuilder] = void 0;
  /** @internal */
  [Table.Symbol.ExtraConfigColumns] = {};
};

// ../node_modules/drizzle-orm/pg-core/primary-keys.js
var PrimaryKeyBuilder = class {
  static {
    __name(this, "PrimaryKeyBuilder");
  }
  static [entityKind] = "PgPrimaryKeyBuilder";
  /** @internal */
  columns;
  /** @internal */
  name;
  constructor(columns, name) {
    this.columns = columns;
    this.name = name;
  }
  /** @internal */
  build(table3) {
    return new PrimaryKey(table3, this.columns, this.name);
  }
};
var PrimaryKey = class {
  static {
    __name(this, "PrimaryKey");
  }
  constructor(table3, columns, name) {
    this.table = table3;
    this.columns = columns;
    this.name = name;
  }
  static [entityKind] = "PgPrimaryKey";
  columns;
  name;
  getName() {
    return this.name ?? `${this.table[PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
  }
};

// ../node_modules/drizzle-orm/sql/expressions/conditions.js
function bindIfParam(value, column) {
  if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View)) {
    return new Param(value, column);
  }
  return value;
}
__name(bindIfParam, "bindIfParam");
var eq = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} = ${bindIfParam(right, left)}`;
}, "eq");
var ne = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} <> ${bindIfParam(right, left)}`;
}, "ne");
function and(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" and ")),
    new StringChunk(")")
  ]);
}
__name(and, "and");
function or(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" or ")),
    new StringChunk(")")
  ]);
}
__name(or, "or");
function not(condition) {
  return sql`not ${condition}`;
}
__name(not, "not");
var gt = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} > ${bindIfParam(right, left)}`;
}, "gt");
var gte = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} >= ${bindIfParam(right, left)}`;
}, "gte");
var lt = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} < ${bindIfParam(right, left)}`;
}, "lt");
var lte = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} <= ${bindIfParam(right, left)}`;
}, "lte");
function inArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return sql`false`;
    }
    return sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} in ${bindIfParam(values, column)}`;
}
__name(inArray, "inArray");
function notInArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return sql`true`;
    }
    return sql`${column} not in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} not in ${bindIfParam(values, column)}`;
}
__name(notInArray, "notInArray");
function isNull(value) {
  return sql`${value} is null`;
}
__name(isNull, "isNull");
function isNotNull(value) {
  return sql`${value} is not null`;
}
__name(isNotNull, "isNotNull");
function exists(subquery) {
  return sql`exists ${subquery}`;
}
__name(exists, "exists");
function notExists(subquery) {
  return sql`not exists ${subquery}`;
}
__name(notExists, "notExists");
function between(column, min, max) {
  return sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(
    max,
    column
  )}`;
}
__name(between, "between");
function notBetween(column, min, max) {
  return sql`${column} not between ${bindIfParam(
    min,
    column
  )} and ${bindIfParam(max, column)}`;
}
__name(notBetween, "notBetween");
function like(column, value) {
  return sql`${column} like ${value}`;
}
__name(like, "like");
function notLike(column, value) {
  return sql`${column} not like ${value}`;
}
__name(notLike, "notLike");
function ilike(column, value) {
  return sql`${column} ilike ${value}`;
}
__name(ilike, "ilike");
function notIlike(column, value) {
  return sql`${column} not ilike ${value}`;
}
__name(notIlike, "notIlike");

// ../node_modules/drizzle-orm/sql/expressions/select.js
function asc(column) {
  return sql`${column} asc`;
}
__name(asc, "asc");
function desc(column) {
  return sql`${column} desc`;
}
__name(desc, "desc");

// ../node_modules/drizzle-orm/relations.js
var Relation = class {
  static {
    __name(this, "Relation");
  }
  constructor(sourceTable, referencedTable, relationName) {
    this.sourceTable = sourceTable;
    this.referencedTable = referencedTable;
    this.relationName = relationName;
    this.referencedTableName = referencedTable[Table.Symbol.Name];
  }
  static [entityKind] = "Relation";
  referencedTableName;
  fieldName;
};
var Relations = class {
  static {
    __name(this, "Relations");
  }
  constructor(table3, config2) {
    this.table = table3;
    this.config = config2;
  }
  static [entityKind] = "Relations";
};
var One = class _One extends Relation {
  static {
    __name(this, "One");
  }
  constructor(sourceTable, referencedTable, config2, isNullable) {
    super(sourceTable, referencedTable, config2?.relationName);
    this.config = config2;
    this.isNullable = isNullable;
  }
  static [entityKind] = "One";
  withFieldName(fieldName) {
    const relation = new _One(
      this.sourceTable,
      this.referencedTable,
      this.config,
      this.isNullable
    );
    relation.fieldName = fieldName;
    return relation;
  }
};
var Many = class _Many extends Relation {
  static {
    __name(this, "Many");
  }
  constructor(sourceTable, referencedTable, config2) {
    super(sourceTable, referencedTable, config2?.relationName);
    this.config = config2;
  }
  static [entityKind] = "Many";
  withFieldName(fieldName) {
    const relation = new _Many(
      this.sourceTable,
      this.referencedTable,
      this.config
    );
    relation.fieldName = fieldName;
    return relation;
  }
};
function getOperators() {
  return {
    and,
    between,
    eq,
    exists,
    gt,
    gte,
    ilike,
    inArray,
    isNull,
    isNotNull,
    like,
    lt,
    lte,
    ne,
    not,
    notBetween,
    notExists,
    notLike,
    notIlike,
    notInArray,
    or,
    sql
  };
}
__name(getOperators, "getOperators");
function getOrderByOperators() {
  return {
    sql,
    asc,
    desc
  };
}
__name(getOrderByOperators, "getOrderByOperators");
function extractTablesRelationalConfig(schema, configHelpers) {
  if (Object.keys(schema).length === 1 && "default" in schema && !is(schema["default"], Table)) {
    schema = schema["default"];
  }
  const tableNamesMap = {};
  const relationsBuffer = {};
  const tablesConfig = {};
  for (const [key, value] of Object.entries(schema)) {
    if (is(value, Table)) {
      const dbName = getTableUniqueName(value);
      const bufferedRelations = relationsBuffer[dbName];
      tableNamesMap[dbName] = key;
      tablesConfig[key] = {
        tsName: key,
        dbName: value[Table.Symbol.Name],
        schema: value[Table.Symbol.Schema],
        columns: value[Table.Symbol.Columns],
        relations: bufferedRelations?.relations ?? {},
        primaryKey: bufferedRelations?.primaryKey ?? []
      };
      for (const column of Object.values(
        value[Table.Symbol.Columns]
      )) {
        if (column.primary) {
          tablesConfig[key].primaryKey.push(column);
        }
      }
      const extraConfig = value[Table.Symbol.ExtraConfigBuilder]?.(value[Table.Symbol.ExtraConfigColumns]);
      if (extraConfig) {
        for (const configEntry of Object.values(extraConfig)) {
          if (is(configEntry, PrimaryKeyBuilder)) {
            tablesConfig[key].primaryKey.push(...configEntry.columns);
          }
        }
      }
    } else if (is(value, Relations)) {
      const dbName = getTableUniqueName(value.table);
      const tableName = tableNamesMap[dbName];
      const relations2 = value.config(
        configHelpers(value.table)
      );
      let primaryKey;
      for (const [relationName, relation] of Object.entries(relations2)) {
        if (tableName) {
          const tableConfig = tablesConfig[tableName];
          tableConfig.relations[relationName] = relation;
          if (primaryKey) {
            tableConfig.primaryKey.push(...primaryKey);
          }
        } else {
          if (!(dbName in relationsBuffer)) {
            relationsBuffer[dbName] = {
              relations: {},
              primaryKey
            };
          }
          relationsBuffer[dbName].relations[relationName] = relation;
        }
      }
    }
  }
  return { tables: tablesConfig, tableNamesMap };
}
__name(extractTablesRelationalConfig, "extractTablesRelationalConfig");
function relations(table3, relations2) {
  return new Relations(
    table3,
    (helpers) => Object.fromEntries(
      Object.entries(relations2(helpers)).map(([key, value]) => [
        key,
        value.withFieldName(key)
      ])
    )
  );
}
__name(relations, "relations");
function createOne(sourceTable) {
  return /* @__PURE__ */ __name(function one(table3, config2) {
    return new One(
      sourceTable,
      table3,
      config2,
      config2?.fields.reduce((res, f) => res && f.notNull, true) ?? false
    );
  }, "one");
}
__name(createOne, "createOne");
function createMany(sourceTable) {
  return /* @__PURE__ */ __name(function many(referencedTable, config2) {
    return new Many(sourceTable, referencedTable, config2);
  }, "many");
}
__name(createMany, "createMany");
function normalizeRelation(schema, tableNamesMap, relation) {
  if (is(relation, One) && relation.config) {
    return {
      fields: relation.config.fields,
      references: relation.config.references
    };
  }
  const referencedTableTsName = tableNamesMap[getTableUniqueName(relation.referencedTable)];
  if (!referencedTableTsName) {
    throw new Error(
      `Table "${relation.referencedTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const referencedTableConfig = schema[referencedTableTsName];
  if (!referencedTableConfig) {
    throw new Error(`Table "${referencedTableTsName}" not found in schema`);
  }
  const sourceTable = relation.sourceTable;
  const sourceTableTsName = tableNamesMap[getTableUniqueName(sourceTable)];
  if (!sourceTableTsName) {
    throw new Error(
      `Table "${sourceTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const reverseRelations = [];
  for (const referencedTableRelation of Object.values(
    referencedTableConfig.relations
  )) {
    if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) {
      reverseRelations.push(referencedTableRelation);
    }
  }
  if (reverseRelations.length > 1) {
    throw relation.relationName ? new Error(
      `There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`
    ) : new Error(
      `There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[Table.Symbol.Name]}". Please specify relation name`
    );
  }
  if (reverseRelations[0] && is(reverseRelations[0], One) && reverseRelations[0].config) {
    return {
      fields: reverseRelations[0].config.references,
      references: reverseRelations[0].config.fields
    };
  }
  throw new Error(
    `There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`
  );
}
__name(normalizeRelation, "normalizeRelation");
function createTableRelationsHelpers(sourceTable) {
  return {
    one: createOne(sourceTable),
    many: createMany(sourceTable)
  };
}
__name(createTableRelationsHelpers, "createTableRelationsHelpers");
function mapRelationalRow(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
  const result = {};
  for (const [
    selectionItemIndex,
    selectionItem
  ] of buildQueryResultSelection.entries()) {
    if (selectionItem.isJson) {
      const relation = tableConfig.relations[selectionItem.tsKey];
      const rawSubRows = row[selectionItemIndex];
      const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
      result[selectionItem.tsKey] = is(relation, One) ? subRows && mapRelationalRow(
        tablesConfig,
        tablesConfig[selectionItem.relationTableTsKey],
        subRows,
        selectionItem.selection,
        mapColumnValue
      ) : subRows.map(
        (subRow) => mapRelationalRow(
          tablesConfig,
          tablesConfig[selectionItem.relationTableTsKey],
          subRow,
          selectionItem.selection,
          mapColumnValue
        )
      );
    } else {
      const value = mapColumnValue(row[selectionItemIndex]);
      const field = selectionItem.field;
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      result[selectionItem.tsKey] = value === null ? null : decoder.mapFromDriverValue(value);
    }
  }
  return result;
}
__name(mapRelationalRow, "mapRelationalRow");

// ../node_modules/drizzle-orm/alias.js
var ColumnAliasProxyHandler = class {
  static {
    __name(this, "ColumnAliasProxyHandler");
  }
  constructor(table3) {
    this.table = table3;
  }
  static [entityKind] = "ColumnAliasProxyHandler";
  get(columnObj, prop) {
    if (prop === "table") {
      return this.table;
    }
    return columnObj[prop];
  }
};
var TableAliasProxyHandler = class {
  static {
    __name(this, "TableAliasProxyHandler");
  }
  constructor(alias, replaceOriginalName) {
    this.alias = alias;
    this.replaceOriginalName = replaceOriginalName;
  }
  static [entityKind] = "TableAliasProxyHandler";
  get(target, prop) {
    if (prop === Table.Symbol.IsAlias) {
      return true;
    }
    if (prop === Table.Symbol.Name) {
      return this.alias;
    }
    if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) {
      return this.alias;
    }
    if (prop === ViewBaseConfig) {
      return {
        ...target[ViewBaseConfig],
        name: this.alias,
        isAlias: true
      };
    }
    if (prop === Table.Symbol.Columns) {
      const columns = target[Table.Symbol.Columns];
      if (!columns) {
        return columns;
      }
      const proxiedColumns = {};
      Object.keys(columns).map((key) => {
        proxiedColumns[key] = new Proxy(
          columns[key],
          new ColumnAliasProxyHandler(new Proxy(target, this))
        );
      });
      return proxiedColumns;
    }
    const value = target[prop];
    if (is(value, Column)) {
      return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
    }
    return value;
  }
};
var RelationTableAliasProxyHandler = class {
  static {
    __name(this, "RelationTableAliasProxyHandler");
  }
  constructor(alias) {
    this.alias = alias;
  }
  static [entityKind] = "RelationTableAliasProxyHandler";
  get(target, prop) {
    if (prop === "sourceTable") {
      return aliasedTable(target.sourceTable, this.alias);
    }
    return target[prop];
  }
};
function aliasedTable(table3, tableAlias) {
  return new Proxy(table3, new TableAliasProxyHandler(tableAlias, false));
}
__name(aliasedTable, "aliasedTable");
function aliasedTableColumn(column, tableAlias) {
  return new Proxy(
    column,
    new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false)))
  );
}
__name(aliasedTableColumn, "aliasedTableColumn");
function mapColumnsInAliasedSQLToAlias(query, alias) {
  return new SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
}
__name(mapColumnsInAliasedSQLToAlias, "mapColumnsInAliasedSQLToAlias");
function mapColumnsInSQLToAlias(query, alias) {
  return sql.join(query.queryChunks.map((c) => {
    if (is(c, Column)) {
      return aliasedTableColumn(c, alias);
    }
    if (is(c, SQL)) {
      return mapColumnsInSQLToAlias(c, alias);
    }
    if (is(c, SQL.Aliased)) {
      return mapColumnsInAliasedSQLToAlias(c, alias);
    }
    return c;
  }));
}
__name(mapColumnsInSQLToAlias, "mapColumnsInSQLToAlias");

// ../node_modules/drizzle-orm/selection-proxy.js
var SelectionProxyHandler = class _SelectionProxyHandler {
  static {
    __name(this, "SelectionProxyHandler");
  }
  static [entityKind] = "SelectionProxyHandler";
  config;
  constructor(config2) {
    this.config = { ...config2 };
  }
  get(subquery, prop) {
    if (prop === "_") {
      return {
        ...subquery["_"],
        selectedFields: new Proxy(
          subquery._.selectedFields,
          this
        )
      };
    }
    if (prop === ViewBaseConfig) {
      return {
        ...subquery[ViewBaseConfig],
        selectedFields: new Proxy(
          subquery[ViewBaseConfig].selectedFields,
          this
        )
      };
    }
    if (typeof prop === "symbol") {
      return subquery[prop];
    }
    const columns = is(subquery, Subquery) ? subquery._.selectedFields : is(subquery, View) ? subquery[ViewBaseConfig].selectedFields : subquery;
    const value = columns[prop];
    if (is(value, SQL.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) {
        return value.sql;
      }
      const newValue = value.clone();
      newValue.isSelectionField = true;
      return newValue;
    }
    if (is(value, SQL)) {
      if (this.config.sqlBehavior === "sql") {
        return value;
      }
      throw new Error(
        `You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
      );
    }
    if (is(value, Column)) {
      if (this.config.alias) {
        return new Proxy(
          value,
          new ColumnAliasProxyHandler(
            new Proxy(
              value.table,
              new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false)
            )
          )
        );
      }
      return value;
    }
    if (typeof value !== "object" || value === null) {
      return value;
    }
    return new Proxy(value, new _SelectionProxyHandler(this.config));
  }
};

// ../node_modules/drizzle-orm/query-promise.js
var QueryPromise = class {
  static {
    __name(this, "QueryPromise");
  }
  static [entityKind] = "QueryPromise";
  [Symbol.toStringTag] = "QueryPromise";
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally?.();
        return value;
      },
      (reason) => {
        onFinally?.();
        throw reason;
      }
    );
  }
  then(onFulfilled, onRejected) {
    return this.execute().then(onFulfilled, onRejected);
  }
};

// ../node_modules/drizzle-orm/sqlite-core/foreign-keys.js
var ForeignKeyBuilder2 = class {
  static {
    __name(this, "ForeignKeyBuilder");
  }
  static [entityKind] = "SQLiteForeignKeyBuilder";
  /** @internal */
  reference;
  /** @internal */
  _onUpdate;
  /** @internal */
  _onDelete;
  constructor(config2, actions) {
    this.reference = () => {
      const { name, columns, foreignColumns } = config2();
      return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action;
    return this;
  }
  /** @internal */
  build(table3) {
    return new ForeignKey2(table3, this);
  }
};
var ForeignKey2 = class {
  static {
    __name(this, "ForeignKey");
  }
  constructor(table3, builder) {
    this.table = table3;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  static [entityKind] = "SQLiteForeignKey";
  reference;
  onUpdate;
  onDelete;
  getName() {
    const { name, columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[TableName],
      ...columnNames,
      foreignColumns[0].table[TableName],
      ...foreignColumnNames
    ];
    return name ?? `${chunks.join("_")}_fk`;
  }
};

// ../node_modules/drizzle-orm/sqlite-core/unique-constraint.js
function uniqueKeyName2(table3, columns) {
  return `${table3[TableName]}_${columns.join("_")}_unique`;
}
__name(uniqueKeyName2, "uniqueKeyName");
var UniqueConstraintBuilder2 = class {
  static {
    __name(this, "UniqueConstraintBuilder");
  }
  constructor(columns, name) {
    this.name = name;
    this.columns = columns;
  }
  static [entityKind] = "SQLiteUniqueConstraintBuilder";
  /** @internal */
  columns;
  /** @internal */
  build(table3) {
    return new UniqueConstraint2(table3, this.columns, this.name);
  }
};
var UniqueOnConstraintBuilder2 = class {
  static {
    __name(this, "UniqueOnConstraintBuilder");
  }
  static [entityKind] = "SQLiteUniqueOnConstraintBuilder";
  /** @internal */
  name;
  constructor(name) {
    this.name = name;
  }
  on(...columns) {
    return new UniqueConstraintBuilder2(columns, this.name);
  }
};
var UniqueConstraint2 = class {
  static {
    __name(this, "UniqueConstraint");
  }
  constructor(table3, columns, name) {
    this.table = table3;
    this.columns = columns;
    this.name = name ?? uniqueKeyName2(this.table, this.columns.map((column) => column.name));
  }
  static [entityKind] = "SQLiteUniqueConstraint";
  columns;
  name;
  getName() {
    return this.name;
  }
};

// ../node_modules/drizzle-orm/sqlite-core/columns/common.js
var SQLiteColumnBuilder = class extends ColumnBuilder {
  static {
    __name(this, "SQLiteColumnBuilder");
  }
  static [entityKind] = "SQLiteColumnBuilder";
  foreignKeyConfigs = [];
  references(ref2, actions = {}) {
    this.foreignKeyConfigs.push({ ref: ref2, actions });
    return this;
  }
  unique(name) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    return this;
  }
  generatedAlwaysAs(as, config2) {
    this.config.generated = {
      as,
      type: "always",
      mode: config2?.mode ?? "virtual"
    };
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table3) {
    return this.foreignKeyConfigs.map(({ ref: ref2, actions }) => {
      return ((ref22, actions2) => {
        const builder = new ForeignKeyBuilder2(() => {
          const foreignColumn = ref22();
          return { columns: [column], foreignColumns: [foreignColumn] };
        });
        if (actions2.onUpdate) {
          builder.onUpdate(actions2.onUpdate);
        }
        if (actions2.onDelete) {
          builder.onDelete(actions2.onDelete);
        }
        return builder.build(table3);
      })(ref2, actions);
    });
  }
};
var SQLiteColumn = class extends Column {
  static {
    __name(this, "SQLiteColumn");
  }
  constructor(table3, config2) {
    if (!config2.uniqueName) {
      config2.uniqueName = uniqueKeyName2(table3, [config2.name]);
    }
    super(table3, config2);
    this.table = table3;
  }
  static [entityKind] = "SQLiteColumn";
};

// ../node_modules/drizzle-orm/sqlite-core/columns/blob.js
var SQLiteBigIntBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteBigIntBuilder");
  }
  static [entityKind] = "SQLiteBigIntBuilder";
  constructor(name) {
    super(name, "bigint", "SQLiteBigInt");
  }
  /** @internal */
  build(table3) {
    return new SQLiteBigInt(table3, this.config);
  }
};
var SQLiteBigInt = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteBigInt");
  }
  static [entityKind] = "SQLiteBigInt";
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(value) {
    if (typeof Buffer !== "undefined" && Buffer.from) {
      const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
      return BigInt(buf.toString("utf8"));
    }
    return BigInt(textDecoder.decode(value));
  }
  mapToDriverValue(value) {
    return Buffer.from(value.toString());
  }
};
var SQLiteBlobJsonBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteBlobJsonBuilder");
  }
  static [entityKind] = "SQLiteBlobJsonBuilder";
  constructor(name) {
    super(name, "json", "SQLiteBlobJson");
  }
  /** @internal */
  build(table3) {
    return new SQLiteBlobJson(
      table3,
      this.config
    );
  }
};
var SQLiteBlobJson = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteBlobJson");
  }
  static [entityKind] = "SQLiteBlobJson";
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(value) {
    if (typeof Buffer !== "undefined" && Buffer.from) {
      const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
      return JSON.parse(buf.toString("utf8"));
    }
    return JSON.parse(textDecoder.decode(value));
  }
  mapToDriverValue(value) {
    return Buffer.from(JSON.stringify(value));
  }
};
var SQLiteBlobBufferBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteBlobBufferBuilder");
  }
  static [entityKind] = "SQLiteBlobBufferBuilder";
  constructor(name) {
    super(name, "buffer", "SQLiteBlobBuffer");
  }
  /** @internal */
  build(table3) {
    return new SQLiteBlobBuffer(table3, this.config);
  }
};
var SQLiteBlobBuffer = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteBlobBuffer");
  }
  static [entityKind] = "SQLiteBlobBuffer";
  mapFromDriverValue(value) {
    if (Buffer.isBuffer(value)) {
      return value;
    }
    return Buffer.from(value);
  }
  getSQLType() {
    return "blob";
  }
};
function blob(a, b) {
  const { name, config: config2 } = getColumnNameAndConfig(a, b);
  if (config2?.mode === "json") {
    return new SQLiteBlobJsonBuilder(name);
  }
  if (config2?.mode === "bigint") {
    return new SQLiteBigIntBuilder(name);
  }
  return new SQLiteBlobBufferBuilder(name);
}
__name(blob, "blob");

// ../node_modules/drizzle-orm/sqlite-core/columns/custom.js
var SQLiteCustomColumnBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteCustomColumnBuilder");
  }
  static [entityKind] = "SQLiteCustomColumnBuilder";
  constructor(name, fieldConfig, customTypeParams) {
    super(name, "custom", "SQLiteCustomColumn");
    this.config.fieldConfig = fieldConfig;
    this.config.customTypeParams = customTypeParams;
  }
  /** @internal */
  build(table3) {
    return new SQLiteCustomColumn(
      table3,
      this.config
    );
  }
};
var SQLiteCustomColumn = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteCustomColumn");
  }
  static [entityKind] = "SQLiteCustomColumn";
  sqlName;
  mapTo;
  mapFrom;
  constructor(table3, config2) {
    super(table3, config2);
    this.sqlName = config2.customTypeParams.dataType(config2.fieldConfig);
    this.mapTo = config2.customTypeParams.toDriver;
    this.mapFrom = config2.customTypeParams.fromDriver;
  }
  getSQLType() {
    return this.sqlName;
  }
  mapFromDriverValue(value) {
    return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
  }
  mapToDriverValue(value) {
    return typeof this.mapTo === "function" ? this.mapTo(value) : value;
  }
};
function customType(customTypeParams) {
  return (a, b) => {
    const { name, config: config2 } = getColumnNameAndConfig(a, b);
    return new SQLiteCustomColumnBuilder(
      name,
      config2,
      customTypeParams
    );
  };
}
__name(customType, "customType");

// ../node_modules/drizzle-orm/sqlite-core/columns/integer.js
var SQLiteBaseIntegerBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteBaseIntegerBuilder");
  }
  static [entityKind] = "SQLiteBaseIntegerBuilder";
  constructor(name, dataType, columnType) {
    super(name, dataType, columnType);
    this.config.autoIncrement = false;
  }
  primaryKey(config2) {
    if (config2?.autoIncrement) {
      this.config.autoIncrement = true;
    }
    this.config.hasDefault = true;
    return super.primaryKey();
  }
};
var SQLiteBaseInteger = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteBaseInteger");
  }
  static [entityKind] = "SQLiteBaseInteger";
  autoIncrement = this.config.autoIncrement;
  getSQLType() {
    return "integer";
  }
};
var SQLiteIntegerBuilder = class extends SQLiteBaseIntegerBuilder {
  static {
    __name(this, "SQLiteIntegerBuilder");
  }
  static [entityKind] = "SQLiteIntegerBuilder";
  constructor(name) {
    super(name, "number", "SQLiteInteger");
  }
  build(table3) {
    return new SQLiteInteger(
      table3,
      this.config
    );
  }
};
var SQLiteInteger = class extends SQLiteBaseInteger {
  static {
    __name(this, "SQLiteInteger");
  }
  static [entityKind] = "SQLiteInteger";
};
var SQLiteTimestampBuilder = class extends SQLiteBaseIntegerBuilder {
  static {
    __name(this, "SQLiteTimestampBuilder");
  }
  static [entityKind] = "SQLiteTimestampBuilder";
  constructor(name, mode) {
    super(name, "date", "SQLiteTimestamp");
    this.config.mode = mode;
  }
  /**
   * @deprecated Use `default()` with your own expression instead.
   *
   * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
   */
  defaultNow() {
    return this.default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
  }
  build(table3) {
    return new SQLiteTimestamp(
      table3,
      this.config
    );
  }
};
var SQLiteTimestamp = class extends SQLiteBaseInteger {
  static {
    __name(this, "SQLiteTimestamp");
  }
  static [entityKind] = "SQLiteTimestamp";
  mode = this.config.mode;
  mapFromDriverValue(value) {
    if (this.config.mode === "timestamp") {
      return new Date(value * 1e3);
    }
    return new Date(value);
  }
  mapToDriverValue(value) {
    const unix = value.getTime();
    if (this.config.mode === "timestamp") {
      return Math.floor(unix / 1e3);
    }
    return unix;
  }
};
var SQLiteBooleanBuilder = class extends SQLiteBaseIntegerBuilder {
  static {
    __name(this, "SQLiteBooleanBuilder");
  }
  static [entityKind] = "SQLiteBooleanBuilder";
  constructor(name, mode) {
    super(name, "boolean", "SQLiteBoolean");
    this.config.mode = mode;
  }
  build(table3) {
    return new SQLiteBoolean(
      table3,
      this.config
    );
  }
};
var SQLiteBoolean = class extends SQLiteBaseInteger {
  static {
    __name(this, "SQLiteBoolean");
  }
  static [entityKind] = "SQLiteBoolean";
  mode = this.config.mode;
  mapFromDriverValue(value) {
    return Number(value) === 1;
  }
  mapToDriverValue(value) {
    return value ? 1 : 0;
  }
};
function integer(a, b) {
  const { name, config: config2 } = getColumnNameAndConfig(a, b);
  if (config2?.mode === "timestamp" || config2?.mode === "timestamp_ms") {
    return new SQLiteTimestampBuilder(name, config2.mode);
  }
  if (config2?.mode === "boolean") {
    return new SQLiteBooleanBuilder(name, config2.mode);
  }
  return new SQLiteIntegerBuilder(name);
}
__name(integer, "integer");

// ../node_modules/drizzle-orm/sqlite-core/columns/numeric.js
var SQLiteNumericBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteNumericBuilder");
  }
  static [entityKind] = "SQLiteNumericBuilder";
  constructor(name) {
    super(name, "string", "SQLiteNumeric");
  }
  /** @internal */
  build(table3) {
    return new SQLiteNumeric(
      table3,
      this.config
    );
  }
};
var SQLiteNumeric = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteNumeric");
  }
  static [entityKind] = "SQLiteNumeric";
  mapFromDriverValue(value) {
    if (typeof value === "string") return value;
    return String(value);
  }
  getSQLType() {
    return "numeric";
  }
};
var SQLiteNumericNumberBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteNumericNumberBuilder");
  }
  static [entityKind] = "SQLiteNumericNumberBuilder";
  constructor(name) {
    super(name, "number", "SQLiteNumericNumber");
  }
  /** @internal */
  build(table3) {
    return new SQLiteNumericNumber(
      table3,
      this.config
    );
  }
};
var SQLiteNumericNumber = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteNumericNumber");
  }
  static [entityKind] = "SQLiteNumericNumber";
  mapFromDriverValue(value) {
    if (typeof value === "number") return value;
    return Number(value);
  }
  mapToDriverValue = String;
  getSQLType() {
    return "numeric";
  }
};
var SQLiteNumericBigIntBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteNumericBigIntBuilder");
  }
  static [entityKind] = "SQLiteNumericBigIntBuilder";
  constructor(name) {
    super(name, "bigint", "SQLiteNumericBigInt");
  }
  /** @internal */
  build(table3) {
    return new SQLiteNumericBigInt(
      table3,
      this.config
    );
  }
};
var SQLiteNumericBigInt = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteNumericBigInt");
  }
  static [entityKind] = "SQLiteNumericBigInt";
  mapFromDriverValue = BigInt;
  mapToDriverValue = String;
  getSQLType() {
    return "numeric";
  }
};
function numeric(a, b) {
  const { name, config: config2 } = getColumnNameAndConfig(a, b);
  const mode = config2?.mode;
  return mode === "number" ? new SQLiteNumericNumberBuilder(name) : mode === "bigint" ? new SQLiteNumericBigIntBuilder(name) : new SQLiteNumericBuilder(name);
}
__name(numeric, "numeric");

// ../node_modules/drizzle-orm/sqlite-core/columns/real.js
var SQLiteRealBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteRealBuilder");
  }
  static [entityKind] = "SQLiteRealBuilder";
  constructor(name) {
    super(name, "number", "SQLiteReal");
  }
  /** @internal */
  build(table3) {
    return new SQLiteReal(table3, this.config);
  }
};
var SQLiteReal = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteReal");
  }
  static [entityKind] = "SQLiteReal";
  getSQLType() {
    return "real";
  }
};
function real(name) {
  return new SQLiteRealBuilder(name ?? "");
}
__name(real, "real");

// ../node_modules/drizzle-orm/sqlite-core/columns/text.js
var SQLiteTextBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteTextBuilder");
  }
  static [entityKind] = "SQLiteTextBuilder";
  constructor(name, config2) {
    super(name, "string", "SQLiteText");
    this.config.enumValues = config2.enum;
    this.config.length = config2.length;
  }
  /** @internal */
  build(table3) {
    return new SQLiteText(
      table3,
      this.config
    );
  }
};
var SQLiteText = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteText");
  }
  static [entityKind] = "SQLiteText";
  enumValues = this.config.enumValues;
  length = this.config.length;
  constructor(table3, config2) {
    super(table3, config2);
  }
  getSQLType() {
    return `text${this.config.length ? `(${this.config.length})` : ""}`;
  }
};
var SQLiteTextJsonBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteTextJsonBuilder");
  }
  static [entityKind] = "SQLiteTextJsonBuilder";
  constructor(name) {
    super(name, "json", "SQLiteTextJson");
  }
  /** @internal */
  build(table3) {
    return new SQLiteTextJson(
      table3,
      this.config
    );
  }
};
var SQLiteTextJson = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteTextJson");
  }
  static [entityKind] = "SQLiteTextJson";
  getSQLType() {
    return "text";
  }
  mapFromDriverValue(value) {
    return JSON.parse(value);
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
};
function text(a, b = {}) {
  const { name, config: config2 } = getColumnNameAndConfig(a, b);
  if (config2.mode === "json") {
    return new SQLiteTextJsonBuilder(name);
  }
  return new SQLiteTextBuilder(name, config2);
}
__name(text, "text");

// ../node_modules/drizzle-orm/sqlite-core/columns/all.js
function getSQLiteColumnBuilders() {
  return {
    blob,
    customType,
    integer,
    numeric,
    real,
    text
  };
}
__name(getSQLiteColumnBuilders, "getSQLiteColumnBuilders");

// ../node_modules/drizzle-orm/sqlite-core/table.js
var InlineForeignKeys2 = Symbol.for("drizzle:SQLiteInlineForeignKeys");
var SQLiteTable = class extends Table {
  static {
    __name(this, "SQLiteTable");
  }
  static [entityKind] = "SQLiteTable";
  /** @internal */
  static Symbol = Object.assign({}, Table.Symbol, {
    InlineForeignKeys: InlineForeignKeys2
  });
  /** @internal */
  [Table.Symbol.Columns];
  /** @internal */
  [InlineForeignKeys2] = [];
  /** @internal */
  [Table.Symbol.ExtraConfigBuilder] = void 0;
};
function sqliteTableBase(name, columns, extraConfig, schema, baseName = name) {
  const rawTable = new SQLiteTable(name, schema, baseName);
  const parsedColumns = typeof columns === "function" ? columns(getSQLiteColumnBuilders()) : columns;
  const builtColumns = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys2].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    })
  );
  const table3 = Object.assign(rawTable, builtColumns);
  table3[Table.Symbol.Columns] = builtColumns;
  table3[Table.Symbol.ExtraConfigColumns] = builtColumns;
  if (extraConfig) {
    table3[SQLiteTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return table3;
}
__name(sqliteTableBase, "sqliteTableBase");
var sqliteTable = /* @__PURE__ */ __name((name, columns, extraConfig) => {
  return sqliteTableBase(name, columns, extraConfig);
}, "sqliteTable");

// ../node_modules/drizzle-orm/sqlite-core/indexes.js
var IndexBuilderOn = class {
  static {
    __name(this, "IndexBuilderOn");
  }
  constructor(name, unique) {
    this.name = name;
    this.unique = unique;
  }
  static [entityKind] = "SQLiteIndexBuilderOn";
  on(...columns) {
    return new IndexBuilder(this.name, columns, this.unique);
  }
};
var IndexBuilder = class {
  static {
    __name(this, "IndexBuilder");
  }
  static [entityKind] = "SQLiteIndexBuilder";
  /** @internal */
  config;
  constructor(name, columns, unique) {
    this.config = {
      name,
      columns,
      unique,
      where: void 0
    };
  }
  /**
   * Condition for partial index.
   */
  where(condition) {
    this.config.where = condition;
    return this;
  }
  /** @internal */
  build(table3) {
    return new Index(this.config, table3);
  }
};
var Index = class {
  static {
    __name(this, "Index");
  }
  static [entityKind] = "SQLiteIndex";
  config;
  constructor(config2, table3) {
    this.config = { ...config2, table: table3 };
  }
};
function index(name) {
  return new IndexBuilderOn(name, false);
}
__name(index, "index");

// ../node_modules/drizzle-orm/sqlite-core/utils.js
function extractUsedTable(table3) {
  if (is(table3, SQLiteTable)) {
    return [`${table3[Table.Symbol.BaseName]}`];
  }
  if (is(table3, Subquery)) {
    return table3._.usedTables ?? [];
  }
  if (is(table3, SQL)) {
    return table3.usedTables ?? [];
  }
  return [];
}
__name(extractUsedTable, "extractUsedTable");

// ../node_modules/drizzle-orm/sqlite-core/query-builders/delete.js
var SQLiteDeleteBase = class extends QueryPromise {
  static {
    __name(this, "SQLiteDeleteBase");
  }
  constructor(table3, session, dialect, withList) {
    super();
    this.table = table3;
    this.session = session;
    this.dialect = dialect;
    this.config = { table: table3, withList };
  }
  static [entityKind] = "SQLiteDelete";
  /** @internal */
  config;
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will delete only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be deleted.
   *
   * ```ts
   * // Delete all cars with green color
   * db.delete(cars).where(eq(cars.color, 'green'));
   * // or
   * db.delete(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Delete all BMW cars with a green color
   * db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Delete all cars with the green or blue color
   * db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    this.config.where = where;
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](
        new Proxy(
          this.config.table[Table.Symbol.Columns],
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
      this.config.orderBy = orderByArray;
    } else {
      const orderByArray = columns;
      this.config.orderBy = orderByArray;
    }
    return this;
  }
  limit(limit) {
    this.config.limit = limit;
    return this;
  }
  returning(fields = this.table[SQLiteTable.Symbol.Columns]) {
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildDeleteQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      true,
      void 0,
      {
        type: "delete",
        tables: extractUsedTable(this.config.table)
      }
    );
  }
  prepare() {
    return this._prepare(false);
  }
  run = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().run(placeholderValues);
  }, "run");
  all = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().all(placeholderValues);
  }, "all");
  get = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().get(placeholderValues);
  }, "get");
  values = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().values(placeholderValues);
  }, "values");
  async execute(placeholderValues) {
    return this._prepare().execute(placeholderValues);
  }
  $dynamic() {
    return this;
  }
};

// ../node_modules/drizzle-orm/casing.js
function toSnakeCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.map((word) => word.toLowerCase()).join("_");
}
__name(toSnakeCase, "toSnakeCase");
function toCamelCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.reduce((acc, word, i) => {
    const formattedWord = i === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1)}`;
    return acc + formattedWord;
  }, "");
}
__name(toCamelCase, "toCamelCase");
function noopCase(input) {
  return input;
}
__name(noopCase, "noopCase");
var CasingCache = class {
  static {
    __name(this, "CasingCache");
  }
  static [entityKind] = "CasingCache";
  /** @internal */
  cache = {};
  cachedTables = {};
  convert;
  constructor(casing) {
    this.convert = casing === "snake_case" ? toSnakeCase : casing === "camelCase" ? toCamelCase : noopCase;
  }
  getColumnCasing(column) {
    if (!column.keyAsName) return column.name;
    const schema = column.table[Table.Symbol.Schema] ?? "public";
    const tableName = column.table[Table.Symbol.OriginalName];
    const key = `${schema}.${tableName}.${column.name}`;
    if (!this.cache[key]) {
      this.cacheTable(column.table);
    }
    return this.cache[key];
  }
  cacheTable(table3) {
    const schema = table3[Table.Symbol.Schema] ?? "public";
    const tableName = table3[Table.Symbol.OriginalName];
    const tableKey = `${schema}.${tableName}`;
    if (!this.cachedTables[tableKey]) {
      for (const column of Object.values(table3[Table.Symbol.Columns])) {
        const columnKey = `${tableKey}.${column.name}`;
        this.cache[columnKey] = this.convert(column.name);
      }
      this.cachedTables[tableKey] = true;
    }
  }
  clearCache() {
    this.cache = {};
    this.cachedTables = {};
  }
};

// ../node_modules/drizzle-orm/errors.js
var DrizzleError = class extends Error {
  static {
    __name(this, "DrizzleError");
  }
  static [entityKind] = "DrizzleError";
  constructor({ message, cause }) {
    super(message);
    this.name = "DrizzleError";
    this.cause = cause;
  }
};
var DrizzleQueryError = class _DrizzleQueryError extends Error {
  static {
    __name(this, "DrizzleQueryError");
  }
  constructor(query, params, cause) {
    super(`Failed query: ${query}
params: ${params}`);
    this.query = query;
    this.params = params;
    this.cause = cause;
    Error.captureStackTrace(this, _DrizzleQueryError);
    if (cause) this.cause = cause;
  }
};
var TransactionRollbackError = class extends DrizzleError {
  static {
    __name(this, "TransactionRollbackError");
  }
  static [entityKind] = "TransactionRollbackError";
  constructor() {
    super({ message: "Rollback" });
  }
};

// ../node_modules/drizzle-orm/sql/functions/aggregate.js
function count3(expression) {
  return sql`count(${expression || sql.raw("*")})`.mapWith(Number);
}
__name(count3, "count");

// ../node_modules/drizzle-orm/sqlite-core/view-base.js
var SQLiteViewBase = class extends View {
  static {
    __name(this, "SQLiteViewBase");
  }
  static [entityKind] = "SQLiteViewBase";
};

// ../node_modules/drizzle-orm/sqlite-core/dialect.js
var SQLiteDialect = class {
  static {
    __name(this, "SQLiteDialect");
  }
  static [entityKind] = "SQLiteDialect";
  /** @internal */
  casing;
  constructor(config2) {
    this.casing = new CasingCache(config2?.casing);
  }
  escapeName(name) {
    return `"${name}"`;
  }
  escapeParam(_num) {
    return "?";
  }
  escapeString(str) {
    return `'${str.replace(/'/g, "''")}'`;
  }
  buildWithCTE(queries) {
    if (!queries?.length) return void 0;
    const withSqlChunks = [sql`with `];
    for (const [i, w] of queries.entries()) {
      withSqlChunks.push(sql`${sql.identifier(w._.alias)} as (${w._.sql})`);
      if (i < queries.length - 1) {
        withSqlChunks.push(sql`, `);
      }
    }
    withSqlChunks.push(sql` `);
    return sql.join(withSqlChunks);
  }
  buildDeleteQuery({ table: table3, where, returning, withList, limit, orderBy }) {
    const withSql = this.buildWithCTE(withList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    const orderBySql = this.buildOrderBy(orderBy);
    const limitSql = this.buildLimit(limit);
    return sql`${withSql}delete from ${table3}${whereSql}${returningSql}${orderBySql}${limitSql}`;
  }
  buildUpdateSet(table3, set) {
    const tableColumns = table3[Table.Symbol.Columns];
    const columnNames = Object.keys(tableColumns).filter(
      (colName) => set[colName] !== void 0 || tableColumns[colName]?.onUpdateFn !== void 0
    );
    const setSize = columnNames.length;
    return sql.join(columnNames.flatMap((colName, i) => {
      const col = tableColumns[colName];
      const onUpdateFnResult = col.onUpdateFn?.();
      const value = set[colName] ?? (is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col));
      const res = sql`${sql.identifier(this.casing.getColumnCasing(col))} = ${value}`;
      if (i < setSize - 1) {
        return [res, sql.raw(", ")];
      }
      return [res];
    }));
  }
  buildUpdateQuery({ table: table3, set, where, returning, withList, joins, from, limit, orderBy }) {
    const withSql = this.buildWithCTE(withList);
    const setSql = this.buildUpdateSet(table3, set);
    const fromSql = from && sql.join([sql.raw(" from "), this.buildFromTable(from)]);
    const joinsSql = this.buildJoins(joins);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    const orderBySql = this.buildOrderBy(orderBy);
    const limitSql = this.buildLimit(limit);
    return sql`${withSql}update ${table3} set ${setSql}${fromSql}${joinsSql}${whereSql}${returningSql}${orderBySql}${limitSql}`;
  }
  /**
   * Builds selection SQL with provided fields/expressions
   *
   * Examples:
   *
   * `select <selection> from`
   *
   * `insert ... returning <selection>`
   *
   * If `isSingleTable` is true, then columns won't be prefixed with table name
   */
  buildSelection(fields, { isSingleTable = false } = {}) {
    const columnsLen = fields.length;
    const chunks = fields.flatMap(({ field }, i) => {
      const chunk = [];
      if (is(field, SQL.Aliased) && field.isSelectionField) {
        chunk.push(sql.identifier(field.fieldAlias));
      } else if (is(field, SQL.Aliased) || is(field, SQL)) {
        const query = is(field, SQL.Aliased) ? field.sql : field;
        if (isSingleTable) {
          chunk.push(
            new SQL(
              query.queryChunks.map((c) => {
                if (is(c, Column)) {
                  return sql.identifier(this.casing.getColumnCasing(c));
                }
                return c;
              })
            )
          );
        } else {
          chunk.push(query);
        }
        if (is(field, SQL.Aliased)) {
          chunk.push(sql` as ${sql.identifier(field.fieldAlias)}`);
        }
      } else if (is(field, Column)) {
        const tableName = field.table[Table.Symbol.Name];
        if (field.columnType === "SQLiteNumericBigInt") {
          if (isSingleTable) {
            chunk.push(sql`cast(${sql.identifier(this.casing.getColumnCasing(field))} as text)`);
          } else {
            chunk.push(
              sql`cast(${sql.identifier(tableName)}.${sql.identifier(this.casing.getColumnCasing(field))} as text)`
            );
          }
        } else {
          if (isSingleTable) {
            chunk.push(sql.identifier(this.casing.getColumnCasing(field)));
          } else {
            chunk.push(sql`${sql.identifier(tableName)}.${sql.identifier(this.casing.getColumnCasing(field))}`);
          }
        }
      } else if (is(field, Subquery)) {
        const entries = Object.entries(field._.selectedFields);
        if (entries.length === 1) {
          const entry = entries[0][1];
          const fieldDecoder = is(entry, SQL) ? entry.decoder : is(entry, Column) ? { mapFromDriverValue: /* @__PURE__ */ __name((v) => entry.mapFromDriverValue(v), "mapFromDriverValue") } : entry.sql.decoder;
          if (fieldDecoder) field._.sql.decoder = fieldDecoder;
        }
        chunk.push(field);
      }
      if (i < columnsLen - 1) {
        chunk.push(sql`, `);
      }
      return chunk;
    });
    return sql.join(chunks);
  }
  buildJoins(joins) {
    if (!joins || joins.length === 0) {
      return void 0;
    }
    const joinsArray = [];
    if (joins) {
      for (const [index2, joinMeta] of joins.entries()) {
        if (index2 === 0) {
          joinsArray.push(sql` `);
        }
        const table3 = joinMeta.table;
        const onSql = joinMeta.on ? sql` on ${joinMeta.on}` : void 0;
        if (is(table3, SQLiteTable)) {
          const tableName = table3[SQLiteTable.Symbol.Name];
          const tableSchema = table3[SQLiteTable.Symbol.Schema];
          const origTableName = table3[SQLiteTable.Symbol.OriginalName];
          const alias = tableName === origTableName ? void 0 : joinMeta.alias;
          joinsArray.push(
            sql`${sql.raw(joinMeta.joinType)} join ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`}${onSql}`
          );
        } else {
          joinsArray.push(
            sql`${sql.raw(joinMeta.joinType)} join ${table3}${onSql}`
          );
        }
        if (index2 < joins.length - 1) {
          joinsArray.push(sql` `);
        }
      }
    }
    return sql.join(joinsArray);
  }
  buildLimit(limit) {
    return typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
  }
  buildOrderBy(orderBy) {
    const orderByList = [];
    if (orderBy) {
      for (const [index2, orderByValue] of orderBy.entries()) {
        orderByList.push(orderByValue);
        if (index2 < orderBy.length - 1) {
          orderByList.push(sql`, `);
        }
      }
    }
    return orderByList.length > 0 ? sql` order by ${sql.join(orderByList)}` : void 0;
  }
  buildFromTable(table3) {
    if (is(table3, Table) && table3[Table.Symbol.IsAlias]) {
      return sql`${sql`${sql.identifier(table3[Table.Symbol.Schema] ?? "")}.`.if(table3[Table.Symbol.Schema])}${sql.identifier(table3[Table.Symbol.OriginalName])} ${sql.identifier(table3[Table.Symbol.Name])}`;
    }
    return table3;
  }
  buildSelectQuery({
    withList,
    fields,
    fieldsFlat,
    where,
    having,
    table: table3,
    joins,
    orderBy,
    groupBy,
    limit,
    offset,
    distinct,
    setOperators
  }) {
    const fieldsList = fieldsFlat ?? orderSelectedFields(fields);
    for (const f of fieldsList) {
      if (is(f.field, Column) && getTableName(f.field.table) !== (is(table3, Subquery) ? table3._.alias : is(table3, SQLiteViewBase) ? table3[ViewBaseConfig].name : is(table3, SQL) ? void 0 : getTableName(table3)) && !((table22) => joins?.some(
        ({ alias }) => alias === (table22[Table.Symbol.IsAlias] ? getTableName(table22) : table22[Table.Symbol.BaseName])
      ))(f.field.table)) {
        const tableName = getTableName(f.field.table);
        throw new Error(
          `Your "${f.path.join("->")}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`
        );
      }
    }
    const isSingleTable = !joins || joins.length === 0;
    const withSql = this.buildWithCTE(withList);
    const distinctSql = distinct ? sql` distinct` : void 0;
    const selection = this.buildSelection(fieldsList, { isSingleTable });
    const tableSql = this.buildFromTable(table3);
    const joinsSql = this.buildJoins(joins);
    const whereSql = where ? sql` where ${where}` : void 0;
    const havingSql = having ? sql` having ${having}` : void 0;
    const groupByList = [];
    if (groupBy) {
      for (const [index2, groupByValue] of groupBy.entries()) {
        groupByList.push(groupByValue);
        if (index2 < groupBy.length - 1) {
          groupByList.push(sql`, `);
        }
      }
    }
    const groupBySql = groupByList.length > 0 ? sql` group by ${sql.join(groupByList)}` : void 0;
    const orderBySql = this.buildOrderBy(orderBy);
    const limitSql = this.buildLimit(limit);
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    const finalQuery = sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}`;
    if (setOperators.length > 0) {
      return this.buildSetOperations(finalQuery, setOperators);
    }
    return finalQuery;
  }
  buildSetOperations(leftSelect, setOperators) {
    const [setOperator, ...rest] = setOperators;
    if (!setOperator) {
      throw new Error("Cannot pass undefined values to any set operator");
    }
    if (rest.length === 0) {
      return this.buildSetOperationQuery({ leftSelect, setOperator });
    }
    return this.buildSetOperations(
      this.buildSetOperationQuery({ leftSelect, setOperator }),
      rest
    );
  }
  buildSetOperationQuery({
    leftSelect,
    setOperator: { type, isAll, rightSelect, limit, orderBy, offset }
  }) {
    const leftChunk = sql`${leftSelect.getSQL()} `;
    const rightChunk = sql`${rightSelect.getSQL()}`;
    let orderBySql;
    if (orderBy && orderBy.length > 0) {
      const orderByValues = [];
      for (const singleOrderBy of orderBy) {
        if (is(singleOrderBy, SQLiteColumn)) {
          orderByValues.push(sql.identifier(singleOrderBy.name));
        } else if (is(singleOrderBy, SQL)) {
          for (let i = 0; i < singleOrderBy.queryChunks.length; i++) {
            const chunk = singleOrderBy.queryChunks[i];
            if (is(chunk, SQLiteColumn)) {
              singleOrderBy.queryChunks[i] = sql.identifier(this.casing.getColumnCasing(chunk));
            }
          }
          orderByValues.push(sql`${singleOrderBy}`);
        } else {
          orderByValues.push(sql`${singleOrderBy}`);
        }
      }
      orderBySql = sql` order by ${sql.join(orderByValues, sql`, `)}`;
    }
    const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
    const operatorChunk = sql.raw(`${type} ${isAll ? "all " : ""}`);
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    return sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
  }
  buildInsertQuery({ table: table3, values: valuesOrSelect, onConflict, returning, withList, select }) {
    const valuesSqlList = [];
    const columns = table3[Table.Symbol.Columns];
    const colEntries = Object.entries(columns).filter(
      ([_, col]) => !col.shouldDisableInsert()
    );
    const insertOrder = colEntries.map(([, column]) => sql.identifier(this.casing.getColumnCasing(column)));
    if (select) {
      const select2 = valuesOrSelect;
      if (is(select2, SQL)) {
        valuesSqlList.push(select2);
      } else {
        valuesSqlList.push(select2.getSQL());
      }
    } else {
      const values = valuesOrSelect;
      valuesSqlList.push(sql.raw("values "));
      for (const [valueIndex, value] of values.entries()) {
        const valueList = [];
        for (const [fieldName, col] of colEntries) {
          const colValue = value[fieldName];
          if (colValue === void 0 || is(colValue, Param) && colValue.value === void 0) {
            let defaultValue;
            if (col.default !== null && col.default !== void 0) {
              defaultValue = is(col.default, SQL) ? col.default : sql.param(col.default, col);
            } else if (col.defaultFn !== void 0) {
              const defaultFnResult = col.defaultFn();
              defaultValue = is(defaultFnResult, SQL) ? defaultFnResult : sql.param(defaultFnResult, col);
            } else if (!col.default && col.onUpdateFn !== void 0) {
              const onUpdateFnResult = col.onUpdateFn();
              defaultValue = is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col);
            } else {
              defaultValue = sql`null`;
            }
            valueList.push(defaultValue);
          } else {
            valueList.push(colValue);
          }
        }
        valuesSqlList.push(valueList);
        if (valueIndex < values.length - 1) {
          valuesSqlList.push(sql`, `);
        }
      }
    }
    const withSql = this.buildWithCTE(withList);
    const valuesSql = sql.join(valuesSqlList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const onConflictSql = onConflict?.length ? sql.join(onConflict) : void 0;
    return sql`${withSql}insert into ${table3} ${insertOrder} ${valuesSql}${onConflictSql}${returningSql}`;
  }
  sqlToQuery(sql2, invokeSource) {
    return sql2.toQuery({
      casing: this.casing,
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString,
      invokeSource
    });
  }
  buildRelationalQuery({
    fullSchema,
    schema,
    tableNamesMap,
    table: table3,
    tableConfig,
    queryConfig: config2,
    tableAlias,
    nestedQueryRelation,
    joinOn
  }) {
    let selection = [];
    let limit, offset, orderBy = [], where;
    const joins = [];
    if (config2 === true) {
      const selectionEntries = Object.entries(tableConfig.columns);
      selection = selectionEntries.map(([key, value]) => ({
        dbKey: value.name,
        tsKey: key,
        field: aliasedTableColumn(value, tableAlias),
        relationTableTsKey: void 0,
        isJson: false,
        selection: []
      }));
    } else {
      const aliasedColumns = Object.fromEntries(
        Object.entries(tableConfig.columns).map(([key, value]) => [key, aliasedTableColumn(value, tableAlias)])
      );
      if (config2.where) {
        const whereSql = typeof config2.where === "function" ? config2.where(aliasedColumns, getOperators()) : config2.where;
        where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
      }
      const fieldsSelection = [];
      let selectedColumns = [];
      if (config2.columns) {
        let isIncludeMode = false;
        for (const [field, value] of Object.entries(config2.columns)) {
          if (value === void 0) {
            continue;
          }
          if (field in tableConfig.columns) {
            if (!isIncludeMode && value === true) {
              isIncludeMode = true;
            }
            selectedColumns.push(field);
          }
        }
        if (selectedColumns.length > 0) {
          selectedColumns = isIncludeMode ? selectedColumns.filter((c) => config2.columns?.[c] === true) : Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
        }
      } else {
        selectedColumns = Object.keys(tableConfig.columns);
      }
      for (const field of selectedColumns) {
        const column = tableConfig.columns[field];
        fieldsSelection.push({ tsKey: field, value: column });
      }
      let selectedRelations = [];
      if (config2.with) {
        selectedRelations = Object.entries(config2.with).filter((entry) => !!entry[1]).map(([tsKey, queryConfig]) => ({ tsKey, queryConfig, relation: tableConfig.relations[tsKey] }));
      }
      let extras;
      if (config2.extras) {
        extras = typeof config2.extras === "function" ? config2.extras(aliasedColumns, { sql }) : config2.extras;
        for (const [tsKey, value] of Object.entries(extras)) {
          fieldsSelection.push({
            tsKey,
            value: mapColumnsInAliasedSQLToAlias(value, tableAlias)
          });
        }
      }
      for (const { tsKey, value } of fieldsSelection) {
        selection.push({
          dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
          tsKey,
          field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
          relationTableTsKey: void 0,
          isJson: false,
          selection: []
        });
      }
      let orderByOrig = typeof config2.orderBy === "function" ? config2.orderBy(aliasedColumns, getOrderByOperators()) : config2.orderBy ?? [];
      if (!Array.isArray(orderByOrig)) {
        orderByOrig = [orderByOrig];
      }
      orderBy = orderByOrig.map((orderByValue) => {
        if (is(orderByValue, Column)) {
          return aliasedTableColumn(orderByValue, tableAlias);
        }
        return mapColumnsInSQLToAlias(orderByValue, tableAlias);
      });
      limit = config2.limit;
      offset = config2.offset;
      for (const {
        tsKey: selectedRelationTsKey,
        queryConfig: selectedRelationConfigValue,
        relation
      } of selectedRelations) {
        const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
        const relationTableName = getTableUniqueName(relation.referencedTable);
        const relationTableTsName = tableNamesMap[relationTableName];
        const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
        const joinOn2 = and(
          ...normalizedRelation.fields.map(
            (field2, i) => eq(
              aliasedTableColumn(normalizedRelation.references[i], relationTableAlias),
              aliasedTableColumn(field2, tableAlias)
            )
          )
        );
        const builtRelation = this.buildRelationalQuery({
          fullSchema,
          schema,
          tableNamesMap,
          table: fullSchema[relationTableTsName],
          tableConfig: schema[relationTableTsName],
          queryConfig: is(relation, One) ? selectedRelationConfigValue === true ? { limit: 1 } : { ...selectedRelationConfigValue, limit: 1 } : selectedRelationConfigValue,
          tableAlias: relationTableAlias,
          joinOn: joinOn2,
          nestedQueryRelation: relation
        });
        const field = sql`(${builtRelation.sql})`.as(selectedRelationTsKey);
        selection.push({
          dbKey: selectedRelationTsKey,
          tsKey: selectedRelationTsKey,
          field,
          relationTableTsKey: relationTableTsName,
          isJson: true,
          selection: builtRelation.selection
        });
      }
    }
    if (selection.length === 0) {
      throw new DrizzleError({
        message: `No fields selected for table "${tableConfig.tsName}" ("${tableAlias}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`
      });
    }
    let result;
    where = and(joinOn, where);
    if (nestedQueryRelation) {
      let field = sql`json_array(${sql.join(
        selection.map(
          ({ field: field2 }) => is(field2, SQLiteColumn) ? sql.identifier(this.casing.getColumnCasing(field2)) : is(field2, SQL.Aliased) ? field2.sql : field2
        ),
        sql`, `
      )})`;
      if (is(nestedQueryRelation, Many)) {
        field = sql`coalesce(json_group_array(${field}), json_array())`;
      }
      const nestedSelection = [{
        dbKey: "data",
        tsKey: "data",
        field: field.as("data"),
        isJson: true,
        relationTableTsKey: tableConfig.tsName,
        selection
      }];
      const needsSubquery = limit !== void 0 || offset !== void 0 || orderBy.length > 0;
      if (needsSubquery) {
        result = this.buildSelectQuery({
          table: aliasedTable(table3, tableAlias),
          fields: {},
          fieldsFlat: [
            {
              path: [],
              field: sql.raw("*")
            }
          ],
          where,
          limit,
          offset,
          orderBy,
          setOperators: []
        });
        where = void 0;
        limit = void 0;
        offset = void 0;
        orderBy = void 0;
      } else {
        result = aliasedTable(table3, tableAlias);
      }
      result = this.buildSelectQuery({
        table: is(result, SQLiteTable) ? result : new Subquery(result, {}, tableAlias),
        fields: {},
        fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
          path: [],
          field: is(field2, Column) ? aliasedTableColumn(field2, tableAlias) : field2
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    } else {
      result = this.buildSelectQuery({
        table: aliasedTable(table3, tableAlias),
        fields: {},
        fieldsFlat: selection.map(({ field }) => ({
          path: [],
          field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    }
    return {
      tableTsKey: tableConfig.tsName,
      sql: result,
      selection
    };
  }
};
var SQLiteSyncDialect = class extends SQLiteDialect {
  static {
    __name(this, "SQLiteSyncDialect");
  }
  static [entityKind] = "SQLiteSyncDialect";
  migrate(migrations, session, config2) {
    const migrationsTable = config2 === void 0 ? "__drizzle_migrations" : typeof config2 === "string" ? "__drizzle_migrations" : config2.migrationsTable ?? "__drizzle_migrations";
    const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
    session.run(migrationTableCreate);
    const dbMigrations = session.values(
      sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
    );
    const lastDbMigration = dbMigrations[0] ?? void 0;
    session.run(sql`BEGIN`);
    try {
      for (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            session.run(sql.raw(stmt));
          }
          session.run(
            sql`INSERT INTO ${sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
          );
        }
      }
      session.run(sql`COMMIT`);
    } catch (e) {
      session.run(sql`ROLLBACK`);
      throw e;
    }
  }
};
var SQLiteAsyncDialect = class extends SQLiteDialect {
  static {
    __name(this, "SQLiteAsyncDialect");
  }
  static [entityKind] = "SQLiteAsyncDialect";
  async migrate(migrations, session, config2) {
    const migrationsTable = config2 === void 0 ? "__drizzle_migrations" : typeof config2 === "string" ? "__drizzle_migrations" : config2.migrationsTable ?? "__drizzle_migrations";
    const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
    await session.run(migrationTableCreate);
    const dbMigrations = await session.values(
      sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
    );
    const lastDbMigration = dbMigrations[0] ?? void 0;
    await session.transaction(async (tx) => {
      for (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            await tx.run(sql.raw(stmt));
          }
          await tx.run(
            sql`INSERT INTO ${sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
          );
        }
      }
    });
  }
};

// ../node_modules/drizzle-orm/query-builders/query-builder.js
var TypedQueryBuilder = class {
  static {
    __name(this, "TypedQueryBuilder");
  }
  static [entityKind] = "TypedQueryBuilder";
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
};

// ../node_modules/drizzle-orm/sqlite-core/query-builders/select.js
var SQLiteSelectBuilder = class {
  static {
    __name(this, "SQLiteSelectBuilder");
  }
  static [entityKind] = "SQLiteSelectBuilder";
  fields;
  session;
  dialect;
  withList;
  distinct;
  constructor(config2) {
    this.fields = config2.fields;
    this.session = config2.session;
    this.dialect = config2.dialect;
    this.withList = config2.withList;
    this.distinct = config2.distinct;
  }
  from(source) {
    const isPartialSelect = !!this.fields;
    let fields;
    if (this.fields) {
      fields = this.fields;
    } else if (is(source, Subquery)) {
      fields = Object.fromEntries(
        Object.keys(source._.selectedFields).map((key) => [key, source[key]])
      );
    } else if (is(source, SQLiteViewBase)) {
      fields = source[ViewBaseConfig].selectedFields;
    } else if (is(source, SQL)) {
      fields = {};
    } else {
      fields = getTableColumns(source);
    }
    return new SQLiteSelectBase({
      table: source,
      fields,
      isPartialSelect,
      session: this.session,
      dialect: this.dialect,
      withList: this.withList,
      distinct: this.distinct
    });
  }
};
var SQLiteSelectQueryBuilderBase = class extends TypedQueryBuilder {
  static {
    __name(this, "SQLiteSelectQueryBuilderBase");
  }
  static [entityKind] = "SQLiteSelectQueryBuilder";
  _;
  /** @internal */
  config;
  joinsNotNullableMap;
  tableName;
  isPartialSelect;
  session;
  dialect;
  cacheConfig = void 0;
  usedTables = /* @__PURE__ */ new Set();
  constructor({ table: table3, fields, isPartialSelect, session, dialect, withList, distinct }) {
    super();
    this.config = {
      withList,
      table: table3,
      fields: { ...fields },
      distinct,
      setOperators: []
    };
    this.isPartialSelect = isPartialSelect;
    this.session = session;
    this.dialect = dialect;
    this._ = {
      selectedFields: fields,
      config: this.config
    };
    this.tableName = getTableLikeName(table3);
    this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
    for (const item of extractUsedTable(table3)) this.usedTables.add(item);
  }
  /** @internal */
  getUsedTables() {
    return [...this.usedTables];
  }
  createJoin(joinType) {
    return (table3, on2) => {
      const baseTableName = this.tableName;
      const tableName = getTableLikeName(table3);
      for (const item of extractUsedTable(table3)) this.usedTables.add(item);
      if (typeof tableName === "string" && this.config.joins?.some((join) => join.alias === tableName)) {
        throw new Error(`Alias "${tableName}" is already used in this query`);
      }
      if (!this.isPartialSelect) {
        if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
          this.config.fields = {
            [baseTableName]: this.config.fields
          };
        }
        if (typeof tableName === "string" && !is(table3, SQL)) {
          const selection = is(table3, Subquery) ? table3._.selectedFields : is(table3, View) ? table3[ViewBaseConfig].selectedFields : table3[Table.Symbol.Columns];
          this.config.fields[tableName] = selection;
        }
      }
      if (typeof on2 === "function") {
        on2 = on2(
          new Proxy(
            this.config.fields,
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      if (!this.config.joins) {
        this.config.joins = [];
      }
      this.config.joins.push({ on: on2, table: table3, joinType, alias: tableName });
      if (typeof tableName === "string") {
        switch (joinType) {
          case "left": {
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "cross":
          case "inner": {
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
        }
      }
      return this;
    };
  }
  /**
   * Executes a `left join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet | null; }[] = await db.select()
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  leftJoin = this.createJoin("left");
  /**
   * Executes a `right join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  rightJoin = this.createJoin("right");
  /**
   * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
   *
   * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  innerJoin = this.createJoin("inner");
  /**
   * Executes a `full join` operation by combining rows from two tables into a new table.
   *
   * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet | null; }[] = await db.select()
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number | null; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  fullJoin = this.createJoin("full");
  /**
   * Executes a `cross join` operation by combining rows from two tables into a new table.
   *
   * Calling this method retrieves all rows from both main and joined tables, merging all rows from each table.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#cross-join}
   *
   * @param table the table to join.
   *
   * @example
   *
   * ```ts
   * // Select all users, each user with every pet
   * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .crossJoin(pets)
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .crossJoin(pets)
   * ```
   */
  crossJoin = this.createJoin("cross");
  createSetOperator(type, isAll) {
    return (rightSelection) => {
      const rightSelect = typeof rightSelection === "function" ? rightSelection(getSQLiteSetOperators()) : rightSelection;
      if (!haveSameKeys(this.getSelectedFields(), rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
      this.config.setOperators.push({ type, isAll, rightSelect });
      return this;
    };
  }
  /**
   * Adds `union` set operator to the query.
   *
   * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
   *
   * @example
   *
   * ```ts
   * // Select all unique names from customers and users tables
   * await db.select({ name: users.name })
   *   .from(users)
   *   .union(
   *     db.select({ name: customers.name }).from(customers)
   *   );
   * // or
   * import { union } from 'drizzle-orm/sqlite-core'
   *
   * await union(
   *   db.select({ name: users.name }).from(users),
   *   db.select({ name: customers.name }).from(customers)
   * );
   * ```
   */
  union = this.createSetOperator("union", false);
  /**
   * Adds `union all` set operator to the query.
   *
   * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
   *
   * @example
   *
   * ```ts
   * // Select all transaction ids from both online and in-store sales
   * await db.select({ transaction: onlineSales.transactionId })
   *   .from(onlineSales)
   *   .unionAll(
   *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   *   );
   * // or
   * import { unionAll } from 'drizzle-orm/sqlite-core'
   *
   * await unionAll(
   *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
   *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   * );
   * ```
   */
  unionAll = this.createSetOperator("union", true);
  /**
   * Adds `intersect` set operator to the query.
   *
   * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
   *
   * @example
   *
   * ```ts
   * // Select course names that are offered in both departments A and B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .intersect(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { intersect } from 'drizzle-orm/sqlite-core'
   *
   * await intersect(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  intersect = this.createSetOperator("intersect", false);
  /**
   * Adds `except` set operator to the query.
   *
   * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
   *
   * @example
   *
   * ```ts
   * // Select all courses offered in department A but not in department B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .except(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { except } from 'drizzle-orm/sqlite-core'
   *
   * await except(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  except = this.createSetOperator("except", false);
  /** @internal */
  addSetOperators(setOperators) {
    this.config.setOperators.push(...setOperators);
    return this;
  }
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be selected.
   *
   * ```ts
   * // Select all cars with green color
   * await db.select().from(cars).where(eq(cars.color, 'green'));
   * // or
   * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Select all BMW cars with a green color
   * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Select all cars with the green or blue color
   * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    if (typeof where === "function") {
      where = where(
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      );
    }
    this.config.where = where;
    return this;
  }
  /**
   * Adds a `having` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
   *
   * @param having the `having` clause.
   *
   * @example
   *
   * ```ts
   * // Select all brands with more than one car
   * await db.select({
   * 	brand: cars.brand,
   * 	count: sql<number>`cast(count(${cars.id}) as int)`,
   * })
   *   .from(cars)
   *   .groupBy(cars.brand)
   *   .having(({ count }) => gt(count, 1));
   * ```
   */
  having(having) {
    if (typeof having === "function") {
      having = having(
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      );
    }
    this.config.having = having;
    return this;
  }
  groupBy(...columns) {
    if (typeof columns[0] === "function") {
      const groupBy = columns[0](
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
    } else {
      this.config.groupBy = columns;
    }
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).orderBy = orderByArray;
      } else {
        this.config.orderBy = orderByArray;
      }
    } else {
      const orderByArray = columns;
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).orderBy = orderByArray;
      } else {
        this.config.orderBy = orderByArray;
      }
    }
    return this;
  }
  /**
   * Adds a `limit` clause to the query.
   *
   * Calling this method will set the maximum number of rows that will be returned by this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param limit the `limit` clause.
   *
   * @example
   *
   * ```ts
   * // Get the first 10 people from this query.
   * await db.select().from(people).limit(10);
   * ```
   */
  limit(limit) {
    if (this.config.setOperators.length > 0) {
      this.config.setOperators.at(-1).limit = limit;
    } else {
      this.config.limit = limit;
    }
    return this;
  }
  /**
   * Adds an `offset` clause to the query.
   *
   * Calling this method will skip a number of rows when returning results from this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param offset the `offset` clause.
   *
   * @example
   *
   * ```ts
   * // Get the 10th-20th people from this query.
   * await db.select().from(people).offset(10).limit(10);
   * ```
   */
  offset(offset) {
    if (this.config.setOperators.length > 0) {
      this.config.setOperators.at(-1).offset = offset;
    } else {
      this.config.offset = offset;
    }
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  as(alias) {
    const usedTables = [];
    usedTables.push(...extractUsedTable(this.config.table));
    if (this.config.joins) {
      for (const it of this.config.joins) usedTables.push(...extractUsedTable(it.table));
    }
    return new Proxy(
      new Subquery(this.getSQL(), this.config.fields, alias, false, [...new Set(usedTables)]),
      new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  /** @internal */
  getSelectedFields() {
    return new Proxy(
      this.config.fields,
      new SelectionProxyHandler({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  $dynamic() {
    return this;
  }
};
var SQLiteSelectBase = class extends SQLiteSelectQueryBuilderBase {
  static {
    __name(this, "SQLiteSelectBase");
  }
  static [entityKind] = "SQLiteSelect";
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    if (!this.session) {
      throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
    }
    const fieldsList = orderSelectedFields(this.config.fields);
    const query = this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      fieldsList,
      "all",
      true,
      void 0,
      {
        type: "select",
        tables: [...this.usedTables]
      },
      this.cacheConfig
    );
    query.joinsNotNullableMap = this.joinsNotNullableMap;
    return query;
  }
  $withCache(config2) {
    this.cacheConfig = config2 === void 0 ? { config: {}, enable: true, autoInvalidate: true } : config2 === false ? { enable: false } : { enable: true, autoInvalidate: true, ...config2 };
    return this;
  }
  prepare() {
    return this._prepare(false);
  }
  run = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().run(placeholderValues);
  }, "run");
  all = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().all(placeholderValues);
  }, "all");
  get = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().get(placeholderValues);
  }, "get");
  values = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().values(placeholderValues);
  }, "values");
  async execute() {
    return this.all();
  }
};
applyMixins(SQLiteSelectBase, [QueryPromise]);
function createSetOperator(type, isAll) {
  return (leftSelect, rightSelect, ...restSelects) => {
    const setOperators = [rightSelect, ...restSelects].map((select) => ({
      type,
      isAll,
      rightSelect: select
    }));
    for (const setOperator of setOperators) {
      if (!haveSameKeys(leftSelect.getSelectedFields(), setOperator.rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
    }
    return leftSelect.addSetOperators(setOperators);
  };
}
__name(createSetOperator, "createSetOperator");
var getSQLiteSetOperators = /* @__PURE__ */ __name(() => ({
  union,
  unionAll,
  intersect,
  except
}), "getSQLiteSetOperators");
var union = createSetOperator("union", false);
var unionAll = createSetOperator("union", true);
var intersect = createSetOperator("intersect", false);
var except = createSetOperator("except", false);

// ../node_modules/drizzle-orm/sqlite-core/query-builders/query-builder.js
var QueryBuilder = class {
  static {
    __name(this, "QueryBuilder");
  }
  static [entityKind] = "SQLiteQueryBuilder";
  dialect;
  dialectConfig;
  constructor(dialect) {
    this.dialect = is(dialect, SQLiteDialect) ? dialect : void 0;
    this.dialectConfig = is(dialect, SQLiteDialect) ? void 0 : dialect;
  }
  $with = /* @__PURE__ */ __name((alias, selection) => {
    const queryBuilder = this;
    const as = /* @__PURE__ */ __name((qb) => {
      if (typeof qb === "function") {
        qb = qb(queryBuilder);
      }
      return new Proxy(
        new WithSubquery(
          qb.getSQL(),
          selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
          alias,
          true
        ),
        new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
      );
    }, "as");
    return { as };
  }, "$with");
  with(...queries) {
    const self = this;
    function select(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        withList: queries
      });
    }
    __name(select, "select");
    function selectDistinct(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        withList: queries,
        distinct: true
      });
    }
    __name(selectDistinct, "selectDistinct");
    return { select, selectDistinct };
  }
  select(fields) {
    return new SQLiteSelectBuilder({ fields: fields ?? void 0, session: void 0, dialect: this.getDialect() });
  }
  selectDistinct(fields) {
    return new SQLiteSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: true
    });
  }
  // Lazy load dialect to avoid circular dependency
  getDialect() {
    if (!this.dialect) {
      this.dialect = new SQLiteSyncDialect(this.dialectConfig);
    }
    return this.dialect;
  }
};

// ../node_modules/drizzle-orm/sqlite-core/query-builders/insert.js
var SQLiteInsertBuilder = class {
  static {
    __name(this, "SQLiteInsertBuilder");
  }
  constructor(table3, session, dialect, withList) {
    this.table = table3;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
  }
  static [entityKind] = "SQLiteInsertBuilder";
  values(values) {
    values = Array.isArray(values) ? values : [values];
    if (values.length === 0) {
      throw new Error("values() must be called with at least one value");
    }
    const mappedValues = values.map((entry) => {
      const result = {};
      const cols = this.table[Table.Symbol.Columns];
      for (const colKey of Object.keys(entry)) {
        const colValue = entry[colKey];
        result[colKey] = is(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
      }
      return result;
    });
    return new SQLiteInsertBase(this.table, mappedValues, this.session, this.dialect, this.withList);
  }
  select(selectQuery) {
    const select = typeof selectQuery === "function" ? selectQuery(new QueryBuilder()) : selectQuery;
    if (!is(select, SQL) && !haveSameKeys(this.table[Columns], select._.selectedFields)) {
      throw new Error(
        "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
      );
    }
    return new SQLiteInsertBase(this.table, select, this.session, this.dialect, this.withList, true);
  }
};
var SQLiteInsertBase = class extends QueryPromise {
  static {
    __name(this, "SQLiteInsertBase");
  }
  constructor(table3, values, session, dialect, withList, select) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { table: table3, values, withList, select };
  }
  static [entityKind] = "SQLiteInsert";
  /** @internal */
  config;
  returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /**
   * Adds an `on conflict do nothing` clause to the query.
   *
   * Calling this method simply avoids inserting a row as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
   *
   * @param config The `target` and `where` clauses.
   *
   * @example
   * ```ts
   * // Insert one row and cancel the insert if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing();
   *
   * // Explicitly specify conflict target
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing({ target: cars.id });
   * ```
   */
  onConflictDoNothing(config2 = {}) {
    if (!this.config.onConflict) this.config.onConflict = [];
    if (config2.target === void 0) {
      this.config.onConflict.push(sql` on conflict do nothing`);
    } else {
      const targetSql = Array.isArray(config2.target) ? sql`${config2.target}` : sql`${[config2.target]}`;
      const whereSql = config2.where ? sql` where ${config2.where}` : sql``;
      this.config.onConflict.push(sql` on conflict ${targetSql} do nothing${whereSql}`);
    }
    return this;
  }
  /**
   * Adds an `on conflict do update` clause to the query.
   *
   * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
   *
   * @param config The `target`, `set` and `where` clauses.
   *
   * @example
   * ```ts
   * // Update the row if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'Porsche' }
   *   });
   *
   * // Upsert with 'where' clause
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'newBMW' },
   *     where: sql`${cars.createdAt} > '2023-01-01'::date`,
   *   });
   * ```
   */
  onConflictDoUpdate(config2) {
    if (config2.where && (config2.targetWhere || config2.setWhere)) {
      throw new Error(
        'You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.'
      );
    }
    if (!this.config.onConflict) this.config.onConflict = [];
    const whereSql = config2.where ? sql` where ${config2.where}` : void 0;
    const targetWhereSql = config2.targetWhere ? sql` where ${config2.targetWhere}` : void 0;
    const setWhereSql = config2.setWhere ? sql` where ${config2.setWhere}` : void 0;
    const targetSql = Array.isArray(config2.target) ? sql`${config2.target}` : sql`${[config2.target]}`;
    const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config2.set));
    this.config.onConflict.push(
      sql` on conflict ${targetSql}${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`
    );
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildInsertQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      true,
      void 0,
      {
        type: "insert",
        tables: extractUsedTable(this.config.table)
      }
    );
  }
  prepare() {
    return this._prepare(false);
  }
  run = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().run(placeholderValues);
  }, "run");
  all = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().all(placeholderValues);
  }, "all");
  get = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().get(placeholderValues);
  }, "get");
  values = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().values(placeholderValues);
  }, "values");
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
};

// ../node_modules/drizzle-orm/sqlite-core/query-builders/update.js
var SQLiteUpdateBuilder = class {
  static {
    __name(this, "SQLiteUpdateBuilder");
  }
  constructor(table3, session, dialect, withList) {
    this.table = table3;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
  }
  static [entityKind] = "SQLiteUpdateBuilder";
  set(values) {
    return new SQLiteUpdateBase(
      this.table,
      mapUpdateSet(this.table, values),
      this.session,
      this.dialect,
      this.withList
    );
  }
};
var SQLiteUpdateBase = class extends QueryPromise {
  static {
    __name(this, "SQLiteUpdateBase");
  }
  constructor(table3, set, session, dialect, withList) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { set, table: table3, withList, joins: [] };
  }
  static [entityKind] = "SQLiteUpdate";
  /** @internal */
  config;
  from(source) {
    this.config.from = source;
    return this;
  }
  createJoin(joinType) {
    return (table3, on2) => {
      const tableName = getTableLikeName(table3);
      if (typeof tableName === "string" && this.config.joins.some((join) => join.alias === tableName)) {
        throw new Error(`Alias "${tableName}" is already used in this query`);
      }
      if (typeof on2 === "function") {
        const from = this.config.from ? is(table3, SQLiteTable) ? table3[Table.Symbol.Columns] : is(table3, Subquery) ? table3._.selectedFields : is(table3, SQLiteViewBase) ? table3[ViewBaseConfig].selectedFields : void 0 : void 0;
        on2 = on2(
          new Proxy(
            this.config.table[Table.Symbol.Columns],
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          ),
          from && new Proxy(
            from,
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      this.config.joins.push({ on: on2, table: table3, joinType, alias: tableName });
      return this;
    };
  }
  leftJoin = this.createJoin("left");
  rightJoin = this.createJoin("right");
  innerJoin = this.createJoin("inner");
  fullJoin = this.createJoin("full");
  /**
   * Adds a 'where' clause to the query.
   *
   * Calling this method will update only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param where the 'where' clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be updated.
   *
   * ```ts
   * // Update all cars with green color
   * db.update(cars).set({ color: 'red' })
   *   .where(eq(cars.color, 'green'));
   * // or
   * db.update(cars).set({ color: 'red' })
   *   .where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Update all BMW cars with a green color
   * db.update(cars).set({ color: 'red' })
   *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Update all cars with the green or blue color
   * db.update(cars).set({ color: 'red' })
   *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    this.config.where = where;
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](
        new Proxy(
          this.config.table[Table.Symbol.Columns],
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
      this.config.orderBy = orderByArray;
    } else {
      const orderByArray = columns;
      this.config.orderBy = orderByArray;
    }
    return this;
  }
  limit(limit) {
    this.config.limit = limit;
    return this;
  }
  returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildUpdateQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      true,
      void 0,
      {
        type: "insert",
        tables: extractUsedTable(this.config.table)
      }
    );
  }
  prepare() {
    return this._prepare(false);
  }
  run = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().run(placeholderValues);
  }, "run");
  all = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().all(placeholderValues);
  }, "all");
  get = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().get(placeholderValues);
  }, "get");
  values = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().values(placeholderValues);
  }, "values");
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
};

// ../node_modules/drizzle-orm/sqlite-core/query-builders/count.js
var SQLiteCountBuilder = class _SQLiteCountBuilder extends SQL {
  static {
    __name(this, "SQLiteCountBuilder");
  }
  constructor(params) {
    super(_SQLiteCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
    this.params = params;
    this.session = params.session;
    this.sql = _SQLiteCountBuilder.buildCount(
      params.source,
      params.filters
    );
  }
  sql;
  static [entityKind] = "SQLiteCountBuilderAsync";
  [Symbol.toStringTag] = "SQLiteCountBuilderAsync";
  session;
  static buildEmbeddedCount(source, filters) {
    return sql`(select count(*) from ${source}${sql.raw(" where ").if(filters)}${filters})`;
  }
  static buildCount(source, filters) {
    return sql`select count(*) from ${source}${sql.raw(" where ").if(filters)}${filters}`;
  }
  then(onfulfilled, onrejected) {
    return Promise.resolve(this.session.count(this.sql)).then(
      onfulfilled,
      onrejected
    );
  }
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally?.();
        return value;
      },
      (reason) => {
        onFinally?.();
        throw reason;
      }
    );
  }
};

// ../node_modules/drizzle-orm/sqlite-core/query-builders/query.js
var RelationalQueryBuilder = class {
  static {
    __name(this, "RelationalQueryBuilder");
  }
  constructor(mode, fullSchema, schema, tableNamesMap, table3, tableConfig, dialect, session) {
    this.mode = mode;
    this.fullSchema = fullSchema;
    this.schema = schema;
    this.tableNamesMap = tableNamesMap;
    this.table = table3;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
  }
  static [entityKind] = "SQLiteAsyncRelationalQueryBuilder";
  findMany(config2) {
    return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config2 ? config2 : {},
      "many"
    ) : new SQLiteRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config2 ? config2 : {},
      "many"
    );
  }
  findFirst(config2) {
    return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config2 ? { ...config2, limit: 1 } : { limit: 1 },
      "first"
    ) : new SQLiteRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config2 ? { ...config2, limit: 1 } : { limit: 1 },
      "first"
    );
  }
};
var SQLiteRelationalQuery = class extends QueryPromise {
  static {
    __name(this, "SQLiteRelationalQuery");
  }
  constructor(fullSchema, schema, tableNamesMap, table3, tableConfig, dialect, session, config2, mode) {
    super();
    this.fullSchema = fullSchema;
    this.schema = schema;
    this.tableNamesMap = tableNamesMap;
    this.table = table3;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
    this.config = config2;
    this.mode = mode;
  }
  static [entityKind] = "SQLiteAsyncRelationalQuery";
  /** @internal */
  mode;
  /** @internal */
  getSQL() {
    return this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    }).sql;
  }
  /** @internal */
  _prepare(isOneTimeQuery = false) {
    const { query, builtQuery } = this._toSQL();
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      builtQuery,
      void 0,
      this.mode === "first" ? "get" : "all",
      true,
      (rawRows, mapColumnValue) => {
        const rows = rawRows.map(
          (row) => mapRelationalRow(this.schema, this.tableConfig, row, query.selection, mapColumnValue)
        );
        if (this.mode === "first") {
          return rows[0];
        }
        return rows;
      }
    );
  }
  prepare() {
    return this._prepare(false);
  }
  _toSQL() {
    const query = this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    });
    const builtQuery = this.dialect.sqlToQuery(query.sql);
    return { query, builtQuery };
  }
  toSQL() {
    return this._toSQL().builtQuery;
  }
  /** @internal */
  executeRaw() {
    if (this.mode === "first") {
      return this._prepare(false).get();
    }
    return this._prepare(false).all();
  }
  async execute() {
    return this.executeRaw();
  }
};
var SQLiteSyncRelationalQuery = class extends SQLiteRelationalQuery {
  static {
    __name(this, "SQLiteSyncRelationalQuery");
  }
  static [entityKind] = "SQLiteSyncRelationalQuery";
  sync() {
    return this.executeRaw();
  }
};

// ../node_modules/drizzle-orm/sqlite-core/query-builders/raw.js
var SQLiteRaw = class extends QueryPromise {
  static {
    __name(this, "SQLiteRaw");
  }
  constructor(execute, getSQL, action, dialect, mapBatchResult) {
    super();
    this.execute = execute;
    this.getSQL = getSQL;
    this.dialect = dialect;
    this.mapBatchResult = mapBatchResult;
    this.config = { action };
  }
  static [entityKind] = "SQLiteRaw";
  /** @internal */
  config;
  getQuery() {
    return { ...this.dialect.sqlToQuery(this.getSQL()), method: this.config.action };
  }
  mapResult(result, isFromBatch) {
    return isFromBatch ? this.mapBatchResult(result) : result;
  }
  _prepare() {
    return this;
  }
  /** @internal */
  isResponseInArrayMode() {
    return false;
  }
};

// ../node_modules/drizzle-orm/sqlite-core/db.js
var BaseSQLiteDatabase = class {
  static {
    __name(this, "BaseSQLiteDatabase");
  }
  constructor(resultKind, dialect, session, schema) {
    this.resultKind = resultKind;
    this.dialect = dialect;
    this.session = session;
    this._ = schema ? {
      schema: schema.schema,
      fullSchema: schema.fullSchema,
      tableNamesMap: schema.tableNamesMap
    } : {
      schema: void 0,
      fullSchema: {},
      tableNamesMap: {}
    };
    this.query = {};
    const query = this.query;
    if (this._.schema) {
      for (const [tableName, columns] of Object.entries(this._.schema)) {
        query[tableName] = new RelationalQueryBuilder(
          resultKind,
          schema.fullSchema,
          this._.schema,
          this._.tableNamesMap,
          schema.fullSchema[tableName],
          columns,
          dialect,
          session
        );
      }
    }
    this.$cache = { invalidate: /* @__PURE__ */ __name(async (_params) => {
    }, "invalidate") };
  }
  static [entityKind] = "BaseSQLiteDatabase";
  query;
  /**
   * Creates a subquery that defines a temporary named result set as a CTE.
   *
   * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param alias The alias for the subquery.
   *
   * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
   *
   * @example
   *
   * ```ts
   * // Create a subquery with alias 'sq' and use it in the select query
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * const result = await db.with(sq).select().from(sq);
   * ```
   *
   * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
   *
   * ```ts
   * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
   * const sq = db.$with('sq').as(db.select({
   *   name: sql<string>`upper(${users.name})`.as('name'),
   * })
   * .from(users));
   *
   * const result = await db.with(sq).select({ name: sq.name }).from(sq);
   * ```
   */
  $with = /* @__PURE__ */ __name((alias, selection) => {
    const self = this;
    const as = /* @__PURE__ */ __name((qb) => {
      if (typeof qb === "function") {
        qb = qb(new QueryBuilder(self.dialect));
      }
      return new Proxy(
        new WithSubquery(
          qb.getSQL(),
          selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
          alias,
          true
        ),
        new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
      );
    }, "as");
    return { as };
  }, "$with");
  $count(source, filters) {
    return new SQLiteCountBuilder({ source, filters, session: this.session });
  }
  /**
   * Incorporates a previously defined CTE (using `$with`) into the main query.
   *
   * This method allows the main query to reference a temporary named result set.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param queries The CTEs to incorporate into the main query.
   *
   * @example
   *
   * ```ts
   * // Define a subquery 'sq' as a CTE using $with
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * // Incorporate the CTE 'sq' into the main query and select from it
   * const result = await db.with(sq).select().from(sq);
   * ```
   */
  with(...queries) {
    const self = this;
    function select(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries
      });
    }
    __name(select, "select");
    function selectDistinct(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries,
        distinct: true
      });
    }
    __name(selectDistinct, "selectDistinct");
    function update(table3) {
      return new SQLiteUpdateBuilder(table3, self.session, self.dialect, queries);
    }
    __name(update, "update");
    function insert(into) {
      return new SQLiteInsertBuilder(into, self.session, self.dialect, queries);
    }
    __name(insert, "insert");
    function delete_(from) {
      return new SQLiteDeleteBase(from, self.session, self.dialect, queries);
    }
    __name(delete_, "delete_");
    return { select, selectDistinct, update, insert, delete: delete_ };
  }
  select(fields) {
    return new SQLiteSelectBuilder({ fields: fields ?? void 0, session: this.session, dialect: this.dialect });
  }
  selectDistinct(fields) {
    return new SQLiteSelectBuilder({
      fields: fields ?? void 0,
      session: this.session,
      dialect: this.dialect,
      distinct: true
    });
  }
  /**
   * Creates an update query.
   *
   * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
   *
   * Use `.set()` method to specify which values to update.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param table The table to update.
   *
   * @example
   *
   * ```ts
   * // Update all rows in the 'cars' table
   * await db.update(cars).set({ color: 'red' });
   *
   * // Update rows with filters and conditions
   * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
   *
   * // Update with returning clause
   * const updatedCar: Car[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  update(table3) {
    return new SQLiteUpdateBuilder(table3, this.session, this.dialect);
  }
  $cache;
  /**
   * Creates an insert query.
   *
   * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert}
   *
   * @param table The table to insert into.
   *
   * @example
   *
   * ```ts
   * // Insert one row
   * await db.insert(cars).values({ brand: 'BMW' });
   *
   * // Insert multiple rows
   * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
   *
   * // Insert with returning clause
   * const insertedCar: Car[] = await db.insert(cars)
   *   .values({ brand: 'BMW' })
   *   .returning();
   * ```
   */
  insert(into) {
    return new SQLiteInsertBuilder(into, this.session, this.dialect);
  }
  /**
   * Creates a delete query.
   *
   * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param table The table to delete from.
   *
   * @example
   *
   * ```ts
   * // Delete all rows in the 'cars' table
   * await db.delete(cars);
   *
   * // Delete rows with filters and conditions
   * await db.delete(cars).where(eq(cars.color, 'green'));
   *
   * // Delete with returning clause
   * const deletedCar: Car[] = await db.delete(cars)
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  delete(from) {
    return new SQLiteDeleteBase(from, this.session, this.dialect);
  }
  run(query) {
    const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.run(sequel),
        () => sequel,
        "run",
        this.dialect,
        this.session.extractRawRunValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.run(sequel);
  }
  all(query) {
    const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.all(sequel),
        () => sequel,
        "all",
        this.dialect,
        this.session.extractRawAllValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.all(sequel);
  }
  get(query) {
    const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.get(sequel),
        () => sequel,
        "get",
        this.dialect,
        this.session.extractRawGetValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.get(sequel);
  }
  values(query) {
    const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.values(sequel),
        () => sequel,
        "values",
        this.dialect,
        this.session.extractRawValuesValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.values(sequel);
  }
  transaction(transaction, config2) {
    return this.session.transaction(transaction, config2);
  }
};

// ../node_modules/drizzle-orm/cache/core/cache.js
var Cache = class {
  static {
    __name(this, "Cache");
  }
  static [entityKind] = "Cache";
};
var NoopCache = class extends Cache {
  static {
    __name(this, "NoopCache");
  }
  strategy() {
    return "all";
  }
  static [entityKind] = "NoopCache";
  async get(_key) {
    return void 0;
  }
  async put(_hashedQuery, _response, _tables, _config) {
  }
  async onMutate(_params) {
  }
};
async function hashQuery(sql2, params) {
  const dataToHash = `${sql2}-${JSON.stringify(params)}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(dataToHash);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = [...new Uint8Array(hashBuffer)];
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
__name(hashQuery, "hashQuery");

// ../node_modules/drizzle-orm/sqlite-core/session.js
var ExecuteResultSync = class extends QueryPromise {
  static {
    __name(this, "ExecuteResultSync");
  }
  constructor(resultCb) {
    super();
    this.resultCb = resultCb;
  }
  static [entityKind] = "ExecuteResultSync";
  async execute() {
    return this.resultCb();
  }
  sync() {
    return this.resultCb();
  }
};
var SQLitePreparedQuery = class {
  static {
    __name(this, "SQLitePreparedQuery");
  }
  constructor(mode, executeMethod, query, cache, queryMetadata, cacheConfig) {
    this.mode = mode;
    this.executeMethod = executeMethod;
    this.query = query;
    this.cache = cache;
    this.queryMetadata = queryMetadata;
    this.cacheConfig = cacheConfig;
    if (cache && cache.strategy() === "all" && cacheConfig === void 0) {
      this.cacheConfig = { enable: true, autoInvalidate: true };
    }
    if (!this.cacheConfig?.enable) {
      this.cacheConfig = void 0;
    }
  }
  static [entityKind] = "PreparedQuery";
  /** @internal */
  joinsNotNullableMap;
  /** @internal */
  async queryWithCache(queryString, params, query) {
    if (this.cache === void 0 || is(this.cache, NoopCache) || this.queryMetadata === void 0) {
      try {
        return await query();
      } catch (e) {
        throw new DrizzleQueryError(queryString, params, e);
      }
    }
    if (this.cacheConfig && !this.cacheConfig.enable) {
      try {
        return await query();
      } catch (e) {
        throw new DrizzleQueryError(queryString, params, e);
      }
    }
    if ((this.queryMetadata.type === "insert" || this.queryMetadata.type === "update" || this.queryMetadata.type === "delete") && this.queryMetadata.tables.length > 0) {
      try {
        const [res] = await Promise.all([
          query(),
          this.cache.onMutate({ tables: this.queryMetadata.tables })
        ]);
        return res;
      } catch (e) {
        throw new DrizzleQueryError(queryString, params, e);
      }
    }
    if (!this.cacheConfig) {
      try {
        return await query();
      } catch (e) {
        throw new DrizzleQueryError(queryString, params, e);
      }
    }
    if (this.queryMetadata.type === "select") {
      const fromCache = await this.cache.get(
        this.cacheConfig.tag ?? await hashQuery(queryString, params),
        this.queryMetadata.tables,
        this.cacheConfig.tag !== void 0,
        this.cacheConfig.autoInvalidate
      );
      if (fromCache === void 0) {
        let result;
        try {
          result = await query();
        } catch (e) {
          throw new DrizzleQueryError(queryString, params, e);
        }
        await this.cache.put(
          this.cacheConfig.tag ?? await hashQuery(queryString, params),
          result,
          // make sure we send tables that were used in a query only if user wants to invalidate it on each write
          this.cacheConfig.autoInvalidate ? this.queryMetadata.tables : [],
          this.cacheConfig.tag !== void 0,
          this.cacheConfig.config
        );
        return result;
      }
      return fromCache;
    }
    try {
      return await query();
    } catch (e) {
      throw new DrizzleQueryError(queryString, params, e);
    }
  }
  getQuery() {
    return this.query;
  }
  mapRunResult(result, _isFromBatch) {
    return result;
  }
  mapAllResult(_result, _isFromBatch) {
    throw new Error("Not implemented");
  }
  mapGetResult(_result, _isFromBatch) {
    throw new Error("Not implemented");
  }
  execute(placeholderValues) {
    if (this.mode === "async") {
      return this[this.executeMethod](placeholderValues);
    }
    return new ExecuteResultSync(() => this[this.executeMethod](placeholderValues));
  }
  mapResult(response, isFromBatch) {
    switch (this.executeMethod) {
      case "run": {
        return this.mapRunResult(response, isFromBatch);
      }
      case "all": {
        return this.mapAllResult(response, isFromBatch);
      }
      case "get": {
        return this.mapGetResult(response, isFromBatch);
      }
    }
  }
};
var SQLiteSession = class {
  static {
    __name(this, "SQLiteSession");
  }
  constructor(dialect) {
    this.dialect = dialect;
  }
  static [entityKind] = "SQLiteSession";
  prepareOneTimeQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
    return this.prepareQuery(
      query,
      fields,
      executeMethod,
      isResponseInArrayMode,
      customResultMapper,
      queryMetadata,
      cacheConfig
    );
  }
  run(query) {
    const staticQuery = this.dialect.sqlToQuery(query);
    try {
      return this.prepareOneTimeQuery(staticQuery, void 0, "run", false).run();
    } catch (err) {
      throw new DrizzleError({ cause: err, message: `Failed to run the query '${staticQuery.sql}'` });
    }
  }
  /** @internal */
  extractRawRunValueFromBatchResult(result) {
    return result;
  }
  all(query) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).all();
  }
  /** @internal */
  extractRawAllValueFromBatchResult(_result) {
    throw new Error("Not implemented");
  }
  get(query) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).get();
  }
  /** @internal */
  extractRawGetValueFromBatchResult(_result) {
    throw new Error("Not implemented");
  }
  values(query) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).values();
  }
  async count(sql2) {
    const result = await this.values(sql2);
    return result[0][0];
  }
  /** @internal */
  extractRawValuesValueFromBatchResult(_result) {
    throw new Error("Not implemented");
  }
};
var SQLiteTransaction = class extends BaseSQLiteDatabase {
  static {
    __name(this, "SQLiteTransaction");
  }
  constructor(resultType, dialect, session, schema, nestedIndex = 0) {
    super(resultType, dialect, session, schema);
    this.schema = schema;
    this.nestedIndex = nestedIndex;
  }
  static [entityKind] = "SQLiteTransaction";
  rollback() {
    throw new TransactionRollbackError();
  }
};

// ../node_modules/drizzle-orm/d1/session.js
var SQLiteD1Session = class extends SQLiteSession {
  static {
    __name(this, "SQLiteD1Session");
  }
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.options = options;
    this.logger = options.logger ?? new NoopLogger();
    this.cache = options.cache ?? new NoopCache();
  }
  static [entityKind] = "SQLiteD1Session";
  logger;
  cache;
  prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
    const stmt = this.client.prepare(query.sql);
    return new D1PreparedQuery(
      stmt,
      query,
      this.logger,
      this.cache,
      queryMetadata,
      cacheConfig,
      fields,
      executeMethod,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  async batch(queries) {
    const preparedQueries = [];
    const builtQueries = [];
    for (const query of queries) {
      const preparedQuery = query._prepare();
      const builtQuery = preparedQuery.getQuery();
      preparedQueries.push(preparedQuery);
      if (builtQuery.params.length > 0) {
        builtQueries.push(preparedQuery.stmt.bind(...builtQuery.params));
      } else {
        const builtQuery2 = preparedQuery.getQuery();
        builtQueries.push(
          this.client.prepare(builtQuery2.sql).bind(...builtQuery2.params)
        );
      }
    }
    const batchResults = await this.client.batch(builtQueries);
    return batchResults.map((result, i) => preparedQueries[i].mapResult(result, true));
  }
  extractRawAllValueFromBatchResult(result) {
    return result.results;
  }
  extractRawGetValueFromBatchResult(result) {
    return result.results[0];
  }
  extractRawValuesValueFromBatchResult(result) {
    return d1ToRawMapping(result.results);
  }
  async transaction(transaction, config2) {
    const tx = new D1Transaction("async", this.dialect, this, this.schema);
    await this.run(sql.raw(`begin${config2?.behavior ? " " + config2.behavior : ""}`));
    try {
      const result = await transaction(tx);
      await this.run(sql`commit`);
      return result;
    } catch (err) {
      await this.run(sql`rollback`);
      throw err;
    }
  }
};
var D1Transaction = class _D1Transaction extends SQLiteTransaction {
  static {
    __name(this, "D1Transaction");
  }
  static [entityKind] = "D1Transaction";
  async transaction(transaction) {
    const savepointName = `sp${this.nestedIndex}`;
    const tx = new _D1Transaction("async", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    await this.session.run(sql.raw(`savepoint ${savepointName}`));
    try {
      const result = await transaction(tx);
      await this.session.run(sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err) {
      await this.session.run(sql.raw(`rollback to savepoint ${savepointName}`));
      throw err;
    }
  }
};
function d1ToRawMapping(results) {
  const rows = [];
  for (const row of results) {
    const entry = Object.keys(row).map((k) => row[k]);
    rows.push(entry);
  }
  return rows;
}
__name(d1ToRawMapping, "d1ToRawMapping");
var D1PreparedQuery = class extends SQLitePreparedQuery {
  static {
    __name(this, "D1PreparedQuery");
  }
  constructor(stmt, query, logger, cache, queryMetadata, cacheConfig, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
    super("async", executeMethod, query, cache, queryMetadata, cacheConfig);
    this.logger = logger;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
    this.fields = fields;
    this.stmt = stmt;
  }
  static [entityKind] = "D1PreparedQuery";
  /** @internal */
  customResultMapper;
  /** @internal */
  fields;
  /** @internal */
  stmt;
  async run(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return await this.queryWithCache(this.query.sql, params, async () => {
      return this.stmt.bind(...params).run();
    });
  }
  async all(placeholderValues) {
    const { fields, query, logger, stmt, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const params = fillPlaceholders(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      return await this.queryWithCache(query.sql, params, async () => {
        return stmt.bind(...params).all().then(({ results }) => this.mapAllResult(results));
      });
    }
    const rows = await this.values(placeholderValues);
    return this.mapAllResult(rows);
  }
  mapAllResult(rows, isFromBatch) {
    if (isFromBatch) {
      rows = d1ToRawMapping(rows.results);
    }
    if (!this.fields && !this.customResultMapper) {
      return rows;
    }
    if (this.customResultMapper) {
      return this.customResultMapper(rows);
    }
    return rows.map((row) => mapResultRow(this.fields, row, this.joinsNotNullableMap));
  }
  async get(placeholderValues) {
    const { fields, joinsNotNullableMap, query, logger, stmt, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const params = fillPlaceholders(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      return await this.queryWithCache(query.sql, params, async () => {
        return stmt.bind(...params).all().then(({ results }) => results[0]);
      });
    }
    const rows = await this.values(placeholderValues);
    if (!rows[0]) {
      return void 0;
    }
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return mapResultRow(fields, rows[0], joinsNotNullableMap);
  }
  mapGetResult(result, isFromBatch) {
    if (isFromBatch) {
      result = d1ToRawMapping(result.results)[0];
    }
    if (!this.fields && !this.customResultMapper) {
      return result;
    }
    if (this.customResultMapper) {
      return this.customResultMapper([result]);
    }
    return mapResultRow(this.fields, result, this.joinsNotNullableMap);
  }
  async values(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return await this.queryWithCache(this.query.sql, params, async () => {
      return this.stmt.bind(...params).raw();
    });
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
};

// ../node_modules/drizzle-orm/d1/driver.js
var DrizzleD1Database = class extends BaseSQLiteDatabase {
  static {
    __name(this, "DrizzleD1Database");
  }
  static [entityKind] = "D1Database";
  async batch(batch) {
    return this.session.batch(batch);
  }
};
function drizzle(client, config2 = {}) {
  const dialect = new SQLiteAsyncDialect({ casing: config2.casing });
  let logger;
  if (config2.logger === true) {
    logger = new DefaultLogger();
  } else if (config2.logger !== false) {
    logger = config2.logger;
  }
  let schema;
  if (config2.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      config2.schema,
      createTableRelationsHelpers
    );
    schema = {
      fullSchema: config2.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session = new SQLiteD1Session(client, dialect, schema, { logger, cache: config2.cache });
  const db = new DrizzleD1Database("async", dialect, session, schema);
  db.$client = client;
  db.$cache = config2.cache;
  if (db.$cache) {
    db.$cache["invalidate"] = config2.cache?.onMutate;
  }
  return db;
}
__name(drizzle, "drizzle");

// db/vocab-schema.ts
var vocab_schema_exports = {};
__export(vocab_schema_exports, {
  form: () => form,
  formRelations: () => formRelations,
  grammar: () => grammar,
  grammarRelations: () => grammarRelations,
  voc: () => voc,
  vocRelations: () => vocRelations
});
var voc = sqliteTable("VOC", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vokId: text("vok_id").notNull().unique(),
  latin: text("latin"),
  desc: text("desc"),
  // German description
  html: text("html"),
  // Formatted HTML description
  key: text("key").notNull(),
  grammar: text("grammar"),
  // Grammar type (e.g., "Verb, a-Konj.")
  typnr: integer("typnr")
  // Type number for categorization
}, (table3) => ({
  idx1: index("idx1").on(table3.key),
  idx2: index("idx2").on(table3.vokId),
  idx5: index("idx5").on(table3.typnr)
}));
var grammar = sqliteTable("GRAMMAR", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vokId: text("vok_id").notNull(),
  nr: text("nr"),
  // Form number
  form: text("form")
  // The actual form text
}, (table3) => ({
  idx3: index("idx3").on(table3.vokId)
}));
var form = sqliteTable("FORM", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vokId: text("vok_id").notNull(),
  form: text("form").notNull(),
  // The actual form (e.g., "Achilles")
  bestimmung: text("bestimmung")
  // Description (e.g., "Nom. Sg.")
}, (table3) => ({
  idx4: index("idx4").on(table3.form)
}));
var vocRelations = relations(voc, ({ many }) => ({
  grammarForms: many(grammar),
  forms: many(form)
}));
var grammarRelations = relations(grammar, ({ one }) => ({
  vocabulary: one(voc, {
    fields: [grammar.vokId],
    references: [voc.vokId]
  })
}));
var formRelations = relations(form, ({ one }) => ({
  vocabulary: one(voc, {
    fields: [form.vokId],
    references: [voc.vokId]
  })
}));

// db/vocab-client.ts
var getVocabDb = /* @__PURE__ */ __name((env2) => {
  return drizzle(env2.vocab, { schema: vocab_schema_exports });
}, "getVocabDb");

// api/vocab/[vokId]/form/[form]/index.ts
var onRequest = /* @__PURE__ */ __name(async (context2) => {
  console.log("\u{1F50D} [Form Detail API] Starting request for vokId:", context2.params.vokId, "form:", context2.params.form);
  console.log("\u{1F50D} [Form Detail API] Environment keys:", Object.keys(context2.env || {}));
  console.log("\u{1F50D} [Form Detail API] Vocab binding available:", !!context2.env?.vocab);
  if (!context2.env?.vocab) {
    console.error("\u274C [Form Detail API] D1 vocab database not available");
    return new Response(JSON.stringify({
      error: "Database not configured",
      message: "D1 vocab database binding not found"
    }), {
      status: 503,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
  const db = getVocabDb(context2.env);
  const { vokId, form: formParam } = context2.params;
  if (!vokId || typeof vokId !== "string" || !formParam || typeof formParam !== "string") {
    return new Response(JSON.stringify({ error: "Invalid parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
  try {
    const formRecord = await db.select().from(form).where(and(
      eq(form.vokId, vokId),
      eq(form.form, decodeURIComponent(formParam))
    )).limit(1);
    if (formRecord.length > 0) {
      return new Response(JSON.stringify({
        success: true,
        data: formRecord[0]
      }), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }
    const similarForms = await db.select().from(form).where(eq(form.vokId, vokId)).limit(10);
    return new Response(JSON.stringify({
      success: false,
      message: "Form not found",
      similarForms
    }), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error3) {
    console.error("Error fetching form:", error3);
    return new Response(JSON.stringify(
      { error: "Internal server error" }
    ), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
}, "onRequest");

// db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  authors: () => authors,
  authorsRelations: () => authorsRelations,
  comments: () => comments,
  commentsRelations: () => commentsRelations,
  latinTexts: () => latinTexts,
  latinTextsRelations: () => latinTextsRelations,
  lexicon: () => lexicon,
  posts: () => posts,
  postsRelations: () => postsRelations,
  userCommentingActivity: () => userCommentingActivity,
  userCommentingActivityRelations: () => userCommentingActivityRelations,
  userReadingProgress: () => userReadingProgress,
  userReadingProgressRelations: () => userReadingProgressRelations,
  users: () => users,
  usersRelations: () => usersRelations,
  vocabulary: () => vocabulary,
  works: () => works,
  worksRelations: () => worksRelations
});
var authors = sqliteTable("authors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  latinName: text("latin_name"),
  title: text("title"),
  years: text("years"),
  birthYear: integer("birth_year"),
  deathYear: integer("death_year"),
  description: text("description"),
  heroImage: text("hero_image"),
  theme: text("theme"),
  color: text("color"),
  highlights: text("highlights", { mode: "json" })
  // JSON array of highlights
});
var works = sqliteTable("works", {
  id: text("id").primaryKey(),
  // e.g., 'de-bello-gallico'
  title: text("title").notNull(),
  authorId: text("author_id").references(() => authors.id),
  description: text("description"),
  type: text("type"),
  // e.g., 'war_commentary', 'speech'
  date: text("date"),
  coverImage: text("cover_image"),
  content: text("content", { mode: "json" })
  // Structured content if needed, or link to text table
});
var posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  authorId: text("author_id").references(() => authors.id),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  historicalDate: text("historical_date"),
  historicalYear: integer("historical_year"),
  date: text("date"),
  // Publication date YYYY-MM-DD
  readingTime: integer("reading_time"),
  tags: text("tags", { mode: "json" }),
  coverImage: text("cover_image"),
  content: text("content", { mode: "json" }).notNull(),
  // { diary: "...", scientific: "..." }
  translations: text("translations", { mode: "json" })
  // { en: { ... }, la: { ... } }
});
var users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  preferences: text("preferences", { mode: "json" }),
  // User preferences
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: text("updated_at").notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  lastLoginAt: text("last_login_at"),
  isActive: integer("is_active", { mode: "boolean" }).default(true)
});
var lexicon = sqliteTable("lexicon", {
  slug: text("slug").primaryKey(),
  term: text("term").notNull(),
  variants: text("variants"),
  // Store as raw text, parse manually to handle malformed data
  definition: text("definition").notNull(),
  category: text("category"),
  etymology: text("etymology"),
  relatedTerms: text("related_terms"),
  // Store as raw text, parse manually
  translations: text("translations")
  // Store as raw text, parse manually
});
var vocabulary = sqliteTable("vocabulary", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  latin: text("latin").notNull(),
  german: text("german").notNull(),
  english: text("english"),
  type: text("type"),
  // noun, verb, adjective, etc.
  gender: text("gender"),
  // m, f, n
  conjugation: text("conjugation"),
  // a-konj, e-konj, etc.
  declination: text("declination"),
  // a-dekl, o-dekl, etc.
  forms: text("forms", { mode: "json" }),
  // { genitive: "...", perfect: "..." }
  exampleSentence: text("example_sentence"),
  exampleTranslation: text("example_translation"),
  tags: text("tags", { mode: "json" })
  // e.g. ["Grundwortschatz", "Krieg"]
});
var latinTexts = sqliteTable("latin_texts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workId: text("work_id").references(() => works.id),
  book: integer("book"),
  chapter: integer("chapter"),
  section: integer("section"),
  verse: integer("verse"),
  latinText: text("latin_text").notNull(),
  germanTranslation: text("german_translation"),
  englishTranslation: text("english_translation"),
  annotations: text("annotations", { mode: "json" })
  // Grammar explanations etc.
});
var comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull().references(() => posts.id),
  userId: text("user_id").references(() => users.id),
  parentId: text("parent_id").references(() => comments.id),
  // For threaded comments
  content: text("content").notNull(),
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: text("updated_at").notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  isEdited: integer("is_edited", { mode: "boolean" }).default(false),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  likesCount: integer("likes_count").default(0)
});
var userCommentingActivity = sqliteTable("user_commenting_activity", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  commentId: text("comment_id").notNull().references(() => comments.id),
  action: text("action").notNull(),
  // 'created', 'edited', 'deleted', 'liked'
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  metadata: text("metadata", { mode: "json" })
  // Additional data like previous content
});
var userReadingProgress = sqliteTable("user_reading_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  postId: text("post_id").notNull().references(() => posts.id),
  startedAt: text("started_at").notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  completedAt: text("completed_at"),
  readingTimeSeconds: integer("reading_time_seconds").default(0),
  progressPercentage: integer("progress_percentage").default(0),
  lastPosition: integer("last_position").default(0),
  isCompleted: integer("is_completed", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: text("updated_at").notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var worksRelations = relations(works, ({ one, many }) => ({
  author: one(authors, {
    fields: [works.authorId],
    references: [authors.id]
  }),
  posts: many(posts),
  latinTexts: many(latinTexts)
}));
var authorsRelations = relations(authors, ({ many }) => ({
  works: many(works),
  posts: many(posts)
}));
var postsRelations = relations(posts, ({ one, many }) => ({
  author: one(authors, {
    fields: [posts.authorId],
    references: [authors.id]
  }),
  comments: many(comments),
  readingProgress: many(userReadingProgress)
}));
var usersRelations = relations(users, ({ many }) => ({
  comments: many(comments),
  commentingActivities: many(userCommentingActivity),
  readingProgress: many(userReadingProgress)
}));
var commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id]
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id]
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: "commentReplies"
  }),
  replies: many(comments, {
    relationName: "commentReplies"
  }),
  activities: many(userCommentingActivity)
}));
var userCommentingActivityRelations = relations(userCommentingActivity, ({ one }) => ({
  user: one(users, {
    fields: [userCommentingActivity.userId],
    references: [users.id]
  }),
  comment: one(comments, {
    fields: [userCommentingActivity.commentId],
    references: [comments.id]
  })
}));
var latinTextsRelations = relations(latinTexts, ({ one }) => ({
  work: one(works, {
    fields: [latinTexts.workId],
    references: [works.id]
  })
}));
var userReadingProgressRelations = relations(userReadingProgress, ({ one }) => ({
  user: one(users, {
    fields: [userReadingProgress.userId],
    references: [users.id]
  }),
  post: one(posts, {
    fields: [userReadingProgress.postId],
    references: [posts.id]
  })
}));

// db/client.ts
var getDb = /* @__PURE__ */ __name((env2) => {
  return drizzle(env2.DB, { schema: schema_exports });
}, "getDb");

// api/posts/[author]/[slug].ts
var onRequest2 = /* @__PURE__ */ __name(async (context2) => {
  const corsHeaders3 = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (context2.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders3 });
  }
  const startTime = Date.now();
  try {
    if (!context2.env?.DB) {
      console.error("\u274C [Posts Author/Slug API] D1 database not available");
      return new Response(JSON.stringify({
        error: "Database not configured",
        message: "D1 database binding not found"
      }), {
        status: 503,
        headers: corsHeaders3
      });
    }
    const db = getDb(context2.env);
    const url = new URL(context2.request.url);
    const method = context2.request.method;
    const author = context2.params.author;
    const slug = context2.params.slug;
    console.log(`\u{1F537} [Posts Author/Slug API] ${method} request: /api/posts/${author}/${slug}`);
    if (method === "GET") {
      try {
        const result = await db.query.posts.findFirst({
          where: eq(posts.slug, slug)
        });
        const queryTime = Date.now() - startTime;
        if (!result) {
          console.warn(`\u26A0\uFE0F [Posts Author/Slug API] Post not found: ${author}/${slug}`);
          return new Response(JSON.stringify({ error: "Not Found" }), {
            status: 404,
            headers: corsHeaders3
          });
        }
        if (result.authorId !== author && result.author_id !== author) {
          console.warn(`\u26A0\uFE0F [Posts Author/Slug API] Author mismatch: expected ${author}, got ${result.authorId || result.author_id}`);
          return new Response(JSON.stringify({ error: "Not Found" }), {
            status: 404,
            headers: corsHeaders3
          });
        }
        const normalizedResult = normalizePostResult(result);
        console.log(`\u2705 [Posts Author/Slug API] GET found post "${normalizedResult.title}" (${queryTime}ms)`);
        return new Response(JSON.stringify(normalizedResult), {
          headers: {
            ...corsHeaders3,
            "Cache-Control": "public, max-age=3600",
            "X-Data-Source": "cloudflare-d1"
          }
        });
      } catch (err) {
        console.error("\u274C [Posts Author/Slug API] GET failed:", err.message);
        return new Response(JSON.stringify({
          error: "Server error",
          message: err.message
        }), {
          status: 500,
          headers: corsHeaders3
        });
      }
    }
    if (method === "PUT") {
      try {
        const body = await context2.request.json();
        const existing = await db.query.posts.findFirst({
          where: eq(posts.slug, slug)
        });
        if (!existing) {
          return new Response(JSON.stringify({
            error: "Post not found",
            slug
          }), {
            status: 404,
            headers: corsHeaders3
          });
        }
        if (existing.authorId !== author && existing.author_id !== author) {
          return new Response(JSON.stringify({
            error: "Author mismatch",
            expected: author,
            actual: existing.authorId || existing.author_id
          }), {
            status: 403,
            headers: corsHeaders3
          });
        }
        const updateData = {
          id: existing.id,
          slug,
          authorId: author,
          title: body.title || existing.title,
          excerpt: body.excerpt || existing.excerpt,
          historicalDate: body.historicalDate || existing.historicalDate,
          historicalYear: body.historicalYear !== void 0 ? body.historicalYear : existing.historicalYear,
          date: body.date || existing.date,
          readingTime: body.readingTime || existing.readingTime,
          tags: Array.isArray(body.tags) ? body.tags : existing.tags || [],
          coverImage: body.coverImage || existing.coverImage,
          content: body.content || existing.content,
          translations: body.translations || existing.translations,
          diaryTitle: body.diaryTitle || existing.diaryTitle,
          scientificTitle: body.scientificTitle || existing.scientificTitle,
          sidebar: body.sidebar || existing.sidebar
        };
        await db.update(posts).set(updateData).where(eq(posts.slug, slug));
        const queryTime = Date.now() - startTime;
        console.log(`\u2705 [Posts Author/Slug API] PUT updated post "${updateData.title}" (${queryTime}ms)`);
        return new Response(JSON.stringify({
          success: true,
          message: "Post updated",
          post: normalizePostResult(updateData)
        }), {
          status: 200,
          headers: corsHeaders3
        });
      } catch (err) {
        console.error("\u274C [Posts Author/Slug API] PUT failed:", err.message);
        return new Response(JSON.stringify({
          error: "Failed to update post",
          message: err.message
        }), {
          status: 400,
          headers: corsHeaders3
        });
      }
    }
    if (method === "DELETE") {
      try {
        const existing = await db.query.posts.findFirst({
          where: eq(posts.slug, slug)
        });
        if (!existing) {
          return new Response(JSON.stringify({
            error: "Post not found",
            slug
          }), {
            status: 404,
            headers: corsHeaders3
          });
        }
        if (existing.authorId !== author && existing.author_id !== author) {
          return new Response(JSON.stringify({
            error: "Author mismatch"
          }), {
            status: 403,
            headers: corsHeaders3
          });
        }
        await db.delete(posts).where(eq(posts.slug, slug));
        const queryTime = Date.now() - startTime;
        console.log(`\u2705 [Posts Author/Slug API] DELETE removed post "${slug}" (${queryTime}ms)`);
        return new Response(JSON.stringify({
          success: true,
          message: "Post deleted",
          slug
        }), {
          headers: corsHeaders3
        });
      } catch (err) {
        console.error("\u274C [Posts Author/Slug API] DELETE failed:", err.message);
        return new Response(JSON.stringify({
          error: "Failed to delete post",
          message: err.message
        }), {
          status: 400,
          headers: corsHeaders3
        });
      }
    }
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: corsHeaders3
    });
  } catch (err) {
    const queryTime = Date.now() - startTime;
    console.error(`\u274C [Posts Author/Slug API] Error (${queryTime}ms):`, err.message);
    return new Response(JSON.stringify({
      error: "Server error",
      message: err.message
    }), {
      status: 500,
      headers: corsHeaders3
    });
  }
}, "onRequest");
function normalizePostResult(post) {
  return {
    ...post,
    author: post.authorId ?? post.author_id,
    authorId: post.authorId ?? post.author_id,
    author_id: post.authorId ?? post.author_id,
    content: typeof post.content === "string" ? JSON.parse(post.content) : post.content,
    tags: typeof post.tags === "string" ? JSON.parse(post.tags) : post.tags,
    translations: typeof post.translations === "string" ? JSON.parse(post.translations) : post.translations
  };
}
__name(normalizePostResult, "normalizePostResult");

// api/auth/login.ts
function generateToken(userId) {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = { userId, exp: Math.floor(Date.now() / 1e3) + 24 * 60 * 60 };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}`;
}
__name(generateToken, "generateToken");
var onRequestPost = /* @__PURE__ */ __name(async (context2) => {
  const { request, env: env2 } = context2;
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const db = getDb(env2);
    const userRecords = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
    if (userRecords.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const user = userRecords[0];
    await db.update(users).set({ lastLoginAt: (/* @__PURE__ */ new Date()).toISOString() }).where(eq(users.id, user.id));
    const token = generateToken(user.id);
    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl
        },
        token
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error3) {
    console.error("Login error:", error3);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}, "onRequestPost");

// api/auth/register.ts
function generateToken2(userId) {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = { userId, exp: Math.floor(Date.now() / 1e3) + 24 * 60 * 60 };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}`;
}
__name(generateToken2, "generateToken");
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hashPassword, "hashPassword");
var onRequestPost2 = /* @__PURE__ */ __name(async (context2) => {
  const { request, env: env2 } = context2;
  try {
    const { email, username, password, displayName } = await request.json();
    if (!email || !username || !password) {
      return new Response(
        JSON.stringify({ error: "Email, username, and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 6 characters long" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const db = getDb(env2);
    const existingUserRecords = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
    if (existingUserRecords.length > 0) {
      return new Response(
        JSON.stringify({ error: "User with this email already exists" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }
    const userId = "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    const hashedPassword = await hashPassword(password);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newUser = {
      id: userId,
      email: email.toLowerCase().trim(),
      username: username.trim(),
      passwordHash: hashedPassword,
      displayName: displayName?.trim() || username.trim(),
      createdAt: now,
      updatedAt: now,
      isActive: true
    };
    await db.insert(users).values(newUser);
    const token = generateToken2(userId);
    return new Response(
      JSON.stringify({
        message: "Registration successful",
        user: {
          id: userId,
          email: newUser.email,
          username: newUser.username,
          displayName: newUser.displayName
        },
        token
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error3) {
    console.error("Register error:", error3);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}, "onRequestPost");

// api/dashboard/stats.ts
function verifyToken(token) {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    return decoded.userId;
  } catch {
    return null;
  }
}
__name(verifyToken, "verifyToken");
var onRequestGet = /* @__PURE__ */ __name(async (context2) => {
  const { request, env: env2 } = context2;
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Authentication required" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  const token = authHeader.substring(7);
  const userId = verifyToken(token);
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Invalid token" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const db = getDb(env2);
    const commentCountResult = await db.select({ count: count3() }).from(comments).where(and(
      eq(comments.userId, userId),
      eq(comments.isDeleted, false)
    ));
    const recentCommentsResult = await db.select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      postTitle: comments.postId
      // We'll need to join with posts for actual titles
    }).from(comments).where(and(
      eq(comments.userId, userId),
      eq(comments.isDeleted, false)
    )).orderBy(desc(comments.createdAt)).limit(5);
    const userResult = await db.select({
      id: users.id,
      email: users.email,
      username: users.username,
      displayName: users.displayName,
      createdAt: users.createdAt,
      lastLoginAt: users.lastLoginAt
    }).from(users).where(eq(users.id, userId)).limit(1);
    const user = userResult[0];
    const daysActive = user ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1e3 * 60 * 60 * 24)) : 0;
    const stats = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      },
      commentStats: {
        totalComments: commentCountResult[0]?.count || 0
      },
      readingStats: {
        postsRead: 0,
        // Simplified - we don't track this anymore
        totalReadingTime: 0
        // Simplified - we don't track this anymore
      },
      activityStats: {
        daysActive
      },
      recentComments: recentCommentsResult.map((comment) => ({
        ...comment,
        postTitle: `Beitrag ${comment.id.substring(0, 8)}`
        // Simplified title
      }))
    };
    return new Response(
      JSON.stringify(stats),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error3) {
    console.error("Dashboard stats error:", error3);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}, "onRequestGet");

// api/vocab/all/index.ts
var onRequest3 = /* @__PURE__ */ __name(async (context2) => {
  console.log("\u{1F50D} [Vocab All API] Starting request for ALL vocabulary with forms");
  console.log("\u{1F50D} [Vocab All API] Environment keys:", Object.keys(context2.env));
  console.log("\u{1F50D} [Vocab All API] Vocab binding available:", !!context2.env?.vocab);
  if (!context2.env?.vocab) {
    console.error("\u274C [Vocab All API] D1 vocab database not available");
    return new Response(JSON.stringify({
      error: "Database not configured",
      message: "D1 vocab database binding not found"
    }), {
      status: 503,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
  const db = getVocabDb(context2.env);
  const url = new URL(context2.request.url);
  const limit = parseInt(url.searchParams.get("limit") || "100");
  const offset = parseInt(url.searchParams.get("offset") || "0");
  const includeForms = url.searchParams.get("includeForms") !== "false";
  try {
    const vocabEntries = await db.query.voc.findMany({
      limit,
      offset,
      orderBy: [voc.id]
    });
    let enrichedEntries = vocabEntries;
    if (includeForms) {
      enrichedEntries = await Promise.all(vocabEntries.map(async (entry) => {
        try {
          const grammarForms = await db.select().from(grammar).where(eq(grammar.vokId, entry.vokId)).all();
          const formDescriptions = await db.select().from(form).where(eq(form.vokId, entry.vokId)).all();
          const formDescriptionMap = /* @__PURE__ */ new Map();
          for (const formDesc of formDescriptions) {
            if (formDesc.form) {
              const normalizedForm = formDesc.form.toLowerCase().trim();
              if (!formDescriptionMap.has(normalizedForm)) {
                formDescriptionMap.set(normalizedForm, []);
              }
              if (formDesc.bestimmung) {
                const descriptions = formDescriptionMap.get(normalizedForm);
                descriptions.push(formDesc.bestimmung);
              }
            }
          }
          const findBestDescription = /* @__PURE__ */ __name((grammarForm) => {
            const normalizedGrammarForm = grammarForm.toLowerCase().trim();
            if (formDescriptionMap.has(normalizedGrammarForm)) {
              const descriptions = formDescriptionMap.get(normalizedGrammarForm);
              return descriptions.join(", ");
            }
            for (const [formKey, descriptions] of formDescriptionMap.entries()) {
              if (normalizedGrammarForm === formKey) {
                return descriptions.join(", ");
              }
              if (Math.abs(normalizedGrammarForm.length - formKey.length) <= 2 && (normalizedGrammarForm.includes(formKey) || formKey.includes(normalizedGrammarForm))) {
                return descriptions.join(", ");
              }
            }
            return null;
          }, "findBestDescription");
          const enrichedGrammarForms = grammarForms.map((gf) => {
            let bestimmung = null;
            if (gf.form) {
              bestimmung = findBestDescription(gf.form);
            }
            return {
              id: gf.id,
              vokId: gf.vokId,
              nr: gf.nr,
              form: gf.form,
              bestimmung
            };
          });
          const allFormEntries = formDescriptions.map((fd) => ({
            id: fd.id,
            vokId: fd.vokId,
            nr: null,
            form: fd.form,
            bestimmung: fd.bestimmung
          }));
          const combinedForms = [...enrichedGrammarForms, ...allFormEntries];
          const uniqueForms = combinedForms.filter(
            (form2, index2, self) => index2 === self.findIndex((f) => f.form === form2.form)
          );
          const allForms = uniqueForms.sort((a, b) => {
            if (!a.form) return 1;
            if (!b.form) return -1;
            return a.form.localeCompare(b.form);
          });
          return {
            ...entry,
            forms: allForms,
            grammarForms: enrichedGrammarForms
          };
        } catch (error3) {
          console.error(`Error processing entry ${entry.vokId}:`, error3);
          return {
            ...entry,
            forms: [],
            grammarForms: []
          };
        }
      }));
    }
    const totalCount = await db.select().from(voc).all();
    return new Response(JSON.stringify({
      results: enrichedEntries,
      count: enrichedEntries.length,
      total: totalCount.length,
      limit,
      offset,
      includeForms
    }), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (e) {
    console.error("Vocab All API Error:", e);
    return new Response(JSON.stringify({
      error: "Internal Error",
      message: e.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
}, "onRequest");

// api/vocab/[vokId].ts
var onRequest4 = /* @__PURE__ */ __name(async (context2) => {
  console.log("\u{1F50D} [Vocab Detail API] Starting request for vokId:", context2.params.vokId);
  console.log("\u{1F50D} [Vocab Detail API] Environment keys:", Object.keys(context2.env || {}));
  console.log("\u{1F50D} [Vocab Detail API] Vocab binding available:", !!context2.env?.vocab);
  if (!context2.env?.vocab) {
    console.error("\u274C [Vocab Detail API] D1 vocab database not available");
    return new Response(JSON.stringify({
      error: "Database not configured",
      message: "D1 vocab database binding not found"
    }), {
      status: 503,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
  const db = getVocabDb(context2.env);
  const { vokId } = context2.params;
  if (!vokId || typeof vokId !== "string") {
    return new Response(JSON.stringify({ error: "Invalid vocabulary ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
  try {
    let actualVokId;
    const entryByVokId = await db.query.voc.findFirst({
      where: eq(voc.vokId, vokId)
    });
    if (entryByVokId) {
      actualVokId = entryByVokId.vokId;
    } else {
      const entryById = await db.query.voc.findFirst({
        where: eq(voc.id, parseInt(vokId))
      });
      if (!entryById) {
        return new Response(JSON.stringify({ error: "Vocabulary not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json; charset=utf-8" }
        });
      }
      actualVokId = entryById.vokId;
    }
    const entry = entryByVokId || await db.query.voc.findFirst({
      where: eq(voc.vokId, actualVokId)
    });
    if (!entry) {
      return new Response(JSON.stringify({ error: "Vocabulary not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }
    const grammarForms = await db.select().from(grammar).where(eq(grammar.vokId, actualVokId)).all();
    const formDescriptions = await db.select().from(form).where(eq(form.vokId, actualVokId)).all();
    const formDescriptionMap = /* @__PURE__ */ new Map();
    for (const formDesc of formDescriptions) {
      if (formDesc.form) {
        const normalizedForm = formDesc.form.toLowerCase().trim();
        if (!formDescriptionMap.has(normalizedForm)) {
          formDescriptionMap.set(normalizedForm, []);
        }
        if (formDesc.bestimmung) {
          const descriptions = formDescriptionMap.get(normalizedForm);
          descriptions.push(formDesc.bestimmung);
        }
      }
    }
    const findBestDescription = /* @__PURE__ */ __name((grammarForm) => {
      const normalizedGrammarForm = grammarForm.toLowerCase().trim();
      if (formDescriptionMap.has(normalizedGrammarForm)) {
        const descriptions = formDescriptionMap.get(normalizedGrammarForm);
        return descriptions.join(", ");
      }
      for (const [formKey, descriptions] of formDescriptionMap.entries()) {
        if (normalizedGrammarForm === formKey) {
          return descriptions.join(", ");
        }
        if (Math.abs(normalizedGrammarForm.length - formKey.length) <= 2 && (normalizedGrammarForm.includes(formKey) || formKey.includes(normalizedGrammarForm))) {
          return descriptions.join(", ");
        }
      }
      return null;
    }, "findBestDescription");
    const enrichedGrammarForms = grammarForms.map((gf) => {
      let bestimmung = null;
      if (gf.form) {
        bestimmung = findBestDescription(gf.form);
      }
      return {
        id: gf.id,
        vokId: gf.vokId,
        nr: gf.nr,
        form: gf.form,
        bestimmung
      };
    });
    const allFormEntries = formDescriptions.map((fd) => ({
      id: fd.id,
      vokId: fd.vokId,
      nr: null,
      form: fd.form,
      bestimmung: fd.bestimmung
    }));
    const combinedForms = [...enrichedGrammarForms, ...allFormEntries];
    const uniqueForms = combinedForms.filter(
      (form2, index2, self) => index2 === self.findIndex((f) => f.form === form2.form)
    );
    const allForms = uniqueForms.sort((a, b) => {
      if (!a.form) return 1;
      if (!b.form) return -1;
      return a.form.localeCompare(b.form);
    });
    const response = {
      ...entry,
      forms: allForms,
      grammarForms: enrichedGrammarForms
    };
    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (e) {
    console.error("Vocab Detail API Error:", e);
    return new Response(JSON.stringify({
      error: "Internal Error",
      message: e.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
}, "onRequest");

// api/health.ts
var onRequestGet2 = /* @__PURE__ */ __name(async (context2) => {
  try {
    return new Response(JSON.stringify({
      status: "success",
      message: "Cloudflare Pages Functions working",
      environment: {
        hasDB: !!context2.env?.DB,
        hasVocab: !!context2.env?.vocab,
        envKeys: Object.keys(context2.env || {})
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error3) {
    console.error("Health check error:", error3);
    return new Response(JSON.stringify({
      status: "error",
      message: "Health check failed",
      error: error3 instanceof Error ? error3.message : "Unknown error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestGet");

// api/reading-progress.ts
var onRequestGet3 = /* @__PURE__ */ __name(async (context2) => {
  const { request, env: env2 } = context2;
  const userId = request.headers.get("X-User-ID");
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "User ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const db = getDb(env2);
    const progressRecords = await db.select({
      postId: userReadingProgress.postId,
      readingTimeSeconds: userReadingProgress.readingTimeSeconds,
      progressPercentage: userReadingProgress.progressPercentage,
      lastReadAt: userReadingProgress.updatedAt,
      createdAt: userReadingProgress.createdAt,
      updatedAt: userReadingProgress.updatedAt
    }).from(userReadingProgress).where(eq(userReadingProgress.userId, userId)).orderBy(desc(userReadingProgress.updatedAt));
    return new Response(
      JSON.stringify({
        readingProgress: progressRecords,
        totalReadingTime: progressRecords.reduce((sum, record) => sum + record.readingTimeSeconds, 0),
        totalPostsRead: progressRecords.length,
        averageReadingTime: progressRecords.length > 0 ? progressRecords.reduce((sum, record) => sum + record.readingTimeSeconds, 0) / progressRecords.length : 0
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error3) {
    console.error("Get reading progress error:", error3);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}, "onRequestGet");
var onRequestPost3 = /* @__PURE__ */ __name(async (context2) => {
  const { request, env: env2 } = context2;
  const userId = request.headers.get("X-User-ID");
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "User ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const { postId, readingTimeSeconds, progressPercentage } = await request.json();
    if (!postId || readingTimeSeconds === void 0 || progressPercentage === void 0) {
      return new Response(
        JSON.stringify({ error: "Post ID, reading time, and progress percentage are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const db = getDb(env2);
    const existingProgress = await db.select().from(userReadingProgress).where(and(
      eq(userReadingProgress.userId, userId),
      eq(userReadingProgress.postId, postId)
    )).limit(1);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (existingProgress) {
      await db.update(userReadingProgress).set({
        readingTimeSeconds: existingProgress.readingTimeSeconds + readingTimeSeconds,
        progressPercentage: Math.min(100, existingProgress.progressPercentage + (progressPercentage || 0)),
        updatedAt: now
      }).where(and(
        eq(userReadingProgress.userId, userId),
        eq(userReadingProgress.postId, postId)
      ));
    } else {
      await db.insert(userReadingProgress).values({
        id: `progress_${userId}_${postId}_${Date.now()}`,
        userId,
        postId,
        readingTimeSeconds: readingTimeSeconds || 0,
        progressPercentage: progressPercentage || 0,
        createdAt: now,
        updatedAt: now
      });
    }
    return new Response(
      JSON.stringify({
        message: "Reading progress tracked successfully",
        readingTimeSeconds: readingTimeSeconds || 0,
        progressPercentage: progressPercentage || 0
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error3) {
    console.error("Reading progress error:", error3);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}, "onRequestPost");

// api/about.ts
var onRequest5 = /* @__PURE__ */ __name(async (context2) => {
  const url = new URL(context2.request.url);
  const assetUrl = new URL("/api/about.json", url.origin);
  try {
    const response = await context2.env.ASSETS.fetch(new Request(assetUrl.toString()));
    if (!response.ok) {
      return new Response(JSON.stringify({
        error: "API Error",
        message: `Static file not found at ${assetUrl.pathname}`,
        status: response.status
      }), {
        status: 500,
        headers: { "content-type": "application/json" }
      });
    }
    return new Response(response.body, {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: "Internal Error", message: errorMessage }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
}, "onRequest");

// api/ask.ts
var onRequest6 = /* @__PURE__ */ __name(async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Accept"
      }
    });
  }
  if (!["GET", "POST"].includes(request.method)) {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" }
    });
  }
  const url = new URL(request.url);
  const target = new URL("https://caesar.schaechner.workers.dev/");
  let body = null;
  if (request.method === "POST") {
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }
  }
  ["persona", "ask", "history", "sitemap"].forEach((key) => {
    const v = url.searchParams.get(key) ?? body?.[key];
    if (v != null) target.searchParams.set(key, typeof v === "string" ? v : JSON.stringify(v));
  });
  try {
    const upstream = await fetch(target.toString(), {
      method: "GET",
      headers: { "accept": "application/json" }
    });
    const body2 = await upstream.text();
    return new Response(body2, {
      status: upstream.status,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upstream request failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}, "onRequest");

// api/authors.ts
var onRequest7 = /* @__PURE__ */ __name(async (context2) => {
  const corsHeaders3 = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (context2.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders3 });
  }
  const startTime = Date.now();
  try {
    if (!context2.env?.DB) {
      console.error("\u274C [Authors API] D1 database not available");
      return new Response(JSON.stringify({
        error: "Database not configured",
        message: "D1 database binding not found"
      }), {
        status: 503,
        headers: corsHeaders3
      });
    }
    const db = getDb(context2.env);
    const url = new URL(context2.request.url);
    const method = context2.request.method;
    console.log(`\u{1F537} [Authors API] ${method} request: ${url.pathname}${url.search}`);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const idFromPath = pathSegments[pathSegments.length - 1] !== "authors" ? pathSegments[pathSegments.length - 1] : null;
    const id = idFromPath || url.searchParams.get("id");
    if (method === "GET") {
      if (id) {
        const result = await db.query.authors.findFirst({
          where: eq(authors.id, id)
        });
        const queryTime2 = Date.now() - startTime;
        if (!result) {
          console.warn(`\u26A0\uFE0F [Authors API] Author not found: ${id}`);
          return new Response(JSON.stringify({ error: "Not Found" }), {
            status: 404,
            headers: corsHeaders3
          });
        }
        const normalizedResult = normalizeAuthorResult(result);
        console.log(`\u2705 [Authors API] GET found author "${normalizedResult.name}" (${queryTime2}ms)`);
        return new Response(JSON.stringify(normalizedResult), {
          headers: {
            ...corsHeaders3,
            "Cache-Control": "public, max-age=3600",
            "X-Data-Source": "cloudflare-d1"
          }
        });
      }
      const results = await db.query.authors.findMany();
      const queryTime = Date.now() - startTime;
      console.log(`\u2705 [Authors API] GET fetched ${results.length} authors (${queryTime}ms)`);
      const normalized = results.map(normalizeAuthorResult);
      return new Response(JSON.stringify(normalized), {
        headers: {
          ...corsHeaders3,
          "Cache-Control": "public, max-age=3600",
          "X-Data-Source": "cloudflare-d1",
          "X-Author-Count": results.length.toString()
        }
      });
    }
    if (method === "POST") {
      try {
        const body = await context2.request.json();
        if (!body.id || !body.name) {
          return new Response(JSON.stringify({
            error: "Missing required fields",
            required: ["id", "name"]
          }), {
            status: 400,
            headers: corsHeaders3
          });
        }
        const existing = await db.query.authors.findFirst({
          where: eq(authors.id, body.id)
        });
        if (existing) {
          return new Response(JSON.stringify({
            error: "Author already exists",
            id: body.id
          }), {
            status: 409,
            headers: corsHeaders3
          });
        }
        const newAuthor = {
          id: body.id,
          name: body.name,
          latinName: body.latinName || "",
          title: body.title || "",
          years: body.years || "",
          birthYear: body.birthYear || null,
          deathYear: body.deathYear || null,
          description: body.description || "",
          heroImage: body.heroImage || "",
          theme: body.theme || "",
          color: body.color || "",
          highlights: body.highlights || []
        };
        await db.insert(authors).values(newAuthor);
        const queryTime = Date.now() - startTime;
        console.log(`\u2705 [Authors API] POST created author "${newAuthor.name}" (${queryTime}ms)`);
        return new Response(JSON.stringify({
          success: true,
          message: "Author created",
          author: normalizeAuthorResult(newAuthor)
        }), {
          status: 201,
          headers: corsHeaders3
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("\u274C [Authors API] POST failed:", errorMessage);
        return new Response(JSON.stringify({
          error: "Failed to create author",
          message: errorMessage
        }), {
          status: 400,
          headers: corsHeaders3
        });
      }
    }
    if (method === "PUT") {
      try {
        if (!id) {
          return new Response(JSON.stringify({
            error: "ID required for update"
          }), {
            status: 400,
            headers: corsHeaders3
          });
        }
        const body = await context2.request.json();
        const existing = await db.query.authors.findFirst({
          where: eq(authors.id, id)
        });
        if (!existing) {
          return new Response(JSON.stringify({
            error: "Author not found",
            id
          }), {
            status: 404,
            headers: corsHeaders3
          });
        }
        const updatedData = {
          name: body.name ?? existing.name,
          latinName: body.latinName ?? existing.latinName,
          title: body.title ?? existing.title,
          years: body.years ?? existing.years,
          birthYear: body.birthYear ?? existing.birthYear,
          deathYear: body.deathYear ?? existing.deathYear,
          description: body.description ?? existing.description,
          heroImage: body.heroImage ?? existing.heroImage,
          theme: body.theme ?? existing.theme,
          color: body.color ?? existing.color,
          highlights: body.highlights ?? existing.highlights
        };
        await db.update(authors).set(updatedData).where(eq(authors.id, id));
        const queryTime = Date.now() - startTime;
        console.log(`\u2705 [Authors API] PUT updated author "${id}" (${queryTime}ms)`);
        return new Response(JSON.stringify({
          success: true,
          message: "Author updated",
          id
        }), {
          headers: corsHeaders3
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("\u274C [Authors API] PUT failed:", errorMessage);
        return new Response(JSON.stringify({
          error: "Failed to update author",
          message: errorMessage
        }), {
          status: 400,
          headers: corsHeaders3
        });
      }
    }
    if (method === "DELETE") {
      try {
        if (!id) {
          return new Response(JSON.stringify({
            error: "ID required for deletion"
          }), {
            status: 400,
            headers: corsHeaders3
          });
        }
        const existing = await db.query.authors.findFirst({
          where: eq(authors.id, id)
        });
        if (!existing) {
          return new Response(JSON.stringify({
            error: "Author not found",
            id
          }), {
            status: 404,
            headers: corsHeaders3
          });
        }
        await db.delete(authors).where(eq(authors.id, id));
        const queryTime = Date.now() - startTime;
        console.log(`\u2705 [Authors API] DELETE removed author "${id}" (${queryTime}ms)`);
        return new Response(JSON.stringify({
          success: true,
          message: "Author deleted",
          id
        }), {
          headers: corsHeaders3
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("\u274C [Authors API] DELETE failed:", errorMessage);
        return new Response(JSON.stringify({
          error: "Failed to delete author",
          message: errorMessage
        }), {
          status: 400,
          headers: corsHeaders3
        });
      }
    }
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: corsHeaders3
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    const queryTime = Date.now() - startTime;
    console.error(`\u274C [Authors API] Error (${queryTime}ms):`, errorMessage);
    return new Response(JSON.stringify({
      error: "Server error",
      message: errorMessage
    }), {
      status: 500,
      headers: corsHeaders3
    });
  }
}, "onRequest");
function normalizeAuthorResult(author) {
  return {
    ...author,
    highlights: typeof author.highlights === "string" ? JSON.parse(author.highlights) : author.highlights || []
  };
}
__name(normalizeAuthorResult, "normalizeAuthorResult");

// api/catalog.ts
var onRequest8 = /* @__PURE__ */ __name(async (context2) => {
  const url = new URL(context2.request.url);
  const assetUrl = new URL("/api/catalog.json", url.origin);
  try {
    const response = await context2.env.ASSETS.fetch(new Request(assetUrl.toString(), {
      headers: {
        "Accept": "application/json"
      }
    }));
    if (!response.ok) {
      return new Response(JSON.stringify({
        error: "API Error",
        message: `Static file not found at ${assetUrl.pathname}`,
        status: response.status,
        origin: url.origin
      }), {
        status: 500,
        headers: { "content-type": "application/json" }
      });
    }
    return new Response(response.body, {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal Error", message: err.message }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
}, "onRequest");

// api/comments.ts
function generateCommentId() {
  return "comment_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}
__name(generateCommentId, "generateCommentId");
function verifyToken2(token) {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    return decoded.userId;
  } catch {
    return null;
  }
}
__name(verifyToken2, "verifyToken");
var corsHeaders = {
  "Access-Control-Allow-Origin": "https://4ae78071.meum-diarium.pages.dev",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
  // 24 hours
  "Content-Type": "application/json"
};
var onRequest9 = /* @__PURE__ */ __name(async (context2) => {
  const { request, env: env2 } = context2;
  const method = request.method;
  const url = new URL(request.url);
  const postId = url.searchParams.get("postId");
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }
  if (method === "GET") {
    if (!postId) {
      return new Response(
        JSON.stringify({ error: "Post ID is required" }),
        { status: 400, headers: corsHeaders }
      );
    }
    try {
      const db = getDb(env2);
      const commentsData = await db.select({
        id: comments.id,
        postId: comments.postId,
        userId: comments.userId,
        parentId: comments.parentId,
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        isEdited: comments.isEdited,
        isDeleted: comments.isDeleted,
        likesCount: comments.likesCount,
        user: {
          displayName: users.displayName,
          username: users.username,
          avatarUrl: users.avatarUrl
        }
      }).from(comments).leftJoin(users, eq(comments.userId, users.id)).where(eq(comments.postId, postId) && eq(comments.isDeleted, false)).orderBy(desc(comments.createdAt));
      return new Response(
        JSON.stringify({ comments: commentsData }),
        {
          status: 200,
          headers: corsHeaders
        }
      );
    } catch (error3) {
      console.error("Get comments error:", error3);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: corsHeaders }
      );
    }
  }
  if (method === "POST") {
    try {
      const { postId: postId2, content, parentId, authorName, authorEmail } = await request.json();
      if (!postId2 || !content || content.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: "Post ID and content are required" }),
          { status: 400, headers: corsHeaders }
        );
      }
      if (content.length > 2e3) {
        return new Response(
          JSON.stringify({ error: "Comment too long (max 2000 characters)" }),
          { status: 400, headers: corsHeaders }
        );
      }
      const db = getDb(env2);
      let userId = null;
      const authHeader = request.headers.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        userId = verifyToken2(token);
      }
      if (!userId && (!authorName || !authorEmail)) {
        return new Response(
          JSON.stringify({
            error: "Name and email are required for guest comments",
            requiresAuth: false,
            needsGuestInfo: true
          }),
          { status: 400, headers: corsHeaders }
        );
      }
      const commentId = generateCommentId();
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const newComment = {
        id: commentId,
        postId: postId2,
        userId: userId || "guest_" + commentId,
        // Use special guest ID
        parentId: parentId || void 0,
        content: content.trim(),
        createdAt: now,
        updatedAt: now,
        isEdited: false,
        isDeleted: false,
        likesCount: 0
      };
      await db.insert(comments).values(newComment);
      if (userId) {
        const activityId = "activity_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
        await db.insert(userCommentingActivity).values({
          id: activityId,
          userId,
          commentId,
          action: "created",
          createdAt: now,
          metadata: JSON.stringify({
            postId: postId2,
            parentId: parentId || null,
            isGuest: false
          })
        });
      }
      let commentResponse = {
        ...newComment,
        user: userId ? null : {
          displayName: authorName,
          username: "guest",
          avatarUrl: null
        }
      };
      if (userId) {
        const userRecords = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (userRecords.length > 0) {
          const user = userRecords[0];
          commentResponse.user = {
            displayName: user.displayName,
            username: user.username,
            avatarUrl: user.avatarUrl
          };
        }
      }
      return new Response(
        JSON.stringify({
          message: "Comment created successfully",
          comment: commentResponse,
          isGuest: !userId
        }),
        {
          status: 201,
          headers: corsHeaders
        }
      );
    } catch (error3) {
      console.error("Create comment error:", error3);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: corsHeaders }
      );
    }
  }
  return new Response(
    JSON.stringify({ error: "Method not allowed" }),
    { status: 405, headers: corsHeaders }
  );
}, "onRequest");

// api/debug.ts
var onRequest10 = /* @__PURE__ */ __name(async (context2) => {
  const corsHeaders3 = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };
  try {
    const debug3 = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      environment: {
        hasDB: !!context2.env?.DB,
        envKeys: context2.env ? Object.keys(context2.env) : []
      },
      request: {
        url: context2.request.url,
        method: context2.request.method
      }
    };
    if (!context2.env?.DB) {
      debug3.error = "DB binding not found in context.env";
      debug3.hint = "Check wrangler.toml configuration and Pages environment settings";
      return new Response(JSON.stringify(debug3, null, 2), {
        status: 503,
        headers: corsHeaders3
      });
    }
    try {
      const db = context2.env.DB;
      const tablesResult = await db.prepare(`
                SELECT name FROM sqlite_master 
                WHERE type='table' 
                ORDER BY name
            `).all();
      debug3.database = {
        connected: true,
        tables: tablesResult.results?.map((r) => r.name) || []
      };
      const tables = ["authors", "posts", "lexicon", "works"];
      const counts = {};
      for (const table3 of tables) {
        try {
          const result = await db.prepare(`SELECT COUNT(*) as count FROM ${table3}`).first();
          counts[table3] = result?.count || 0;
        } catch (e) {
          counts[table3] = -1;
        }
      }
      debug3.database.rowCounts = counts;
    } catch (dbError) {
      debug3.database = {
        connected: false,
        error: dbError.message,
        stack: dbError.stack
      };
    }
    return new Response(JSON.stringify(debug3, null, 2), {
      headers: corsHeaders3
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: "Debug endpoint failed",
      message: err.message,
      stack: err.stack
    }, null, 2), {
      status: 500,
      headers: corsHeaders3
    });
  }
}, "onRequest");

// api/debug-bindings.ts
var onRequest11 = /* @__PURE__ */ __name(async (context2) => {
  const envKeys = Object.keys(context2.env || {});
  const bindings = {};
  for (const key of envKeys) {
    bindings[key] = {
      available: !!context2.env[key],
      type: typeof context2.env[key],
      hasPrepare: !!(context2.env[key] && typeof context2.env[key].prepare === "function")
    };
  }
  return new Response(JSON.stringify({
    message: "Debug D1 bindings",
    envKeys,
    bindings,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}, "onRequest");

// api/explain.ts
var onRequest12 = /* @__PURE__ */ __name(async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Accept"
      }
    });
  }
  if (!["GET", "POST"].includes(request.method)) {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" }
    });
  }
  const url = new URL(request.url);
  const target = new URL("https://caesar.schaechner.workers.dev/explain");
  let body = null;
  if (request.method === "POST") {
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }
  }
  ["term", "question", "history"].forEach((key) => {
    const v = url.searchParams.get(key) ?? body?.[key];
    if (v != null) target.searchParams.set(key, typeof v === "string" ? v : JSON.stringify(v));
  });
  try {
    const upstream = await fetch(target.toString(), {
      method: "GET",
      headers: { accept: "application/json" }
    });
    const body2 = await upstream.text();
    return new Response(body2, {
      status: upstream.status,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    const message = err?.message || "Upstream request failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}, "onRequest");

// api/latin-texts.ts
var onRequest13 = /* @__PURE__ */ __name(async (context2) => {
  const db = getDb(context2.env);
  const url = new URL(context2.request.url);
  const workId = url.searchParams.get("workId");
  const book = url.searchParams.get("book");
  const chapter = url.searchParams.get("chapter");
  if (!workId || !book) {
    return new Response(JSON.stringify({ error: "Missing workId or book parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const bookNum = parseInt(book);
    const chapterNum = chapter ? parseInt(chapter) : void 0;
    let whereClause;
    if (chapterNum !== void 0) {
      whereClause = and(
        eq(latinTexts.workId, workId),
        eq(latinTexts.book, bookNum),
        eq(latinTexts.chapter, chapterNum)
      );
    } else {
      whereClause = and(
        eq(latinTexts.workId, workId),
        eq(latinTexts.book, bookNum)
      );
    }
    const results = await db.query.latinTexts.findMany({
      where: whereClause,
      // Order by chapter, section, verse to ensure correct text flow
      orderBy: [asc(latinTexts.chapter), asc(latinTexts.section), asc(latinTexts.verse)]
    });
    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal Error", message: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequest");

// api/lexicon.ts
var onRequest14 = /* @__PURE__ */ __name(async (context2) => {
  const corsHeaders3 = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (context2.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders3 });
  }
  const parseJsonField = /* @__PURE__ */ __name((value) => {
    if (!value || typeof value !== "string") return null;
    try {
      return JSON.parse(value);
    } catch (e) {
      console.warn(`\u26A0\uFE0F [Lexicon API] Malformed JSON in field: ${value.substring(0, 50)}...`);
      return null;
    }
  }, "parseJsonField");
  const sanitizeEntry = /* @__PURE__ */ __name((entry) => {
    const sanitized = {};
    Object.entries(entry).forEach(([key, value]) => {
      if (typeof value === "string") {
        sanitized[key] = value.replace(/\x00/g, "").replace(/[\x01-\x08\x0B\x0C\x0E-\x1F]/g, "");
      } else {
        sanitized[key] = value;
      }
    });
    return sanitized;
  }, "sanitizeEntry");
  const startTime = Date.now();
  try {
    if (!context2.env?.DB) {
      console.error("\u274C [Lexicon API] D1 database not available");
      return new Response(JSON.stringify({
        error: "Database not configured",
        message: "D1 database binding not found"
      }), {
        status: 503,
        headers: corsHeaders3
      });
    }
    const db = getDb(context2.env);
    const url = new URL(context2.request.url);
    const method = context2.request.method;
    console.log(`\u{1F537} [Lexicon API] ${method} request: ${url.pathname}${url.search}`);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const slugFromPath = pathSegments[pathSegments.length - 1] !== "lexicon" ? pathSegments[pathSegments.length - 1] : null;
    const slugParam = slugFromPath || url.searchParams.get("slug");
    const search = url.searchParams.get("search");
    const limit = parseInt(url.searchParams.get("limit") || "100");
    if (method === "GET") {
      if (slugParam) {
        const result = await db.query.lexicon.findFirst({
          where: eq(lexicon.slug, slugParam)
        });
        const queryTime2 = Date.now() - startTime;
        if (!result) {
          console.warn(`\u26A0\uFE0F [Lexicon API] Entry not found: ${slugParam}`);
          return new Response(JSON.stringify({ error: "Not Found" }), {
            status: 404,
            headers: corsHeaders3
          });
        }
        console.log(`\u2705 [Lexicon API] GET found entry "${result.term}" (${queryTime2}ms)`);
        const parsedResult = {
          ...result,
          variants: parseJsonField(result.variants) || [],
          relatedTerms: parseJsonField(result.relatedTerms) || [],
          translations: parseJsonField(result.translations) || {}
        };
        const sanitizedResult = sanitizeEntry(parsedResult);
        return new Response(JSON.stringify(sanitizedResult), {
          headers: {
            ...corsHeaders3,
            "Cache-Control": "public, max-age=3600",
            "X-Data-Source": "cloudflare-d1"
          }
        });
      }
      let whereClause = void 0;
      if (search) {
        whereClause = or(
          like(lexicon.term, `%${search}%`),
          like(lexicon.definition, `%${search}%`)
        );
      }
      const results = await db.query.lexicon.findMany({
        where: whereClause,
        limit
      });
      const parsedResults = results.map((entry) => ({
        ...entry,
        variants: parseJsonField(entry.variants) || [],
        relatedTerms: parseJsonField(entry.relatedTerms) || [],
        translations: parseJsonField(entry.translations) || {}
      }));
      const queryTime = Date.now() - startTime;
      console.log(`\u2705 [Lexicon API] GET fetched ${results.length} entries (${queryTime}ms)`);
      const sanitizedResults = parsedResults.map(sanitizeEntry);
      let responseText;
      try {
        responseText = JSON.stringify(sanitizedResults, (_key, value) => {
          if (typeof value === "string") {
            return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
          }
          return value;
        });
      } catch (jsonErr) {
        console.error(`\u274C [Lexicon API] JSON serialization failed:`, jsonErr.message);
        responseText = JSON.stringify(sanitizedResults.slice(0, 10));
      }
      return new Response(responseText, {
        headers: {
          ...corsHeaders3,
          "Cache-Control": "public, max-age=3600",
          "X-Data-Source": "cloudflare-d1",
          "X-Entry-Count": results.length.toString()
        }
      });
    }
    if (method === "POST") {
      try {
        const body = await context2.request.json();
        if (!body.slug || !body.term || !body.definition) {
          return new Response(JSON.stringify({
            error: "Missing required fields",
            required: ["slug", "term", "definition"]
          }), {
            status: 400,
            headers: corsHeaders3
          });
        }
        const existing = await db.query.lexicon.findFirst({
          where: eq(lexicon.slug, body.slug)
        });
        if (existing) {
          return new Response(JSON.stringify({
            error: "Entry already exists",
            slug: body.slug
          }), {
            status: 409,
            headers: corsHeaders3
          });
        }
        const newEntry = {
          slug: body.slug,
          term: body.term,
          variants: body.variants || [],
          definition: body.definition,
          category: body.category || "",
          etymology: body.etymology || "",
          relatedTerms: body.relatedTerms || [],
          translations: body.translations || {}
        };
        await db.insert(lexicon).values(newEntry);
        const queryTime = Date.now() - startTime;
        console.log(`\u2705 [Lexicon API] POST created entry "${newEntry.term}" (${queryTime}ms)`);
        return new Response(JSON.stringify({
          success: true,
          message: "Entry created",
          entry: newEntry
        }), {
          status: 201,
          headers: corsHeaders3
        });
      } catch (err) {
        console.error("\u274C [Lexicon API] POST failed:", err.message);
        return new Response(JSON.stringify({
          error: "Failed to create entry",
          message: err.message
        }), {
          status: 400,
          headers: corsHeaders3
        });
      }
    }
    if (method === "PUT") {
      try {
        if (!slugParam) {
          return new Response(JSON.stringify({
            error: "Slug required for update"
          }), {
            status: 400,
            headers: corsHeaders3
          });
        }
        const body = await context2.request.json();
        const existing = await db.query.lexicon.findFirst({
          where: eq(lexicon.slug, slugParam)
        });
        if (!existing) {
          return new Response(JSON.stringify({
            error: "Entry not found",
            slug: slugParam
          }), {
            status: 404,
            headers: corsHeaders3
          });
        }
        const updatedData = {
          term: body.term ?? existing.term,
          variants: body.variants ?? existing.variants,
          definition: body.definition ?? existing.definition,
          category: body.category ?? existing.category,
          etymology: body.etymology ?? existing.etymology,
          relatedTerms: body.relatedTerms ?? existing.relatedTerms,
          translations: body.translations ?? existing.translations
        };
        await db.update(lexicon).set(updatedData).where(eq(lexicon.slug, slugParam));
        const queryTime = Date.now() - startTime;
        console.log(`\u2705 [Lexicon API] PUT updated entry "${slugParam}" (${queryTime}ms)`);
        return new Response(JSON.stringify({
          success: true,
          message: "Entry updated",
          slug: slugParam
        }), {
          headers: corsHeaders3
        });
      } catch (err) {
        console.error("\u274C [Lexicon API] PUT failed:", err.message);
        return new Response(JSON.stringify({
          error: "Failed to update entry",
          message: err.message
        }), {
          status: 400,
          headers: corsHeaders3
        });
      }
    }
    if (method === "DELETE") {
      try {
        if (!slugParam) {
          return new Response(JSON.stringify({
            error: "Slug required for deletion"
          }), {
            status: 400,
            headers: corsHeaders3
          });
        }
        const existing = await db.query.lexicon.findFirst({
          where: eq(lexicon.slug, slugParam)
        });
        if (!existing) {
          return new Response(JSON.stringify({
            error: "Entry not found",
            slug: slugParam
          }), {
            status: 404,
            headers: corsHeaders3
          });
        }
        await db.delete(lexicon).where(eq(lexicon.slug, slugParam));
        const queryTime = Date.now() - startTime;
        console.log(`\u2705 [Lexicon API] DELETE removed entry "${slugParam}" (${queryTime}ms)`);
        return new Response(JSON.stringify({
          success: true,
          message: "Entry deleted",
          slug: slugParam
        }), {
          headers: corsHeaders3
        });
      } catch (err) {
        console.error("\u274C [Lexicon API] DELETE failed:", err.message);
        return new Response(JSON.stringify({
          error: "Failed to delete entry",
          message: err.message
        }), {
          status: 400,
          headers: corsHeaders3
        });
      }
    }
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: corsHeaders3
    });
  } catch (err) {
    const queryTime = Date.now() - startTime;
    console.error(`\u274C [Lexicon API] Error (${queryTime}ms):`, err.message);
    return new Response(JSON.stringify({
      error: "Server error",
      message: err.message
    }), {
      status: 500,
      headers: corsHeaders3
    });
  }
}, "onRequest");

// api/pages.ts
var onRequest15 = /* @__PURE__ */ __name(async (context2) => {
  const url = new URL(context2.request.url);
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const corsHeaders3 = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (context2.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders3 });
  }
  if (context2.request.method === "GET" && pathSegments.length === 3 && pathSegments[0] === "api" && pathSegments[1] === "pages") {
    const slug = pathSegments[2];
    try {
      console.log(`\u{1F4C4} [Pages API] GET /api/pages/${slug} - serving from JSON files`);
      const slugToFileMap = {
        "caesar": "caesar.json",
        "cicero": "cicero.json",
        "augustus": "augustus.json",
        "catilina": "catilina.json",
        "seneca": "seneca.json",
        "about": "about.json",
        "author-about-caesar": "caesar.json",
        "author-about-cicero": "cicero.json",
        "author-about-augustus": "augustus.json",
        "author-about-catilina": "catilina.json",
        "author-about-seneca": "seneca.json"
      };
      const fileName = slugToFileMap[slug];
      if (!fileName) {
        console.log(`\u26A0\uFE0F [Pages API] Unknown slug: ${slug}`);
        return new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: corsHeaders3
        });
      }
      try {
        const assetUrl = new URL(`/api/pages/${fileName}`, url.origin);
        const staticResponse = await fetch(assetUrl.toString());
        if (staticResponse.ok) {
          const data = await staticResponse.json();
          console.log(`\u2705 [Pages API] Served page from static assets: ${slug}`);
          return new Response(JSON.stringify(data), {
            headers: {
              ...corsHeaders3,
              "Cache-Control": "public, max-age=3600",
              "X-Data-Source": "static-files"
            }
          });
        }
      } catch (staticError) {
        console.log(`\u26A0\uFE0F [Pages API] Static file not accessible: ${fileName}`);
      }
      console.log(`\u26A0\uFE0F [Pages API] Using fallback data for: ${slug}`);
      const fallbackData = {
        slug,
        heroTitle: slug.charAt(0).toUpperCase() + slug.slice(1),
        heroSubtitle: "Historische Pers\xF6nlichkeit",
        introText: `Informationen \xFCber ${slug.charAt(0).toUpperCase() + slug.slice(1)}`,
        sections: [],
        highlights: [],
        translations: {
          en: { heroTitle: slug.charAt(0).toUpperCase() + slug.slice(1) },
          la: { heroTitle: slug.charAt(0).toUpperCase() + slug.slice(1) }
        }
      };
      return new Response(JSON.stringify(fallbackData), {
        headers: {
          ...corsHeaders3,
          "Cache-Control": "public, max-age=300",
          "X-Data-Source": "fallback-data"
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error(`\u274C [Pages API] Error:`, errorMessage);
      return new Response(JSON.stringify({ error: "Internal Error", message: errorMessage }), {
        status: 500,
        headers: corsHeaders3
      });
    }
  }
  return new Response(JSON.stringify({
    error: "Not found",
    message: "Invalid API endpoint"
  }), {
    status: 404,
    headers: corsHeaders3
  });
}, "onRequest");

// api/posts.ts
var onRequest16 = /* @__PURE__ */ __name(async (context2) => {
  const corsHeaders3 = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (context2.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders3 });
  }
  const startTime = Date.now();
  try {
    if (!context2.env?.DB) {
      console.error("\u274C [Posts API] D1 database not available");
      return new Response(JSON.stringify({
        error: "Database not configured",
        message: "D1 database binding not found"
      }), {
        status: 503,
        headers: corsHeaders3
      });
    }
    const db = getDb(context2.env);
    const url = new URL(context2.request.url);
    const method = context2.request.method;
    console.log(`\u{1F537} [Posts API] ${method} request: ${url.pathname}${url.search}`);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const slugFromPath = pathSegments[pathSegments.length - 1] !== "posts" ? pathSegments[pathSegments.length - 1] : null;
    const slug = slugFromPath || url.searchParams.get("slug");
    const tag = url.searchParams.get("tag");
    if (method === "GET") {
      if (slug) {
        const result = await db.query.posts.findFirst({
          where: eq(posts.slug, slug)
        });
        const queryTime2 = Date.now() - startTime;
        if (!result) {
          console.warn(`\u26A0\uFE0F [Posts API] Post not found: ${slug}`);
          return new Response(JSON.stringify({ error: "Not Found" }), {
            status: 404,
            headers: corsHeaders3
          });
        }
        const normalizedResult = normalizePostResult2(result);
        console.log(`\u2705 [Posts API] GET found post "${normalizedResult.title}" (${queryTime2}ms)`);
        return new Response(JSON.stringify(normalizedResult), {
          headers: {
            ...corsHeaders3,
            "Cache-Control": "public, max-age=3600",
            "X-Data-Source": "cloudflare-d1"
          }
        });
      }
      const allPosts = await db.query.posts.findMany({
        orderBy: [desc(posts.date)]
      });
      let filtered = allPosts.map(normalizePostResult2);
      if (tag) {
        filtered = filtered.filter((post) => {
          const tags = post.tags;
          return Array.isArray(tags) && tags.includes(tag);
        });
      }
      const queryTime = Date.now() - startTime;
      console.log(`\u2705 [Posts API] GET fetched ${filtered.length} posts (${queryTime}ms)`);
      return new Response(JSON.stringify(filtered), {
        headers: {
          ...corsHeaders3,
          "Cache-Control": "public, max-age=3600",
          "X-Data-Source": "cloudflare-d1",
          "X-Post-Count": filtered.length.toString()
        }
      });
    }
    if (method === "POST") {
      try {
        const body = await context2.request.json();
        if (!body.slug || !body.title) {
          return new Response(JSON.stringify({
            error: "Missing required fields",
            required: ["slug", "title"]
          }), {
            status: 400,
            headers: corsHeaders3
          });
        }
        const existing = await db.query.posts.findFirst({
          where: eq(posts.slug, body.slug)
        });
        if (existing) {
          return new Response(JSON.stringify({
            error: "Post already exists",
            slug: body.slug
          }), {
            status: 409,
            headers: corsHeaders3
          });
        }
        const newPost = {
          id: body.id || `post-${Date.now()}`,
          slug: body.slug,
          authorId: body.authorId || body.author,
          title: body.title,
          excerpt: body.excerpt || "",
          historicalDate: body.historicalDate || "",
          historicalYear: body.historicalYear || null,
          date: body.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          readingTime: body.readingTime || 5,
          tags: Array.isArray(body.tags) ? body.tags : [],
          coverImage: body.coverImage || "",
          content: body.content || { diary: "", scientific: "" },
          translations: body.translations || { en: {}, la: {} }
        };
        await db.insert(posts).values(newPost);
        const queryTime = Date.now() - startTime;
        console.log(`\u2705 [Posts API] POST created post "${newPost.title}" (${queryTime}ms)`);
        return new Response(JSON.stringify({
          success: true,
          message: "Post created",
          post: normalizePostResult2(newPost)
        }), {
          status: 201,
          headers: corsHeaders3
        });
      } catch (err) {
        console.error("\u274C [Posts API] POST failed:", err.message);
        return new Response(JSON.stringify({
          error: "Failed to create post",
          message: err.message
        }), {
          status: 400,
          headers: corsHeaders3
        });
      }
    }
    if (method === "PUT") {
      try {
        if (!slug) {
          return new Response(JSON.stringify({
            error: "Slug required for update"
          }), {
            status: 400,
            headers: corsHeaders3
          });
        }
        const body = await context2.request.json();
        const existing = await db.query.posts.findFirst({
          where: eq(posts.slug, slug)
        });
        if (!existing) {
          return new Response(JSON.stringify({
            error: "Post not found",
            slug
          }), {
            status: 404,
            headers: corsHeaders3
          });
        }
        const updatedData = {
          title: body.title ?? existing.title,
          excerpt: body.excerpt ?? existing.excerpt,
          historicalDate: body.historicalDate ?? existing.historicalDate,
          historicalYear: body.historicalYear ?? existing.historicalYear,
          readingTime: body.readingTime ?? existing.readingTime,
          tags: body.tags ?? existing.tags,
          coverImage: body.coverImage ?? existing.coverImage,
          content: body.content ?? existing.content,
          translations: body.translations ?? existing.translations
        };
        await db.update(posts).set(updatedData).where(eq(posts.slug, slug));
        const queryTime = Date.now() - startTime;
        console.log(`\u2705 [Posts API] PUT updated post "${slug}" (${queryTime}ms)`);
        return new Response(JSON.stringify({
          success: true,
          message: "Post updated",
          slug
        }), {
          headers: corsHeaders3
        });
      } catch (err) {
        console.error("\u274C [Posts API] PUT failed:", err.message);
        return new Response(JSON.stringify({
          error: "Failed to update post",
          message: err.message
        }), {
          status: 400,
          headers: corsHeaders3
        });
      }
    }
    if (method === "DELETE") {
      try {
        if (!slug) {
          return new Response(JSON.stringify({
            error: "Slug required for deletion"
          }), {
            status: 400,
            headers: corsHeaders3
          });
        }
        const existing = await db.query.posts.findFirst({
          where: eq(posts.slug, slug)
        });
        if (!existing) {
          return new Response(JSON.stringify({
            error: "Post not found",
            slug
          }), {
            status: 404,
            headers: corsHeaders3
          });
        }
        await db.delete(posts).where(eq(posts.slug, slug));
        const queryTime = Date.now() - startTime;
        console.log(`\u2705 [Posts API] DELETE removed post "${slug}" (${queryTime}ms)`);
        return new Response(JSON.stringify({
          success: true,
          message: "Post deleted",
          slug
        }), {
          headers: corsHeaders3
        });
      } catch (err) {
        console.error("\u274C [Posts API] DELETE failed:", err.message);
        return new Response(JSON.stringify({
          error: "Failed to delete post",
          message: err.message
        }), {
          status: 400,
          headers: corsHeaders3
        });
      }
    }
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: corsHeaders3
    });
  } catch (err) {
    const queryTime = Date.now() - startTime;
    console.error(`\u274C [Posts API] Error (${queryTime}ms):`, err.message);
    return new Response(JSON.stringify({
      error: "Server error",
      message: err.message
    }), {
      status: 500,
      headers: corsHeaders3
    });
  }
}, "onRequest");
function normalizePostResult2(post) {
  return {
    ...post,
    author: post.authorId ?? post.author_id,
    authorId: post.authorId ?? post.author_id,
    author_id: post.authorId ?? post.author_id,
    content: typeof post.content === "string" ? JSON.parse(post.content) : post.content,
    tags: typeof post.tags === "string" ? JSON.parse(post.tags) : post.tags,
    translations: typeof post.translations === "string" ? JSON.parse(post.translations) : post.translations
  };
}
__name(normalizePostResult2, "normalizePostResult");

// api/posts-json.ts
var onRequest17 = /* @__PURE__ */ __name(async (context2) => {
  const corsHeaders3 = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (context2.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders3 });
  }
  const url = new URL(context2.request.url);
  const pathSegments = url.pathname.split("/").filter(Boolean);
  if (context2.request.method === "GET" && pathSegments.length === 2 && pathSegments[1] === "posts") {
    try {
      console.log("\u{1F4DD} [Production] GET /api/posts - serving from JSON files");
      const authorDirs = ["caesar", "augustus", "cicero", "catilina", "seneca"];
      let allPosts = [];
      for (const authorDir of authorDirs) {
        try {
          const postFiles = [
            "adoption-durch-caesar.json",
            "das-zweite-triumvirat.json",
            "der-prinzipat.json",
            "die-schlacht-bei-actium.json",
            "pax-augusta.json",
            "schlacht-bei-philippi.json"
            // Add more files as needed
          ];
          for (const file of postFiles) {
            try {
              const filePath = `/api/posts/${authorDir}/${file}`;
              const fileResponse = await fetch(`https://00d6eaf0.meum-diarium.pages.dev${filePath}`);
              if (fileResponse.ok) {
                const post = await fileResponse.json();
                post.author = authorDir;
                post.authorId = authorDir;
                allPosts.push(post);
              }
            } catch (fileError) {
              continue;
            }
          }
        } catch (authorError) {
          continue;
        }
      }
      allPosts.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      console.log(`\u2705 [Production] Served ${allPosts.length} posts from JSON files`);
      return new Response(JSON.stringify(allPosts), {
        headers: {
          ...corsHeaders3,
          "Cache-Control": "public, max-age=300",
          // 5 minutes cache
          "X-Data-Source": "json-files",
          "X-Post-Count": allPosts.length.toString()
        }
      });
    } catch (error3) {
      console.error("\u274C [Production] Error serving posts from JSON:", error3);
      return new Response(JSON.stringify([]), {
        headers: corsHeaders3
      });
    }
  }
  if (context2.request.method === "GET" && pathSegments.length === 4 && pathSegments[1] === "posts") {
    const [, , author, slug] = pathSegments;
    try {
      console.log(`\u{1F4DD} [Production] GET /api/posts/${author}/${slug} - serving from JSON files`);
      const filePath = `/api/posts/${author}/${slug}.json`;
      const fileResponse = await fetch(`https://00d6eaf0.meum-diarium.pages.dev${filePath}`);
      if (fileResponse.ok) {
        const post = await fileResponse.json();
        post.author = author;
        post.authorId = author;
        console.log(`\u2705 [Production] Served post: ${post.title}`);
        return new Response(JSON.stringify(post), {
          headers: {
            ...corsHeaders3,
            "Cache-Control": "public, max-age=3600",
            // 1 hour cache
            "X-Data-Source": "json-files"
          }
        });
      } else {
        console.log(`\u26A0\uFE0F [Production] Post not found: ${author}/${slug}`);
        return new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: corsHeaders3
        });
      }
    } catch (error3) {
      console.error("\u274C [Production] Error serving post:", error3);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: corsHeaders3
      });
    }
  }
  return new Response(JSON.stringify({
    error: "Method not allowed"
  }), {
    status: 405,
    headers: corsHeaders3
  });
}, "onRequest");

// api/profile.ts
function verifyToken3(token) {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    return decoded.userId;
  } catch {
    return null;
  }
}
__name(verifyToken3, "verifyToken");
var corsHeaders2 = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
  // 24 hours
  "Content-Type": "application/json"
};
var onRequest18 = /* @__PURE__ */ __name(async (context2) => {
  const { request, env: env2 } = context2;
  const method = request.method;
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders2
    });
  }
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Authentication required" }),
      { status: 401, headers: corsHeaders2 }
    );
  }
  const token = authHeader.substring(7);
  const userId = verifyToken3(token);
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Invalid token" }),
      { status: 401, headers: corsHeaders2 }
    );
  }
  const db = getDb(env2);
  if (method === "GET") {
    try {
      const userRecords = await db.select({
        id: users.id,
        email: users.email,
        username: users.username,
        displayName: users.displayName,
        bio: users.bio,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      }).from(users).where(eq(users.id, userId)).limit(1);
      const user = userRecords[0];
      if (!user) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 404, headers: corsHeaders2 }
        );
      }
      return new Response(
        JSON.stringify({ user }),
        {
          status: 200,
          headers: corsHeaders2
        }
      );
    } catch (error3) {
      console.error("Profile get error:", error3);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: corsHeaders2 }
      );
    }
  }
  if (method === "PUT") {
    try {
      const { displayName, bio, avatarUrl } = await request.json();
      if (!displayName && !bio && !avatarUrl) {
        return new Response(
          JSON.stringify({ error: "At least one field must be provided" }),
          { status: 400, headers: corsHeaders2 }
        );
      }
      const updateData = {
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (displayName) updateData.displayName = displayName.trim();
      if (bio) updateData.bio = bio.trim();
      if (avatarUrl) updateData.avatarUrl = avatarUrl.trim();
      await db.update(users).set(updateData).where(eq(users.id, userId));
      const updatedUserRecords = await db.select({
        id: users.id,
        email: users.email,
        username: users.username,
        displayName: users.displayName,
        bio: users.bio,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      }).from(users).where(eq(users.id, userId)).limit(1);
      const updatedUser = updatedUserRecords[0];
      return new Response(
        JSON.stringify({
          message: "Profile updated successfully",
          user: updatedUser
        }),
        {
          status: 200,
          headers: corsHeaders2
        }
      );
    } catch (error3) {
      console.error("Profile update error:", error3);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: corsHeaders2 }
      );
    }
  }
  return new Response(
    JSON.stringify({ error: "Method not allowed" }),
    { status: 405, headers: corsHeaders2 }
  );
}, "onRequest");

// api/simulate.ts
var onRequest19 = /* @__PURE__ */ __name(async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Accept"
      }
    });
  }
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" }
    });
  }
  let payload = null;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" }
    });
  }
  const target = new URL("https://caesar.schaechner.workers.dev/simulate");
  try {
    const upstream = await fetch(target.toString(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify(payload)
    });
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    const message = err?.message || "Upstream request failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}, "onRequest");

// api/stats.ts
var onRequest20 = /* @__PURE__ */ __name(async (context2) => {
  const corsHeaders3 = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  };
  if (context2.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders3,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Accept"
      }
    });
  }
  if (context2.request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders3
    });
  }
  const startTime = Date.now();
  try {
    if (!context2.env?.DB) {
      console.error("\u274C [Stats API] D1 database not available");
      return new Response(JSON.stringify({
        error: "Database not configured",
        message: "D1 database binding not found"
      }), {
        status: 503,
        headers: corsHeaders3
      });
    }
    console.log("\u{1F537} [Stats API] Fetching statistics from D1 database...");
    const db = getDb(context2.env);
    const allPosts = await db.query.posts.findMany();
    const allAuthors = await db.query.authors.findMany();
    const totalPosts = allPosts.length;
    const totalReadingTime = allPosts.reduce(
      (sum, post) => sum + (post.readingTime || 0),
      0
    );
    const averageReadingTime = totalPosts > 0 ? Math.round(totalReadingTime / totalPosts) : 0;
    const postsByAuthor = {};
    allPosts.forEach((post) => {
      const author = post.author_id || post.authorId || "unknown";
      postsByAuthor[author] = (postsByAuthor[author] || 0) + 1;
    });
    const tagCounts = {};
    allPosts.forEach((post) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag) => {
          if (typeof tag === "string") {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          }
        });
      }
    });
    const stats = {
      posts: totalPosts,
      authors: allAuthors.length,
      tags: Object.keys(tagCounts).length,
      totalReadingTime,
      averageReadingTime,
      postsByAuthor,
      topTags: Object.entries(tagCounts).sort(([, a], [, b]) => b - a).slice(0, 10).map(([tag, count4]) => ({ tag, count: count4 })),
      generatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const queryTime = Date.now() - startTime;
    console.log(`\u2705 [Stats API] Statistics generated successfully (${queryTime}ms)`);
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        ...corsHeaders3,
        "Cache-Control": "public, max-age=3600",
        "X-Data-Source": "cloudflare-d1"
      }
    });
  } catch (err) {
    const queryTime = Date.now() - startTime;
    console.error(`\u274C [Stats API] Error (${queryTime}ms):`, err.message);
    console.error("   Stack:", err.stack);
    return new Response(JSON.stringify({
      error: "Database Error",
      message: err.message
    }), {
      status: 500,
      headers: corsHeaders3
    });
  }
}, "onRequest");

// api/tags.ts
var onRequest21 = /* @__PURE__ */ __name(async (context2) => {
  const corsHeaders3 = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  };
  const startTime = Date.now();
  try {
    if (!context2.env?.DB) {
      console.error("\u274C [Tags API] D1 database not available");
      return new Response(JSON.stringify({
        error: "Database not configured",
        message: "D1 database binding not found",
        hint: "Check wrangler.toml and Pages environment settings"
      }), {
        status: 503,
        headers: corsHeaders3
      });
    }
    console.log("\u{1F537} [Tags API] DB binding found, initializing Drizzle...");
    const db = getDb(context2.env);
    const allPosts = await db.query.posts.findMany();
    const tagsSet = /* @__PURE__ */ new Set();
    allPosts.forEach((post) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag) => {
          if (typeof tag === "string" && tag.trim().length > 0) {
            tagsSet.add(tag.trim());
          }
        });
      }
    });
    const tags = Array.from(tagsSet).sort();
    const queryTime = Date.now() - startTime;
    console.log(`\u2705 [Tags API] D1 query successful: Found ${tags.length} unique tags (${queryTime}ms)`);
    return new Response(JSON.stringify(tags), {
      headers: {
        ...corsHeaders3,
        "Cache-Control": "public, max-age=3600",
        "X-Data-Source": "cloudflare-d1",
        "X-Tag-Count": tags.length.toString()
      }
    });
  } catch (err) {
    const queryTime = Date.now() - startTime;
    console.error(`\u274C [Tags API] D1 query failed (${queryTime}ms):`, err.message);
    console.error("   Stack:", err.stack);
    return new Response(JSON.stringify({
      error: "Database Error",
      message: err.message,
      hint: "Check if database is seeded and migrations are applied"
    }), {
      status: 500,
      headers: corsHeaders3
    });
  }
}, "onRequest");

// api/vocab/index.ts
var onRequest22 = /* @__PURE__ */ __name(async (context2) => {
  console.log("\u{1F50D} [Vocab API] Starting request");
  console.log("\u{1F50D} [Vocab API] Environment keys:", Object.keys(context2.env));
  console.log("\u{1F50D} [Vocab API] Vocab binding available:", !!context2.env?.vocab);
  if (!context2.env?.vocab) {
    console.error("\u274C [Vocab API] D1 vocab database not available");
    return new Response(JSON.stringify({
      error: "Database not configured",
      message: "D1 vocab database binding not found"
    }), {
      status: 503,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
  const db = getVocabDb(context2.env);
  const url = new URL(context2.request.url);
  const searchQuery = url.searchParams.get("q");
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const offset = parseInt(url.searchParams.get("offset") || "0");
  try {
    let results;
    if (searchQuery) {
      const searchPattern = `%${searchQuery}%`;
      results = await db.query.voc.findMany({
        where: or(
          like(voc.latin, searchPattern),
          like(voc.desc, searchPattern),
          like(voc.key, searchPattern)
        ),
        limit,
        offset,
        orderBy: [desc(voc.id)]
      });
    } else {
      results = await db.query.voc.findMany({
        limit,
        offset,
        orderBy: [desc(voc.id)]
      });
    }
    return new Response(JSON.stringify({
      results,
      count: results.length,
      limit,
      offset,
      source: {
        name: "Latin-GermanDictionary",
        url: "https://github.com/hackerpschorr/Latin-GermanDictionary",
        license: "GPL-3.0",
        entries: 36140
      }
    }), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (e) {
    console.error("Vocab API Error:", e);
    return new Response(JSON.stringify({
      error: "Internal Error",
      message: e.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
}, "onRequest");

// api/vocabulary.ts
var onRequest23 = /* @__PURE__ */ __name(async (context2) => {
  const db = getDb(context2.env);
  const url = new URL(context2.request.url);
  const type = url.searchParams.get("type");
  const random = url.searchParams.get("random");
  const limit = parseInt(url.searchParams.get("limit") || (random ? random : "50"));
  try {
    const results = await db.query.vocabulary.findMany({
      where: type ? eq(vocabulary.type, type) : void 0,
      orderBy: random ? sql`RANDOM()` : void 0,
      limit
    });
    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal Error", message: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
}, "onRequest");

// api/works.ts
var onRequest24 = /* @__PURE__ */ __name(async (context2) => {
  const corsHeaders3 = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (context2.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders3 });
  }
  const startTime = Date.now();
  try {
    if (!context2.env?.DB) {
      console.error("\u274C [Works API] D1 database not available");
      return new Response(JSON.stringify({
        error: "Database not configured",
        message: "D1 database binding not found"
      }), {
        status: 503,
        headers: corsHeaders3
      });
    }
    const db = getDb(context2.env);
    const url = new URL(context2.request.url);
    const method = context2.request.method;
    console.log(`\u{1F537} [Works API] ${method} request: ${url.pathname}${url.search}`);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const idFromPath = pathSegments[pathSegments.length - 1] !== "works" ? pathSegments[pathSegments.length - 1] : null;
    const id = idFromPath || url.searchParams.get("slug");
    if (method === "GET") {
      if (id) {
        const result = await db.query.works.findFirst({
          where: eq(works.id, id),
          with: {
            author: true
          }
        });
        const queryTime2 = Date.now() - startTime;
        if (!result) {
          console.warn(`\u26A0\uFE0F [Works API] Work not found: ${id}`);
          return new Response(JSON.stringify({ error: "Not Found" }), {
            status: 404,
            headers: corsHeaders3
          });
        }
        console.log(`\u2705 [Works API] GET found work "${result.title}" (${queryTime2}ms)`);
        const normalizedResult = normalizeWorkResult(result);
        return new Response(JSON.stringify(normalizedResult), {
          headers: {
            ...corsHeaders3,
            "Cache-Control": "public, max-age=3600",
            "X-Data-Source": "cloudflare-d1"
          }
        });
      }
      const results = await db.query.works.findMany({
        with: {
          author: true
        }
      });
      const queryTime = Date.now() - startTime;
      console.log(`\u2705 [Works API] GET fetched ${results.length} works (${queryTime}ms)`);
      const normalized = results.map(normalizeWorkResult);
      return new Response(JSON.stringify(normalized), {
        headers: {
          ...corsHeaders3,
          "Cache-Control": "public, max-age=3600",
          "X-Data-Source": "cloudflare-d1",
          "X-Work-Count": results.length.toString()
        }
      });
    }
    if (method === "POST") {
      try {
        const body = await context2.request.json();
        if (!body.id || !body.title) {
          return new Response(JSON.stringify({
            error: "Missing required fields",
            required: ["id", "title"]
          }), {
            status: 400,
            headers: corsHeaders3
          });
        }
        const existing = await db.query.works.findFirst({
          where: eq(works.id, body.id)
        });
        if (existing) {
          return new Response(JSON.stringify({
            error: "Work already exists",
            id: body.id
          }), {
            status: 409,
            headers: corsHeaders3
          });
        }
        const newWork = {
          id: body.id,
          title: body.title,
          authorId: body.authorId || null,
          description: body.description || "",
          type: body.type || "",
          date: body.date || "",
          coverImage: body.coverImage || "",
          content: body.content || {}
        };
        await db.insert(works).values(newWork);
        const queryTime = Date.now() - startTime;
        console.log(`\u2705 [Works API] POST created work "${newWork.title}" (${queryTime}ms)`);
        return new Response(JSON.stringify({
          success: true,
          message: "Work created",
          work: newWork
        }), {
          status: 201,
          headers: corsHeaders3
        });
      } catch (err) {
        console.error("\u274C [Works API] POST failed:", err.message);
        return new Response(JSON.stringify({
          error: "Failed to create work",
          message: err.message
        }), {
          status: 400,
          headers: corsHeaders3
        });
      }
    }
    if (method === "PUT") {
      try {
        if (!id) {
          return new Response(JSON.stringify({
            error: "ID required for update"
          }), {
            status: 400,
            headers: corsHeaders3
          });
        }
        const body = await context2.request.json();
        const existing = await db.query.works.findFirst({
          where: eq(works.id, id)
        });
        if (!existing) {
          return new Response(JSON.stringify({
            error: "Work not found",
            id
          }), {
            status: 404,
            headers: corsHeaders3
          });
        }
        const updatedData = {
          title: body.title ?? existing.title,
          authorId: body.authorId ?? existing.authorId,
          description: body.description ?? existing.description,
          type: body.type ?? existing.type,
          date: body.date ?? existing.date,
          coverImage: body.coverImage ?? existing.coverImage,
          content: body.content ?? existing.content
        };
        await db.update(works).set(updatedData).where(eq(works.id, id));
        const queryTime = Date.now() - startTime;
        console.log(`\u2705 [Works API] PUT updated work "${id}" (${queryTime}ms)`);
        return new Response(JSON.stringify({
          success: true,
          message: "Work updated",
          id
        }), {
          headers: corsHeaders3
        });
      } catch (err) {
        console.error("\u274C [Works API] PUT failed:", err.message);
        return new Response(JSON.stringify({
          error: "Failed to update work",
          message: err.message
        }), {
          status: 400,
          headers: corsHeaders3
        });
      }
    }
    if (method === "DELETE") {
      try {
        if (!id) {
          return new Response(JSON.stringify({
            error: "ID required for deletion"
          }), {
            status: 400,
            headers: corsHeaders3
          });
        }
        const existing = await db.query.works.findFirst({
          where: eq(works.id, id)
        });
        if (!existing) {
          return new Response(JSON.stringify({
            error: "Work not found",
            id
          }), {
            status: 404,
            headers: corsHeaders3
          });
        }
        await db.delete(works).where(eq(works.id, id));
        const queryTime = Date.now() - startTime;
        console.log(`\u2705 [Works API] DELETE removed work "${id}" (${queryTime}ms)`);
        return new Response(JSON.stringify({
          success: true,
          message: "Work deleted",
          id
        }), {
          headers: corsHeaders3
        });
      } catch (err) {
        console.error("\u274C [Works API] DELETE failed:", err.message);
        return new Response(JSON.stringify({
          error: "Failed to delete work",
          message: err.message
        }), {
          status: 400,
          headers: corsHeaders3
        });
      }
    }
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: corsHeaders3
    });
  } catch (err) {
    const queryTime = Date.now() - startTime;
    console.error(`\u274C [Works API] Error (${queryTime}ms):`, err.message);
    return new Response(JSON.stringify({
      error: "Server error",
      message: err.message
    }), {
      status: 500,
      headers: corsHeaders3
    });
  }
}, "onRequest");
function normalizeWorkResult(work) {
  return {
    ...work,
    content: typeof work.content === "string" ? JSON.parse(work.content) : work.content || {}
  };
}
__name(normalizeWorkResult, "normalizeWorkResult");

// ../.wrangler/tmp/pages-jlhERf/functionsRoutes-0.5028305335882142.mjs
var routes = [
  {
    routePath: "/api/vocab/:vokId/form/:form",
    mountPath: "/api/vocab/:vokId/form/:form",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/api/posts/:author/:slug",
    mountPath: "/api/posts/:author",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  },
  {
    routePath: "/api/auth/login",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/auth/register",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/dashboard/stats",
    mountPath: "/api/dashboard",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/vocab/all",
    mountPath: "/api/vocab/all",
    method: "",
    middlewares: [],
    modules: [onRequest3]
  },
  {
    routePath: "/api/vocab/:vokId",
    mountPath: "/api/vocab",
    method: "",
    middlewares: [],
    modules: [onRequest4]
  },
  {
    routePath: "/api/health",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/reading-progress",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/reading-progress",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/about",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest5]
  },
  {
    routePath: "/api/ask",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest6]
  },
  {
    routePath: "/api/authors",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest7]
  },
  {
    routePath: "/api/catalog",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest8]
  },
  {
    routePath: "/api/comments",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest9]
  },
  {
    routePath: "/api/debug",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest10]
  },
  {
    routePath: "/api/debug-bindings",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest11]
  },
  {
    routePath: "/api/explain",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest12]
  },
  {
    routePath: "/api/latin-texts",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest13]
  },
  {
    routePath: "/api/lexicon",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest14]
  },
  {
    routePath: "/api/pages",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest15]
  },
  {
    routePath: "/api/posts",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest16]
  },
  {
    routePath: "/api/posts-json",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest17]
  },
  {
    routePath: "/api/profile",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest18]
  },
  {
    routePath: "/api/simulate",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest19]
  },
  {
    routePath: "/api/stats",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest20]
  },
  {
    routePath: "/api/tags",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest21]
  },
  {
    routePath: "/api/vocab",
    mountPath: "/api/vocab",
    method: "",
    middlewares: [],
    modules: [onRequest22]
  },
  {
    routePath: "/api/vocabulary",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest23]
  },
  {
    routePath: "/api/works",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest24]
  }
];

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count4 = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count4--;
          if (count4 === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count4++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count4)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index2 = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index2, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index2 = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index: index2, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index2 = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index2++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env2, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context2 = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env: env2,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context2);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error3) {
      if (isFailOpen) {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error3;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
