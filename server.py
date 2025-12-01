#!/usr/bin/env python3
"""
Simple HTTP server for Bland Demo job application form.
Run this script to serve the application locally.
"""

import http.server
import socketserver
import webbrowser
import os
import json
import urllib.request
import urllib.parse
from pathlib import Path

# Configuration
PORT = 3000
DIRECTORY = Path(__file__).parent
BLAND_AI_API_URL = 'https://api.bland.ai/v1/calls'

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.end_headers()
    
    def do_POST(self):
        """Handle POST requests, including Bland AI proxy"""
        if self.path == '/api/bland-ai/call':
            self.handle_bland_ai_call()
        else:
            # Default file serving for other POST requests
            super().do_POST()
    
    def handle_bland_ai_call(self):
        """Proxy Bland AI API calls to avoid CORS issues"""
        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            # Extract API key and call data
            api_key = request_data.get('api_key')
            call_data = request_data.get('data', {})
            
            if not api_key:
                self.send_error_response(400, 'API key is required')
                return
            
            # Prepare request to Bland AI
            json_data = json.dumps(call_data).encode('utf-8')
            req = urllib.request.Request(
                BLAND_AI_API_URL,
                data=json_data,
                headers={
                    'Authorization': api_key,
                    'Content-Type': 'application/json'
                },
                method='POST'
            )
            
            # Make request to Bland AI
            try:
                with urllib.request.urlopen(req, timeout=30) as response:
                    response_data = response.read().decode('utf-8')
                    response_json = json.loads(response_data)
                    
                    # Send success response
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps(response_json).encode('utf-8'))
            except urllib.error.HTTPError as e:
                # Handle HTTP errors from Bland AI
                error_body = e.read().decode('utf-8')
                try:
                    error_json = json.loads(error_body)
                except:
                    error_json = {'error': error_body, 'status': 'error'}
                
                self.send_response(e.code)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(error_json).encode('utf-8'))
            except urllib.error.URLError as e:
                # Handle network errors
                self.send_error_response(500, f'Network error: {str(e)}')
            except Exception as e:
                # Handle other errors
                self.send_error_response(500, f'Server error: {str(e)}')
                
        except json.JSONDecodeError:
            self.send_error_response(400, 'Invalid JSON in request body')
        except Exception as e:
            self.send_error_response(500, f'Unexpected error: {str(e)}')
    
    def send_error_response(self, status_code, message):
        """Send an error response"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        error_response = {
            'status': 'error',
            'error': message
        }
        self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

def main():
    # Change to the script's directory
    os.chdir(DIRECTORY)
    
    # Create server
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🚀 Server starting on http://localhost:{PORT}")
        print(f"📁 Serving files from: {DIRECTORY}")
        print(f"🌐 Opening browser automatically...")
        print(f"⏹️  Press Ctrl+C to stop the server")
        print("-" * 50)
        
        # Open browser automatically
        webbrowser.open(f'http://localhost:{PORT}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n🛑 Server stopped by user")
            httpd.shutdown()

if __name__ == "__main__":
    main()
