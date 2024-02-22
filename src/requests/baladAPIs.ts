import axios from 'axios'
import { PlaceBaseSearchArgs } from "../controllers/app.controller";
const BASE_URL = 'https://search.raah.ir/v6/'



export async function AddresToCoordinate({latitude, longitude, searchTerm, polygon, zoom}:PlaceBaseSearchArgs) {
    const response = await axios.get(`${BASE_URL}?text=${searchTerm}&polygon=${polygon}&zoom=${zoom}&camera=${longitude},${latitude}`)
    return response.data
    
} 