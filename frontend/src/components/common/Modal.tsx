import { FC, PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

const ModalRoot = styled.div`
  inset: 0px;
  position: fixed;
  z-index: ${(props) => props.theme.zIndex.modal};
`;

interface ModalBackgroundProps {
  transparent?: boolean;
}

const ModalBackground = styled.div<ModalBackgroundProps>`
  background-color: ${(props) => !props.transparent && "rgba(0, 0, 0, 0.5)"};
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: -1;
  transition: opacity 225ms
    ${(props) => props.theme.transitions.easing.easeInOut} 0ms;
`;

export interface ModalProps {
  hideBackground?: boolean;
  onClose?: () => void;
  open?: boolean;
}

const Modal: FC<PropsWithChildren<ModalProps>> = ({
  children,
  hideBackground,
  onClose,
  open,
}) => {
  if (!open) {
    return null;
  }

  return createPortal(
    <ModalRoot>
      <ModalBackground onClick={onClose} transparent={hideBackground} />
      {children}
    </ModalRoot>,
    document.body
  );
};

export default Modal;
