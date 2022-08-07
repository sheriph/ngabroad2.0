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
import { countries } from "../../lib/utility";
import SingleQuestionCard from "../singlequestioncard";

const CategoryJsxNoSsr = dynamic(() => import("../others/sidecategory"), {
  ssr: false,
});

export default function SinglePostComponent() {
  const [category, setCategory] = useRecoilState(selectCategoryString_);

  const handleCategory = (event) => {
    console.log("click", event);
    setCategory(event.target.innerText);
  };

  console.log("category", category);

  return (
    <Stack
      sx={{ backgroundColor: "common.white", p: { xs: 1, sm: 2 } }}
      direction="row"
      spacing={2}
    >
      <Box
        sx={{
          width: "250px",
          position: "fixed",
          display: { xs: "none", md: "block" },
        }}
      >
        <Stack>
          <CategoryJsxNoSsr
            category={category}
            handleCategory={handleCategory}
          />
        </Stack>
      </Box>
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
