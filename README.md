# Resume-Tex
Professional resume built with LaTeX and automated Node.js compilation

## Features

- **Modern LaTeX Resume**: Clean, professional design with custom styling
- **Automated Build System**: Robust Node.js compilation with error handling
- **Multiple Build Options**: Standard, verbose, and clean compilation modes
- **File Management**: Automatic PDF generation and cleanup of auxiliary files
- **Watch Mode**: Auto-rebuild on file changes (with nodemon)

## Quick Start

### Requirements
1. **Node.js** (v14 or higher)
2. **pdflatex** (LaTeX distribution)

### Installation
```bash
# Install dependencies
npm install

# Build resume
npm run build
```

## Build Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Standard build (quiet mode) |
| `npm run build:verbose` | Build with detailed LaTeX output |
| `npm run build:clean` | Build and clean auxiliary files |
| `npm run build:full` | Verbose build with cleanup |
| `npm run watch` | Auto-rebuild on file changes |
| `npm run clean` | Clean auxiliary files only |
| `npm run coverletter` | Generate cover letter |

## LaTeX Installation

### macOS
```bash
brew install --cask mactex
```

### Windows
Download and install [MikTeX](https://miktex.org/download)

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install texlive-full
```

### Online Editor
Use [Overleaf](https://www.overleaf.com/login) for online LaTeX editing
- Download the zip archive and import directly to Overleaf projects

## Project Structure

```
resume-tex/
├── resume.tex              # Main LaTeX resume file
├── compile.js              # Enhanced Node.js build script
├── cover-letter.js         # Cover letter generator
├── package.json            # Dependencies and scripts
├── resume.pdf              # Generated PDF (temporary)
├── Himanshu-Soni-Resume.pdf # Final named PDF
└── README.md               # This file
```

## Build System Features

### Error Handling
- Comprehensive error checking for missing files
- LaTeX compilation error detection and reporting
- PDF validation to ensure successful generation

### Logging
- **Standard Mode**: Clean output with progress indicators
- **Verbose Mode**: Detailed LaTeX compilation output
- **Error Mode**: Clear error messages with context

### File Management
- Automatic cleanup of auxiliary files (`.aux`, `.log`, `.out`, etc.)
- PDF validation before copying to final destination
- Source file existence validation

### Advanced Features
- **Watch Mode**: Auto-rebuild when `resume.tex` changes
- **Clean Mode**: Remove temporary files after compilation
- **Verbose Mode**: Show detailed LaTeX output for debugging
- **Modular Design**: Reusable functions for different build scenarios

## Usage Examples

### Basic Build
```bash
npm run build
# Output: resume.pdf and Himanshu-Soni-Resume.pdf
```

### Debug Build
```bash
npm run build:verbose
# Shows detailed LaTeX compilation output
```

### Clean Build
```bash
npm run build:clean
# Builds and removes auxiliary files
```

### Development Mode
```bash
npm run watch
# Automatically rebuilds when resume.tex changes
```

## Troubleshooting

### Common Issues

1. **LaTeX not found**
   - Ensure pdflatex is installed and in PATH
   - On macOS: `brew install --cask mactex`
   - On Windows: Install MikTeX

2. **Permission errors**
   - Ensure write permissions in the project directory
   - Check if PDF files are open in another application

3. **LaTeX compilation errors**
   - Use `npm run build:verbose` to see detailed error output
   - Check `resume.log` for specific LaTeX errors

4. **Missing dependencies**
   - Run `npm install` to install Node.js dependencies
   - Ensure all LaTeX packages are installed

### Debug Mode
```bash
# Enable verbose output for debugging
npm run build:verbose

# Check for auxiliary files
ls -la *.aux *.log *.out
```

## Contributing

1. Edit `resume.tex` for content changes
2. Use `npm run watch` for development
3. Test with `npm run build:full` before committing
4. Ensure all auxiliary files are cleaned up

## License

ISC License - See package.json for details
