import styled, { css } from "styled-components";

const containedButtonStyles = css`
  color: white; // TODO: use prop.color's contrast text color
  background-color: green; // TODO: use prop.color's color

  &:disabled {
    background-color: gray; // TODO: use palette to get color (should match all disabled variants)
  }

  &:not(:disabled):hover {
    background-color: darkgreen; // TODO: use prop.color's dark color
  }
`;

const outlinedButtonStyles = css`
  --border-width: 1px;

  color: green; // TODO: use prop.color's color
  border: var(--border-width) solid lightgreen; // TODO: use prop.color's color, use 50% opacity

  // default padding - border width
  padding: calc(var(--padding-y) - var(--border-width))
    calc(var(--padding-x) - var(--border-width));

  &:disabled {
    border-color: gray; // TODO: use palette to get color (should match all disabled variants)
  }

  &:not(:disabled):hover {
    background-color: lightgreen; // TODO: use prop.color's color, use a hover opcaity
    border-color: green;
  }
`;

const textButtonStyles = css`
  color: green; // TODO: use prop.color's color

  &:disabled {
    color: gray; // TODO: use palette to get color (should match all disabled variants)
  }

  &:not(:disabled):hover {
    background-color: lightgreen; // TODO: use prop.color's color, use a hover opcaity
  }
`;

interface ButtonProps {
  color?: "primary";
  variant?: "contained" | "outlined" | "text";
}

/**
 * NOTE: To include an icon inside the button, use the `ButtonIconWrapper`
 * to wrap the icon
 */
const Button = styled.button<ButtonProps>`
  --padding-y: 0.43em;
  --padding-x: 1.14em;

  ${(props) => props.theme.typography.button}

  align-items: center;
  background: none;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius}px;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  line-height: 1.75;
  padding: var(--padding-y) var(--padding-x);
  text-decoration: none;
  transition: ${(props) => `background-color 250ms
      ${props.theme.transitions.easing.easeInOut} 0ms,
    box-shadow 250ms ${props.theme.transitions.easing.easeInOut} 0ms,
    border-color 250ms ${props.theme.transitions.easing.easeInOut}
      0ms,
    color 250ms ${props.theme.transitions.easing.easeInOut} 0ms`};

  // Add spacing between buttons next to each other
  &:not(style) + :not(style) {
    margin: 0;
    margin-left: 1rem;
  }

  &:disabled {
    cursor: auto;
  }

  ${(props) => props.variant === "contained" && containedButtonStyles}
  ${(props) => props.variant === "outlined" && outlinedButtonStyles}
  ${(props) => props.variant === "text" && textButtonStyles}
`;

Button.defaultProps = {
  color: "primary",
  variant: "contained",
};

export default Button;
