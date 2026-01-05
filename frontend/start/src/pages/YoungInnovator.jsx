import React from "react";
import adsImg2 from "../assets/young-innovator.jpeg";

const YoungInnovator = () => {
    return (
        <section className="min-h-screen bg-gray-50 pt-32 pb-20 px-4 flex flex-col items-center">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="grid md:grid-cols-2 gap-0">

                    {/* Image Side */}
                    <div className="bg-gray-100 flex items-center justify-center p-6">
                        <img
                            src={adsImg2}
                            alt="Young Innovator"
                            className="w-full h-auto object-contain rounded-xl shadow-sm hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Content Side */}
                    <div className="p-10 flex flex-col justify-center space-y-6">
                        <div>
                            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold tracking-wide mb-4">
                                Upcoming Event
                            </span>
                            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                                Young Innovator
                            </h1>
                            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                                Empowering the next generation of creative minds. Join us to explore, create, and innovate with cutting-edge technology.
                            </p>
                        </div>

                        <div className="pt-4">
                            <a
                                href="https://young-innovator.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-full shadow-md hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Visit Website
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default YoungInnovator;
