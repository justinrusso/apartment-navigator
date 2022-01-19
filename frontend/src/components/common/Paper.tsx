import styled from "styled-components";

export interface PaperProps {
  elevation?: number;
}

const Paper = styled.div<PaperProps>`
  box-shadow: ${(props) => props.theme.shadows[props.elevation || 0]};
  background-color: #fff;
`;

export default Paper;
