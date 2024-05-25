import React, { FC, useEffect, useState } from "react";
import UsersAnalytics from "../Analytics/UsersAnalytics";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import OrdersAnalytics from "../Analytics/OrdersAnalytics";
import AllInvoices from "../Order/AllInvoices";
import {
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";

type Props = {
  open?: boolean;
  value?: number;
};

const CircularProgressWithLabel: FC<Props> = ({ open, value }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        color={value && value > 99 ? "info" : "error"}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
    </Box>
  );
};

const DashboardWidgets: FC<Props> = ({ open }) => {
  const [orderComparePrecentage, setOrderComparePrecentage] = useState<any>();
  const [userComparePrecentage, setUserComparePrecentage] = useState<any>();

  const { data, isLoading } = useGetUsersAnalyticsQuery({});
  const { data: ordersData, isLoading: ordersLoading } =
    useGetOrdersAnalyticsQuery({});

  useEffect(() => {
    if (isLoading && ordersLoading) {
      return;
    } else {
      if (data && ordersData) {
        const usersLastTwoMonths = data?.users?.last12Months.slice(-2);
        const ordersLastTwoMonths = ordersData?.orders?.last12Months.slice(-2);

        if (
          usersLastTwoMonths.length === 2 &&
          ordersLastTwoMonths.length === 2
        ) {
          const usersCurrentMonth = usersLastTwoMonths[1].count;
          const usersPreviousMonth = usersLastTwoMonths[0].count;
          const ordersCurrentMonth = ordersLastTwoMonths[1].count;
          const ordersPreviousMonth = ordersLastTwoMonths[0].count;

          const usersPercentChange = usersPreviousMonth !== 0 ?
            ((usersCurrentMonth - usersPreviousMonth) / usersPreviousMonth) *
            100 : 100;
          const ordersPercentChange = ordersPreviousMonth !== 0 ?
            ((ordersCurrentMonth - ordersPreviousMonth) / ordersPreviousMonth) *
            100 : 100;

          setUserComparePrecentage({
            currentMonth: usersCurrentMonth,
            previousMonth: usersPreviousMonth,
            percentChange: usersPercentChange,
          });

          setOrderComparePrecentage({
            currentMonth: ordersCurrentMonth,
            previousMonth: ordersPreviousMonth,
            percentChange: ordersPercentChange,
          });
        }
      }
    }
  }, [data, ordersData, isLoading, ordersLoading]);

  return (
    <div className="mt-[30px] min-h-screen">
      <div className="grid grid-cols-[75%,25%]">
        <div className="p-8">
          <UsersAnalytics isDashboard={true} />
        </div>

        <div className="pt-[80px] pr-8">
          <div className="w-full dark:bg-[#111C43] rounded-sm shadow">
            <div className="flex items-center p-5 justify-between">
              <div>
                <BiBorderLeft className="dark:text-[#45cba0] text-[#0F172A] text-[30px]" />
                <h5 className="pt-2 font-Poppins dark:text-[#fff] text-[#0F172A] text-[20px] ">
                  {orderComparePrecentage?.currentMonth}
                </h5>
                <h5 className="py-2 font-Poppins dark:text-[#45cba0] text-[#0F172A] text-[20px] font-[400]">
                  Sales Obtained
                </h5>
              </div>
              <div>
                <CircularProgressWithLabel value={
                  orderComparePrecentage?.percentChange > 0
                    ? 100
                    : 0
                } open={open} />
                <h5 className="text-center pt-4">
                  {orderComparePrecentage?.percentChange > 0
                    ? `+${orderComparePrecentage?.percentChange.toFixed(2)}%`
                    : `-${orderComparePrecentage?.percentChange.toFixed(2)}%`}
                </h5>
              </div>
            </div>
          </div>

          <div className="w-full dark:bg-[#111C43] rounded-sm shadowmy-8">
            <div className="flex items-center p-5 justify-between">
              <div>
                <PiUsersFourLight className="dark:text-[#45cba0] text-[#0F172A] text-[30px]" />
                <h5 className="pt-2 font-Poppins dark:text-[#fff] text-[#0F172A] text-[20px] ">
                  {userComparePrecentage?.currentMonth}
                </h5>
                <h5 className="py-2 font-Poppins dark:text-[#45cba0] text-[#0F172A] text-[20px] font-[400]">
                  New Users
                </h5>
              </div>
            </div>
            <CircularProgressWithLabel value={
              userComparePrecentage?.percentChange > 0
                ? 100
                : 0
            } open={open} />
            <h5 className="text-center pt-4">
              {userComparePrecentage?.percentChange > 0
                ? `+${userComparePrecentage?.percentChange.toFixed(2)}%`
                : `-${userComparePrecentage?.percentChange.toFixed(2)}%`}
            </h5>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[65%,35%] mt-[-20px]">
        <div className="dark:bg-[#111c43] w-[94%] mt-[30px] h-[40vh] shadow-sm m-auto">
          <OrdersAnalytics isDashboard={true} />
        </div>
        <div className="p-5">
          <h5 className="dark:text-[#fff] text-[#0F172A] text-[20px] font-[400] font-Poppins pb-3">
            Recent Transactions
          </h5>
          <AllInvoices isDashboard={true} />
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
