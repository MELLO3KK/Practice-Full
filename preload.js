const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    saveQuiz: (options) => ipcRenderer.invoke('save-quiz', options),
    loadQuiz: () => ipcRenderer.invoke('load-quiz'),
    loadQuizForEdit: () => ipcRenderer.invoke('load-quiz-for-edit')
});
