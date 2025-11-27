const { model } = require("../config/gemini");

const SYSTEM_PROMPT =
  "Analyze this image. It contains a single handwritten digit. Return ONLY the integer value (0-9). Do not return markdown, text, or explanations. If the image is unclear or not a digit, return -1.";

async function analyzeImage(req, res) {
  try {
    // Validation: Check if image exists in request body
    if (!req.body.image) {
      return res.status(400).json({
        success: false,
        error: "Image is required",
      });
    }

    const dataUrl = req.body.image;

    // Strip the Data URL prefix (e.g., "data:image/png;base64,")
    const base64Match = dataUrl.match(/^data:image\/\w+;base64,(.+)$/);
    if (!base64Match) {
      return res.status(400).json({
        success: false,
        error: "Invalid image format. Expected Base64 Data URL.",
      });
    }

    const base64String = base64Match[1];

    // Determine mime type from the data URL
    const mimeTypeMatch = dataUrl.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/png";

    // Call Gemini Vision API
    const result = await model.generateContent([
      SYSTEM_PROMPT,
      {
        inlineData: {
          mimeType: mimeType,
          data: base64String,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text().trim();

    // Parse the response to an integer
    const digit = parseInt(text, 10);
    console.log('ans', digit);
    // Validate the parsed result
    if (isNaN(digit) || digit < -1 || digit > 9) {
      return res.json({
        success: true,
        number: -1,
      });
    }

    return res.json({
      success: true,
      number: digit,
    });
  } catch (error) {
    console.error("Error analyzing image:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze image",
    });
  }
}

module.exports = { analyzeImage };
