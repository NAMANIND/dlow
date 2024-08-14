"use client";

import { useState, useEffect } from "react";
import { db } from "../../../../firbase/clientApp"; // Adjust the path to your firebase.js file
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { updateDoc, doc } from "firebase/firestore";
import { user } from "@nextui-org/react";
import TradeTable from "@/components/TradeTable/TradeTable";

// Add these helper methods to interact with Firestore
const collection = (db, name) => db.collection(name);
const query = (collectionRef, ...constraints) => {
  let q = collectionRef;
  constraints.forEach((constraint) => {
    q = q.where(...constraint);
  });
  return q;
};
const getDocs = async (query) => await query.get();
const addDoc = async (collectionRef, data) => await collectionRef.add(data);

export default function Trade({ userData }) {
  const userId = userData.id;

  const [trades, setTrades] = useState([]);
  const [newTrade, setNewTrade] = useState({
    user: "",
    symbol: "",
    type: "",
    quantity: 0,
    price: 0,
  });
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showTradeDetails, setShowTradeDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleAddTrade = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    if (!userId) {
      console.error("userId is undefined");
      return;
    }

    const newTradeData = {
      ...newTrade,
      userId,
      user: userData.username,
      timestamp: new Date().toISOString(),
    };

    try {
      // Add trade data to Firestore
      const docRef = await addDoc(collection(db, "trades"), newTradeData);
      console.log("Trade successfully added!");

      // Update the trade with its Firestore-generated ID
      const tradeId = docRef.id;
      await updateDoc(doc(db, "trades", tradeId), {
        tradeId: tradeId,
      });

      console.log("Trade ID successfully added!");

      // Update local state with the new trade including the Firestore ID
      const tradeWithId = {
        id: tradeId,
        ...newTradeData,
        date: new Date().toISOString().slice(0, 10), // Placeholder date formatting
      };
      setTrades([...trades, tradeWithId]);

      // Reset form fields
      setNewTrade({
        symbol: "",
        type: "",
        quantity: 0,
        price: 0,
      });
    } catch (error) {
      console.error("Error adding trade: ", error);
    }
  };

  const handleViewTradeDetails = (trade) => {
    setSelectedTrade(trade);
    setShowTradeDetails(true);
  };

  const handleCloseTradeDetails = () => {
    setSelectedTrade(null);
    setShowTradeDetails(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-full mx-auto md:px-4 px-0 py-8">
      <div className="col-span-1 md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Add Trade</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleAddTrade}>
              <div className="grid gap-2">
                <Label htmlFor="user">User</Label>
                <Input id="user" value={userData.username} readOnly />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  value={newTrade.symbol}
                  onChange={(e) =>
                    setNewTrade({ ...newTrade, symbol: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  id="type"
                  value={newTrade.type}
                  onValueChange={(value) =>
                    setNewTrade({ ...newTrade, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trade type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Buy">Buy</SelectItem>
                    <SelectItem value="Sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newTrade.quantity}
                  onChange={(e) =>
                    setNewTrade({
                      ...newTrade,
                      quantity: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newTrade.price}
                  onChange={(e) =>
                    setNewTrade({ ...newTrade, price: Number(e.target.value) })
                  }
                />
              </div>
              <Button type="submit">Add Trade</Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-2 md:col-span-2">
        <TradeTable userData={userData} />
      </div>
    </div>
  );
}

function EyeIcon(props) {
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
