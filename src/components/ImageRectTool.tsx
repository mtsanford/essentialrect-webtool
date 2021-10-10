import React, { useEffect, useCallback } from 'react';
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
  // const constrain = useAppSelector(selectConstrain);
  const minAspectRatio = useAppSelector(selectMinAspectRatio);
  const maxAspectRatio = useAppSelector(selectMaxAspectRatio);
  const { url, essentialRect } = useAppSelector(
    selectCurrentImage
  );

  // let maxWidth = 0;
  // let maxHeight = 0;

  // if (imageRect) {
  //   maxWidth = constrain
  //     ? Math.min(imageRect.width, imageRect.height * lowerConstraint)
  //     : imageRect.width;
  //   maxHeight = constrain
  //     ? Math.min(imageRect.height, imageRect.width / upperConstraint)
  //     : imageRect.height;
  // }

  const resetEssentialRect = () => {
    console.log('resetEssentialRect');
    dispatch(currentImageActions.resetEssentialRect({minAspectRatio, maxAspectRatio}));
    // dispatch(currentImageActions.setEssentialRect(newEssentialRect));
    // if (imageRect) {
    //   const newEssentialRect = {
    //     left: (imageRect.width - maxWidth) / 2,
    //     top: (imageRect.height - maxHeight) / 2,
    //     width: maxWidth,
    //     height: maxHeight,
    //   };
    //   dispatch(currentImageActions.setEssentialRect(newEssentialRect));
    // }
  }
  // const resetEssentialRect = useCallback(() => {
  //   console.log('resetEssentialRect');
  //   if (imageRect) {
  //     const newEssentialRect = {
  //       left: (imageRect.width - maxWidth) / 2,
  //       top: (imageRect.height - maxHeight) / 2,
  //       width: maxWidth,
  //       height: maxHeight,
  //     };
  //     dispatch(currentImageActions.setEssentialRect(newEssentialRect));
  //   }
  // }, [imageRect, maxWidth, maxHeight, dispatch]);

  // const resetHandler = useCallback(() => {
  //   resetEssentialRect();
  // }, [resetEssentialRect]);

  useEffect(() => {
    console.log('max changed!');
    dispatch(currentImageActions.resetEssentialRect({minAspectRatio, maxAspectRatio}));
  }, [minAspectRatio, maxAspectRatio, dispatch]);

  const essentialRectChanged = (newEssentialRect: Rect) => {
    console.log('essentialRectChanged', newEssentialRect)
    dispatch(currentImageActions.setEssentialRect(newEssentialRect));
  }

  const onImageLoaded = (element: HTMLImageElement) => {
    console.log('onImageLoaded')
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
