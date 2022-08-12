import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import React from "react";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import ViewTimelineOutlinedIcon from "@mui/icons-material/ViewTimelineOutlined";
import { useRecoilState } from "recoil";
import { category_ } from "../../lib/recoil";
import { styled } from "@mui/styles";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import Link from "next/link";
import { useRouter } from "next/router";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: "5px solid",
    borderColor: "primary.main",
  },
}));

export default function DesktopSideBar() {
  const [category, setCategory] = useRecoilState(category_);
  const router = useRouter();

  console.log("router", router.pathname);

  const handleCategory = (e) => {
    console.log("e", e);
    setCategory(e.target.innerText);
  };

  return (
    <Box
      sx={{
        width: "250px",
        position: "fixed",
        display: { xs: "none", md: "block" },
      }}
    >
      <Stack>
        <List dense component="nav" aria-label="category">
          <Link href="/social">
            <CustomListItemButton
              selected={category === "All Posts"}
              onClick={handleCategory}
            >
              <ListItemIcon>
                <HomeOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="All Posts" />
            </CustomListItemButton>
          </Link>
          <Link href="/social">
            <CustomListItemButton
              selected={category === "My Timeline"}
              onClick={handleCategory}
            >
              <ListItemIcon>
                <ViewTimelineOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="My Timeline" />
            </CustomListItemButton>
          </Link>
        </List>

        <Divider sx={{ my: 2 }} />

        <Button
          startIcon={<ContactSupportIcon sx={{ mr: 3 }} />}
          disableElevation
          sx={{ justifyContent: "flex-start", pl: 3 }}
          // variant="outlined"
        >
          Ask a Question
        </Button>

        <Button
          startIcon={<AssignmentOutlinedIcon sx={{ mr: 3 }} />}
          disableElevation
          sx={{ justifyContent: "flex-start", pl: 3 }}
          // variant="outlined"
        >
          Create a Post
        </Button>

        {router.pathname !== "/social" && (
          <Button
            startIcon={<PostAddOutlinedIcon sx={{ mr: 3 }} />}
            disableElevation
            sx={{ justifyContent: "flex-start", pl: 3 }}
            // variant="outlined"
          >
            Add Comment
          </Button>
        )}

        {/*    <Autocomplete
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
    <List dense component="nav" aria-label="category">
      <CustomListItemButton
        selected={category === "All Categories"}
        onClick={handleCategory}
      >
        <ListItemText primary="All Categories" />
      </CustomListItemButton>
      {postTags.map(({ name }, i) => (
        <CustomListItemButton
          selected={category === name}
          onClick={handleCategory}
          key={i}
        >
          <ListItemText primary={name} />
        </CustomListItemButton>
      ))}
    </List> */}
      </Stack>
    </Box>
  );
}
