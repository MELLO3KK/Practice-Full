# Quiz Master

A modern, feature-rich desktop quiz application built with Electron. Create custom quizzes with rich media support, or challenge yourself and others by taking quizzes with an engaging, gamified experience.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Electron](https://img.shields.io/badge/Electron-31.1.0-47848F?logo=electron)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript)

## 📖 Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Settings & Configuration](#settings--configuration)
- [Project Structure](#project-structure)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## ✨ Features

### For Quiz Creators
- **Intuitive Quiz Builder** – Easily create questions with multiple-choice options
- **Rich Media Support** – Add images and audio to your questions
- **Group Dividers** – Organize questions into sections for better structure
- **Auto-Save Drafts** – Never lose your work with automatic local storage saving
- **Save & Load Quizzes** – Export quizzes as JSON files and load them later
- **Edit Existing Quizzes** – Modify previously created quizzes

### For Quiz Takers
- **Engaging UI** – Beautiful gradient design with particle effects and animations
- **Streak Counter** – Build and maintain answer streaks for bonus points 🔥
- **Timer Mode** – Challenge yourself with configurable time limits per question
- **Confetti Celebration** – Visual rewards for correct answers
- **Progress Tracking** – See your progress bar as you advance through questions
- **Score Results** – View final scores with option to restart
- **Reattempt Mode** – Retry questions you got wrong (optional)
- **Dark/Light Theme** – Toggle between themes for comfortable viewing

### Advanced Features
- **Keyboard Navigation** – Full keyboard support for quick answering
- **Shuffle Questions** – Randomize question order for variety
- **Grouped Quiz Mode** – Answer questions in grouped sections
- **Ripple Effects** – Satisfying button press animations
- **Responsive Design** – Adapts to different window sizes

---

## 📸 Screenshots

| Home Screen | Quiz Creator | Quiz Taker |
|-------------|--------------|------------|
| Create or take quizzes | Build questions with media | Answer with visual feedback |

*(Add your screenshots to the `assets/` folder and update the paths above)*

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Electron 31.1.0 |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Icons** | Font Awesome 6.4.0 |
| **Fonts** | Poppins (Google Fonts) |
| **Libraries** | Showdown (Markdown), Sortable.js |
| **Audio** | Custom sound effects (MP3) |
| **Package Manager** | npm |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher recommended) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

Verify your installation:
```bash
node --version
npm --version
```

---

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd electron-quiz-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```

The application will launch in a new Electron window with remote debugging enabled on port 9222.

---

## 💡 Usage

### Creating a Quiz

1. Click **"Create a New Quiz"** from the home screen
2. Enter a title for your quiz
3. Click **"Add Question"** to create your first question
4. Fill in:
   - The question text (supports Markdown formatting)
   - Multiple choice options (up to 6)
   - Select the correct answer
   - Optionally add media (images/audio)
5. Use **"Add Group Divider"** to organize questions into sections
6. Click **"Save Quiz"** to export as a JSON file

### Taking a Quiz

1. Click **"Take a Quiz"** from the home screen
2. Select a quiz JSON file from your computer
3. Answer questions by:
   - Clicking on option tiles, or
   - Using keyboard number keys (1-6)
4. Click **"Check"** to submit your answer
5. View feedback and continue to the next question
6. See your final score at the end!

### Editing a Quiz

1. Click **"Edit a Quiz"** from the home screen
2. Load an existing quiz JSON file
3. Make your modifications
4. Save the updated quiz

---

## ⚙️ Settings & Configuration

Access the settings panel by clicking the gear icon (⚙️) in the top-right corner.

| Setting | Description | Default |
|---------|-------------|---------|
| **Sound Effects** | Enable/disable audio feedback | ✅ On |
| **Timer Mode** | Enable countdown timer per question | ❌ Off |
| **Shuffle Questions** | Randomize question order | ❌ Off |
| **Keyboard Shortcuts** | Enable keyboard navigation | ✅ On |
| **Reattempt on Mistakes** | Allow retrying wrong answers | ❌ Off |
| **Grouped Quiz Mode** | Enable section-based quizzing | ❌ Off |
| **Time per Question** | Timer duration (15-90 seconds) | 30s |

### Environment Variables

No environment variables are required for this application. All settings are stored locally in the browser's `localStorage`.

---

## 📁 Project Structure

```
electron-quiz-app/
├── assets/                 # Audio files and media resources
│   ├── correct.mp3        # Sound effect for correct answers
│   └── wrong.mp3          # Sound effect for incorrect answers
├── index.html             # Main HTML structure
├── main.js                # Electron main process (file I/O, dialogs)
├── preload.js             # Secure bridge between main and renderer
├── renderer.js            # Frontend logic and UI interactions
├── style.css              # Application styles and animations
├── package.json           # Project metadata and dependencies
├── package-lock.json      # Dependency lock file
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

---

## ⌨️ Keyboard Shortcuts

When taking a quiz with keyboard shortcuts enabled:

| Key | Action |
|-----|--------|
| `1-6` | Select option 1-6 |
| `Enter` / `Space` | Check answer or proceed to next question |
| `Escape` | Close quiz and return home |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Comment complex logic
- Test features thoroughly before submitting
- Keep commits focused and descriptive

---

## 📄 License

This project is licensed under the **MIT License** - see below for details:

```
MIT License

Copyright (c) 2024 Quiz Master

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📬 Contact

Have questions, suggestions, or found a bug?

- **Open an Issue** - Report bugs or request features on GitHub
- **Discussions** - Share your quizzes and ideas with the community

---

<p align="center">Made with ❤️ using Electron</p>
