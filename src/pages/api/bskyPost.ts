import { withApiAuthRequired } from "@auth0/nextjs-auth0";

import { BskyAgent } from "@atproto/api";

export default withApiAuthRequired(async (req, res) => {
  console.log(req.body.comment);
  if (req.body.comment) {
    const comment = req.body.comment;
    const agent = new BskyAgent({ service: "https://bsky.social" });
    const login = async () => {
      try {
        const { success, data } = await agent.login({
          identifier: process.env.BSKY_AUTHOR as string,
          password: process.env.BSKY_PASSWORD as string,
        });
        return success ? data : null;
      } catch {
        return null;
      }
    };
    const response = await login();
    if (response) {
      const resPost = await agent.app.bsky.feed.post.create(
        { repo: response.handle },
        {
          text: comment,
          createdAt: new Date().toISOString(),
        }
      );
    }
    res.json({ status: `OK` });
  } else {
    res.json({ status: `NG` });
  }
});
