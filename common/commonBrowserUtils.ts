import MarkdownIt from "markdown-it";
import metadata_block from "markdown-it-metadata-block";
import yaml from "yaml";
import { MetaType, handleMetadata } from "./handleMeta";

type FlatDataType = Record<string, { meta: MetaType; markdown: string }>;

export const renderRawMd = (rawMdList: RawMdDataType) => {
  const result = rawMdList.map((md) => {
    return "hi";
    const meta = {};
    const mdIt = new MarkdownIt().use(metadata_block, {
      parseMetadata: yaml.parse,
      meta,
    });
    // const sanitizedMetadata = handleMetadata(md.fileName, meta);
    // // .render updates the `meta` object but TS doesn't know that
    // const renderedMd = mdIt.render(md.markdown);
    // return { ...md, renderedMd, meta: sanitizedMetadata };
  });
  console.log(result);
};
