const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ingredientsDir = path.join(__dirname, 'assets', 'images', 'ingredients');
const processedDir = path.join(__dirname, 'assets', 'images', 'ingredients_processed');

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
            .ensureAlpha()  // Ensure alpha channel exists
            .removeAlpha()  // Remove existing alpha
            .flatten({ background: { r: 255, g: 255, b: 255 } })  // Convert to white background
            .toColorspace('b-w')  // Convert to black and white
            .threshold(250)  // High threshold to identify white areas
            .toColorspace('srgb')  // Back to RGB
            .extractChannel(0)  // Extract the threshold result
            .negate()  // Invert to use as alpha
            .toBuffer()
            .then(alphaBuffer => {
                // Process original image with new alpha channel
                return sharp(inputPath)
                    .ensureAlpha()
                    .joinChannel(alphaBuffer)  // Use our processed alpha channel
                    .toFile(outputPath);
            });

        console.log(`Processed ${file}`);
    } catch (error) {
        console.error(`Error processing ${file}:`, error);
    }
}

// Process all images
Promise.all(files.map(processImage))
    .then(() => console.log('All images processed'))
    .catch(err => console.error('Error:', err));
