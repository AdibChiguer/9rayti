"use client";
import React, { FC, useEffect, useState } from "react";
import { ThemeSwitcher } from "@/app/utils/ThemeSwitcher";
import { IoMdNotificationsOutline } from "react-icons/io";
import socketIO from "socket.io-client";
import { useGetAllNotificationsQuery, useUpdateNotificationStatusMutation } from "@/redux/features/notifications/notificationsApi";
import { format } from "timeago.js";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT , {transports: ["websocket"]});

type Props = {
  open?: boolean;
  setOpen?: any;
};

const DashboardHeader: FC<Props> = ({open , setOpen}) => {
  const {data , refetch} = useGetAllNotificationsQuery( undefined , { refetchOnMountOrArgChange: true });
  const [updateNotificationStatus , {isSuccess}] = useUpdateNotificationStatusMutation();
  const [notifications , setNotifications] = useState<any>([]);
  const [audio] = useState(
    new Audio(
      "https://res.cloudinary.com/doauco5er/video/upload/f_auto:video,q_auto/uxwzzahnsjg7dingxkii"
    )
  )

  const playNotificationSound = () => {
    audio.play();
  }

  useEffect(() => {
    if(data){
      setNotifications(
        data.notifications.filter((notification: any) => notification.status === "unread")
      );
    }
    if(isSuccess) {
      refetch();
    }
    audio.load();
  }, [data , isSuccess]);

  useEffect(() => {
    socketId.on("newNotification" , (data) => {
      refetch();
      playNotificationSound();
    })
  }, []);

  const handleNotificationStatusChange = async (id: string) => {
    await updateNotificationStatus(id);
  }

  return (
    <div className="w-full flex items-center justify-end px-6 pb-6 absolute top-5 right-0">
      <ThemeSwitcher />
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-[#111c43]" />
        <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
          {notifications && notifications.length}
        </span>
      </div>
      {open && (
        <div className="w-[350px] h-[50vh] dark:bg-[#111c43] bg-white shadow-xl absolute top-16 z-10 rounded-[10px]">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
            Notifications
          </h5>
          {
            notifications && notifications.map((notification: any , index : number) => (
              <div className="dark:bg-[#2d3a4ea1] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#000000f] w-[340px] m-auto rounded-[10px]" key={index}>
                <div className="w-full flex items-center justify-between p-2">
                  <p className="text-[#111c43] dark:text-white">
                    {notification.title}
                  </p>
                  <p className="text-[#111c43] dark:text-white cursor-pointer"
                    onClick={() => handleNotificationStatusChange(notification._id)}
                  >
                    Mark as Read
                  </p>
                </div>
                <p className="px-2 text-[#111c43] dark:text-white">
                  {notification.message}
                </p>
                <p className="p-2 text-[#111c43] dark:text-white text-[14px]">
                  {format(notification.createdAt)}
                </p>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
