import { getDate, getMonth, getYear } from "date-fns/fp";
import { isEmpty } from "lodash";
import { defaultTo, pipe, prop } from "lodash/fp";
import { v4 as uuidv4 } from "uuid";
import { UUID } from "./uuid";

const { Result } = require("crocks");

export type AppointmentText = string;

export type AppointmentEntity = {
  id: UUID;
  name: AppointmentText;
  date: string;
};

const isTooBig = (name: string) => name.length > 30;

const getSimplifiedDate = (date: Date) => {
  return `${getYear(date)}-${getMonth(date)}-${getDate(date)}`;
};

export const Appointment = (name: string, date: Date) => {
  if (isEmpty(name)) {
    return Result.Err("Name cannot be empty");
  }

  if (isTooBig(name)) {
    return Result.Err("Name cannot be larger than 30 characters");
  }

  if (!date) {
    return Result.Err("Date cannot be empty");
  }

  return Result.of({
    id: uuidv4(),
    date: getSimplifiedDate(date),
    name,
  });
};

export const getEventsByDay = (
  currentMonth: number,
  day: number,
  appointments: AppointmentEntity[]
) => {
  return pipe(
    prop(`${getYear(new Date())}-${currentMonth}-${day}`),
    defaultTo([])
  )(appointments);
};
