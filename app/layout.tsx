import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CssBaseline, Container, ThemeProvider } from "@mui/material";

import "./globals.css";
import Header from "./header/header";
import Provider from "./provider";
import authenticated from "./auth/authenticated";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shoppy",
  description: "Shoppy is a shopping website that allows you to buy and sell products",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const isAuthenticated = await authenticated();
  return (
    <html lang="en">
      <body>
        <>
          <CssBaseline />
          <Provider authenticated={isAuthenticated}>
            <Header />
            <Container>{props.children}</Container>
          </Provider>
        </>
      </body>
    </html>
  );
}
