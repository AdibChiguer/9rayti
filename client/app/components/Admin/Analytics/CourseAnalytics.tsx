import React from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Label,
  YAxis,
  LabelList,
} from "recharts";
import Loader from "../../Loader/Loader";
import { useGetCoursesAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { styles } from "@/app/styles/style";

type Props = {};

const CourseAnalytics = (props: Props) => {
  const { data, isLoading } = useGetCoursesAnalyticsQuery({});
  // const analyticsData = [
  //   { name: "Jun 2023" , uv : 4},
  //   { name: "Jul 2023" , uv : 5},
  //   { name: "Aug 2023" , uv : 6},
  //   { name: "Sep 2023" , uv : 7},
  //   { name: "Oct 2023" , uv : 3},
  //   { name: "Nov 2023" , uv : 9},
  //   { name: "Dec 2023" , uv : 5},
  // ]

  const analyticsData: any = [];

  data &&
    data.courses.last12Months.forEach((item: any) => {
      analyticsData.push({
        name: item.month,
        uv: item.count,
      });
    });

  const minValue = 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="h-screen">
          <div className="mt-[50px]">
            <h1 className={`${styles.title} px-5 !text-start`}>
              Course Analytics
            </h1>
            <p className={`${styles.label} px-5`}>
              Last 12 months analytics data{""}
            </p>
          </div>

          <div className="w-full h-[90%] flex items-center justify-center">
            <ResponsiveContainer width="90%" height="50%">
              <BarChart>
                <XAxis dataKey="name">
                  <Label offset={0} position="insideBottom" />
                </XAxis>
                <YAxis domain={[minValue, "auto"]} />
                <Bar dataKey="uv" fill="#3faf82">
                  <LabelList dataKey="uv" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseAnalytics;
