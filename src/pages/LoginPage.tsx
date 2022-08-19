import {Show, onMount, onCleanup, createSignal, createResource, useContext, createEffect} from "solid-js";
import {useNavigate} from "@solidjs/router";
import log from "loglevel";
import {AppContextContext} from "../AppContextProvider";
import {AppRoutes} from "../routes";
import ErrorModal from "../components/ErrorModal";
import * as api from "../api";
import {AuthError} from "../api/auth";
import "./LoginPage.css";

type FormState = {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [appState] = useContext(AppContextContext);
  const [formState, setFormState] = createSignal<FormState>({email: "", password: ""});
  const [loginErr, setLoginErr] = createSignal<null | AuthError>(null);
  const [signingIn, setSigningIn] = createSignal<boolean>(false);
  const navigate = useNavigate();
  let emailRef: HTMLInputElement | undefined;

  log.debug(appState);

  onMount(async () => {
    if (!emailRef) {
      log.warn("Could not find email input");
      return;
    }
    (emailRef as HTMLInputElement).focus();
  });

  function handleFormUpdate(key: string, value: string) {
    setFormState({...formState(), [key]: value} as FormState);
  }

  async function handleOauthClick() {
    log.debug("Logging in with Oauth");
    await api.auth.signInGoogle();
    navigate(AppRoutes.profile(), {replace: true});
  }

  async function handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    setSigningIn(true);
    await api.auth.signIn(formState().email, formState().password)
      .catch((e: AuthError) => setLoginErr(e));
    setSigningIn(false);
    navigate(AppRoutes.profile(), {replace: true});
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
              <input
                ref={emailRef} type="text" name="email" value={formState().email} placeholder="beatmaker@beats-with-friends.com" onChange={(e) => handleFormUpdate("email", e.currentTarget.value)} />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" name="password" value={formState().password} placeholder="password" onChange={(e) => handleFormUpdate("password", e.currentTarget.value)} />
            </div>
            <button
              type="submit"
              class={signingIn() ? "warning" : "primary"}
              disabled={signingIn()}>
              {signingIn() ? "Signing in..." : "Login"}
            </button>
          </form>
          <div class="o-auth">
            <button class="primary" onClick={handleOauthClick}>
              <img src="/google.png" />
              Login with Gmail
            </button>
          </div>
          <div class="Login-signup">
            <span>{"Don't have an account yet?"}</span>
            <button class="secondary" onClick={() => navigate(AppRoutes.signUp())}>Sign Up</button>
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
