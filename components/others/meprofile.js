import {
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

export default function MeProfile() {
  const { user, loading, error, mutate } = useAuthUser();


  
  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead></TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left" component="th" scope="row">
              {startCase(lowerCase(`${user?.firstName} ${user?.lastName}`))}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">Username</TableCell>
            <TableCell align="left" component="th" scope="row">
              {user?.username}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">Gender</TableCell>
            <TableCell align="left" component="th" scope="row">
              {user?.gender}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">Registered Date</TableCell>
            <TableCell align="left" component="th" scope="row">
              {dayjs(user?.createdAt).format("Do MMMM, YYYY")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">Role</TableCell>
            <TableCell align="left" component="th" scope="row">
              {user?.role}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">Last Seen</TableCell>
            <TableCell align="left" component="th" scope="row">
              {dayjs(user?.lastSeen).format("Do MMMM, YYYY")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">Likes</TableCell>
            <TableCell align="left" component="th" scope="row">
              {user?.stats?.likes}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">Dislikes</TableCell>
            <TableCell align="left" component="th" scope="row">
              {user?.stats?.dislikes}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">Posts</TableCell>
            <TableCell align="left" component="th" scope="row">
              {user?.stats?.posts}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">Comments</TableCell>
            <TableCell align="left" component="th" scope="row">
              {user?.stats?.comments}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">Questions</TableCell>
            <TableCell align="left" component="th" scope="row">
              {user?.stats?.questions}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">Answers</TableCell>
            <TableCell align="left" component="th" scope="row">
              {user?.stats?.answers}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
