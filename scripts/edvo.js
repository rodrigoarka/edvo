// Importa a classe da ficha personalizada

console.log("EdVO | Arquivo carregado: edvo.js");

// Objeto do sistema EdVO
const EdVO = {
  name: "Ecos das Verdades Ocultas",
  version: "0.1",
  description:
    "Uma experiência de RPG que explora as profundezas da Magia, do horror e dos medos pessoais.",
  attributes: ["Corpus", "Mens", "Anima", "Tempus", "Umbra"],

  // Agora a parte de mecânicas do jogo é chamada de "gameMechanics"
  gameMechanics: {
    attributes: {
      Desejo: { max: 5, description: "Impulsos que movem o personagem." },
      Traumas: {
        max: 5,
        description:
          "Condições psicológicas que fazem o personagem perder dados.",
      },
      "Limitações Mágicas": {
        max: 5,
        description: "Restrições que fortalecem o Eco (magia do personagem).",
      },
      "Conexões Importantes": {
        max: 5,
        description: "Pessoas importantes na vida do personagem.",
      },
      Cartas: {
        max: 5,
        description: "Cartas de Tarot usadas para fazer os Ecos.",
      },
    },

    // Função de rolagem utilizando os dados do ator no Foundry
    roll: (actor, attribute) => {
      let d1 = Math.floor(Math.random() * 6) + 1;
      let d2 = Math.floor(Math.random() * 6) + 1;
      let total = d1 + d2 + actor.system.atributos[attribute.toLowerCase()];
      return {
        d1,
        d2,
        total,
        result:
          total >= 10
            ? "Sucesso Completo"
            : total >= 7
            ? "Sucesso Parcial"
            : "Falha",
      };
    },
  },

  // Outras configurações, como hooks e inicializações
  hooks: {
    once: () => {
      console.log("EdVO | Sistema carregado!");
    },
  },
};

// Registra a ficha personalizada e inicializa o sistema
Hooks.once("init", () => {
  console.log("EdVO | Inicializando sistema...");
  Actors.registerSheet("edvo", CustomActorSheet, {
    types: ["character"],
    makeDefault: true,
  });
  // Teste básico para evitar erros
  console.log("EdVO | Registro concluído!");
});
