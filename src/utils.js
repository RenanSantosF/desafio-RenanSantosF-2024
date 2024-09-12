export const possuiCarnivoro = (animaisAtuais, animaisDisponiveis) => {
  return animaisAtuais.some((a) => {
    const animalAtual = animaisDisponiveis.find(
      (animal) => animal.nome === a.animal
    );
    return animalAtual && animalAtual.carnivoro;
  });
};

export const calculaEspacoOcupado = (recinto, animalFiltrado, quantidade, animaisDisponiveis) => {
  const tamanhoAnimal = animalFiltrado.tamanho;

  const quantidadeExistente = recinto.animaisAtuais.reduce((acumulador, a) => {
    const animalAtual = animaisDisponiveis.find((animal) => animal.nome === a.animal);
    return acumulador + animalAtual.tamanho * a.quantidade;
  }, 0);

  const espacoNecessario = tamanhoAnimal * quantidade;
  const espacoDisponivel = recinto.tamanhoTotal - quantidadeExistente;

  const animaisAtuaisComNovo = [...recinto.animaisAtuais, { animal: animalFiltrado.nome, quantidade }];
  const especiesExistentes = new Set(animaisAtuaisComNovo.map((a) => a.animal)).size;

  const jaContemNovoAnimal = recinto.animaisAtuais.some((a) => a.animal === animalFiltrado.nome);
  const espacoExtra = especiesExistentes > 1 && !jaContemNovoAnimal ? 1 : 0;

  return espacoNecessario <= espacoDisponivel - espacoExtra;
};

export const adequadoParaAnimal = (recinto, animalFiltrado, animaisDisponiveis) => {
  const temCarnivoro = possuiCarnivoro(recinto.animaisAtuais, animaisDisponiveis);
  const biomaCompatível = animalFiltrado.bioma.some((bioma) =>
    recinto.bioma.split(" ").includes(bioma)
  );

  if (animalFiltrado.nome !== "MACACO" && recinto.animaisAtuais.length === 0) {
    return biomaCompatível;
  }

  if (temCarnivoro && !animalFiltrado.carnivoro) {
    return false;
  }

  if (!temCarnivoro && animalFiltrado.carnivoro) {
    return false;
  }

  if (animalFiltrado.nome === "HIPOPOTAMO") {
    return (recinto.bioma === "SAVANA E RIO" || recinto.animaisAtuais.length === 0) && biomaCompatível;
  }

  if (animalFiltrado.nome === "MACACO") {
    return recinto.animaisAtuais.length > 0 && biomaCompatível;
  }

  return (recinto.animaisAtuais.length === 0 || !temCarnivoro || animalFiltrado.carnivoro) && biomaCompatível;
};
