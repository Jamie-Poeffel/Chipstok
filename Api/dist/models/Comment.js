"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Comments_1 = require("./Comments"); // Importiere die Comments-Tabelle
let Comment = class Comment extends sequelize_typescript_1.Model {
};
exports.Comment = Comment;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, unique: true, defaultValue: sequelize_typescript_1.DataType.UUIDV4 }),
    __metadata("design:type", String)
], Comment.prototype, "_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Comments_1.Comments) // Verknüpfung mit "Comments"
    ,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], Comment.prototype, "commentsId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], Comment.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0 }) // Fix: Number → Integer
    ,
    __metadata("design:type", Number)
], Comment.prototype, "likeCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Comment.prototype, "text", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Comments_1.Comments) // Jeder Kommentar gehört zu einer "Comments"-Gruppe
    ,
    __metadata("design:type", Comments_1.Comments)
], Comment.prototype, "parentComments", void 0);
exports.Comment = Comment = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "comment", timestamps: true })
], Comment);
