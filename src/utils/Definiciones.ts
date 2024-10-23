
/**
  * @param company: Número de empresa (0 | 1 | 2)
  * @returns string -> Nombre de la empresa
  * @description Retorna el nombre de la empresa según el número ingresado.
  * MultiredYServired = 0 | Multired = 1 | Servired = 2
  * 
*/
export function Company(company: number): string {
  const companies: { [key in number]: string } = {
    0: 'MultiredYServired',
    1: 'Multired',
    2: 'Servired'
  };
  return companies[company];
}

/**
  * @param procces: Número de proceso (0 - 12)
  * @returns string -> Nombre del proceso 
  * @description Retorna el nombre del proceso según el número ingresado.
  * Técnologia = 0 | Financiero = 1 | Contabilidad = 2 | Comercial = 3 | Administración = 4 | Gestión Humana = 5 
  * | Gerencia = 6 | Tesoreria = 7 | Auditoria = 8 | Cumplimiento = 9 | Operaciones = 10 | Legal = 11 | Mercadeo = 12
  * 
*/
export function Procces(procces: number): string {
  const process: { [key in number]: string } = {
    0: 'Técnologia',
    1: 'Financiero',
    2: 'Contabilidad',
    3: 'Comercial',
    4: 'Administración',
    5: 'Gestión Humana',
    6: 'Gerencia',
    7: 'Tesoreria',
    8: 'Auditoria',
    9: 'Cumplimiento',
    10: 'Operaciones',
    11: 'Legal',
    12: 'Mercadeo'
  };
  return process[procces];
}

/**
  * @param sub_procces: Número de sub_proceso (0 - 31)
  * @returns string -> Nombre del sub_proceso
  * @description Retorna el nombre del sub_proceso según el número ingresado.
  * Revisar Función Sub_Procces para ver los nombres de los sub_procesos.
  * 
*/
export function Sub_Procces(sub_procces: number): string {
  const sub_process: { [key in number]: string } = {
    0: 'soporte',
    1: 'coordinador soporte',
    2: 'cartera',
    3: 'aux contable',
    4: 'aux administrativo',
    5: 'aux cartera',
    6: 'Sub proceso 7',
    7: 'Sub proceso 8',
    8: 'Sub proceso 9',
    9: 'Sub proceso 10',
    10: 'Sub proceso 11',
    11: 'Sub proceso 12',
    12: 'Sub proceso 13',
    13: 'Sub proceso 14',
    14: 'Sub proceso 15',
    15: 'Sub proceso 16',
    16: 'Sub proceso 17',
    17: 'Sub proceso 18',
    18: 'Sub proceso 19',
    19: 'Sub proceso 20',
    20: 'Sub proceso 21',
    21: 'Sub proceso 22',
    22: 'Sub proceso 23',
    23: 'Sub proceso 24',
    24: 'Sub proceso 25',
    25: 'Sub proceso 26',
    26: 'Sub proceso 27',
    27: 'Sub proceso 28',
    28: 'Sub proceso 29',
    29: 'Sub proceso 30',
    30: 'Sub proceso 31'
  };
  return sub_process[sub_procces];
}

export function State (state: boolean): string {
  return state ? 'Activo' : 'Inactivo';
}
