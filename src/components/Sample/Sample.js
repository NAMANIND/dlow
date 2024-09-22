import React from "react";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { db } from "../../../firbase/clientApp";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
function Sample({ userData }) {
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalPnl, setTotalPnl] = useState(0);
  const [tpnl, setTpnl] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [adjustment, setAdjustment] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      const q = query(
        collection(db, "trades"),
        where("userId", "==", userData.id),
        orderBy("timestamp", "desc")
        // limit(3) // Limit the number of documents to 3
      );
      const querySnapshot = await getDocs(q);
      const tasksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
      const tpnl = calculateTotalPnl(tasksData);
      setTotalPnl(tpnl);
      const adjustment = userData?.adjustment || 0;
      setAdjustment(adjustment);
    };

    function calculateTotalPnl(tradeData) {
      var acc = 0;
      const op = tradeData.reduce((acc, trade) => {
        if (trade.pnl) {
          acc = acc + trade.pnl;
        }
        return acc;
      }, acc); // provide the initial value for the accumulator

      setTpnl(op);

      return op > 0 ? "+" + op : op;
    }

    const fetchTransactions = async () => {
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", userData.id),
        orderBy("timestamp", "desc")
        // limit(3) // Limit the number of documents to 3
      );
      const querySnapshot = await getDocs(q);
      const transactionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(transactionsData);
      const total = calculateTotalBalance(transactionsData);
      setTotalBalance(total);

      // console.log(transactionsData);
    };

    fetchTransactions();

    fetchTasks();
  }, [userData.id]);

  // function to calculate the total balance
  function calculateTotalBalance(transactionsData) {
    var acc = 0;
    return transactionsData.reduce((acc, transaction) => {
      if (transaction.status === "approved") {
        if (transaction.type === "Add Money") {
          return acc + transaction.amount;
        } else if (transaction.type === "Withdraw Money") {
          return acc - transaction.amount;
        }
        console.log(acc);
      }
      return acc; // return the accumulator if the conditions are not met
    }, acc); // provide the initial value for the accumulator
  }

  // function to calculate the p/l value of trade

  // function to convert timestamp to date
  function timestampToDate(timestamp) {
    const date = new Date(timestamp);
    return date.toDateString
      ? date.toDateString()
      : new Date(date).toDateString
      ? new Date(date).toDateString()
      : "N/A";
  }

  return (
    <div>
      <iframe
        allowtransparency="true"
        src="https://www.tradingview-widget.com/embed-widget/ticker-tape/?locale=in#%7B%22symbols%22%3A%5B%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BSE%3ASBIN%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BSE%3ARELIANCE%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BSE%3AADANIPORTS%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BSE%3ATATAMOTORS%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BSE%3ASENSEX%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BSE%3AICICINF100%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BSE%3AJIOFIN%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BSE%3ABANKBARODA%22%7D%5D%2C%22showSymbolLogo%22%3Atrue%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22displayMode%22%3A%22adaptive%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A78%2C%22utm_source%22%3A%22capitalonebroking.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22ticker-tape%22%2C%22page-uri%22%3A%22capitalonebroking.com%2Fuser%2Fdashboard%22%7D"
        title="ticker tape TradingView widget"
        lang="en"
        allowfullscreen=""
        className="w-full md:h-12 h-20"
      ></iframe>
      <div className="my-4">
        <h1 className="text-2xl font-semibold">
          Welcome, {userData.firstName}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Here&apos;s what&apos;s happening with your account today
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {" "}
        <Card>
          <CardHeader className="flex flex-row items-c</Card>enter justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <CreditCardIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalBalance}</div>
            {/* <p className="text-xs text-gray-500 dark:text-gray-400">
              +20.1% from last month
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            <BarChartIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalBalance + adjustment}
            </div>
            {/* <p className="text-xs text-gray-500 dark:text-gray-400">
              +19% from last month
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Profit/Loss
            </CardTitle>
            <ActivityIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPnl}</div>
            {/* <p className="text-xs text-gray-500 dark:text-gray-400">
              +180.1% from last month
            </p> */}
          </CardContent>
        </Card>
      </div>

      <div className="my-4">
        <h1 className="text-xl font-semibold">Recent Trades</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.slice(0, 3).map((task) => (
          <Card key={task.tradeId}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{task.type}</CardTitle>
              <ActivityIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="text-2xl font-bold">{task.symbol}</div>
              <div className="flex items-center gap-2">
                {" "}
                <div className="text-lg font-medium">Qty: {task.quantity}</div>
                <div className="text-lg font-medium  text-gray-500">|</div>
                <div className="text-lg font-medium">Price: {task.price}</div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {timestampToDate(task.timestamp)}
              </p>
              {/* add a like tag to divide */}

              <hr />
              <div className="flex items-center gap-2">
                {task.updatedtimestamp ? (
                  <div className="text-sm font-medium">
                    P/L: {task.pnl > 0 ? "+" + task.pnl : task.pnl}
                  </div>
                ) : (
                  <div className="text-sm font-medium">P/L: 0</div>
                )}
                <div className="text-sm font-medium  text-gray-500">|</div>
                {task.updatedtimestamp ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Updated At: {timestampToDate(task.updatedtimestamp)}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Updated At: Not Updated Yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="my-4">
        <h1 className="text-xl font-semibold">Recent Transaction</h1>
      </div>

      <div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Transaction ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 3).map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.paymentId}
                  </TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>₹ {transaction.amount}</TableCell>
                  <TableCell>
                    {timestampToDate(transaction.timestamp)}
                  </TableCell>
                  <TableCell className="">
                    <Badge variant={transaction.status}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

function BarChartIcon(props) {
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
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}

function AwardIcon(props) {
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
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </svg>
  );
}
function CreditCardIcon(props) {
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
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function DollarSignIcon(props) {
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
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function FileTextIcon(props) {
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function UsersIcon(props) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ActivityIcon(props) {
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
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
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

function CircleMinusIcon(props) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
    </svg>
  );
}

function CirclePlusIcon(props) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}

function Grid3x3Icon(props) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  );
}

function ListIcon(props) {
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
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}

function SettingsIcon(props) {
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default Sample;
