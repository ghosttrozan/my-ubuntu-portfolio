import "../styles/globals.css";
import HomePage from "./page";
import Main from "./main";
import TopPanel from "./topPanel";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <Main/>
        {/* <main>{children}</main> */}
      </body>
    </html>
  );
}
