import styled from "styled-components";
import { underlinedLink } from "../../theme/mixins";

const AlternateAuthLink = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.palette.primary.main};
  cursor: pointer;
  outline: none;
  padding: 0;

  ${underlinedLink}
`;

export default AlternateAuthLink;
