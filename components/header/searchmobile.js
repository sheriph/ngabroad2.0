import {
  AppBar,
  Autocomplete,
  Avatar,
  Button,
  CircularProgress,
  Container,
  Dialog,
  Divider,
  Fade,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Popper,
  Skeleton,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import React from "react";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import PropTypes from "prop-types";
import { Box } from "@mui/system";
import { useRecoilState } from "recoil";
import {
  addPost_,
  login_,
  mobileSearchOpen_,
  searchText_,
} from "../../lib/recoil";
import useSWR from "swr";
import { Auth } from "aws-amplify";
import AccountMenu from "./accountmenu";
import OtherMenu from "./othermenu";
import ForumIcon from "@mui/icons-material/Forum";
import { useAuthUser } from "../../lib/utility";
import ForumMenu from "./forummenu";
import Slide from "@mui/material/Slide";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import useSWRImmutable from "swr/immutable";
import axios from "axios";
import ArticleRender from "../others/articlerender";
import { truncate } from "lodash";
import IntroRender from "../others/introrender";
import { useRouter } from "next/router";

const Transition = React.forwardRef(function Transition(props, ref) {
  // @ts-ignore
  return <Slide direction="down" ref={ref} {...props} />;
});

const PopperMy = function (props) {
  return (
    <Popper {...props} style={{ width: "100%" }} placement="bottom-start" />
  );
};

export default function SearchMobile() {
  const [openSearch, setOpenSearch] = useRecoilState(mobileSearchOpen_);
  const [text, setText] = React.useState("");
  const [value, setValue] = useRecoilState(searchText_);
  const [options, setOptions] = React.useState([]);
  const router = useRouter();

  const fetchPosts = async (key) => {
    try {
      const text = key.split("textsearchkey")[1];
      console.log("text", text);
      const res = await axios.post("/api/autosearch", { text });
      console.log("res.data", res.data);
      setOptions(res.data);
      res.data;
    } catch (error) {
      console.log("error", error);
    }
  };

  const { data, mutate, isValidating, isLoading } = useSWRImmutable(
    text ? `textsearchkey${text}` : undefined,
    fetchPosts,
    {
      keepPreviousData: true,
    }
  );

  const handleSearch = () => {
    console.log("text", value);
    setText(value);
  };
  

  React.useEffect(() => {
    return () => {
      setOpenSearch(false);
    };
  }, [null]);

  console.log("options", options);

  return (
    <Dialog
      fullScreen
      open={openSearch}
      // keepMounted={true}
      // @ts-ignore
      TransitionComponent={Transition}
    >
      <Stack
        sx={{
          backgroundColor: "primary.main",
          p: 1,
          "& .MuiAutocomplete-listbox": { maxHeight: "100vh" },
        }}
        spacing={2}
        direction="row"
      >
        <IconButton
          sx={{ color: "white" }}
          onClick={() => setOpenSearch(false)}
        >
          <KeyboardArrowUpOutlinedIcon />
        </IconButton>
        <Autocomplete
          disablePortal
          PopperComponent={PopperMy}
          fullWidth
          open={Boolean(options?.length > 0)}
          inputValue={value}
          disableClearable
          onInputChange={(e, v, r) => {
            setValue(v);
          }}
          componentsProps={{
            paper: {
              variant: "outlined",
            },
            clearIndicator: { sx: { color: "white" } },
            // popper: { modifiers: [] },
          }}
          size="small"
          id="combo-box-demo"
          // @ts-ignore
          options={options}
          // @ts-ignore
          getOptionLabel={(option) => option?.title}
          freeSolo
          renderOption={(props, option) => (
            <Box
              component="li"
              // sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
              {...props}
              onClick={() => {
                // @ts-ignore
                router.push(`/${option.slug}`);
              }}
            >
              <Stack spacing={1}>
                <Typography variant="h2">
                  {
                    // @ts-ignore
                    option?.title
                  }
                </Typography>
                <IntroRender
                  // @ts-ignore
                  content={truncate(option.content, { length: 150 })}
                />
                <Divider />
              </Stack>
            </Box>
          )}
          //    sx={{ "& .MuiAutocomplete-endAdornment": { mr: 2 } }}
          renderInput={(params) => (
            <TextField
              sx={{
                backgroundColor: (t) => alpha(t.palette.common.white, 0.15),
                borderRadius: (t) => t.shape.borderRadius,
                "& .MuiAutocomplete-endAdornment": { mr: 2 },
              }}
              {...params}
              placeholder="Search ..."
              variant="standard"
              inputProps={{
                ...params.inputProps,
                style: { color: "white" },
                autoFocus: true,
              }}
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
                sx: {
                  height: 40,
                  px: 2,
                },
                endAdornment: (
                  <InputAdornment sx={{ cursor: "pointer" }} position="end">
                    {isLoading || isValidating ? (
                      <CircularProgress size={25} sx={{ color: "white" }} />
                    ) : (
                      <IconButton onClick={handleSearch}>
                        <SearchIcon sx={{ color: "white" }} />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Stack>
    </Dialog>
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
  { title: "Casablanca", year: 1942 },
  { title: "City Lights", year: 1931 },
  { title: "Psycho", year: 1960 },
  { title: "The Green Mile", year: 1999 },
  { title: "The Intouchables", year: 2011 },
  { title: "Modern Times", year: 1936 },
  { title: "Raiders of the Lost Ark", year: 1981 },
  { title: "Rear Window", year: 1954 },
  { title: "The Pianist", year: 2002 },
  { title: "The Departed", year: 2006 },
  { title: "Terminator 2: Judgment Day", year: 1991 },
  { title: "Back to the Future", year: 1985 },
  { title: "Whiplash", year: 2014 },
  { title: "Gladiator", year: 2000 },
  { title: "Memento", year: 2000 },
  { title: "The Prestige", year: 2006 },
  { title: "The Lion King", year: 1994 },
  { title: "Apocalypse Now", year: 1979 },
  { title: "Alien", year: 1979 },
  { title: "Sunset Boulevard", year: 1950 },
  {
    title:
      "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
    year: 1964,
  },
  { title: "The Great Dictator", year: 1940 },
  { title: "Cinema Paradiso", year: 1988 },
  { title: "The Lives of Others", year: 2006 },
  { title: "Grave of the Fireflies", year: 1988 },
  { title: "Paths of Glory", year: 1957 },
  { title: "Django Unchained", year: 2012 },
  { title: "The Shining", year: 1980 },
  { title: "WALL·E", year: 2008 },
  { title: "American Beauty", year: 1999 },
  { title: "The Dark Knight Rises", year: 2012 },
  { title: "Princess Mononoke", year: 1997 },
  { title: "Aliens", year: 1986 },
  { title: "Oldboy", year: 2003 },
  { title: "Once Upon a Time in America", year: 1984 },
  { title: "Witness for the Prosecution", year: 1957 },
  { title: "Das Boot", year: 1981 },
  { title: "Citizen Kane", year: 1941 },
  { title: "North by Northwest", year: 1959 },
  { title: "Vertigo", year: 1958 },
  {
    title: "Star Wars: Episode VI - Return of the Jedi",
    year: 1983,
  },
  { title: "Reservoir Dogs", year: 1992 },
  { title: "Braveheart", year: 1995 },
  { title: "M", year: 1931 },
  { title: "Requiem for a Dream", year: 2000 },
  { title: "Amélie", year: 2001 },
  { title: "A Clockwork Orange", year: 1971 },
  { title: "Like Stars on Earth", year: 2007 },
  { title: "Taxi Driver", year: 1976 },
  { title: "Lawrence of Arabia", year: 1962 },
  { title: "Double Indemnity", year: 1944 },
  {
    title: "Eternal Sunshine of the Spotless Mind",
    year: 2004,
  },
  { title: "Amadeus", year: 1984 },
  { title: "To Kill a Mockingbird", year: 1962 },
  { title: "Toy Story 3", year: 2010 },
  { title: "Logan", year: 2017 },
  { title: "Full Metal Jacket", year: 1987 },
  { title: "Dangal", year: 2016 },
  { title: "The Sting", year: 1973 },
  { title: "2001: A Space Odyssey", year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: "Toy Story", year: 1995 },
  { title: "Bicycle Thieves", year: 1948 },
  { title: "The Kid", year: 1921 },
  { title: "Inglourious Basterds", year: 2009 },
  { title: "Snatch", year: 2000 },
  { title: "3 Idiots", year: 2009 },
  { title: "Monty Python and the Holy Grail", year: 1975 },
];
