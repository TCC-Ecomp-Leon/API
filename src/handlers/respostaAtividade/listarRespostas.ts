import { Perfil, RegraPerfil, RespostaAtividade } from '../../models';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const listarRespostasHandler = new Handler(
  async (
    context
  ): Promise<NavigationResult<{ respostas: RespostaAtividade }>> => {
    const userProfile = getCurrentProfile<Perfil>(context);

    const queryParamProjeto = context.query['projeto'];
    const queryParamAtividade = context.query['atividade'];

    let idProjeto: string | undefined = undefined;
    let idAtividade: string | undefined = undefined;

    if (queryParamProjeto !== undefined) {
      idProjeto = queryParamProjeto as string;
    }
    if (queryParamAtividade !== undefined) {
      idAtividade = queryParamAtividade as string;
    }

    if (
      userProfile.regra === RegraPerfil.Geral &&
      !userProfile.universitario.universitario
    ) {
      return {
        status: 403,
        body: {
          error: 'NOT_AUTHORIZED',
        },
      };
    }
  }
);
