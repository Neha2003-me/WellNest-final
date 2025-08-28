import React from 'react';
import chatbot from '/chatbot.jpg'; // Ensure the path to your image is correct

export default function Chatbot() {
  return (
    <div className='flex flex-col justify-center items-center mt-16 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-2xl rounded-2xl p-12 mx-4 sm:mx-32'>
      {/* Heading */}
      <h1 className='text-4xl md:text-5xl font-semibold text-gray-800 mb-8 text-center'>
        Your Mental Wellness Companion
      </h1>

      {/* Chatbot Image and Button Container */}
      <div className='w-full flex flex-col md:flex-row items-center justify-center gap-8'>
        {/* Start Chatting Button */}
       <a href="https://wellnest-chat-bot.onrender.com/"><button className='bg-[#29b5f6] hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg'>
          Start Chatting
        </button></a> 

        {/* Chatbot Image */}
        <img src={chatbot} alt="Chatbot" className='w-[150px] md:w-[200px] rounded-full shadow-lg' />
      </div>
    </div>
  );
}