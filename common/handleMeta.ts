export type MetaType = {
  title: string;
  prereq: string;
};

export type MetaLike = Record<string, string>;

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
  );

  if (!isValidMetadata(sanitizedMeta))
    throw new Error(`Metadata for ${fileName} is malformed.`);

  return sanitizedMeta as MetaType;
};

export const isValidMetadata = (meta: MetaLike) => {
  const requiredProperties = ["title"];
  const metaHasReqProps = requiredProperties.filter((prop) => {
    const toTest = meta[prop];
    console.log({ toTest, meta });
    return !!toTest;
  });

  return metaHasReqProps.length === requiredProperties.length;
};

//
export const handleMetadata = (fileName, meta: MetaLike) => {
  return transformMeta(fileName, meta);
};
