import React from 'react'
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  Tooltip,
} from "recharts";
import Loader from "../../Loader/Loader";
import { useGetUsersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { styles } from "@/app/styles/style";


type Props = {
  isDashboard?: boolean;
}

const UsersAnalytics = ({isDashboard}: Props) => {
  const { data, isLoading } = useGetUsersAnalyticsQuery({});
  
  const analyticsData: any = [];
  data && data.users.last12Months.forEach((item: any) => {
    analyticsData.push({
      name: item.month,
      count: item.count,
    });
  });


  return (
    <>
      {
        isLoading ? (
          <Loader />
        ) : (
          <div className={`${!isDashboard ? "" : "mt-[50px] dark:bg-[#111c43] shadow-sm pb-5 rounded-sm py-4"}`}>
            <div className={`${isDashboard ? "!ml-4 mb-4" : "pt-[50px] pl-[35px]"}`}>
              <h1 className={`${styles.title} ${isDashboard && "!text-[20px]"} px-5 !text-start !my-[unset]`}>
                Users Analytics
              </h1>
              {
                !isDashboard && (
                  <p className={`${styles.label} px-5`}>
                    Last 12 months analytics data{" "}
                  </p>
                )
              }
            </div>
            <div className={`w-full ${isDashboard ? 'h-[30vh]' : 'h-[70vh]'} flex items-center justify-center ml-[-10px]`}>
              <ResponsiveContainer width={isDashboard ? "100%" : "90%"} height={!isDashboard ? "90%" : "100%"} className={`${!isDashboard && "mb-[-45px]"}`}>
                <AreaChart
                  data={analyticsData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#4d62d9"
                    fill="#4d62d9"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      }
    </>
  )
}

export default UsersAnalytics