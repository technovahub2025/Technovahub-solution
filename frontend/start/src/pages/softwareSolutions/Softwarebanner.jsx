import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import banner1 from "../../assets/images/b2.jpg";
import banner2 from "../../assets/images/train.jpg";
import banner3 from "../../assets/images/newimg.jpeg";
import banner4 from "../../assets/images/4.jpg";
import Agile from "../../assets/agile2.jpg";
import Title from "../../Components/Title";

const Softwarebanner = () => {
  const images = [banner1, banner2, banner3, banner4];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative h-[60vh] md:h-[80vh] overflow-hidden font-poppins bg-[#f7f7f7]">
      <div className="container mx-auto px-6 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-center gap-10">
          {/* LEFT CONTENT */}
          <div className="space-y-5">
            <div className="flex flex-col items-start justify-start text-left">
              <h1
                className="
    text-2xl md:text-4xl font-extrabold
      bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400
      text-transparent bg-clip-text
      mb-6 drop-shadow-md
      leading-tight
    "
              >
                Our Services
              </h1>
            </div>

          <h3 className="text-lg md:text-xl font-medium text-blue-600">
  Delivering Business and Digital Transformation
</h3>

            <p className="text-gray-600 leading-relaxed max-w-xl">
              We uses state-of-the-art technologies to translate customer ideas
              into reality and create powerful solutions.
            </p>

            <p className="text-gray-600 leading-relaxed max-w-xl">
              If you are looking for a true professional company then you are at
              the right place for your solution. We have a complete team of
              designers & developers to give a perfect blend of interactivity &
              creativity.
            </p>

            <button
              className="
  mt-4 inline-block
  bg-gradient-to-r
  from-blue-500 via-blue-600 to-blue-700
  hover:from-blue-600 hover:via-blue-700 hover:to-blue-800
  text-white font-semibold
  px-6 py-3 rounded-md
  transition-all duration-300
  shadow-md hover:shadow-lg
"
            >
              DISCUSS YOUR PROJECT
            </button>
          </div>

          {/* RIGHT IMAGE / GRAPHIC */}
          <div className="relative hidden lg:flex justify-center items-center">
            <img
              src={Agile}
              alt="Agile Development Process"
              className="
      w-[650px]
      xl:w-[750px]
      2xl:w-[850px]
      object-contain
    "
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Softwarebanner;
