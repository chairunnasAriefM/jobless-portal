// src/components/Testimonials.jsx
import React from 'react';
import { Star } from 'lucide-react';

const testimonialsData = [
  {
    quote: "Proses rekrutmen jadi jauh lebih mudah dan efisien! Banyak kandidat lokal berkualitas yang melamar.",
    name: "Budi Santoso",
    role: "Pemilik UKM Maju Jaya",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    quote: "Akhirnya ada job portal yang mengerti kebutuhan pencari kerja seperti saya. Dapat kerjaan di startup lokal idaman!",
    name: "Siti Aminah",
    role: "Digital Marketer",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    quote: "Fitur lowongan unggulan sangat membantu menjangkau lebih banyak pelamar. Harganya juga pas untuk UKM.",
    name: "Rina Wijaya",
    role: "HRD PT. Cipta Rasa Kuliner",
    avatarUrl: "https://randomuser.me/api/portraits/women/36.jpg",
    rating: 4,
  },
];

const RatingStars = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={18}
        className={`mr-0.5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 h-full">
    <img
      src={testimonial.avatarUrl}
      alt={testimonial.name}
      className="w-20 h-20 rounded-full mb-4 border-4 border-orange-200" // Ubah mb-6 ke mb-4
    />
    <RatingStars rating={testimonial.rating} />
    <p className="text-gray-600 italic my-4 text-base leading-relaxed flex-grow"> {/* Ubah my-6 ke my-4 */}
      "{testimonial.quote}"
    </p>
    <div className="mt-auto">
        <h4 className="font-semibold text-slate-800">{testimonial.name}</h4>
        <p className="text-sm text-orange-500">{testimonial.role}</p>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section className="py-16 bg-slate-100" id="career-advice"> {/* Menambahkan ID untuk Tips Karir */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            Apa Kata <span className="text-orange-500">Mereka</span>?
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Pengalaman nyata dari para pengguna JoblessPortal, baik pencari kerja maupun perusahaan.
          </p>
        </div>
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