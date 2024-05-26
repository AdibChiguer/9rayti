import React, { FC } from "react";
import CoursePlayer from "../../../utils/CoursePlayer";
import { styles } from "../../../styles/style";
import Ratings from "../../../utils/Ratings";
import { IoCheckmarkCircleSharp } from "react-icons/io5";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseData: any;
  handleCourseCreate: (e: React.FormEvent) => void;
  isEdit: boolean;
};

const CoursePreview: FC<Props> = ({
  active,
  setActive,
  courseData,
  handleCourseCreate,
  isEdit,
}) => {

  const discountPercentengePrice = (
    ((courseData?.estimatedPrice - courseData?.price) /
      courseData?.estimatedPrice) *
    100
  ).toFixed(0);

  const preButton = () => {
    setActive(active - 1);
  }

  const createCourse = (e: React.FormEvent) => {
    e.preventDefault();
    handleCourseCreate(e);
  }

  return (
    <div className="w-[85%] m-auto py-5 mb-5">
      <div className="w-full relative">
        <div className="w-full mt-10">
          <CoursePlayer
            videoUrl={courseData?.demoUrl}
            title={courseData?.title}
          />
        </div>

        <div className="flex justify-between items-center pr-6">
          {/* price section */}
          <div className="flex items-center">
            <h1 className="pt-5 text-[25px]">
              {courseData?.price === 0 ? "Free" : `$${courseData?.price}`}
            </h1>
            <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80">
              ${courseData?.estimatedPrice}
            </h5>
            <h4 className="pl-5 pt-4 text-[22px]">
              {discountPercentengePrice}% off
            </h4>
          </div>

          {/* buy btn */}
          <div className="flex items-center">
            <div
              className={`${styles.button} !w-[180px] my-3 font-Poppins !bg-[crimson] cursor-not-allowed`}
            >
              Buy Now {courseData?.price}$
            </div>
          </div>
        </div>

        {/* discount code */}
        <div className="flex items-center mb-2">
          <input
            type="text"
            name=""
            placeholder="Discount Code..."
            className={`${styles.input} 1500px:!w-[60%] 1100px:!w-[60%] !mt-0`}
          />
          <div
            className={`${styles.button} !w-[120px] my-3 ml-4 font-Poppins cursor-pointer`}
          >
            Apply
          </div>
        </div>

        <p className="pb-1">- Source code included</p>
        <p className="pb-1">- Lifetime access</p>
        <p className="pb-1">- Certificate of completion</p>
        <p className="pb-3 800px:pb-1">- Premium Support</p>
      </div>

      <div className="w-full mt-4">
        <div className="w-full 800px:pr-5">
          <h1 className="text-[25px] font-Poppins font-[600]">
            {courseData?.name}
          </h1>
          <div className="flex items-center justify-between pt-3 mb-4 pr-4">
            <div className="flex items-center">
              <Ratings rating={0} />
              <h5>0 Reviews</h5>
            </div>
            <h5>0 Students</h5>
          </div>
        </div>

        <h1 className="text-[25px] font-Poppins font-[600] mt-4">
          What you will learn in this course?
        </h1>
        {courseData?.benifits?.map((item: any, index: number) => (
          <div className="w-full flex 800px:items-center py-2" key={index}>
            <div className="w-[15px] mr-1">
              <IoCheckmarkCircleSharp size={20} />
            </div>
            <p className="pl-2">{item.title}</p>
          </div>
        ))}

        {/* course prerequisites */}
        <h1 className="text-[25px] font-Poppins font-[600] mt-4">
          What are the prerequisites for this course?
        </h1>
        {courseData?.prerequisites?.map((item: any, index: number) => (
          <div className="w-full flex 800px:items-center py-2" key={index}>
            <div className="w-[15px] mr-1">
              <IoCheckmarkCircleSharp size={20} />
            </div>
            <p className="pl-2">{item.title}</p>
          </div>
        ))}

        {/* course description */}
        <div className="w-full mt-4 mb-4">
          <h1 className="text-[25px] font-Poppins font-[600]">
            Course Details
          </h1>
          <p className="text-[18px] mt-2 whitespace-pre-line w-full overflow-hidden">
            {courseData?.description}
          </p>
        </div>
      </div>

      <div className="w-full flex items-center justify-between pr-4">
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={preButton}
        >
          Prev
        </div>
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={createCourse}
        >
          {isEdit ? 'Update' : 'Create'}
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;