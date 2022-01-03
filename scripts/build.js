/*
 * @Descripttion: 把packages目录下的包都打包
 * @Author: WuFengliang
 * @Date: 2022-01-03 17:22:25
 * @LastEditTime: 2022-01-03 17:31:43
 */
const fs = require("fs");
const execa = require("execa"); //  开启子进程进行打包 最终还是使用rollup打包

const targets = fs.readdirSync("packages").filter((f) => {
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false;
  }
  return true;
});

//  对目标进行依次打包 并打包

async function build(target) {
  //  rollup -c --environment TARGET:shared
  await execa("rollup", ["-c", "--environment", `TARGET:${target}`], {
    stdio: "inherit", //  当紫禁城打包的信息共享给父进程
  });
}

function runParaller(targets, iteratorFn) {
  const res = [];
  for (const item of targets) {
    const p = iteratorFn(item);
    res.push(p);
  }
  return Promise.all(res);
}

runParaller(targets, build);
