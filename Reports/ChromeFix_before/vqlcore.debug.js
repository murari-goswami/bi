//! vqlcore.debug.js
//

// Include Underscore inline here since it's so small
// Underscore.js 1.3.3
// (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){function r(a,c,d){if(a===c)return 0!==a||1/a==1/c;if(null==a||null==c)return a===c;a._chain&&(a=a._wrapped);c._chain&&(c=c._wrapped);if(a.isEqual&&b.isFunction(a.isEqual))return a.isEqual(c);if(c.isEqual&&b.isFunction(c.isEqual))return c.isEqual(a);var e=l.call(a);if(e!=l.call(c))return!1;switch(e){case "[object String]":return a==""+c;case "[object Number]":return a!=+a?c!=+c:0==a?1/a==1/c:a==+c;case "[object Date]":case "[object Boolean]":return+a==+c;case "[object RegExp]":return a.source==
c.source&&a.global==c.global&&a.multiline==c.multiline&&a.ignoreCase==c.ignoreCase}if("object"!=typeof a||"object"!=typeof c)return!1;for(var f=d.length;f--;)if(d[f]==a)return!0;d.push(a);var f=0,g=!0;if("[object Array]"==e){if(f=a.length,g=f==c.length)for(;f--&&(g=f in a==f in c&&r(a[f],c[f],d)););}else{if("constructor"in a!="constructor"in c||a.constructor!=c.constructor)return!1;for(var h in a)if(b.has(a,h)&&(f++,!(g=b.has(c,h)&&r(a[h],c[h],d))))break;if(g){for(h in c)if(b.has(c,h)&&!f--)break;
g=!f}}d.pop();return g}var s=this,I=s._,o={},k=Array.prototype,p=Object.prototype,i=k.slice,J=k.unshift,l=p.toString,K=p.hasOwnProperty,y=k.forEach,z=k.map,A=k.reduce,B=k.reduceRight,C=k.filter,D=k.every,E=k.some,q=k.indexOf,F=k.lastIndexOf,p=Array.isArray,L=Object.keys,t=Function.prototype.bind,b=function(a){return new m(a)};"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(exports=module.exports=b),exports._=b):s._=b;b.VERSION="1.3.3";var j=b.each=b.forEach=function(a,
c,d){if(a!=null)if(y&&a.forEach===y)a.forEach(c,d);else if(a.length===+a.length)for(var e=0,f=a.length;e<f;e++){if(e in a&&c.call(d,a[e],e,a)===o)break}else for(e in a)if(b.has(a,e)&&c.call(d,a[e],e,a)===o)break};b.map=b.collect=function(a,c,b){var e=[];if(a==null)return e;if(z&&a.map===z)return a.map(c,b);j(a,function(a,g,h){e[e.length]=c.call(b,a,g,h)});if(a.length===+a.length)e.length=a.length;return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(A&&
a.reduce===A){e&&(c=b.bind(c,e));return f?a.reduce(c,d):a.reduce(c)}j(a,function(a,b,i){if(f)d=c.call(e,d,a,b,i);else{d=a;f=true}});if(!f)throw new TypeError("Reduce of empty array with no initial value");return d};b.reduceRight=b.foldr=function(a,c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(B&&a.reduceRight===B){e&&(c=b.bind(c,e));return f?a.reduceRight(c,d):a.reduceRight(c)}var g=b.toArray(a).reverse();e&&!f&&(c=b.bind(c,e));return f?b.reduce(g,c,d,e):b.reduce(g,c)};b.find=b.detect=function(a,
c,b){var e;G(a,function(a,g,h){if(c.call(b,a,g,h)){e=a;return true}});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(C&&a.filter===C)return a.filter(c,b);j(a,function(a,g,h){c.call(b,a,g,h)&&(e[e.length]=a)});return e};b.reject=function(a,c,b){var e=[];if(a==null)return e;j(a,function(a,g,h){c.call(b,a,g,h)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=true;if(a==null)return e;if(D&&a.every===D)return a.every(c,b);j(a,function(a,g,h){if(!(e=e&&c.call(b,
a,g,h)))return o});return!!e};var G=b.some=b.any=function(a,c,d){c||(c=b.identity);var e=false;if(a==null)return e;if(E&&a.some===E)return a.some(c,d);j(a,function(a,b,h){if(e||(e=c.call(d,a,b,h)))return o});return!!e};b.include=b.contains=function(a,c){var b=false;if(a==null)return b;if(q&&a.indexOf===q)return a.indexOf(c)!=-1;return b=G(a,function(a){return a===c})};b.invoke=function(a,c){var d=i.call(arguments,2);return b.map(a,function(a){return(b.isFunction(c)?c||a:a[c]).apply(a,d)})};b.pluck=
function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a)&&a[0]===+a[0])return Math.max.apply(Math,a);if(!c&&b.isEmpty(a))return-Infinity;var e={computed:-Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,c,d){if(!c&&b.isArray(a)&&a[0]===+a[0])return Math.min.apply(Math,a);if(!c&&b.isEmpty(a))return Infinity;var e={computed:Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b<e.computed&&
(e={value:a,computed:b})});return e.value};b.shuffle=function(a){var b=[],d;j(a,function(a,f){d=Math.floor(Math.random()*(f+1));b[f]=b[d];b[d]=a});return b};b.sortBy=function(a,c,d){var e=b.isFunction(c)?c:function(a){return a[c]};return b.pluck(b.map(a,function(a,b,c){return{value:a,criteria:e.call(d,a,b,c)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c===void 0?1:d===void 0?-1:c<d?-1:c>d?1:0}),"value")};b.groupBy=function(a,c){var d={},e=b.isFunction(c)?c:function(a){return a[c]};
j(a,function(a,b){var c=e(a,b);(d[c]||(d[c]=[])).push(a)});return d};b.sortedIndex=function(a,c,d){d||(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){return!a?[]:b.isArray(a)||b.isArguments(a)?i.call(a):a.toArray&&b.isFunction(a.toArray)?a.toArray():b.values(a)};b.size=function(a){return b.isArray(a)?a.length:b.keys(a).length};b.first=b.head=b.take=function(a,b,d){return b!=null&&!d?i.call(a,0,b):a[0]};b.initial=function(a,b,d){return i.call(a,
0,a.length-(b==null||d?1:b))};b.last=function(a,b,d){return b!=null&&!d?i.call(a,Math.max(a.length-b,0)):a[a.length-1]};b.rest=b.tail=function(a,b,d){return i.call(a,b==null||d?1:b)};b.compact=function(a){return b.filter(a,function(a){return!!a})};b.flatten=function(a,c){return b.reduce(a,function(a,e){if(b.isArray(e))return a.concat(c?e:b.flatten(e));a[a.length]=e;return a},[])};b.without=function(a){return b.difference(a,i.call(arguments,1))};b.uniq=b.unique=function(a,c,d){var d=d?b.map(a,d):a,
e=[];a.length<3&&(c=true);b.reduce(d,function(d,g,h){if(c?b.last(d)!==g||!d.length:!b.include(d,g)){d.push(g);e.push(a[h])}return d},[]);return e};b.union=function(){return b.uniq(b.flatten(arguments,true))};b.intersection=b.intersect=function(a){var c=i.call(arguments,1);return b.filter(b.uniq(a),function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a){var c=b.flatten(i.call(arguments,1),true);return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=
i.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,c,d){if(a==null)return-1;var e;if(d){d=b.sortedIndex(a,c);return a[d]===c?d:-1}if(q&&a.indexOf===q)return a.indexOf(c);d=0;for(e=a.length;d<e;d++)if(d in a&&a[d]===c)return d;return-1};b.lastIndexOf=function(a,b){if(a==null)return-1;if(F&&a.lastIndexOf===F)return a.lastIndexOf(b);for(var d=a.length;d--;)if(d in a&&a[d]===b)return d;return-1};b.range=function(a,b,d){if(arguments.length<=
1){b=a||0;a=0}for(var d=arguments[2]||1,e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;){g[f++]=a;a=a+d}return g};var H=function(){};b.bind=function(a,c){var d,e;if(a.bind===t&&t)return t.apply(a,i.call(arguments,1));if(!b.isFunction(a))throw new TypeError;e=i.call(arguments,2);return d=function(){if(!(this instanceof d))return a.apply(c,e.concat(i.call(arguments)));H.prototype=a.prototype;var b=new H,g=a.apply(b,e.concat(i.call(arguments)));return Object(g)===g?g:b}};b.bindAll=function(a){var c=
i.call(arguments,1);c.length==0&&(c=b.functions(a));j(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,c){var d={};c||(c=b.identity);return function(){var e=c.apply(this,arguments);return b.has(d,e)?d[e]:d[e]=a.apply(this,arguments)}};b.delay=function(a,b){var d=i.call(arguments,2);return setTimeout(function(){return a.apply(null,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(i.call(arguments,1)))};b.throttle=function(a,c){var d,e,f,g,h,i,j=b.debounce(function(){h=
g=false},c);return function(){d=this;e=arguments;f||(f=setTimeout(function(){f=null;h&&a.apply(d,e);j()},c));g?h=true:i=a.apply(d,e);j();g=true;return i}};b.debounce=function(a,b,d){var e;return function(){var f=this,g=arguments;d&&!e&&a.apply(f,g);clearTimeout(e);e=setTimeout(function(){e=null;d||a.apply(f,g)},b)}};b.once=function(a){var b=false,d;return function(){if(b)return d;b=true;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=[a].concat(i.call(arguments,0));
return b.apply(this,d)}};b.compose=function(){var a=arguments;return function(){for(var b=arguments,d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=function(a,b){return a<=0?b():function(){if(--a<1)return b.apply(this,arguments)}};b.keys=L||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var c=[],d;for(d in a)b.has(a,d)&&(c[c.length]=d);return c};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&
c.push(d);return c.sort()};b.extend=function(a){j(i.call(arguments,1),function(b){for(var d in b)a[d]=b[d]});return a};b.pick=function(a){var c={};j(b.flatten(i.call(arguments,1)),function(b){b in a&&(c[b]=a[b])});return c};b.defaults=function(a){j(i.call(arguments,1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return!b.isObject(a)?a:b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,b){return r(a,b,[])};b.isEmpty=
function(a){if(a==null)return true;if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(b.has(a,c))return false;return true};b.isElement=function(a){return!!(a&&a.nodeType==1)};b.isArray=p||function(a){return l.call(a)=="[object Array]"};b.isObject=function(a){return a===Object(a)};b.isArguments=function(a){return l.call(a)=="[object Arguments]"};b.isArguments(arguments)||(b.isArguments=function(a){return!(!a||!b.has(a,"callee"))});b.isFunction=function(a){return l.call(a)=="[object Function]"};
b.isString=function(a){return l.call(a)=="[object String]"};b.isNumber=function(a){return l.call(a)=="[object Number]"};b.isFinite=function(a){return b.isNumber(a)&&isFinite(a)};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===true||a===false||l.call(a)=="[object Boolean]"};b.isDate=function(a){return l.call(a)=="[object Date]"};b.isRegExp=function(a){return l.call(a)=="[object RegExp]"};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.has=function(a,
b){return K.call(a,b)};b.noConflict=function(){s._=I;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.escape=function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")};b.result=function(a,c){if(a==null)return null;var d=a[c];return b.isFunction(d)?d.call(a):d};b.mixin=function(a){j(b.functions(a),function(c){M(c,b[c]=a[c])})};var N=0;b.uniqueId=
function(a){var b=N++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var u=/.^/,n={"\\":"\\","'":"'",r:"\r",n:"\n",t:"\t",u2028:"\u2028",u2029:"\u2029"},v;for(v in n)n[n[v]]=v;var O=/\\|'|\r|\n|\t|\u2028|\u2029/g,P=/\\(\\|'|r|n|t|u2028|u2029)/g,w=function(a){return a.replace(P,function(a,b){return n[b]})};b.template=function(a,c,d){d=b.defaults(d||{},b.templateSettings);a="__p+='"+a.replace(O,function(a){return"\\"+n[a]}).replace(d.escape||
u,function(a,b){return"'+\n_.escape("+w(b)+")+\n'"}).replace(d.interpolate||u,function(a,b){return"'+\n("+w(b)+")+\n'"}).replace(d.evaluate||u,function(a,b){return"';\n"+w(b)+"\n;__p+='"})+"';\n";d.variable||(a="with(obj||{}){\n"+a+"}\n");var a="var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n"+a+"return __p;\n",e=new Function(d.variable||"obj","_",a);if(c)return e(c,b);c=function(a){return e.call(this,a,b)};c.source="function("+(d.variable||"obj")+"){\n"+a+"}";return c};
b.chain=function(a){return b(a).chain()};var m=function(a){this._wrapped=a};b.prototype=m.prototype;var x=function(a,c){return c?b(a).chain():a},M=function(a,c){m.prototype[a]=function(){var a=i.call(arguments);J.call(a,this._wrapped);return x(c.apply(b,a),this._chain)}};b.mixin(b);j("pop,push,reverse,shift,sort,splice,unshift".split(","),function(a){var b=k[a];m.prototype[a]=function(){var d=this._wrapped;b.apply(d,arguments);var e=d.length;(a=="shift"||a=="splice")&&e===0&&delete d[0];return x(d,
this._chain)}});j(["concat","join","slice"],function(a){var b=k[a];m.prototype[a]=function(){return x(b.apply(this._wrapped,arguments),this._chain)}});m.prototype.chain=function(){this._chain=true;return this};m.prototype.value=function(){return this._wrapped}}).call(this);

(function() {
//! tabcoreslim.debug.js
//

// (function() {

Type.registerNamespace('tab');

////////////////////////////////////////////////////////////////////////////////
// tab.EscapingUtil

tab.EscapingUtil = function tab_EscapingUtil() {
}
tab.EscapingUtil.escapeHtml = function tab_EscapingUtil$escapeHtml(html) {
    var escaped = (html || '');
    escaped = escaped.replace(new RegExp('&', 'g'), '&amp;');
    escaped = escaped.replace(new RegExp('<', 'g'), '&lt;');
    escaped = escaped.replace(new RegExp('>', 'g'), '&gt;');
    escaped = escaped.replace(new RegExp('"', 'g'), '&quot;');
    escaped = escaped.replace(new RegExp("'", 'g'), '&#39;');
    escaped = escaped.replace(new RegExp('/', 'g'), '&#47;');
    return escaped;
}


////////////////////////////////////////////////////////////////////////////////
// tab.WindowHelper

tab.WindowHelper = function tab_WindowHelper(window) {
    this._window = window;
}
tab.WindowHelper.get_windowSelf = function tab_WindowHelper$get_windowSelf() {
    return window.self;
}
tab.WindowHelper.close = function tab_WindowHelper$close(window) {
    window.close();
}
tab.WindowHelper.getOpener = function tab_WindowHelper$getOpener(window) {
    return window.opener;
}
tab.WindowHelper.getLocation = function tab_WindowHelper$getLocation(window) {
    return window.location;
}
tab.WindowHelper.getPathAndSearch = function tab_WindowHelper$getPathAndSearch(window) {
    return window.location.pathname + window.location.search;
}
tab.WindowHelper.setLocationHref = function tab_WindowHelper$setLocationHref(window, href) {
    window.location.href = href;
}
tab.WindowHelper.locationReplace = function tab_WindowHelper$locationReplace(window, url) {
    window.location.replace(url);
}
tab.WindowHelper.open = function tab_WindowHelper$open(href, target, options) {
    return window.open(href, target, options);
}
tab.WindowHelper.reload = function tab_WindowHelper$reload(w, foreGet) {
    w.location.reload(foreGet);
}
tab.WindowHelper.requestAnimationFrame = function tab_WindowHelper$requestAnimationFrame(action) {
    return tab.WindowHelper._requestAnimationFrameFunc(action);
}
tab.WindowHelper.cancelAnimationFrame = function tab_WindowHelper$cancelAnimationFrame(animationId) {
    if (ss.isValue(animationId)) {
        tab.WindowHelper._cancelAnimationFrameFunc(animationId);
    }
}
tab.WindowHelper._setDefaultRequestAnimationFrameImpl = function tab_WindowHelper$_setDefaultRequestAnimationFrameImpl() {
    var lastTime = 0;
    tab.WindowHelper._requestAnimationFrameFunc = function(callback) {
        var curTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (curTime - lastTime));
        lastTime = curTime + timeToCall;
        var id = window.setTimeout(function() {
            callback();
        }, timeToCall);
        return id;
    };
}
tab.WindowHelper.prototype = {
    _window: null,
    
    get_pageXOffset: function tab_WindowHelper$get_pageXOffset() {
        return tab.WindowHelper._pageXOffsetFunc(this._window);
    },
    
    get_pageYOffset: function tab_WindowHelper$get_pageYOffset() {
        return tab.WindowHelper._pageYOffsetFunc(this._window);
    },
    
    get_clientWidth: function tab_WindowHelper$get_clientWidth() {
        return tab.WindowHelper._clientWidthFunc(this._window);
    },
    
    get_clientHeight: function tab_WindowHelper$get_clientHeight() {
        return tab.WindowHelper._clientHeightFunc(this._window);
    },
    
    get_innerWidth: function tab_WindowHelper$get_innerWidth() {
        return tab.WindowHelper._innerWidthFunc(this._window);
    },
    
    get_outerWidth: function tab_WindowHelper$get_outerWidth() {
        return tab.WindowHelper._outerWidthFunc(this._window);
    },
    
    get_innerHeight: function tab_WindowHelper$get_innerHeight() {
        return tab.WindowHelper._innerHeightFunc(this._window);
    },
    
    get_outerHeight: function tab_WindowHelper$get_outerHeight() {
        return tab.WindowHelper._outerHeightFunc(this._window);
    },
    
    get_screenLeft: function tab_WindowHelper$get_screenLeft() {
        return tab.WindowHelper._screenLeftFunc(this._window);
    },
    
    get_screenTop: function tab_WindowHelper$get_screenTop() {
        return tab.WindowHelper._screenTopFunc(this._window);
    }
}


tab.EscapingUtil.registerClass('tab.EscapingUtil');
tab.WindowHelper.registerClass('tab.WindowHelper');
tab.WindowHelper._innerWidthFunc = null;
tab.WindowHelper._innerHeightFunc = null;
tab.WindowHelper._clientWidthFunc = null;
tab.WindowHelper._clientHeightFunc = null;
tab.WindowHelper._pageXOffsetFunc = null;
tab.WindowHelper._pageYOffsetFunc = null;
tab.WindowHelper._screenLeftFunc = null;
tab.WindowHelper._screenTopFunc = null;
tab.WindowHelper._outerWidthFunc = null;
tab.WindowHelper._outerHeightFunc = null;
tab.WindowHelper._requestAnimationFrameFunc = null;
tab.WindowHelper._cancelAnimationFrameFunc = null;
(function () {
    if (('innerWidth' in window)) {
        tab.WindowHelper._innerWidthFunc = function(w) {
            return w.innerWidth;
        };
    }
    else {
        tab.WindowHelper._innerWidthFunc = function(w) {
            return w.document.documentElement.offsetWidth;
        };
    }
    if (('outerWidth' in window)) {
        tab.WindowHelper._outerWidthFunc = function(w) {
            return w.outerWidth;
        };
    }
    else {
        tab.WindowHelper._outerWidthFunc = tab.WindowHelper._innerWidthFunc;
    }
    if (('innerHeight' in window)) {
        tab.WindowHelper._innerHeightFunc = function(w) {
            return w.innerHeight;
        };
    }
    else {
        tab.WindowHelper._innerHeightFunc = function(w) {
            return w.document.documentElement.offsetHeight;
        };
    }
    if (('outerHeight' in window)) {
        tab.WindowHelper._outerHeightFunc = function(w) {
            return w.outerHeight;
        };
    }
    else {
        tab.WindowHelper._outerHeightFunc = tab.WindowHelper._innerHeightFunc;
    }
    if (('clientWidth' in window)) {
        tab.WindowHelper._clientWidthFunc = function(w) {
            return w.clientWidth;
        };
    }
    else {
        tab.WindowHelper._clientWidthFunc = function(w) {
            return w.document.documentElement.clientWidth;
        };
    }
    if (('clientHeight' in window)) {
        tab.WindowHelper._clientHeightFunc = function(w) {
            return w.clientHeight;
        };
    }
    else {
        tab.WindowHelper._clientHeightFunc = function(w) {
            return w.document.documentElement.clientHeight;
        };
    }
    if (ss.isValue(window.self.pageXOffset)) {
        tab.WindowHelper._pageXOffsetFunc = function(w) {
            return w.pageXOffset;
        };
    }
    else {
        tab.WindowHelper._pageXOffsetFunc = function(w) {
            return w.document.documentElement.scrollLeft;
        };
    }
    if (ss.isValue(window.self.pageYOffset)) {
        tab.WindowHelper._pageYOffsetFunc = function(w) {
            return w.pageYOffset;
        };
    }
    else {
        tab.WindowHelper._pageYOffsetFunc = function(w) {
            return w.document.documentElement.scrollTop;
        };
    }
    if (('screenLeft' in window)) {
        tab.WindowHelper._screenLeftFunc = function(w) {
            return w.screenLeft;
        };
    }
    else {
        tab.WindowHelper._screenLeftFunc = function(w) {
            return w.screenX;
        };
    }
    if (('screenTop' in window)) {
        tab.WindowHelper._screenTopFunc = function(w) {
            return w.screenTop;
        };
    }
    else {
        tab.WindowHelper._screenTopFunc = function(w) {
            return w.screenY;
        };
    }
    var DefaultRequestName = 'requestAnimationFrame';
    var DefaultCancelName = 'cancelAnimationFrame';
    var vendors = [ 'ms', 'moz', 'webkit', 'o' ];
    var requestFuncName = null;
    var cancelFuncName = null;
    if ((DefaultRequestName in window)) {
        requestFuncName = DefaultRequestName;
    }
    if ((DefaultCancelName in window)) {
        cancelFuncName = DefaultCancelName;
    }
    for (var ii = 0; ii < vendors.length && (requestFuncName == null || cancelFuncName == null); ++ii) {
        var vendor = vendors[ii];
        var funcName = vendor + 'RequestAnimationFrame';
        if (requestFuncName == null && (funcName in window)) {
            requestFuncName = funcName;
        }
        if (cancelFuncName == null) {
            funcName = vendor + 'CancelAnimationFrame';
            if ((funcName in window)) {
                cancelFuncName = funcName;
            }
            funcName = vendor + 'CancelRequestAnimationFrame';
            if ((funcName in window)) {
                cancelFuncName = funcName;
            }
        }
    }
    if (requestFuncName != null) {
        tab.WindowHelper._requestAnimationFrameFunc = function(callback) {
            return window[requestFuncName](callback);
        };
    }
    else {
        tab.WindowHelper._setDefaultRequestAnimationFrameImpl();
    }
    if (cancelFuncName != null) {
        tab.WindowHelper._cancelAnimationFrameFunc = function(animationId) {
            window[cancelFuncName](animationId);
        };
    }
    else {
        tab.WindowHelper._cancelAnimationFrameFunc = function(id) {
            window.clearTimeout(id);
        };
    }
})();

// }());


Type.registerNamespace('tableau.types');

////////////////////////////////////////////////////////////////////////////////
// tableau.types.FloatingToolbarVisibility

tableau.types.FloatingToolbarVisibility = function() { };
tableau.types.FloatingToolbarVisibility.prototype = {
    auto: 'auto', 
    show: 'show', 
    hide: 'hide'
}
tableau.types.FloatingToolbarVisibility.registerEnum('tableau.types.FloatingToolbarVisibility', false);


////////////////////////////////////////////////////////////////////////////////
// tableau.types.PointerToolMode

tableau.types.PointerToolMode = function() { };
tableau.types.PointerToolMode.prototype = {
    silent: 'silent', 
    singleSelect: 'singleSelect', 
    rectSelect: 'rectSelect', 
    lassoSelect: 'lassoSelect', 
    radialSelect: 'radialSelect', 
    zoom: 'zoom', 
    pan: 'pan'
}
tableau.types.PointerToolMode.registerEnum('tableau.types.PointerToolMode', false);


////////////////////////////////////////////////////////////////////////////////
// tableau.types.SelectAction

tableau.types.SelectAction = function() { };
tableau.types.SelectAction.prototype = {
    simple: 'simple', 
    toggle: 'toggle', 
    range: 'range', 
    menu: 'menu'
}
tableau.types.SelectAction.registerEnum('tableau.types.SelectAction', false);


Type.registerNamespace('tab');

////////////////////////////////////////////////////////////////////////////////
// tab.ILogAppender

tab.ILogAppender = function() { };
tab.ILogAppender.prototype = {
    addFilter : null,
    removeFilter : null,
    clearFilters : null,
    log : null
}
tab.ILogAppender.registerInterface('tab.ILogAppender');


////////////////////////////////////////////////////////////////////////////////
// tab.LoggerLevel

tab.LoggerLevel = function() { };
tab.LoggerLevel.prototype = {
    all: 0, 
    debug: 1, 
    info: 2, 
    warn: 3, 
    error: 4, 
    off: 5
}
tab.LoggerLevel.registerEnum('tab.LoggerLevel', false);


////////////////////////////////////////////////////////////////////////////////
// tab.Circle

tab.$create_Circle = function tab_Circle(center, radius) {
    var $o = { };
    $o.center = center;
    $o.radius = radius;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// tab.FeatureParam

tab.FeatureParam = function() { };
tab.FeatureParam.prototype = {
    unknown: 0, 
    transparentBackground: 3, 
    newFilter: 4, 
    fieldTypeConversion: 5, 
    quickFilterFormatting: 6, 
    responsiveUi: 7, 
    clientErrorReporting: 8, 
    newToolbar: 9, 
    buttonDelay: 11, 
    hoverDelay: 12, 
    lassoSelection: 13, 
    radialSelection: 14, 
    analyticsPane: 15, 
    newSelectionTools: 16, 
    newBrowserToolbar: 17, 
    maxTooltipWhitespace: 18, 
    mapsUseLeafletForGeoSearch: 19, 
    calcDialogFuncList: 20, 
    selectionToolsMobile: 23, 
    formattedFlipboardNavigator: 24, 
    collapseSidePane: 25, 
    mapsSearchOnTheLeftHandSide: 26, 
    newCaptionToolbar: 27, 
    mapsSearchDebugAlwaysShow: 28, 
    aoPaneUI: 29, 
    categoricalHeadersVisualFeedback: 30, 
    analyticsObjectsDragToViz: 31
}
tab.FeatureParam.registerEnum('tab.FeatureParam', false);


////////////////////////////////////////////////////////////////////////////////
// tab.DataValueStruct

tab.$create_DataValueStruct = function tab_DataValueStruct(type, value) {
    var $o = { };
    $o.t = type;
    $o.v = value;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// tab.Delta

tab.$create_Delta = function tab_Delta(x, y, s) {
    var $o = { };
    $o.x = x;
    $o.y = y;
    $o.scale = s;
    $o.w = 0;
    $o.h = 0;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// tab.DojoCoords

tab.$create_DojoCoords = function tab_DojoCoords() { return {}; }


////////////////////////////////////////////////////////////////////////////////
// tab.DateTimeAutoFormatMode

tab.DateTimeAutoFormatMode = function() { };
tab.DateTimeAutoFormatMode.prototype = {
    showDateOnly: 0, 
    showTimeOnly: 1, 
    showFullDateTime: 2
}
tab.DateTimeAutoFormatMode.registerEnum('tab.DateTimeAutoFormatMode', false);


Type.registerNamespace('tableau');

////////////////////////////////////////////////////////////////////////////////
// tab.FormattingInfo

tab.$create_FormattingInfo = function tab_FormattingInfo() { return {}; }


////////////////////////////////////////////////////////////////////////////////
// tab.LocaleFormattingStrings

tab.$create_LocaleFormattingStrings = function tab_LocaleFormattingStrings() { return {}; }


////////////////////////////////////////////////////////////////////////////////
// tab.PathnameKey

tab.PathnameKey = function() { };
tab.PathnameKey.prototype = {
    workbookName: 2, 
    sheetId: 3, 
    authoringSheet: 4
}
tab.PathnameKey.registerEnum('tab.PathnameKey', false);


////////////////////////////////////////////////////////////////////////////////
// tab.Point

tab.$create_Point = function tab_Point(x, y) {
    var $o = { };
    $o.x = x;
    $o.y = y;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// tab.PointF

tab.$create_PointF = function tab_PointF(x, y) {
    var $o = { };
    $o.x = x;
    $o.y = y;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// tab.Rect

tab.$create_Rect = function tab_Rect(l, t, w, h) {
    var $o = { };
    $o.l = l;
    $o.t = t;
    $o.w = w;
    $o.h = h;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// tab.RectXY

tab.$create_RectXY = function tab_RectXY(x, y, w, h) {
    var $o = { };
    $o.x = x;
    $o.y = y;
    $o.w = w;
    $o.h = h;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// tab.DoubleRectXY

tab.$create_DoubleRectXY = function tab_DoubleRectXY(x, y, w, h) {
    var $o = { };
    $o.x = x;
    $o.y = y;
    $o.w = w;
    $o.h = h;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// tab.BBoxRectF

tab.$create_BBoxRectF = function tab_BBoxRectF(minX, minY, maxX, maxY) {
    var $o = { };
    $o.minX = minX;
    $o.minY = minY;
    $o.maxX = maxX;
    $o.maxY = maxY;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// tab.RegionRect

tab.$create_RegionRect = function tab_RegionRect(l, t, w, h, region) {
    var $o = { };
    $o.x = l;
    $o.y = t;
    $o.w = w;
    $o.h = h;
    $o.r = region;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// tab.Size

tab.$create_Size = function tab_Size(w, h) {
    var $o = { };
    $o.w = w;
    $o.h = h;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// tab.SizeF

tab.$create_SizeF = function tab_SizeF(w, h) {
    var $o = { };
    $o.w = w;
    $o.h = h;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// tab.TransformationType

tab.TransformationType = function() { };
tab.TransformationType.prototype = {
    none: 0, 
    pixelToDomain: 1, 
    domainToPixel: 2, 
    worldOffset: 3
}
tab.TransformationType.registerEnum('tab.TransformationType', false);


////////////////////////////////////////////////////////////////////////////////
// tab.TupleStruct

tab.$create_TupleStruct = function tab_TupleStruct(display, selected, dataValues) {
    var $o = { };
    $o.d = display;
    $o.s = selected;
    $o.t = dataValues;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// tableau.types.ColumnClass

tableau.types.ColumnClass = function() { };
tableau.types.ColumnClass.prototype = {
    CLASS_METADATA: 0, 
    CLASS_DATABASE: 1, 
    CLASS_NUMERICBIN: 2, 
    CLASS_CATEGORICALBIN: 3, 
    CLASS_INSTANCE: 4, 
    CLASS_MDXCALC: 5, 
    CLASS_USERCALC: 6, 
    CLASS_DANGLING: 7, 
    CLASS_LOCALDATA: 8
}
tableau.types.ColumnClass.registerEnum('tableau.types.ColumnClass', false);


////////////////////////////////////////////////////////////////////////////////
// tableau.types.DrillState

tableau.types.DrillState = function() { };
tableau.types.DrillState.prototype = {
    DRILLNONE: 0, 
    DRILLDOWN: 1, 
    DRILLUP: 2, 
    DRILLBOTH: 3
}
tableau.types.DrillState.registerEnum('tableau.types.DrillState', false);


////////////////////////////////////////////////////////////////////////////////
// tableau.types.DataSpecial

tableau.types.DataSpecial = function tableau_types_DataSpecial() {
}


////////////////////////////////////////////////////////////////////////////////
// tableau.types.DataType

tableau.types.DataType = function tableau_types_DataType() {
}


////////////////////////////////////////////////////////////////////////////////
// tableau.types.TableauTypesFieldRole

tableau.types.TableauTypesFieldRole = function tableau_types_TableauTypesFieldRole() {
}


////////////////////////////////////////////////////////////////////////////////
// tab.BaseLogAppender

tab.BaseLogAppender = function tab_BaseLogAppender() {
    this._filters = [];
}
tab.BaseLogAppender.prototype = {
    _filters: null,
    
    clearFilters: function tab_BaseLogAppender$clearFilters() {
        this._filters.clear();
    },
    
    addFilter: function tab_BaseLogAppender$addFilter(f) {
        this._filters.add(f);
    },
    
    removeFilter: function tab_BaseLogAppender$removeFilter(f) {
        this._filters.remove(f);
    },
    
    log: function tab_BaseLogAppender$log(source, level, message, args) {
        var $enum1 = ss.IEnumerator.getEnumerator(this._filters);
        while ($enum1.moveNext()) {
            var filter = $enum1.current;
            if (!filter(source, level)) {
                continue;
            }
            this.logInternal(source, level, message, args);
            return;
        }
    },
    
    formatMessage: function tab_BaseLogAppender$formatMessage(message, args) {
        if (ss.isNullOrUndefined(args) || !args.length) {
            return message;
        }
        var sb = new ss.StringBuilder();
        var argNum = 0;
        var prevPercent = false;
        for (var i = 0; i < message.length; i++) {
            var currChar = message.charAt(i);
            if (currChar === '%') {
                if (prevPercent) {
                    sb.append('%');
                    prevPercent = false;
                }
                else {
                    prevPercent = true;
                }
            }
            else {
                if (prevPercent) {
                    switch (currChar) {
                        case 'b':
                        case 's':
                        case 'd':
                        case 'n':
                        case 'o':
                            sb.append((args.length > argNum) ? args[argNum] : '');
                            argNum++;
                            break;
                    }
                }
                else {
                    sb.append(currChar);
                }
                prevPercent = false;
            }
        }
        return sb.toString();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ConsoleLogAppender

tab.ConsoleLogAppender = function tab_ConsoleLogAppender() {
    tab.ConsoleLogAppender.initializeBase(this);
}
tab.ConsoleLogAppender.enableLogging = function tab_ConsoleLogAppender$enableLogging(filter) {
    if (ss.isNullOrUndefined(tab.ConsoleLogAppender._globalAppender$1)) {
        tab.ConsoleLogAppender._globalAppender$1 = new tab.ConsoleLogAppender();
        tab.Logger.addAppender(tab.ConsoleLogAppender._globalAppender$1);
    }
    tab.ConsoleLogAppender._globalAppender$1.addFilter((filter || function() {
        return true;
    }));
}
tab.ConsoleLogAppender.disableLogging = function tab_ConsoleLogAppender$disableLogging() {
    if (ss.isNullOrUndefined(tab.ConsoleLogAppender._globalAppender$1)) {
        return;
    }
    tab.Logger.removeAppender(tab.ConsoleLogAppender._globalAppender$1);
    tab.ConsoleLogAppender._globalAppender$1 = null;
}
tab.ConsoleLogAppender.prototype = {
    _levelMethods$1: null,
    
    logInternal: function tab_ConsoleLogAppender$logInternal(source, level, message, args) {
        if (!(typeof console === 'object')) {
            return;
        }
        message = source.get_name() + ': ' + message;
        var consoleArgs = [];
        if (tab.BrowserSupport.get_consoleLogFormating()) {
            consoleArgs = consoleArgs.concat(message).concat(args);
        }
        else {
            consoleArgs = consoleArgs.concat(this.formatMessage(message, args));
        }
        try {
            Function.prototype.apply.call(this._getConsoleMethod$1(level), console, consoleArgs);
        }
        catch ($e1) {
        }
    },
    
    _getConsoleMethod$1: function tab_ConsoleLogAppender$_getConsoleMethod$1(level) {
        if (ss.isNullOrUndefined(this._levelMethods$1)) {
            this._levelMethods$1 = {};
            this._levelMethods$1[(1).toString()] = console.log;
            this._levelMethods$1[(4).toString()] = console.error;
            this._levelMethods$1[(2).toString()] = console.info;
            this._levelMethods$1[(3).toString()] = console.warn;
        }
        return this._levelMethods$1[level.toString()] || console.log;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ErrorTrace

tab.ErrorTrace = function tab_ErrorTrace() {
}
tab.ErrorTrace.install = function tab_ErrorTrace$install() {
    var enabled = tsConfig.clientErrorReportingLevel;
    if (!String.isNullOrEmpty(enabled)) {
        if (enabled === 'debug') {
            tab.ErrorTrace._getStack = true;
        }
    }
    tab.ErrorTrace._extendToAsynchronousCallback('setTimeout');
    tab.ErrorTrace._extendToAsynchronousCallback('setInterval');
    tab.ErrorTrace.installGlobalHandler();
}
tab.ErrorTrace.wrap = function tab_ErrorTrace$wrap(func) {
    var wrapped = _.wrap(func, function(action) {
        try {
            return action.apply(this, Array.toArray(arguments));
        }
        catch (e) {
            tab.ErrorTrace.report(e, true);
            throw e;
        }
    });
    return wrapped;
}
tab.ErrorTrace._extendToAsynchronousCallback = function tab_ErrorTrace$_extendToAsynchronousCallback(functionName) {
    var originalFunction = window[functionName];
    var callback = function() {
        var args = Array.toArray(arguments).clone();
        var originalCallback = args[0];
        if (Type.getInstanceType(originalCallback) === Function) {
            args[0] = tab.ErrorTrace.wrap(originalCallback);
        }
        if (('apply' in originalFunction)) {
            return originalFunction.apply(this, args);
        }
        else {
            return originalFunction(args[0], args[1]);
        }
    };
    window[functionName] = callback;
}
tab.ErrorTrace.windowOnError = function tab_ErrorTrace$windowOnError(message, url, lineNo) {
    var stack = null;
    if (ss.isValue(tab.ErrorTrace._lastExceptionStack)) {
        tab.ErrorTrace._augmentStackTraceWithInitialElement(tab.ErrorTrace._lastExceptionStack, url, lineNo, message);
        stack = tab.ErrorTrace._lastExceptionStack;
        tab.ErrorTrace._lastExceptionStack = null;
        tab.ErrorTrace._lastException = null;
    }
    else {
        var location = new tab.StackLocation(url, lineNo);
        location.functionName = tab.ErrorTrace._guessFunctionName(location);
        location.context = tab.ErrorTrace._gatherContext(location);
        stack = new tab.StackTrace('onError', message);
        stack.name = 'window.onError';
        stack.locations = [location];
    }
    tab.ErrorTrace._queuedTraces.push(stack);
    if (ss.isValue(tab.ErrorTrace._oldOnErrorHandler)) {
        tab.ErrorTrace._oldOnErrorHandler.apply(this, Array.toArray(arguments));
    }
    return false;
}
tab.ErrorTrace._augmentStackTraceWithInitialElement = function tab_ErrorTrace$_augmentStackTraceWithInitialElement(stack, url, lineNo, message) {
    var initial = new tab.StackLocation(url, lineNo);
    if (ss.isValue(initial.url) && ss.isValue(initial.lineNo)) {
        stack.isIncomplete = false;
        if (ss.isNullOrUndefined(initial.functionName)) {
            initial.functionName = tab.ErrorTrace._guessFunctionName(initial);
        }
        if (ss.isNullOrUndefined(initial.context)) {
            initial.context = tab.ErrorTrace._gatherContext(initial);
        }
        var reference = message.match(new RegExp(" '([^']+)' "));
        if (ss.isValue(reference) && reference.length > 1) {
            initial.columnNo = tab.ErrorTrace._findSourceInLine(reference[1], initial);
        }
        if (ss.isValue(stack.locations) && stack.locations.length > 0) {
            var top = stack.locations[0];
            if (top.url === initial.url) {
                if (top.lineNo === initial.lineNo) {
                    return false;
                }
                else if (ss.isNullOrUndefined(top.lineNo) && top.functionName === initial.functionName) {
                    top.lineNo = initial.lineNo;
                    top.context = initial.context;
                    return false;
                }
            }
        }
        stack.locations.unshift(initial);
        stack.isPartial = true;
        return true;
    }
    else {
        stack.isIncomplete = true;
    }
    return false;
}
tab.ErrorTrace._loadSource = function tab_ErrorTrace$_loadSource(url) {
    if (!tab.ErrorTrace._remoteFetching) {
        return '';
    }
    try {
        var srcRequest = new XMLHttpRequest();
        srcRequest.open('GET', url, false);
        srcRequest.send('');
        return srcRequest.responseText;
    }
    catch ($e1) {
        return '';
    }
}
tab.ErrorTrace._getSource = function tab_ErrorTrace$_getSource(url) {
    if (ss.isNullOrUndefined(url)) {
        return [];
    }
    if (!Object.keyExists(tab.ErrorTrace._sourceCache, url)) {
        var source = '';
        if ((url).indexOf(document.domain) > -1) {
            source = tab.ErrorTrace._loadSource(url);
        }
        tab.ErrorTrace._sourceCache[url] = (String.isNullOrEmpty(source)) ? [] : source.split('\n');
    }
    return tab.ErrorTrace._sourceCache[url];
}
tab.ErrorTrace._findSourceInLine = function tab_ErrorTrace$_findSourceInLine(fragment, location) {
    var source = tab.ErrorTrace._getSource(location.url);
    var re = new RegExp('\\b' + tab.ErrorTrace._escapeRegexp(fragment) + '\\b');
    if (ss.isValue(source) && source.length > location.lineNo) {
        var matches = re.exec(source[location.lineNo]);
        if (ss.isValue(matches)) {
            return matches.index;
        }
    }
    return -1;
}
tab.ErrorTrace._guessFunctionName = function tab_ErrorTrace$_guessFunctionName(location) {
    var functionArgNames = new RegExp('function ([^(]*)\\(([^)]*)\\)');
    var guessFunction = new RegExp("['\"]?([0-9A-Za-z$_]+)['\"]?\\s*[:=]\\s*(function|eval|new Function)");
    var line = '';
    var maxLines = 10;
    var source = tab.ErrorTrace._getSource(location.url);
    var matches;
    if (!source.length) {
        return '?';
    }
    for (var i = 0; i < maxLines; i++) {
        line = source[location.lineNo - 1] + line;
        if (!String.isNullOrEmpty(line)) {
            matches = guessFunction.exec(line);
            if (ss.isValue(matches) && matches.length > 0) {
                return matches[1];
            }
            matches = functionArgNames.exec(line);
            if (ss.isValue(matches) && matches.length > 0) {
                return matches[1];
            }
        }
    }
    return '?';
}
tab.ErrorTrace._gatherContext = function tab_ErrorTrace$_gatherContext(location) {
    var source = tab.ErrorTrace._getSource(location.url);
    if (ss.isNullOrUndefined(source) || !source.length) {
        return null;
    }
    var context = [];
    var linesBefore = Math.floor(tab.ErrorTrace._linesOfContext / 2);
    var linesAfter = linesBefore + (tab.ErrorTrace._linesOfContext % 2);
    var start = Math.max(0, location.lineNo - linesBefore - 1);
    var end = Math.min(source.length, location.lineNo + linesAfter - 1);
    location.lineNo -= 1;
    for (var i = start; i < end; i++) {
        if (!String.isNullOrEmpty(source[i])) {
            context.push(source[i]);
        }
    }
    return context;
}
tab.ErrorTrace._escapeRegexp = function tab_ErrorTrace$_escapeRegexp(input) {
    return input.replace(new RegExp('[\\-\\[\\]{}()*+?.,\\\\\\^$|#]', 'g'), '\\\\$&');
}
tab.ErrorTrace._escapeCodeAsRegexpForMatchingInsideHTML = function tab_ErrorTrace$_escapeCodeAsRegexpForMatchingInsideHTML(body) {
    return tab.ErrorTrace._escapeRegexp(body).replaceAll('<', '(?:<|&lt;)').replaceAll('>', '(?:>|&gt;)').replaceAll('&', '(?:&|&amp;)').replaceAll('"', '(?:"|&quot;)').replace(new RegExp('\\\\s+', 'g'), '\\\\s+');
}
tab.ErrorTrace._findSourceInUrls = function tab_ErrorTrace$_findSourceInUrls(re, urls) {
    var source = null;
    var $enum1 = ss.IEnumerator.getEnumerator(urls);
    while ($enum1.moveNext()) {
        var url = $enum1.current;
        source = tab.ErrorTrace._getSource(url);
        if (ss.isValue(source) && source.length > 0) {
            for (var lineNo = 0; lineNo < source.length; lineNo++) {
                var matches = re.exec(source[lineNo]);
                if (ss.isValue(matches) && matches.length > 0) {
                    var location = new tab.StackLocation(url, lineNo);
                    location.columnNo = matches.index;
                    return location;
                }
            }
        }
    }
    return null;
}
tab.ErrorTrace._getStackTraceFor = function tab_ErrorTrace$_getStackTraceFor(e, depth) {
    if (ss.isNullOrUndefined(depth)) {
        depth = 0;
    }
    var defaultTrace = new tab.StackTrace('stack', e.message);
    defaultTrace.name = e.name;
    if (tab.ErrorTrace._getStack) {
        var stackTraceComputers = [];
        stackTraceComputers.push(tab.ErrorTrace._computeStackTraceFromStackTraceProp);
        stackTraceComputers.push(tab.ErrorTrace.computeStackTraceByWalkingCallerChain);
        var $enum1 = ss.IEnumerator.getEnumerator(stackTraceComputers);
        while ($enum1.moveNext()) {
            var stackTraceComputer = $enum1.current;
            var stack = null;
            try {
                stack = stackTraceComputer(e);
            }
            catch (inner) {
                if (tab.ErrorTrace._shouldReThrow) {
                    throw inner;
                }
            }
            if (ss.isValue(stack)) {
                return stack;
            }
        }
    }
    else {
        return defaultTrace;
    }
    defaultTrace.traceMode = 'failed';
    return defaultTrace;
}
tab.ErrorTrace._ofCaller = function tab_ErrorTrace$_ofCaller(depth) {
    if (ss.isNullOrUndefined(depth)) {
        depth = 0;
    }
    else {
        depth += 1;
    }
    try {
        throw new Error('');
    }
    catch (e) {
        return tab.ErrorTrace._getStackTraceFor(e, depth + 1);
    }
}
tab.ErrorTrace.computeStackTraceByWalkingCallerChain = function tab_ErrorTrace$computeStackTraceByWalkingCallerChain(e) {
    var functionName = new RegExp('function\\s+([_$a-zA-Z\u00a0-\\uFFFF][_$a-zA-Z0-9\u00a0-\\uFFFF]*)?\\s*\\(', 'i');
    var locations = [];
    var funcs = {};
    var recursion = false;
    var curr = null;
    for (curr = tab.ErrorTrace.computeStackTraceByWalkingCallerChain.caller; ss.isValue(curr) && !recursion; curr = curr.caller) {
        if (curr === tab.ErrorTrace) {
            continue;
        }
        var item = new tab.StackLocation(null, 0);
        if (ss.isValue(curr.name)) {
            item.functionName = curr.name;
        }
        else {
            var parts = functionName.exec(curr.toString());
            if (ss.isValue(parts) && parts.length > 1) {
                item.functionName = parts[1];
            }
        }
        var source = tab.ErrorTrace._findSourceByFunctionBody(curr);
        if (ss.isValue(source)) {
            item.url = source.url;
            item.lineNo = source.lineNo;
            if (item.functionName === '?') {
                item.functionName = tab.ErrorTrace._guessFunctionName(item);
            }
            var reference = new RegExp(" '([^']+)' ").exec((e.message || e.description));
            if (ss.isValue(reference) && reference.length > 1) {
                item.columnNo = tab.ErrorTrace._findSourceInLine(reference[1], source);
            }
        }
        if (Object.keyExists(funcs, curr.toString())) {
            recursion = true;
        }
        else {
            funcs[curr.toString()] = true;
        }
        locations.push(item);
    }
    var result = new tab.StackTrace('callers', e.message);
    result.name = e.name;
    result.locations = locations;
    tab.ErrorTrace._augmentStackTraceWithInitialElement(result, (e.sourceURL || e.fileName), (e.line || e.lineNumber), (e.message || e.description));
    return result;
}
tab.ErrorTrace._findSourceByFunctionBody = function tab_ErrorTrace$_findSourceByFunctionBody(func) {
    var urls = [window.location.href];
    var scripts = document.getElementsByTagName('script');
    var code = func.toString();
    var codeMatcher = new RegExp('');
    var matcher = null;
    var body = null;
    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
        if (script.hasAttribute('src') && ss.isValue(script.getAttribute('src'))) {
            urls.push(script.getAttribute('src'));
        }
    }
    var parts = codeMatcher.exec(code);
    if (ss.isValue(parts) && parts.length > 0) {
        matcher = new RegExp(tab.ErrorTrace._escapeRegexp(code).replace(new RegExp('\\s+', 'g'), '\\\\s+'));
    }
    else {
        var name = (parts.length > 1) ? '\\\\s+' + parts[1] : '';
        var args = parts[2].split(',').join('\\\\s*,\\\\s*');
        body = tab.ErrorTrace._escapeRegexp(parts[3]).replace(new RegExp(';$'), ';?');
        matcher = new RegExp('function' + name + '\\\\s*\\\\(\\\\s*' + args + '\\\\s*\\\\)\\\\s*{\\\\s*' + body + '\\\\s*}');
    }
    var result = tab.ErrorTrace._findSourceInUrls(matcher, urls);
    if (ss.isValue(result)) {
        return result;
    }
    return null;
}
tab.ErrorTrace._computeStackTraceFromStackTraceProp = function tab_ErrorTrace$_computeStackTraceFromStackTraceProp(e) {
    if (!('stack' in e)) {
        return null;
    }
    var chromeMatcher = new RegExp('^\\s*at (?:((?:\\[object object\\])?\\S+(?: \\[as \\S+\\])?) )?\\(?((?:file|http|https):.*?):(\\d+)(?::(\\d+))?\\)?\\s*$', 'i');
    var geckoMatcher = new RegExp('^\\s*(\\S*)(?:\\((.*?)\\))?@((?:file|http|https).*?):(\\d+)(?::(\\d+))?\\s*$', 'i');
    var matcher = (tab.BrowserSupport.get_isFF()) ? geckoMatcher : chromeMatcher;
    var lines = (e.stack).split('\n');
    var locations = [];
    var element = null;
    var reference = new RegExp('^(.*) is undefined').exec(e.message);
    var $enum1 = ss.IEnumerator.getEnumerator(lines);
    while ($enum1.moveNext()) {
        var line = $enum1.current;
        var parts = matcher.exec(line);
        if (ss.isValue(parts) && parts.length > 5) {
            element = new tab.StackLocation(parts[3], parseInt(parts[4]));
            if (ss.isValue(parts[1])) {
                element.functionName = parts[1];
            }
            if (ss.isValue(parts[4])) {
                element.columnNo = parseInt(parts[4]);
            }
            if (ss.isValue(element.lineNo)) {
                if (ss.isNullOrUndefined(element.functionName)) {
                    element.functionName = tab.ErrorTrace._guessFunctionName(element);
                }
                element.context = tab.ErrorTrace._gatherContext(element);
            }
            locations.push(element);
        }
    }
    if (locations.length > 0 && ss.isValue(locations[0].lineNo) && ss.isNullOrUndefined(locations[0].columnNo) && ss.isValue(reference) && reference.length > 1) {
        locations[0].columnNo = tab.ErrorTrace._findSourceInLine(reference[1], locations[0]);
    }
    if (!locations.length) {
        return null;
    }
    var stack = new tab.StackTrace('stack', e.message);
    stack.name = e.name;
    stack.locations = locations;
    return stack;
}
tab.ErrorTrace.hasTraces = function tab_ErrorTrace$hasTraces() {
    return tab.ErrorTrace._queuedTraces.length > 0;
}
tab.ErrorTrace.dequeueTraces = function tab_ErrorTrace$dequeueTraces() {
    var traces = tab.ErrorTrace._queuedTraces;
    tab.ErrorTrace._queuedTraces = [];
    return traces;
}
tab.ErrorTrace.installGlobalHandler = function tab_ErrorTrace$installGlobalHandler() {
    if (tab.ErrorTrace._onErrorHandlerInstalled || !tab.ErrorTrace._collectWindowErrors) {
        return;
    }
    tab.ErrorTrace._oldOnErrorHandler = window.onerror;
    window.onerror = tab.ErrorTrace.windowOnError;
    tab.ErrorTrace._onErrorHandlerInstalled = true;
}
tab.ErrorTrace.report = function tab_ErrorTrace$report(e, rethrow) {
    if (ss.isNullOrUndefined(rethrow)) {
        rethrow = true;
    }
    if (ss.isValue(tab.ErrorTrace._lastExceptionStack)) {
        if (tab.ErrorTrace._lastException === e) {
            return;
        }
        else {
            var s = tab.ErrorTrace._lastExceptionStack;
            tab.ErrorTrace._lastExceptionStack = null;
            tab.ErrorTrace._lastException = null;
            tab.ErrorTrace._queuedTraces.push(s);
        }
    }
    var stack = tab.ErrorTrace._getStackTraceFor(e);
    tab.ErrorTrace._lastExceptionStack = stack;
    tab.ErrorTrace._lastException = e;
    window.setTimeout(function() {
        if (tab.ErrorTrace._lastException === e) {
            tab.ErrorTrace._lastExceptionStack = null;
            tab.ErrorTrace._lastException = null;
            tab.ErrorTrace._queuedTraces.push(stack);
        }
    }, ((stack.isIncomplete) ? 2000 : 0));
    if (rethrow) {
        throw e;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.StackLocation

tab.StackLocation = function tab_StackLocation(url, lineNo) {
    this.functionName = '?';
    this.url = url;
    this.lineNo = lineNo;
}
tab.StackLocation.prototype = {
    url: null,
    lineNo: 0,
    columnNo: 0,
    context: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.StackTrace

tab.StackTrace = function tab_StackTrace(traceMode, message) {
    this.userAgent = window.navigator.userAgent;
    this.traceMode = 'onError';
    this.traceMode = traceMode;
    this.message = message;
    this.url = document.URL;
    this.locations = [];
}
tab.StackTrace.prototype = {
    message: null,
    url: null,
    locations: null,
    isIncomplete: false,
    isPartial: false,
    name: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.StackTraceAppender

tab.StackTraceAppender = function tab_StackTraceAppender() {
    tab.StackTraceAppender.initializeBase(this);
}
tab.StackTraceAppender.enableLogging = function tab_StackTraceAppender$enableLogging(filter) {
    if (ss.isNullOrUndefined(tab.StackTraceAppender._globalAppender$1)) {
        tab.StackTraceAppender._globalAppender$1 = new tab.StackTraceAppender();
        tab.Logger.addAppender(tab.StackTraceAppender._globalAppender$1);
    }
    tab.StackTraceAppender._globalAppender$1.addFilter((filter || function() {
        return true;
    }));
}
tab.StackTraceAppender.disableLogging = function tab_StackTraceAppender$disableLogging() {
    if (ss.isValue(tab.StackTraceAppender._globalAppender$1)) {
        tab.Logger.removeAppender(tab.StackTraceAppender._globalAppender$1);
        tab.StackTraceAppender._globalAppender$1 = null;
    }
}
tab.StackTraceAppender.prototype = {
    
    logInternal: function tab_StackTraceAppender$logInternal(source, level, message, args) {
        message = this.formatMessage(message.replaceAll('\\n', '<br />'), args);
        if (level > 2) {
            try {
                throw new Error('Logged(' + tab.Logger.loggerLevelNames[level] + ', from ' + source.get_name() + '): ' + message);
            }
            catch (e) {
                tab.ErrorTrace.report(e, false);
            }
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.Logger

tab.Logger = function tab_Logger(name) {
    tab.Logger.initializeBase(this);
    this._name$1 = name;
}
tab.Logger.get_globalLog = function tab_Logger$get_globalLog() {
    return tab.Logger.global;
}
tab.Logger.get__appenders$1 = function tab_Logger$get__appenders$1() {
    return tab.MiscUtil.lazyInitStaticField(tab.Logger, 'appenders', function() {
        return [];
    });
}
tab.Logger.get__filters$1 = function tab_Logger$get__filters$1() {
    return tab.MiscUtil.lazyInitStaticField(tab.Logger, 'filters', function() {
        return [];
    });
}
tab.Logger.get__nullLog$1 = function tab_Logger$get__nullLog$1() {
    return tab.MiscUtil.lazyInitStaticField(tab.Logger, 'nullLog', function() {
        return new tab.Logger('');
    });
}
tab.Logger.clearFilters = function tab_Logger$clearFilters() {
    var $enum1 = ss.IEnumerator.getEnumerator(tab.Logger.get__appenders$1());
    while ($enum1.moveNext()) {
        var logAppender = $enum1.current;
        logAppender.clearFilters();
    }
    tab.Logger.get__filters$1().clear();
}
tab.Logger.filterByLogger = function tab_Logger$filterByLogger(validLogger, minLogLevel) {
    minLogLevel = (minLogLevel || 0);
    tab.Logger._addFilter$1(function(l, ll) {
        return l === validLogger && ll >= minLogLevel;
    });
}
tab.Logger.filterByType = function tab_Logger$filterByType(t, minLogLevel) {
    minLogLevel = (minLogLevel || 0);
    tab.Logger._addFilter$1(function(l, ll) {
        return ll >= minLogLevel && l.get_name() === t.get_name();
    });
}
tab.Logger.filterByName = function tab_Logger$filterByName(namePattern, minLogLevel) {
    minLogLevel = (minLogLevel || 0);
    var regex = new RegExp(namePattern, 'i');
    tab.Logger._addFilter$1(function(l, ll) {
        return ll >= minLogLevel && ss.isValue(l.get_name().match(regex));
    });
}
tab.Logger.clearAppenders = function tab_Logger$clearAppenders() {
    tab.Logger.get__appenders$1().clear();
}
tab.Logger.addAppender = function tab_Logger$addAppender(appender) {
    var $enum1 = ss.IEnumerator.getEnumerator(tab.Logger.get__filters$1());
    while ($enum1.moveNext()) {
        var filter = $enum1.current;
        appender.addFilter(filter);
    }
    tab.Logger.get__appenders$1().add(appender);
}
tab.Logger.removeAppender = function tab_Logger$removeAppender(appender) {
    tab.Logger.get__appenders$1().remove(appender);
}
tab.Logger.lazyGetLogger = function tab_Logger$lazyGetLogger(t) {
    return tab.MiscUtil.lazyInitStaticField(t, '_logger', function() {
        return tab.Logger.getLogger(t);
    });
}
tab.Logger.getLogger = function tab_Logger$getLogger(t, ll) {
    var l = tab.Logger.getLoggerWithName(t.get_name());
    if (ss.isValue(ll)) {
        tab.Logger.filterByLogger(l, ll);
    }
    return l;
}
tab.Logger.getLoggerWithName = function tab_Logger$getLoggerWithName(name) {
    return new tab.Logger(name);
}
tab.Logger._setupUrlFilters$1 = function tab_Logger$_setupUrlFilters$1() {
    var queryParams = tab.MiscUtil.getUriQueryParameters(window.self.location.search);
    if (!Object.keyExists(queryParams, ':log')) {
        return;
    }
    tab.Logger.clearFilters();
    var logParams = queryParams[':log'];
    if (!logParams.length) {
        tab.Logger.filterByName('.*', 0);
    }
    var $enum1 = ss.IEnumerator.getEnumerator(logParams);
    while ($enum1.moveNext()) {
        var logParam = $enum1.current;
        var logVals = logParam.split(':');
        var level = 1;
        if (logVals.length > 0 && ss.isValue(logVals[1])) {
            var key = logVals[1].toLowerCase();
            var index = tab.Logger.loggerLevelNames.indexOf(key);
            if (index >= 0) {
                level = index;
            }
        }
        tab.Logger.filterByName(logVals[0], level);
    }
}
tab.Logger._addFilter$1 = function tab_Logger$_addFilter$1(filterFunc) {
    tab.Logger.get__filters$1().add(filterFunc);
    var $enum1 = ss.IEnumerator.getEnumerator(tab.Logger.get__appenders$1());
    while ($enum1.moveNext()) {
        var logAppender = $enum1.current;
        logAppender.addFilter(filterFunc);
    }
}
tab.Logger.prototype = {
    _name$1: null,
    
    get_name: function tab_Logger$get_name() {
        return this._name$1;
    },
    
    debug: function tab_Logger$debug(message) {
        this._logInternal$1(1, message, Array.toArray(arguments).extract(1));
    },
    
    info: function tab_Logger$info(message) {
        this._logInternal$1(2, message, Array.toArray(arguments).extract(1));
    },
    
    warn: function tab_Logger$warn(message) {
        this._logInternal$1(3, message, Array.toArray(arguments).extract(1));
    },
    
    error: function tab_Logger$error(message) {
        this._logInternal$1(4, message, Array.toArray(arguments).extract(1));
    },
    
    log: function tab_Logger$log(level, message) {
        this._logInternal$1(level, message, Array.toArray(arguments).extract(2));
    },
    
    _logInternal$1: function tab_Logger$_logInternal$1(level, message, args) {
        try {
            var $enum1 = ss.IEnumerator.getEnumerator(tab.Logger.get__appenders$1());
            while ($enum1.moveNext()) {
                var logAppender = $enum1.current;
                logAppender.log(this, level, message, args);
            }
        }
        catch ($e2) {
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.Log

tab.Log = function tab_Log() {
}
tab.Log.get = function tab_Log$get(o) {
    return tab.Logger.lazyGetLogger(Type.getInstanceType(o));
}


////////////////////////////////////////////////////////////////////////////////
// tab.MetricsLogger

tab.MetricsLogger = function tab_MetricsLogger() {
    this._eventBuffer = [];
    this._beaconImages = [];
    this._bufferProcessTimerId = null;
    this._beaconCleanupTimerId = null;
}
tab.MetricsLogger.get_instance = function tab_MetricsLogger$get_instance() {
    if (!ss.isValue(tab.MetricsLogger._instance)) {
        tab.MetricsLogger._instance = new tab.MetricsLogger();
    }
    return tab.MetricsLogger._instance;
}
tab.MetricsLogger._formatEvent = function tab_MetricsLogger$_formatEvent(evt, verbose) {
    var delimiter = (verbose) ? ', ' : ',';
    var strBuilder = new ss.StringBuilder();
    strBuilder.append((verbose) ? tab.MetricsLogger._debugEventNames[evt.eventType] : evt.eventType);
    var count = Object.getKeyCount(evt.parameters);
    if (count > 0) {
        strBuilder.append('=');
        strBuilder.append('{');
        var i = 0;
        var propSeparator = (verbose) ? ': ' : ':';
        var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(evt.parameters));
        while ($enum1.moveNext()) {
            var key = $enum1.current;
            if (key === 'id' && evt.eventType !== 'init') {
                continue;
            }
            strBuilder.append((verbose) ? tab.MetricsLogger._debugParamNames[key] : key);
            strBuilder.append(propSeparator);
            var val = evt.parameters[key];
            tab.MetricsLogger._formatValue(strBuilder, val, verbose);
            if (++i < count) {
                strBuilder.append(delimiter);
            }
        }
        strBuilder.append('}');
    }
    return strBuilder.toString();
}
tab.MetricsLogger._formatDictionaryValues = function tab_MetricsLogger$_formatDictionaryValues(strBuilder, dict, verbose) {
    var delimiter = (verbose) ? ', ' : ',';
    var propSeparator = (verbose) ? ': ' : ':';
    var propCount = Object.getKeyCount(dict);
    var j = 0;
    var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(dict));
    while ($enum1.moveNext()) {
        var propertyName = $enum1.current;
        if (dict.hasOwnProperty(propertyName)) {
            var propertyVal = dict[propertyName];
            strBuilder.append(propertyName);
            strBuilder.append(propSeparator);
            tab.MetricsLogger._formatValue(strBuilder, propertyVal, verbose);
            if (++j < propCount) {
                strBuilder.append(delimiter);
            }
        }
    }
}
tab.MetricsLogger._formatValue = function tab_MetricsLogger$_formatValue(strBuilder, value, verbose) {
    var type = typeof(value);
    if (type === 'number' && Math.floor(value) !== value) {
        strBuilder.append((value).toFixed(1));
    }
    else if (type === 'string') {
        if (verbose) {
            strBuilder.append('"');
            strBuilder.append(value);
            strBuilder.append('"');
        }
        else {
            strBuilder.append(encodeURIComponent((value)));
        }
    }
    else if ($.isArray(value)) {
        strBuilder.append('[');
        strBuilder.append(value);
        strBuilder.append(']');
    }
    else if (type === 'object') {
        strBuilder.append('{');
        var dict = value;
        tab.MetricsLogger._formatDictionaryValues(strBuilder, dict, verbose);
        strBuilder.append('}');
    }
    else {
        strBuilder.append(value);
    }
}
tab.MetricsLogger.prototype = {
    _eventBuffer: null,
    _logger: null,
    _beaconImages: null,
    _beaconCleanupTimerId: null,
    _bufferProcessTimerId: null,
    
    logEvent: function tab_MetricsLogger$logEvent(evt) {
        if (this._eventBuffer.length >= 400) {
            this._eventBuffer.shift();
        }
        this._eventBuffer.push(evt);
        this._startProcessingTimer();
    },
    
    attach: function tab_MetricsLogger$attach() {
        tabBootstrap.MetricsController.get_instance().setEventLogger(ss.Delegate.create(this, this.logEvent));
    },
    
    _startProcessingTimer: function tab_MetricsLogger$_startProcessingTimer(delay) {
        if (ss.isValue(this._bufferProcessTimerId)) {
            return;
        }
        delay = (delay || 85);
        this._bufferProcessTimerId = window.setTimeout(ss.Delegate.create(this, this._processBufferedEvents), delay);
    },
    
    _processBufferedEvents: function tab_MetricsLogger$_processBufferedEvents() {
        this._bufferProcessTimerId = null;
        var metricsToProcess;
        if (this._eventBuffer.length > 20) {
            metricsToProcess = this._eventBuffer.slice(0, 20);
            this._eventBuffer = this._eventBuffer.slice(20);
            this._startProcessingTimer(5);
        }
        else {
            metricsToProcess = this._eventBuffer;
            this._eventBuffer = [];
        }
        this._outputEventsToConsole(metricsToProcess);
        if (tsConfig.metricsReportingEnabled) {
            try {
                this._outputEventsToServer(metricsToProcess);
            }
            catch ($e1) {
            }
        }
    },
    
    _outputEventsToConsole: function tab_MetricsLogger$_outputEventsToConsole(evts) {
        this._logger = (this._logger || tab.Logger.lazyGetLogger(tab.MetricsLogger));
        var $enum1 = ss.IEnumerator.getEnumerator(evts);
        while ($enum1.moveNext()) {
            var evt = $enum1.current;
            this._logger.debug(tab.MetricsLogger._formatEvent(evt, true));
        }
    },
    
    _outputEventsToServer: function tab_MetricsLogger$_outputEventsToServer(evts) {
        var MaxPayloadLength = 1500;
        var numEvents = evts.length;
        var payload = '';
        if (!numEvents) {
            return;
        }
        for (var i = 0; i < numEvents; i++) {
            var evt = evts[i];
            if (evt.eventType === 'wps') {
                continue;
            }
            var formattedEvent = tab.MetricsLogger._formatEvent(evt, false);
            if (payload.length > 0 && payload.length + formattedEvent.length > MaxPayloadLength) {
                this._sendBeacon(tsConfig.metricsServerHostname, payload);
                payload = '';
            }
            else if (payload.length > 0) {
                payload += '&';
            }
            payload += formattedEvent;
        }
        if (payload.length > 0) {
            this._sendBeacon(tsConfig.metricsServerHostname, payload);
        }
        if (this._beaconCleanupTimerId == null) {
            this._beaconCleanupTimerId = window.setTimeout(ss.Delegate.create(this, this._cleanupBeaconImages), 250);
        }
    },
    
    _sendBeacon: function tab_MetricsLogger$_sendBeacon(hostname, payload) {
        var Version = 1;
        if (tab.MiscUtil.isNullOrEmpty(hostname) || tab.MiscUtil.isNullOrEmpty(payload)) {
            return;
        }
        var beaconImg = document.createElement('img');
        var versionStr = 'v=' + Version.toString();
        var beaconStr = hostname;
        beaconStr += '?' + versionStr + '&' + payload;
        beaconImg.src = beaconStr;
        this._beaconImages.push(beaconImg);
        if (this._beaconImages.length > 100) {
            this._beaconImages.shift();
        }
    },
    
    _cleanupBeaconImages: function tab_MetricsLogger$_cleanupBeaconImages() {
        try {
            this._beaconCleanupTimerId = null;
            var index = 0;
            while (index < this._beaconImages.length) {
                if (this._beaconImages[index].complete) {
                    this._beaconImages.splice(index, 1);
                }
                else {
                    index++;
                }
            }
            if (this._beaconImages.length > 0) {
                this._beaconCleanupTimerId = window.setTimeout(ss.Delegate.create(this, this._cleanupBeaconImages), 250);
            }
        }
        catch ($e1) {
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.NavigationMetricsCollector

tab.NavigationMetricsCollector = function tab_NavigationMetricsCollector() {
}
tab.NavigationMetricsCollector.collectMetrics = function tab_NavigationMetricsCollector$collectMetrics() {
    if (typeof(window) != 'undefined' && typeof(window.performance) != 'undefined' && typeof(window.performance.timing) != 'undefined') {
        tab.NavigationMetricsCollector._navMetrics = window.performance.timing;
        if (('navigationStart' in tab.NavigationMetricsCollector._navMetrics)) {
            var start = tab.NavigationMetricsCollector._navMetrics[tab.NavigationMetricsCollector._navigationMetricsOrder[0]];
            var metricArray = [];
            var $enum1 = ss.IEnumerator.getEnumerator(tab.NavigationMetricsCollector._navigationMetricsOrder);
            while ($enum1.moveNext()) {
                var name = $enum1.current;
                var metric = tab.NavigationMetricsCollector._navMetrics[name];
                metric = ((!metric) ? 0 : metric - start);
                metricArray.push(metric);
            }
            var parameters = {};
            parameters['v'] = metricArray;
            var evt = new tabBootstrap.MetricsEvent('nav', tabBootstrap.MetricsSuites.navigation, parameters);
            tabBootstrap.MetricsController.get_instance().logEvent(evt);
        }
    }
}
tab.NavigationMetricsCollector.getMetric = function tab_NavigationMetricsCollector$getMetric(metricName) {
    if (ss.isNullOrUndefined(tab.NavigationMetricsCollector._navMetrics)) {
        tab.NavigationMetricsCollector.collectMetrics();
    }
    return tab.NavigationMetricsCollector._navMetrics[metricName];
}


////////////////////////////////////////////////////////////////////////////////
// tab.WindowAppender

tab.WindowAppender = function tab_WindowAppender() {
    tab.WindowAppender.initializeBase(this);
}
tab.WindowAppender.enableLogging = function tab_WindowAppender$enableLogging(filter) {
    if (ss.isNullOrUndefined(tab.WindowAppender._globalAppender$1)) {
        tab.WindowAppender._globalAppender$1 = new tab.WindowAppender();
        tab.Logger.addAppender(tab.WindowAppender._globalAppender$1);
    }
    tab.WindowAppender._globalAppender$1.addFilter((filter || function() {
        return true;
    }));
}
tab.WindowAppender.disableLogging = function tab_WindowAppender$disableLogging() {
    if (ss.isNullOrUndefined(tab.WindowAppender._globalAppender$1)) {
        return;
    }
    tab.Logger.removeAppender(tab.WindowAppender._globalAppender$1);
    tab.WindowAppender._globalAppender$1 = null;
}
tab.WindowAppender.prototype = {
    _logDiv$1: null,
    
    logInternal: function tab_WindowAppender$logInternal(source, level, message, args) {
        if (ss.isNullOrUndefined(this._logDiv$1)) {
            this._buildLogDiv$1();
        }
        message = this.formatMessage(message.replaceAll('\\n', '<br />'), args);
        this._logDiv$1.html(message);
    },
    
    _buildLogDiv$1: function tab_WindowAppender$_buildLogDiv$1() {
        this._logDiv$1 = $("<div class='log-window-appender'>Debug mode ON</div>");
        this._logDiv$1.css({ position: 'absolute', bottom: '0px', right: '0px', backgroundColor: 'white', opacity: '.8', border: '1px solid black', minWidth: '5px', minHeight: '5px', 'z-index': '100' });
        $('body').append(this._logDiv$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.BrowserSupport

tab.BrowserSupport = function tab_BrowserSupport() {
}
tab.BrowserSupport.get_getComputedStyle = function tab_BrowserSupport$get_getComputedStyle() {
    return ('getComputedStyle' in window);
}
tab.BrowserSupport.get_addEventListener = function tab_BrowserSupport$get_addEventListener() {
    return ('addEventListener' in document);
}
tab.BrowserSupport.get_selectStart = function tab_BrowserSupport$get_selectStart() {
    return tab.BrowserSupport._selectStart;
}
tab.BrowserSupport.get_touch = function tab_BrowserSupport$get_touch() {
    return tab.BrowserSupport._touch;
}
tab.BrowserSupport.get_dataUri = function tab_BrowserSupport$get_dataUri() {
    return tab.BrowserSupport._dataUri;
}
tab.BrowserSupport.get_postMessage = function tab_BrowserSupport$get_postMessage() {
    return tab.BrowserSupport._postMessage;
}
tab.BrowserSupport.get_historyApi = function tab_BrowserSupport$get_historyApi() {
    return tab.BrowserSupport._historyApi;
}
tab.BrowserSupport.get_consoleLogFormating = function tab_BrowserSupport$get_consoleLogFormating() {
    return tab.BrowserSupport._consoleLogFormatting;
}
tab.BrowserSupport.get_isMobile = function tab_BrowserSupport$get_isMobile() {
    return tab.BrowserSupport._isAndroid || tab.BrowserSupport._isIos;
}
tab.BrowserSupport.get_isAndroid = function tab_BrowserSupport$get_isAndroid() {
    return tab.BrowserSupport._isAndroid;
}
tab.BrowserSupport.get_isChrome = function tab_BrowserSupport$get_isChrome() {
    return tab.BrowserSupport._isChrome;
}
tab.BrowserSupport.get_isMac = function tab_BrowserSupport$get_isMac() {
    return tab.BrowserSupport._isMac;
}
tab.BrowserSupport.get_isIE = function tab_BrowserSupport$get_isIE() {
    return tab.BrowserSupport._isIE;
}
tab.BrowserSupport.get_isFF = function tab_BrowserSupport$get_isFF() {
    return tab.BrowserSupport._isFF;
}
tab.BrowserSupport.get_isOpera = function tab_BrowserSupport$get_isOpera() {
    return tab.BrowserSupport._isOpera;
}
tab.BrowserSupport.get_isSafari = function tab_BrowserSupport$get_isSafari() {
    return tab.BrowserSupport._isSafari;
}
tab.BrowserSupport.get_browserVersion = function tab_BrowserSupport$get_browserVersion() {
    return parseFloat($.browser.version);
}
tab.BrowserSupport.get_raisesEventOnImageReassignment = function tab_BrowserSupport$get_raisesEventOnImageReassignment() {
    return !tab.BrowserSupport._isSafari;
}
tab.BrowserSupport.get_imageLoadIsSynchronous = function tab_BrowserSupport$get_imageLoadIsSynchronous() {
    return tab.BrowserSupport._isIE;
}
tab.BrowserSupport.get_useAlternateHitStrategy = function tab_BrowserSupport$get_useAlternateHitStrategy() {
    return tab.BrowserSupport._shouldUseAlternateHitStrategy;
}
tab.BrowserSupport.get_pointerEvents = function tab_BrowserSupport$get_pointerEvents() {
    return tab.BrowserSupport._isWebKit || tab.BrowserSupport.get_isFF();
}
tab.BrowserSupport.get_displayInlineBlock = function tab_BrowserSupport$get_displayInlineBlock() {
    return !tab.BrowserSupport._isIE || tab.BrowserSupport.get_browserVersion() >= 8;
}
tab.BrowserSupport.get_cssTransform = function tab_BrowserSupport$get_cssTransform() {
    return ss.isValue(tab.BrowserSupport._cssTransformName);
}
tab.BrowserSupport.get_cssTransformName = function tab_BrowserSupport$get_cssTransformName() {
    return tab.BrowserSupport._cssTransformName;
}
tab.BrowserSupport.get_cssTransitionName = function tab_BrowserSupport$get_cssTransitionName() {
    return tab.BrowserSupport._cssTransitionName;
}
tab.BrowserSupport.get_cssTranslate2D = function tab_BrowserSupport$get_cssTranslate2D() {
    return tab.BrowserSupport._cssTranslate2d;
}
tab.BrowserSupport.get_cssTranslate3D = function tab_BrowserSupport$get_cssTranslate3D() {
    return tab.BrowserSupport._cssTranslate3d;
}
tab.BrowserSupport.get_nativeJSONSupport = function tab_BrowserSupport$get_nativeJSONSupport() {
    return (typeof JSON !== 'undefined') && ('parse' in JSON);
}
tab.BrowserSupport.get_backingStoragePixelRatio = function tab_BrowserSupport$get_backingStoragePixelRatio() {
    return tab.BrowserSupport._backingStoragePixelRatio;
}
tab.BrowserSupport.get_devicePixelRatio = function tab_BrowserSupport$get_devicePixelRatio() {
    return tab.BrowserSupport._devicePixelRatio;
}
tab.BrowserSupport.get_canvasLinePattern = function tab_BrowserSupport$get_canvasLinePattern() {
    return tab.BrowserSupport._canvasLinePattern;
}
tab.BrowserSupport.get_dateInput = function tab_BrowserSupport$get_dateInput() {
    return tab.BrowserSupport._dateInput;
}
tab.BrowserSupport.get_dateTimeInput = function tab_BrowserSupport$get_dateTimeInput() {
    return tab.BrowserSupport._dateTimeInput;
}
tab.BrowserSupport.get_dateTimeLocalInput = function tab_BrowserSupport$get_dateTimeLocalInput() {
    return tab.BrowserSupport._dateTimeLocalInput;
}
tab.BrowserSupport.get_timeInput = function tab_BrowserSupport$get_timeInput() {
    return tab.BrowserSupport._timeInput;
}
tab.BrowserSupport.get_setSelectionRange = function tab_BrowserSupport$get_setSelectionRange() {
    return tab.BrowserSupport._setSelectionRange;
}
tab.BrowserSupport.get_mouseWheelEvent = function tab_BrowserSupport$get_mouseWheelEvent() {
    var mouseWheelEvent;
    if (('onwheel' in window.document.documentElement)) {
        mouseWheelEvent = 'wheel';
    }
    else if (('onmousewheel' in window.document.documentElement)) {
        mouseWheelEvent = 'mousewheel';
    }
    else {
        mouseWheelEvent = 'MozMousePixelScroll';
    }
    return mouseWheelEvent;
}
tab.BrowserSupport.get_mouseCapture = function tab_BrowserSupport$get_mouseCapture() {
    return ('releaseCapture' in document);
}
tab.BrowserSupport.get_orientationChange = function tab_BrowserSupport$get_orientationChange() {
    return window.onorientationchange !== undefined;
}
tab.BrowserSupport.getOrigin = function tab_BrowserSupport$getOrigin(location) {
    var origin = location.origin;
    if (ss.isNullOrUndefined(origin)) {
        origin = location.protocol + '//' + location.host;
    }
    return origin;
}
tab.BrowserSupport.doPostMessage = function tab_BrowserSupport$doPostMessage(message) {
    if (!tab.BrowserSupport.get_postMessage()) {
        return;
    }
    var parentFrame = window.parent;
    try {
        parentFrame.postMessage(message, '*');
    }
    catch ($e1) {
        tab.Logger.lazyGetLogger(tab.BrowserSupport).debug('BrowserSupport::DoPostMessage failed.');
    }
}
tab.BrowserSupport.doPostMessageWithContext = function tab_BrowserSupport$doPostMessageWithContext(message) {
    var builder = new ss.StringBuilder(message);
    if (tsConfig.loadOrderID >= 0) {
        builder.append(',').append(tsConfig.loadOrderID);
    }
    if (!String.isNullOrEmpty(tsConfig.apiID)) {
        if (tsConfig.loadOrderID < 0) {
            builder.append(',').append(tsConfig.loadOrderID);
        }
        builder.append(',').append(tsConfig.apiID);
    }
    tab.BrowserSupport.doPostMessage(builder.toString());
}
tab.BrowserSupport._detectDataUriSupport = function tab_BrowserSupport$_detectDataUriSupport() {
    var imgObj = $('<img />');
    var img = imgObj[0];
    imgObj.bind('load error', function() {
        tab.BrowserSupport._dataUri = img.width === 1 && img.height === 1;
    });
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
}
tab.BrowserSupport._detectDocumentElementFromPoint = function tab_BrowserSupport$_detectDocumentElementFromPoint() {
    var body = window.document.body;
    if (tab.BrowserSupport._isWebKit && tab.BrowserSupport.get_isMobile()) {
        var target = $('<div></div>');
        target.css({ position: 'absolute', top: '300px', left: '300px', width: '25px', height: '25px', 'z-index': '10000' });
        var elem = target.get(0);
        try {
            body.appendChild(elem);
            tab.BrowserSupport._shouldUseAlternateHitStrategy = document.elementFromPoint(310, 310) !== elem;
        }
        catch ($e1) {
        }
        finally {
            target.remove();
        }
    }
}
tab.BrowserSupport._detectConsoleLogFormatting = function tab_BrowserSupport$_detectConsoleLogFormatting() {
    try {
        if (ss.isValue(console) && ss.isValue(console.log)) {
            tab.BrowserSupport._consoleLogFormatting = window.navigator.userAgent.indexOf('iPad') < 0;
        }
        else {
            tab.BrowserSupport._consoleLogFormatting = false;
        }
    }
    catch ($e1) {
        tab.BrowserSupport._consoleLogFormatting = false;
    }
}
tab.BrowserSupport._detectBrowser = function tab_BrowserSupport$_detectBrowser() {
    var ua = window.navigator.userAgent;
    tab.BrowserSupport._isKhtml = ua.indexOf('Konqueror') >= 0;
    tab.BrowserSupport._isWebKit = ua.indexOf('WebKit') >= 0;
    tab.BrowserSupport._isChrome = ua.indexOf('Chrome') >= 0;
    tab.BrowserSupport._isSafari = ua.indexOf('Safari') >= 0 && !tab.BrowserSupport._isChrome;
    tab.BrowserSupport._isOpera = ua.indexOf('Opera') >= 0;
    tab.BrowserSupport._isMozilla = !tab.BrowserSupport._isKhtml && !tab.BrowserSupport._isWebKit && ua.indexOf('Gecko') >= 0;
    tab.BrowserSupport._isFF = tab.BrowserSupport._isMozilla || ua.indexOf('Firefox') >= 0 || ua.indexOf('Minefield') >= 0;
    tab.BrowserSupport._isIE = ua.indexOf('MSIE') >= 0 || (!tab.BrowserSupport._isOpera && ua.indexOf('Trident') >= 0);
    var commandRegex = new RegExp('iPhone|iPod|iPad');
    tab.BrowserSupport._isIos = commandRegex.test(ua);
    tab.BrowserSupport._isAndroid = ua.indexOf('Android') >= 0;
    tab.BrowserSupport._isMac = ua.indexOf('Mac') >= 0;
}
tab.BrowserSupport._trySettingCssProperty = function tab_BrowserSupport$_trySettingCssProperty(styleProp, cssProp, val) {
    var e = document.createElement('div');
    try {
        document.body.insertBefore(e, null);
        if (!(styleProp in e.style)) {
            return false;
        }
        e.style[styleProp] = val;
        var s = tab.DomUtil.getComputedStyle(e);
        var computedVal = s[cssProp];
        return !tab.MiscUtil.isNullOrEmpty(computedVal) && computedVal !== 'none';
    }
    finally {
        document.body.removeChild(e).style.display = 'none';
    }
}
tab.BrowserSupport._detectTransitionSupport = function tab_BrowserSupport$_detectTransitionSupport() {
    var transitions = { transition: 'transition', webkitTransition: '-webkit-transition', msTransition: '-ms-transition', mozTransition: '-moz-transition', oTransition: '-o-transition' };
    var $dict1 = transitions;
    for (var $key2 in $dict1) {
        var t = { key: $key2, value: $dict1[$key2] };
        if (!(t.key in document.body.style)) {
            continue;
        }
        tab.BrowserSupport._cssTransitionName = t.value;
        break;
    }
}
tab.BrowserSupport._detectTransformSupport = function tab_BrowserSupport$_detectTransformSupport() {
    var transforms = { transform: 'transform', webkitTransform: '-webkit-transform', msTransform: '-ms-transform', mozTransform: '-moz-transform', oTransform: '-o-transform' };
    var $dict1 = transforms;
    for (var $key2 in $dict1) {
        var t = { key: $key2, value: $dict1[$key2] };
        if (!(t.key in document.body.style)) {
            continue;
        }
        tab.BrowserSupport._cssTransformName = t.value;
        tab.BrowserSupport._cssTranslate2d = tab.BrowserSupport._trySettingCssProperty(t.key, t.value, 'translate(1px,1px)');
        tab.BrowserSupport._cssTranslate3d = tab.BrowserSupport._trySettingCssProperty(t.key, t.value, 'translate3d(1px,1px,1px)');
        break;
    }
}
tab.BrowserSupport._detectDevicePixelRatio = function tab_BrowserSupport$_detectDevicePixelRatio() {
    tab.BrowserSupport._devicePixelRatio = (window.self.devicePixelRatio || 1);
}
tab.BrowserSupport._detectBackingStoragePixelRatio = function tab_BrowserSupport$_detectBackingStoragePixelRatio() {
    var canvas = document.createElement('canvas');
    if (ss.isNullOrUndefined(canvas)) {
        tab.BrowserSupport._backingStoragePixelRatio = 1;
        return;
    }
    var context = null;
    if ((typeof(Type.getInstanceType(canvas).getContext) === 'function')) {
        context = canvas.getContext('2d');
    }
    if (ss.isNullOrUndefined(context)) {
        tab.BrowserSupport._backingStoragePixelRatio = 1;
        return;
    }
    tab.BrowserSupport._backingStoragePixelRatio = (context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || 1);
}
tab.BrowserSupport._detectCanvasLinePattern = function tab_BrowserSupport$_detectCanvasLinePattern() {
    var canvas = document.createElement('canvas');
    if (ss.isNullOrUndefined(canvas)) {
        return;
    }
    var context = null;
    if ((typeof(canvas.getContext) === 'function')) {
        context = canvas.getContext('2d');
    }
    if (ss.isNullOrUndefined(context)) {
        return;
    }
    tab.BrowserSupport._canvasLinePattern = (typeof(context.setLineDash) === 'function') || ('mozDash' in context) || ('webkitLineDash' in context);
}
tab.BrowserSupport._detectSetSelectionRangeSupport = function tab_BrowserSupport$_detectSetSelectionRangeSupport() {
    var inputObject = $('<input>');
    tab.BrowserSupport._setSelectionRange = (typeof(inputObject.get(0).setSelectionRange) === 'function');
}
tab.BrowserSupport._detectDateInputSupport = function tab_BrowserSupport$_detectDateInputSupport() {
    tab.BrowserSupport._dateInput = tab.BrowserSupport._detectCustomInputSupport('date');
    tab.BrowserSupport._dateTimeInput = tab.BrowserSupport._detectCustomInputSupport('datetime');
    tab.BrowserSupport._dateTimeLocalInput = tab.BrowserSupport._detectCustomInputSupport('datetime-local');
    tab.BrowserSupport._timeInput = tab.BrowserSupport._detectCustomInputSupport('time');
}
tab.BrowserSupport._detectCustomInputSupport = function tab_BrowserSupport$_detectCustomInputSupport(inputType) {
    var inputObject = $("<input type='" + inputType + "'>").css({ position: 'absolute', visibility: 'hidden' }).appendTo($(document.body));
    var input = inputObject.get(0);
    var reportedInputType = input.getAttribute('type');
    var InvalidDataString = '@inva/1d:)';
    input.value = InvalidDataString;
    var supportsInput = (reportedInputType === inputType && input.value !== InvalidDataString);
    inputObject.remove();
    return supportsInput;
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalendarOptions

tab.CalendarOptions = function tab_CalendarOptions() {
}
tab.CalendarOptions.prototype = {
    startOfWeek: 1,
    fiscalYearStart: 1,
    minDaysInFirstWeek: 1,
    brokenWeeks: true
}


////////////////////////////////////////////////////////////////////////////////
// tab.CallOnDispose

tab.CallOnDispose = function tab_CallOnDispose(callOnDispose) {
    this._callOnDispose = callOnDispose;
}
tab.CallOnDispose.prototype = {
    _callOnDispose: null,
    
    dispose: function tab_CallOnDispose$dispose() {
        if (ss.isNullOrUndefined(this._callOnDispose)) {
            return;
        }
        this._callOnDispose();
        this._callOnDispose = null;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CircleUtil

tab.CircleUtil = function tab_CircleUtil() {
}
tab.CircleUtil.isEmpty = function tab_CircleUtil$isEmpty(circle) {
    return tab.FloatUtil.isZero(circle.radius);
}
tab.CircleUtil.isEqual = function tab_CircleUtil$isEqual(c1, c2) {
    return tab.FloatUtil.isEqual(c1.radius, c2.radius) && tab.CircleUtil.hasTheSameCenter(c1, c2);
}
tab.CircleUtil.hasTheSameCenter = function tab_CircleUtil$hasTheSameCenter(c1, c2) {
    return tab.FloatUtil.isEqual(c1.center.x, c2.center.x) && tab.FloatUtil.isEqual(c1.center.y, c2.center.y);
}
tab.CircleUtil.intersectsWith = function tab_CircleUtil$intersectsWith(c1, c2) {
    var distanceSquared = Math.pow(c1.center.x - c2.center.x, 2) + Math.pow(c1.center.y - c2.center.y, 2);
    return Math.pow(c1.radius + c2.radius, 2) > distanceSquared;
}
tab.CircleUtil.offsetCircle = function tab_CircleUtil$offsetCircle(c, p) {
    var offsetCenter = tab.$create_PointF(c.center.x + p.x, c.center.y + p.y);
    return tab.$create_Circle(offsetCenter, c.radius);
}
tab.CircleUtil.clone = function tab_CircleUtil$clone(c) {
    return tab.$create_Circle(tab.$create_PointF(c.center.x, c.center.y), c.radius);
}
tab.CircleUtil.boundingBox = function tab_CircleUtil$boundingBox(circle) {
    var intRadius = Math.ceil(circle.radius);
    var minX = Math.floor(circle.center.x - intRadius);
    var maxX = Math.ceil(circle.center.x + intRadius);
    var minY = Math.floor(circle.center.y - intRadius);
    var maxY = Math.ceil(circle.center.y + intRadius);
    return tab.$create_RectXY(minX, minY, maxX - minX, maxY - minY);
}
tab.CircleUtil.containmentBox = function tab_CircleUtil$containmentBox(circle) {
    var diffX = Math.abs(Math.round(circle.center.x) - circle.center.x);
    var diffY = Math.abs(Math.round(circle.center.y) - circle.center.y);
    var halfLength = (Math.sqrt(2) / 2 * circle.radius) - Math.max(diffX, diffY);
    var left = Math.ceil(circle.center.x - halfLength);
    var top = Math.ceil(circle.center.y - halfLength);
    var right = Math.floor(circle.center.x + halfLength);
    var bottom = Math.floor(circle.center.y + halfLength);
    return tab.$create_RectXY(left, top, (right - left), (bottom - top));
}
tab.CircleUtil.getChangedRects = function tab_CircleUtil$getChangedRects(c1, c2) {
    if (!tab.CircleUtil.hasTheSameCenter(c1, c2)) {
        tab.Log.get(c1).warn('Circle centers in comparison should be the same, but are not');
        return new Array(0);
    }
    var outerBox = (c1.radius > c2.radius) ? tab.CircleUtil.boundingBox(c1) : tab.CircleUtil.boundingBox(c2);
    var innerBox = (c1.radius > c2.radius) ? tab.CircleUtil.containmentBox(c2) : tab.CircleUtil.containmentBox(c1);
    var changedRects = new Array(4);
    var horzBoxHeight = (outerBox.h - innerBox.h) / 2;
    var vertBoxWidth = (outerBox.w - innerBox.w) / 2;
    changedRects[0] = tab.$create_RectXY(outerBox.x, outerBox.y, outerBox.w, horzBoxHeight);
    changedRects[1] = tab.$create_RectXY(outerBox.x, outerBox.y + horzBoxHeight + innerBox.h, outerBox.w, horzBoxHeight);
    changedRects[2] = tab.$create_RectXY(outerBox.x, outerBox.y + horzBoxHeight, vertBoxWidth, innerBox.h);
    changedRects[3] = tab.$create_RectXY(outerBox.x + vertBoxWidth + innerBox.w, outerBox.y + horzBoxHeight, vertBoxWidth, innerBox.h);
    return changedRects;
}


////////////////////////////////////////////////////////////////////////////////
// tab.FeatureFlags

tab.FeatureFlags = function tab_FeatureFlags() {
}
tab.FeatureFlags.isEnabled = function tab_FeatureFlags$isEnabled(featureFlagId) {
    return ss.isValue(tsConfig.features) && (tsConfig.features[featureFlagId] || false);
}


////////////////////////////////////////////////////////////////////////////////
// tab.FeatureParamsLookup

tab.FeatureParamsLookup = function tab_FeatureParamsLookup() {
}
tab.FeatureParamsLookup.getBool = function tab_FeatureParamsLookup$getBool(param) {
    return tab.FeatureParamsLookup.getBoolWithDefault(param, null);
}
tab.FeatureParamsLookup.getBoolDefaultTrue = function tab_FeatureParamsLookup$getBoolDefaultTrue(param) {
    return tab.FeatureParamsLookup.getBoolWithDefault(param, true);
}
tab.FeatureParamsLookup.getBoolDefaultFalse = function tab_FeatureParamsLookup$getBoolDefaultFalse(param) {
    return tab.FeatureParamsLookup.getBoolWithDefault(param, false);
}
tab.FeatureParamsLookup.getBoolWithDefault = function tab_FeatureParamsLookup$getBoolWithDefault(param, defaultValue) {
    var toRet = defaultValue;
    if (Object.keyExists(tab.FeatureParamsLookup._booleanLookUp, param)) {
        if (ss.isValue(tab.FeatureParamsLookup._booleanLookUp[param])) {
            toRet = tab.FeatureParamsLookup._booleanLookUp[param];
        }
        return toRet;
    }
    tab.FeatureParamsLookup._logger.error('Requested feature param does not exist in the bool lookup table: %s.', param.toString());
    return null;
}
tab.FeatureParamsLookup.getFloat = function tab_FeatureParamsLookup$getFloat(param) {
    if (Object.keyExists(tab.FeatureParamsLookup._floatLookUp, param)) {
        return tab.FeatureParamsLookup._floatLookUp[param];
    }
    tab.FeatureParamsLookup._logger.error('Requested feature param param not exist in the float lookup table: %s.', param.toString());
    return null;
}
tab.FeatureParamsLookup.getInt = function tab_FeatureParamsLookup$getInt(param) {
    if (Object.keyExists(tab.FeatureParamsLookup._intLookUp, param)) {
        return tab.FeatureParamsLookup._intLookUp[param];
    }
    tab.FeatureParamsLookup._logger.error('Requested feature param does not exist in the int lookup table: %s.', param.toString());
    return null;
}
tab.FeatureParamsLookup.getString = function tab_FeatureParamsLookup$getString(param) {
    if (Object.keyExists(tab.FeatureParamsLookup._stringLookUp, param)) {
        return tab.FeatureParamsLookup._stringLookUp[param];
    }
    tab.FeatureParamsLookup._logger.error('Requested feature param does not exist in the string lookup table: %s.', param.toString());
    return null;
}
tab.FeatureParamsLookup._registerBooleanFeatureParam = function tab_FeatureParamsLookup$_registerBooleanFeatureParam(urlParam, paramEnum, defaultValue) {
    tab.FeatureParamsLookup._booleanParams.add(paramEnum);
    tab.FeatureParamsLookup._stringToEnumLookup[urlParam] = paramEnum;
    tab.FeatureParamsLookup._booleanLookUp[paramEnum] = (ss.isValue(defaultValue)) ? defaultValue : null;
}
tab.FeatureParamsLookup._registerFloatFeatureParam = function tab_FeatureParamsLookup$_registerFloatFeatureParam(urlParam, paramEnum) {
    tab.FeatureParamsLookup._floatParams.add(paramEnum);
    tab.FeatureParamsLookup._stringToEnumLookup[urlParam] = paramEnum;
    tab.FeatureParamsLookup._floatLookUp[paramEnum] = null;
}
tab.FeatureParamsLookup._registerIntFeatureParam = function tab_FeatureParamsLookup$_registerIntFeatureParam(urlParam, paramEnum) {
    tab.FeatureParamsLookup._intParams.add(paramEnum);
    tab.FeatureParamsLookup._stringToEnumLookup[urlParam] = paramEnum;
    tab.FeatureParamsLookup._intLookUp[paramEnum] = null;
}
tab.FeatureParamsLookup._registerStringFeatureParam = function tab_FeatureParamsLookup$_registerStringFeatureParam(urlParam, paramEnum) {
    tab.FeatureParamsLookup._stringParams.add(paramEnum);
    tab.FeatureParamsLookup._stringToEnumLookup[urlParam] = paramEnum;
    tab.FeatureParamsLookup._stringLookUp[paramEnum] = null;
}
tab.FeatureParamsLookup._parseFeatureParamsFromUrl = function tab_FeatureParamsLookup$_parseFeatureParamsFromUrl() {
    var queryParams = tab.MiscUtil.getUriQueryParameters(window.self.location.search);
    var $dict1 = queryParams;
    for (var $key2 in $dict1) {
        var keyValue = { key: $key2, value: $dict1[$key2] };
        var key = keyValue.key.toLowerCase();
        var param = 0;
        if (Object.keyExists(tab.FeatureParamsLookup._stringToEnumLookup, key)) {
            param = tab.FeatureParamsLookup._stringToEnumLookup[key];
        }
        else {
            continue;
        }
        if (keyValue.value.length > 0) {
            var strValue = keyValue.value[0];
            if (tab.FeatureParamsLookup._booleanParams.contains(param)) {
                var value = Boolean.parse(strValue);
                tab.FeatureParamsLookup._booleanLookUp[param] = value;
            }
            else if (tab.FeatureParamsLookup._floatParams.contains(param)) {
                var value = parseFloat(strValue);
                tab.FeatureParamsLookup._floatLookUp[param] = value;
            }
            else if (tab.FeatureParamsLookup._intParams.contains(param)) {
                var value = parseInt(strValue);
                tab.FeatureParamsLookup._intLookUp[param] = value;
            }
            else if (tab.FeatureParamsLookup._stringParams.contains(param)) {
                tab.FeatureParamsLookup._stringLookUp[param] = strValue;
            }
            else {
                tab.FeatureParamsLookup._logger.warn('Unknown type for param: %s.', key);
                continue;
            }
        }
        else {
            tab.FeatureParamsLookup._logger.warn('No values found for param: %s.', key);
            continue;
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DateUtil

tab.DateUtil = function tab_DateUtil() {
}
tab.DateUtil.get__log = function tab_DateUtil$get__log() {
    return tab.Logger.lazyGetLogger(tab.DateUtil);
}
tab.DateUtil.adjustDateByPeriod = function tab_DateUtil$adjustDateByPeriod(date, periodType, numPeriods) {
    var outDate = new Date();
    switch (periodType) {
        case 'year':
            outDate = new Date(date.getFullYear() + numPeriods, date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
            break;
        case 'quarter':
            outDate = tab.DateUtil.adjustByMonths(date, numPeriods * 3);
            break;
        case 'month':
            outDate = tab.DateUtil.adjustByMonths(date, numPeriods);
            break;
        case 'week':
            outDate = new Date(date.getTime() + (numPeriods * tab.DateUtil.oneWeek));
            break;
        case 'day':
            outDate = new Date(date.getTime() + (numPeriods * tab.DateUtil.oneDay));
            break;
        case 'hour':
            outDate = new Date(date.getTime() + (numPeriods * tab.DateUtil.oneHour));
            break;
        case 'minute':
            outDate = new Date(date.getTime() + (numPeriods * tab.DateUtil.oneMinute));
            break;
        case 'second':
            outDate = new Date(date.getTime() + (numPeriods * tab.DateUtil.oneSecond));
            break;
    }
    return outDate;
}
tab.DateUtil.adjustByMonths = function tab_DateUtil$adjustByMonths(date, n) {
    var currentMonth = date.getMonth();
    var years;
    var newMonth;
    if (n < 0) {
        years = parseInt((-(((12 - (currentMonth - 1)) - 1 - n) / 12)));
    }
    else {
        years = parseInt(((currentMonth - 1 + n) / 12));
    }
    newMonth = currentMonth + (n - (years * 12));
    return new Date(date.getFullYear() + years, newMonth, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
}
tab.DateUtil.adjustDateByPeriodInUTC = function tab_DateUtil$adjustDateByPeriodInUTC(date, periodType, numPeriods) {
    var outDate = new Date();
    switch (periodType) {
        case 'year':
            outDate = new Date(date.getUTCFullYear() + numPeriods, date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            break;
        case 'quarter':
            outDate = tab.DateUtil.adjustByMonthsInUTC(date, numPeriods * 3);
            break;
        case 'month':
            outDate = tab.DateUtil.adjustByMonthsInUTC(date, numPeriods);
            break;
        case 'week':
            outDate = new Date(date.getTime() + (numPeriods * tab.DateUtil.oneWeek));
            break;
        case 'day':
            outDate = new Date(date.getTime() + (numPeriods * tab.DateUtil.oneDay));
            break;
        case 'hour':
            outDate = new Date(date.getTime() + (numPeriods * tab.DateUtil.oneHour));
            break;
        case 'minute':
            outDate = new Date(date.getTime() + (numPeriods * tab.DateUtil.oneMinute));
            break;
        case 'second':
            outDate = new Date(date.getTime() + (numPeriods * tab.DateUtil.oneSecond));
            break;
    }
    return outDate;
}
tab.DateUtil.adjustByMonthsInUTC = function tab_DateUtil$adjustByMonthsInUTC(date, n) {
    var currentMonth = date.getUTCMonth(), years, newMonth;
    if (n < 0) {
        years = parseInt((-(((12 - (currentMonth - 1)) - 1 - n) / 12)));
    }
    else {
        years = parseInt(((currentMonth - 1 + n) / 12));
    }
    newMonth = currentMonth + (n - (years * 12));
    return new Date(Date.UTC(date.getUTCFullYear() + years, newMonth, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()));
}
tab.DateUtil.parsePresModelDate = function tab_DateUtil$parsePresModelDate(dateValue) {
    if (ss.isNullOrUndefined(dateValue)) {
        return null;
    }
    var matches = new RegExp('(\\d\\d\\d\\d)-(\\d\\d)-(\\d\\d)( (\\d\\d):(\\d\\d):(\\d\\d))?').exec(dateValue);
    if (ss.isNullOrUndefined(matches)) {
        tab.DateUtil.get__log().debug("Date doesn't match: %s", dateValue);
        return null;
    }
    var year = parseInt(matches[1], 10);
    var month = parseInt(matches[2], 10) - 1;
    var day = parseInt(matches[3], 10);
    if (String.isNullOrEmpty(matches[4])) {
        return new Date(Date.UTC(year, month, day));
    }
    else {
        var hours = parseInt(matches[5], 10);
        var minutes = parseInt(matches[6], 10);
        var seconds = parseInt(matches[7], 10);
        return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    }
}
tab.DateUtil.getFakeUTCDate = function tab_DateUtil$getFakeUTCDate(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}
tab.DateUtil.dateAsYear = function tab_DateUtil$dateAsYear(arg) {
    return arg.getUTCFullYear();
}
tab.DateUtil.dateAsQuarter = function tab_DateUtil$dateAsQuarter(arg) {
    var month = tab.DateUtil._getMonthNum(arg);
    return parseInt(1 + ((month - 1) / 3));
}
tab.DateUtil.dateAsMonth = function tab_DateUtil$dateAsMonth(arg) {
    return tab.DateUtil._getMonthNum(arg);
}
tab.DateUtil.dateAsWeek = function tab_DateUtil$dateAsWeek(arg) {
    var jan1 = new Date(arg.getUTCFullYear(), 0, 1);
    var dayOfYear = tab.DateUtil._getDayOfYear(arg);
    var value = parseInt(1 + (((dayOfYear + tab.DateUtil._getDayNum(jan1)) - 2) / 7));
    return value;
}
tab.DateUtil.dateAsDay = function tab_DateUtil$dateAsDay(arg) {
    return arg.getUTCDate();
}
tab.DateUtil.dateAsDayOfYear = function tab_DateUtil$dateAsDayOfYear(arg) {
    return tab.DateUtil._getDayOfYear(arg);
}
tab.DateUtil.dateAsDayOfWeek = function tab_DateUtil$dateAsDayOfWeek(arg) {
    return tab.DateUtil._getDayNum(arg);
}
tab.DateUtil.dateAsMonthYear = function tab_DateUtil$dateAsMonthYear(arg) {
    var value = (tab.DateUtil._getMonthNum(arg) * 10000) + arg.getUTCFullYear();
    return value;
}
tab.DateUtil.dateAsMonthDayYear = function tab_DateUtil$dateAsMonthDayYear(arg) {
    var value = ((tab.DateUtil._getMonthNum(arg) * 1000000) + (arg.getUTCDate() * 10000)) + arg.getUTCFullYear();
    return value;
}
tab.DateUtil.dateTimeAsHour = function tab_DateUtil$dateTimeAsHour(arg) {
    return arg.getUTCHours();
}
tab.DateUtil.dateTimeAsMinute = function tab_DateUtil$dateTimeAsMinute(arg) {
    return arg.getUTCMinutes();
}
tab.DateUtil.dateTimeAsSecond = function tab_DateUtil$dateTimeAsSecond(arg) {
    return arg.getUTCSeconds();
}
tab.DateUtil.dateTimeAsOleDate = function tab_DateUtil$dateTimeAsOleDate(arg) {
    return tableau.types.OleDateFromJsDate(arg.getTime());
}
tab.DateUtil._getDayOfYear = function tab_DateUtil$_getDayOfYear(arg) {
    var yn = arg.getUTCFullYear();
    var mn = arg.getUTCMonth();
    var dn = arg.getUTCDate();
    var d1 = new Date(yn, 0, 1, 12, 0, 0);
    var d2 = new Date(yn, mn, dn, 12, 0, 0);
    var ddiff = Math.round((d2 - d1) / tab.DateUtil._milisInADay);
    return ddiff + 1;
}
tab.DateUtil._getMonthNum = function tab_DateUtil$_getMonthNum(arg) {
    return arg.getUTCMonth() + 1;
}
tab.DateUtil._getDayNum = function tab_DateUtil$_getDayNum(arg) {
    return arg.getUTCDay() + 1;
}
tab.DateUtil.daysSinceEpoch = function tab_DateUtil$daysSinceEpoch(date) {
    return Math.floor(date.getTime() / tab.DateUtil._milisInADay);
}
tab.DateUtil.sameDay = function tab_DateUtil$sameDay(date1, date2) {
    return tab.DateUtil.daysSinceEpoch(date1) === tab.DateUtil.daysSinceEpoch(date2);
}


////////////////////////////////////////////////////////////////////////////////
// tab.DisposableHolder

tab.DisposableHolder = function tab_DisposableHolder() {
    this._disposables = [];
}
tab.DisposableHolder.prototype = {
    
    add: function tab_DisposableHolder$add(d) {
        this._disposables.add(d);
    },
    
    dispose: function tab_DisposableHolder$dispose() {
        var $enum1 = ss.IEnumerator.getEnumerator(this._disposables);
        while ($enum1.moveNext()) {
            var disposable = $enum1.current;
            disposable.dispose();
        }
        this._disposables.clear();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DomUtil

tab.DomUtil = function tab_DomUtil() {
}
tab.DomUtil.get__log = function tab_DomUtil$get__log() {
    return tab.Logger.lazyGetLogger(tab.DomUtil);
}
tab.DomUtil.getComputedStyle = function tab_DomUtil$getComputedStyle(e) {
    if (tab.BrowserSupport.get_getComputedStyle()) {
        var s = window.getComputedStyle(e);
        if (ss.isValue(s)) {
            return s;
        }
    }
    tab.DomUtil.get__log().warn('Calling GetComputedStyle but is unsupported');
    return e.style;
}
tab.DomUtil.getComputedZIndex = function tab_DomUtil$getComputedZIndex(child) {
    tab.Param.verifyValue(child, 'child');
    var iter = $(child);
    var lastPositioned = iter;
    var body = $('body');
    while (!!iter.length && iter[0] !== body[0]) {
        var pos = iter.css('position');
        if (pos === 'absolute' || pos === 'fixed') {
            lastPositioned = iter;
        }
        iter = iter.offsetParent();
    }
    return tab.DomUtil._parseZIndexProperty(lastPositioned);
}
tab.DomUtil.resize = function tab_DomUtil$resize(e, rect) {
    if ((typeof(e.resize) === 'function')) {
        e.resize(rect);
    }
    else {
        tab.DomUtil.setMarginBox((e.domNode || e), rect);
    }
}
tab.DomUtil.getContentBox = function tab_DomUtil$getContentBox(e) {
    var obj = $(e);
    return tab.$create_Rect((parseInt(obj.css('padding-left'), 10) || 0), (parseInt(obj.css('padding-top'), 10) || 0), obj.width(), obj.height());
}
tab.DomUtil.setContentBox = function tab_DomUtil$setContentBox(e, r) {
    $(e).width(r.w).height(r.h);
}
tab.DomUtil.setMarginBox = function tab_DomUtil$setMarginBox(e, r) {
    tab.DomUtil.setMarginBoxJQ($(e), r);
}
tab.DomUtil.setMarginBoxJQ = function tab_DomUtil$setMarginBoxJQ(o, r) {
    tab.DomUtil.setMarginSizeJQ(o, tab.RecordCast.rectAsSize(r));
    if (!isNaN(r.t)) {
        o.css('top', r.t + 'px');
    }
    if (!isNaN(r.l)) {
        o.css('left', r.l + 'px');
    }
}
tab.DomUtil.setMarginSizeJQ = function tab_DomUtil$setMarginSizeJQ(o, s) {
    if (s.w >= 0) {
        tab.DomUtil._setOuterWidth(o, s.w);
    }
    if (s.h >= 0) {
        tab.DomUtil._setOuterHeight(o, s.h);
    }
}
tab.DomUtil.getMarginBox = function tab_DomUtil$getMarginBox(e) {
    return tab.DomUtil.getMarginBoxJQ($(e));
}
tab.DomUtil.getMarginBoxJQ = function tab_DomUtil$getMarginBoxJQ(o) {
    var p = o.position();
    return tab.$create_Rect(p.left, p.top, o.outerWidth(true), o.outerHeight(true));
}
tab.DomUtil.getDojoCoordsJQ = function tab_DomUtil$getDojoCoordsJQ(o) {
    var c = tab.$create_DojoCoords();
    c.l = o.position().left;
    c.t = o.position().top;
    c.x = o.offset().left;
    c.y = o.offset().top;
    c.w = o.outerWidth(true);
    c.h = o.outerHeight(true);
    return c;
}
tab.DomUtil.isAncestorOf = function tab_DomUtil$isAncestorOf(ancestor, child) {
    if (ss.isNullOrUndefined(ancestor) || ss.isNullOrUndefined(child)) {
        return false;
    }
    return $(child).parents().index(ancestor) >= 0;
}
tab.DomUtil.isEqualOrAncestorOf = function tab_DomUtil$isEqualOrAncestorOf(ancestor, child) {
    if (ss.isNullOrUndefined(ancestor) || ss.isNullOrUndefined(child)) {
        return false;
    }
    return (ancestor === child || tab.DomUtil.isAncestorOf(ancestor, child));
}
tab.DomUtil.setElementPosition = function tab_DomUtil$setElementPosition(e, pageX, pageY, duration, useTransform) {
    if ((!ss.isValue(useTransform) || useTransform) && tab.BrowserSupport.get_cssTransform()) {
        var styling = { top: '0px', left: '0px' };
        if (tab.BrowserSupport.get_cssTranslate3D()) {
            var transformVal = new ss.StringBuilder('translate3d(').append(pageX).append('px,').append(pageY).append('px,').append('0px)').toString();
            styling[tab.BrowserSupport.get_cssTransformName()] = transformVal;
            if (ss.isValue(duration)) {
                styling[tab.BrowserSupport.get_cssTransitionName() + '-duration'] = duration;
            }
            e.css(styling);
            return;
        }
        if (tab.BrowserSupport.get_cssTranslate2D()) {
            var transformVal = new ss.StringBuilder('translate(').append(pageX).append('px,').append(pageY).append('px)').toString();
            styling[tab.BrowserSupport.get_cssTransformName()] = transformVal;
            if (ss.isValue(duration)) {
                styling[tab.BrowserSupport.get_cssTransitionName() + '-duration'] = duration;
            }
            e.css(styling);
            return;
        }
    }
    var css = { position: 'absolute', top: pageY + 'px', left: pageX + 'px' };
    if (tab.BrowserSupport.get_cssTransform()) {
        css[tab.BrowserSupport.get_cssTransformName()] = '';
    }
    e.css(css);
}
tab.DomUtil.getElementPosition = function tab_DomUtil$getElementPosition(e) {
    var ep = e.offset();
    return tab.$create_Point(ep.left, ep.top);
}
tab.DomUtil.getElementClientPosition = function tab_DomUtil$getElementClientPosition(e) {
    var p = tab.DomUtil.getElementPosition(e);
    p.x -= $(document.documentElement).scrollLeft();
    p.y -= $(document.documentElement).scrollTop();
    return p;
}
tab.DomUtil.getElementRelativePosition = function tab_DomUtil$getElementRelativePosition(e, p) {
    if (ss.isNullOrUndefined(p)) {
        p = e.parent();
    }
    var ep = e.offset();
    var pp = p.offset();
    return tab.$create_Point(ep.left - pp.left, ep.top - pp.top);
}
tab.DomUtil.parseWidthFromStyle = function tab_DomUtil$parseWidthFromStyle(style) {
    if (ss.isValue(style) && !tab.MiscUtil.isNullOrEmpty(style.width)) {
        return parseInt(style.width);
    }
    return Number.NaN;
}
tab.DomUtil.parseHeightFromStyle = function tab_DomUtil$parseHeightFromStyle(style) {
    if (ss.isValue(style) && !tab.MiscUtil.isNullOrEmpty(style.height)) {
        return parseInt(style.height);
    }
    return Number.NaN;
}
tab.DomUtil.createNamespacedEventName = function tab_DomUtil$createNamespacedEventName(eventName, eventNamespace) {
    if (ss.isValue(eventNamespace)) {
        return eventName + eventNamespace;
    }
    return eventName;
}
tab.DomUtil.stopPropagationOfInputEvents = function tab_DomUtil$stopPropagationOfInputEvents(o, eventNamespace) {
    var stopPropagation = function(e) {
        e.stopPropagation();
    };
    tab.DomUtil.handleInputEvents(o, eventNamespace, stopPropagation);
}
tab.DomUtil.handleInputEvents = function tab_DomUtil$handleInputEvents(o, eventNamespace, handler) {
    o.bind(tab.DomUtil.createNamespacedEventName('touchstart', eventNamespace), handler).bind(tab.DomUtil.createNamespacedEventName('touchcancel', eventNamespace), handler).bind(tab.DomUtil.createNamespacedEventName('touchend', eventNamespace), handler).bind(tab.DomUtil.createNamespacedEventName('touchmove', eventNamespace), handler).bind(tab.DomUtil.createNamespacedEventName('click', eventNamespace), handler).bind(tab.DomUtil.createNamespacedEventName('mousedown', eventNamespace), handler).bind(tab.DomUtil.createNamespacedEventName('mousemove', eventNamespace), handler).bind(tab.DomUtil.createNamespacedEventName('mouseup', eventNamespace), handler);
}
tab.DomUtil.isMouseOnlyWidget = function tab_DomUtil$isMouseOnlyWidget(domElement) {
    var dojoParent = $(domElement).closest("[dojoattachevent], '.tabAuthTransparencyControlContainer'");
    if (dojoParent.length > 0) {
        return true;
    }
    return false;
}
tab.DomUtil.isFocusableTextElement = function tab_DomUtil$isFocusableTextElement(domElement) {
    if (ss.isValue(domElement) && ss.isValue(domElement.tagName)) {
        var targetTagName = domElement.tagName.toLowerCase();
        if ((targetTagName === 'textarea') || (targetTagName === 'input') || (targetTagName === 'select')) {
            return true;
        }
    }
    return false;
}
tab.DomUtil.isCheckboxElement = function tab_DomUtil$isCheckboxElement(domElement) {
    if (ss.isValue(domElement) && ss.isValue(domElement.tagName)) {
        var targetTagName = domElement.tagName.toLowerCase();
        var typeAttributeValue = $(domElement).attr('type');
        if (targetTagName === 'input' && typeAttributeValue === 'checkbox') {
            return true;
        }
    }
    return false;
}
tab.DomUtil.handleTouchEvents = function tab_DomUtil$handleTouchEvents(domElement) {
    if (tab.DomUtil.isMouseOnlyWidget(domElement)) {
        return false;
    }
    if (tab.DomUtil.isCheckboxElement(domElement)) {
        return false;
    }
    if (tab.DomUtil.isFocusableTextElement(domElement)) {
        return false;
    }
    return true;
}
tab.DomUtil.setCapture = function tab_DomUtil$setCapture(e, retargetToElement) {
    if (!tab.BrowserSupport.get_mouseCapture()) {
        return;
    }
    e.setCapture(retargetToElement);
}
tab.DomUtil.releaseCapture = function tab_DomUtil$releaseCapture() {
    if (!tab.BrowserSupport.get_mouseCapture()) {
        return;
    }
    document.releaseCapture();
}
tab.DomUtil._setOuterWidth = function tab_DomUtil$_setOuterWidth(o, outerWidth) {
    var marginLeft = (parseInt(o.css('margin-left'), 10) || 0);
    var borderLeft = (parseInt(o.css('border-left-width'), 10) || 0);
    var paddingLeft = (parseInt(o.css('padding-left'), 10) || 0);
    var paddingRight = (parseInt(o.css('padding-right'), 10) || 0);
    var borderRight = (parseInt(o.css('border-right-width'), 10) || 0);
    var marginRight = (parseInt(o.css('margin-right'), 10) || 0);
    var newVal = Math.max(outerWidth - marginLeft - borderLeft - paddingLeft - paddingRight - borderRight - marginRight, 0);
    o.width(newVal);
}
tab.DomUtil._setOuterHeight = function tab_DomUtil$_setOuterHeight(o, outerHeight) {
    var marginTop = (parseInt(o.css('margin-top'), 10) || 0);
    var borderTop = (parseInt(o.css('border-top-width'), 10) || 0);
    var paddingTop = (parseInt(o.css('padding-top'), 10) || 0);
    var paddingBottom = (parseInt(o.css('padding-bottom'), 10) || 0);
    var borderBottom = (parseInt(o.css('border-bottom-width'), 10) || 0);
    var marginBottom = (parseInt(o.css('margin-bottom'), 10) || 0);
    var newVal = Math.max(outerHeight - marginTop - borderTop - paddingTop - paddingBottom - borderBottom - marginBottom, 0);
    o.height(newVal);
}
tab.DomUtil._parseZIndexProperty = function tab_DomUtil$_parseZIndexProperty(o) {
    tab.Param.verifyValue(o, 'o');
    var zindexProperty = o.css('z-index');
    if (_.isNumber(zindexProperty)) {
        return zindexProperty;
    }
    if (_.isString(zindexProperty)) {
        if (!String.isNullOrEmpty(zindexProperty) && zindexProperty !== 'auto' && zindexProperty !== 'inherits') {
            return parseInt(zindexProperty, 10);
        }
    }
    return 0;
}
tab.DomUtil.makeHtmlSafeId = function tab_DomUtil$makeHtmlSafeId(value) {
    return encodeURIComponent(value).replaceAll('.', 'dot');
}
tab.DomUtil.setSelectionRangeOnInput = function tab_DomUtil$setSelectionRangeOnInput(inputElement, selectionStart, selectionEnd) {
    if (tab.BrowserSupport.get_setSelectionRange()) {
        try {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
        }
        catch ($e1) {
        }
    }
}
tab.DomUtil.selectAllInputText = function tab_DomUtil$selectAllInputText(inputElement) {
    try {
        if (tab.BrowserSupport.get_setSelectionRange()) {
            inputElement.get(0).setSelectionRange(0, inputElement.val().length);
        }
        else {
            inputElement.select();
        }
    }
    catch ($e1) {
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.FloatUtil

tab.FloatUtil = function tab_FloatUtil() {
}
tab.FloatUtil.isEqual = function tab_FloatUtil$isEqual(f1, f2) {
    var isF1Zero = tab.FloatUtil.isZero(f1);
    if (isF1Zero) {
        return tab.FloatUtil.isZero(f2);
    }
    if (tab.FloatUtil.isZero(f2)) {
        return false;
    }
    var intermediate = f2 / f1;
    return tab.FloatUtil._lowerBound < intermediate && intermediate < tab.FloatUtil._upperBound;
}
tab.FloatUtil.isZero = function tab_FloatUtil$isZero(f) {
    return !(f > 0 || f < 0);
}
tab.FloatUtil.isLessThan = function tab_FloatUtil$isLessThan(f1, f2) {
    return f1 < f2 && !tab.FloatUtil.isEqual(f1, f2);
}
tab.FloatUtil.isLessThanOrEqual = function tab_FloatUtil$isLessThanOrEqual(f1, f2) {
    return f1 < f2 || tab.FloatUtil.isEqual(f1, f2);
}
tab.FloatUtil.isGreaterThan = function tab_FloatUtil$isGreaterThan(f1, f2) {
    return f1 > f2 || !tab.FloatUtil.isEqual(f1, f2);
}
tab.FloatUtil.isGreaterThanOrEqual = function tab_FloatUtil$isGreaterThanOrEqual(f1, f2) {
    return f1 > f2 || tab.FloatUtil.isEqual(f1, f2);
}


////////////////////////////////////////////////////////////////////////////////
// tableau.format

tableau.format = function tableau_format() {
}
tableau.format.get__log = function tableau_format$get__log() {
    return tab.Logger.lazyGetLogger(tableau.format);
}
tableau.format.get_isO8601DateFormat = function tableau_format$get_isO8601DateFormat() {
    return tableau.format._iso8601DateFormat;
}
tableau.format.get_isO8601DateTimeFormat = function tableau_format$get_isO8601DateTimeFormat() {
    return tableau.format._iso8601DateTimeFormat;
}
tableau.format.get_isO8601TimeFormat = function tableau_format$get_isO8601TimeFormat() {
    return tableau.format._iso8601TimeFormat;
}
tableau.format.formatDataValue = function tableau_format$formatDataValue(dv, role, format, precision, showFullDateTimes) {
    tableau.format.get__log().debug('FormatDataValue - dv=%o, role=%s, format=%o, precision=%n, showFullDateTime, %b', dv, role, format, precision, showFullDateTimes);
    var dvs = dv.s;
    if (ss.isNullOrUndefined(dvs) || dvs == null) {
        var dvt = (('t' in dv)) ? dv.t : '';
        var dvv = dv.v;
        switch (dvt) {
            case 's':
                return dvv;
            case 'b':
                return dvv.toString();
            case 'i':
                if (typeof(dvv) !== 'number') {
                    dvv = parseInt(dvv, 10);
                }
                return (role === 'd') ? tableau.format._formatRawInt(dvv).toString() : tableau.format._formatInt(dvv, format);
            case 'r':
                if (typeof(dvv) !== 'number') {
                    dvv = parseFloat(dvv);
                }
                return tableau.format._formatReal(dvv, dvt, format, precision, role);
            case 't':
                return (_.isDate(dvv)) ? tableau.format.formatJsDateTime(dvv, format, showFullDateTimes, dvt) : tableau.format._formatOleDateTime(dvv, format, showFullDateTimes, dvt);
            case 'd':
                return (_.isDate(dvv)) ? tableau.format.formatJsDateTime(dvv, format, 0, dvt) : tableau.format._formatOleDateTime(dvv, format, 0, dvt);
        }
        throw Error.createError('Invalid Tableau Format Type', null);
    }
    if (dvs === 'n') {
        return 'null';
    }
    if (dvs === 'm') {
        return tab.Strings.SpecialMissing;
    }
    return '#special:' + dvs + '#';
}
tableau.format.parseQuantitativeDataValue = function tableau_format$parseQuantitativeDataValue(input, dataType, format, showFullDateTimes, oldValue) {
    switch (dataType) {
        case 'i':
            return parseInt(tableau.format.reformatNumberToJsFormat(input, format), 10);
        case 'r':
            return parseFloat(tableau.format.reformatNumberToJsFormat(input, format));
        case 'd':
        case 't':
            var dateStr = tableau.format.formatToJSCompliantFormat(input, format, showFullDateTimes, oldValue);
            return tableau.types.OleDateFromJsDate(Date.parseDate(dateStr + ' GMT').getTime());
    }
    ss.Debug.fail('Invalid Quantitative Data Type: ' + dataType);
    return (ss.isValue(oldValue)) ? oldValue.v : 0;
}
tableau.format.reformatNumberToJsFormat = function tableau_format$reformatNumberToJsFormat(numberString, format) {
    var escapedSeparators = format[8].replace(tableau.format._regexpMetacharacters, '\\$1');
    if (escapedSeparators.indexOf('\u00a0') !== -1) {
        escapedSeparators += ' ';
    }
    var escapedDecimals = format[7].replace(tableau.format._regexpMetacharacters, '\\$1');
    return numberString.replace(new RegExp('[' + escapedSeparators + ']', 'g'), '').replace(new RegExp('[' + escapedDecimals + ']', 'g'), '.');
}
tableau.format.formatToJSCompliantFormat = function tableau_format$formatToJSCompliantFormat(dateTimeString, format, showFullDateTimes, previousValue) {
    var normalizedDateTimeFormat = tableau.format.normalizeDateTimeFormat(format, showFullDateTimes, previousValue.t);
    var tokens = tableau.format.tokenizeDateTime(dateTimeString, normalizedDateTimeFormat, showFullDateTimes);
    if (ss.isValue(tokens)) {
        return tableau.format._assembleDateString(tokens, previousValue);
    }
    else {
        return '';
    }
}
tableau.format.normalizeDateTimeFormat = function tableau_format$normalizeDateTimeFormat(format, showFullDateTimes, dataValueType) {
    var dateTimeFormat = format.format;
    var timeFormat = format.timeFormat;
    if (dateTimeFormat.charAt(0) === '*') {
        dateTimeFormat = dateTimeFormat.substr(1);
    }
    if (!!showFullDateTimes && ss.isValue(timeFormat) && (ss.isNullOrUndefined(format.originalFormat) || 0 === format.originalFormat.length || format.originalFormat === 'S') && (dataValueType === 't')) {
        if (timeFormat.charAt(0) === '*') {
            timeFormat = timeFormat.substr(1);
        }
        dateTimeFormat = dateTimeFormat + ' ' + timeFormat;
    }
    dateTimeFormat = dateTimeFormat.replace(new RegExp('ampm', 'g'), 'tt');
    dateTimeFormat = dateTimeFormat.replaceAll('H', 'h');
    dateTimeFormat = dateTimeFormat.replace(tableau.format._charactersAfterDay, function(matched) {
        return matched.replace(new RegExp('m', 'gi'), 'm');
    });
    dateTimeFormat = dateTimeFormat.replace(tableau.format._charactersAfterHour, function(matched) {
        return matched.replace(new RegExp('m', 'gi'), 'n');
    });
    return dateTimeFormat;
}
tableau.format.tokenizeDateTime = function tableau_format$tokenizeDateTime(dateTime, normalizedDateTimeFormat, showFullDateTimes) {
    var formatParse = normalizedDateTimeFormat;
    formatParse = formatParse.replace(tableau.format._regexpMetacharacters, '\\$1');
    formatParse = formatParse.replace(tableau.format._tt, '($1)');
    formatParse = formatParse.replace(tableau.format._numericFields, '($1)');
    var formatTokens = normalizedDateTimeFormat.match(new RegExp(formatParse));
    var dateTimeParse = normalizedDateTimeFormat;
    dateTimeParse = dateTimeParse.replace(tableau.format._regexpMetacharacters, '\\$1');
    if (showFullDateTimes === 1) {
        dateTimeParse = dateTimeParse.replace(tableau.format._dateSpaceTime, '(?:$1 )?$2');
    }
    else {
        dateTimeParse = dateTimeParse.replace(tableau.format._dateSpaceTime, '$1(?: $2)?');
    }
    dateTimeParse = dateTimeParse.replace(tableau.format._secondsField, '(?:$1)?');
    dateTimeParse = dateTimeParse.replace(tableau.format._numericFields, '(\\d+)');
    dateTimeParse = dateTimeParse.replace(tableau.format._tt, '([^0-9\\s]+)?');
    dateTimeParse = dateTimeParse.replace(tableau.format._spaceBetweenNumbers, function(match) {
        return match.replace(new RegExp('\\s+', 'g'), '\\s+');
    });
    dateTimeParse = dateTimeParse.replace(tableau.format._otherWhitespace, '\\s*');
    var tokens = dateTime.match(new RegExp(dateTimeParse));
    if (ss.isNullOrUndefined(tokens)) {
        return null;
    }
    var tokenMap = {};
    for (var t = 1; t < tokens.length; ++t) {
        if (ss.isValue(tokens[t]) && tokens[t].length > 0) {
            tokenMap[formatTokens[t].substr(0, 1).toLowerCase()] = tokens[t];
        }
    }
    return tokenMap;
}
tableau.format._assembleDateString = function tableau_format$_assembleDateString(tokens, previousValue) {
    if (!Object.keyExists(tokens, 'y') && !Object.keyExists(tokens, 'm') && !Object.keyExists(tokens, 'd')) {
        var baseDate = (('v' in previousValue)) ? new Date(tableau.types.JsDateFromOleDate(previousValue.v)) : new Date(tableau.types.javaScriptOLEEpoch());
        tokens['y'] = baseDate.getUTCFullYear().toString();
        tokens['m'] = (baseDate.getUTCMonth() + 1).toString();
        tokens['d'] = baseDate.getUTCDate().toString();
    }
    var yearToken = tokens['y'].replace(new RegExp('^(\\d{2})$'), function(m) {
        var year = parseInt(m, 10);
        return (year < 30) ? ('20' + m) : ('19' + m);
    });
    var finalDateString = tokens['m'] + '/' + tokens['d'] + '/' + yearToken;
    if (Object.keyExists(tokens, 'h') && Object.keyExists(tokens, 'n')) {
        finalDateString += ' ' + tokens['h'] + ':' + tokens['n'] + ':';
        finalDateString += (Object.keyExists(tokens, 's')) ? tokens['s'] : '00';
        if (Object.keyExists(tokens, 't')) {
            if (ss.isValue(tokens['t'].match(tableau.format._am))) {
                finalDateString += ' am';
            }
            else if (ss.isValue(tokens['t'].match(tableau.format._pm))) {
                finalDateString += ' pm';
            }
        }
    }
    return finalDateString;
}
tableau.format.adjustFyFormat = function tableau_format$adjustFyFormat(d, fiscalYearStart) {
    var year = d.getUTCFullYear();
    var month = d.getUTCMonth() + 1;
    var day = d.getUTCDate();
    if (month < fiscalYearStart) {
        month += 13 - fiscalYearStart;
    }
    else {
        month -= fiscalYearStart - 1;
        ++year;
    }
    if (day > 28 && month === 2) {
        if (!!(year % 4) || (!!(year % 400) && !(year % 100))) {
            day = 28;
        }
        else {
            day = 29;
        }
    }
    else if (day > 30 && (month === 4 || month === 6 || month === 9 || month === 11)) {
        day = 30;
    }
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
}
tableau.format.formatCustomJSDateTime = function tableau_format$formatCustomJSDateTime(d, format, showFullDateTimes, dataValueType, locale, originalFormat, timeFormat, localeFormattingStrings, calOpts) {
    var i = 0, lastHour = 0, len;
    if (ss.isNullOrUndefined(calOpts)) {
        calOpts = new tab.CalendarOptions();
    }
    var hasTimeFormat = ss.isValue(timeFormat);
    var originalFormatIsAuto = (ss.isNullOrUndefined(originalFormat) || 0 === originalFormat.length || originalFormat === 'S');
    var isTimeType = (dataValueType === 't');
    if (!!showFullDateTimes && hasTimeFormat && originalFormatIsAuto && isTimeType) {
        if (timeFormat.charAt(0) === '*') {
            timeFormat = timeFormat.substr(1);
        }
        if (showFullDateTimes === 2) {
            format = format + ' ' + timeFormat;
        }
        else {
            format = timeFormat;
        }
    }
    if (format === 'L') {
        format = '*dddd, mmmm dd, yyyy';
    }
    if (format.charAt(0) === '*') {
        format = format.substr(1);
    }
    len = format.length;
    var year, yearOfWeek;
    if (calOpts.fiscalYearStart > 1) {
        year = yearOfWeek = tableau.format.dtGetFiscalYear(d, calOpts.fiscalYearStart);
    }
    else {
        year = d.getUTCFullYear();
        yearOfWeek = (calOpts.brokenWeeks) ? year : tableau.format._dtGetYearOfWeekOfYear(d, calOpts.startOfWeek, calOpts.minDaysInFirstWeek);
    }
    var longYearOfWeek = yearOfWeek.toString();
    var shortYearOfWeek = longYearOfWeek.substr(longYearOfWeek.length - 2);
    var longCalendarYear = year.toString();
    var shortCalendarYear = longCalendarYear.substr(longCalendarYear.length - 2);
    var tokens = [];
    tokens.add(new tab.StringTuple('ampm', tableau.format._dtGetAmPm(d)));
    tokens.add(new tab.StringTuple('tt', tableau.format._dtGetAmPm(d)));
    tokens.add(new tab.StringTuple('yyyy', longCalendarYear));
    tokens.add(new tab.StringTuple('yy', shortCalendarYear));
    tokens.add(new tab.StringTuple('mmmm', tableau.format._dtGetLongMonth(d, localeFormattingStrings)));
    tokens.add(new tab.StringTuple('mmm', tableau.format._dtGetShortMonth(d, localeFormattingStrings)));
    tokens.add(new tab.StringTuple('dddd', tableau.format._dtGetLongDay(d, localeFormattingStrings)));
    tokens.add(new tab.StringTuple('ddd', tableau.format._dtGetShortDay(d, localeFormattingStrings)));
    tokens.add(new tab.StringTuple('mm', tableau.format._pad(d.getUTCMonth() + 1, 2)));
    tokens.add(new tab.StringTuple('m', (d.getUTCMonth() + 1).toString()));
    tokens.add(new tab.StringTuple('dd', tableau.format._pad(d.getUTCDate(), 2)));
    tokens.add(new tab.StringTuple('d', d.getUTCDate().toString()));
    tokens.add(new tab.StringTuple('hh', tableau.format._pad(tableau.format._dtGetHours24(d), 2)));
    tokens.add(new tab.StringTuple('h', tableau.format._dtGetHours24(d).toString()));
    tokens.add(new tab.StringTuple('nn', tableau.format._pad(d.getUTCMinutes(), 2)));
    tokens.add(new tab.StringTuple('n', d.getUTCMinutes().toString()));
    tokens.add(new tab.StringTuple('ss', tableau.format._pad(d.getUTCSeconds(), 2)));
    tokens.add(new tab.StringTuple('s', d.getUTCSeconds().toString()));
    tokens.add(new tab.StringTuple('ww', tableau.format._dtGetWeekOfYear(d, calOpts).toString()));
    tokens.add(new tab.StringTuple('y', tableau.format._dtGetDayOfYear(d).toString()));
    tokens.add(new tab.StringTuple('w', (d.getUTCDay() + 1).toString()));
    tokens.add(new tab.StringTuple('q', tableau.format.dtGetFiscalQuarter(d, calOpts.fiscalYearStart).toString()));
    var result = [];
    var seenHours = null;
    var seenWeeks = false;
    var seenDateParts = false;
    var lastYearPlaceholder = -1;
    var lastYearIsLong = false;
    var lastTokenWasYear = false;
    var canChangeLastYear = false;
    while (i < len) {
        var matchedToken = false;
        var tokenIsYear = false;
        var $enum1 = ss.IEnumerator.getEnumerator(tokens);
        while ($enum1.moveNext()) {
            var pair = $enum1.current;
            var pattern = pair.get_first();
            var value = pair.get_second();
            if (pattern === format.substr(i, pattern.length).toLowerCase()) {
                matchedToken = true;
                result.add(value);
                i += pattern.length;
                if (ss.isValue(seenHours) && pattern === 'mm') {
                    result[result.length - 1] = tableau.format._pad(d.getUTCMinutes(), 2);
                }
                if (ss.isValue(seenHours) && pattern === 'm') {
                    result[result.length - 1] = d.getUTCMinutes().toString();
                }
                if (pattern.charAt(0) === 'd') {
                    seenHours = null;
                }
                if (pattern.charAt(0) === 'h') {
                    seenHours = pattern;
                    lastHour = result.length - 1;
                }
                if (ss.isValue(seenHours) && (pattern === 'ampm' || pattern === 'tt')) {
                    result[lastHour] = (seenHours === 'hh') ? tableau.format._pad(tableau.format._dtGetHours12(d), 2) : tableau.format._dtGetHours12(d).toString();
                }
                switch (pattern.charAt(0)) {
                    case 'y':
                        if (pattern.length > 1) {
                            tokenIsYear = true;
                            lastYearPlaceholder = result.length - 1;
                            lastYearIsLong = pattern.length === 4;
                            canChangeLastYear = true;
                            if (seenWeeks) {
                                if (!calOpts.brokenWeeks) {
                                    result[lastYearPlaceholder] = (lastYearIsLong) ? longYearOfWeek : shortYearOfWeek;
                                    canChangeLastYear = false;
                                }
                                seenWeeks = false;
                            }
                        }
                        break;
                    case 'w':
                        if (pattern.length !== 2) {
                            break;
                        }
                        var hadSeenWeeks = seenWeeks;
                        seenWeeks = true;
                        if (!hadSeenWeeks && !seenDateParts && canChangeLastYear) {
                            if (!calOpts.brokenWeeks) {
                                result[lastYearPlaceholder] = (lastYearIsLong) ? longYearOfWeek : shortYearOfWeek;
                                canChangeLastYear = false;
                            }
                            seenWeeks = false;
                        }
                        seenDateParts = false;
                        break;
                    case 'm':
                    case 'd':
                    case 'q':
                        if ((pattern === 'mm' || pattern === 'm') && ss.isValue(seenHours)) {
                            break;
                        }
                        seenWeeks = false;
                        seenDateParts = true;
                        break;
                }
                break;
            }
        }
        if (matchedToken) {
            lastTokenWasYear = tokenIsYear;
            continue;
        }
        if (format.charAt(i) === '\\') {
            result.add(format.substr(i + 1, 1));
            i += 2;
        }
        else if (format.charAt(i) === '"') {
            var quote = format.charAt(i);
            var start = ++i;
            while (i < len && format.charAt(i) !== quote) {
                i += 1;
            }
            if (start < len && i > start) {
                result.add(format.substr(start, i - start));
            }
            if (i < len) {
                i += 1;
            }
        }
        else if (format.charAt(i) === '[') {
            var j = ++i;
            while (j < format.length && format.charAt(j) !== ']') {
                j++;
            }
            var contents = format.substring(i, j);
            if ((contents === 'y' || contents === 'Y') && lastTokenWasYear) {
                result[lastYearPlaceholder] = (contents === 'y') ? ((lastYearIsLong) ? longCalendarYear : shortCalendarYear) : ((lastYearIsLong) ? longYearOfWeek : shortYearOfWeek);
                canChangeLastYear = false;
            }
            i = j + 1;
        }
        else {
            result.add(format.charAt(i).toString());
            i += 1;
        }
        lastTokenWasYear = tokenIsYear;
    }
    format = result.join('');
    return format;
}
tableau.format.mapIcuToOleFormat = function tableau_format$mapIcuToOleFormat(icuFormat) {
    return tableau.format._mapTokens(tableau.format._icuToOleMap, icuFormat);
}
tableau.format._mapTokens = function tableau_format$_mapTokens(tokens, input) {
    if (tokens == null || String.isNullOrEmpty(input)) {
        return input;
    }
    var sb = new ss.StringBuilder();
    var start = 0;
    var end = 0;
    var token = null;
    while (++end <= input.length) {
        var tmp = tokens[input.substring(start, end)];
        if (ss.isValue(tmp)) {
            token = tmp;
        }
        else {
            if (token != null) {
                sb.append(token);
                --end;
            }
            else {
                sb.append(input.substring(start, start + 1));
            }
            start = end;
            token = null;
        }
    }
    if (token != null) {
        sb.append(token);
    }
    return sb.toString();
}
tableau.format.escapeHTML = function tableau_format$escapeHTML(html) {
    return tab.EscapingUtil.escapeHtml(html);
}
tableau.format.formatSchemaDisplayName = function tableau_format$formatSchemaDisplayName(schema) {
    var ret = '';
    var $enum1 = ss.IEnumerator.getEnumerator(schema);
    while ($enum1.moveNext()) {
        var t = $enum1.current;
        if (!!ret.length) {
            ret += ',';
        }
        ret += tableau.format.formatColumnDisplayName(t, false);
    }
    return ret;
}
tableau.format.formatColumnDisplayName = function tableau_format$formatColumnDisplayName(column, suppressDSName) {
    var caption = column.caption;
    var displayname;
    if (!ss.isUndefined(caption)) {
        displayname = caption;
    }
    else {
        var name = column.name;
        displayname = (suppressDSName) ? name.extract(1).join('.') : tableau.format.formatQualifiedName(name);
    }
    return tab.EscapingUtil.escapeHtml(displayname);
}
tableau.format.formatTupleDisplayName = function tableau_format$formatTupleDisplayName(tuple, noEscape, role) {
    if (ss.isNullOrUndefined(tuple)) {
        return ' ';
    }
    var d = tuple.d;
    var s = (ss.isValue(d)) ? d : tableau.format.formatTupleUniqueName(tuple, role);
    var toReturn = (noEscape) ? s : tableau.format.escapeHTML(s);
    return (toReturn || ' ');
}
tableau.format.formatTupleUniqueName = function tableau_format$formatTupleUniqueName(tuple, role) {
    var ret = '';
    if (ss.isValue(tuple)) {
        var rgdv = tuple.t;
        if (ss.isValue(rgdv)) {
            var $enum1 = ss.IEnumerator.getEnumerator(rgdv);
            while ($enum1.moveNext()) {
                var t = $enum1.current;
                if (!!ret.length) {
                    ret += ',';
                }
                ret += tableau.format.formatDataValue(t, role);
            }
        }
    }
    return ret;
}
tableau.format.formatTupleDisplayFacet = function tableau_format$formatTupleDisplayFacet(tuple, noEscape, role) {
    var s = tableau.format.formatTupleFacet(tuple, role);
    return (noEscape) ? s : tableau.format.escapeHTML(s);
}
tableau.format.formatTupleFacet = function tableau_format$formatTupleFacet(tuple, role) {
    var ret = '';
    if (ss.isValue(tuple)) {
        var rgdv = tuple.f;
        if (ss.isValue(rgdv)) {
            var $enum1 = ss.IEnumerator.getEnumerator(rgdv);
            while ($enum1.moveNext()) {
                var f = $enum1.current;
                if (!!ret.length) {
                    ret += ',';
                }
                ret += tableau.format.formatDataValue(f, role);
            }
        }
    }
    return ret;
}
tableau.format.formatAliasedDataValue = function tableau_format$formatAliasedDataValue(adv, role, precision, showFullDateTimes) {
    if (ss.isValue(adv[1])) {
        return adv[1];
    }
    return tableau.format.formatDataValue(adv[0], role, null, precision, showFullDateTimes);
}
tableau.format.formatQualifiedName = function tableau_format$formatQualifiedName(qname) {
    var ret = '';
    var $enum1 = ss.IEnumerator.getEnumerator(qname);
    while ($enum1.moveNext()) {
        var t = $enum1.current;
        if (!!ret.length) {
            ret += '.';
        }
        ret += '[' + t.replace(new RegExp('\\]', 'g'), ']]') + ']';
    }
    return ret;
}
tableau.format.formatIntAuto = function tableau_format$formatIntAuto(v, doSeparators, separatorStr, groupingSpecStr) {
    var result = tableau.format._applySeparators(v, doSeparators, separatorStr, groupingSpecStr);
    return (tableau.format._trunc(v) >= 0) ? result : '-' + result;
}
tableau.format.isDateTimeWithNonMidnightTime = function tableau_format$isDateTimeWithNonMidnightTime(dv) {
    return (ss.isValue(dv) && (!('s' in dv) || dv.s == null)) && dv.t === 't' && !tableau.format._isMidnight(new Date(tableau.types.JsDateFromOleDate(dv.v)));
}
tableau.format.applyDecimalPlaces = function tableau_format$applyDecimalPlaces(v, places, decimalStr) {
    if (places >= 0) {
        var fpart = v - tableau.format._trunc(v);
        var str = tableau.format._toFixedRounded(fpart, places);
        var parsedInt = parseInt(str, 10);
        if (Math.abs(parsedInt) === 1) {
            return parsedInt;
        }
        if (!places) {
            return '';
        }
        str = str.replace(new RegExp('^-?0\\.'), decimalStr);
        return str;
    }
    return '';
}
tableau.format.formatString = function tableau_format$formatString(value, vizColumn) {
    var type = vizColumn.dataType;
    var formatStrings = vizColumn.formatStrings;
    var role = vizColumn.fieldRole;
    var format = formatStrings;
    var dataValueType = '';
    var dataValueValue = value;
    switch (type) {
        case 'cstring':
            dataValueType = 's';
            break;
        case 'date':
            dataValueType = 'd';
            dataValueValue = tab.DateUtil.parsePresModelDate(value);
            format = tableau.format._convertFormatStringsToFormattingInfo(formatStrings);
            break;
        case 'datetime':
            dataValueType = 't';
            dataValueValue = tab.DateUtil.parsePresModelDate(value);
            format = tableau.format._convertFormatStringsToFormattingInfo(formatStrings);
            break;
        case 'integer':
            dataValueType = 'i';
            dataValueValue = parseInt(value);
            break;
        case 'real':
            dataValueType = 'r';
            dataValueValue = parseFloat(value);
            break;
        case 'tuple':
            dataValueType = 's';
            dataValueValue = tableau.format._formatTupleString(value);
            break;
        case 'unknown':
        default:
            dataValueType = null;
            break;
    }
    var dataValue = {};
    dataValue.t = dataValueType;
    dataValue.v = dataValueValue;
    var tableauTypesRole;
    switch (role) {
        case 'dimension':
            tableauTypesRole = 'd';
            break;
        case 'measure':
            tableauTypesRole = 'm';
            break;
        case 'unknown':
        default:
            tableauTypesRole = null;
            break;
    }
    return tableau.format.formatDataValue(dataValue, tableauTypesRole, format, null, 0);
}
tableau.format.formatSpecial = function tableau_format$formatSpecial(specialValue, specialOverride) {
    if (ss.isValue(specialOverride)) {
        return specialOverride;
    }
    switch (specialValue) {
        case '%many-values%':
            return tab.Strings.SpecialManyValues;
        case '%null%':
            return '';
        case '%error%':
            return tab.Strings.SpecialError;
        case '%ragged%':
            return tab.Strings.SpecialRagged;
        case '%skipped%':
            return tab.Strings.SpecialSkipped;
        case '%missing%':
            return '';
        case '%all%':
            return tab.Strings.SpecialAll;
        case '%no-access%':
            return tab.Strings.SpecialNoAccess;
        case '%wildcard%':
            return tab.Strings.SpecialWildcard;
        default:
            return '#Special';
    }
}
tableau.format.isSpecialValue = function tableau_format$isSpecialValue(value) {
    return (value === '%many-values%' || value === '%null%' || value === '%error%' || value === '%ragged%' || value === '%skipped%' || value === '%missing%' || value === '%all%' || value === '%no-access%' || value === '%wildcard%');
}
tableau.format.stripFormattedText = function tableau_format$stripFormattedText(formattedText) {
    if (ss.isNullOrUndefined(formattedText)) {
        return null;
    }
    return $(formattedText).find('run').text();
}
tableau.format.deriveNumberEditingFormat = function tableau_format$deriveNumberEditingFormat(format) {
    if (ss.isNullOrUndefined(format)) {
        return null;
    }
    return ['', format[1], format[2], '', '', '', '', format[7], format[8], format[9]];
}
tableau.format._getShortLocale = function tableau_format$_getShortLocale(locale) {
    var languages = { en: true, fr: true, de: true };
    if (ss.isNullOrUndefined(locale) || String.isNullOrEmpty(locale)) {
        return 'en';
    }
    var shortLocale = (locale).substr(0, 2);
    if (String.isNullOrEmpty(shortLocale) || !Object.keyExists(languages, shortLocale)) {
        return 'en';
    }
    return shortLocale;
}
tableau.format._pad = function tableau_format$_pad(n, d) {
    var ret = n.toString();
    while (ret.length < d) {
        ret = '0' + ret;
    }
    return ret;
}
tableau.format._isMidnight = function tableau_format$_isMidnight(dt) {
    return ss.isValue(dt) && ((!dt.getUTCHours() && !dt.getUTCMinutes() && !dt.getUTCSeconds()) || (dt.getUTCHours() === 23 && dt.getUTCMinutes() === 59 && dt.getUTCSeconds() === 59));
}
tableau.format._dtGetAmPm = function tableau_format$_dtGetAmPm(d) {
    return (d.getUTCHours() < 12) ? 'AM' : 'PM';
}
tableau.format._dtGetHours12 = function tableau_format$_dtGetHours12(d) {
    var hours = d.getUTCHours();
    if (hours < 12) {
        if (!hours) {
            hours = 12;
        }
    }
    else if (hours > 12) {
        hours -= 12;
    }
    return hours;
}
tableau.format._dtGetHours24 = function tableau_format$_dtGetHours24(d) {
    return d.getUTCHours();
}
tableau.format._dtGetDayOfYear = function tableau_format$_dtGetDayOfYear(d) {
    var startOfYear = new Date(d.getUTCFullYear(), 0, 1, 12);
    var today = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12);
    return Math.round((today - startOfYear) / 86400000) + 1;
}
tableau.format._calendarYearContainingFiscalYearStart = function tableau_format$_calendarYearContainingFiscalYearStart(d, fiscalYearStart) {
    return d.getUTCFullYear() + ((d.getUTCMonth() + 1 < fiscalYearStart) ? -1 : 0);
}
tableau.format._dtGetYearOfWeekOfYear = function tableau_format$_dtGetYearOfWeekOfYear(d, startOfWeek, minDaysInFirstWeek) {
    var daysSinceStartOfWeek = (d.getUTCDay() + 7 - (startOfWeek - 1)) % 7;
    var dateOffset = -daysSinceStartOfWeek + (7 - minDaysInFirstWeek);
    var newDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + dateOffset));
    return newDate.getUTCFullYear();
}
tableau.format._dtGetWeekOfYear = function tableau_format$_dtGetWeekOfYear(d, calOpts) {
    var startOfYear;
    if (calOpts.fiscalYearStart <= 1) {
        var yearToUse = (calOpts.brokenWeeks) ? d.getUTCFullYear() : tableau.format._dtGetYearOfWeekOfYear(d, calOpts.startOfWeek, calOpts.minDaysInFirstWeek);
        startOfYear = new Date(Date.UTC(yearToUse, 0, 1));
    }
    else {
        startOfYear = new Date(Date.UTC(tableau.format._calendarYearContainingFiscalYearStart(d, calOpts.fiscalYearStart), calOpts.fiscalYearStart - 1, 1));
    }
    var truncatedDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    var daysInFirstWeekBeforeFirstDayOfYear = (startOfYear.getUTCDay() + 7 - (calOpts.startOfWeek - 1)) % 7;
    var dayDiff = ((truncatedDate - startOfYear) / 86400000) + daysInFirstWeekBeforeFirstDayOfYear;
    if (calOpts.fiscalYearStart <= 1 && 7 - daysInFirstWeekBeforeFirstDayOfYear < calOpts.minDaysInFirstWeek) {
        dayDiff -= 7;
    }
    return Math.floor(dayDiff / 7) + 1;
}
tableau.format.dtGetFiscalYear = function tableau_format$dtGetFiscalYear(d, fiscalYearStart) {
    var year = d.getUTCFullYear();
    var month = d.getUTCMonth() + 1;
    return ((month < fiscalYearStart || fiscalYearStart === 1) ? 0 : 1) + year;
}
tableau.format.dtGetFiscalQuarter = function tableau_format$dtGetFiscalQuarter(d, fiscalYearStart) {
    if (fiscalYearStart < 1) {
        fiscalYearStart = 1;
    }
    return Math.floor((((d.getUTCMonth() + 1) - fiscalYearStart + 12) % 12) / 3) + 1;
}
tableau.format._dtGetLongDay = function tableau_format$_dtGetLongDay(d, format) {
    if (ss.isNullOrUndefined(format)) {
        return null;
    }
    return format.day[d.getUTCDay() + 1];
}
tableau.format._dtGetShortDay = function tableau_format$_dtGetShortDay(d, format) {
    if (ss.isNullOrUndefined(format)) {
        return null;
    }
    return format.shortDay[d.getUTCDay() + 1];
}
tableau.format._dtGetLongMonth = function tableau_format$_dtGetLongMonth(d, format) {
    if (ss.isNullOrUndefined(format)) {
        return null;
    }
    return format.month[d.getUTCMonth()];
}
tableau.format._dtGetShortMonth = function tableau_format$_dtGetShortMonth(d, format) {
    if (ss.isNullOrUndefined(format)) {
        return null;
    }
    return format.shortMonth[d.getUTCMonth()];
}
tableau.format.formatJsDateTime = function tableau_format$formatJsDateTime(d, format, showFullDateTimes, dataValueType) {
    if (ss.isNullOrUndefined(format)) {
        if (showFullDateTimes === 2 && tableau.format._isMidnight(d)) {
            showFullDateTimes = 0;
        }
        return tableau.format.formatCustomJSDateTime(d, '*M/d/yyyy', showFullDateTimes, dataValueType, 'en_US', '', 'h:nn:ss tt', null);
    }
    return tableau.format.formatCustomJSDateTime(d, format.format, showFullDateTimes, dataValueType, format.locale, format.originalFormat, format.timeFormat, format.locale_formatting_strings, format.calOpts);
}
tableau.format._formatOleDateTime = function tableau_format$_formatOleDateTime(v, format, showFullDateTimes, dataValueType) {
    var d = new Date(tableau.types.JsDateFromOleDate(v));
    return tableau.format.formatJsDateTime(d, format, showFullDateTimes, dataValueType);
}
tableau.format._trunc = function tableau_format$_trunc(v) {
    return (v < 0) ? Math.ceil(v) : Math.floor(v);
}
tableau.format._applySeparators = function tableau_format$_applySeparators(v, doSeparators, separatorStr, groupingSpecStr) {
    var ipart = Math.abs(tableau.format._trunc(v));
    var result = '';
    var groupSize = (parseInt(groupingSpecStr.charAt(0).toString(), 10) || 3);
    if (doSeparators !== 't') {
        return ipart.toString();
    }
    while (true) {
        var current = ipart % 1000;
        ipart = tableau.format._trunc(ipart / 1000);
        if (isNaN(ipart) || 0 === ipart) {
            result = current.toString() + result;
            break;
        }
        result = separatorStr + tableau.format._pad(current, groupSize) + result;
    }
    return result;
}
tableau.format._applyUnitAdjustment = function tableau_format$_applyUnitAdjustment(v, unitType) {
    switch (unitType) {
        case 'B':
        case 'G':
            return v / 1000000000;
        case 'M':
            return v / 1000000;
        case 'K':
            return v / 1000;
        default:
            return v;
    }
}
tableau.format._applyNegativeFormat = function tableau_format$_applyNegativeFormat(v, str, prefix, suffix, formatType) {
    str = str.replace(new RegExp('^-'), '');
    if (v >= 0 || new RegExp('^[.0]*$').test(str)) {
        return prefix + str + suffix;
    }
    switch (parseInt(formatType, 10)) {
        case 2:
            return '-' + prefix + str + suffix;
        case 3:
            return prefix + str + suffix + '-';
        case 4:
            return prefix + '-' + str + suffix;
        case 5:
            return prefix + str + '-' + suffix;
        default:
            return '(' + prefix + str + suffix + ')';
    }
}
tableau.format._formatRawInt = function tableau_format$_formatRawInt(v) {
    return tableau.format._trunc(v);
}
tableau.format._formatNumberAutomatic = function tableau_format$_formatNumberAutomatic(v, dataType, p, decimalStr, doSeparators, separatorStr, groupingSpecStr) {
    if (dataType === 'i') {
        return tableau.format._formatAuto(v, dataType, p, decimalStr, doSeparators, separatorStr, groupingSpecStr, null, null);
    }
    else {
        return tableau.format._formatAuto(v, dataType, p, decimalStr, doSeparators, separatorStr, groupingSpecStr, 0.0001, 1000000000000000);
    }
}
tableau.format._formatNumberStandard = function tableau_format$_formatNumberStandard(v, dataType, decimalStr, doSeparators, separatorStr, groupingSpecStr) {
    if (dataType === 'i') {
        return tableau.format._formatAuto(v, dataType, null, decimalStr, doSeparators, separatorStr, groupingSpecStr, null, 1000000);
    }
    else {
        return tableau.format._formatAuto(v, dataType, null, decimalStr, doSeparators, separatorStr, groupingSpecStr, 0.0001, 1000000000000000);
    }
}
tableau.format._formatAuto = function tableau_format$_formatAuto(v, dataType, placesNeg, decimalStr, doSeparators, separatorStr, groupingSpecStr, minFixedPoint, minExponential) {
    var vabs = Math.abs(v);
    if (vabs !== 0 && ((ss.isValue(minExponential) && vabs >= minExponential) || (ss.isValue(minFixedPoint) && vabs < minFixedPoint))) {
        var exponentialPlaces = tableau.format._maxPlaces(1, dataType);
        var expo = tableau.format._formatExponential(v, exponentialPlaces, decimalStr);
        return expo.replace(new RegExp('[' + decimalStr + ']?0+e'), 'e');
    }
    var frac = v - tableau.format._trunc(v);
    var intPart = tableau.format.formatIntAuto(v, doSeparators, separatorStr, groupingSpecStr);
    var fracPart = '';
    if (!frac) {
        return intPart;
    }
    if (intPart === '0' && v < 0) {
        intPart = '-0';
    }
    var places;
    if (ss.isValue(placesNeg) && placesNeg < 0) {
        places = -placesNeg;
    }
    else {
        places = tableau.format._maxPlaces(v, dataType);
    }
    fracPart = frac.toFixed(places);
    if (parseFloat(fracPart) >= 1) {
        intPart = tableau.format.formatIntAuto(tableau.format._trunc(v) + 1, doSeparators, separatorStr, groupingSpecStr);
        return intPart;
    }
    fracPart = fracPart.replace(new RegExp('0+$'), '');
    fracPart = fracPart.replace(new RegExp('^-?0\\.'), decimalStr);
    return intPart + fracPart;
}
tableau.format._maxPlaces = function tableau_format$_maxPlaces(v, dataType) {
    var maxSignificantDigits = (dataType === 'i') ? 6 : 15;
    return Math.min(Math.max(0, maxSignificantDigits - Math.abs(tableau.format._trunc(v)).toString().length), 9);
}
tableau.format._formatExponential = function tableau_format$_formatExponential(v, decimalPlaces, decimalStr) {
    if (isNaN(v) || !isFinite(v)) {
        return v.toString();
    }
    if (decimalPlaces < 0 || isNaN(decimalPlaces)) {
        decimalPlaces = 0;
    }
    if (decimalPlaces > 15) {
        decimalPlaces = 15;
    }
    var f = tableau.format._toExponentialRounded(v, decimalPlaces);
    var whereE = f.indexOf('e');
    var exp = f.substr(whereE);
    if (exp.length < 4) {
        f = f.substring(0, whereE + 2) + '0' + f.substr(whereE + 2);
    }
    f = f.replace(new RegExp('\\.'), decimalStr);
    return f;
}
tableau.format._toExponentialRounded = function tableau_format$_toExponentialRounded(v, decimalPlaces) {
    return tableau.format._toFormatRounded(v, decimalPlaces, 15, function(x, places) {
        return x.toExponential(places);
    });
}
tableau.format._toFixedRounded = function tableau_format$_toFixedRounded(v, decimalPlaces) {
    return tableau.format._toFormatRounded(v, decimalPlaces, tableau.format._maxPlaces(v, 'r'), function(x, places) {
        return x.toFixed(places);
    });
}
tableau.format._toFormatRounded = function tableau_format$_toFormatRounded(v, decimalPlaces, maxPlaces, converter) {
    maxPlaces = Math.max(maxPlaces - 1, decimalPlaces);
    var f = converter(v, maxPlaces);
    var whereE = f.indexOf('e');
    if (whereE === -1) {
        whereE = f.length;
    }
    var roundPlace = whereE - (maxPlaces - decimalPlaces);
    var trailingDigit = f.charCodeAt(roundPlace);
    if (f.charCodeAt(roundPlace - 1) === 46) {
        roundPlace--;
    }
    f = f.substring(0, roundPlace) + f.substring(whereE, f.length);
    if (trailingDigit >= 53 && trailingDigit <= 57) {
        var roundDigit;
        do {
            roundPlace--;
            roundDigit = f.charCodeAt(roundPlace);
            if (roundDigit === 46 || roundDigit === 45) {
                roundDigit = 48;
                continue;
            }
            roundDigit++;
            if (roundDigit > 57) {
                roundDigit = 48;
            }
            f = f.substring(0, roundPlace) + String.fromCharCode(roundDigit) + f.substring(roundPlace + 1, f.length);
        } while (roundDigit === 48 && roundPlace > 0);
        if (roundDigit === 48 && !roundPlace) {
            f = converter(v, decimalPlaces);
        }
    }
    return f;
}
tableau.format._formatPercentage = function tableau_format$_formatPercentage(v, dataType, decimalPlaces, format) {
    if (decimalPlaces === -1) {
        return tableau.format._formatAuto(v * 100, dataType, null, format[7], format[2], format[8], format[9], null, null) + '%';
    }
    else {
        return tableau.format._formatRealCustom(v * 100, decimalPlaces, format) + '%';
    }
}
tableau.format._formatReal = function tableau_format$_formatReal(v, dataType, format, precision, role) {
    if (ss.isNullOrUndefined(format) || format.length !== 10) {
        return tableau.format._formatNumberAutomatic(v, dataType, precision, '.', (role === 'd') ? null : 't', ',', '3;0');
    }
    var decimalPlaces = parseInt(format[1], 10);
    switch (format[0]) {
        case '':
            return tableau.format._formatNumberAutomatic(v, dataType, null, format[7], format[2], format[8], format[9]);
        case 'N':
            return tableau.format._formatNumberStandard(v, dataType, format[7], format[2], format[8], format[9]);
        case 'e':
            return tableau.format._formatExponential(v, decimalPlaces, format[7]);
        case 'p':
            return tableau.format._formatPercentage(v, dataType, decimalPlaces, format);
        default:
            return tableau.format._formatRealCustom(v, decimalPlaces, format);
    }
}
tableau.format._formatRealCustom = function tableau_format$_formatRealCustom(v, decimalPlaces, format) {
    v = tableau.format._applyUnitAdjustment(v, format[5]);
    var combinedSuffix = format[5] + format[4];
    var decimals = tableau.format.applyDecimalPlaces(v, decimalPlaces, format[7]);
    if (Type.canCast(decimals, Number)) {
        v += decimals;
        decimals = tableau.format.applyDecimalPlaces(0, decimalPlaces, format[7]);
    }
    var str = tableau.format._applySeparators(v, format[2], format[8], format[9]) + decimals;
    return tableau.format._applyNegativeFormat(v, str, format[3], combinedSuffix, format[6]);
}
tableau.format._formatInt = function tableau_format$_formatInt(v, format) {
    return tableau.format._formatReal(tableau.format._trunc(v), 'i', format, null, null);
}
tableau.format._convertFormatStringsToFormattingInfo = function tableau_format$_convertFormatStringsToFormattingInfo(formatStrings) {
    var fi = tab.$create_FormattingInfo();
    fi.format = formatStrings[0];
    fi.locale = formatStrings[1];
    fi.originalFormat = formatStrings[2];
    fi.timeFormat = formatStrings[3];
    fi.calOpts = new tab.CalendarOptions();
    fi.calOpts.fiscalYearStart = parseInt(formatStrings[4]);
    if (isNaN(fi.calOpts.fiscalYearStart)) {
        fi.calOpts.fiscalYearStart = 0;
    }
    fi.calOpts.startOfWeek = parseInt(formatStrings[5]);
    if (isNaN(fi.calOpts.startOfWeek)) {
        fi.calOpts.startOfWeek = 1;
    }
    fi.calOpts.minDaysInFirstWeek = parseInt(formatStrings[6]);
    if (isNaN(fi.calOpts.minDaysInFirstWeek)) {
        fi.calOpts.minDaysInFirstWeek = 1;
    }
    fi.calOpts.brokenWeeks = formatStrings[7] === '1';
    return fi;
}
tableau.format._formatTupleString = function tableau_format$_formatTupleString(tuple) {
    var DelimiterTupleValue = ',';
    var DelimiterTupleOpen = '(';
    var DelimiterTupleClose = ')';
    var DelimiterString = '"';
    var EscapeChar = '\\';
    var vals = [];
    tuple = tuple.trim();
    if (!tuple.length) {
        return '';
    }
    var length = tuple.length;
    var idxHead = 0;
    if (idxHead >= length || tuple.charAt(idxHead) !== DelimiterTupleOpen) {
        return '';
    }
    ++idxHead;
    while (idxHead < length) {
        var idxTail = idxHead;
        var done = false;
        var withinString = 0;
        while (idxTail < length && !done) {
            var ch = tuple.charAt(idxTail);
            if (!withinString && (ch === DelimiterTupleValue || ch === DelimiterTupleClose)) {
                done = true;
                break;
            }
            else if (ch === EscapeChar) {
                idxTail += 2;
            }
            else {
                if (ch === DelimiterString) {
                    withinString = 1 - withinString;
                }
                ++idxTail;
            }
        }
        if (!done) {
            return '';
        }
        var s = tuple.substring(idxHead + 1, idxTail - 1);
        s = s.replaceAll('\\\\', '\\');
        s = s.replaceAll('\\"', '"');
        s = s.replaceAll('\\,', ',');
        s = s.replaceAll('\\(', '(');
        s = s.replaceAll('\\)', ')');
        vals.add(s);
        idxHead = idxTail;
        ++idxHead;
    }
    return vals.join(', ');
}


////////////////////////////////////////////////////////////////////////////////
// tab.HistoryUtil

tab.HistoryUtil = function tab_HistoryUtil() {
}
tab.HistoryUtil.pushState = function tab_HistoryUtil$pushState(window, state, title, url) {
    if (tab.BrowserSupport.get_historyApi()) {
        try {
            window.history.pushState(state, title, url);
        }
        catch (e) {
            tab.Logger.getLogger(tab.HistoryUtil).warn('Error calling history.pushState', e);
        }
    }
}
tab.HistoryUtil.replaceState = function tab_HistoryUtil$replaceState(window, state, title, url) {
    if (tab.BrowserSupport.get_historyApi()) {
        try {
            window.history.replaceState(state, title, url);
        }
        catch (e) {
            tab.Logger.getLogger(tab.HistoryUtil).warn('Error calling history.replaceState', e);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.IntegerRange

tab.IntegerRange = function tab_IntegerRange(from, to) {
    this._from = from;
    this._to = to;
}
tab.IntegerRange.itemToTileRange = function tab_IntegerRange$itemToTileRange(itemRange, tileSize) {
    var tileRange = new tab.IntegerRange(0, 0);
    tileRange.set_from(Math.floor(itemRange.get_from() / tileSize));
    tileRange.set_to(Math.floor(itemRange.get_to() / tileSize));
    return tileRange;
}
tab.IntegerRange.pixelToItemRange = function tab_IntegerRange$pixelToItemRange(pixelRange, itemHeight) {
    var itemRange = new tab.IntegerRange(0, 0);
    itemRange.set_from(Math.floor(pixelRange.get_from() / itemHeight));
    itemRange.set_to(Math.floor(pixelRange.get_to() / itemHeight));
    return itemRange;
}
tab.IntegerRange.pixelToTileRange = function tab_IntegerRange$pixelToTileRange(pixelRange, itemHeight, tileSize) {
    return tab.IntegerRange.itemToTileRange(tab.IntegerRange.pixelToItemRange(pixelRange, itemHeight), tileSize);
}
tab.IntegerRange.prototype = {
    _from: 0,
    _to: 0,
    
    get_from: function tab_IntegerRange$get_from() {
        return this._from;
    },
    set_from: function tab_IntegerRange$set_from(value) {
        this._from = value;
        return value;
    },
    
    get_to: function tab_IntegerRange$get_to() {
        return this._to;
    },
    set_to: function tab_IntegerRange$set_to(value) {
        this._to = value;
        return value;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.IntSet

tab.IntSet = function tab_IntSet() {
    this._set = {};
}
tab.IntSet.prototype = {
    
    get_count: function tab_IntSet$get_count() {
        return Object.getKeyCount(this._set);
    },
    
    get_values: function tab_IntSet$get_values() {
        var values = new Array(this.get_count());
        var i = 0;
        var $dict1 = this._set;
        for (var $key2 in $dict1) {
            var pair = { key: $key2, value: $dict1[$key2] };
            values[i] = pair.value;
            i++;
        }
        return values;
    },
    
    addAll: function tab_IntSet$addAll(ints) {
        var $enum1 = ss.IEnumerator.getEnumerator(ints);
        while ($enum1.moveNext()) {
            var i = $enum1.current;
            this._set[i] = i;
        }
    },
    
    add: function tab_IntSet$add(i) {
        this._set[i] = i;
    },
    
    remove: function tab_IntSet$remove(i) {
        delete this._set[i];
    },
    
    clear: function tab_IntSet$clear() {
        Object.clearKeys(this._set);
    },
    
    contains: function tab_IntSet$contains(i) {
        return Object.keyExists(this._set, i);
    },
    
    intersect: function tab_IntSet$intersect(ints) {
        var intersection = new tab.IntSet();
        var $dict1 = ints._set;
        for (var $key2 in $dict1) {
            var pair = { key: $key2, value: $dict1[$key2] };
            if (this.contains(pair.key)) {
                intersection._set[pair.key] = pair.value;
            }
        }
        return intersection;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.UintSet

tab.UintSet = function tab_UintSet() {
    this._set = {};
}
tab.UintSet.prototype = {
    
    get_count: function tab_UintSet$get_count() {
        return Object.getKeyCount(this._set);
    },
    
    get_values: function tab_UintSet$get_values() {
        var values = new Array(this.get_count());
        var i = 0;
        var $dict1 = this._set;
        for (var $key2 in $dict1) {
            var pair = { key: $key2, value: $dict1[$key2] };
            values[i] = pair.value;
            i++;
        }
        return values;
    },
    
    addAll: function tab_UintSet$addAll(ints) {
        var $enum1 = ss.IEnumerator.getEnumerator(ints);
        while ($enum1.moveNext()) {
            var i = $enum1.current;
            this._set[i] = i;
        }
    },
    
    add: function tab_UintSet$add(i) {
        this._set[i] = i;
    },
    
    remove: function tab_UintSet$remove(i) {
        delete this._set[i];
    },
    
    clear: function tab_UintSet$clear() {
        Object.clearKeys(this._set);
    },
    
    contains: function tab_UintSet$contains(i) {
        return Object.keyExists(this._set, i);
    },
    
    intersect: function tab_UintSet$intersect(ints) {
        var intersection = new tab.UintSet();
        var $dict1 = ints._set;
        for (var $key2 in $dict1) {
            var pair = { key: $key2, value: $dict1[$key2] };
            if (this.contains(pair.key)) {
                intersection._set[pair.key] = pair.value;
            }
        }
        return intersection;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.jQueryExtensions

$.fn.focusDelayed = function tab_jQueryExtensions$focusDelayed(delayMilliseconds, action) {
    this.each(function() {
        var elem = this;
        window.setTimeout(function() {
            $(elem).focus();
            if (ss.isValue(action)) {
                action.call(elem);
            }
        }, delayMilliseconds);
    });
}


////////////////////////////////////////////////////////////////////////////////
// tab.jQuerySelectorExtensions

$.expr.filters.focusable = function tab_jQuerySelectorExtensions$focusable(element) {
    return tab._jQuerySelectorExtensionsImpl._focusable(element, !isNaN(parseInt($(element).attr('tabindex'), 10)));
}
$.expr.filters.tabbable = function tab_jQuerySelectorExtensions$tabbable(element) {
    var tabIndex = parseInt($(element).attr('tabindex'), 10);
    var isTabIndexNaN = isNaN(tabIndex);
    return (isTabIndexNaN || tabIndex >= 0) && tab._jQuerySelectorExtensionsImpl._focusable(element, !isTabIndexNaN);
}


////////////////////////////////////////////////////////////////////////////////
// tab._jQuerySelectorExtensionsImpl

tab._jQuerySelectorExtensionsImpl = function tab__jQuerySelectorExtensionsImpl() {
}
tab._jQuerySelectorExtensionsImpl._focusable = function tab__jQuerySelectorExtensionsImpl$_focusable(element, isTabIndexNotNaN) {
    var nodeName = element.nodeName.toLowerCase();
    if (nodeName === 'area') {
        ss.Debug.fail('<area> tags are not supported');
        return false;
    }
    var focusable = isTabIndexNotNaN;
    var focusableNodes = new RegExp('input|select|textarea|button|object');
    if (focusableNodes.test(nodeName)) {
        focusable = !element.disabled;
    }
    else if (nodeName === 'a') {
        focusable = !String.isNullOrEmpty((element).href) || isTabIndexNotNaN;
    }
    return focusable && tab._jQuerySelectorExtensionsImpl._visible(element);
}
tab._jQuerySelectorExtensionsImpl._visible = function tab__jQuerySelectorExtensionsImpl$_visible(element) {
    var hiddenObjects = $(element).parents().andSelf().filter(function() {
        return $(this).css('visibility') === 'hidden' || $.expr.filters.hidden(this);
    });
    return !hiddenObjects.length;
}


////////////////////////////////////////////////////////////////////////////////
// tab.JsonUtil

tab.JsonUtil = function tab_JsonUtil() {
}
tab.JsonUtil.parseJson = function tab_JsonUtil$parseJson(jsonValue) {
    return $.parseJSON(jsonValue);
}
tab.JsonUtil.toJson = function tab_JsonUtil$toJson(it, pretty, indentStr) {
    pretty = (pretty || false);
    indentStr = (indentStr || '');
    var stack = [];
    return tab.JsonUtil._serialize(it, pretty, indentStr, stack);
}
tab.JsonUtil._indexOf = function tab_JsonUtil$_indexOf(array, searchElement, fromIndex) {
    if (ss.isValue((Array).prototype['indexOf'])) {
        return array.indexOf(searchElement, fromIndex);
    }
    fromIndex = (fromIndex || 0);
    var length = array.length;
    if (length > 0) {
        for (var index = fromIndex; index < length; index++) {
            if (array[index] === searchElement) {
                return index;
            }
        }
    }
    return -1;
}
tab.JsonUtil._contains = function tab_JsonUtil$_contains(array, searchElement, fromIndex) {
    var index = tab.JsonUtil._indexOf(array, searchElement, fromIndex);
    return index >= 0;
}
tab.JsonUtil._serialize = function tab_JsonUtil$_serialize(it, pretty, indentStr, stack) {
    if (tab.JsonUtil._contains(stack, it)) {
        throw Error.createError('The object contains recursive reference of sub-objects', null);
    }
    if (ss.isUndefined(it)) {
        return 'undefined';
    }
    if (it == null) {
        return 'null';
    }
    var objtype = $.type(it);
    if (objtype === 'number' || objtype === 'boolean') {
        return it.toString();
    }
    if (objtype === 'string') {
        return tab.JsonUtil._escapeString(it);
    }
    stack.push(it);
    var newObj;
    indentStr = (indentStr || '');
    var nextIndent = (pretty) ? indentStr + '\t' : '';
    var tf = (it.__json__ || it.json);
    if ($.isFunction(tf)) {
        var jsonCallback = tf;
        newObj = jsonCallback(it);
        if (it !== newObj) {
            var res = tab.JsonUtil._serialize(newObj, pretty, nextIndent, stack);
            stack.pop();
            return res;
        }
    }
    if (ss.isValue(it.nodeType) && ss.isValue(it.cloneNode)) {
        throw Error.createError("Can't serialize DOM nodes", null);
    }
    var separator = (pretty) ? ' ' : '';
    var newLine = (pretty) ? '\n' : '';
    if ($.isArray(it)) {
        return tab.JsonUtil._serializeArray(it, pretty, indentStr, stack, nextIndent, newLine);
    }
    if (objtype === 'function') {
        stack.pop();
        return null;
    }
    return tab.JsonUtil._serializeGeneric(it, pretty, indentStr, stack, nextIndent, newLine, separator);
}
tab.JsonUtil._serializeGeneric = function tab_JsonUtil$_serializeGeneric(it, pretty, indentStr, stack, nextIndent, newLine, separator) {
    var d = it;
    var bdr = new ss.StringBuilder('{');
    var init = false;
    var $dict1 = d;
    for (var $key2 in $dict1) {
        var e = { key: $key2, value: $dict1[$key2] };
        var keyStr;
        var val;
        if (typeof(e.key) === 'number') {
            keyStr = '"' + e.key + '"';
        }
        else if (typeof(e.key) === 'string') {
            keyStr = tab.JsonUtil._escapeString(e.key);
        }
        else {
            continue;
        }
        val = tab.JsonUtil._serialize(e.value, pretty, nextIndent, stack);
        if (val == null) {
            continue;
        }
        if (init) {
            bdr.append(',');
        }
        bdr.append(newLine + nextIndent + keyStr + ':' + separator + val);
        init = true;
    }
    bdr.append(newLine + indentStr + '}');
    stack.pop();
    return bdr.toString();
}
tab.JsonUtil._serializeArray = function tab_JsonUtil$_serializeArray(it, pretty, indentStr, stack, nextIndent, newLine) {
    var initialized = false;
    var sb = new ss.StringBuilder('[');
    var a = it;
    for (var i = 0; i < a.length; i++) {
        var o = a[i];
        var s = tab.JsonUtil._serialize(o, pretty, nextIndent, stack);
        if (s == null) {
            s = 'undefined';
        }
        if (initialized) {
            sb.append(',');
        }
        sb.append(newLine + nextIndent + s);
        initialized = true;
    }
    sb.append(newLine + indentStr + ']');
    stack.pop();
    return sb.toString();
}
tab.JsonUtil._escapeString = function tab_JsonUtil$_escapeString(str) {
    str = ('"' + str.replace(/(["\\])/g, '\\$1') + '"');
    str = str.replace(new RegExp('[\u000c]', 'g'), '\\f');
    str = str.replace(new RegExp('[\u0008]', 'g'), '\\b');
    str = str.replace(new RegExp('[\n]', 'g'), '\\n');
    str = str.replace(new RegExp('[\t]', 'g'), '\\t');
    str = str.replace(new RegExp('[\r]', 'g'), '\\r');
    return str;
}


////////////////////////////////////////////////////////////////////////////////
// tab.MiscUtil

tab.MiscUtil = function tab_MiscUtil() {
}
tab.MiscUtil.get_pathName = function tab_MiscUtil$get_pathName() {
    var window = tabBootstrap.Utility.get_locationWindow();
    return tab.WindowHelper.getLocation(window).pathname;
}
tab.MiscUtil.get_urlPathnameParts = function tab_MiscUtil$get_urlPathnameParts() {
    var pathname = tab.MiscUtil.get_pathName();
    var siteRoot = tsConfig.site_root;
    var index = pathname.indexOf(siteRoot, 0);
    var actualPath = pathname.substr(index + siteRoot.length);
    var pathnameParts = actualPath.split('/');
    var pathnameProps = {};
    pathnameProps[2] = pathnameParts[2];
    pathnameProps[3] = pathnameParts[3];
    pathnameProps[4] = pathnameParts[4];
    return pathnameProps;
}
tab.MiscUtil.addMethodAfterAdvice = function tab_MiscUtil$addMethodAfterAdvice(instance, methodName, afterAdvice) {
    var oldFunction = instance[methodName];
    var f = function() {
        var args = Array.toArray(arguments);
        var retVal = oldFunction.apply(instance, args);
        return (afterAdvice.call(instance, args) || retVal);
    };
    instance[methodName] = f;
    var undo = function() {
        instance[methodName] = oldFunction;
    };
    return new tab.CallOnDispose(undo);
}
tab.MiscUtil.lazyInitStaticField = function tab_MiscUtil$lazyInitStaticField(t, fieldName, initializer) {
    var value = t[fieldName];
    if (ss.isNullOrUndefined(value)) {
        value = initializer();
        t[fieldName] = value;
    }
    return value;
}
tab.MiscUtil.isValue = function tab_MiscUtil$isValue(arg, field) {
    if (ss.isNullOrUndefined(arg)) {
        return false;
    }
    if (!ss.isNullOrUndefined(field)) {
        var tmp = arg[field];
        return !ss.isNullOrUndefined(tmp);
    }
    return true;
}
tab.MiscUtil.percentEncode = function tab_MiscUtil$percentEncode(valueToEncode, unreservedChars) {
    valueToEncode = encodeURIComponent(valueToEncode);
    if (ss.isNullOrUndefined(unreservedChars)) {
        return valueToEncode;
    }
    var sb = new ss.StringBuilder();
    var i = 0;
    while (i < valueToEncode.length) {
        var s = valueToEncode.substr(i, 1);
        if (s === '%') {
            sb.append(valueToEncode.substr(i, 3));
            i += 2;
        }
        else if (!Object.keyExists(unreservedChars, s)) {
            sb.append('%').append(s.charCodeAt(0).toString(16).toUpperCase());
        }
        else {
            sb.append(s);
        }
        i++;
    }
    return sb.toString();
}
tab.MiscUtil.encodeForWG = function tab_MiscUtil$encodeForWG(valueToEncode) {
    var usernameValidChars = {};
    var addCodes = function(from, to) {
        for (var i = from; i <= to; i++) {
            var s = String.fromCharCode(i);
            usernameValidChars[s] = s;
        }
    };
    addCodes(97, 122);
    addCodes(64, 90);
    addCodes(48, 57);
    addCodes(95, 95);
    addCodes(45, 45);
    valueToEncode = tab.MiscUtil.percentEncode(valueToEncode, usernameValidChars);
    valueToEncode = tab.MiscUtil.percentEncode(valueToEncode, null);
    return valueToEncode;
}
tab.MiscUtil.isNullOrUndefined = function tab_MiscUtil$isNullOrUndefined(args) {
    if (ss.isNullOrUndefined(args)) {
        return true;
    }
    for (var i = 0; i < args.length; i++) {
        if (ss.isNullOrUndefined(args[i])) {
            return true;
        }
    }
    return false;
}
tab.MiscUtil.isNullOrEmpty = function tab_MiscUtil$isNullOrEmpty(args) {
    if (ss.isNullOrUndefined(args)) {
        return true;
    }
    var dict = args;
    if (ss.isValue(dict['length']) && !dict['length']) {
        return true;
    }
    return false;
}
tab.MiscUtil.isValidIndex = function tab_MiscUtil$isValidIndex(index, arr) {
    var args = [ index, arr ];
    return !tab.MiscUtil.isNullOrUndefined(args) && index >= 0 && index < arr.length;
}
tab.MiscUtil.isObject = function tab_MiscUtil$isObject(o) {
    return o === Object(o);
}
tab.MiscUtil.hasOwnProperty = function tab_MiscUtil$hasOwnProperty(owner, field) {
    return owner.hasOwnProperty(field);
}
tab.MiscUtil.toBoolean = function tab_MiscUtil$toBoolean(value, defaultIfMissing) {
    var positiveRegex = new RegExp('^(yes|y|true|t|1)$', 'i');
    if (tab.MiscUtil.isNullOrEmpty(value)) {
        return defaultIfMissing;
    }
    var match = value.match(positiveRegex);
    return !tab.MiscUtil.isNullOrEmpty(match);
}
tab.MiscUtil.getUriQueryParameters = function tab_MiscUtil$getUriQueryParameters(uri) {
    var parameters = {};
    if (ss.isNullOrUndefined(uri)) {
        return parameters;
    }
    var indexOfQuery = (uri).indexOf('?');
    if (indexOfQuery < 0) {
        return parameters;
    }
    var query = (uri).substr(indexOfQuery + 1);
    var indexOfHash = query.indexOf('#');
    if (indexOfHash >= 0) {
        query = query.substr(0, indexOfHash);
    }
    if (String.isNullOrEmpty(query)) {
        return parameters;
    }
    var paramPairs = query.split('&');
    var $enum1 = ss.IEnumerator.getEnumerator(paramPairs);
    while ($enum1.moveNext()) {
        var pair = $enum1.current;
        var keyValue = pair.split('=');
        var key = decodeURIComponent(keyValue[0]);
        var values;
        if (Object.keyExists(parameters, key)) {
            values = parameters[key];
        }
        else {
            values = [];
            parameters[key] = values;
        }
        if (keyValue.length > 1) {
            values.add(decodeURIComponent(keyValue[1]));
        }
    }
    return parameters;
}
tab.MiscUtil.replaceUriQueryParameters = function tab_MiscUtil$replaceUriQueryParameters(uri, parameters) {
    var newQueryString = new ss.StringBuilder();
    var first = true;
    var appendSeparator = function() {
        newQueryString.append((first) ? '?' : '&');
        first = false;
    };
    var $dict1 = parameters;
    for (var $key2 in $dict1) {
        var pairs = { key: $key2, value: $dict1[$key2] };
        var keyEncoded = encodeURIComponent(pairs.key);
        if (ss.isNullOrUndefined(pairs.value) || !pairs.value.length) {
            appendSeparator();
            newQueryString.append(keyEncoded);
        }
        else {
            var $enum3 = ss.IEnumerator.getEnumerator(pairs.value);
            while ($enum3.moveNext()) {
                var value = $enum3.current;
                appendSeparator();
                newQueryString.append(keyEncoded).append('=').append(encodeURIComponent(value));
            }
        }
    }
    var indexOfQuery = (uri).indexOf('?');
    var indexOfHash = (uri).indexOf('#');
    var indexOfEnd = Math.min((indexOfQuery < 0) ? (uri).length : indexOfQuery, (indexOfHash < 0) ? (uri).length : indexOfHash);
    var baseUri = (uri).substr(0, indexOfEnd);
    var hash = (indexOfHash < 0) ? '' : (uri).substr(indexOfHash);
    return baseUri + newQueryString + hash;
}
tab.MiscUtil.sanatizeBoolean = function tab_MiscUtil$sanatizeBoolean(value) {
    if (ss.isNullOrUndefined(value)) {
        return value;
    }
    return Boolean.parse(value.toString());
}
tab.MiscUtil.newRelativePathWithParams = function tab_MiscUtil$newRelativePathWithParams(newPathname, uri) {
    var indexOfEnd = (uri).indexOfAny(tab.MiscUtil._queryAndHashChars);
    return newPathname + ((indexOfEnd < 0) ? '' : (uri).substr(indexOfEnd));
}
tab.MiscUtil.postHookMessage = function tab_MiscUtil$postHookMessage(message) {
    tab.BrowserSupport.doPostMessage('tableau.hooks.' + message);
    tab.Logger.lazyGetLogger(tab.MiscUtil).debug('tableau.hooks.' + message + ' at ' + new Date().getTime());
}
tab.MiscUtil.dispose = function tab_MiscUtil$dispose(d) {
    if (ss.isValue(d)) {
        d.dispose();
    }
    return null;
}
tab.MiscUtil.cloneObject = function tab_MiscUtil$cloneObject(src) {
    var clone;
    if (tab.BrowserSupport.get_nativeJSONSupport()) {
        var objStr = JSON.stringify(src);
        clone = JSON.parse(objStr);
    }
    else {
        clone = $.extend(true, {}, src);
    }
    return clone;
}
tab.MiscUtil.cloneArray = function tab_MiscUtil$cloneArray(arr) {
    var clone;
    if (tab.BrowserSupport.get_nativeJSONSupport()) {
        var objStr = JSON.stringify(arr);
        clone = JSON.parse(objStr);
    }
    else {
        clone = $.extend(true, [], arr);
    }
    return clone;
}


////////////////////////////////////////////////////////////////////////////////
// tab.Param

tab.Param = function tab_Param() {
}
tab.Param.createArgumentNullOrUndefinedException = function tab_Param$createArgumentNullOrUndefinedException(paramName) {
    return Error.createError(paramName + ' is null or undefined.', { paramName: paramName });
}
tab.Param.verifyString = function tab_Param$verifyString(param, paramName) {
    tab.Param.verifyValue(param, paramName);
    if (!param.trim().length) {
        var ex = Error.createError(paramName + ' contains only white space', { paramName: paramName });
        tab.Param._showParameterAlert(ex);
        throw ex;
    }
}
tab.Param.verifyValue = function tab_Param$verifyValue(param, paramName) {
    if (ss.isNullOrUndefined(param)) {
        var ex = tab.Param.createArgumentNullOrUndefinedException(paramName);
        tab.Param._showParameterAlert(ex);
        throw ex;
    }
}
tab.Param._showParameterAlert = function tab_Param$_showParameterAlert(ex) {
    if (tab.Param.suppressAlerts) {
        return;
    }
    try {
        throw ex;
    }
    catch (exceptionWithStack) {
        alert(tab.Param._formatExceptionMessage(exceptionWithStack));
    }
}
tab.Param._formatExceptionMessage = function tab_Param$_formatExceptionMessage(ex) {
    var message;
    if (ss.isValue(ex.stack)) {
        message = ex.stack;
    }
    else {
        message = ex.message;
    }
    return message;
}


////////////////////////////////////////////////////////////////////////////////
// tab.PointUtil

tab.PointUtil = function tab_PointUtil() {
}
tab.PointUtil.fromPresModel = function tab_PointUtil$fromPresModel(pointPM) {
    if (ss.isNullOrUndefined(pointPM)) {
        return null;
    }
    return tab.$create_Point(pointPM.x, pointPM.y);
}
tab.PointUtil.toPresModel = function tab_PointUtil$toPresModel(pt) {
    if (ss.isNullOrUndefined(pt)) {
        return null;
    }
    var pointPM = {};
    pointPM.x = pt.x;
    pointPM.y = pt.y;
    return pointPM;
}
tab.PointUtil.fromPosition = function tab_PointUtil$fromPosition(position) {
    return tab.$create_Point(position.left, position.top);
}
tab.PointUtil.add = function tab_PointUtil$add(first, second) {
    if (ss.isNullOrUndefined(first) || ss.isNullOrUndefined(second)) {
        return first;
    }
    return tab.$create_Point(first.x + second.x, first.y + second.y);
}
tab.PointUtil.subtract = function tab_PointUtil$subtract(first, second) {
    return tab.$create_Point(first.x - second.x, first.y - second.y);
}
tab.PointUtil.distance = function tab_PointUtil$distance(first, second) {
    tab.Param.verifyValue(first, 'first');
    tab.Param.verifyValue(second, 'second');
    var diffX = first.x - second.x;
    var diffY = first.y - second.y;
    return Math.sqrt((diffX * diffX) + (diffY * diffY));
}
tab.PointUtil.equals = function tab_PointUtil$equals(p, p2) {
    return ss.isValue(p) && ss.isValue(p2) && p2.x === p.x && p2.y === p.y;
}


////////////////////////////////////////////////////////////////////////////////
// tab.PointFUtil

tab.PointFUtil = function tab_PointFUtil() {
}
tab.PointFUtil.subtract = function tab_PointFUtil$subtract(first, second) {
    return tab.$create_PointF(first.x - second.x, first.y - second.y);
}
tab.PointFUtil.timesScalar = function tab_PointFUtil$timesScalar(p, scalar) {
    return tab.$create_PointF(p.x * scalar, p.y * scalar);
}
tab.PointFUtil.round = function tab_PointFUtil$round(p) {
    return tab.$create_Point(Math.round(p.x), Math.round(p.y));
}


////////////////////////////////////////////////////////////////////////////////
// tab.RecordCast

tab.RecordCast = function tab_RecordCast() {
}
tab.RecordCast.deltaAsPoint = function tab_RecordCast$deltaAsPoint(d) {
    ss.Debug.assert(ss.isValue(d.x), 'Record mismatch');
    ss.Debug.assert(ss.isValue(d.y), 'Record mismatch');
    return d;
}
tab.RecordCast.deltaAsRectXY = function tab_RecordCast$deltaAsRectXY(d) {
    ss.Debug.assert(ss.isValue(d.x), 'Record mismatch');
    ss.Debug.assert(ss.isValue(d.y), 'Record mismatch');
    return d;
}
tab.RecordCast.rectAsSize = function tab_RecordCast$rectAsSize(r) {
    ss.Debug.assert(ss.isValue(r.w), 'Record mismatch');
    ss.Debug.assert(ss.isValue(r.h), 'Record mismatch');
    return r;
}
tab.RecordCast.regionRectAsRectXY = function tab_RecordCast$regionRectAsRectXY(r) {
    ss.Debug.assert(ss.isValue(r.x), 'Record mismatch');
    ss.Debug.assert(ss.isValue(r.y), 'Record mismatch');
    ss.Debug.assert(ss.isValue(r.w), 'Record mismatch');
    ss.Debug.assert(ss.isValue(r.h), 'Record mismatch');
    return r;
}
tab.RecordCast.regionRectAsSize = function tab_RecordCast$regionRectAsSize(r) {
    ss.Debug.assert(ss.isValue(r.w), 'Record mismatch');
    ss.Debug.assert(ss.isValue(r.h), 'Record mismatch');
    return r;
}
tab.RecordCast.dojoCoordsAsPoint = function tab_RecordCast$dojoCoordsAsPoint(c) {
    ss.Debug.assert(ss.isValue(c.x), 'Record mismatch');
    ss.Debug.assert(ss.isValue(c.y), 'Record mismatch');
    return c;
}
tab.RecordCast.dojoCoordsAsRectXY = function tab_RecordCast$dojoCoordsAsRectXY(c) {
    ss.Debug.assert(ss.isValue(c.x), 'Record mismatch');
    ss.Debug.assert(ss.isValue(c.y), 'Record mismatch');
    ss.Debug.assert(ss.isValue(c.w), 'Record mismatch');
    ss.Debug.assert(ss.isValue(c.h), 'Record mismatch');
    return c;
}
tab.RecordCast.frameInfoAsRect = function tab_RecordCast$frameInfoAsRect(fi) {
    ss.Debug.assert(ss.isValue(fi.x), 'Record mismatch');
    ss.Debug.assert(ss.isValue(fi.y), 'Record mismatch');
    ss.Debug.assert(ss.isValue(fi.w), 'Record mismatch');
    ss.Debug.assert(ss.isValue(fi.h), 'Record mismatch');
    return fi;
}
tab.RecordCast.rectPresModelAsRectXY = function tab_RecordCast$rectPresModelAsRectXY(rpm) {
    if (ss.isNullOrUndefined(rpm)) {
        return null;
    }
    return tab.$create_RectXY(rpm.x, rpm.y, rpm.w, rpm.h);
}
tab.RecordCast.doubleRectPresModelAsDoubleRectXY = function tab_RecordCast$doubleRectPresModelAsDoubleRectXY(rpm) {
    if (ss.isNullOrUndefined(rpm)) {
        return null;
    }
    return tab.$create_DoubleRectXY(rpm.doubleLeft, rpm.doubleTop, rpm.width, rpm.height);
}
tab.RecordCast.sizeAsSizePresModel = function tab_RecordCast$sizeAsSizePresModel(sz) {
    if (ss.isNullOrUndefined(sz)) {
        return null;
    }
    var spm = {};
    spm.w = sz.w;
    spm.h = sz.h;
    return spm;
}


////////////////////////////////////////////////////////////////////////////////
// tab.RectUtil

tab.RectUtil = function tab_RectUtil() {
}
tab.RectUtil.isEmpty = function tab_RectUtil$isEmpty(r) {
    return !r.w || !r.h;
}
tab.RectUtil.isEqual = function tab_RectUtil$isEqual(r1, r2) {
    return r1.t === r2.t && r1.l === r2.l && r1.w === r2.w && r1.h === r2.h;
}
tab.RectUtil.inRect = function tab_RectUtil$inRect(r, p) {
    return p.x >= r.l && p.x < (r.l + r.w) && p.y >= r.t && p.y < (r.t + r.h);
}
tab.RectUtil.intersectsWith = function tab_RectUtil$intersectsWith(r1, r2) {
    return !(r2.l + r2.w < r1.l || r2.t + r2.h < r1.t || r2.l > r1.l + r1.w || r2.t > r1.t + r1.h);
}
tab.RectUtil.union = function tab_RectUtil$union(bounds1, bounds2) {
    var newLeft = Math.min(bounds1.l, bounds2.l);
    var newTop = Math.min(bounds1.t, bounds2.t);
    var maxRight = Math.max(bounds1.l + bounds1.w, bounds2.l + bounds2.w);
    var maxBottom = Math.max(bounds1.t + bounds1.h, bounds2.t + bounds2.h);
    return tab.$create_Rect(newLeft, newTop, maxRight - newLeft, maxBottom - newTop);
}


////////////////////////////////////////////////////////////////////////////////
// tab.RectXYUtil

tab.RectXYUtil = function tab_RectXYUtil() {
}
tab.RectXYUtil.isEmpty = function tab_RectXYUtil$isEmpty(r) {
    if (!ss.isValue(r)) {
        tab.Log.get(r).warn('Rect should not be empty when testing IsEmpty');
        return true;
    }
    return !r.w || !r.h;
}
tab.RectXYUtil.isEqual = function tab_RectXYUtil$isEqual(r1, r2) {
    return r1.x === r2.x && r1.y === r2.y && r1.w === r2.w && r1.h === r2.h;
}
tab.RectXYUtil.isNull = function tab_RectXYUtil$isNull(r) {
    return !r.x && !r.y && !r.w && !r.h;
}
tab.RectXYUtil.inRect = function tab_RectXYUtil$inRect(r, p) {
    return p.x >= r.x && p.x < (r.x + r.w) && p.y >= r.y && p.y < (r.y + r.h);
}
tab.RectXYUtil.inRectPointF = function tab_RectXYUtil$inRectPointF(r, p) {
    return p.x >= r.x && p.x < (r.x + r.w) && p.y >= r.y && p.y < (r.y + r.h);
}
tab.RectXYUtil.intersectsWith = function tab_RectXYUtil$intersectsWith(r1, r2) {
    return !(r2.x + r2.w < r1.x || r2.y + r2.h < r1.y || r2.x > r1.x + r1.w || r2.y > r1.y + r1.h);
}
tab.RectXYUtil.intersectsWithMoreThanSharedEdge = function tab_RectXYUtil$intersectsWithMoreThanSharedEdge(r1, r2) {
    return !(r2.x + r2.w <= r1.x || r2.y + r2.h <= r1.y || r2.x >= r1.x + r1.w || r2.y >= r1.y + r1.h);
}
tab.RectXYUtil.clone = function tab_RectXYUtil$clone(r) {
    return tab.$create_RectXY(r.x, r.y, r.w, r.h);
}
tab.RectXYUtil.nonemptyify = function tab_RectXYUtil$nonemptyify(r) {
    return tab.$create_RectXY(r.x, r.y, Math.max(1, r.w), Math.max(1, r.h));
}
tab.RectXYUtil.intersectsWithAny = function tab_RectXYUtil$intersectsWithAny(r1, rectangles) {
    var result = false;
    var $enum1 = ss.IEnumerator.getEnumerator(rectangles);
    while ($enum1.moveNext()) {
        var rectangle = $enum1.current;
        if (ss.isNullOrUndefined(rectangle)) {
            continue;
        }
        if (tab.RectXYUtil.intersectsWith(r1, rectangle)) {
            result = true;
            break;
        }
    }
    return result;
}
tab.RectXYUtil.completelyContains = function tab_RectXYUtil$completelyContains(r1, r2) {
    return tab.RectXYUtil.inRect(r1, tab.$create_Point(r2.x, r2.y)) && tab.RectXYUtil.inRect(r1, tab.$create_Point(r2.x + r2.w - 1, r2.y + r2.h - 1));
}
tab.RectXYUtil.toRect = function tab_RectXYUtil$toRect(r) {
    return tab.$create_Rect(r.x, r.y, r.w, r.h);
}
tab.RectXYUtil.offsetRect = function tab_RectXYUtil$offsetRect(r, p) {
    return tab.$create_RectXY(r.x + p.x, r.y + p.y, r.w, r.h);
}
tab.RectXYUtil.offsetRectF = function tab_RectXYUtil$offsetRectF(r, p) {
    return tab.$create_RectXY(r.x + Math.round(p.x), r.y + Math.round(p.y), r.w, r.h);
}
tab.RectXYUtil.outsetRect = function tab_RectXYUtil$outsetRect(r, dx, dy) {
    return tab.$create_RectXY(r.x - dx, r.y - dy, r.w + dx + dx, r.h + dy + dy);
}
tab.RectXYUtil.outsetRectSizeF = function tab_RectXYUtil$outsetRectSizeF(r, d) {
    return tab.RectXYUtil.outsetRect(r, Math.ceil(d.w), Math.ceil(d.h));
}
tab.RectXYUtil.encompassPoint = function tab_RectXYUtil$encompassPoint(r, p) {
    if (tab.RectXYUtil.isEmpty(r)) {
        return tab.$create_RectXY(p.x, p.y, 1, 1);
    }
    if (!tab.RectXYUtil.inRect(r, p)) {
        var newRect = tab.$create_RectXY(r.x, r.y, r.w, r.h);
        var deltaX = newRect.x - p.x;
        if (deltaX > 0) {
            newRect.x = p.x;
            newRect.w += deltaX;
        }
        else if (deltaX < -newRect.w) {
            newRect.w = -deltaX;
        }
        var deltaY = newRect.y - p.y;
        if (deltaY > 0) {
            newRect.y = p.y;
            newRect.h += deltaY;
        }
        else if (deltaY < -newRect.h) {
            newRect.h = -deltaY;
        }
        return newRect;
    }
    return r;
}
tab.RectXYUtil.encompassCircle = function tab_RectXYUtil$encompassCircle(r, circle) {
    var diameter = circle.radius * 2;
    var circleRect = tab.$create_RectXY(Math.floor(circle.center.x - circle.radius + 0.5), Math.floor(circle.center.y - circle.radius + 0.5), Math.floor(diameter + 0.5), Math.floor(diameter + 0.5));
    if (tab.RectXYUtil.isEmpty(r)) {
        return circleRect;
    }
    return tab.RectXYUtil.union(r, circleRect);
}
tab.RectXYUtil.union = function tab_RectXYUtil$union(bounds1, bounds2) {
    if (tab.RectXYUtil.isEmpty(bounds1)) {
        return bounds2;
    }
    if (tab.RectXYUtil.isEmpty(bounds2)) {
        return bounds1;
    }
    var newLeft = Math.min(bounds1.x, bounds2.x);
    var newTop = Math.min(bounds1.y, bounds2.y);
    var maxRight = Math.max(bounds1.x + bounds1.w, bounds2.x + bounds2.w);
    var maxBottom = Math.max(bounds1.y + bounds1.h, bounds2.y + bounds2.h);
    return tab.$create_RectXY(newLeft, newTop, maxRight - newLeft, maxBottom - newTop);
}
tab.RectXYUtil.rectXYFromCorners = function tab_RectXYUtil$rectXYFromCorners(corner1, corner2) {
    var left = Math.round(Math.min(corner1.x, corner2.x));
    var top = Math.round(Math.min(corner1.y, corner2.y));
    var width = Math.abs(Math.round(corner1.x - corner2.x));
    var height = Math.abs(Math.round(corner1.y - corner2.y));
    return tab.$create_RectXY(left, top, width, height);
}
tab.RectXYUtil.rectXYFromBBoxRectF = function tab_RectXYUtil$rectXYFromBBoxRectF(bounds) {
    return tab.RectXYUtil.rectXYFromMinAndMax(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
}
tab.RectXYUtil.rectXYFromMinAndMax = function tab_RectXYUtil$rectXYFromMinAndMax(minX, minY, maxX, maxY) {
    var fminx = Math.floor(minX);
    var fminy = Math.floor(minY);
    var fmaxx = Math.ceil(maxX);
    var fmaxy = Math.ceil(maxY);
    return tab.$create_RectXY(fminx, fminy, fmaxx - fminx, fmaxy - fminy);
}
tab.RectXYUtil.dialate = function tab_RectXYUtil$dialate(r, dialation) {
    var x = r.x - dialation;
    var y = r.y - dialation;
    var width = r.w + (2 * dialation);
    var height = r.h + (2 * dialation);
    return tab.$create_RectXY(x, y, width, height);
}
tab.RectXYUtil.intersect = function tab_RectXYUtil$intersect(rect1, rect2) {
    if (!tab.RectXYUtil.intersectsWith(rect1, rect2) || tab.RectXYUtil.isEmpty(rect2) || tab.RectXYUtil.isEmpty(rect1)) {
        return tab.$create_RectXY(0, 0, 0, 0);
    }
    var newLeft = Math.max(rect1.x, rect2.x);
    var newTop = Math.max(rect1.y, rect2.y);
    var newRight = Math.min(rect1.x + rect1.w, rect2.x + rect2.w);
    var newBottom = Math.min(rect1.y + rect1.h, rect2.y + rect2.h);
    return tab.$create_RectXY(newLeft, newTop, newRight - newLeft, newBottom - newTop);
}
tab.RectXYUtil.shiftCoordsTowardsCenter = function tab_RectXYUtil$shiftCoordsTowardsCenter(coords, rect, marginSize) {
    if (ss.isNullOrUndefined(rect)) {
        return coords;
    }
    var shiftedCoords = tab.$create_Point(coords.x, coords.y);
    shiftedCoords = tab.RectXYUtil.horizontalShiftCoordsTowardsCenter(shiftedCoords, rect, marginSize);
    return tab.RectXYUtil.verticalShiftCoordsTowardsCenter(shiftedCoords, rect, marginSize);
}
tab.RectXYUtil.horizontalShiftCoordsTowardsCenter = function tab_RectXYUtil$horizontalShiftCoordsTowardsCenter(coords, rect, marginSize) {
    if (ss.isNullOrUndefined(rect)) {
        return coords;
    }
    var toRet = tab.$create_Point(coords.x, coords.y);
    if (toRet.x <= (rect.x + marginSize)) {
        toRet.x += marginSize;
    }
    else if (toRet.x >= ((rect.x + rect.w) - (2 * marginSize))) {
        toRet.x -= marginSize;
    }
    return toRet;
}
tab.RectXYUtil.verticalShiftCoordsTowardsCenter = function tab_RectXYUtil$verticalShiftCoordsTowardsCenter(coords, rect, marginSize) {
    if (ss.isNullOrUndefined(rect)) {
        return coords;
    }
    var toRet = tab.$create_Point(coords.x, coords.y);
    if (toRet.y <= (rect.y + marginSize)) {
        toRet.y += marginSize;
    }
    else if (toRet.y >= ((rect.y + rect.h) - (2 * marginSize))) {
        toRet.y -= marginSize;
    }
    return toRet;
}
tab.RectXYUtil.getChangedRects = function tab_RectXYUtil$getChangedRects(originalRect, newRect) {
    var addedRects = [];
    if (!ss.isValue(originalRect) || !ss.isValue(newRect) || !tab.RectXYUtil.intersectsWith(originalRect, newRect)) {
        return addedRects;
    }
    var originalRight = originalRect.x + originalRect.w;
    var originalBottom = originalRect.y + originalRect.h;
    var newRight = newRect.x + newRect.w;
    var newBottom = newRect.y + newRect.h;
    if (originalRect.x !== newRect.x) {
        addedRects.add(tab.$create_RectXY(Math.min(originalRect.x, newRect.x), Math.max(originalRect.y, newRect.y), Math.abs(originalRect.x - newRect.x), Math.min(originalRect.h, newRect.h)));
    }
    if (originalRect.y !== newRect.y) {
        addedRects.add(tab.$create_RectXY(Math.max(originalRect.x, newRect.x), Math.min(originalRect.y, newRect.y), Math.min(originalRect.w, newRect.w), Math.abs(originalRect.y - newRect.y)));
    }
    if (originalRight !== newRight) {
        addedRects.add(tab.$create_RectXY(Math.min(originalRight, newRight), Math.max(originalRect.y, newRect.y), Math.abs(originalRight - newRight), Math.min(originalRect.h, newRect.h)));
    }
    if (originalBottom !== newBottom) {
        addedRects.add(tab.$create_RectXY(Math.max(originalRect.x, newRect.x), Math.min(originalBottom, newBottom), Math.min(originalRect.w, newRect.w), Math.abs(originalBottom - newBottom)));
    }
    if ((originalRect.x < newRect.x && originalRect.y < newRect.y) || (originalRect.x > newRect.x && originalRect.y > newRect.y)) {
        addedRects.add(tab.$create_RectXY(Math.min(originalRect.x, newRect.x), Math.min(originalRect.y, newRect.y), Math.abs(originalRect.x - newRect.x), Math.abs(originalRect.y - newRect.y)));
    }
    if ((originalRect.x < newRect.x && originalBottom > newBottom) || (originalRect.x > newRect.x && originalBottom < newBottom)) {
        addedRects.add(tab.$create_RectXY(Math.min(originalRect.x, newRect.x), Math.min(originalBottom, newBottom), Math.abs(originalRect.x - newRect.x), Math.abs(originalBottom - newBottom)));
    }
    if ((originalRight > newRight && originalRect.y < newRect.y) || (originalRight < newRight && originalRect.y > newRect.y)) {
        addedRects.add(tab.$create_RectXY(Math.min(originalRight, newRight), Math.min(originalRect.y, newRect.y), Math.abs(originalRight - newRight), Math.abs(originalRect.y - newRect.y)));
    }
    if ((originalRight < newRight && originalBottom < newBottom) || (originalRight > newRight && originalBottom > newBottom)) {
        addedRects.add(tab.$create_RectXY(Math.min(originalRight, newRight), Math.min(originalBottom, newBottom), Math.abs(originalRight - newRight), Math.abs(originalBottom - newBottom)));
    }
    return addedRects;
}


////////////////////////////////////////////////////////////////////////////////
// tab.DoubleRectXYUtil

tab.DoubleRectXYUtil = function tab_DoubleRectXYUtil() {
}
tab.DoubleRectXYUtil.isEmpty = function tab_DoubleRectXYUtil$isEmpty(r) {
    if (!ss.isValue(r)) {
        tab.Log.get(r).warn('Rect should not be empty when testing IsEmpty');
        return true;
    }
    return !r.w || !r.h;
}
tab.DoubleRectXYUtil.isEqual = function tab_DoubleRectXYUtil$isEqual(r1, r2) {
    return r1.x === r2.x && r1.y === r2.y && r1.w === r2.w && r1.h === r2.h;
}
tab.DoubleRectXYUtil.isNull = function tab_DoubleRectXYUtil$isNull(r) {
    return !r.x && !r.y && !r.w && !r.h;
}
tab.DoubleRectXYUtil.inRect = function tab_DoubleRectXYUtil$inRect(r, p) {
    return p.x >= r.x && p.x < (r.x + r.w) && p.y >= r.y && p.y < (r.y + r.h);
}
tab.DoubleRectXYUtil.intersectsWith = function tab_DoubleRectXYUtil$intersectsWith(r1, r2) {
    return !(r2.x + r2.w < r1.x || r2.y + r2.h < r1.y || r2.x > r1.x + r1.w || r2.y > r1.y + r1.h);
}
tab.DoubleRectXYUtil.outsetRect = function tab_DoubleRectXYUtil$outsetRect(r, dx, dy) {
    return tab.$create_DoubleRectXY(r.x - dx, r.y - dy, r.w + dx + dx, r.h + dy + dy);
}


////////////////////////////////////////////////////////////////////////////////
// tab.RleDecoder

tab.RleDecoder = function tab_RleDecoder() {
}
tab.RleDecoder.decode = function tab_RleDecoder$decode(root) {
    if (ss.isNullOrUndefined(root)) {
        return root;
    }
    return tab.RleDecoder._expandArraysInHierarchy(root);
}
tab.RleDecoder._expandArraysInHierarchy = function tab_RleDecoder$_expandArraysInHierarchy(obj) {
    if (typeof(obj) !== 'object' || !ss.isValue(obj)) {
        return obj;
    }
    if ($.isArray(obj)) {
        var arr = obj;
        for (var i = 0, len = arr.length; i < len; i++) {
            var elt = arr[i];
            if (typeof(elt) !== 'object') {
                break;
            }
            arr[i] = tab.RleDecoder._expandArraysInHierarchy(elt);
        }
        return tab.RleDecoder._ensureExpandedArray(arr);
    }
    else {
        var dict = obj;
        var keys = Object.keys(dict);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            if (typeof(dict[key]) !== 'object') {
                continue;
            }
            if (dict.hasOwnProperty(key)) {
                dict[key] = tab.RleDecoder._expandArraysInHierarchy(dict[key]);
            }
        }
    }
    return obj;
}
tab.RleDecoder._arrayHasRLE = function tab_RleDecoder$_arrayHasRLE(eltArray) {
    if (!eltArray.length) {
        return false;
    }
    var lastElt = eltArray[eltArray.length - 1];
    if (!$.isArray(lastElt)) {
        return false;
    }
    return !(lastElt).length;
}
tab.RleDecoder._isRleEncoding = function tab_RleDecoder$_isRleEncoding(eltArray) {
    var length = eltArray.length;
    return length === 2 || length === 3;
}
tab.RleDecoder._expandRle = function tab_RleDecoder$_expandRle(valueArray, encoding) {
    var startVal = encoding[0];
    var count = encoding[1];
    var incr = (encoding.length === 3) ? encoding[2] : 0;
    for (var j = 0, val = startVal; j < count; j++, val += incr) {
        valueArray.push(val);
    }
}
tab.RleDecoder._ensureExpandedArray = function tab_RleDecoder$_ensureExpandedArray(arr) {
    if (!tab.RleDecoder._arrayHasRLE(arr)) {
        return arr;
    }
    arr.pop();
    var newArray = null;
    var prev = 0;
    var length = arr.length;
    for (var i = 0; i < length; i++) {
        var curElt = arr[i];
        var type = typeof(curElt);
        if (type === 'number') {
            continue;
        }
        if (curElt == null) {
            continue;
        }
        if (type !== 'object' || !$.isArray(curElt)) {
            return arr;
        }
        var eltArray = curElt;
        if (!tab.RleDecoder._isRleEncoding(eltArray)) {
            ss.Debug.assert(false, 'Encountered sub-array that is not run-length encoding');
            return arr;
        }
        newArray = (newArray || []);
        for (var j = prev; j < i; j++) {
            newArray.push(arr[j]);
        }
        tab.RleDecoder._expandRle(newArray, eltArray);
        prev = i + 1;
    }
    if (ss.isValue(newArray)) {
        for (var j = prev; j < length; j++) {
            newArray.push(arr[j]);
        }
        arr = newArray;
    }
    return arr;
}


////////////////////////////////////////////////////////////////////////////////
// tab.SizeUtil

tab.SizeUtil = function tab_SizeUtil() {
}
tab.SizeUtil.isEmpty = function tab_SizeUtil$isEmpty(s) {
    return !s.w && !s.h;
}
tab.SizeUtil.union = function tab_SizeUtil$union(s1, s2) {
    return tab.$create_Size(Math.max(s1.w, s2.w), Math.max(s1.h, s2.h));
}
tab.SizeUtil.unionPresModels = function tab_SizeUtil$unionPresModels(s1, s2) {
    var spm = {};
    spm.w = Math.max(s1.w, s2.w);
    spm.h = Math.max(s1.h, s2.h);
    return spm;
}
tab.SizeUtil.add = function tab_SizeUtil$add(first, second) {
    if (ss.isNullOrUndefined(first) || ss.isNullOrUndefined(second)) {
        return first;
    }
    return tab.$create_Size(first.w + second.w, first.h + second.h);
}
tab.SizeUtil.subtract = function tab_SizeUtil$subtract(first, second) {
    return tab.$create_Size(first.w - second.w, first.h - second.h);
}
tab.SizeUtil.equals = function tab_SizeUtil$equals(p, p2) {
    return ss.isValue(p) && ss.isValue(p2) && p2.w === p.w && p2.h === p.h;
}


////////////////////////////////////////////////////////////////////////////////
// tab.StringTuple

tab.StringTuple = function tab_StringTuple(first, second) {
    this._first = first;
    this._second = second;
}
tab.StringTuple.prototype = {
    _first: null,
    _second: null,
    
    get_first: function tab_StringTuple$get_first() {
        return this._first;
    },
    set_first: function tab_StringTuple$set_first(value) {
        this._first = value;
        return value;
    },
    
    get_second: function tab_StringTuple$get_second() {
        return this._second;
    },
    set_second: function tab_StringTuple$set_second(value) {
        this._second = value;
        return value;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.StyleUtil

tab.StyleUtil = function tab_StyleUtil() {
}
tab.StyleUtil.appendCSSRule = function tab_StyleUtil$appendCSSRule(selector, declarations) {
    tab.StyleUtil.appendCSSRuleToStyleSheet('appendedCustomStyle', selector, declarations);
}
tab.StyleUtil.appendCSSRuleToStyleSheet = function tab_StyleUtil$appendCSSRuleToStyleSheet(styleElementId, selector, declarations) {
    var customStyleElement;
    var customStyleSheet = null;
    if (ss.isNullOrUndefined(tab.StyleUtil._customStyleElementDictionary)) {
        tab.StyleUtil._customStyleElementDictionary = {};
    }
    if (ss.isNullOrUndefined(tab.StyleUtil._customStyleSheetDictionary)) {
        tab.StyleUtil._customStyleSheetDictionary = {};
    }
    customStyleElement = tab.StyleUtil._customStyleElementDictionary[styleElementId];
    customStyleSheet = tab.StyleUtil._customStyleSheetDictionary[styleElementId];
    if (ss.isNullOrUndefined(customStyleElement)) {
        customStyleElement = document.createElement('style');
        customStyleElement.setAttribute('type', 'text/css');
        customStyleElement.id = styleElementId;
        document.getElementsByTagName('head')[0].appendChild(customStyleElement);
        var styleSheets = document.styleSheets;
        var $enum1 = ss.IEnumerator.getEnumerator(styleSheets);
        while ($enum1.moveNext()) {
            var stylesheet = $enum1.current;
            var ownerNode = stylesheet.ownerNode;
            if (ss.isNullOrUndefined(ownerNode)) {
                ownerNode = stylesheet.owningElement;
            }
            if (ss.isValue(ownerNode) && ownerNode.id === styleElementId) {
                customStyleSheet = stylesheet;
                break;
            }
        }
        tab.StyleUtil._customStyleElementDictionary[styleElementId] = customStyleElement;
        tab.StyleUtil._customStyleSheetDictionary[styleElementId] = customStyleSheet;
    }
    var styleBody = '';
    var $enum2 = ss.IEnumerator.getEnumerator(Object.keys(declarations));
    while ($enum2.moveNext()) {
        var key = $enum2.current;
        styleBody += key + ':' + declarations[key] + ';\n';
    }
    if ((typeof(customStyleSheet.insertRule) === 'function')) {
        var cssCode = selector + ' {\n' + styleBody + '}\n';
        var index = customStyleSheet.cssRules.length;
        customStyleSheet.insertRule(cssCode, index);
    }
    else {
        var $enum3 = ss.IEnumerator.getEnumerator(selector.split(','));
        while ($enum3.moveNext()) {
            var individualSelector = $enum3.current;
            customStyleSheet.addRule(individualSelector, styleBody, -1);
        }
    }
}
tab.StyleUtil.clearDefaultStyleSheet = function tab_StyleUtil$clearDefaultStyleSheet() {
    tab.StyleUtil.clearStyleSheet('appendedCustomStyle');
}
tab.StyleUtil.clearStyleSheet = function tab_StyleUtil$clearStyleSheet(styleElementId) {
    var customStyleElement = null;
    if (ss.isNullOrUndefined(tab.StyleUtil._customStyleElementDictionary)) {
        return;
    }
    customStyleElement = tab.StyleUtil._customStyleElementDictionary[styleElementId];
    if (ss.isValue(customStyleElement) && ss.isValue(customStyleElement.parentNode)) {
        customStyleElement.parentNode.removeChild(customStyleElement);
        delete tab.StyleUtil._customStyleSheetDictionary[styleElementId];
        delete tab.StyleUtil._customStyleElementDictionary[styleElementId];
    }
}
tab.StyleUtil.isValidCssClassName = function tab_StyleUtil$isValidCssClassName(cssClassName) {
    var match = cssClassName.match(tab.StyleUtil._regexCssClassName);
    return ss.isValue(match);
}


////////////////////////////////////////////////////////////////////////////////
// tab.Transform

tab.Transform = function tab_Transform(translateX, translateY, scale, type) {
    this._translate = tab.$create_PointF(translateX, translateY);
    this._scale = scale;
    this._inverseScale = 1 / scale;
    this._transformType = type;
}
tab.Transform.worldOffset = function tab_Transform$worldOffset(offset) {
    return (!offset) ? tab.Transform._nullTransform : new tab.Transform(offset, 0, 1, 3);
}
tab.Transform.pixelToDomain = function tab_Transform$pixelToDomain(translateX, translateY, scale) {
    if (tab.FloatUtil.isZero(translateX) && tab.FloatUtil.isZero(translateY) && tab.FloatUtil.isEqual(1, scale)) {
        return tab.Transform._nullTransform;
    }
    return new tab.Transform(translateX, translateY, scale, 1);
}
tab.Transform.domainToPixel = function tab_Transform$domainToPixel(translateX, translateY, scale) {
    if (tab.FloatUtil.isZero(translateX) && tab.FloatUtil.isZero(translateY) && tab.FloatUtil.isEqual(1, scale)) {
        return tab.Transform._nullTransform;
    }
    return new tab.Transform(translateX, translateY, scale, 2);
}
tab.Transform.prototype = {
    _translate: null,
    _scale: 0,
    _inverseScale: 0,
    _transformType: 0,
    
    get_translateX: function tab_Transform$get_translateX() {
        return this._translate.x;
    },
    
    get_translateY: function tab_Transform$get_translateY() {
        return this._translate.y;
    },
    
    get_transformType: function tab_Transform$get_transformType() {
        return this._transformType;
    },
    
    get_isNull: function tab_Transform$get_isNull() {
        return !this._transformType;
    },
    
    transformBounds: function tab_Transform$transformBounds(bounds) {
        if (!this._transformType) {
            var minX = Math.floor(bounds.minX);
            var minY = Math.floor(bounds.minY);
            var maxX = Math.ceil(bounds.maxX);
            var maxY = Math.ceil(bounds.maxY);
            return tab.$create_RectXY(minX, minY, maxX - minX, maxY - minY);
        }
        if (this._transformType === 2) {
            var minX = Math.floor((bounds.minX * this._scale) + this._translate.x);
            var minY = Math.floor((bounds.minY * this._scale) + this._translate.y);
            var maxX = Math.ceil((bounds.maxX * this._scale) + this._translate.x);
            var maxY = Math.ceil((bounds.maxY * this._scale) + this._translate.y);
            return tab.$create_RectXY(minX, minY, maxX - minX, maxY - minY);
        }
        ss.Debug.fail('Cannot transform bounds for transform type: ' + this._transformType);
        return null;
    },
    
    transformRect: function tab_Transform$transformRect(rect) {
        switch (this._transformType) {
            case 0:
                return tab.$create_DoubleRectXY(rect.x, rect.y, rect.w, rect.h);
            case 1:
            case 3:
                return tab.$create_DoubleRectXY((rect.x - this._translate.x) * this._inverseScale, (rect.y - this._translate.y) * this._inverseScale, rect.w * this._inverseScale, rect.h * this._inverseScale);
            default:
                ss.Debug.fail('Cannot transform rect for transform type: ' + this._transformType);
                return null;
        }
    },
    
    transformCircle: function tab_Transform$transformCircle(c) {
        switch (this._transformType) {
            case 0:
                return c;
            case 1:
            case 3:
                var newCenterX = (c.center.x - this._translate.x) * this._inverseScale;
                var newCenterY = (c.center.y - this._translate.y) * this._inverseScale;
                return tab.$create_Circle(tab.$create_PointF(newCenterX, newCenterY), c.radius * this._inverseScale);
            default:
                ss.Debug.fail('Cannot transform circle for transform type: ' + this._transformType);
                return null;
        }
    },
    
    transformPolygon: function tab_Transform$transformPolygon(listOfPoints) {
        switch (this._transformType) {
            case 0:
                return listOfPoints;
            case 1:
            case 3:
                var toRet = [];
                var $enum1 = ss.IEnumerator.getEnumerator(listOfPoints);
                while ($enum1.moveNext()) {
                    var point = $enum1.current;
                    var x = (point.x - this._translate.x) * this._inverseScale;
                    var y = (point.y - this._translate.y) * this._inverseScale;
                    toRet.add(tab.$create_PointF(x, y));
                }
                return toRet;
            default:
                ss.Debug.fail('Cannot transform polygon for transform type: ' + this._transformType);
                return null;
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tableau.types

tableau.types._millisecondsPerDay = function tableau_types$_millisecondsPerDay() {
    return tab.MiscUtil.lazyInitStaticField(tableau.types, 'millisecondsPerDay', function() {
        return 24 * 60 * 60 * 1000;
    });
}
tableau.types.javaScriptOLEEpoch = function tableau_types$javaScriptOLEEpoch() {
    return tab.MiscUtil.lazyInitStaticField(tableau.types, 'javascriptOleEpoch', function() {
        return Date.UTC(1899, 11, 30, 0, 0, 0, 0);
    });
}
tableau.types.JsDateFromOleDate = function tableau_types$JsDateFromOleDate(f) {
    var days = (f < 0) ? Math.ceil(f) : Math.floor(f);
    var ms = Math.round(Math.abs(f - days) * tableau.types._millisecondsPerDay()) + (days * tableau.types._millisecondsPerDay());
    return ms + tableau.types.javaScriptOLEEpoch();
}
tableau.types.OleDateFromJsDate = function tableau_types$OleDateFromJsDate(ms) {
    var t = new Date(ms);
    var d = Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
    var days = (d - tableau.types.javaScriptOLEEpoch()) / tableau.types._millisecondsPerDay();
    var time = (ms - d) / tableau.types._millisecondsPerDay();
    return days + (((days < 0) ? -1 : 1) * time);
}
tableau.types.isO = function tableau_types$isO(field) {
    return field.fieldType === 'O' || field.fieldType === 'N';
}
tableau.types.isMetadata = function tableau_types$isMetadata(field) {
    return !field.column_class;
}
tableau.types.isOm = function tableau_types$isOm(field) {
    return tableau.types.isO(field) && tableau.types.isMetadata(field);
}
tableau.types.getRegionType = function tableau_types$getRegionType(regionName) {
    switch (regionName) {
        case 'viz':
        case 'bottomaxis':
        case 'topaxis':
        case 'leftaxis':
        case 'rightaxis':
        case 'xheader':
        case 'yheader':
            return 't';
        case 'color':
        case 'shape':
        case 'size':
        case 'map':
            return 'l';
        case 'filter':
            return 'f';
        case 'current-page':
            return 'p';
        case 'title':
            return 'i';
        case 'text':
            return 'x';
        case 'bitmap':
            return 'b';
        case 'web':
            return 'w';
        case 'paramctrl':
            return 'a';
        case 'draw':
            return 'd';
        case 'text-block':
            return 'k';
        case 'layout-basic':
        case 'layout-flow':
            return 'c';
        default:
            return null;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tableau.types.RegionType

tableau.types.RegionType = function tableau_types_RegionType() {
}


////////////////////////////////////////////////////////////////////////////////
// tableau.types.FieldTypeTypes

tableau.types.FieldTypeTypes = function tableau_types_FieldTypeTypes() {
}


////////////////////////////////////////////////////////////////////////////////
// tableau.types.QFDomain

tableau.types.QFDomain = function tableau_types_QFDomain() {
}


////////////////////////////////////////////////////////////////////////////////
// tableau.types.CFStyle

tableau.types.CFStyle = function tableau_types_CFStyle() {
}


////////////////////////////////////////////////////////////////////////////////
// tableau.types.HFStyle

tableau.types.HFStyle = function tableau_types_HFStyle() {
}


////////////////////////////////////////////////////////////////////////////////
// tableau.types.CFType

tableau.types.CFType = function tableau_types_CFType() {
}


////////////////////////////////////////////////////////////////////////////////
// tableau.types.QFFixed

tableau.types.QFFixed = function tableau_types_QFFixed() {
}


////////////////////////////////////////////////////////////////////////////////
// tableau.types.QFInclude

tableau.types.QFInclude = function tableau_types_QFInclude() {
}
tableau.types.QFInclude.isRange = function tableau_types_QFInclude$isRange(v) {
    switch (v) {
        case 'include-all':
        case 'include-null':
        case 'include-non-null':
            return false;
        default:
            return true;
    }
}


tableau.types.DataSpecial.registerClass('tableau.types.DataSpecial');
tableau.types.DataType.registerClass('tableau.types.DataType');
tableau.types.TableauTypesFieldRole.registerClass('tableau.types.TableauTypesFieldRole');
tab.BaseLogAppender.registerClass('tab.BaseLogAppender', null, tab.ILogAppender);
tab.ConsoleLogAppender.registerClass('tab.ConsoleLogAppender', tab.BaseLogAppender);
tab.ErrorTrace.registerClass('tab.ErrorTrace');
tab.StackLocation.registerClass('tab.StackLocation');
tab.StackTrace.registerClass('tab.StackTrace');
tab.StackTraceAppender.registerClass('tab.StackTraceAppender', tab.BaseLogAppender);
tab.Logger.registerClass('tab.Logger', tab.BaseLogger);
tab.Log.registerClass('tab.Log');
tab.MetricsLogger.registerClass('tab.MetricsLogger');
tab.NavigationMetricsCollector.registerClass('tab.NavigationMetricsCollector');
tab.WindowAppender.registerClass('tab.WindowAppender', tab.BaseLogAppender);
tab.BrowserSupport.registerClass('tab.BrowserSupport');
tab.CalendarOptions.registerClass('tab.CalendarOptions');
tab.CallOnDispose.registerClass('tab.CallOnDispose', null, ss.IDisposable);
tab.CircleUtil.registerClass('tab.CircleUtil');
tab.FeatureFlags.registerClass('tab.FeatureFlags');
tab.FeatureParamsLookup.registerClass('tab.FeatureParamsLookup');
tab.DateUtil.registerClass('tab.DateUtil');
tab.DisposableHolder.registerClass('tab.DisposableHolder', null, ss.IDisposable);
tab.DomUtil.registerClass('tab.DomUtil');
tab.FloatUtil.registerClass('tab.FloatUtil');
tableau.format.registerClass('tableau.format');
tab.HistoryUtil.registerClass('tab.HistoryUtil');
tab.IntegerRange.registerClass('tab.IntegerRange');
tab.IntSet.registerClass('tab.IntSet');
tab.UintSet.registerClass('tab.UintSet');
tab._jQuerySelectorExtensionsImpl.registerClass('tab._jQuerySelectorExtensionsImpl');
tab.JsonUtil.registerClass('tab.JsonUtil');
tab.MiscUtil.registerClass('tab.MiscUtil');
tab.Param.registerClass('tab.Param');
tab.PointUtil.registerClass('tab.PointUtil');
tab.PointFUtil.registerClass('tab.PointFUtil');
tab.RecordCast.registerClass('tab.RecordCast');
tab.RectUtil.registerClass('tab.RectUtil');
tab.RectXYUtil.registerClass('tab.RectXYUtil');
tab.DoubleRectXYUtil.registerClass('tab.DoubleRectXYUtil');
tab.RleDecoder.registerClass('tab.RleDecoder');
tab.SizeUtil.registerClass('tab.SizeUtil');
tab.StringTuple.registerClass('tab.StringTuple');
tab.StyleUtil.registerClass('tab.StyleUtil');
tab.Transform.registerClass('tab.Transform');
tableau.types.RegionType.registerClass('tableau.types.RegionType');
tableau.types.FieldTypeTypes.registerClass('tableau.types.FieldTypeTypes');
tableau.types.QFDomain.registerClass('tableau.types.QFDomain');
tableau.types.CFStyle.registerClass('tableau.types.CFStyle');
tableau.types.HFStyle.registerClass('tableau.types.HFStyle');
tableau.types.CFType.registerClass('tableau.types.CFType');
tableau.types.QFFixed.registerClass('tableau.types.QFFixed');
tableau.types.QFInclude.registerClass('tableau.types.QFInclude');
tableau.types.DataSpecial.DS_NORMAL = null;
tableau.types.DataSpecial.DS_NULL = 'n';
tableau.types.DataSpecial.DS_ALL = 'a';
tableau.types.DataSpecial.DS_WILDCARD = 'w';
tableau.types.DataSpecial.DS_SKIPPED = 's';
tableau.types.DataSpecial.DS_NOACCESS = 'p';
tableau.types.DataSpecial.DS_RAGGED = 'r';
tableau.types.DataSpecial.DS_ERROR = 'e';
tableau.types.DataSpecial.DS_MISSING = 'm';
tableau.types.DataType.DT_INTEGER = 'i';
tableau.types.DataType.DT_REAL = 'r';
tableau.types.DataType.DT_STRING = 's';
tableau.types.DataType.DT_TIMESTAMP = 't';
tableau.types.DataType.DT_BOOLEAN = 'b';
tableau.types.DataType.DT_DATE = 'd';
tableau.types.DataType.DT_UNKNOWN = null;
tableau.types.TableauTypesFieldRole.ROLE_DIMENSION = 'd';
tableau.types.TableauTypesFieldRole.ROLE_MEASURE = 'm';
tableau.types.TableauTypesFieldRole.ROLE_UNKNOWN = null;
tab.ConsoleLogAppender._globalAppender$1 = null;
(function () {
    tab.ConsoleLogAppender.enableLogging(function(l, ll) {
        return ll >= 2;
    });
})();
tab.ErrorTrace._shouldReThrow = false;
tab.ErrorTrace._remoteFetching = true;
tab.ErrorTrace._collectWindowErrors = true;
tab.ErrorTrace._linesOfContext = 3;
tab.ErrorTrace._getStack = false;
tab.ErrorTrace._lastExceptionStack = null;
tab.ErrorTrace._lastException = null;
tab.ErrorTrace._sourceCache = {};
tab.ErrorTrace._queuedTraces = [];
tab.ErrorTrace._onErrorHandlerInstalled = false;
tab.ErrorTrace._oldOnErrorHandler = null;
tab.StackTraceAppender._globalAppender$1 = null;
(function () {
    tab.StackTraceAppender.enableLogging(function(l, ll) {
        return ll > 2;
    });
})();
tab.Logger.global = tab.Logger.getLoggerWithName('global');
tab.Logger.loggerLevelNames = [];
(function () {
    tab.Logger._setupUrlFilters$1();
    tab.Logger.loggerLevelNames[0] = 'all';
    tab.Logger.loggerLevelNames[1] = 'debug';
    tab.Logger.loggerLevelNames[2] = 'info';
    tab.Logger.loggerLevelNames[3] = 'warn';
    tab.Logger.loggerLevelNames[4] = 'error';
    tab.Logger.loggerLevelNames[5] = 'off';
})();
tab.MetricsLogger._debugParamNames = null;
tab.MetricsLogger._debugEventNames = null;
tab.MetricsLogger._instance = null;
(function () {
    tab.MetricsLogger._debugParamNames = {};
    tab.MetricsLogger._debugParamNames['d'] = 'DESC';
    tab.MetricsLogger._debugParamNames['t'] = 'TIME';
    tab.MetricsLogger._debugParamNames['id'] = 'ID';
    tab.MetricsLogger._debugParamNames['sid'] = 'SESSION_ID';
    tab.MetricsLogger._debugParamNames['e'] = 'ELAPSED';
    tab.MetricsLogger._debugParamNames['v'] = 'VALS';
    tab.MetricsLogger._debugParamNames['wb'] = 'WORKBOOK';
    tab.MetricsLogger._debugParamNames['s'] = 'SHEET_NAME';
    tab.MetricsLogger._debugParamNames['p'] = 'PROPS';
    tab.MetricsLogger._debugEventNames = {};
    tab.MetricsLogger._debugEventNames['nav'] = 'Navigation';
    tab.MetricsLogger._debugEventNames['wps'] = 'ProfileStart';
    tab.MetricsLogger._debugEventNames['wp'] = 'ProfileEnd';
    tab.MetricsLogger._debugEventNames['gen'] = 'Unknown';
    tab.MetricsLogger._debugEventNames['init'] = 'SessionInit';
})();
tab.NavigationMetricsCollector._navigationMetricsOrder = [ 'navigationStart', 'unloadEventStart', 'unloadEventEnd', 'redirectStart', 'redirectEnd', 'fetchStart', 'domainLookupStart', 'domainLookupEnd', 'connectStart', 'connectEnd', 'secureConnectionStart', 'requestStart', 'responseStart', 'responseEnd', 'domLoading', 'domInteractive', 'domContentLoadedEventStart', 'domContentLoadedEventEnd', 'domComplete', 'loadEventStart', 'loadEventEnd' ];
tab.NavigationMetricsCollector._navMetrics = null;
(function () {
    if (ss.isValue(window.self.addEventListener)) {
        window.addEventListener('load', function() {
            _.defer(tab.NavigationMetricsCollector.collectMetrics);
        }, false);
    }
    else if (ss.isValue(window.self.attachEvent)) {
        window.attachEvent('load', function() {
            _.defer(tab.NavigationMetricsCollector.collectMetrics);
        });
    }
})();
tab.WindowAppender._globalAppender$1 = null;
(function () {
    tab.WindowAppender.enableLogging(function(l, ll) {
        return l.get_name() === 'WindowAppender';
    });
})();
tab.BrowserSupport._selectStart = false;
tab.BrowserSupport._touch = 'ontouchend' in document;
tab.BrowserSupport._dataUri = false;
tab.BrowserSupport._postMessage = false;
tab.BrowserSupport._historyApi = false;
tab.BrowserSupport._consoleLogFormatting = false;
tab.BrowserSupport._cssTransformName = null;
tab.BrowserSupport._cssTransitionName = null;
tab.BrowserSupport._cssTranslate2d = false;
tab.BrowserSupport._cssTranslate3d = false;
tab.BrowserSupport._shouldUseAlternateHitStrategy = false;
tab.BrowserSupport._canvasLinePattern = false;
tab.BrowserSupport._isSafari = false;
tab.BrowserSupport._isChrome = false;
tab.BrowserSupport._isIE = false;
tab.BrowserSupport._isFF = false;
tab.BrowserSupport._isOpera = false;
tab.BrowserSupport._isKhtml = false;
tab.BrowserSupport._isWebKit = false;
tab.BrowserSupport._isMozilla = false;
tab.BrowserSupport._isIos = false;
tab.BrowserSupport._isAndroid = false;
tab.BrowserSupport._isMac = false;
tab.BrowserSupport._devicePixelRatio = 1;
tab.BrowserSupport._backingStoragePixelRatio = 1;
tab.BrowserSupport._dateInput = false;
tab.BrowserSupport._dateTimeInput = false;
tab.BrowserSupport._dateTimeLocalInput = false;
tab.BrowserSupport._timeInput = false;
tab.BrowserSupport._setSelectionRange = false;
(function () {
    $(function() {
        var body = document.body;
        var div = document.createElement('div');
        body.appendChild(div);
        tab.BrowserSupport._selectStart = ('onselectstart' in div);
        body.removeChild(div).style.display = 'none';
        tab.BrowserSupport._postMessage = ('postMessage' in window);
        tab.BrowserSupport._historyApi = (typeof(window.history.pushState) === 'function') && (typeof(window.history.replaceState) === 'function');
        tab.BrowserSupport._detectDataUriSupport();
        tab.BrowserSupport._detectConsoleLogFormatting();
        tab.BrowserSupport._detectBrowser();
        tab.BrowserSupport._detectTransitionSupport();
        tab.BrowserSupport._detectTransformSupport();
        tab.BrowserSupport._detectDocumentElementFromPoint();
        tab.BrowserSupport._detectDevicePixelRatio();
        tab.BrowserSupport._detectBackingStoragePixelRatio();
        tab.BrowserSupport._detectDateInputSupport();
        tab.BrowserSupport._detectCanvasLinePattern();
        tab.BrowserSupport._detectSetSelectionRangeSupport();
    });
})();
tab.FeatureParamsLookup._logger = null;
tab.FeatureParamsLookup._booleanParams = null;
tab.FeatureParamsLookup._floatParams = null;
tab.FeatureParamsLookup._intParams = null;
tab.FeatureParamsLookup._stringParams = null;
tab.FeatureParamsLookup._stringToEnumLookup = null;
tab.FeatureParamsLookup._booleanLookUp = null;
tab.FeatureParamsLookup._floatLookUp = null;
tab.FeatureParamsLookup._intLookUp = null;
tab.FeatureParamsLookup._stringLookUp = null;
(function () {
    tab.FeatureParamsLookup._logger = tab.Logger.lazyGetLogger(tab.FeatureParamsLookup);
    tab.FeatureParamsLookup._booleanParams = [];
    tab.FeatureParamsLookup._floatParams = [];
    tab.FeatureParamsLookup._intParams = [];
    tab.FeatureParamsLookup._stringParams = [];
    tab.FeatureParamsLookup._stringToEnumLookup = {};
    tab.FeatureParamsLookup._booleanLookUp = {};
    tab.FeatureParamsLookup._floatLookUp = {};
    tab.FeatureParamsLookup._intLookUp = {};
    tab.FeatureParamsLookup._stringLookUp = {};
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':transparentbackground', 3);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':newfilter', 4);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':fieldconversion', 5);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':qfformatting', 6);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':responsive', 7, true);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':newtoolbar', 9);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':lassoselection', 13, false);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':radialselection', 14, false);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':newselectiontools', 16, true);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':selectiontoolsmobile', 23, true);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':newbrowsertoolbar', 17);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':calcdialogfunclist', 20, true);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':formattedflipboardnav', 24, true);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':collapsesidepane', 25, true);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':mapssearchleftside', 26, false);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':newcaptiontoolbar', 27, true);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':mapssearchdebugalwaysshow', 28, false);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':useleafletforgeosearch', 19, false);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':aopaneui', 29, true);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':headersfeedback', 30, true);
    tab.FeatureParamsLookup._registerBooleanFeatureParam(':aodragtoviz', 31, false);
    tab.FeatureParamsLookup._registerIntFeatureParam(':buttondelay', 11);
    tab.FeatureParamsLookup._registerIntFeatureParam(':hoverdelay', 12);
    tab.FeatureParamsLookup._registerIntFeatureParam(':maxtooltipwhitespace', 18);
    tab.FeatureParamsLookup._parseFeatureParamsFromUrl();
})();
tab.DateUtil.oneSecond = new Date(2008, 11, 21, 1, 1, 2).getTime() - new Date(2008, 11, 21, 1, 1, 1).getTime();
tab.DateUtil.oneMinute = new Date(2008, 11, 21, 1, 2).getTime() - new Date(2008, 11, 21, 1, 1).getTime();
tab.DateUtil.oneHour = new Date(2008, 11, 21, 2).getTime() - new Date(2008, 11, 21, 1).getTime();
tab.DateUtil.oneDay = new Date(2008, 11, 21).getTime() - new Date(2008, 11, 20).getTime();
tab.DateUtil.oneWeek = new Date(2008, 11, 21).getTime() - new Date(2008, 11, 14).getTime();
tab.DateUtil._milisInADay = (1000 * 60) * (60 * 24);
tab.FloatUtil.epsilon = Math.pow(2, -23);
tab.FloatUtil._onePlusEpsilon = 1 + tab.FloatUtil.epsilon;
tab.FloatUtil._upperBound = tab.FloatUtil._onePlusEpsilon;
tab.FloatUtil._lowerBound = 1 / tab.FloatUtil._onePlusEpsilon;
tableau.format.specialManyValues = '%many-values%';
tableau.format.specialNull = '%null%';
tableau.format.specialError = '%error%';
tableau.format.specialRagged = '%ragged%';
tableau.format.specialSkipped = '%skipped%';
tableau.format.specialMissing = '%missing%';
tableau.format.specialAll = '%all%';
tableau.format.specialNoAccess = '%no-access%';
tableau.format.specialWildcard = '%wildcard%';
tableau.format.millisPerDay = 86400000;
tableau.format._iso8601DateFormat = tab.$create_FormattingInfo();
tableau.format._iso8601DateTimeFormat = tab.$create_FormattingInfo();
tableau.format._iso8601TimeFormat = tab.$create_FormattingInfo();
tableau.format._regexpMetacharacters = new RegExp('(\\\\|\\^|\\$|\\*|\\+|\\?|\\.|\\:|\\,|\\(|\\)|\\[|\\]|\\{|\\}|\\|)', 'g');
tableau.format._dateSpaceTime = new RegExp('^([yYmMdD\\W]+)\\s+([hnst\\W]+)$');
tableau.format._secondsField = new RegExp('(\\\\[:.]s+)');
tableau.format._tt = new RegExp('(t+)', 'g');
tableau.format._numericFields = new RegExp('([yYmMdDhnswq]+)', 'g');
tableau.format._spaceBetweenNumbers = new RegExp('\\(\\\\d\\+\\)(?:\\(\\?\\:)?\\s+\\(\\\\d\\+\\)', 'g');
tableau.format._otherWhitespace = new RegExp('\\s', 'g');
tableau.format._charactersAfterDay = new RegExp('(^|d)([^h]*)(h|$)', 'gi');
tableau.format._charactersAfterHour = new RegExp('h([^d]*)(d|$)', 'gi');
tableau.format._am = new RegExp('^(a|a\\.?m\\.?|\u33c2|\u03c0\\.?\u00b5\\.?|\u5348\u524d)$', 'i');
tableau.format._pm = new RegExp('^(p|p\\.?m\\.?|\u33d8|\u00b5\\.?\u00b5\\.?|\u5348\u5f8c)$', 'i');
tableau.format._icuToOleMap = { yyyyy: 'yyyyy', yyyy: 'yyyy', yyy: 'yyyy', yy: 'yy', y: 'yyyy', L: 'm', LL: 'mm', LLL: 'mmm', LLLL: 'mmmm' };
(function () {
    tableau.format._iso8601DateFormat.format = 'yyyy-mm-dd';
    tableau.format._iso8601DateFormat.timeFormat = 'hh:nn';
    tableau.format._iso8601DateTimeFormat.format = 'yyyy-mm-ddThh:nn';
    tableau.format._iso8601TimeFormat.format = 'hh:nn';
})();
(function () {
    $.DeferredData = $.Deferred;
})();
tab.MiscUtil._queryAndHashChars = [ '?', '#' ];
tab.Param.suppressAlerts = false;
tab.StyleUtil._regexCssClassName = new RegExp('-?[_a-zA-Z]+[_a-zA-Z0-9-]*');
tab.StyleUtil._customStyleSheetDictionary = null;
tab.StyleUtil._customStyleElementDictionary = null;
tab.Transform._nullTransform = null;
(function () {
    tab.Transform._nullTransform = new tab.Transform(0, 0, 1, 0);
})();
(function () {
    var exportDialogType = {};
    exportDialogType['ExportImage'] = { title: tab.Strings.ExportImageDialogTitle, mimeType: 'image/png', message: tab.Strings.ExportImageDialogMessage };
    exportDialogType['ExportData'] = { title: tab.Strings.ExportDataDialogTitle, mimeType: 'text/csv', message: tab.Strings.ExportDataDialogMessage };
    exportDialogType['ExportCrosstab'] = { title: tab.Strings.ExportCrosstabDialogTitle, message: tab.Strings.ExportCrosstabDialogMessage };
    exportDialogType['PrintPDF'] = { title: tab.Strings.PrintPdfDialogTitle, mimeType: 'application/pdf', message: tab.Strings.PrintPdfDialogMessage, noping: true };
    tab.MiscUtil.lazyInitStaticField(tableau.types, 'ExportDialogType', function() {
        return exportDialogType;
    });
})();
tableau.types.RegionType.table = 't';
tableau.types.RegionType.legend = 'l';
tableau.types.RegionType.filter = 'f';
tableau.types.RegionType.currentPage = 'p';
tableau.types.RegionType.title = 'i';
tableau.types.RegionType.text = 'x';
tableau.types.RegionType.bitmap = 'b';
tableau.types.RegionType.web = 'w';
tableau.types.RegionType.draw = 'd';
tableau.types.RegionType.textBlock = 'k';
tableau.types.RegionType.layoutContainer = 'c';
tableau.types.RegionType.parameter = 'a';
tableau.types.FieldTypeTypes.FT_QUANTITATIVE = 'Q';
tableau.types.FieldTypeTypes.FT_ORDINAL = 'O';
tableau.types.FieldTypeTypes.FT_NOMINAL = 'N';
tableau.types.FieldTypeTypes.FT_UNKNOWN = null;
tableau.types.QFDomain.QFD_ALL = 'all';
tableau.types.QFDomain.QFD_CONTEXT = 'context';
tableau.types.QFDomain.QFD_RELEVANT = 'relevant';
tableau.types.CFStyle.CFS_ALL = 'all';
tableau.types.CFStyle.CFS_SINGLE = 'single-select';
tableau.types.CFStyle.CFS_MULTIPLE = 'multi-select';
tableau.types.HFStyle.HFS_SINGLE = 'single-select';
tableau.types.HFStyle.HFS_MULTIPLE = 'multi-select';
tableau.types.CFType.CFT_INCLUSIVE = 'include';
tableau.types.CFType.CFT_EXCLUSIVE = 'exclude';
tableau.types.QFFixed.QFF_FIXED_START = 'start';
tableau.types.QFFixed.QFF_FIXED_END = 'end';
tableau.types.QFInclude.QFI_ALL = 'include-all';
tableau.types.QFInclude.QFI_NON_NULL = 'include-non-null';
tableau.types.QFInclude.QFI_NULL_ONLY = 'include-null';
tableau.types.QFInclude.QFI_RANGE = 'include-range';
tableau.types.QFInclude.QFI_RANGE_OR_NULL = 'include-range-or-null';

}());

//! This script was generated using Script# v0.7.4.0
