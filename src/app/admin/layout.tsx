import AdminNav from "../(components)/AdminDashboard/AdminNav";
import AdminSidebar from "../(components)/AdminDashboard/AdminSideBar";
import { AdminDataContextProvider } from "../(context)/adminContext";
import { LessonProvider } from "../(context)/lessonContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminDataContextProvider>
      <LessonProvider>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 transition-all duration-300 p-4 pt-16 lg:pt-4">
          <AdminNav />
          <main className="mt-4">
            {children}
          </main>
        </div>
      </div>
      </LessonProvider>
    </AdminDataContextProvider>
  );
}
