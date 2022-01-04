import express from 'express';
import { json } from 'body-parser';
import { router as dummyRouter } from './router/dummy';
import { router as authRouter } from './router/auth';
import { router as profileRouter } from './router/profile';
import { router as projetoRouter } from './router/projeto';
import { router as cursoRouter } from './router/curso';
import { router as codigoDeEntradaRouter } from './router/codigoDeEntrada';
import { router as cursoUniversitarioRouter } from './router/cursoUniversitario';
import { router as duvidaRouter } from './router/duvida';
import { router as atividadeRouter } from './router/atividade';
import { router as respostasAtividadesRouter } from './router/respostasAtividades';

const app = express();
app.use(json({ limit: '50mb' }));

app.use(dummyRouter);
app.use(authRouter);
app.use(profileRouter);
app.use(projetoRouter);
app.use(cursoRouter);
app.use(codigoDeEntradaRouter);
app.use(cursoUniversitarioRouter);
app.use(duvidaRouter);
app.use(atividadeRouter);
app.use(respostasAtividadesRouter);

export default app;
