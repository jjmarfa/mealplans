import { User } from "../types";
import BaseRepository from "./Base";

class UserRepository extends BaseRepository<User> {
  protected model: string = "users";
}

export default UserRepository;
