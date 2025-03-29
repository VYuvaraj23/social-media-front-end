import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { MdPassword } from "react-icons/md";
import XSvg from "../../components/svgs/X";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import URL from "../../constant/Url";
import { FaUser } from "react-icons/fa";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useLogout from "../../customHook/useLogout";

const LoginPage = () => {
  const logout = useLogout()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate=useNavigate()

  const { mutate: login, isPending, isError, error } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        
        const data = await axios.post(`${URL.BASE_URL}/api/login`,
          { username, password }, {
            Headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            }
        })
        // console.log(data)
        sessionStorage.setItem("loginToken", data.data.token)
        sessionStorage.setItem("user", JSON.stringify(data.data.user))
        toast.success("User login successful!");
        navigate("/")
        
          
      } catch (error) {
        toast.error(error.response?.data?.message || error.response?.data?.error || error.message);
        throw Error( error.response?.data?.message|| error.response?.data?.error || error.message)

        }
        }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  useEffect(()=>{logout()},[])

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
          <FaUser />
          <input
              type="text"
              className="grow"
              placeholder="username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            {isPending?<LoadingSpinner/>:"Login"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          {/* <p className='text-white text-lg'>{"Don't"} have an account?</p> */}
          <Link to="/forgot-password">
            <button className="btn rounded-full btn-primary text-white  btn-outline w-full">
              Forgot password?
            </button>
          </Link>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
