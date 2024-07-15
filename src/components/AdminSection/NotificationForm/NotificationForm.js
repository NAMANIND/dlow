import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Import the initialized Firebase instance
import { db } from "../../../../firbase/clientApp"; // Adjust the path to your Firebase configuration
import Notification from "@/components/Notification/Notification";

export default function NotificationForm({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState({
    userId: "",
    type: "",
    message: "",
    timestamp: "",
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;

      try {
        const notificationsRef = db
          .collection("notifications")
          .where("userId", "==", userId)
          .orderBy("timestamp", "desc");

        const querySnapshot = await notificationsRef.get();
        const notificationsData = querySnapshot.docs.map((doc) => doc.data());
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [notifications, userId]);

  const handleSendNotification = async (e) => {
    e.preventDefault();

    alert(userId);

    if (!userId) return;

    try {
      const Notification = {
        userId: userId,
        type: newNotification.type,
        message: newNotification.message,
        timestamp: new Date(),
      };
      await db.collection("notifications").add(Notification);
      setNewNotification({
        userId: "",
        type: "",
        message: "",
        timestamp: "",
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-full mx-auto px-4 py-8">
      <div className="col-span-1 md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Send Notification</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSendNotification}>
              {/* <div className="grid gap-2">
              <Label htmlFor="user">User</Label>
              <Input id="user" value={userOp.username} readOnly />
            </div> */}

              <div className="grid gap-2">
                <Label htmlFor="type">Notification Type</Label>
                <Select
                  id="type"
                  value={newNotification.type}
                  onValueChange={(value) =>
                    setNewNotification({ ...newNotification, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="party">Party</SelectItem>
                    <SelectItem value="addmoney">Add Money</SelectItem>
                    <SelectItem value="withdraw">Withdraw</SelectItem>
                    <SelectItem value="trade">Trade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Input
                  id="message"
                  type="text"
                  value={newNotification.message}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      message: e.target.value,
                    })
                  }
                />
              </div>
              <Button type="submit">Send Notification</Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-2 md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 && <div>No notifications found.</div>}
            {notifications.map((notification, index) => (
              <NotificationItem
                key={index}
                type={notification.type}
                message={notification.message}
                timestamp={notification.timestamp}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NotificationItem({ type, message, timestamp }) {
  // Calculate time difference
  const notificationTime = new Date(timestamp.seconds * 1000);
  const currentTime = new Date();
  const timeDifference = currentTime - notificationTime;
  const isUnread = timeDifference < 6 * 60 * 60 * 1000; // Less than 6 hours

  // Define the emoji based on emoji text
  var color = "";
  var finalemoji = "";
  switch (type) {
    case "admin":
      finalemoji = "📢";
      color = "blue";
      break;

    case "party":
      finalemoji = "🎉";
      color = "green";
      break;

    case "addmoney":
      finalemoji = "💰";
      color = "yellow";
      break;

    case "withdraw":
      finalemoji = "💸";
      color = "red";
      break;

    case "trade":
      finalemoji = "📈";
      color = "purple";
      break;

    default:
      finalemoji = "📢";
      color = "blue";
  }

  return (
    <div className={`mb-4 flex items-start ${isUnread ? "relative" : ""}`}>
      <div
        className={`flex-shrink-0 relative h-8 w-8 mr-4 rounded-full ${color}`}
      >
        <span className="flex items-center justify-center h-full">
          {finalemoji}
        </span>
        {isUnread && (
          <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-500 border-white border-2 rounded-full"></span>
        )}
      </div>
      <div className="grid gap-1">
        <p className="text-sm font-medium">{message}</p>
        <p className="text-sm text-muted-foreground">
          {notificationTime.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

function BellIcon(props) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
