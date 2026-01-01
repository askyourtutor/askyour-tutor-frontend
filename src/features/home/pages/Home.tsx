import Hero from '../components/Hero';
import AboutUs from '../components/about-us';
import VideoSection from '../components/VideoSection';
import TeamSection from '../components/TeamSection';
import DirectorSection from '../components/DirectorSection';
import PopularCourses from '../components/popular-courses';
import BannerCTA from '../components/banner-cta';
import Footer from '../../../shared/components/layout/footer';

export default function Home() {
  return (
    <main className="main-content min-h-[60vh]">
      <Hero />
      <AboutUs />
      <VideoSection />
      <PopularCourses />
      <BannerCTA />
      <TeamSection />
      <DirectorSection />
      <Footer/>
    </main>
  );
}
