import {getBackendURL} from "../../config/publicConfig";
const BASE_URL = getBackendURL();

async function postData<T>(PATH: string, data: any): Promise<{ data: T, error: string, errorID: number}> {
  let res = await fetch(`${BASE_URL}/${PATH}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  return await res.json();
}


export default postData;