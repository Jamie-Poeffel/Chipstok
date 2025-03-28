import { Sequelize } from "sequelize-typescript";
import mysql from "mysql2/promise";
import { User } from "../models/User";
import dotenv from "dotenv";
import { Post } from "../models/Posts";
import { Comments } from "../models/Comments";
import { Comment } from "../models/Comment";

dotenv.config();

// Datenbank-Parameter aus .env
const DB_NAME = process.env.DB_NAME!;
const DB_USER = process.env.DB_USER!;
const DB_PASS = process.env.DB_PASS!;
const DB_HOST = process.env.DB_HOST!;

// Funktion zur Erstellung der Datenbank, falls sie nicht existiert
const createDatabaseIfNotExists = async () => {
    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASS,
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        await connection.end();
    } catch (error) {
        console.error("❌ Fehler beim Erstellen der Datenbank:", error);
    }
};

// Sequelize-Verbindung
export const sequelize = new Sequelize({
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASS,
    host: DB_HOST,
    dialect: "mariadb",
    models: [User, Post, Comments, Comment],
    logging: false,
});

// Verbindung herstellen und Tabellen synchronisieren
export const connectDB = async () => {
    await createDatabaseIfNotExists(); // Erstellt die DB falls nicht vorhanden
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true }); // Erstellt/Ändert Tabellen automatisch
    } catch (error) {
        console.error("❌ Verbindungsfehler:", error);
    }
};
