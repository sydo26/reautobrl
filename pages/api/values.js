import axios from 'axios'
import nc from "next-connect";
import cors from "cors";

const dexGuruAPI = axios.create({
  baseURL: 'https://api.dex.guru/v1/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': "application/json"
  },
  timeout: 5000,
})
const economiaAPI = axios.create({
  baseURL: 'https://economia.awesomeapi.com.br/json',
  headers: {
    'Content-Type': 'application/json',
    'Accept': "application/json"
  },
  timeout: 5000,
})

const handler = nc().use(cors()).get(async (req, res) => {
  const token = "0x4c79b8c9cb0bd62b047880603a9decf36de28344-bsc"

  const dex = await dexGuruAPI.get(`tokens/${token}`).catch(err => {

    console.log(err)
    return {
      statusCode: 500,
      error: 'Internal Server Error'
    }
  })



  const eco = await economiaAPI.get(`/all/usd`).catch(err => {
    return {
      statusCode: 500,
      error: 'Internal Server Error'
    }
  })

  if(dex.statusCode === 500 || eco.statusCode === 500) {
    return res.status(500).json(dex)
  }

  return res.status(200).json(
    {
      toReal: dex.data.priceUSD * eco.data.USD.high
    }
  )
})

export default handler 