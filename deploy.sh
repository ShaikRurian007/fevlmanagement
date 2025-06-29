#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "Build failed - dist directory not found"
    exit 1
fi

# Navigate to dist directory
cd dist

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    git remote add origin https://github.com/ShaikRurian007/fevlmanagement.git
fi

# Add all files in dist
git add .
git commit -m "Deploy React app to GitHub Pages"

# Force push to gh-pages branch
git push -f origin HEAD:gh-pages

echo "Deployment complete!"
