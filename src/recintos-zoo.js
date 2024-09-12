import { animaisDisponiveis } from "./Animais.js";
import { recintos } from "./Recintos.js";
import { adequadoParaAnimal, calculaEspacoOcupado } from "./utils.js";

class RecintosZoo {
  constructor() {
    this.recintos = recintos;
    this.animaisDisponiveis = animaisDisponiveis;
  }

  analisaRecintos(nomeAnimal, quantidade) {
    if (!nomeAnimal || typeof nomeAnimal !== "string") {
      return { erro: "Nome do animal inválido" };
    }

    if (!quantidade || typeof quantidade !== "number" || quantidade <= 0) {
      return { erro: "Quantidade inválida" };
    }

    const animalFiltrado = this.animaisDisponiveis.find(
      (a) => a.nome === nomeAnimal
    );

    if (!animalFiltrado) {
      return { erro: "Animal inválido" };
    }

    let recintosFiltrados = [...this.recintos];

    recintosFiltrados = recintosFiltrados.filter(
      (recinto) =>
        adequadoParaAnimal(recinto, animalFiltrado, this.animaisDisponiveis) &&
        calculaEspacoOcupado(
          recinto,
          animalFiltrado,
          quantidade,
          this.animaisDisponiveis
        )
    );

    if (recintosFiltrados.length === 0) {
      return { erro: "Não há recinto viável" };
    }

    const formatoRecintos = recintosFiltrados.map((recinto) => {
      const espacoNecessario = animalFiltrado.tamanho * quantidade;
      const espacoAtualizado =
        recinto.tamanhoTotal -
        (recinto.animaisAtuais.reduce((acumulador, a) => {
          const animalAtual = this.animaisDisponiveis.find(
            (animal) => animal.nome === a.animal
          );
          return acumulador + animalAtual.tamanho * a.quantidade;
        }, 0) +
          espacoNecessario);

      const especiesExistentes = new Set(
        [
          ...recinto.animaisAtuais,
          { animal: animalFiltrado.nome, quantidade },
        ].map((a) => a.animal)
      ).size;
      const espacoExtra = especiesExistentes > 1 ? 1 : 0;

      return `Recinto ${recinto.numero} (espaço livre: ${
        espacoAtualizado - espacoExtra
      } total: ${recinto.tamanhoTotal})`;
    });

    return { recintosViaveis: formatoRecintos };
  }
}

const resultado = new RecintosZoo();

console.log(resultado.analisaRecintos("GAZELA", 1));

export { RecintosZoo as RecintosZoo };
