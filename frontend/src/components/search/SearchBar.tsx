import styled from "styled-components";
import { FC, FormEventHandler, useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchBarForm = styled.form`
  background-color: hsla(var(--palette-primary-base), 8%);
  border-radius: ${(props) => props.theme.borderRadius}px;
  color: ${(props) => props.theme.palette.text.primary};
  position: relative;
  width: 100%;

  &:hover {
    background-color: hsla(var(--palette-primary-base), 13%);
  }
`;

const SearchIconButton = styled.button`
  align-items: center;
  background: none;
  border: 0;
  color: ${(props) => props.theme.palette.primary.dark};
  cursor: pointer;
  display: flex;
  height: 100%;
  justify-content: center;
  outline: 0;
  padding: 0 1rem;
  position: absolute;

  &:disabled {
    color: ${(props) => props.theme.palette.primary.light};
    cursor: none;
    pointer-events: none;
  }
`;

const Input = styled.input`
  color: inherit;
  background: none;
  border: none;
  outline: none;
  width: 100%;
  padding: 0.5rem 0.5rem 0.5rem 0;
  padding-left: calc(1em + 2rem);
  transition: width 300ms ${(props) => props.theme.transitions.easing.easeInOut};
`;

type SearchBarProps = {
  className?: string;
};

const SearchBar: FC<SearchBarProps> = ({ className }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("key") || "");

  useEffect(() => {
    setSearch(searchParams.get("key") || "");
  }, [searchParams]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.set("key", search);

    navigate(`/search?${params.toString()}`);
  };

  return (
    <SearchBarForm className={className} onSubmit={handleSubmit}>
      <SearchIconButton disabled={!search} type="submit">
        <MdSearch />
      </SearchIconButton>
      <Input
        placeholder="Search by property name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </SearchBarForm>
  );
};

export default SearchBar;
