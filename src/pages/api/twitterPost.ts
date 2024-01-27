import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { TwitterApi } from "twitter-api-v2"
import * as fs from "fs"
import formidable from "formidable"
import type { NextApiRequest, NextApiResponse } from "next"

export const config = {
  api: {
    bodyParser: false,
  },
}

const hasValueField = (error: any): error is { message: any } => {
  if ("message" in error) {
    return true
  } else {
    return false
  }
}
export default withApiAuthRequired(async function api(req: NextApiRequest, res: NextApiResponse) {
  try {
    // POST 以外ならエラー
    console.log(req.method)
    if (req.method !== "POST") {
      throw new Error(`Invalid method [ ${req.method} ]`)
    }

    // formidable を利用して multipart リクエストボディを解析する
    const form = formidable({ multiples: true })

    // リクエストボディのパースが完了するのを待って、結果を　{ files, fields } で受け取る
    const { files, fields } = await new Promise<{ files: formidable.Files; fields: formidable.Fields }>(
      (resolve, reject) => {
        // リクエストボディのパースをする
        form.parse(req, (error, fields, files) => {
          // エラーなら reject する
          if (error) reject(error)

          // 得られたリクエストボディの内容を返して resolve する
          resolve({ files, fields })
        })
      }
    )
    if (!fields.comment) {
      res.status(500).json({ message: "no fields" })
      return
    }
    const comment = fields.comment[0]

    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY as string,
      appSecret: process.env.TWITTER_API_KEY_SECRET as string,
      accessToken: process.env.TWITTER_ACCESS_TOKEN as string,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
    })

    const file = files.image as formidable.File[]
    console.log(file)
    if (file) {
      console.log(fields.comment)
      const path = file[0].filepath || ""
      const name = file[0].originalFilename || ""
      const mime = file[0].mimetype || ""

      const img_buffer = fs.readFileSync(path)

      // const mediaId = await client.v1.uploadMedia(path)
      const mediaId = await client.v1.uploadMedia(img_buffer, { type: mime })

      const { data: createdTweet } = await client.v2.tweet({ text: comment, media: { media_ids: [mediaId] } })

      fs.rm(file[0].filepath, (err) => {
        if (err) {
          console.error(err.message)
        }
      })

      res.status(200).json({ body: "OK" })
    } else {
      const { data: createdTweet } = await client.v2.tweet({ text: comment })
      res.status(200).json({ body: "OK" })
    }

    // console.log('Tweet', createdTweet.id, ':', createdTweet.text);
  } catch (error) {
    if (hasValueField(error)) {
      res.status(500).json({ message: error.message })
    }
  }
})
