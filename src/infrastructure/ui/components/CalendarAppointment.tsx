import styled from "styled-components";
import { NEON_GREEN } from "../constants/color";

export const CalendarAppointment = styled.li`
  background-color: ${NEON_GREEN};
  border-radius: 0.25rem;
  box-sizing: border-box;
  font-size: 0.8rem;
  margin: 0.5rem;
  padding: 0.125rem 0.5rem;

  &:hover {
    cursor: pointer;
  }
`;
