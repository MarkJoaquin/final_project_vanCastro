import AdminNav from "../(components)/AdminDashboard/AdminNav";
import { AdminDataContextProvider } from "../(context)/adminContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (<>
    <AdminDataContextProvider>
      <AdminNav/>
      {children}
    </AdminDataContextProvider>
  </>
  );
}
