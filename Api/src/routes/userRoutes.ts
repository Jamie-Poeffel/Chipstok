import { Router } from 
express;\nimport { getUsers } from ../controllers/userController;\n\nconst router = Router();\n\nrouter.get(/, getUsers);\n\nexport default router;
