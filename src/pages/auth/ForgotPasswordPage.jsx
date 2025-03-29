import { useState } from "react";
import { Link } from "react-router";


import { MdOutlineMail } from "react-icons/md";
import XSvg from "../../components/svgs/X";
import axios from "axios";
import URL from "../../constant/Url";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
	const [email,setEmail]=useState("")

	
	const fetchSend =async () => {
		try {
			await axios.post(`${URL.BASE_URL}/api/forgotPassword`, {email}
			)
			console.log("work")
			toast.success("link send successfully")
		} catch (error) {
			toast.error( error.response?.data?.message || error.message)
		}
	}

	const handleSubmit = async(e) => {
		e.preventDefault();
		fetchSend()
	};
// console.log(email)

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>Find your X account</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={(e)=>setEmail(e.target.value)}
							value={email}
						/>
					</label>

					
					<button className='btn rounded-full btn-primary text-white' >Send Link</button>
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
        </div>
        <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default ForgotPasswordPage;