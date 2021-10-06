import React from 'react';

import { useAppSelector } from '../store/hooks';
import { selectAspectRatios } from '../store/config-slice';
import { selectPreviewColumns } from '../store/ui-slice';

import ImageEssentialPreview from './ImageEssentialPreview';
import { selectCurrentImage } from '../store/current-image-slice';
import AspectRatio from '../model/AspectRatio';

const ImageEssentialGrid: React.FC = () => {
  const aspectRatios = useAppSelector(selectAspectRatios);
  const previewColumns = useAppSelector(selectPreviewColumns);
  const { url, essentialRect, imageRect } = useAppSelector(
    selectCurrentImage
  );

  const imageUrl = url;

  const classes =
    previewColumns > 1
      ? 'image-essential-grid image-essential-grid-two-column'
      : 'image-essential-grid';

  return (
    <div className={classes}>
      {aspectRatios.map((aspectRatioInfo: AspectRatio) => (
        <ImageEssentialPreview
          imageUrl={imageUrl}
          essentialRect={essentialRect}
          imageRect={imageRect}
          aspectRatioInfo={aspectRatioInfo}
          key={aspectRatioInfo.id}
        />
      ))}
    </div>
  );
};

export default ImageEssentialGrid;
