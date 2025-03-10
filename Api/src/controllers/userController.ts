import { Request, Response } from 
express;\n\nexport const getUsers = (req: Request, res: Response) => {\n  res.json([{ id: 1, name: Max
Mustermann }]);\n};
