import React, { useState } from "react";
import Header from "./Header";
import { List } from "./List";
import Register from "./Register";
import Footer from "./Footer";
import "./styles/App.css";
import "./styles/modal.css";

export function App() {
  const [state, setState] = useState("regist");
  const [modalVisible, setModalVisible] = useState(false);
  const URL = "https://bitcruiserapi.onrender.com";
  // const URL = "http://localhost:8080";
  return (
    <div className="App">
      <Header className="App-header" />
      {state === "list" ? (
        <List className="App-list" URL={URL} />
      ) : (
        <Register
          className="App-register"
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          URL={URL}
        />
      )}
      <Footer className="App-footer" setState={setState} />
    </div>
  );
}

export default App;
