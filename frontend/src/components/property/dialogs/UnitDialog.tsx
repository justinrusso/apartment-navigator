import { FC, FormEvent, useState } from "react";

import Button from "../../common/Button";
import Dialog from "../../common/Dialog";
import DialogActions from "../../common/DialogActions";
import DialogContent from "../../common/DialogContent";
import DialogTitle from "../../common/DialogTitle";
import Grid from "../../common/Grid";
import InputField from "../../common/InputField";
import useFormFields from "../../../hooks/form-fields";
import { PropertyUnitEditorDialogProps } from ".";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
  addPropertyUnit,
  selectPropertyUnit,
  updatePropertyUnit,
} from "../../../store/properties";
import {
  NormalizedProperty,
  NormalizedPropertyUnit,
} from "../../../store/normalizers/properties";
import { BATH_OPTIONS } from "..";
import { selectUnitCategories } from "../../../store/units";
import { CreatePropertyUnitData } from "../../../api/units";

const getDefaultState = (unit?: NormalizedPropertyUnit) => {
  if (!unit) {
    return {
      unitNum: "",
      unitCategoryId: "",
      baths: "",
      price: "",
      sqFt: "",
      floorPlanImg: "",
    };
  }
  return {
    unitNum: unit.unitNum || "",
    unitCategoryId: String(unit.unitCategory.id) || "",
    baths: String(unit.baths) || "",
    price: String(unit.price.price) || "",
    sqFt: String(unit.sqFt) || "",
    floorPlanImg: unit.floorPlanImg || "",
  };
};

interface UnitDialogProps extends Omit<PropertyUnitEditorDialogProps, "unit"> {
  property: NormalizedProperty;
  unitId: number;
}

const UnitDialog: FC<UnitDialogProps> = ({
  onClose,
  open,
  property,
  unitId,
}) => {
  const singleUnit = property.category.id === 1;

  const dispatch = useAppDispatch();

  const unit: NormalizedPropertyUnit | undefined = useAppSelector(
    selectPropertyUnit(unitId)
  );
  const unitCategories = useAppSelector(selectUnitCategories());

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { fields, getChangedFields, prestine, setField } = useFormFields(
    getDefaultState(unit)
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (prestine) {
      onClose();
      return;
    }

    const data = getChangedFields();

    try {
      if (unit) {
        await dispatch(updatePropertyUnit({ data, unitId: unit.id })).unwrap();
      } else {
        await dispatch(
          addPropertyUnit({
            data: data as CreatePropertyUnitData,
            propertyId: property.id,
          })
        ).unwrap();
      }

      onClose();
    } catch (errors) {
      setErrors(errors as Record<string, string>);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {unit ? `Edit Unit ${unit.unitNum || ""}` : "Add New Unit"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid spacing="0.75rem">
            {!singleUnit && (
              <Grid item sm={6} md={4}>
                <InputField
                  fullWidth
                  label="Unit"
                  id={`property-unit-number`}
                  value={fields.unitNum}
                  onChange={(e) => setField("unitNum", e.target.value)}
                  inputProps={{
                    type: "text",
                  }}
                  required={!singleUnit}
                  error={!!errors.unitNum}
                  helperText={errors.unitNum}
                />
              </Grid>
            )}
            <Grid item sm={6} md={4}>
              <InputField
                fullWidth
                label="Beds"
                id={`property-unit-beds`}
                value={fields.unitCategoryId}
                onChange={(e) => setField("unitCategoryId", e.target.value)}
                inputProps={{
                  as: "select",
                }}
                required
                error={!!errors.unitCategoryId}
                helperText={errors.unitCategoryId}
              >
                <option value="" />
                {unitCategories.map((category) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.name}
                  </option>
                ))}
              </InputField>
            </Grid>
            <Grid item sm={6} md={4}>
              <InputField
                fullWidth
                label="Baths"
                id={`property-unit-baths`}
                value={fields.baths}
                onChange={(e) => setField("baths", e.target.value)}
                inputProps={{
                  as: "select",
                }}
                required
                error={!!errors.baths}
                helperText={errors.baths}
              >
                <option value="" />
                {BATH_OPTIONS.map((bathOption) => (
                  <option key={bathOption} value={bathOption * 100}>
                    {bathOption}
                  </option>
                ))}
              </InputField>
            </Grid>
            <Grid item sm={6} md={4}>
              <InputField
                fullWidth
                label="Price"
                id={`property-unit-price`}
                value={fields.price}
                onChange={(e) => setField("price", e.target.value)}
                inputProps={{
                  type: "number",
                }}
                required
                error={!!errors.price}
                helperText={errors.price}
              />
            </Grid>
            <Grid item sm={6} md={4}>
              <InputField
                fullWidth
                label="Sq Ft"
                id={`property-unit-sqft`}
                value={fields.sqFt}
                onChange={(e) => setField("sqFt", e.target.value)}
                inputProps={{
                  type: "number",
                }}
                required
                error={!!errors.sqFt}
                helperText={errors.sqFt}
              />
            </Grid>
            <Grid item sm={6}>
              <InputField
                fullWidth
                label="Floor Plan Image Url"
                id={`property-unit-floor-plan-img`}
                value={fields.floorPlanImg}
                onChange={(e) => setField("floorPlanImg", e.target.value)}
                inputProps={{
                  type: "text",
                }}
                error={!!errors.floorPlanImg}
                helperText={errors.floorPlanImg}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="text" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button>Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UnitDialog;
