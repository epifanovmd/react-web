import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss'
import path from 'path'

import { defineConfig } from "rollup";
// @ts-ignore
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const config = defineConfig({
  input: "src/index.ts",
  output: [
    {
      dir: "./lib/cjs",
      format: "cjs",
      exports: "named",
      preserveModules: true,
      preserveModulesRoot: "src",
      sourcemap: true,
    },
    {
      dir: "./lib/esm",
      format: "es",
      exports: "named",
      preserveModules: true,
      preserveModulesRoot: "src",
      sourcemap: true,
    },
  ],
  external: /node_modules/,
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    terser(),
    postcss({
      extract: 'index.css',
      plugins: [],
      use: ['sass'],
    }),
    typescript({ useTsconfigDeclarationDir: true }),
  ],
});

export default config;
