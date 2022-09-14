import React from "react";

import "./App.css";
import SampleTable from "./components/table.sample";
import ActionSelector from "./components/action-selector";

function App() {
  return (
    <div className="App" style={{ padding: 30 }}>
      <h1>Contact List</h1>
      <SampleTable />
      <ActionSelector />
    </div>
  );
}

export default App;
