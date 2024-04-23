import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { BiSearch } from "react-icons/bi";

type Props = {};

const Hero: FC<Props> = (props) => {
  return (
    <div className="w-full relative">
      <div className="w-full bg-red-500 mt-[150px] lg:mt-[0px] text-center lg:text-left">
        <h2 className="dark:text-white text-[#000000c7] text-[30px] px-3 w-full lg:text-[50px] font-[600] font-Josefin py-2 lg:leading-[75px] lg:w-[60%] md:w-[78%]">
          Improve Your Online <br /> Learning Experience <br /> With Us For Free.
        </h2>
        <br />
        <p className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] lg:!w-[55%] md:!w-[78%]">
          We have all kinds of courses for you to learn from & 500k+ Online
          registered students. Find your desired course and start learning now.
        </p>
        <br />
        <br />
        <div className="w-[90%] h-[50px] bg-transparent relative lg:w-[55%] md:w-[78%]">
          <input
            placeholder="Search Courses..."
            className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 w-full h-full outline-none text-[#0000004e] dark:text-[#ffffffe6] text-[20px] font-[500] font-Josefin"
            type="search"
            value=""
          />
          <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]">
            <BiSearch className="text-white text-[25px]" />
          </div>
        </div>
        <br />
        <br />
        <div className="w-[90%] flex items-center lg:w-[55%] md:w-[78%]">
          <Image
            alt=""
            src={require("../../../public/assets/client-1.webp")}
            className="rounded-full"
          />
          <Image
            alt=""
            src={require("../../../public/assets/client-2.webp")}
            className="rounded-full ml-[-20px]"
          />
          <Image
            alt=""
            src={require("../../../public/assets/client-3.webp")}
            className="rounded-full ml-[-20px]"
          />
          <p className="font-Josefin dark:text-[#edfff4] text-[#000000b3] lg:pl-3 text-[18px] font-[600]">
            500K+ People already trusted us.{" "}
            <a className="dark:text-[#46e256] text-[crimson]" href="/courses">
              Join them now!
            </a>{" "}
          </p>
        </div>
        <br />
      </div>
    </div>
  );
};

export default Hero;

/*  
Improve your online learning experience with 9rayti

We have all kinds of courses for you to learn from & 500k+ Online registered students. Find your desired course and start learning now.

500k+ people already trust us. Join them now!
*/
