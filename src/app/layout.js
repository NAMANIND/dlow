import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dashboard",
  description:
    "Infinity Fund LTD is a financial services company. We provide financial services to our clients.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark `}>{children}</body>
    </html>
  );
}
