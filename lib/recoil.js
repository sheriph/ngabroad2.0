/* export const userData_ = atom({
    key: "userData_",
    default: null,
    dangerouslyAllowMutability: true,
  }); */

import { atom } from "recoil";

export const isLoading_ = atom({
  key: "isLoading_",
  default: false,
});

export const countState_ = atom({
  key: "count",
  default: 0,
});

export const pageBreadcrumb_ = atom({
  key: "pageBreadcrumb_",
  default: "",
});

export const filter_ = atom({
  key: "filter_",
  default: "Newest",
});