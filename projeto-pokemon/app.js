const mysql = require("mysql2");
const express = require("express");
const ejs = require("ejs");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Pokemon",
 
});

db.connect((error) => {
  if (error) {
    console.error("Erro ao conectar ao MySQL:", error);
  } else {
    console.log("Conectado ao MySQL!");
  }
});

// Página inicial
app.get("/", (req, res) => {
  res.render("index");
});

// Listar Pokémons
app.get("/pokemons", (req, res) => {
  const search = req.query.search || "";
  const query = "SELECT * FROM pokemon WHERE nome LIKE ?";
  db.query(query, [`%${search}%`], (error, results) => {
    if (error) {
      console.log("Erro ao buscar Pokémon:", error);
      res.sendStatus(500);
    } else {
      res.render("pokemons", { pokemons: results, search: search });
    }
  });
});

// Página para adicionar Pokémon
app.get("/adicionar-pokemon", (req, res) => {
  res.render("adicionar-pokemon");
});

// Cadastrar novo Pokémon
app.post("/cadastrar-pokemon", (req, res) => {
  const { nome, tipo, nvl } = req.body;
  if (!nome || !tipo || !nvl) {
    console.log("Erro: Todos os campos são obrigatórios!");
    return res.status(400).send("Todos os campos são obrigatórios.");
  }
  const query = "INSERT INTO pokemon (nome, tipo, nvl) VALUES (?, ?, ?)";
  db.query(query, [nome, tipo, nvl], (error, results) => {
    if (error) {
      console.log("Erro ao cadastrar Pokémon:", error);
      return res.status(500).send("Erro ao cadastrar Pokémon.");
    } else {
      res.redirect("/pokemons");
    }
  });
});

// Página para editar Pokémon
app.get("/editar-pokemon/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM pokemon WHERE id = ?";
  db.query(query, [id], (error, results) => {
    if (error) {
      console.log("Erro ao buscar Pokémon:", error);
      return res.sendStatus(500);
    }
    if (results.length === 0) {
      return res.status(404).send("Pokémon não encontrado.");
    }
    res.render("editar-pokemon", { pokemon: results[0] });
  });
});

// Atualizar Pokémon
app.post("/editar-pokemon/:id", (req, res) => {
  const { id } = req.params;
  const { nome, tipo, nvl } = req.body;
  
  if (!nome || !tipo || !nvl) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  const query = "UPDATE pokemon SET nome = ?, tipo = ?, nvl = ? WHERE id = ?";
  db.query(query, [nome, tipo, nvl, id], (error) => {
    if (error) {
      console.log("Erro ao atualizar Pokémon:", error);
      return res.status(500).send("Erro ao atualizar Pokémon.");
    }
    res.redirect("/pokemons");
  });
});
// Rota para excluir Pokémon (usando POST)
app.post('/excluir-pokemon/:id', (req, res) => {
  const { id } = req.params;
  
  // Query para excluir o Pokémon pelo ID
  const query = "DELETE FROM pokemon WHERE id = ?";
  db.query(query, [id], (error) => {
    if (error) {
      console.log("Erro! Pokemon Referenciado na Tabela Batalha.", error);
      return res.status(500).send("Erro! Pokemon Referenciado na Tabela Batalha.");
    }
    res.redirect("/pokemons"); // Redireciona para a página de lista de Pokémons
  });
});



// Página para adicionar Treinador
app.get("/adicionar-treinador", (req, res) => {
  res.render("adicionar-treinador");
});

// Cadastrar novo Treinador
app.post("/cadastrar-treinador", (req, res) => {
  const { nome, idade, cidade } = req.body;
  if (!nome || !idade || !cidade) {
    console.log("Erro: Todos os campos são obrigatórios!");
    return res.status(400).send("Todos os campos são obrigatórios.");
  }
  const query = "INSERT INTO treinador (nome, idade, cidade) VALUES (?, ?, ?)";
  db.query(query, [nome, idade, cidade], (error, results) => {
    if (error) {
      console.log("Erro ao cadastrar Treinador:", error);
      return res.status(500).send("Erro ao cadastrar Treinador.");
    } else {
      res.redirect("/treinadores");
    }
  });
});

// Listar Treinadores
app.get("/treinadores", (req, res) => {
  const search = req.query.search || "";
  const query = "SELECT * FROM treinador WHERE nome LIKE ?";
  db.query(query, [`%${search}%`], (error, results) => {
    if (error) {
      console.log("Erro ao buscar Treinadores:", error);
      res.sendStatus(500);
    } else {
      res.render("treinadores", { treinadores: results, search: search });
    }
  });
});

// Rota para Editar Treinador
app.get('/editar-excluir-treinador/:id', (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM treinador WHERE id_treinador = ?";
  
  db.query(query, [id], (error, results) => {
    if (error) {
      console.log("Erro ao buscar Treinador:", error);
      return res.status(500).send("Erro ao buscar Treinador.");
    }
    if (results.length === 0) {
      return res.status(404).send("Treinador não encontrado.");
    }
    res.render("editar-treinador", { treinador: results[0] });
  });
});

app.post('/editar-excluir-treinador/:id', (req, res) => {
  const { id } = req.params;
  const { nome, idade, cidade, _method } = req.body;

  // Se o método for DELETE
  if (_method === 'DELETE') {
    const query = "DELETE FROM treinador WHERE id_treinador = ?";
    db.query(query, [id], (error) => {
      if (error) {
        console.log("Erro! Treinador Referenciado na Tabela Batalha.", error);
        return res.status(500).send("Erro! Treinador Referenciado na Tabela Batalha.");
      }
      res.redirect("/treinadores"); // Redireciona para a página de lista de Treinadores
    });
  }
  // Caso contrário, atualiza os dados do treinador
  else {
    if (!nome || !idade || !cidade) {
      return res.status(400).send("Todos os campos são obrigatórios.");
    }
    
    const query = "UPDATE treinador SET nome = ?, idade = ?, cidade = ? WHERE id_treinador = ?";
    db.query(query, [nome, idade, cidade, id], (error) => {
      if (error) {
        console.log("Erro ao atualizar Treinador:", error);
        return res.status(500).send("Erro ao atualizar Treinador.");
      }
      res.redirect("/treinadores");
    });
  }
});


// Página para adicionar Batalha
app.get("/adicionar-batalha", (req, res) => {
  const queryTreinadores = "SELECT * FROM treinador";
  const queryPokemons = "SELECT * FROM pokemon";
  db.query(queryTreinadores, (error, treinadores) => {
    if (error) {
      console.log("Erro ao buscar Treinadores:", error);
      return res.sendStatus(500);
    }
    db.query(queryPokemons, (error, pokemons) => {
      if (error) {
        console.log("Erro ao buscar Pokémons:", error);
        return res.sendStatus(500);
      }
      res.render("adicionar-batalha", { treinadores: treinadores, pokemons: pokemons });
    });
  });
});

// Cadastrar nova Batalha
app.post("/cadastrar-batalha", (req, res) => {
  const { id_treinador1, id_treinador2, id_pokemon1, id_pokemon2, id_treinador_vencedor, date } = req.body;
  
  if (!id_treinador1 || !id_treinador2 || !id_pokemon1 || !id_pokemon2 || !id_treinador_vencedor || !date) {
    console.log("Erro: Todos os campos são obrigatórios!");
    return res.status(400).send("Todos os campos são obrigatórios.");
  }
  
  const query = "INSERT INTO batalha (id_treinador1, id_treinador2, id_pokemon1, id_pokemon2, id_treinador_vencedor, date) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(query, [id_treinador1, id_treinador2, id_pokemon1, id_pokemon2, id_treinador_vencedor, date], (error, results) => {
    if (error) {
      console.log("Erro ao cadastrar Batalha:", error);
      return res.status(500).send("Erro ao cadastrar Batalha.");
    } else {
      res.redirect("/batalhas");
    }
  });
});

// Listar Batalhas
app.get("/batalhas", (req, res) => {
  const search = req.query.search || "";
  const query = `
    SELECT 
      b.id_batalha, 
      b.date, 
      t1.nome AS treinador1, 
      t2.nome AS treinador2, 
      p1.nome AS pokemon1, 
      p2.nome AS pokemon2, 
      tv.nome AS vencedor
    FROM batalha b
    LEFT JOIN treinador t1 ON b.id_treinador1 = t1.id_treinador
    LEFT JOIN treinador t2 ON b.id_treinador2 = t2.id_treinador
    LEFT JOIN pokemon p1 ON b.id_pokemon1 = p1.id
    LEFT JOIN pokemon p2 ON b.id_pokemon2 = p2.id
    LEFT JOIN treinador tv ON b.id_treinador_vencedor = tv.id_treinador
    WHERE 
      t1.nome LIKE ? OR 
      t2.nome LIKE ? OR 
      p1.nome LIKE ? OR 
      p2.nome LIKE ? OR 
      tv.nome LIKE ?
  `;
  db.query(query, Array(5).fill(`%${search}%`), (error, results) => {
    if (error) {
      console.log("Erro ao buscar Batalhas:", error);
      res.sendStatus(500);
    } else {
      res.render("batalhas", { batalhas: results, search: search });
    }
  });
});
// Rota para Editar Batalha
app.route("/editar-batalha/:id")
  .get((req, res) => {
    const { id } = req.params;

    // Consultar os detalhes da batalha
    const queryBatalha = "SELECT * FROM batalha WHERE id_batalha = ?";
    const queryTreinadores = "SELECT * FROM treinador";
    const queryPokemons = "SELECT * FROM pokemon";

    // Consultar a batalha
    db.query(queryBatalha, [id], (error, results) => {
      if (error) {
        console.log("Erro ao buscar Batalha:", error);
        return res.sendStatus(500);
      }

      // Se não encontrar a batalha com esse ID
      if (results.length === 0) {
        console.log(`Batalha com ID ${id} não encontrada.`);
        return res.status(404).send("Batalha não encontrada.");
      }

      // Consultar treinadores
      db.query(queryTreinadores, (error, treinadores) => {
        if (error) {
          console.log("Erro ao buscar Treinadores:", error);
          return res.sendStatus(500);
        }

        // Consultar pokémons
        db.query(queryPokemons, (error, pokemons) => {
          if (error) {
            console.log("Erro ao buscar Pokémons:", error);
            return res.sendStatus(500);
          }

          // Passar todos os dados para a view
          res.render("editar-batalha", { 
            batalha: results[0], 
            treinadores: treinadores, 
            pokemons: pokemons 
          });
        });
      });
    });
  })
  .post((req, res) => {
    const { id } = req.params;
    const { id_treinador1, id_pokemon1, id_treinador2, id_pokemon2, id_treinador_vencedor, date } = req.body;

    // Verificar se todos os campos estão presentes
    if (!id_treinador1 || !id_treinador2 || !id_pokemon1 || !id_pokemon2 || !id_treinador_vencedor || !date) {
      console.log("Erro: Todos os campos são obrigatórios!");
      return res.status(400).send("Todos os campos são obrigatórios.");
    }

    const query = `
      UPDATE batalha 
      SET 
        id_treinador1 = ?, 
        id_pokemon1 = ?, 
        id_treinador2 = ?, 
        id_pokemon2 = ?, 
        id_treinador_vencedor = ?, 
        date = ? 
      WHERE id_batalha = ?
    `;

    db.query(query, [id_treinador1, id_pokemon1, id_treinador2, id_pokemon2, id_treinador_vencedor, date, id], (error) => {
      if (error) {
        console.log("Erro ao atualizar Batalha:", error);
        return res.status(500).send("Erro ao atualizar Batalha.");
      }

      res.redirect("/batalhas");
    });
  });


// Rota para Excluir Batalha
app.post("/excluir-batalha/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM batalha WHERE id_batalha = ?";
  
  db.query(query, [id], (error) => {
    if (error) {
      console.log("Erro ao excluir Batalha:", error);
      return res.status(500).send("Erro ao excluir Batalha.");
    }
    res.redirect("/batalhas");
  });
});



// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
