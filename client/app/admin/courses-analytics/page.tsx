"use client";
import React from "react";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";
import Heading from "@/app/utils/Heading";
import CourseAnalytics from "../../components/Admin/Analytics/CourseAnalytics";
import DashboardHeader from "@/app/components/Admin/DashboardHeader";
import AdminProtected from "@/app/hooks/adminProtected";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="course analytics"
          description="View analytics for all courses"
          keywords="course, analytics, admin, dashboard, view, all, courses"
        />
        <div className="flex h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar selectedItem="Courses Analytics" />
          </div>
          <div className="w-[85%]">
            <DashboardHeader />
            <CourseAnalytics />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
