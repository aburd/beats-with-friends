/* @refresh reload */
import {render} from 'solid-js/web'
import App from './App'

// Render Solid App
render(() => <App />, document.getElementById('root') as HTMLElement);

// Remove placeholder splash for App
const splashEl = document.getElementById("app-splash");
if (splashEl) {
  splashEl.remove();
}
