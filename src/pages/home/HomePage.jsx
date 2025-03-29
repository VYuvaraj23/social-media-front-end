import { useEffect, useState } from "react";
import CreatePost from "./CreatePost";
import Posts from "../../components/common/Posts";
import axios from "axios";
import URL from "../../constant/Url";



const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");


	const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefetching, setIsRefetching] = useState(false);
  const getPostEndPoint = () => {
    switch (feedType) {
      case "forYou":
        return `${URL.BASE_URL}/posts/all`;
      case "following":
        return `${URL.BASE_URL}/posts/following`;
      default:
        return `${URL.BASE_URL}/posts/all`;
    }
  };

  const fetchPosts = async () => {
    const token = sessionStorage.getItem("loginToken");
    setIsLoading(true);
    try {
      const res = await axios.get(getPostEndPoint(), {
        headers: {
          Authorization: `Bearer ${token}`, 
          "Cache-Control": "no-cache",
        },
      });

    
      setPosts(res.data.data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
	};
	

  useEffect(() => {
    setIsRefetching(true);
    fetchPosts();
  }, [feedType]);
	
	return (
    <>
      
			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen px-5'>
				{/* Header */}
				<div className='flex w-full border-b border-gray-700'>
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
				</div>

				{/*  CREATE POST INPUT */}
				<CreatePost fetchPosts={fetchPosts} />

				{/* POSTS */}
				<Posts posts={posts} isLoading={isLoading} error={error} isRefetching={isRefetching} fetchPosts={fetchPosts} setPosts={ setPosts} />
			</div>
		</>
	);
};
export default HomePage;