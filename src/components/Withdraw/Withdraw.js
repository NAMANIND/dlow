"use client";
import React, { useState } from "react";
import { db } from "../../../firbase/clientApp"; // Import Firestore instance
import { collection, addDoc, updateDoc, doc } from "firebase/firestore"; // Import Firestore functions
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function Withdraw({ userData }) {
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const handleWithdrawMoney = async () => {
    const transactionData = {
      recipient: userData.username,
      amount,
      note,
      paymentMethod,
      userId: userData.id, // Adding user ID from userData
      timestamp: new Date().toISOString(),
      status: "pending",
      type: "Withdraw Money",
    };

    try {
      const docRef = await addDoc(
        collection(db, "transactions"),
        transactionData
      );
      console.log("Transaction successfully added!");

      // Add the transaction ID to the document
      const transactionId = docRef.id;
      const paymentId = docRef.id;
      await updateDoc(doc(db, "transactions", transactionId), {
        transactionId,
        paymentId,
      });

      console.log("Transaction ID successfully added!");

      // Reset form fields

      setAmount(0);
      setNote("");
      setPaymentMethod("UPI");
    } catch (e) {
      console.error("Error adding transaction: ", e);
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Withdraw Money</CardTitle>
          <CardDescription>
            Enter the details to withdraw money from your wallet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="Enter recipient's wallet address"
              value={userData.username}
              readOnly
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount to withdraw"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              placeholder="Add a note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          {/* <div className="grid gap-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <RadioGroup
              id="payment-method"
              value={paymentMethod}
              onValueChange={setPaymentMethod}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="bank_transfer" id="bank-transfer" />
                <Label htmlFor="bank-transfer">Bank Transfer</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="crypto" id="crypto" />
                <Label htmlFor="crypto">Cryptocurrency</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="mobile_money" id="mobile-money" />
                <Label htmlFor="mobile-money">Mobile Money</Label>
              </div>
            </RadioGroup>
          </div> */}
        </CardContent>
        <CardFooter>
          <Button onClick={handleWithdrawMoney}>Withdraw Money</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Withdraw;
