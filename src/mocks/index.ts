import { default as mockPerfil } from './perfil';
import { default as mockProjeto } from './projeto';

const runMocks = async () => {
  console.log('initializing mocks');
  await mockPerfil();
  await mockProjeto();
  console.log('finishing mocks');
};

runMocks().then(() => {
  process.exit();
});
