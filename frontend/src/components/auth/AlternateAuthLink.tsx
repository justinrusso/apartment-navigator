import styled from "styled-components";

const AlternateAuthLink = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.palette.primary.main};
  cursor: pointer;
  outline: none;
  padding: 0;
`;

export default AlternateAuthLink;
