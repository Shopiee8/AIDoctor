'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FaStar, FaStarHalfAlt, FaRegStar, FaMapMarkerAlt, FaPhone, FaVideo, FaRegBookmark, FaRegCommentAlt, FaThumbsUp, FaComment, FaMoneyBillAlt, FaGraduationCap, FaBriefcaseMedical } from 'react-icons/fa';

// Import the MyComponent with SSR disabled to prevent hydration issues
const MyComponent = dynamic(() => import('./mycomponent'), {
  ssr: false,
  loading: () => <p>Loading gallery...</p> // Optional loading component
});

// Import images - replace these with your actual image paths
const IMG01 = '/img/doctors/doctor-thumb-01.jpg';
const IMG02 = '/img/specialities/specialities-05.png';
const doctorthumb02 = '/img/doctors/doctor-thumb-02.jpg';

// Voice call modal component
const VoiceCallModal = (): JSX.Element => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden" id="voice_call">
    <div className="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden">
      <div className="p-6 text-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-lg">
          <Image
            src={doctorthumb02}
            alt="Dr. Darren Elder"
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-1">Dr. Darren Elder</h3>
        <p className="text-gray-600 mb-6">Requesting for voice call...</p>
        <div className="flex justify-center space-x-4">
          <button className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
            <FaPhone className="w-6 h-6" />
          </button>
          <button className="p-4 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors">
            <FaVideo className="w-6 h-6" />
          </button>
          <button className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const VideoCallModal = (): JSX.Element => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden" id="video_call">
    <div className="bg-white rounded-xl max-w-2xl w-full mx-4 overflow-hidden">
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
            <div className="text-center text-white">
              <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white">
                <Image
                  src={doctorthumb02}
                  alt="Dr. Darren Elder"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <h4 className="font-medium">Dr. Darren Elder</h4>
              <p className="text-sm text-gray-300">Connecting...</p>
            </div>
          </div>
          <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
            <div className="text-center text-white">
              <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white">
                <Image
                  src={doctorthumb02}
                  alt="Dr. Darren Elder"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <h4 className="font-medium">Dr. Darren Elder</h4>
              <p className="text-sm text-gray-300">Connecting...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PageContent = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Doctor Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Doctor's Profile Sidebar */}
            <div className="md:w-1/3 bg-gradient-to-b from-blue-50 to-white p-8 flex flex-col items-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
                <Image
                  src={IMG01}
                  alt="Dr. Darren Elder"
                  fill
                  className="object-cover"
                  sizes="(max-width: 192px) 100vw, 192px"
                  priority />
              </div>

              <h1 className="text-2xl font-bold text-gray-800 mb-1">Dr. Darren Elder</h1>
              <p className="text-blue-600 font-medium mb-4">Dentist</p>

              <div className="flex items-center mb-4">
                {[...Array(4)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 w-5 h-5" />
                ))}
                <FaStarHalfAlt className="text-yellow-400 w-5 h-5" />
                <span className="ml-2 text-gray-600 text-sm">(35 reviews)</span>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 w-full mb-6">
                <div className="flex items-center mb-3">
                  <FaMapMarkerAlt className="text-blue-500 mr-2" />
                  <span className="text-gray-700">New York, USA</span>
                </div>
                <div className="flex items-center mb-3">
                  <FaThumbsUp className="text-green-500 mr-2" />
                  <span className="text-gray-700">99% Positive Feedback</span>
                </div>
                <div className="flex items-center">
                  <FaMoneyBillAlt className="text-purple-500 mr-2" />
                  <span className="text-gray-700">$100 per hour</span>
                </div>
              </div>

              <div className="flex space-x-3 mb-6 w-full justify-center">
                <button className="p-3 rounded-full bg-white text-blue-500 shadow-md hover:bg-blue-50 transition-colors">
                  <FaRegBookmark className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors">
                  <FaRegCommentAlt className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors">
                  <FaPhone className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-colors">
                  <FaVideo className="w-5 h-5" />
                </button>
              </div>

              <Link
                href="/patient/booking1"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5 text-center"
              >
                Book Appointment
              </Link>
            </div>

            {/* Doctor's Details Section */}
            <div className="md:w-2/3 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About Dr. Darren Elder</h2>
                <p className="text-gray-600 mb-6">
                  BDS, MDS - Oral & Maxillofacial Surgery with over 10 years of experience. Specialized in dental implants, cosmetic dentistry, and oral surgery procedures.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-blue-800 mb-2">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Dental Implants', 'Teeth Whitening', 'Root Canal', 'Cosmetic Dentistry', 'Oral Surgery', 'Dental Crowns'].map((spec, i) => (
                      <span key={i} className="bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Gallery</h3>
                  <div className="rounded-lg overflow-hidden">
                    <MyComponent />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <FaGraduationCap className="mr-2 text-blue-500" />
                      Education
                    </h3>
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-800">MDS - Oral & Maxillofacial Surgery</h4>
                        <p className="text-sm text-gray-600">Harvard Medical School, 2012</p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-800">BDS - Bachelor of Dental Surgery</h4>
                        <p className="text-sm text-gray-600">University of California, 2008</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <FaBriefcaseMedical className="mr-2 text-green-500" />
                      Experience
                    </h3>
                    <div className="space-y-4">
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-medium text-gray-800">Senior Dentist</h4>
                        <p className="text-sm text-gray-600">Dental Care Center, New York (2018 - Present)</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-medium text-gray-800">Dental Surgeon</h4>
                        <p className="text-sm text-gray-600">City Dental Clinic, Boston (2012 - 2018)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <VoiceCallModal />
      <VideoCallModal />
    </div>
  );
};

export default PageContent;
