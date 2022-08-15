import {AppContextContext} from "../AppContextProvider";
import {useContext, createSignal} from "solid-js";
import {useNavigate} from "@solidjs/router";
import {AppRoutes} from "../routes";
import log from "loglevel";
import * as api from "../api";

type SetupFormData = {
  alias: string;
};

export type UserSetupPageProps = {};

export default function UserSetupPage(_props: UserSetupPageProps) {
  const [appState, setAppContext] = useContext(AppContextContext);
  const [formData, setFormData] = createSignal<SetupFormData>({alias: ""});
  const [submitting, setSubmitting] = createSignal<boolean>(false);
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
    const user = await api.user.createWithId(appState.fbUser.uid, formData().alias, ['1']);
    if (!setAppContext) {
      log.warn(`No app context detected`);
      return;
    }
    setAppContext({user});
    navigate(AppRoutes.profile());

    setSubmitting(false);
  }

  return (
    <div class="UserSetupPage page">
      <h1>User Setup Page</h1>
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
