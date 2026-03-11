import api from "./api";

export const createBot = async (botData) => {
  const res = await api.post("/bots", botData);
  return res.data;
};