import { isObject } from '@vue/shared';
import {
    mutableHandles,
    readonlyHandles,
    shallowReactiveHandles,
    shallowReadonlyHandles
} from './baseHandles';

export function reactive(target) {
    return createReactive(target, false, mutableHandles);
}

export function readonly(target) {
    return createReactive(target, true, readonlyHandles);
}

export function shallowReactive(target) {
    return createReactive(target, false, shallowReactiveHandles);
}

export function shallowReadonly(target) {
    return createReactive(target, true, shallowReadonlyHandles);
}

const reactiveMap = new WeakMap();  //  会自动垃圾回收，不会造成内存泄露，储存的key只能为对象
const readonlyMap = new WeakMap();

function createReactive(target, isReadonly, baseHandles) {
    if (!isObject(target)) {
        return target;
    }
    /**
     * 1.根据是否是只读属性来决定缓存到的集合
     */
    const proxyMap = isReadonly ? readonlyMap : reactiveMap;

    const existProxy = proxyMap.get(target);    //  判断当前缓存集合是否有代理对象

    if (existProxy) {
        return existProxy;
    }

    const proxy = new Proxy(target, baseHandles);

    proxyMap.set(target, proxy);    //  讲要代理的对象和对应的代理结果缓存起来

    return proxy;
}