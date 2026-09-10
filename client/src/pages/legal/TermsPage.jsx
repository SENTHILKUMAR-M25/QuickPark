import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp, FileText, ShieldCheck, Mail, MapPin, Phone, Globe } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { EASE } from "../../lib/motion";

const COMPANY = {
  name: "[Company Name]",
  supportEmail: "[support@quickpark.app]",
  phone: "[+91-XXXXXXXXXX]",
  address: "[Registered Address, India]",
  website: "[Website URL]",
  city: "[City, State]",
};

const EFFECTIVE_DATE = "[Insert Effective Date]";
const LAST_UPDATED = "[Insert Last Updated Date]";

const SECTIONS = [
  {
    no: 1,
    id: "acceptance",
    title: "Acceptance of Terms",
    body: [
      "These Terms and Conditions (\u201cTerms\u201d) govern your access to and use of the Quick Park platform, including our website, mobile application, and related services (together, the \u201cPlatform\u201d). The Platform is operated by " +
        COMPANY.name +
        " (\u201cQuick Park\u201d, \u201cwe\u201d, \u201cus\u201d, or \u201cour\u201d), a company incorporated under the laws of India.",
      "By registering on the Platform, creating an account, or using any part of the Platform, you confirm that you have read, understood, and agreed to be bound by these Terms, along with our Privacy Policy and any other policies published on the Platform.",
      "If you do not agree with any part of these Terms, you must stop using the Platform immediately. Your continued use of the Platform after any update to these Terms will be treated as your acceptance of the updated Terms.",
    ],
  },
  {
    no: 2,
    id: "definitions",
    title: "Definitions",
    body: [
      "In these Terms, the following words have the meanings given below unless the context clearly says otherwise:",
      {
        type: "ul",
        items: [
          "\u201cPlatform\u201d \u2014 the Quick Park website, mobile application, and all related services, tools, and content.",
          "\u201cUser\u201d \u2014 any person who registers on the Platform to find, book, or pay for parking, including drivers and their authorised vehicle users.",
          "\u201cProvider\u201d \u2014 any person or entity that registers on the Platform to list, rent, or offer parking space.",
          "\u201cBooking\u201d \u2014 a confirmed reservation of a Parking Space for a specific date and time period.",
          "\u201cParking Space\u201d \u2014 any parking bay, slot, driveway, garage, or area listed on the Platform by a Provider.",
          "\u201cWallet\u201d \u2014 the stored-value account on the Platform that holds funds for payments and refunds.",
          "\u201cPayment Method\u201d \u2014 UPI, credit/debit cards, net banking, Wallet, or any other payment mode accepted on the Platform.",
          "\u201cCancellation\u201d \u2014 the process of withdrawing a Booking before its scheduled slot time.",
          "\u201cCommission\u201d or \u201cService Fee\u201d \u2014 the fee Quick Park charges for connecting Users and Providers, calculated as a percentage of the booking value or a fixed amount, as displayed at the time of booking.",
          "\u201cListing\u201d \u2014 the published details of a Parking Space, including location, price, hours, and vehicle types.",
        ],
      },
    ],
  },
  {
    no: 3,
    id: "eligibility",
    title: "Eligibility",
    body: [
      "To use the Platform, you must be at least 18 years old and have the legal capacity to enter into a binding contract under Indian law.",
      "You must provide accurate, current, and complete information during registration, including a valid mobile number, email address, and any identity or vehicle documents we reasonably request.",
      "Each account is personal to you and must not be shared, sold, or transferred. You are responsible for all activity carried out on your account.",
      "Quick Park reserves the right to refuse registration, verify documents, or close accounts at any time if we reasonably believe a person is not eligible to use the Platform.",
    ],
  },
  {
    no: 4,
    id: "user-responsibilities",
    title: "User Responsibilities",
    body: [
      "As a User, you agree to:",
      {
        type: "ul",
        items: [
          "Provide accurate account, contact, and payment details and keep them up to date.",
          "Use only validly registered vehicles that match the vehicle type selected in your Booking.",
          "Arrive within the booked slot window and leave the Parking Space on time.",
          "Comply with the Provider\u2019s reasonable instructions and any rules displayed at the Parking Space.",
          "Follow all applicable traffic, parking, and road-safety laws.",
          "Keep your login credentials and payment details secure and confidential.",
          "Not resell, transfer, or sublet a confirmed Booking without prior written consent from Quick Park.",
          "Leave genuine, honest ratings and reviews based on your own experience.",
        ],
      },
      "You are solely responsible for your vehicle, its contents, and any damage you cause while using a Parking Space, unless the Provider or Quick Park is at fault under law.",
    ],
  },
  {
    no: 5,
    id: "provider-responsibilities",
    title: "Provider Responsibilities",
    body: [
      "As a Provider, you agree to:",
      {
        type: "ul",
        items: [
          "Provide accurate details for every Listing, including location, size, hours, pricing, and accepted vehicle types.",
          "Maintain your Parking Space in a safe, clean, and usable condition.",
          "Honour every confirmed Booking without unjustified cancellation.",
          "Keep your availability and pricing updated so Users are never misled.",
          "Comply with all local zoning, land-use, safety, and tax obligations applicable to renting out parking space.",
          "Complete identity and space verification steps as and when requested by Quick Park.",
          "Respond promptly to support requests and resolve issues with Users in good faith.",
          "Not create duplicate, misleading, or fake Listings.",
        ],
      },
      "Providers are independent operators. Quick Park does not employ, manage, or supervise Providers, and nothing in these Terms creates an employment, partnership, or agency relationship between a Provider and Quick Park.",
    ],
  },
  {
    no: 6,
    id: "listings",
    title: "Parking Listings",
    body: [
      "Quick Park is a technology marketplace. It connects Users with Providers and does not own, operate, or control the Parking Spaces listed on the Platform, unless a Listing is expressly identified as operated by Quick Park.",
      "Providers are responsible for the accuracy, quality, and legality of their Listings. Quick Park may verify the GPS location and identity documents of a Provider, but such verification is a best-effort check and does not guarantee the condition or availability of any Parking Space.",
      "Quick Park may reject, remove, or hide any Listing that we reasonably believe is inaccurate, unlawful, unsafe, or inconsistent with these Terms. We may also suspend or terminate the account of a Provider who repeatedly lists such spaces.",
      "Prices, photos, and availability shown on a Listing are set by the Provider and may change at any time. A Booking is not valid until it is confirmed through the Platform as described in Section 7.",
    ],
  },
  {
    no: 7,
    id: "booking-policy",
    title: "Booking Policy",
    body: [
      "A Booking is confirmed when (a) the User has selected a valid slot and either completed payment or chosen Pay-at-Spot where offered, and (b) the Platform has issued a confirmation with a Booking ID.",
      "On arrival, Users must check in using the QR code or OTP generated in the app. The check-in details are the evidence that the Parking Space was used.",
      "Users should arrive within the booked slot window. Late arrival does not extend the Booking end time unless the Provider agrees.",
      "If a User fails to arrive without cancelling, the Booking is treated as a no-show and governed by the Cancellation and Refund policy in Section 9.",
      "Overstaying beyond the booked end time may result in additional charges, which the Provider or Quick Park may recover through the User\u2019s saved Payment Method or Wallet balance.",
    ],
  },
  {
    no: 8,
    id: "payments",
    title: "Payments",
    body: [
      "All payments on the Platform are processed in Indian Rupees (INR). Depending on the Listing, Users may pay using UPI, credit/debit cards, net banking, or their Quick Park Wallet.",
      "For Wallet bookings, the booking amount is debited from the Wallet at the time of confirmation. For Pay-at-Spot bookings, the payment is collected at the Parking Space as agreed between the User and Provider.",
      "Booking prices may include applicable taxes, including GST, where required by law. Any Commission or Service Fee charged by Quick Park will be shown before you confirm your payment.",
      "If a payment fails, the Booking will not be confirmed and no charge will be applied. If you are charged but a Booking is not confirmed, we will reverse the transaction within a reasonable time.",
      "Quick Park uses secure, PCI-compliant payment gateways. You authorise us to store and use your payment information to process transactions and refunds in accordance with our Privacy Policy.",
      "Quick Park reserves the right to add, change, or remove payment methods and to introduce or adjust Commissions with reasonable prior notice, as permitted by applicable law.",
    ],
  },
  {
    no: 9,
    id: "cancellation-refund",
    title: "Cancellation & Refund",
    body: [
      {
        type: "ul",
        items: [
          "A User may cancel a Booking up to 15 minutes before the scheduled slot start time and receive a full refund to the original Payment Method or Wallet.",
          "Cancellations made after the 15-minute window, or no-shows, may not be eligible for a refund, and a portion of the booking amount may be forfeited as determined by the Provider\u2019s policy as shown at the time of booking.",
          "If a Provider cancels a confirmed Booking, the User is entitled to a full refund, and Quick Park will use reasonable efforts to help the User find an alternative Parking Space.",
          "Refunds are processed through the same Payment Method used for the Booking or to the Wallet, and are completed within a reasonable time depending on the payment partner (typically 3\u20137 business days).",
          "Pay-at-Spot Bookings are subject to the refund terms agreed directly with the Provider at the Parking Space.",
        ],
      },
      "Refunds are not an admission of liability. Your statutory rights under applicable Indian law are not affected by this policy.",
    ],
  },
  {
    no: 10,
    id: "provider-earnings",
    title: "Provider Earnings",
    body: [
      "Providers earn the net amount from completed Bookings after deducting Quick Park\u2019s Commission and any applicable taxes. The applicable Commission is displayed to the Provider before a Listing goes live.",
      "Payouts are processed on the payout schedule published in the Provider dashboard, typically within a set number of business days after a Booking is completed. Payouts are made to the bank account registered by the Provider.",
      "A Booking is considered completed once the slot time has passed and no unresolved dispute has been raised. If a Booking is refunded to the User, the corresponding payout is reversed.",
      "Providers are responsible for declaring their earnings and paying all applicable income tax, GST, and other statutory dues. Quick Park may deduct or withhold tax (including TDS) where required by law and will provide tax documents as applicable.",
    ],
  },
  {
    no: 11,
    id: "ratings-reviews",
    title: "Ratings & Reviews",
    body: [
      "After a Booking, Users and Providers may rate and review each other. Reviews help maintain trust within the community.",
      "All ratings and reviews must be truthful, personal, and based on a genuine experience. You must not post content that is false, defamatory, obscene, or that contains personal data of another person.",
      "Fake, incentivised, or coerced reviews are strictly prohibited. Quick Park may remove any review and take action against the account if we reasonably believe it violates these Terms.",
      "Ratings and reviews reflect the opinion of the person who posted them and do not constitute an endorsement by Quick Park.",
    ],
  },
  {
    no: 12,
    id: "prohibited-activities",
    title: "Prohibited Activities",
    body: [
      "You agree not to use the Platform to:",
      {
        type: "ul",
        items: [
          "Violate any law, regulation, or court order applicable in India or your location.",
          "Create fake accounts, fake Listings, or fraudulent Bookings.",
          "Manipulate pricing, availability, ratings, or payments to avoid Commissions.",
          "Access, scrape, or copy the Platform or its data through automated or unauthorised means.",
          "Attempt to breach, interfere with, or compromise the security of the Platform, its servers, or other users\u2019 accounts.",
          "Harass, threaten, abuse, or invade the privacy of any person.",
          "Use the Platform for any unlawful, harmful, or unethical purpose, including money laundering or terrorism financing.",
          "Reverse engineer, decompile, or tamper with any part of the Platform software.",
        ],
      },
      "We may investigate any suspected violation and cooperate with law enforcement as appropriate.",
    ],
  },
  {
    no: 13,
    id: "intellectual-property",
    title: "Intellectual Property",
    body: [
      "The Quick Park name, logo, software, designs, text, graphics, and all other content on the Platform are owned by Quick Park or its licensors and are protected by Indian and international intellectual property laws.",
      "We grant you a limited, non-exclusive, non-transferable, revocable licence to use the Platform for your personal use in accordance with these Terms. You may not copy, modify, distribute, or create derivative works from any part of the Platform without our prior written consent.",
      "Providers retain ownership of the content they upload, but grant Quick Park a worldwide, royalty-free licence to host, display, and distribute that content as needed to operate and promote the Platform.",
      "Any unsolicited ideas or feedback you submit to us may be used by Quick Park freely, without any obligation or compensation to you.",
    ],
  },
  {
    no: 14,
    id: "privacy",
    title: "Privacy",
    body: [
      "Your privacy matters to us. The collection, storage, and use of your personal data is governed by our Privacy Policy and applicable Indian data protection laws, including the Digital Personal Data Protection Act, 2023 (as amended from time to time).",
      "By using the Platform, you consent to the collection and processing of your personal data, including identity documents, contact details, location data, and payment information, for the purposes described in our Privacy Policy.",
      "We implement reasonable technical and organisational measures to protect your data. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
      "We do not sell your personal data. We may share limited data with Providers and payment partners only to the extent necessary to provide the service, and with government authorities as required by law.",
    ],
  },
  {
    no: 15,
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    body: [
      "To the maximum extent permitted by law, Quick Park\u2019s total liability to you arising from or in connection with these Terms or your use of the Platform shall not exceed the total amount of Commission or Service Fees actually received by Quick Park from you in the three (3) months preceding the event giving rise to the claim.",
      "The Platform is provided on an \u201cas is\u201d and \u201cas available\u201d basis. We do not warrant that the Platform will be uninterrupted, error-free, or free of harmful components, and we make no warranties regarding the availability, condition, or safety of any Parking Space.",
      "Quick Park is a marketplace intermediary and shall not be liable for the acts or omissions of Users or Providers, including damage to or loss of vehicles, injury, theft, or disputes arising directly between Users and Providers.",
      "To the maximum extent permitted by law, Quick Park shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for loss of profits, revenue, data, or goodwill.",
      "Nothing in these Terms limits or excludes liability that cannot be limited or excluded under applicable Indian law.",
    ],
  },
  {
    no: 16,
    id: "suspension-termination",
    title: "Account Suspension & Termination",
    body: [
      "We may suspend, restrict, or terminate your account or access to the Platform, in whole or in part, at any time and without prior notice if we reasonably believe you have violated these Terms, engaged in fraud, or acted in a way that harms the Platform or other users.",
      "You may close your account at any time from the settings page or by contacting us. Pending Bookings, payments, and payouts will be settled in accordance with these Terms before your account is closed.",
      "Upon termination, your licence to use the Platform ends immediately. Sections that by their nature should survive termination (including Intellectual Property, Limitation of Liability, Governing Law, and Dispute Resolution) will continue to apply.",
      "Termination does not affect any rights or obligations that accrued before the date of termination.",
    ],
  },
  {
    no: 17,
    id: "dispute-resolution",
    title: "Dispute Resolution",
    body: [
      "We encourage you to resolve concerns amicably. Before initiating any formal proceeding, you agree to first contact our support team at " +
        COMPANY.supportEmail +
        " and give us a reasonable opportunity (typically 15 business days) to resolve the issue.",
      "If a dispute cannot be resolved amicably, it shall be referred to and finally resolved by a sole arbitrator appointed under the Arbitration and Conciliation Act, 1996. The arbitration shall be conducted in English in " +
        COMPANY.city +
        " and the award shall be final and binding on both parties.",
      "For urgent relief, including injunctive orders to protect confidential information or intellectual property, either party may approach the courts of competent jurisdiction in " +
        COMPANY.city +
        ".",
      "Class actions and collective arbitration are not permitted under these Terms.",
    ],
  },
  {
    no: 18,
    id: "governing-law",
    title: "Governing Law",
    body: [
      "These Terms, and any disputes arising out of or in connection with them, shall be governed by and construed in accordance with the laws of India.",
      "Subject to Section 17, the courts at " +
        COMPANY.city +
        " shall have exclusive jurisdiction over any disputes, claims, or proceedings arising under these Terms.",
    ],
  },
  {
    no: 19,
    id: "changes-to-terms",
    title: "Changes to Terms",
    body: [
      "We may update or revise these Terms from time to time to reflect changes in our services, technology, or legal requirements. The date of the latest revision will be shown at the top of this page as \u201cLast Updated\u201d.",
      "For material changes, we will make reasonable efforts to notify you by email or through a notice on the Platform before the change takes effect.",
      "Your continued use of the Platform after the effective date of any change constitutes your acceptance of the revised Terms. If you do not agree with the revised Terms, you should stop using the Platform and close your account.",
    ],
  },
  {
    no: 20,
    id: "contact",
    title: "Contact",
    body: [
      "If you have any questions, concerns, or complaints about these Terms or the Platform, you may reach us using the details below. We aim to respond to all genuine complaints within a reasonable time.",
    ],
  },
];

const SECTION_META = [
  { no: 1, id: "acceptance", label: "Acceptance of Terms" },
  { no: 2, id: "definitions", label: "Definitions" },
  { no: 3, id: "eligibility", label: "Eligibility" },
  { no: 4, id: "user-responsibilities", label: "User Responsibilities" },
  { no: 5, id: "provider-responsibilities", label: "Provider Responsibilities" },
  { no: 6, id: "listings", label: "Parking Listings" },
  { no: 7, id: "booking-policy", label: "Booking Policy" },
  { no: 8, id: "payments", label: "Payments" },
  { no: 9, id: "cancellation-refund", label: "Cancellation & Refund" },
  { no: 10, id: "provider-earnings", label: "Provider Earnings" },
  { no: 11, id: "ratings-reviews", label: "Ratings & Reviews" },
  { no: 12, id: "prohibited-activities", label: "Prohibited Activities" },
  { no: 13, id: "intellectual-property", label: "Intellectual Property" },
  { no: 14, id: "privacy", label: "Privacy" },
  { no: 15, id: "limitation-of-liability", label: "Limitation of Liability" },
  { no: 16, id: "suspension-termination", label: "Account Suspension & Termination" },
  { no: 17, id: "dispute-resolution", label: "Dispute Resolution" },
  { no: 18, id: "governing-law", label: "Governing Law" },
  { no: 19, id: "changes-to-terms", label: "Changes to Terms" },
  { no: 20, id: "contact", label: "Contact" },
];

const CONTACT_CARDS = [
  {
    icon: Mail,
    label: "Support Email",
    value: COMPANY.supportEmail,
    href: "mailto:" + COMPANY.supportEmail,
    tone: "brand",
  },
  {
    icon: Phone,
    label: "Phone",
    value: COMPANY.phone,
    href: "tel:" + COMPANY.phone,
    tone: "mint",
  },
  {
    icon: MapPin,
    label: "Registered Address",
    value: COMPANY.address,
    href: undefined,
    tone: "ember",
  },
  {
    icon: Globe,
    label: "Website",
    value: COMPANY.website,
    href: undefined,
    tone: "brand",
  },
];

const TONES = {
  brand: { chip: "bg-brand-50 text-brand-600", glow: "hover:shadow-glow" },
  mint: { chip: "bg-mint-50 text-mint-600", glow: "hover:shadow-glow-mint" },
  ember: { chip: "bg-ember-50 text-ember-600", glow: "hover:shadow-glow-ember" },
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function Block({ block }) {
  if (typeof block === "string") {
    return <p className="text-[15px] leading-relaxed text-slate-600">{block}</p>;
  }
  if (block.type === "ul") {
    return (
      <ul className="space-y-2.5">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-600">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-brand-500 to-brand-700" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return null;
}

function SectionCard({ section, i }) {
  return (
    <motion.article
      id={section.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: (i % 4) * 0.05, ease: EASE }}
      className="scroll-mt-28 rounded-3xl border border-slate-100 bg-white p-6 shadow-card sm:p-9"
    >
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 font-display text-lg font-extrabold text-white shadow-glow">
          {section.no}
        </span>
        <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
          {section.title}
        </h2>
      </div>
      <div className="mt-6 space-y-4">
        {section.body.map((block, b) => (
          <Block key={b} block={block} />
        ))}
      </div>
    </motion.article>
  );
}

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#fbfcfe]">
      <Navbar />

      {/* Hero */}
      <header className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-brand-50/80 via-white to-[#fbfcfe]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-100/50 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-mint-100/50 blur-3xl" />
          <div className="absolute inset-0 bg-grid opacity-[0.05]" />
        </div>

        <div className="container-x relative py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-600 shadow-card">
              <FileText size={14} />
              Legal
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Terms & <span className="text-gradient">Conditions</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-500 sm:text-lg">
              These Terms form a legally binding agreement between you and {COMPANY.name} for
              your use of the Quick Park platform. Please read them carefully before using
              our services.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-card">
                <span className="h-2 w-2 rounded-full bg-mint-500" />
                Effective Date: <span className="text-slate-500">{EFFECTIVE_DATE}</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-card">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                Last Updated: <span className="text-slate-500">{LAST_UPDATED}</span>
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Body */}
      <main id="main" className="container-x relative py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
          {/* Sticky TOC */}
          <nav aria-label="Table of contents" className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-slate-100 bg-white p-5 shadow-card">
              <p className="px-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Table of Contents
              </p>
              <ul className="mt-3 max-h-[65vh] space-y-1 overflow-y-auto pr-1">
                {SECTION_META.map((s) => (
                  <li key={s.id}>
                    <a
                      href={"#" + s.id}
                      className="group flex items-baseline gap-2 rounded-xl px-2 py-1.5 text-sm text-slate-500 transition-colors duration-200 hover:bg-brand-50 hover:text-brand-700"
                    >
                      <span className="font-display text-xs font-bold text-brand-500">{s.no}.</span>
                      <span className="leading-snug">{s.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <button
                onClick={scrollToTop}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-ink-800"
              >
                <ArrowUp size={15} />
                Back to top
              </button>
            </div>
          </nav>

          {/* Sections */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 px-5 py-4 text-sm leading-relaxed text-brand-900"
            >
              <ShieldCheck size={18} className="shrink-0 text-brand-600" />
              <p>
                Please read these Terms carefully before using Quick Park. If you are a
                Provider, these Terms apply to your Listings and earnings. For any
                clarification, contact us at {COMPANY.supportEmail}.
              </p>
            </motion.div>

            {SECTIONS.map((section, i) => (
              <SectionCard key={section.id} section={section} i={i} />
            ))}

            {/* Contact cards */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {CONTACT_CARDS.map((c) => {
                const tone = TONES[c.tone];
                const inner = (
                  <>
                    <span className={"grid h-11 w-11 shrink-0 place-items-center rounded-2xl " + tone.chip}>
                      <c.icon size={19} />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {c.label}
                      </span>
                      <span className="mt-0.5 block break-words text-sm font-semibold text-ink">
                        {c.value}
                      </span>
                    </span>
                  </>
                );
                return c.href ? (
                  <a
                    key={c.label}
                    href={c.href}
                    className={"group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift " + tone.glow}
                  >
                    {inner}
                  </a>
                ) : (
                  <div
                    key={c.label}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card"
                  >
                    {inner}
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-brand-50 to-mint-50 p-5 text-center ring-1 ring-brand-100/60">
              <p className="text-sm leading-relaxed text-ink">
                Still have questions? Write to us at{" "}
                <a
                  href={"mailto:" + COMPANY.supportEmail}
                  className="font-semibold text-brand-600 hover:underline"
                >
                  {COMPANY.supportEmail}
                </a>{" "}
                and our team will get back to you.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile back-to-top */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-glow transition hover:brightness-110 lg:hidden"
      >
        <ArrowUp size={20} />
      </button>

      <Footer />
    </div>
  );
}
