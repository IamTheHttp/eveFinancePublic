import {Request, Response} from "express";
import {JWTResponse} from "../../../dataSources/ESI/SSO/interfaces/IJWTResponse";
import {logger} from "../../../utils/logger/logger";
import convertCodeToTokens from "../../../dataSources/ESI/SSO/convertCodeToTokens";
import verify from "../../../dataSources/ESI/SSO/verify";
import {IVerifiedSSOData} from "../interfaces/IVerifiedSSOData";




export async function getVerifiedDataFromSSORequest(req: Request, res: Response): Promise<IVerifiedSSOData> {
  const code: string = req.query.code as string;
  logger.info('System - new incoming sso token');
  let err = false

  // Verify the token and extract CCP characterData
  const JWTData = <JWTResponse>await convertCodeToTokens(code);
  logger.info('System - Converted access code to JWTData');

  const characterData = await verify(JWTData.access_token).catch(() => {
    // Could not parse JSON response in verify()
    // TODO Should we send a proper error in this case?
  });

  if (characterData) {
    return {
      data: characterData,
      isError: false,
      JWTData
    }
  } else {
    return {
      data: {},
      isError: true,
      JWTData
    }
  }
}