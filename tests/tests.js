test("Startup", function () {
    var k = makeLazyJS();
    ok(typeof k == "function", "makeLazyJS() returns a function");
});
test("Adding Objects", function () {
    var k = makeLazyJS();
    var testarr = [{
        red: 1
    }, {
        x: 62,
        y: 27
    }, {
        red: 0,
        blue: "hi"
    }];
    for (var i in testarr) {
        k(testarr[i]);
    }
    var res = k('!');
    var good = true;
    for (var i in testarr) {
        good &= (testarr[i] == res[i]);
    }
    good &= (testarr.length == res.length);
    ok(good, "! returns all correctly");
    k({});
    res = k('!');
    ok(testarr.length + 1 == res.length, "Add one more");
    k.remove(testarr[0]);
    k.remove(testarr[1]);
    res = k('!');
    ok(testarr.length - 1 == res.length, "Remove some");

});
test(". Query", function () {
    var k = makeLazyJS();
    var testarr = [{
        red: 1,
        y: 2
    }, {
        x: 62,
        y: 27
    }, {
        red: 0,
        blue: "hi"
    }];
    for (var i in testarr) {
        k(testarr[i]);
    }
    var res = k('.x');
    equal(res.length, 1, ".x only one object");
    equal(res[0], testarr[1], ".x right object");
    var res = k('.blue');
    equal(res.length, 1, ".blue one object");
    equal(res[0], testarr[2], ".blue right object x");
    var res = k('.red');
    var good = res.length == 1;
    good &= res[0] == testarr[0];
    ok(good, ".red discard 0s");

    good = true;
    var res = k('.y');
    good &= (res.length == 2);
    ok(good, ".y: return both");


    good = true;
    var res = k('.y=27');
    good &= (res.length == 1);
    good &= (res[0] == testarr[1]);
    ok(good, ".y=27: test equals");

    good = true;
    var res = k('.x.y');
    good &= (res.length == 1);
    good &= (res[0] == testarr[1]);
    ok(good, ".x.y: combined test");


});
test("! Query", function () {
    var k = makeLazyJS();
    var testarr = [{
        red: 1,
        y: 2
    }, {
        x: 62,
        y: 27
    }, {
        red: 0,
        blue: "hi"
    }];
    for (var i in testarr) {
        k(testarr[i]);
    }
    var res = k('!x');
    equal(res.length, 2, "!x both");

    var res = k('!blue!x');
    var good = true;
    good &= (res.length == 1);
    good &= (res[0] == testarr[0]);
    ok(good, "!blue!x");


    var res = k('!red.blue');
    var good = res.length == 1;
    good &= res[0] == testarr[2];
    ok(good, "!red includes 0s");

    var res = k('!y');
    var good = res.length == 1;
    good &= res[0] == testarr[2];
    ok(good, "!y correct");

    good = true;
    var res = k('.y!y=27');
    good &= (res.length == 1);
    good &= (res[0] == testarr[0]);
    ok(good, ".y!y=27: test !=");
});

test("< Query", function () {
    var k = makeLazyJS();
    var testarr = [{
        red: 1,
        y: 2,
        green: 1
    }, {
        x: 62,
        y: 27
    }, {
        red: {
            green: 2
        },
        blue: "hi"
    }];
    for (var i in testarr) {
        k(testarr[i]);
    }
    var res = k('.x<x');
    ok(res.length == 1 && res[0] == 62, ".x<x");

    var res = k('<red');
    ok(res.length == testarr.length, "<red");


    var res = k('<red.green');
    var good = res.length == 1;
    good &= res[0] == testarr[2].red;
    ok(good, "<red.green layered query");

});

test("> Query", function () {
    var k = makeLazyJS();
    var lvar = 0;
    var testarr = [{
        red: function () {
            lvar += 27;
            return 3;
        },
        y: 2
    }, {
        x: 62,
        y: 27
    }, {
        red: function(){
            lvar += 33;
            return {
                green: 6
            };
        },
        blue: "hi"
    }];
    for (var i in testarr) {
        k(testarr[i]);
    }
    var res = k('>red');
    ok(lvar == (27 + 33), ">red runs function");
    ok(res.length == 2, ">red returns correctly");

    lvar = 0;
    var res = k('>red.green<green');
    ok(res.length == 1 && res[0] == 6, ">red.green<green layered wtih >");


});


test("Attached Function", function () {
    var k = makeLazyJS();
    var testarr = [{
        red: function () {
            lvar += 27;
            return 3;
        },
        y: 2,
        r:100
    }, {
        x: 62,
        y: 27,
        r: 23
    }, {
        red: function () {
            lvar += 33;
            return {
                green: 6
            };
        },
        r: 5,
        blue: "hi"
    }];
    for (var i in testarr) {
        k(testarr[i]);
    }
    var total = 0;
    var res = k('.red', function (b) {
        total += b.r;
        return b.r;
    });
    ok(total == (5 + 100), "attached function runs");
    ok(res.length == 2, "attached function returns result");
});