import { AllowNull, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Product from "./Product";

@Table({
    tableName: 'companies'
})

class Company extends Model {
    @AllowNull(false)
    @Column({
        type: DataType.STRING(100)
    })
    declare nit: string

    @AllowNull(false)
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string

    // @AllowNull(false)
    @Column({
        type: DataType.STRING(100)
    })
    declare address: string

    // @AllowNull(false)
    @Column({
        type: DataType.STRING(20)
    })
    declare phone: string

    @HasMany(() => Product, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare expenses: Product[]

}

export default Company