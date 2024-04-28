'use client'
import "./globals.css";
import { Poppins , Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "./utils/theme-provider";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import { SessionProvider } from "next-auth/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600" , "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600" , "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${josefin.variable} bg-white dark:bg-[#0F172A] duration-300 box-border`}>
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>  
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
