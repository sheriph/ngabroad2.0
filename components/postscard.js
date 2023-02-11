import { Link, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import SinglePostCard from "./singlepostcard";
import { default as NextLink } from "next/link";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { first } from "lodash";

// @ts-ignore
export default React.memo(function PostsCard({ post }) {
  console.log("posts in postscard", post);
  return (
    <Box>
      <Stack spacing={1}>
        <Stack
          sx={{ display: { xs: "flex", md: "none" } }}
          alignItems="center"
          spacing={1}
          direction="row"
        >
          <NextLink href="/forum" passHref>
            <Link
              sx={{
                alignItems: "center",
                display: "flex",
                ml: 0,
                pl: 0,
                mb: 2,
                mt: 1,
              }}
              variant="caption"
              gutterBottom
            >
              <ChevronLeftIcon fontSize="small" sx={{ ml: 0, pl: 0 }} /> Back to
              forum
            </Link>
          </NextLink>
        </Stack>

        <Stack>
          {post.map((item, index) => {
            return (
              <Stack key={index}>
                <SinglePostCard
                  // @ts-ignore
                  post={item}
                  parentPost={first(post)}
                  index={index}
                />
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
});
const text = `I am an instructor in a STEM field. I am teaching an upper-division course where I try to interact with the students rather than just lecturing. I am teaching in the students' native language; there do not seem to be any language issues.

I am struggling because the students tend to give wrong answers to simple questions I ask during lectures. These really are simple questions; they should have learned this material during the first few weeks of their first year.

To make matters clear, let me give an example. If we are in the middle of a proof, I might ask "what is the result of log (a * b)?". The right answer is "log(a) + log(b)", however, they will say "log(a) * log (b)" as an answer. Then, I did not see any other way and would say "no guys, it is log(a)+log(b)."

Situations like this repeated over the entire semester. Students complained to my boss and in the student evaluation that I was demeaning them and that I was upset when they answered something other than the answer I wanted to.

I will teach some of these students next year in another course and I have a hard time trying to find a way to solve this issue. The only solution I see for this is to just lecture and not encourage participation in class. However, I was wondering if there would be any other wiser solution.

Tips from here are good, but instead of a colleague, I'm dealing with students.

Edit: This is actually an upper-division chemistry course. The situation above arises, for example, when I have to explain why pH + pOH = 14. Students should have learned that in general chemistry, but I like to derive it to remind them. When I perform the derivation, I start from the auto-ionization of water and eventually arrive at: 14 = -log ([H3O+][OH-]). Then I ask them how to simplify this in order to complete the proof. But they do not remember the properties of logs.`;
