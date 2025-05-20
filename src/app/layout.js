import "@/styles/globals.scss";

export const metadata = {
  title: "JobCost Pro - Cost Management Tool",
  description: "A professional tool for tracking and managing job costs",
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
