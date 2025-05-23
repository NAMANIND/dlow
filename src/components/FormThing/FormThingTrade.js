"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../../firbase/clientApp";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

import { DataTable } from "@/components/Table/data-table-trade";
import { UserNav } from "@/components/Table/user-nav";

import Image from "next/image";

import { columns } from "@/components/Table/columnsTrade";
import { columnsAdmin } from "@/components/Table/columnAdminTrade";

function FormThingTrade({ userData, admin }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const q = query(
        collection(db, "trades"),
        where("userId", "==", userData.id),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);

      const tasksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    };

    fetchTasks();
  }, [userData.id]);

  return (
    <>
      {/* <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div> */}
      <div className=" h-full flex-1 flex-col space-y-8 md:p-8 p-0 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">All Trades</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your trades
            </p>
          </div>
          {/* <div className="flex items-center space-x-2">
            <UserNav />
          </div> */}
        </div>
        <div className="md:hidden flex overflow-hidden w-full max-w-[85vw] h-full ">
          {admin ? (
            <div className="w-full">
              <DataTable data={tasks} columns={columnsAdmin} />
            </div>
          ) : (
            <div className="w-full">
              <DataTable data={tasks} columns={columns} />
            </div>
          )}
        </div>
        <div className="md:block hidden">
          {admin ? (
            <DataTable data={tasks} columns={columnsAdmin} />
          ) : (
            <DataTable data={tasks} columns={columns} />
          )}
        </div>
      </div>
    </>
  );
}

export default FormThingTrade;
