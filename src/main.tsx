/* @refresh reload */
import {render} from 'solid-js/web'
import log from "loglevel";
import AppContextProvider from "./AppContextProvider"
import App from './App'

log.setLevel(0)

log.info(import.meta.env.VITE_SOME_KEY);

// Reference for levels of logs in 'loglevel' pkg
// log.error("error");
// log.warn("warn");
// log.info("info");
// log.debug("debug");
// log.trace("trace");


// Render Solid App
render(() =>
  <AppContextProvider
    fbApp={null}
    fbAuth={null}
    fbUser={null}
  >
    <App />
  </AppContextProvider>
  , document.getElementById('root') as HTMLElement);

// Remove placeholder splash for App
const splashEl = document.getElementById("app-splash");
if (splashEl) {
  splashEl.remove();
}
