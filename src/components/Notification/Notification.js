import { useEffect, useState } from "react";
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

// Import the initialized Firebase instance
import { db } from "../../../firbase/clientApp"; // Adjust the path to your Firebase configuration

export default function Notification({ userId }) {
  const [notifications, setNotifications] = useState([]);
  // unique set of unread notifications
  const [newNotiLength, setNewNotiLength] = useState(new Set());

  const [onlyonce, setonlyonce] = useState(true);

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
  }, [userId, notifications]);

  useEffect(() => {
    if (onlyonce) {
      setonlyonce(false);
      // Update the unread notifications when the notifications change
      setNewNotiLength((prev) => {
        const newNotiLength = new Set();
        notifications.forEach((notification) => {
          const notificationTime = new Date(
            notification.timestamp.seconds * 1000
          );
          const currentTime = new Date();
          const timeDifference = currentTime - notificationTime;
          const isUnread = timeDifference < 6 * 60 * 60 * 1000; // Less than 6 hours

          if (isUnread) {
            newNotiLength.add(notification.timestamp.seconds);
          }
        });
        return newNotiLength;
      });
    }
  }, []);

  return (
    <div>
      <div className="md:hidden block">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full relative"
            >
              <BellIcon className="w-4 h-4" />
              {newNotiLength.size > 0 && (
                <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            side="bottom"
            align="start"
            className="w-80 mr-9 p-0 overflow-hidden rounded-md shadow-lg"
          >
            <Card className="shadow-none border-0">
              <CardHeader className="border-b">
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  You have {newNotiLength.size} unread messages.
                </CardDescription>
              </CardHeader>
              <CardContent
                className="max-h-[400px] overflow-auto p-6"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(209, 213, 219, 0.5)  transparent",
                }}
              >
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    type={notification.type}
                    message={notification.message}
                    timestamp={notification.timestamp}
                    setNewNotiLength={setNewNotiLength}
                  />
                ))}
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>
      <div className="md:block hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full relative"
            >
              <BellIcon className="w-4 h-4" />
              {newNotiLength.size > 0 && (
                <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            align="start"
            className="w-80 p-0 overflow-hidden rounded-md shadow-lg"
          >
            <Card className="shadow-none border-0">
              <CardHeader className="border-b">
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  You have {newNotiLength.size} unread messages.
                </CardDescription>
              </CardHeader>
              <CardContent
                className="max-h-[400px] overflow-auto p-6"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(209, 213, 219, 0.5)  transparent",
                }}
              >
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    type={notification.type}
                    message={notification.message}
                    timestamp={notification.timestamp}
                    setNewNotiLength={setNewNotiLength}
                  />
                ))}
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function NotificationItem({ type, message, timestamp, setNewNotiLength }) {
  // Calculate time difference
  const notificationTime = new Date(timestamp.seconds * 1000);
  const currentTime = new Date();
  const timeDifference = currentTime - notificationTime;
  const isUnread = timeDifference < 6 * 60 * 60 * 1000; // Less than 6 hours

  useEffect(() => {
    if (isUnread) {
      // Add the timestamp to the set of unread notifications
      setNewNotiLength((prev) => new Set([...prev, timestamp.seconds]));
    }
  }, [isUnread, setNewNotiLength, timestamp.seconds]);

  // Define the emoji based on emoji text
  let finalemoji = "";
  let color = "";
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
          {timestamp.toDate().toLocaleDateString()}
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
