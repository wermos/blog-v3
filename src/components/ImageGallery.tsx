// src/components/ImageGallery.tsx
import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';

interface ImageItem {
  src: string;
  alt?: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  groupCaption?: string;
}

const getGridClasses = (numImages: number): string => {
  const colsDefault = Math.min(2, numImages);
  const colsMd = Math.min(3, numImages);
  const colsLg = Math.min(4, numImages);
  
  return `grid gap-4 grid-cols-${colsDefault} md:grid-cols-${colsMd} lg:grid-cols-${colsLg}`;
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, groupCaption }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = images.map(img => ({
    src: img.src,
    alt: img.alt || '',
    description: img.caption ? img.caption.replace(/^<p>(.*)<\/p>$/s, '$1') : '',
  }));

  return (
    <div className="image-gallery">
      <div className={getGridClasses(images.length)}>
        {images.map((img, index) => (
          <div
            key={index}
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => {
              setCurrentIndex(index);
              setOpen(true);
            }}
          >
            <img
              src={img.src}
              alt={img.alt || ''}
              className="w-full object-contain border border-border rounded-md"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {groupCaption && (
        <div 
          className="text-center text-muted-foreground text-sm mt-4"
          dangerouslySetInnerHTML={{ __html: groupCaption }}
          suppressHydrationWarning={true}
        />
      )}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={currentIndex}
        onIndexChange={setCurrentIndex}
        plugins={[Captions]}
        controller={{
          finite: false,
        }}
        styles={{
          container: {
            backgroundColor: 'var(--background)',
          },
        }}
      />
    </div>
  );
};

export default ImageGallery;
