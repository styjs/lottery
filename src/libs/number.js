//加法函数  
function accAdd(arg1, arg2) {  
    let r1, r2, m;  
    try {  
        r1 = arg1.toString().split(".")[1].length;  
    }  
    catch (e) {  
        r1 = 0;  
    }  
    try {  
        r2 = arg2.toString().split(".")[1].length;  
    }  
    catch (e) {  
        r2 = 0;  
    }  
    m = Math.pow(10, Math.max(r1, r2));  
    return (arg1 * m + arg2 * m) / m;  
}
  
//减法函数  
function Subtr(arg1, arg2) {  
    let r1, r2, m, n;  
    try {  
        r1 = arg1.toString().split(".")[1].length;  
    }  
    catch (e) {  
        r1 = 0;  
    }  
    try {  
        r2 = arg2.toString().split(".")[1].length;  
    }  
    catch (e) {  
        r2 = 0;  
    }  
    m = Math.pow(10, Math.max(r1, r2));  
     //last modify by deeka  
     //动态控制精度长度  
    n = (r1 >= r2) ? r1 : r2;  
    return ((arg1 * m - arg2 * m) / m).toFixed(n);  
} 
  
//乘法函数  
function accMul(arg1, arg2) {  
    let m = 0, s1 = arg1.toString(), s2 = arg2.toString();  
    try {  
        m += s1.split(".")[1].length;  
    }  
    catch (e) {  
    }  
    try {  
        m += s2.split(".")[1].length;  
    }  
    catch (e) {  
    }  
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);  
}
  
//除法函数  
function accDiv(arg1, arg2) {  
    let t1 = 0, t2 = 0, r1, r2
    try {  
        t1 = arg1.toString().split(".")[1].length 
    }  
    catch (e) {  
    }  
    try {  
        t2 = arg2.toString().split(".")[1].length 
    }  
    catch (e) {  
    }  
    r1 = Number(arg1.toString().replace(".", "")) 
    r2 = Number(arg2.toString().replace(".", ""))
    return (r1 / r2) * Math.pow(10, t2 - t1)
}

export function add(src, arg) {
    return accAdd(arg, src)
}

export function sub(src, arg) {
    return Subtr(src, arg)
}

export function mul(src, arg) {
    return accMul(arg, src)
}

export function div(src, arg) {
    return accDiv(src, arg);  
}