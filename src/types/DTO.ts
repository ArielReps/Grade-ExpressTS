import { IUser } from "./user";

export interface DTO{
    success:boolean,
    user?: IUser,
        auth: boolean,
        content?: any,
}