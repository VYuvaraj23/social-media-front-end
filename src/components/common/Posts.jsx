import Post from "./Post";
import PostSkeleton from "../skeletons/RightPanelSkeleton";


const Posts = ({ posts,isLoading ,error,isRefetching,setPosts,fetchPosts}) => {
  


  return (
    <>
      {/* Skeleton Loader */}
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && posts === undefined && (
      
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}

      {/* Error State */}
      {error && <p className="text-center text-red-500 my-4">Error: {error}</p>}

      {/* Render Posts */}
      {!isLoading && posts?.length > 0 && (
        <div>
          {posts.map((post) => {
            return <Post key={post._id} post={post} fetchPosts={ fetchPosts} setPosts={setPosts}  />;
          })}
        </div>
      )}
    </>
  );
};

export default Posts;
