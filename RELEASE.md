# Releasing a new version

1. Merge your changes to master and be on `master`
2. Run `npm version <major|minor|patch>`
3. Push to origin `git push --follow-tags`
4. CircleCI will publish the npm package to the `latest` tag
5. Create a release on GitHub with the notes from the `CHANGELOG.md`
6. Point your project to the new version `npm install particle-api-js@latest`