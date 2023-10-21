import React from "react";
import { motion } from "framer-motion";
import {
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
} from "../../context/motionpresets";
const GridFeature: React.FC = () => {
  return (
    <div>
      <section className="flex items-center w-full ">
        <div className="relative items-center w-full px-5 py-12 mx-auto md:px-12 lg:px-20 max-w-7xl">
          <div className=" text-4xl font-bold  text-center text-gray-600">
            How It Works{" "}
          </div>
          <div className="grid grid-cols-2 gap-6 py-12 md:grid-cols-3">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideRight}
            >
              <figure>
                <img
                  className="w-full  "
                  src="step1.png"
                  alt=""
                  width="1310"
                  height="873"
                />

                <p className="mt-5 text-lg font-medium leading-6 text-black">
                  Step 1
                </p>
                <p className="mt-3 text-base text-gray-500">
                  Connect your wallet
                </p>
              </figure>
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideUp}
            >
              <figure>
                <img
                  className="w-full  "
                  src="step2.png"
                  alt=""
                  width="1310"
                  height="873"
                />

                <p className="mt-5 text-lg font-medium leading-6 text-black">
                  Step 2
                </p>
                <p className="mt-3 text-base text-gray-500">
                  Choose the chain you want to deploy on
                </p>
              </figure>
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideLeft}
            >
              <figure>
                <img
                  className="w-full"
                  src="step3.png"
                  alt=""
                  width="1310"
                  height="873"
                />

                <p className="mt-5 text-lg font-medium leading-6 text-black">
                  Step 3
                </p>
                <p className="mt-3 text-base text-gray-500">
                  Choose the coin you want to recieve payments in
                </p>
              </figure>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GridFeature;
