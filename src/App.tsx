import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { pipe, range, reduce, map, filter } from "lodash/fp";
import { getDaysInMonth, getMonth, getYear } from "date-fns/fp";

import { DayEntity, day } from "./domain/day.entity";
import { CalendarName } from "./infrastructure/ui/components/CalendarName";
import { CalendarDay } from "./infrastructure/ui/components/CalendarDay";
import { When } from "./infrastructure/ui/components/When";
import {
  Appointment,
  AppointmentEntity,
  getEventsByDay,
} from "./domain/appointment.entity";
import { Modal } from "./infrastructure/ui/components/Modal/Modal";
import { ModalContainer } from "./infrastructure/ui/components/Modal/ModalContainer";
import { ModalClose } from "./infrastructure/ui/components/Modal/ModalClose";
import { ModalHeader } from "./infrastructure/ui/components/Modal/ModalHeader";
import { ModalTitle } from "./infrastructure/ui/components/Modal/ModalTitle";
import { ModalContent } from "./infrastructure/ui/components/Modal/ModelContent";
import { Button } from "./infrastructure/ui/components/Button";
import { Input } from "./infrastructure/ui/components/Input";
import {
  addAppointment,
  CalendarState,
  closeModal,
  notifyError,
  openModal,
} from "./appllication/calendar/calendar.reducer";
import { CalendarAppointment } from "./infrastructure/ui/components/CalendarAppointment";
import { CalendarAppointmentList } from "./infrastructure/ui/components/CalendarAppointmentList";

const either = require("crocks/pointfree/either");

const rangeToDays = (r: number[]) => map(day, r);

const generateDays = (r: number[], max: number): DayEntity[] => {
  return filter((day: DayEntity) => day.content <= max, rangeToDays(r));
};

const generateRows = (rowCount: number, days: number) =>
  pipe(
    range(0),
    reduce((acc: DayEntity[][], index: number) => {
      return [
        ...acc,
        generateDays(range(index * 7 + 1, (index + 1) * 7 + 1), days),
      ];
    }, [])
  )(rowCount);

function App() {
  const currentMonth = getMonth(new Date());
  const days = getDaysInMonth(new Date());
  const rowsCount = Math.ceil(days / 7);
  const rows = generateRows(rowsCount, days);
  const { isModalOpen, error, day, name, appointments } = useSelector(
    (state: CalendarState) => state
  );
  const dispatch = useDispatch();

  const handleClickClose = () => {
    dispatch(closeModal());
  };

  const handleClickDay = (day: number) => () => {
    dispatch(openModal(day));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const date = new Date(getYear(new Date()), currentMonth, parseInt(day, 10));
    const appointment = Appointment(name, date);

    either(
      (err: string) => {
        dispatch(notifyError(err));
      },
      (appointment: AppointmentEntity) => {
        console.log("appointment:", appointment);
        dispatch(addAppointment(appointment));
      }
    )(appointment);
  };

  const handleClickAppointment = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleClickShowMore = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div>
      <div>
        <CalendarName>Sunday</CalendarName>
        <CalendarName>Monday</CalendarName>
        <CalendarName>Tuesday</CalendarName>
        <CalendarName>Wednesday</CalendarName>
        <CalendarName>Thursday</CalendarName>
        <CalendarName>Friday</CalendarName>
        <CalendarName>Saturday</CalendarName>
      </div>

      {rows.map((row: DayEntity[], index: number) => {
        return (
          <div key={index}>
            {row.map((day) => {
              const events = getEventsByDay(
                currentMonth,
                day.content,
                appointments
              );

              return (
                <CalendarDay key={day.id} onClick={handleClickDay(day.content)}>
                  <>{day.content}</>
                  <CalendarAppointmentList>
                    {events
                      .filter(
                        (_app: AppointmentEntity, index: number) => index < 2
                      )
                      .map((event: AppointmentEntity) => {
                        return (
                          <CalendarAppointment
                            key={event.id}
                            onClick={handleClickAppointment}
                          >
                            {event.name}
                          </CalendarAppointment>
                        );
                      })}
                    <When predicate={events.length > 2}>
                      <CalendarAppointment onClick={handleClickShowMore}>
                        +{events.length - 2}
                      </CalendarAppointment>
                    </When>
                  </CalendarAppointmentList>
                </CalendarDay>
              );
            })}
          </div>
        );
      })}

      <When predicate={isModalOpen}>
        <Modal>
          <ModalContainer>
            <ModalHeader>
              <ModalTitle>Add an event</ModalTitle>
              <ModalClose tabIndex={1} onClick={handleClickClose}>
                x
              </ModalClose>
            </ModalHeader>
            <ModalContent>
              <form onSubmit={handleSubmit}>
                <Input
                  required={true}
                  name="text"
                  id="name"
                  placeholder="Event name"
                  value={name}
                  onChange={(event) => {
                    const name = event.target.value;
                    dispatch({
                      type: "change_name",
                      payload: name,
                    });
                  }}
                />
                <When predicate={error.length > 0}>
                  <p>{error}</p>
                </When>
                <Button>Add</Button>
              </form>
            </ModalContent>
          </ModalContainer>
        </Modal>
      </When>
    </div>
  );
}

export default App;
