


import { useAppSelector, useAppDispatch } from '../../app/hooks';

import {addTodoAsync as addTodo, setNewTodo} from './todoSlice';

import style from './Todos.module.css';


export function Todos() {
    
    const state = useAppSelector(state=>state.todos);
    const dispatch = useAppDispatch();
    return (
        <div>
            Todos here
            <ul className={style.todoList}>
                {state.todos.map(t=>(<li key={t.id}><span>{t.text} {t.createdAt}</span><button>delete</button></li>))}
            </ul>

            <label htmlFor="input-todo">New Todo: </label>
           
            <input id="input-todo" type='text' value={state.newTodo} onChange={(evt)=>{
                dispatch(setNewTodo(evt.target.value));
            }} />

            <button onClick={()=>dispatch(addTodo(state.newTodo))}>Add</button>
        </div>
    )
}


