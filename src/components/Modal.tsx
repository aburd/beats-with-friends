import { JSX, splitProps, mergeProps } from "solid-js";
import {
  Modal as HopeModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  ModalProps as HopeModalProps,
} from "@hope-ui/solid";

export type ModalProps = {
  onClose: () => void;
  // Aribtrary things can also be displayed by passing children
  title?: string;
  children?: JSX.Element;
  closeText?: string;
  opened: boolean;
} & HopeModalProps;

export default function Modal(props: ModalProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "opened",
    "onClose",
    "title",
    "closeText",
  ]);
  const mergedProps = mergeProps(
    {
      closeText: "Close",
      local,
    },
    props
  );

  return (
    <>
      <HopeModal opened={local.opened} onClose={local.onClose} {...rest}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>{local.title}</ModalHeader>
          <ModalBody>{local.children}</ModalBody>
          <ModalFooter>
            <Button onClick={local.onClose}>{mergedProps.closeText}</Button>
          </ModalFooter>
        </ModalContent>
      </HopeModal>
    </>
  );
}
