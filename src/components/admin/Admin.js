"use client";
import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/admin/date-range-picker";
import { MainNav } from "@/components/admin/main-nav";
import { Overview } from "@/components/admin/overview";
import { RecentSales } from "@/components/admin/recent-sales";
import { Search } from "@/components/admin/search";
import TeamSwitcher from "@/components/admin/team-switcher";
import { UserNav } from "@/components/admin/user-nav";
import Transaction from "@/components/AdminSection/Transaction/Transaction";
import Trade from "@/components/AdminSection/TradeManagement/Trade";
import { db } from "../../../firbase/clientApp"; // Adjust the import path as needed
import { collection, getDocs } from "firebase/firestore";
import NotificationForm from "../AdminSection/NotificationForm/NotificationForm";
import Settings from "../Settings/Settings";
import Balance from "../Balance/Balance";
import Cookies from "js-cookie";

export default function Admin() {
  const [selectedTeam, setSelectedTeam] = React.useState(null);
  const userID = Cookies.get("userId");
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    const getUser = async () => {
      const userDatay = await db
        .collection("users")
        .doc(userID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            return doc.data();
          } else {
            console.log("No such document!");
            // head over to the login page
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
      setUserData(userDatay);
      console.log(userDatay);
    };
    getUser();
  }, [userID]);

  if (!userData) {
    return null;
  }

  if (userData.role !== "admin") {
    if (typeof window !== "undefined") {
      window.location.href = "/dashboard";
    }
    return null;
  }

  return (
    <>
      {/* <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div> */}
      <div className=" flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher onTeamSelect={setSelectedTeam} />
            {/* <MainNav className="mx-6" /> */}
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search /> */}
              {/* <UserNav /> */}
            </div>
          </div>
        </div>
        {selectedTeam && (
          <div className="flex-1 space-y-4 md:p-8 p-4 pt-6">
            {/* <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <div className="flex items-center space-x-2">
                <CalendarDateRangePicker />
                <Button>Download</Button>
              </div>
            </div> */}
            <Tabs defaultValue="overview" className="space-y-4 ">
              <TabsList className=" md:w-fit md:h-auto md:flex-row  w-full h-full flex flex-col ">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trade">Trades</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="balance">Balance</TabsTrigger>
                {/* <TabsTrigger value="settings">Settings</TabsTrigger> */}
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <Settings userData={selectedTeam} />
                {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Revenue
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$45,231.89</div>
                      <p className="text-xs text-muted-foreground">
                        +20.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Subscriptions
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+2350</div>
                      <p className="text-xs text-muted-foreground">
                        +180.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Sales
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+12,234</div>
                      <p className="text-xs text-muted-foreground">
                        +19% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Now
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+573</div>
                      <p className="text-xs text-muted-foreground">
                        +201 since last hour
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <Overview />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Recent Sales</CardTitle>
                      <CardDescription>
                        You made 265 sales this month.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentSales />
                    </CardContent>
                  </Card>
                </div> */}
              </TabsContent>
              <TabsContent value="trade">
                <Trade userData={selectedTeam} />
              </TabsContent>
              <TabsContent value="transactions">
                <Transaction userData={selectedTeam} />
              </TabsContent>
              <TabsContent value="notifications">
                <NotificationForm userId={selectedTeam.id} />
              </TabsContent>
              <TabsContent value="balance">
                <Balance userData={selectedTeam} />
              </TabsContent>

              {/* <TabsContent value="settings">
                <Settings userData={selectedTeam} />
              </TabsContent> */}
            </Tabs>
          </div>
        )}
      </div>
    </>
  );
}
