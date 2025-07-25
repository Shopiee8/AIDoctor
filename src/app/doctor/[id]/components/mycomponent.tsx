'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Import the gallery component with SSR disabled
const ReactImageGallery = dynamic(
  () => import('react-image-gallery'),
  { ssr: false }
);

// Import the gallery styles
import 'react-image-gallery/styles/css/image-gallery.css';

// Define the image paths - replace these with your actual image paths
const images = [
  {
    original: '/img/features/feature-01.jpg',
    thumbnail: '/img/features/feature-01.jpg',
    originalAlt: 'Feature 1',
    thumbnailAlt: 'Feature 1 thumbnail',
  },
  {
    original: '/img/features/feature-02.jpg',
    thumbnail: '/img/features/feature-02.jpg',
    originalAlt: 'Feature 2',
    thumbnailAlt: 'Feature 2 thumbnail',
  },
  {
    original: '/img/features/feature-03.jpg',
    thumbnail: '/img/features/feature-03.jpg',
    originalAlt: 'Feature 3',
    thumbnailAlt: 'Feature 3 thumbnail',
  },
  {
    original: '/img/features/feature-04.jpg',
    thumbnail: '/img/features/feature-04.jpg',
    originalAlt: 'Feature 4',
    thumbnailAlt: 'Feature 4 thumbnail',
  },
];

const MyComponent: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const renderCustomControls = () => {
    return (
      <div className="flex justify-center mt-2">
        <button 
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
        </button>
      </div>
    );
  };

  return (
    <div className="mt-4">
      <div className="max-w-2xl mx-auto">
        <ReactImageGallery
          items={images}
          showPlayButton={false}
          showFullscreenButton={false}
          showThumbnails={true}
          thumbnailPosition="bottom"
          additionalClass="custom-gallery"
          renderCustomControls={renderCustomControls}
          onScreenChange={(isFull) => setIsFullscreen(isFull)}
        />
      </div>
    </div>
  );
};

export default MyComponent;
