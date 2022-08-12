import {JSX} from "solid-js";
import {Portal} from "solid-js/web";
import "./ErrorModal.css"

type ErrorModalProps = {
  onClose: () => void;
  children: JSX.Element;
}

export default function ErrorModal(props: ErrorModalProps) {
  return (
    <Portal mount={document.getElementById('app-portal-modal') as HTMLDivElement}>
      <div class="ErrorModal">
        <div class="ErrorModal-window">
          <div class="ErrorModal-controls"><button class="btn-icon" onClick={props.onClose}>&#10006;</button></div>
          <div class="ErrorModal-body">
            {props.children}
          </div>
        </div>
      </div>
    </Portal>
  );
}
