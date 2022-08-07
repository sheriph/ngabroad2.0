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
import { Box } from "@mui/system";
import PostList from "./postlist";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { selectCategoryString_, selectCountry_ } from "../lib/recoil";
import { countries, postTags } from "../lib/utility";
import dynamic from "next/dynamic";

const CategoryJsxNoSsr = dynamic(() => import("./others/sidecategory.js"), {
  ssr: false,
});

export default function PostComponent() {
  const [category, setCategory] = useRecoilState(selectCategoryString_);
  const [selectCountry, setSelelectedCountry] = useRecoilState(selectCountry_);

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
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={countries}
            size="small"
            // @ts-ignore
            getOptionLabel={(option) => option?.name}
            sx={{
              width: 150,
              fontSize: { ".MuiInput-input": { fontSize: "14px" } },
              pl: 2,
            }}
            clearIcon=""
            // @ts-ignore
            value={selectCountry}
            onChange={(e, v, r) => {
              console.log("cv country", v);
              // @ts-ignore
              setSelelectedCountry(v);
            }}
            renderOption={(props, option, state) => {
              console.log("option", option);
              return (
                <Typography {...props} component="li" variant="caption">
                  {option.name}
                </Typography>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{ ...params.InputProps, disableUnderline: true }}
                variant="standard"
                placeholder="All Countries"
              />
            )}
          />
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
      <PostList />
    </Stack>
  );
}
