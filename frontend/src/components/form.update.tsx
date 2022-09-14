import React from "react";
import { useForm } from "react-hook-form";

import { ContactSchema } from "../types/contact.models";
import { axiosInstance } from "../utils/axios.utils";

function Form() {
  const { register, handleSubmit, reset } = useForm<
    ContactSchema & { _id: string }
  >();
  const onSubmit = async (data: ContactSchema & { _id: string }) => {
    const curr = await axiosInstance.get<ContactSchema & { _id: string }>(
      `api/contacts/${data._id}`
    );

    if (!curr.data) {
      console.log(`unable to get ${data._id}`);
    }

    console.log(data);
    data.email = data.email ?? curr.data.email;
    data.gender = data.gender ?? curr.data.gender;
    data.name = data.name ?? curr.data.name;
    data.phone = data.phone ?? curr.data.phone;
    console.log(data);

    axiosInstance
      .patch(`api/contacts/${data._id}`, data)
      .then(() => reset())
      .catch(() => {
        console.log(`unable to update ${data._id} with`, data);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" id="ID" placeholder="ID" {...register("_id")} />
      <input type="text" id="name" placeholder="name" {...register("name")} />

      <input
        type="email"
        id="email"
        placeholder="email"
        {...register("email")}
      />

      <input
        type="text"
        id="gender"
        placeholder="gender"
        {...register("gender")}
      />

      <input
        type="tel"
        id="phone"
        placeholder="phone number"
        {...register("phone")}
      />

      <input type="submit" value={"Update"} />
    </form>
  );
}

export default Form;
