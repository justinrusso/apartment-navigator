import styled, { css } from "styled-components";

const containerCSS = css<GridProps>`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: ${(props) => props.spacing && props.spacing};
  column-gap: ${(props) => props.columnSpacing && props.columnSpacing};
  row-gap: ${(props) => props.rowSpacing && props.rowSpacing};
`;

const itemCSS = css<GridProps>`
  grid-column: span 12;

  ${(props) =>
    props.xs &&
    css`
      ${props.theme.breakpoints.up("xs", props.theme)} {
        grid-column: span ${props.xs};
      }
    `}

  ${(props) =>
    props.sm &&
    css`
      ${props.theme.breakpoints.up("sm", props.theme)} {
        grid-column: span ${props.sm};
      }
    `}

  ${(props) =>
    props.md &&
    css`
      ${props.theme.breakpoints.up("md", props.theme)} {
        grid-column: span ${props.md};
      }
    `}

  ${(props) =>
    props.lg &&
    css`
      ${props.theme.breakpoints.up("lg", props.theme)} {
        grid-column: span ${props.lg};
      }
    `}

  ${(props) =>
    props.xl &&
    css`
      ${props.theme.breakpoints.up("xl", props.theme)} {
        grid-column: span ${props.xl};
      }
    `}
`;

type ColumnSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface GridProps {
  item?: boolean;
  spacing?: string;
  columnSpacing?: string;
  rowSpacing?: string;
  xs?: ColumnSpan;
  sm?: ColumnSpan;
  md?: ColumnSpan;
  lg?: ColumnSpan;
  xl?: ColumnSpan;
}

const Grid = styled.div<GridProps>`
  ${(props) => (props.item ? itemCSS : containerCSS)};
`;

export default Grid;
