import {
  Autocomplete,
  Button,
  ButtonGroup,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

import { styled } from "@mui/styles";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import dynamic from "next/dynamic";
import { selectCategoryString_, selectCountry_ } from "../../lib/recoil";
import { countries, postTags } from "../../lib/utility";
import SingleQuestionCard from "../singlequestioncard";
import DesktopSideBar from "./desktopsidebar";

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: "5px solid",
    borderColor: "primary.main",
  },
}));

export default function SinglePostComponent() {
  const [category, setCategory] = useRecoilState(selectCategoryString_);

  const handleCategory = (event) => {
    console.log("click", event);
    setCategory(event.target.innerText);
  };

  console.log("category", category);

  return (
    <Stack sx={{ p: { xs: 1, sm: 2 } }} direction="row" spacing={2}>
      <DesktopSideBar />
      <Divider
        sx={{
          position: "relative",
          left: "250px",
          margin: `0 !important`,
          display: { xs: "none", md: "block" },
        }}
        orientation="vertical"
        flexItem
      />
      <SingleQuestionCard />
    </Stack>
  );
}
