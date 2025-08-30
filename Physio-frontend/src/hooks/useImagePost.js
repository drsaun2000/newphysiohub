import { ApiPostRequest } from "@/axios/apiRequest";

const useImagePost = async (url, request) => {
    const response = await ApiPostRequest(url, request)
    if (response) {
        // Format the response data for /quizzes/upload API
        if (response.data && response.data.data && response.data.data.url) {
            response.data = `https://${response.data.data.url}`;
        }
        return { data: response.data, error: response.error, status: response.status }
    }
}

export default useImagePost;