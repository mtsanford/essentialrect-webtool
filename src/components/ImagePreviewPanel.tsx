import React from "react";

import { useAppSelector } from "../store/hooks";
import { selectAspectRatios } from "../store/config-slice";
import { selectPreviewColumns } from "../store/ui-slice";

import ImagePreviewItem from "./ImagePreviewItem";
import { selectCurrentImage } from "../store/current-image-slice";
import AspectRatio from "../model/AspectRatio";

const ImagePreviewPanel: React.FC = () => {
  const aspectRatios = useAppSelector(selectAspectRatios);
  const previewColumns = useAppSelector(selectPreviewColumns);
  const { url, essentialRect, imageRect } = useAppSelector(selectCurrentImage);

  const imageUrl = url;

  const classes =
    previewColumns > 1
      ? "ImagePreview_Grid ImagePreview_Grid--TwoColumn"
      : "ImagePreview_Grid";

  return (
    <div className="ImagePreview">
      <div className={classes}>
        {aspectRatios.map((aspectRatioInfo: AspectRatio) => (
          <ImagePreviewItem
            imageUrl={imageUrl}
            essentialRect={essentialRect}
            imageRect={imageRect}
            aspectRatioInfo={aspectRatioInfo}
            key={aspectRatioInfo.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ImagePreviewPanel;
