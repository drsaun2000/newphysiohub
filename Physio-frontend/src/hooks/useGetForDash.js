import { ApiFetchRequest } from "@/axios/apiRequest";


async function useGetForDash (url){
    const response = await ApiFetchRequest(url)
    
    return {data : response, error : response.error, status : response.status}
}

export default useGetForDash;