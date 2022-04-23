import {getBackendURL} from "../../config/publicConfig";
const BASE_URL = getBackendURL();

async function fetchData<T>(PATH: string):Promise<{data: T, errorID: number, error?: string}> {
  let res = await fetch(`${BASE_URL}/${PATH}`, {
    credentials: 'include'
  });

  let textBody = await res.text();
  try {
    let json = JSON.parse(textBody);
    return json;
  } catch (e) {
    return {
      data: null as any,
      error: 'Unable to parse JSON',
      errorID: -1 // Unknown client error
    };
  }
}


export default fetchData;