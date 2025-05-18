import { UserDocument } from "../domain/models/user";

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument;
        }
    }
}