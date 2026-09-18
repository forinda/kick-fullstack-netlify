import { defineConfig } from '@forinda/kickjs-cli'
import { deployPlugin } from './kick-deploy'

export default defineConfig({
  pattern: 'rest',
  // The HTTP engine this app boots on (matches `bootstrap({ runtime })` in
  // src/index.ts). Dep-aware commands read it: `kick add upload` installs the
  // engine's multipart driver, `kick doctor` checks the engine peers, and
  // `kick typegen` flips the runtime escape-hatch types to this engine.
  runtime: 'express',
  // Pinned so `kick add` and other dep-installing commands always use the
  // project's intended package manager, regardless of which lockfile exists.
  packageManager: 'pnpm',
  modules: {
    dir: 'src/modules',
    repo: 'inmemory',
    pluralize: false,
  },

  typegen: {
    schemaValidator: 'kickjs-schema',
    client: true,
  },

  commands: [
    {
      name: 'test',
      description: 'Run tests with Vitest',
      steps: 'vitest run',
    },
    {
      name: 'lint',
      description: 'Lint with oxlint',
      steps: 'oxlint src/',
    },
    {
      name: 'format',
      description: 'Format code with oxfmt',
      steps: 'oxfmt src/',
    },
    {
      name: 'format:check',
      description: 'Check formatting without writing',
      steps: 'oxfmt --check src/',
    },
    {
      name: 'ci:check',
      description: 'Run typecheck + lint + format check',
      steps: ['kick typecheck', 'oxlint src/', 'oxfmt --check src/'],
      aliases: ['verify'],
    },
  ],
  plugins:[deployPlugin({ staticDir: '../web/dist', siteRoot: '..' })]
})
