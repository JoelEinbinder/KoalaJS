function makeLazyJS() {
    var statics = {};
	var lazy = function(e,t){
		if (typeof e == "object"){
			e.kid = lazy.raw.length; 
			lazy.raw.push(e);
			return;
		}
		var args = [];
		var temp;
		/*for (var i = 0; i < arguments.length; i++){
			if (typeof arguments[i] == "string"){
				temp = lazy.splitquery(arguments[i]);
				for (var t in temp){
					args.push(temp[t]);
				}
			}
			else{
				args.push(arguments[i]);
			}
			
		}*/
		
		args = lazy.splitquery(e);
		
		var workspace = lazy.switcher(args[0]);
		
		
		for (var i = 1; i < args.length; i++){
			workspace = lazy.switcher(args[i],workspace);
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
	lazy.remove = function(o){
		if (typeof o == "object"){
			o = o.kid;
		}
		lazy.raw[o].shouldbedeleted = true;
		dirty++;
		delete lazy.raw[o];
		/*for (var i in lazy.cache){
			delete lazy.cache[i].raw[o];
		}*/
		/*lazy.raw.splice(o,1);
		for (var i = o; i < lazy.raw.length; i++){
			lazy.raw[i].kid = i;
		}*/
	}
	lazy.merge = function(x,y){
		for (var i in y){
			x[i] = y[i];
		}
	}
	lazy.splitquery = function(x){
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
	lazy.switcher = function(t,w){
		if (typeof t == "string"){
			return lazy.string(t,w);
		}
	};
	lazy.raw = [];

	//lazy.cache = {};
	lazy.string = function(t,w){
		var search;
		var retval = [];
		search = t.substr(1);
		if (typeof w == "undefined"){
			w = lazy.raw;
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
					        if (w[i][search] == eq && !w[i].shouldbedeleted) {
					            retval.push(w[i]);
					        }
					    }
					}
				}
				else{
				    for (var i = 0; i < w.length; i++) {
				        if (w[i]) {
				            if (w[i][search] && !w[i].shouldbedeleted) {
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
					        if (w[i][search] != eq && !w[i].shouldbedeleted) {
					            retval.push(w[i]);
					        }
					    }
					}
				}
				else{
				    for (var i = 0; i < w.length; i++) {
				        if (w[i]) {
				            if (!w[i][search] && !w[i].shouldbedeleted) {
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
			            if (w[i][search] && !w[i].shouldbedeleted) {
			                retval.push(w[i][search]());
			            }
			        }
				}
				return retval;
				break;
				
			case "<":
			    for (var i = 0; i < w.length; i++) {
			        if (w[i]) {
			            if (!w[i].shouldbedeleted) {
			                retval.push(w[i][search]);
			            }
			        }
				}
				return retval;
				break;
				
		}
	}
	lazy.clean = function () {
	    if (dirty >= lazy.raw.length/2) {
	        var newraw = [];
	        var index = 0;
	        for (var i in lazy.raw) {
	            newraw.push(lazy.raw[i]);
	            lazy.raw[i].kid = index;
	            index++;

	        }
	        lazy.raw = newraw;
	        dirty = 0;
	    }
	}
	return lazy;
}