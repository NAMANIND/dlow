"use client";

import React, { useEffect, useState } from "react";

import ClientDashboard from "../ClientDashboard/ClientDashboard";
import Cookies from "js-cookie";
import { db } from "../../../firbase/clientApp";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const userID = Cookies.get("userId");
  const [content, setContent] = useState("dashboard");
  const isSelected =
    "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50";

  const isNotSelected =
    "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 transition-all";

  const getUser = async () => {
    const userDatay = await db
      .collection("users")
      .doc(user)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
    setUserData(userDatay);
    console.log(userDatay);
  };
  function getPageContent() {
    return <ClientDashboard userData={userData} contentD={content} />;
  }
  useEffect(() => {
    getPageContent();
  }, [userData, content]);

  useEffect(() => {
    console.log(userID);
    setUser(userID);
    if (user) {
      getUser();
    }
  }, [userID, user]);

  return (
    <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex flex-col gap-2">
          <div className="flex h-[60px] items-center px-6">
            <div className="flex items-center gap-2 font-semibold" href="#">
              <Package2Icon className="h-6 w-6" />
              <span className="">Capital One Broking</span>
            </div>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-4 text-sm font-medium">
              <div
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  content === "dashboard" ? isSelected : isNotSelected
                }`}
                onClick={() => setContent("dashboard")}
              >
                <Grid3x3Icon className="h-4 w-4" />
                Dashboard
              </div>

              <div
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  content === "trade_reports" ? isSelected : isNotSelected
                }`}
                onClick={() => setContent("trade_reports")}
              >
                <ActivityIcon className="h-4 w-4" />
                Trade Reports
              </div>

              <div
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  content === "all_transactions" ? isSelected : isNotSelected
                }`}
                onClick={() => setContent("all_transactions")}
              >
                <ListIcon className="h-4 w-4" />
                All Transactions
              </div>
              <div
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  content === "add_money" ? isSelected : isNotSelected
                }`}
                onClick={() => setContent("add_money")}
              >
                <CirclePlusIcon className="h-4 w-4" />
                Add Money
              </div>

              <div
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  content === "withdraw" ? isSelected : isNotSelected
                }`}
                onClick={() => setContent("withdraw")}
              >
                <CircleMinusIcon className="h-4 w-4" />
                Withdraw
              </div>

              <div
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  content === "settings" ? isSelected : isNotSelected
                }`}
                onClick={() => setContent("settings")}
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </div>
            </nav>
          </div>
        </div>
      </div>
      {userData && content && getPageContent()}
    </div>
  );
}

function ActivityIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  );
}

function BellIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function CircleMinusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
    </svg>
  );
}

function CirclePlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}

function Grid3x3Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  );
}

function ListIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}

function Package2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}

function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
