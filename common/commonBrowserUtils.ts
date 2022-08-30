import MarkdownIt from "markdown-it";
import metadata_block from "markdown-it-metadata-block";
import yaml from "yaml";
import { Node, Edge } from "react-flow-renderer";

import { RawMdDataType } from "./commonApiUtils";
import { ROOT_CONTENT_PATH } from "./constants";

export type MetaType = {
  title: string;
  prereq: string | string[];
};

export type MetaLike = Record<string, any>;

/**
 * Transforms Meta into standardized data format
 * @param fileName
 * @param meta
 * @returns Meta as MetaType
 */
export const transformMeta = (fileName: string, meta: MetaLike): MetaType => {
  // Convert all meta to lower case for added flexibility in Md definition
  const sanitizedMeta = Object.fromEntries(
    Object.entries(meta).map(([k, v]) => [k.toLowerCase(), v])
  ) as MetaLike;

  if (!isValidMetadata(sanitizedMeta))
    throw new Error(`Metadata for ${fileName} is malformed.`);

  if (sanitizedMeta?.prereq) {
    sanitizedMeta.prereq = sanitizedMeta.prereq.split(",");
  }

  return sanitizedMeta as MetaType;
};

export const isValidMetadata = (meta: MetaLike) => {
  const requiredProperties = ["title"];
  const metaHasReqProps = requiredProperties.filter((prop) => {
    const toTest = meta[prop];

    return !!toTest;
  });

  return metaHasReqProps.length === requiredProperties.length;
};

/**
 * Takes list of raw markdown strings and renders them returning renderedMd and meta object
 * @param rawMdList - API Returned Markdown
 * @returns
 */
export const renderRawMd = (rawMdList: RawMdDataType) => {
  return rawMdList.map((md) => {
    const meta = {};
    const mdIt = new MarkdownIt().use(metadata_block, {
      parseMetadata: yaml.parse,
      meta,
    });
    // .render creates the `meta` object
    const renderedMd: string = mdIt.render(md.rawMd);

    const sanitizedMetadata = transformMeta(md.fileName, meta);
    return { ...md, renderedMd, meta: sanitizedMetadata };
  });
};

type ConfigType = {
  source: "json" | "md" | "fileList";
};

export const buildFlow = async (dataList, config: ConfigType) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let y = 25;
  let counter = 0;
  for (const data of dataList) {
    counter++;
    let prereq, title, id;

    if (config.source === "md") {
      prereq = data?.meta.prereq;
      title = data?.meta.title;
      id = data?.meta.id;
    }
    if (config.source === "json") {
      prereq = data.prereqList.split(",");
      title = data.title;
      id = data.id;
    }

    nodes.push({
      id,
      data: { label: title },
      position: { x: counter % 2 == 0 ? 250 : 100, y },
    });
    y += 100;

    if (Array.isArray(prereq)) {
      prereq.forEach((req) => {
        if (!req || !id) return;
        edges.push({
          id: `e-${req}-${id}`,
          source: req,
          target: id,
          animated: true,
        });
      });
    }
  }

  const resp = await fetch(
    `/api/buildGraph?flow=${JSON.stringify({ nodes, edges })}`
  )
    .then((res) => res.json())
    .catch(console.error);

  return { nodes: resp.nodes, edges: resp.edges };
};

const getElementHeritage = (fileName) => {
  const sanitizedFilePath = fileName.replace(ROOT_CONTENT_PATH + "md/", "");
  const fpArr = sanitizedFilePath.split("/");
  const child = fpArr.pop();
  const parentId = fpArr.join("-");
  return { child, parentId };
};

export const buildFlowWithNestedElements = async (renderedElementList) => {
  const parentMap = new Map(); // TODO: Iterate through Map and append to result array
  const updatedListChildren = renderedElementList.map((item) => {});

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let y = 25;
  let counter = 0;

  for (const data of renderedElementList) {
    counter++;
    let prereq, title, id;

    prereq = data?.meta.prereq;
    title = data?.meta.title;
    id = data?.meta.id;
    const { parentId } = getElementHeritage(data.fileName);
    const parentIdExists = nodes.filter((node) => node.id === parentId);
    if (!parentIdExists.length) {
      nodes.push({
        id: parentId,
        type: "group",
        position: { x: 0, y: 0 },
        style: {
          width: 170,
          height: 140,
        },
        data: { label: parentId },
      });
    }
    const parentElement = nodes.filter((node) => node.id === parentId);

    // TODO: Make this work
    nodes.push({
      id,
      data: { label: title },
      parentNode: parentId,
      position: { x: counter % 2 == 0 ? 250 : 100, y },
    });
    y += 100;

    if (Array.isArray(prereq)) {
      prereq.forEach((req) => {
        if (!req || !id) return;
        edges.push({
          id: `e-${req}-${id}`,
          source: req,
          target: id,
          animated: true,
        });
      });
    }
  }
  return { nodes, edges };
};

export const getRenderFileList = async () => {
  const getMdFileList = await fetch("/api/getMdFileList").then((r) => r.json());

  const fileListToRender = getMdFileList.filter((filePath) =>
    filePath.includes("content/md/")
  );

  const staticMd = await fetch(
    `/api/getStaticMd?fileList=${JSON.stringify(fileListToRender)}`
  ).then((r) => r.json());
  const renderedMd = renderRawMd(staticMd);

  return renderedMd;
};

export const rawJsonToFlow = async (jsonList) => {
  const flow = await buildFlow(jsonList, { source: "json" });

  return flow;
};

export const rawMdToFlow = (mdList) => {
  return buildFlow(mdList, { source: "md" });
};

export const renderedFileListToFlow = async (fileList) => {
  console.log({ fileList });
  // const renderedFlow = await buildFlowWithNestedElements(fileList);
  const renderedFlow = await buildFlow(fileList, { source: "md" });

  return renderedFlow;
};
