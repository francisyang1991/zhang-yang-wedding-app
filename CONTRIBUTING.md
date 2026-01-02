# Contributing to Xiaodong & Yuwen Wedding App

## Welcome! 🎉

Thank you for contributing to our wedding website! This document outlines the guidelines and workflow for collaborating on this project.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zhang-&-yang-wedding-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.local.example .env.local
   # Add your GEMINI_API_KEY to .env.local
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

## 🌳 Branching Strategy

We use a simple but effective branching strategy:

- **`main`** - Production-ready code
- **`develop`** - Integration branch for features
- **`feature/feature-name`** - Individual feature branches

### Creating a Feature Branch

```bash
# Always branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### Committing Changes

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "Add: brief description of changes

- More detailed explanation
- List of changes made
- Any breaking changes"
```

### Pull Request Process

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Target branch: `develop`
   - Add clear description
   - Request review from both team members

3. **Code Review**
   - Both team members must approve
   - Address any feedback
   - Merge when approved

## 📝 Commit Message Guidelines

We follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Testing related changes
- `chore:` - Maintenance tasks

### Examples:
```
feat: add couple profile photo upload
fix: resolve RSVP modal display issue
docs: update admin dashboard guide
```

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Use meaningful variable and function names
- Add comments for complex logic

### Component Structure
- Keep components small and focused
- Use functional components with hooks
- Export components with named exports
- Add proper TypeScript interfaces

### Testing
- Test your changes before committing
- Run `npm run dev` to ensure no build errors
- Test on different screen sizes
- Verify admin functionality works

## 🎨 Design Guidelines

### Color Scheme
- Primary: `#C5A059` (Wedding Gold)
- Secondary: `#FDFBF7` (Wedding Sand)
- Accent: `#2C5282` (Wedding Ocean)
- Text: `#2D3748` (Wedding Text)

### Typography
- Serif: Playfair Display (headings)
- Sans: Lato (body text)

### Responsive Design
- Mobile-first approach
- Test on: iPhone SE, iPad, Desktop (1920px+)
- Use Tailwind responsive classes

## 📁 Project Structure

```
zhang-&-yang-wedding-app/
├── components/          # React components
├── services/            # API services (Gemini, Supabase)
├── constants.ts         # App constants and data
├── types.ts            # TypeScript type definitions
├── ROADMAP.md          # Project roadmap
├── PROGRESS.md         # Progress tracking
└── CONTRIBUTING.md     # This file
```

## 🛠️ Tools & Technologies

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI**: Google Gemini API
- **Database**: Supabase (planned)
- **Deployment**: Netlify/Vercel (planned)

## 🚨 Important Notes

### Environment Variables
- Never commit `.env.local` files
- Use `.env.local.example` as template
- Keep API keys secure

### Admin Access
- Admin password: `maui2026`
- Change this in production!

### Performance
- Optimize images before uploading
- Use lazy loading for large content
- Monitor bundle size

## 📞 Communication

- **Daily Check-ins**: Quick progress updates
- **Weekly Sync**: Detailed progress review
- **Issues**: Use GitHub Issues for bugs/features
- **Discussions**: Use GitHub Discussions for planning

## 🎯 Definition of Done

A feature is complete when:
- [ ] Code follows project guidelines
- [ ] TypeScript types are properly defined
- [ ] Component is responsive and accessible
- [ ] Tested on multiple devices/browsers
- [ ] No console errors or warnings
- [ ] Documentation updated if needed
- [ ] Both team members have reviewed and approved

## 🙋 Getting Help

If you need help:
1. Check existing documentation
2. Ask in team chat
3. Create a GitHub issue
4. Schedule a pair programming session

## 📜 License

This project is private and for personal use only.

---

**Happy coding and congratulations on your upcoming wedding! 🎊**