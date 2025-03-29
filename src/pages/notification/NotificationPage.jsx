import { Link } from "react-router";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import axios from "axios";
import URL from "../../constant/Url";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const NotificationPage = () => {

	const [notifications, setNotifications] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const token = sessionStorage.getItem("loginToken")
	const fetchNotification = async() => {
		
		try {
			setIsLoading(true)
			const res = await axios.get(`${URL.BASE_URL}/notifications`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Cache-Control": "no-cache",
				}
			})
			setNotifications(res.data.notification
			)
			// console.log(res.data)
		} catch (error) {
			toast.error(error.response?.data?.Error || "Something went wrong");
		} finally {
			setIsLoading(false)
		}
	}

	const deleteNotifications =async () => {
try {
	await axios.delete(`${URL.BASE_URL}/notifications`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Cache-Control": "no-cache",
		}
	})
	toast.success('Notification deleted successfully')
	fetchNotification()
} catch (error) {
	toast.error(error.response?.data?.Error || "Something went wrong")
}

	};
	useEffect(() => {
		fetchNotification();
	}, []);
	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>
					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a onClick={deleteNotifications}>Delete all notifications</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
				{notifications?.map((notification) => (
					<div className='border-b border-gray-700' key={notification._id}>
						<div className='flex gap-2 p-4'>
							{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
							{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
							<Link to={`/profile/${notification.from.username}`}>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notification.from.profileImg || "/avatar-placeholder.png"} />
									</div>
								</div>
								<div className='flex gap-1'>
									<span className='font-bold'>@{notification.from.username}</span>{" "}
									{notification.type === "follow" ? "followed you" : "liked your post"}
								</div>
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;