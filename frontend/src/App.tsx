import React, { useState } from "react";
import axios from "axios";

import "./App.css";
import MuiTable from "./components/table";

function App() {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_API || "http://localhost:8080",
  });

  console.log(instance.getUri());

  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const addToList = () => {
    instance
      .post("/api/contacts", {
        email,
        gender,
        name,
        phone,
      })
      .catch(() => {});
  };

  const getList = () => {
    instance.get("/api/contacts");
  };

  return (
    <div className="App">
      <h1>Contacts Page</h1>

      <label htmlFor="name">Full name</label>
      <input
        type="text"
        name="name"
        id=""
        onChange={(event) => {
          event.preventDefault();
          setName(event.target.value);
        }}
      />

      <label htmlFor="email">Email</label>
      <input
        type="text"
        name="email"
        id=""
        onChange={(event) => {
          event.preventDefault();
          setEmail(event.target.value);
        }}
      />

      <label htmlFor="gender">Gender</label>
      <input
        type="text"
        name="gender"
        id=""
        onChange={(event) => {
          setGender(event.target.value);
        }}
      />

      <label htmlFor="contact">Contact</label>
      <input
        type="tel"
        name="contact"
        id=""
        onChange={(event) => {
          setPhone(event.target.value);
        }}
      />

      <button type="submit" onClick={addToList}>
        add
      </button>
      <button type="submit" onClick={getList}>
        List contacts
      </button>

      <h1>Contact List</h1>
      <MuiTable></MuiTable>
      {/* {contactList.map((val: ContactSchema, index) => {
        return (
          <div key={index}>
            <h2>
              {val.name}, {val.email}, {val.gender}, {val.phone}
            </h2>
          </div>
        );
      })} */}
    </div>
  );
}

export default App;
