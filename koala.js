function makeKoalaJS() {
    //shim indexOf
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(searchElement, fromIndex) {
            if (this === undefined || this === null) {
                throw new TypeError('"this" is null or not defined');
            }

            var length = this.length >>> 0; // Hack to convert object.length to a UInt32

            fromIndex = +fromIndex || 0;

            if (Math.abs(fromIndex) === Infinity) {
                fromIndex = 0;
            }

            if (fromIndex < 0) {
                fromIndex += length;
                if (fromIndex < 0) {
                    fromIndex = 0;
                }
            }

            for (; fromIndex < length; fromIndex++) {
                if (this[fromIndex] === searchElement) {
                    return fromIndex;
                }
            }

            return -1;
        };
    }

    var statics = {};
    var raw = [];
    var wm;
    if (typeof WeakMap != "undefined"){
        wm = new WeakMap();
    }
    var koala = function(e,t){
		if (typeof e == "object"){
			if (wm)
                wm.set(e,raw.length);
            else
                e.kid = raw.length;
			raw.push(e);
			return;
		}
		var args = [];
		var temp;
		/*for (var i = 0; i < arguments.length; i++){
			if (typeof arguments[i] == "string"){
				temp = koala.splitquery(arguments[i]);
				for (var t in temp){
					args.push(temp[t]);
				}
			}
			else{
				args.push(arguments[i]);
			}
			
		}*/
		
		args = splitquery(e);
		
		var workspace = switcher(args[0]);
		
		
		for (var i = 1; i < args.length; i++){
			workspace = switcher(args[i],workspace);
		}
		if (t){
			var retval = [];
			for (var i = 0; i < workspace.length; i++){
				retval.push(t(workspace[i]));
			}
			return retval;
		}
		else{
			return workspace;
		}
	}
    
	var dirty = 0;
	koala.remove = function(o){
        var kid;
		if (typeof o == "object"){
			if (wm)
                kid = wm.get(o);
            else
                kid = o.kid;

		}
		dirty++;
		delete raw[kid];
	};
	koala.merge = function(x,y){
		for (var i in y){
			x[i] = y[i];
		}
	};
	function splitquery(x) {
		var delim = [".","<",">","!"];
		var closest = [];
		var index = 0;
		var retval = [];
		for (var i = 0; i < delim.length; i++){
			closest[i] = x.indexOf(delim[i]);
		}
		var go;
		var c = x.length;
		while(true){
			go = false;
			for (var i = 0; i < closest.length; i++){
				if (closest[i] < index){
					closest[i] = x.indexOf(delim[i],index);
				}
				if ( closest[i] >= 0 && closest[i] < c){
					c = closest[i];
					go = true;
				}
			}
			if (!go){
				break;
			}
			retval.push(x.substring(index-1,c));
			index = c+1;
			c=x.length;
		}
		retval.splice(0,1);
		retval.push(x.substr(index-1));
		return retval;
	}
	function switcher(t, w) {
		if (typeof t == "string"){
			return string(t,w);
		}
	};

	//koala.cache = {};
	function string(t, w) {
		var search;
		var retval = [];
		search = t.substr(1);
		if (typeof w == "undefined"){
			w = raw;
		}
		switch (t.charAt(0)){
			case ".":
				var eq = search.split("=");
				
				if (eq.length > 1){				
					search = eq[0];
					if (JSON){
						eq = JSON.parse(eq[1]);
					}
					else{
						eq = eval(eq[1]);
					}
					for (var i = 0; i < w.length; i++){
					    if (w[i]) {
					        if (w[i][search] == eq) {
					            retval.push(w[i]);
					        }
					    }
					}
				}
				else{
				    for (var i = 0; i < w.length; i++) {
				        if (w[i]) {
				            if (w[i][search]) {
				                retval.push(w[i]);
				            }
				        }
					}
				}
				return retval;
				break;
				
			case "!":
				var eq = search.split("=");
				
				if (eq.length > 1){				
					search = eq[0];
					if (JSON){
						eq = JSON.parse(eq[1]);
					}
					else{
						eq = eval(eq[1]);
					}
					for (var i = 0; i < w.length; i++) {
					    if (w[i]) {
					        if (w[i][search] != eq) {
					            retval.push(w[i]);
					        }
					    }
					}
				}
				else{
				    for (var i = 0; i < w.length; i++) {
				        if (w[i]) {
				            if (!w[i][search]) {
				                retval.push(w[i]);
				            }
				        }
					}
				}
				return retval;
				break;
			case ">":
			    for (var i = 0; i < w.length; i++) {
			        if (w[i]) {
			            if (w[i][search]) {
			                retval.push(w[i][search]());
			            }
			        }
				}
				return retval;
				break;
				
			case "<":
			    for (var i = 0; i < w.length; i++) {
			        if (w[i]) {
		                retval.push(w[i][search]);
			        }
				}
				return retval;
				break;
				
		}
	}
	
	koala.clean = function () {
	    if (dirty >= raw.length/2) {
	        var newRaw = [];
	        for (var i in raw) {
	            var index = newRaw.push(raw[i]) - 1;
                if (wm)
                    wm.set(raw[i],index)
                else
    	            raw[i].kid = index;
	        }
	        raw = newRaw;
	        dirty = 0;
	    }
	};
	function indexOfObject(o){
		return raw.indexOf(o);
	}
	return koala;
}