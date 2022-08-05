import MarkdownIt from "markdown-it";
import metadata_block from "markdown-it-metadata-block";
import yaml from "yaml";
import { Node, Edge } from "react-flow-renderer";

import { RawMdDataType } from "./commonApiUtils";

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

export const rawMdToFlow = (mdList) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let y = 25;
  let counter = 0;
  for (const md of mdList) {
    counter++;
    const { prereq, title, id } = md?.meta;
    nodes.push({
      id,
      data: { label: title },
      position: { x: counter % 2 == 0 ? 250 : 100, y },
    });
    y += 100;

    if (Array.isArray(prereq)) {
      prereq.forEach((req) => {
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
