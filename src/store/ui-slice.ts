import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import persistentStorage from '../persistentStorage';

export interface Notification {
  status: string;
  title: string;
  message: string;
}

export interface UiState {
  notification?: Notification;
  previewColumns: number;

  // contraint controls
  constrain: boolean;
  lowerConstraintID?: string;
  upperConstraintID?: string;
  lowerConstraint?: number;
  upperConstraint?: number;

  // derived values
  minAspectRatio?: number;
  maxAspectRatio?: number;
}

const initialState: UiState = persistentStorage.get('uiState', {
  previewColumns: 2,
  constrain: true,
  lowerConstraintID: '(4:5)',
  upperConstraintID: '(1.91:1)',
  lowerConstraint: 4 / 5,
  upperConstraint: 1.91,
  minAspectRatio: 4 / 5,
  maxAspectRatio: 1.91,
});

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showNotification(state: UiState, action: PayloadAction<Notification>) {
      state.notification = action.payload;
    },
    setPreviewColumns(state: UiState, action: PayloadAction<number>) {
      state.previewColumns = action.payload;
    },
    setConstrain(state: UiState, action: PayloadAction<boolean>) {
      state.constrain = action.payload;
      state.minAspectRatio = (state.constrain && state.lowerConstraint) || undefined;
      state.maxAspectRatio = (state.constrain && state.upperConstraint) || undefined;
    },
    setLowerConstraint(
      state: UiState,
      action: PayloadAction<{ id?: string; aspectRatio?: number }>
    ) {
      state.lowerConstraintID = action.payload.id;
      state.lowerConstraint = action.payload.aspectRatio;
      state.minAspectRatio = (state.constrain && state.lowerConstraint) || undefined;
    },
    setUpperConstraint(
      state: UiState,
      action: PayloadAction<{ id?: string; aspectRatio?: number }>
    ) {
      state.upperConstraintID = action.payload.id;
      state.upperConstraint = action.payload.aspectRatio;
      state.maxAspectRatio = (state.constrain && state.upperConstraint) || undefined;
    },
  },
});

// For use in useAppDispatch() hook
export const uiActions = uiSlice.actions;

// For use in useAppSelector() hook
export const selectPreviewColumns = (state: RootState) =>
  state.ui.previewColumns;
export const selectConstrain = (state: RootState) => state.ui.constrain;
export const selectLowerConstraintID = (state: RootState) =>
  state.ui.lowerConstraintID;
export const selectUpperConstraintID = (state: RootState) =>
  state.ui.upperConstraintID;
export const selectMinAspectRatio = (state: RootState) =>
  state.ui.minAspectRatio;
export const selectMaxAspectRatio = (state: RootState) =>
  state.ui.maxAspectRatio;

export default uiSlice;
