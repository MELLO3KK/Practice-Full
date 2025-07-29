const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Function to create the main application window
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    win.loadFile('index.html');
};

// Create the window when the app is ready
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// --- IPC Handlers for File Operations ---

// Handle request to save a quiz
ipcMain.handle('save-quiz', async (event, quizData) => {
    const { filePath } = await dialog.showSaveDialog({
        title: 'Save Quiz',
        defaultPath: 'my-quiz.json',
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
    });

    if (filePath) {
        fs.writeFileSync(filePath, quizData);
        return { success: true, path: filePath };
    }
    return { success: false };
});

// Handle request to load a quiz
ipcMain.handle('load-quiz', async () => {
    const { filePaths } = await dialog.showOpenDialog({
        title: 'Load Quiz',
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
        properties: ['openFile'],
    });

    if (filePaths && filePaths.length > 0) {
        const filePath = filePaths[0];
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return { success: true, data: fileContent };
    }
    return { success: false };
});
