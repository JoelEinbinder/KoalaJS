KoalaJS
======

KoalaJS let's you program badly, and makes it so things still work out ok. It's a bit like CSS selectors for your javascript objects.

Turns code like *this*:
```javascript
for (var i = 0; i < enemies.length; i++){
    enemies.draw();
    enemies.gravity();
}
for (var i = 0; i < bullets.length; i++){
    bullets.draw();
}
for (var i = 0; i < players.length; i++){
    players.draw();
    players.gravity();
}
```
into *this*:

```javascript
k('>draw');
k('>gravity');
```

##How to use
Use `makeKoalaJS()` to create a new instance.
```javascript
var k = makeKoalaJS();
```

###Add objects to your instance
```javascript
var myObj = {a: 1, b:2, c: true};
k(myObject)
var otherObj = {b: 3, c: false};
```

###Query to get your objects back
```javascript
k('.a') // returns [myObj]
k('.b') // returns [myObj, otherObj]
```

###Getting values
```javascript
k('<b'); // returns [2, 3];
k('<a'); // returns [1, undefined];
k('.a<b'); // returns [2];
```
`<` returns all of the values. This does not do truthy checking!


###Running functions
```javascript
k({
    go: function(){
        return 5;
    }
});
k({
    go: function(){
        return 3;
    }
});
k('>go'); // returns [5, 3]
```
`>` checks if the object has the value and if that value is a function in it before running it, so you can use it without fear.

###Removing things
```javascript
k.remove(myObj); // myObj is gone!
```

###Checking equality
```javascript
k('.b=3'); // returns [otherObj]
```

###Other features
```javascript
k('.block.solid', function(object){
    // function runs on every solid block
});
k('!block.solid'); // get everything NOT a block, and solid
k.clean(); // might get removed, compressed the raw list if it gets too big.
```

##Why would anyone ever want this?
When I make games, I often have a big array of game objects. I was always filtering it to find certain objects, so I wrote this library to make things nicer.

##Wouldn't this be really slow?
Yes and no. If you plan out how you want your game to work very carefully before hand, you will certainly write faster code than using KoalaJS. But you will also write a lot more code, and your code will be less flexible.

Theoretically a solution like KoalaJS could actually be faster than manually managed lists. This is because KoalaJS can make changes to how your data is stored in real time based on the queries it is getting. So if it sees that you always run `k('.solid>explode')`, it could cache the query for future use, or even pre-load it during downtime. Note that this isn't currently implemented.

##What's Next?
KoalaJS gets optimized only when I am making a game that needs something to be faster. Right now it works great for everything I've thrown at it, but I haven't thrown that much at it. I could imagine in the future adding query caching, static properties, and some kind of tree for faster collision detection.

I also want to make a more complicated system of equality testing, but so far `".property=5"` has worked for everything I need.
