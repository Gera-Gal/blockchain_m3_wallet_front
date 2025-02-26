import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const API_URL = `${process.env.API_BASE}/api`;  // URL completa

// Función para registrar un usuario
export const register = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, { username, password });
  return response.data;
};

// Función para iniciar sesión
export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data;
};

// Función para obtener todos los usuarios
export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

// Función para obtener los datos del usuario autenticado
export const getUserData = async (token: string) => {
  const response = await axios.get(`${API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Función para obtener la wallet del usuario
export const getWallet = async (token: string) => {
  const response = await axios.get(`${API_URL}/wallet`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Función para generar una nueva wallet para el usuario
export const generateWallet = async (token: string) => {
  const response = await axios.post(`${API_URL}/wallet`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Función para obtener los balances de una wallet (de base de datos)
export const getBalances = async (token: string) => {
  const response = await axios.get(`${API_URL}/wallet/balances`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Función para obtener los balances de una wallet
export const updateAndGetBalances = async (token: string) => {
  const response = await axios.get(`${API_URL}/wallet/update/balances`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Tipos de payload para la transferencia
type NativeTransferPayload = {
  private_key: string;
  to_address: string;
  amount: string;
  currency: string;  // Este campo solo se usa para tokens nativos
};

type TokenTransferPayload = {
  private_key: string;
  contract_address: string;
  to_address: string;
  amount: string;
};

type NftTransferPayload = {
  private_key: string;
  contract_address: string;
  to_address: string;
  token_id: string;
};

// Función para transferir tokens (acepta tanto tokens nativos como ERC20/multitokens)
export const transferTokens = async (
  token: string, 
  transferData: NativeTransferPayload | TokenTransferPayload | NftTransferPayload
) => {
  const response = await axios.post(`${API_URL}/transferir`, transferData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
