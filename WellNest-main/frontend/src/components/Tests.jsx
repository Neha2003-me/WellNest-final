import React from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import test_bg from '/test_bg.jpg'
import { useAuth0 } from '@auth0/auth0-react';

const Tests = () => {
  const { user } = useAuth0();
  const depressionUrl = `https://depressiontest.streamlit.app/?email=${user.email}`;
  const anxietyUrl = `https://anxietytest.streamlit.app/?email=${user.email}`;
  const ocdUrl = `https://ocdtest.streamlit.app/?email=${user.email}`;

  // Animation variants for the heading
  const headingVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // Animation variants for the buttons
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    
    <div className="flex flex-col sm:flex-row items-center justify-center sm:min-h-screen  font-sans text-center sm:py-16 px-4 mt-16 sm:mt-0">
      {/* Heading with Framer Motion */}
      <div className="">
        <img src={test_bg} alt="" className="w-[40vw]" />
      </div>
      <div>
      <motion.h1
        className="text-4xl md:text-5xl font-semibold mb-8 text-gray-800"
        variants={headingVariants}
        initial="hidden"
        animate="visible"
      >
        Your Mental Health Matters
      </motion.h1>

      {/* Buttons Container */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Depression Test Button */}
        <motion.a
          href={depressionUrl}
          className="text-center bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg transform transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <span>Depression Test</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </motion.a>

        {/* Anxiety Test Button */}
        <motion.a
          href={anxietyUrl}
          className="text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transform transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <span>Anxiety Test</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.a>

        {/* OCD Test Button */}
        <motion.a
          href={ocdUrl}
          className="text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transform transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <span>OCD Test</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </motion.a>
      </div>
      </div>
    </div>
  );
};

export default Tests;