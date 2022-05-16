import {
  Button,
  Collapse,
  Divider,
  ListItemButton,
  Menu,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import React, { useEffect, useState } from "react";
import PostCard from "./postcard";
import { Box } from "@mui/system";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import { TagCloud } from "react-tagcloud";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { filter_, pageBreadcrumb_ } from "../lib/recoil";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

export default function PostList() {
  const [filter, setFilter] = useRecoilState(filter_);
  const mobile = useMediaQuery("(max-width:900px)");

  // const [tag, setTag] = React.useState("");
  const [pageBreadcrumb, setPageBreadcrumb] = useRecoilState(pageBreadcrumb_);

  const [showTags, setshowTags] = React.useState(false);

  const handleFilterChange = (event, newAlignment) => {
    if (newAlignment && newAlignment !== "Tags") setFilter(newAlignment);
  };

  // const [menuText, setMenuText] = React.useState("All");

  const [breadcrumbAnchorEl, setBreadcrumbAnchorEl] = React.useState(null);
  const openbreadcrumbAnchorEl = Boolean(breadcrumbAnchorEl);
  const handleBreadcrumbMenu = (e) => {
    setBreadcrumbAnchorEl(e.currentTarget);
  };

  React.useEffect(() => {}, [null]);

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
              {`${pageBreadcrumb} | 520 results`}
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
              <Divider sx={{}} orientation="horizontal" flexItem />
              <MenuItem
                component={Button}
                endIcon={<OpenInNewOutlinedIcon />}
                onClick={handleBreadcrumbMenuClose}
              >
                Users
              </MenuItem>
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
          <Stack justifyContent="space-between" direction="row" spacing={2}>
            <ToggleButtonGroup
              color="primary"
              value={filter}
              exclusive
              size="small"
              onChange={handleFilterChange}
            >
              <ToggleButton value="Newest">Newest</ToggleButton>
              <ToggleButton value="Popular">Popular</ToggleButton>
              <ToggleButton
                selected={filter !== "Newest" && filter !== "Popular"}
                component={Button}
                endIcon={
                  <ExpandMoreOutlinedIcon
                    sx={{
                      transform: showTags ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 1s",
                    }}
                  />
                }
                value="Tags"
                onClick={() => setshowTags(!showTags)}
              >
                {`${
                  filter !== "Newest" && filter !== "Popular" ? filter : "Tags"
                }`}
              </ToggleButton>
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
              <ToggleButton
                component={Button}
                endIcon={<ExpandMoreOutlinedIcon />}
                value="Tags"
                selected={filter !== "Newest" && filter !== "Popular"}
                onClick={() => setshowTags(!showTags)}
              >
                {`${
                  filter !== "Newest" && filter !== "Popular" ? filter : "Tags"
                }`}
              </ToggleButton>
            </ToggleButtonGroup>
            <Button disableElevation variant="contained">
              Ask Question
            </Button>
          </Stack>
        </Stack>
        <Collapse in={showTags} timeout={1000}>
          {/* 
            // @ts-ignore */}
          <TagCloud
            minSize={12}
            maxSize={35}
            tags={generatedTags}
            renderer={customRenderer}
            onClick={(tag) => {
              handleFilterChange(event, tag.value);
              setshowTags(false);
            }}
          />
        </Collapse>
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

const postTags = [
  { name: "Visa" },
  { name: "Ticket" },
  { name: "Tour" },
  { name: "Hotel Booking" },
  { name: "Schengen" },
  { name: "Travel Insurance" },
  { name: "Express Entry" },
];

const generatedTags = postTags.map((tag) => ({
  value: tag.name,
  count: Math.floor(Math.random() * 100),
}));

const customRenderer = (tag, size, color) => {
  return (
    <Typography
      component="span"
      key={tag.value}
      style={{ color }}
      sx={{ fontSize: `${size}px`, cursor: "pointer" }}
    >
      {tag.value}
    </Typography>
  );
};
