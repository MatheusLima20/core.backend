import { Request } from "express";
import formidable from "formidable";

export interface UploadRequest extends Request {
    file?: formidable.File;
}
