import { atom, selector } from 'recoil';

export interface ITodo {
  id: number;
  text: string;
}
interface IToDoState {
  [key: string]: ITodo[];
}

const getSaveToDos = localStorage.getItem('board');
const parseToDo = JSON.parse(getSaveToDos as any);

export const toDoState = atom<IToDoState>({
  key: 'todo',
  default: parseToDo !== null ? parseToDo : {},
  // default: {
  //   "To Do": [],
  //   Doing: [],
  //   Done: [],
  // },
});
