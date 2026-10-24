#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { run } from './run';
import { doctor } from './doctor';
import { VibeError, runsDir, VIBE_VERSION } from './util';

const program = new Command();

program
  .name('vibe')
  .description('Zero-touch autonomous execution engine — point it at any repo, get a running app.')
  .version(VIBE_VERSION, '-v, --version', 'print the version');

program
  .argument('[repo]', 'GitHub shorthand (owner/repo), git URL, or local directory')
  .option('--docker', 'build and run via the repo Dockerfile instead of native detection')
  .option('--tunnel', 'expose the app on a public URL via cloudflared')
  .option('--env <kv...>', 'extra environment variables as KEY=VAL')
  .option('--port <n>', 'preferred starting port (default: auto)', (v: string) => parseInt(v, 10))
  .option('--no-install', 'skip the dependency install step')
  .action(async (repo: string | undefined, opts) => {
    try {
      if (!repo) {
        program.help();
        return;
      }
      const env: Record<string, string> = {};
      for (const kv of (opts.env as string[] | undefined) ?? []) {
        const i = kv.indexOf('=');
        if (i <= 0) throw new VibeError(`--env expects KEY=VAL, got '${kv}'`);
        env[kv.slice(0, i)] = kv.slice(i + 1);
      }
      await run(repo, {
        docker: opts.docker as boolean,
        tunnel: opts.tunnel as boolean,
        env,
        port: opts.port as number | undefined,
        install: opts.install as boolean,
      });
    } catch (err) {
      console.error(chalk.red(`\n${err instanceof Error ? err.message : String(err)}`));
      process.exit(1);
    }
  });

program
  .command('demo')
  .description('run the bundled demo app (examples/hello-express), no other repo needed')
  .option('--port <n>', 'preferred starting port (default: auto)', (v: string) => parseInt(v, 10))
  .action(async (opts) => {
    try {
      const dir = path.resolve(__dirname, '..', 'examples', 'hello-express');
      if (!fs.existsSync(dir)) throw new VibeError(`Bundled demo not found at ${dir}`);
      await run(dir, { docker: false, tunnel: false, env: {}, port: opts.port as number | undefined, install: true });
    } catch (err) {
      console.error(chalk.red(`\n${err instanceof Error ? err.message : String(err)}`));
      process.exit(1);
    }
  });

program
  .command('doctor')
  .description('check that the tools vibe needs are installed')
  .action(async () => {
    await doctor();
  });

program
  .command('badge')
  .description('print a copy-paste "Run with Vibe" README badge')
  .argument('[repo]', 'owner/repo the badge one-liner points at (default: hydope/vibe)')
  .action((repo: string | undefined) => {
    const target = repo ?? 'hydope/vibe';
    console.log(
      '[![Run with Vibe](https://img.shields.io/badge/Run_with-Vibe-7c3aed?style=flat-square)](https://github.com/hydope/vibe)'
    );
    console.log();
    console.log(chalk.dim('One-liner for your README:'));
    console.log(`  npx -y hydope/vibe ${target}`);
  });

program
  .command('clean')
  .description('remove cached runs under ~/.vibe/runs')
  .action(() => {
    const dir = runsDir();
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(chalk.green(`Cleaned ${dir}`));
    } else {
      console.log(chalk.dim('Nothing to clean.'));
    }
  });

void program.parseAsync(process.argv);
