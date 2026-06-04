import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "SPM Simulator",
  description: "Simulador de flujo SPM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AppProvider>
          <div className="app-layout">
            <Sidebar />
            <div className="main-content">{children}</div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}