import "reflect-metadata";
import { AppDataSource } from './data-source';

async function createTables() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully.");
    
    // Tabloları oluştur
    await AppDataSource.synchronize();
    console.log("Tables created successfully.");
    
    await AppDataSource.destroy();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error creating tables:", error);
    process.exit(1);
  }
}

createTables();
