import fs from 'fs';
import { getFileList } from 'common/commonApiUtils';
import { ROOT_CONTENT_PATH } from 'common/constants';

export default async function handler(req, res) {
    // Syllabus definitions are determined by anything that's not a .md file.
    // The idea here is that all folders in the Base directory are curricula
    // TODO: Make further validations (Like ensure there's a Content.md and Syllabus.md in the folder)
    const syllabusList = await getFileList(`${ROOT_CONTENT_PATH}/Base/`).then(l => l.filter(name => name.slice(-3) !== '.md'));
    return res.send(syllabusList)
} 