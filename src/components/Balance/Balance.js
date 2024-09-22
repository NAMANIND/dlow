"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firbase/clientApp";

export default function BalanceAdjustment({ userData }) {
  const [totalBalance, setTotalBalance] = useState(0);
  const [previousAdjustment, setPreviousAdjustment] = useState(0);
  const [newAdjustment, setNewAdjustment] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [adjustmentType, setAdjustmentType] = useState(null);

  useEffect(() => {
    fetchBalanceData();
  }, []);

  async function fetchBalanceData() {
    const transactions = await fetchCollectionData("transactions");
    const balance = calculateTotalBalance(transactions);
    const prevAdjustment = userData?.adjustment || 0;
    setPreviousAdjustment(prevAdjustment);
    setTotalBalance(balance + prevAdjustment);
    setCurrentBalance(balance + prevAdjustment);
  }

  function calculateTotalBalance(transactions) {
    return transactions.reduce((acc, transaction) => {
      if (transaction.status === "approved") {
        return transaction.type === "Add Money"
          ? acc + transaction.amount
          : acc - transaction.amount;
      }
      return acc;
    }, 0);
  }

  async function fetchCollectionData(collectionName) {
    const q = query(
      collection(db, collectionName),
      where("userId", "==", userData.id),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  const handleAdjustment = (type) => {
    setAdjustmentType(type);
    const adjustment = parseFloat(newAdjustment) || 0;
    const newValue =
      type === "add"
        ? previousAdjustment + adjustment
        : previousAdjustment - adjustment;
    setCurrentBalance(totalBalance - previousAdjustment + newValue);
  };

  const handleUpdate = async () => {
    if (!adjustmentType) return;

    const adjustment = parseFloat(newAdjustment) || 0;
    const newAdjustmentValue =
      adjustmentType === "add"
        ? previousAdjustment + adjustment
        : previousAdjustment - adjustment;

    try {
      await updateDoc(doc(db, "users", userData.id), {
        adjustment: newAdjustmentValue,
      });
      setTotalBalance(currentBalance);
      setPreviousAdjustment(newAdjustmentValue);
      setNewAdjustment(0);
      setAdjustmentType(null);
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-full mx-auto px-4 py-8">
      <Card className="w-full max-w-md col-span-1 md:col-span-3">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Balance Adjustment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="totalBalance" className="text-lg font-medium">
              Current Balance:
            </Label>
            <span className="text-xl font-bold">
              ₹{totalBalance.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <Label htmlFor="previousAdjustment" className="text-lg font-medium">
              Previous Adjustment:
            </Label>
            <span className="text-xl font-bold">
              ₹{previousAdjustment.toFixed(2)}
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newAdjustment" className="text-lg font-medium">
              Add or Subtract Amount:
            </Label>
            <Input
              id="newAdjustment"
              type="number"
              value={newAdjustment}
              onChange={(e) => setNewAdjustment(e.target.value)}
              placeholder="Enter amount to adjust"
              className="text-right"
            />
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => handleAdjustment("add")}
              className="w-1/2"
              variant={adjustmentType === "add" ? "default" : "outline"}
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add
            </Button>
            <Button
              onClick={() => handleAdjustment("subtract")}
              className="w-1/2"
              variant={adjustmentType === "subtract" ? "default" : "outline"}
            >
              <MinusIcon className="mr-2 h-4 w-4" /> Subtract
            </Button>
          </div>
          <div className="flex justify-between items-center pt-4 border-t">
            <Label htmlFor="currentBalance" className="text-lg font-medium">
              New Balance:
            </Label>
            <span className="text-xl font-bold">
              ₹{currentBalance.toFixed(2)}
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleUpdate}
            className="w-full"
            variant="outline"
            disabled={!adjustmentType}
          >
            Update Balance
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
