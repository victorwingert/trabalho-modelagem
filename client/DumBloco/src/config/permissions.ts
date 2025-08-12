export const ROLES = {
  MORADOR: 0,
  FUNCIONARIO: 1,
  PROPRIETARIO: 2,
  SINDICO: 3,
  ADMIN: 4,
};

export const PERMISSIONS: { [key: string]: number[] } = {
  '/tabelaUsuarios': [ROLES.SINDICO, ROLES.ADMIN],
  '/tabelaNoticias': [ROLES.MORADOR, ROLES.FUNCIONARIO, ROLES.PROPRIETARIO, ROLES.SINDICO, ROLES.ADMIN],
  '/tabelaPedidos': [ROLES.FUNCIONARIO, ROLES.PROPRIETARIO, ROLES.SINDICO, ROLES.ADMIN],
  '/tabelaProdutos': [ROLES.PROPRIETARIO, ROLES.SINDICO, ROLES.ADMIN],
  '/tabelaMoradores': [ROLES.PROPRIETARIO, ROLES.SINDICO, ROLES.ADMIN],
  // rotas que faltam ser criadas
  '/tabelaBlocos': [ROLES.SINDICO, ROLES.ADMIN],
  '/registroFuncionarioMorador': [ROLES.SINDICO],
  '/registroSindicoAdmin': [ROLES.ADMIN],
};