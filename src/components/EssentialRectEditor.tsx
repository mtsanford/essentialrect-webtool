import React, {
  CSSProperties,
  useState,
  useCallback,
  ReactElement,
} from "react";

import ReactCrop, { Crop } from "react-image-crop";

import { Rect, rectEmpty, rectClip, emptyRect } from "../model/Rect";
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
  const [realImageRect, setRealImageRect] = useState<Rect | undefined>();
  const [imageViewerRef, clientRect] = useClientRect();

  let crop: Partial<Crop> = {};
  let cropWrapperStyles: CSSProperties = {};
  let cropStyles: CSSProperties = {};
  let cropWrapperRect: Rect = emptyRect;
  let essentialRectClient: Rect;
  let maxCropWidth: number | undefined;
  let maxCropHeight: number | undefined;

  // use a fake image rect until the image is loaded
  const imageRect = realImageRect || { left: 0, top: 0, width: 1, height: 1 };

  // we can determine where image should be placed until we have clientrect
  // and an image rect.  We can't draw the crop until we have an essentialRect.
  const drawCrop = imageUrl && !rectEmpty(clientRect);

  if (drawCrop) {
    cropWrapperRect = fitRect(imageRect, imageRect, clientRect);
    cropWrapperStyles = stylesFromRect(cropWrapperRect);
    cropWrapperStyles = {
      ...cropWrapperStyles,
      position: "absolute",
    };

    cropStyles = {
      width: "100%",
    };

    if (essentialRect) {
      essentialRectClient = imageToClientRect(
        imageRect,
        cropWrapperRect,
        essentialRect
      );

      // figure the max crop dimensions in image units
      const maxWidth = minAspectRatio
        ? Math.min(imageRect.width, imageRect.height * minAspectRatio)
        : imageRect.width;
      const maxHeight = maxAspectRatio
        ? Math.min(imageRect.height, imageRect.width / maxAspectRatio)
        : imageRect.height;

      // then convert to client units
      const maxCropRect = imageToClientRect(imageRect, cropWrapperRect, {
        left: 0,
        top: 0,
        width: maxWidth,
        height: maxHeight,
      });

      if (minAspectRatio) {
        maxCropWidth = Math.floor(maxCropRect.width);
      }

      if (maxAspectRatio) {
        maxCropHeight = Math.floor(maxCropRect.height);
      }

      crop = {
        x: essentialRectClient.left - cropWrapperRect.left,
        y: essentialRectClient.top - cropWrapperRect.top,
        width: essentialRectClient.width,
        height: essentialRectClient.height,
        unit: "px",
      };
    }
  }

  const onCropChange = (newCrop: Crop) => {
    const selectRect: Rect = {
      left: newCrop.x + cropWrapperRect.left,
      top: newCrop.y + cropWrapperRect.top,
      width: newCrop.width,
      height: newCrop.height,
    };

    if (!realImageRect) return;

    const newEssentialRect = clientToImageRect(
      imageRect,
      cropWrapperRect,
      selectRect
    );
    const clipped = rectClip(newEssentialRect, imageRect);

    if (!rectEmpty(clipped)) {
      if (onEssentialRectChange) onEssentialRectChange(clipped);
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

      setRealImageRect(loadedImageRect);

      if (onImageLoaded) onImageLoaded(element);

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
              style={cropStyles}
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
