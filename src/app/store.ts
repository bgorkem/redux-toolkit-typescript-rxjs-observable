import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { Dispatch } from 'react-redux/node_modules/@types/react';
import counterReducer from '../features/counter/counterSlice';
import todosReducer from '../features/todos/todoSlice';

import { createEpicMiddleware } from 'redux-observable';

const loggerMiddleware = (store: any)=> (next: Dispatch<Action>)=>(action :Action)=> {
  console.log('dispatching', action, store.getState());
  let result = next(action);
  console.log('next state', store.getState());
  return result;
}

export const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer
  },

  middleware: (getDefaultMiddleware)=> { 
    const middlewares = getDefaultMiddleware();   
    return  middlewares.concat(loggerMiddleware,epicMiddleware) 
  } 
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

