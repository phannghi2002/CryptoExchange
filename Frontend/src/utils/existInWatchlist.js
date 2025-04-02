export const existInWatchlist = (items = [], coin) => {
  console.log("ỉn ra items với coin xem nào", items, coin);
  return items.some((item) => item?.id === coin?.id);
};
