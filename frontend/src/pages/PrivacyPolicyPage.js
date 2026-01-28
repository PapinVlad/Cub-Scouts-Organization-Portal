"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import ScrollToTopButton from "../components/ScrollToTopButton"

const PrivacyPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-background-beige min-h-screen">
      <ScrollToTopButton />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-background-light rounded-lg shadow-md p-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-8 border-b border-border-light pb-4">
            Privacy Policy
          </h1>

          <div className="prose max-w-none text-text-primary">
            <p className="mb-4">Last updated: May 21, 2025</p>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">1. Introduction</h2>
            <p className="mb-4">
              Obanshire Cub Scouts ("we", "our", or "us") is committed to protecting the privacy of all individuals who
              use our website and services. This Privacy Policy explains how we collect, use, and safeguard your
              information when you visit our website or use our services.
            </p>
            <p className="mb-4">
              We take the protection of children's privacy very seriously. Our services are designed for children aged
              8-10 and their parents/guardians, and we comply with all applicable laws regarding children's privacy.
            </p>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-heading font-semibold text-secondary-light mt-6 mb-3">
              2.1 Information You Provide to Us
            </h3>
            <p className="mb-4">
              We may collect the following types of information when you register, use our services, or communicate with
              us:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Personal information such as name, email address, and contact details</li>
              <li>
                For children under 13, we collect only limited information necessary for participation in our
                activities, and only with verifiable parental consent
              </li>
              <li>Emergency contact information</li>
              <li>Health information relevant to participation in scout activities</li>
              <li>Photos and videos from scout events (with appropriate consent)</li>
              <li>Badge progress and achievement information</li>
            </ul>

            <h3 className="text-xl font-heading font-semibold text-secondary-light mt-6 mb-3">
              2.2 Information Collected Automatically
            </h3>
            <p className="mb-4">
              When you visit our website, we may automatically collect certain information about your device and usage,
              including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on those pages</li>
              <li>Referring website or source</li>
              <li>Cookies and similar technologies (as described in our Cookie Policy)</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="mb-4">We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>To provide and maintain our services</li>
              <li>To process and manage scout registrations and event participation</li>
              <li>To track badge progress and achievements</li>
              <li>To communicate with parents/guardians about scout activities</li>
              <li>To ensure the safety and wellbeing of children during scout activities</li>
              <li>To improve our website and services</li>
              <li>To respond to your inquiries and provide support</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">4. Sharing of Information</h2>
            <p className="mb-4">We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>With scout leaders and helpers who need the information to organize and run activities</li>
              <li>With the national scouting organization for registration and insurance purposes</li>
              <li>With service providers who help us operate our website and services</li>
              <li>When required by law or to protect our rights</li>
              <li>In the event of an emergency, with medical professionals or emergency services</li>
            </ul>
            <p className="mb-4">We will never sell your personal information to third parties.</p>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">5. Children's Privacy</h2>
            <p className="mb-4">
              Our services are designed for children aged 8-10, and we are committed to protecting children's privacy in
              compliance with applicable laws.
            </p>
            <p className="mb-4">
              We require verifiable parental consent before collecting any personal information from children under 13.
              Parents/guardians have the right to review their child's information, request deletion, and refuse further
              collection or use of their child's information.
            </p>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">6. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission
              over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">7. Data Retention</h2>
            <p className="mb-4">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this
              Privacy Policy, unless a longer retention period is required or permitted by law. When determining how
              long to keep your information, we consider the amount, nature, and sensitivity of the information, the
              potential risk of harm from unauthorized use or disclosure, and the purposes for which we process the
              information.
            </p>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">8. Your Rights</h2>
            <p className="mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate or incomplete information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to restrict or object to processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p className="mb-4">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section
              below.
            </p>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">
              9. Changes to This Privacy Policy
            </h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other
              operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy
              Policy periodically.
            </p>

            <h2 className="text-2xl font-heading font-semibold text-secondary mt-8 mb-4">10. Contact Us</h2>
            <p className="mb-4">
              If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact
              us at:
            </p>
            <address className="not-italic mb-6">
              <p>Obanshire Scout Hall</p>
              <p>123 Scout Road</p>
              <p>Obanshire, OB1 2CD</p>
              <p>United Kingdom</p>
              <p>
                Email:{" "}
                <a href="mailto:privacy@obanshirecubscouts.org" className="text-primary hover:text-primary-dark">
                  privacy@obanshirecubscouts.org
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

export default PrivacyPolicyPage
