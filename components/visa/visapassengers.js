import {
  Box,
  FormControl,
  Fab,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ChildCareOutlinedIcon from "@mui/icons-material/ChildCareOutlined";

export default function VisaPassengers({ value, onChange }) {
  return (
    <FormControl sx={{ width: { xs: "100%", md: "300px" } }}>
      <Typography sx={{ pl: 2, fontWeight: "bold", mb: 1 }}>
        Travelers
      </Typography>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row">
            <IconButton>
              <PersonIcon />
            </IconButton>
            <Stack>
              <Typography>Adult</Typography>
              <Typography variant="caption">Over 12</Typography>
            </Stack>
          </Stack>
          <Stack spacing={1} alignItems="center" direction="row">
            <Fab
              color="primary"
              onClick={() =>
                onChange({
                  ...value,
                  adult: value.adult < 9 ? value.adult + 1 : value.adult,
                })
              }
              sx={{
                boxShadow: "none",
                minHeight: "35px",
                height: "35px",
                width: "35px",
              }}
            >
              <AddIcon />
            </Fab>
            <Typography>{value.adult}</Typography>
            <Fab
              onClick={() =>
                onChange({
                  ...value,
                  adult: value.adult - 1,
                  infant:
                    value.infant < value.adult - 1
                      ? value.infant
                      : value.adult - 1,
                })
              }
              sx={{
                boxShadow: "none",
                minHeight: "35px",
                height: "35px",
                width: "35px",
              }}
              color="primary"
              disabled={value.adult === 1}
            >
              <RemoveIcon />
            </Fab>
          </Stack>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row">
            <IconButton>
              <ChildCareOutlinedIcon />
            </IconButton>
            <Stack>
              <Typography>Children</Typography>
              <Typography variant="caption">2 - 12</Typography>
            </Stack>
          </Stack>
          <Stack spacing={1} alignItems="center" direction="row">
            <Fab
              onClick={() =>
                onChange({
                  ...value,
                  child: value.child < 9 ? value.child + 1 : value.child,
                })
              }
              sx={{
                boxShadow: "none",
                minHeight: "35px",
                height: "35px",
                width: "35px",
              }}
              color="primary"
            >
              <AddIcon />
            </Fab>
            <Typography>{value.child}</Typography>
            <Fab
              onClick={() => onChange({ ...value, child: value.child - 1 })}
              sx={{
                boxShadow: "none",
                minHeight: "35px",
                height: "35px",
                width: "35px",
              }}
              color="primary"
              disabled={value.child === 0}
            >
              <RemoveIcon />
            </Fab>
          </Stack>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row">
            <IconButton>
              <ChildCareOutlinedIcon />
            </IconButton>
            <Stack>
              <Typography>Infant</Typography>
              <Typography variant="caption">Under 2</Typography>
            </Stack>
          </Stack>
          <Stack spacing={1} alignItems="center" direction="row">
            <Fab
              onClick={() =>
                onChange({
                  ...value,
                  infant:
                    value.infant < value.adult
                      ? value.infant + 1
                      : value.infant,
                })
              }
              sx={{
                boxShadow: "none",
                minHeight: "35px",
                height: "35px",
                width: "35px",
              }}
              color="primary"
            >
              <AddIcon />
            </Fab>
            <Typography>{value.infant}</Typography>
            <Fab
              onClick={() => onChange({ ...value, infant: value.infant - 1 })}
              sx={{
                boxShadow: "none",
                minHeight: "35px",
                height: "35px",
                width: "35px",
              }}
              color="primary"
              disabled={value.infant === 0}
            >
              <RemoveIcon />
            </Fab>
          </Stack>
        </Stack>
      </Stack>
    </FormControl>
  );
}
