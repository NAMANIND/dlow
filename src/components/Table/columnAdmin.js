"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

import { db } from "../../../firbase/clientApp";
import { doc, updateDoc } from "firebase/firestore";

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
import { GearIcon, ImageIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";

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

export const columnsAdmin = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "transactionId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("transactionId")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("type")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <span>₹ {row.getValue("amount")}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[100px] items-center">
        {
          <Badge variant="outline" className="uppercase">
            {row.getValue("status")}
          </Badge>
        }{" "}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
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
    accessorKey: "screenshotUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Screenshot" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        {row.getValue("screenshotUrl") ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <ImageIcon className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <img
                src={row.getValue("screenshotUrl")}
                alt="Payment Screenshot"
                className="object-contain w-full h-full max-h-[80vh]"
              />
            </DialogContent>
          </Dialog>
        ) : (
          <span>No Screenshot</span>
        )}
      </div>
    ),
  },

  {
    accessorKey: "note",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <span>{row.getValue("note")}</span>
      </div>
    ),
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <GearIcon className="w-4 h-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {row.getValue("status") === "pending" && (
            <>
              <DropdownMenuItem
                onClick={() =>
                  handleUpdateStatus(row.getValue("docId"), "approved")
                }
              >
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleUpdateStatus(row.getValue("docId"), "rejected")
                }
              >
                Reject
              </DropdownMenuItem>
            </>
          )}
          {row.getValue("status") === "approved" && (
            <DropdownMenuItem
              onClick={() =>
                handleUpdateStatus(row.getValue("docId"), "pending")
              }
            >
              Set to Pending
            </DropdownMenuItem>
          )}
          {row.getValue("status") === "rejected" && (
            <DropdownMenuItem
              onClick={() =>
                handleUpdateStatus(row.getValue("transactionId"), "pending")
              }
            >
              Set to Pending
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
