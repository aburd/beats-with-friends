import {Show, JSX, createEffect, createSignal} from "solid-js";
import ErrorModal from "./ErrorModal";

type Props = {
  loading: boolean;
  error: string | null | undefined;
  style?: JSX.StyleHTMLAttributes<HTMLDivElement>;
}

export default function Loader(props: Props) {
  const [errorVis, setErrorVis] = createSignal(false);

  createEffect(() => {
    if (props.error) setErrorVis(true);
  });

  function handleModalClose() {
    setErrorVis(false);
  }

  return (
    <div class="Loader" style={props.style}>
      <Show when={props.loading && !props.error}>
        Loading...
      </Show>
      <Show when={errorVis()}>
        <ErrorModal onClose={handleModalClose}>{props.error}</ErrorModal>
      </Show>
    </div>
  );
}
