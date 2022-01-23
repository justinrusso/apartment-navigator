import styled from "styled-components";

interface MenuItemProps {
  notInteractive?: boolean;
}

const MenuItem = styled.li<MenuItemProps>`
  align-items: center;
  appearance: none;
  background-color: transparent;
  border: 0;
  color: inherit;
  display: flex;
  justify-content: flex-start;
  margin: 0;
  outline: 0;
  padding: 0.375rem 1rem;
  text-decoration: none;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;

  ${(props) =>
    !props.notInteractive && {
      cursor: "pointer",

      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.04)", // TODO: Use action hover color from palette
        textDecoration: "none",
      },
    }}
`;

export default MenuItem;
