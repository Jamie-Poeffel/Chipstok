import { Request, RequestHandler, Response } from "express";

export const getAllUsers: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    res.send({ name: "Max", lastname: "Musterman" });
}