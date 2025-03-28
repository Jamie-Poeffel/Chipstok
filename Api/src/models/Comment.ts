import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Comments } from "./Comments"; // Importiere die Comments-Tabelle

@Table({ tableName: "comment", timestamps: true })
export class Comment extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, allowNull: false, unique: true, defaultValue: DataType.UUIDV4 })
    _id!: string;

    @ForeignKey(() => Comments) // Verknüpfung mit "Comments"
    @Column({ type: DataType.UUID, allowNull: false })
    commentsId!: string;

    @Column({ type: DataType.UUID, allowNull: false })
    userId!: string;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 }) // Fix: Number → Integer
    likeCount!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    text!: string;

    @BelongsTo(() => Comments) // Jeder Kommentar gehört zu einer "Comments"-Gruppe
    parentComments!: Comments;
}
