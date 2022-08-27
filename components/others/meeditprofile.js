import {
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import useSWR from "swr";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import axios from "axios";
import { forIn, get, trim } from "lodash";
import { getAwsUrl, removeAwsUrl, useAuthUser } from "../../lib/utility";
import PropTypes from "prop-types";
import { IMaskInput } from "react-imask";
import SaveIcon from "@mui/icons-material/Save";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isLoading_ } from "../../lib/recoil";

const fetcher = async (key) => {
  try {
    const usernames = await axios.get(key);
    return usernames.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  // @ts-ignore
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(+#00) 0000000000"
      definitions={{
        "#": /[1-9]/,
      }}
      // @ts-ignore
      inputRef={ref}
      // @ts-ignore
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

TextMaskCustom.propTypes = {
  // @ts-ignore
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function EditProfile() {
  const [loadingState, setLoading] = useRecoilState(isLoading_);
  const { user, loading, error, mutate } = useAuthUser();

  const { data: usernames, error: usernamesError } = useSWR(
    user?.username ? undefined : "/api/getusernames/",
    fetcher
  );

  console.log("usernames", usernames, usernamesError, user);

  const schema = yup.object().shape({
    username: yup
      .string()
      .trim("")
      .lowercase("")
      .required("")
      .nope((usernames || []).map((username) => trim(username.toLowerCase()))),
  });

  const imageTemplate = {
    blob: "",
    file: null,
    image: "",
  };

  const defaultValues = {
    firstName: get(user, "firstName", ""),
    image: { ...imageTemplate, image: get(user, "image", "") },
    lastName: get(user, "lastName", ""),
    username: get(user, "username", ""),
    gender: get(user, "gender", ""),
    phone: get(user, "phone", ""),
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    setError,
    clearErrors,
    trigger,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });
  // const { mutate } = useSWRConfig

  // const [image, setImage] = React.useState(imageTemplate);

  const updateProfileImage = (e) => {
    const file = e.target.files[0];
    const imgBlob = URL.createObjectURL(file);
    let img = { ...watch("image") };
    img.blob = imgBlob;
    img.file = file;
    img.image = "";
    console.log("img", img);
    setValue("image", { ...img });
  };

  const deleteProfileImage = () => {
    if (watch("image").image) {
      console.log("url image", watch("image").image);
      removeAwsUrl(watch("image").image);
    }

    setValue("image", { ...imageTemplate });
  };

  const saveProfile = async (data) => {
    setLoading(true);
    console.log("data", data);
    try {
      forIn(data, async (value, key) => {
        if (key === "image") return;
        data[key] = trim(value);
      });

      data.image = data.image.file
        ? await getAwsUrl(data.image.file)
        : data.image.image;

      console.log("data", data);

      await axios.post("/api/updateuserprofile", { data: data, _id: user._id });

      await mutate();

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  const UploaderIcon = () => (
    <IconButton
      sx={{ position: "relative", top: "40px", right: "38px" }}
      component="label"
      color="primary"
    >
      {watch("image").blob || watch("image").image ? (
        <DeleteIcon
          onClick={deleteProfileImage}
          color="error"
          fontSize="large"
        />
      ) : (
        <>
          <UploadIcon fontSize="large" />
          <input hidden type="file" onChange={(e) => updateProfileImage(e)} />
        </>
      )}
    </IconButton>
  );

  console.log("isDirty ", isDirty);

  React.useEffect(() => {
    if (loading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [loading]);

  return (
    <Stack
      justifyContent="center"
      component="form"
      onSubmit={handleSubmit(saveProfile)}
    >
      <Stack sx={{ mb: 4 }} justifyContent="center" direction="row">
        <Avatar
          alt="avatar"
          src={watch("image").image || watch("image").blob}
          sx={{ width: "100px", height: "100px" }}
          component="label"
        />
        <UploaderIcon />
      </Stack>
      <Grid spacing={2} container>
        <Grid item xs={12} sm={6}>
          <TextField
            size="small"
            fullWidth
            id="email"
            defaultValue={get(user, "email", "")}
            InputProps={{ readOnly: true }}
            label="Email"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="phone"
            defaultValue=""
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  {...field}
                  label="Phone"
                  placeholder="+234 9065369929"
                  // value={textMask}
                  //onChange={(e) => e.target.value}
                  name="numberformat"
                  id="formatted-numberformat-input"
                  InputProps={{
                    // @ts-ignore
                    inputComponent: TextMaskCustom,
                  }}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="firstName"
            defaultValue=""
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  {...field}
                  size="small"
                  fullWidth
                  id="firstname"
                  label="First Name"
                  variant="outlined"
                  required
                  error={Boolean(errors.firstName?.message)}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="lastName"
            defaultValue=""
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  {...field}
                  size="small"
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  variant="outlined"
                  required
                  error={Boolean(errors.lastName?.message)}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="username"
            defaultValue=""
            control={control}
            render={({ field }) => {
              const { onChange, value, ...rest } = field;
              return (
                <TextField
                  {...rest}
                  value={value}
                  onChange={(e) => onChange(trim(e.target.value).toLowerCase())}
                  size="small"
                  disabled={!Boolean(usernames)}
                  fullWidth
                  InputProps={{ readOnly: Boolean(user?.username) }}
                  id="username"
                  label="Username"
                  variant="outlined"
                  required
                  error={Boolean(errors.username?.message)}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="gender"
            defaultValue=""
            control={control}
            render={({ field }) => {
              const { value, onChange } = field;
              return (
                <TextField
                  id="outlined-select-currency"
                  select
                  label="Gender"
                  value={value}
                  onChange={onChange}
                  fullWidth
                  size="small"
                >
                  {["Male", "Female"].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }}
          />
        </Grid>
        <Grid sx={{ mt: 5 }} container justifyContent="center" item xs={12}>
          <Button
            disabled={loadingState || !isDirty}
            startIcon={<SaveIcon />}
            type="submit"
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
}
