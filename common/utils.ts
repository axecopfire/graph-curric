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
    console.log(md);

    // .render updates the `meta` object but TS doesn't know that

    const sanitizedMetadata = handleMetadata(fileName, meta);

    return { ...acc, [fileName]: { meta: sanitizedMetadata, markdown: res } };
  }, {});

// const initialNodes = [
//   {
//     id: "1",
//     type: "input",
//     data: { label: "Input Node" },
//     position: { x: 250, y: 25 },
//   },

//   {
//     id: "2",
//     // you can also pass a React component as a label
//     data: { label: <div>Default Node</div> },
//     position: { x: 100, y: 125 },
//   },
//   {
//     id: "3",
//     type: "output",
//     data: { label: "Output Node" },
//     position: { x: 250, y: 250 },
//   },
// ];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3", animated: true },
];

// TODO: Convert Flat data array to graph
export const flatDataToMetaGraph = (flatData: FlatDataType) => {
  // const nodes = Object.keys(flatData).reduce((acc, md, i) => {
  //   // const;
  // }, []);

  return flatData;
};
