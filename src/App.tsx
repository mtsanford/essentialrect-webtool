import React, { useRef } from "react";
import "./App.global.scss";

import ImageRectTool from "./components/ImageRectTool";
import Controls from "./components/Controls";
import SplitterLayout from 'react-splitter-layout';
import ImageEssentialGrid from "./components/ImageEssentialGrid";

import { useAppDispatch } from './store/hooks';
import { setCurrentImage } from './store/current-image-actions';


function App() {
  const dispatch = useAppDispatch();
  const fileButton = useRef<HTMLInputElement>(null);

  const actionHandler = (action: string): void => {
    if (fileButton.current) {
      fileButton.current.click()
    }
  };

  const onSelectFile: React.ChangeEventHandler<HTMLInputElement>= e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const newSrc: any = reader.result;
        dispatch(setCurrentImage(newSrc));
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };


  return (
    <SplitterLayout
      customClassName="splitter-layout"
      primaryMinSize={100}
      secondaryMinSize={100}
    >
      <div className="left-panel">
        <input type="file" onChange={onSelectFile} ref={fileButton} style={{display:"none"}} />
        <Controls onAction={actionHandler} />
        <div className="grid-wrapper">
          <ImageEssentialGrid />
        </div>
      </div>
      <ImageRectTool />
    </SplitterLayout>
  );
}

export default App;
