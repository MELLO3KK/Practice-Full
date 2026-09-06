// --- Epic Visual Effects ---

// Particle System
function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const colors = ['rgba(102, 126, 234, 0.4)', 'rgba(118, 75, 162, 0.4)', 'rgba(240, 147, 251, 0.4)', 'rgba(245, 87, 108, 0.4)'];

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 20 + 10) + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        container.appendChild(particle);
    }
}

// Confetti Effect
function launchConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;

    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#ffd700', '#00ff88', '#00d4ff'];
    const shapes = ['square', 'circle'];

    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)] === 'circle' ? '50%' : '0';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);

            setTimeout(() => confetti.remove(), 4000);
        }, i * 20);
    }
}

// Streak Counter
let streak = 0;
let streakContainer = null;
let streakCount = null;

function updateStreak(correct) {
    if (!streakContainer || !streakCount) return;
    
    if (correct) {
        streak++;
        streakCount.textContent = streak;
        if (streak >= 2) {
            streakContainer.classList.add('visible');
            streakContainer.classList.add('fire');
            setTimeout(() => streakContainer.classList.remove('fire'), 500);
        }

        // Show score popup for streaks
        if (streak >= 3) {
            showScorePopup(`${streak}x STREAK!`);
        }
    } else {
        streak = 0;
        streakContainer.classList.remove('visible');
    }
}

function showScorePopup(text) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = text;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
}

// Initialize particles on load
document.addEventListener('DOMContentLoaded', () => {
    streakContainer = document.getElementById('streak-container');
    streakCount = document.getElementById('streak-count');
    createParticles();
    initRippleEffect();
    initSettings();
    initKeyboardShortcuts();
});

// --- Ripple Effect for Buttons ---
function initRippleEffect() {
    document.addEventListener('click', (e) => {
        const button = e.target.closest('button, .option-tile');
        if (!button) return;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
}

// --- Settings Panel ---
let settings = {
    soundEnabled: true,
    timerEnabled: false,
    shuffleEnabled: false,
    keyboardEnabled: true,
    reattemptEnabled: false,
    groupedQuizEnabled: false,
    timerDuration: 30
};

function initSettings() {
    // Load saved settings
    const savedSettings = localStorage.getItem('quizSettings');
    if (savedSettings) {
        settings = { ...settings, ...JSON.parse(savedSettings) };
    }

    // Apply settings to UI
    const soundToggle = document.getElementById('sound-toggle');
    const timerToggle = document.getElementById('timer-toggle');
    const shuffleToggle = document.getElementById('shuffle-toggle');
    const keyboardToggle = document.getElementById('keyboard-toggle');
    const reattemptToggle = document.getElementById('reattempt-toggle');
    const groupedToggle = document.getElementById('grouped-toggle');
    const timerDuration = document.getElementById('timer-duration');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');

    if (soundToggle) soundToggle.checked = settings.soundEnabled;
    if (timerToggle) timerToggle.checked = settings.timerEnabled;
    if (shuffleToggle) shuffleToggle.checked = settings.shuffleEnabled;
    if (keyboardToggle) keyboardToggle.checked = settings.keyboardEnabled;
    if (reattemptToggle) reattemptToggle.checked = settings.reattemptEnabled;
    if (groupedToggle) groupedToggle.checked = settings.groupedQuizEnabled;
    if (timerDuration) timerDuration.value = settings.timerDuration;

    // Settings panel toggle
    if (settingsBtn && settingsPanel) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPanel.classList.toggle('visible');
        });

        document.addEventListener('click', (e) => {
            if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
                settingsPanel.classList.remove('visible');
            }
        });
    }

    // Setting change handlers
    if (soundToggle) {
        soundToggle.addEventListener('change', () => {
            settings.soundEnabled = soundToggle.checked;
            saveSettings();
        });
    }

    if (timerToggle) {
        timerToggle.addEventListener('change', () => {
            settings.timerEnabled = timerToggle.checked;
            saveSettings();
        });
    }

    if (shuffleToggle) {
        shuffleToggle.addEventListener('change', () => {
            settings.shuffleEnabled = shuffleToggle.checked;
            saveSettings();
        });
    }

    if (keyboardToggle) {
        keyboardToggle.addEventListener('change', () => {
            settings.keyboardEnabled = keyboardToggle.checked;
            saveSettings();
        });
    }

    if (reattemptToggle) {
        reattemptToggle.addEventListener('change', () => {
            settings.reattemptEnabled = reattemptToggle.checked;
            saveSettings();
        });
    }
    
    if (groupedToggle) {
        groupedToggle.addEventListener('change', () => {
            settings.groupedQuizEnabled = groupedToggle.checked;
            saveSettings();
        });
    }

    if (timerDuration) {
        timerDuration.addEventListener('change', () => {
            settings.timerDuration = parseInt(timerDuration.value);
            saveSettings();
        });
    }
}

function saveSettings() {
    localStorage.setItem('quizSettings', JSON.stringify(settings));
}

// --- Timer System ---
let timerInterval = null;
let timeRemaining = 0;

function startTimer() {
    if (!settings.timerEnabled) return;

    const timerContainer = document.getElementById('timer-container');
    const timerDisplay = document.getElementById('timer-display');
    if (!timerContainer || !timerDisplay) return;

    timeRemaining = settings.timerDuration;
    updateTimerDisplay();
    timerContainer.classList.add('visible');
    timerContainer.classList.remove('warning');

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 5) {
            timerContainer.classList.add('warning');
        }

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            // Auto-submit with wrong answer if time runs out
            if (selectedOptionIndex === null) {
                selectedOptionIndex = -1; // Invalid selection
            }
            checkAnswer();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    const timerContainer = document.getElementById('timer-container');
    if (timerContainer) {
        timerContainer.classList.remove('visible', 'warning');
    }
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// --- Keyboard Shortcuts ---
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (!settings.keyboardEnabled) return;

        // Only work in taker view
        if (takerView.classList.contains('hidden')) return;

        const key = e.key;

        // Number keys 1-6 for selecting options
        if (key >= '1' && key <= '6') {
            const optionIndex = parseInt(key) - 1;
            const tiles = optionsContainer.querySelectorAll('.option-tile');
            if (tiles[optionIndex] && !tiles[optionIndex].style.pointerEvents) {
                selectOption(optionIndex, tiles[optionIndex]);
            }
        }

        // Enter or Space to check answer
        if ((key === 'Enter' || key === ' ') && selectedOptionIndex !== null) {
            e.preventDefault();
            if (!checkAnswerBtn.style.display || checkAnswerBtn.style.display !== 'none') {
                checkAnswer();
            } else if (!nextQuestionBtn.classList.contains('hidden')) {
                nextQuestion();
            }
        }

        // Escape to close quiz
        if (key === 'Escape') {
            if (takerCloseBtn) takerCloseBtn.click();
        }
    });
}

// --- Shuffle Function ---
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// --- Auto-save Indicator ---
function showAutosaveIndicator() {
    const indicator = document.getElementById('autosave-indicator');
    if (!indicator) return;

    indicator.querySelector('span').textContent = 'Saving...';
    indicator.querySelector('i').className = 'fas fa-sync-alt';
    indicator.classList.remove('saved');
    indicator.classList.add('visible');

    setTimeout(() => {
        indicator.querySelector('span').textContent = 'Saved!';
        indicator.querySelector('i').className = 'fas fa-check';
        indicator.classList.add('saved');

        setTimeout(() => {
            indicator.classList.remove('visible');
        }, 1500);
    }, 500);
}

// --- View Transition Helper ---
function transitionToView(hideView, showView) {
    hideView.classList.add('view-exit');
    setTimeout(() => {
        hideView.classList.add('hidden');
        hideView.classList.remove('view-exit');
        showView.classList.remove('hidden');
        showView.classList.add('view-enter');
        setTimeout(() => {
            showView.classList.remove('view-enter');
        }, 500);
    }, 300);
}

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
let currentQuizFilePath = null;

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
const addDividerBtn = document.getElementById('add-divider-btn');
const saveQuizBtn = document.getElementById('save-quiz-btn');
const goToCreatorBtn = document.getElementById('go-to-creator-btn');
const goToTakerBtn = document.getElementById('go-to-taker-btn');
const editQuizBtn = document.getElementById('edit-quiz-btn');
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
if (addDividerBtn) addDividerBtn.addEventListener('click', addGroupDivider);
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

if (editQuizBtn) editQuizBtn.addEventListener('click', loadQuizForEditing);

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
        wrongQuestions = [];
        originalQuestions = null;
        isReattempting = false;
        firstAttemptScore = 0;
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
    showAutosaveIndicator();
}

function showCreatorView() {
    homeView.classList.add('hidden');
    creatorView.classList.remove('hidden');
    takerView.classList.add('hidden');
    renderCreatorQuestions();
}

// --- Creator Functions ---
let isShowingPrompt = false;
let addQuestionPrompt = null;
let promptAddBtn = null;
let promptFinishBtn = null;
let creatorFooterControls = null;

function initCreatorElements() {
    addQuestionPrompt = document.getElementById('add-question-prompt');
    promptAddBtn = document.getElementById('prompt-add-btn');
    promptFinishBtn = document.getElementById('prompt-finish-btn');
    creatorFooterControls = document.querySelector('.creator-footer-controls');
}

function addQuestion() {
    // If coming from prompt, hide it first
    if (isShowingPrompt) {
        hideAddQuestionPrompt();
    }

    currentQuiz.questions.push({
        type: 'question',
        text: '',
        options: ['', ''],
        correctAnswerIndex: 0,
        media: null
    });
    renderCreatorQuestions();
    saveDraft();

    // Focus on the new question's text input
    setTimeout(() => {
        const newQuestionInput = questionsContainer.querySelector('.question-block:last-child .question-text-input');
        if (newQuestionInput) {
            newQuestionInput.focus();
            newQuestionInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
}

function addGroupDivider() {
    // If coming from prompt, hide it first
    if (isShowingPrompt) {
        hideAddQuestionPrompt();
    }

    currentQuiz.questions.push({
        type: 'group-divider',
        label: 'New Group'
    });
    renderCreatorQuestions();
    saveDraft();
}

// Show the add question prompt with card scroll animation
function showAddQuestionPrompt() {
    if (currentQuiz.questions.length === 0) return;

    isShowingPrompt = true;

    // Scroll out all question cards
    const questionBlocks = questionsContainer.querySelectorAll('.question-block');
    questionBlocks.forEach((block, index) => {
        setTimeout(() => {
            block.classList.add('scroll-out');
            setTimeout(() => {
                block.classList.remove('scroll-out');
                block.classList.add('faded');
            }, 600);
        }, index * 100);
    });

    // Update and show the prompt
    setTimeout(() => {
        updatePromptContent();
        addQuestionPrompt.classList.remove('hidden');
        if (creatorFooterControls) creatorFooterControls.classList.add('hidden');
    }, questionBlocks.length * 100 + 300);
}

function hideAddQuestionPrompt() {
    isShowingPrompt = false;
    addQuestionPrompt.classList.add('hidden');
    if (creatorFooterControls) creatorFooterControls.classList.remove('hidden');

    // Restore all faded cards
    const fadedBlocks = questionsContainer.querySelectorAll('.question-block.faded');
    fadedBlocks.forEach((block, index) => {
        setTimeout(() => {
            block.classList.remove('faded');
            block.classList.add('scroll-in');
            setTimeout(() => {
                block.classList.remove('scroll-in');
            }, 600);
        }, index * 50);
    });
}

function updatePromptContent() {
    const countText = document.getElementById('question-count-text');
    const miniCardsContainer = document.getElementById('mini-cards-container');

    if (countText) {
        const count = currentQuiz.questions.length;
        countText.textContent = `${count} Question${count !== 1 ? 's' : ''}`;
    }

    if (miniCardsContainer) {
        miniCardsContainer.innerHTML = '';
        // Show mini cards for each question (max 10)
        const questionsToShow = Math.min(currentQuiz.questions.length, 10);
        for (let i = 0; i < questionsToShow; i++) {
            const miniCard = document.createElement('div');
            miniCard.className = 'mini-question-card';
            miniCard.textContent = `Q${i + 1}`;
            miniCardsContainer.appendChild(miniCard);
        }
        if (currentQuiz.questions.length > 10) {
            const moreCard = document.createElement('div');
            moreCard.className = 'mini-question-card';
            moreCard.textContent = `+${currentQuiz.questions.length - 10}`;
            miniCardsContainer.appendChild(moreCard);
        }
    }
}

// Setup prompt button listeners
if (promptAddBtn) {
    promptAddBtn.addEventListener('click', () => {
        addQuestion();
    });
}

if (promptFinishBtn) {
    promptFinishBtn.addEventListener('click', () => {
        hideAddQuestionPrompt();
        // Trigger save quiz flow
        saveQuiz();
    });
}

// Check if question is complete and show prompt
function checkQuestionComplete(qIndex) {
    const question = currentQuiz.questions[qIndex];
    if (!question) return false;

    const hasText = question.text.trim().length > 0;
    const hasOptions = question.options.filter(opt => opt.trim().length > 0).length >= 2;

    return hasText && hasOptions;
}

// Watch for question completion
function onQuestionFieldChange(qIndex) {
    saveDraft();

    // If this is the last question and it's complete, show the prompt indicator
    if (qIndex === currentQuiz.questions.length - 1 && checkQuestionComplete(qIndex) && !isShowingPrompt) {
        // Add a subtle indicator that they can proceed
        const lastBlock = questionsContainer.querySelector('.question-block:last-child');
        if (lastBlock && !lastBlock.querySelector('.ready-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'ready-indicator';
            indicator.innerHTML = '<i class="fas fa-check-circle"></i> Question ready!';
            indicator.style.cssText = `
                position: absolute;
                bottom: 10px;
                right: 10px;
                background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 0.85em;
                font-weight: 600;
                animation: fadeInUp 0.3s ease-out;
                cursor: pointer;
            `;
            indicator.addEventListener('click', showAddQuestionPrompt);
            lastBlock.appendChild(indicator);

            // AUTO-TRANSITION DISABLED:
            // We removed the setTimeout that was automatically calling showAddQuestionPrompt()
            // This prevents the UI from disappearing while users are still working on their options.
            // Users can now manually click the indicator when they are truly ready.
        }
    }
}

function renderCreatorQuestions() {
    // Hide prompt if showing
    if (isShowingPrompt) {
        isShowingPrompt = false;
        if (addQuestionPrompt) addQuestionPrompt.classList.add('hidden');
        if (creatorFooterControls) creatorFooterControls.classList.remove('hidden');
    }

    questionsContainer.innerHTML = '';
    currentQuiz.questions.forEach((q, index) => {
        if (q.type === 'group-divider') {
            const dividerBlock = document.createElement('div');
            dividerBlock.className = 'group-divider-block';
            dividerBlock.dataset.id = index;
            dividerBlock.innerHTML = `
                <h4>
                    <i class="fas fa-grip-vertical drag-handle"></i>
                    <i class="fas fa-layer-group"></i>
                    <input type="text" class="group-divider-input" value="${q.label || ''}" placeholder="Group Name" oninput="updateDividerLabel(${index}, this.value)">
                </h4>
                <button onclick="deleteQuestion(${index})" class="btn-danger-small"><i class="fas fa-trash-alt"></i></button>
            `;
            questionsContainer.appendChild(dividerBlock);
            return;
        }

        const questionBlock = document.createElement('div');
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
        onQuestionFieldChange(index);
    }
}

function updateDividerLabel(index, label) {
    if (index >= 0 && index < currentQuiz.questions.length) {
        currentQuiz.questions[index].label = label;
        saveDraft();
    }
}

function updateOptionText(qIndex, oIndex, text) {
    if (qIndex >= 0 && qIndex < currentQuiz.questions.length) {
        const question = currentQuiz.questions[qIndex];
        if (oIndex >= 0 && oIndex < question.options.length) {
            question.options[oIndex] = text;
            onQuestionFieldChange(qIndex);
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
    try {
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
            
            // Skip validation for group dividers
            if (q.type === 'group-divider') {
                if (!q.label || !q.label.trim()) {
                    showNotification(`Group divider ${i+1} needs a label`, 'error');
                    return;
                }
                continue;
            }

            if (!q.text || !q.text.trim()) {
                showNotification(`Question ${i+1} text is required`, 'error');
                return;
            }
            if (!q.options || q.options.length < 2) {
                showNotification(`Question ${i+1} needs at least 2 options`, 'error');
                return;
            }
        }

        // Proceed with saving
        const jsonString = JSON.stringify(currentQuiz, null, 2);
        let result;

        if (currentQuizFilePath) {
            // Update existing quiz
            result = await window.electronAPI.updateQuiz(jsonString, currentQuizFilePath);
        } else {
            // Save new quiz
            result = await window.electronAPI.saveQuiz(jsonString);
            if (result.success) {
                currentQuizFilePath = result.path; // Store new path for subsequent saves
            }
        }
        
        if (result.success) {
            showNotification(`Quiz saved successfully!`, 'success');
            localStorage.removeItem('quizDraft');
        } else {
            showNotification(`Failed to save quiz: ${result.error || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Save error:', error);
        showNotification(`Unexpected error: ${error.message}`, 'error');
    }
}

// --- Taker View State ---
let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;
let wrongQuestions = [];
let originalQuestions = null;
let isReattempting = false;
let firstAttemptScore = 0;
let needsReattempt = false;

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
    const converter = new showdown.Converter();
    feedbackContainer.classList.add('hidden');
    feedbackContainer.classList.remove('correct-feedback', 'incorrect-feedback');
    feedbackMessage.textContent = '';
    nextQuestionBtn.classList.add('hidden');
    checkAnswerBtn.disabled = true;
    checkAnswerBtn.style.display = '';
    selectedOptionIndex = null;

    // Reset state on new quiz run
    if (currentQuestionIndex === 0 && !isReattempting) {
        streak = 0;
        wrongQuestions = [];
        originalQuestions = null;
        firstAttemptScore = 0;
        needsReattempt = false;
        if (streakContainer) streakContainer.classList.remove('visible');
    }

    if (postQuizActions) postQuizActions.classList.add('hidden');
    if (scoreResult) scoreResult.textContent = '';

    if (currentQuestionIndex >= currentQuiz.questions.length) {
        showQuizResult();
        return;
    }

    const question = currentQuiz.questions[currentQuestionIndex];
    if (question && question.type === 'group-divider') {
        // Show group splash/notification and move to next question
        showNotification(`Starting: ${question.label || 'Next Group'}`, 'info');
        currentQuestionIndex++;
        renderTakerQuiz();
        return;
    }

    quizTitle.textContent = currentQuiz.title || 'Quiz';
    questionText.innerHTML = converter.makeHtml(question.text);

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

    const questionCount = currentQuiz.questions.filter(q => q.type !== 'group-divider').length;
    const currentQuestionPos = currentQuiz.questions.slice(0, currentQuestionIndex).filter(q => q.type !== 'group-divider').length;
    
    const progress = questionCount > 0 ?
        (currentQuestionPos / questionCount) * 100 : 0;
    progressBar.style.width = progress + '%';

    optionsContainer.innerHTML = '';
    question.options.forEach((option, idx) => {
        const tile = document.createElement('div');
        tile.className = 'option-tile';
        tile.tabIndex = 0; // Make focusable for accessibility

        // Add keyboard hint if enabled
        if (settings.keyboardEnabled && idx < 6) {
            const hint = document.createElement('span');
            hint.className = 'keyboard-hint';
            hint.textContent = (idx + 1).toString();
            tile.appendChild(hint);
        }

        const content = document.createElement('span');
        content.innerHTML = converter.makeHtml(option);
        tile.appendChild(content);

        tile.addEventListener('click', () => selectOption(idx, tile));
        optionsContainer.appendChild(tile);
    });

    // Start timer if enabled
    startTimer();
}

function selectOption(idx, tile) {
    selectedOptionIndex = idx;
    Array.from(optionsContainer.children).forEach(child => {
        child.classList.remove('selected');
    });
    tile.classList.add('selected');
    checkAnswerBtn.disabled = false;
}

function playSound(sound) {
    if (!settings.soundEnabled) return;
    const audio = new Audio(`./assets/${sound}.mp3`);
    audio.play().catch(() => {}); // Ignore errors if sound fails to play
}

function checkAnswer() {
    if (selectedOptionIndex === null) return;

    // Stop the timer
    stopTimer();

    const question = currentQuiz.questions[currentQuestionIndex];
    const correctIdx = question.correctAnswerIndex;
    const correct = selectedOptionIndex === correctIdx && selectedOptionIndex !== -1;
    if (correct) score++;

    // Update streak
    updateStreak(correct);
    if (!correct) {
        wrongQuestions.push(question);
    }

    Array.from(optionsContainer.children).forEach((tile, i) => {
        tile.classList.remove('selected');
        if (i === correctIdx) {
            tile.classList.add('correct');
            tile.classList.add('bounce');
        }
        if (i === selectedOptionIndex && !correct) {
            tile.classList.add('incorrect');
            tile.classList.add('shake');
        }
        tile.style.pointerEvents = 'none';
    });

    feedbackContainer.classList.remove('hidden');
    if (correct) {
        feedbackContainer.classList.add('correct-feedback');
        const messages = ['Correct!', 'Awesome!', 'Nailed it!', 'Perfect!', 'Brilliant!'];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        feedbackMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${randomMsg}`;
        playSound('correct');
    } else {
        feedbackContainer.classList.add('incorrect-feedback');
        const messages = ['Incorrect!', 'Oops!', 'Not quite!', 'Try again next time!'];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        feedbackMessage.innerHTML = `<i class="fas fa-times-circle"></i> ${randomMsg}`;
        playSound('wrong');
        // Shake the view container
        const viewContainer = document.querySelector('.view-container');
        if (viewContainer) {
            viewContainer.classList.add('shake');
            setTimeout(() => viewContainer.classList.remove('shake'), 600);
        }
    }
    checkAnswerBtn.style.display = 'none';
    
    if (settings.groupedQuizEnabled && !correct) {
        nextQuestionBtn.innerHTML = '<i class="fas fa-redo"></i> Try Again';
        needsReattempt = true;
    } else {
        nextQuestionBtn.innerHTML = 'Continue';
        needsReattempt = false;
    }
    
    nextQuestionBtn.classList.remove('hidden');
}

function nextQuestion() {
    if (needsReattempt) {
        renderTakerQuiz();
        return;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuiz.questions.length) {
        renderTakerQuiz();
    } else {
        showQuizResult();
    }
}

function showQuizResult() {
    // Stop timer
    stopTimer();

    // Capture first attempt score
    if (!isReattempting) {
        firstAttemptScore = score;
    }

    // Check for mandatory reattempt of wrong questions
    if (settings.reattemptEnabled && wrongQuestions.length > 0) {
        if (!isReattempting) {
            originalQuestions = [...currentQuiz.questions];
            isReattempting = true;
        }

        showNotification(`${wrongQuestions.length} mistake(s) made! Reattempting wrong questions...`, 'error');
        
        setTimeout(() => {
            currentQuiz.questions = [...wrongQuestions];
            wrongQuestions = [];
            currentQuestionIndex = 0;
            score = 0;
            renderTakerQuiz();
        }, 2000);
        return;
    }

    // Final completion
    if (isReattempting && originalQuestions) {
        currentQuiz.questions = [...originalQuestions];
        score = firstAttemptScore; // Use the score from the very first attempt
        isReattempting = false;
        originalQuestions = null;
    }

    progressBar.style.width = '100%';
    optionsContainer.innerHTML = '';
    questionText.textContent = '';
    checkAnswerBtn.style.display = 'none';
    feedbackContainer.classList.remove('hidden', 'correct-feedback', 'incorrect-feedback');

    const percentage = Math.round((score / currentQuiz.questions.length) * 100);
    let emoji, message;

    if (percentage === 100) {
        emoji = '🏆';
        message = 'PERFECT SCORE!';
        launchConfetti();
    } else if (percentage >= 80) {
        emoji = '🌟';
        message = 'Excellent!';
        launchConfetti();
    } else if (percentage >= 60) {
        emoji = '👏';
        message = 'Good Job!';
    } else if (percentage >= 40) {
        emoji = '💪';
        message = 'Keep Practicing!';
    } else {
        emoji = '📚';
        message = 'Study More!';
    }

    feedbackMessage.innerHTML = `${emoji} ${message}<br><span style="font-size: 0.6em; margin-top: 10px; display: block;">Score: ${score} / ${currentQuiz.questions.length} (${percentage}%)</span>`;
    nextQuestionBtn.classList.add('hidden');
    if (scoreResult) scoreResult.textContent = `${emoji} ${score} / ${currentQuiz.questions.length}`;
    if (postQuizActions) postQuizActions.classList.remove('hidden');

    // Hide streak container
    if (streakContainer) streakContainer.classList.remove('visible');
    streak = 0;
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
                if (q.type === 'group-divider') {
                    currentQuiz.questions.push({
                        type: 'group-divider',
                        label: q.label || 'Next Group'
                    });
                    continue;
                }

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
                    type: 'question',
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

            // Shuffle questions if enabled
            if (settings.shuffleEnabled) {
                currentQuiz.questions = shuffleArray(currentQuiz.questions);
            }

            // Proceed to show quiz with transition
            transitionToView(homeView, takerView);
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

async function loadQuizForEditing() {
    try {
        const result = await window.electronAPI.loadQuiz();
        if (result.success) {
            const loadedQuiz = JSON.parse(result.data);

            // Basic validation
            if (!loadedQuiz.title || !Array.isArray(loadedQuiz.questions)) {
                throw new Error("Invalid quiz file format.");
            }

            currentQuiz = loadedQuiz;
            currentQuizFilePath = result.path; // Store the file path
            quizTitleInput.value = currentQuiz.title;

            // Switch to creator view
            homeView.classList.add('hidden');
            takerView.classList.add('hidden');
            creatorView.classList.remove('hidden');

            // Render the questions for editing
            renderCreatorQuestions();
        } else {
            showNotification('Load cancelled.', 'info');
        }
    } catch (error) {
        console.error('Failed to load quiz for editing:', error);
        showNotification(`Error: ${error.message}`, 'error');
    }
}

// --- Utility Functions ---
function resetQuiz() {
    currentQuiz = {
        title: '',
        questions: [],
    };
    currentQuizFilePath = null; // Reset the file path
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

// --- Theme Management ---
const themeCheckbox = document.getElementById('theme-checkbox');

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeCheckbox) themeCheckbox.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        if (themeCheckbox) themeCheckbox.checked = false;
    }
}

if (themeCheckbox) {
    themeCheckbox.addEventListener('change', () => {
        const newTheme = themeCheckbox.checked ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}

// On initial load, apply the saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);