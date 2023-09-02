# reat-eff-hook

react-eff-hook introduces `useEff`, an enhanced `useEffect` powered by Generator.

## Installation
```shell
npm i react-eff-hook
```

## Usage
```js
useEff(function*() {
  while (true) {
    // `wait` is just for typing. you can just yield promises.
    yield* wait(new Promise(resolve => setTimeout(resolve, 1000)));
    
    console.log('tick');
    setCount((x) => x + 1);
  }
}, [])
```

So, why is it better? Let's compare it to the code using `useEffect`.

```js
useEffect(() => {
  let cancelled = false;
  void (async () => {
    while (!cancelled) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('tick');
      setCount((x) => x + 1);
    }
  })();
  return () => { cancelled = true; };
}, [])
```

- Ugly IIFE to avoid being asynchronous callback
- Manually stop the loop on cleanup

They are all gone with `useEff`.

Furthremore, `useEffect` doesn't work fine with new `using` syntax in TypeScript 5.2.

`useEff` does.

```js
class Interval {
  constructor(fn: () => void, interval: number) {
    this.interval = setInterval(fn, interval);  
  }
  
  [Symbol.dispose]() {
    clearInterval(this.interval);
  }
}

useEff(function*() {
  using interval = new Interval(() => { setCount((x) => x + 1); }, 1000)
}, [])
```

Also, you can use `useLayoutEff` and `useInsertionEff` which are better versions of `useLayoutEffect` and `useInsertionEffect` respectively.

## Caveat(or Feature?)
While `useEff` automatically handles cleanup, it handles erros in a different way from `useEffect`.

Both `useEff` and `useEffect` trigger cleanup functions upon deps changes or component unmounts, ensuring you don't need to worry about successful effects. 

`useEffect` disregards errors thrown by promises within it, whereas the disposables within `useEff` invoke their dispose functions when any error occurs. 

While this may be seen as a more desirable behavior, it may not be compatible with useEffect. 

However, I'm not entirely certain. Please let me know if you encounter any issues with this behavior.
