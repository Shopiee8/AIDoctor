'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LandingHeader } from '@/components/landing-header';
import { LandingFooter } from '@/components/landing-footer';
import Content from './content';
import Pagecontent from './pagecontent';

interface DoctorProfileProps {
  // Props for the doctor's data can be added here
  doctorId?: string;
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ doctorId }) => {
  // State for showing/hiding additional doctor information
  const [show, setShow] = useState(false);
  
  // State for video call functionality
  const [videocall, setVideocall] = useState(false);
  
  // State for modal/drawer open/close
  const [isOpen, setIsOpen] = useState(false);
  
  // General purpose state that can be used for various UI states
  const [state, setState] = useState(false);
  
  // For photo gallery navigation
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  
  // Router instance for navigation
  const router = useRouter();
  
  // Toggle additional doctor information
  const toggleShowMore = () => {
    setShow(!show);
  };
  
  // Handle video call initiation
  const handleVideoCall = () => {
    setVideocall(true);
    // Additional video call logic can be added here
  };
  
  // Toggle modal/drawer
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle photo gallery navigation
  const handlePhotoNavigation = (index: number) => {
    setPhotoIndex(index);
    // Additional photo navigation logic can be added here
  };

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      {/* Doctor Profile Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Doctor Profile</h1>
              <p className="text-gray-600">View and manage doctor information</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={toggleShowMore}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {show ? 'Show Less' : 'Show More'}
              </button>
              <button 
                onClick={handleVideoCall}
                className={`px-4 py-2 rounded transition-colors ${
                  videocall 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {videocall ? 'End Video Call' : 'Start Video Call'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Doctor Information Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src="/img/doctors/doctor-thumb-01.jpg"
                    alt="Doctor"
                    fill
                    className="object-cover"
                    priority
                  />
                  {photoIndex !== null && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white text-lg font-medium">
                        Photo {photoIndex + 1} selected
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((index) => (
                    <button
                      key={index}
                      onClick={() => handlePhotoNavigation(index)}
                      className={`relative aspect-square rounded overflow-hidden ${
                        photoIndex === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <Image
                        src={`/img/doctors/doctor-thumb-0${index + 1}.jpg`}
                        alt={`Doctor ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Dr. John Doe</h2>
                <p className="text-gray-600 mb-4">Cardiologist</p>
                
                {show && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Additional Information</h3>
                    <p className="text-blue-700">
                      Board certified cardiologist with over 10 years of experience in treating heart conditions.
                      Specializes in interventional cardiology and preventive cardiology.
                    </p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="w-32 text-gray-500">Availability</span>
                    <span className="font-medium">Monday - Friday, 9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-500">Experience</span>
                    <span className="font-medium">10+ years</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-500">Rating</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-400">★</span>
                      ))}
                      <span className="ml-2 text-gray-600">4.8 (124 reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={toggleModal}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isOpen ? 'Close Booking' : 'Book Appointment'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Modal/Drawer for Booking */}
          {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
                <button
                  onClick={toggleModal}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <h3 className="text-xl font-bold mb-4">Book an Appointment</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Time
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>9:00 AM</option>
                      <option>10:00 AM</option>
                      <option>11:00 AM</option>
                      <option>2:00 PM</option>
                      <option>3:00 PM</option>
                      <option>4:00 PM</option>
                    </select>
                  </div>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Confirm Appointment
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Video Call Interface */}
          {videocall && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
              <div className="flex justify-between items-center p-4 bg-gray-900">
                <h3 className="text-white text-lg font-medium">Video Call with Dr. John Doe</h3>
                <button
                  onClick={() => setVideocall(false)}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  End Call
                </button>
              </div>
              <div className="flex-grow flex items-center justify-center">
                <div className="relative w-full max-w-4xl aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-3xl text-blue-600">JD</span>
                      </div>
                      <h4 className="text-white text-xl font-medium">Dr. John Doe</h4>
                      <p className="text-gray-400">Connecting...</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-900 flex justify-center space-x-4">
                <button className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors">
                  <span className="sr-only">Mute</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                <button className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                  <span className="sr-only">End Call</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                  </svg>
                </button>
                <button className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors">
                  <span className="sr-only">Video</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {/* Page Content Components */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Pagecontent />
            </div>
            <div>
              <Content />
            </div>
          </div>
        </div>
      </div>
      
      <LandingFooter />
    </div>
  );
};

export default DoctorProfile;
