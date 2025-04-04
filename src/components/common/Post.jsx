import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import URL from "../../constant/Url";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/data/index.data";

const Post = ({ post, setPosts,fetchPosts }) => {
  const [comment, setComment] = useState("");
  const [commentArr, setCommentArr] = useState(post.comments);

  const [isCommenting, setIsCommenting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);
  const postOwner = post.user;
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("loginToken");

  const isMyPost = user._id === postOwner._id;
  const formattedDate = formatPostDate(post.createdAt);

  // const isCommenting = true;
  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      if (!post?._id) {
        console.log("Post ID is Missing");
      }
      if (!token) {
        console.log("Token is Missing");
      }
      await axios.delete(`${URL.BASE_URL}/posts/delete/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      setPosts((prev) => prev.filter((e) => e._id !== post._id));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("comment cannot be empty");
      return;
    }
    setIsCommenting(true);

    try {
      const res = await axios.post(
        `${URL.BASE_URL}/posts/comment/${post._id}`,
        { text: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        }
      );
      // console.log(res.data.post.comments)
      setCommentArr(res.data.post.comments)
      toast.success("comment posted successfully")
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.Error)
    } finally {
      setIsCommenting(false)
      setComment("")
      fetchPosts
    }
  };

  const handleLikePost = async (id) => {
    try {
      setIsLiking(true);
      // console.log(id)
      const res = await axios.post(`${URL.BASE_URL}/posts/like/${id}`, "", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      // if (res.data.message === "Post unlike successfully") {
      //   console.log("work")
      // }
      // if (res.data.message === "Post like successfully") {
      //   setLikeTorF(()=>true)
      // }
      setLikes(res.data.data);

      // fetchPosts()
    } catch (error) {
      console.log(error);
    } finally {
      setIsLiking(false);
    }
  };
  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-8 rounded-full overflow-hidden"
          >
            <img
              src={postOwner.profileImg || "/avatar-placeholder.png"}
              alt="profileImage"
            />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.username}`}>
                @{postOwner.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {!isDeleting && (
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    onClick={handleDeletePost}
                  />
                )}
                {isDeleting && <LoadingSpinner size="sm" />}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.img && (
              <img
                src={post.img}
                className="h-80 object-contain rounded-lg border border-gray-700"
                alt=""
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-between">
              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={() =>
                  document
                    .getElementById("comments_modal" + post._id)
                    .showModal()
                }
              >
                <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                  {commentArr.length}
                </span>
              </div>
              {/* We're using Modal Component from DaisyUI */}
              <dialog
                id={`comments_modal${post._id}`}
                className="modal border-none outline-none"
              >
                <div className="modal-box rounded border border-gray-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {commentArr.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {commentArr.map((comment) => (
                      <div key={comment._id} className="flex gap-2 items-start">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={
                                comment.user.profileImg ||
                                "/avatar-placeholder.png"
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">
                              {comment.user.fullName}
                            </span>
                            <span className="text-gray-700 text-sm">
                              @{comment.user.username}
                            </span>
                          </div>
                          <div className="text-sm">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                      {isCommenting ? <LoadingSpinner size="sm" /> : "Post"}
                    </button>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>
              <div className="flex gap-1 items-center group cursor-pointer">
                <BiRepost className="w-6 h-6  text-slate-500 group-hover:text-green-500" />
                <span className="text-sm text-slate-500 group-hover:text-green-500">
                  0
                </span>
              </div>
              <div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={() => handleLikePost(post._id)}
              >
                {isLiking && <LoadingSpinner />}
                {!isLiking && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
                )}
                {/* { !isLiking&&  (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500 " />
                )
                } */}

                <span className={`text-sm  group-hover:text-pink-500 `}>
                  {!isLiking && likes.length}

                  {/* {(!isLiking ||!likes) && "0"} */}
                </span>
              </div>
            </div>
            <div className="flex w-1/3 justify-end gap-2 items-center">
              <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Post;
