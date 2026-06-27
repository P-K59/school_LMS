import { cleanEnv, str, port } from "envalid";

export const env = cleanEnv(process.env,{
    NODE_ENV: str({
        default: "development",
        choices: ["development", "production"]
    }),
    Port:port({
        default:8000
    }),
    DATABASE_URL: str(),
    JWT_ACCESS_SECRET: str(),
    JWT_REFRESH_SECRET: str(),
    JWT_ACCESS_EXPIRES: str(),
    JWT_REFRESH_EXPIRES: str(),
    ORIGIN: str(),
});