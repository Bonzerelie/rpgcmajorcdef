const startButton = document.getElementById('start-button');
const gameScreen = document.getElementById('game-screen');
const startScreen = document.getElementById('start-screen');
const playRefBtn = document.getElementById('play-reference');
const replayNoteBtn = document.getElementById('replay-note');
const nextBtn = document.getElementById('next-button');
const resetScoreBtn = document.getElementById('reset-score');
const promptText = document.getElementById('prompt');
const noteButtons = document.querySelectorAll('.blue-button');
const displayNotesBtn = document.getElementById('display-notes');
const displayDegreesBtn = document.getElementById('display-degrees');
const scaleLabel = document.getElementById('scale-label');
const octaveLabel = document.getElementById('octave-label');

const correctCount = document.getElementById('correct-count');
const incorrectCount = document.getElementById('incorrect-count');
const totalCount = document.getElementById('total-count');
const accuracyDisplay = document.getElementById('accuracy');

let currentNote = '';
let audio = new Audio();
let correct = 0;
let incorrect = 0;
let isAnswered = false;
let showDegrees = false;

const noteMap = {
  'C': ['c4'],
  'D': ['d4'],
  'E': ['e4'],
  'F': ['f4'],
  'G': ['g4'],
};

const degreeMap = {
  'C': '1st',
  'D': '2nd',
  'E': '3rd',
  'F': '4th',
  'G': '5th',
};

const allNotes = Object.values(noteMap).flat();

function getNoteName(filename) {
  for (const [name, files] of Object.entries(noteMap)) {
    if (files.includes(filename)) return name;
  }
  return '';
}

function playNote(noteFile) {
  audio.src = `audio/${noteFile}.mp3`;
  audio.play();
}

function startGame() {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  loadNewNote();
}

function updateNoteButtonLabels() {
  noteButtons.forEach(btn => {
    const note = btn.getAttribute('data-note');
    btn.textContent = showDegrees ? degreeMap[note] : note;
  });
}

function loadNewNote() {
  isAnswered = false;
  noteButtons.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('correct', 'incorrect');
  });
  currentNote = allNotes[Math.floor(Math.random() * allNotes.length)];
  playNote(currentNote);
  promptText.textContent = 'Which note was played?';
  nextBtn.disabled = true;
}

function handleAnswer(e) {
  if (isAnswered) return;
  isAnswered = true;

  const selected = e.target.getAttribute('data-note');
  const correctName = getNoteName(currentNote);

  if (selected === correctName) {
    correct++;
    e.target.classList.add('correct');
    promptText.textContent = showDegrees
      ? `Correct! ✅ The note was the ${degreeMap[correctName]} scale degree`
      : `Correct! ✅ The note was ${correctName}`;
  } else {
    incorrect++;
    e.target.classList.add('incorrect');
    const correctBtn = [...noteButtons].find(btn => btn.getAttribute('data-note') === correctName);
    if (correctBtn) correctBtn.classList.add('correct');
    promptText.textContent = showDegrees
      ? `Incorrect! ❌ The note was the ${degreeMap[correctName]} scale degree`
      : `Incorrect! ❌ The note played was actually ${correctName}`;
  }

  updateScore();
  nextBtn.disabled = false;
  noteButtons.forEach(btn => btn.disabled = true);
}

function updateScore() {
  const total = correct + incorrect;
  correctCount.textContent = correct;
  incorrectCount.textContent = incorrect;
  totalCount.textContent = total;
  accuracyDisplay.textContent = total ? ((correct / total) * 100).toFixed(1) + '%' : '0.0%';
}

function resetScore() {
  correct = 0;
  incorrect = 0;
  updateScore();
}

function toggleDisplay(mode) {
  showDegrees = mode === 'degrees';
  updateNoteButtonLabels();
  displayNotesBtn.classList.toggle('selected', !showDegrees);
  displayDegreesBtn.classList.toggle('selected', showDegrees);
  scaleLabel.textContent = showDegrees ? 'Diatonic Notes of the Major Scale (Ionian Mode)' : 'Diatonic Notes of the Major Scale (Ionian Mode)';
  octaveLabel.textContent = showDegrees ? '1st, 2nd, 3rd, 4th and 5th scale degrees from one octave' : 'Notes C, D and E, F and G from one octave';
  playRefBtn.textContent = showDegrees ? 'Play Reference (Tonic)' : 'Play Reference (C - Tonic)';
  promptText.textContent = 'Which note was played?';
}

startButton.addEventListener('click', startGame);
playRefBtn.addEventListener('click', () => playNote('c4'));
replayNoteBtn.addEventListener('click', () => playNote(currentNote));
nextBtn.addEventListener('click', loadNewNote);
resetScoreBtn.addEventListener('click', resetScore);
noteButtons.forEach(btn => btn.addEventListener('click', handleAnswer));
displayNotesBtn.addEventListener('click', () => toggleDisplay('notes'));
displayDegreesBtn.addEventListener('click', () => toggleDisplay('degrees'));
