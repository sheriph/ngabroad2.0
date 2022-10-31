import React from "react";
import {
  render,
  Mjml,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlText,
  MjmlGroup,
  MjmlDivider,
} from "mjml-react";

export default function FlightEmailSegment() {
  return (
    <MjmlGroup width="100%" backgroundColor="#EFEFEF">
      <MjmlColumn paddingLeft="0px" paddingRight="0px" width="35%">
        <MjmlText paddingBottom="0px">Abuja</MjmlText>
        <MjmlText paddingBottom="0px">
          Nnamdi Azikiwe International Airport
        </MjmlText>
        <MjmlText paddingBottom="0px">Wed, 21 Sep 2022, 23:55</MjmlText>
      </MjmlColumn>
      <MjmlColumn paddingLeft="0px" paddingRight="0px" width="25%">
        <MjmlText paddingBottom="0px" align="center">
          Turkish Airlines TK624
        </MjmlText>
        <MjmlDivider borderWidth="1px" padding="10px 0px 0px 0px" />
        <MjmlText paddingBottom="0px" align="center">
          Economy
        </MjmlText>
      </MjmlColumn>
      <MjmlColumn paddingLeft="0px" paddingRight="0px" width="35%">
        <MjmlText paddingBottom="0px">Abuja</MjmlText>
        <MjmlText paddingBottom="0px">
          Nnamdi Azikiwe International Airport
        </MjmlText>
        <MjmlText paddingBottom="0px">Wed, 21 Sep 2022, 23:55</MjmlText>
      </MjmlColumn>
    </MjmlGroup>
  );
}
