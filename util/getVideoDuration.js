import { getVideoDurationInSeconds } from 'get-video-duration';
import fs from 'fs';
import path from 'path';
import os from 'os';
import sanitize from 'sanitize-filename';

export async function extractDuration(file) {
    const tempPath = path.join(
        os.tmpdir(),
        `${Date.now()}_${sanitize(file.originalname)}`
    );
    fs.writeFileSync(tempPath, file.buffer);

    let duration;
    try {
        duration = await getVideoDurationInSeconds(tempPath); // in seconds (float)
    } catch (err) {
        console.error("Error extracting duration:", err);
        duration = null;
    }

    // Clean up temp file
    fs.unlinkSync(tempPath);

    return duration;
}
