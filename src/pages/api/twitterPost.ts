import { withApiAuthRequired } from "@auth0/nextjs-auth0"

import { TwitterApi } from 'twitter-api-v2';

export default withApiAuthRequired(async (req, res) => {
  console.log(req.body.comment)
  if (req.body.comment) {
    const comment = req.body.comment

    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY as string,
      appSecret: process.env.TWITTER_API_KEY_SECRET as string,
      accessToken: process.env.TWITTER_ACCESS_TOKEN as string,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
    });
    const { data: createdTweet } = await client.v2.tweet({"text": comment});
    // console.log('Tweet', createdTweet.id, ':', createdTweet.text);
    res.json({ status: `OK` })
  } else {
    res.json({ status: `NG` })
  }
})
