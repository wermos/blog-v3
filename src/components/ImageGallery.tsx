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
  // Use static classes that Tailwind can detect during build
  if (numImages === 1) return 'grid gap-4 grid-cols-1';
  if (numImages === 2) return 'grid gap-4 grid-cols-1 md:grid-cols-2';
  if (numImages === 3) return 'grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  return 'grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, groupCaption }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = images.map(img => ({
    src: img.src,
    alt: img.alt || '',
    description: img.caption ? img.caption.replace(/^<p>(.*)<\/p>$/s, '$1') : '',
  }));

  // Only center last row if we have more than 4 images AND an incomplete last row
  const hasIncompleteLastRow = images.length > 4 && images.length % 4 !== 0;
  const numCompleteRows = Math.trunc(images.length / 4);
  const lastRowItemCount = images.length % 4;

  const getLastRowItemClasses = (index: number) => {
    if (!hasIncompleteLastRow) return '';
    
    const isLastRowItem = index > (4 * numCompleteRows - 1);
    if (!isLastRowItem) return '';
    
    const positionInLastRow = index - (4 * numCompleteRows);
    
    // For xl screens (4 columns), center the items
    if (lastRowItemCount === 1) {
      return 'xl:col-start-2 xl:col-span-2'; // Center single item across columns 2-3
    } else if (lastRowItemCount === 2) {
      return 'xl:col-start-2'; // Start both items from column 2
    } else if (lastRowItemCount === 3) {
      if (positionInLastRow === 0) return 'xl:col-start-1';
      return ''; // Let the other 2 items flow naturally
    }
    
    return '';
  };

  return (
    <div className="image-gallery w-full">
      <div className={getGridClasses(images.length)}>
        {images.map((img, index) => {
          const isLastRowItem = hasIncompleteLastRow && index > (4 * numCompleteRows - 1);
          
          return (
            <div
              key={index}
              className={`cursor-pointer transition-transform hover:scale-105 ${getLastRowItemClasses(index)}`}
              onClick={() => {
                setCurrentIndex(index);
                setOpen(true);
              }}
            >
              <img
                src={img.src}
                alt={img.alt || ''}
                className="w-full h-auto object-contain border border-border rounded-md"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>

      {groupCaption && (
        <div 
          className="text-center text-muted-foreground text-sm mt-2"
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
