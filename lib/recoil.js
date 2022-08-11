import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

export const isLoading_ = atom({
  key: "isLoading_",
  default: false,
});

export const countState_ = atom({
  key: "count",
  default: 0,
});

const { persistAtom: persistFilter_ } = recoilPersist({
  key: "persistFilter_",
});

export const filter_ = atom({
  key: "filter_",
  default: "Newest",
  effects_UNSTABLE: [persistFilter_],
});

const { persistAtom: persistSelectCountry_ } = recoilPersist({
  key: "persistSelectCountry_",
});

export const selectCountry_ = atom({
  key: "selectCountry_",
  default: null,
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistSelectCountry_],
});

const { persistAtom: persistCategory_ } = recoilPersist({
  key: "persistSelectCategory_",
});

export const category_ = atom({
  key: "category_",
  default: "All Posts",
  effects_UNSTABLE: [persistCategory_],
});
