import {
  Autocomplete,
  Button,
  Collapse,
  Divider,
  Fab,
  ListItemButton,
  Menu,
  MenuItem,
  Snackbar,
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
import { category_, filter_, selectCountry_ } from "../lib/recoil";
import { countries, postTags } from "../lib/utility";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ViewTimelineOutlinedIcon from "@mui/icons-material/ViewTimelineOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import EditIcon from "@mui/icons-material/Edit";

export default function PostList() {
  const [filter, setFilter] = useRecoilState(filter_);
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
  const handleFilterChange = (event, newAlignment) => {
    console.log("newAlignment", newAlignment);
    if (newAlignment) setFilter(newAlignment);
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
        {/* Mobile Head */}
        <Stack spacing={1} sx={{ display: { xs: "flex", md: "none" } }}>
          <Snackbar
            open={true}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            autoHideDuration={null}
          >
            <Box sx={{ "& > :not(style)": { m: 1 } }}>
              <Fab
                size="small"
                variant="circular"
                color="primary"
                aria-label="edit"
              >
                <EditIcon />
              </Fab>
            </Box>
          </Snackbar>
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
            {/* <Button
              startIcon={<ContactSupportIcon />}
              disableElevation
              sx={{ justifyContent: "flex-start" }}
              // variant="outlined"
            >
              Ask a Question
            </Button> */}
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
