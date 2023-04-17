import Head from "next/head";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/post");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  return (
    <>
      <Head>
        <title>MASTRSKY</title>
        <meta name="description" content="MASTRSKY app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
      </Head>
      <main className="flex justify-center items-center min-h-screen">
        <div className="max-w-lg min-h-[10rem] min-w-[30rem] flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
          <div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              MASTRSKY
            </h3>
            <p className="mt-2 text-gray-800 dark:text-gray-400"></p>
            <Link
              href="/api/auth/login"
              className="mt-3 inline-flex items-center gap-2 mt-5 text-sm font-medium text-blue-500 hover:text-blue-700"
            >
              ログイン
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
        </div>
      </main>
    </>
  );
};

export default Home;
