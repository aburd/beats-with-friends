import {JSX} from "solid-js";
import {Portal} from "solid-js/web";
import "./Modal.css"

export type ModalProps = {
  onClose: () => void;
  // Aribtrary things can also be displayed by passing children
  children?: JSX.Element;
}

/** 
 * Convenience component for displaying errors in solid-js to the user 
 */
export default function Modal(props: ModalProps) {
  return (
    <Portal mount={document.getElementById('app-portal-modal') as HTMLDivElement}>
      <div class="Modal">
        <div class="Modal-window">
          <div class="Modal-controls">
            <button class="icon" onClick={props.onClose}><i class="icon x-circle-close-delete" /></button>
          </div>
          <div class="Modal-body">
            {props.children}
          </div>
        </div>
      </div>
    </Portal>
  );
}
