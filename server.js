#!/usr/bin/env node
/**
 * Node.js server for Bland Demo job application form.
 * Handles static file serving and Bland AI API proxy to avoid CORS issues.
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const BLAND_AI_API_URL = 'https://api.bland.ai/v1/calls';

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS (CORS preflight)
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Handle Bland AI proxy endpoint
    if (req.method === 'POST' && req.url === '/api/bland-ai/call') {
        handleBlandAICall(req, res);
        return;
    }

    // Handle static files
    serveStaticFile(req, res);
});

function handleBlandAICall(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const requestData = JSON.parse(body);
            const apiKey = requestData.api_key;
            const callData = requestData.data;

            if (!apiKey) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', error: 'API key is required' }));
                return;
            }

            // Prepare request to Bland AI
            const postData = JSON.stringify(callData);
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': apiKey,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            // Make request to Bland AI
            const blandReq = https.request(BLAND_AI_API_URL, options, (blandRes) => {
                let responseData = '';

                blandRes.on('data', (chunk) => {
                    responseData += chunk.toString();
                });

                blandRes.on('end', () => {
                    res.writeHead(blandRes.statusCode, { 'Content-Type': 'application/json' });
                    res.end(responseData);
                });
            });

            blandReq.on('error', (error) => {
                console.error('Error calling Bland AI:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    status: 'error', 
                    error: `Network error: ${error.message}` 
                }));
            });

            blandReq.write(postData);
            blandReq.end();

        } catch (error) {
            console.error('Error parsing request:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                status: 'error', 
                error: `Invalid JSON: ${error.message}` 
            }));
        }
    });

    req.on('error', (error) => {
        console.error('Request error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'error', 
            error: `Server error: ${error.message}` 
        }));
    });
}

function serveStaticFile(req, res) {
    // Parse URL
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;

    // Default to index.html
    if (pathname === '/') {
        pathname = '/index.html';
    }

    // Get file path
    const filePath = path.join(__dirname, pathname);

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        // Read and serve file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                return;
            }

            // Get MIME type
            const ext = path.extname(filePath).toLowerCase();
            const contentType = mimeTypes[ext] || 'application/octet-stream';

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
}

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🌐 Open http://localhost:${PORT} in your browser`);
    console.log(`⏹️  Press Ctrl+C to stop the server`);
    console.log('-'.repeat(50));
});

