import React from "react";
import { motion } from "framer-motion";
import adsImg from "../assets/images/newads.jpg";
import adsImg2 from "../assets/young-innovator.jpeg";
import { Link } from "react-router-dom";

const MotionLink = motion.create(Link); // ✅ wrap Link for animation

const Homeseven = () => {
  return (
   <section className="relative flex flex-col items-center max-w-7xl mx-auto justify-center min-h-screen overflow-hidden px-4">

  {/* Decorative gradient glow */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-200/40 via-purple-200/40 to-pink-200/40 blur-3xl -z-10" />

  {/* Animated image container */}
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    className="max-w-6xl w-full text-center"
  >

    {/* Images Row */}
    <div className="mx-auto px-6 flex flex-row flex-wrap gap-10 justify-center">

      {/* POSTER 1 */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl 
                      w-full sm:w-[80%] md:w-[45%] lg:w-[42%]">

        <img
          src={adsImg}
          alt="Advertisement"
          className="w-full h-auto object-contain"
        />

        {/* Button */}
        <motion.a
           href="https://7days-ai-innovation-landingpage.vercel.app/"
  target="_blank"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            absolute bottom-6 left-1/2 -translate-x-1/2
            bg-gradient-to-r from-blue-600 to-purple-600
            text-white font-semibold px-6 py-2 rounded-full
            shadow-lg transition-all duration-300
          "
        >
          View Website
        </motion.a>
      </div>

      {/* POSTER 2 */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl 
                      w-full sm:w-[80%] md:w-[45%] lg:w-[42%]">

        <img
          src={adsImg2}
          alt="Advertisement"
          className="w-full h-auto object-contain"
        />

        {/* Button */}
        <motion.a
           href="https://young-innovator.vercel.app/"
           target="_blank"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            absolute bottom-6 left-1/2 -translate-x-1/2
            bg-gradient-to-r from-indigo-600 to-cyan-600
            text-white font-semibold px-6 py-2 rounded-full
            shadow-lg transition-all duration-300
          "
        >
          View Website
        </motion.a>
      </div>

    </div>
     <MotionLink
            to="/7Days-AI-innovation/welcome" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Enroll now
          </MotionLink>

  </motion.div>
</section>
  );
};

export default Homeseven;
