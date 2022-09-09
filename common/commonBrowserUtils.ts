import MarkdownIt from "markdown-it";
import metadata_block from "markdown-it-metadata-block";
import yaml from "yaml";
import { Node, Edge } from "react-flow-renderer";

import { RawMdDataType } from "./commonApiUtils";
import { ROOT_CONTENT_PATH } from "./constants";
import { SyllabusStateContextType } from 'context/SyllabusContext';

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
  const updatedListChildren = renderedElementList.map((item) => { });

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



export const reMatchHeading = (toMatch: string) => {
  /**
   * [
   * '# Phase 1',
   * "## Week 1"
   * "### CSS"
   * "- borders"
   * ]
   * 
   */
  const matchRE = [
    ['phase', /^#\s/],
    ['week', /^##\s/],
    ['topic', /^###\s/],
    ['subject', /^-\s/]
  ];

  const matched = matchRE.filter((reArr) => {
    const [title, re] = reArr;
    // For some reason we're getting extra \n
    const match = toMatch.match(re);

    return !match ? false : title;
  });

  if (matched.length > 1) {
    throw new Error('Too many matches found, oops' + toMatch);
  }
  if (matched.length) {
    return matched[0][0];
  }

  return false;
}

export const getFileListFromSyllabus = (syllabus: string) => {
  const fileListFromSyllabus = syllabus.split('\r');
  return fileListFromSyllabus.reduce((acc, line) => {
    const headingMatch = reMatchHeading(line);
    if (headingMatch === 'subject') {
      return [...acc, `${line.replace('- ', '')}.md`];
    }
    return acc;
  }, []);
}

export type GetRenderFileListReturnType = {
  renderedMd: string;
  meta: MetaType;
  fileName: string;
  rawMd: string;
  week?: number;
}[]

export const getRenderFileList = async (): Promise<GetRenderFileListReturnType> => {
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

export const mergeSyllabusAndFileListToState = (syllabus, fileList) => {
  const syllabusArr = syllabus.split('\r');
  const resultState: SyllabusStateContextType = {
    phases: [],
    weekCapacity: 0,
    numberOfPhases: 0,
    weekPhaseAllocated: 0,
    fileList: [],
  };
  let currentPhase = 0;
  let currentWeek = 0;


  resultState.fileList = fileList;


  const cleanedSyllabusArr = syllabusArr.map(s => s.replace('\n', ''));
  cleanedSyllabusArr.forEach(str => {
    const heading = reMatchHeading(str);

    // Add phase related state
    if (heading === 'phase') {
      const headingNumber = str.match(/\d/);

      if (!headingNumber) {
        throw new Error('All Phases must have numbers in format: # Phase ${number}\n Received: ' + str);
      }
      currentPhase = parseInt(headingNumber[0]);
      resultState.numberOfPhases = currentPhase;
      resultState.phases.push({ numberOfWeeks: 0, description: '' });
    }

    // Add week related state
    else if (heading === 'week') {
      const headingMatch = str.match(/\d/);

      if (!headingMatch) {
        throw new Error('All Weeks must have numbers in format: # Week ${number}\n Received: ' + str);
      }
      const headingNumber = parseInt(headingMatch[0]);

      currentWeek = headingNumber;
      resultState.weekCapacity = headingNumber;
      resultState.weekPhaseAllocated = headingNumber;

      const updatePhase = resultState.phases;
      updatePhase[currentPhase - 1] = {
        ...updatePhase[currentPhase - 1],
        numberOfWeeks: updatePhase[currentPhase - 1].numberOfWeeks + 1
      };

      resultState.phases = [...updatePhase];
    }
    else if (heading === 'subject') {
      const subjectFileName = str.replace('- ', 'public/content/md/') + '.md';
      const fileIndex = resultState.fileList.findIndex(file => file.fileName == subjectFileName);
      const updateFileList = resultState.fileList;

      if (fileIndex > -1) {
        updateFileList[fileIndex] = {
          ...updateFileList[fileIndex],
          week: currentWeek
        }
      }

      resultState.fileList = [...updateFileList];
    }
  });
  return resultState;

}

export const getSyllabusState = async () => {
  const getSyllabus = await fetch('/content/Base/Syllabus.md')
    .then(r => r.text());
  const fileList = await getRenderFileList();
  // https://regex101.com/r/AIQf0C/1
  // Sourced from @CheesusCrustMan
  // const headingRE = /(?<week>## Week (?<weekNumber>\d)\n(?<weekContent>((?!#).*|\n)*))/gm;
  return mergeSyllabusAndFileListToState(getSyllabus, fileList);
}

export const rawJsonToFlow = async (jsonList) => {
  const flow = await buildFlow(jsonList, { source: "json" });

  return flow;
};

export const rawMdToFlow = (mdList) => {
  return buildFlow(mdList, { source: "md" });
};

export const renderedFileListToFlow = async (fileList) => {
  // const renderedFlow = await buildFlowWithNestedElements(fileList);
  const renderedFlow = await buildFlow(fileList, { source: "md" });

  return renderedFlow;
};
