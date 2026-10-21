const express = require("express");
const { Publicacao } = require("../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
  //busca de cursos no banco de dados, ordenando do mais recente para o mais antigo e limitando a 3 resultados
  try {
    const publicacoes = await Publicacao.findAll({
      order: [["createdAt", "DESC"]],
      limit: 3,
      raw: true
    });

    res.render("index", {
      titulo: "Cursos e Oficinas",
      subtitulo: "Encontre cursos de forma simples e objetiva",
      publicacoes,
      possuiPublicacoes: publicacoes.length > 0
    });
  } catch (erro) {
    next(erro);
  }
});

router.get("/saude", (req, res) => {
  res.json({ status: "ok", aplicacao: "mural-servidor-aula-02" });
});

module.exports = router;
