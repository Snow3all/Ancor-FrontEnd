import axios from 'axios';

export const axiosFetchAPI = async(data) => {
  try {
    const response = await axios({
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'true',
        'Authorization': `Bearer ${data.token}`
      },
      method: data.method,
      url: data.url,
      data: data.data
    })
    if(response.data) {
      return response.data
    } else {
      window.location.href = '/';
    }
  } catch(e) {
    return e
  }
}