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
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { category_, filter_ } from "../../lib/recoil";

export default function MobileCategoryChanger() {
  const router = useRouter();
  const [category, setCategory] = useRecoilState(category_);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (e) => {
    console.log("e", e.target.innerText);
    if (!e.target.innerText) {
      setAnchorEl(null);
      return;
    }
    setAnchorEl(null);
    setCategory(e.target.innerText);
    if (router.pathname !== "/social") {
      router.push("/social");
    }
  };

  return (
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
  );
}
