import {Show, useContext, createSignal} from "solid-js";
import {useNavigate} from "@solidjs/router";
import log from "loglevel";
import {AppContextContext} from "../AppContextProvider";
import ErrorModal from "../components/ErrorModal";
import {AppRoutes} from "../routes";
import * as api from "../api";
import {UserApiError} from "../api/user";

type SetupFormData = {
  alias: string;
};

export default function UserSetupPage() {
  const [appState, setAppContext] = useContext(AppContextContext);
  const [formData, setFormData] = createSignal<SetupFormData>({alias: ""});
  const [submitting, setSubmitting] = createSignal<boolean>(false);
  const [submitErr, setSubmitErr] = createSignal<null | UserApiError>(null);
  const navigate = useNavigate();

  function handleFormUpdate(key: keyof SetupFormData, value: SetupFormData[keyof SetupFormData]) {
    setFormData({...formData(), [key]: value});
  }

  async function handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    setSubmitting(true);

    if (!appState.fbUser) {
      log.error(`No user in database.`);
      return;
    }
    try {
      const user = await api.user.createWithId(appState.fbUser.uid, appState.fbUser.email || "", formData().alias, [])
      if (!setAppContext) {
        log.warn(`No app context detected`);
        return;
      }
      setAppContext({user});
      navigate(AppRoutes.profile());
    } catch (e) {
      log.debug(e);
      setSubmitErr(e as UserApiError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div class="UserSetupPage page">
      <h1>User Setup Page</h1>
      <Show when={submitErr()}>
        <ErrorModal errorCode={submitErr()?.code} onClose={() => setSubmitErr(null)} />
      </Show>
      <form onSubmit={handleFormSubmit}>
        <div class="form-group">
          <label for="alias">Alias</label>
          <input
            type="text"
            placeholder="Beatmaker5000"
            value={formData().alias}
            onKeyUp={e => handleFormUpdate("alias", e.currentTarget.value)}
          />
        </div>
        <div class="form-group">
          <button type="submit" class={submitting() ? "warning" : "primary"} disabled={submitting()}>{submitting() ? "Updating user..." : "Submit"}</button>
        </div>
      </form>
    </div>
  );
}
