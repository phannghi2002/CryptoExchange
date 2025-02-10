// export const existInWatchlist = (items, coin) => {
//   console.log("in ra check ne", items);
//   if (!Array.isArray(items)) {
//     return false; // Hoặc trả về giá trị mặc định nếu items không phải mảng
//   }

//   for (let item of items) {
//     if (item?.id === coin?.id) return true;
//   }
//   return false;
// };

// export const existInWatchlist = (items = [], coin) => {
//   items.some((item) => item?.id === coin?.id);
//   console.log("chay ne");
// };

export const existInWatchlist = (items = [], coin) => {
  console.log("ỉn ra items với coin xem nào", items, coin);
  return items.some((item) => item?.id === coin?.id);
};
