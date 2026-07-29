/**
 * @file upload.routes.js
 * @description API router handling project upload and stack auto-detection POST /api/upload.
 */

const express = require('express');
const { createProject, saveSession } = require('../db/queries');

const router = express.Router();

router.post('/', async (req, res) => {
  const { files } = req.body;

  if (!files || typeof files !== 'object' || Object.keys(files).length === 0) {
    return res.status(400).json({ success: false, error: 'No files provided for upload' });
  }

  try {
    const fileKeys = Object.keys(files);
    
    // Auto-detect stack
    const isReact = fileKeys.some((f) => 
      f.includes('App.js') || 
      f.includes('App.jsx') || 
      f.includes('tailwind.config.js')
    );
    
    const stack = isReact ? 'react-tailwind' : 'vanilla';
    const projectId = `proj-${Date.now()}`;
    const name = files['index.html'] ? 'Uploaded Vanilla App' : 'Uploaded React App';

    // 1. Create project in SQLite
    createProject({ id: projectId, name, stack });

    const explanationText = `Successfully imported project with ${fileKeys.length} files. Auto-detected stack: **${stack === 'vanilla' ? 'Vanilla HTML/CSS/JS' : 'React + Tailwind'}**.`;
    
    const dbState = JSON.stringify({
      messages: [
        {
          id: `assistant-import`,
          role: 'assistant',
          stack,
          content: explanationText,
          timestamp: new Date().toLocaleTimeString(),
        }
      ],
      files: files
    });

    // 2. Save session state in SQLite
    saveSession({
      id: projectId,
      projectId,
      state: dbState
    });

    res.json({
      success: true,
      data: {
        projectId,
        stack,
        files,
        message: explanationText
      }
    });
  } catch (error) {
    console.error('[Upload Route] Error:', error);
    res.status(500).json({ success: false, error: `Upload processing failed: ${error.message}` });
  }
});

module.exports = router;
