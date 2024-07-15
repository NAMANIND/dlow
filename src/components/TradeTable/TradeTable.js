import React from "react";
import FormThingTrade from "../FormThing/FormThingTrade";

function TradeTable({ userData }) {
  return (
    <div>
      <FormThingTrade userData={userData} />
    </div>
  );
}

export default TradeTable;
