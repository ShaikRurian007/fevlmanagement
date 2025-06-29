#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "Build failed - dist directory not found"
    exit 1
fi

# Create temporary deployment directory
echo "Preparing deployment..."
rm -rf /tmp/deploy
cp -r dist /tmp/deploy

# Navigate to temporary directory
cd /tmp/deploy

# Initialize git if not already done
git init
git add .
git commit -m "Deploy React app to GitHub Pages"

# Add remote and force push to gh-pages branch
git remote add origin https://github.com/ShaikRurian007/fevlmanagement.git
git push -f origin HEAD:gh-pages

# Clean up
cd - > /dev/null
rm -rf /tmp/deploy

echo "Deployment complete!"
echo "Your site will be available at: https://shaikrurian007.github.io/fevlmanagement/"
