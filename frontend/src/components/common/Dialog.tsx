import React, { FC, PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

import Modal, { ModalProps } from "./Modal";
import Paper, { PaperProps } from "./Paper";

const DialogContentContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  pointer-events: none;
  transition: opacity 225ms
    ${(props) => props.theme.transitions.easing.easeInOut} 0ms;
`;

interface DialogContentBackgroundProps extends PaperProps {
  fullWidth?: boolean;
}

const DialogContentBackground = styled(Paper)<DialogContentBackgroundProps>`
  border-radius: ${(props) => props.theme.borderRadius}px;
  display: flex;
  flex-direction: column;
  margin: 32px;
  max-height: calc(100% - 64px);
  max-width: 600px;
  overflow-y: auto;
  pointer-events: all;
  position: absolute;
  width: ${(props) => props.fullWidth && "calc(100% - 64px)"};
`;

interface DialogProps extends ModalProps {
  fullWidth?: boolean;
}

const Dialog: FC<PropsWithChildren<DialogProps>> = ({
  children,
  hideBackground,
  fullWidth,
  onClose,
}) => {
  return createPortal(
    <Modal hideBackground={hideBackground} onClose={onClose}>
      <DialogContentContainer>
        <DialogContentBackground fullWidth={fullWidth} elevation={24}>
          {children}
        </DialogContentBackground>
      </DialogContentContainer>
    </Modal>,
    document.body
  );
};

export default Dialog;
