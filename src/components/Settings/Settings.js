"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firbase/clientApp"; // Import Firestore instance
import { useState, useEffect } from "react";
export default function Settings(userData) {
  const user = userData.userData;
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // check if the page url is admin
    if (typeof window !== "undefined") {
      if (window.location.pathname.includes("/admin")) {
        setIsAdmin(true);
      }
    }
  }, []);

  const handleDeleteUser = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, "users", user.id)); // Adjust the collection name if different
      alert("User deleted successfully.");

      // Reload the page after deletion (client-side only)
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
      alert("Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="bg-background rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-100/40 dark:bg-gray-800/40 p-6 flex items-center md:flex-row flex-col gap-4">
        <Avatar className="h-24 w-24 ">
          <AvatarImage className="object-cover" src={user.profilePictureUrl} />
          <AvatarFallback>
            {user.firstName.charAt(0) + user.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="text-xl font-bold md:text-left text-center text-secondary-foreground">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm md:text-left text-center  text-secondary-foreground">
            {user.username}
          </p>
        </div>
        {/* Delete User Button */}
        {isAdmin && (
          <button
            onClick={handleDeleteUser}
            className={`md:ml-auto ml-0 bg-red-500 text-white px-4 py-2 rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete User"}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">ID</p>
          <p className="text-base text-foreground">{user.id}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Date of Birth
          </p>
          <p className="text-base text-foreground">{user.dob}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p className="text-base text-foreground">{user.email}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Gender</p>
          <p className="text-base text-foreground">{user.gender}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Phone</p>
          <p className="text-base text-foreground">{user.phone}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">UPI ID</p>
          <p className="text-base text-foreground">{user.upiId}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Account No.
          </p>
          <p className="text-base text-foreground">{user.accountNumber}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">IFSC Code</p>
          <p className="text-base text-foreground">{user.ifscCode}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Address</p>
          <p className="text-base text-foreground">{user.address}</p>
        </div>
        <div className="space-y-1 md:block hidden  pointer-events-none opacity-0 ">
          <p className="text-sm font-medium text-muted-foreground">Address</p>
          <p className="text-base text-foreground">{user.address}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Aadhaar Card
          </p>
          <div className="flex gap-4">
            <a
              href={user.aadhaarFrontUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-foreground bg-primary-foreground rounded-lg px-4 py-2"
            >
              Aadhaar Front
            </a>
            <a
              href={user.aadhaarBackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-foreground bg-primary-foreground rounded-lg px-4 py-2"
            >
              Aadhaar Back
            </a>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">PAN Card</p>
          <div className="flex gap-4">
            <a
              href={user.panFrontUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-foreground bg-primary-foreground rounded-lg px-4 py-2"
            >
              PAN Front
            </a>
            <a
              href={user.panBackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-foreground bg-primary-foreground rounded-lg px-4 py-2"
            >
              PAN Back
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
