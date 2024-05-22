"use client";
import React from "react";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";
import Heading from "@/app/utils/Heading";
import UsersAnalytics from "../../components/Admin/Analytics/UsersAnalytics";
import DashboardHeader from "@/app/components/Admin/DashboardHeader";
import AdminProtected from "@/app/hooks/adminProtected";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="users analytics"
          description="View analytics for all users"
          keywords="course, analytics, admin, dashboard, view, all, courses"
        />
        <div className="flex h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar selectedItem="Courses Analytics" />
          </div>
          <div className="w-[85%]">
            <DashboardHeader />
            <UsersAnalytics />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
