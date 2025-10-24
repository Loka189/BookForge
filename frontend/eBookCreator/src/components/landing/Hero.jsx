import React from "react";
import { ArrowRight, Sparkles, BookOpen, Zap, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative bg-gradient-to-br from-violet-50 via-white to-purple-50 overflow-hidden">
      {/* Floating background blobs */}
      <div
        className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-violet-300/40 to-violet-200/20 rounded-full blur-3xl animate-float"
        style={{ animationDuration: '8s' }}
      ></div>
      <div
        className="absolute top-40 right-20 w-48 h-48 bg-purple-300/30 rounded-full blur-2xl animate-float"
        style={{ animationDuration: '10s', animationDelay: '300ms' }}
      ></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-purple-200/30 to-violet-200/20 rounded-full blur-3xl animate-float"
        style={{ animationDuration: '12s', animationDelay: '700ms' }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-72 h-72 bg-violet-100/40 rounded-full blur-3xl animate-float"
        style={{ animationDuration: '14s', transform: 'translateY(33%)', animationDelay: '1000ms' }}
      ></div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(139, 92, 246, 0.125) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.125) 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="max-w-xl space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-violet-200/50 shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 transition-all duration-300 hover:scale-105 group z-10">
              <div className="relative">
                <Sparkles className="h-4 w-4 text-violet-600 group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-violet-400 blur-md opacity-30 group-hover:opacity-50 transition-opacity rounded-full"></div>
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Publishing
              </span>
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-gray-700">New</span>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight relative">
              Create Stunning{" "}
              <span className="relative inline-block mt-2">
                <span className="relative z-10 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  eBooks in Minutes
                </span>
                {/* Correctly aligned underline */}
                <svg
                  className="absolute -bottom-1 left-0 w-full h-1 text-violet-400/40"
                  viewBox="0 0 300 4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 2C50 0 100 0 150 1C200 2 250 2 300 1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
              From idea to publication, our AI-driven platform simplifies every
              step of eBook creation. No design skills required.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="group relative inline-flex items-center px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-500 to-purple-500 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Creating for Free
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>

                {/* Shimmer only on hover */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"></div>
                </div>

                <style dangerouslySetInnerHTML={{
                  __html: `
      @keyframes shimmer {
        0% { transform: translateX(-100%) skewX(-12deg); }
        100% { transform: translateX(100%) skewX(-12deg); }
      }
      .shimmer {
        animation: shimmer 1.5s linear infinite;
      }
    `
                }} />
              </a>




              <a
                href="#demo"
                className="group inline-flex items-center space-x-2 text-gray-700 hover:text-violet-600 font-semibold transition-all duration-200 px-4 py-2 rounded-xl hover:bg-violet-50/50"
              >
                <span>Watch Demo</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 text-violet-600">→</span>
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 lg:gap-8 pt-6">
              <div className="group cursor-default">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-violet-600" />
                  <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    50K+
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-500">Books Created</div>
              </div>
              <div className="w-px h-14 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
              <div className="group cursor-default">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    4.8/5
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-500">User Rating</div>
              </div>
              <div className="w-px h-14 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
              <div className="group cursor-default">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-violet-600" />
                  <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    10min
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-500">Avg. Time</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:pl-8">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl opacity-20 blur-3xl animate-float" style={{ animationDuration: '12s' }}></div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-violet-500/20 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-2xl"></div>

              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-500 z-10">
                <div className="relative">
                  <img
                    className="w-full h-auto object-cover"
                    src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
                    alt="eBook Creation Platform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>

                {/* Floating cards */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-violet-100/50 hover:scale-105 transition-transform z-20">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-violet-400 blur-md opacity-40 rounded-xl"></div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-violet-600 uppercase tracking-wide">Processing...</div>
                      <div className="text-sm font-bold text-gray-900">AI Generation</div>
                      <div className="mt-1 w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                          style={{ animation: 'progress 2s ease-in-out infinite alternate' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-emerald-100/50 hover:scale-105 transition-transform z-20">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Completed</div>
                      <div className="text-sm font-bold text-gray-900">247 Pages</div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-gray-500">Ready to publish</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      .animate-float { animation: float 6s ease-in-out infinite; }

      @keyframes progress {
        0% { width: 0%; }
        100% { width: 100%; }
      }

      .shimmer {
        transform: skewX(-12deg) translateX(-100%);
        transition: transform 1s ease-in-out;
      }
      .group:hover .shimmer {
        transform: skewX(-12deg) translateX(100%);
      }
    `
      }} />
    </div>


  );
};

export default Hero;
