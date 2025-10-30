#!/bin/bash

# =============================================================================
# PDF Worker Setup Script
# =============================================================================
# This script copies the correct PDF.js worker file from react-pdf's bundled
# pdfjs-dist to the public folder, ensuring version compatibility.
#
# Why needed:
# - react-pdf@10.2.0 uses pdfjs-dist@5.4.296
# - Worker file must match this exact version
# - CDNs are unreliable (404 errors, network issues)
# - Local worker = faster, more secure, offline capable
#
# Run this after: npm install or when react-pdf updates
# =============================================================================

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║  📄 Setting up PDF.js Worker for Field Editor                       ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if react-pdf is installed
if [ ! -d "node_modules/react-pdf" ]; then
    echo "❌ Error: react-pdf not found in node_modules"
    echo "   Run: npm install"
    exit 1
fi

# Find the worker file
WORKER_SOURCE="node_modules/react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs"

if [ ! -f "$WORKER_SOURCE" ]; then
    echo "❌ Error: Worker file not found at $WORKER_SOURCE"
    echo "   React-pdf structure might have changed"
    exit 1
fi

# Copy to public folder
echo "📋 Copying worker file..."
echo "   Source: $WORKER_SOURCE"
echo "   Destination: public/pdf.worker.min.mjs"

cp "$WORKER_SOURCE" public/pdf.worker.min.mjs

if [ $? -eq 0 ]; then
    FILE_SIZE=$(ls -lh public/pdf.worker.min.mjs | awk '{print $5}')
    echo ""
    echo "✅ Success! Worker file copied"
    echo "   Size: $FILE_SIZE"
    echo "   Version: $(node -p "require('react-pdf/package.json').dependencies['pdfjs-dist']")"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "✅ PDF Worker Setup Complete!"
    echo ""
    echo "Next steps:"
    echo "1. Restart frontend (if running)"
    echo "2. Hard refresh browser (Cmd+Shift+R)"
    echo "3. Test field editor"
    echo ""
    echo "Worker will load from: http://localhost:3000/pdf.worker.min.mjs"
    echo ""
else
    echo "❌ Error: Failed to copy worker file"
    exit 1
fi

