import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
} from "../../context/motionpresets";
const HomeFeature: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-white mt-5">
      <div className="flex flex-col justify-center flex-1 px-8 py-8 md:px-12 lg:flex-none lg:px-24">
        <div className="w-full mx-auto lg:max-w-6xl">
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideRight}
          >
            <div className="max-w-xl mx-auto text-center lg:p-10 lg:text-left">
              <div>
                <p className="text-2xl font-medium tracking-tight text-black sm:text-4xl">
                  Add Crypto as a way to pay.
                </p>
                <p className="max-w-xl mt-4 text-base tracking-tight text-gray-600">
                  Seamlessly accept crypto payments for your business.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center max-w-lg gap-3 mx-auto mt-10 lg:flex-row lg:justify-start">
                <Link href={"/login"}>
                  <button className="bg-gray-600 px-5 p-2 rounded-xl mt-10">
                    Get Started Today
                  </button>
                </Link>{" "}
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
            <img className="fit p-8 inset-0  w-full  " src="hero.png" alt="" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomeFeature;
