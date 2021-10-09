import Rect from '../model/Rect';
import { currentImageActions } from './current-image-slice';
import type { AppDispatch } from './index';

// need an async action to set image, because we've got no way to get
// the image size until it's loaded into an <img> DOM element.
// NativeImage from Electron appears to give the wrong values.

// TODO: need handle cancel case

export interface SetCurrentImageRecord {
  url: string;
  essentialRect?: Rect;
  imageRect?: Rect;
}

// export const setCurrentImage: (r: SetCurrentImageRecord) => void = ({url, essentialRect, imageRect}) => {

export const setCurrentImage = (url: string, essentialRect?: Rect, imageRect?: Rect) => {
  console.log('setCurrentImage', essentialRect);
  return async (dispatch: AppDispatch) => {
    if (imageRect) {
      if (!essentialRect) {
        essentialRect = imageRect;
      }
      dispatch(
        currentImageActions.setImage({
          url,
          imageRect,
          essentialRect,
        })
      );
    }
    else {
      const probeImage = new Image();
      probeImage.onload = () => {
        const imageRect = {
          left: 0,
          top: 0,
          width: probeImage.width,
          height: probeImage.height,
        };
        dispatch(
          currentImageActions.setImage({
            url,
            imageRect,
            essentialRect,
          })
        );
      }
      probeImage.src = url;
    }
  };
};

export default setCurrentImage;
