class CustomActorSheet extends ActorSheet {
  // Define o template HTML da ficha
  get template() {
    return "systems/edvo/templates/actor-sheet.html"; // Atualize o caminho para refletir a localização correta!
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

    if (this.actor.isOwner) {
      html.addClass("actor-owner");
    }

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

      // Determina o resultado de sucesso
      const result =
        total >= 10
          ? "<strong style='color: green;'>Sucesso Completo</strong>"
          : total >= 7
          ? "<strong style='color: orange;'>Sucesso Parcial</strong>"
          : "<strong style='color: red;'>Falha</strong>";

      console.log(
        `EdVO | Resultado ECO: d1=${d1}, d2=${d2}, penalidade=${penalty}, total=${total}, resultado=${result}`
      );

      // Envia a mensagem para o chat com os dados da rolagem
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `
            <strong>Rolagem de ECO:</strong><br>
            🎲 Dados: ${d1} + ${d2}<br>
            🌟 Total: ${total}<br>
            🏆 Resultado: ${result}
          `,
        flavor: "Rolagem ECO",
      });
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

      const actorData = {
        name: formData.get("name"),
        system: {
          arcano: formData.get("arcano"),
          arquetipo: formData.get("arquetipo"),
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
