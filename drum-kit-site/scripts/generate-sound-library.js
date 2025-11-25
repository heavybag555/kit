const fs = require('fs');
const path = require('path');

const SOUNDS_DIR = path.join(__dirname, '../public/sounds');
const OUTPUT_FILE = path.join(__dirname, '../data/soundLibrary.ts');

const CATEGORIES = ['kicks', 'snares', 'hats', 'percs', 'vox', 'background'];

const ALLOWED_EXTENSIONS = ['.wav', '.mp3', '.aif', '.aiff'];

function generateLibrary() {
  const library = {};

  CATEGORIES.forEach(category => {
    const categoryPath = path.join(SOUNDS_DIR, category);
    
    if (!fs.existsSync(categoryPath)) {
      console.warn(`Warning: Category directory not found: ${category}`);
      library[category] = [];
      return;
    }

    const files = fs.readdirSync(categoryPath);
    
    library[category] = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ALLOWED_EXTENSIONS.includes(ext) && !file.startsWith('.');
      })
      .map(file => {
        const id = `${category}-${file.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()}`;
        return {
          id,
          name: file.replace(/\.[^/.]+$/, ""), // remove extension
          path: `/sounds/${category}/${file}`,
          category
        };
      });
      
    console.log(`Processed ${category}: ${library[category].length} sounds`);
  });

  const fileContent = `export type Sound = {
  id: string;
  name: string;
  path: string;
  category: string;
};

export type SoundLibrary = {
  [key: string]: Sound[];
};

export const SOUND_LIBRARY: SoundLibrary = ${JSON.stringify(library, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, fileContent);
  console.log(`Sound library generated at ${OUTPUT_FILE}`);
}

generateLibrary();

