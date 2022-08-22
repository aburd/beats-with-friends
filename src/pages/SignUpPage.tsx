import {Show, onMount, createSignal} from "solid-js";
import {Link} from "@solidjs/router";
import log from "loglevel";
import ErrorModal from "../components/ErrorModal";
import * as api from "../api";
import {UserApiError} from "../api/user";
import {AppRoutes} from "../routes";
import "./SignUpPage.css";

type FormState = {
  email: string;
  password: string;
  name: string;
}

export default function SignUpPage() {
  const [formState, setFormState] = createSignal<FormState>({email: "", password: "", name: ""});
  const [signUpErr, setSignUpErr] = createSignal<null | UserApiError>(null);
  const [signingUp, setSigningIn] = createSignal<boolean>(false);
  let aliasRef: HTMLInputElement | undefined;

  onMount(async () => {
    if (!aliasRef) {
      log.warn("Could not find email input");
      return;
    }
    (aliasRef as HTMLInputElement).focus();
  });

  function handleFormUpdate(key: string, value: string) {
    setFormState({...formState(), [key]: value} as FormState);
  }

  async function handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    setSigningIn(true);
    api.user.create(
      formState().email,
      formState().password,
      formState().name,
      [],
    )
      .catch(e => setSignUpErr(e as UserApiError));
    setSigningIn(false);
  }

  function handleOauthClick() {
    log.debug("Logging in with Oauth");
    api.auth.signInGoogle();
  }

  return (
    <div class="SignUpPage page">
      <Show when={signUpErr()}>
        <ErrorModal onClose={() => setSignUpErr(null)} errorCode={signUpErr()?.code} />
      </Show>
      <header class="SignUp-header">
        <h1><img src="/piano-favicon.ico" class="icon" />Beats with Friends</h1>
      </header>
      <section class="SignUp-body">
        <div class="SignUp-body--inner">
          <h2>Sign Up</h2>
          <form onSubmit={handleFormSubmit}>
            <div class="form-group">
              <label for="alias">Alias</label>
              <input
                ref={aliasRef}
                type="text"
                name="alias"
                value={formState().name}
                placeholder="Beatmaker5000"
                onKeyUp={(e) => handleFormUpdate("name", e.currentTarget.value)}
              />
            </div>
            <div class="form-group">
              <label for="email">E-mail</label>
              <input
                type="text"
                name="email"
                value={formState().email}
                placeholder="beatmaker@beats-with-friends.com"
                onKeyUp={(e) => handleFormUpdate("email", e.currentTarget.value)}
              />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" name="password" value={formState().password} placeholder="password" onKeyUp={(e) => handleFormUpdate("password", e.currentTarget.value)} />
            </div>
            <button
              type="submit"
              class={signingUp() ? "warning" : "primary"}
              disabled={signingUp()}>
              {signingUp() ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <div class="SignUp-signup">
            <span>Already have an account? <Link href={AppRoutes.login()}>Go back to the login page.</Link></span>
          </div>
        </div>
      </section>
    </div>
  );
}
