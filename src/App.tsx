import React from "react";
import logo from "./logo.svg";
import { Todos } from "./features/todos/Todos";

import "./App.css";

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <Todos />
      </header>
    </div>
  );
}

export default App;
