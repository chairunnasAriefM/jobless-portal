// src/components/FeaturedJobs.jsx
import React from 'react';
import { MapPin, Briefcase, CalendarDays, ArrowRight } from 'lucide-react';

const jobListings = [
  {
    id: 1,
    title: 'Regional Assistant Director of Admission',
    company: 'University X',
    location: 'Beverly, MA',
    type: '100% Remote Work',
    schedule: 'Alternative Schedule',
    isNew: true,
    datePosted: 'Today',
  },
  {
    id: 2,
    title: 'Staff Enterprise Program Manager',
    company: 'Tech Solutions Inc.',
    location: 'Acton, MA',
    type: '100% Remote Work',
    schedule: 'Full-Time',
    isNew: true,
    datePosted: 'Today',
  },
  {
    id: 3,
    title: 'Engineering Manager - Search',
    company: 'Innovate LLC',
    location: 'US National',
    type: 'Remote Work',
    schedule: 'Full-Time',
    isNew: false,
    datePosted: 'Yesterday',
  },
   {
    id: 4,
    title: 'Senior Frontend Developer',
    company: 'Web Wizards Co.',
    location: 'Remote (Global)',
    type: 'Hybrid Remote Work',
    schedule: 'Full-Time',
    isNew: true,
    datePosted: 'Today',
  },
  // Tambahkan lebih banyak lowongan di sini
];

const JobCard = ({ job }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 flex flex-col h-full">
    <div className="flex justify-between items-start mb-3">
      <span className="text-xs text-gray-500">{job.datePosted}</span>
      {job.isNew && (
        <span className="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          New!
        </span>
      )}
    </div>
    <h3 className="text-lg font-semibold text-slate-800 mb-2">{job.title}</h3>
    
    <div className="space-y-2 text-sm text-gray-600 mb-4 flex-grow">
      <p className="flex items-center">
        <Briefcase size={16} className="mr-2 text-orange-500" /> {job.company}
      </p>
      <p className="flex items-center">
        <MapPin size={16} className="mr-2 text-orange-500" /> {job.location}
      </p>
      <p className="flex items-center">
        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs mr-2">{job.type}</span>
        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">{job.schedule}</span>
      </p>
    </div>
    <a
      href="#"
      className="inline-flex items-center justify-center mt-auto text-orange-500 hover:text-orange-600 font-medium group"
    >
      View Details
      <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
    </a>
  </div>
);

const FeaturedJobs = () => {
  return (
    <section id="find-jobs" className="py-16 bg-white"> {/* ID untuk navigasi dari Hero */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            Featuring <span className="text-orange-500">100k+</span> Flexible & Remote Jobs
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore thousands of opportunities from top companies around the world.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobListings.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        <div className="text-center mt-12">
          <button className="bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
            Show More Popular Job Searches
            <ArrowRight size={20} className="inline ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;