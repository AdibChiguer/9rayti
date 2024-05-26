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
        <div className="h-[100%]">
          <div className="pt-[50px] pl-[35px]">
            <h1 className={`${styles.title} px-5 !text-start my-[unset]`}>
              Course Analytics
            </h1>
            <p className={`${styles.label} px-5`}>
              Last 12 months analytics data{""}
            </p>
          </div>

          <div className="w-full h-[70vh] flex items-center justify-center ml-[-10px]">
            <ResponsiveContainer width="90%" height="90%" className="mb-[-45px]">
              <BarChart data={analyticsData}>
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
