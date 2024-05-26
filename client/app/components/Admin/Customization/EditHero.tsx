import { styles } from "@/app/styles/style";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const EditHero: FC<Props> = (props: Props) => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const { data, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess, isLoading, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data) {
      setTitle(data?.layout?.banner.title);
      setSubTitle(data?.layout?.banner.subTitle);
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Hero section updated successfully");
      refetch();
    }
  }, [isSuccess, refetch]);

  useEffect(() => {
    if (error) {
      console.log(error);
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data.message);
      }
    }
  }, [error]);

  const handleEdit = async () => {
    await editLayout({
      type: "Banner",
      title,
      subTitle,
    });
  };

  return (
    <>
      <div className="w-full flex items-center h-screen justify-center">
        <div className="1000px:w-[100%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px] mx-8">
          <textarea
            className="mb-2 dark:text-white resize-none text-[#0F172A] font-Josefin font-[600] text-[30px] px-3 w-full 1000px:text-[60px] 1500px:text-[70px] bg-transparent outline-none"
            placeholder="Improve your online learning experience better instantly"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={4}
          />
          <textarea
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
            placeholder="we have 40k+ online courses for you to choose from"
            className="mb-6 dark:text-white resize-none text-[#0F172A] font-Josefin font-[600] text-[18px] px-3 w-full bg-transparent outline-none"
          ></textarea>
          <div
            className={`
              ${
                styles.button
              } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-[#0F172A] bg-[#cccccc34]
              ${
                data?.layout?.banner.subTitle !== subTitle ||
                data?.layout?.banner.title !== title
                  ? "!cursor-pointer !bg-[#42d283]"
                  : "!cursor-not-allowed"
              }
            `}
            onClick={
              data?.layout?.banner.subTitle !== subTitle ||
              data?.layout?.banner.title !== title
                ? handleEdit
                : () => null
            }
          >
            save
          </div>
        </div>
      </div>
    </>
  );
};

export default EditHero;
