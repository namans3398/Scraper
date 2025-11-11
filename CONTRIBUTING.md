# Contributing to Scraper

Thank you for your interest in contributing to Scraper! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, Node.js version, Electron version)
- **Error messages** or logs

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why is this enhancement needed?
- **Proposed solution** or implementation approach
- **Alternatives considered**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style guidelines
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Commit with clear messages** describing what and why
6. **Submit a pull request**

## Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/scraper.git
   cd scraper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm run dev
   ```

## Code Style Guidelines

### JavaScript
- Use modern ES6+ syntax
- Use `const` and `let`, avoid `var`
- Use arrow functions where appropriate
- Add comments for complex logic
- Keep functions small and focused

### Security
- **Always validate user input**
- **Never use eval() or similar**
- **Use spawn with array arguments** to prevent injection
- **Sanitize all displayed data** to prevent XSS
- **Follow principle of least privilege**

### Naming Conventions
- Use camelCase for variables and functions
- Use PascalCase for classes
- Use UPPER_CASE for constants
- Use descriptive names

### Comments
```javascript
// Good: Explains why, not what
// Validate URL to prevent command injection attacks
if (!isValidYouTubeUrl(url)) {
  throw new Error('Invalid URL');
}

// Bad: States the obvious
// Check if URL is valid
if (!isValidYouTubeUrl(url)) {
  throw new Error('Invalid URL');
}
```

## Testing

Before submitting a PR:

1. **Test all features** manually
2. **Test on your target platform** (macOS, Windows, or Linux)
3. **Verify security measures** are not bypassed
4. **Check for console errors**
5. **Test edge cases** and error handling

## Commit Messages

Write clear, concise commit messages:

```
Good:
- "Add cancel download functionality"
- "Fix XSS vulnerability in video title display"
- "Improve error handling for network failures"

Bad:
- "Update"
- "Fix bug"
- "Changes"
```

## Project Structure

```
scraper/
├── main.js           # Electron main process (IPC handlers)
├── preload.js        # Secure bridge (context isolation)
├── renderer.js       # UI logic and event handlers
├── index.html        # Application interface
├── styles.css        # Styling
├── package.json      # Dependencies and scripts
├── README.md         # User documentation
├── SECURITY.md       # Security documentation
├── CONTRIBUTING.md   # This file
└── LICENSE           # MIT License
```

## Security Considerations

When contributing, always consider:

- **Input validation** - Never trust user input
- **Command injection** - Use spawn with arrays, not strings
- **XSS prevention** - Escape HTML in displayed content
- **Path traversal** - Sanitize and validate file paths
- **CSP compliance** - Don't break Content Security Policy
- **Least privilege** - Request minimum necessary permissions

## Questions?

Feel free to open an issue for questions or clarifications. We're here to help!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
