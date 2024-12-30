import React from "react";

const RefundPolicy = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Cancellation & Refund Policy
      </h1>
      <p className="text-sm text-center text-gray-500 mt-2">
        Last updated on 30-12-2024 15:25:11
      </p>
      <p className="mt-6 text-gray-700">
        Mohammed Maaz believes in helping its customers as far as possible and
        has therefore a liberal cancellation policy. Under this policy:
      </p>
      <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
        <li>
          Cancellations will be considered only if the request is made
          immediately after placing the order. However, the cancellation request
          may not be entertained if the orders have been communicated to the
          vendors/merchants and they have initiated the process of shipping
          them.
        </li>
        <li>
          Mohammed Maaz does not accept cancellation requests for perishable
          items like flowers, eatables, etc. However, refund/replacement can be
          made if the customer establishes that the quality of the product
          delivered is not good.
        </li>
        <li>
          In case of receipt of damaged or defective items, please report the
          same to our Customer Service team. The request will, however, be
          entertained once the merchant has checked and determined the same at
          their own end. This should be reported within 7 days of receipt of the
          products. In case you feel that the product received is not as shown
          on the site or as per your expectations, you must bring it to the
          notice of our Customer Service within 7 days of receiving the product.
          The Customer Service Team, after looking into your complaint, will
          take an appropriate decision.
        </li>
        <li>
          In case of complaints regarding products that come with a warranty
          from manufacturers, please refer the issue to them. In case of any
          refunds approved by Mohammed Maaz, it’ll take 1-2 days for the refund
          to be processed to the end customer.
        </li>
      </ul>
    </div>
  );
};

export default RefundPolicy;
