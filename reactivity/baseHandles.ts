/*
 * @Descripttion:实现new Proxy(target,handle)
 * @Author: WuFengliang
 * @Date: 2021-07-07 15:47:05
 * @LastEditTime: 2021-07-07 16:20:30
 */

import { extend, isObject } from "shared/utils";
import { reactive, readonly } from "./reactive";

/**
 * 1.考虑是否是仅读的 仅读属性set时会报异常
 * 2.是否是深度的
 */

const get = createGetter();
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

const set = createSetter();
const shallowSet = createSetter(true);

/**
 * 拦截获取功能
 * @param {Boolean} isReadonly 是否是仅读
 * @param {Boolean} shallow 是否是浅的
 */
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        const result = Reflect.get(target, key, receiver);
        if (!isReadonly) {
            //  收集依赖 数据变化后更新对应的视图
        }

        if (shallow) {
            return result;
        }

        if (isObject(result)) {
            //  Vue2.x是初始化就进行递归代理 Vue3是取值时进行代理；Vue3的代理模式是浅代理
            return isReadonly ? readonly(result) : reactive(result);
        }

        return result;
    }
}

/**
 * @description 拦截设置
 * @param {Boolean} shallow 是否是浅的
 */
function createSetter(isShallow = false) {
    return function set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver);


        return result;
    }
}

const readonlyObj = {
    set: (target, key) => {
        console.warn(`set ${target} on ${key} is't valid`);
    }
}

export const mutableHandles = {
    get,
};

export const shallowReactiveHandles = {
    get: shallowGet,
};

export const readonlyHandles = extend({
    get: readonlyGet,
}, readonlyObj);

export const shallowReadonlyHandles = extend({
    get: shallowReadonlyGet,
}, readonlyObj);
