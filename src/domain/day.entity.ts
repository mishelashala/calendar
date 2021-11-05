import { v4 as uuidv4 } from "uuid";

export type DayEntity = {
  id: string;
  content: number;
};

export const day = (content: number): DayEntity => {
  return {
    id: uuidv4(),
    content,
  };
};
