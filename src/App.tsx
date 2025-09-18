import './App.css'
import Header from './components/layout/Header'
import Hero from './components/sections/Hero'
import AboutUs from './components/sections/about-us'
import PopularCourses from './components/sections/popular-courses'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <Hero />
        
        {/* About Us Section */}
        <AboutUs />
        
        {/* Popular Courses Section */}
        <PopularCourses />
      </main>
      
      {/* Footer - Can be added later */}
      {/* <Footer /> */}
    </div>
  )
}

export default App