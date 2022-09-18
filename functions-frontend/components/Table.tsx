import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React from "react";

export default function CryptoDataGrid() {
  const columns = [
    { field: "market_cap_rank", headerName: "#", width: 50 },
    { field: "symbol", headerName: "Symbol", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "current_price",
      headerName: "Current Price",
      flex: 1,
    },
    {
      field: "price_change_percentage_24h",
      headerName: "% Change (24h)",
      flex: 1,
    },
    {
      field: "market_cap",
      headerName: "Market Cap",
      flex: 1,
    },
    {
      field: "market_cap_change_percentage_24h",
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
      <DataGrid
        rows={cryptoList}
        columns={columns}
        autoHeight
        disableSelectionOnClick
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20, 25, 50]}
        pagination
      />
      Prices are in USD. <br />
      Last updated: {timestamp}
    </div>
  );
}
