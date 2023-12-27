import AdapterNoImplementationError from "../errors/AdapterNoImplementationError";

class AuthAdapter {
  async create(_email: string, _password: string): Promise<string> {
    throw new AdapterNoImplementationError();
  }
}

export default AuthAdapter;
