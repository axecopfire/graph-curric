import { useState, useEffect } from "react";

export default function useGetAPIMarkdownOnLoad() {
  const [md, setMd] = useState();

  useEffect(() => {
    const getStaticMd = () =>
      fetch("/api/getStaticMd")
        .then((res) => res.json())
        .then(setMd);
    getStaticMd();
  }, []);

  return [md, setMd];
}
