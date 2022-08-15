import {JSX} from "solid-js";
import {Portal} from "solid-js/web";
import {errorMsg} from "../lib";
import {ErrorCode} from "../api";
import "./ErrorModal.css"

type ErrorModalProps = {
  onClose: () => void;
  // will translate a valid code to something human readable
  errorCode?: ErrorCode;
  // Aribtrary things can also be displayed by passing children
  children?: JSX.Element;
}

/** 
 * Convenience component for displaying errors in solid-js to the user 
 */
export default function ErrorModal(props: ErrorModalProps) {
  return (
    <Portal mount={document.getElementById('app-portal-modal') as HTMLDivElement}>
      <div class="ErrorModal">
        <div class="ErrorModal-window">
          <div class="ErrorModal-controls">
            <button class="icon" onClick={props.onClose}><i class="icon x-circle-close-delete" /></button>
          </div>
          <div class="ErrorModal-body">
            <i class="icon alert-error" />
            {props.errorCode && errorMsg(props.errorCode)}
            {props.children}
          </div>
        </div>
      </div>
    </Portal>
  );
}
