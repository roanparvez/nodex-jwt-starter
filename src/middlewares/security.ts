import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import compression from "compression";
import { Router } from "express";

const security = Router();

security.use(helmet());
security.use(xss());
security.use(mongoSanitize());
security.use(hpp());
security.use(compression());

export default security;
