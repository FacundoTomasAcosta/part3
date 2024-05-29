const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.json());

app.use(
  morgan((tokens, request, response) => {
    return [
      tokens.method(request, response),
      tokens.url(request, response),
      tokens.status(request, response),
      tokens.res(request, response, "content-length"),
      "-",
      tokens["response-time"](request, response),
      "ms",
      JSON.stringify(request.body),
    ].join(" ");
  })
);

persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const date = new Date();

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><br/>${date}`
  );
});

const genereteId = () => {
  const newId = persons.length > 0 ? Math.floor(Math.random() * 100000000) : 0;
  return newId;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name) {
    return res.status(400).json({ error: `name missing` });
  }
  if (!body.number) {
    return res.status(400).json({ error: `number missing` });
  }

  if (persons.map((person) => person.name).includes(body.name)) {
    return res.status(400).json({ error: `name must be unique` });
  }

  const person = {
    id: genereteId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
