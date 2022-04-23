export interface JWTResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  error?:string;
  error_description?:string;
}
