import { Error } from "./Error";

export type JSONResponse = {
    content: {},
    error?: Error,
    errorMessage?: string,
}