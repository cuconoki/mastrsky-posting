import { getSession } from "@auth0/nextjs-auth0";
import "websocket-polyfill";

import {
  getPublicKey,
  generatePrivateKey,
} from "nostr-tools";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

const sk = generatePrivateKey()
const pk = getPublicKey(sk)

console.log(sk)
console.log(pk)

export default withApiAuthRequired(async (req, res) => {
  const session = await getSession(req, res);
  res.json({ status: `Authenticated(${session?.user.name})` });
});
