import AdminNav from "../(components)/AdminDashboard/AdminNav";
import AdminSidebar from "../(components)/AdminDashboard/AdminSideBar";
import { AdminDataContextProvider } from "../(context)/adminContext";
import styles from "./layout.module.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (<>
    <AdminDataContextProvider>
      <AdminSidebar/>
      <div className={`${styles.layoutDiv} pl-4 pt-16 md:ml-80 md:pt-16 flex-1`}>
        <AdminNav/>
        {children}
      </div>
      
    </AdminDataContextProvider>
  </>
  );
}
