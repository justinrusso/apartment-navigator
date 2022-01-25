import styled, { useTheme } from "styled-components";
import { FaExclamationCircle } from "react-icons/fa";
import { FC, PropsWithChildren } from "react";

const HelperTextWrapper = styled.p`
  color: var(--color, ${(props) => props.theme.palette.text.secondary});
  font-size: 0.75rem;
  letter-spacing: 0.03333em;
  line-height: 1.66;
  margin: 3px 14px 0;
`;

const HelperTextIcon = styled(FaExclamationCircle)`
  display: inline-block;
  margin-right: 8px;
  margin-left: -10px;
  width: 1em;
`;

interface HelperTextProps {
  className?: string;
  error?: boolean;
  showIcon?: boolean;
}

const HelperText: FC<PropsWithChildren<HelperTextProps>> = ({
  children,
  className,
  error,
  showIcon,
}) => {
  const theme = useTheme();
  return (
    <HelperTextWrapper
      className={className}
      style={{
        ["--color" as any]: error && theme.palette.error.main,
      }}
    >
      {showIcon && <HelperTextIcon />}
      {children}
    </HelperTextWrapper>
  );
};

export default HelperText;
