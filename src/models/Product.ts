import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import Company from "./Company";

@Table({
    tableName: 'products'
})

class Product extends Model {
    @AllowNull(false)
    @Column({
        type: DataType.STRING(50)
    })
    declare code: string

    @AllowNull(false)
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string

    @AllowNull(false)
    @Column({
        type: DataType.STRING(100)
    })
    declare descrip: string

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL
    })
    declare amount: number

    @ForeignKey(() => Company)
    declare companyId: number

    @BelongsTo(() => Company)
    declare company: Company

}

export default Product