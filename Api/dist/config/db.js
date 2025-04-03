"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const promise_1 = __importDefault(require("mysql2/promise"));
const User_1 = require("../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
const Posts_1 = require("../models/Posts");
const Comments_1 = require("../models/Comments");
const Comment_1 = require("../models/Comment");
dotenv_1.default.config();
// Datenbank-Parameter aus .env
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
// Funktion zur Erstellung der Datenbank, falls sie nicht existiert
const createDatabaseIfNotExists = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield promise_1.default.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASS,
        });
        yield connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        yield connection.end();
    }
    catch (error) {
        console.error("❌ Fehler beim Erstellen der Datenbank:", error);
    }
});
// Sequelize-Verbindung
exports.sequelize = new sequelize_typescript_1.Sequelize({
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASS,
    host: DB_HOST,
    dialect: "mariadb",
    models: [User_1.User, Posts_1.Post, Comments_1.Comments, Comment_1.Comment],
    logging: false,
});
// Verbindung herstellen und Tabellen synchronisieren
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield createDatabaseIfNotExists(); // Erstellt die DB falls nicht vorhanden
    try {
        yield exports.sequelize.authenticate();
        yield exports.sequelize.sync({ alter: true }); // Erstellt/Ändert Tabellen automatisch
    }
    catch (error) {
        console.error("❌ Verbindungsfehler:", error);
    }
});
exports.connectDB = connectDB;
