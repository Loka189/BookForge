const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc Generate a book outline
// @route POST /api/ai/generate-outline
// @access Private

const generateBookOutline = async (req, res) => {
    try {
        const { topic, style, numberOfChapters, description } = req.body;
        if (!topic) {
            return res.status(400).json({ message: 'Topic is required' });
        }

        const prompt = `
        You are an expert book outline generator. Create a comprehensive book outline based on the following requirements:
        Topic: "${topic}"
        ${description ? `Description: "${description}"` : ""}
        Writing Style: ${style}
        Number of Chapters: ${numberOfChapters || 5}
        Requirements:
        1. Generate exactly ${numberOfChapters || 5} chapters
        2. Each chapter title should be clear, engaging, and follow a logical progression
        3. Each chapter description should be 2-3 sentences explaining what the chapter covers
        4. Ensure chapters build upon each other coherently
        5. Match the "${style}" writing style in your titles and descriptions

        Output Format:
        Return ONLY a valid JSON array with no additional text, markdown, or formatting. Each object must have exactly two keys: "title" and "description".

        Example structure:
        [
        {
            "title": "Chapter 1: Introduction to the Topic",
            "description": "A comprehensive overview introducing the main concepts. Sets the foundation for understanding the subject matter."
        },
        {
            "title": "Chapter 2: Core Principles",
            "description": "Explores the fundamental principles and provides detailed examples and real-world applications."
        }
        ]
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const text = response.text;

        // find and extract the JSON array from the response text
        const StartIndex = text.indexOf('[');
        const EndIndex = text.lastIndexOf(']');
        if (StartIndex === -1 || EndIndex === -1) {
            return res.status(500).json({ message: 'Failed to parse AI response' });
        }
        const jsonString = text.substring(StartIndex, EndIndex + 1);

        // Validate if it's a proper JSON
        try {
            const outline = JSON.parse(jsonString);
            res.status(200).json({ outline });
        } catch (error) {
            console.error('❌ AI generate outline error:', error.message);
            res.status(500).json({ message: 'Failed to generate book outline' });
        }
    } catch (error) {
        console.error('❌ AI generate outline error:', error.message);
        res.status(500).json({ message: 'Server error during AI outline generation' });
    }
}

// @desc Generate chapter content
// @route POST /api/ai/generate-chapter
// @access Private
const generateChapterContent = async (req, res) => {
    try {
        const { chapterTitle, chapterDescription, writingStyle } = req.body;
        if (!chapterTitle) {
            return res.status(400).json({ message: 'Chapter title is required' });
        }
        const prompt = `You are an expert writer specializing in ${writingStyle} content. Write a complete chapter for a book with the following specifications:

Chapter Title: "${chapterTitle}"
${chapterDescription ? `Chapter Description: ${chapterDescription}` : ''}
Writing Style: ${writingStyle}
Target Length: Comprehensive and detailed (aim for 1500-2500 words)

Requirements:
1. Write in a ${writingStyle.toLowerCase()} tone throughout the chapter
2. Structure the content with clear sections and smooth transitions
3. Include relevant examples, explanations, or anecdotes as appropriate for the style
4. Ensure the content flows logically from introduction to conclusion
5. Make the content engaging and valuable to readers
${chapterDescription ? '6. Cover all points mentioned in the chapter description' : ''}

Format Guidelines:
- Start with a compelling opening paragraph
- Use clear paragraph breaks for readability
- Include subheadings if appropriate for the content length
- End with a strong conclusion or transition to the next chapter
- Write in plain text without markdown formatting

Begin writing the chapter content now:`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        res.status(200).json({ content: response.text });
    } catch (error) {
        console.error('❌ AI generate chapter error:', error.message);
        res.status(500).json({ message: 'Server error during AI chapter generation' });
    }
}

module.exports = { generateBookOutline, generateChapterContent };