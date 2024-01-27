import { Event, SimplePool } from "nostr-tools"
export const useNostrHook = () => {
  const publishNostr = async (event: Event) => {
    const pool = new SimplePool()
    const relays = [
      "wss://relay.snort.social",
      "wss://relay.damus.io",
      "wss://yabu.me",
      "wss://relay-jp.nostr.wirednet.jp",
      "wss://relay.nostr.wirednet.jp",
      "wss://nostr-relay.nokotaro.com",
    ]

    const pubs = await pool.publish(relays, event)
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
