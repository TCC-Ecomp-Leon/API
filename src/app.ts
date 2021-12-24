import express from 'express';
import { json } from 'body-parser';
import { router as dummyRouter } from './router/dummy';
import { router as authRouter } from './router/auth';
import { router as profileRoute } from './router/profile';

const app = express();
app.use(json({ limit: '50mb' }));

app.use(dummyRouter);
app.use(authRouter);
app.use(profileRoute);

export default app;
