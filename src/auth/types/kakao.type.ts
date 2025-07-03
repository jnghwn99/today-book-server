export interface KakaoTokenRequest {
  grant_type: string;
  code: string;
  client_id: string;
  redirect_uri: string;
  client_secret: string;
}

export interface KakaoTokenResponse {
  token_type: string;
  access_token: string;
  id_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope?: string;
}

export interface KakaoIdTokenPayload {
  iss: string;
  aud: string;
  sub: string;
  iat: number;
  exp: number;
  auth_time: number;

  nonce: string;
  nickname: string;
  picture: string;
  email: string;
}
