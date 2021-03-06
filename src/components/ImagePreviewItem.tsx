import React  from 'react';

import {EssentialRectImg, useClientRect, Rect } from 'react-essentialrect';

import AspectRatio from '../model/AspectRatio';

const imageContainerFit = 0.91; // % of client to fill
const imageContainerBorder = 0.015; // width of border as % of client
const imageContainerFont = 0.05;

function calcImageContainerRect(clientRect: Rect, aspectRatio: number) {
  let imageContainerRect;
  let borderSize;

  if (aspectRatio > 1) {
    let width = clientRect.width * imageContainerFit;
    if (aspectRatio < 1.3) {
      width *= 0.8;
    }
    const height = width / aspectRatio;
    borderSize = clientRect.width * imageContainerBorder;
    imageContainerRect = {
      width,
      height,
      left: (clientRect.width - width) / 2 - borderSize,
      top: (clientRect.height - height) / 2 - borderSize,
    };
  } else {
    let height = clientRect.height * imageContainerFit;
    if (aspectRatio > 0.75) {
      height *= 0.5;
    }
    height *= 0.5;
    const width = height * aspectRatio;
    borderSize = clientRect.height * imageContainerBorder;
    imageContainerRect = {
      height,
      width,
      top: clientRect.height * imageContainerBorder - borderSize,
      left: (clientRect.width - width) / 2 - borderSize,
    };
  }
  return { imageContainerRect, borderSize };
}

const ImagePreviewItem: React.FC<{
  aspectRatioInfo: AspectRatio;
  imageUrl?: string;
  imageRect?: Rect;
  essentialRect?: Rect;
}> = ({ aspectRatioInfo, imageUrl, imageRect, essentialRect }) => {
  let contentStyles = {};
  let orientationClass;
  let imageContainerRect: Rect;
  let borderSize;
  let sizeMultiplier;

  const [ref, clientRect] = useClientRect();
  const { aspectRatio, name: aspectName, ratioText } = aspectRatioInfo;
  const landscape = aspectRatio >= 1;

  ({ imageContainerRect, borderSize } = calcImageContainerRect(
    clientRect,
    aspectRatio
  ));

  contentStyles = {
    height: clientRect.width,
  };

  if (aspectRatio > 0.9 && aspectRatio < 1.1) {
    sizeMultiplier = imageContainerFit * 0.8;
  } else if (aspectRatio > 0.74 && aspectRatio < 1.34) {
    sizeMultiplier = imageContainerFit * 0.9;
  } else {
    sizeMultiplier = imageContainerFit;
  }

  if (landscape) {
    imageContainerRect = {
      top: 0,
      left: 0,
      width: sizeMultiplier * clientRect.width,
      height: (sizeMultiplier * clientRect.width) / aspectRatio,
    };
    orientationClass = 'ImagePreviewItem--landscape';
  } else {
    imageContainerRect = {
      top: 0,
      left: 0,
      width: sizeMultiplier * clientRect.width * aspectRatio,
      height: sizeMultiplier * clientRect.width,
    };
    orientationClass = 'ImagePreviewItem--portrait';
  }

  const contentClasses = `ImagePreviewItem_Content ${orientationClass}`;

  borderSize = clientRect.width * imageContainerBorder;

  const containerStyles = {
    width: `${imageContainerRect.width}px`,
    height: `${imageContainerRect.height}px`,
    borderWidth: borderSize,
    borderRadius: borderSize,
  };

  const fontSize = clientRect.width * imageContainerFont;

  const textStyles = { fontSize };

  return (
    <div className="ImagePreviewItem" ref={ref}>
      <div className={contentClasses} style={contentStyles}>
        <div className="ImagePreviewItem_Container" style={containerStyles}>
          <EssentialRectImg src={imageUrl || ''} essentialRect={essentialRect} />
        </div>
        <div className="ImagePreviewItem_Text" style={textStyles}>
          {`${aspectName} ${ratioText}`}
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewItem;
