import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  Collapse,
  Divider,
  Fab,
  LinearProgress,
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
  useMediaQuery,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import PostCard from "./postcard";
import { Box } from "@mui/system";
import { useRecoilState } from "recoil";
import {
  blockLoading_,
  category_,
  filter_,
  mobileFilter_,
  posts_,
  selectCountry_,
  sidebarFilter_,
} from "../lib/recoil";
import MobileFab from "./others/mobilefab";
import MobileCategoryChanger from "./others/mobilecategorychanger";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { countries, tags, useFetchPosts } from "../lib/utility";
import { flatten, lowerCase, pullAll, startCase, uniq, uniqBy } from "lodash";
import { styled } from "@mui/material/styles";
import axios from "axios";
import useSWRImmutable from "swr/immutable";
import ReactVisibilitySensor from "react-visibility-sensor";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const Root = styled("li")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

/* const fetchPosts = async (key) => {
  try {
    const dbFilter = JSON.parse(key);
    console.log("dbFilter in fetch", dbFilter);
    const posts = await axios.post("/api/getposts", { ...dbFilter });
    console.log("posts", posts.data);
    return posts.data;
  } catch (error) {
    console.log("error", error);
  }
}; */

export default function PostList({ ssrTags }) {
  const [renderFilter, setRenderFilter] = React.useState([]);
  const [value, setValue] = useRecoilState(mobileFilter_);
  const [blockLoading, setBlockLoading] = useRecoilState(blockLoading_);
  const [sidebarFilter, setSidebarFilter] = useRecoilState(sidebarFilter_);
  // @ts-ignore
  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });

  console.log("ssrTags", ssrTags);

  const [dbFilter, setDBfilter] = React.useState({
    post_type: [],
    countries: [],
    otherTags: [],
    index: 1,
  });

  /* const {
    data: posts,
    mutate,
    isValidating,
    isLoading,
  } = useSWRImmutable(JSON.stringify(dbFilter), fetchPosts, {
    keepPreviousData: true,
  }); */

  const {
    posts: db_posts,
    isLoading,
    isValidating,
  } = useFetchPosts(ssrTags ? JSON.stringify(dbFilter) : undefined);

  const [posts, setPosts] = useRecoilState(posts_);

  React.useEffect(() => {
    setPosts(db_posts);
  }, [isLoading, isValidating]);

  React.useEffect(() => {
    if (mobile) {
      setSidebarFilter([]);
    } else {
      setValue([]);
    }
  }, [mobile]);

  React.useEffect(() => {
    if (isLoading || isValidating) {
      setBlockLoading(true);
    } else {
      setBlockLoading(false);
    }
  }, [isLoading, isValidating]);

  React.useEffect(() => {
    const tag1 = uniq(flatten(ssrTags.map((doc) => doc.tags.countries)));
    const tag2 = uniq(flatten(ssrTags.map((doc) => doc.tags.otherTags)));
    const post_type = ["post", "question"];

    const allTags = [
      "post_type",
      ...post_type,
      "tags",
      ...tag2,
      "countries",
      ...tag1,
    ];

    // @ts-ignore
    setRenderFilter([...allTags.map((tag) => ({ name: tag }))]);
  }, [null]);

  React.useEffect(() => {
    let dbfilterTemplate = {
      post_type: [],
      countries: [],
      otherTags: [],
      index: 1,
    };
    const filterValuesArray1 = value.map((item) => item.name);
    const filterValuesArray2 = value.map((item) => item.name);
    const filterValuesArray3 = value.map((item) => item.name);
    const tag1 = flatten(ssrTags.map((doc) => doc.tags.countries));
    const tag2 = flatten(ssrTags.map((doc) => doc.tags.otherTags));
    const post_type = ["post", "question"];
    const countriesandtags = [...tag1, ...tag2];
    const lessPostType = pullAll(filterValuesArray1, countriesandtags);
    // @ts-ignore
    dbfilterTemplate.post_type = lessPostType;
    const post_typeandtags = [...post_type, ...tag2];
    const lessCountries = pullAll(filterValuesArray2, post_typeandtags);
    // @ts-ignore
    dbfilterTemplate.countries = lessCountries;
    const post_typeandcountries = [...post_type, ...tag1];
    const lessOtherTags = pullAll(filterValuesArray3, post_typeandcountries);
    // @ts-ignore
    dbfilterTemplate.otherTags = lessOtherTags;

    console.log("dbfilterTemplate", dbfilterTemplate);
    setDBfilter(dbfilterTemplate);
  }, [value.map((item) => item.name).toLocaleString()]);

  console.log("renderFilter", renderFilter, value);
  console.log("dbFilter", dbFilter);
  console.log("posts", posts);

  const readMore = (isVisible) => {
    console.log("isVisible", isVisible);
    if (isVisible && posts) {
      setDBfilter({ ...dbFilter, index: posts.length / 5 + 1 });
    }
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
      <Stack spacing={3}>
        {/* Mobile Head */}
        <Stack spacing={1} sx={{ display: { xs: "flex", md: "none" }, mt: 2 }}>
          <Autocomplete
            multiple
            size="small"
            id="checkboxes-tags-demo"
            options={renderFilter}
            disableCloseOnSelect
            // @ts-ignore
            getOptionLabel={(option) => option.name}
            value={value}
            onChange={(e, v, r) => {
              // @ts-ignore
              setValue(uniqBy(v, "name"));
            }}
            renderOption={(props, option, { selected }) => {
              // @ts-ignore
              if (option.name === "post_type") {
                return (
                  <Box sx={{ pointerEvents: "none" }} component="li" {...props}>
                    <Divider sx={{ width: "100%" }}>
                      <Chip size="small" label="Post Type" color="primary" />
                    </Divider>
                  </Box>
                );
              }
              // @ts-ignore
              if (option.name === "tags") {
                return (
                  <Box sx={{ pointerEvents: "none" }} component="li" {...props}>
                    <Divider sx={{ width: "100%" }}>
                      <Chip size="small" label="Tags" color="primary" />
                    </Divider>
                  </Box>
                );
              }
              // @ts-ignore
              if (option.name === "countries") {
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
                    checked={
                      selected ||
                      Boolean(
                        value.map((item) => item.name).includes(option.name)
                      )
                    }
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
                label="Interests"
                placeholder="Select Your Interests"
              />
            )}
          />
        </Stack>

        <Stack
          spacing={2}
          divider={<Divider orientation="horizontal" flexItem />}
        >
          {(posts || []).map((post, index) => (
            <React.Fragment key={index}>
              <PostCard key={index} post={post} />
              <ReactVisibilitySensor
                active={Boolean(posts?.length - 1 === index)}
                onChange={readMore}
              >
                <div>...content goes here...</div>
              </ReactVisibilitySensor>
            </React.Fragment>
          ))}
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
