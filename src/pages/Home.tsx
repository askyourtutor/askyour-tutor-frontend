import Hero from '../components/sections/Hero';
import AboutUs from '../components/sections/about-us';
import VideoSection from '../components/sections/VideoSection';
import PopularCourses from '../components/sections/popular-courses';
import BannerCTA from '../components/sections/banner-cta';

export default function Home() {
  return (
    <main className="main-content min-h-[60vh]">
      <Hero />
      <AboutUs />
      <PopularCourses />
      <BannerCTA />
      <VideoSection />
    </main>
  );
}
