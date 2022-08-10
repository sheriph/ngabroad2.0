import {
  Autocomplete,
  Button,
  Collapse,
  Divider,
  ListItemButton,
  Menu,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PostCard from "./postcard";
import { Box } from "@mui/system";
import { useRecoilState } from "recoil";
import { filter_, selectCategory_, selectCountry_ } from "../lib/recoil";
import { countries, postTags } from "../lib/utility";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";

export default function PostList() {
  const [filter, setFilter] = useRecoilState(filter_);
  const [selectCategory, setSelelectedCategory] =
    useRecoilState(selectCategory_);
  const [selectCountry, setSelelectedCountry] = useRecoilState(selectCountry_);

  const handleFilterChange = (event, newAlignment) => {
    console.log("newAlignment", newAlignment);
    if (newAlignment) setFilter(newAlignment);
  };

  console.log("filter", filter);

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
        {/* Mobile Head */}
        <Stack spacing={1} sx={{ display: { xs: "flex", md: "none" } }}>
          <Stack spacing={2} direction="row">
            {/*  <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={countries}
              size="small"
              // @ts-ignore
              getOptionLabel={(option) => option?.name}
              sx={{
                width: 150,
                fontSize: { ".MuiInput-input": { fontSize: "14px" } },
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
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={postTags}
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
              value={selectCategory}
              onChange={(e, v, r) => {
                console.log("cv country", v);
                // @ts-ignore
                setSelelectedCategory(v);
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
                  placeholder="All Categories"
                />
              )}
            /> */}
          </Stack>
          <Stack justifyContent="space-between" direction="row" spacing={2}>
            <Button
              startIcon={<ContactSupportIcon />}
              disableElevation
              sx={{ justifyContent: "flex-start" }}
              // variant="outlined"
            >
              Ask a Question
            </Button>
            <ToggleButtonGroup
              color="primary"
              value={filter}
              exclusive
              size="small"
              onChange={handleFilterChange}
            >
              <ToggleButton value="Newest">Newest</ToggleButton>
              <ToggleButton value="Popular">Popular</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
        {/* Desktop head */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Typography>523 results</Typography>
          <Stack direction="row" spacing={2}>
            <ToggleButtonGroup
              color="primary"
              value={filter}
              exclusive
              size="small"
              onChange={handleFilterChange}
            >
              <ToggleButton value="Newest">Newest</ToggleButton>
              <ToggleButton value="Popular">Popular</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
        <Divider orientation="horizontal" flexItem />
        <Stack
          divider={<Divider orientation="horizontal" flexItem />}
          spacing={3}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((post, key) => {
            return <PostCard key={key} post={post} />;
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
