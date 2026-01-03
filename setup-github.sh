#!/bin/bash

# GitHub Repository Setup Script
# Run this after creating your GitHub repository

echo "🚀 Setting up GitHub repository for collaboration..."

# Check if remote origin already exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "❌ Remote 'origin' already exists. Please remove it first if you want to change the repository."
    echo "Current remote: $(git remote get-url origin)"
    exit 1
fi

# Prompt for GitHub repository URL
echo "📝 Please provide your GitHub repository URL:"
echo "Format: https://github.com/YOUR_USERNAME/zhang-yang-wedding-app.git"
echo "or: git@github.com:YOUR_USERNAME/zhang-yang-wedding-app.git"
read -p "Repository URL: " repo_url

if [ -z "$repo_url" ]; then
    echo "❌ No repository URL provided. Exiting."
    exit 1
fi

# Add remote origin
echo "🔗 Adding remote origin..."
git remote add origin "$repo_url"

# Push both branches
echo "📤 Pushing main branch..."
git push -u origin main

echo "📤 Pushing develop branch..."
git push -u origin develop

# Set default branch to develop
echo "🎯 Setting develop as the default branch..."
git branch --set-upstream-to=origin/develop develop

echo ""
echo "✅ Repository setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your GitHub repository"
echo "2. Click 'Settings' → 'Collaborators' → 'Add people'"
echo "3. Invite your wife with email: [her email address]"
echo "4. She can then clone the repository with:"
echo "   git clone $repo_url"
echo ""
echo "🎉 Happy collaborating!"