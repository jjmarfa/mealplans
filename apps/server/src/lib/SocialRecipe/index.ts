import { adapter, core } from "@social-recipes/core";
import auth from "./auth";
import database from "./database";

adapter.setup({
  database,
  auth,
});

export default core;
