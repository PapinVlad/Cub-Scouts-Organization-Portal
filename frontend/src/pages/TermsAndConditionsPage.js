"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import ScrollToTopButton from "../components/ScrollToTopButton"

const TermsAndConditionsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-background-beige min-h-screen">
      <ScrollToTopButton />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-background-light rounded-lg shadow-md p-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-8 border-b border-border-light pb-4">
            Terms & Conditions
          </h1>

          <div className="prose max-w-none text-text-primary">
            <p className="mb-4">Last updated: May 21, 2025</p>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to the Obanshire Cub Scouts website. These Terms and Conditions govern your use of our website and
              services, including participation in scout activities, events, and programs.
            </p>
            <p className="mb-4">
              By accessing our website or participating in our activities, you agree to be bound by these Terms and
              Conditions. If you disagree with any part of these terms, please do not use our website or services.
            </p>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>"We", "Our", "Us"</strong> refers to Obanshire Cub Scouts
              </li>
              <li>
                <strong>"Website"</strong> refers to the website located at www.obanshirecubscouts.org
              </li>
              <li>
                <strong>"Services"</strong> refers to all activities, events, programs, and digital services provided by
                Obanshire Cub Scouts
              </li>
              <li>
                <strong>"User", "You", "Your"</strong> refers to the person accessing the website or participating in
                our services
              </li>
              <li>
                <strong>"Scout"</strong> refers to a child aged 8-10 who is registered with Obanshire Cub Scouts
              </li>
              <li>
                <strong>"Parent/Guardian"</strong> refers to the legal parent or guardian of a Scout
              </li>
              <li>
                <strong>"Leader"</strong> refers to an adult volunteer who leads scout activities
              </li>
              <li>
                <strong>"Helper"</strong> refers to an adult volunteer who assists with scout activities
              </li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">3. Website Use</h2>

            <h3 className="text-xl font-heading font-semibold text-secondary-light mt-6 mb-3">
              3.1 Account Registration
            </h3>
            <p className="mb-4">
              To access certain features of our website, you may need to register for an account. You agree to provide
              accurate, current, and complete information during the registration process and to update such information
              to keep it accurate, current, and complete.
            </p>
            <p className="mb-4">
              For accounts created for children under 13, we require verifiable parental consent in accordance with
              applicable laws.
            </p>

            <h3 className="text-xl font-heading font-semibold text-secondary-light mt-6 mb-3">3.2 Account Security</h3>
            <p className="mb-4">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities
              that occur under your account. You agree to notify us immediately of any unauthorized use of your account
              or any other breach of security.
            </p>

            <h3 className="text-xl font-heading font-semibold text-secondary-light mt-6 mb-3">3.3 Acceptable Use</h3>
            <p className="mb-4">
              You agree not to use our website or services for any purpose that is unlawful or prohibited by these Terms
              and Conditions. Prohibited activities include, but are not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Harassing, abusing, or threatening others</li>
              <li>Posting or sharing inappropriate, offensive, or harmful content</li>
              <li>Attempting to gain unauthorized access to our systems or user accounts</li>
              <li>Using our website or services to distribute malware or other harmful code</li>
              <li>Impersonating another person or entity</li>
              <li>Interfering with the proper functioning of the website</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">
              4. Scout Activities and Events
            </h2>

            <h3 className="text-xl font-heading font-semibold text-secondary-light mt-6 mb-3">
              4.1 Registration and Participation
            </h3>
            <p className="mb-4">
              Participation in scout activities and events requires registration and, in some cases, payment of fees. By
              registering a child for our activities, you confirm that:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                You are the legal parent or guardian of the child, or have the authority to act on behalf of the parent
                or guardian
              </li>
              <li>The information provided during registration is accurate and complete</li>
              <li>
                You and your child will comply with all rules, guidelines, and instructions provided by scout leaders
              </li>
            </ul>

            <h3 className="text-xl font-heading font-semibold text-secondary-light mt-6 mb-3">4.2 Health and Safety</h3>
            <p className="mb-4">
              You agree to provide accurate health information for your child and to update this information promptly if
              there are any changes. This information is essential for ensuring the safety and wellbeing of your child
              during scout activities.
            </p>
            <p className="mb-4">
              You acknowledge that participation in scout activities involves certain risks, and you agree to follow all
              safety guidelines and instructions provided by scout leaders.
            </p>

            <h3 className="text-xl font-heading font-semibold text-secondary-light mt-6 mb-3">4.3 Code of Conduct</h3>
            <p className="mb-4">
              All participants in scout activities, including scouts, parents/guardians, leaders, and helpers, are
              expected to adhere to our Code of Conduct, which promotes respect, kindness, inclusivity, and safety.
            </p>
            <p className="mb-4">
              We reserve the right to refuse participation or to remove any individual from activities who violates our
              Code of Conduct or whose behavior poses a risk to themselves or others.
            </p>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">5. Intellectual Property</h2>
            <p className="mb-4">
              All content on our website, including text, graphics, logos, images, audio, video, and software, is the
              property of Obanshire Cub Scouts or our licensors and is protected by copyright, trademark, and other
              intellectual property laws.
            </p>
            <p className="mb-4">
              You may access and use our content for personal, non-commercial purposes related to your participation in
              scout activities. Any other use, including reproduction, modification, distribution, or republication,
              without our prior written consent, is strictly prohibited.
            </p>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">6. User Content</h2>
            <p className="mb-4">
              Our website may allow you to post, upload, or share content, such as photos, comments, or messages ("User
              Content"). By submitting User Content, you:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                Grant us a non-exclusive, royalty-free, worldwide license to use, store, display, reproduce, modify, and
                distribute your User Content in connection with our services
              </li>
              <li>
                Represent and warrant that you own or have the necessary rights to your User Content and that it does
                not violate the rights of any third party
              </li>
              <li>
                Agree not to post or share content that is illegal, harmful, threatening, abusive, harassing,
                defamatory, or otherwise objectionable
              </li>
            </ul>
            <p className="mb-4">
              We reserve the right to remove any User Content that violates these Terms and Conditions or that we deem
              inappropriate.
            </p>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">7. Photography and Media</h2>
            <p className="mb-4">
              During scout activities and events, photographs and videos may be taken for promotional, educational, or
              documentary purposes. By participating in our activities, you consent to the use of your image and/or your
              child's image in such media, unless you have explicitly opted out by notifying us in writing.
            </p>
            <p className="mb-4">
              We will always use such media responsibly and in accordance with our safeguarding policies and applicable
              laws.
            </p>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">8. Limitation of Liability</h2>
            <p className="mb-4">
              To the fullest extent permitted by law, Obanshire Cub Scouts shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether
              incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting
              from:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Your use of or inability to use our website or services</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
              <li>Any interruption or cessation of transmission to or from our website</li>
              <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through our website</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">9. Indemnification</h2>
            <p className="mb-4">
              You agree to defend, indemnify, and hold harmless Obanshire Cub Scouts, our officers, directors,
              employees, and agents from and against any and all claims, damages, obligations, losses, liabilities,
              costs or debt, and expenses arising from your use of our website or services, your violation of these
              Terms and Conditions, or your violation of any rights of another.
            </p>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">10. Changes to These Terms</h2>
            <p className="mb-4">
              We may update these Terms and Conditions from time to time to reflect changes in our practices or for
              other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the
              new Terms and Conditions on this page and updating the "Last updated" date. Your continued use of our
              website or services after such changes constitutes your acceptance of the new Terms and Conditions.
            </p>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">11. Governing Law</h2>
            <p className="mb-4">
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the United
              Kingdom, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">12. Contact Us</h2>
            <p className="mb-4">
              If you have any questions or concerns about these Terms and Conditions, please contact us at:
            </p>
            <address className="not-italic mb-6">
              <p>Obanshire Scout Hall</p>
              <p>123 Scout Road</p>
              <p>Obanshire, OB1 2CD</p>
              <p>United Kingdom</p>
              <p>
                Email:{" "}
                <a href="mailto:info@obanshirecubscouts.org" className="text-primary hover:text-primary-dark">
                  info@obanshirecubscouts.org
                </a>
              </p>
              <p>Phone: +44 (0) 1234 567890</p>
            </address>
          </div>

          <div className="mt-12 pt-6 border-t border-border-light">
            <Link
              to="/"
              className="inline-flex items-center text-primary hover:text-primary-dark transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditionsPage
