import React, {
  CSSProperties,
  useState,
  useCallback,
  ReactElement,
} from "react";

import ReactCrop, { Crop } from "react-image-crop";

import { Rect, rectEmpty, rectClip, emptyRect, rectToStyles, rectScale } from "../model/Rect";
import {
  fitRect,
  clientToImageRect,
  imageToClientRect,
} from "../lib/fit-essential-rect";

import useClientRect from "../hooks/use-client-rect";

const stylesFromRect = (rect: Rect): CSSProperties => ({
  left: `${rect.left}px`,
  top: `${rect.top}px`,
  width: `${rect.width}px`,
  height: `${rect.height}px`,
});

const cropImageStyles: CSSProperties = { width: "100%" };

export interface EssentialRectEditorProps {
  /* URL of the image */
  imageUrl?: string;

  /* essentialRect of the image */
  essentialRect?: Rect;

  /* callback when the essentialRect changes */
  onEssentialRectChange?: (newRect: Rect) => void;

  /* Specify aspect ratio for which letterbox margins should be avoided */
  minAspectRatio?: number;
  maxAspectRatio?: number;

  /* callbacks for when the image is loaded or fails to load */
  onImageError?: React.DOMAttributes<HTMLImageElement>["onError"];
  onImageLoaded?: (image: HTMLImageElement) => void;
}

const EssentialRectEditor: React.FC<EssentialRectEditorProps> = ({
  imageUrl,
  essentialRect,
  onEssentialRectChange,
  minAspectRatio,
  maxAspectRatio,
  onImageError,
  onImageLoaded,
}): ReactElement => {
  const [imageRect, setImageRect] = useState<Rect | undefined>();
  const [imageViewerRef, clientRect] = useClientRect();

  let crop: Partial<Crop> = {};
  let cropWrapperStyles: CSSProperties = {};
  let essentialRectClient: Rect;
  let maxCropWidth: number | undefined;
  let maxCropHeight: number | undefined;

  let cropScale = 0;
  let cropTop = 0;
  let cropLeft = 0;

  // we can determine where image should be placed until we have clientrect
  // and an image rect.  We can't draw the crop until we have an essentialRect.
  const drawCrop = imageUrl && !rectEmpty(clientRect);

  if (drawCrop && imageRect) {
      cropScale = Math.min(clientRect.width / imageRect.width, clientRect.height / imageRect.height);
      cropTop = (clientRect.height - imageRect.height * cropScale) / 2;
      cropLeft = (clientRect.width - imageRect.width * cropScale) / 2;
  }

  if (drawCrop) {

    if (imageRect) {

      //cropWrapperRect = fitRect(imageRect, imageRect, clientRect);
      //cropWrapperStyles = rectToStyles(cropWrapperRect);
      cropWrapperStyles = {
        //...cropWrapperStyles,
        top: cropTop,
        left: cropLeft,
        width: imageRect.width * cropScale,
        height: imageRect.height * cropScale,
        position: "absolute",
      };


      if (essentialRect) {
        // essentialRectClient = imageToClientRect(
        //   imageRect,
        //   cropWrapperRect,
        //   essentialRect
        // );
        essentialRectClient = rectScale(essentialRect, cropScale)

        // figure the max crop dimensions in image units
        // const maxWidth = minAspectRatio
        //   ? Math.min(imageRect.width, imageRect.height * minAspectRatio)
        //   : imageRect.width;
        // const maxHeight = maxAspectRatio
        //   ? Math.min(imageRect.height, imageRect.width / maxAspectRatio)
        //   : imageRect.height;

        // then convert to client units
        // const maxCropRect = imageToClientRect(imageRect, cropWrapperRect, {
        //   left: 0,
        //   top: 0,
        //   width: maxWidth,
        //   height: maxHeight,
        // });

        if (minAspectRatio) {
          maxCropWidth = Math.floor(Math.min(imageRect.width, imageRect.height * minAspectRatio) * cropScale);
        }

        if (maxAspectRatio) {
          maxCropHeight = Math.floor(Math.min(imageRect.height, imageRect.width * maxAspectRatio) * cropScale);
        }

        crop = {
          // x: essentialRectClient.left - cropLeft,
          // y: essentialRectClient.top - cropTop,
          x: essentialRectClient.left,
          y: essentialRectClient.top,
          width: essentialRectClient.width,
          height: essentialRectClient.height,
          unit: "px",
        };
      }
    }
  }

  const onCropChange = (newCrop: Crop) => {
    // const selectRect: Rect = {
    //   left: newCrop.x + cropWrapperRect.left,
    //   top: newCrop.y + cropWrapperRect.top,
    //   width: newCrop.width,
    //   height: newCrop.height,
    // };

    // if (!imageRect) return;

    // const newEssentialRect = clientToImageRect(
    //   imageRect,
    //   cropWrapperRect,
    //   selectRect
    // );

    if (imageRect && cropScale) {
      const newEssentialRect = rectClip(rectScale({
        left: newCrop.x,
        top: newCrop.y,
        width: newCrop.width,
        height: newCrop.height,
      }, 1/ cropScale), imageRect);


      // const clipped = rectClip(newEssentialRect, imageRect);

      if (!rectEmpty(newEssentialRect)) {
        if (onEssentialRectChange) onEssentialRectChange(newEssentialRect);
      }
    }
  };

  /*********************************** */

  const imageLoaded = useCallback(
    (element: HTMLImageElement): boolean => {
      const imageWidth = element.naturalWidth;
      const imageHeight = element.naturalHeight;

      const loadedImageRect = {
        left: 0,
        top: 0,
        width: imageWidth,
        height: imageHeight,
      };

      setImageRect(loadedImageRect);

      if (onImageLoaded) onImageLoaded(element);

      // let ReactCrop know that it does not need to set the crop.  We 
      // set that through the essentialRect prop.
      return false;
    },
    [onImageLoaded]
  );

  return (
    <div className="image-viewer">
      <div className="image-viewer-inner" ref={imageViewerRef}>
        {drawCrop && (
          <div style={cropWrapperStyles}>
            <ReactCrop
              src={imageUrl}
              onImageLoaded={imageLoaded}
              crop={crop}
              onChange={onCropChange}
              style={cropImageStyles}
              imageStyle={cropImageStyles}
              minWidth={32}
              minHeight={32}
              maxWidth={maxCropWidth}
              maxHeight={maxCropHeight}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EssentialRectEditor;
