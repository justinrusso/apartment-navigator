import styled from "styled-components";

export interface PaperProps {
  elevation?: number;
  square?: boolean;
}

const Paper = styled.div<PaperProps>`
  box-shadow: ${(props) => props.theme.shadows[props.elevation || 0]};
  background-color: #fff;
  border-radius: ${(props) => (props.square ? 0 : props.theme.borderRadius)}px;
`;

export default Paper;
