import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDoState } from '../atoms';
import Board from './Board';
import CreateBoard from './CreateBoard';
import { HelmetProvider, Helmet } from 'react-helmet-async';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  align-items: center;
`;

const CreateBoardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BoardContainer = styled.div`
  margin: auto;
  width: 100%;
  padding: 0 20px;
`;

const Boards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, auto));
  gap: 10px;
`;

const Delete = styled.div`
  margin-left: 30px;
  width: 30px;
  height: 30px;
  svg {
    fill: white;
    height: 30px;
    &:hover {
      transform: scale(1.1);
    }
  }
`;

function KanbanBoard() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;
    if (!destination) {
      return;
    }
    if (destination.droppableId === 'delete') {
      // 삭제
      setToDos((allBoards) => {
        const deleteItem = [...allBoards[source.droppableId]];
        deleteItem.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: deleteItem,
        };
      });
      return;
    }
    if (destination?.droppableId === source.droppableId) {
      // 같은 보드 안에서 이동
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      // 다른 보드로 이동
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Kanban board📋</title>
        </Helmet>
      </HelmetProvider>

      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <CreateBoardContainer>
            <CreateBoard />
            <Droppable droppableId="delete">
              {(provided) => (
                <Delete ref={provided.innerRef} {...provided.droppableProps}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z" />
                  </svg>
                  {provided.placeholder}
                </Delete>
              )}
            </Droppable>
          </CreateBoardContainer>

          <BoardContainer>
            <Boards>
              {Object.keys(toDos).map((boardId) => (
                <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
              ))}
            </Boards>
          </BoardContainer>
        </Wrapper>
      </DragDropContext>
    </>
  );
}
export default KanbanBoard;
