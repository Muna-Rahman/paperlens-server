import { Request, Response, NextFunction } from 'express';
import Paper from "../models/Paper";
import { auth } from '../lib/auth'; 

export const getPapers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, field, sort } = req.query;
    
    let queryCondition: any = {};
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      queryCondition.$or = [
        { title: searchRegex },
        { abstract: searchRegex },
        { keywords: searchRegex }
      ];
    }
    if (field && field !== 'All') {
      queryCondition.field = field;
    }

    let sortCondition: any = { createdAt: -1 };
    if (sort === 'Oldest') sortCondition = { year: 1 };
    if (sort === 'Newest') sortCondition = { year: -1 };
    if (sort === 'Citations') sortCondition = { citationCount: -1 };

    const session = await auth.api.getSession({
      headers: new Headers(req.headers as any)
    });

    const isUserAuthenticated = !!session; 
    const queryLimit = isUserAuthenticated ? 100 : 3; 

    const totalCount = await Paper.countDocuments(queryCondition);
    const papers = await Paper.find(queryCondition)
      .sort(sortCondition)
      .limit(queryLimit);

    res.status(200).json({
      success: true,
      authenticated: isUserAuthenticated,
      totalAvailable: totalCount,
      countReturned: papers.length,
      papers
    });
  } catch (error) {
    next(error);
  }
};

export const createPaper = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as any)
    });

    if (!session) {
      res.status(401).json({ success: false, message: "Unauthorized: Please sign in to submit entries." });
      return;
    }

    const { title, shortDescription, abstract, field, year, citationCount, keywords, image } = req.body;

    const newPaper = new Paper({
      title,
      shortDescription,
      abstract,
      field,
      year: Number(year),
      citationCount: Number(citationCount) || 0,
      keywords: Array.isArray(keywords) ? keywords : String(keywords).split(',').map(k => k.trim()),
      image: image || '',
      addedBy: session.user.id
    });

    const savedPaper = await newPaper.save();

    res.status(201).json({
      success: true,
      message: "Research paper indexed securely.",
      paper: savedPaper
    });
  } catch (error) {
    next(error);
  }
};