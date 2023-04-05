import Board from './kanban/Board';
import './dispatchEvent';
import './DnD';
// localStorage.clear()
/* eslint-disable */
console.log('it works!');
const board = new Board(document.querySelector('.trello-container'));
board.bindToDOM();



