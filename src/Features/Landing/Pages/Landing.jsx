import {
  Navbar,
  Hero,
  Features,
  Catalog,
  Testimonials,
  About,
  Contact,
  CTASection,
  Footer,
} from '../components';

export function Landing({ onLogin }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <Navbar onLogin={onLogin} />
      <Hero onLogin={onLogin} />
      <Features />
      <Catalog onLogin={onLogin} />
      <Testimonials />
      <About />
      <Contact />
      <CTASection onLogin={onLogin} />
      <Footer />
    </div>
  );
}
