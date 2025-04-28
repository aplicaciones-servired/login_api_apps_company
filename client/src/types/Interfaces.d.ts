interface InfoCreate {
  label: string;
  value: number
}

export interface OptionsCreation {
  company: InfoCreate[];
  process: InfoCreate[];
  sub_process: InfoCreate[];
}
