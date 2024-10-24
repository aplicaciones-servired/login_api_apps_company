import { login_unif } from '../connections/login_unificado'
import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize'

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: string | null
  declare names: string
  declare lastNames: string
  declare document: number
  declare phone: number
  declare email: string
  declare username: string
  declare password: string
  declare password2: string | null
  declare state: boolean
  declare resetPasswordToken: string | null
  declare resetPasswordExpires: Date | null
  declare company: number
  declare process: number
  declare sub_process: number
  declare createdAt: Date | null
  declare updatedAt: Date | null
}

User.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  names: { type: DataTypes.STRING(40), allowNull: false, },
  lastNames: { type: DataTypes.STRING(40), allowNull: false, },
  document: { type: DataTypes.BIGINT, allowNull: false, unique: true },
  phone: { type: DataTypes.BIGINT, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  username: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(125), allowNull: false, },
  password2: { type: DataTypes.STRING(125), allowNull: true, },
  state: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  company: { type: DataTypes.INTEGER, allowNull: false, },
  process: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0, max: 12 } },
  sub_process: { type: DataTypes.STRING(20), allowNull: false, validate: { min: 0, max: 30 } },
  resetPasswordToken: { type: DataTypes.STRING, allowNull: true, },
  resetPasswordExpires: { type: DataTypes.DATE, allowNull: true, },
  createdAt: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
}, {
  sequelize: login_unif,
  modelName: 'login_users',
})

export { User }