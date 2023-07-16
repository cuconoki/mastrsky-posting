import { withApiAuthRequired } from "@auth0/nextjs-auth0"

import { BskyAgent, RichText } from "@atproto/api"
import * as fs from "fs"
import formidable from "formidable"
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

const agent = new BskyAgent({ service: "https://bsky.social" })

const login = async () => {
  try {
    const { success, data } = await agent.login({
      identifier: process.env.BSKY_AUTHOR as string,
      password: process.env.BSKY_PASSWORD as string,
    })
    return success ? data : null
  } catch {
    return null
  }
}

export default withApiAuthRequired(async (req, res) => {
  try {
    // POST 以外ならエラー
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

    const comment = fields.comment[0]
    const response = await login()

    const rt = new RichText({
      text: comment,
    })
    // リンクやメンションの自動検出・変換
    await rt.detectFacets(agent)
    const file = files.image as formidable.File[]
    if (response) {
      if (file) {
        console.log(fields.comment)
        const path = file[0].filepath || ""
        const name = file[0].originalFilename || ""
        const mime = file[0].mimetype || ""

        const img_buffer = fs.readFileSync(path)

        const resMedia = await agent.uploadBlob(img_buffer, {
          encoding: mime,
        })

        console.log(resMedia.data.blob.ref)
        console.log(resMedia.data.blob.mimeType)

        const resPost = await agent.app.bsky.feed.post.create(
          { repo: response.handle },
          {
            text: rt.text,
            createdAt: new Date().toISOString(),
            embed: {
              $type: "app.bsky.embed.images",
              images: [
                {
                  image: resMedia.data.blob,
                  alt: "",
                },
              ],
            },
          }
        )

        fs.rm(file[0].filepath, (err) => {
          if (err) {
            console.error(err.message)
          }
        })

        res.status(200).json({ body: "OK" })
      } else {
        const resPost = await agent.app.bsky.feed.post.create(
          { repo: response.handle },
          {
            text: rt.text,
            createdAt: new Date().toISOString(),
          }
        )
        res.status(200).json({ body: "OK" })
      }
    }
  } catch (error) {
    if (hasValueField(error)) {
      res.status(500).json({ message: error.message })
    }
  }
})
