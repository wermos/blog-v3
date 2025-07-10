// src/components/ImageGallery.tsx
import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface ImageItem {
  src: string;
  alt?: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  groupCaption?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, groupCaption }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = images.map(img => ({
    src: img.src,
    alt: img.alt || '',
    title: img.caption || '',
  }));

  return (
    <div className="image-gallery my-6">
      {groupCaption && (
        <div className="mb-4 text-center text-sm text-muted-foreground font-medium">
          {groupCaption}
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="cursor-pointer group"
            onClick={() => {
              setCurrentIndex(index);
              setOpen(true);
            }}
          >
            <img
              src={img.src}
              alt={img.alt || ''}
              className="w-full h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={slides}
          index={currentIndex}
          onIndexChange={setCurrentIndex}
          animation={{ fade: 300 }}
          controller={{
            finite: false, // Enables cyclic navigation
          }}
          render={{
            slideCaption: ({ slide }) => (
              slide.title ? (
                <div className="text-center text-sm text-white/80 p-4 bg-black/20 rounded-md mx-4 mb-4">
                  {slide.title}
                </div>
              ) : null
            ),
          }}
        />
      )}
    </div>
  );
};

export default ImageGallery;
