import styled from "styled-components";
import { FC } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { MdCode, MdPerson } from "react-icons/md";

import Container from "./common/Container";
import IconButton from "./common/IconButton";
import Typography from "./common/Typography";
import { underlinedLink } from "../theme/mixins";

const FooterRoot = styled.footer`
  padding: 3rem 0;
  border-top: 1px solid ${(props) => props.theme.palette.divider};

  .inner-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .author {
    color: ${(props) => props.theme.palette.text.secondary};

    a {
      color: ${(props) => props.theme.palette.primary.light};
      ${underlinedLink}
    }
  }
`;

const Footer: FC = () => {
  return (
    <FooterRoot>
      <Container>
        <div className="inner-wrapper">
          <div>
            <Typography as="p" variant="h4">
              Apartment Navigator
            </Typography>
            <Typography className="author">
              Designed & Developed by{" "}
              <a
                href="https://justinrusso.dev"
                target="_blank"
                rel="noreferrer"
              >
                Justin Russo
              </a>
            </Typography>
          </div>
          <div>
            <IconButton as="a" href="https://justinrusso.dev" target="_blank">
              <MdPerson />
            </IconButton>
            <IconButton
              as="a"
              href="https://www.linkedin.com/in/justin-k-russo/"
              target="_blank"
            >
              <FaLinkedinIn />
            </IconButton>
            <IconButton
              as="a"
              href="https://github.com/justinrusso/"
              target="_blank"
            >
              <FaGithub />
            </IconButton>
            <IconButton
              as="a"
              href="https://github.com/justinrusso/apartment-navigator/"
              target="_blank"
            >
              <MdCode />
            </IconButton>
          </div>
        </div>
      </Container>
    </FooterRoot>
  );
};

export default Footer;
