import fs from 'fs';
import path from 'path';
import Jimp = require('jimp');

// validate_URL
// helper function to validate that the given string is a valid to image URL 
export function validate_URL(url: string): boolean {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '\\.(gif|jpe?g|tiff?|png|webp|bmp)' + // image file extension
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(url);
}

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
    return new Promise(async resolve => {
        const photo = await Jimp.read(inputURL);
        const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
        await photo
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
            .greyscale() // set greyscale
            .write(path.join(__dirname, outpath), (img) => {
                resolve(path.join(__dirname, outpath));
            });
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles() {
    const temp_dir_path = path.join(__dirname, '/tmp/')
    const files = fs.readdirSync(temp_dir_path)
        .map(p => temp_dir_path + p)

    for (let file of files) {
        fs.unlinkSync(file);
    }
}