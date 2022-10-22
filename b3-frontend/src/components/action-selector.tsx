import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import AddContactForm from "./form.add";
import DeleteContactForm from "./form.delete";
import UpdateContactForm from "./form.update";

export default function BasicSelect() {
  const [action, setAction] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAction(event.target.value as string);
    console.log(event.target.value);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ minWidth: 120, maxWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="select-label">Action</InputLabel>
            <Select
              labelId="action-selector"
              id="action-selector"
              value={action}
              label="Action"
              onChange={handleChange}
            >
              <MenuItem value={"add"}>Add</MenuItem>
              <MenuItem value={"update"}>Update</MenuItem>
              <MenuItem value={"delete"}>Delete</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
      {action === "add" && <AddContactForm />}
      {action === "update" && <UpdateContactForm />}
      {action === "delete" && <DeleteContactForm />}
      {/* if (action === "add") {<AddContactForm />}
        if (action === "delete") {<DeleteContactForm />}
        if (action === "update") {<UpdateContactForm />} */}
    </div>
  );
}
