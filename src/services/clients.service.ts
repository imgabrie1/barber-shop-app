/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";

export const getClients = async () => {
  const response = await api.get("/clients");
  return response.data;
};

export const createClient = async (data: any) => {
  const response = await api.post("/clients", data);
  return response.data;
};

export const updateClient = async (id: string, data: any) => {
  const response = await api.put(`/clients/${id}`, data);
  return response.data;
};

export const deleteClient = async (id: string) => {
  const response = await api.delete(`/clients/${id}`);
  return response.data;
};
