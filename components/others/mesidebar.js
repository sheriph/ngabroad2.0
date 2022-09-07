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
import ViewTimelineOutlinedIcon from "@mui/icons-material/ViewTimelineOutlined";
import { useRecoilState } from "recoil";
import { meCategory_ } from "../../lib/recoil";
import { styled } from "@mui/styles";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuthUser } from "../../lib/utility";

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: "5px solid",
    borderColor: "primary.main",
  },
}));

export default function MeSideBar({ ssrUser }) {
  const [meCtegory, setMeCategory] = useRecoilState(meCategory_);

  const { user, loading, error, mutate } = useAuthUser();

  const handleCategory = (e) => {
    console.log("e", e);
    setMeCategory(e.target.innerText);
  };

  React.useEffect(() => {
    if (!loading && ssrUser._id !== user?._id) {
      setMeCategory("Account Details");
    }
  }, [ssrUser._id === user?._id]);

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
          <CustomListItemButton
            selected={meCtegory === "Account Details"}
            onClick={handleCategory}
          >
            <ListItemIcon>
              <PersonOutlineOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Account Details" />
          </CustomListItemButton>
          {ssrUser._id === user?._id && (
            <React.Fragment>
              <CustomListItemButton
                selected={meCtegory === "Edit Profile"}
                onClick={handleCategory}
              >
                <ListItemIcon>
                  <ModeEditOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Edit Profile" />
              </CustomListItemButton>
              <CustomListItemButton
                selected={meCtegory === "Password and Security"}
                onClick={handleCategory}
              >
                <ListItemIcon>
                  <LockOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Password and Security" />
              </CustomListItemButton>
            </React.Fragment>
          )}
        </List>

        {/*  <Divider sx={{ my: 2 }} /> */}
      </Stack>
    </Box>
  );
}
