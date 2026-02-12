import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

const Layout = ({ children, showSidebar = false }) => {
  const isChatPage = typeof window !== 'undefined' && window.location.pathname.startsWith("/chat");

  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className={`flex-1 lg:pb-0 ${isChatPage ? "h-[100dvh] overflow-hidden pb-0" : "overflow-y-auto pb-20"}`}>
            {children}
          </main>
        </div>
      </div>

      {showSidebar && <MobileNav />}
    </div>
  );
};
export default Layout;

