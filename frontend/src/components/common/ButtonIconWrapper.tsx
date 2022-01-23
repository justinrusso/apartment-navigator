import styled from "styled-components";

interface ButtonIconWrapperProps {
  position: "start" | "end";
}

const ButtonIconWrapper = styled.span<ButtonIconWrapperProps>`
  display: inherit;
  margin-right: ${(props) =>
    props.position === "start" ? "0.5ch" : "-0.25ch"};
  margin-left: ${(props) => (props.position === "start" ? "-0.25ch" : "0.5ch")};

  & > *:nth-of-type(1) {
    display: inline-block;
    font-size: 1.43em;
  }
`;

export default ButtonIconWrapper;
