// --- Media Upload Functions ---
function handleMediaUpload(qIndex, fileInput) {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        currentQuiz.questions[qIndex].media = {
            type: file.type.split('/')[0],
            url: e.target.result,
            name: file.name
        };
        renderCreatorQuestions();
        saveDraft();
    };
    reader.readAsDataURL(file);
}

function removeMedia(qIndex) {
    delete currentQuiz.questions[qIndex].media;
    renderCreatorQuestions();
    saveDraft();
}
let currentQuiz = {
    title: '',
    questions: [],
};

// --- DOM Elements ---
const homeView = document.getElementById('home-view');
const creatorView = document.getElementById('creator-view');
const takerView = document.getElementById('taker-view');
const quizTitleInput = document.getElementById('quiz-title');
const questionsContainer = document.getElementById('questions-container');
const addQuestionBtn = document.getElementById('add-question-btn');
const saveQuizBtn = document.getElementById('save-quiz-btn');
const goToCreatorBtn = document.getElementById('go-to-creator-btn');
const goToTakerBtn = document.getElementById('go-to-taker-btn');
const creatorReturnHomeBtn = document.getElementById('creator-return-home-btn');
const restartQuizBtn = document.getElementById('restart-quiz-btn');
const returnHomeBtn = document.getElementById('return-home-btn');
const notificationBar = document.getElementById('notification-bar');
const postQuizActions = document.getElementById('post-quiz-actions');

// --- Draft Restore Dialog ---
const draftRestoreDialog = document.getElementById('draft-restore-dialog');
const restoreDraftBtn = document.getElementById('restore-draft-btn');
const discardDraftBtn = document.getElementById('discard-draft-btn');

// --- Event Listeners ---
addQuestionBtn.addEventListener('click', addQuestion);
saveQuizBtn.addEventListener('click', saveQuiz);

if (goToCreatorBtn) {
    goToCreatorBtn.addEventListener('click', () => {
        const draft = localStorage.getItem('quizDraft');
        if (draft) {
            draftRestoreDialog.classList.remove('hidden');
        } else {
            resetQuiz();
            showCreatorView();
        }
    });
}

if (goToTakerBtn) goToTakerBtn.addEventListener('click', loadQuiz);

if (creatorReturnHomeBtn) {
    creatorReturnHomeBtn.addEventListener('click', () => {
        creatorView.classList.add('hidden');
        homeView.classList.remove('hidden');
    });
}
// Save draft when quiz title changes
if (quizTitleInput) {
    quizTitleInput.addEventListener('input', saveDraft);
}

if (restartQuizBtn) {
    restartQuizBtn.addEventListener('click', () => {
        currentQuestionIndex = 0;
        score = 0;
        renderTakerQuiz();
    });
}

if (returnHomeBtn) {
    returnHomeBtn.addEventListener('click', () => {
        takerView.classList.add('hidden');
        homeView.classList.remove('hidden');
    });
}

// --- Draft Management ---
restoreDraftBtn.addEventListener('click', () => {
    const draft = JSON.parse(localStorage.getItem('quizDraft'));
    currentQuiz = draft;
    quizTitleInput.value = currentQuiz.title;
    renderCreatorQuestions();
    draftRestoreDialog.classList.add('hidden');
    showCreatorView();
});

discardDraftBtn.addEventListener('click', () => {
    localStorage.removeItem('quizDraft');
    resetQuiz();
    draftRestoreDialog.classList.add('hidden');
    showCreatorView();
});

function saveDraft() {
    currentQuiz.title = quizTitleInput.value;
    localStorage.setItem('quizDraft', JSON.stringify(currentQuiz));
}

function showCreatorView() {
    homeView.classList.add('hidden');
    creatorView.classList.remove('hidden');
    takerView.classList.add('hidden');
    renderCreatorQuestions();
}

// --- Creator Functions ---
function addQuestion() {
    currentQuiz.questions.push({
        text: '',
        options: ['', ''],
        correctAnswerIndex: 0,
        media: null
    });
    renderCreatorQuestions();
    saveDraft();
}

function renderCreatorQuestions() {
    questionsContainer.innerHTML = '';
    currentQuiz.questions.forEach((q, index) => {
        const questionBlock = document.createElement('div');
        questionBlock.className = 'question-block';
        questionBlock.dataset.id = index;
        questionBlock.innerHTML = `
            <div class="question-header">
                <div class="question-top-controls">
                    <i class="fas fa-grip-vertical drag-handle"></i>
                    <h4>Question ${index + 1}</h4>
                </div>
                <button onclick="deleteQuestion(${index})" class="btn-danger"><i class="fas fa-trash-alt"></i></button>
            </div>
            <input type="text" class="question-text-input" placeholder="Question Text" value="${q.text}" oninput="updateQuestionText(${index}, this.value)">
            <div class="media-upload-container">
                <div class="media-preview">
                    ${q.media ? `
                        ${q.media.type === 'image' ? `<img src="${q.media.url}" alt="Preview">` : ''}
                        ${q.media.type === 'video' ? `<video controls><source src="${q.media.url}" type="video/mp4"></video>` : ''}
                        ${q.media.type === 'audio' ? `<audio controls><source src="${q.media.url}" type="audio/mpeg"></audio>` : ''}
                        <div class="media-info">
                            <span>${q.media.name}</span>
                            <button onclick="removeMedia(${index})" class="btn-danger-small">Remove</button>
                        </div>
                    ` : ''}
                </div>
                <div class="media-controls">
                    <label for="media-upload-${index}" class="btn-secondary">
                        <i class="fas fa-upload"></i> Upload Media
                    </label>
                    <input type="file" id="media-upload-${index}" accept="image/*,video/*,audio/*" style="display: none" onchange="handleMediaUpload(${index}, this)">
                </div>
            </div>
            <p>Options (select the correct one):</p>
            <div class="options-grid">
                ${q.options.map((opt, optIndex) => `
                    <div class="option-row">
                        <input type="radio" name="correct_${index}" ${q.correctAnswerIndex === optIndex ? 'checked' : ''} onchange="updateCorrectAnswer(${index}, ${optIndex})">
                        <input type="text" class="form-control" placeholder="Option ${optIndex + 1}" value="${opt}" oninput="updateOptionText(${index}, ${optIndex}, this.value)">
                        <button onclick="deleteOption(${index}, ${optIndex})" class="btn-danger-small">X</button>
                    </div>
                `).join('')}
            </div>
            <div class="add-option-container">
                <button onclick="addOption(${index})" class="btn-add-option"><i class="fas fa-plus"></i> Add Option</button>
            </div>
        `;
        questionsContainer.appendChild(questionBlock);
    });

    if (window.Sortable) {
        new window.Sortable(questionsContainer, {
            animation: 150,
            handle: '.drag-handle',
            onEnd: function (evt) {
                const item = currentQuiz.questions.splice(evt.oldIndex, 1)[0];
                currentQuiz.questions.splice(evt.newIndex, 0, item);
                renderCreatorQuestions();
                saveDraft();
            }
        });
    }
}

function deleteQuestion(index) {
    currentQuiz.questions.splice(index, 1);
    renderCreatorQuestions();
    saveDraft();
}

function deleteOption(qIndex, oIndex) {
    const question = currentQuiz.questions[qIndex];

    // Prevent deleting if only two options are left
    if (question.options.length <= 2) {
        showNotification('A question must have at least two options.', 'error');
        return;
    }

    // Remove the option
    question.options.splice(oIndex, 1);

    // Adjust the correct answer index if necessary
    if (question.correctAnswerIndex === oIndex) {
        // If the deleted option was the correct one, reset to the first option
        question.correctAnswerIndex = 0;
    } else if (question.correctAnswerIndex > oIndex) {
        // If an option before the correct one was deleted, decrement the index
        question.correctAnswerIndex--;
    }

    renderCreatorQuestions();
    saveDraft();
}

function updateQuestionText(index, text) {
    if (index >= 0 && index < currentQuiz.questions.length) {
        currentQuiz.questions[index].text = text;
        saveDraft();
    }
}

function updateOptionText(qIndex, oIndex, text) {
    if (qIndex >= 0 && qIndex < currentQuiz.questions.length) {
        const question = currentQuiz.questions[qIndex];
        if (oIndex >= 0 && oIndex < question.options.length) {
            question.options[oIndex] = text;
            saveDraft();
        }
    }
}

function updateCorrectAnswer(qIndex, oIndex) {
    currentQuiz.questions[qIndex].correctAnswerIndex = oIndex;
    saveDraft();
}

function addOption(qIndex) {
    currentQuiz.questions[qIndex].options.push('');
    renderCreatorQuestions();
    saveDraft();
}

async function saveQuiz() {
    currentQuiz.title = quizTitleInput.value.trim();
    
    // Validate quiz structure
    if (!currentQuiz.title) {
        showNotification('Quiz title is required', 'error');
        return;
    }
    
    if (currentQuiz.questions.length === 0) {
        showNotification('Add at least one question', 'error');
        return;
    }
    
    for (let i = 0; i < currentQuiz.questions.length; i++) {
        const q = currentQuiz.questions[i];
        if (!q.text.trim()) {
            showNotification(`Question ${i+1} text is required`, 'error');
            return;
        }
        if (q.options.length < 2) {
            showNotification(`Question ${i+1} needs at least 2 options`, 'error');
            return;
        }
    }

    // Proceed with saving
    const jsonString = JSON.stringify(currentQuiz, null, 2);
    const result = await window.electronAPI.saveQuiz(jsonString);
    
    if (result.success) {
        showNotification(`Quiz saved successfully!`, 'success');
        localStorage.removeItem('quizDraft');
    } else {
        showNotification('Failed to save quiz.', 'error');
    }
}

// --- Taker View State ---
let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;

// --- Taker View DOM Elements ---
const progressBar = document.getElementById('progress-bar');
const quizTitle = document.getElementById('taker-quiz-title');
const questionText = document.getElementById('current-question-text');
const optionsContainer = document.getElementById('taker-options-container');
const checkAnswerBtn = document.getElementById('check-answer-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackMessage = document.getElementById('feedback-message');
const scoreResult = document.getElementById('score-result');
const takerCloseBtn = document.getElementById('taker-close-btn');

// --- Taker View Functions ---
function renderTakerQuiz() {
    feedbackContainer.classList.add('hidden');
    feedbackContainer.classList.remove('correct-feedback', 'incorrect-feedback');
    feedbackMessage.textContent = '';
    nextQuestionBtn.classList.add('hidden');
    checkAnswerBtn.disabled = true;
    checkAnswerBtn.style.display = '';
    selectedOptionIndex = null;

    if (postQuizActions) postQuizActions.classList.add('hidden');
    if (scoreResult) scoreResult.textContent = '';

    if (currentQuestionIndex >= currentQuiz.questions.length) {
        showQuizResult();
        return;
    }

    const question = currentQuiz.questions[currentQuestionIndex];
    quizTitle.textContent = currentQuiz.title || 'Quiz';
    questionText.textContent = question.text;

    // Add media display
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'question-media';
    if (question.media) {
        if (question.media.type === 'image') {
            const img = document.createElement('img');
            img.src = question.media.url;
            img.alt = 'Question Image';
            mediaContainer.appendChild(img);
        } else if (question.media.type === 'video') {
            const video = document.createElement('video');
            video.controls = true;
            video.innerHTML = `<source src="${question.media.url}" type="video/mp4">`;
            mediaContainer.appendChild(video);
        } else if (question.media.type === 'audio') {
            const audio = document.createElement('audio');
            audio.controls = true;
            audio.innerHTML = `<source src="${question.media.url}" type="audio/mpeg">`;
            mediaContainer.appendChild(audio);
        }
    }
    const questionArea = document.getElementById('taker-question-area');
    if (questionArea) {
        // Remove any previous media
        const prevMedia = questionArea.querySelector('.question-media');
        if (prevMedia) prevMedia.remove();
        questionArea.insertBefore(mediaContainer, questionText);
    }

    const progress = currentQuiz.questions.length > 0 ?
        ((currentQuestionIndex) / currentQuiz.questions.length) * 100 : 0;
    progressBar.style.width = progress + '%';

    optionsContainer.innerHTML = '';
    question.options.forEach((option, idx) => {
        const tile = document.createElement('div');
        tile.className = 'option-tile';
        tile.textContent = option;
        tile.addEventListener('click', () => selectOption(idx, tile));
        optionsContainer.appendChild(tile);
    });
}

function selectOption(idx, tile) {
    if (selectedOptionIndex !== null) return;
    selectedOptionIndex = idx;
    Array.from(optionsContainer.children).forEach(child => {
        child.classList.remove('selected');
    });
    tile.classList.add('selected');
    checkAnswerBtn.disabled = false;
}

function checkAnswer() {
    if (selectedOptionIndex === null) return;
    const question = currentQuiz.questions[currentQuestionIndex];
    const correctIdx = question.correctAnswerIndex;
    const correct = selectedOptionIndex === correctIdx;
    if (correct) score++;

    Array.from(optionsContainer.children).forEach((tile, i) => {
        tile.classList.remove('selected');
        if (i === correctIdx) tile.classList.add('correct');
        if (i === selectedOptionIndex && !correct) tile.classList.add('incorrect');
        tile.style.pointerEvents = 'none';
    });

    feedbackContainer.classList.remove('hidden');
    if (correct) {
        feedbackContainer.classList.add('correct-feedback');
        feedbackMessage.textContent = 'Correct!';
    } else {
        feedbackContainer.classList.add('incorrect-feedback');
        feedbackMessage.textContent = 'Incorrect!';
    }
    checkAnswerBtn.style.display = 'none';
    nextQuestionBtn.classList.remove('hidden');
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuiz.questions.length) {
        renderTakerQuiz();
    } else {
        showQuizResult();
    }
}

function showQuizResult() {
    progressBar.style.width = '100%';
    optionsContainer.innerHTML = '';
    questionText.textContent = '';
    checkAnswerBtn.style.display = 'none';
    feedbackContainer.classList.remove('hidden', 'correct-feedback', 'incorrect-feedback');
    feedbackMessage.textContent = `Quiz Complete! Your score: ${score} / ${currentQuiz.questions.length}`;
    nextQuestionBtn.classList.add('hidden');
    if (scoreResult) scoreResult.textContent = `Score: ${score} / ${currentQuiz.questions.length}`;
    if (postQuizActions) postQuizActions.classList.remove('hidden');
}

// --- Taker View Event Listeners ---
if (checkAnswerBtn) checkAnswerBtn.addEventListener('click', checkAnswer);
if (nextQuestionBtn) nextQuestionBtn.addEventListener('click', nextQuestion);
if (takerCloseBtn) takerCloseBtn.addEventListener('click', () => {
    takerView.classList.add('hidden');
    homeView.classList.remove('hidden');
});

// --- Load Quiz Function ---
async function loadQuiz() {
    try {
        const result = await window.electronAPI.loadQuiz();
        if (result.success) {
            const loadedQuiz = JSON.parse(result.data);
            
            // Validate quiz structure
            if (!loadedQuiz.title || !Array.isArray(loadedQuiz.questions) || loadedQuiz.questions.length === 0) {
                throw new Error("Invalid quiz file: Missing title or questions");
            }

            currentQuiz = {
                title: loadedQuiz.title || 'Untitled Quiz',
                questions: []
            };

            // Process each question with validation
            for (const q of loadedQuiz.questions) {
                // Ensure basic structure exists
                if (!q.text || !Array.isArray(q.options) || q.options.length < 2) {
                    console.warn("Skipping invalid question:", q);
                    continue;
                }

                // Sanitize options
                const sanitizedOptions = q.options.map(opt => 
                    typeof opt === 'string' ? opt : String(opt)
                );

                // Validate correct answer index
                let correctIdx = Number.isInteger(q.correctAnswerIndex) ? 
                    q.correctAnswerIndex : 0;
                
                correctIdx = Math.max(0, Math.min(correctIdx, sanitizedOptions.length - 1));

                currentQuiz.questions.push({
                    text: q.text || '',
                    options: sanitizedOptions,
                    correctAnswerIndex: correctIdx,
                    media: q.media || null
                });
            }

            // Final validation
            if (currentQuiz.questions.length === 0) {
                throw new Error("No valid questions found in quiz file");
            }
            
            // Proceed to show quiz
            homeView.classList.add('hidden');
            takerView.classList.remove('hidden');
            currentQuestionIndex = 0;
            score = 0;
            renderTakerQuiz();
        } else {
            showNotification('Load cancelled.', 'error');
        }
    } catch (error) {
        console.error('Load Error:', error);
        showNotification(`Failed to load quiz: ${error.message}`, 'error');
        homeView.classList.remove('hidden');
        takerView.classList.add('hidden');
    }
}

// --- Utility Functions ---
function resetQuiz() {
    currentQuiz = {
        title: '',
        questions: [],
    };
    if (quizTitleInput) quizTitleInput.value = '';
    if (questionsContainer) questionsContainer.innerHTML = '';
}

function showNotification(message, type = 'success') {
    if (!notificationBar) return;
    notificationBar.textContent = message;
    notificationBar.className = `show ${type}`;
    setTimeout(() => {
        notificationBar.className = notificationBar.className.replace('show', '');
    }, 3000);
}