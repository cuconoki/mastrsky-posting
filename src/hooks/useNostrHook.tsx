import { Event, SimplePool } from "nostr-tools"
export const useNostrHook = () => {
  const publishNostr = async (event: Event) => {
    const pool = new SimplePool()
    const relays = [
      "wss://nostr.fediverse.jp",
      "wss://relay.damus.io",
      "wss://nostr.h3z.jp",
      "wss://relay-jp.nostr.wirednet.jp",
      "wss://relay.nostr.wirednet.jp",
    ]

    const pubs = pool.publish(relays, event)
    pubs.on("ok", () => {
      console.log(`has accepted our event`)
    })
    pubs.on("failed", (reason: string) => {
      console.log(`failed to publish: ${reason}`)
    })
    pool.close(relays)
  }

  return { publishNostr }
}

export default useNostrHook
