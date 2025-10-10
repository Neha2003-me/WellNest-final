"use client";
import React from "react";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";

const variants = {
  initial: {
    y: -200,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.1,
    },
  },
};

const Home = () => {
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();

  return (
    <div className="slide-container bg-center">
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: "url(/hero.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="h-[47vh] sm:h-[90vh]"
      >
        <div className="w-full h-full p-16 sm:p-0 sm:bg-[url(/hero.jpg)] sm:bg-cover sm:bg-center sm:bg-no-repeat flex items-center justify-center">
          <div className="flex flex-col justify-start items-center h-full w-full">
            <motion.div
              className="flex text-black items-center justify-center md:pt-36"
              variants={variants}
              initial="initial"
              whileInView="animate"
            >
              <div className="flex flex-col items-center justify-center text-center">
                {/* Heading */}
                <motion.h3
                  className="text-xl sm:text-3xl lg:text-4xl font-medium"
                  variants={variants}
                >
                  WELCOME TO WELLNEST
                </motion.h3>

                {/* Subheading */}
                <motion.h2
                  className="text-4xl sm:text-5xl lg:text-7xl font-semibold my-6 sm:my-10"
                  variants={variants}
                >
                  FIND YOUR INNER PEACE
                </motion.h2>

                {/* Description */}
                <motion.p
                  className="px-4 sm:px-12 md:px-0 md:w-3/5 text-sm sm:text-lg lg:text-xl mb-4 sm:mb-10"
                  variants={variants}
                >
                  Your safe space for mental well-being. Discover mindfulness,
                  balance, and self-care on your journey to a healthier mind!
                </motion.p>

                {/* Conditional Button or Greeting */}
                {isAuthenticated ? (
                  <motion.p
                    className="bg-[#29b5f6] text-white px-4 py-2 rounded-md sm:w-40 text-center"
                    variants={variants}
                  >
                    Hello, {user?.name.split(" ")[0]}
                  </motion.p>
                ) : (
                  <motion.button
                    className="bg-[#29b5f6] hover:bg-[#29b5f686] hover:scale-[1.02] sm:w-40 p-2 py-1 sm:py-2 mt-5 rounded-md text-sm sm:text-base"
                    variants={variants}
                    onClick={() => loginWithRedirect()}
                  >
                    Get Started
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;