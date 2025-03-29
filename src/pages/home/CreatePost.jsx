import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import URL from "../../constant/Url";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const CreatePost = ({fetchPosts}) => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const imgRef = useRef(null);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);
	const token = sessionStorage.getItem("loginToken");
  const user = JSON.parse(sessionStorage.getItem("user"));
  


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    setError(null);

    try {
			const PostData = {
				text,img
			}
      await axios.post(`${URL.BASE_URL}/posts/create`, PostData, {
				headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        }
      });
      toast.success("Post Created Successfully");
      setText("");
			setImg(null);
			await fetchPosts()
    } catch (error) {
			console.log(error)
			setError(
				error.response?.data?.Error ||
        error.response?.data?.message ||
          error.message
      );
      toast.error(
				error.response?.data.Error ||
        error.response?.message ||
          error.message
      );
    } finally {
      setIsPosting(false);
    }
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
			reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img
            src={user?.profileImg || "/avatar-placeholder.png"}
            alt="profileImage"
          />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              alt="profileImage"
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input type="file" hidden ref={imgRef} onChange={handleImgChange} />
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPosting ? <LoadingSpinner size="sm"/> : "Post"}
          </button>
        </div>
				{error && <div className="text-red-500">{error || "Something went wrong"}</div>}
      </form>
    </div>
  );
};
export default CreatePost;
