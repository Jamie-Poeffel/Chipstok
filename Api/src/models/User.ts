import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

@Table({ tableName: "users", timestamps: true })
export class User extends Model {
    @Column({ type: DataType.STRING, allowNull: false, unique: "username_unique" })
    username!: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: "email_unique" })
    email!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    passwordHash!: string;

    @Column({
        type: DataType.JSON,
        allowNull: true,
        defaultValue: { likedHashtags: [] }
    })
    taste!: { likedHashtags: string[] };

    @Column({
        type: DataType.JSON,
        allowNull: true,
        defaultValue: { profilePicture: "", bio: "", followers: 0, following: 0, posts: 0, likeCount: 0 }
    })
    profile!: { profilePicture: string, bio: string, followers: number, following: number, posts: number, likeCount: number };

    @Column({
        type: DataType.JSON,
        allowNull: true,
        defaultValue: []
    })
    likedPosts!: string[];

    @Column({
        type: DataType.JSON,
        allowNull: true,
        defaultValue: []
    })
    postedVideos!: string[];
}
