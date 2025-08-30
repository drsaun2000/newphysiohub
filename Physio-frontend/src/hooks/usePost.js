import { ApiPostRequest } from "@/axios/apiRequest";

const usePost = async (url, request) => {
  try {
    const response = await ApiPostRequest(url, request);
    console.log('usePost - Full response:', response); // Debug log
    
    if (response) {
      // Check if it's a successful response
      const isSuccess = response.status === 200 || response.status === 201;
      
      return {
        data: isSuccess ? response.data.data : null,
        error: !isSuccess ? 
          (response.response?.data?.errorMessage?.message || response.data?.message || 'Request failed') 
          : null,
        status: response.status,
      };
    } else {
      return {
        data: null,
        error: 'No response received',
        status: null,
      };
    }
  } catch (error) {
    console.error('usePost - Error:', error);
    return {
      data: null,
      error: error.message || 'Network error',
      status: null,
    };
  }
};

export default usePost;
