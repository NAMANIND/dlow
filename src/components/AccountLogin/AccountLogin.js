// pages/account/login.js

"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "../../../firbase/clientApp";
import { SignJWT } from "jose";
import Cookies from "js-cookie";

export default function AccountLogin({ setIsLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { id, value, checked } = e.target;
    setFormData({ ...formData, [id]: id === "rememberMe" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;
    try {
      const userData = await db
        .collection("users")
        .where("username", "==", username)
        .get()
        .then((querySnapshot) => {
          let data = {};
          querySnapshot.forEach((doc) => {
            data = doc.data();
            data.id = doc.id; // Store user ID
          });
          return data;
        });

      if (userData && userData.password === password) {
        // Example secret key (replace with your generated key)
        const secretKey = "GENERATED_SECRET_KEY_HERE";

        // Encoding the secret key using TextEncoder
        const secret = new TextEncoder().encode(secretKey);
        const token = await new SignJWT({ userId: userData.id })
          .setProtectedHeader({ alg: "HS256" })
          // .setExpirationTime("1h")
          .sign(secret);

        document.cookie = `authToken=${token}; path=/; max-age=${
          60 * 60 * 24 * 365 * 10
        }`; // 10 years
        document.cookie = `userId=${userData.id}; path=/; max-age=${
          60 * 60 * 24 * 365 * 10
        }`; // 10 years

        window.open("/dashboard", "_self");
      } else {
        throw new Error("Invalid username or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Invalid username or password. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome Back!</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sign in to continue with Capital One Broking User Panel
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Enter your password"
              required
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <Label className="text-sm" htmlFor="rememberMe">
                Remember me
              </Label>
            </div>
            <Link className="text-sm text-blue-600 underline" href="#">
              Forget Password
            </Link>
          </div>
          <Button className="w-full" type="submit">
            ACCOUNT LOGIN
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?
          </p>
          <div
            className="text-blue-600 underline cursor-pointer"
            onClick={() => setIsLogin(false)}
          >
            Signup for free
          </div>
        </div>
      </div>
    </form>
  );
}
