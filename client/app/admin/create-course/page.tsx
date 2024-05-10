'use client'
import React from 'react'
import AdminSidebar from '../../components/Admin/sidebar/AdminSidebar'
import Heading from '../../utils/Heading'
import CreateCourse from '../../components/Admin/Course/CreateCourse'
import DashboardHeader from '../../../app/components/Admin/DashboardHeader'

type Props = {}

function page({}: Props) {
  return (
    <div className=''>
      <Heading 
        title='9rayti - Create Course'
        description='Create a new course'
        keywords='9rayti, create course, course'
      />
      <div className='flex'>
        <div className='1500px:w-[16%] w-1/5'>
          <AdminSidebar selectedItem={"Create Course"} />
        </div>
        <div className='w-[85%]'>
          <DashboardHeader />
          <CreateCourse />
        </div>
      </div>
    </div>
  )
}

export default page