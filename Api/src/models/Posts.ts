import { Table, Column, Model, DataType, PrimaryKey, AfterCreate, AfterUpdate, Sequelize } from "sequelize-typescript";
import { User } from "./User"; // Assuming you have a User model

@Table({ tableName: "posts", timestamps: true })
export class Post extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, allowNull: false, unique: true, defaultValue: DataType.UUIDV4 })
    _id!: string;

    @Column({ type: DataType.UUID, allowNull: false })
    userid!: string;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    likeCount!: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    commentCount!: number;

    @Column({ type: DataType.UUID, allowNull: false, unique: true })
    commentListID!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    URL!: string;

    @Column({ type: DataType.JSON, allowNull: false })
    Hashtags!: string[];

    // Hook to update likeCount for the User when a new Post is created
    @AfterCreate
    static async updateUserLikeCountAfterPostCreate(post: Post) {
        await Post.updateUserLikeCount(post.userid);
    }

    // Hook to update likeCount for the User when a Post is updated
    @AfterUpdate
    static async updateUserLikeCountAfterPostUpdate(post: Post) {
        if (post.changed('likeCount')) {
            await Post.updateUserLikeCount(post.userid);
        }
    }

    // Helper function to update the total likeCount for the User
    static async updateUserLikeCount(userId: string) {
        try {
            // Calculate the total number of likes for the user across all posts
            const totalLikes = await Post.sum('likeCount', {
                where: { userid: userId },
            });

            // Update the User's profile with the new likeCount (nested within profile)
            await User.update(
                {
                    // Update the likeCount field inside the profile object
                    profile: Sequelize.fn('JSON_SET', Sequelize.col('profile'), '$.likeCount', totalLikes),
                },
                {
                    where: { _id: userId }
                }
            );
        } catch (error) {
            console.error('Error updating user like count:', error);
        }
    }
}
