import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { NextRequest, NextResponse } from "next/server"
import { login } from "masto"
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
export default withApiAuthRequired(async (req, res) => {
  try {
    // POST 以外ならエラー
    if (req.method !== "POST") {
      throw new Error(`Invalid method [ ${req.method} ]`)
    }

    const masto = await login({
      url: process.env.MASTODON_URL as string,
      accessToken: process.env.MASTODON_TOKEN as string,
    })

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

    const file = files.image as formidable.File[]
    if (file) {
      console.log(fields.comment)
      const path = file[0].filepath || ""
      const name = file[0].originalFilename || ""
      const mime = file[0].mimetype || ""

      const img_buffer = fs.readFileSync(path)

      const blob = new Blob([img_buffer], { type: mime })

      const attachment = await masto.v2.mediaAttachments.create({
        file: blob,
        description: "Some image",
      })

      const status = await masto.v1.statuses.create({
        status: fields.comment[0],
        visibility: "public",
        mediaIds: [attachment.id],
      })

      fs.rm(file[0].filepath, (err) => {
        if (err) {
          console.error(err.message)
        }
      })
      res.status(200).json({ body: "OK", image: attachment.url })
    } else {
      const status = await masto.v1.statuses.create({
        status: fields.comment[0],
        visibility: "public",
      })
      res.status(200).json({ body: "OK" })
    }

    // console.log(status.url);
  } catch (error) {
    if (hasValueField(error)) {
      res.status(500).json({ message: error.message })
    }
  }
})
