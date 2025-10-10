import React from 'react'
import scoreimg from '/score.png'
import { useAuth0 } from '@auth0/auth0-react';

export default function Score() {
  const { user } = useAuth0();
  const wellnessUrl = `https://wellnesscalculator.streamlit.app/?email=${user.email}`
  return (
    <div className='mt-16 mx-4 p-4 sm:mx-32 flex flex-col sm:flex-row sm:px-32 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-2xl rounded-xl'>
        <div className='flex flex-col justify-center items-center sm:w-1/2'>
        <h1 className='text-4xl  sm:text-6xl font-semibold'>WELLNESS SCORE</h1>
    <h4 className='text-gray-500 text-md mt-4 text-center'> Get insights on sleep, fitness, nutrition, and stress to improve your lifestyle today.</h4>
   <a href={wellnessUrl} className='text-xl sm:text-4xl p-4 w-1/2 rounded-md bg-[#29b5f6] mt-8 sm:mt-16 text-center hover:bg-blue-800'>Click here</a>
        </div>
        <div className='flex justify-center items-center sm:w-1/2'>
        <img src={scoreimg} className='mt-8 sm:mt-0w-[200px] h-[200px] sm:w-[350px] sm:h-[350px]' alt="" />
        </div>
        </div>
       
   
  )
}
