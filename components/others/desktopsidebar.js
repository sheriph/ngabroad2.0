import { Box, Button, Stack } from "@mui/material";
import React from "react";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import ViewTimelineOutlinedIcon from "@mui/icons-material/ViewTimelineOutlined";

export default function DesktopSideBar() {
  return (
    <Box
      sx={{
        width: "250px",
        position: "fixed",
        display: { xs: "none", md: "block" },
      }}
    >
      <Stack>
        <Button
          startIcon={<ContactSupportIcon />}
          disableElevation
          sx={{ justifyContent: "flex-start" }}
          // variant="outlined"
        >
          Ask a Question
        </Button>
        <Button
          startIcon={<ViewTimelineOutlinedIcon />}
          disableElevation
          sx={{ justifyContent: "flex-start" }}
          // variant="outlined"
        >
          My Timeline
        </Button>

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
