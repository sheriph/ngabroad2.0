import {
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
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
import * as Yup from "yup";
import axios from "axios";
import { forIn, get, trim } from "lodash";
import {
  getAwsUrl,
  removeAwsUrl,
  titleCase,
  useAuthUser,
  viewMongoError,
} from "../../lib/utility";
import PropTypes from "prop-types";
import { IMaskInput } from "react-imask";
import SaveIcon from "@mui/icons-material/Save";
import { useRecoilState, useSetRecoilState } from "recoil";
import { blockLoading_, isLoading_ } from "../../lib/recoil";
import { useRouter } from "next/router";
import { useAuthenticator } from "@aws-amplify/ui-react";
import PhoneInput from "react-phone-input-2";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import isAlphanumeric from "validator/lib/isAlphanumeric";

const fetcher = async (key) => {
  try {
    const usernames = await axios.get(key);
    return usernames.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export default function EditProfile() {
  const { user: userExist } = useAuthenticator((context) => [
    context.authStatus,
  ]);
  const { user, isLoading, mutate } = useAuthUser(userExist);
  const router = useRouter();
  const setBlockLoading = useSetRecoilState(blockLoading_);

  const schema = Yup.object().shape({
    username: Yup.string()
      .trim("")
      .lowercase("")
      .required("username is required")
      .test(
        "check-username-string",
        "Must be an alphanumeric character only",
        (username) => {
          // console.log("phone", phone);
          // @ts-ignore
          return isAlphanumeric(username);
        }
      ),
    // .transform((value, originalValue) => trim(originalValue.toLowerCase())),
    // .nope((usernames || []).map((username) => trim(username.toLowerCase()))),
    phone: Yup.string().test(
      "check-phone",
      "Phone number is not valid",
      (phone) => {
        if (!phone) return true;
        return isPossiblePhoneNumber(`+${phone}`, {});
      }
    ),
  });

  const imageTemplate = {
    blob: "",
    file: null,
    image: "",
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
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: get(user, "firstName", ""),
      image: { ...imageTemplate, image: get(user, "image", "") },
      lastName: get(user, "lastName", ""),
      username: get(user, "username", ""),
      gender: get(user, "gender", ""),
      phone: get(user, "phone", ""),
    },
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
    console.log("data", data);
    setBlockLoading(true);
    try {
      data.image = data.image.file
        ? await getAwsUrl(data.image.file)
        : data.image.image;

      console.log("data", data);

      await axios.post("/api/others/updateuserprofile", {
        data: data,
        _id: user._id,
      });

      await mutate();
      setBlockLoading(false);
      router.reload();
    } catch (error) {
      setBlockLoading(false);
      console.log("error", get(error, "response.data", ""));
      const str = get(error, "response.data", "").includes(
        "index: username_1 dup"
      )
        ? "Username is already taken"
        : get(error, "response.data.message", "Error submitting the form");
      viewMongoError(str);
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

  /*  React.useEffect(() => {
    if (alert) trigger();
  }, [null]); */

  console.log("data error", errors);

  console.log("gender", watch("gender"));

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
                  fullWidth
                  InputProps={{ readOnly: Boolean(user?.username) }}
                  id="username"
                  label="Username"
                  variant="outlined"
                  required
                  error={Boolean(errors.username?.message)}
                  helperText={get(errors, "username.message", "")}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="phone"
            defaultValue=""
            control={control}
            render={({ field }) => {
              const { onChange, value, ...rest } = field;
              return (
                <PhoneInput
                  specialLabel="Phone (optional)"
                  country={"ng"}
                  placeholder="234 906 536 992 9"
                  value={value}
                  // @ts-ignore
                  onChange={(phone, countryData) => onChange(phone)}
                  inputProps={{
                    name: "phone",
                  }}
                />
              );
            }}
          />
          <Typography sx={{ pl: 2, pt: 1 }} color="red" variant="caption">
            {get(errors, "phone.message", "")}
          </Typography>
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
                  label="First Name (optional)"
                  variant="outlined"
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
                  label="Last Name (optional)"
                  variant="outlined"
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
              return (
                <TextField
                  {...field}
                  id="gender"
                  select
                  label="Gender (optional)"
                  fullWidth
                  size="small"
                >
                  {["male", "female"].map((option) => (
                    <MenuItem key={option} value={option}>
                      {titleCase(option)}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }}
          />
        </Grid>
        <Grid sx={{ mt: 5 }} container justifyContent="center" item xs={12}>
          <Button startIcon={<SaveIcon />} type="submit">
            Submit
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
}
