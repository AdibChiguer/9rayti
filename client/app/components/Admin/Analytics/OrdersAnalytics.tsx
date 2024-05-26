import React from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import Loader from "../../Loader/Loader";
import { useGetOrdersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { styles } from "@/app/styles/style";

type Props = {
  isDashboard?: boolean;
};

const OrdersAnalytics = ({ isDashboard }: Props) => {
  const { data , isLoading } = useGetOrdersAnalyticsQuery({});
  const analyticsData: any = [];

  data &&
    data.orders.last12Months.forEach((item: any) => {
      analyticsData.push({
        name: item.month,
        Count: item.count,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={isDashboard ? "" : "h-[100%]"}>
          <div className={isDashboard ? "mt-[0px] pl-4 mb-4" : "pt-[50px] pl-[35px]" }>
            <h1 className={`${styles.title} ${isDashboard && "!text-[20px]"} px-5 !text-start my-[unset]`}>
              Orders Analytics
            </h1>
            {
              !isDashboard && (
                <p className={`${styles.label} px-5`}>
                  Last 12 months analytics data{""}
                </p>
              )
            }
          </div>

          <div className={`w-full ${isDashboard ? "h-[30vh]" : "h-[70vh]" } flex items-center justify-center ml-[-10px]`}>
            <ResponsiveContainer width={isDashboard ? "100%" : "90%" } height={!isDashboard ? "90%" : "100%" } className={`${!isDashboard && "mb-[-45px]"}`}>
              <LineChart 
                // width={500}
                // height={300}
                data={analyticsData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {!isDashboard && <Legend />}
                <Line type="monotone" dataKey="Count" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersAnalytics;
