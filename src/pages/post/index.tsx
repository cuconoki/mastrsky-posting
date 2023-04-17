import Head from "next/head"
import Link from "next/link"

import type { NextPage } from "next"
import { GetServerSideProps } from "next"
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { useForm, SubmitHandler } from "react-hook-form"
import { useEffect } from "react"
import { Event } from "nostr-tools"
import useNostrHook from "@/hooks/useNostrHook"

type Props = {
  session: Record<string, unknown> | null
}

type FormData = {
  comment: string
  service: (string | boolean)[]
}

type NostRes = {
  event: Event | undefined
}

const services = ["Mastodon", "Nostr", "Bluesky"]

const PostPage: NextPage = () => {
  const { publishNostr } = useNostrHook()

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { isSubmitSuccessful, errors },
  } = useForm({ defaultValues: { comment: "", service: services } })

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ comment: "" })
    }
  }, [formState, reset])

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data)

    if (data.service.includes("Mastodon") === true) {
      const mastodonRes = await fetch("/api/mastodonPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: data.comment }),
      })
      console.log("Mastodon Postes")
    }
    if (data.service.includes("Nostr") === true) {
      const nostrRes = await fetch("/api/makeNostrEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: data.comment }),
      })
      const response: NostRes = await nostrRes.json()
      if (response.event) {
        publishNostr(response.event)
        console.log("Nostr Postes")
      }
    }
    if (data.service.includes("Bluesky") === true) {
      const bskyRes = await fetch("/api/bskyPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: data.comment }),
      })
      console.log("Bluesky Postes")
    }
  }

  return (
    <>
      <Head>
        <title>MASTRSKY</title>
        <meta name="description" content="MASTRSKY app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
      </Head>
      <main>
        <div className="max-w-2xl mx-auto p-2">
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              CROSPOST APP
            </span>
          </h1>
          <form className="max-w-2xl mx-auto" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <div className="px-2 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                <label htmlFor="comment" className="sr-only">
                  Your comment
                </label>
                <textarea
                  id="comment"
                  rows={8}
                  className="w-full p-2 text-base text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                  placeholder="今何してる？"
                  {...register("comment", { required: true })}
                />
              </div>

              <h2 className="border-t p-3 text-xs">投稿先</h2>
              <ul className="grid w-full gap-6 grid-cols-3 p-3 pt-0">
                {services.map((service, index) => (
                  <li key={service}>
                    <input
                      type="checkbox"
                      id={`service-${service}`}
                      value={service}
                      className="hidden peer"
                      {...register(`service.${index}`, {})}
                    />
                    <label
                      htmlFor={`service-${service}`}
                      className="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 hover:text-gray-600 peer-checked:text-white hover:bg-gray-50 peer-checked:bg-blue-600"
                    >
                      <div className="w-full text-sm font-semibold text-center">{service}</div>
                    </label>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-end px-3 py-2 border-t">
                <button
                  type="submit"
                  className="inline-flex items-center py-2 px-8 text-lg font-medium text-center text-white bg-purple-700 rounded-lg focus:ring-4 focus:ring-purple-200 hover:bg-purple-800"
                >
                  POST
                </button>
              </div>
            </div>
          </form>

          <Link
            href="/api/auth/logout"
            className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-700"
          >
            ログアウト
            <svg
              className="w-2.5 h-auto"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>
      </main>
    </>
  )
}

const getServerSideProps: GetServerSideProps<Props> = withPageAuthRequired<Props>({
  returnTo: "/",
  async getServerSideProps(ctx) {
    const session = await getSession(ctx.req, ctx.res)
    return {
      props: {
        session: JSON.parse(JSON.stringify(session)),
      },
    }
  },
})

export default PostPage
