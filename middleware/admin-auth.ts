import { basicAuth } from 'hono/basic-auth'
import {APP_PASS, APP_SALT} from "../config.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

export const adminAuth = basicAuth({
  username: 'admin',
  password: APP_PASS,
  verifyUser: (username, password) => {
    const salt = bcrypt.genSaltSync(APP_SALT);
    const hash = bcrypt.hashSync(password, salt);
    return (
      username === 'admin' && bcrypt.compareSync(password, hash)
    )
  },
})
