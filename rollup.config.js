/*
 * @Descripttion: rollup的配置
 * @Author: WuFengliang
 * @Date: 2022-01-03 17:14:34
 * @LastEditTime: 2022-01-03 17:47:37
 */
import path from "path";
import json from "@rollup/plugin-json";
import ts from "rollup-plugin-typescript2";
import resolvePlugin from "@rollup/plugin-node-resolve";

//  根据环境变量中的target属性 获取对应模块中的package.json

//  找到packages目录
const packageDir = path.resolve(__dirname, "packages");
//  packageDir 打包的基准目录
const packageDir = path.resolve(packageDir, process.env.TARGET); //  找到要打包的某个包

//  永远针对的是某个模块
const resolve = (p) => path.resolve(packageDir, p);

const pkg = require(resolve("package.json"));

const name = path.basename(packageDir); //  取文件名

//  对打包类型 先做一个映射表 根据你提供的formats 来格式化需要打包的内容
const outputConfig = {
  "esm-builder": {
    file: resolve(`dist/${name}.esm-builder.js`),
    format: "es",
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: "cjs",
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: "iife",
  },
};

const options = pkg.buildOptions; //  自己在package.json中定义的选项

function createConfig(format, output) {
  output.name = options.name;
  output.sroucemap = true; //  生成sourcemap

  //    生成rollup配置
  return {
    input: resolve(`src/index.ts`),
    output,
    plugins: [
      json(),
      ts({
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
      }),
      resolvePlugin(),
    ],
  };
}

export default options.format.map((format) =>
  createConfig(format, outputConfig[format])
);
