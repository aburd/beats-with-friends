/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import log from "loglevel";
import AppContextProvider from "./AppContextProvider";
import App from "./App";
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
if (import.meta.env.PROD) {
  log.setLevel(4);
}
if (import.meta.env.DEV) {
  log.setLevel(0);
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
        <App />
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

