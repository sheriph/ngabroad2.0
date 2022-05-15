// @ts-ignore
import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
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
  useMediaQuery,
} from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ReadMoreOutlinedIcon from "@mui/icons-material/ReadMoreOutlined";
import Image from "next/image";
import NoAccountsOutlinedIcon from "@mui/icons-material/NoAccountsOutlined";
import { TransitionComponent, useUser, Wait } from "../../lib/utility";
import PropTypes from "prop-types";
import { yupResolver } from "@hookform/resolvers/yup";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import * as Yup from "yup";
import AirplanemodeActiveOutlinedIcon from "@mui/icons-material/AirplanemodeActiveOutlined";
import { Auth } from "aws-amplify";
import HolidayVillageOutlinedIcon from "@mui/icons-material/HolidayVillageOutlined";

import { Controller, useForm } from "react-hook-form";
import { trim } from "lodash";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isLoading_ } from "../../lib/recoil";
import OtpCountdown from "../others/otpcountdown";
import { toast } from "react-toastify";
import ForgotPassword from "../others/forgotpassword";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Stack spacing={2} sx={{ py: 2 }}>
          {children}
        </Stack>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function Header() {
  const [tabValue, setTabValue] = useState(0);

  const formSchemaSignup = Yup.object().shape({
    signupPassword: Yup.string()
      .required("Password is mandatory")
      .min(8, "Password must be a minimum of 6 characters long"),
    signupConfirmPassword: Yup.string()
      .required("Password is mendatory")
      .oneOf([Yup.ref("signupPassword")], "Passwords does not match"),
    signupEmail: Yup.string()
      .required("Please enter your email address")
      .matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Invalid email detected"
      ),
  });
  const formSchemaSignin = Yup.object().shape({
    signinPassword: Yup.string()
      .required("Password is mandatory")
      .min(8, "Password must be a minimum of 6 characters long"),
    signinEmail: Yup.string()
      .required("Please enter your email address")
      .matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Invalid email detected"
      ),
  });
  const formOptions =
    tabValue === 0
      ? {
          resolver: yupResolver(formSchemaSignin),
          shouldUnregister: true,
        }
      : {
          resolver: yupResolver(formSchemaSignup),
          shouldUnregister: true,
        };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm(formOptions);
  const [showSigninPassword, setShowSigninPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmSignupPassword, setShowConfirmSignupPassword] =
    useState(false);
  const toggleSigninPassword = () => setShowSigninPassword(!showSigninPassword);
  const toggleSignupPassword = () => setShowSignupPassword(!showSignupPassword);
  const toggleConfirmSignupPassword = () =>
    setShowConfirmSignupPassword(!showConfirmSignupPassword);
  const [anchorUserMenuEl, setAnchorUserMenuEl] = useState(null);
  const { loading, user, mutate } = useUser();
  const [isLoading, setLoading] = useRecoilState(isLoading_);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [passwordForgotDialog, setPasswordForgotDialog] = useState(false);
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [disableCodeResend, setDisableCodeResend] = useState(true);
  const [countdownKey, setCountdownKey] = useState(Math.random());
  const open = Boolean(anchorUserMenuEl);
  const handleUserMenu = (event) => {
    setAnchorUserMenuEl(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorUserMenuEl(null);
  };

  const handleLoginDialog = (second) => {
    setOpenLoginDialog(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
      sx: {
        textTransform: "none",
        width: "50%",
        zIndex: 1,
        color: tabValue === index ? "common.white" : "common.black",
      },
    };
  }
  const onSubmit = async (data) => {
    setLoading(true);
    console.log("data", data);
    if (tabValue === 1) {
      //Signup Logic

      const { signupEmail, signupPassword } = data;
      setUsername(signupEmail);
      console.log("isLoading", isLoading);
      try {
        const { user } = await Auth.signUp({
          username: signupEmail,
          password: signupPassword,
          attributes: {
            email: signupEmail, // optional
            // other custom attributes
          },
        });
        console.log(user);
        setOpenLoginDialog(false);
        try {
          await Auth.resendSignUp(signupEmail);
          setOpenOtpDialog(true);
          setDisableCodeResend(true);
          setCountdownKey(Math.random());
          setLoading(false);
        } catch (error) {
          console.log("error", error);
          toast.error(error.message);
          setLoading(false);
        }
      } catch (error) {
        console.log("error signing up:", error.code);
        toast.error(error.message);
        setLoading(false);
      }
    }
    if (tabValue === 0) {
      // Login Logic
      setLoading(true);
      const { signinEmail, signinPassword } = data;
      setUsername(signinEmail);
      console.log("signinEmail, signinPassword", signinEmail, signinPassword);
      try {
        const user = await Auth.signIn(signinEmail, signinPassword);
        console.log("user", user);
        const mut = await mutate(null, {
          //  rollbackOnError: false,
          //  optimisticData: null,
          populateCache: true,
          revalidate: true,
        });
        console.log("mutate", mut);
        setLoading(false);
        setOpenLoginDialog(false);
      } catch (error) {
        if (error.code === "UserNotConfirmedException") {
          toast.error(error.message);
          console.log("user not confirmed");
          try {
            await Auth.resendSignUp(signinEmail);
            setOpenLoginDialog(false);
            setOpenOtpDialog(true);
            setDisableCodeResend(true);
            setCountdownKey(Math.random());
          } catch (error) {
            console.log("error", error);
          } finally {
            setLoading(false);
          }
          console.log("code resent successfully");
          return;
        }
        console.log("error", error);
        toast.error(error.message);
        setLoading(false);
      }
    }
  };

  const resendCode = async () => {
    console.log("username", username);
    setLoading(true);
    try {
      await Auth.resendSignUp(username);
      setDisableCodeResend(true);
      setCountdownKey(Math.random());
      console.log("code resent successfully");
      setLoading(false);
    } catch (err) {
      console.log("error resending code: ", err);
      toast.error(err.message);
      setLoading(false);
    }
  };

  const submitCode = async () => {
    if (otp.length !== 6) {
      toast.error("Wrong Code provided. The Code is only 6 characters long");
      return;
    }
    setLoading(true);
    try {
      console.log("username", username, otp);
      await Auth.confirmSignUp(username, otp);
      toast.success(
        "Verification Successful, Please sign-in with your user name and password"
      );
      setOpenOtpDialog(false);
    } catch (error) {
      console.log("error confirming sign up", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  //console.log("loading, user", loading, user);

  async function signOut() {
    try {
      setLoading(true);
      await Auth.signOut();
      toast.success("You have signed out successfully");
    } catch (error) {
      console.log("error signing out: ", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      try {
        const mut = await mutate(null, {
          rollbackOnError: false,
          optimisticData: null,
          populateCache: true,
        });
        console.log("mutate", mut);
      } catch (error) {
        console.log("mutate error", error);
      }
    }
  }

  const mobile = useMediaQuery("(max-width:600px)");

  return (
    <Stack
      sx={{ py: 1 }}
      justifyContent="space-between"
      alignItems="center"
      direction="row"
    >
      <Stack>
        <Image
          src="/images/base/logo150px.png"
          height="50px"
          width="110px"
          alt="logo"
        />
      </Stack>
      <Stack>
        <ButtonGroup size="small">
          <Button>
            {mobile ? <AirplanemodeActiveOutlinedIcon /> : "FLIGHT"}
          </Button>
          {/*  <Button>{mobile ? <HolidayVillageOutlinedIcon /> : "HOTEL"}</Button> */}

          <Button>{mobile ? <FeedOutlinedIcon /> : "FORUM"}</Button>

          <Button
            onClick={user ? handleUserMenu : handleLoginDialog}
            children={
              user ? <AccountCircleOutlinedIcon /> : <NoAccountsOutlinedIcon />
            }
          />
          <Button>{mobile ? <ReadMoreOutlinedIcon /> : "MORE"}</Button>
        </ButtonGroup>
      </Stack>
      <Menu
        anchorEl={anchorUserMenuEl}
        id="account-menu"
        open={open}
        onClose={handleCloseUserMenu}
        onClick={handleCloseUserMenu}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          component={Button}
          startIcon={<AccountCircleOutlinedIcon />}
          dense
          sx={{ width: "100%" }}
        >
          My Account
        </MenuItem>
        <MenuItem
          component={Button}
          startIcon={<NoAccountsOutlinedIcon />}
          dense
          onClick={signOut}
          sx={{ width: "100%" }}
        >
          Logout
        </MenuItem>
      </Menu>
      <Dialog
        // @ts-ignore
        TransitionComponent={TransitionComponent}
        open={openLoginDialog}
      >
        <Stack
          onSubmit={handleSubmit(onSubmit)}
          component="form"
          sx={{ p: 2, width: "100%" }}
          alignSelf="center"
        >
          <IconButton
            sx={{ alignSelf: "center" }}
            onClick={() => setOpenLoginDialog(false)}
          >
            <CancelOutlinedIcon color="primary" fontSize="large" />
          </IconButton>
          <Typography sx={{ pb: 2 }} textAlign="center">
            Login Form
          </Typography>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="basic tabs example"
            indicatorColor="primary"
            textColor="inherit"
            centered
            sx={{
              "& .MuiTabs-flexContainer": {
                border: "1px solid",
                borderColor: "primary.main",
                borderRadius: 2,
                height: "40px",
              },
              "& .MuiTabs-fixed": { height: "40px" },
              "& .MuiTabs-root": { height: "40px" },
            }}
            TabIndicatorProps={{ sx: { height: "100%", borderRadius: 2 } }}
          >
            <Tab
              component={Button}
              size="small"
              {...a11yProps(0)}
              label={<Typography sx={{ mb: 1 }}>Login</Typography>}
            />
            <Tab
              component={Button}
              size="small"
              label={<Typography sx={{ mb: 1 }}>Signup</Typography>}
              {...a11yProps(1)}
            />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <Controller
              name="signinEmail"
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
                    label="Email Address"
                    variant="outlined"
                    required
                    error={Boolean(errors?.signinEmail?.message)}
                    helperText={
                      <Typography variant="caption">
                        {errors?.signinEmail?.message}
                      </Typography>
                    }
                  />
                );
              }}
            />
            <Stack>
              <Controller
                name="signinPassword"
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
                      id="password"
                      fullWidth
                      type={showSigninPassword ? "text" : "password"}
                      label="Password"
                      variant="outlined"
                      required
                      InputProps={{
                        endAdornment: (
                          <>
                            {showSigninPassword ? (
                              <IconButton onClick={toggleSigninPassword}>
                                <VisibilityOutlinedIcon />
                              </IconButton>
                            ) : (
                              <IconButton onClick={toggleSigninPassword}>
                                <VisibilityOffOutlinedIcon />
                              </IconButton>
                            )}
                          </>
                        ),
                      }}
                      error={Boolean(errors?.signinPassword?.message)}
                      helperText={
                        <Typography variant="caption">
                          {errors?.signinPassword?.message}
                        </Typography>
                      }
                    />
                  );
                }}
              />
              <Typography
                sx={{ mt: 1, color: "error.main", cursor: "pointer" }}
                onClick={() => {
                  setOpenLoginDialog(false);
                  setPasswordForgotDialog(true);
                }}
                variant="caption"
              >
                Forgot Password
              </Typography>
            </Stack>
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Controller
              name="signupEmail"
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
                    label="Email Address"
                    variant="outlined"
                    required
                    error={Boolean(errors?.signupEmail?.message)}
                    helperText={
                      <Typography variant="caption">
                        {errors?.signupEmail?.message}
                      </Typography>
                    }
                  />
                );
              }}
            />
            <Controller
              name="signupPassword"
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
                    type={showSignupPassword ? "text" : "password"}
                    fullWidth
                    id="password"
                    label="Password"
                    variant="outlined"
                    required
                    InputProps={{
                      endAdornment: (
                        <>
                          {showSignupPassword ? (
                            <IconButton onClick={toggleSignupPassword}>
                              <VisibilityOutlinedIcon />
                            </IconButton>
                          ) : (
                            <IconButton onClick={toggleSignupPassword}>
                              <VisibilityOffOutlinedIcon />
                            </IconButton>
                          )}
                        </>
                      ),
                    }}
                    error={Boolean(errors?.signupPassword?.message)}
                    helperText={
                      <Typography variant="caption">
                        {errors?.signupPassword?.message}
                      </Typography>
                    }
                  />
                );
              }}
            />
            <Controller
              name="signupConfirmPassword"
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
                    error={Boolean(errors?.signupConfirmPassword?.message)}
                    fullWidth
                    type={showConfirmSignupPassword ? "text" : "password"}
                    id="confirmpassword"
                    label="Confirm Password"
                    variant="outlined"
                    helperText={
                      <Typography variant="caption">
                        {errors?.signupConfirmPassword?.message}
                      </Typography>
                    }
                    required
                    InputProps={{
                      endAdornment: (
                        <>
                          {showConfirmSignupPassword ? (
                            <IconButton onClick={toggleConfirmSignupPassword}>
                              <VisibilityOutlinedIcon />
                            </IconButton>
                          ) : (
                            <IconButton onClick={toggleConfirmSignupPassword}>
                              <VisibilityOffOutlinedIcon />
                            </IconButton>
                          )}
                        </>
                      ),
                    }}
                  />
                );
              }}
            />
            <Button type="submit" variant="contained" fullWidth>
              Signup
            </Button>
          </TabPanel>
        </Stack>
      </Dialog>
      <Dialog
        // @ts-ignore
        TransitionComponent={TransitionComponent}
        open={openOtpDialog}
      >
        <Stack alignSelf="center" spacing={2} sx={{ p: 2, width: "100%" }}>
          <IconButton
            sx={{ alignSelf: "center" }}
            onClick={() => setOpenOtpDialog(false)}
          >
            <CancelOutlinedIcon color="primary" fontSize="large" />
          </IconButton>
          <Typography sx={{ pb: 2 }} textAlign="center">
            Enter The Code Sent to Your Email
          </Typography>
          <TextField
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            size="small"
            fullWidth
            id="otp"
            label="Code"
            variant="outlined"
          />
          <ButtonGroup variant="contained" fullWidth>
            <Button onClick={resendCode} disabled={disableCodeResend}>
              <OtpCountdown
                countdownKey={countdownKey}
                setDisableCodeResend={setDisableCodeResend}
                disableCodeResend={disableCodeResend}
              />
            </Button>
            <Button
              onClick={submitCode}
              sx={{ width: "auto", px: 5 }}
              type="submit"
            >
              Submit
            </Button>
          </ButtonGroup>
        </Stack>
      </Dialog>
      <Dialog
        // @ts-ignore
        TransitionComponent={TransitionComponent}
        open={passwordForgotDialog}
      >
        <Stack alignSelf="center" spacing={2} sx={{ p: 2, width: "100%" }}>
          <ForgotPassword setPasswordForgotDialog={setPasswordForgotDialog} />
        </Stack>
      </Dialog>
      <Wait />
    </Stack>
  );
}
