import React, { useEffect  } from 'react';
import Rect from '../model/Rect';

import EssentialRectEditor from './EssentialRectEditor';
import ImageViewerControls from './ImageViewerControls';
import ImageViewerInfo from './ImageViewerInfo';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  selectMinAspectRatio,
  selectMaxAspectRatio,
} from '../store/ui-slice';
import {
  currentImageActions,
  selectCurrentImage,
} from '../store/current-image-slice';

const ImageRectTool = () => {
  const dispatch = useAppDispatch();
  const minAspectRatio = useAppSelector(selectMinAspectRatio);
  const maxAspectRatio = useAppSelector(selectMaxAspectRatio);
  const { url, essentialRect } = useAppSelector(
    selectCurrentImage
  );

  const resetEssentialRect = () => {
    dispatch(currentImageActions.resetEssentialRect({minAspectRatio, maxAspectRatio}));
  }

  useEffect(() => {
    dispatch(currentImageActions.resetEssentialRect({minAspectRatio, maxAspectRatio}));
  }, [minAspectRatio, maxAspectRatio, dispatch]);

  const essentialRectChanged = (newEssentialRect: Rect) => {
    dispatch(currentImageActions.setEssentialRect(newEssentialRect));
  }

  const onImageLoaded = (element: HTMLImageElement) => {
    if (!essentialRect) {
      const imageRect  = { top: 0, left: 0, width: element.naturalWidth, height: element.naturalHeight};
      dispatch(currentImageActions.resetEssentialRect({minAspectRatio, maxAspectRatio, imageRect}));
    }
  }

  return (
    <div className="image-rect-tool">
      <ImageViewerControls onReset={resetEssentialRect} />
      <EssentialRectEditor
        imageUrl={url}
        essentialRect={essentialRect}
        onEssentialRectChange={essentialRectChanged}
        onImageLoaded={onImageLoaded}
        minAspectRatio={minAspectRatio}
        maxAspectRatio={maxAspectRatio}
      />
      <ImageViewerInfo />
    </div>
  );
};

export default ImageRectTool;
