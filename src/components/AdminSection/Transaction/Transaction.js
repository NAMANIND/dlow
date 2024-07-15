import React from "react";
import FormThing from "@/components/FormThing/FormThing";

function Transactions({ userData }) {
  return (
    <div>
      <FormThing userData={userData} admin={true} />
    </div>
  );
}

export default Transactions;
