import styled from "styled-components";

import Typography from "./Typography";

const DialogTitle = styled(Typography).attrs((props) => {
  return {
    ...props,
    as: "h2",
    variant: "h6",
  };
})`
  padding: 1rem 1.5rem;
  flex: 0 0 auto;
`;

export default DialogTitle;
