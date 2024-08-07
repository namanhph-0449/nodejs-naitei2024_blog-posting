export class UserInfoDto {
  id: number;
  email: string;
  username: string;
  role: string;

  constructor(data: { id: number; email: string; username: string; role: string }) {
    this.id = data.id;
    this.email = data.email;
    this.username = data.username;
    this.role = data.role;
  }
}
