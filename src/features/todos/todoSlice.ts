import { createSlice, PayloadAction, nanoid, Action, createAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import { map, mergeMap, filter, delay, catchError, startWith } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
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
  pending: boolean;
  error?: string;
}

const initialState: TodosState = {
  todos: [],
  newTodo: "",
  ping: 0,
  pong: 0,
  pending: false,
};

let start = Date.now();

// export const addTodoAsync = createAsyncThunk("todos/addTodoAsync", async (text: string) => {
//   const response = await fetch(`https://reqres.in/api/users`, {
//     method: "POST",
//     body: JSON.stringify({
//       name: text,
//       job: "xxx",
//     }),
//   });

//   const data = (await response.json()) as { id: string; createdAt: string };
//   return { id: data.id, text, createdAt: data.createdAt };
// });

export const addTodoAsync = createAction<string>("todos/addTodoAsync");

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

    addTodoAsyncFulfilled: (state, action: PayloadAction<Todo>) => {
      state.pending = false;
      state.todos.push(action.payload);
    },

    addTodoAsyncPending: (state) => {
      state.pending = true;
    },

    addTodoAsyncFailed: (state, action: PayloadAction<Error>) => {
      state.pending = false;
      state.error = action.payload.message;
    },

    ping: (state, action) => {
      state.ping = action.payload;
    },

    pong: (state) => {
      state.pong = Date.now() - start;
    },

    setNewTodo: (state, action) => {
      state.newTodo = action.payload;
    },
  },
});

export const selectTodos = (state: RootState) => state.todos;

export const { addTodo, setNewTodo, ping, addTodoAsyncFulfilled, addTodoAsyncFailed, addTodoAsyncPending } =
  todosSlice.actions;

// More examples here: https://www.freecodecamp.org/news/beginners-guide-to-rxjs-redux-observables/
// example of an observable watching for ping action to reply with pong..
export const pingEpic = (action$: Observable<Action>): Observable<PayloadAction<unknown>> =>
  action$.pipe(
    filter(ping.match),
    delay(1000),
    map((a) => {
      const k = a as PayloadAction<number>;
      return { type: "todos/pong", payload: k.payload };
    })
  );

const x = addTodoAsyncPending();

export const addTodoAsyncEpic = (action$: Observable<Action>): Observable<PayloadAction<any>> =>
  action$.pipe(
    filter(addTodoAsync.match),
    mergeMap((requestAction) =>
      ajax
        .post(
          "https://reqres.in/api/users",
          JSON.stringify({
            name: requestAction.payload,
          })
        )
        .pipe(
          map((ajaxResponse) => {
            const data = ajaxResponse.response as { id: string; createdAt: string };
            return addTodoAsyncFulfilled({ id: data.id, text: requestAction.payload, createdAt: data.createdAt });
          }),
          catchError((err) => of(addTodoAsyncFailed(err))),
          startWith(addTodoAsyncPending())
        )
    )
  );

export default todosSlice.reducer;
