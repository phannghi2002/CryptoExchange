// // import React, { useEffect, useState } from "react";
// // import { useSearchParams, useNavigate } from "react-router-dom";
// // import PaymentResult from "./PaymentResult"; // Import your PaymentResult component

// // const PaymentReturn = () => {
// //   const [searchParams] = useSearchParams();
// //   const [isLoading, setIsLoading] = useState(true);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const params = Object.fromEntries(searchParams.entries());
// //     console.log("VNPay Return Parameters:", params);

// //     // Try to determine the result from VNPay parameters
// //     const vnpResponseCode = params.get("vnp_ResponseCode");
// //     const vnpTransactionStatus = params.get("vnp_TransactionStatus");
// //     const vnpOrderInfo = params.get("vnp_OrderInfo");
// //     const vnpAmount = params.get("vnp_Amount");
// //     const vnpPayDate = params.get("vnp_PayDate");
// //     const vnpTransactionNo = params.get("vnp_TransactionNo");

// //     let result = "thất bại";
// //     let orderId = "[order ID]";
// //     let totalPrice = "[total price]";
// //     let paymentTime = "[payment time]";
// //     let transactionId = "[transaction ID]";

// //     if (vnpResponseCode && vnpTransactionStatus) {
// //       result =
// //         "00" === vnpResponseCode && "00" === vnpTransactionStatus
// //           ? "thành công"
// //           : "thất bại";

// //       try {
// //         orderId = vnpOrderInfo
// //           ? decodeURIComponent(vnpOrderInfo)
// //           : "[order ID]";
// //         totalPrice = vnpAmount || "[total price]";
// //         paymentTime = vnpPayDate || "[payment time]";
// //         transactionId = vnpTransactionNo || "[transaction ID]";

// //         if (paymentTime && paymentTime.length === 14) {
// //           // e.g., "20250228235925"
// //           const year = paymentTime.substring(0, 4);
// //           const month = paymentTime.substring(4, 6);
// //           const day = paymentTime.substring(6, 8);
// //           const hour = paymentTime.substring(8, 10);
// //           const minute = paymentTime.substring(10, 12);
// //           const second = paymentTime.substring(12, 14);
// //           paymentTime = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
// //         }
// //       } catch (e) {
// //         console.error("Error decoding or formatting VNPay parameters:", e);
// //       }

// //       // Optionally, verify with backend if needed (e.g., for secure hash or logging)
// //       fetch("http://localhost:8087/payment/vnpay-payment-verify", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/x-www-form-urlencoded",
// //         },
// //         body: new URLSearchParams(params).toString(),
// //       })
// //         .then((response) => response.json())
// //         .then((data) => {
// //           console.log("Backend verification result:", data);
// //           if (data.result === "thành công") {
// //             result = "thành công";
// //           }
// //         })
// //         .catch((error) =>
// //           console.error("Error verifying payment with backend:", error)
// //         )
// //         .finally(() => {
// //           setTimeout(() => {
// //             setIsLoading(false);
// //             const orderData = {
// //               orderId,
// //               totalPrice,
// //               paymentTime,
// //               transactionId,
// //             };
// //             console.log("Navigating to PaymentResult with:", {
// //               result,
// //               orderData,
// //             });
// //             const queryParams = new URLSearchParams();
// //             queryParams.set("result", result);
// //             queryParams.set("orderId", encodeURIComponent(orderId));
// //             queryParams.set("totalPrice", totalPrice);
// //             queryParams.set("paymentTime", paymentTime);
// //             queryParams.set("transactionId", transactionId);
// //             navigate(`/payment-result?${queryParams.toString()}`, {
// //               state: { result, orderData },
// //             });
// //           }, 1000); // Delay of 1 second to ensure rendering and logging
// //         });
// //     } else {
// //       // Fallback if no VNPay parameters (use query parameters if provided by backend redirect)
// //       result = searchParams.get("result") || "thất bại";
// //       orderId = searchParams.get("orderId") || "[order ID]";
// //       totalPrice = searchParams.get("totalPrice") || "[total price]";
// //       paymentTime = searchParams.get("paymentTime") || "[payment time]";
// //       transactionId = searchParams.get("transactionId") || "[transaction ID]";

// //       setTimeout(() => {
// //         setIsLoading(false);
// //         const orderData = {
// //           orderId,
// //           totalPrice,
// //           paymentTime,
// //           transactionId,
// //         };
// //         console.log("Navigating to PaymentResult with fallback:", {
// //           result,
// //           orderData,
// //         });
// //         const queryParams = new URLSearchParams();
// //         queryParams.set("result", result);
// //         queryParams.set("orderId", encodeURIComponent(orderId));
// //         queryParams.set("totalPrice", totalPrice);
// //         queryParams.set("paymentTime", paymentTime);
// //         queryParams.set("transactionId", transactionId);
// //         navigate(`/payment-result?${queryParams.toString()}`, {
// //           state: { result, orderData },
// //         });
// //       }, 1000); // Delay of 1 second to ensure rendering and logging
// //     }
// //   }, [searchParams, navigate]);

// //   // Render loading message while processing
// //   if (isLoading) {
// //     return (
// //       <div className="container mx-auto p-4 text-center">
// //         Đang xử lý kết quả thanh toán...
// //       </div>
// //     );
// //   }

// //   return null; // Component will navigate away, so no need for additional rendering
// // };

// // export default PaymentReturn;

// import React, { useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import PaymentResult from "./PaymentResult"; // Import your PaymentResult component

// const PaymentReturn = () => {
//   const [searchParams] = useSearchParams();
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();
//   const [paymentData, setPaymentData] = useState(null);

//   useEffect(() => {
//     const params = Object.fromEntries(searchParams.entries());
//     console.log("VNPay Return Parameters:", params);

//     // Try to determine the result from VNPay parameters or redirect
//     const vnpResponseCode = params.get("vnp_ResponseCode");
//     const vnpTransactionStatus = params.get("vnp_TransactionStatus");
//     const vnpOrderInfo = params.get("vnp_OrderInfo");
//     const vnpAmount = params.get("vnp_Amount");
//     const vnpPayDate = params.get("vnp_PayDate");
//     const vnpTransactionNo = params.get("vnp_TransactionNo");
//     const result = params.get("result") || "orderFailed"; // Check for result from redirect
//     const orderId = params.get("orderId") || "[order ID]";
//     const totalPrice = params.get("totalPrice") || "[total price]";
//     const paymentTime = params.get("paymentTime") || "[payment time]";
//     const transactionId = params.get("transactionId") || "[transaction ID]";

//     let finalResult = result;
//     let finalOrderId = orderId;
//     let finalTotalPrice = totalPrice;
//     let finalPaymentTime = paymentTime;
//     let finalTransactionId = transactionId;

//     if (vnpResponseCode && vnpTransactionStatus) {
//       finalResult =
//         "00" === vnpResponseCode && "00" === vnpTransactionStatus
//           ? "orderSuccess"
//           : "orderFailed";

//       try {
//         finalOrderId = vnpOrderInfo
//           ? decodeURIComponent(vnpOrderInfo)
//           : "[order ID]";
//         finalTotalPrice = vnpAmount || "[total price]";
//         finalPaymentTime = vnpPayDate || "[payment time]";
//         finalTransactionId = vnpTransactionNo || "[transaction ID]";

//         if (finalPaymentTime && finalPaymentTime.length === 14) {
//           // e.g., "20250302114241"
//           const year = finalPaymentTime.substring(0, 4);
//           const month = finalPaymentTime.substring(4, 6);
//           const day = finalPaymentTime.substring(6, 8);
//           const hour = finalPaymentTime.substring(8, 10);
//           const minute = finalPaymentTime.substring(10, 12);
//           const second = finalPaymentTime.substring(12, 14);
//           finalPaymentTime = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
//         }
//       } catch (e) {
//         console.error("Error decoding or formatting VNPay parameters:", e);
//       }
//     }

//     setPaymentData({
//       result: finalResult,
//       orderId: finalOrderId,
//       totalPrice: finalTotalPrice,
//       paymentTime: finalPaymentTime,
//       transactionId: finalTransactionId,
//     });

//     setTimeout(() => {
//       setIsLoading(false);
//       if (paymentData) {
//         const { result, orderId, totalPrice, paymentTime, transactionId } =
//           paymentData;
//         console.log("Navigating to PaymentResult with:", {
//           result,
//           orderId,
//           totalPrice,
//           paymentTime,
//           transactionId,
//         });
//         const queryParams = new URLSearchParams();
//         queryParams.set("result", result);
//         queryParams.set("orderId", encodeURIComponent(orderId));
//         queryParams.set("totalPrice", totalPrice);
//         queryParams.set("paymentTime", paymentTime);
//         queryParams.set("transactionId", transactionId);
//         navigate(`/payment-result?${queryParams.toString()}`, {
//           state: paymentData,
//         });
//       }
//     }, 1000); // Delay of 1 second to ensure rendering and logging
//   }, [searchParams, navigate]);

//   // Render loading message while processing
//   if (isLoading) {
//     return (
//       <div className="container mx-auto p-4 text-center">
//         Đang xử lý kết quả thanh toán...
//       </div>
//     );
//   }

//   return null; // Component will navigate away, so no need for additional rendering
// };

// export default PaymentReturn;
