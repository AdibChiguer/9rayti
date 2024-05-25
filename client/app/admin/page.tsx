'use client'
import React from 'react'
import Heading from '../utils/Heading'
import AdminSidebar from '../components/Admin/sidebar/AdminSidebar'
import AdminProtected from '../hooks/adminProtected'
import DashboardHero from '../components/Admin/DashboardHero'

type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title='9rayti - Admin'
          description='9rayti is a platform for students to learn and get help from teachers'
          keywords='Programming , Education , Learning , School , University , College , High School , Middle School , Elementary School , Teacher , Student , Classroom , Online Learning , Online School , Online University , Online College , Online High School , Online Middle School , Online Elementary School , Online Teacher , Online Student , Online Classroom , Online Education , Online Programming , Online Learning Platform , Online School Platform , Online University Platform , Online College Platform , Online High School Platform , Online Middle School Platform , Online Elementary School Platform , Online Teacher Platform , Online Student Platform , Online Classroom Platform , Online Education Platform , Online Programming Platform , Online Learning Platform for Students , Online School Platform for Students , Online University Platform for Students , Online College Platform for Students , Online High School Platform for Students , Online Middle School Platform for Students , Online Elementary School Platform for Students , Online Teacher Platform for Students , Online Student Platform for Students , Online Classroom Platform for Students , Online Education Platform for Students , Online Programming Platform for Students , Online Learning Platform for Teachers , Online School Platform for Teachers , Online University Platform for Teachers , Online College Platform for Teachers , Online High School Platform for Teachers , Online Middle School Platform for Teachers , Online Elementary School Platform for Teachers , Online Teacher Platform for Teachers , Online Student Platform for Teachers , Online Classroom Platform for Teachers , Online Education Platform for Teachers , Online Programming Platform for Teachers'
        />
        <div className='flex'>
          <div className='1500px:w-[16%] w-1/5'>
            <AdminSidebar selectedItem={"Dashboard"} />
          </div>
          <div className='w-[85%] mb-4'>
            <DashboardHero isDashboard={true} />
          </div>
        </div>
      </AdminProtected>
    </div>
  )
}

export default page