import { useAppSelector, useAppDispatch } from "../../app/hooks";

import { addTodoAsync as addTodo, setNewTodo, ping } from "./todoSlice";

import style from "./Todos.module.css";
import { useEffect } from "react";

let start = Date.now();

const PING_INTERVAL = 3000;

export function Todos() {
  const state = useAppSelector((state) => state.todos);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const cancelInterval = setInterval(() => dispatch(ping(Date.now() - start)), PING_INTERVAL);
    return () => {
      clearTimeout(cancelInterval);
    };
  }, []);

  return (
    <div>
      Todos here
      <ul className={style.todoList}>
        {state.todos.map((t) => (
          <li key={t.id}>
            <span>
              {t.text} {t.createdAt}
            </span>
            <button>delete</button>
          </li>
        ))}
      </ul>
      <label htmlFor='input-todo'>New Todo: </label>
      <input
        id='input-todo'
        type='text'
        value={state.newTodo}
        onChange={(evt) => {
          dispatch(setNewTodo(evt.target.value));
        }}
      />
      <button onClick={() => dispatch(addTodo(state.newTodo))}>Add</button>
    </div>
  );
}
