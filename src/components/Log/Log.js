"use client";
import React, { useState } from "react";
import AccountFrom from "@/components/AccountForm/AccountFrom.js";
import AccountLogin from "@/components/AccountLogin/AccountLogin";

function Log() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="w-full h-full flex justify-center items-center">
      {isLogin ? (
        <AccountLogin setIsLogin={setIsLogin} />
      ) : (
        <AccountFrom setIsLogin={setIsLogin} />
      )}
    </div>
  );
}

export default Log;
