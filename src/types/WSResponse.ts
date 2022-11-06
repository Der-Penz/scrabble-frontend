import Action from "./Actions"

export type WSResponse<T> = {
    action: Action;
    message: T;
}