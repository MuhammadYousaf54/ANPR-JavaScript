const fs = require('fs');
const path = require('path');
const Plate = require('../models/plate');
const tesseract = require('tesseract.js');
const sharp = require('sharp');

const imageFolder = path.join(__dirname, '../images'); 

const processImages = async (req, res) => {
  try {
    const files = fs.readdirSync(imageFolder);

    for (const file of files) {
      const imagePath = path.join(imageFolder, file);
      console.log(`Processing image: ${imagePath}`);

      try {
        // Convert image to grayscale before OCR
        const grayscaleImagePath = path.join(imageFolder, `grayscale_${file}`);
        await sharp(imagePath)
          .grayscale()  // Convert to grayscale
          .toFile(grayscaleImagePath);

        // tesseract process
        const { data: { text } } = await tesseract.recognize(grayscaleImagePath, 'eng', {
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
          psm: 7 // Assuming the number plate is a single line of text
        });

        console.log(`Raw Tesseract output: ${text}`);

        const plateText = text.trim();

        if (plateText) {
          const newPlate = new Plate({
            plateText: plateText,
            imageName: file,
            extraName: 'Example Name'
          });

          await newPlate.save();
          console.log(`Saved data for image: ${file} with plate text: ${plateText}`);
        } else {
          console.error('No valid text found in Tesseract result.');
        }

        // Optionally, delete the grayscale image after processing
        fs.unlinkSync(grayscaleImagePath);

      } catch (error) {
        console.error(`Error processing image ${file}:`, error);
      }
    }

    res.send('Processing completed.');
  } catch (error) {
    console.error('Error reading the folder:', error);
    res.status(500).send('Error processing images');
  }
};

const findPlate = async (req, res) => {
  const { plateText } = req.params;

  try {
    const plate = await Plate.findOne({ plateText: plateText });
    if (plate) {
      res.json(plate);
    } else {
      res.status(404).send('No plate found with that number.');
    }
  } catch (err) {
    console.error('Error finding the plate:', err);
    res.status(500).send('Server error.');
  }
};

module.exports = {
  processImages,
  findPlate
};