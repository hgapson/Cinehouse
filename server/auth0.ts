import { expressjwt as jwt, GetVerificationKey } from 'express-jwt'
import { Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { JwtPayload } from 'jsonwebtoken'
import jwks from 'jwks-rsa'
import dotenv from 'dotenv'

dotenv.config()

const domainFromEnv = process.env.AUTH0_DOMAIN
const audience = process.env.AUTH0_AUDIENCE

if (!domainFromEnv) {
  throw new Error('Missing AUTH0_DOMAIN environment variable')
}

if (!audience) {
  throw new Error('Missing AUTH0_AUDIENCE environment variable')
}

const domain = domainFromEnv.startsWith('https://')
  ? domainFromEnv
  : `https://${domainFromEnv}`

const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${domain}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: audience,
  issuer: `${domain}/`,
  algorithms: ['RS256'],
})

export default checkJwt

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface JwtRequest<TReq = any, TRes = any>
  extends Request<ParamsDictionary, TRes, TReq> {
  auth?: JwtPayload
}
