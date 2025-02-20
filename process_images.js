const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ingredientsDir = path.join(__dirname, 'assets', 'images', 'ingredients');
const processedDir = path.join(__dirname, 'assets', 'images', 'ingredients_processed');

// Target size for all ingredients
const TARGET_SIZE = 200;

// Create processed directory if it doesn't exist
if (!fs.existsSync(processedDir)) {
    fs.mkdirSync(processedDir, { recursive: true });
}

// Get all PNG files in the ingredients directory
const files = fs.readdirSync(ingredientsDir).filter(file => file.endsWith('.png'));

async function processImage(file) {
    const inputPath = path.join(ingredientsDir, file);
    const outputPath = path.join(processedDir, file);

    try {
        await sharp(inputPath)
            // Resize maintaining aspect ratio
            .resize(TARGET_SIZE, TARGET_SIZE, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            // Ensure we have transparency
            .ensureAlpha()
            // Remove white background
            .flatten({ background: { r: 255, g: 255, b: 255 } })
            .toColourspace('b-w')
            .threshold(240)
            .toColourspace('srgb')
            .png()
            .toFile(outputPath);

        console.log(`Processed ${file}`);
    } catch (error) {
        console.error(`Error processing ${file}:`, error);
    }
}

// Process all images sequentially to avoid memory issues
async function processAllImages() {
    for (const file of files) {
        await processImage(file);
    }
    console.log('All images processed');
}

processAllImages().catch(err => console.error('Error:', err));
