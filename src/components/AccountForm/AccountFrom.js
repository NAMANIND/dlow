// AccountForm.js
"use client";
import React from "react";
import { useState } from "react";
import { db, storage } from "../../../firbase/clientApp";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AccountForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    profilePicture: null,
    aadhaarFront: null,
    aadhaarBack: null,
    panFront: null,
    panBack: null,
    address: "",
  });

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = `DLOW${formData.phone.slice(-4)}`;
    const password = generatePassword(); // You can implement generatePassword() function
    const userRef = db.collection("users").doc();
    const userId = userRef.id;

    try {
      console.log(formData);
      console.log(userId);

      // Save user data
      await userRef.set({
        id: userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        dob: formData.dob,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        username: username,
        password: password,
        role: "client",
        createdAt: new Date(),
      });
      console.log("User data saved.");

      // Upload files and get URLs
      const profilePictureUrl = await uploadFile(
        "profilePictures",
        formData.profilePicture,
        `${formData.firstName}-profile`
      );
      const aadhaarFrontUrl = await uploadFile(
        "aadhaar",
        formData.aadhaarFront,
        `${formData.firstName}-aadhaar-front`
      );
      const aadhaarBackUrl = await uploadFile(
        "aadhaar",
        formData.aadhaarBack,
        `${formData.firstName}-aadhaar-back`
      );
      const panFrontUrl = await uploadFile(
        "pan",
        formData.panFront,
        `${formData.firstName}-pan-front`
      );
      const panBackUrl = await uploadFile(
        "pan",
        formData.panBack,
        `${formData.firstName}-pan-back`
      );

      console.log("Files uploaded. Updating Firestore document...");
      // Update user document with file URLs
      await userRef.update({
        profilePictureUrl,
        aadhaarFrontUrl,
        aadhaarBackUrl,
        panFrontUrl,
        panBackUrl,
      });
      console.log("Firestore document updated.");

      alert("Account created successfully!");
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Error creating account. Please try again.");
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

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8); // Simple password generation example
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Create an Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sign up for your Capital One Broking account.
        </p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              className="text-gray-700 dark:text-gray-300"
              htmlFor="firstName"
            >
              First Name
            </Label>
            <Input
              className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              id="firstName"
              placeholder="John"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label
              className="text-gray-700 dark:text-gray-300"
              htmlFor="lastName"
            >
              Last Name
            </Label>
            <Input
              className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              id="lastName"
              placeholder="Doe"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              className="text-gray-700 dark:text-gray-300"
              htmlFor="gender"
            >
              Gender
            </Label>
            <Select
              className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              id="gender"
              required
              value={formData.gender}
              onValueChange={(value) =>
                handleChange({ target: { id: "gender", value } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300" htmlFor="dob">
              Date of Birth
            </Label>
            <Input
              className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              id="dob"
              required
              type="date"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300" htmlFor="email">
            Email Address
          </Label>
          <Input
            className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            id="email"
            placeholder="m@example.com"
            required
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300" htmlFor="phone">
            Phone Number
          </Label>
          <Input
            className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            id="phone"
            placeholder="+1 (123) 456-7890"
            required
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label
            className="text-gray-700 dark:text-gray-300"
            htmlFor="profilePicture"
          >
            Profile Picture
          </Label>
          <Input
            accept="image/*"
            className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            id="profilePicture"
            type="file"
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              className="text-gray-700 dark:text-gray-300"
              htmlFor="aadhaarFront"
            >
              Aadhaar (Front)
            </Label>
            <Input
              accept="image/*"
              className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              id="aadhaarFront"
              required
              type="file"
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label
              className="text-gray-700 dark:text-gray-300"
              htmlFor="aadhaarBack"
            >
              Aadhaar (Back)
            </Label>
            <Input
              accept="image/*"
              className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              id="aadhaarBack"
              required
              type="file"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              className="text-gray-700 dark:text-gray-300"
              htmlFor="panFront"
            >
              PAN (Front)
            </Label>
            <Input
              accept="image/*"
              className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              id="panFront"
              required
              type="file"
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label
              className="text-gray-700 dark:text-gray-300"
              htmlFor="panBack"
            >
              PAN (Back)
            </Label>
            <Input
              accept="image/*"
              className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              id="panBack"
              required
              type="file"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300" htmlFor="address">
            Address
          </Label>
          <Textarea
            className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            id="address"
            placeholder="Enter your address"
            required
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-start gap-2">
          <Checkbox id="agree" required />
          <Label
            className="text-sm text-gray-700 dark:text-gray-300"
            htmlFor="agree"
          >
            I agree to the
            <Link
              className="text-blue-600 underline dark:text-blue-400"
              href="#"
            >
              Privacy Policy
            </Link>
            {" \n                  "}and
            <Link
              className="text-blue-600 underline dark:text-blue-400"
              href="#"
            >
              Terms of Service
            </Link>
          </Label>
        </div>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          type="submit"
        >
          Create Account
        </Button>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your login ID will be sent to the registered email after registration.
        </p>
      </div>
    </form>
  );
}
