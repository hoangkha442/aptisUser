"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19'; 
import useRoleRedirect from "@/hooks/useRoleRedirect";


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
