# Production Checklist

Before tagging and releasing a new version, ensure the following steps are met:

1.  **Code Quality**: `npm run lint` and `npm run type-check` pass with no errors.
2.  **Tests**: `npm test` passes completely.
3.  **Dependencies**: Check for any outdated or vulnerable dependencies using `npm audit`.
4.  **Version Bump**: Update the version number in `package.json`.
5.  **Changelog**: Document the changes in `CHANGELOG.md`.
6.  **Build**: Run `npm run build:all` locally to ensure packaging completes successfully for macOS, Windows, and Linux.
7.  **Release**: Draft a new release on GitHub, attach the generated binaries, and publish.
