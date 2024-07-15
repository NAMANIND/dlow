import React from "react";
import { NextUIProvider } from "@nextui-org/react";

import Log from "@/components/Log/Log";

function page() {
  return (
    <NextUIProvider>
      <div className=" min-w-screen min-h-screen flex justify-center items-center mx-auto p-4">
        <Log />
      </div>
    </NextUIProvider>
  );
}

export default page;
