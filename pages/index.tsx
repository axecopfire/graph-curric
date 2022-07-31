import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React from "react";
import useGetAPIMarkdownOnLoad from "../hooks/useGetRawAPIMd";
import useRenderRawMd from "../hooks/useRenderRawMd";
import Flow from "../components/Flow";

export default function Home() {
  const [apiMd] = useGetAPIMarkdownOnLoad();
  const [renderedMd] = useRenderRawMd(apiMd);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div
          style={{
            width: "50vw",
            height: "250px",
            border: "2px solid gray",
            borderRadius: "10px",
          }}
        >
          <Flow />
        </div>
        <pre>{JSON.stringify(renderedMd, null, 4)}</pre>
        {Object.keys(renderedMd).map((md, i) => (
          <div
            style={{
              border: "2px solid lightgray",
              padding: "10px",
              margin: "10px",
            }}
            dangerouslySetInnerHTML={{ __html: renderedMd[md].markdown }}
            key={i}
          ></div>
        ))}
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.js</code>
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
