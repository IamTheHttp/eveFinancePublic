import {JWTResponse} from "../../dataSources/ESI/SSO/interfaces/IJWTResponse";
import {logger} from "../../utils/logger/logger";
import {refreshAccessTokenRequest} from "../../dataSources/ESI/SSO/refreshAccessTokenRequest";
import {CharacterAggregate} from "../../domains/characters/aggregates/CharacterAggregate";


interface IRefreshTokenResponse {
  isError: boolean;
  error: string;
  errorDescription: string;
}

export async function refreshCharacterAccessToken(charAgg: CharacterAggregate): Promise<IRefreshTokenResponse>  {
  let JWTData: JWTResponse;

  logger.info(`${charAgg.getChar().charName} - Attempting to refresh token`);
  const hasRefreshToken = typeof charAgg.getChar().sso.refreshToken === 'string';

  if (!hasRefreshToken) {
    logger.error(`${charAgg.getChar().charName} - Missing refresh token for character`);
    return {
      isError: true,
      error: 'Character has no refresh token set',
      errorDescription: ''
    }
  }

  // If stale, get a new token
  if (charAgg.getChar().isAccessTokenStale()) {
    logger.raise(`${charAgg.getChar().charName} - Sending refresh access token token request`);
    JWTData = <JWTResponse>await refreshAccessTokenRequest(charAgg.getChar().sso.refreshToken);
    if (JWTData && JWTData.access_token) {
      charAgg.setSSOConfig({
        accessTokenExpiration: new Date(Date.now() + (1000 * JWTData.expires_in)),
        accessToken: JWTData.access_token,
        refreshToken: JWTData.refresh_token
      });

      await charAgg.save();
      logger.raise(`${charAgg.getChar().charName} - New token created, Token expiration: ${charAgg.getChar().sso.accessTokenExpiration}`);
    } else {
      logger.error(`${charAgg.getChar().charName} - Could not generate a new access token ${JSON.stringify(JWTData)}`);
    }
  }

  if (JWTData && JWTData.error) {
    logger.error(`${charAgg.getChar().charName} - JWT Error, ${JSON.stringify(JWTData)}`);
    return {
      isError: true,
      error: JWTData.error,
      errorDescription: JWTData.error_description
    }
  }

  return {
    isError: false,
    error: '',
    errorDescription: ''
  }
}
