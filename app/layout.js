import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "RoleLens | Intelligent Job Application Feedback",
  description: "Get personalized, actionable feedback on your resume tailored to the job description you are targeting.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <main style={{ minHeight: '100vh', padding: '2rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
