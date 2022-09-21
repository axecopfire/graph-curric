import { SyllabusStateContextType } from 'context/SyllabusContext';
import { getRenderFileList } from 'common/commonBrowserUtils'


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


export const getSyllabusState = async (selectedSyllabus) => {
    const getSyllabus = await fetch(selectedSyllabus)
        .then(r => r.text());
    const fileList = await getRenderFileList();
    // https://regex101.com/r/AIQf0C/1
    // Sourced from @CheesusCrustMan
    // const headingRE = /(?<week>## Week (?<weekNumber>\d)\n(?<weekContent>((?!#).*|\n)*))/gm;
    return { syllabusText: getSyllabus, fileList };
}