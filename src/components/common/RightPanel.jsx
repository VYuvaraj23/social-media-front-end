import { Link } from "react-router";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";
import { useEffect, useState } from "react";
import axios from "axios";
import URL from "../../constant/Url";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import useLogout from "../../customHook/useLogout";

const RightPanel = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const token = sessionStorage.getItem("loginToken");
  const logout = useLogout()
  const fetchSuggestedUsers = async () => {
    try {
      const res = await axios.get(`${URL.BASE_URL}/users/suggested`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      setSuggestedUsers(res.data.suggestedUsers);
    } catch (error) {
      // console.log(error.response.data.Error )
      if (error.response.data.Error === "jwt expired") {
        toast.error("Login Again");
        logout()
        return 
      }
      toast.error(`${error.response.data.Error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      setIsPending(true);
			const res = await axios.post(`${URL.BASE_URL}/users/follow/${userId}`, "",{
				headers: {
					Authorization:`Bearer ${token}`,
          "Cache-Control": "no-cache", 
				}
			})


			toast.success(res.data.message);
			setSuggestedUsers((preUsers) => {
				return preUsers.filter((user)=>user._id !== userId)
			})
    } catch (error) {
      toast.error(error.response.data.Error);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  if (suggestedUsers?.length === 0) return <div className="md:w-64 w-0"></div>;
  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsers.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFollow(user._id);
                    }}
                  >
                    {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
