"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "../components/Auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import avatar from "../../public/assets/avatar.jpg";
import { useSession } from "next-auth/react";
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  setRoute: (route: string) => void;
  route: string;
};

const Header: React.FC<Props> = ({ activeItem, setOpen , route , open , setRoute}) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state:any) => state.auth);
  const { data , status } = useSession();
  const [socialAuth , {isSuccess , error}] = useSocialAuthMutation();
  const [logout, setLogout] = useState(false);
  const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  });

  useEffect(() => {
    if (!user){
      if (data){
        socialAuth({
          email: data?.user?.email,
          name: data?.user?.name,
          avatar: data?.user?.image,
        });
      }
    }
    if(data === null && isSuccess){
      toast.success("Logged in successfully");
    }
    if(data === null && error){
      setLogout(true);
    }

  }, [data, user, status])

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      setOpenSidebar(false);
    }
  };

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-[#0F172A] bg-white fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link
                href={"/"}
                className={`text-[25px] font-Poppins text-[#0F172A] dark:text-white font-bold`}
              >
                9rayti
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              {/* only for mobile */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  onClick={() => setOpenSidebar(true)}
                  className="cursor-pointer dark:text-white text-[#0F172A]"
                  size={30}
                />
              </div>
              {
                user ? (
                  <Link href={"/profile"}>
                    <Image 
                      src={user.avatar ? user.avatar.url : avatar }
                      alt=""
                      width={30}
                      height={30}
                      className="w-[30px] h-[30px] rounded-full cursor-pointer"
                      style={{border: activeItem === 5 ? "2px solid #37a39a" : "none"}}
                    />
                  </Link>
                ) : (
                  <HiOutlineUserCircle
                    className="hidden 800px:block cursor-pointer dark:text-white text-[#0F172A]"
                    size={30}
                    onClick={() => setOpen(true)}
                  />
                )
              }
            </div>
          </div>
        </div>

        {/* mobile sidebar */}
        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[9999999999999] h-screen bg-white dark:bg-[#0F172A] dark:bg-opacity-90 top-0 right-0">
              <NavItems activeItem={activeItem} isMobile={true} />
              <HiOutlineUserCircle
                className="cursor-pointer ml-5 my-2 dark:text-white text-[#0F172A]"
                size={25}
                onClick={() => setOpen(true)}
              />
              <br />
              <br />
              <p className="text-[16px] px-2 pl-5 text-[#0F172A] dark:text-white bottom-[20px] absolute">
                Copyright &copy; 2022 9rayti
              </p>
            </div>
          </div>
        )}
      </div>
      {
        route === "Login" && (
          <>
            {
              open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  setRoute={setRoute}
                  activeItem={activeItem}
                  component={Login}
                />
              )
            }
          </>
        )
      }
      {
        route === "Sign-Up" && (
          <>
            {
              open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  setRoute={setRoute}
                  activeItem={activeItem}
                  component={SignUp}
                />
              )
            }
          </>
        )
      }
      {
        route === "Verification" && (
          <>
            {
              open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  setRoute={setRoute}
                  activeItem={activeItem}
                  component={Verification}
                />
              )
            }
          </>
        )
      }
    </div>
  );
};

export default Header;
