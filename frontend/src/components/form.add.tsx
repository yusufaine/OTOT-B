import React from "react";
import { useForm } from "react-hook-form";

import { ContactSchema } from "../types/contact.models";
import { axiosInstance } from "../utils/axios.utils";

function Form() {
  const { register, handleSubmit, reset } = useForm<ContactSchema>();
  const onSubmit = (data: ContactSchema) => {
    axiosInstance
      .post("/api/contacts", data)
      .then(() => reset())
      .catch(() => {
        console.log("unable to add contact", data);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        id="name"
        placeholder="name"
        {...register("name", {
          required: true,
          minLength: { message: "Min length is 1", value: 1 },
        })}
      />

      <input
        type="email"
        id="email"
        placeholder="email"
        {...register("email", {
          required: false,
          minLength: { message: "Min length is 1", value: 1 },
        })}
      />

      <input
        type="text"
        id="gender"
        placeholder="gender"
        {...register("gender", {
          minLength: { message: "Min length is 1", value: 1 },
        })}
      />

      <input
        type="tel"
        id="phone"
        placeholder="phone number"
        {...register("phone", {
          minLength: { message: "Min length is 1", value: 1 },
        })}
      />

      <input type="submit" value={"Add"} />
    </form>
  );
}

export default Form;
