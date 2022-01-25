import styled, { useTheme } from "styled-components";
import {
  ChangeEventHandler,
  ComponentType,
  DetailedHTMLProps,
  FC,
  InputHTMLAttributes,
  PropsWithChildren,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";

import HelperText from "./HelperText";

interface InputFieldRootProps {
  fullWidth?: boolean;
}

const InputFieldRoot = styled.div<InputFieldRootProps>`
  border: 0;
  display: inline-flex;
  flex-direction: column;
  min-width: 0;
  padding: 0;
  position: relative;
  vertical-align: top;
  width: ${(props) => props.fullWidth && "100%"};
`;

const InputLabel = styled.label`
  color: var(--color, ${(props) => props.theme.palette.text.secondary});
  font-size: 1rem;
  left: 0;
  letter-spacing: 0.00938em;
  line-height: 1.4375em;
  max-width: calc(133% - 24px);
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  text-overflow: ellipsis;
  top: 0;
  transform-origin: left top;
  transform: var(--transform, translate(14px, 16px) scale(1));
  transition: color 200ms ${(props) => props.theme.transitions.easing.easeOut}
      0ms,
    transform 200ms ${(props) => props.theme.transitions.easing.easeOut} 0ms,
    max-width 200ms ${(props) => props.theme.transitions.easing.easeOut} 0ms;
  white-space: nowrap;
  width: 100%;
  z-index: 1;
`;

interface InputRootProps {
  fullWidth?: boolean;
}

const InputRoot = styled.div<InputRootProps>`
  align-items: center;
  border-radius: ${(props) => props.theme.borderRadius}px;
  color: ${(props) => props.theme.palette.text.primary};
  cursor: text;
  display: inline-flex;
  font-size: 1rem;
  letter-spacing: 0.00938em;
  line-height: 1.4375em;
  padding: 16.5px 14px;
  position: relative;
  width: ${(props) => props.fullWidth && "100%"};
`;

const Input = styled.input`
  background: none;
  border: 0;
  box-sizing: content-box;
  color: currentcolor;
  display: block;
  font: inherit;
  height: calc(1.4375 * (var(--rows, 1) * 1em));
  letter-spacing: inherit;
  margin: 0;
  min-width: 0px;
  outline: 0;
  resize: none;
  width: 100%;
`;

const InputFieldset = styled.fieldset`
  border-color: var(
    --border-color,
    hsla(var(--palette-text-base), 0.23)
  ); // TODO: use palette text color base
  border-radius: inherit;
  border-style: solid;
  border-width: var(--border-width, 1px);
  inset: -5px 0 0;
  margin: 0;
  min-width: 0;
  outline: 0;
  overflow: hidden;
  padding: 0 8px;
  pointer-events: none;
  position: absolute;
`;

const Legend = styled.legend`
  display: block;
  float: unset;
  font-size: 0.75em;
  height: 11px;
  max-width: var(--max-width, 0.01px);
  padding: 0;
  transition: max-width var(--transition-delay, 50ms)
    ${(props) => props.theme.transitions.easing.easeOut}
    var(--transition-duration, 0);
  visibility: hidden;
  white-space: nowrap;
  width: auto;

  & > span {
    padding: 0 5px;
    display: inline-block;
  }
`;

interface InputFieldProps {
  // Indicates if there is an error for this input field
  error?: boolean;

  // If the input should be full width
  fullWidth?: boolean;

  helperText?: string;
  id: string;
  inputProps?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > &
    DetailedHTMLProps<
      TextareaHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    > & { as?: string | ComponentType<any> };

  // The label text for the input
  label: string;

  name?: string;

  // Called when the input's value changes
  onChange: ChangeEventHandler<HTMLInputElement>;
  // The input's value
  value: string | number;

  required?: boolean;
}

const InputField: FC<PropsWithChildren<InputFieldProps>> = ({
  children,
  error,
  fullWidth,
  helperText,
  id,
  inputProps,
  label,
  name,
  onChange,
  required,
  value,
}) => {
  const theme = useTheme();

  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(Boolean(inputRef.current?.value));
  }, [value]);

  return (
    <InputFieldRoot fullWidth={fullWidth}>
      <InputLabel
        id={`${id}-label`}
        htmlFor={name || id}
        style={{
          // TODO: implement theme colors (error, focused)
          ["--color" as any]: error
            ? theme.palette.error.main
            : focused && theme.palette.primary.main,
          ["--transform" as any]:
            (focused || hasValue) && "translate(14px, -9px) scale(0.75)",
        }}
      >
        {label}
        {required && <span>*</span>}
      </InputLabel>
      <InputRoot
        fullWidth={fullWidth}
        onClick={() => inputRef.current?.focus()}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Input
          {...inputProps}
          ref={inputRef}
          id={id}
          name={name || id}
          value={value}
          onChange={onChange}
          required={required}
          style={{
            ["--rows" as any]: inputProps?.rows,
          }}
        >
          {children}
        </Input>
        <InputFieldset
          style={{
            ["--border-color" as any]: error
              ? theme.palette.error.main
              : focused
              ? theme.palette.primary.main
              : hovered && theme.palette.text.primary,
            ["--border-width" as any]: focused && "2px",
          }}
        >
          <Legend
            style={{
              ["--max-width" as any]: (focused || hasValue) && "100%",
              ["--transition-delay" as any]: focused && "50ms",
              ["--transition-duration" as any]: focused && "100ms",
            }}
          >
            <span>
              {label}
              {required && "*"}
            </span>
          </Legend>
        </InputFieldset>
      </InputRoot>
      {helperText && (
        <HelperText error={error} showIcon={error}>
          {helperText}
        </HelperText>
      )}
    </InputFieldRoot>
  );
};

export default InputField;
