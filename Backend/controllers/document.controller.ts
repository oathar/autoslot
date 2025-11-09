import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import fs from 'fs';
const pdf = require('pdf-parse');

const prisma = new PrismaClient();

// Upload document
export const uploadDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Save document info to database
    const document = await prisma.document.create({
      data: {
        filename: req.file.originalname,
        path: req.file.path,
        uploadedBy: (req as any).user?.email || 'unknown',
        extracted: false
      }
    });

    res.status(201).json({
      message: 'Document uploaded successfully',
      document
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all documents
export const getDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const documents = await prisma.document.findMany({
      orderBy: {
        uploadedAt: 'desc'
      }
    });

    res.status(200).json({
      message: 'Documents fetched successfully',
      documents
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Extract data from document
export const extractDocumentData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Find document
    const document = await prisma.document.findUnique({
      where: { id: parseInt(id) }
    });

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    // Check if file exists
    if (!fs.existsSync(document.path)) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    // Extract text from PDF
    const dataBuffer = fs.readFileSync(document.path);
    const pdfData = await pdf(dataBuffer);
    
    // Process the extracted text and convert to structured data
    const extractedData = processExtractedText(pdfData.text);
    
    // Update document with extracted data
    const updatedDocument = await prisma.document.update({
      where: { id: document.id },
      data: {
        extracted: true,
        data: extractedData
      }
    });

    res.status(200).json({
      message: 'Data extracted successfully',
      document: updatedDocument
    });
  } catch (error) {
    console.error('Error extracting document data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Process extracted text and convert to structured data
const processExtractedText = (text: string): any => {
  // This is a simplified example. In a real application, you would implement
  // more sophisticated text processing and data extraction logic.
  
  // Split text into lines
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  // Look for common patterns in academic documents
  const extractedData: any = {
    title: '',
    courses: [],
    teachers: [],
    schedule: [],
    metadata: {
      wordCount: text.split(' ').length,
      lineCount: lines.length,
      contentPreview: text.substring(0, 200) + (text.length > 200 ? '...' : '')
    }
  };
  
  // Simple pattern matching for demonstration
  // In a real application, you would use more sophisticated NLP techniques
  lines.forEach(line => {
    // Look for course names (simplified pattern)
    if (line.match(/^[A-Z]{2,4}\s*\d{3,4}.*[A-Za-z]+/)) {
      extractedData.courses.push(line.trim());
    }
    
    // Look for teacher names (simplified pattern)
    if (line.match(/(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+[A-Z][a-z]+\s+[A-Z][a-z]+/)) {
      extractedData.teachers.push(line.trim());
    }
    
    // Look for time slots (simplified pattern)
    if (line.match(/\d{1,2}:\d{2}\s*(AM|PM)?\s*-\s*\d{1,2}:\d{2}\s*(AM|PM)?/)) {
      extractedData.schedule.push(line.trim());
    }
  });
  
  // Set title as first non-empty line
  extractedData.title = lines[0] || 'Untitled Document';
  
  return extractedData;
};