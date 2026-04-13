import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "24 Digitals Dashboard",
  description: "Dynamic Digital Marketing Agency Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
