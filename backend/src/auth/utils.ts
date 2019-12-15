import { decode } from 'jsonwebtoken'
import { JwtHeader } from 'jsonwebtoken'
import { JwtPayload } from './JwtPayload'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}

export function parseKeyId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtHeader
  return decodedJwt.kid
}
