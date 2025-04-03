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
exports.Comments = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Comment_1 = require("./Comment"); // Importiere das Comment-Modell
let Comments = class Comments extends sequelize_typescript_1.Model {
};
exports.Comments = Comments;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, unique: true, defaultValue: sequelize_typescript_1.DataType.UUIDV4 }),
    __metadata("design:type", String)
], Comments.prototype, "_id", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Comment_1.Comment) // Ein "Comments"-Eintrag hat viele "Comment"
    ,
    __metadata("design:type", Array)
], Comments.prototype, "commentsList", void 0);
exports.Comments = Comments = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "comments", timestamps: true })
], Comments);
