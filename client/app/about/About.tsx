import React from 'react'
import { styles } from '../styles/style'

type Props = {}

const About = (props: Props) => {
  return (
    <div className='dark:text-[#edfff4] text-[#0F172A]'>
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`} >
        What is <span className='text-gradient'>9rayti</span>
      </h1>
      <div className='w-[95%] 800px:w-[85%] m-auto mb-[80px]'>
        <p className='text-[18px] font-Poppins'>
          I want to thank me for believing in me, I want to thank me for doing all this hard work. I wanna thank me for having no days off. I wanna thank me for never quitting. I wanna thank me for always being a giver and trying to give more than I receive. I wanna thank me for trying to do more right than wrong. I wanna thank me for being me at all times.
        </p>
        <span className='text-[22px]'>adib chiguer</span>
      </div>
    </div>
  )
}

export default About