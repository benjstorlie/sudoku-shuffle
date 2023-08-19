/** 
 * @fileoverview (2023-08-18) Generates a markdown document with a list of the directory's folders and files, with links. You can include comments that will be saved on refresh.  
 * @author Ben J Storlie <benjstorlie@gmail.com> (http://benjstorlie.github.io)
 * Run `node dir.js` in the terminal to generate a markdown document with a list of your directory's contents, including links. Run it again to refresh.
 * In VSCode, clicking those links will either open the file, or open the folder in the explorer sidebar.
 * In the generated document, you can add comments by adding a colon and space after the file link.
 * *Comments must be all on one line*
 * When you refresh the document, the comments will be included.
 * If there are any comments that weren't included, due to a deleted file or change in file structure, those comments will go in a section at the top for you to handle manually.
 * Edit @see mdName to make a custom name for your generated document.
 * Edit @see ignore and @see ignoreContents to list files or folders to ignore
 * Since it writes the markdown from scratch each time, you can't add anything else to the document or it won't be saved on refresh.
 * @example [fileName](path/to/fileName): Comment here.
*/

const fs = require('fs').promises;
const path = require('path');

/**
 * Name to give the generated file. Do not include file extension.
 * @example 'directory_contents'
 */
const mdName = 'directory_contents';

/**
 * Files or directories to ignore.
 * - Can either be the file name, or its file path.  If a file name is included more than once in the directory, all entries will be ignored.
 * @type {string[]}
 */
const ignore = [
  '.git',
  'node_modules',
  'client/build',
  'LICENSE'
];

/**
 * Directories to include in the document, but whose contents are to be ignored.
 * - Can either be the file name, or its file path.  If a file name is included more than once in the directory, all entries will be ignored.
 * @type {string[]}
 */
const ignoreContents = [
  'client/public'
];

// Execute the main function
createMdFile('./',mdName);

// *********Function definitions*************

/**
 * Write the file
 * @param {string} path - File path to the root directory, most likely `'./'`.
 * @param {string} mdFileName - Name to give the generated file. Default is 'directory_contents'.
 * @returns {Promise<void>}
 */
async function createMdFile(path,mdFileName='directory_contents') {
  try {
    const generatedContent = await generateMd(path,mdFileName);
    await fs.writeFile(mdFileName+'.md', generatedContent);

    console.log('md file created successfully.');
  } catch {
    console.error('Error creating md file:', error);
  }
}

/**
 * Read the comments in the current file.  Returns an object with the file path as the key, and an object `{commentText:string,included:Boolean}` as the value.
 * @param {string} path - The file path to the markdown file to read.
 * @returns {Promise<{}>}
 */
async function readComments(path) {
  try {
    const content = await fs.readFile(path, 'utf8');
    const comments = {};

    const commentRegex = /- \[(.*?)\]\((.*?)\): (.*?)(\r?\n|$)/g;
    const matches = content.match(commentRegex);

    if (matches) {
      for (const comment of matches) {
        const match = comment.match(/- \[(.*?)\]\((.*?)\/?\): (.*?)(\r?\n|$)/);
        if (match) {
          const filePath = match[2].trim();
          const commentText = match[3].trim();
          comments[filePath] = {commentText, included: false};
        }
      }
    }

    return comments;
  } catch (error) {
    if (error.errno === -4058) {
      console.log('Creating new file.');
      return {};
    } else {
      console.log('Error reading comments', error);
      throw error
    }
  }
}

/**
 * Generate the markdown text to include in the generated file.  Includes comments, and a possible section for comments that weren't included in the new document due to a file structure change or deleted file.
 * @param {string} filePath - File path to the root directory, most likely `'./'`.
 * @param {string} mdFileName - Name to give the generated file. Default is 'directory_contents'.
 * @returns {Promise<string>}
 */
async function generateMd(filePath,mdFileName='directory_contents') {
  try {
    const comments = await readComments((filePath === './' ? '.': filePath)+'/'+mdFileName+'.md');

    /**
     * Recursive function to read directory contents, and generated the markdown text, including comments. Updates the comments object, so that all included comments are marked.
     * @param {string} directoryPath - Path of current directory.  Gets longer as recursion gets deeper.
     * @param {number} depth - Recursion depth. Keeps track of how much to indent.
     * @returns {Promise<string>}
     */
    async function generateMdForDirectory(directoryPath, depth = 0) {
      try {
        const files = await fs.readdir(directoryPath);
    
        let fileMdContent = '';
        let folderMdContent = '';

        for (const file of files) {
          const filePath = path.join(directoryPath, file).replaceAll('\\', '\/');
          if (!ignore.includes(file) && !ignore.includes(filePath)) {
              const stats = await fs.stat(filePath);
              const isDirectory = stats.isDirectory();
              const indentation = '\t'.repeat(depth);
              const fileLink = `- [${file+(isDirectory ? '/' : '')}](${isDirectory ? filePath + '/' : filePath})`;
      
              // create the next entry line
              let entry;
              if (comments && comments[filePath]) {
                  entry = `${indentation}${fileLink}: ${comments[filePath].commentText}\n`;
                  comments[filePath].included = true;
              } else {
                  entry = `${indentation}${fileLink}\n`;
              }

              // add the new line to either the folders or files group
              if (isDirectory) {
                folderMdContent += entry;
              } else {
                fileMdContent += entry;
              }
      
              // next recursion level
              if (isDirectory && !ignoreContents.includes(file) && !ignoreContents.includes(filePath)) {
                  const subdirContent = await generateMdForDirectory(filePath, depth + 1);
                  folderMdContent += subdirContent;
              }
          }
      }
        
        return folderMdContent+fileMdContent;
      } catch (error) {
        console.error('Error generating md with comments:', error);
        throw error;
      }
    }

    let mdContent = '# Directory Contents\n\n';

    const directoryContent = await generateMdForDirectory(filePath);

    /**
     * Filter comments object.  This is an array of arrays of [key,value] pairs.
     * @type {[string,any][]}
     */
    const excludedComments = Object.entries(comments).filter((entry) => !entry[1].included);

    // Add list of missing comments, if there are any.
    if (excludedComments.length) {
      mdContent += '## Missing comments\n\n'
      for (const [filePath, {commentText} ] of excludedComments) {
        mdContent += `- ${filePath}: ${commentText}\n`
      }
      mdContent += '\n'
    }

    // Add the previously generated directory list
    mdContent += '## Files\n\n' + directoryContent

    return mdContent

  } catch (error) {
    console.error('Error generating md with comments:', error);
    throw error;
  }
}
