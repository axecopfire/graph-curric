import fs from 'fs';

function handler (req, res) {
    const mdFile = req.query.mdFile;

    fs.writeFileSync('public/content/Base/Syllabus.md', mdFile);

    return res.send('All good');
}

export default handler;