import axios from "axios";
import URL from "../constant/Url";
import toast from "react-hot-toast";

async function useFollow(userId,token,setIsPending,setSuggestedUsers) {

  
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
  
}

export default useFollow