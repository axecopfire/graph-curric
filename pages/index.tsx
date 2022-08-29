import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React from "react";

import useHandleMd from "../hooks/useHandleMd";
import Flow from "../components/Flow";

export default function Home() {
  const { md, setMd } = useHandleMd();

  return (
    <div className={styles.container}>
      <Head>
        <title>A Graph visualizer based off of Markdown</title>
        <meta
          name="description"
          content="A Dynamic Graph Visualization built off of markdown"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Flow md={md} />
        {/* <pre>{JSON.stringify(md, null, 4)}</pre> */}
        {/* {Object.keys(renderedMd).map((md, i) => (
          <div
            style={{
              border: "2px solid lightgray",
              padding: "10px",
              margin: "10px",
            }}
            dangerouslySetInnerHTML={{ __html: renderedMd[md].markdown }}
            key={i}
          ></div>
        ))} */}
        <h1 className={styles.title}>Welcome to our Graph Editor!</h1>
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
