import {
  Box,
  Button,
  Drawer,
  Stack,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import dynamic from "next/dynamic";
import React from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useSWRConfig } from "swr";
import { queryParams_ } from "../../lib/recoil";
import { useRecoilState, useRecoilValue } from "recoil";
//import Flights from "../../components/flight/flights";
//import FlightFilter from "../../components/flight/filter";

//import Flights from "../components/flight/flights";

const Flights = dynamic(() => import("../../components/flight/flights"), {
  ssr: false,
});

const FlightFilter = dynamic(() => import("../../components/flight/filter"), {
  ssr: false,
});

export default function FlightsPage() {
  // @ts-ignore
  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const handleDrawer = () => setDrawerOpen(!drawerOpen);
  const queryParams = useRecoilValue(queryParams_);

  const { cache } = useSWRConfig();

  console.log("cache", cache.get(JSON.stringify(queryParams)));

  return (
    <Stack direction="row">
      <Box>
        <Drawer
          onClose={handleDrawer}
          keepMounted
          open={drawerOpen}
          variant={mobile ? "temporary" : "permanent"}
          sx={{
            width: 250,
            //  pl: 2,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 250,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto", ml: 2 }}>
            {/* 
        // @ts-ignore */}
            <FlightFilter />
          </Box>
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Mobile Head */}
        <Stack
          justifyContent="center"
          sx={{ display: { xs: "flex", md: "none" }, mb: 1 }}
        >
          <Button onClick={handleDrawer} endIcon={<FilterListIcon />}>
            Filter
          </Button>
        </Stack>
        {/* 
        // @ts-ignore */}
        <Flights />
      </Box>
    </Stack>
  );
}
