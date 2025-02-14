import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="p-4 bg-gray-800 text-white flex justify-between">
          <Link href="/" className="text-lg font-bold">Bioverse</Link>
          <Link href="/login" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
            Login
          </Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
