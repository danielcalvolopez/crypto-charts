import { getCMCListings, getCMCQuote } from "@/server-actions/get-cmc-data"
import Header from "./Header"
import { CryptoOption } from "./CryptoSearch"

const HeaderWrapper = async () => {
  const { data, success } = await getCMCListings(5000)
  const { data: quote } = await getCMCQuote("BTC")

  // console.log(quote?.data.BTC[0])

  let cryptocurrencies: CryptoOption[] = []

  if (success && data?.data) {
    cryptocurrencies = data.data.map((crypto: any) => ({
      value: crypto.slug,
      label: crypto.name,
      symbol: crypto.symbol,
      rank: crypto.cmc_rank,
      id: crypto.id,
      logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
    }))
  }

  return <Header cryptocurrencies={cryptocurrencies} />
}

export default HeaderWrapper
