import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, MessageSquare } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import ProfileModal from "./ProfileModal";
import { useState } from "react";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  // const queryClient = useQueryClient();
  // const { mutate: logoutMutation } = useMutation({
  //   mutationFn: logout,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  const { logoutMutation } = useLogout();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <nav className={`bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 items-center ${isChatPage ? "hidden md:flex" : "flex"}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <MessageSquare className="size-9 text-green-500" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600 tracking-wider">
                  Suhel Chats
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          {/* TODO */}
          <ThemeSelector />

          <div
            className="flex items-center gap-2 cursor-pointer group p-1.5 hover:bg-base-300 rounded-lg transition-colors mr-2 relative"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <div className="hidden md:flex flex-col items-end mr-1">
              <span className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{authUser?.fullName}</span>
              <span className="text-[10px] text-base-content/60">{authUser?.email}</span>
            </div>
            <div className="avatar">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-2 ring-transparent group-hover:ring-primary transition-all">
                <img src={authUser?.profilePic || "/avatar.png"} alt="User Avatar" />
              </div>
            </div>
          </div>

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={() => document.getElementById("logout_modal").showModal()}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      <dialog id="logout_modal" className="modal backdrop-blur-sm">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">Confirm Logout</h3>
          <p className="py-4">Are you sure you want to log out of your account?</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-ghost mr-2">Cancel</button>
            </form>
            <button
              className="btn btn-error text-white"
              onClick={() => {
                logoutMutation();
                document.getElementById("logout_modal").close();
              }}
            >
              Logout
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </nav>
  );
};
export default Navbar;
