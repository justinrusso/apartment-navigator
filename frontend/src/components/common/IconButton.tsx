import styled from "styled-components";
import Button from "./Button";

const IconButton = styled(Button)`
  border-radius: 50%;
  padding: 12px;
`;

IconButton.defaultProps = {
  variant: "text",
};

export default IconButton;
