const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    titulo: "Cursos e Oficinas",
    subtitulo: "Encontre cursos de forma simples e objetiva"
  });
});

router.get("/saude", (req, res) => {
  res.json({ status: "ok", aplicacao: "mural-servidor-aula-02" });
});

module.exports = router;
