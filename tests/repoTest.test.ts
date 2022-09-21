import { renderRawMd } from 'common/commonBrowserUtils';
import { reMatchHeading, getFileListFromSyllabus } from 'components/Syllabus/syllabusBrowserUtils'
import { getStaticMd } from 'common/commonApiUtils';
import fs from 'fs';
// Validate format
// # Phase
// ## Week
// Content

// Ensure no content is under phase
// Ensure all content has links that work
// Ensure those files are renderable (empty rendered string not valid)
// Stretch: Check validity of prereq lists
// Call with: EXECUTION_ENV=test

const isFailed = (list) => {
    let failedTest = false;
    list.map((item) => {
        if (item.error.length) {
            failedTest = true;
        }
    });

    if (failedTest) console.log('TestFailures >', JSON.stringify(list, null, 4));
    return failedTest;
}

const contentFileExists = (fileName) => {
    const fp = 'public/content/md/' + fileName + '.md';
    try {
        fs.statSync(fp)
        return true;
    } catch (error) {
        return false;
    }
}

describe('Validate Syllabus', () => {
    let syllabus;
    let renderedFileList;
    beforeAll(async () => {
        syllabus = fs.readFileSync('public/content/Base/web-curriculum/Syllabus.md').toString();
        const syllabusFileList = getFileListFromSyllabus(syllabus);
        const staticMd = await getStaticMd('public/content/md/', syllabusFileList);
        renderedFileList = await renderRawMd(staticMd);

    })
    it('All lessons in syllabus have content and valid', async () => {

        const requiredMeta = [
            'title',
            'id',
        ]
        const fileResults = await Promise.all(
            renderRawMd(renderedFileList).reduce((acc, file) => {
                const result = {
                    fileName: file.fileName,
                    error: [],
                };
                if (!file.renderedMd) {
                    result.error.push({ statusCode: 204, message: "no rendered md" });
                }
                if (!file.meta) {
                    result.error.push({ statusCode: 400, message: "no metadata" });
                }
                requiredMeta.forEach(metaField => {
                    if (!file.meta[metaField]) {
                        result.error.push({ statusCode: 400, message: "metadata field missing: " + metaField });
                    }
                })
                return result.error.length ? [...acc, result] : acc;
            }, [])
        );

        let failedTest = isFailed(fileResults);


        expect(failedTest).toEqual(false);
    });

    it('Syllabus is properly formatted', () => {
        let inPhase = false;
        let inWeek = false;
        let lastHeading = '';
        let currentPhase = 0;
        let currentWeek = 0;
        const syllabusLines = syllabus.split('\r').map(l => l.replace('\n', ''));

        const results = syllabusLines.reduce((acc: any[], line) => {
            const result = {
                line,
                matchedSection: reMatchHeading(line),
                error: []
            }
            const addError = (message) => {
                result.error.push(message + ' ' + line);
            }
            const heading = result.matchedSection;
            if (heading === false) {
                addError('No heading was found')
            }

            if (heading === 'phase') {
                const headingMatch = line.match(/\d/);
                if (!headingMatch) {
                    addError('Phase must have a number')
                } else {
                    const headingNumber = parseInt(headingMatch[0]);

                    if (lastHeading === 'phase') {
                        addError("A Phase can't follow a phase");
                    }

                    if (currentPhase + 1 !== headingNumber) {
                        addError("Phases need to be sequential");
                    }
                    currentPhase = headingNumber;
                }

                inPhase = true;
                inWeek = false;
            }

            if (heading === 'week') {
                const headingMatch = line.match(/\d/);

                if (!headingMatch) {
                    addError('Week must have a number')
                } else {
                    const headingNumber = parseInt(headingMatch[0]);

                    if (!inPhase) {
                        addError('Week must be under a phase.')
                    }

                    if (currentWeek + 1 !== headingNumber) {
                        addError("Weeks need to be sequential");
                    }

                    currentWeek = headingNumber;
                }
                inWeek = true;
            }

            if (heading === 'subject') {
                if (!inPhase) {
                    addError('Content must be in a phase');
                }
                if (!inWeek) {
                    addError('Content must be in a week');
                }

                if (!contentFileExists(line.replace('- ', ''))) {
                    addError('File is missing for this lesson');
                }
            }

            return result.error.length ? [...acc, result] : acc;
        }, []);

        const failedTest = isFailed(results);
        expect(failedTest).toEqual(false);
    })
});


