const { spawn } = require('child_process');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  sourceFile: 'resume.tex',
  outputFile: 'resume.pdf',
  finalFile: 'Himanshu-Soni-Resume.pdf',
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v'),
  clean: process.argv.includes('--clean') || process.argv.includes('-c')
};

// Auxiliary files to clean up
const AUX_FILES = [
  'resume.aux',
  'resume.log',
  'resume.out',
  'resume.toc',
  'resume.fls',
  'resume.fdb_latexmk',
  'resume.synctex.gz'
];

/**
 * Check if a file exists
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} - True if file exists
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clean up auxiliary files created during LaTeX compilation
 */
async function cleanupAuxFiles() {
  console.log('🧹 Cleaning up auxiliary files...');
  
  for (const file of AUX_FILES) {
    try {
      if (await fileExists(file)) {
        await fs.unlink(file);
        console.log(`   Removed: ${file}`);
      }
    } catch (error) {
      console.warn(`   Warning: Could not remove ${file}: ${error.message}`);
    }
  }
}

/**
 * Copy the generated PDF to the final destination
 * @param {string} sourcePath - Source file path
 * @param {string} destinationPath - Destination file path
 */
async function copyFile(sourcePath, destinationPath) {
  try {
    // Check if source file exists
    if (!(await fileExists(sourcePath))) {
      throw new Error(`Source file ${sourcePath} does not exist`);
    }

    await fs.copyFile(sourcePath, destinationPath);
    console.log(`✅ Copied resume as ${path.basename(destinationPath)}`);
  } catch (error) {
    console.error(`❌ Error copying file: ${error.message}`);
    throw error;
  }
}

/**
 * Validate that the PDF was generated successfully
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<boolean>} - True if PDF is valid
 */
async function validatePDF(filePath) {
  try {
    if (!(await fileExists(filePath))) {
      return false;
    }

    const stats = await fs.stat(filePath);
    return stats.size > 0; // PDF should have content
  } catch {
    return false;
  }
}

/**
 * Compile LaTeX document using pdflatex
 * @returns {Promise<void>}
 */
async function compileLaTeX() {
  return new Promise((resolve, reject) => {
    console.log('📝 Compiling LaTeX document...');
    
    // Check if source file exists
    if (!fsSync.existsSync(CONFIG.sourceFile)) {
      reject(new Error(`Source file ${CONFIG.sourceFile} not found`));
      return;
    }

    // pdflatex arguments for better compilation
    const pdflatexArgs = [
      '-interaction=nonstopmode',  // Don't stop for errors
      '-output-directory=./',      // Output to current directory
      '-halt-on-error',           // Stop on first error
      CONFIG.sourceFile
    ];

    const pdflatex = spawn('pdflatex', pdflatexArgs);

    let stdout = '';
    let stderr = '';

    // Capture stdout
    pdflatex.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      
      if (CONFIG.verbose) {
        console.log('📄 LaTeX Output:', output);
      }
    });

    // Capture stderr
    pdflatex.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      console.error('⚠️  LaTeX Error:', output);
    });

    // Handle process errors
    pdflatex.on('error', (error) => {
      console.error('❌ Failed to start pdflatex process:', error.message);
      reject(new Error(`Failed to start pdflatex: ${error.message}`));
    });

    // Handle process exit
    pdflatex.on('exit', (code) => {
      if (code === 0) {
        console.log('✅ LaTeX compilation completed successfully');
        resolve();
      } else {
        console.error('❌ LaTeX compilation failed with exit code:', code);
        console.error('📄 Full output:', stdout);
        if (stderr) {
          console.error('⚠️  Error output:', stderr);
        }
        reject(new Error(`LaTeX compilation failed with exit code ${code}`));
      }
    });
  });
}

/**
 * Main compilation function
 */
async function main() {
  try {
    console.log('🚀 Starting resume compilation...');
    console.log(`📁 Source: ${CONFIG.sourceFile}`);
    console.log(`📄 Output: ${CONFIG.outputFile}`);
    console.log(`📋 Final: ${CONFIG.finalFile}`);
    
    if (CONFIG.verbose) {
      console.log('🔍 Verbose mode enabled');
    }
    
    if (CONFIG.clean) {
      console.log('🧹 Clean mode enabled');
    }

    // Compile LaTeX
    await compileLaTeX();

    // Validate PDF generation
    const pdfExists = await validatePDF(CONFIG.outputFile);
    if (!pdfExists) {
      throw new Error('PDF was not generated successfully');
    }

    console.log(`✅ Successfully generated ${CONFIG.outputFile}`);

    // Copy to final destination
    await copyFile(CONFIG.outputFile, CONFIG.finalFile);

    // Clean up auxiliary files if requested
    if (CONFIG.clean) {
      await cleanupAuxFiles();
    }

    console.log('🎉 Resume compilation completed successfully!');
    
  } catch (error) {
    console.error('💥 Compilation failed:', error.message);
    process.exit(1);
  }
}

// Run the main function
if (require.main === module) {
  main();
}

module.exports = { main, compileLaTeX, copyFile, cleanupAuxFiles };
