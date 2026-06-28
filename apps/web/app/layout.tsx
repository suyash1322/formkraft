import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FormKraft",
  description: "No-code Form Builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}