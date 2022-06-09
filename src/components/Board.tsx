import { useForm } from 'react-hook-form';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import DragabbleCard from './DraggableCard';
import { ITodo, toDoState } from '../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useEffect } from 'react';

const Wrapper = styled.div`
  width: 300px;
  padding: 10px 20px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? '#DEDEFF'
      : props.isDraggingFromThis
      ? '#898AB8'
      : 'transparent'};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  margin: 10px 0;
  border-radius: 5px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  input {
    width: 100%;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
  }
  button {
    background-color: #464555;
    color: white;
    border: none;
    padding: 6px;
    border-radius: 5px;
    margin-left: 10px;
    cursor: pointer;
  }
`;

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const setTodos = useSetRecoilState(toDoState);
  const saveToDo = useRecoilValue(toDoState);
  const { register, setValue, handleSubmit } = useForm();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setTodos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    setValue('toDo', '');
  };

  useEffect(() => {
    localStorage.setItem('board', JSON.stringify(saveToDo));
  }, [saveToDo]);

  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register('toDo', { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
        <button>Add</button>
      </Form>
      <Droppable droppableId={boardId}>
        {(provided, info) => (
          <Area
            isDraggingOver={info.isDraggingOver}
            isDraggingFromThis={Boolean(info.draggingFromThisWith)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DragabbleCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
              />
            ))}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
