'use client'
import React from 'react'
import DashboardHero from '@/app/components/Admin/DashboardHero'
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar'
import EditHero from '../../components/Admin/Customization/EditHero'


type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading 
          title="Hero" 
          description='Edit the hero section of the website'
          keywords='hero, edit, customization'
        />
        <div className='flex h-screen'>
          <div className='1500px:w-[16%] w-1/5'>
            <AdminSidebar selectedItem='hero'/>
          </div>
          <div className='w-[85%]'>
            <DashboardHero />
            <EditHero />
          </div>
        </div>
      </AdminProtected>
    </div>
  )
}

export default page