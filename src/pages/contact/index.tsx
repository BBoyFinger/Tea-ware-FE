import React, { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaSpinner,
  FaTwitter,
} from "react-icons/fa";

interface Error {
  email?: string;
  message?: string;
}

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Error>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commonSubjects = [
    "General Inquiry",
    "Product Support",
    "Billing Issue",
    "Technical Support",
    "Feedback",
  ];

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name: any, value: any) => {
    let newErrors: Error = { ...errors };
    switch (name) {
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = "Invalid email format";
        } else {
          delete newErrors.email;
        }
        break;
      case "message":
        if (!value.trim()) {
          newErrors.message = "Message field is required";
        } else {
          delete newErrors?.message;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      // Simulating form submission
      setTimeout(() => {
        setIsSubmitting(false);
        alert("Form submitted successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 2000);
    }
  };

  return (
    <div>
      <section id="contacta" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5545.649631621291!2d105.80688766134573!3d20.97329106465236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1728543910550!5m2!1sen!2s"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[400px]"
          ></iframe>
        </div>
      </section>
      <section id="contact" className="py-20 bg-gray-200">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
          <div className="flex flex-wrap -mx-3">
            <div className="w-full md:w-1/2 px-3 mb-12 md:mb-0">
              <h3 className="text-2xl font-semibold mb-6">
                Contact Information
              </h3>
              <p className="mb-4">
                <strong>Address:</strong> 123 Business Ave, Tech City, 12345
              </p>
              <p className="mb-4">
                <strong>Phone:</strong> (123) 456-7890
              </p>
              <p className="mb-4">
                <strong>Email:</strong> info@ourcompany.com
              </p>
              <div className="flex space-x-4 mt-6">
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-500 transition duration-300"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-400 transition duration-300"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-700 transition duration-300"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 transition duration-300"
                >
                  <FaInstagram size={24} />
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    placeholder="Your Name"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="Your Email"
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="message"
                    placeholder="Your Message"
                    rows={4}
                  ></textarea>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-[#f04138] hover:bg-[#f04138] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                    type="button"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
