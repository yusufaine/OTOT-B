import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React from "react";

export default function CryptoDataGrid() {
  const columns = [
    { field: "market_cap_rank", type: "number", headerName: "#", width: 50 },
    { field: "symbol", type: "string", headerName: "Symbol", flex: 1 },
    { field: "name", type: "string", headerName: "Name", flex: 1 },
    {
      field: "current_price",
      type: "number",
      headerName: "Current Price",
      flex: 1,
    },
    {
      field: "price_change_percentage_24h",
      type: "number",
      headerName: "% Change (24h)",
      flex: 1,
    },
    {
      field: "market_cap",
      type: "number",
      headerName: "Market Cap",
      flex: 1,
    },
    {
      field: "market_cap_change_percentage_24h",
      type: "number",
      headerName: "% Change (24h)",
      flex: 1,
    },
  ];
  const [cryptoList, setCryptoList] = React.useState([]);
  const [timestamp, setTimestamp] = React.useState([]);
  const [pageSize, setPageSize] = React.useState<number>(10);

  const cgEndpoint =
    process.env.NEXT_PUBLIC_CG_FUNCTIONS_ENDPOINT ?? "endpoint not specified";
  const getList = () => {
    axios.get(cgEndpoint).then((res) => {
      setCryptoList(res.data.cg);
      setTimestamp(res.data.timestamp);
    });
  };

  React.useEffect(() => getList, []);

  return (
    <div
      style={{
        width: "90vh",
        margin: "auto",
        marginTop: "2rem",
      }}
    >
      <div className="flex flex-col cursor-pointer">
        <input
          type="button"
          value="Refresh list"
          onClick={getList}
          className="bg-neutral-300 px-5 py-1 border-l-neutral-900 rounded-lg text-neutral-900 pad cursor-pointer"
        />{" "}
        <br />
        <DataGrid
          components={{ Toolbar: GridToolbar }}
          rows={cryptoList}
          columns={columns}
          autoHeight
          disableSelectionOnClick
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20, 25, 50]}
          pagination
        />
      </div>
      Prices are in USD. <br />
      Last updated: {timestamp}
    </div>
  );
}
