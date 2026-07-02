import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { conectarDB } from './config/db';
import authRoutes from './routes/authRoutes';
import serviciosRoutes from './routes/serviciosRoutes';
import peluquerosRoutes from './routes/peluquerosRoutes';
import turnosRoutes from './routes/turnosRoutes';

// Configuramos las variables de entorno
dotenv.config();

// Conectamos a la base de datos
conectarDB();

// Inicializamos la app
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares básicos
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite leer los JSON que mandemos en el body


app.use('/api/auth', authRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/peluqueros', peluquerosRoutes);
app.use('/api/turnos', turnosRoutes);



// Arrancar el motor
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en el puerto ${PORT}`);
}); 