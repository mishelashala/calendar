import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { calendarReducer } from "./calendar/calendar.reducer";

export const store = configureStore({
  reducer: calendarReducer,
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
