import { styles } from "@/app/styles/style";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";

type Props = {};

const EditHero: FC<Props> = (props: Props) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const { data, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess, isLoading, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data) {
      setImage(data?.layout?.banner?.image.url);
      setTitle(data?.layout?.banner.title);
      setSubTitle(data?.layout?.banner.subTitle);
    }
    if (isSuccess) {
      refetch();
      toast.success("Hero section updated successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data.message);
      }
    }
  }, [data, isSuccess, error]);

  const handleUpdate = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    await editLayout({
      type: "Banner",
      image,
      title,
      subTitle,
    });
  };

  return (
    <>
      <div className="w-full 1000px:flex items-center">
        <div className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1500px:w-[700px] 1100px:h-[500px] 1100px:w-[500px] h-[50vh] w-[50vh] hero_animation rounded-[50%] 1100px:left-[18rem] 1500px:left-[21rem]">
          <div className="1000px:w-[40%] flex items-center justify-end">
            <img
              src={image}
              alt=""
              className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-auto z-[10]"
            />
            <input
              type="file"
              name=""
              id="banner"
              accept="image/*"
              onChange={handleUpdate}
              className="hidden"
            />
            <label htmlFor="banner" className="absolute bottom-0 right-0 z-20">
              <AiOutlineCamera className="dark:text-white text-[#0F172A] text-[18px] cursor-pointer" />
            </label>
          </div>
          <div className="1000px:w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px]">
            <textarea
              className="mb-2 dark:text-white resize-none text-[#000000ac] font-Josefin font-[600] text-[30px] px-3 w-full 1000px:text-[60px] 1500px:text-[70px] bg-transparent"
              placeholder="Improve your online learning experience better instantly"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={4}
            />
            <textarea
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="we have 40k+ online courses for you to choose from"
              className="mb-6 dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] 1500px:!w-[55%] 1100px:!w-[74%] bg-transparent"
            ></textarea>
            <div
              className={`
                ${
                  styles.button
                } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-[#0F172A] bg-[#cccccc34]
                ${
                  data?.layout?.banner.subTitle !== subTitle ||
                  data?.layout?.banner.title !== title ||
                  data?.layout?.banner?.image.url !== image
                    ? "!cursor-pointer !bg-[#42d283]"
                    : "!cursor-not-allowed"
                }
              `}
              onClick={
                data?.layout?.banner.subTitle !== subTitle ||
                data?.layout?.banner.title !== title ||
                data?.layout?.banner?.image.url !== image
                  ? handleEdit
                  : () => null
              }
            >
              save
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditHero;
