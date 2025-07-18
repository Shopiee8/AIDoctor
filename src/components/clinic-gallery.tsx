
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const clinicImages = [
    { src: "https://placehold.co/150x150.png", hint: "clinic interior" },
    { src: "https://placehold.co/150x150.png", hint: "clinic waiting room" },
    { src: "https://placehold.co/150x150.png", hint: "medical equipment" },
    { src: "https://placehold.co/150x150.png", hint: "clinic exterior" },
];

export function ClinicGallery() {
    const [index, setIndex] = useState(-1);

    const slides = clinicImages.map(img => ({ src: img.src }));

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {clinicImages.map((image, i) => (
                    <button key={i} onClick={() => setIndex(i)} className="overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <Image
                            src={image.src}
                            alt={`Clinic Image ${i + 1}`}
                            width={150}
                            height={150}
                            className="w-full h-full object-cover aspect-square transition-transform hover:scale-105"
                            data-ai-hint={image.hint}
                        />
                    </button>
                ))}
            </div>

            <Lightbox
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
                slides={slides}
            />
        </>
    );
}
