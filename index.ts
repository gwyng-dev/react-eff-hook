import { type DependencyList, useEffect, useInsertionEffect, useLayoutEffect } from 'react'

type EffectHook = typeof useEffect

const upgradeHook = (useHook: EffectHook) =>
  (fn: () => Generator<Promise<unknown>, void>, deps?: DependencyList) => {
    useHook(() => {
      const i = fn()
      void (async () => {
        let resolved
        while (true) {
          const { value, done } = i.next(resolved)
          if (done) {
            break
          }
          resolved = await value
        }
      })()
      return () => { i.return() }
    }, deps)
  }

export function * wait<T> (promise: Promise<T>): Generator<Promise<T>, T> {
  return (yield promise) as T
}

export const useEff = upgradeHook(useEffect)
export const useLayoutEff = upgradeHook(useLayoutEffect)
export const useInsertionEff = upgradeHook(useInsertionEffect)
