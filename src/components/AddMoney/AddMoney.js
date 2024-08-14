"use client";
import React, { useState } from "react";
import { db, storage } from "../../../firbase/clientApp"; // Import Firestore instance
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { EnterFullScreenIcon } from "@radix-ui/react-icons";

function AddMoney({ userData }) {
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const handleSendMoney = async () => {
    if (!transactionId || !screenshot) {
      alert("Please enter a transaction ID and upload a screenshot.");
      return;
    }

    const isconfirm = confirm(
      "Please confirm your transaction ID and screenshot before submitting."
    );

    if (!isconfirm) return;

    setLoading(true);

    const transactionData = {
      recipient: userData.username,
      amount,
      note,
      paymentMethod: "UPI", // Since payment method is QR
      transactionId,
      screenshotUrl: null, // Placeholder for screenshot URL
      userId: userData.id, // Adding user ID from userData
      timestamp: new Date().toISOString(),
      status: "pending",
      type: "Add Money",
    };

    try {
      const docRef = await addDoc(
        collection(db, "transactions"),
        transactionData
      );
      console.log("Transaction successfully added!");

      // Add the transaction ID to the document
      const transactionIdl = docRef.id;
      await updateDoc(doc(db, "transactions", transactionIdl), {
        transactionId,
        screenshotUrl: await uploadScreenshot(screenshot, transactionId),
      });

      console.log("Transaction ID and screenshot successfully added!");
      alert("Transaction successfully added!");
      // Reset form fields
      setAmount(0);
      setNote("");
      setTransactionId("");
      setScreenshot(null);
      setScreenshotPreview(null);
      setLoading(false);
    } catch (e) {
      console.error("Error adding transaction: ", e);
    }
  };

  const uploadFile = async (folder, file, fileName) => {
    if (!file) return null;
    const storageRef = storage.ref();
    const fileRef = storageRef.child(`${folder}/${fileName}`);

    try {
      console.log(`Uploading ${fileName} to ${folder}...`);
      await fileRef.put(file);
      const downloadURL = await fileRef.getDownloadURL();
      console.log(`Uploaded ${fileName} to ${folder}. URL: ${downloadURL}`);
      return downloadURL;
    } catch (error) {
      console.error(`Error uploading ${fileName}:`, error);
      throw error;
    }
  };

  const uploadScreenshot = async (file, transactionId) => {
    const fileName = `${transactionId}-screenshot.jpg`;
    return uploadFile("screenshots", file, fileName);
  };

  return (
    <div className="flex-1 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Money</CardTitle>
          <CardDescription>
            Make a payment using a QR code. Enter the details to add money to a
            wallet.
          </CardDescription>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                Show QR Code &nbsp;
                <EnterFullScreenIcon width={20} height={20} />
              </Button>
            </DialogTrigger>
            <DialogContent className="p-8">
              {/* Your QR code image or component goes here */}
              <img src="/qr/qr.jpg" alt="QR Code" />
              <p className="mt-4 text-center">
                Scan this QR code to complete your payment.
              </p>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="Enter recipient's wallet address"
              value={userData.username} // Set the recipient to the user's username
              readOnly
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount to send"
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
          <div className="grid gap-2">
            <Label htmlFor="transaction-id">Transaction ID</Label>
            <Input
              id="transaction-id"
              placeholder="Enter the transaction ID from the payment"
              value={transactionId}
              onChange={(e) => {
                const transactionId = e.target.value.toUpperCase();
                setTransactionId(transactionId);
              }}
            />
          </div>
          <div className="grid gap-2 ">
            <Label htmlFor="screenshot">Upload Payment Screenshot</Label>
            <Input
              id="screenshot"
              type="file"
              accept="image/*"
              onChange={handleScreenshotChange}
            />
            {screenshotPreview && (
              <img
                src={screenshotPreview}
                alt="Screenshot Preview"
                className="mt-2 h-40 w-auto object-cover"
              />
            )}
          </div>
        </CardContent>
        <CardFooter className="space-x-2">
          <Button onClick={handleSendMoney}>
            {loading ? "Sending..." : "Send Money"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AddMoney;
