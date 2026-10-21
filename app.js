const path = require("node:path");
const express = require("express");
const { engine } = require("express-handlebars");
const { sequelize, Publicacao } = require("./models");
const indexRouter = require("./routes/index");
const publicacoesRouter = require("./routes/publicacoes");

function createApp() {
  const app = express();

  app.engine(
    "hbs",
    engine({
      extname: ".hbs",
      defaultLayout: "main",
      layoutsDir: path.join(__dirname, "views", "layouts"),
      partialsDir: path.join(__dirname, "views", "partials"),
      helpers: {
        formatarData(valor) {
          return new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "short"
          }).format(new Date(valor));
        }
      }
    })
  );

  app.set("view engine", "hbs");
  app.set("views", path.join(__dirname, "views"));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));

  app.use("/", indexRouter);
  app.use("/publicacoes", publicacoesRouter);

  app.use((req, res) => {
    res.status(404).render("404", {
      titulo: "Página não encontrada",
      caminho: req.originalUrl
    });
  });

  app.use((erro, req, res, next) => {
    console.error("Erro tratado pela aplicação:", erro);

    if (res.headersSent) {
      return next(erro);
    }

    return res.status(500).render("erro", {
      titulo: "Erro interno",
      mensagem:
        process.env.NODE_ENV === "development"
          ? erro.message
          : "Não foi possível concluir a solicitação. Tente novamente."
    });
  });

  return app;
}

async function prepararBanco() {
  await sequelize.authenticate();
  await sequelize.sync();

  const quantidade = await Publicacao.count();
  await Publicacao.bulkCreate([
    //dados de exemplo para popular o banco de dados; O mural.sql serve como referência
    {
      icone: "/images/ifrn.png",
      status: "DISPONÍVEL",
      titulo: "Introdução ao Git",
      instrutor: "Fulano de Tal",
      cargaHoraria: "4 horas",
      vagas: 20,
      descricao: "Aprenda os conceitos básicos do Git"
    },
    {
      icone: "/images/ifrn.png",
      status: "EM ANDAMENTO",
      titulo: "Oficina de APIs",
      instrutor: "Cicrano de Tal",
      cargaHoraria: "6 horas",
      vagas: 20,
      descricao: "Aprenda a criar e consumir APIs"
    },
    {
      icone: "/images/ifrn.png",
      status: "DESTAQUE",
      titulo: "CSS responsivo",
      instrutor: "Beltrano de Tal",
      cargaHoraria: "3 horas",
      vagas: 20,
      descricao: "Aprenda a criar layouts CSS"
    }
  ]);
}

module.exports = { createApp, prepararBanco };
