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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Post_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User"); // Assuming you have a User model
const Comment_1 = require("./Comment"); // Assuming you have a Comment model
let Post = Post_1 = class Post extends sequelize_typescript_1.Model {
    // Hook to update likeCount for the User when a new Post is created
    static updateUserLikeCountAfterPostCreate(post) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Post_1.updateUserLikeCount(post.userid);
        });
    }
    // Hook to update likeCount for the User when a Post is updated
    static updateUserLikeCountAfterPostUpdate(post) {
        return __awaiter(this, void 0, void 0, function* () {
            if (post.changed('likeCount')) {
                yield Post_1.updateUserLikeCount(post.userid);
            }
        });
    }
    // Helper function to update the total likeCount for the User
    static updateUserLikeCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Calculate the total number of likes for the user across all posts
                const totalLikes = yield Post_1.sum('likeCount', {
                    where: { userid: userId },
                });
                // Update the User's profile with the new likeCount (nested within profile)
                yield User_1.User.update({
                    // Update the likeCount field inside the profile object
                    profile: sequelize_typescript_1.Sequelize.fn('JSON_SET', sequelize_typescript_1.Sequelize.col('profile'), '$.likeCount', totalLikes),
                }, {
                    where: { _id: userId }
                });
            }
            catch (error) {
                console.error('Error updating user like count:', error);
            }
        });
    }
};
exports.Post = Post;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, unique: true, defaultValue: sequelize_typescript_1.DataType.UUIDV4 }),
    __metadata("design:type", String)
], Post.prototype, "_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], Post.prototype, "userid", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "likeCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "commentCount", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Comment_1.Comment, { foreignKey: "postId", as: "comments" }),
    __metadata("design:type", Array)
], Post.prototype, "comments", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Post.prototype, "URL", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON, allowNull: false }),
    __metadata("design:type", Array)
], Post.prototype, "Hashtags", void 0);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post]),
    __metadata("design:returntype", Promise)
], Post, "updateUserLikeCountAfterPostCreate", null);
__decorate([
    sequelize_typescript_1.AfterUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post]),
    __metadata("design:returntype", Promise)
], Post, "updateUserLikeCountAfterPostUpdate", null);
exports.Post = Post = Post_1 = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "posts", timestamps: true })
], Post);
