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

export const askQuestion_ = atom({
  key: "askQuestion_",
  default: false,
});

export const addComment_ = atom({
  key: "addComment_",
  default: false,
});

export const addPost_ = atom({
  key: "addPost_",
  default: false,
});

export const replyPost_ = atom({
  key: "replyPost_",
  default: false,
});

export const login_ = atom({
  key: "login_",
  default: false,
});

export const editorLoaded_ = atom({
  key: "editorLoaded_",
  default: false,
});

const { persistAtom: persistMeCategory_ } = recoilPersist({
  key: "persistSelectCategory_",
});

export const meCategory_ = atom({
  key: "meCategory_",
  default: "Account Details",
  effects_UNSTABLE: [persistMeCategory_],
});

export const postReplyData_ = atom({
  key: "postReplyData_",
  default: {
    parentPost: null,
    post: null,
    isComment: false,
  },
  dangerouslyAllowMutability: true,
});

export const host_ = atom({
  key: "host_",
  default: "",
});

export const updateProfile_ = atom({
  key: "updateProfile_",
  default: false,
});

export const updatePost_ = atom({
  key: "updatePost_",
  default: false,
});
