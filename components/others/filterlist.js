import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { postType_ } from "../../lib/recoil";
import { useRecoilState } from "recoil";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = ["Posts", "Questions"];

export default function MultipleSelectCheckmarks() {
  const [postType, setPostType] = useRecoilState(postType_);

  console.log("postType", postType);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPostType(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl sx={{ width: 100 }}>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={postType}
          onChange={handleChange}
          //   input={<OutlinedInput />}
          renderValue={(selected) => selected.join(", ")}
          size="small"
          variant="standard"
          disableUnderline

          //   MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox
                checked={
                  postType.indexOf(
                    // @ts-ignore
                    name
                  ) > -1
                }
              />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
