import React, { useState } from "react";
import Header from "./Header";
import List from "./List";
import Register from "./Register";
import Footer from "./Footer";
import "./styles/App.css";

export function App() {
  const [state, setState] = useState("list");
  return (
    <div className="App">
      <Header className="App-header" />
      {state === "list" ? (
        <List className="App-list" />
      ) : (
        <Register className="App-register" />
      )}
      <Footer className="App-footer" />
    </div>
  );
}

export default App;
