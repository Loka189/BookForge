import React from "react";
import { BookOpen, Twitter, Linkedin, Github, ArrowUp, Heart } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black text-gray-300 py-20 overflow-hidden">
      {/* Enhanced Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-purple-700/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-purple-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section - Enhanced */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/60 blur-2xl rounded-xl transition-all duration-500 animate-pulse"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-violet-500/50 transition-all duration-300 shadow-lg shadow-violet-500/30">
                  <BookOpen className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-violet-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300">
                eBookCreator
              </span>
            </div>
            <p className="mt-6 text-gray-400 leading-relaxed text-sm">
              Empowering authors with AI-driven tools to create, design, and
              publish stunning eBooks effortlessly.
            </p>

            {/* Enhanced Social Media */}
            <div className="flex space-x-4 mt-8">
              {[
                { icon: Twitter, link: "https://twitter.com/yourprofile" },
                { icon: Linkedin, link: "https://linkedin.com/in/yourprofile" },
                { icon: Github, link: "https://github.com/yourprofile" },
              ].map(({ icon: Icon, link }, i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group"
                >
                  <div className="absolute -inset-3 bg-violet-600/0 group-hover:bg-violet-600/50 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="relative w-11 h-11 bg-gray-900 border-2 border-gray-800 rounded-xl flex items-center justify-center group-hover:border-violet-500 group-hover:bg-gradient-to-br group-hover:from-violet-600/20 group-hover:to-purple-600/20 transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-110 shadow-lg group-hover:shadow-violet-500/50">
                    <Icon className="w-5 h-5 text-gray-500 group-hover:text-violet-300 transition-colors duration-300 group-hover:scale-110" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Product Links - Enhanced */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block group">
              Product
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full group-hover:w-full transition-all duration-500"></div>
            </h3>
            <ul className="space-y-3">
              {["Features", "Demo", "Testimonials", "Pricing"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="group inline-flex items-center text-gray-500 hover:text-violet-300 transition-all duration-300 relative"
                  >
                    <span className="absolute -left-3 w-0 group-hover:w-2 h-2 bg-violet-500 rounded-full mr-0 transition-all duration-300 shadow-lg shadow-violet-500/50"></span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300 relative">
                      {item}
                      <span className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links - Enhanced */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block group">
              Company
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:w-full transition-all duration-500"></div>
            </h3>
            <ul className="space-y-3">
              {["About Us", "Blog", "Contact", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                    className="group inline-flex items-center text-gray-500 hover:text-purple-300 transition-all duration-300 relative"
                  >
                    <span className="absolute -left-3 w-0 group-hover:w-2 h-2 bg-purple-500 rounded-full mr-0 transition-all duration-300 shadow-lg shadow-purple-500/50"></span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300 relative">
                      {item}
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources - Enhanced */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block group">
              Resources
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full group-hover:w-full transition-all duration-500"></div>
            </h3>
            <ul className="space-y-3">
              {["Documentation", "Tutorials", "Support", "Community"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="group inline-flex items-center text-gray-500 hover:text-pink-300 transition-all duration-300 relative"
                  >
                    <span className="absolute -left-3 w-0 group-hover:w-2 h-2 bg-pink-500 rounded-full mr-0 transition-all duration-300 shadow-lg shadow-pink-500/50"></span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300 relative">
                      {item}
                      <span className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-black px-6 py-2 rounded-full border border-gray-800">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Enhanced */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()}{" "}
              <span className="font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                eBookCreator
              </span>
              . All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-1 flex items-center justify-center md:justify-start">
              Made with{" "}
              <Heart className="w-4 h-4 text-red-500 fill-red-500 mx-1 animate-pulse" />
              by{" "}
              <span className="font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent ml-1">
                Lokanath
              </span>
            </p>
          </div>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="group relative px-6 py-3 bg-gray-900 border-2 border-gray-800 rounded-xl hover:border-violet-500 transition-all duration-500 hover:-translate-y-2 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-violet-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-purple-600/0 group-hover:from-violet-600/30 group-hover:to-purple-600/30 rounded-xl transition-all duration-500"></div>
            <div className="absolute -inset-1 bg-violet-600/0 group-hover:bg-violet-600/50 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative flex items-center space-x-2">
              <ArrowUp className="w-5 h-5 text-gray-500 group-hover:text-violet-300 transition-colors duration-300 group-hover:scale-110 group-hover:-translate-y-1" />
              <span className="text-sm font-bold text-gray-500 group-hover:text-violet-300 transition-colors duration-300">
                Back to Top
              </span>
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;