// src/components/Testimonials.jsx
import React from 'react';
import { Star } from 'lucide-react'; // Untuk rating bintang

// Contoh data testimoni
const testimonialsData = [
  {
    quote: "FlexJobs provides multiple cool features to help you be successful in your job application. FlexJobs is worth it!",
    name: "Daniel S.",
    role: "Hired at Lyft",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg", // Ganti dengan path avatar
    rating: 5,
  },
  {
    quote: "Found my dream remote job within a week! The quality of listings is unmatched. Highly recommend this platform.",
    name: "Sarah L.",
    role: "Software Engineer",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    quote: "The career advice section was incredibly helpful. Landed a great part-time gig that fits my schedule perfectly.",
    name: "Mike P.",
    role: "Marketing Specialist",
    avatarUrl: "https://randomuser.me/api/portraits/men/36.jpg",
    rating: 4,
  },
];

const RatingStars = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={18}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ))}
  </div>
);

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
    <img
      src={testimonial.avatarUrl}
      alt={testimonial.name}
      className="w-20 h-20 rounded-full mb-6 border-4 border-orange-200"
    />
    <RatingStars rating={testimonial.rating} />
    <p className="text-gray-600 italic my-6 text-lg leading-relaxed">
      "{testimonial.quote}"
    </p>
    <h4 className="font-semibold text-slate-800">{testimonial.name}</h4>
    <p className="text-sm text-orange-500">{testimonial.role}</p>
  </div>
);

const Testimonials = () => {
  return (
    <section className="py-16 bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            What Our <span className="text-orange-500">Members</span> Are Saying
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from job seekers who found success through our platform.
          </p>
        </div>
        {/* Untuk slider, Anda mungkin butuh library seperti Swiper.js atau Keen-slider */}
        {/* Untuk contoh ini, kita buat grid sederhana */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;