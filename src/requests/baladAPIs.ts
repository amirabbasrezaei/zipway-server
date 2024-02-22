import axios from 'axios'
import { PlaceBaseSearchArgs } from "../controllers/app.controller";
const BASE_URL = 'https://search.raah.ir/v6/'



export async function AddresToCoordinate({latitude, longitude, searchTerm, polygon=[], zoom=0}:PlaceBaseSearchArgs) {
    try {
        const response = await axios.get(`${BASE_URL}?text=${searchTerm}&polygon=${polygon.length ? polygon.map((loc) => `${loc.x},${loc.y}`).join(',') : ""}&zoom=${zoom ? zoom : ""}&camera=${longitude},${latitude}`)
        console.log(polygon.map((loc) => `${loc.x},${loc.y}`))
        console.log(response.data.results[0].geometry)
        return response.data
    } catch (error) {
        // console.log(error)
    }
    
    
    
} 