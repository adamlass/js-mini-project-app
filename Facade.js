const URI = "https://pm2.adamlass.com"
import {makeOptions, handleHttpErrors} from "./utils/FacadeUtils"

class Facade {
    async login(body){
        try{
            const res = await fetch(URI + "/api/login", makeOptions("POST", body))
            console.log("status:",res.status)
            const content = await handleHttpErrors(res)
            console.log("content", content)
            return content
            
        } catch (err){
            console.log("Error: ",err)
            throw err
        }
    }
}

export default new Facade()