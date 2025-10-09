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
ipcMain.handle('save-quiz', async (event, { quizData: quizDataString, filePath: existingFilePath }) => {
    let targetPath = existingFilePath;

    if (!targetPath) {
        const { filePath } = await dialog.showSaveDialog({
            title: 'Save Quiz',
            defaultPath: 'my-quiz.json',
            filters: [{ name: 'JSON Files', extensions: ['json'] }],
        });
        targetPath = filePath;
    }

    if (targetPath) {
        try {
            const quizData = JSON.parse(quizDataString);
            // Clean up originalPath before saving
            delete quizData.originalPath;

            const mediaDirName = `${path.basename(targetPath, '.json')}_media`;
            const mediaDirPath = path.join(path.dirname(targetPath), mediaDirName);

            if (quizData.questions.some(q => q.media && q.media.url)) {
                if (!fs.existsSync(mediaDirPath)) {
                    fs.mkdirSync(mediaDirPath, { recursive: true });
                }
            }

            for (const question of quizData.questions) {
                if (question.media && question.media.url && question.media.url.startsWith('data:')) {
                    const dataUrl = question.media.url;
                    const matches = dataUrl.match(/^data:(.+);base64,(.*)$/);
                    if (matches && matches.length === 3) {
                        const fileContents = Buffer.from(matches[2], 'base64');
                        const mediaFileName = `${Date.now()}-${question.media.name}`;
                        const mediaFilePath = path.join(mediaDirPath, mediaFileName);
                        
                        fs.writeFileSync(mediaFilePath, fileContents);

                        question.media.url = `./${mediaDirName}/${mediaFileName}`;
                    }
                }
            }

            fs.writeFileSync(targetPath, JSON.stringify(quizData, null, 2));
            return { success: true, path: targetPath };
        } catch (error) {
            console.error('Failed to save quiz:', error);
            return { success: false, error: error.message };
        }
    }
    return { success: false, error: 'Save cancelled by user.' };
});

// Handle request to load a quiz for taking
ipcMain.handle('load-quiz', async () => {
    const { filePaths } = await dialog.showOpenDialog({
        title: 'Load Quiz',
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
        properties: ['openFile'],
    });

    if (filePaths && filePaths.length > 0) {
        const filePath = filePaths[0];
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const quizData = JSON.parse(fileContent);
            const quizDir = path.dirname(filePath);

            // Process media files to convert paths to data URLs
            for (const question of quizData.questions) {
                if (question.media && question.media.url && !question.media.url.startsWith('data:')) {
                    const mediaPath = path.resolve(quizDir, question.media.url);
                    if (fs.existsSync(mediaPath)) {
                        const mediaContent = fs.readFileSync(mediaPath);
                        const mimeType = require('mime-types').lookup(mediaPath) || 'application/octet-stream';
                        question.media.url = `data:${mimeType};base64,${mediaContent.toString('base64')}`;
                    } else {
                        console.warn(`Media file not found: ${mediaPath}`);
                        // Optionally, nullify the media object if the file is missing
                        question.media = null; 
                    }
                }
            }
            return { success: true, data: JSON.stringify(quizData) };
        } catch (error) {
            console.error('Failed to load or process quiz:', error);
            return { success: false, error: error.message };
        }
    }
    return { success: false };
});

// Handle request to load a quiz for editing
ipcMain.handle('load-quiz-for-edit', async () => {
    const { filePaths } = await dialog.showOpenDialog({
        title: 'Load Quiz for Editing',
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
        properties: ['openFile'],
    });

    if (filePaths && filePaths.length > 0) {
        const filePath = filePaths[0];
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const quizData = JSON.parse(fileContent);
            const quizDir = path.dirname(filePath);

            for (const question of quizData.questions) {
                if (question.media && question.media.url && !question.media.url.startsWith('data:')) {
                    const mediaPath = path.resolve(quizDir, question.media.url);
                    if (fs.existsSync(mediaPath)) {
                        const mediaContent = fs.readFileSync(mediaPath);
                        const mimeType = require('mime-types').lookup(mediaPath) || 'application/octet-stream';
                        question.media.url = `data:${mimeType};base64,${mediaContent.toString('base64')}`;
                    } else {
                        console.warn(`Media file not found, removing from question: ${mediaPath}`);
                        question.media = null; 
                    }
                }
            }
            return { success: true, data: JSON.stringify(quizData), path: filePath };
        } catch (error) {
            console.error('Failed to load or process quiz for editing:', error);
            return { success: false, error: error.message };
        }
    }
    return { success: false };
});
