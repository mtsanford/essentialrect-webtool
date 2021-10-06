import React from "react";
import "./App.global.scss";
// import './ImageRectTool.css';

import ImageRectTool from "./components/ImageRectTool";
import Controls from "./components/Controls";
import SplitterLayout from 'react-splitter-layout';
import ImageEssentialGrid from "./components/ImageEssentialGrid";

function App() {
  const actionHandler: any = (event: any) => {

  };

  return (
    <SplitterLayout
      customClassName="imgjoy-splitter-layout"
      primaryMinSize={100}
      secondaryMinSize={100}
    >
      <div className="left-panel">
        <Controls onAction={actionHandler} />
        <div className="essential-grid-wrapper">
          <ImageEssentialGrid />
        </div>
      </div>
      <ImageRectTool />
    </SplitterLayout>
  );
}

export default App;
