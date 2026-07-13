import Paper, { IPaper } from '../models/Paper';

/**
 * Clean text strings by removing punctuation, lowercasing, and splitting into tokens
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .split(/\s+/)
    .filter(token => token.length > 2); // Filter out tiny stop words
}

/**
 * Calculates the dot product of two numerical vectors
 */
function dotProduct(vecA: Map<string, number>, vecB: Map<string, number>): number {
  let product = 0;
  for (const [term, valA] of vecA.entries()) {
    if (vecB.has(term)) {
      product += valA * (vecB.get(term) || 0);
    }
  }
  return product;
}

/**
 * Calculates the magnitude (Euclidean length) of a vector
 */
function magnitude(vec: Map<string, number>): number {
  let sumOfSquares = 0;
  for (const val of vec.values()) {
    sumOfSquares += val * val;
  }
  return Math.sqrt(sumOfSquares);
}

export const computeRelatedPapers = async (targetPaperId: string): Promise<any[]> => {
  // 1. Fetch the target paper and the remaining corpus pool
  const allPapers = await Paper.find({});
  const targetPaper = allPapers.find(p => p._id.toString() === targetPaperId);

  if (!targetPaper) {
    throw new Error('Target paper node not found in corpus matrix.');
  }

  // Filter out the target paper from the comparison pool
  const comparisonPool = allPapers.filter(p => p._id.toString() !== targetPaperId);

  // 2. Prepare text content strings for all items
  const getCorpusText = (p: any) => {
    const keywordStr = Array.isArray(p.keywords) ? p.keywords.join(' ') : '';
    return `${p.title} ${p.shortDescription} ${p.abstract} ${keywordStr}`;
  };

  const targetTokens = tokenize(getCorpusText(targetPaper));
  const totalDocuments = allPapers.length;

  // 3. Build Inverse Document Frequency (IDF) index across entire corpus
  const docFrequency: Map<string, number> = new Map();
  
  allPapers.forEach(paper => {
    const uniqueTokens = new Set(tokenize(getCorpusText(paper)));
    uniqueTokens.forEach(token => {
      docFrequency.set(token, (docFrequency.get(token) || 0) + 1);
    });
  });

  const idf: Map<string, number> = new Map();
  for (const [term, freq] of docFrequency.entries()) {
    // Standard mathematical smooth IDF formula: ln(1 + totalDocs / docFreq)
    idf.set(term, Math.log(1 + (totalDocuments / freq)));
  }

  // 4. Helper to construct TF-IDF weight vector maps
  const createVector = (tokens: string[]): Map<string, number> => {
    const vector = new Map<string, number>();
    
    // Calculate Term Frequencies (TF)
    tokens.forEach(token => {
      vector.set(token, (vector.get(token) || 0) + 1);
    });

    // Multiply by pre-computed IDF weights
    for (const [term, tf] of vector.entries()) {
      const termIdf = idf.get(term) || 0;
      vector.set(term, tf * termIdf);
    }

    return vector;
  };

  const targetVector = createVector(targetTokens);
  const targetMag = magnitude(targetVector);

  // 5. Compute Cosine Similarity scores against all other documents
  const scoredPapers = comparisonPool.map(paper => {
    const paperTokens = tokenize(getCorpusText(paper));
    const paperVector = createVector(paperTokens);
    
    const paperMag = magnitude(paperVector);
    const dot = dotProduct(targetVector, paperVector);
    
    // Cosine Similarity Equation: (A · B) / (||A|| * ||B||)
    let similarityScore = 0;
    if (targetMag > 0 && paperMag > 0) {
      similarityScore = dot / (targetMag * paperMag);
    }

    // Convert decimal probability index to clean display integer percentiles (e.g., 85%)
    const displayPercentage = Math.round(similarityScore * 100);

    return {
      ...paper.toObject(),
      similarityScore: Math.min(Math.max(displayPercentage, 10), 99) // Clamp nicely between 10% and 99%
    };
  });

  // 6. Sort by descending similarity and return top 4 matches
  return scoredPapers
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 4);
};