/**
 * @file zip.service.js
 * @description Zip export service using archiver.
 * Compresses project file arrays/objects into streaming zip downloads.
 */

const archiver = require('archiver');
const { Readable } = require('stream');

/**
 * Generates a ZIP archive stream from project files according to stack layout.
 * @param {Object|Array} files - Project files map (filename -> content) or array of {path, content}.
 * @param {string} stack - Active stack identifier ("vanilla" | "react-tailwind").
 * @returns {import('stream').Readable} Readable stream of the generated ZIP archive.
 */
function createProjectZipStream(files, stack) {
  const archive = archiver('zip', { zlib: { level: 9 } });

  // Convert files map to array if necessary
  const filesList = typeof files === 'object' && !Array.isArray(files)
    ? Object.entries(files).map(([path, content]) => ({ path, content }))
    : files;

  // Append each file to archive
  for (const file of filesList) {
    // Standardize leading slash removal
    const cleanPath = file.path.startsWith('/') ? file.path.substring(1) : file.path;
    archive.append(file.content, { name: cleanPath });
  }

  // Finalize the archive (returns a stream)
  archive.finalize();
  return archive;
}

module.exports = {
  createProjectZipStream,
};
