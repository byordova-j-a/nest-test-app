import { Injectable , HttpStatus, HttpException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";

type TUserData = {
  login: string;
  tabel: string;
  password: string;
}

const createErrorMessage = (type: 'login'| 'tabel') => {
  return `User with this ${type} already exists`;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) { }

async checkLoginTabel({ tabel,login }: { tabel?: string, login?: string }) {
  const userTabel = tabel? await this.userModel.findOne({ where: { tabel } }) : null;
  const userLogin = login ? await this.userModel.findOne({ where: { login } }) : null;
  if (userTabel) {
    throw new HttpException(createErrorMessage('tabel'), HttpStatus.BAD_REQUEST);
  }
  if (userLogin) {
    throw new HttpException(createErrorMessage('login'), HttpStatus.BAD_REQUEST);
  }
}

  findAll(): Promise<User[]> {
    return this.userModel.findAll({ raw: true });
  }

  getUser({
    login,
    tabel,
    password,
  }: TUserData): Promise<User | null> {
    return this.userModel.findOne({
      where: {
        login,
        tabel,
        password,
      },
      raw: true,
    });
  }

  async createUser(data: TUserData): Promise<User> {
    const { tabel, login } = data;
    await this.checkLoginTabel({ tabel, login });
    return this.userModel.create(data);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userModel.destroy({
      where: {
        id,
      },
    });
  }

  async updateUser(data: {
    id: number;
    newData: Partial<TUserData>
  }): Promise<User | null> {
    const { id, newData } = data;
    const { tabel, login } = newData;

    await this.checkLoginTabel({ tabel, login });
    await this.userModel.update(
      { ...newData },
      {
        where: {
          id,
        },
      },
    );

    return this.userModel.findOne({ where: { id } })
  }
}
