import { createAction, createReducer } from "@reduxjs/toolkit";
import { defaultTo, prop } from "lodash/fp";
import { AppointmentEntity } from "../../domain/appointment.entity";

export type ReduxErrorAction = {
  type: string;
  payload: Error;
};

export type ReduxPayloadAction = {
  type: string;
  payload: any;
};

export type ReduxAction = ReduxErrorAction | ReduxPayloadAction;

export type CalendarState = {
  error: string;
  isModalOpen: boolean;
  day: string;
  name: string;
  appointments: any;
};

const calendarState = (): CalendarState => ({
  error: "",
  isModalOpen: false,
  day: "",
  name: "",
  appointments: {},
});

// actions
export const openModal = createAction<number>("open_modal");
export const closeModal = createAction("close_modal");
export const notifyError = createAction<string>("error");
export const addAppointment =
  createAction<AppointmentEntity>("add_appointment");
export const changeName = createAction<string>("change_name");

// reducer
export const calendarReducer = createReducer(calendarState(), (builder) => {
  builder
    .addCase(openModal, (state, action: ReduxAction) => {
      state.isModalOpen = true;
      state.day = action.payload;
      console.log("data: ", action.payload);
    })
    .addCase(closeModal, (state) => {
      state.isModalOpen = false;
      state.day = "";
      state.name = "";
      state.error = "";
    })
    .addCase(changeName, (state, action) => {
      state.name = action.payload;
    })
    .addCase(notifyError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(addAppointment, (state, action) => {
      state.isModalOpen = false;
      state.name = "";

      const list = defaultTo([], prop(action.payload.date, state.appointments));
      state.appointments = {
        ...state.appointments,
        [action.payload.date]: [...list, action.payload],
      };
    });
});
