import styled from "styled-components";
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { NormalizedProperty } from "../../store/normalizers/properties";

import Button from "../common/Button";
import PropertyDeleteDialog from "./dialogs/PropertyDeleteDialog";

const ManagePropertyBarRoot = styled.div`
  display: flex;
  justify-content: end;
  padding-top: 0.75rem;
`;

type ManagePropertyBarProps = {
  property: NormalizedProperty;
};

const ManagePropertyBar: FC<ManagePropertyBarProps> = ({ property }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <ManagePropertyBarRoot>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete
        </Button>
        <Button as={Link} to="./edit">
          Edit
        </Button>
      </ManagePropertyBarRoot>
      {showDeleteModal && (
        <PropertyDeleteDialog
          open
          onClose={() => setShowDeleteModal(false)}
          property={property}
        />
      )}
    </>
  );
};

export default ManagePropertyBar;
