class CustomColmeiaSheet extends ActorSheet {
  prepareData() {
    super.prepareData();
    const system = this.system;

    // Garante que traumas exista
    if (!system.traumas) {
      system.traumas = { value: 0, max: 1 };
    }

    // Força um valor se estiver indefinido
    system.traumas.value ??= 0;
    system.traumas.max ??= 1;

    // Ajusta o valor máximo com base no tipo

    // Garante que o valor atual não passe do máximo
    if (system.traumas.value > system.traumas.max) {
      system.traumas.value = system.traumas.max;
    }
  }

  get template() {
    return "systems/edvo/templates/colmeia-sheet.hbs"; // Atualize o caminho para refletir a localização correta!
  }

  activateListeners(html) {
    super.activateListeners(html);
    const MOVIMENTOS_ENXAME = {
      infectado: [
        "A vítima toma o controle por 1 momento, dizendo algo sobre seu trauma que ajuda o grupo a enfrentar o enxame.",
        "Palavras do Véu: A vítima recebe uma visão incoerente e aterrorizante. Teste de Umbra. Se falhar, recebe -1 em testes de coragem.",
        "Toque do Enxame: Infecta a vítima com a mente do Enxame, teste de Tempus. Se falhar, recebe 1 Trauma. Ao atingir 5, age como um infectado.",
        "Sussurros Infinitos: Teste de Anima. Se falhar, recebe 1 Trauma e um comando irracional.",
        "Fusão Carnal: Teste de Corpus. Se falhar, recebe 1 Trauma.",
        "Nascimento Prematuro: Todos fazem teste de Umbra. Quem falhar recebe 2 Traumas.",
      ],
      soldado: [
        "Mãos Frágeis: Teste de Corpus. Se falhar, perde 1 Desejo ou recebe 1 Trauma.",
        "Forma Instável: Teste de Umbra. Se falhar, recebe 1 Trauma.",
        "Ecos na Mente: Teste de Anima. Se falhar, recebe 2 Traumas e hesita em agir.",
        "Silêncio Sepulcral: Teste de Tempus. Se falhar, recebe 1 Trauma e não pode se comunicar por um turno.",
        "Toque da Perdição: Teste de Corpus. Se falhar, recebe 2 Traumas.",
        "Olhar Sem Rosto: Teste de Umbra. Se falhar, recebe 3 Traumas e um flashback de algo que nunca viveu.",
      ],
      gestalt: [
        "Mãos Incontáveis: Teste de Corpus. Se falhar, recebe 2 Traumas.",
        "Falas Sobrepostas: Teste de Anima. Se falhar, recebe 1 Trauma.",
        "Mudança de Forma: Teste de Tempus. Se falhar, todos recebem 1 Trauma.",
        "Visões da Consciência: Teste de Umbra. Se falhar, 1 Trauma + info perturbadora.",
        "Engolir a Individualidade: Teste de Corpus. Se falhar, 2 Traumas e perde memórias.",
        "Forma Ascendente: Todos testam Umbra. Quem falhar recebe 3 Traumas.",
      ],
      estrategista: [
        "Sussurros Inescapáveis: Teste de Umbra. Se falhar, 2 Traumas e sugestão perigosa.",
        "Domínio do Campo: Teste de Tempus. Se falhar, perde a próxima ação.",
        "Palavras que Reescrevem: Todos testam Anima. Se falhar, 1 Trauma e acredita em mentira.",
        "Reorganização do Enxame: Todos inimigos agem imediatamente.",
        "Quebra da Realidade: Teste de Umbra. Se falhar, 3 Traumas.",
        "Convite Irrecusável: Se aceitar, -2 Traumas, mas sob influência do Enxame.",
      ],
      ciclope: [
        "Olhar da Verdade: Teste de Umbra. Se falhar, 2 Traumas.",
        "Vontade Irresistível: Teste de Anima. Se falhar, obedece cegamente.",
        "Rompimento da Realidade: Teste de Tempus. Se falhar, 2 Traumas.",
        "Choro do Ciclope: Todos testam Corpus. Quem falhar, 2 Traumas e tontura.",
        "Dilaceração Espiritual: Teste de Umbra. Se falhar, 3 Traumas.",
        "Olhar Final: Teste de Tempus com +1 dificuldade. Se falhar, morte instantânea.",
      ],
    };

    const tiposEnxame = {
      infectado: 3,
      soldado: 5,
      gestalt: 5,
      estrategista: 3,
      ciclope: 7,
    };

    function formatarNegrito(movimento) {
      if (!movimento.includes(":")) return movimento;
      return movimento.replace(/^(.+?):/, "<strong>$1:</strong>");
    }

    async function rolarMovimentoEnxame(tipo = "infectado", actor = null) {
      const movimentos = MOVIMENTOS_ENXAME[tipo];

      if (!movimentos) {
        ui.notifications.error(
          `Tipo de movimento da Colmeia inválido: "${tipo}"`
        );
        return;
      }

      const roll = new Roll("1d6");
      await roll.roll();

      const resultado = roll.total;
      const movimentoTexto = movimentos[resultado - 1];

      const titulo = `Movimento da Colmeia (${tipo})`;
      const conteudo = `
        <div class="dice-roll">
          <div class="dice-result">
            <div class="dice-formula">1d6</div>
            <div class="dice-total">${resultado}</div>
            <hr/>
            <div class="dice-description">${movimentoTexto}</div>
          </div>
        </div>
      `;

      const data = {
        actor: "Emxame",
        titulo: "Movimento",

        descricao: formatarNegrito(movimentoTexto),
        rolagem: {
          total: resultado,
        },
      };

      // Enviar mensagem ao chat
      sendMessageToChat(data);
    }

    html.find(".select-image").on("click", async () => {
      const currentImg = this.actor.img; // Imagem atual
      const newImg = await new FilePicker({
        type: "image",
        current: currentImg,
        callback: (path) => {
          this.actor.update({ img: path }); // Atualiza a imagem no sistema
          console.log("EdVO | Imagem atualizada para:", path);
        },
      }).render(true);
    });

    html.find(".botao-movimento-enxame").click(async (event) => {
      event.preventDefault();
      const tipo = this.actor.system.tipo;
      await rolarMovimentoEnxame(tipo, this.actor);
    });

    html.find(".trauma-reduce").click(async () => {
      const current = this.actor.system.traumas.value || 0;
      if (current > 0) {
        await this.actor.update({ "system.traumas.value": current - 1 });
        ui.notifications.info("Trauma reduzido em 1.");
      } else {
        ui.notifications.warn("Esta criatura não possui traumas para reduzir.");
      }
    });

    const select = html.find(".tipo-enxame");
    const movimentoDiv = html.find(".movimentosEnxame");

    const atualizarMovimentos = (tipo) => {
      const moves = MOVIMENTOS_ENXAME[tipo] || [];
      const htmlMoves = moves.map((m) => `<p>• ${m}</p>`).join("");
      movimentoDiv.html(htmlMoves);
    };

    // Inicializa
    atualizarMovimentos(this.actor.system.tipo);
    console.log(this.actor);

    // Atualiza quando muda o select
    select.on("change", (e) => {
      const tipo = e.target.value;
      this.actor.update({ "system.tipo": tipo });
      atualizarMovimentos(tipo);

      const tipoSelecionado = e.target.value;
      const novoMax = tiposEnxame[tipoSelecionado] ?? 3;

      // Atualiza os traumas baseado no tipo escolhido
      this.actor.update({
        "system.traumas.max": novoMax,
        "system.traumas.value": novoMax,
        "prototypeToken.bar1.attribute": "traumas",
        "prototypeToken.displayBars": 50,
      });
    });
    //   event.preventDefault(); // Previne o comportamento padrão do botão
    //   const form = $(event.currentTarget).closest("form")[0]; // Encontra o formulário mais próximo

    //   if (!form) {
    //     console.error("EdVO | Formulário não encontrado!");
    //     return;
    //   }

    //   const formData = new FormData(form); // Agora o 'form' é garantidamente um <form> válido
    //   console.log(
    //     "EdVO | Formulário enviado com dados:",
    //     Object.fromEntries(formData.entries())
    //   );
    //   const actorData = {
    //     name: formData.get("name"),
    //     system: {
    //       traumas: formData.get("traumas"),
    //       tipo: formData.get("tipo"),
    //     },
    //   };

    //   // Atualize os dados do ator
    //   try {
    //     await this.actor.update(actorData); // Atualiza o ator
    //     console.log("EdVO | Dados salvos com sucesso!", actorData);
    //   } catch (error) {
    //     console.error("EdVO | Erro ao salvar os dados:", error);
    //   }
    // });

    async function sendMessageToChat(data) {
      const templatePath = "systems/edvo/templates/chat/enxame.hbs"; // Caminho do template
      const html = await renderTemplate(templatePath, data); // Renderiza o template com os dados

      ChatMessage.create({
        content: html,
        speaker: ChatMessage.getSpeaker({ actor: data.actor }), // Determina quem "falou" no chat
      });
    }
  }
}
