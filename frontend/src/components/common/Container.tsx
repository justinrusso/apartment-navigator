import { FC, PropsWithChildren } from "react";
import styled from "styled-components";

const ContainerRoot = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ContainerInner = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  width: 100%;

  ${(props) => props.theme.breakpoints.up("sm", props.theme)} {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  ${(props) => props.theme.breakpoints.up("md", props.theme)} {
    padding-left: 2.25rem;
    padding-right: 2.25rem;
  }

  ${(props) => props.theme.breakpoints.up("lg", props.theme)} {
    max-width: 1400px;
  }
`;

const Container: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <ContainerRoot>
      <ContainerInner>{children}</ContainerInner>
    </ContainerRoot>
  );
};

export default Container;
