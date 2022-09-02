import {
  Avatar,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import { lowerCase } from "lodash";
import { startCase } from "lodash";
import React from "react";
import useSWR from "swr";
import { useAuthUser } from "../../lib/utility";
const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat);

export default function UserProfile({ ssrUser }) {
  const { user } = useAuthUser(ssrUser);

  return (
    <Container maxWidth="md">
      <Stack justifyContent="center" alignItems="center" spacing={3}>
        <Avatar
          sx={{
            width: { xs: 56, md: 100 },
            height: { xs: 56, md: 100 },
            mt: 3,
          }}
          alt={user.username}
          src={user.image}
        />
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead></TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center" component="th" scope="row">
                  {startCase(lowerCase(`${user?.firstName} ${user?.lastName}`))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Username</TableCell>
                <TableCell align="center" component="th" scope="row">
                  {user?.username}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Gender</TableCell>
                <TableCell align="center" component="th" scope="row">
                  {user?.gender}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Registered Date</TableCell>
                <TableCell align="center" component="th" scope="row">
                  {dayjs(user?.createdAt).format("Do MMMM, YYYY")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center" component="th" scope="row">
                  {user?.role}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Last Seen</TableCell>
                <TableCell align="center" component="th" scope="row">
                  {dayjs(user?.lastSeen).format("Do MMMM, YYYY")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Likes</TableCell>
                <TableCell align="center" component="th" scope="row">
                  {user?.stats?.likes}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Dislikes</TableCell>
                <TableCell align="center" component="th" scope="row">
                  {user?.stats?.dislikes}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Posts</TableCell>
                <TableCell align="center" component="th" scope="row">
                  {user?.stats?.posts}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Comments</TableCell>
                <TableCell align="center" component="th" scope="row">
                  {user?.stats?.comments}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Questions</TableCell>
                <TableCell align="center" component="th" scope="row">
                  {user?.stats?.questions}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Answers</TableCell>
                <TableCell align="center" component="th" scope="row">
                  {user?.stats?.answers}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
}
