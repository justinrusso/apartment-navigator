import styled from "styled-components";

import DialogTitle from "./DialogTitle";

const DialogContent = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 1.25rem 1.5rem;

  ${DialogTitle} + & {
    padding-top: 0;
  }
`;

export default DialogContent;
