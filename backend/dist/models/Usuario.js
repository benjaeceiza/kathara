"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// 3. El Schema de Mongoose para el Horario[cite: 7]
const HorarioSchema = new mongoose_1.Schema({
    dia: {
        type: String,
        enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        required: true
    },
    activo: { type: Boolean, default: true },
    horaInicio: { type: String, default: '09:00' },
    horaFin: { type: String, default: '20:00' }
}, { _id: false });
// 4. El Super-Schema Principal[cite: 7]
const UsuarioSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    rol: { type: String, enum: ['cliente', 'peluquero', 'admin'], default: 'cliente' },
    avatar: { type: String },
    telefono: { type: String },
    recibeTurnos: { type: Boolean, default: false },
    especialidades: [{ type: String }],
    horarios: { type: [HorarioSchema], default: [] },
    tituloProfesional: { type: String, default: 'Estilista' },
    turnosCompletados: { type: Number, default: 0 },
    faltas: { type: Number, default: 0 },
    exentoSena: { type: Boolean, default: false },
    activo: { type: Boolean, default: true },
    fechaCreacion: { type: Date, default: Date.now },
    portafolio: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Portafolio' }
});
exports.default = mongoose_1.default.model('Usuario', UsuarioSchema);
//# sourceMappingURL=Usuario.js.map