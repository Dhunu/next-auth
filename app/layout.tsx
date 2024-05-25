import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

import { auth } from "@/auth";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "Next-Auth",
        template: "%s | Next-Auth",
    },
    description: "Next.js authentication with NextAuth.js",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return (
        <SessionProvider session={session}>
            <html lang="en">
                <body className={inter.className}>
                    <NextTopLoader
                        color={"#ffffff"}
                        initialPosition={0.08}
                        crawlSpeed={200}
                        height={5}
                        crawl={true}
                        easing="ease"
                        speed={200}
                        shadow="0 0 10px #f1f1f1,0 0 5px #f2f2f2"
                        template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                        zIndex={1600}
                        showAtBottom={false}
                        showSpinner={false}
                    />
                    <Toaster />
                    {children}
                </body>
            </html>
        </SessionProvider>
    );
}
