require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const Person = require("./models/person");

app.use(express.static("dist"));
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

const cors = require("cors");
app.use(cors());

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

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

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savePerson) => {
    res.json(savePerson);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id).then((person) => {
    res.status(204).end();
  });
});

app.put("/api/persons/:id", (req, res) => {
  const { name, number } = req.body;
  Person.findByIdAndUpdate(req.params.id, { name, number }).then(
    (updatePerson) => {
      res.json(updatePerson);
    }
  );
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
