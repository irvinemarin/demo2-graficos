import {config} from "dotenv";

config();

console.log(process.env)

export default {
    token: process.env.TOKEN || "--",
    url: process.env.URL_BASE || "--",
};
