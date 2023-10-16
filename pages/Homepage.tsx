"use client";
import { NextPage } from "next";
import Navbar from "../components/HomePage/Navbar";
import HomeFeature from "../components/HomePage/HomeFeature";
import GridFeature from "../components/HomePage/GridFeature";
import GetStarted from "../components/HomePage/GetStarted";
import Footer from "../components/HomePage/Footer";

const Homepage: NextPage = () => {
  return (
    <>
      <Navbar />
      <HomeFeature />
      <GridFeature />
      <GetStarted />
      <Footer />
    </>
  );
};

export default Homepage;
