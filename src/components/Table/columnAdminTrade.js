"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { db } from "../../../firbase/clientApp";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { Pencil1Icon, UpdateIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../ui/input";

async function handleUpdateStatus(transactionId, newStatus) {
  if (!newStatus) return;

  try {
    const transactionRef = doc(db, "transactions", transactionId);
    await updateDoc(transactionRef, {
      status: newStatus, // Update to the selected status
    });
    console.log("Transaction status successfully updated to", newStatus);
  } catch (error) {
    console.error("Error updating transaction status: ", error);
  }
}

// async function handleUpdateStatus(transactionId, newStatus) {
//   if (!newStatus) return;

//   try {
//     const transactionRef = doc(db, "trades", transactionId);
//     await updateDoc(transactionRef, {
//       status: newStatus, // Update to the selected status
//     });
//     console.log("Transaction status successfully updated to", newStatus);
//   } catch (error) {
//     console.error("Error updating transaction status: ", error);
//   }
// }

async function updatePnl(transactionId, newPnl) {
  try {
    const transactionRef = doc(db, "trades", transactionId);
    await updateDoc(transactionRef, {
      pnl: Number(newPnl), // Update the pnl field with the new value
      updatedtimestamp: new Date().toISOString(),
    });
    alert("Pnl successfully updated to " + newPnl);
    // close the dialog
  } catch (error) {
    console.error("Error updating pnl: ", error);
  }
}

function getPnl(pnl) {
  if (!pnl) {
    return 0;
  }
  return Number(pnl) >= 0 ? "+" + Number(pnl) : Number(pnl);
}

function getCurrentValue(price, pnl) {
  var pnlValue = 0;
  if (pnl) {
    pnlValue = Number(pnl);
  }
  return price + pnlValue;
}

export const columnsAdmin = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "symbol",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Symbol" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("symbol")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[80px] items-center">
        <Badge variant="outline" className="uppercase">
          {row.getValue("type")}
        </Badge>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <span>{row.getValue("quantity")}</span>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <span>₹ {row.getValue("price")}</span>
      </div>
    ),
  },

  {
    accessorKey: "currentValue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Current Value" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <span>
          {getCurrentValue(row.getValue("price"), row.getValue("pnl"))}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "pnl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="P/L" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[100px] max-w-[200px] items-center">
        <Badge variant="outline" className="uppercase">
          {getPnl(row.getValue("pnl"))}
        </Badge>
      </div>
    ),
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const [isOpen, setIsOpen] = useState(false);

      const closeDialog = () => {
        setIsOpen(false);
      };

      const handleUpdate = () => {
        const newPnl = document.getElementById("newPnl").value;
        updatePnl(row.getValue("tradeId"), newPnl);
        closeDialog();
      };

      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
              <UpdateIcon className="w-4 h-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Current P/L : {getPnl(row.getValue("pnl"))}
            </span>

            <Input
              id="newPnl"
              type="number"
              label="New P/L"
              placeholder="Enter new P/L"
            />
            <Button variant="default" onClick={handleUpdate}>
              Update
            </Button>
          </DialogContent>
        </Dialog>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "updatedtimestamp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="P/L Update Date" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <span>
          {row.getValue("updatedtimestamp")
            ? new Date(row.getValue("updatedtimestamp")).toLocaleDateString()
            : "Not Updated"}
        </span>
      </div>
    ),
  },

  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <span>{new Date(row.getValue("timestamp")).toLocaleDateString()}</span>
      </div>
    ),
  },
  {
    accessorKey: "tradeId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trade ID" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px]">{row.getValue("tradeId")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
