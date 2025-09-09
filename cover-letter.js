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

Hiring Manager
${companyName}

Dear Hiring Manager,

I am excited to apply for the ${role} position at ${companyName}. With a strong background in full-stack development, UI/UX design, product management, and experience with technologies like React, NodeJS, and Generative AI, I'm eager to contribute to your team.

At ${previouscompany}, I led initiatives to improve product features, streamline processes, and enhance usability. I thrive in fast-paced environments and am passionate about delivering impactful user experiences.

I'd love the opportunity to discuss how my skills align with ${companyName}'s goals. Thank you for considering my application.

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
