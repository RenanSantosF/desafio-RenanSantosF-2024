class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'SAVANA', tamanhoTotal: 10, animaisAtuais: [{animal: 'MACACO', quantidade: 3}] },
            { numero: 2, bioma: 'FLORESTA', tamanhoTotal: 5, animaisAtuais: [] },
            { numero: 3, bioma: 'SAVANA E RIO', tamanhoTotal: 7, animaisAtuais: [{animal: 'GAZELA', quantidade: 1}] },
            { numero: 4, bioma: 'RIO', tamanhoTotal: 8, animaisAtuais: []  },
            { numero: 5, bioma: 'SAVANA', tamanhoTotal: 9, animaisAtuais: [{animal: 'LEAO', quantidade: 1}] }
        ];

        this.animaisDisponiveis = [
            { nome: "LEAO", tamanho: 3, carnivoro: true, bioma: ['SAVANA'] },
            { nome: "LEOPARDO", tamanho: 2, carnivoro: true, bioma: ['SAVANA'] },
            { nome: "CROCODILO", tamanho: 3, carnivoro: true, bioma: ['RIO'] },
            { nome: "MACACO", tamanho: 1, carnivoro: false, bioma: ['SAVANA', 'FLORESTA'] },
            { nome: "GAZELA", tamanho: 2, carnivoro: false, bioma: ['SAVANA'] },
            { nome: "HIPOPOTAMO", tamanho: 4, carnivoro: false, bioma: ['SAVANA', 'FLORESTA'] }
        ];
    }

    analisaRecintos(animal, quantity) {
        const animalFilter = this.animaisDisponiveis.find(a => a.nome === animal);
        let recintos = [...this.recintos]; // Copia a lista de recintos
        let erros = [];

        // Verifica se o animal existe
        if (!animalFilter) {
            erros.push({ erro: 'Animal não encontrado' });
            return { recintos: [], erros };
        }

        // Função para verificar se um recinto contém algum animal carnívoro
        const possuiCarnivoro = animais => animais.some(a => {
            const animalAtual = this.animaisDisponiveis.find(aDisp => aDisp.nome === a.animal);
            return animalAtual && animalAtual.carnivoro;
        });

        // Função para determinar se o recinto é adequado para o animal
        const adequadoParaAnimal = (recinto, animalFilter) => {
            const temCarnivoro = possuiCarnivoro(recinto.animaisAtuais);
            const isSavanaERio = recinto.bioma === 'SAVANA E RIO';

            if (animalFilter.nome === 'HIPOPOTAMO') {
                return isSavanaERio || recinto.animaisAtuais.length === 0;
            }

            if (animalFilter.nome === 'MACACO') {
                return recinto.animaisAtuais.length > 0;
            }

            return temCarnivoro 
                ? animalFilter.carnivoro 
                : (recinto.animaisAtuais.length === 0 || !animalFilter.carnivoro);
        };

        const calculaEspacoOcupado = (recinto, animalFilter, quantity) => {
            const tamanhoAnimal = animalFilter.tamanho;
            const quantidadeExistente = recinto.animaisAtuais.reduce((acc, a) => {
                const animalAtual = this.animaisDisponiveis.find(aDisp => aDisp.nome === a.animal);
                return acc + (animalAtual.tamanho * a.quantidade);
            }, 0);
            const quantidadeAdicionar = tamanhoAnimal * quantity;
            const espacoAtual = recinto.tamanhoTotal - quantidadeExistente;

            // Espaço extra só se houver mais de uma espécie no recinto e a nova espécie for diferente das existentes
            const numeroEspecies = new Set(recinto.animaisAtuais.map(a => a.animal)).size;
            const espacoExtra = (numeroEspecies > 0 && !recinto.animaisAtuais.some(a => a.animal === animalFilter.nome)) ? 1 : 0;

            return quantidadeAdicionar + espacoExtra <= espacoAtual;
        };

        // Filtra recintos baseando-se na condição adequada
        recintos = recintos.filter(recinto => adequadoParaAnimal(recinto, animalFilter) &&
            calculaEspacoOcupado(recinto, animalFilter, quantity)
        );

        // Adiciona uma mensagem de erro se nenhum recinto foi encontrado
        if (recintos.length === 0) {
            erros.push({ erro: 'Nenhum recinto compatível encontrado' });
        }

        return { recintos, erros };
    }
}

// Exemplo de uso
const zoo = new RecintosZoo();
// console.log(zoo.analisaRecintos('HIPOPOTAMO', 1)); // Teste com o hipopótamo
console.log(zoo.analisaRecintos('MACACO', 1));  // Teste com um animal carnívoro


