"use client";

import { ReactNode } from "react";
import "./globals.css";
import { store } from "../app/redux/store";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster /> <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
