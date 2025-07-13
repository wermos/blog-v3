interface GridLayout {
  containerClass: string;
  itemClasses: string[];
}

export function computeGridLayout(totalItems: number): GridLayout {
  const itemClasses = Array(totalItems).fill('');
  
  let containerClass: string;
  
  if (totalItems === 1) {
    containerClass = 'grid gap-4 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1';
  } else if (totalItems === 2) {
    containerClass = 'grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2';
  } else if (totalItems === 3) {
    containerClass = 'grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3';
  } else {
    // 4 or more items - use flexbox for incomplete row centering
    containerClass = 'flex flex-wrap justify-center gap-4';
    
    // Set responsive widths for flexbox items
    for (let i = 0; i < totalItems; i++) {
      itemClasses[i] = 'w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]';
    }
  }
  
  return {
    containerClass,
    itemClasses
  };
}
