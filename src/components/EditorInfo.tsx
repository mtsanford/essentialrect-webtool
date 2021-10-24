import React, { MouseEventHandler } from 'react';
import copy from 'copy-to-clipboard';

import { selectCurrentImage } from '../store/current-image-slice';
import { useAppSelector } from '../store/hooks';

const EditorInfo: React.FC = () => {
  const { essentialRect } = useAppSelector(selectCurrentImage);
  let monitorText = '';

  if (essentialRect) {
    const l = Math.floor(essentialRect.left);
    const t = Math.floor(essentialRect.top);
    const w = Math.floor(essentialRect.width);
    const h = Math.floor(essentialRect.height);

    monitorText = `{left:${l}, top:${t}, width:${w}, height:${h}}`;
  }

  const monitorClickHandler: MouseEventHandler<HTMLDivElement> =
    (event) => {
      event.preventDefault();
      copy(monitorText);
    };

  return (
    <div className="EditorInfo">
      {monitorText && (
        <div
          className="EditorInfoMonitor"
          onClick={monitorClickHandler}
        >
          {monitorText}
        </div>
      )}
    </div>
  );
};

export default EditorInfo;
