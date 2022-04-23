import {Response, Request} from "express";

interface SystemBody<T> {
  errorID: number,
  error?: string
  data: T
}

export type SystemResponse<T> = Response<SystemBody<T>>

export type ENDPOINTS = {
  "auth/marketStock/:typeID" : {
    REQUEST: Request<ENDPOINTS["auth/marketStock/:typeID"]["REQUEST_PARAMS"]>
    REQUEST_PARAMS: {
      quantity: number;
      systemID: number;
      typeID: number;
    },
    RESPONSE_PARAMS: {

    }
  }
}