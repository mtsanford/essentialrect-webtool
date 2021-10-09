import React, { useEffect, useCallback } from 'react';
import Rect from '../model/Rect';

import EssentialRectEditor from './EssentialRectEditor';
import ImageViewerControls from './ImageViewerControls';
import ImageViewerInfo from './ImageViewerInfo';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  selectConstrain,
  selectLowerConstraint,
  selectUpperConstraint,
  MIN_ASPECT_RATIO,
  MAX_ASPECT_RATIO,
} from '../store/ui-slice';
import {
  currentImageActions,
  selectCurrentImage,
} from '../store/current-image-slice';

const ImageRectTool = () => {
  const dispatch = useAppDispatch();
  const constrain = useAppSelector(selectConstrain);
  const lowerConstraint = useAppSelector(selectLowerConstraint);
  const upperConstraint = useAppSelector(selectUpperConstraint);
  const { url, essentialRect, imageRect } = useAppSelector(
    selectCurrentImage
  );

  let maxWidth = 0;
  let maxHeight = 0;

  if (imageRect) {
    maxWidth = constrain
      ? Math.min(imageRect.width, imageRect.height * lowerConstraint)
      : imageRect.width;
    maxHeight = constrain
      ? Math.min(imageRect.height, imageRect.width / upperConstraint)
      : imageRect.height;
  }

  const resetEssentialRect = useCallback(() => {
    console.log('resetEssentialRect');
    if (imageRect) {
      const newEssentialRect = {
        left: (imageRect.width - maxWidth) / 2,
        top: (imageRect.height - maxHeight) / 2,
        width: maxWidth,
        height: maxHeight,
      };
      dispatch(currentImageActions.setEssentialRect(newEssentialRect));
    }
  }, [imageRect, maxWidth, maxHeight, dispatch]);

  const resetHandler = useCallback(() => {
    resetEssentialRect();
  }, [resetEssentialRect]);

  useEffect(() => {
    console.log('max changed!');
    resetEssentialRect();
  }, [maxWidth, maxHeight, resetEssentialRect]);

  const essentialRectChanged = (newEssentialRect: Rect) => {
    console.log('essentialRectChanged', newEssentialRect)
    dispatch(currentImageActions.setEssentialRect(newEssentialRect));
  }

  return (
    <div className="image-rect-tool">
      <ImageViewerControls onReset={resetHandler} />
      <EssentialRectEditor
        imageUrl={url}
        essentialRect={essentialRect}
        onEssentialRectChange={essentialRectChanged}
        minAspectRatio={lowerConstraint}
        maxAspectRatio={upperConstraint}
      />
      <ImageViewerInfo />
    </div>
  );
};

export default ImageRectTool;
