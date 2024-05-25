import React from 'react'
import { styles } from '../styles/style'

type Props = {}

const Policy = (props: Props) => {
  return (
    <div>
      <div className='w-[95%] 800px:w-[92%] m-auto py-2 dark:text-[#edfff4] text-[#0F172A]'>
        <h1 className={`${styles.title} !text-center pt-2`}>
          Policy
        </h1>
        <ul style={{ listStyle: "unset" , marginLeft: "15px"}}>
          <p className='py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line'>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae, dolorum. Sed laboriosam nostrum recusandae illum explicabo unde possimus facere, quam itaque id molestiae nulla magnam numquam dignissimos labore cum perspiciatis.
          </p>
          <br />
          <p className='py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line'>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae, dolorum. Sed laboriosam nostrum recusandae illum explicabo unde possimus facere, quam itaque id molestiae nulla magnam numquam dignissimos labore cum perspiciatis.
          </p>
          <br />
        </ul>
      </div>
    </div>
  )
}

export default Policy