import { Table, Column, Model, DataType, PrimaryKey } from "sequelize-typescript";

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
