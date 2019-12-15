import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

// import { verify, decode } from 'jsonwebtoken'
import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
// import * as jwks from 'jwks-rsa'

const logger = createLogger('auth')
const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJJ9WFDYXyUlMvMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi1rbDcwamt0bi5hdXRoMC5jb20wHhcNMTkxMjExMTExNzE4WhcNMzMw
ODE5MTExNzE4WjAhMR8wHQYDVQQDExZkZXYta2w3MGprdG4uYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArM20VGvYdP+5JZoIUcKEpB6Y
wKqF9UYSf5byzceFIufiRXWQCN5zmrt7QS6da7OSSvS0GKiSBSr6GclaXqQsVCCu
IEio9cMggcZWSLdRsUE4lfzkZDk3FUmW9GLjjbajsLdWqqF+TJTKPu1T4q/clL5t
pLXlXn/MxpPTJsgLHKqsYbBbHZlKL2DSbbR1vNsZEgLjtg2JR9Cn1Ma2M2PcbBj/
C3VmQIcX37N5n17dh93ZNKJLTo7PobyokP6QSOOiBMyWk5B0as4q955oKXroq4yX
RNl3vaHEW+uabfiboHb4Lewc4hlfEq8Oy7a2P5AToN47REo6D80Yhv7ttTMOzwID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSFVPAlVnBWl1UWspDD
DCZ4cyAiKjAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAD5V0Bxk
GYXJaMtn+izlo5xOb31gkaBFIks09tWyK/pzEWa8BF7+guOYVW7Tcy5bvAdiLiOw
7Kc033ZGNJpond6KBbRZXYcIb7g74jeBwjinjDI25hNJf0fJAOnlje+cfw4NG3g1
uBQoFwEBzhSUpzC7yl7CI5CQkQvNYVNlHZZOrABseUK6JVhaa0M3ZWJF2MvAN79s
cZGG7laz+CPRIipivdhuP6xmpgMzWifTXcV7HJ5GFcbZhhAiz3TVKNh1LPsMgLce
iUzmyVYU00x99ewCRqKBFmRWmFfbz8H+0UHEVHWQZIWbq1TdsrPUwAxdcIIZwj45
cf3GDMnqGW1+tRo=
-----END CERTIFICATE-----
`
// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'https://dev-kl70jktn.auth0.com/.well-known/jwks.json'
// const client = jwks({
//   cache: true,
//   jwksUri: jwksUrl
// });

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt
  // var keys
  // logger.info("Calling the getSigningKey function")
  // client.getSigningKey(jwt.header.kid, (err, key: jwks.SigningKey) => {
  //   logger.info("In the getSigningKey callback function")
  //   keys = (key as jwks.CertSigningKey).publicKey || (key as jwks.RsaSigningKey).rsaPublicKey
  //   logger.info(err)
  //   logger.info(keys)
  // })
  // logger.info("After Calling the getSigningKey function")
  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
