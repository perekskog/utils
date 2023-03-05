const fs = require('fs');
const path = require('path');
const { Command } = require('commander');

// Create a new command instance
const program = new Command();

// Set the options for the command
program
  .requiredOption('-d, --directory <directory>', 'directory path to search for files')
  .requiredOption('-e, --extension <extension>', 'file extension to delete (.on1)')
  .requiredOption('-s, --start <start>', 'start time for the modification time range (YYYY-MM-DDTHH:mm:ssZ)')
  .requiredOption('-end, --end <end>', 'end time for the modification time range (YYYY-MM-DDTHH:mm:ssZ)');

// Parse the command line arguments
program.parse(process.argv);

console.log('Command line arguments:');
console.log(program.opts());

// Get the values of the options
const directoryPath = program.opts().directory;
const fileExtension = program.opts().extension;
const startTime = new Date(program.opts().start);
const endTime = new Date(program.opts().end);

// Define a function to recursively iterate over all files in a directory
function deleteModifiedFiles(directoryPath, fileExtension, startTime, endTime) {

//  console.log(`Processing directory ${directoryPath}...`);

  // Read the contents of the directory
  fs.readdirSync(directoryPath).forEach((file) => {
    // Construct the full path of the file
    const filePath = path.join(directoryPath, file);

    // Get the stats for the file
    const stats = fs.statSync(filePath);

    // Check if the file is a directory
    if (stats.isDirectory()) {
      // Recursively call the function for the subdirectory
      deleteModifiedFiles(filePath, fileExtension, startTime, endTime);
    } else {
      // Check if the file has the specified extension and has been modified between the start and end times
//      console.log(path.extname(file), stats.mtime);
      if (path.extname(file) === fileExtension && stats.ctime >= startTime && stats.ctime <= endTime) {
        // Delete the file
         //fs.unlinkSync(filePath);
        console.log(`--Deleted file ${directoryPath}/${filePath}, ${stats.ctime}, ${stats.mtime}}`);
      } else {
//        console.log(`Skipped file ${filePath}`);
      }
    }
  });
}

deleteModifiedFiles(directoryPath, fileExtension, startTime, endTime);
