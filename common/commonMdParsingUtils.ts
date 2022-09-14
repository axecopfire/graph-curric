
export const contentMdToNestedJSON = (rawMd) => {
    const folderSplitRE = /\n-\s/;
    const initialFolderWithoutNewLineRE = /-\s/;
    const fileSplitRE = /\n\s\s-\s/;

    return rawMd.split(folderSplitRE).reduce((acc, phase) => {
        // Trims remove the \r all over the place
        const fileList = phase.split(fileSplitRE).map((f) => f.trim());
        const folderName = fileList
            .shift()
            .replace(initialFolderWithoutNewLineRE, "");

        /**
         * An object that looks like
         * ```{
         *  [title]: ${content string}
         * }```
         */
        const fileObject = fileList.reduce((acc, file) => {
            // content looks like <title>\r\n-<content>
            const contentTitle = /.*/;
            const hasContentRE = /\n.*/;
            const title = file.match(contentTitle)[0].trim();
            const hasContent = file.match(hasContentRE);
            const removeTitle = file.replace(contentTitle, "").trim();

            return {
                ...acc,
                [title]: hasContent ? removeTitle : "",
            };
        }, {});

        return { ...acc, [folderName]: fileObject };
    }, {});
}