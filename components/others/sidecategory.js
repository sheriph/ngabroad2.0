import React from "react";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { styled } from "@mui/styles";
import { postTags } from "../../lib/utility";

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: "5px solid",
    borderColor: "primary.main",
  },
}));

export default function CategoryJsx({ category, handleCategory }) {
  return (
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
    </List>
  );
}
