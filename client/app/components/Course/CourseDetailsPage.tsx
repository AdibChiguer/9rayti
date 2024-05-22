import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";

type Props = {
  id: string;
};

const CourseDetailsPage = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetCourseDetailsQuery(id);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Heading
            title={data?.course.name + " | 9rayti"}
            description={
              "9rayti is a platform for students to learn and get help from teachers"
            }
            keywords={data?.course?.tags}
          />
          <Header
            open={open}
            setOpen={setOpen}
            route={route}
            setRoute={setRoute}
            activeItem={1}
          />
          <CourseDetails data={data?.course} />
          <Footer />
        </div>
      )}
    </>
  );
};

export default CourseDetailsPage;
