"use client";
import Link from "next/link";
import React, { useState } from "react";
import NavItems from "../utils/NavItems";
import {ThemeSwitcher} from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3,  HiOutlineUserCircle } from "react-icons/hi";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
};

const Header: React.FC<Props> = ({activeItem , setOpen}) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }
  
  const handleClose = (e:any) => {
    if(e.target.id === 'screen') {
      setOpenSidebar(false);
    }
  }
  
  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow dark:bg-black opacity-90"
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link href={'/'}
                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}>
                9rayti
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems 
                activeItem={activeItem}
                isMobile={false}
              />
              <ThemeSwitcher />
              {/* only for mobile */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  onClick={() => setOpenSidebar(true)}
                  className="cursor-pointer dark:text-white text-black"
                  size={25}
                />
              </div>
              <HiOutlineUserCircle 
                className="hidden 800px:block cursor-pointer dark:text-white text-black"
                size={25}
                onClick={() => setOpen(true)}
              />
            </div>

          </div>
        </div>

        {/* mobile sidebar */}
        {
          openSidebar && (
            <div 
              className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
              onClick={handleClose}
              id="screen"
            >
              <div className="w-[70%] fixed z-[9999999999999] h-screen bg-white dark:bg-black dark:bg-opacity-90 top-0 right-0">
                <NavItems 
                  activeItem={activeItem}
                  isMobile={true}
                />
                <HiOutlineUserCircle 
                  className="cursor-pointer ml-5 my-2 dark:text-white text-black"
                  size={25}
                  onClick={() => setOpen(true)}
                />
                <br />
                <br />
                <p className="text-[16px] px-2 pl-5 text-black dark:text-white bottom-[20px] absolute">
                  Copyright &copy; 2022 9rayti
                </p>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Header;
