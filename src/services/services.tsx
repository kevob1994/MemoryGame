import axios from "axios";
import { History } from "../interfaces/interfaces";

//get lista de pokemons
export const getPokemonsApi = async () =>
    await axios.get("https://pokeapi.co/api/v2/pokemon?limit=9");

//get lista de historial
export const getHistoryApi = async () =>
    await axios.get("http://localhost:5000/api/history");

//post nuevo historial
export const postHistoryApi = async (historyObject: History) =>
    await axios.post(
        "http://localhost:5000/api/history",
        historyObject
    );
