import { motion } from "framer-motion";
import aboutImg from "../../assets/about.png";
import CompanyProfile from "../../assets/TechnovaHub-profile.pdf";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const AboutUs = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden">

      {/* Background Image Animation */}
      <motion.img
        src={aboutImg}
        alt="Technovahub Technology"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/85 to-blue-700/80"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-white"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="max-w-3xl">

          <motion.h1
            variants={item}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"
          >
            BUILDING SMARTER <br />
            <span className="text-blue-300">CONNECTIONS</span>
          </motion.h1>

          <motion.h2
            variants={item}
            className="mt-4 text-lg sm:text-xl font-semibold tracking-wide text-blue-100"
          >
            BETWEEN PEOPLE AND TECHNOLOGY
          </motion.h2>

          <motion.p
            variants={item}
            className="mt-6 text-blue-100 text-base sm:text-lg leading-relaxed"
          >
            At <span className="font-semibold text-white">Technovahub</span>, we deliver intelligent IT services,
            AI-driven solutions, and digital transformation strategies that help
            businesses innovate, scale, and stay future-ready.
          </motion.p>

          <motion.p
            variants={item}
            className="mt-4 text-blue-100 text-base sm:text-lg leading-relaxed"
          >
            By combining advanced technology with a people-first mindset, we
            enable smarter decisions and sustainable growth.
          </motion.p>

          {/* Services */}
          <motion.ul
            className="mt-8 space-y-4 text-base sm:text-lg"
            variants={container}
          >
            {[
              "IT Services & Consulting",
              "AI & Intelligent Automation",
              "Digital Transformation Solutions",
            ].map((service, index) => (
              <motion.li
                key={index}
                variants={item}
                className="flex items-center gap-3"
              >
                <span className="text-blue-300 text-xl">✔</span>
                {service}
              </motion.li>
            ))}
          </motion.ul>

          {/* Brand */}
          <motion.div variants={item} className="mt-10">
            <h3 className="text-2xl font-bold tracking-wide">
              TECHNOVAHUB
            </h3>
            <p className="text-blue-200 mt-1">
              Advancing People and Technology Together
            </p>
          </motion.div>

          {/* Download Button */}
          <motion.a
            href={CompanyProfile}
            download
            variants={item}
            className="inline-flex items-center gap-3 mt-10 px-8 py-3
                       bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-500
                       text-white font-semibold rounded-full
                       shadow-lg hover:shadow-2xl
                       hover:scale-105 transition-transform duration-300"
          >
            Download Company Profile
          </motion.a>

        </div>
      </motion.div>

    </section>
  );
};

export default AboutUs;
