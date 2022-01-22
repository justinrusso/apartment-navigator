import styled, { DefaultTheme } from "styled-components";

function getComponentTag({ as, variant }: { as?: string; variant?: string }) {
  if (as) {
    return as;
  }

  switch (variant) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "button":
      return "span";
    default:
      return;
  }
}

interface TypographyProps {
  color?: "inherit"; // TODO: support palette colors
  gutterBottom?: boolean;
  variant?: keyof DefaultTheme["typography"];
}

const Typography = styled.p.attrs(
  (props: TypographyProps & { as?: string }) => {
    return {
      ...props,
      as: getComponentTag({
        as: props.as,
        variant: props.variant,
      }),
    };
  }
)<TypographyProps>`
  ${(props) => props.theme.typography[props.variant || "body1"]}
  color: ${(props) =>
    props.color === "inherit"
      ? "inherit"
      : "black"}; // TODO: use primary text palette color
  margin: 0;

  margin-bottom: ${(props) => props.gutterBottom && "0.35em"};
`;

Typography.defaultProps = {
  gutterBottom: false,
  variant: "body1",
};

export default Typography;
