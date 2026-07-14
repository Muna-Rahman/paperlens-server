import { Request, Response, NextFunction } from 'express';
import Paper from '../models/Paper';
import { computeRelatedPapers } from '../services/similarity.service';

// Extend interface to safely parse user IDs out of the authenticated middleware session
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

/**
 * Public catalog lookup query handler
 */
export const getPapers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, field, sort } = req.query;
    
    let query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (field && field !== 'All' && field !== 'ALL') {
      query.field = field;
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'Oldest' || sort === 'OLDEST') sortOptions = { year: 1 };
    if (sort === 'Newest' || sort === 'NEWEST') sortOptions = { year: -1 };
    if (sort === 'Citations' || sort === 'CITATIONS') sortOptions = { citationCount: -1 };

    const papers = await Paper.find(query).sort(sortOptions).lean();
    const totalAvailable = await Paper.countDocuments(query);

    res.status(200).json({
      success: true,
      papers,
      totalAvailable
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve details for a single document node
 */
export const getPaperById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const paper = await Paper.findById(req.params.id).lean();
    if (!paper) {
      res.status(404).json({ success: false, message: "Document register not found." });
      return;
    }
    res.status(200).json({ success: true, paper });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve the top 4 most similar papers using the TF-IDF / cosine similarity engine
 */
export const getRelatedPapers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const exists = await Paper.exists({ _id: id });
    if (!exists) {
      res.status(404).json({ success: false, message: "Document register not found." });
      return;
    }

    const papers = await computeRelatedPapers(id);

    res.status(200).json({
      success: true,
      papers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a brand new paper to the repository core
 */
export const createPaper = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Contributed document rejected: User ID undefined." });
      return;
    }

    // Extract values cleanly out of the request payload frame
    const { title, shortDescription, abstract, authors, field, year, citationCount, keywords, image } = req.body;

    // Validate absolute essentials explicitly
    if (!title || !abstract || !field) {
      res.status(400).json({ success: false, message: "Missing required core fields (Title, Abstract, or Field)." });
      return;
    }

    // Process authors correctly into clean arrays if submitted as standard horizontal strings
    const processedAuthors = Array.isArray(authors)
      ? authors.map((a: string) => a.trim()).filter(Boolean)
      : typeof authors === 'string'
        ? authors.split(',').map((a) => a.trim()).filter(Boolean)
        : [];

    if (processedAuthors.length === 0) {
      res.status(400).json({ success: false, message: "At least one author is required." });
      return;
    }

    // Process keywords correctly into clean arrays if submitted as standard horizontal strings
    const processedKeywords = Array.isArray(keywords) 
      ? keywords 
      : typeof keywords === 'string' 
        ? keywords.split(',').map(k => k.trim()) 
        : [];

    // Create the document model entry 
    const paper = new Paper({
      title,
      shortDescription: shortDescription || '',
      abstract,
      authors: processedAuthors,
      field,
      year: Number(year) || 2026,
      citationCount: Number(citationCount) || 0,
      keywords: processedKeywords,
      image: image || '',
      addedBy: String(userId) // Force cast into a strict sequence string
    });

    const savedPaper = await paper.save();

    res.status(201).json({
      success: true,
      message: "New document node indexed into vector corpus matrix.",
      paper: savedPaper
    });
  } catch (error: any) {
    // Catch Mongoose Schema validation properties explicitly to prevent 500 exceptions
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
};

/**
 * Delete a paper (Strictly restricted to the author who submitted it)
 */
export const deletePaper = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const paper = await Paper.findById(id);
    if (!paper) {
      res.status(404).json({ success: false, message: "Document register not found." });
      return;
    }

    if (paper.addedBy.toString() !== userId) {
      res.status(403).json({ success: false, message: "Access denied. You can only drop your own papers." });
      return;
    }

    await Paper.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Document successfully dropped." });
  } catch (error) {
    next(error);
  }
};
/**
 * Retrieve document nodes strictly created by the currently authenticated user session profile
 */
export const getPapersMine = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Read the ID property cleanly from the session token object
    const rawUserId = req.user?.id || req.user?._id;

    if (!rawUserId) {
      res.status(401).json({ success: false, message: "Unauthorized account context index access." });
      return;
    }

    // Explicitly stringify the comparison field to match MongoDB object structures safely
    const papers = await Paper.find({ addedBy: String(rawUserId) }).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: papers.length,
      papers: papers || []
    });
  } catch (error) {
    next(error);
  }
};