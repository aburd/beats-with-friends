import {Show, onMount, onCleanup, createSignal, createResource, useContext, createEffect} from "solid-js";
import log from "loglevel";
import {AppContextContext} from "../AppContextProvider";
import Loader from "../components/Loader";
import ErrorModal from "../components/ErrorModal";
import * as api from "../api";
import {AuthError} from "../api/auth";
import "./LoginPage.css";

type FormState = {
  email: string;
  password: string;
}

type LoginPageProps = {};

export default function LoginPage(props: LoginPageProps) {
  const [appState] = useContext(AppContextContext);
  const [formState, setFormState] = createSignal<FormState>({email: "", password: ""});
  const [loginErr, setLoginErr] = createSignal<null | AuthError>(null);
  let emailRef: HTMLInputElement;

  log.debug(appState);

  onMount(async () => {
    if (!emailRef) {
      log.warn("Could not find email input");
      return;
    }
    emailRef.focus();
  });

  function handleFormUpdate(key: string, value: string) {
    setFormState({...formState(), [key]: value} as FormState);
  }

  function handleOauthClick() {
    log.debug("Logging in with Oauth");
    api.auth.signInGoogle();
  }

  async function handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    const user = await api.auth.signIn(formState().email, formState().password)
      .catch((e: AuthError) => setLoginErr(e));
  }

  return (
    <div class="LoginPage page">
      <Show when={loginErr()}>
        <ErrorModal onClose={() => setLoginErr(null)} errorCode={loginErr()?.code} />
      </Show>
      <header class="Login-header">
        <h1><img src="/piano-favicon.ico" class="icon" />Beats with Friends</h1>
      </header>
      <section class="Login-body">
        <div class="Login-body--inner">
          <h2>Login</h2>
          <form onSubmit={handleFormSubmit}>
            <div class="form-group">
              <label for="email">E-mail</label>
              {/* @ts-ignore */}
              <input ref={emailRef} type="text" name="email" value={formState().email} placeholder="beatmaker@beats-with-friends.com" onKeyUp={(e) => handleFormUpdate("email", e.currentTarget.value)} />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" name="password" value={formState().password} placeholder="password" onKeyUp={(e) => handleFormUpdate("password", e.currentTarget.value)} />
            </div>
            <button type="submit" class="primary">Login</button>
          </form>
          <div class="o-auth">
            <button class="primary" onClick={handleOauthClick}>
              <img src="/google.png" />
              Login with Gmail
            </button>
          </div>
          <div class="Login-signup">
            <span>{"Don't have an account yet?"}</span>
            <button class="secondary">Sign Up</button>
          </div>
        </div>
      </section>
      <footer class="Login-footer">
        <div class="Login-footer-content">
          App by <a href="http://aburd/me" target="_blan">Aaron</a>. Piano icon by <a href="https://www.favicon.cc/?action=icon&file_id=121615" target="_blank">I am Garreth</a>. Other icons from <a href="https://basicons.xyz/">BasicIcon</a>.
        </div>
      </footer>
    </div>
  );
}
