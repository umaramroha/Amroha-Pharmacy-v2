import Link from "next/link";

export const metadata = {
  title: "Shipping & Delivery Policy - Amroha Pharmacy",
  description: "Shipping and delivery information for Amroha Pharmacy orders.",
};

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <nav className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <span>/</span>
          <span className="text-gray-700">Shipping & Delivery Policy</span>
        </nav>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Shipping & Delivery Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Effective Date: 26/09/2026 | Last Updated: 26/09/2026
          </p>

          <div className="prose prose-sm md:prose-base max-w-none text-gray-700 space-y-6">

            <p>
              This Shipping & Delivery Policy ("Policy") governs the dispatch, shipping and delivery of products ordered through the Amroha Pharmacy website ("Website") operated under the name "Amroha Pharmacy" ("we", "us", "our" or "Seller"). This Policy forms an integral part of, and should be read together with, our Terms & Conditions, Privacy Policy, Cancellation, Return & Refund Policy and Medical/Product Disclaimer.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">1. DELIVERY COVERAGE</h2>

            <p>
              We currently deliver to serviceable PIN codes across India. Serviceability depends on courier partner coverage, product category, regulatory restrictions and operational capability. We reserve the right to add, modify or restrict serviceable areas at our discretion.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">2. DELIVERY ZONES & CHARGES</h2>

            <p>
              Delivery timelines and charges vary based on the delivery zone. The zones are classified as follows:
            </p>

            <div className="overflow-x-auto my-4">
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-900 border-b">Zone</th>
                    <th className="text-left p-3 font-semibold text-gray-900 border-b">Coverage</th>
                    <th className="text-left p-3 font-semibold text-gray-900 border-b">Delivery Time</th>
                    <th className="text-left p-3 font-semibold text-gray-900 border-b">Delivery Fee</th>
                    <th className="text-left p-3 font-semibold text-gray-900 border-b">Free Delivery Above</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Amroha Local</td>
                    <td className="p-3">Amroha district (PIN codes beginning with 2442)</td>
                    <td className="p-3">1 – 2 Business Days</td>
                    <td className="p-3 text-green-700 font-semibold">FREE</td>
                    <td className="p-3">Always FREE</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Nearby / Priority Zone</td>
                    <td className="p-3">
                      Delhi NCR, Western Uttar Pradesh, and the Delhi–Lucknow highway belt, including Delhi, Noida, Ghaziabad, Hapur, Meerut, Moradabad, Rampur, Sambhal, Bijnor, Bareilly, Shahjahanpur, Lucknow, and adjoining serviceable PIN codes.
                    </td>
                    <td className="p-3">2 – 4 Business Days</td>
                    <td className="p-3">₹50</td>
                    <td className="p-3">₹500</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Standard Delivery</td>
                    <td className="p-3">All other serviceable locations within India.</td>
                    <td className="p-3">4 – 7 Business Days</td>
                    <td className="p-3">₹80</td>
                    <td className="p-3">₹800</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              The above timelines and charges are indicative and may be revised from time to time without prior notice. The applicable charges shall be displayed at the time of checkout.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">3. ORDER PROCESSING TIME</h2>

            <p>
              Orders are typically processed and dispatched within 1–2 Business Days from the date of confirmed order and successful payment (where applicable), subject to stock availability, order verification and operational capacity.
            </p>

            <p>
              Orders placed on Sundays, public holidays or during peak sale periods may be processed on the next Business Day.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">4. DELIVERY TIMELINES</h2>

            <p>
              Estimated delivery timelines are calculated from the date of dispatch, not the date of order placement. Delivery timelines are indicative and may vary due to factors including, but not limited to:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>Courier partner delays;</li>
              <li>Weather conditions, natural events or regional disruptions;</li>
              <li>Public holidays, strikes or transportation blockages;</li>
              <li>Regulatory restrictions or statutory clearances;</li>
              <li>Address-related issues or customer unavailability;</li>
              <li>Operational or technology disruptions; or</li>
              <li>Other circumstances beyond our reasonable control.</li>
            </ul>

            <p>
              Estimated delivery dates do not constitute an absolute guarantee unless expressly stated otherwise.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">5. CASH ON DELIVERY (COD)</h2>

            <p>
              COD may be available for eligible locations, products, orders and customer profiles. COD availability is subject to the following conditions:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>Delivery address must fall within a COD-serviceable PIN code;</li>
              <li>Certain products and high-value orders may not be eligible for COD;</li>
              <li>Orders may be subject to additional verification;</li>
              <li>Repeated refusal or non-acceptance of COD orders may result in withdrawal of COD eligibility;</li>
              <li>High-risk or fraud-flagged orders may be cancelled or placed on hold.</li>
            </ul>

            <p>
              COD is not available for certain PIN codes owing to high fraud risk, high return-to-origin (RTO) incidence, remote island locations, extreme high-altitude regions and remote mountain areas. Where COD is not available, prepaid payment (UPI/online) shall be required.
            </p>

            <p>
              We reserve the right, subject to applicable law, to cancel or hold any COD order where there are reasonable grounds to suspect fraud, misuse or abuse.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">6. DELIVERY ATTEMPTS</h2>

            <p>
              Our courier partners shall make reasonable attempts to deliver the order to the address provided by the customer. Where delivery cannot be completed owing to:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>Incorrect or incomplete address;</li>
              <li>Incorrect or unreachable mobile number;</li>
              <li>Customer unavailability at the time of delivery;</li>
              <li>Refusal to accept the order; or</li>
              <li>Failure to provide required verification,</li>
            </ul>

            <p>
              the order may be returned to origin (RTO). Re-dispatch or additional delivery charges may apply where legally permissible and actually incurred. Repeated failed deliveries may result in restriction of COD availability.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">7. SHIPPING CHARGES</h2>

            <p>
              Shipping charges are calculated based on the delivery zone, order value and applicable free-delivery thresholds. The applicable shipping charges shall be displayed transparently at the time of checkout before order confirmation.
            </p>

            <p>
              Shipping charges, where paid, are generally non-refundable, except where the return is attributable to Amroha Pharmacy (including incorrect, damaged or defective products).
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">8. ORDER TRACKING</h2>

            <p>
              Upon dispatch, customers may receive order tracking information through the contact details provided at the time of order placement. Tracking updates may also be communicated through WhatsApp, SMS or email, as applicable.
            </p>

            <p>
              Tracking information is provided by the courier partner and may occasionally be delayed or inaccurate due to independent factors beyond our control.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">9. DELIVERY PARTNER</h2>

            <p>
              We engage third-party courier and logistics partners for order fulfilment. Delivery is subject to the operational terms and serviceability of the respective courier partner. We shall not be responsible for independent failures of third-party logistics providers, except to the extent liability is imposed upon us under applicable law.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">10. UNDELIVERED OR RETURNED ORDERS</h2>

            <p>
              Where an order is returned to origin (RTO) owing to reasons attributable to the customer, the following may apply:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>Shipping charges actually incurred may be deducted from the refund (where legally permissible);</li>
              <li>Re-dispatch may be offered on payment of additional shipping charges;</li>
              <li>Repeated RTOs may result in restriction of COD availability or account review.</li>
            </ul>

            <p>
              Where the RTO is attributable to Amroha Pharmacy, the eligible refund shall be processed in accordance with our Cancellation, Return & Refund Policy.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">11. FORCE MAJEURE</h2>

            <p>
              We shall not be liable for any delay or failure in delivery arising from events beyond our reasonable control, including but not limited to natural disasters, pandemics, government restrictions, strikes, war, civil unrest, cyber incidents or failures of essential infrastructure.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">12. CHANGES TO THIS POLICY</h2>

            <p>
              We may update this Policy from time to time. The revised version shall be published on the Website with an updated "Last Updated" date. Continued use of the Website after such publication constitutes acceptance of the revised Policy.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">13. CONTACT US</h2>

            <p>
              For any questions, concerns or assistance regarding shipping and delivery, please contact us at:
            </p>

            <p>
              Amroha Pharmacy<br />
              Mohalla Nal, Amroha, Uttar Pradesh, India<br />
              Email: Amrohapharmastore@gmail.com<br />
              Phone/WhatsApp: +91 80779 88509
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}
