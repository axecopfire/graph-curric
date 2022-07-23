import { useEffect, useState } from "react";
import MarkdownIt from "markdown-it";
import metadata_block from "markdown-it-metadata-block";
import yaml from "yaml";

export default function useRenderRawMd(rawMd) {
  const [result, setResult] = useState({});

  useEffect(() => {
    const val = Object.entries(rawMd).reduce((acc, [fileName, file]) => {
      const meta = {};
      const md = new MarkdownIt().use(metadata_block, {
        parseMetadata: yaml.parse,
        meta,
      });

      const res = md.render(file);
      return { ...acc, [fileName]: { meta, markdown: res } };
    }, {});
    setResult(val);
  }, [rawMd]);

  return [result, setResult];
}
