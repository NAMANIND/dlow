import React from "react";
import FormThingTrade from "../FormThing/FormThingTrade";

function TradeTable({ userData, admin }) {
  return (
    <div>
      <FormThingTrade userData={userData} admin={admin} />
    </div>
  );
}

export default TradeTable;
