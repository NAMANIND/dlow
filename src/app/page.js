"use client";
import React from "react";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
function page() {
  redirect("/dashboard");
  return <div></div>;
}

export default page;
