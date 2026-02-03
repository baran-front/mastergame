import { Metadata } from "next";
import "swiper/css";
import "./globals.css";
import Footer from "@/components/templates/footer";
import { Header } from "@/components/templates/header/header";
import { ThemeProvider } from "@/components/providers/themeProvider";
import { ThemeStyles } from "@/components/providers/themeStyles";
import ReactQueryProvider from "@/components/providers/reactQueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { brand } from "@/brand";
import { LoginModalProvider } from "@/components/providers/loginModalProvider";

export const metadata: Metadata = {
  title: "Mastergame",
  description: "Mastergame is a game development company",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href={brand.logoImg.dark} />
      </head>
      <body className="antialiased">
        <ThemeStyles />
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <LoginModalProvider>
              <Header />
              {children}
              <Footer />
              <Toaster position="top-center" />
            </LoginModalProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
