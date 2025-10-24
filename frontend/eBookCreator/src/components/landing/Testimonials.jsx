import React from "react";
import { TESTIMONIALS } from "../../utils/data";
import { Star, Quote, Users, BookOpen, ThumbsUp } from "lucide-react";

const Testimonials = () => {
    return (
        <section
            id="testimonials"
            className="relative py-24 lg:py-32 bg-gradient-to-b from-white via-violet-50/30 to-white overflow-hidden"
        >
            {/* Animated background elements */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-violet-300/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-6">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-100 to-purple-100 px-5 py-2.5 rounded-full border border-violet-200 shadow-sm hover:shadow-md transition-all duration-300">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-pulse" />
                        <span className="text-sm font-bold text-violet-900 tracking-wide">
                            TESTIMONIALS
                        </span>
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-pulse" />
                    </div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                        Loved by Creators{" "}
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Everywhere
                            </span>
                            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                                <path d="M1 5.5C50 1.5 150 1.5 199 5.5" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#8B5CF6" />
                                        <stop offset="100%" stopColor="#EC4899" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </span>
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of satisfied creators who have transformed their ideas into
                        stunning eBooks with our powerful platform.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="relative mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((testimonial, index) => (
                            <div
                                key={index}
                                className="group relative bg-white p-8 rounded-3xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-violet-300 transition-all duration-500 hover:-translate-y-2"
                            >
                                {/* Quote Icon floating outside top-left with tilt and irregular rounding */}
                                <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-300/50 -rotate-6">
                                    <Quote className="w-5 h-5 text-white" />
                                </div>


                                {/* Star rating */}
                                <div className="flex mb-4 space-x-1">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-5 h-5 text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform duration-300"
                                            style={{ transitionDelay: `${i * 50}ms` }}
                                        />
                                    ))}
                                </div>

                                {/* Quote text */}
                                <p className="relative text-gray-700 text-base mb-8 leading-relaxed font-medium">
                                    "{testimonial.quote}"
                                </p>

                                {/* Author info */}
                                <div className="relative flex items-center space-x-4 pt-6 border-t border-gray-100">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
                                        <img
                                            src={testimonial.avatar}
                                            alt={testimonial.author}
                                            className="relative w-14 h-14 rounded-full border-3 border-white shadow-lg object-cover ring-2 ring-violet-300 group-hover:ring-4 group-hover:ring-violet-400 transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-base group-hover:text-violet-700 transition-colors duration-300">
                                            {testimonial.author}
                                        </p>
                                        <p className="text-sm text-gray-500 font-medium">{testimonial.title}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>



                {/* Enhanced Stats Section with animations */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-24">
                    {/* Stat Card 1 */}
                    <div className="group relative flex flex-col items-center justify-center text-center bg-white border-2 border-violet-200 rounded-3xl p-10 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-500 opacity-0 group-hover:opacity-10 transition duration-500"></div>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-300/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative bg-gradient-to-br from-violet-100 to-purple-100 w-20 h-20 rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                            <Users className="w-11 h-11 text-violet-600 group-hover:scale-110 transition-transform duration-300" />
                        </div>

                        <div className="relative text-5xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                            50K+
                        </div>
                        <div className="relative text-gray-700 mt-3 font-bold text-base tracking-wide">
                            Happy Creators
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="group relative flex flex-col items-center justify-center text-center bg-white border-2 border-violet-200 rounded-3xl p-10 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition duration-500"></div>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 w-20 h-20 rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                            <ThumbsUp className="w-11 h-11 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                        </div>

                        <div className="relative text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                            4.8/5
                        </div>
                        <div className="relative text-gray-700 mt-3 font-bold text-base tracking-wide">
                            Average Rating
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="group relative flex flex-col items-center justify-center text-center bg-white border-2 border-violet-200 rounded-3xl p-10 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-violet-500 opacity-0 group-hover:opacity-10 transition duration-500"></div>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative bg-gradient-to-br from-pink-100 to-violet-100 w-20 h-20 rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                            <BookOpen className="w-11 h-11 text-pink-600 group-hover:scale-110 transition-transform duration-300" />
                        </div>

                        <div className="relative text-5xl font-black bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                            100K+
                        </div>
                        <div className="relative text-gray-700 mt-3 font-bold text-base tracking-wide">
                            eBooks Created
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
