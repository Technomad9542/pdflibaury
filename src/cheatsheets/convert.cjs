const fs = require('fs');
const path = require('path');

// Function to parse frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return { frontmatter: {}, body: content };
  
  const frontmatterContent = match[1];
  const body = content.slice(match[0].length);
  
  const frontmatter = {};
  const lines = frontmatterContent.split('\n');
  
  let currentKey = '';
  let currentValue = [];
  
  for (const line of lines) {
    if (line.includes(':') && !line.startsWith(' ') && !line.startsWith('-')) {
      // Save previous key-value pair
      if (currentKey && currentValue.length > 0) {
        if (currentKey === 'tags' || currentKey === 'categories') {
          frontmatter[currentKey] = currentValue.map(item => item.replace(/['"]/g, '').trim()).filter(item => item !== '');
        } else {
          frontmatter[currentKey] = currentValue.join('\n').trim().replace(/['"]/g, '');
        }
      }
      
      // Start new key-value pair
      const [key, ...valueParts] = line.split(':');
      currentKey = key.trim();
      const value = valueParts.join(':').trim();
      
      if (value) {
        currentValue = [value];
      } else {
        currentValue = [];
      }
    } else if (line.startsWith(' ') || line.startsWith('-')) {
      // Continuation of array or multiline value
      currentValue.push(line.trim().replace(/^-/, '').trim());
    } else if (line.trim() !== '') {
      // Continuation of multiline value
      currentValue.push(line.trim());
    }
  }
  
  // Save last key-value pair
  if (currentKey && currentValue.length > 0) {
    if (currentKey === 'tags' || currentKey === 'categories') {
      frontmatter[currentKey] = currentValue.map(item => item.replace(/['"]/g, '').trim()).filter(item => item !== '');
    } else {
      frontmatter[currentKey] = currentValue.join('\n').trim().replace(/['"]/g, '');
    }
  }
  
  return { frontmatter, body };
}

// Function to convert markdown to our format
function convertMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);
  
  // Extract ID from filename
  const fileName = path.basename(filePath, '.md');
  
  // Ensure categories is always an array
  let categories = frontmatter.categories || ['General'];
  if (typeof categories === 'string') {
    categories = [categories];
  }
  
  // Ensure tags is always an array
  let tags = frontmatter.tags || [];
  if (typeof tags === 'string') {
    tags = [tags];
  }
  
  return {
    id: fileName,
    title: frontmatter.title || fileName,
    intro: frontmatter.intro || '',
    tags: tags,
    categories: categories,
    background: frontmatter.background || 'bg-gray-500',
    content: body
  };
}

// Get all markdown files
const sourceDir = path.join(__dirname, '../../cheat-sheet-project/reference-main/source/_posts');
const targetDir = path.join(__dirname, 'data');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Read all markdown files
const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.md'));

// Convert each file
const allCheatSheets = [];

for (const file of files) {
  try {
    const filePath = path.join(sourceDir, file);
    const cheatSheet = convertMarkdownFile(filePath);
    allCheatSheets.push(cheatSheet);
    
    // Save individual file
    const outputPath = path.join(targetDir, `${cheatSheet.id}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(cheatSheet, null, 2));
    
    console.log(`Converted: ${file} -> ${cheatSheet.id}.json`);
  } catch (error) {
    console.error(`Error converting ${file}:`, error.message);
  }
}

// Sort cheat sheets by categories and then by title
allCheatSheets.sort((a, b) => {
  // First sort by first category
  const categoryA = a.categories[0] || 'General';
  const categoryB = b.categories[0] || 'General';
  
  if (categoryA !== categoryB) {
    return categoryA.localeCompare(categoryB);
  }
  
  // Then sort by title
  return a.title.localeCompare(b.title);
});

// Group cheat sheets by category
const groupedCheatSheets = {};
allCheatSheets.forEach(sheet => {
  const category = sheet.categories[0] || 'General';
  if (!groupedCheatSheets[category]) {
    groupedCheatSheets[category] = [];
  }
  groupedCheatSheets[category].push(sheet);
});

// Save all cheat sheets to a single file
const allSheetsPath = path.join(__dirname, 'all-cheatsheets.json');
fs.writeFileSync(allSheetsPath, JSON.stringify(allCheatSheets, null, 2));

// Save grouped cheat sheets
const groupedSheetsPath = path.join(__dirname, 'grouped-cheatsheets.json');
fs.writeFileSync(groupedSheetsPath, JSON.stringify(groupedCheatSheets, null, 2));

// Also create ES module version for import
const esModuleContent = `export default ${JSON.stringify(allCheatSheets, null, 2)};`;
const esModulePath = path.join(__dirname, 'all-cheatsheets.js');
fs.writeFileSync(esModulePath, esModuleContent);

console.log(`\nConversion complete!`);
console.log(`Total cheat sheets converted: ${allCheatSheets.length}`);
console.log(`Categories found: ${Object.keys(groupedCheatSheets).join(', ')}`);
console.log(`All sheets saved to: ${allSheetsPath}`);
console.log(`Grouped sheets saved to: ${groupedSheetsPath}`);
console.log(`ES Module version saved to: ${esModulePath}`);