import {
  AppBar,
  Autocomplete,
  Avatar,
  Button,
  CircularProgress,
  ClickAwayListener,
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
import { useRouter } from "next/router";
import axios from "axios";
import useSWRImmutable from "swr/immutable";
import IntroRender from "../others/introrender";
import { truncate } from "lodash";

const Transition = React.forwardRef(function Transition(props, ref) {
  // @ts-ignore
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function SearchDesktop() {
  const [text, setText] = React.useState("");
  const [value, setValue] = useRecoilState(searchText_);
  // const [options, setOptions] = React.useState([]);
  const [openSearch, setOpenSearch] = React.useState(false);
  const router = useRouter();

  const fetchPosts = async (key) => {
    try {
      const text = key.split("textsearchkey")[1];
      console.log("text", text);
      const res = await axios.post("/api/autosearch", { text });
      console.log("res.data", res.data);

      return res.data;
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
    setText(value);
    setOpenSearch(true);
  };

  const container = React.useRef(null);
  //const [anchorEl, setAnchorEl] = React.useState(null);
  //const open = Boolean(anchorEl);
  //const id = open ? "simple-popper" : undefined;

  console.log("data", data);

  return (
    <ClickAwayListener onClickAway={() => setOpenSearch(false)}>
      <Stack>
        <TextField
          ref={container}
         // aria-describedby={id}
          fullWidth
          sx={{
            backgroundColor: (t) => alpha(t.palette.common.white, 0.15),
            borderRadius: (t) => t.shape.borderRadius,
            "& .MuiAutocomplete-endAdornment": { mr: 2 },
            width: 400,
          }}
          placeholder="Search ..."
          variant="standard"
          inputProps={{
            style: { color: "white" },
          }}
          InputProps={{
            disableUnderline: true,
            sx: { height: 35, px: 2 },
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
        <Popper
          sx={{
            width: 400,
            zIndex: (t) => t.zIndex.appBar,
            top: "10px",
          }}
         // id={id}
          open={openSearch && Boolean(data)}
          anchorEl={container.current}
        >
          <Stack
            sx={{
              p: 1,
              bgcolor: "background.paper",
              borderRadius: 1,
              maxHeight: "70vh",
              overflow: "auto",
            }}
          >
            <Stack
              divider={<Divider orientation="horizontal" flexItem />}
              spacing={1}
              sx={{ p: 2 }}
            >
              {data
                // @ts-ignore
                ?.map((post, index) => (
                  <Stack key={index}>
                    <Stack spacing={1}>
                      <Link
                        sx={{ textDecorationStyle: "dotted" }}
                        href={`/${post.slug}`}
                        variant="h2"
                      >
                        {post?.title}
                      </Link>
                      <IntroRender
                        content={truncate(post.content, { length: 150 })}
                      />
                    </Stack>
                  </Stack>
                ))}
            </Stack>
          </Stack>
        </Popper>
      </Stack>
    </ClickAwayListener>
  );
}

const top100Films = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather: Part II", year: 1974 },
  { label: "The Dark Knight", year: 2008 },
  { label: "12 Angry Men", year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: "Pulp Fiction", year: 1994 },
  {
    label: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { label: "The Good, the Bad and the Ugly", year: 1966 },
  { label: "Fight Club", year: 1999 },
  {
    label: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
  {
    label: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
  },
  { label: "Forrest Gump", year: 1994 },
  { label: "Inception", year: 2010 },
  {
    label: "The Lord of the Rings: The Two Towers",
    year: 2002,
  },
  { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { label: "Goodfellas", year: 1990 },
  { label: "The Matrix", year: 1999 },
  { label: "Seven Samurai", year: 1954 },
  {
    label: "Star Wars: Episode IV - A New Hope",
    year: 1977,
  },
  { label: "City of God", year: 2002 },
  { label: "Se7en", year: 1995 },
  { label: "The Silence of the Lambs", year: 1991 },
  { label: "It's a Wonderful Life", year: 1946 },
  { label: "Life Is Beautiful", year: 1997 },
  { label: "The Usual Suspects", year: 1995 },
  { label: "Léon: The Professional", year: 1994 },
  { label: "Spirited Away", year: 2001 },
  { label: "Saving Private Ryan", year: 1998 },
  { label: "Once Upon a Time in the West", year: 1968 },
  { label: "American History X", year: 1998 },
  { label: "Interstellar", year: 2014 },
  { label: "Casablanca", year: 1942 },
  { label: "City Lights", year: 1931 },
  { label: "Psycho", year: 1960 },
  { label: "The Green Mile", year: 1999 },
  { label: "The Intouchables", year: 2011 },
  { label: "Modern Times", year: 1936 },
  { label: "Raiders of the Lost Ark", year: 1981 },
  { label: "Rear Window", year: 1954 },
  { label: "The Pianist", year: 2002 },
  { label: "The Departed", year: 2006 },
  { label: "Terminator 2: Judgment Day", year: 1991 },
  { label: "Back to the Future", year: 1985 },
  { label: "Whiplash", year: 2014 },
  { label: "Gladiator", year: 2000 },
  { label: "Memento", year: 2000 },
  { label: "The Prestige", year: 2006 },
  { label: "The Lion King", year: 1994 },
  { label: "Apocalypse Now", year: 1979 },
  { label: "Alien", year: 1979 },
  { label: "Sunset Boulevard", year: 1950 },
  {
    label:
      "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
    year: 1964,
  },
  { label: "The Great Dictator", year: 1940 },
  { label: "Cinema Paradiso", year: 1988 },
  { label: "The Lives of Others", year: 2006 },
  { label: "Grave of the Fireflies", year: 1988 },
  { label: "Paths of Glory", year: 1957 },
  { label: "Django Unchained", year: 2012 },
  { label: "The Shining", year: 1980 },
  { label: "WALL·E", year: 2008 },
  { label: "American Beauty", year: 1999 },
  { label: "The Dark Knight Rises", year: 2012 },
  { label: "Princess Mononoke", year: 1997 },
  { label: "Aliens", year: 1986 },
  { label: "Oldboy", year: 2003 },
  { label: "Once Upon a Time in America", year: 1984 },
  { label: "Witness for the Prosecution", year: 1957 },
  { label: "Das Boot", year: 1981 },
  { label: "Citizen Kane", year: 1941 },
  { label: "North by Northwest", year: 1959 },
  { label: "Vertigo", year: 1958 },
  {
    label: "Star Wars: Episode VI - Return of the Jedi",
    year: 1983,
  },
  { label: "Reservoir Dogs", year: 1992 },
  { label: "Braveheart", year: 1995 },
  { label: "M", year: 1931 },
  { label: "Requiem for a Dream", year: 2000 },
  { label: "Amélie", year: 2001 },
  { label: "A Clockwork Orange", year: 1971 },
  { label: "Like Stars on Earth", year: 2007 },
  { label: "Taxi Driver", year: 1976 },
  { label: "Lawrence of Arabia", year: 1962 },
  { label: "Double Indemnity", year: 1944 },
  {
    label: "Eternal Sunshine of the Spotless Mind",
    year: 2004,
  },
  { label: "Amadeus", year: 1984 },
  { label: "To Kill a Mockingbird", year: 1962 },
  { label: "Toy Story 3", year: 2010 },
  { label: "Logan", year: 2017 },
  { label: "Full Metal Jacket", year: 1987 },
  { label: "Dangal", year: 2016 },
  { label: "The Sting", year: 1973 },
  { label: "2001: A Space Odyssey", year: 1968 },
  { label: "Singin' in the Rain", year: 1952 },
  { label: "Toy Story", year: 1995 },
  { label: "Bicycle Thieves", year: 1948 },
  { label: "The Kid", year: 1921 },
  { label: "Inglourious Basterds", year: 2009 },
  { label: "Snatch", year: 2000 },
  { label: "3 Idiots", year: 2009 },
  { label: "Monty Python and the Holy Grail", year: 1975 },
];
