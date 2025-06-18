import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo
} from "sequelize-typescript";
import { Post } from "./Posts"; // Each comment belongs to a post
import { User } from "./User"; // Optionally link comment to user

@Table({ tableName: "comments", timestamps: true })
export class Comment extends Model<Comment> {

    @PrimaryKey
    @Column({ type: DataType.UUID, allowNull: false, defaultValue: DataType.UUIDV4 })
    _id!: string;

    @ForeignKey(() => Post)
    @Column({ type: DataType.UUID, allowNull: false })
    postId!: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    userId!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    text!: string;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    likeCount!: number;

    @Column({ type: DataType.JSON, allowNull: false, defaultValue: [] })
    likesBy!: string[];

    @BelongsTo(() => Post)
    post!: Post;

    @BelongsTo(() => User)
    user!: User;
}
