import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDoState } from '../atoms';

const FormContainer = styled.div`
  width: 350px;
  height: 100px;
  background-color: ${(props) => props.theme.boardColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin: 80px 0px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  h2 {
    margin-bottom: 10px;
    font-weight: 600;
  }
`;

const Form = styled.form`
  width: 80%;
  margin: 0px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
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

interface IAddBoard {
  board: string;
}

function CreateBoard() {
  const setBoard = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm();
  const onValid = ({ board }: IAddBoard) => {
    setBoard((allBoards) => {
      return {
        ...allBoards,
        [board]: [],
      };
    });
    setValue('board', '');
  };

  return (
    <FormContainer>
      <h2>Make your todo list</h2>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register('board', { required: true })}
          type="text"
          placeholder={`Add new todo list`}
        />
        <button>Add</button>
      </Form>
    </FormContainer>
  );
}

export default CreateBoard;
