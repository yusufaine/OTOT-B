import axios from "axios";
import { CoinGeckoAsset } from "./types";

export async function getCgData(): Promise<
  Record<string, Omit<CoinGeckoAsset, "symbol">>
> {
  const cgMap: Record<string, Omit<CoinGeckoAsset, "symbol">> = {};
  const { data } = await axios.get<CoinGeckoAsset[]>(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false"
  );

  if (!data) {
    throw new Error("uanble to get coingecko data");
  }

  for (const asset of data) {
    cgMap[asset.symbol] = {
      current_price: asset.current_price,
      id: asset.id,
      image: asset.image,
      market_cap: asset.market_cap,
      market_cap_change_24h: asset.market_cap_change_24h,
      market_cap_change_percentage_24h: asset.market_cap_change_percentage_24h,
      market_cap_rank: asset.market_cap_rank,
      name: asset.name,
      price_change_24h: asset.price_change_24h,
      price_change_percentage_24h: asset.price_change_percentage_24h,
    };
  }
  return cgMap;
}
