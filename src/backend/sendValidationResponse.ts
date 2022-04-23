import {Response} from "express";
import {IServerValidationResult} from "./ServerValidations";

function sendValidationResponse(res: Response, validation: IServerValidationResult): void {
  res.send({
    data: {},
    error: validation.error,
    errorID: validation.errorID
  });
}

export {sendValidationResponse}