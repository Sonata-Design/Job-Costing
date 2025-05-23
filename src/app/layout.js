import "@/styles/globals.css";

export const metadata = {
  title: "Job Costing Tool - Automation Tool",
  description: "A professional tool for tracking and managing job costs",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}
