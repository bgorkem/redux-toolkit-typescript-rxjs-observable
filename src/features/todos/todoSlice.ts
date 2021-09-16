import { createAsyncThunk, createSlice, PayloadAction, nanoid, Action } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import { of } from "rxjs";
import { mapTo, map, filter, delay } from "rxjs/operators";
import { Observable } from "rxjs";

export type Todo = {
  text: string;
  id: string;
  createdAt: string;
};

export interface TodosState {
  todos: Todo[];
  newTodo: string;
  ping: number;
  pong: number;
}

const initialState: TodosState = {
  todos: [],
  newTodo: "",
  ping: 0,
  pong: 0,
};

let start = Date.now();

export const addTodoAsync = createAsyncThunk("todos/addTodoAsync", async (text: string) => {
  const response = await fetch(`https://reqres.in/api/users`, {
    method: "POST",
    body: JSON.stringify({
      name: text,
      job: "xxx",
    }),
  });

  const data = (await response.json()) as { id: string; createdAt: string };
  return { id: data.id, text, createdAt: data.createdAt };
});

export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
      },

      prepare: (text: string) => {
        return { payload: { id: nanoid(), text, createdAt: new Date().toISOString() } };
      },
    },

    ping: (state, action) => {
      state.ping = action.payload;
    },

    pong: (state, action) => {
      state.pong = Date.now() - start;
    },

    setNewTodo: (state, action) => {
      state.newTodo = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(addTodoAsync.fulfilled, (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    });
  },
});

export const selectTodos = (state: RootState) => state.todos;

export const { addTodo, setNewTodo, ping } = todosSlice.actions;

// More examples here: https://www.freecodecamp.org/news/beginners-guide-to-rxjs-redux-observables/
// example of an observable watching for ping action to reply with pong..
export const pingEpic = (action$: Observable<Action>) =>
  action$.pipe(
    filter(ping.match),
    delay(1000),
    map((a) => {
      const k = a as PayloadAction<number>;
      return { type: "todos/pong", payload: k.payload };
    })
  );

export default todosSlice.reducer;
