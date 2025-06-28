import compression from "compression";
import { Router } from "express";
import helmet from "helmet";
import hpp from "hpp";

const security = Router();

security.use(helmet());
security.use(hpp());
security.use(compression());

export default security;
