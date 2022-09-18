import type { NextPage } from "next";
import CryptoDataGrid from "../components/Table";

const Home: NextPage = () => {
  return (
    <div className="App" style={{ padding: 30 }}>
      <h1 className="text-xl font-bold text-center">
        Top 250 Cryptocurrencies by Market Cap
      </h1>
      <CryptoDataGrid />
    </div>
  );
};

export default Home;
