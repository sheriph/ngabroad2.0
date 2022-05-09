// @ts-ignore
import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Collapse,
  Dialog,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ReadMoreOutlinedIcon from "@mui/icons-material/ReadMoreOutlined";
import Image from "next/image";
import NoAccountsOutlinedIcon from "@mui/icons-material/NoAccountsOutlined";
import { useUser, Wait } from "../../lib/utility";
import PropTypes from "prop-types";
import { yupResolver } from "@hookform/resolvers/yup";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import * as Yup from "yup";
import { Auth } from "aws-amplify";

import { Controller, useForm } from "react-hook-form";
import { trim } from "lodash";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isLoading_ } from "../../lib/recoil";
import Countdown from "react-countdown";
import OtpCountdown from "./otpcountdown";
import { toast } from "react-toastify";

export default function ForgotPassword({ setPasswordForgotDialog }) {
  const [codeRequested, setCodeRequested] = useState(false);
  const SchemaNoCodeRequested = Yup.object().shape({
    email: Yup.string()
      .required("Please enter your email address")
      .matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Invalid email detected"
      ),
  });

  const SchemaCodeRequested = Yup.object().shape({
    email: Yup.string()
      .required("Please enter your email address")
      .matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Invalid email detected"
      ),
    newPassword: Yup.string()
      .required("Password is mandatory")
      .min(8, "Password must be a minimum of 6 characters long"),
    code: Yup.string()
      .required("Password is mandatory")
      .min(6, "Password must be a minimum of 6 characters long"),
  });

  const formOptions = codeRequested
    ? {
        resolver: yupResolver(SchemaCodeRequested),
        shouldUnregister: true,
      }
    : {
        resolver: yupResolver(SchemaNoCodeRequested),
        shouldUnregister: true,
      };

  const {
    register,
    unregister,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm(formOptions);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const setLoading = useSetRecoilState(isLoading_);

  const onSubmit = async (data) => {
    console.log("data", data);
    if (!codeRequested) {
      const { email } = data;
      try {
        setLoading(true);
        await Auth.forgotPassword(email);
        setCodeRequested(true);
      } catch (error) {
        console.log("error", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      const { email, code, newPassword } = data;
      try {
        setLoading(true);
        await Auth.forgotPasswordSubmit(email, code, newPassword);
        toast.success(
          "Password updated successfully. Please login with your new password"
        );
      } catch (error) {
        console.log("error", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
        setPasswordForgotDialog(false);
      }
    }
  };

  console.log("errors", errors);

  return (
    <Stack
      onSubmit={handleSubmit(onSubmit)}
      component="form"
      spacing={2}
      sx={{ p: 2, width: "325px" }}
    >
      <IconButton
        sx={{ alignSelf: "center" }}
        onClick={() => setPasswordForgotDialog(false)}
      >
        <CancelOutlinedIcon color="primary" fontSize="large" />
      </IconButton>
      <Typography sx={{ pb: 2 }} textAlign="center">
        Change Your Password
      </Typography>
      <Controller
        name="email"
        defaultValue=""
        control={control}
        render={({ field }) => {
          const { onChange, value, ...rest } = field;
          return (
            <TextField
              {...rest}
              value={value}
              onChange={(e) => onChange(trim(e.target.value))}
              size="small"
              fullWidth
              id="email"
              label="Email"
              variant="outlined"
              required
              disabled={codeRequested}
              error={Boolean(errors?.email?.message)}
              helperText={
                <Typography variant="caption">
                  {errors?.email?.message}
                </Typography>
              }
            />
          );
        }}
      />

      <Collapse in={codeRequested}>
        <Stack>
          <Controller
            name="code"
            defaultValue=""
            control={control}
            render={({ field }) => {
              const { onChange, value, ...rest } = field;
              return (
                <TextField
                  {...rest}
                  value={value}
                  onChange={(e) => onChange(trim(e.target.value))}
                  size="small"
                  fullWidth
                  id="code"
                  label="Code"
                  variant="outlined"
                  required={codeRequested}
                  error={Boolean(errors?.code?.message)}
                  helperText={
                    <Typography variant="caption">
                      {errors?.code?.message}
                    </Typography>
                  }
                />
              );
            }}
          />

          <Controller
            name="newPassword"
            defaultValue=""
            control={control}
            render={({ field }) => {
              const { onChange, value, ...rest } = field;
              return (
                <TextField
                  {...rest}
                  value={value}
                  onChange={(e) => onChange(trim(e.target.value))}
                  size="small"
                  type={showNewPassword ? "text" : "password"}
                  fullWidth
                  id="password"
                  label=" New Password"
                  variant="outlined"
                  required={codeRequested}
                  InputProps={{
                    endAdornment: (
                      <>
                        {showNewPassword ? (
                          <IconButton onClick={toggleShowNewPassword}>
                            <VisibilityOutlinedIcon />
                          </IconButton>
                        ) : (
                          <IconButton onClick={toggleShowNewPassword}>
                            <VisibilityOffOutlinedIcon />
                          </IconButton>
                        )}
                      </>
                    ),
                  }}
                  error={Boolean(errors?.newPassword?.message)}
                  helperText={
                    <Typography variant="caption">
                      {errors?.newPassword?.message}
                    </Typography>
                  }
                />
              );
            }}
          />
        </Stack>
      </Collapse>

      <Button type="submit" variant="contained" fullWidth>
        {codeRequested ? "Update Password" : "Get Verification Code"}
      </Button>
    </Stack>
  );
}
