import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { money } from "../lib/utility";
import { visaProducts_ } from "../lib/recoil";
import { useRecoilState } from "recoil";
import CountUp from "react-countup";

export default function CheckboxList() {
  const [visaProducts, setVisaProducts] = useRecoilState(visaProducts_);
  const getTotalPrice = (products) => {
    try {
      return products
        .filter((product) => product.selected)
        .reduce((a, b) => a + b.price, 0);
    } catch (error) {
      console.log("error", error);
      return 0;
    }
  };
  const [counterEnd, setCounterEnd] = React.useState(
    getTotalPrice(visaProducts)
  );

  const handleToggle = (e) => {
    console.log("e", e);
    const text = e.target.innerText;
    const updatedProducts = visaProducts.map((visaProduct) => ({
      ...visaProduct,
      selected:
        visaProduct.name === text
          ? !visaProduct.selected
          : visaProduct.selected,
    }));
    setVisaProducts(updatedProducts);
    setCounterEnd(getTotalPrice(updatedProducts));
  };

  return (
    <Stack variant="outlined" component={Paper}>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {visaProducts.map((visaProduct, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <Typography>
                {visaProduct.price ? money(visaProduct.price) : "Free"}
              </Typography>
            }
            disablePadding
          >
            <ListItemButton onClick={handleToggle} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={visaProduct.selected}
                  size="medium"
                  //  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={visaProduct.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Stack sx={{ p: 2 }} justifyContent="space-between" direction="row">
        <CountUp
          start={0}
          end={counterEnd}
          duration={2.75}
          separator=" "
          // decimals={4}
          decimal=","
          prefix="₦ "
          delay={0}
          redraw={true}
        >
          {({ countUpRef, start, update }) => (
            <Button startIcon={<>Grand Total :</>} variant="outlined">
              <span ref={countUpRef} />
            </Button>
          )}
        </CountUp>
        <Button variant="contained">Complete</Button>
      </Stack>
    </Stack>
  );
}
