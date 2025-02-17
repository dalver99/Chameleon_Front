import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./../components/Navbar";
import { MapProvider } from "@/providers/MapProvider";
import Script from "next/script";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ChamelNeon",
  description: "The Hyper Flexible Advertising Platform",
  keywords: ['카멜네온', '오프라인 광고', 'AI 광고'],
  metadataBase: new URL(
    process.env.BASE_URL || "https://team9-bigproject.vercel.app"
  ),

  openGraph: {
    title: "ChamelNeon",
    description: "오프라인 광고도 변화가 필요한 순간",
    images: [
      {
        url: "/og-image.png",
        width: 800,
        height: 400,
        alt: "ChamelNeon",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "YOUR_CLARITY_PROJECT_ID");
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <MapProvider>
            <Navbar />
            <main className="flex flex-col h-[calc(100vh-3.5rem)] mt-14">
              <div className="flex-1">{children}</div>
              <Footer />
            </main>
          </MapProvider>
      </body>
    </html>
  );
}
