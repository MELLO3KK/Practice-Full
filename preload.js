const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    saveQuiz: (quizData) => ipcRenderer.invoke('save-quiz', quizData),
    loadQuiz: () => ipcRenderer.invoke('load-quiz'),
    updateQuiz: (quizData, filePath) => ipcRenderer.invoke('update-quiz', { quizDataString: quizData, filePath }),
});
