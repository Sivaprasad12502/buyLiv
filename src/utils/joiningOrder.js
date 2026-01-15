export const getJoiningOrderStatus = (orders) => {
  const joiningOrder = orders.find((order) =>
    order.items.some((item) => item.product.is_joining)
  );

  return joiningOrder ? joiningOrder.status : null;
};
