'use client';
import React from 'react'
import DashboardHero from '@/app/components/Admin/DashboardHero';
import AdminProtected from '@/app/hooks/adminProtected';
import Heading from '@/app/utils/Heading';
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import EditCategories from "../../components/Admin/Customization/EditCategories"


type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading 
          title='Edit FAQ'
          description='Edit FAQ'
          keywords='Edit FAQ'
        />
        <div className='flex h-screen'>
          <div className='1500px:w-[16%] w-1/5'>
            <AdminSidebar selectedItem='Categories'/>
          </div>
          <div className='w-[85%]'>
            <DashboardHero />
            <EditCategories />
          </div>
        </div>
      </AdminProtected>
    </div>
  )
}

export default page