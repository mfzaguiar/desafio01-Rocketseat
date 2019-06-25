const express = require('express');

const server = express();

server.use(express.json());

const projects = [
  { id: '1', title: 'Novo projeto', tasks: [] },
  { id: '2', title: 'TODO', tasks: ['TESTE'] }
];

let countRequest = 0;

server.use((req, res, next) => {
  countRequest++;
  console.log(`Requests: ${countRequest}`);
  next();
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  let flag = 0;
  
  const project = projects.find(item => item.id === id)

  if (!project) {
    return res.status(400).json({ error: 'The is no project with this ID' });
  }

  req.project = project

  return next();
}

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
 
  projects.find( item => item.id === id ?  
    (item.title = title) : '')

  return res.json(projects);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const projectIndex = projects.indexOf(req.project)
 
  projects.splice(projectIndex, 1)
 
  return res.json(projects);
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { project, title } = req
  
  project.tasks.push(title)

  return res.json(projects);
});

server.listen(3000);
