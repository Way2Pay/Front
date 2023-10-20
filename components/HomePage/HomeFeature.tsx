import React from "react";
import { motion } from "framer-motion";
import {
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
} from "../../context/motionpresets";
const HomeFeature: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-col justify-center flex-1 px-8 py-8 md:px-12 lg:flex-none lg:px-24">
        <div className="w-full mx-auto lg:max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-xl mx-auto text-center lg:p-10 lg:text-left">
              <div>
                <p className="text-2xl font-medium tracking-tight text-black sm:text-4xl">
                  I am a short heading
                </p>
                <p className="max-w-xl mt-4 text-base tracking-tight text-gray-600">
                  Use this paragraph to share information about your company or
                  products. Make it engaging and interesting, and showcase your
                  brand&apos;s personality. Thanks for visiting our website!
                </p>
              </div>
              <div className="flex flex-col items-center justify-center max-w-lg gap-3 mx-auto mt-10 lg:flex-row lg:justify-start">
                <a
                  href="#"
                  className="items-center justify-center w-full px-6 py-2.5  text-center text-white duration-200 bg-black border-2 border-black rounded-full inline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none lg:w-auto focus-visible:outline-black text-sm focus-visible:ring-black"
                >
                  Button
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center text-sm font-semibold text-black duration-200 hover:text-blue-500 focus:outline-none focus-visible:outline-gray-600"
                >
                  Learn more &nbsp; →
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative flex-1 hidden w-0 lg:block">
        <div>
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideLeft}
          >
            <img
              className="absolute inset-0  w-full  lg:border-l"
              src="hero.png"
              alt=""
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomeFeature;
