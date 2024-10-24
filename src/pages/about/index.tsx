import React, { useState, useEffect } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleSection = (section: any) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const scrollToSection = (sectionId: any) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className=" text-black text-center py-20">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-xl">Discover Our Story and Mission</p>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section id="company" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Company</h2>
          <p className="text-lg mb-4">
            We are a forward-thinking company dedicated to innovation and
            excellence in our field. With years of experience and a passion for
            what we do, we strive to make a positive impact on our industry and
            the world around us.
          </p>
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="Team collaborating in modern office"
            className="w-full rounded-lg shadow-lg"
          />
        </section>

        <section id="mission" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg mb-4">
              Our mission is to provide innovative solutions that empower
              businesses and individuals to reach their full potential. We are
              committed to:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Delivering high-quality products and services</li>
              <li>Fostering a culture of continuous improvement</li>
              <li>Promoting sustainability and social responsibility</li>
              <li>
                Building lasting relationships with our clients and partners
              </li>
            </ul>
          </div>
        </section>

        <section id="team" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["John Doe", "Jane Smith", "Mike Johnson"].map((name, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <img
                  src={`https://images.unsplash.com/photo-${
                    1500000000000 + index
                  }`}
                  alt={name}
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{name}</h3>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="testimonials" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["Alice Brown", "Bob Green"].map((name, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-lg mb-4">
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua."
                </p>
                <p className="font-semibold">{name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <div className="space-y-4">
            {["Integrity", "Innovation", "Collaboration", "Excellence"].map(
              (value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <button
                    className="w-full p-4 text-left font-semibold flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => toggleSection(value)}
                  >
                    {value}
                    {expandedSection === value ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                  {expandedSection === value && (
                    <div className="p-4 bg-gray-50">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </section>

        <section className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6">
            Join us on our mission to make a difference in the world.
          </p>
          <Link to={"/contact"} className="bg-[#f04138] hover:bg-[#f04138] text-white px-8 py-3 rounded-full text-lg font-semibold  transition duration-300">
            Contact Us Today
          </Link>
        </section>

      </main>
    </div>
  );
};

export default AboutUs;
