import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { format } from "timeago.js";
import CourseContentList from "../Course/CourseContentList"
import { Box, Button, Modal } from "@mui/material";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { VscVerifiedFilled } from "react-icons/vsc";

type Props = {
  data: any;
};

const CourseDetails = ({ data }: Props) => {
  const { data: userData } = useLoadUserQuery(undefined, {});
  const user = userData?.user;
  const [open , setOpen] = useState(false)
  // const [message, setMessage] = useState<any>("");
  const [createOrder , {data: orderData , error}] = useCreateOrderMutation();
  const [loadUser , setLoadUser] = useState(false)
  const {} = useLoadUserQuery({skip: loadUser ? false : true})
  // const [isLoading , setIsLoading] = useState(false)

  const discountPercenatge = ((data?.estimatedPrice - data?.price) / data?.estimatedPrice) * 100;
  const discountPercentagePrice = discountPercenatge.toFixed(0);
  const isPurchased = user && user?.courses.find((item: any) => item._id === data?._id);

  const handleOrder = (e: any) => {
    setOpen(true);
  };

  const handleEnroleCourse = async (e:any) => {
    e.preventDefault();
    createOrder({courseId: data._id})
  }

  useEffect(() => {
    if(orderData) {
      setLoadUser(true);
      redirect(`/course-access/${data._id}`)
    }
    if(error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
        console.log(errorMessage);
      }
    }
  }, [orderData , error]);

  return (
    <div>
      <div className="w-[90%] 800px:w-[90%] m-auto py-5">
        <div className="w-full flex flex-col-reverse 800px:flex-row">
          <div className="w-full 800px:w-[65%] 800px:pr-20">
            <h1 className="text-[25px] font-Poppins font-[600] text-[#0F172A] dark:text-white">
              {data.name}
            </h1>
            <div className="flex items-center justify-between pt-3">
              <Ratings rating={data.ratings} />
              <h5 className="text-[#0F172A] dark:text-white">
                {data.reviews?.length} Reviews
              </h5>
            </div>
            <h5 className="text-[#0F172A] dark:text-white mt-3">
              {data.purchased} Students
            </h5>

            <br />
            <h1 className="text-[25px] font-Poppins font-[600] text-[#0F172A] dark:text-white">
              What you will learn from this course
            </h1>
            <div>
              {data.benifits?.map((item: any, index: number) => (
                <div
                  className="w-full flex 800px:items-center py-2"
                  key={index}
                >
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline
                      size={20}
                      className="text-[#0F172A] dark:text-white"
                    />
                  </div>
                  <p className="pl-2 text-[#0F172A] dark:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
              <br />
              <br />
            </div>

            <h1 className="text-[25px] font-Poppins font-[600] text-[#0F172A] dark:text-white">
              What are the prerequisites for this course?
            </h1>
            {data.prerequisites?.map((item: any, index: number) => (
              <div className="w-full flex 800px:items-center py-2" key={index}>
                <div className="w-[15px] mr-1">
                  <IoCheckmarkDoneOutline
                    size={20}
                    className="text-[#0F172A] dark:text-white"
                  />
                </div>
                <p className="pl-2 text-[#0F172A] dark:text-white">
                  {item.title}
                </p>
              </div>
            ))}
            <br />
            <br />

            <div>
              <h1 className="text-[25px] font-Poppins font-[600] text-[#0F172A] dark:text-white">
                Course Overview
              </h1>
              <CourseContentList 
                data={data?.courseData}
                isDemo={true}
              />
            </div>
            <br />
            <br />

            {/* course description */}
            <div className="w-full">
              <h1 className="text-[25px] font-Poppins font-[600] text-[#0F172A] dark:text-white">
                Course Details
              </h1>
              <p className="text-[18px] mt-[15px] whitespace-pre-line w-full overflow-hidden text-[#0F172A] dark:text-white">
                {data.description}
              </p>
            </div>
            <br />
            <br />

            <div className="w-full">
              <div className="800px:flex items-center">
                <Ratings rating={data?.ratings} />
                <div className="mb-2 800px:mb-[unset]" />
                <h5 className="text-[25px] font-Poppins text-[#0F172A] dark:text-white">
                  {Number.isInteger(data?.ratings)
                    ? data?.ratings.toFixed(1)
                    : data?.ratings.toFixed(2)}{" "}
                  Course Rating - ({data?.reviews?.length} Reviews)
                </h5>
              </div>
              <br />
              {data?.reviews &&
                [...data?.reviews].reverse().map((item: any, index: number) => (
                  <div className="w-full pb-4" key={index}>
                    <div className="flex">
                      <div className="mr-2 h-[50%]">
                        <Image 
                          src={item?.user.avatar ? item?.user.avatar : require("../../../public/assets/avatar.jpg")}
                          width={50}
                          height={50}
                          alt='avatar'
                          className='w-[50px] h-[50px] object-cover rounded-full'
                        />
                      </div>
                      <div className="hidden 800px:block pl-2">
                        <div className="flex items-center">
                          <h5 className="text-[18px] pr-2 text-[#0F172A] dark:text-white">
                            {item.user.name}
                          </h5>
                          <Ratings rating={item.rating} />
                        </div>
                        <p className="text-[#0F172A] dark:text-white">
                          {item.comment}
                        </p>
                        <small className="text-[#000000d1] dark:text-[#ffffff83]">
                          {format(item.createdAt)}
                        </small>
                      </div>
                      <div className="pl-2 flex 800px:hidden items-center">
                        <h5 className="text-[18px] pr-2 text-[#0F172A] dark:text-white">
                          {item.user.name}
                        </h5>
                        <Ratings rating={item.rating} />
                      </div>
                    </div>
                    {
                      item.commentReplies.map((i:any , index:number) => (
                        <div className="w-full flex 800px:ml-16 my-5" key={index}>
                          <div className="mr-2 h-[50%]">
                            <Image 
                              src={i?.user.avatar ? i?.user.avatar : require("../../../public/assets/avatar.jpg")}
                              width={50}
                              height={50}
                              alt='avatar'
                              className='w-[50px] h-[50px] object-cover rounded-full'
                            />
                          </div>
                          <div className="pl-2">
                            <div className="flex items-center">
                              <h5 className="flex items-center">
                                {i.user.name}{" "}
                              </h5>
                              <VscVerifiedFilled className="text-[#0095f6] ml-2 text-[20px]" />
                            </div>
                            <p>
                              {i.comment}
                            </p>
                            <small className="dark:text-[#edfff4] text-[#0F172A]">
                              {format(i.createdAt)}
                            </small>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ))}
            </div>
          </div>

          <div className="w-full 800px:w-[35%] relative">
            <div className="sticky top-[100px] left-0 z-50 !w-full">
              <CoursePlayer videoUrl={data?.demoUrl} title={data?.title} />
              <div className="flex items-center">
                <h1 className="pt-5 text-[25px] text-[#0F172A] dark:text-white">
                  {data?.price === 0 ? "Free" : `$${data?.price}`}
                </h1>
                <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 text-[#0F172A] dark:text-white">
                  ${data.estimatedPrice}
                </h5>

                <h4>
                  {discountPercentagePrice}% Off
                </h4>
              </div>

              <div className="flex items-center">
                {
                  isPurchased ? (
                    <Link className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`} href={`/course-access/${data._id}`}>
                      Enter to course
                    </Link>
                  ) : (
                    <div className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                      onClick={handleOrder}
                    >
                      Buy Now {data?.price === 0 ? "" : `$${data?.price}`}
                    </div>
                  )
                }
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
      <>
        {
          open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-10 rounded-md dark:bg-[#0F172A]"
              >
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this course?
                </h1>
                <div className="w-full flex gap-4">
                  <Button
                    onClick={() => setOpen(!open)}
                    className={`${styles.button} !w-[100px] !h-[35px] !bg-[#57c7a3] !text-white`}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEnroleCourse}
                    className={`${styles.button} !w-[100px] !h-[35px] !bg-[#f44336] !text-white`}
                  >
                    Enrole
                  </Button>
                </div>
              </Box>
            </Modal>
          )
        }
      </>
    </div>
  );
};

export default CourseDetails;
