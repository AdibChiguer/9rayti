import { styles } from '@/app/styles/style'
import Image from 'next/image'
import { comment } from 'postcss'
import React from 'react'
import ReviewCard from "../Review/ReviewCard"

type Props = {}

export const reviews = [
  {
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    profession: 'Web Developer',
    comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.'
  },
  {
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    profession: 'Web Developer',
    comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.'
  },
  {
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    profession: 'Web Developer',
    comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.'
  },
  {
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    profession: 'Web Developer',
    comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.'
  },
  {
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    profession: 'Web Developer',
    comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.'
  },
  {
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    profession: 'Web Developer',
    comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.'
  },
  {
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    profession: 'Web Developer',
    comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.'
  },
  {
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    profession: 'Web Developer',
    comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.'
  },
]

const Reviews = (props: Props) => {
  return (
    <div className='w-[90%] 800px:w-[85%] m-auto'>
      <div className='w-full 800px:flex items-centerbg-red-500 mb-8 max-w-800px md:flex-col'>
        <div className='800px:w-[50%] w-full'>
          <Image 
            src={require('../../../public/assets/business-img.webp')}
            alt='business'
            width={700}
            height={700}
          />
        </div>
        <div className='800px:w-[50%] w-full'>
          <h3 className={`${styles.title} 800px:!text-[40px] !text-left !mb-4`}>
            Our Students Are <span className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text font-bold'>Our Strengh</span>{" "}
            <br /> See What They Say About Us
          </h3>
          <p className={styles.label}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quod.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quod.
          </p>
        </div>
        <br />
        <br />
      </div>
      <div className='grid md:grid-cols-1 gap-[25px] grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-0 [&>*:nth-child(3)]:!mt-[40px] md:[&>*:nth-child(3)]:!mt-[unset]'>
        {
          reviews && reviews.map((review, index) => <ReviewCard item={review} key={index}/>)
        }
      </div>
    </div>
  )
}

export default Reviews