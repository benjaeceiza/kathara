
import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

export const conectarDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`🛢️  MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error al conectar a MongoDB: ${error}`);
    process.exit(1); 
  }
};