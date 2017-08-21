# Rx.js – Writing Custom Operators

Rx.js is great, especially because of its wide range of built-in operators. But sometime you might find that the built-in operators don't nicely fit your problem. That's when you might write you own operator, but that can be a little painful. Not least because of Rx's lacking documentation. In this article we explore the different ways we can write custom operators.

## Anatomy of an Operator

An operator is a method on `Rx.Observable.prototype`. It returns a new Observable based on the source observable it was called on. When a subscription is made on the resulting observable the operator will (in most cases) create a subscription to its source observable. Every value emitted by the source observable will be passed to the operator's subscriber. The operator's subscriber can then do anything with that value. For example, pass it to its subscriber.

```
                            call      ^      value
Observable.of(1)              |       |        |
  .map((i) => i * 3)          |       |        |
  .mapTo('Foo')               |       |        |
  .subscribe(console.log)     |       |        |
                              v   subscribe    v
```

When we chain together operators, one operator after the other is called from the top down. If we then subscribe to the result, subscriptions are made recursively. From the bottom upwards. Values are then passed in the opposite direction again. A bit like a yo-yo.

## Custom Operators

Now that we roughly know how an operator works, we can already make an important conclusion: Operators can simply be built combining other operators. Here's a very simple operator:

```js
Observable.prototype.mapToFoo = function () {
  return this.mapTo('Foo!')
}
```

Pretty straight forward[^1]. Let's look at the result.

```js
Observable.from([1, 2])
  .mapToFoo()
  .subscribe((x) => console.log(x))
// Logs:
// 'Foo!'
// 'Foo!'
```

Alright, now let's make things a little more complex. We'll try adding some state to our observable[^2]. We can do this using `Rx.Observable.create`[^4].

```js
Observable.prototype.mapToFooCount = function () {
  return Observable.create((subscriber) => {
    let i = 0
    this.subscribe(() => {
      subscriber.next(`Foo${i++}!`)
    })
  })
}
```

In order to maintain the state (`i`) of the operator we have to create a new observable manually. We might be tempted to store the state in the scope of the `Observable#mapToFoo` function body. This would work until the observable is subscribed to more than once[^4]. The state would only be initialized when the operator is called on the source observer. It would not be re-initialized when the observable is re-subscribed to. That's why the state needs to be maintained inside the subscribe callback[^5].

```js
Observable.from([1, 2])
  .mapToFooCount()
  .subscribe((x) => console.log(x))
// Logs:
// 'Foo0!'
// 'Foo1!'
```

## Using `Observable#lift`

Internally `rxjs` uses `Observable#lift` for operators. It has some important advantages over the approach we've seen above, which I'll go into further below. `Observable#lift` takes an `Operator` as an argument and returns a new Observable with that operator applied to it. Let's write our `mapToFooCount` operator using `Observable#lift`.

```js
Observable.prototype.mapToFooCount = function () {
  return this.lift(new MapToFooCountOperator())
}

class MapToFooCountOperator {
  call(subscriber, source) {
    return source.subscribe(new MapToFooCountSubscriber(subscriber))
  }
}

class MapToFooCountSubscriber extends Rx.Subscriber {
  constructor(destination) {
    super(destination)
    this.state = 0
  }
  _next(value) {
    this.state += 1
    this.destination.next(`Foo${this.state}!`)
  }
}
```

Now this will look very familiar if you've ever looked at the Rx.js source code. Let's go through it. The `Operator` we're passing to `Observable#lift` is an object with a method `call`. The Rx.js internals apply this `call` function with two arguments, `subscriber` and `source`. `subscriber` is the same type of object passed to the subscriber callback from `Observable#create`. The second argument, `source` is the same thing as `this` in our last example. It's the observable on which our operator was called on. In our `call` method we create a subscription to the source observable using `MapToFooCountSubscriber`. It's important that we return result of `subscribe` as a tear-down function. The subscriber, `MapToFooCountSubscriber` is used to contain the state for our `next` handler.

This a pretty verbose way of writing operators. Unsurprisingly there are reasons for doing things this way.

## Advantages of `Observable#lift`

The Rx.js team decided to implement all operators using `lift` for [three main reasons](https://github.com/ReactiveX/RxJS/issues/60).

1) `lift` could be overridden. This way we can modify the behaviour when any operator is applied. This would come in very handy for example when creating a debugging utility.

2) Performance. With `lift` they could eliminate the strict need for "transient closures"[^6]. In our first example we're using a transient closure to access the state in the upper scope. If we also had to pass an argument to our operator, it would be impossible to avoid a transient closure. To completely avoid transient closures in our `lift` examples, we have to user object constructors. In our simple example using transient closures instead would have resulted in a [6%~12% slow down](https://jsperf.com/rx-js-observable-operatro-creation/). This is negligible when considering, that the transient closure only has to be created when the observable is subscribed to.

3) A much shorter call-stack. This is how they achieved the big reduction in call-stack size from v4 to v5. `lift` only increases the call-stack size by three lines. One from `MapToFooCountOperator#call`, `subcribe` and `MapToFooCountSubscriber#_next`. In our first example, the call-stack was increased by eight calls every time the operator was used. A shorter call-stack generally means a more readable one and (for the most part) better performing code.

## Conclusion

Using `lift` has a lot of advantages, but the resulting code is just not as readable as when using `Observable#create` or using transient closures. Another con is its lacking documentation. I'd say when writing a library that provides some new operators, you should definitely go with `lift`. But for proprietary code where you value readability over a small performance benefit, you should probably go with the `Observable#create` method.

[^1]:
  No worries if it's not for you.
  Let's go through it line-by-line. We're assigning `mapToFoo` to the [prototype](http://sporto.github.io/blog/2013/02/22/a-plain-english-guide-to-javascript-prototypes/) of all observables. It's a function that returns the result of `this.mapTo('Foo!')`. Since an operator is a method on an observable, `this` refers to the observable we're using an operator on. `mapTo` transforms all values emitted by an operator to a given value.

[^2]:
  This could still be done just using built in operators.

[^3]:
  `Rx.Observable.create` is how Rx creates Observables internally. You can get pretty far without ever having to use it.

[^4]:
  A very common example of this is [`Observable#retry`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-retry). When an Observable throws an error `Observable#retry` will resubscribe to the source observable (the observable `Observable#retry` was called on).

[^5]:
  When creating an observable with `Rx.Observable.create`, the function we pass (the subscribe callback) gets executed every time a subscription is made to it. So every time `.subscribe` is called on it.

[^6]:
  A transient closure is an anonymous function declared and used inside a block. They're [a lot more work for the engine to compute then a non-transient](https://developers.google.com/speed/articles/optimizing-javascript) (static) one.
