import styled from "styled-components";
import { FC } from "react";

import Paper from "../common/Paper";
import Typography from "../common/Typography";
import { NormalizedPropertyUnit } from "../../store/normalizers/properties";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const sqFtFormatter = new Intl.NumberFormat("en-US", {});

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
            <tr>
              <th>{unit.unitNum}</th>
              <td>{unit.baths / 100}</td>
              <td>{currencyFormatter.format(unit.price.price)}</td>
              <td>{sqFtFormatter.format(unit.sqFt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardRoot>
  );
};

export default PropertyUnitCategoryCard;
