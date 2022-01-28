import styled from "styled-components";
import { FC, MouseEventHandler, useEffect, useRef, useState } from "react";
import { MdMoreVert } from "react-icons/md";

import IconButton from "../common/IconButton";
import Paper from "../common/Paper";
import RatingStars from "./RatingStars";
import Typography from "../common/Typography";
import { ReviewData } from "../../api/reviews";
import { createPortal } from "react-dom";
import MenuItem from "../common/MenuItem";
import MenuList from "../common/MenuList";
import { useFloating, arrow } from "@floating-ui/react-dom";

const ReviewCardRoot = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.25rem;

  .top-section {
    display: flex;
    justify-content: space-between;
  }
`;

const Arrow = styled.div`
  position: absolute;
  background: ${(props) => props.theme.palette.background};
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
`;

type ReviewCardProps = {
  editable?: boolean;
  review: ReviewData;
  showEditModal: () => void;
};

const ReviewCard: FC<ReviewCardProps> = ({
  editable,
  review,
  showEditModal,
}) => {
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
    strategy,
    x: menuX,
    y: menuY,
  } = useFloating({
    placement: "bottom",
    middleware: [arrow({ element: arrowRef })],
  });

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

  const date = new Date(review.updatedAt);
  return (
    <>
      <ReviewCardRoot elevation={4}>
        <div className="top-section">
          <div>
            <Typography gutterBottom as="span">
              <RatingStars rating={review.rating} size="medium" disableInput />
            </Typography>
            <Typography gutterBottom variant="body2">
              {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Typography>
          </div>
          {editable && (
            <div>
              <IconButton onClick={handleButtonClick} ref={reference}>
                <MdMoreVert />
              </IconButton>
            </div>
          )}
        </div>
        <Typography>{review.comment}</Typography>
      </ReviewCardRoot>
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
              <MenuItem onClick={showEditModal}>Edit</MenuItem>
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

export default ReviewCard;
