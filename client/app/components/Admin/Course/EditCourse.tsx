import React, { FC, useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useEditCourseMutation, useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

type Props = {
  id: string;
};

const EditCourse:FC<Props> = ({id}) => {
  const [editCourse , {isSuccess , error}] = useEditCourseMutation();
  const { data , refetch} = useGetAllCoursesQuery({}, {refetchOnMountOrArgChange: true});
  const editCourseData = data && data.courses.find((course:any) => course._id === id);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course Updated successfully");
      redirect("/admin/courses");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage);
      }
    }
  }, [isSuccess, error]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (editCourseData) {
      setCourseInfo({
        name: editCourseData.name,
        description: editCourseData.description,
        price: editCourseData.price,
        estimatedPrice: editCourseData.estimatedPrice,
        tags: editCourseData.tags,
        level: editCourseData.level,
        demoUrl: editCourseData.demoUrl,
        thumbnail: editCourseData?.thumbnail?.url,
      });
      setBenifits(editCourseData.benifits);
      setPrerequisites(editCourseData.prerequisites);
      setCourseContentData(editCourseData.courseData);
    }
  }, [editCourseData]);

  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    demoUrl: "",
    thumbnail: "",
  });
  const [benifits, setBenifits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      links: [
        {
          title: "",
          url: "",
        },
      ],
      suggestions: "",
    },
  ]);
  const [courseData, setCourseData] = useState({});

  const handleSubmit = async () => {
    // format benifits array
    const formattedBenifits = benifits.map((benifit) => ({
      title: benifit.title,
    }));
    // format prerequisites array
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));
    // format course content array
    const formattedCourseContentData = courseContentData.map((content) => ({
      videoUrl: content.videoUrl,
      title: content.title,
      description: content.description,
      videoSection: content.videoSection,
      links: content.links.map((link) => ({
        title: link.title,
        url: link.url,
      })),
      suggestions: content.suggestions,
    }));
  
    // prepare our data object
    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benifits: formattedBenifits,
      prerequisites: formattedPrerequisites,
      courseContent: formattedCourseContentData,
    };
  
    setCourseData(data);
  };
  
  const handleCourseCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await editCourse({ id: editCourseData?._id, data: courseData });
  }  

  return (
    <div className="w-full flex min-h-screen">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benifits={benifits}
            setBenifits={setBenifits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            active={active}
            setActive={setActive}
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmit={handleSubmit}
          />
        )}
        {active === 3 && (
          <CoursePreview
            active={active}
            setActive={setActive}
            courseData={courseData}
            handleCourseCreate={handleCourseCreate}
            isEdit={true}
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
        <CourseOptions active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default EditCourse;
