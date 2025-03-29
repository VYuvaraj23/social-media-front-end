import { useState } from "react";
import {  useNavigate, useParams } from "react-router";


// import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import XSvg from "../../components/svgs/X";
import axios from "axios";
import URL from "../../constant/Url";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')


  const { token } = useParams()
  const navigate = useNavigate()

  const fetchPassword = async () => {
    try {
      if (password === confirmPassword) {
        const res = await axios.put(`${URL.BASE_URL}/api/resetPassword`, {password}, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          }
        })
        toast.success(res.data.message)
        setTimeout(() => {
          navigate('/login')
        }, 3000);
      } else {
        
        toast.error("password and confirm password is miss match")
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    
  }
    const handleSubmit = (e) => {
      e.preventDefault();
      fetchPassword()
    };

    return (
      <div className='max-w-screen-xl mx-auto flex h-screen'>
        <div className='flex-1 hidden lg:flex items-center  justify-center'>
          <XSvg className='lg:w-2/3 fill-white' />
        </div>
        <div className='flex-1 flex flex-col justify-center items-center'>
          <form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
            <XSvg className='w-24 lg:hidden fill-white' />
            <h1 className='text-4xl font-extrabold text-white'>Reset Your Password</h1>
            <label className='input input-bordered rounded flex items-center gap-2'>
              <MdPassword />
              <input
                type='text'
                className='grow'
                placeholder='Password'
                name='email'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </label>
            <label className='input input-bordered rounded flex items-center gap-2'>
              <MdPassword />
              <input
                type='password'
                className='grow'
                placeholder='Confirm Password'
                name='password'
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </label>

					
            <button className='btn rounded-full btn-primary text-white'>Reset Password</button>
					
          </form>
			
        </div>
      </div>
    );
  };

export default ResetPassword;