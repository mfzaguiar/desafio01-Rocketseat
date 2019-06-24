const express = require("express");

const server = express();

server.use(express.json());

const projects = [
  { id: "1", title: "Novo projeto", tasks: [] },
  { id: "2", title: "TODO", tasks: ["TESTE"] }
];

var numRequests = 0;

server.use((req, res, next) => {
  numRequests += 1;
  console.log(`Requests: ${numRequests}`);
  next();
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  let flag = 0;

  projects.forEach(item => {
    item.id === id ? (flag = 1) : "";
  });

  if (!flag) {
    return res.status(400).json({ error: "The is no project with this ID" });
  }

  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.forEach(item => {
    item.id === id ? (item.title = title) : "";
  });

  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  projects.forEach((item, index) => {
    item.id === id ? projects.splice(index, 1) : "";
  });

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.forEach(item => {
    item.id === id ? item.tasks.push(title) : "";
  });

  return res.json(projects);
});

server.listen(3000);
