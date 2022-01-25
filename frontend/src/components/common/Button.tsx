import styled, { css } from "styled-components";

const containedButtonStyles = css<ButtonProps>`
  color: ${(props) => props.theme.palette[props.color!].contrastText};
  background-color: ${(props) => props.theme.palette[props.color!].main};

  &:disabled {
    background-color: rgba(
      0,
      0,
      0,
      ${(props) => props.theme.palette.action.disabledOpacity}
    );
  }

  &:not(:disabled):hover {
    background-color: ${(props) => props.theme.palette[props.color!].dark};
  }
`;

const outlinedButtonStyles = css<ButtonProps>`
  --border-width: 1px;

  color: ${(props) => props.theme.palette[props.color!].main};
  border: var(--border-width) solid
    hsla(var(--palette-${(props) => props.color!}-base), 50%);

  // default padding - border width
  padding: calc(var(--padding-y) - var(--border-width))
    calc(var(--padding-x) - var(--border-width));

  &:disabled {
    border-color: rgba(
      0,
      0,
      0,
      ${(props) => props.theme.palette.action.disabledOpacity}
    );
  }

  &:not(:disabled):hover {
    background-color: hsla(
      var(--palette-${(props) => props.color!}-base),
      ${(props) => props.theme.palette.action.hoverOpacity}
    );
    border-color: ${(props) => props.theme.palette[props.color!].main};
  }
`;

const textButtonStyles = css<ButtonProps>`
  color: ${(props) => props.theme.palette[props.color!].main};

  &:disabled {
    color: rgba(
      0,
      0,
      0,
      ${(props) => props.theme.palette.action.disabledOpacity}
    );
  }

  &:not(:disabled):hover {
    background-color: hsla(
      var(--palette-${(props) => props.color!}-base),
      ${(props) => props.theme.palette.action.hoverOpacity}
    );
  }
`;

interface ButtonProps {
  color?: "primary" | "error";
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
