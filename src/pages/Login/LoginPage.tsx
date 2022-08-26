import { Show, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import log from "loglevel";
import { AppRoutes } from "@/routes";
import ErrorModal from "@/components/ErrorModal";
import * as api from "@/api";
import { AuthError } from "@/api/auth";
import "./LoginPage.css";
import { Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, Spinner, VStack } from "@hope-ui/solid";
import { createForm } from "@felte/solid";
import * as yup from 'yup';
import YupPassword from 'yup-password';
import { InferType, object, string } from "yup";
import { validator } from "@felte/validator-yup";
import beatWithFriendsLogoUrl from '@/assets/img/beatWithFriendsLogo.png';
import useTranslation from "@/i18n/useTranslation";

YupPassword(yup);
const schema = object({
  email: string().email().required(),
  password: string().password().required()
});

export default function LoginPage() {
  const [loginErr, setLoginErr] = createSignal<null | AuthError>(null);
  const [signingIn, setSigningIn] = createSignal<boolean>(false);
  const translate = useTranslation();
  const navigate = useNavigate();

  const {
    form,
    errors,
    isValid,
  } = createForm<InferType<typeof schema>>({
    extend: validator({ schema }),
    onSubmit: async (formState) => {
      await handleFormSubmit(formState.email, formState.password);
    },
  });

  async function handleOauthClick() {
    log.debug("Logging in with Oauth");
    await api.auth.signInGoogle();
    navigate(AppRoutes.profile(), { replace: true });
  }

  async function handleFormSubmit(email: string, password: string) {
    setSigningIn(true);
    await api.auth.signIn(email, password)
      .catch((e: AuthError) => setLoginErr(e));
    setSigningIn(false);
    navigate(AppRoutes.profile(), { replace: true });
  }

  return (
    <div id="login-container">
      <Show when={loginErr()}>
        <ErrorModal onClose={() => setLoginErr(null)} errorCode={loginErr()?.code} />
      </Show>
      <header>
        <img alt={translate('login.title')} id="logo" src={beatWithFriendsLogoUrl} />
      </header>
      <div id="form-body">
        <VStack as="form" ref={form}>
          <FormControl required invalid={!!errors("email")}>
            <FormLabel>{translate('login.fields.email.label')}</FormLabel>
            <Input type="email" name="email" placeholder={translate('login.fields.email.placeholder')} />
            <FormErrorMessage>{errors("email")[0]}</FormErrorMessage>
          </FormControl>
          <FormControl required invalid={!!errors("password")}>
            <FormLabel>{translate('login.fields.password.label')}</FormLabel>
            <Input type="password" name="password" placeholder={translate('login.fields.password.placeholder')} />
            <FormErrorMessage>{errors("password")[0]}</FormErrorMessage>
          </FormControl>
          <HStack justifyContent="flex-end">
            <Button
              backgroundColor="$success9"
              type="submit" disabled={!isValid()}>
              {signingIn() ? <Spinner /> : translate('login.title')}
            </Button>
          </HStack>
        </VStack>
        <VStack>
          <HStack justifyContent="flex-start">
            <Button backgroundColor="$success7" onClick={handleOauthClick}>
              <img src="/google.png" />
              {translate('login.buttons.googleLogin')}
            </Button>
          </HStack>
          <HStack flexDirection="column" justifyContent="flex-end">
            <span>{translate('login.signup')}</span>
            <Button backgroundColor="$primary7" onClick={() => navigate(AppRoutes.signUp())}>{translate('login.buttons.signup')}</Button>
          </HStack>
        </VStack>
      </div>
      <footer>
        <p>
          App by <a href="http://aburd/me" target="_blan">Aaron</a>.
          \n Piano icon by <a href="https://www.favicon.cc/?action=icon&file_id=121615" target="_blank">I am Garreth</a>.
          \nOther icons from <a href="https://basicons.xyz/" target="_blank">BasicIcon</a>.
        </p>
      </footer>
    </div >
  );
}
