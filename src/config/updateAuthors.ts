import mongoose from 'mongoose';
import Paper from '../models/Paper.js';
import { connectDB } from './db.js';


const globalAuthorsPool = [
  "Dr. Anisul Rahman", "Fatimah Al-Mansoor", "Elena Rostova", "Johnathan Blake",
  "Tariqul Islam", "Mei-Ling Chang", "Chloe Jenkins", "Arif Chowdhury",
  "Alejandro Gomez", "Dr. Yuki Tanaka", "Sajid Hasan", "Sarah Connor",
  "Kwame Mensah", "Nusrat Jahan", "Oliver Dupont", "Hans Gruber",
  "Tasnim Sultana", "Liam O'Connor", "Amina Diop", "Mahmudul Karim",
  "Sofia Rossi", "Ravi Shankar", "Zainab Bi", "Alexander Vance", "Farhana Khan"
];

const assignAuthorsToDataset = async () => {
  try {
    
    await connectDB();
    console.log("Connected to MongoDB Atlas database successfully.");

    
    const papers = await Paper.find({});
    console.log(`Discovered ${papers.length} documents in collection.`);

    if (papers.length === 0) {
      console.log("No data elements discovered to target.");
      process.exit(0);
    }

    let updatedCount = 0;

    
    for (let i = 0; i < papers.length; i++) {
      const currentPaper = papers[i];

    
      let selectedAuthors: string[] = [];
      
      
      const baseIndex = (Math.floor(i / 3.5)) % globalAuthorsPool.length;
      
      if (i % 3 === 0) {
       
        selectedAuthors = [globalAuthorsPool[baseIndex]];
      } else if (i % 3 === 1) {
       
        const secondIndex = (baseIndex + 1) % globalAuthorsPool.length;
        selectedAuthors = [globalAuthorsPool[baseIndex], globalAuthorsPool[secondIndex]];
      } else {
      
        const secondIndex = (baseIndex + 1) % globalAuthorsPool.length;
        const thirdIndex = (baseIndex + 2) % globalAuthorsPool.length;
        selectedAuthors = [globalAuthorsPool[baseIndex], globalAuthorsPool[secondIndex], globalAuthorsPool[thirdIndex]];
      }

    
      await Paper.updateOne(
        { _id: currentPaper._id },
        { $set: { authors: selectedAuthors } }
      );
      
      updatedCount++;
    }

    console.log(`💥 Complete! Modified ${updatedCount} paper profiles inside MongoDB.`);
    process.exit(0);
  } catch (error) {
    console.error("Critical transmission disruption caught during script payload loop:", error);
    process.exit(1);
  }
};

assignAuthorsToDataset();