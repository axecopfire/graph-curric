import MarkdownIt from "markdown-it";
import metadata_block from "markdown-it-metadata-block";
import yaml from "yaml";
import { MetaType, handleMetadata } from "./handleMeta";

type FlatDataType = Record<string, { meta: MetaType; markdown: string }>;
type RawDataType = Record<string, string>;

export const rawMdToFlatData = (rawMd: RawDataType): FlatDataType =>
  Object.entries(rawMd).reduce((acc, [fileName, file]) => {
    const meta = {};
    const md = new MarkdownIt().use(metadata_block, {
      parseMetadata: yaml.parse,
      meta,
    });

    const res = md.render(file);

    // .render updates the `meta` object but TS doesn't know that

    const sanitizedMetadata = handleMetadata(fileName, meta);

    return { ...acc, [fileName]: { meta: sanitizedMetadata, markdown: res } };
  }, {});

// TODO: Convert Flat data array to graph
export const flatDataToMetaGraph = (flatData: FlatDataType) => {
  return flatData;
};
