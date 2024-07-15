import React from "react";
import FormThing from "../FormThing/FormThing";

function AllTransactions({ userData }) {
  return (
    <div>
      <FormThing userData={userData} admin={false} />
    </div>
  );
}

export default AllTransactions;
