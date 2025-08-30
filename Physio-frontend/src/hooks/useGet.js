import { ApiFetchRequest } from "@/axios/apiRequest";


async function useGet (url){
    const response = await ApiFetchRequest(url)
    return {data : response?.data?.data, error : response.error, status : response.status}
}

export default useGet;