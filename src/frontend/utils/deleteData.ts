import {getBackendURL} from "../../config/publicConfig";

const BASE_URL = getBackendURL()

async function deleteData<T>(PATH: string, data?: T):Promise<{data: T, errorID: number, error?: string}> {
  let res = await fetch(`${BASE_URL}/${PATH}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then();
  try {
    return await res.json();
  } catch(e) {
    return {
      data: null as any,
      error: 'Unable to parse JSON',
      errorID: -1 // Unknown client error
    };
  }
}


export default deleteData;