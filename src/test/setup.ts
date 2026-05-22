import '@testing-library/jest-dom'

// Node.js 26 defines localStorage/sessionStorage as experimental globals (but
// undefined without --localstorage-file). Vitest's populateGlobal skips any key
// already present in globalThis, so jsdom's working storage never gets installed.
// We copy it manually here, after the jsdom environment has been set up.
const jsdomGlobal = (globalThis as unknown as { jsdom?: { window: Window } }).jsdom
if (jsdomGlobal?.window?.localStorage) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: jsdomGlobal.window.localStorage,
    configurable: true,
    writable: true,
  })
}
if (jsdomGlobal?.window?.sessionStorage) {
  Object.defineProperty(globalThis, 'sessionStorage', {
    value: jsdomGlobal.window.sessionStorage,
    configurable: true,
    writable: true,
  })
}
