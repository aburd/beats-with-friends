/* @refresh reload */
import { render } from 'solid-js/web'
import { Router } from "@solidjs/router"
import log, { LogLevelDesc } from "loglevel";
import AppContextProvider from "./AppContextProvider"
import App from './App'
import { HopeProvider } from '@hope-ui/solid'
import audio from "./audio";


// ** RUNTIME ENVIRONMENT SETUP **
//
// Reference for levels of logs in 'loglevel' pkg
// log.error("error");
// log.warn("warn");
// log.info("info");
// log.debug("debug");
// log.trace("trace");
//
let logLevel = 0;
if (import.meta.env.DEV) logLevel = 1;
if (import.meta.env.VITE_DEBUG) logLevel = 0;
if (import.meta.env.PROD) logLevel = 4;
log.setLevel(logLevel as LogLevelDesc);
log.debug(`Set loglevel to ${logLevel}`);

if (import.meta.env.VITE_DEBUG) {
  audio.debug.init();
}

// ** APP **
render(
  () => (
    <AppContextProvider
      fbApp={null}
      fbAuth={null}
      fbUser={null}
      user={null}
      bootstrapped={false}
    >
      <Router>
        <HopeProvider>
          <App />
        </HopeProvider>
      </Router>
    </AppContextProvider>
  ),
  document.getElementById("root") as HTMLElement
);

// ** CLEAN UP FROM BEFORE APP IS LOADED **
const splashEl = document.getElementById("app-splash");
if (splashEl) {
  splashEl.remove();
}

