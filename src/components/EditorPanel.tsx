import React, { CSSProperties, useEffect } from "react";

import EssentialRectEditor from "react-essentialrect-editor";
import { Rect, useClientRect, fitRect } from "react-essentialrect";

import EditorControls from "./EditorControls";
import EditorInfo from "./EditorInfo";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import { selectMinAspectRatio, selectMaxAspectRatio } from "../store/ui-slice";
import {
  currentImageActions,
  selectCurrentImage,
} from "../store/current-image-slice";

const EditorPanel = () => {
  const [editorWrapperRef, editorWrapperRect] = useClientRect();
  const dispatch = useAppDispatch();
  const minAspectRatio = useAppSelector(selectMinAspectRatio);
  const maxAspectRatio = useAppSelector(selectMaxAspectRatio);
  const { url, essentialRect, imageRect } = useAppSelector(selectCurrentImage);
  let editorStyles: CSSProperties = {};

  if (url && editorWrapperRect && imageRect) {
    const editorRect = fitRect(imageRect, imageRect, editorWrapperRect);

    console.log(editorWrapperRect);

    editorStyles = {
      top: `${editorRect.top}px`,
      left: `${editorRect.left}px`,
      width: `${editorRect.width}px`,
      height: `${editorRect.height}px`,
      position: "relative",
    };
  }

  const resetEssentialRect = () => {
    dispatch(
      currentImageActions.resetEssentialRect({ minAspectRatio, maxAspectRatio })
    );
  };

  useEffect(() => {
    dispatch(
      currentImageActions.resetEssentialRect({ minAspectRatio, maxAspectRatio })
    );
  }, [minAspectRatio, maxAspectRatio, dispatch]);

  const essentialRectChanged = (newEssentialRect: Rect) => {
    dispatch(currentImageActions.setEssentialRect(newEssentialRect));
  };

  const onImageLoaded = (element: HTMLImageElement) => {
    if (!essentialRect) {
      const imageRect = {
        top: 0,
        left: 0,
        width: element.naturalWidth,
        height: element.naturalHeight,
      };
      dispatch(
        currentImageActions.resetEssentialRect({
          minAspectRatio,
          maxAspectRatio,
          imageRect,
        })
      );
    }
  };

  return (
    <div className="EditorPanel">
      <EditorControls onReset={resetEssentialRect} />

      <div className="EditorBorder"ref={editorWrapperRef}>
        <div className="EditorWrapper">
          {url && (
            <EssentialRectEditor
              imageUrl={url}
              essentialRect={essentialRect}
              onEssentialRectChange={essentialRectChanged}
              onImageLoaded={onImageLoaded}
              minAspectRatio={minAspectRatio}
              maxAspectRatio={maxAspectRatio}
              style={editorStyles}
            />
          )}
        </div>
      </div>

      <EditorInfo />
    </div>
  );
};

export default EditorPanel;
