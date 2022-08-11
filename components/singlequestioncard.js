import {
  Autocomplete,
  Avatar,
  Button,
  ButtonGroup,
  Divider,
  Menu,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { useRecoilState } from "recoil";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ShareIcon from "@mui/icons-material/Share";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ReplyIcon from "@mui/icons-material/Reply";
import AddIcon from "@mui/icons-material/Add";
import { category_, filter_, selectCountry_ } from "../lib/recoil";
import { countries, postTags } from "../lib/utility";
import PostCard from "./postcard";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SinglePostCard from "./singlepostcard";

export default function SingleQuestionCard() {
  const [category, setCategory] = useRecoilState(category_);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (e) => {
    console.log("e", e.target.innerText);
    setAnchorEl(null);
    setCategory(e.target.innerText);
  };
  return (
    <Box
      sx={{
        position: { xs: "inherit", md: "relative" },
        left: { xs: 0, md: "250px" },
        width: { xs: "100%", md: "calc(100% - 270px)" },
        marginLeft: { xs: `0 !important`, md: `16px !important` },
      }}
    >
      <Stack spacing={1}>
        <Stack
          sx={{ display: { xs: "flex", md: "none" } }}
          alignItems="center"
          spacing={1}
          direction="row"
        >
          <Typography>Back to :</Typography>
          <Stack>
            <Button
              id="basic-button"
              aria-controls={openMenu ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? "true" : undefined}
              onClick={handleClick}
              // startIcon={<StartIcon />}
              sx={{ "&.MuiButtonBase-root": { pl: 0 } }}
              endIcon={
                <ExpandMoreOutlinedIcon
                  sx={{
                    transform: openMenu ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              }
            >
              {category}
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleMenuClose}>All Posts</MenuItem>
              <MenuItem onClick={handleMenuClose}>My Timeline</MenuItem>
            </Menu>
          </Stack>
        </Stack>
        <Divider
          sx={{ display: { xs: "block", md: "none" } }}
          orientation="horizontal"
          flexItem
        />
        <Stack
          divider={<Divider orientation="horizontal" flexItem />}
          spacing={3}
        >
          <SinglePostCard post={null} />
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
