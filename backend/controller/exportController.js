const {
    Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType, ImageRun
} = require('docx');
const PDFDocument = require('pdfkit');
const MarkdownIt = require('markdown-it');
const Book = require('../models/Book');
const path = require('path');
const fs = require('fs');
// const { fonts } = require('pdfkit/js/page');
// const { Children } = require('react');
// const { title } = require('process');

const md = new MarkdownIt();

// Typography configuration matching the pdf export 
const DOCX_STYLES = {
    fonts: {
        body: 'Charter',
        heading: 'Inter'
    },
    sizes: {
        title: 32,
        subtitle: 20,
        author: 18,
        chapterTitle: 24,
        h1: 20,
        h2: 18,
        h3: 16,
        body: 12,

    },
    spacing: {
        paragraphBefore: 200,
        paragraphAfter: 200,
        chapterBefore: 400,
        chapterAfter: 300,
        headingBefore: 300,
        headingAfter: 150,
    }
};

// Process markdown content into docx paragraphs
const processMarkdownToDocx = (markdownContent) => {
    const tokens = md.parse(markdownContent, {});
    const paragraphs = [];
    let inList = null;
    let listType = null;
    let orderedListCount = 0;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        try {
            if (token.type === 'heading_open') {
                const level = parseInt(token.tag.substring(1), 10);
                const nextToken = tokens[i + 1];
                if (nextToken && nextToken.type === 'inline') {
                    let headingLevel;
                    let fontsize;
                    switch (level) {
                        case 1:
                            headingLevel = HeadingLevel.HEADING_1;
                            fontsize = DOCX_STYLES.sizes.h1;
                            break;
                        case 2:
                            headingLevel = HeadingLevel.HEADING_2;
                            fontsize = DOCX_STYLES.sizes.h2;
                            break;
                        case 3:
                            headingLevel = HeadingLevel.HEADING_3;
                            fontsize = DOCX_STYLES.sizes.h3;
                            break;
                        default:
                            headingLevel = HeadingLevel.HEADING_3;
                            fontsize = DOCX_STYLES.sizes.h3;
                    }
                    paragraphs.push(
                        new Paragraph({
                            text: nextToken.content,
                            heading: headingLevel,
                            spacing: {
                                before: DOCX_STYLES.spacing.headingBefore,
                                after: DOCX_STYLES.spacing.headingAfter,
                            },
                            style: {
                                font: DOCX_STYLES.fonts.heading,
                                size: fontsize * 2,

                            }
                        })
                    );
                    i += 2; // Skip the inline and closing tokens

                }
            } else if (token.type === 'paragraph_open') {
                const nextToken = tokens[i + 1];
                if (nextToken && nextToken.type === 'inline' && nextToken.children) {
                    const textRuns = processInlineContent(nextToken.children);
                    if (textRuns.length > 0) {
                        paragraphs.push(
                            new Paragraph({
                                children: textRuns,
                                spacing: {
                                    before: DOCX_STYLES.spacing.paragraphBefore,
                                    after: DOCX_STYLES.spacing.paragraphAfter,
                                    line: 360, //1.15 line spacing
                                },
                                alignment: AlignmentType.JUSTIFIED,

                            })
                        );
                    }
                    i += 2; // Skip the inline and closing tokens
                }
            } else if (token.type === 'bullet_list_open') {
                inList = true;
                listType = 'bullet';
            }
            else if (token.type === 'bullet_list_close') {
                inList = false;
                listType = null;
                // Add spacing after list
                paragraphs.push(
                    new Paragraph({
                        text: '',
                        spacing: {
                            after: 100,
                        }
                    })
                );
            }
            else if (token.type === 'ordered_list_open') {
                inList = true;
                listType = 'ordered';
                orderedListCount = 1;
            }
            else if (token.type === 'ordered_list_close') {
                inList = false;
                listType = null;
                orderedListCount = 1;
                // Add spacing after list
                paragraphs.push(
                    new Paragraph({
                        text: '',
                        spacing: {
                            after: 100,
                        }
                    })
                );
            }
            else if (token.type === 'list_item_open') {
                const nextToken = tokens[i + 1];
                if (nextToken && nextToken.type === 'paragraph_open') {
                    const inlineToken = tokens[i + 2];
                    if (inlineToken && inlineToken.type === 'inline' && inlineToken.children) {
                        const textRuns = processInlineContent(inlineToken.children);
                        let bulletText = '';
                        if (listType === 'bullet') {
                            bulletText = '\u2022 '; // Bullet character
                        }
                        else if (listType === 'ordered') {
                            bulletText = `${orderedListCount}. `;
                            orderedListCount++;
                        }
                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: bulletText,
                                        font: DOCX_STYLES.fonts.body,
                                    }),
                                    ...textRuns
                                ],
                                spacing: {
                                    before: 50,
                                    after: 50,
                                },
                                indent: {
                                    left: 720, //0.5 inch
                                },
                            })
                        );
                        i += 4;
                    }
                }
            } else if (token.type === 'blockquote_open') {
                // find the blockquote content
                const nextToken = tokens[i + 1];
                if (nextToken && nextToken.type === 'paragraph_open') {
                    const inlineToken = tokens[i + 2];
                    if (inlineToken && inlineToken.type === 'inline') {

                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: '“',
                                        italics: true,
                                        font: DOCX_STYLES.fonts.body,
                                        color: '6B7280', // Gray color for blockquote
                                    }),

                                ],
                                spacing: {
                                    before: 200,
                                    after: 200,
                                },
                                indent: {
                                    left: 720, //0.5 inch
                                },
                                alignment: AlignmentType.JUSTIFIED,
                                border: {
                                    left: {
                                        color: 'D1D5DB',
                                        size: 24,
                                        style: 'single',
                                        space: 1,
                                    }
                                }
                            })
                        );
                        i += 4;
                    }
                }
            } else if (token.type === 'code_block' || token.type === 'fence') {
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: token.content,
                                font: 'Courier New',
                                size: 20,
                                color: '333333', // Dark gray for code
                            })
                        ],
                        spacing: {
                            before: 200,
                            after: 200,
                        },
                        shading: {
                            fill: 'F3F4F6' // Light gray background
                        }
                    })
                );
            } else if (token.type === 'hr') {
                paragraphs.push(
                    new Paragraph({
                        text: '',
                        border: {
                            bottom: {
                                color: 'CCCCCC',
                                space: 1,
                                style: 'single',
                                size: 6,
                            }
                        },
                        spacing: { before: 200, after: 200 }
                    })
                );
            }

        } catch (error) {
            console.error('❌ Error processing markdown token:', error.message);
        }
    }
    return paragraphs;
}

// Process inline content (bold, italic,text)
const processInlineContent = (children) => {
    const textRuns = [];
    let currentFormatting = { bold: false, italics: false };
    let buffer = '';
    const flushBuffer = () => {
        if (buffer.trim()) {
            textRuns.push(new TextRun({
                text: buffer,
                bold: currentFormatting.bold,
                italics: currentFormatting.italics,
                font: DOCX_STYLES.fonts.body,
                size: DOCX_STYLES.sizes.body * 2,
            }));
            buffer = '';
        }
    }
    children.forEach((child) => {
        if (child.type === 'strong_open') {
            flushBuffer();
            currentFormatting.bold = true;
        } else if (child.type === 'strong_close') {
            flushBuffer();
            currentFormatting.bold = false;
        } else if (child.type === 'em_open') {
            flushBuffer();
            currentFormatting.italics = true;
        } else if (child.type === 'em_close') {
            flushBuffer();
            currentFormatting.italics = false;
        } else if (child.type === 'text') {
            buffer += child.content;
        }
    });
    flushBuffer();
    return textRuns;
}


const exportAsDocument = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.userID.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to access this book' });
        }

        const sections = [];

        // Cover page with image if exists
        const coverPage = [];

        if (book.coverImage && !book.coverImage.includes('pravatar')) {
            const imagePath = book.coverImage.startsWith('/')
                ? path.join(__dirname, '..', book.coverImage.substring(1))
                : path.join(__dirname, '..', book.coverImage);
            try {
                if (fs.existsSync(imagePath)) {
                    const imageBuffer = await fs.promises.readFile(imagePath);

                    // Add some top spacing
                    coverPage.push(new Paragraph({
                        text: '',
                        spacing: { before: 1000 }
                    }));

                    // Add image centered on the page
                    coverPage.push(
                        new Paragraph({
                            children: [
                                new ImageRun({
                                    data: imageBuffer,
                                    transformation: {
                                        width: 400,
                                        height: 550
                                    }
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 200, after: 400 }
                        })
                    );

                    // Page break after cover image
                    coverPage.push(new Paragraph({
                        text: '',
                        pageBreakBefore: true
                    }));
                }
            } catch (error) {
                console.error('❌ Error adding cover image to document:', error.message);
            }
        }
        sections.push(...coverPage);

        // Title Page
        const titlePage = [];

        // Main title
        titlePage.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: book.title,
                        bold: true,
                        size: DOCX_STYLES.sizes.title * 2,
                        font: DOCX_STYLES.fonts.heading,
                        color: '1A202C',
                    })
                ],
                alignment: AlignmentType.CENTER,
                spacing: {
                    before: 2000,
                    after: 400
                }
            })
        );

        // Subtitle if exists
        if (book.subtitle && book.subtitle.trim()) {
            titlePage.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: book.subtitle,
                            font: DOCX_STYLES.fonts.heading,
                            size: DOCX_STYLES.sizes.subtitle * 2,
                            color: '4A5568',
                        })
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: {

                        after: 400
                    }
                })
            )
        }

        // Author 
        titlePage.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `by ${book.author}`,
                        size: DOCX_STYLES.sizes.subtitle * 2,
                        font: DOCX_STYLES.fonts.heading,
                        color: '203748',
                    })
                ],
                alignment: AlignmentType.CENTER,
                spacing: {

                    after: 200
                }
            })
        );

        // Decorative line
        titlePage.push(
            new Paragraph({
                text: '',
                border: {
                    bottom: {
                        color: '203748',
                        space: 1,
                        style: 'single',
                        size: 12,
                    }
                },
                alignment: AlignmentType.CENTER,
                spacing: {
                    before: 400,
                }
            })
        );

        sections.push(...titlePage);

        // Process chapters
        book.chapters.forEach((chapter, index) => {
            try {
                // Page break before each chapter except the first
                if (index > 0) {
                    sections.push(new Paragraph({
                        text: '',
                        pageBreakBefore: true
                    }));
                }
                // Chapter Title
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: chapter.title,
                                bold: true,
                                size: DOCX_STYLES.sizes.chapterTitle * 2,
                                font: DOCX_STYLES.fonts.heading,
                                color: '1A202C',
                            }),
                        ],
                        spacing: {
                            before: DOCX_STYLES.spacing.chapterBefore,
                            after: DOCX_STYLES.spacing.chapterAfter,
                        }
                    })
                );
                // Chapter Content
                const contentParagraphs = processMarkdownToDocx(chapter.content || '');
                sections.push(...contentParagraphs);
            } catch (error) {

                console.error(`❌ Error processing chapter "${chapter.title}":`, error.message);
            }
        });

        // Create document
        const doc = new Document({
            sections: [
                {
                    properties: {
                        page: {
                            margin: {
                                top: 1440, //1 inch
                                right: 1440,
                                bottom: 1440,
                                left: 1440
                            }
                        }
                    },
                    children: sections,
                }
            ]
        });

        // Generate the document buffer
        const buffer = await Packer.toBuffer(doc);

        // Send the document as a download
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.setHeader("Content-Disposition", `attachment; filename=${book.title.replace(/\s+/g, '_')}.docx`);
        res.setHeader("Content-Length", buffer.length);
        res.send(buffer);
    } catch (error) {
        console.error('❌ Error exporting book:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error during document export' });
        }
    }
};


// TYPOGRAPHY configuration for PDF export
const TYPOGRAPHY = {
    fonts: {
        serif: 'Times-Roman',
        sans: 'Helvetica',
        sansBold: 'Helvetica-Bold',
        serifItalic: 'Times-Italic',
        sansOblique: 'Helvetica-Oblique',
        serifBold: 'Times-Bold',
    },
    fontSizes: {
        title: 28,
        author: 16,
        chapterTitle: 20,
        h1: 18,
        h2: 16,
        h3: 14,
        body: 11,
        caption: 9,
    },
    spacing: {
        paragraphSpacing: 12,
        chapterSpacing: 24,
        headingSpacing: { before: 16, after: 8 },
        listSpacing: 6
    },
    colors: {
        heading: '#1A1A1A',
        text: '#333333',
        accent: '#4F46E5',
    }
};

const renderInlineTokens = (doc, tokens, options = {}) => {
    if (!tokens || tokens.length === 0) return;

    const baseOptions = {
        align: options.align || 'justify',
        indent: options.indent || 0,
        lineGap: options.lineGap || 2,
    };

    let currentFont = TYPOGRAPHY.fonts.serif;
    let textBuffer = '';

    const flushBuffer = () => {
        if (textBuffer) {
            doc.font(currentFont).text(textBuffer, {
                ...baseOptions,
                continued: true,
            });
            textBuffer = '';
        }
    }

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.type === 'text') {
            textBuffer += token.content;
        }
        else if (token.type === 'strong_open') {
            flushBuffer();
            currentFont = TYPOGRAPHY.fonts.serifBold;
        }
        else if (token.type === 'strong_close') {
            flushBuffer();
            currentFont = TYPOGRAPHY.fonts.serif;
        }
        else if (token.type === 'em_open') {
            flushBuffer();
            currentFont = TYPOGRAPHY.fonts.serifItalic;
        }
        else if (token.type === 'em_close') {
            flushBuffer();
            currentFont = TYPOGRAPHY.fonts.serif;
        }
        else if (token.type === 'code_inline') {
            flushBuffer();
            doc.font('Courier').text(token.content, {
                ...baseOptions,
                continued: true,
            });
            doc.font(currentFont); // revert to current font
        }
    }
    if (textBuffer) {
        doc.font(currentFont).text(textBuffer, {
            ...baseOptions,
            continued: false,
        });
    } else {
        doc.text('', {
            continued: false,
        });
    }
};

const renderMarkdown = (doc, markdownContent) => {
    if (!markdownContent || markdownContent.trim() === '') return;

    const tokens = md.parse(markdownContent, {});
    let inList = false;
    let listType = null;
    let orderedListCount = 1;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        try {
            if (token.type === 'heading_open') {
                const level = parseInt(token.tag.substring(1), 10);

                let fontSize;
                switch (level) {
                    case 1:
                        fontSize = TYPOGRAPHY.fontSizes.h1;
                        break;
                    case 2:
                        fontSize = TYPOGRAPHY.fontSizes.h2;
                        break;
                    case 3:
                        fontSize = TYPOGRAPHY.fontSizes.h3;
                        break;
                    default:
                        fontSize = TYPOGRAPHY.fontSizes.h3;
                }
                doc.moveDown(
                    TYPOGRAPHY.spacing.headingSpacing.before / TYPOGRAPHY.fontSizes.body
                );
                doc
                    .font(TYPOGRAPHY.fonts.sansBold)
                    .fontSize(fontSize)
                    .fillColor(TYPOGRAPHY.colors.heading);

                if (i + 1 < tokens.length && tokens[i + 1].type === 'inline') {
                    renderInlineTokens(doc, tokens[i + 1].children, {
                        align: 'left',
                        lineGap: 0
                    });
                    i++;
                }
                doc.moveDown(
                    TYPOGRAPHY.spacing.headingSpacing.after / TYPOGRAPHY.fontSizes.body
                );

                if (i + 1 < tokens.length && tokens[i + 1].type === 'heading_close') {
                    i++;
                }
            } else if (token.type === 'paragraph_open') {
                doc
                    .font(TYPOGRAPHY.fonts.serif)
                    .fontSize(TYPOGRAPHY.fontSizes.body)
                    .fillColor(TYPOGRAPHY.colors.text);

                if (i + 1 < tokens.length && tokens[i + 1].type === 'inline') {
                    renderInlineTokens(doc, tokens[i + 1].children, {
                        align: 'left',
                        lineGap: 2
                    });
                    i++;
                }
                if (!inList) {
                    doc.moveDown(
                        TYPOGRAPHY.spacing.paragraphSpacing / TYPOGRAPHY.fontSizes.body
                    );
                }
                if (i + 1 < tokens.length && tokens[i + 1].type === 'paragraph_close') {
                    i++;
                }
            } else if (token.type === 'bullet_list_open') {
                inList = true;
                listType = 'bullet';
                doc.moveDown(
                    TYPOGRAPHY.spacing.listSpacing / TYPOGRAPHY.fontSizes.body
                );
            }
            else if (token.type === 'bullet_list_close') {
                inList = false;
                listType = null;
                doc.moveDown(
                    TYPOGRAPHY.spacing.paragraphSpacing / TYPOGRAPHY.fontSizes.body
                );
            } else if (token.type === 'ordered_list_open') {
                inList = true;
                listType = 'ordered';
                orderedListCount = 1;
                doc.moveDown(
                    TYPOGRAPHY.spacing.listSpacing / TYPOGRAPHY.fontSizes.body
                );
            } else if (token.type === 'ordered_list_close') {
                inList = false;
                listType = null;
                orderedListCount = 1;
                doc.moveDown(
                    TYPOGRAPHY.spacing.paragraphSpacing / TYPOGRAPHY.fontSizes.body
                );
            } else if (token.type === 'list_item_open') {
                let bulletText = '';
                if (listType === 'bullet') {
                    bulletText = '\u2022 '; // Bullet character
                } else if (listType === 'ordered') {
                    bulletText = `${orderedListCount}. `;
                    orderedListCount++;
                }
                doc.font(TYPOGRAPHY.fonts.serif).fontSize(TYPOGRAPHY.fontSizes.body).fillColor(TYPOGRAPHY.colors.text);

                doc.text(bulletText, { indent: 20, continued: true });

                for (let j = i + 1; j < tokens.length; j++) {
                    if (tokens[j].type === 'inline') {
                        renderInlineTokens(doc, tokens[j].children, {
                            align: 'left',
                            lineGap: 2
                        });
                        break;

                    } else if (tokens[j].type === 'list_item_close') {
                        break;
                    }
                }
                doc.moveDown(
                    TYPOGRAPHY.spacing.listSpacing / TYPOGRAPHY.fontSizes.body
                );
            } else if (token.type === 'code_block' || token.type === 'fence') {
                doc.moveDown(
                    TYPOGRAPHY.spacing.paragraphSpacing / TYPOGRAPHY.fontSizes.body
                );
                doc.font('Courier').fontSize(9).fillColor(TYPOGRAPHY.colors.text);
                doc.text(token.content, {
                    indent: 20,
                    align: 'left',
                });
                doc.font(TYPOGRAPHY.fonts.serif); // revert to serif font
                doc.moveDown(
                    TYPOGRAPHY.spacing.paragraphSpacing / TYPOGRAPHY.fontSizes.body
                );
            } else if (token.type === 'hr') {
                const currentY = doc.y;
                doc.moveTo(doc.page.margins.left, currentY).lineTo(doc.page.width - doc.page.margins.right, currentY).stroke();
                doc.moveDown();
            }
        } catch (error) {
            console.error('❌ Error rendering markdown token to PDF:', error.message);
            continue;
        }
    }
};


const exportAsPDF = async (req, res) => {
    try {
        console.log('⚡ exportAsPDF called');
        const book = await Book.findById(req.params.id);
        console.log('📦 req.params:', req.params);
        console.log('📚 Book fetched:', book ? book.title : null);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.userID.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to access this book' });
        }

        // Create a new PDF document
        console.log('📝 Creating PDFDocument...');
        const pdfDoc = new PDFDocument({
            margin: { top: 72, bottom: 72, left: 72, right: 72 },
            bufferPages: true,
            autoFirstPage: true,
        });

        // Set response headers before piping
        console.log('📤 Setting response headers and piping...');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${book.title.replace(/\s+/g, '_')}.pdf`);

        pdfDoc.pipe(res);

        // cover page with image if exists
        if (book.coverImage && !book.coverImage.includes('pravatar')) {
            console.log('🖼 Cover image detected:', book.coverImage);
            const imagePath = book.coverImage.startsWith('/')
                ? path.join(__dirname, '..', book.coverImage.substring(1))
                : path.join(__dirname, '..', book.coverImage);
            try {
                if (fs.existsSync(imagePath)) {
                    console.log('✅ Cover image exists at:', imagePath);
                    const pageWidth = pdfDoc.page.width - pdfDoc.page.margins.left - pdfDoc.page.margins.right;
                    const pageHeight = pdfDoc.page.height - pdfDoc.page.margins.top - pdfDoc.page.margins.bottom;
                    pdfDoc.image(imagePath, pdfDoc.page.margins.left, pdfDoc.page.margins.top, {
                        fit: [pageWidth * 0.8, pageHeight * 0.8],
                        align: 'center',
                        valign: 'center'
                    });
                    console.log('📄 Cover image added, adding new page...');
                    pdfDoc.addPage();
                } else {
                    console.log('❌ Cover image file not found:', imagePath);
                }
            } catch (error) {
                console.error('❌ Error adding cover image to PDF:', error.message);
            }
        } else {
            console.log('ℹ No cover image to add');
        }

        // Title Page
        console.log('📄 Adding title:', book.title);
        pdfDoc.font(TYPOGRAPHY.fonts.sansBold).fontSize(TYPOGRAPHY.fontSizes.title).fillColor(TYPOGRAPHY.colors.heading);
        pdfDoc.text(book.title, { align: 'center' });
        pdfDoc.moveDown(2);

        if (book.subtitle && book.subtitle.trim()) {
            console.log('📄 Adding subtitle:', book.subtitle);
            pdfDoc.font(TYPOGRAPHY.fonts.sans).fontSize(TYPOGRAPHY.fontSizes.h2).fillColor(TYPOGRAPHY.colors.text).text(book.subtitle, { align: 'center' });
            pdfDoc.moveDown(1);
        } else {
            console.log('ℹ No subtitle to add');
        }

        console.log('📄 Adding author:', book.author);
        pdfDoc.font(TYPOGRAPHY.fonts.sans).fontSize(TYPOGRAPHY.fontSizes.author).fillColor(TYPOGRAPHY.colors.text).text(`by ${book.author}`, { align: 'center' });

        // Process chapters
        if (book.chapters && book.chapters.length > 0) {
            console.log('📑 Processing chapters:', book.chapters.length);
            book.chapters.forEach((chapter, index) => {
                try {
                    console.log('📄 Adding chapter:', chapter.title || `Chapter ${index + 1}`);
                    pdfDoc.addPage();

                    pdfDoc.font(TYPOGRAPHY.fonts.sansBold).fontSize(TYPOGRAPHY.fontSizes.chapterTitle).fillColor(TYPOGRAPHY.colors.heading).text(chapter.title || `Chapter ${index + 1}`, { align: 'left' });
                    pdfDoc.moveDown(TYPOGRAPHY.spacing.chapterSpacing / TYPOGRAPHY.fontSizes.body);

                    if (chapter.content && chapter.content.trim()) {
                        console.log('✍ Rendering chapter content for:', chapter.title);
                        renderMarkdown(pdfDoc, chapter.content);
                    } else {
                        console.log('ℹ Chapter content empty for:', chapter.title);
                    }
                } catch (error) {
                    console.error(`❌ Error processing chapter "${chapter.title}":`, error.message);
                }
            });
        } else {
            console.log('ℹ No chapters to process');
        }

        // Finalize the PDF and end the stream
        console.log('✅ Finalizing PDF...');
        pdfDoc.end();

    } catch (error) {
        console.error('❌ Error exporting book as PDF:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error during PDF export' });
        }
    }
};


module.exports = { exportAsDocument, exportAsPDF };

