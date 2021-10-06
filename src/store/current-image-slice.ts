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

const currentImageSlice = createSlice({
  name: 'currentImage',
  initialState,
  reducers: {
    setImage(state: any, action: PayloadAction<SetImageRecord>) {
      state.url = action.payload.url;
      state.imageRect = action.payload.imageRect;
      state.essentialRect = action.payload.essentialRect;
    },
    setEssentialRect(state: any, action: any) {
      state.essentialRect = action.payload;
    },
  },
});

// For use in useAppDispatch() hook
export const currentImageActions = currentImageSlice.actions;

// For use in useAppSelector() hook
export const selectCurrentImage = (state: RootState) => state.currentImage;

export default currentImageSlice;
