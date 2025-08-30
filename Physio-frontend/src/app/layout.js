import "./globals.css";
import ProtectedRoutes from "@/components/protectedRoute/ProtectedRoute"
import Cookies from "js-cookie"
import '../../public/styles/flashcard.css';
import '../styles/richtext.css';

export const metadata = {
  title: "PhysioHub",
  description: "Your app description",
  icons: {
    icon: "/favicon.png", // path inside public/
  },
};

export default function RootLayout({ children }) {

  
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ProtectedRoutes>
          {children}
        </ProtectedRoutes>
      </body>
    </html>
  );
}
