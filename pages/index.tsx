"use client";
import { NextPage } from "next";
import Navbar from "../components/HomePage/Navbar";
import HomeFeature from "../components/HomePage/HomeFeature";
import GridFeature from "../components/HomePage/GridFeature";
import GetStarted from "../components/HomePage/GetStarted";
import Footer from "../components/HomePage/Footer";
import { motion } from "framer-motion";
import {
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
} from "../context/motionpresets";
const Homepage: NextPage = () => {
  return (
    <>
      {" "}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideDown}
      >
        <Navbar />
      </motion.div>
      <HomeFeature />
      <GridFeature />
      <GetStarted />
      <Footer />
    </>
  );
};

export default Homepage;
