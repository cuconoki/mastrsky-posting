import { getEventHash, Event, getSignature } from "nostr-tools"
import { withApiAuthRequired } from "@auth0/nextjs-auth0"

import type { NextApiRequest, NextApiResponse } from "next"
export default withApiAuthRequired(async function api(req: NextApiRequest, res: NextApiResponse) {
  if (req.body.comment) {
    const comment = req.body.comment
    const sk = process.env.NOSTR_SECRET as string
    const pk = process.env.NOSTR_PUB as string

    let event = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: comment,
      pubkey: pk,
    }

    const eventId = getEventHash(event)
    const eventSig = getSignature(event, sk)

    const signedEvent: Event = { ...event, id: eventId, sig: eventSig }

    res.json({ event: signedEvent })
  } else {
    res.json({ status: `NG` })
  }
})
