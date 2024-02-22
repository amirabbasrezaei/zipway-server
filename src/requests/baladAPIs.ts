import axios from 'axios'
import { PlaceBaseSearchArgs } from "../controllers/app.controller";
const BASE_URL = 'https://search.raah.ir/v6/'



export async function AddresToCoordinate({latitude, longitude, searchTerm, polygon=[], zoom=0}:PlaceBaseSearchArgs) {
    try {
        const response = await axios.get(`${BASE_URL}?text=${searchTerm}&polygon=${polygon.length ? polygon.map((loc) => `${loc.x},${loc.y}`).join(',') : ""}&zoom=${zoom ? zoom : ""}&camera=${longitude},${latitude}`)
        return response.data
    } catch (error) {
        console.log(error)
    }

}

export async function coordinateToAddressBaladRequest({latitude, longitude}: any) {
    const response = await axios.get(`https://reverse-geocoding.raah.ir/v1?location=${longitude},${latitude}`)
    return response.data
}