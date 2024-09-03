import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/utils/theme-provider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "../components/ui/toaster";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: {
    default: "Mysocials",
    template: "%s | Mysocials",
  },
  description:
    "Open-Source link in bio tool for content creators, developers, and enthusiasts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Script strategy="lazyOnload" id="clarity-script">
        {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "kdz2zgnwib");
        `}
      </Script>
      <body className={poppins.className}>
        <NextTopLoader
          color="hsl(229 100% 62%)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 0px hsl(229 100% 62%),0 0 0px hsl(229 100% 62%)"
          template='<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          zIndex={1600}
          showAtBottom={false}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
