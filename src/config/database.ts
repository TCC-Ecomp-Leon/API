import { connect } from 'mongoose';
import environmentVariables from './environmentVariables';

export async function connectDatabase() {
  const mongoUrl: string = environmentVariables().MONGODB_URL;
  await connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
}
