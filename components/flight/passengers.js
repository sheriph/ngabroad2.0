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
import { useRecoilState } from "recoil";
import { passengers_ } from "../../lib/recoil";

export default function Passengers() {
  const [passengers, setPassengers] = useRecoilState(passengers_);
  return (
    <FormControl sx={{ width: { xs: "100%", md: "300px" } }}>
      <Typography sx={{ pl: 2, fontWeight: "bold", mb: 1 }}>
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
                setPassengers((prev) => ({
                  ...prev,
                  adult: prev.adult < 9 ? prev.adult + 1 : prev.adult,
                }))
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
                setPassengers((prev) => ({
                  ...prev,
                  adult: prev.adult - 1,
                  infant:
                    prev.infant < prev.adult - 1 ? prev.infant : prev.adult - 1,
                }))
              }
              sx={{
                boxShadow: "none",
                minHeight: "35px",
                height: "35px",
                width: "35px",
              }}
              color="primary"
              disabled={passengers.adult === 1}
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
                setPassengers((prev) => ({
                  ...prev,
                  child: prev.child < 9 ? prev.child + 1 : prev.child,
                }))
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
                setPassengers((prev) => ({
                  ...prev,
                  infant:
                    prev.infant < prev.adult ? prev.infant + 1 : prev.infant,
                }))
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
