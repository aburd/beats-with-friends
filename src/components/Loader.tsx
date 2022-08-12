import {Show, JSX, createEffect, createSignal} from "solid-js";
import "./Loader.css";

type Props = {
  loading: boolean;
  style?: JSX.StyleHTMLAttributes<HTMLDivElement>;
}

export default function Loader(props: Props) {
  return (
    <div class="Loader" style={props.style}>
      <Show when={props.loading}>
        Loading...
      </Show>
    </div>
  );
}
