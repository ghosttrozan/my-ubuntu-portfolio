import "../styles/globals.css";
import Main from "./main";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Main /> {/* if Main is client component */}
        <main>{children}</main>
      </body>
    </html>
  );
}

