import React from "react";
import EditorJSRender from "../lib/editorjsrender";

export default function Blocks() {
  return <EditorJSRender blocks={myBlocks} />;
}

const myBlocks = [
  {
    id: "spgmYr-cpm",
    type: "header",
    data: {
      text: 'Life of a super start THIS IS A <a href="http://localhost:3000/sample/">HEADER</a>',
      level: 2,
      alignment: "left",
    },
  },
  {
    id: "MJ-q7sVua_",
    type: "paragraph",
    data: {
      text: `To dynamically <b>load</b> a component on the client side, you can use the SSR option to disable <i>server rendering</i>. This is useful if an <a href="#">external</a> dependency or <mark class="cdx-marker">component</mark> relies on <s class="cdx-strikethrough">browser APIs</s> like a <u class="cdx-underline">window</u>.`,
    },
  },
  {
    id: "JjYF7JQ7rb",
    type: "paragraph",
    data: {
      text: "The following is a list of names:",
    },
  },
  {
    id: "Rt2noCSZhd",
    type: "list",
    data: {
      style: "ordered",
      items: ["Cat", "dog", "animal", "mammals"],
    },
  },
  {
    id: "8-K-LbVVpW",
    type: "delimiter",
    data: {},
  },
  {
    id: "9Gy6oOZ1Zw",
    type: "table",
    data: {
      withHeadings: true,
      content: [
        ["Name", "Ideas", "Year"],
        ["sheriff", "business", "2022"],
        ["tunde", "school", "2020"],
      ],
    },
  },
  {
    id: "gKFOJNCFIb",
    type: "image",
    data: {
      file: {
        url: "https://thumbs.dreamstime.com/b/yellow-orange-starburst-flower-nature-jpg-192959431.jpg",
      },
      caption: "",
      withBorder: false,
      stretched: false,
      withBackground: false,
    },
  },
];
