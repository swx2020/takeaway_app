/* 解析url参数
    @example ？id=123456
    @return Object{ id: 12345 }
*/
export function urlParse() {
  const url = window.location.search;
  const obj = {};
  const reg = /[?&][^?&]+=[^?&]+/g;
  const arr = url.match(reg);
  if (arr) {
    arr.forEach((item) => {
      const tempArr = item.substring(1).split('=');
      const key = decodeURIComponent(tempArr[0]);
      const val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
}
// 方法二、
// 网上找的
// export function getURLParams() {
//   const searchURL = location.search; // 获取到URL中的参数串
//   const params = new URLSearchParams(searchURL);
//   const valueObj = Object.fromEntries(params); // 转换为普通对象
//   console.log('zhixingl');
//   console.log(valueObj);
//   return valueObj;
// }
