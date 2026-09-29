import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions - Amroha Pharmacy",
  description:
    "Terms and Conditions governing the use of Amroha Pharmacy website and services.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <nav className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-700">Terms & Conditions</span>
        </nav>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Effective Date: 26/09/2026 | Last Updated: 26/09/2026
          </p>

          <div className="prose prose-sm md:prose-base max-w-none text-gray-700 space-y-6">
            <p>
              These Terms & Conditions ("Terms", "Agreement") govern the
              access to and use of the website, mobile interface, online
              services and related facilities operated under the name "Amroha
              Pharmacy" ("Amroha Pharmacy", "we", "us", "our" or "Seller").
            </p>

            <p>
              By accessing, browsing, registering on, or purchasing any product
              through the Website, you acknowledge that you have read,
              understood and agreed to be bound by these Terms, together with
              our Privacy Policy, Shipping & Delivery Policy, Cancellation,
              Return & Refund Policy, Medical/Product Disclaimer and any other
              policies expressly incorporated herein.
            </p>

            <p>
              If you do not agree with these Terms, you must not use the
              Website or place an order through it.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              1. BUSINESS INFORMATION
            </h2>

            <p>
              Business/Trading Name: Amroha Pharmacy
              <br />
              Legal Entity/Proprietor: Umar Imam
              <br />
              Registered/Business Address: Mohalla Nal, Amroha, Uttar Pradesh,
              India
              <br />
              GSTIN: Not Applicable
              <br />
              Email: Amrohapharmastore@gmail.com
              <br />
              Customer Support: +91 80779 88509
              <br />
              Grievance Officer: Umar Imam
              <br />
              Grievance Email: Amrohapharmastore@gmail.com
            </p>

            <p>
              Amroha Pharmacy operates as an online retail/e-commerce seller of
              products made available through the Website. Unless expressly
              stated otherwise on a particular product listing, Amroha Pharmacy
              is not the manufacturer, formulator, packer or original brand
              owner of the products offered for sale. Products may be sourced
              from third-party manufacturers, brands, distributors, authorised
              suppliers or other lawful commercial sources.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              2. DEFINITIONS
            </h2>

            <p>
              "Website" means the Amroha Pharmacy website and any associated
              digital interface operated by us.
            </p>
            <p>
              "Customer", "User", "you" or "your" means any person accessing the
              Website or purchasing products through it.
            </p>
            <p>
              "Product" means any medicine, healthcare product, Ayurvedic
              product, Unani product, wellness product, supplement, personal-care
              product or other lawful product displayed for sale.
            </p>
            <p>
              "Order" means a request placed by a Customer to purchase one or
              more Products through the Website.
            </p>
            <p>
              "Manufacturer" means the third-party entity responsible for
              manufacturing or otherwise legally producing the relevant
              Product.
            </p>
            <p>
              "Business Day" means a day other than a Sunday or public holiday
              in India.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              3. ELIGIBILITY TO USE THE WEBSITE
            </h2>

            <p>You represent and warrant that:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                You are legally competent to enter into a binding contract
                under applicable Indian law;
              </li>
              <li>
                The information supplied by you is accurate, complete and
                current;
              </li>
              <li>
                You shall not use the Website for any unlawful, fraudulent or
                unauthorised purpose;
              </li>
              <li>You shall not impersonate another person or entity;</li>
              <li>
                You shall not place an Order using false identity, false
                contact details or a deliberately incorrect delivery address.
              </li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              4. ACCOUNT REGISTRATION
            </h2>

            <p>
              Certain features may require registration or creation of an
              account. You are responsible for maintaining the confidentiality
              of your account credentials and for all activities conducted
              through your account.
            </p>

            <p>
              You agree to immediately notify Amroha Pharmacy if you reasonably
              believe that your account has been accessed without
              authorisation.
            </p>

            <p>
              We reserve the right to suspend or terminate an account where we
              reasonably believe that the account has been used for fraud,
              abuse, unlawful activity, policy violations or attempts to
              circumvent Website controls.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              5. PRODUCT INFORMATION
            </h2>

            <p>
              We endeavour to ensure that Product descriptions, photographs,
              specifications, prices, availability and other information
              displayed on the Website are accurate and reasonably current.
              However:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>
                Packaging, colour, design, labelling and appearance may differ
                from website photographs;
              </li>
              <li>
                Manufacturers may change packaging, formulation,
                specifications or labelling;
              </li>
              <li>Product information may be updated without prior notice;</li>
              <li>Minor typographical or technical errors may occasionally occur;</li>
              <li>Availability may change before an Order is processed.</li>
            </ul>

            <p>
              Where there is any discrepancy between a website image and the
              actual legally applicable product packaging, the applicable
              product label and statutory information shall prevail.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              6. THIRD-PARTY MANUFACTURERS AND BRANDS
            </h2>

            <p>
              Amroha Pharmacy may sell Products manufactured or supplied by
              independent third parties. Unless expressly represented
              otherwise, Amroha Pharmacy does not manufacture, formulate or
              alter such Products.
            </p>

            <p>
              Manufacturer-specific matters including manufacturing process,
              formulation, composition, manufacturing defects, batch
              specifications, statutory manufacturing compliance and
              product-specific warnings remain attributable to the relevant
              manufacturer to the extent permitted under applicable law.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              7. MEDICAL PRODUCTS AND HEALTH INFORMATION
            </h2>

            <p>
              The Website may contain general information relating to Products,
              ingredients, traditional uses, wellness or health-related
              subjects. Such information is provided for general informational
              purposes and does not constitute medical diagnosis, medical
              treatment, a prescription, professional medical advice, or a
              guarantee of therapeutic outcome.
            </p>

            <p>
              You should consult a qualified healthcare professional before
              using a Product where appropriate, particularly if you are
              pregnant, breastfeeding, elderly, suffering from a medical
              condition, taking prescription medicines or using multiple
              healthcare products.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              8. ORDER PLACEMENT
            </h2>

            <p>
              When you place an Order, you are making an offer to purchase the
              selected Products subject to these Terms. An Order shall not
              necessarily constitute final acceptance by Amroha Pharmacy.
            </p>

            <p>
              We reserve the right to accept, reject, modify, hold or cancel an
              Order, wholly or partially, where reasonably necessary due to
              Product unavailability, pricing or listing errors, suspected
              fraud, incomplete or incorrect customer information, delivery
              restrictions, payment failure, repeated failed deliveries,
              unusual ordering patterns, legal or regulatory restrictions,
              supplier-related issues, or circumstances beyond our reasonable
              control.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              9. PRICE AND TAXES
            </h2>

            <p>
              All Product prices shall be displayed as applicable on the
              Website. Prices may change without prior notice. However, once an
              Order has been validly accepted, the applicable price shall
              ordinarily be the price communicated to the Customer at the time
              of acceptance, subject to correction of manifest errors and
              applicable law.
            </p>

            <p>
              Applicable taxes, shipping charges, discounts, promotional
              benefits and other charges shall be displayed or communicated
              where applicable.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              10. PAYMENT
            </h2>

            <p>
              Payments may be processed through third-party payment gateways or
              other authorised payment service providers. We do not ordinarily
              store complete card details or sensitive payment credentials on
              our own systems where such information is processed by the
              relevant payment provider.
            </p>

            <p>
              You agree to provide accurate payment information and use a
              payment method lawfully available to you. If a payment is
              reversed, disputed, charged back or reported as unauthorised, we
              may investigate the transaction and request reasonable supporting
              information.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              11. CASH ON DELIVERY (COD)
            </h2>

            <p>
              COD may be available only for eligible locations, Products and
              Orders. COD availability may be restricted based on delivery
              location, Product category, order value, previous delivery
              history, repeated refusal or non-acceptance of COD Orders,
              fraud-risk indicators, courier restrictions or other legitimate
              operational considerations.
            </p>

            <p>
              Where an Order is reasonably identified as high-risk or
              suspicious, we may place the Order on hold, request verification
              or cancel it, subject to applicable law.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              12. ORDER VERIFICATION AND FRAUD PREVENTION
            </h2>

            <p>
              To protect customers, payment providers, delivery partners and
              Amroha Pharmacy against fraudulent transactions, we may undertake
              reasonable verification procedures. We reserve the right, subject
              to applicable law, to refuse or cancel Orders where there are
              reasonable grounds to suspect fraudulent activity, identity
              misuse, payment fraud, intentional false information, abuse of
              promotional codes, systematic misuse of return/refund procedures,
              unauthorised payment instruments, fraudulent chargebacks or other
              unlawful or abusive conduct.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              13. SHIPPING AND DELIVERY
            </h2>

            <p>
              Delivery shall be governed by the separate Shipping & Delivery
              Policy published on the Website. Estimated delivery timelines are
              indicative and may vary due to courier delays, weather, public
              holidays, strikes, natural disasters, address-related issues,
              customer unavailability, regulatory restrictions, regional
              restrictions, operational disruptions or other circumstances
              beyond reasonable control.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              14. ORDER CANCELLATION
            </h2>

            <p>
              A Customer may request cancellation of an Order in accordance
              with the Cancellation, Return & Refund Policy. Cancellation may
              not be possible after dispatch, delivery to the courier, or where
              the Product has become legally or operationally non-returnable.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              15. RETURNS, REPLACEMENTS AND REFUNDS
            </h2>

            <p>
              Returns, replacements and refunds shall be governed by the
              separate Cancellation, Return & Refund Policy. Nothing in this
              Agreement shall be interpreted as excluding a statutory consumer
              remedy that cannot lawfully be excluded.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              16. INTELLECTUAL PROPERTY
            </h2>

            <p>
              All Website content, including but not limited to logos,
              trademarks, trade names, photographs, graphics, website design,
              text, product descriptions created by Amroha Pharmacy, icons,
              layout, software, source code, databases and other original
              materials, shall remain the property of Amroha Pharmacy or the
              relevant rights holder, unless expressly stated otherwise.
            </p>

            <p>
              Third-party trademarks, brand names and product images remain the
              property of their respective owners.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              17. PROHIBITED USE
            </h2>

            <p>You shall not:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>use the Website for unlawful purposes;</li>
              <li>attempt to gain unauthorised access to Website systems;</li>
              <li>introduce malware, viruses or harmful code;</li>
              <li>interfere with Website security;</li>
              <li>
                scrape or systematically copy Website data without permission;
              </li>
              <li>use automated systems to abuse promotional offers;</li>
              <li>impersonate another person;</li>
              <li>submit fraudulent information;</li>
              <li>conduct fraudulent transactions;</li>
              <li>misuse the return/refund system;</li>
              <li>use stolen or unauthorised payment instruments;</li>
              <li>exploit Website vulnerabilities;</li>
              <li>
                engage in harassment or abuse of employees, representatives or
                delivery personnel; or
              </li>
              <li>
                otherwise use the Website in a manner prohibited by applicable
                law.
              </li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              18. THIRD-PARTY SERVICES
            </h2>

            <p>
              The Website may integrate third-party services including payment
              gateways, logistics/courier providers, analytics services,
              hosting providers, database providers, communication platforms
              and other technology/service providers. Such services may operate
              under their own terms and privacy policies.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              19. WEBSITE AVAILABILITY
            </h2>

            <p>
              We endeavour to maintain reasonable availability of the Website
              but do not guarantee uninterrupted, error-free or continuously
              available access. The Website may occasionally become unavailable
              due to maintenance, technical failures, cybersecurity incidents,
              hosting issues, network failures, updates, force majeure events,
              or other circumstances beyond our reasonable control.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              20. DISCLAIMER OF WARRANTIES
            </h2>

            <p>
              To the maximum extent permitted by applicable law, the Website
              and its content are provided on an "as available" basis. We do
              not guarantee that the Website will always operate without
              interruption, all information will always be error-free, every
              Product will remain continuously available, Product results will
              be identical for every individual, or third-party services will
              always operate without interruption.
            </p>

            <p>
              Nothing in these Terms excludes any statutory warranty, consumer
              right or legal protection that cannot lawfully be excluded.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              21. LIMITATION OF LIABILITY
            </h2>

            <p>
              To the maximum extent permitted by applicable law, Amroha
              Pharmacy shall not be liable for indirect, incidental, special,
              consequential or purely economic losses arising from Website use
              or Product purchase where such liability may lawfully be
              excluded. Without prejudice to statutory consumer rights, our
              liability shall, where legally permissible, be limited to the
              direct loss actually attributable to the relevant transaction.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              22. INDEMNIFICATION
            </h2>

            <p>
              To the extent permitted by applicable law, you agree to indemnify
              and hold harmless Amroha Pharmacy, its proprietor/management,
              employees and service providers from claims, losses, liabilities,
              damages, costs and expenses arising directly from your unlawful
              use of the Website, fraudulent activity, intentional misuse of
              the Website, violation of these Terms, infringement of
              third-party rights, submission of false information, or misuse of
              another person's account or payment instrument.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              23. FORCE MAJEURE
            </h2>

            <p>
              Neither party shall be liable for failure or delay in performance
              of obligations under these Terms to the extent caused by events
              beyond reasonable control, including natural disasters,
              pandemics, government restrictions, strikes, war, civil unrest,
              cyber incidents or failures of essential infrastructure.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              24. MODIFICATIONS TO THESE TERMS
            </h2>

            <p>
              We reserve the right to update, modify or replace these Terms at
              any time. The updated version shall be published on the Website
              with a revised "Last Updated" date. Continued use of the Website
              after such publication constitutes acceptance of the updated
              Terms.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              25. GRIEVANCE REDRESSAL
            </h2>

            <p>
              In accordance with applicable law, the contact details of the
              Grievance Officer are as follows:
            </p>

            <p>
              Name: Umar Imam
              <br />
              Email: Amrohapharmastore@gmail.com
              <br />
              Phone: +91 80779 88509
              <br />
              Address: Mohalla Nal, Amroha, Uttar Pradesh, India
            </p>

            <p>
              We shall endeavour to acknowledge and resolve complaints within
              the timelines prescribed under applicable law.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              26. GOVERNING LAW AND JURISDICTION
            </h2>

            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of India. Subject to applicable law, the courts at
              Amroha, Uttar Pradesh shall have exclusive jurisdiction over
              disputes arising out of or in connection with these Terms.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              27. SEVERABILITY
            </h2>

            <p>
              If any provision of these Terms is held to be invalid, illegal or
              unenforceable, the remaining provisions shall continue in full
              force and effect to the extent permitted by applicable law.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              28. CONTACT US
            </h2>

            <p>
              For any questions, concerns or requests relating to these Terms,
              you may contact us at:
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
