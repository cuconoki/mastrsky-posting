import { getSession } from "@auth0/nextjs-auth0"
import "websocket-polyfill"

import { getPublicKey, generatePrivateKey } from "nostr-tools"
import { withApiAuthRequired } from "@auth0/nextjs-auth0"

const sk = generatePrivateKey()
const pk = getPublicKey(sk)

console.log(sk)
console.log(pk)

import type { NextApiRequest, NextApiResponse } from "next"
export default withApiAuthRequired(async function api(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res)
  res.json({ status: `Authenticated(${session?.user.name})` })
})
