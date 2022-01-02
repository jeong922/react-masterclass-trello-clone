import { atom, selector } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

interface IToDoSate {
  [key: string]: ITodo[];
}

export const toDoState = atom<IToDoSate>({
  key: "todo",
  default: {
    "To Do": [],
    Doing: [],
    Done: [],
  },
});
