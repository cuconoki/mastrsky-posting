import { withApiAuthRequired } from "@auth0/nextjs-auth0";

import { login } from "masto";

export default withApiAuthRequired(async (req, res) => {
  console.log(req.body.comment);
  if (req.body.comment) {
    const comment = req.body.comment;

    const masto = await login({
      url: process.env.MASTODON_URL as string,
      accessToken: process.env.MASTODON_TOKEN as string,
    });

    const status = await masto.v1.statuses.create({
      status: comment,
      visibility: "public",
    });

    console.log(status.url);
    res.json({ status: `OK` });
  } else {
    res.json({ status: `NG` });
  }
});
