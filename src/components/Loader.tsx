import {Show, JSX, createEffect, createSignal} from "solid-js";
import ErrorModal from "./ErrorModal";
import "./Loader.css";

type Props = {
  loading: boolean;
  error: string | null | undefined;
  style?: JSX.StyleHTMLAttributes<HTMLDivElement>;
}

export default function Loader(props: Props) {
  const [errorVis, setErrorVis] = createSignal(false);

  createEffect(() => {
    if (props.error) {
      setErrorVis(true);
    }
  });

  function handleModalClose() {
    console.log('closing');
    setErrorVis(false);
  }

  console.log('props.loading', props.loading);

  return (
    <div class="Loader" style={props.style}>
      <Show when={props.loading}>
        Loading...
      </Show>
      <Show when={errorVis()}>
        <ErrorModal onClose={handleModalClose}>{props.error}</ErrorModal>
      </Show>
    </div>
  );
}
