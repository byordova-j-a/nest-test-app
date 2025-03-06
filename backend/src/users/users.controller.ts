import { Controller, Get, Post, Param, Body, Patch } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./create-user.dto";
import { UpdateUserDto } from "./update-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get("logins")
  async getLogins(): Promise<{ id: number; value: string }[]> {
    const userList = await this.usersService.findAll();
    return userList.map(({ login }, idx) => ({ id: idx + 1, value: login }));
  }

  @Get("tabels")
  async getTabels(): Promise<{ id: number; value: string }[]> {
    const userList = await this.usersService.findAll();
    return userList.map(({ tabel }, idx) => ({ id: idx + 1, value: tabel }));
  }

  @Post("delete/:id")
  async delete(@Param('id') id: number) {
    await this.usersService.deleteUser(id);
  }
  @Post("add")
  add(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch("edit/:id")
  patch(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser({ id, newData: updateUserDto });
  }

}
