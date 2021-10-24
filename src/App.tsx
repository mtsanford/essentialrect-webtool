import React, { useRef } from "react";
import "./App.global.scss";

import EditorPanel from "./components/EditorPanel";
import AppControls from "./components/AppControls";
import SplitterLayout from "react-splitter-layout";
import ImagePreviewPanel from "./components/ImagePreviewPanel";

import { useAppDispatch } from "./store/hooks";
import { setCurrentImage } from "./store/current-image-actions";

import { Rect } from "react-essentialrect";

function App() {
  const dispatch = useAppDispatch();
  const fileButton = useRef<HTMLInputElement>(null);

  const actionHandler = (action: string): void => {
    if (fileButton.current) {
      fileButton.current.click();
    }
  };

  const onSelectFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      let essentialRect: Rect;

      console.log(file.name);

      if (file.name === "20150210_014858.jpg") {
        essentialRect = {
          top: 100,
          left: 100,
          width: 300,
          height: 400,
        };
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const newSrc: any = reader.result;
        dispatch(setCurrentImage(newSrc, essentialRect));
      });
      reader.readAsDataURL(file);
    }
  };

  return (
    <SplitterLayout
      customClassName="splitter-layout"
      primaryMinSize={100}
      secondaryMinSize={100}
    >
      <div className="left-panel">
        {/* invisible file input because it's the only way to load a file! */}
        <input
          type="file"
          onChange={onSelectFile}
          ref={fileButton}
          style={{ display: "none" }}
        />
        <AppControls onAction={actionHandler} />
        <ImagePreviewPanel />
      </div>
      <EditorPanel />
    </SplitterLayout>
  );
}

export default App;
