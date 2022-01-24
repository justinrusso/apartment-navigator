import styled from "styled-components";
import { FC, FormEvent, useState } from "react";
import { MdDelete } from "react-icons/md";

import Button from "../common/Button";
import Container from "../common/Container";
import Grid from "../common/Grid";
import IconButton from "../common/IconButton";
import InputField from "../common/InputField";
import Paper from "../common/Paper";
import PropertyCategoryInput from "./PropertyCategoryInput";
import Typography from "../common/Typography";
import { addProperty } from "../../store/properties";
import { useAppDispatch } from "../../hooks/redux";
import { useNavigate } from "react-router-dom";

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

    .add-image-wrapper {
      display: flex;
      align-items: center;
      padding-top: 1rem;
      gap: 1rem;
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
    color: red;
    position: absolute;
    top: 8px;
    right: 8px;
  }
`;

const PropertyCreator: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

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
      })
    )
      .unwrap()
      .then(() => navigate("/"))
      .catch((errors) => setErrors(errors));
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    setImages([...images, newImageUrl]);
    setNewImageUrl("");
  };

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
                      helperText={errors.address1}
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
                      helperText={errors.address2}
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
                      helperText={errors.city}
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
                      helperText={errors.state}
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
                      helperText={errors.zipCode}
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
                      helperText={errors.name}
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
                        errors.builtInYear || "The year the property was built"
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
                  {images.map((imageUrl, i) => (
                    <Grid item xs={6} key={i}>
                      <Image style={{ backgroundImage: `url(${imageUrl})` }}>
                        <IconButton
                          className="delete-button"
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                        >
                          <MdDelete />
                        </IconButton>
                      </Image>
                    </Grid>
                  ))}
                </Grid>
                <div className="add-image-wrapper">
                  <InputField
                    label="Image Url"
                    id="property-add-image-url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    inputProps={{
                      type: "text",
                    }}
                  />
                  <Button type="button" onClick={handleAddImage}>
                    Add Image
                  </Button>
                </div>
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
