import styled from "styled-components";
import { FC, FormEvent, useEffect, useMemo, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useImmer } from "use-immer";

import Button from "../common/Button";
import Container from "../common/Container";
import DropperInput from "../dropper/DropperInput";
import Grid from "../common/Grid";
import HelperText from "../common/HelperText";
import IconButton from "../common/IconButton";
import InputField from "../common/InputField";
import Paper from "../common/Paper";
import PropertyCategoryInput from "./PropertyCategoryInput";
import PropertyUnitInputGroup from "./PropertyUnitInputGroup";
import Typography from "../common/Typography";
import { addProperty } from "../../store/properties";
import { useAppDispatch } from "../../hooks/redux";
import { useNavigate } from "react-router-dom";
import { CreatePropertyData } from "../../api/properties";

const ContentWrapper = styled.div`
  padding: 2rem 0;

  .main-content {
    padding: 4rem 1rem;

    .form-content-wrapper {
      width: 100%;

      ${(props) => props.theme.breakpoints.up("sm", props.theme)} {
        max-width: 75%;
      }

      ${(props) => props.theme.breakpoints.up("md", props.theme)} {
        max-width: 50%;
      }

      form {
        text-align: left;
      }

      .form-title {
        text-align: center;
      }

      h3 {
        padding-top: 1.75rem;
      }
    }

    ${Button}[type="submit"] {
      --padding-y: 0.45em;
      margin-top: 1.5rem;
      width: 100%;
    }
  }

  .centered {
    display: flex;
    justify-content: center;
  }
`;

const Image = styled.div`
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 62.5%;
  position: relative;
  width: 100%;

  .delete-button {
    position: absolute;
    top: 8px;
    right: 8px;
  }
`;

const ImagePlaceholder = styled(Image)`
  background-color: ${(props) => props.theme.palette.divider};
  cursor: pointer;

  > .placeholder-inner {
    align-items: center;
    display: flex;
    flex-direction: column;
    inset: 0;
    justify-content: center;
    position: absolute;
  }
`;

interface PropertyCreatorFormErrors {
  name?: string[];
  address1?: string[];
  address2?: string[];
  city?: string[];
  state?: string[];
  zipCode?: string[];
  images?: string[][];
  units?: {
    unitNum: string[];
    unitCategoryId: string[];
    baths: string[];
    price: string[];
    sqFt: string[];
    floorPlanImg: string[];
  }[];
  builtInYear?: string[];
  categoryId?: string[];
}

const PropertyCreator: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<PropertyCreatorFormErrors>({});

  const [name, setName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [units, setUnits] = useImmer<
    Exclude<CreatePropertyData["units"], undefined>
  >([
    {
      unitNum: "",
      unitCategoryId: "",
      baths: "",
      price: "",
      sqFt: "",
      floorPlanImg: "",
    },
  ]);

  const [builtInYear, setBuiltInYear] = useState("");
  const [categoryId, setCategoryId] = useState("1");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(
      addProperty({
        name,
        address1,
        address2,
        city,
        state,
        zipCode,
        builtInYear,
        categoryId,
        images,
        units,
      })
    )
      .unwrap()
      .then(() => navigate("/"))
      .catch((errors) => setErrors(errors));
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddUnit = () => {
    setUnits((draft) => {
      draft.push({
        unitNum: "",
        unitCategoryId: "",
        baths: "",
        price: "",
        sqFt: "",
        floorPlanImg: "",
      });
    });
  };

  const previews = useMemo(() => {
    return images.map((image) => URL.createObjectURL(image));
  }, [images]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  return (
    <Container>
      <ContentWrapper>
        <Paper elevation={4} className="main-content">
          <div className="centered">
            <form className="form-content-wrapper" onSubmit={handleSubmit}>
              <Typography variant="h2" className="form-title">
                Add Your Property
              </Typography>
              <section>
                <Typography variant="h3" gutterBottom>
                  Property Location
                </Typography>
                <Grid columnSpacing="1rem" rowSpacing="1.25rem">
                  <Grid item>
                    <InputField
                      label="Address"
                      fullWidth
                      id="property-address1"
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                      inputProps={{
                        type: "text",
                      }}
                      error={!!errors.address1}
                      helperText={errors.address1?.join(" ")}
                      required
                    />
                  </Grid>
                  <Grid item>
                    <InputField
                      label="Address Secondary"
                      fullWidth
                      id="property-address2"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      inputProps={{
                        type: "text",
                      }}
                      error={!!errors.address2}
                      helperText={errors.address2?.join(" ")}
                    />
                  </Grid>
                  <Grid item sm={6}>
                    <InputField
                      label="City"
                      fullWidth
                      id="property-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      inputProps={{
                        type: "text",
                      }}
                      error={!!errors.city}
                      helperText={errors.city?.join(" ")}
                      required
                    />
                  </Grid>
                  <Grid item sm={6}>
                    <InputField
                      label="State"
                      fullWidth
                      id="property-state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      inputProps={{
                        type: "text",
                      }}
                      error={!!errors.state}
                      helperText={errors.state?.join(" ")}
                      required
                    />
                  </Grid>
                  <Grid item sm={6}>
                    <InputField
                      label="Zip Code"
                      fullWidth
                      id="property-zipcode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      inputProps={{
                        type: "text",
                      }}
                      error={!!errors.zipCode}
                      helperText={errors.zipCode?.join(" ")}
                      required
                    />
                  </Grid>
                </Grid>
              </section>
              <section>
                <Typography variant="h3" gutterBottom>
                  Property Details
                </Typography>
                <Grid columnSpacing="1rem" rowSpacing="1.25rem">
                  <Grid item>
                    <PropertyCategoryInput
                      value={categoryId}
                      onChange={setCategoryId}
                    />
                  </Grid>
                  <Grid item>
                    <InputField
                      label="Property Name"
                      fullWidth
                      id="property-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      inputProps={{
                        type: "text",
                      }}
                      error={!!errors.name}
                      helperText={errors.name?.join(" ")}
                    />
                  </Grid>
                  <Grid item sm={6}>
                    <InputField
                      label="Year Built"
                      fullWidth
                      id="property-builtInYear"
                      value={builtInYear}
                      onChange={(e) => setBuiltInYear(e.target.value)}
                      inputProps={{
                        type: "number",
                      }}
                      error={!!errors.builtInYear}
                      helperText={
                        errors.builtInYear?.join(" ") ||
                        "The year the property was built"
                      }
                      required
                    />
                  </Grid>
                </Grid>
              </section>
              <section>
                <Typography variant="h3" gutterBottom>
                  Property Images
                </Typography>
                <Grid columnSpacing="0.75rem" rowSpacing="0.75rem">
                  {previews.map((preview, i) => (
                    <Grid item xs={6} key={i}>
                      <Image style={{ backgroundImage: `url(${preview})` }}>
                        <IconButton
                          className="delete-button"
                          color="error"
                          type="button"
                          variant="contained"
                          onClick={() => handleRemoveImage(i)}
                        >
                          <MdDelete />
                        </IconButton>
                      </Image>
                      {(errors.images?.[i]?.length || 0) > 0 && (
                        <HelperText showIcon error>
                          {errors.images?.[i].join(" ")}
                        </HelperText>
                      )}
                    </Grid>
                  ))}
                  <Grid item xs={6}>
                    <DropperInput
                      accept={[
                        "image/avif",
                        "image/gif",
                        "image/jpeg",
                        "image/png",
                        "image/webp",
                      ]}
                      multiple
                      onDrop={(acceptedFiles) => {
                        setImages([...images, ...acceptedFiles]);
                      }}
                      placeholder={
                        <ImagePlaceholder>
                          <div className="placeholder-inner">
                            <Typography variant="h5" as="p" gutterBottom>
                              Drag & Drop
                            </Typography>
                            <Typography gutterBottom>or</Typography>
                            <Typography variant="h5" as="p" gutterBottom>
                              Click to Add Image
                            </Typography>
                          </div>
                        </ImagePlaceholder>
                      }
                    />
                  </Grid>
                </Grid>
              </section>
              <section>
                <Typography variant="h3" gutterBottom>
                  Property Unit Details
                </Typography>
                <div>
                  {units.map((unit, i) => (
                    <PropertyUnitInputGroup
                      key={i}
                      id={i}
                      unit={unit}
                      singleUnit={categoryId === "1"}
                      unitCount={units.length}
                      onChange={(key, newValue) =>
                        setUnits((draft) => {
                          draft[i][key] = newValue;
                        })
                      }
                      onDelete={() =>
                        setUnits((draft) => {
                          draft.splice(i, 1);
                        })
                      }
                      errors={errors.units?.[i]}
                    />
                  ))}
                </div>
                {categoryId !== "1" && (
                  <Button
                    className="add-unit-button"
                    type="button"
                    onClick={handleAddUnit}
                  >
                    Add Another Unit
                  </Button>
                )}
              </section>
              <Button type="submit">Add My Property</Button>
            </form>
          </div>
        </Paper>
      </ContentWrapper>
    </Container>
  );
};

export default PropertyCreator;
