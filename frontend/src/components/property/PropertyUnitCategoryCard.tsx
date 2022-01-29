import styled from "styled-components";
import { FC, useState } from "react";

import Button from "../common/Button";
import Dialog from "../common/Dialog";
import Paper from "../common/Paper";
import Typography from "../common/Typography";
import { NormalizedPropertyUnit } from "../../store/normalizers/properties";
import { currencyFormatter, sqFtFormatter } from "./utils";

const CardRoot = styled(Paper)`
  padding: 1rem;

  table {
    min-width: 650px;
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;

    thead,
    tbody {
      text-align: right;
    }

    thead > * {
      font-family: "Roboto", "Helvetica", "Arial", sans-serif;
      font-weight: 500;
      font-size: 0.875rem;
      line-height: 1.5rem;
      letter-spacing: 0.01071em;
      vertical-align: middle;
      border-bottom: 1px solid rgba(224, 224, 224, 1);
    }
    tbody > * {
      font-family: "Roboto", "Helvetica", "Arial", sans-serif;
      font-weight: 400;
      font-size: 0.875rem;
      line-height: 1.43;
      letter-spacing: 0.01071em;
      vertical-align: middle;
      border-bottom: 1px solid rgba(224, 224, 224, 1);
    }

    tbody > *:last-child {
      border: none;
    }

    th,
    td {
      padding: 1rem;
    }

    th:first-child {
      text-align: left;
    }
  }
`;

interface PropertyUnitCardProps {
  className?: string;
  units: NormalizedPropertyUnit[];
}

const PropertyUnitCategoryCard: FC<PropertyUnitCardProps> = ({
  className,
  units,
}) => {
  const unitCategory = units[0]?.unitCategory.name;

  const [selectedUnitId, setSelectedUnitId] = useState(0);

  return (
    <CardRoot elevation={3} className={className}>
      <Typography variant="h3" gutterBottom>
        {unitCategory}
      </Typography>
      <table>
        <thead>
          <tr>
            <th>Unit #</th>
            <th>Baths</th>
            <th>Price</th>
            <th>Sq Ft</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.id}>
              <th>{unit.unitNum}</th>
              <td>{unit.baths / 100}</td>
              <td>{currencyFormatter.format(unit.price.price)}</td>
              <td>{sqFtFormatter.format(unit.sqFt)}</td>
              <td>
                {unit.floorPlanImg && (
                  <Button onClick={() => setSelectedUnitId(unit.id)}>
                    View Floor Plan
                  </Button>
                )}
              </td>
              {unit.floorPlanImg && selectedUnitId === unit.id && (
                <Dialog
                  open
                  onClose={() => setSelectedUnitId(0)}
                  fullWidth
                  maxWidth="md"
                >
                  <img src={unit.floorPlanImg} alt="floor plan" />
                </Dialog>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </CardRoot>
  );
};

export default PropertyUnitCategoryCard;
