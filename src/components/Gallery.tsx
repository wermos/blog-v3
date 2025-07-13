import React, { useState, useMemo } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import { computeGridLayout } from '@/lib/grid-centering';
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

const Gallery: React.FC<ImageGalleryProps> = ({ images, groupCaption }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const layout = useMemo(() => computeGridLayout(images.length), [images.length]);

  const slides = images.map(img => ({
    src: img.src,
    alt: img.alt || '',
    description: img.caption ? img.caption.replace(/^<p>(.*)<\/p>$/s, '$1') : '',
  }));

  return (
    <div className="image-gallery w-full">
      <div className={layout.containerClass}>
        {images.map((img, index) => (
          <div
            key={index}
            className={`${layout.itemClasses[index]}`}
          >
            <div
              className="cursor-pointer transition-transform hover:scale-105"
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
          </div>
        ))}
      </div>

      {/* Group caption - appears below the entire gallery */}
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
        // controller={{ finite: false }}
        styles={{
          container: {
            backgroundColor: 'var(--background)',
          },
        }}
      />
    </div>
  );
};

export default Gallery;
