import { AllowNull, Column, DataType, Default, HasMany, Model, Table, Unique } from "sequelize-typescript";
import Company from "./Company";

@Table({
    tableName: 'users'
})

class User extends Model {
    @AllowNull(false)
    @Column({
        type: DataType.STRING(50)
    })
    declare name: string

    @AllowNull(false)
    @Column({
        type: DataType.STRING(60)
    })
    declare password: string

    @Unique
    @AllowNull(false)
    @Column({
        type: DataType.STRING(50)
    })
    declare email: string

    @Column({
        type: DataType.STRING(6)
    })
    declare token: string

    // @HasMany(() => Company, {
    //     onUpdate: 'CASCADE',
    //     onDelete: 'CASCADE'
    // })
    // declare companies: Company[]
}

export default User