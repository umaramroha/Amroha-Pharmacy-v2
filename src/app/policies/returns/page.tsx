import Link from "next/link";

export const metadata = {
  title: "Cancellation, Return & Refund Policy - Amroha Pharmacy",
  description:
    "Cancellation, Return and Refund Policy for orders placed on Amroha Pharmacy.",
};

export default function ReturnsPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <nav className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-700">
            Cancellation, Return & Refund Policy
          </span>
        </nav>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Cancellation, Return & Refund Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Effective Date: 26/09/2026 | Last Updated: 26/09/2026
          </p>

          <div className="prose prose-sm md:prose-base max-w-none text-gray-700 space-y-6">
            <p>
              This Cancellation, Return & Refund Policy ("Policy") governs the
              cancellation of orders, return and replacement of products, and
              processing of refunds in respect of orders placed through the
              Amroha Pharmacy website ("Website") operated under the name
              "Amroha Pharmacy" ("we", "us", "our" or "Seller"). This Policy
              forms an integral part of and should be read together with our
              Terms & Conditions, Privacy Policy, Shipping & Delivery Policy
              and Medical/Product Disclaimer.
            </p>

            <p>
              By placing an order on the Website, you acknowledge that you have
              read, understood and agreed to be bound by this Policy.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              1. GENERAL PRINCIPLES
            </h2>

            <p>
              We endeavour to ensure that all orders are dispatched and
              delivered in accordance with the product description and
              applicable quality standards. This Policy is intended to address
              customer concerns relating to cancellations, returns, replacements
              and refunds in a fair and transparent manner, in accordance with
              applicable Indian law, including the Consumer Protection Act,
              2019, the Consumer Protection (E-Commerce) Rules, 2020, and any
              other applicable laws.
            </p>

            <p>
              Nothing in this Policy shall be interpreted as excluding any
              statutory remedy available to a customer that cannot lawfully be
              excluded or restricted.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              2. ORDER CANCELLATION BY CUSTOMER
            </h2>

            <p>
              <strong>2.1 Cancellation before dispatch:</strong>
            </p>

            <p>
              A customer may request cancellation of an order before it is
              dispatched. Requests may be made through the customer support
              channels provided on the Website (including email, phone or
              WhatsApp). Where cancellation is accepted, and where payment has
              already been made, the eligible amount shall be refunded in
              accordance with Section 6 of this Policy.
            </p>

            <p>
              <strong>2.2 Cancellation after dispatch:</strong>
            </p>

            <p>
              Once an order has been dispatched, cancellation may not generally
              be possible. In exceptional circumstances, and where the courier
              partner is able to intercept the shipment, cancellation may be
              considered on a case-by-case basis. Where cancellation is
              accepted after dispatch, shipping charges actually incurred may be
              deducted from the refund (where legally permissible).
            </p>

            <p>
              <strong>2.3 Cancellation of COD orders:</strong>
            </p>

            <p>
              Cash on Delivery (COD) orders may be cancelled before dispatch
              without any charges. Repeated cancellation of COD orders may
              result in restriction of future COD eligibility.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              3. ORDER CANCELLATION BY AMROHA PHARMACY
            </h2>

            <p>
              We reserve the right to cancel an order, wholly or partially,
              where reasonably necessary due to:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>Product unavailability;</li>
              <li>Pricing or listing errors;</li>
              <li>Suspected fraud, misuse or abuse;</li>
              <li>Incomplete or incorrect customer information;</li>
              <li>Delivery restrictions or non-serviceability;</li>
              <li>Payment failure or reversal;</li>
              <li>Repeated failed deliveries;</li>
              <li>Unusual ordering patterns;</li>
              <li>Legal or regulatory restrictions;</li>
              <li>Supplier or manufacturer-related issues; or</li>
              <li>Circumstances beyond our reasonable control.</li>
            </ul>

            <p>
              Where an order is cancelled after successful payment, the
              eligible amount shall be refunded in accordance with this Policy
              and applicable law.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              4. RETURNS AND REPLACEMENTS — GENERAL CONDITIONS
            </h2>

            <p>
              Returns or replacements may be considered where:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>The product received is materially different from the product ordered;</li>
              <li>The product is received in a damaged condition;</li>
              <li>The product is received in a tampered, opened or improperly sealed condition;</li>
              <li>The product is received after its expiry date;</li>
              <li>The product is received with missing items from a multi-product order; or</li>
              <li>The product has a genuine, verifiable quality or safety concern attributable to Amroha Pharmacy.</li>
            </ul>

            <p>
              In the case of suspected allergies, adverse reactions or side
              effects, please seek medical attention first and consult a
              qualified healthcare professional. Product-related concerns
              should be reported to customer support with relevant details as
              soon as reasonably practicable.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              5. NON-RETURNABLE PRODUCTS
            </h2>

            <p>
              Owing to health, safety, hygiene, regulatory and statutory
              considerations, the following categories of products may be
              non-returnable unless they are damaged, incorrect, expired or
              otherwise defective at the time of delivery:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>Medicines, capsules, tablets, syrups, powders, oils and other consumable healthcare products once opened or used;</li>
              <li>Products that have been unsealed or whose outer packaging has been opened or tampered with after delivery;</li>
              <li>Personal-care and hygiene products;</li>
              <li>Products subject to statutory restrictions under the Drugs and Cosmetics Act, 1940 or any other applicable law;</li>
              <li>Products specifically marked as non-returnable on the product page;</li>
              <li>Products purchased under promotional or clearance sales where such conditions have been expressly communicated.</li>
            </ul>

            <p>
              The "non-returnable" designation does not exclude statutory
              remedies available under applicable law for defective, incorrect,
              damaged, expired or otherwise legally actionable products.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              6. RETURN WINDOW
            </h2>

            <p>
              Where a product is eligible for return or replacement, the
              customer should report the concern to customer support within:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Damaged, incorrect, tampered or expired products:</strong>{" "}
                within 48 hours of delivery, along with photographs, videos and
                other supporting evidence;
              </li>
              <li>
                <strong>Other eligible quality or safety concerns:</strong>{" "}
                within 7 days of delivery, subject to review.
              </li>
            </ul>

            <p>
              Requests made after the applicable window may be considered at our
              sole discretion, subject to applicable law.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              7. HOW TO REQUEST A RETURN OR REPLACEMENT
            </h2>

            <p>
              To request a return or replacement, please contact customer
              support with the following details:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>Order identification / order number;</li>
              <li>Name, registered mobile number and delivery address;</li>
              <li>Description of the concern;</li>
              <li>Clear photographs of the product, outer packaging and shipping label;</li>
              <li>Video (where applicable) demonstrating the alleged damage or defect;</li>
              <li>Invoice details; and</li>
              <li>Any other information reasonably requested for investigation.</li>
            </ul>

            <p>
              Our team shall review the request and may request additional
              information or evidence. Submission of evidence does not
              automatically guarantee approval of a claim, and each request
              shall be evaluated on the merits of the particular case and in
              accordance with applicable law.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              8. PROCESSING OF APPROVED RETURNS
            </h2>

            <p>
              Where a return is approved:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>
                The customer may be required to return the product in its
                original condition with the original packaging, invoice, labels
                and accessories;
              </li>
              <li>
                A reverse pickup may be arranged where serviceable, or the
                customer may be requested to dispatch the product as directed;
              </li>
              <li>
                Products found to be used, altered, damaged due to customer
                handling or missing components may not be eligible for
                replacement or refund;
              </li>
              <li>
                Shipping charges may be refunded where the return is
                attributable to Amroha Pharmacy.
              </li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              9. REFUNDS
            </h2>

            <p>
              Refunds shall be processed as follows:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Prepaid orders (UPI/online):</strong> The eligible
                amount shall be refunded to the original payment method, unless
                otherwise agreed;
              </li>
              <li>
                <strong>Cash on Delivery orders:</strong> The eligible amount
                shall be refunded through bank transfer or UPI to the details
                provided by the customer, subject to verification;
              </li>
              <li>
                <strong>Refund timelines:</strong> Refunds shall ordinarily be
                initiated within 3–5 Business Days from approval of the refund
                request. The actual credit may take additional time depending on
                the payment method, bank or financial institution, typically
                within 7–10 Business Days from initiation.
              </li>
            </ul>

            <p>
              Shipping charges paid by the customer are generally non-refundable
              except where the return is attributable to Amroha Pharmacy.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              10. DEDUCTIONS
            </h2>

            <p>
              Where legally permissible and where actually incurred, the
              following may be deducted from the refundable amount:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>Shipping charges incurred due to customer-side reasons;</li>
              <li>
                Costs of reverse pickup or re-dispatch attributable to
                customer-side reasons;
              </li>
              <li>
                Payment gateway or transaction charges, where not refundable to
                us;
              </li>
              <li>
                Any other reasonable and lawful deduction supported by
                applicable law.
              </li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              11. FRAUD, ABUSE AND MISUSE
            </h2>

            <p>
              We reserve the right, subject to applicable law, to decline a
              return, replacement or refund request where there are reasonable
              grounds to suspect fraud, abuse, misuse or a pattern of repeated
              or unfounded claims. We may also restrict or terminate account
              access or ordering privileges in such cases.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              12. STATUTORY RIGHTS
            </h2>

            <p>
              Nothing in this Policy excludes, restricts or limits any statutory
              right or remedy available to a consumer under applicable law,
              including the Consumer Protection Act, 2019 and the Consumer
              Protection (E-Commerce) Rules, 2020. Where any provision of this
              Policy is inconsistent with any such statutory right, the
              statutory right shall prevail to that extent.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              13. CHANGES TO THIS POLICY
            </h2>

            <p>
              We may update this Policy from time to time. The revised version
              shall be published on the Website with an updated "Last Updated"
              date. Continued use of the Website after such publication
              constitutes acceptance of the revised Policy.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              14. CONTACT US
            </h2>

            <p>
              For cancellation, return or refund related assistance, please
              contact:
            </p>

            <p>
              Amroha Pharmacy
              <br />
              Mohalla Nal, Amroha, Uttar Pradesh, India
              <br />
              Email: Amrohapharmastore@gmail.com
              <br />
              Phone/WhatsApp: +91 80779 88509
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
