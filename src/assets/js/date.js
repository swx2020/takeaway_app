// 'yyyy-MM-dd hh:mm'
export function formatDate(date, formatStr) {
  if (/(y+)/.test(formatStr)) {
    formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (const k in o) {
    /*
      报错： Error in render: "TypeError: (intermediate value).text is not a function"
        第一步：将GoodDetail组件中日期格式化有关的代码注释掉，（因为在此之前能正常运行）发现可以运行，所以错误是在date.js中
        第二步：ctrl + f查找.text
          发现是 test写成了text！
      粗心大意！！！！
    */
    if (new RegExp(`(${k})`).test(formatStr)) {
      const str = o[k] + '';
      formatStr = formatStr.replace(RegExp.$1, (RegExp.$1 === 1) ? str : padLeftZero(str));
    }
  }
  return formatStr;
};

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}
