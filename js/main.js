import './ui.js';
import { loadProjects } from './github.js';

document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
});