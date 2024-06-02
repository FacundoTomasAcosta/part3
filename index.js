const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();
const Person = require("./models/person");

app.use(cors());
app.use(express.static("dist"));

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

const date = new Date();

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  });
});

app.get("/info", (req, res) => {
  Person.find({}).then((persons) => {
    res.send(
      `<p>Phonebook has info for ${persons.length} people</p><br/>${date}`
    );
  });
});

// const genereteId = () => {
//   const newId = persons.length > 0 ? Math.floor(Math.random() * 100000000) : 0;
//   return newId;
// };

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name) {
    return res.status(400).json({ error: `name missing` });
  }
  if (!body.number) {
    return res.status(400).json({ error: `number missing` });
  }

  if (Person.map((person) => person.name).includes(body.name)) {
    return res.status(400).json({ error: `name must be unique` });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savePerson) => {
    response.json(savePerson);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id).then((person) => {
    res.status(204).end();
  });
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
