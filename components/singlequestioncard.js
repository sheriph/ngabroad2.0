import {
  Avatar,
  Button,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { useRecoilState } from "recoil";
import { filter_, pageBreadcrumb_ } from "../lib/recoil";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ShareIcon from "@mui/icons-material/Share";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

export default function SingleQuestionCard() {
  const [pageBreadcrumb, setPageBreadcrumb] = useRecoilState(pageBreadcrumb_);
  const [breadcrumbAnchorEl, setBreadcrumbAnchorEl] = React.useState(null);
  const openbreadcrumbAnchorEl = Boolean(breadcrumbAnchorEl);
  const handleBreadcrumbMenu = (e) => {
    setBreadcrumbAnchorEl(e.currentTarget);
  };

  const handleBreadcrumbMenuClose = (e) => {
    if (e.target.outerText) setPageBreadcrumb(e.target.outerText);
    setBreadcrumbAnchorEl(null);
  };

  const [typenimation, setTypeAnimation] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTypeAnimation(false);
    }, 1000);
  }, [null]);

  return (
    <Box
      sx={{
        position: { xs: "inherit", md: "relative" },
        left: { xs: 0, md: "250px" },
        width: { xs: "100%", md: "calc(100% - 270px)" },
        marginLeft: { xs: `0 !important`, md: `16px !important` },
      }}
    >
      <Stack
        spacing={1}
        //  divider={<Divider orientation="horizontal" flexItem />}
      >
        {/* Mobile Head */}
        <Stack spacing={1} sx={{ display: { xs: "flex", md: "none" } }}>
          <Stack justifyContent="space-between" direction="row">
            <Button
              id="basic-button"
              aria-controls={openbreadcrumbAnchorEl ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openbreadcrumbAnchorEl ? "true" : undefined}
              onClick={handleBreadcrumbMenu}
              endIcon={<ExpandMoreOutlinedIcon />}
            >
              {pageBreadcrumb}
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={breadcrumbAnchorEl}
              open={openbreadcrumbAnchorEl}
              onClose={handleBreadcrumbMenuClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleBreadcrumbMenuClose}>All</MenuItem>
              <MenuItem onClick={handleBreadcrumbMenuClose}>Questions</MenuItem>
              <MenuItem onClick={handleBreadcrumbMenuClose}>Posts</MenuItem>
              {/* <Divider sx={{}} orientation="horizontal" flexItem />
                <MenuItem
                  component={Button}
                  endIcon={<OpenInNewOutlinedIcon />}
                  onClick={handleBreadcrumbMenuClose}
                >
                  Users
                </MenuItem> */}
            </Menu>
            <Button
              size="small"
              sx={{
                height: "30px",
                minWidth: "20px",
                width: typenimation ? "120px" : "40px",
                transition: "width 1s",
              }}
              disableElevation
              variant="contained"
            >
              {typenimation ? (
                "Ask Questions"
              ) : (
                <ModeEditOutlineOutlinedIcon color="inherit" fontSize="small" />
              )}
            </Button>
          </Stack>
          <Typography variant="h1">
            How can I deal with students that are too sensitive when they are
            simply wrong? Particularly when they answer simple questions wrongly
            during class?
          </Typography>
          <Stack spacing={1} direction="row">
            <Typography variant="caption">Asked Yesterday</Typography>
            <Typography variant="caption">Modified Today</Typography>
            <Typography variant="caption">Views 234 times</Typography>
          </Stack>
          <Divider orientation="horizontal" flexItem />
          <Stack direction="row">
            <Stack>
              <Typography>{text}</Typography>
              <Stack
                sx={{ mt: 2 }}
                justifyContent="space-between"
                spacing={1}
                direction="row"
              >
                <Button
                  // sx={{ height: "30px", width: "fit-content" }}
                  variant="contained"
                  disableElevation
                  // endIcon={}
                >
                  <ShareIcon />
                </Button>
                <Stack direction="row" alignItems="center">
                  <ArrowLeftIcon fontSize="large" />
                  <Typography>31</Typography>
                  <ArrowRightIcon fontSize="large" />
                </Stack>
                <Stack spacing={1} direction="row">
                  <Avatar
                    variant="rounded"
                    alt="Remy Sharp"
                    src="/static/images/avatar/1.jpg"
                  />
                  <Stack>
                    <Typography variant="caption">Sheriff Adeniyi</Typography>
                    <Typography variant="caption">Travel Consultant</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {/* Desktop head */}
        <Stack sx={{ display: { xs: "none", md: "flex" } }} spacing={1}>
          <Stack
            alignItems="center"
            justifyContent="space-between"
            direction="row"
            spacing={1}
          >
            <Typography variant="h1">
              How can I deal with students that are too sensitive when they are
              simply wrong? Particularly when they answer simple questions
              wrongly during class?
            </Typography>
            <Button
              sx={{ minWidth: "150px" }}
              disableElevation
              variant="contained"
            >
              Ask Question
            </Button>
          </Stack>
          <Stack spacing={1} direction="row">
            <Typography variant="caption">Asked Yesterday</Typography>
            <Typography variant="caption">Modified Today</Typography>
            <Typography variant="caption">Views 234 times</Typography>
          </Stack>
          <Divider orientation="horizontal" flexItem />
          <Stack direction="row">
            <Stack alignItems="center">
              <ArrowDropUpOutlinedIcon fontSize="large" />
              <Typography>31</Typography>
              <ArrowDropDownIcon fontSize="large" />
            </Stack>
            <Stack>
              <Typography>{text}</Typography>
              <Stack
                sx={{ mt: 2 }}
                justifyContent="space-between"
                spacing={1}
                direction="row"
              >
                <Button
                  // sx={{ height: "30px", width: "fit-content" }}
                  variant="contained"
                  disableElevation
                  endIcon={<ShareIcon />}
                >
                  share content
                </Button>
                <Stack spacing={1} direction="row">
                  <Avatar
                    variant="rounded"
                    alt="Remy Sharp"
                    src="/static/images/avatar/1.jpg"
                  />
                  <Stack>
                    <Typography variant="caption">Sheriff Adeniyi</Typography>
                    <Typography variant="caption">Travel Consultant</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

const text = `I am an instructor in a STEM field. I am teaching an upper-division course where I try to interact with the students rather than just lecturing. I am teaching in the students' native language; there do not seem to be any language issues.

I am struggling because the students tend to give wrong answers to simple questions I ask during lectures. These really are simple questions; they should have learned this material during the first few weeks of their first year.

To make matters clear, let me give an example. If we are in the middle of a proof, I might ask "what is the result of log (a * b)?". The right answer is "log(a) + log(b)", however, they will say "log(a) * log (b)" as an answer. Then, I did not see any other way and would say "no guys, it is log(a)+log(b)."

Situations like this repeated over the entire semester. Students complained to my boss and in the student evaluation that I was demeaning them and that I was upset when they answered something other than the answer I wanted to.

I will teach some of these students next year in another course and I have a hard time trying to find a way to solve this issue. The only solution I see for this is to just lecture and not encourage participation in class. However, I was wondering if there would be any other wiser solution.

Tips from here are good, but instead of a colleague, I'm dealing with students.

Edit: This is actually an upper-division chemistry course. The situation above arises, for example, when I have to explain why pH + pOH = 14. Students should have learned that in general chemistry, but I like to derive it to remind them. When I perform the derivation, I start from the auto-ionization of water and eventually arrive at: 14 = -log ([H3O+][OH-]). Then I ask them how to simplify this in order to complete the proof. But they do not remember the properties of logs.`;
