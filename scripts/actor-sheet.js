class CustomActorSheet extends ActorSheet {
  prepareData() {
    super.prepareData();

    const system = this.system;
    if (this.prototypeToken) {
      this.actor.prototypeToken.bar1 = { attribute: "system.traumasCount" };
      this.actor.prototypeToken.displayBars = CONST.TOKEN_DISPLAY_MODES.ALWAYS;
    }
    // Exemplo: calcular iniciativa baseada em atributo (caso deseje)
    // system.initiative = system.mens || 0;

    // Ou garantir que pelo menos tenha alguma estrutura
    if (!system.initiative) {
      system.initiative = { formula: "1d6" };
    }
  }

  get template() {
    return "systems/edvo/templates/actor-sheet.hbs"; // Atualize o caminho para refletir a localização correta!
  }

  activateListeners(html) {
    super.activateListeners(html);
    console.log("EdVO | Eventos ativados na ficha personalizada!");

    // Configuração para adicionar novos traumas
    const maxTraumas = 5; // Limite máximo de traumas
    const maxDesejos = 5; // Limite máximo de desejos
    const traumaContainer = html.find(".trauma-container");
    const desejoContainer = html.find(".desejo-container");
    const addTraumaButton = html.find(".add-trauma");
    const addDesejoButton = html.find(".add-desejo");
    const warningMessageT = html.find(".trauma-warning");
    const warningMessageD = html.find(".desejo-warning");

    const arcanos = {
      louco: {
        nome: "O Louco (0) – O Viajante do Abismo",
        conceito:
          "Aquele que caminha rumo ao desconhecido, movido pela liberdade e pela loucura divina.",
        movimento1:
          "Passo no Abismo: Quando avança sem planejamento, pode rolar um benefício inesperado, mas algo imprevisível também acontece.",
        movimento2:
          "Sorte do Louco: Uma vez por sessão, pode reverter um fracasso total em um sucesso parcial.",
      },
      mago: {
        nome: "O Mago (I) – O Conjurador Criativo",
        conceito:
          "Alguém que transforma intenção em realidade por meio do talento, vontade e imaginação.",
        movimento1:
          "Toque Criador: Ao usar sua criatividade para improvisar uma solução mágica, ganha vantagem.",
        movimento2:
          "Conjuração Instintiva: Pode manifestar efeitos mágicos sutis quando tiver outra carta ativa como foco.",
      },
      sacerdotisa: {
        nome: "A Sacerdotisa (II) – A Guardiã dos Mistérios",
        conceito:
          "Aquela que compreende os segredos do mundo oculto e os guarda entre véus de silêncio.",
        movimento1:
          "Ler os Véus: Quando tenta desvendar algo oculto, ganha vantagem.",
        movimento2:
          "Segredo Revelado: Uma vez por sessão, pode fazer uma pergunta ao mestre sobre o mundo oculto e receber uma verdade incompleta.",
      },
      imperatriz: {
        nome: "A Imperatriz (III) – A Mãe da Criação",
        conceito:
          "Fonte de vida, proteção e abundância. Sua presença é restauradora.",
        movimento1:
          "Toque Vital: Pode curar 1 ponto de trauma de alguém uma vez por cena.",
        movimento2:
          "Bênção Crescente: Quando oferece cuidado sincero, o alvo recebe vantagem em sua próxima ação emocional.",
      },
      imperador: {
        nome: "O Imperador (IV) – O Trono Inabalável",
        conceito:
          "A figura de ordem, estabilidade e domínio. Comanda pela estrutura e pela presença.",
        movimento1:
          "Autoridade Incontestável: Quando lidera com firmeza, ganha vantagem.",
        movimento2:
          "Comando de Ferro: Pode obrigar um NPC a obedecer um comando lógico através de pura presença.",
      },
      hierofante: {
        nome: "O Hierofante (V) – A Ponte entre Mundos",
        conceito:
          "Aquele que traduz os ensinamentos do alto e guia os outros na fé ou no conhecimento antigo.",
        movimento1:
          "Ritual de Conexão: Ao realizar um rito, pode acessar conhecimento ou intervenção espiritual.",
        movimento2:
          "Palavra Ungida: Pode inspirar ou pacificar uma multidão ou grupo com um discurso poderoso.",
      },
      amantes: {
        nome: "Os Amantes (VI) – Os Corações Entrelaçados",
        conceito:
          "Símbolo de conexão profunda e das escolhas que definem nosso destino.",
        movimento1:
          "Vínculo Inquebrável: Pode criar um elo emocional forte com outro personagem, dando vantagem quando agem juntos.",
        movimento2:
          "Escolha Dolorosa: Diante de uma decisão difícil, pode sacrificar algo pessoal para garantir sucesso a outro.",
      },
      carro: {
        nome: "O Carro (VII) – O Conquistador Determinado",
        conceito:
          "Aquele que avança com força e direção, superando obstáculos pelo impulso da vontade.",
        movimento1:
          "Avanço Imparável: Quando persegue um objetivo com obstinação, ganha vantagem.",
        movimento2:
          "Impulso Final: Pode transformar um empate ou falha parcial em sucesso total ao se arriscar fisicamente.",
      },
      justica: {
        nome: "A Justiça (VIII) – O Julgamento Imparcial",
        conceito:
          "A balança que pesa verdades e consequências. Equilíbrio entre ação e ética.",
        movimento1:
          "Olhar Penetrante: Pode perceber uma mentira ou meia-verdade com um olhar direto.",
        movimento2:
          "Restauração do Equilíbrio: Pode selar um conflito ou estabilizar uma situação tensa com palavras ou intervenção direta.",
      },
      eremita: {
        nome: "O Eremita (IX) – O Guardião da Luz Interior",
        conceito:
          "Busca a verdade longe do mundo, guiado pela própria lanterna.",
        movimento1:
          "Iluminar as Sombras: Pode fazer uma pergunta introspectiva e receber uma visão ou dica do mestre.",
        movimento2:
          "Retiro Estrategista: Ao agir sozinho, pode obter vantagem em ações de investigação, magia ou furtividade.",
      },
      roda: {
        nome: "A Roda da Fortuna (X) – A Teia do Destino",
        conceito:
          "A imprevisibilidade da sorte, os ciclos que giram além do controle humano.",
        movimento1:
          "Fluxo Inesperado: Uma vez por cena, pode trocar o resultado de uma rolagem entre dois jogadores (incluindo você).",
        movimento2:
          "Eco do Destino: Quando algo dá errado de forma dramática, ganha um Presságio útil para usar mais tarde.",
      },
      forca: {
        nome: "A Força (XI) – A Fera Domada",
        conceito:
          "Poder bruto canalizado pela compaixão, coragem ou controle interior.",
        movimento1:
          "Domínio Feroz: Pode enfrentar uma ameaça física superior com vantagem ao manter a calma.",
        movimento2:
          "Lado Selvagem: Quando se entrega ao instinto ou emoção, pode causar um efeito inesperado mas poderoso.",
      },
      enforcado: {
        nome: "O Enforcado (XII) – O Visionário Sacrificado",
        conceito:
          "Aquele que enxerga o mundo de um ponto de vista único, mas paga o preço por isso.",
        movimento1:
          "Revelação Dolorosa: Quando sofre um Trauma, pode receber uma visão importante sobre o futuro.",
        movimento2:
          "Resignação Iluminada: Quando aceita uma perda ou sacrifício, pode rolar um benefício inesperado.",
      },
      morte: {
        nome: "A Morte (XIII) – A Ceifadora da Transformação",
        conceito:
          "Fim e recomeço. Ela leva o que precisa morrer para que o novo possa nascer.",
        movimento1:
          "Transição Inevitável: Pode encerrar uma cena ou situação ao invocar uma mudança drástica.",
        movimento2:
          "Falar com os Mortos: Uma vez por sessão, pode se comunicar com uma entidade falecida.",
      },
      temperanca: {
        nome: "A Temperança (XIV) – A Alquimista do Equilíbrio",
        conceito:
          "Mestra da harmonia entre forças opostas. Transforma conflito em clareza.",
        movimento1:
          "Mistura Precisa: Pode combinar dois efeitos mágicos ou narrativos em algo novo e útil.",
        movimento2:
          "Fluxo Controlado: Quando age com paciência e cálculo, ganha vantagem.",
      },
      diabo: {
        nome: "O Diabo (XV) – O Tentador das Correntes",
        conceito:
          "Aquele que revela os desejos ocultos e os laços que prendem. Poder e vício andam juntos.",
        movimento1:
          "Oferta Irresistível: Pode dar a um NPC (ou jogador com consentimento) algo que deseja em troca de controle momentâneo.",
        movimento2:
          "Correntes Internas: Quando enfrenta seus próprios vícios ou tentações, ganha um bônus se assumir o risco.",
      },
      torre: {
        nome: "A Torre (XVI) – A Ruína Libertadora",
        conceito:
          "Quando tudo desaba, algo novo pode emergir. A destruição é um prenúncio de libertação.",
        movimento1:
          "Queda Inesperada: Pode provocar uma catástrofe controlada para mudar a maré da cena.",
        movimento2:
          "Renascer entre os Escombros: Após um fracasso crítico, pode levantar-se com nova clareza ou recurso.",
      },
      estrela: {
        nome: "A Estrela (XVII) – A Luz na Escuridão",
        conceito:
          "Esperança e cura em meio ao desespero. Um farol para si e para os outros.",
        movimento1:
          "Brilho Reconfortante: Pode curar 1 Trauma de outro personagem ao oferecer consolo sincero.",
        movimento2:
          "Guia Celeste: Uma vez por cena, pode receber uma inspiração ou intuição do além.",
      },
      lua: {
        nome: "A Lua (XVIII) – A Sombra Sonhadora",
        conceito:
          "Revela ilusões e verdades escondidas sob a superfície. O poder dos sonhos e do inconsciente.",
        movimento1:
          "Névoa da Mente: Pode confundir ou iludir alguém com palavras ambíguas ou magia sutil.",
        movimento2:
          "Reflexo Oculto: Uma vez por sessão, pode inverter o efeito de uma magia ou ação direcionada a você.",
      },
      sol: {
        nome: "O Sol (XIX) – A Clareza Radiante",
        conceito:
          "Ilumina, revela e aquece. Traz verdade, alegria e renascimento.",
        movimento1:
          "Brilho Deslumbrante: Pode expor algo oculto ou banir uma escuridão metafórica ou real.",
        movimento2:
          "Força Revigorante: Pode restaurar a esperança de um aliado, removendo 1 Trauma emocional.",
      },
      julgamento: {
        nome: "O Julgamento (XX) – O Chamado Final",
        conceito:
          "Convoca os mortos e os vivos a encarar seus feitos. A redenção ou a condenação.",
        movimento1:
          "Eco do Passado: Pode invocar um evento anterior para influenciar a cena presente.",
        movimento2:
          "Chamado do Despertar: Uma vez por sessão, pode fazer alguém perceber sua verdadeira natureza.",
      },
      mundo: {
        nome: "O Mundo (XXI) – O Círculo Completo",
        conceito:
          "Conclusão, plenitude e conexão com o todo. O fim que é também começo.",
        movimento1:
          "Síntese Perfeita: Pode unir duas forças opostas em uma solução completa.",
        movimento2:
          "Passo Final: Ao encerrar um ciclo importante, pode receber um presságio, recompensa ou evolução.",
      },
    };

    if (this.actor.isOwner) {
      html.addClass("actor-owner");
    }

    function formatarNegrito(movimento) {
      return movimento.replace(/^(.+?):/, "<strong>$1:</strong>");
    }

    const beneficios = {
      1: "Eco do Arcano: O personagem pode usar uma carta do Tarot que ainda não possui por uma cena. A carta funciona normalmente.",
      2: "Sonho Profético: O personagem recebe uma visão poderosa durante o sono ou em transe. Ele ganha uma nova característica de Desejo. Esse desejo pode ser usado para curar um Trauma ou conceder +1 em uma ação relacionada, enquanto estiver ativo.",
      3: "Artefato Perdido: Os personagens encontram um objeto místico. Ele pode ser usado como foco mágico e concede o mesmo bônus que uma limitação mágica — mas sem a restrição.",
      4: "Favor dos Ecos: O jogador pode transformar uma falha em um sucesso com consequência. Esse benefício pode ser usado até o fim da sessão.",
      5: "Uma Conexão Retorna: Uma das Conexões Importantes do personagem aparece para ajudar. Pode ser diretamente, através de influência, ou por algo que deixou para trás. O vínculo se manifesta de forma inesperada.",
      6: "Ambiente Alterado: Uma força oculta muda o ambiente ao redor a favor dos personagens — abrindo uma rota, revelando um segredo, enfraquecendo uma barreira ou criando uma oportunidade inesperada.",
    };

    html.find(".beneficio-btn").click(async () => {
      const roll = await new Roll("1d6").roll({ async: true });

      const data = {
        actor: this.actor,
        titulo: "Benefício Inesperado",
        descricao: formatarNegrito(beneficios[roll.total]),
        dado1: roll.total,
      };

      // Enviar mensagem ao chat
      sendMessageToChat(data);
    });

    const loadMovimentos = () => {
      const arcanoSelecionado = this.actor.system?.arcano || ""; // Obtém as cartas salvas

      const info = arcanos[arcanoSelecionado];

      const container = html.find(".text-group");
      if (info) {
        container.html(`
          <h3>${info.nome}</h3>
          <p> ${info.conceito}</p>
          <p> ${formatarNegrito(info.movimento1)}</p>
          <p> ${formatarNegrito(info.movimento2)}</p>
        `);
      } else {
        container.html(
          "<p>Selecione um Arcano para ver seu movimento exclusivo.</p>"
        );
      }
    };
    loadMovimentos();

    html.find("select[name='arcano']").on("change", function () {
      const arcanoSelecionado = $(this).val();
      const info = arcanos[arcanoSelecionado];

      const container = html.find(".text-group");
      if (info) {
        container.html(`
          <h3>${info.nome}</h3>
          <p> ${info.conceito}</p>
          <p> ${formatarNegrito(info.movimento1)}</p>
          <p> ${formatarNegrito(info.movimento2)}</p>
        `);
      } else {
        container.html(
          "<p>Selecione um Arcano para ver seu movimento exclusivo.</p>"
        );
      }
    });

    const loadSelectedCards = () => {
      const selectedCards = this.actor.system?.mecanicas?.cartas || []; // Obtém as cartas salvas
      console.log("EdVO | Cartas salvas carregadas:", selectedCards);

      // Itera pelos checkboxes e marca aqueles que correspondem às cartas salvas
      html.find(".tarot-container input[type='checkbox']").each(function () {
        const cardValue = this.value; // Valor da carta no checkbox
        if (selectedCards.includes(cardValue)) {
          this.checked = true; // Marca o checkbox
        }
      });
    };
    loadSelectedCards();

    const loadTraumas = () => {
      traumaContainer.empty(); // Limpa o container antes de carregar
      const traumas = this.actor.system.traumas || []; // Obtém os traumas salvos

      traumas.forEach((trauma, index) => {
        // Cria o container para o campo de trauma e botão de exclusão
        const traumaDiv = document.createElement("div");
        traumaDiv.className = "trauma-item";

        const input = document.createElement("input");
        input.type = "text";
        input.name = `trauma-${index + 1}`;
        input.value = trauma; // Preenche com o valor salvo
        input.placeholder = "Escreva um trauma...";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-trauma";
        deleteButton.textContent = "x"; // O texto no botão
        deleteButton.title = "Excluir este trauma";
        deleteButton.dataset.index = index; // Salva o índice do trauma

        traumaDiv.appendChild(input);
        traumaDiv.appendChild(deleteButton);
        traumaContainer.append(traumaDiv); // Adiciona o container ao HTML
      });

      console.log("EdVO | Traumas carregados no HTML:", traumas);
    };

    // Chame a função para carregar os traumas ao abrir a ficha
    loadTraumas();

    const loadDesejos = () => {
      desejoContainer.empty(); // Limpa o container antes de carregar
      const desejos = this.actor.system.desejos || []; // Obtém os desejos salvos

      desejos.forEach((desejo, index) => {
        // Cria o container para o campo de desejo e botão de exclusão
        const desejoDiv = document.createElement("div");
        desejoDiv.className = "desejo-item";

        const input = document.createElement("input");
        input.type = "text";
        input.name = `desejo-${index + 1}`;
        input.value = desejo; // Preenche com o valor salvo
        input.placeholder = "Escreva um desejo...";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-desejo";
        deleteButton.textContent = "x"; // O texto no botão
        deleteButton.title = "Excluir este desejo";
        deleteButton.dataset.index = index; // Salva o índice do desejo

        desejoDiv.appendChild(input);
        desejoDiv.appendChild(deleteButton);
        desejoContainer.append(desejoDiv); // Adiciona o container ao HTML
      });

      console.log("EdVO | desejos carregados no HTML:", desejos);
    };

    // Chame a função para carregar os desejos ao abrir a ficha
    loadDesejos();

    // Evento para adicionar traumas dinamicamente
    addTraumaButton.on("click", () => {
      const currentTraumas = traumaContainer.children(".trauma-item").length;

      if (currentTraumas < maxTraumas) {
        const traumaDiv = document.createElement("div");
        traumaDiv.className = "trauma-item";

        const newTrauma = document.createElement("input");
        newTrauma.type = "text";
        newTrauma.name = `trauma-${currentTraumas + 1}`;
        newTrauma.placeholder = "Escreva um trauma...";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-trauma";
        deleteButton.textContent = "x";
        deleteButton.title = "Excluir este trauma";
        deleteButton.dataset.index = currentTraumas;

        traumaDiv.appendChild(newTrauma);
        traumaDiv.appendChild(deleteButton);
        traumaContainer.append(traumaDiv);

        console.log(`EdVO | Trauma ${currentTraumas + 1} adicionado.`);
      } else {
        warningMessageT.show(); // Mostra mensagem de aviso
        setTimeout(() => warningMessageT.hide(), 3000); // Oculta após 3 segundos
        console.log("EdVO | Limite de traumas atingido.");
      }
    });

    addDesejoButton.on("click", () => {
      const currentDesejos = desejoContainer.children(".desejo-item").length;

      if (currentDesejos < maxDesejos) {
        const desejoDiv = document.createElement("div");
        desejoDiv.className = "desejo-item";

        const newDesejo = document.createElement("input");
        newDesejo.type = "text";
        newDesejo.name = `desejo-${currentDesejos + 1}`;
        newDesejo.placeholder = "Escreva um desejo...";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-desejo";
        deleteButton.textContent = "x";
        deleteButton.title = "Excluir este desejo";
        deleteButton.dataset.index = currentDesejos;

        desejoDiv.appendChild(newDesejo);
        desejoDiv.appendChild(deleteButton);
        desejoContainer.append(desejoDiv);

        console.log(`EdVO | Desejo ${currentDesejos + 1} adicionado.`);
      } else {
        warningMessageD.show(); // Mostra mensagem de aviso
        setTimeout(() => warningMessageD.hide(), 3000); // Oculta após 3 segundos
        console.log("EdVO | Limite de desejos atingido.");
      }
    });

    html.on("click", ".delete-trauma", async (event) => {
      const button = event.currentTarget;
      const traumaIndex = parseInt(button.dataset.index, 10); // Converte o índice para inteiro

      const traumas = this.actor.system.traumas || [];
      traumas.splice(traumaIndex, 1); // Remove o trauma pelo índice

      console.log(`EdVO | Trauma removido no índice ${traumaIndex}:`, traumas);

      // Atualiza os dados do ator
      const actorData = {
        system: {
          traumas: traumas, // Atualiza a lista de traumas no sistema
        },
      };

      try {
        await this.actor.update(actorData); // Atualiza os dados no sistema do Foundry
        console.log("EdVO | Dados atualizados após exclusão:", traumas);
      } catch (error) {
        console.error("EdVO | Erro ao excluir o trauma:", error);
      }

      // Recarrega o HTML para refletir a exclusão
      loadTraumas();
    });

    html.on("click", ".delete-desejo", async (event) => {
      const button = event.currentTarget;
      const desejoIndex = parseInt(button.dataset.index, 10); // Converte o índice para inteiro

      const desejos = this.actor.system.desejos || [];
      desejos.splice(desejoIndex, 1); // Remove o desejo pelo índice

      console.log(`EdVO | Trauma removido no índice ${desejoIndex}:`, desejos);

      // Atualiza os dados do ator
      const actorData = {
        system: {
          desejos: desejos, // Atualiza a lista de desejos no sistema
        },
      };

      try {
        await this.actor.update(actorData); // Atualiza os dados no sistema do Foundry
        console.log("EdVO | Dados atualizados após exclusão:", desejos);
      } catch (error) {
        console.error("EdVO | Erro ao excluir o desejo:", error);
      }

      // Recarrega o HTML para refletir a exclusão
      loadDesejos();
    });

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

    html.find(".tab-link").on("click", function () {
      const tabId = $(this).data("tab");

      html.find(".tab-link").removeClass("active");
      $(this).addClass("active");

      html.find(".tabs-content .tab").removeClass("active");
      html.find(`#${tabId}`).addClass("active");
    });

    html.find(".accordion-toggle").on("click", function () {
      const toggleButton = $(this); // Botão que foi clicado
      const accordionContent = toggleButton.parent().next(".accordion-content"); // Seleciona a próxima .accordion-content relacionada
      const icon = toggleButton.find("span"); // Seleciona o ícone da seta

      // Alterna visibilidade do conteúdo e atualiza o ícone
      accordionContent.slideToggle(200); // Animação de abrir/recolher
      icon.text(icon.text() === "⯆" ? "⯅" : "⯆"); // Alterna entre ⯆ e ⯅
    });

    // Evento para submissão do formulário
    html.find("form.sheet").on("submit", async (event) => {
      event.preventDefault();
      console.log("EdVO | Formulário enviado!");

      const formData = new FormData(event.currentTarget);
      const desejos = []; // Declaração correta da variável desejos
      html.find(".desejo-container input").each(function () {
        const desejo = this.value.trim(); // Garante que não haja espaços extras
        if (desejo) desejos.push(desejo); // Apenas adiciona traumas preenchidos
      });

      const traumas = []; // Declaração correta da variável traumas
      html.find(".trauma-container input").each(function () {
        const trauma = this.value.trim(); // Garante que não haja espaços extras
        if (trauma) traumas.push(trauma); // Apenas adiciona traumas preenchidos
      });

      const desejoCount = desejos.length; // Conta os desejos preenchidos
      console.log(`EdVO | Desejos: ${desejos}`);
      const traumaCount = traumas.length; // Conta os traumas preenchidos
      const penalty = Math.min(traumaCount, maxTraumas); // Penalidade máxima de 5
      console.log(`EdVO | Traumas: ${traumas}`);
      console.log(`EdVO | Penalidade: -${penalty}`);

      const actorData = {
        name: formData.get("name"),
        system: {
          arcano: formData.get("arcano"),
          arquetipo: formData.get("arquetipo"),
          cicatriz: formData.get("cicatriz"),
          idade: formData.get("idade"),
          genero: formData.get("genero"),
          aparencia: formData.get("aparencia"),
          atributos: {
            corpus: parseInt(formData.get("corpus")) || 0,
            mens: parseInt(formData.get("mens")) || 0,
            anima: parseInt(formData.get("anima")) || 0,
            tempus: parseInt(formData.get("tempus")) || 0,
            umbra: parseInt(formData.get("umbra")) || 0,
          },
          desejos: desejos,
          traumas: traumas,
          traumasCount: traumas.length,
          penalty: penalty, // Armazena a penalidade para uso posterior
          mecanicas: {
            desejo: formData.get("desejos").split("\n"),
            cicatrizes: formData.get("cicatrizes").split("\n"),
            limitacoes: formData.get("limitacoes").split("\n"),
            conexõesImportantes: formData.get("conexoes").split("\n"),
            cartas: formData.get("cartas").split("\n"),
          },
        },
      };

      try {
        await this.actor.update(actorData); // Atualiza os dados do ator
        console.log("EdVO | Dados salvos com sucesso!", actorData);
      } catch (error) {
        console.error("EdVO | Erro ao salvar os dados:", error);
      }
    });

    // Evento para rolagem de ECO
    html.find(".roll-eco").on("click", async () => {
      console.log("EdVO | Rolar ECO");

      const traumas = this.actor.system.traumas || []; // Obtém os traumas salvos
      const penalty = Math.min(traumas.length, 5); // Penalidade é limitada a 5

      // Rolar os dados individualmente
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const total = d1 + d2 - penalty; // Soma dos dados

      console.log(
        `EdVO | Resultado ECO: d1=${d1}, d2=${d2}, penalidade=${penalty}, total=${total}`
      );

      const data = {
        actor: this.actor,
        titulo: "ecos",
        dado1: d1,
        icon: true,
        dado2: d2,
        descricao: `${d1} + ${d2} - ${penalty} (traumas)`,
        rolagem: {
          total: total,
        },
      };

      // Enviar mensagem ao chat
      sendMessageToChat(data);
    });

    // Evento para rolar dados para atributos
    html.find(".roll-dice").on("click", async (event) => {
      const attribute = event.currentTarget.dataset.attribute; // Identifica o atributo pelo botão clicado
      const value = this.actor.system.atributos[attribute]; // Valor do atributo
      const button = $(event.currentTarget);
      const attributeName = button.data("attribute");

      console.log(`EdVO | Rolar dados para ${attribute} com bônus de ${value}`);
      const traumas = this.actor.system.traumas || []; // Obtém os traumas salvos
      const penalty = Math.min(traumas.length, 5); // Penalidade é limitada a 5

      // Rolar os dados individualmente
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const total = d1 + d2 + value - penalty; // Aplica a penalidade ao total da rolagem

      console.log(
        `EdVO | Resultado: d1=${d1}, d2=${d2}, traumas=${penalty} total=${total}`
      );

      const data = {
        actor: this.actor,
        titulo: attributeName,
        dado1: d1,
        dado2: d2,
        icon: true,
        descricao: `${d1} + ${d2} + ${value} (atributo) - ${penalty} (traumas)`,
        rolagem: {
          total: total,
        },
      };

      // Enviar mensagem ao chat
      sendMessageToChat(data);
    });

    Handlebars.registerHelper("resultadoRolagem", function (total) {
      if (total >= 10) {
        return new Handlebars.SafeString(
          "<strong style='color: #41d541;'>Sucesso Completo</strong>"
        );
      } else if (total >= 7) {
        return new Handlebars.SafeString(
          "<strong style='color: #ffb323;'>Sucesso Parcial</strong>"
        );
      } else {
        return new Handlebars.SafeString(
          "<strong style='color: #ff4343;'>Falha</strong>"
        );
      }
    });

    // Ativando o editor de texto rico para um campo específico
    const enrichedField = html.find("textarea[name='bio']");
    if (enrichedField.length) {
      TextEditor.enrichHTML(enrichedField.val(), { secrets: false });
    }

    html.find("button.save").on("click", async (event) => {
      console.log("salvando");
      event.preventDefault(); // Previne o comportamento padrão do botão
      const form = $(event.currentTarget).closest("form")[0]; // Encontra o formulário mais próximo

      if (!form) {
        console.error("EdVO | Formulário não encontrado!");
        return;
      }

      const formData = new FormData(form); // Agora o 'form' é garantidamente um <form> válido
      console.log(
        "EdVO | Formulário enviado com dados:",
        Object.fromEntries(formData.entries())
      );

      console.log("EdVO | Formulário enviado!");

      const traumas = []; // Array para armazenar os traumas
      traumaContainer.children(".trauma-item").each(function () {
        const input = $(this).find("input"); // Captura o input dentro do trauma-item
        const trauma = input.val().trim(); // Obtém o valor do campo, removendo espaços extras
        if (trauma) traumas.push(trauma); // Adiciona ao array apenas se não estiver vazio
      });
      const desejos = []; // Array para armazenar os desejos
      desejoContainer.children(".desejo-item").each(function () {
        const input = $(this).find("input"); // Captura o input dentro do desejo-item
        const desejo = input.val().trim(); // Obtém o valor do campo, removendo espaços extras
        if (desejo) desejos.push(desejo); // Adiciona ao array apenas se não estiver vazio
      });

      console.log("EdVO | Traumas capturados:", traumas);

      console.log("EdVO | Traumas coletados para salvar:", traumas);

      console.log("EdVO | desejo capturados:", desejos);

      console.log("EdVO | desejo coletados para salvar:", desejos);

      const traumaCount = traumas.length;
      const penalty = Math.min(traumaCount, maxTraumas);

      const selectedCards = [];
      html
        .find(".tarot-container input[type='checkbox']:checked")
        .each(function () {
          selectedCards.push(this.value); // Adiciona o valor da carta selecionada
        });

      // Validação de quantidade
      // if (selectedCards.length < 3 || selectedCards.length > 22) {
      //   html.find(".tarot-warning").show();
      //   setTimeout(() => html.find(".tarot-warning").hide(), 3000);
      //   console.warn("EdVO | Número inválido de cartas selecionadas!");
      //   return;
      // }
      console.log("arcano", formData.get("arcano"));
      const actorData = {
        name: formData.get("name"),
        system: {
          arcano: formData.get("arcano"),
          arquetipo: formData.get("arquetipo"),
          cicatriz: formData.get("cicatriz"),
          idade: formData.get("idade"),
          genero: formData.get("genero"),
          aparencia: formData.get("aparencia"),
          atributos: {
            corpus: parseInt(formData.get("corpus")) || 0,
            mens: parseInt(formData.get("mens")) || 0,
            anima: parseInt(formData.get("anima")) || 0,
            tempus: parseInt(formData.get("tempus")) || 0,
            umbra: parseInt(formData.get("umbra")) || 0,
          },
          traumas: traumas,
          bio: formData.get("bio"),
          desejos: desejos,
          penalty: penalty, // Armazena a penalidade para uso posterior
          traumasCount: traumas.length,
          mecanicas: {
            limitacoes: formData.get("limitacoes").split("\n"),
            conexõesImportantes: formData.get("conexoes").split("\n"),
            cartas: selectedCards,
          },
        },
      };

      // Atualize os dados do ator
      try {
        await this.actor.update(actorData); // Atualiza o ator
        this.actor.update({
          "prototypeToken.bar1.attribute": "traumasCount",
          "prototypeToken.displayBars": 50,
        });
        console.log("EdVO | Dados salvos com sucesso!", actorData);
      } catch (error) {
        console.error("EdVO | Erro ao salvar os dados:", error);
      }
      loadTraumas();
    });

    async function sendMessageToChat(data) {
      const templatePath = "systems/edvo/templates/chat/messages.hbs"; // Caminho do template
      const html = await renderTemplate(templatePath, data); // Renderiza o template com os dados

      ChatMessage.create({
        content: html,
        speaker: ChatMessage.getSpeaker({ actor: data.actor }), // Determina quem "falou" no chat
      });
    }
  }
}
