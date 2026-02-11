import { XIcon, CalendarIcon, MailIcon, CameraIcon, SaveIcon, UserIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import { capitialize } from "../lib/utils";
import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../lib/api";
import toast from "react-hot-toast";

const ProfileModal = ({ isOpen, onClose }) => {
    const { authUser } = useAuthUser();
    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState(authUser?.fullName || "");
    const [selectedImg, setSelectedImg] = useState(null);
    const fileInputRef = useRef(null);

    const queryClient = useQueryClient();

    const { mutate: updateProfileMutation, isPending } = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            toast.success("Profile updated successfully");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            setIsEditing(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update profile");
        },
    });

    if (!isOpen || !authUser) return null;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImg(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        updateProfileMutation({ fullName, profilePic: selectedImg });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header Background */}
                <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20" />

                {/* Close Button */}
                <button
                    onClick={() => {
                        onClose();
                        setIsEditing(false);
                        setSelectedImg(null);
                        setFullName(authUser?.fullName || "");
                    }}
                    className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost"
                >
                    <XIcon className="size-5" />
                </button>

                <div className="px-6 pb-6">
                    {/* Profile Picture */}
                    <div className="-mt-12 mb-4 relative inline-block">
                        <div className="avatar relative">
                            <div className="w-24 rounded-full ring ring-base-100 ring-offset-2">
                                <img
                                    src={selectedImg || authUser.profilePic || "/avatar.png"}
                                    alt="Profile"
                                    className="object-cover object-center w-full h-full"
                                />
                            </div>

                            {isEditing && (
                                <label
                                    htmlFor="profile-upload"
                                    className="absolute bottom-0 right-0 bg-base-content text-base-100 p-2 rounded-full cursor-pointer hover:bg-base-content/80 transition-all shadow-lg z-10 scale-100 active:scale-95"
                                >
                                    <CameraIcon className="size-4" />
                                    <input
                                        type="file"
                                        id="profile-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        ref={fileInputRef}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* User Info / Edit Form */}
                    <div className="space-y-1">
                        {isEditing ? (
                            <div className="form-control w-full max-w-xs">
                                <label className="label py-1">
                                    <span className="label-text text-xs opacity-70">Full Name</span>
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="input input-sm input-bordered w-full"
                                    placeholder="Your full name"
                                />
                            </div>
                        ) : (
                            <h2 className="text-2xl font-bold">{authUser.fullName}</h2>
                        )}

                        <p className="text-base-content/70 flex items-center gap-2">
                            <MailIcon className="size-4" />
                            {authUser.email}
                        </p>
                    </div>

                    <div className="divider my-4" />

                    {/* Detailed Info Grid */}
                    <div className="grid grid-cols-1 gap-4 text-sm">
                        <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                            <CalendarIcon className="size-5 text-primary" />
                            <div>
                                <p className="font-medium">Member Since</p>
                                <p className="text-xs text-base-content/70">
                                    {new Date(authUser.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                            <div className={`size-2.5 rounded-full ${authUser ? "bg-success" : "bg-error"}`} />
                            <div>
                                <p className="font-medium">Account Status</p>
                                <p className="text-xs text-success">Active</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-end gap-2">
                        {isEditing ? (
                            <>
                                <button
                                    className="btn btn-sm btn-ghost"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setSelectedImg(null);
                                        setFullName(authUser?.fullName || "");
                                    }}
                                    disabled={isPending}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={handleSave}
                                    disabled={isPending}
                                >
                                    {isPending ? <span className="loading loading-spinner loading-xs" /> : <SaveIcon className="size-4 mr-1" />}
                                    Save
                                </button>
                            </>
                        ) : (
                            <button
                                className="btn btn-sm btn-outline w-full"
                                onClick={() => {
                                    setIsEditing(true);
                                    setFullName(authUser?.fullName || "");
                                }}
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
