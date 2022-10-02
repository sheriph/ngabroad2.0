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

export default function Passengers() {
  const [passengers, setPassengers] = React.useState({
    adult: 1,
    child: 0,
    infant: 0,
  });
  return (
    <FormControl sx={{ width: { xs: "80%", md: "250px" } }}>
      <Typography sx={{ pl: 2, fontWeight: "bold", mb: 2 }}>
        Passengers
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
                setPassengers((prev) => ({ ...prev, adult: prev.adult + 1 }))
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
            <Typography>{passengers.adult}</Typography>
            <Fab
              onClick={() =>
                setPassengers((prev) => ({ ...prev, adult: prev.adult - 1 }))
              }
              sx={{
                boxShadow: "none",
                minHeight: "35px",
                height: "35px",
                width: "35px",
              }}
              color="primary"
              disabled={passengers.adult === 0}
            >
              <RemoveIcon />
            </Fab>
          </Stack>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row">
            <IconButton>
              <PersonIcon />
            </IconButton>
            <Stack>
              <Typography>Children</Typography>
              <Typography variant="caption">2 - 12</Typography>
            </Stack>
          </Stack>
          <Stack spacing={1} alignItems="center" direction="row">
            <Fab
              onClick={() =>
                setPassengers((prev) => ({ ...prev, child: prev.child + 1 }))
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
            <Typography>{passengers.child}</Typography>
            <Fab
              onClick={() =>
                setPassengers((prev) => ({ ...prev, child: prev.child - 1 }))
              }
              sx={{
                boxShadow: "none",
                minHeight: "35px",
                height: "35px",
                width: "35px",
              }}
              color="primary"
              disabled={passengers.child === 0}
            >
              <RemoveIcon />
            </Fab>
          </Stack>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row">
            <IconButton>
              <PersonIcon />
            </IconButton>
            <Stack>
              <Typography>Infant</Typography>
              <Typography variant="caption">Under 2</Typography>
            </Stack>
          </Stack>
          <Stack spacing={1} alignItems="center" direction="row">
            <Fab
              onClick={() =>
                setPassengers((prev) => ({ ...prev, infant: prev.infant + 1 }))
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
            <Typography>{passengers.infant}</Typography>
            <Fab
              onClick={() =>
                setPassengers((prev) => ({ ...prev, infant: prev.infant - 1 }))
              }
              sx={{
                boxShadow: "none",
                minHeight: "35px",
                height: "35px",
                width: "35px",
              }}
              color="primary"
              disabled={passengers.infant === 0}
            >
              <RemoveIcon />
            </Fab>
          </Stack>
        </Stack>
      </Stack>
    </FormControl>
  );
}
