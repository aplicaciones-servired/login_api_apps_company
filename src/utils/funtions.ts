import { MainError } from '../types/error.mysql';
/**
 * Función para validar si un Error de type unknow pertenece a Interface MainError. 
 *
 * @param error - Recibe como parametro un error .
 * @returns Retorna un valor booleano. el cual indica si el error es de tipo MainError.
 */
function isMainError(error: unknown): error is MainError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'parent' in error &&
    typeof (error as MainError).parent.code === 'string'
  );
}

export { isMainError };