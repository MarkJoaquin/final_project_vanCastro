import AdminNav from "../(components)/AdminDashboard/AdminNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (<>
    <AdminNav/>
    {children}
  </>
  );
}
