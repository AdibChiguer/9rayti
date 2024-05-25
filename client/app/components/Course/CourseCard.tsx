import Ratings from '@/app/utils/Ratings'
import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'
import { AiOutlineUnorderedList } from 'react-icons/ai'

type Props = {
  item: any,
  isProfile?: boolean
}

const CourseCard:FC<Props> = ({item , isProfile}) => {

  return (
    <Link href={!isProfile ? `/course/${item._id}` : `course-acess/${item._id}`}>
      <div className='w-full min-h-[35vh] dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-[bg-slate-700] rounded-lg p-3 shadow-sm dark:shadow-inner md:mb-4'>
        <Image src={item.thumbnail.url} alt="" width={300} height={300} objectFit='cover' className='rounded w-full' />
        <br />
        <h1 className='font-Poppins text-[16px] text-[#0F172A] dark:text-white'>
          {item.name}
        </h1>

        <div className='w-full flex items-center justify-between pt-2 md:flex-col md:items-start md:gap-2'>
          <Ratings rating={item.ratings}/>
          <h5 className={`text-[#0F172A] dark:text-[#fff] ${ isProfile && "hidden 800px:inline" }`}>
            {item.purchased} Students
          </h5>
        </div>

        <div className='w-full flex items-center justify-between pt-3'>
          <div className='flex'>
            <h3 className='text-[#0F172A] dark:text-white'>
              {item.price === 0 ? "Free" : `$${item.price}`}
            </h3>
            <h5 className='pl-3 text-[14px] line-through opacity-80 text-[#0F172A] dark:text-white'>
              ${item.estimatedPrice}
            </h5>
          </div>
          <div className='flex items-center pb-3 dark:text-white text-[#0F172A]'>
            <AiOutlineUnorderedList size={20}  className='dark:text-white text-[#0F172A]' />
            <h5>
              {item.courseData?.length} Lectures
            </h5>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CourseCard