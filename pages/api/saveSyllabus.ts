import fs from 'fs';

function handler(req, res) {
    const { fileContent, curriculum } = JSON.parse(req.body);

    fs.writeFileSync(curriculum, fileContent);

    return res.send('All good');
}

export default handler;