import { Company, Process, SubProcess, State } from '../enum/enums';

export const getCompanyName = (company: Company): string =>  Company[company]

export const getProccesName = (process: Process): string  => Process[process]

export const getSubProccesName = (sub_process: SubProcess): string => SubProcess[sub_process]

export const getStateName = (state: State): string => State[state]
