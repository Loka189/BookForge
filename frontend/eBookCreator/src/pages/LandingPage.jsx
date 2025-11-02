import React from 'react'
import Navbar from '../components/layouts/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Testimonials from '../components/landing/Testimonials';
import Footer from '../components/landing/Footer';
import FeaturedBooks from '../components/landing/FeaturedBooks';
const LandingPage = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <FeaturedBooks/>
      <Features/>
      <Testimonials/>
      <Footer/>
    </div>
  )
}

export default LandingPage
