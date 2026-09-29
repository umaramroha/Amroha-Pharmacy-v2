import Link from "next/link";

export const metadata = {
  title: "Medical & Product Disclaimer - Amroha Pharmacy",
  description:
    "Medical and Product Disclaimer for products sold on Amroha Pharmacy.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <nav className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-700">
            Medical & Product Disclaimer
          </span>
        </nav>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Medical & Product Disclaimer
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Effective Date: 26/09/2026 | Last Updated: 26/09/2026
          </p>

          <div className="prose prose-sm md:prose-base max-w-none text-gray-700 space-y-6">
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="font-semibold text-red-900 mb-1">
                ⚠️ IMPORTANT NOTICE
              </p>
              <p className="text-sm text-red-800">
                The information provided on this Website is for general
                informational purposes only and does not constitute medical
                advice, diagnosis, treatment or prescription. Always consult a
                qualified healthcare professional before using any product,
                particularly if you are pregnant, breastfeeding, elderly,
                suffering from a medical condition or taking prescription
                medicines.
              </p>
            </div>

            <p>
              This Medical & Product Disclaimer ("Disclaimer") applies to all
              information, content, products and services made available
              through the Amroha Pharmacy website ("Website") operated under
              the name "Amroha Pharmacy" ("we", "us", "our" or "Seller"). This
              Disclaimer forms an integral part of, and should be read together
              with, our Terms & Conditions, Privacy Policy, Shipping & Delivery
              Policy and Cancellation, Return & Refund Policy.
            </p>

            <p>
              By accessing, browsing or purchasing through the Website, you
              acknowledge that you have read, understood and agreed to this
              Disclaimer.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              1. NO MEDICAL ADVICE
            </h2>

            <p>
              Nothing on this Website constitutes or should be construed as:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>medical advice;</li>
              <li>medical diagnosis;</li>
              <li>medical treatment;</li>
              <li>a prescription;</li>
              <li>a substitute for consultation with a qualified healthcare professional;</li>
              <li>a guarantee of therapeutic outcome;</li>
              <li>a recommendation for self-medication.</li>
            </ul>

            <p>
              The content on the Website, including product descriptions,
              ingredient information, traditional uses, wellness tips, blog
              articles and FAQs, is provided for general informational purposes
              only.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              2. CONSULT A QUALIFIED HEALTHCARE PROFESSIONAL
            </h2>

            <p>
              You should always consult a qualified healthcare professional
              (such as a registered medical practitioner, Ayurvedic
              practitioner, Unani practitioner or other licensed healthcare
              provider) before:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>starting, stopping or modifying any medication or treatment;</li>
              <li>using any product purchased through this Website;</li>
              <li>using any product if you are pregnant, planning to become pregnant, or breastfeeding;</li>
              <li>using any product if you are elderly or have pre-existing medical conditions;</li>
              <li>using any product if you are currently taking prescription medicines;</li>
              <li>using any product if you have known allergies, sensitivities or adverse reactions;</li>
              <li>using any product for children, infants or minors.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              3. PRODUCT INFORMATION AND TRADITIONAL USE
            </h2>

            <p>
              The products offered on the Website may include Ayurvedic, Unani,
              herbal, wellness, personal-care and other healthcare-related
              products.
            </p>

            <p>
              Certain products may be based on traditional formulations,
              traditional uses or classical texts. References to traditional
              uses, traditional benefits, or historical preparation methods do
              not constitute a representation that a product has been proven to
              cure, treat or prevent any specific disease or condition.
            </p>

            <p>
              Product information, ingredient details and descriptions have
              been sourced from the manufacturer, brand owner, packer,
              distributor or other lawful commercial sources, or have been
              prepared for general informational purposes. While we take
              reasonable care, we do not warrant that all such information is
              complete, accurate, current or error-free.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              4. NO GUARANTEED RESULTS
            </h2>

            <p>
              Individual responses to healthcare products, herbal preparations
              or wellness products can vary significantly. Results depend on
              multiple factors including, but not limited to:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>individual body constitution and physiology;</li>
              <li>underlying medical conditions;</li>
              <li>lifestyle, diet and daily habits;</li>
              <li>concurrent use of other medicines or supplements;</li>
              <li>duration and consistency of use;</li>
              <li>age, gender and other individual factors.</li>
            </ul>

            <p>
              No guarantee, warranty or representation is made that any product
              will produce a specific result, cure a specific condition, or be
              suitable for every individual. Any reference to traditional
              benefits or general wellness support does not constitute a
              guarantee of outcome.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              5. NOT A SUBSTITUTE FOR MEDICAL CARE
            </h2>

            <p>
              The products sold through the Website are not intended to
              replace professional medical advice, diagnosis or treatment.
              Products should not be used to:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>self-diagnose a medical condition;</li>
              <li>self-treat a serious or life-threatening condition;</li>
              <li>delay or avoid seeking professional medical care;</li>
              <li>replace prescribed medication without medical supervision.</li>
            </ul>

            <p>
              If you are currently on prescribed medication, do not stop,
              reduce, replace or modify such medication without the advice of
              your prescribing healthcare professional.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              6. REGULATORY AND STATUTORY COMPLIANCE
            </h2>

            <p>
              Sales of certain products, including medicines and healthcare
              products, are subject to applicable laws, rules and regulations
              including, but not limited to, the Drugs and Cosmetics Act, 1940
              and the rules framed thereunder, and other applicable Indian laws.
            </p>

            <p>
              Where a product is subject to any statutory restriction,
              prescription requirement, age restriction or other regulatory
              condition, the applicable legal requirement shall prevail. The
              Website shall not be interpreted as circumventing or overriding
              any such legal requirement.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              7. THIRD-PARTY MANUFACTURERS
            </h2>

            <p>
              Unless expressly stated otherwise, Amroha Pharmacy is not the
              manufacturer, formulator, packer, importer or original brand
              owner of the products offered for sale. Products are sourced from
              third-party manufacturers, brands, distributors, authorised
              suppliers or other lawful commercial sources.
            </p>

            <p>
              Manufacturer-specific information, including manufacturing
              process, formulation, composition, statutory manufacturing
              compliance and product-specific warnings, shall be as disclosed
              on the product packaging, product label or product listing, to
              the extent legally required.
            </p>

            <p>
              Where a product claim, defect or grievance relates to the
              manufacturing process, formulation or manufacturer-specific
              warranty, the same may involve the relevant manufacturer.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              8. INSPECT PRODUCT BEFORE USE
            </h2>

            <p>
              Customers are advised to carefully inspect the product packaging,
              product label, batch number, manufacturing date, expiry date,
              manufacturer information, dosage instructions and any other
              information supplied with the product before use.
            </p>

            <p>
              In case of any visible damage, tampering, expiry, missing
              information or inconsistency, the customer should not use the
              product and should contact customer support immediately.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              9. ALLERGIES AND ADVERSE REACTIONS
            </h2>

            <p>
              Some individuals may have allergies or sensitivities to certain
              ingredients or components of products. In case of any known
              allergy or sensitivity, please review the ingredient list and
              consult a qualified healthcare professional before use.
            </p>

            <p>
              If you experience any adverse reaction, allergic response or
              unusual symptom after using any product, please:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>immediately discontinue use of the product;</li>
              <li>seek prompt medical attention where necessary;</li>
              <li>inform customer support at the earliest with relevant details.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              10. INFORMATION ON THE WEBSITE
            </h2>

            <p>
              The Website may contain general informational content relating
              to health, wellness, Ayurveda, Unani, herbs, ingredients and
              traditional practices. Such content is provided for general
              informational purposes only and should not be relied upon for
              medical decision-making.
            </p>

            <p>
              Blog articles, wellness tips, product descriptions and FAQs are
              not a substitute for professional medical consultation. You
              should independently verify any information before relying upon
              it.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              11. MINORS
            </h2>

            <p>
              The Website is not intended for use by minors under the age of
              18 years. Products, health information and services offered
              through the Website are not intended for minors unless otherwise
              expressly stated and legally permissible. Where products are
              intended for minors, appropriate supervision by a parent or legal
              guardian and prior consultation with a qualified healthcare
              professional is strongly advised.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              12. LIMITATION OF LIABILITY
            </h2>

            <p>
              To the maximum extent permitted by applicable law, Amroha
              Pharmacy shall not be liable for any loss, injury, damage, adverse
              effect or claim arising from:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>use or misuse of any product;</li>
              <li>failure to consult a qualified healthcare professional;</li>
              <li>self-medication or self-diagnosis;</li>
              <li>failure to follow product label instructions;</li>
              <li>use contrary to applicable law or medical advice;</li>
              <li>reliance on general information provided on the Website;</li>
              <li>concurrent use of products with other medicines or supplements without medical advice.</li>
            </ul>

            <p>
              Nothing in this Disclaimer excludes or limits any liability that
              cannot lawfully be excluded or limited under applicable law,
              including statutory consumer rights.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              13. EMERGENCY
            </h2>

            <p>
              This Website is not intended for use in a medical emergency. In
              case of a medical emergency, please contact local emergency
              services or visit the nearest hospital immediately. Do not rely
              on the Website, our customer support or any content available on
              the Website for emergency medical assistance.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              14. CONTACT US
            </h2>

            <p>
              For any questions, concerns or clarifications relating to this
              Disclaimer, please contact:
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

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
              15. GOVERNING LAW
            </h2>

            <p>
              This Disclaimer shall be governed by and construed in accordance
              with the laws of India. Subject to applicable law, the courts at
              Amroha, Uttar Pradesh shall have jurisdiction over disputes
              arising out of or in connection with this Disclaimer.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
