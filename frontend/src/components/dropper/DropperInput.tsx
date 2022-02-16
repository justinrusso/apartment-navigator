import styled, { useTheme } from "styled-components";
import {
  FC,
  ReactNode,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
} from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { createPortal } from "react-dom";

import Typography from "../common/Typography";

type FullScreenDropzoneProps = {
  isDragAccept: any;
  isDragReject: any;
  isFocused: any;
  acceptedFiles: any;
};

const FullScreenDropzone = styled.div<FullScreenDropzoneProps>`
  background-color: var(--color);
  inset: 0px;
  opacity: 0.75;
  padding: 0.5rem;
  position: fixed;
  transition: opacity 225ms
    ${(props) => props.theme.transitions.easing.easeInOut} 0ms;
  z-index: 1600;

  .dropzone-inner {
    align-items: center;
    border: 4px dashed rgba(255, 255, 255, 20%);
    display: flex;
    height: 100%;
    justify-content: center;
    width: 100%;

    ${Typography} {
      color: rgba(255, 255, 255, 87%);
      text-align: center;
    }
  }
`;

type DropperInputProps = {
  accept?: DropzoneOptions["accept"];
  maxFiles?: DropzoneOptions["maxFiles"];
  multiple?: DropzoneOptions["multiple"];
  onDrop: DropzoneOptions["onDrop"];
  noClick?: DropzoneOptions["noClick"];
  noDrag?: DropzoneOptions["noDrag"];
  noKeyboard?: DropzoneOptions["noKeyboard"];
  placeholder?: ReactNode | ((open: () => void) => void);
};

const DropperInput: FC<DropperInputProps> = ({
  accept,
  maxFiles,
  multiple,
  onDrop,
  noClick,
  noDrag,
  noKeyboard,
  placeholder: placeholderBase,
}) => {
  const theme = useTheme();

  const [visible, setVisible] = useState(false);

  const { getRootProps, getInputProps, isDragReject, open } = useDropzone({
    accept,
    maxFiles,
    multiple,
    noClick,
    noDrag,
    noKeyboard,
    onDrop,
  });

  // Set up listeners to show/hide full-screen dropzone
  useEffect(() => {
    let lastTarget: EventTarget | null = null;

    const showZone = (e: DragEvent) => {
      lastTarget = e.target;
      setVisible(true);
    };

    const hideZone = (e: DragEvent) => {
      if (e.target === lastTarget || e.target === document) {
        setVisible(false);
      }
    };

    window.addEventListener("dragenter", showZone);
    window.addEventListener("dragleave", hideZone);
    window.addEventListener("drop", hideZone);

    return () => {
      window.removeEventListener("dragenter", showZone);
      window.removeEventListener("dragleave", hideZone);
      window.removeEventListener("drop", hideZone);
    };
  }, []);

  const placeholder = isValidElement(placeholderBase)
    ? cloneElement(placeholderBase, {
        ...getRootProps(),
        ...placeholderBase.props,
      })
    : placeholderBase instanceof Function
    ? placeholderBase(open)
    : placeholderBase;

  return (
    <>
      <input {...getInputProps()} />
      {placeholder}
      {createPortal(
        <FullScreenDropzone
          {...getRootProps()}
          style={{
            visibility: visible ? undefined : "hidden",
            opacity: visible ? undefined : 0,
            ["--color" as any]: isDragReject
              ? theme.palette.error.main
              : theme.palette.primary.dark,
          }}
        >
          <div className="dropzone-inner">
            <Typography variant="h1" as="p">
              {isDragReject
                ? "Unsupported file(s)"
                : `Drop file${multiple ? "s" : ""} here`}
            </Typography>
          </div>
        </FullScreenDropzone>,
        document.body
      )}
    </>
  );
};

export default DropperInput;
