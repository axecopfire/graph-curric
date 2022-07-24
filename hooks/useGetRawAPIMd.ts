import { useState, useEffect } from "react";

export default function useGetRawAPIMd(reload?: any) {
  const [md, setMd] = useState({});

  useEffect(() => {
    const getStaticMd = () =>
      fetch("/api/getStaticMd")
        .then((res) => res.json())
        .then(setMd);
    getStaticMd();
  }, [reload]);

  return [md, setMd];
}
