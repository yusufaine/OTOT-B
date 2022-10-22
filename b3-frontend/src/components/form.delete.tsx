import React from "react";
import { useForm } from "react-hook-form";

import { ContactSchema } from "../types/contact.models";
import { axiosInstance } from "../utils/axios.utils";

function Form() {
  const { register, handleSubmit, reset } = useForm<
    ContactSchema & { _id: string }
  >();
  const onSubmit = (data: ContactSchema & { _id: string }) => {
    axiosInstance
      .delete(`/api/contacts/${data._id}`)
      .then((value) => {
        reset();
        console.log(value);
      })
      .catch(() => `unable to delete ${data._id}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        id="ID"
        placeholder="id"
        {...register("_id", {
          required: true,
          minLength: { message: "Min length is 1", value: 1 },
        })}
      />
      <input type="submit" value={"Delete"} />
    </form>
  );
}

export default Form;
