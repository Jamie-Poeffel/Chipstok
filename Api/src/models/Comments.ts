import { Table, Column, Model, DataType, PrimaryKey, HasMany } from "sequelize-typescript";
import { Comment } from "./Comment"; // Importiere das Comment-Modell

@Table({ tableName: "comments", timestamps: true })
export class Comments extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, allowNull: false, unique: true, defaultValue: DataType.UUIDV4 })
    _id!: string;

    @HasMany(() => Comment) // Ein "Comments"-Eintrag hat viele "Comment"
    commentsList!: Comment[];
}
