import { InformacoesPerfil, Perfil, RegraPerfil } from '../../models';
import {
  UpdateInformacoesCursoUniversitario,
  UpdateProfileValidator,
} from '../../schemas/profile';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const updateProfileValidatorHandler = new Handler(
  async (context: Context): Promise<NavigationResult<null>> => {
    const profile = context.body['profile'];
    const cursoUniversitario = context.body['cursoUniversitario'];

    if (!UpdateProfileValidator(profile)) {
      return {
        status: 400,
        body: {
          error: JSON.stringify(UpdateProfileValidator.errors),
        },
      };
    }

    if (cursoUniversitario !== undefined) {
      if (!UpdateInformacoesCursoUniversitario(cursoUniversitario)) {
        return {
          status: 400,
          body: {
            error: JSON.stringify(UpdateInformacoesCursoUniversitario.errors),
          },
        };
      }

      context.setVariable('updatingCursoUniversitario', cursoUniversitario);
    }

    context.setVariable('updatingProfile', profile);

    return null;
  }
);
