import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";
import { UserIcon } from "lucide-react";

const FriendsPage = () => {
    const { data: friends = [], isLoading } = useQuery({
        queryKey: ["friends"],
        queryFn: getUserFriends,
    });

    if (isLoading) return (
        <div className="h-screen flex justify-center items-center">
            <span className="loading loading-spinner loading-lg" />
        </div>
    );

    return (
        <div className="h-screen">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <UserIcon className="size-6" />
                    My Friends
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {friends.map((friend) => (
                        <FriendCard key={friend._id} friend={friend} />
                    ))}
                </div>

                {friends.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <p>You haven't added any friends yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FriendsPage;
