import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { Rect } from '../model/Rect';

export interface CurrentImageState {
  url?: string;
  imageRect?: Rect;
  essentialRect?: Rect;
}

export interface SetImageRecord {
  url?: string;
  imageRect?: Rect;
  essentialRect?: Rect;
}

const initialState: CurrentImageState = {
  url: './sax.jpg',
  imageRect: { left: 0, top: 0, width: 1800, height: 1200 },
  essentialRect:  { left: 0, top: 0, width: 1800, height: 1200 }
};

export interface ResetEssentialRectRecord {
  minAspectRatio?: number;
  maxAspectRatio?: number;
  imageRect?: Rect;
}

const currentImageSlice = createSlice({
  name: 'currentImage',
  initialState,
  reducers: {
    setImage(state: CurrentImageState, action: PayloadAction<SetImageRecord>) {
      state.url = action.payload.url;
      state.imageRect = action.payload.imageRect;
      state.essentialRect = action.payload.essentialRect;
    },
    setEssentialRect(state: CurrentImageState, action: PayloadAction<Rect>) {
      state.essentialRect = action.payload;
    },
    resetEssentialRect(state: CurrentImageState, action: PayloadAction<ResetEssentialRectRecord>) {
      if (action.payload.imageRect) state.imageRect = action.payload.imageRect;

      if (state.imageRect) {
        const maxWidth = action.payload.minAspectRatio ? Math.min(state.imageRect.width, state.imageRect.height * action.payload.minAspectRatio) : state.imageRect.width;
        const maxHeight =  action.payload.maxAspectRatio ? Math.min(state.imageRect.height, state.imageRect.width / action.payload.maxAspectRatio) : state.imageRect.height;
        const newEssentialRect = {
          left: (state.imageRect.width - maxWidth) / 2,
          top: (state.imageRect.height - maxHeight) / 2,
          width: maxWidth,
          height: maxHeight,
        };

        state.essentialRect = newEssentialRect;
      }
    },
  },
});

// For use in useAppDispatch() hook
export const currentImageActions = currentImageSlice.actions;

// For use in useAppSelector() hook
export const selectCurrentImage = (state: RootState) => state.currentImage;

export default currentImageSlice;
