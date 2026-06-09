export const PROJECT_STEPS = {
  1: {
    description: "Avaliação do local para garantir a melhor instalação.",
    title: "Vistoria técnica",
  },
  10: {
    description: "Projeto visual de como o sistema será instalado.",
    title: "Layout de instalação",
  },
  11: {
    description: "Esquema elétrico do sistema fotovoltaico.",
    title: "Diagrama Unifilar",
  },
  12: {
    description: "Autorização interna para iniciar os trabalhos.",
    title: "Ordem de Serviço",
  },
  13: {
    description: "Confirmação financeira para seguir com o projeto.",
    title: "Aprovação do Crédito (confirmação de pagamento)",
  },
  14: {
    description: "Pedido de conexão enviado à concessionária.",
    title: "Solicitação de acesso",
  },
  16: {
    description: "Concessionária autorizou a conexão do sistema.",
    title: "Aprovação da Solicitação de Acesso pela Concessionária",
  },
  17: {
    description: "Levantamento dos materiais necessários para a instalação.",
    title: "Requisição de Materiais/Lista de Materiais Adicionais",
  },
  18: {
    description: "Data da instalação definida com a equipe técnica.",
    title: "Agendamento da instalação",
  },
  19: {
    description: "Emissão da nota fiscal do projeto.",
    title: "Faturamento",
  },
  2: {
    description: "Início da formalização do seu projeto.",
    title: "Solicitação de contrato",
  },
  20: {
    description: "Equipamentos a caminho do local de instalação.",
    title: "Entrega dos Materiais",
  },
  22: {
    description: "Pedido de inspeção enviado à concessionária.",
    title: "Solicitação de vistoria pela Concessionária",
  },
  24: {
    description: "Vistoria aprovada e medidor atualizado.",
    title: "Aprovação da Vistoria pela Concessionária (Troca do Medidor)",
  },
  25: {
    description: "Configuração do app para monitorar sua geração de energia.",
    title: "Cadastro do aplicativo",
  },
  26: {
    description: "Orientações para você acompanhar seu sistema pelo app.",
    title: "Instruções aplicativo",
  },
  27: {
    description: "Solicitação do benefício fiscal sobre a energia gerada.",
    title: "Cadastro de isenção ICMS",
  },
  29: {
    description: "Sua opinião sobre o processo até aqui.",
    title: "Pesquisa 1 - Venda, Entrega e Instalação",
  },
  3: {
    description: "Análise das condições contratuais e financeiras.",
    title: "Aprovação de Contrato e pré análise de crédito",
  },
  30: {
    description: "Conte como está sendo sua experiência com o sistema.",
    title: "Pesquisa 2 - Satisfação com o Sistema",
  },
  31: {
    description: "Validação dos termos de comissão do projeto.",
    title: "Concordância de comissão",
  },
  32: {
    description: "Conferência final dos termos de comissão.",
    title: "Validação da concordância de comissão",
  },
  33: {
    description: "Conferência do contrato recebido.",
    title: "Validação do retorno do contrato assinado",
  },
  34: {
    description: "Conferência dos documentos técnicos recebidos.",
    title:
      "Validação do retorno da ART, Req. Acesso, Aut. Fatura e Form. COVID",
  },
  35: {
    description: "Registro fotográfico e finalização da instalação.",
    title: "Conclusão/Fotos da Instalação",
  },
  36: {
    description: "Revisão final dos custos e da qualidade da instalação.",
    title: "Validação da Conclusão/Custos da Instalação",
  },
  38: {
    description: "Conferência dos dados e fotos da vistoria técnica.",
    title: "Validação da Vistoria Técnica - Preenchimento dos dados e Fotos",
  },
  39: {
    description: "Documento de ajuste de capacidade enviado para assinatura.",
    title: "Envio do aditivo (redução de geração)",
  },
  4: {
    description: "Preparação do contrato com todos os detalhes do projeto.",
    title: "Geração de contrato",
  },
  40: {
    description: "Aguardando o retorno do aditivo assinado.",
    title: "Retorno do aditivo",
  },
  41: {
    description: "Conferência final do aditivo recebido.",
    title: "Validação do aditivo",
  },
  42: {
    description: "Abertura do protocolo junto à concessionária.",
    title: "Solicitação de Protocolo",
  },
  5: {
    description: "Documentação técnica obrigatória para a instalação.",
    title: "Emissão da ART e Requerimento de Acesso",
  },
  6: {
    description: "Contrato encaminhado para coleta de assinatura.",
    title: "Envio do contrato para o Representante",
  },
  7: {
    description: "Documentos técnicos enviados para assinatura.",
    title:
      "Envio da ART, Req. Acesso, Aut. Fatura e Form. COVID ao Representante",
  },
  8: {
    description: "Aguardando o recebimento do contrato assinado.",
    title: "Retorno do contrato assinado",
  },
  9: {
    description: "Aguardando o retorno dos documentos técnicos assinados.",
    title: "Retorno da ART, Req. Acesso, Aut. Fatura e Form. COVID assinados",
  },
} as const;

export const MACRO_STEPS = [
  {
    activeDescription:
      "Estamos analisando seu local e finalizando os detalhes jurídicos para garantir sua segurança.",
    completedDescription:
      "Contrato assinado e viabilidade técnica confirmada! Seu projeto já é oficial.",
    id: 1,
    pendingDescription:
      "O primeiro passo! Vamos analisar seu local e preparar a papelada para tirar seu projeto do papel.",
    subSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 33, 34, 38, 39, 40, 41],
    title: "Contrato",
  },
  {
    activeDescription:
      "Nossos engenheiros estão desenhando seu sistema e cuidando da burocracia com a concessionária.",
    completedDescription:
      "Engenharia aprovada! O desenho técnico do seu sistema foi aceito pela concessionária.",
    id: 2,
    pendingDescription:
      "Em breve, nossa engenharia vai assumir para garantir que seu sistema seja o mais eficiente possível.",
    subSteps: [10],
    title: "Projeto & Engenharia",
  },
  {
    activeDescription:
      "Seus equipamentos foram faturados e estão em rota. A tecnologia está chegando!",
    completedDescription:
      "Equipamentos entregues! Tudo o que precisamos já está no local para a instalação.",
    id: 3,
    pendingDescription:
      "Assim que o projeto for aprovado, organizaremos a logística de entrega dos seus materiais.",
    subSteps: [17, 19, 20],
    title: "Entrega dos materiais",
  },
  {
    activeDescription:
      "Mãos à obra! Nossa equipe técnica está autorizada para realizar a montagem do seu sistema.",
    completedDescription:
      "Instalação concluída! Seus painéis e inversores já estão devidamente posicionados.",
    id: 4,
    pendingDescription:
      "O grande dia está chegando! Em breve nossa equipe subirá no telhado para dar vida ao sistema.",
    subSteps: [12, 18, 35],
    title: "Instalação",
  },
  {
    activeDescription:
      "Instalação pronta. Estamos aguardando a vistoria da concessionária e a troca do medidor.",
    completedDescription:
      "Vistoria aprovada e medidor trocado! A concessionária deu o sinal verde para a operação.",
    id: 5,
    pendingDescription:
      "Após a instalação, cuidaremos do agendamento da vistoria final junto à concessionária.",
    subSteps: [14, 16, 22],
    title: "Homologação",
  },
  {
    activeDescription:
      "Sistema ligado! Estamos configurando seu acesso ao aplicativo para você acompanhar sua geração.",
    completedDescription:
      "Parabéns! Você já está gerando sua própria energia limpa e economizando.",
    id: 6,
    pendingDescription:
      "O toque final! Logo você terá o controle total da sua geração na palma da sua mão.",
    subSteps: [25, 26],
    title: "Conexão & Monitoramento",
  },
] as const;
