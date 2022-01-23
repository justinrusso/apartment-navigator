import { FC, MouseEventHandler, useEffect, useRef, useState } from "react";
import { MdAccountCircle, MdLogout } from "react-icons/md";
import { createPortal } from "react-dom";
import { arrow, getScrollParents, useFloating } from "@floating-ui/react-dom";

import Button from "../common/Button";
import ButtonIconWrapper from "../common/ButtonIconWrapper";
import MenuItem from "../common/MenuItem";
import MenuList from "../common/MenuList";
import Paper from "../common/Paper";
import { logoutUser, selectUser } from "../../store/user";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import styled from "styled-components";
import MenuListIconWrapper from "../common/MenuListIconWrapper";

const Arrow = styled.div`
  position: absolute;
  background: white; // TODO: use palette color
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
`;

const ProfileButton: FC = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser())!;

  const [menuVisible, setMenuVisible] = useState(false);

  // When menu is open, listen for document click events to close the menu
  useEffect(() => {
    if (!menuVisible) {
      return;
    }
    const listener = () => setMenuVisible(false);
    document.addEventListener("click", listener);

    return () => document.removeEventListener("click", listener);
  }, [menuVisible]);

  const arrowRef = useRef(null);
  const {
    floating,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
    placement,
    reference,
    refs,
    strategy,
    update,
    x: menuX,
    y: menuY,
  } = useFloating({
    placement: "bottom",
    middleware: [arrow({ element: arrowRef })],
  });

  // Update on scroll and resize for all relevant nodes
  useEffect(() => {
    if (!menuVisible || !refs.reference.current || !refs.floating.current) {
      return;
    }

    const parents = [
      ...getScrollParents(refs.reference.current),
      ...getScrollParents(refs.floating.current),
    ];

    parents.forEach((parent) => {
      parent.addEventListener("scroll", update);
      parent.addEventListener("resize", update);
    });

    return () => {
      parents.forEach((parent) => {
        parent.removeEventListener("scroll", update);
        parent.removeEventListener("resize", update);
      });
    };
  }, [menuVisible, refs.reference, refs.floating, update]);

  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[placement.split("-")[0]];

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setMenuVisible((prev) => !prev);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  return (
    <>
      <Button variant="text" ref={reference} onClick={handleButtonClick}>
        <ButtonIconWrapper position="start">
          <MdAccountCircle />
        </ButtonIconWrapper>
        {user.firstName} {user.lastName}
      </Button>
      {menuVisible &&
        createPortal(
          <Paper
            elevation={0}
            ref={floating}
            style={{
              position: strategy,
              top: menuY ?? "",
              left: menuX ?? "",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            }}
          >
            <MenuList>
              <MenuItem onClick={handleLogout}>
                <MenuListIconWrapper>
                  <MdLogout />
                </MenuListIconWrapper>
                Log out
              </MenuItem>
            </MenuList>
            <Arrow
              ref={arrowRef}
              style={{
                top: arrowY ?? "",
                left: arrowX ?? "",
                [staticSide as string]: "-4px",
              }}
            />
          </Paper>,
          document.body
        )}
    </>
  );
};

export default ProfileButton;
