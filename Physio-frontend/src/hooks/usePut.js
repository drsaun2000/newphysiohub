import { ApiPutRequest } from "@/axios/apiRequest";


async function usePut(url, request){
    const response = await ApiPutRequest(url, request)
    if (response) {
        return {
          data: response.status == 201 || response.status == 200 ? response.data.data : null,
          error: response.status !== 201 && response.status !== 200
          ? response.response.data.errorMessage.message : null,
          status: response.status,
        };
      }
}

export default usePut;