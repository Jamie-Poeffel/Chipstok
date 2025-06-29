﻿import { Table, Column, Model, DataType, PrimaryKey, HasMany, AllowNull } from "sequelize-typescript";
import { Comment } from "./Comment";
import { Col } from "sequelize/types/utils";

@Table({ tableName: "users", timestamps: true })
export class User extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, allowNull: false, unique: true, defaultValue: DataType.UUIDV4 })
    _id!: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    username!: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    email!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    passwordHash!: string;

    @Column({
        type: DataType.JSON,
        allowNull: true,
        defaultValue: { likedHashtags: [] }
    })
    taste!: { likedHashtags: string[] };

    @Column({ type: DataType.JSON, allowNull: false, defaultValue: [] })
    followers!: string[];

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    emailVeryfied!: Boolean;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: ""
    })
    firstname!: String;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: ""
    })
    lastname!: String;

    @Column({
        type: DataType.JSON,
        allowNull: true,
        defaultValue: { profilePicture: "", bio: "Hello i am new to Chipsytok", followers: 0, following: 0, posts: 0, likeCount: 0, fullname: "" }
    })
    profile!: { profilePicture: string, bio: string, followers: number, following: number, posts: number, likeCount: number, fullname: string };

    @Column({
        type: DataType.JSON,
        allowNull: true,
        defaultValue: []
    })
    likedPosts!: string[];

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: 'chipsytok'
    })
    login_site!: string;

    @Column({
        type: DataType.JSON,
        allowNull: true,
        defaultValue: [{ _id: "", url: "" }]
    })
    postedVideos!: { _id: string, url: string }[];

    @Column({
        type: DataType.JSON,
        allowNull: false,
        defaultValue: []
    })
    viewedVideos!: string[];

    @HasMany(() => Comment, { foreignKey: "userId", as: "comments" })
    comments!: Comment[];
}
