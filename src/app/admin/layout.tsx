import AdminNav from "../(components)/AdminDashboard/AdminNav";
import AdminSidebar from "../(components)/AdminDashboard/AdminSideBar";
import { AdminDataContextProvider } from "../(context)/adminContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (<>
    <AdminDataContextProvider>
      <AdminSidebar/>
      <div className="ml-80 flex-1 pl-4">
        <AdminNav/>
        {children}
      </div>
      
    </AdminDataContextProvider>
  </>
  );
}
