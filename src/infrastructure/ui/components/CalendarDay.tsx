import styled from "styled-components";
import { GOLD } from "../constants/color";

export const CalendarDay = styled.div`
  border: 1px solid black;
  box-sizing: border-box;
  display: inline-block;
  height: 8rem;
  vertical-align: top;
  width: 8rem;

  &:hover  {
    background-color: ${GOLD};
  }
`;
