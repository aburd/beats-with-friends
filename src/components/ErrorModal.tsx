import Modal, {ModalProps} from "./Modal";
import {errorMsg} from "../lib";
import {ErrorCode} from "../api";

type ErrorModalProps = {
  // will translate a valid code to something human readable
  errorCode?: ErrorCode;
} & ModalProps;

/** 
 * Convenience component for displaying errors in solid-js to the user 
 */
export default function ErrorModal(props: ErrorModalProps) {
  return (
    <Modal onClose={props.onClose}>
      <i class="icon alert-error" />
      {props.errorCode && errorMsg(props.errorCode)}
      {props.children}
    </Modal>
  );
}
