const readline = require('readline');
const fs = require('fs-extra');
const PDFDocument = require('pdfkit');
const path = require('path');

const currentDate = new Date();

const getDaySuffix = (day) => {
  if (day >= 11 && day <= 13) return 'th';
  return ['st', 'nd', 'rd'][day % 10 - 1] || 'th';
}

const day = currentDate.getDate();
const month = currentDate.toLocaleString('en-US', { month: 'long' });
const year = currentDate.getFullYear();
const suffix = getDaySuffix(day);

const formattedDate = `${month} ${day}${suffix}, ${year}`;

const deleteCoverLetterFiles = (directoryPath) => {
  fs.readdirSync(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach(file => {
      if (file.startsWith('coverLetter_')) {
        const filePath = path.join(directoryPath, file);
        fs.unlinkSync(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file ${file}:`, err);
          } else {
            console.log(`Deleted file: ${file}`);
          }
        });
      }
    });
  });
}

// Create an interface to prompt for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const previouscompany = 'One Convergence';
const defaultRole = 'Lead UI Developer';

const coverLetterTemplate = (companyName, role) => {
  return `
Himanshu Soni
er.hsoni92@gmail.com | +91-7382978592
Portfolio: https://www.himanshusoni.dedyn.io

${formattedDate}

Dear Hiring Manager,
${companyName}

I'm a Lead Software Engineer with 7+ years in UI leadership. At ${previouscompany}, I accelerated delivery by 25% through React.js/Next.js migration, mentored 15+ developers, and shipped 30+ features with zero critical bugs.

I'd welcome the opportunity to discuss driving ${companyName}'s frontend vision.

Sincerely,
Himanshu Soni
`;
};

// Create a function to generate PDF
const generatePDF = (companyName, role) => {
  const doc = new PDFDocument();

  // Save the PDF file
  const filePath = `coverLetter_${companyName.replaceAll(' ', '')}.pdf`;
  doc.pipe(fs.createWriteStream(filePath));

  // Set PDF font and styling
  doc.font('Helvetica').fontSize(12);

  // Add the cover letter content
  const coverLetter = coverLetterTemplate(companyName, role);
  doc.text(coverLetter, {
    align: 'left',
    paragraphGap: 5,
  });

  // Finalize the PDF and save it
  doc.end();

  console.log(`PDF generated successfully: ${filePath}`);
};

// Prompt for the company name
rl.question('Enter the company name: ', (companyName) => {
  rl.question('Enter the interested role: ', (role) => {
    // cleanup
    deleteCoverLetterFiles('./');
    generatePDF(companyName, role || defaultRole);
    rl.close();
  });
});
