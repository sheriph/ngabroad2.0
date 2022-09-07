import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  Collapse,
  Divider,
  Fab,
  ListItemButton,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Tab,
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
import MobileFab from "./others/mobilefab";
import MobileCategoryChanger from "./others/mobilecategorychanger";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { countries, postTags, tags } from "../lib/utility";
import { lowerCase, startCase } from "lodash";
import { styled } from "@mui/material/styles";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const Root = styled("li")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export default function PostList({ ssrPosts }) {
  const [filter, setFilter] = useRecoilState(filter_);
  const [tabValue, setTabValue] = React.useState("");

  const [renderFilter, setRenderFilter] = React.useState([]);

  React.useEffect(() => {
    const tag1 = countries.map((tag) => tag.name);
    const tag2 = Object.keys(tags);
    const allTags = ["start", "post", "question", ...tag2, "end", ...tag1];

    // @ts-ignore
    setRenderFilter([...allTags.map((tag) => ({ name: tag }))]);
  }, [null]);

  const handleFilterChange = (event, newAlignment) => {
    console.log("newAlignment", newAlignment);
    if (newAlignment) setFilter(newAlignment);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  console.log("renderFilter", renderFilter);

  return (
    <Box
      sx={{
        position: { xs: "inherit", md: "relative" },
        left: { xs: 0, md: "250px" },
        width: { xs: "100%", md: "calc(100% - 270px)" },
        marginLeft: { xs: `0 !important`, md: `16px !important` },
      }}
    >
      <Stack spacing={3}>
        {/* Mobile Head */}
        <Stack spacing={1} sx={{ display: { xs: "flex", md: "none" } }}>
          <Autocomplete
            multiple
            size="small"
            id="checkboxes-tags-demo"
            options={renderFilter}
            disableCloseOnSelect
            // @ts-ignore
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, { selected }) => {
              // @ts-ignore
              if (option.name === "start") {
                return (
                  <Box sx={{ pointerEvents: "none" }} component="li" {...props}>
                    <Divider sx={{ width: "100%" }}>
                      <Chip size="small" label="Tags" color="primary" />
                    </Divider>
                  </Box>
                );
              }
              // @ts-ignore
              if (option.name === "end") {
                return (
                  <Box sx={{ pointerEvents: "none" }} component="li" {...props}>
                    <Divider sx={{ width: "100%" }}>
                      <Chip size="small" label="Countries" color="primary" />
                    </Divider>
                  </Box>
                );
              }
              return (
                <Typography variant="caption" component="li" {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {
                    // @ts-ignore
                    startCase(lowerCase(option.name))
                  }
                </Typography>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filters"
                placeholder="Select Filters"
              />
            )}
          />
        </Stack>
        <Stack
          spacing={2}
          divider={<Divider orientation="horizontal" flexItem />}
        >
          <PostCard post={null} />
        </Stack>
      </Stack>
    </Box>
  );
}

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
  {
    title: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
  },
  { title: "Forrest Gump", year: 1994 },
  { title: "Inception", year: 2010 },
  {
    title: "The Lord of the Rings: The Two Towers",
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: "Goodfellas", year: 1990 },
  { title: "The Matrix", year: 1999 },
  { title: "Seven Samurai", year: 1954 },
  {
    title: "Star Wars: Episode IV - A New Hope",
    year: 1977,
  },
  { title: "City of God", year: 2002 },
  { title: "Se7en", year: 1995 },
  { title: "The Silence of the Lambs", year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: "Life Is Beautiful", year: 1997 },
  { title: "The Usual Suspects", year: 1995 },
  { title: "Léon: The Professional", year: 1994 },
  { title: "Spirited Away", year: 2001 },
  { title: "Saving Private Ryan", year: 1998 },
  { title: "Once Upon a Time in the West", year: 1968 },
  { title: "American History X", year: 1998 },
  { title: "Interstellar", year: 2014 },
];
