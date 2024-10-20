"use client";

import { store } from "@/redux/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
