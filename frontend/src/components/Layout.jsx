import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

const Layout = ({ children, showSidebar = false }) => {
  const isChatPage = typeof window !== 'undefined' && window.location.pathname.startsWith("/chat");

  return (
    <div className={isChatPage ? "h-screen fixed inset-0 overflow-hidden bg-[var(--chat-bg-from)]" : "min-h-screen"}>
      <div className="flex h-full">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col h-full">
          <Navbar />

          <main className={`flex-1 ${isChatPage ? "overflow-hidden relative" : "overflow-y-auto pb-20"}`}>
            {children}
          </main>
        </div>
      </div>

      {showSidebar && <MobileNav />}
    </div>
  );
};
export default Layout;

