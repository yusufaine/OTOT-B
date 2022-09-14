import React from "react";

import "./App.css";
import AddContactForm from "./components/form.add";
import DeleteContactForm from "./components/form.delete";
import UpdateContactForm from "./components/form.update";
import MuiTable from "./components/table";

function App() {
  return (
    <div className="App">
      <h1>Contact List</h1>
      <MuiTable />
      <h1>Add Contacts</h1>
      <AddContactForm />
      <h1>Delete contacts</h1>
      <DeleteContactForm />
      <h1>Update contacts</h1>
      <UpdateContactForm />
    </div>
  );
}

export default App;
