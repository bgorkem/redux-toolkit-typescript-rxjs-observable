import { createAsyncThunk, createSlice, PayloadAction, nanoid, Action } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

// import { mapTo, filter, delay } from "rxjs/operators";
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

// export const pingEpic = (action$: Observable<Action>) =>
//   action$.pipe(
//     filter((action) => action.type === "PING"),
//     delay(100),
//     mapTo({ type: "PONG" })
//   );

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
      state.ping = state.ping + 1;
    },

    pong: (state, action) => {
      state.pong = state.pong + 1;
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

export const { addTodo, setNewTodo } = todosSlice.actions;

export default todosSlice.reducer;
