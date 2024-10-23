export interface MainError extends Error {
  name:     string;
  errors:   Error[];
  parent:   Original;
  original: Original;
  fields:   Fields;
  sql:      string;
}

interface Error {
  message:       string;
  type:          string;
  path:          string;
  value:         string;
  origin:        string;
  instance:      Instance;
  validatorKey:  string;
  validatorName: null;
  validatorArgs: any[];
}

interface Instance {
  id:        string;
  names:     string;
  lastNames: string;
  document:  number;
  phone:     number;
  email:     string;
  company:   number;
  process:   number;
  rol:       string;
  username:  string;
  password:  string;
  state:     boolean;
  updatedAt: Date;
  createdAt: Date;
}

interface Fields {
  document: string;
}

interface Original {
  code:       string;
  errno:      number;
  sqlState:   string;
  sqlMessage: string;
  sql:        string;
  parameters: Array<boolean | number | string>;
}
