import {
  Avatar,
  Badge,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { truncate } from "lodash";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

export default function Test() {
  return (
    <Stack
      component={Paper}
      sx={{ p: { xs: 1, sm: 2 } }}
      divider={<Divider orientation="horizontal" flexItem />}
    >
      <Stack sx={{ py: 1 }} direction="row" spacing={2}>
        <Stack spacing={1}>
          <Avatar
            sx={{ mb: 1 }}
            alt="Remy Sharp"
            src="/static/images/avatar/1.jpg"
          />
          <Badge
            sx={{
              "& .MuiBadge-badge": { pl: 0, right: "12px" },
              cursor: "pointer",
            }}
            color="default"
            badgeContent={99}
          >
            <ThumbUpOutlinedIcon fontSize="small" />
          </Badge>
          <Badge
            sx={{ cursor: "pointer" }}
            color="default"
            badgeContent={99}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <ThumbDownAltOutlinedIcon fontSize="small" />
          </Badge>
          <ShareOutlinedIcon fontSize="small" sx={{ cursor: "pointer" }} />
        </Stack>
        <Stack>
          <Stack>
            <Typography variant="h1">How to live in new zealand</Typography>
            <Typography
              spacing={1}
              component={Stack}
              direction="row"
              variant="caption"
              divider={
                <Divider
                  sx={{ height: "15px", alignSelf: "center" }}
                  orientation="vertical"
                  flexItem
                />
              }
            >
              <span>By Sheriff Adeniyi</span>
              <span>27th Aug, 2022 - 10:25pm</span>
            </Typography>
            <Typography sx={{ mt: 2 }}>
              {truncate(text, { length: 200 })}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        divider={
          <Divider
            sx={{ borderColor: "primary.main" }}
            orientation="vertical"
            flexItem
          />
        }
        alignItems="center"
        sx={{ pt: 2, ml: 7 }}
        direction="row"
        spacing={1}
      >
        <Typography>100 Views</Typography>
        <Typography>100 Comments</Typography>
        <Button disableElevation size="small" variant="contained">
          Open        </Button>
      </Stack>
    </Stack>
  );
}

const text = `London. Michaelmas term lately over, and the Lord Chancellor sitting
in Lincoln's Inn Hall. Implacable November weather. As much mud in
the streets as if the waters had but newly retired from the face of
the earth, and it would not be wonderful to meet a Megalosaurus,
forty feet long or so, waddling like an elephantine lizard up
Holborn Hill.`;
