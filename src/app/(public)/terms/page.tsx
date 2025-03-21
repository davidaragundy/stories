import { H1, H2, Muted, P } from "@/shared/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories | Terms and Conditions",
  description: "Stories Terms and Conditions",
};

export default function Terms() {
  return (
    <main className="p-10">
      <H1>Terms and Conditions</H1>

      <Muted>Effective Date: March 21, 2025</Muted>

      <P className="mb-6">
        Welcome to Stories, an open-source social media platform designed for
        sharing short-lived content. By accessing or using our application, you
        agree to comply with and be bound by the following Terms and Conditions.
        Please read them carefully.
      </P>

      <H2>1. Acceptance of Terms</H2>

      <P className="mb-6">
        By creating an account or using Stories, you agree to these Terms and
        Conditions and our Privacy Policy. If you do not agree with any part of
        these terms, you must not use our services.
      </P>

      <H2>2. User Account Responsibilities</H2>

      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          <b>Account Creation:</b> To access certain features, you must register
          for an account, providing accurate and complete information.
        </li>

        <li>
          <b>Account Security:</b> You are responsible for maintaining the
          confidentiality of your account credentials and for all activities
          under your account.
        </li>
      </ul>

      <H2>3. User-Generated Content</H2>

      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          <b>Content Ownership:</b> You retain ownership of the content you
          post. By posting, you grant Stories a worldwide, royalty-free license
          to use, display, and distribute your content within the app.
        </li>

        <li>
          <b>Content Guidelines:</b> You agree not to post content that is
          unlawful, harmful, abusive, or violates any third-party rights.
          Stories reserves the right to remove content that violates these
          guidelines.
        </li>

        <li>
          <b>Content Deletion:</b> All user-generated content is automatically
          deleted 24 hours after posting. This temporary nature is core to our
          platform&apos;s design.
        </li>
      </ul>

      <H2>4. Acceptable Use</H2>

      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>Violate any applicable laws or regulations.</li>

        <li>Infringe on the intellectual property rights of others.</li>

        <li>Transmit harmful or malicious software.</li>

        <li>
          Interfere with the operation of Stories or disrupt other users&apos;
          experience.
        </li>
      </ul>

      <H2>5. Termination of Account</H2>

      <P className="mb-6">
        Stories reserves the right to suspend or terminate your account if you
        violate these Terms and Conditions. Upon termination, your access to the
        app will be revoked, and your data may be deleted.
      </P>

      <H2>6. Disclaimers and Limitations of Liability</H2>

      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          <b>Service Availability:</b> While we strive for uninterrupted
          service, Stories does not guarantee continuous availability and may
          experience downtime.
        </li>

        <li>
          <b>Data Loss:</b> Given our content deletion policy, all
          user-generated content is deleted 24 hours after posting. We are not
          responsible for any loss of data.
        </li>

        <li>
          <b>Limitation of Liability:</b> To the fullest extent permitted by
          law, Stories disclaims liability for any indirect, incidental, or
          consequential damages arising from your use of the app.
        </li>
      </ul>

      <H2>7. Modifications to Terms</H2>

      <P className="mb-6">
        Stories may update these Terms and Conditions periodically. Users will
        be notified of significant changes through in-app notifications or other
        communication channels.
      </P>

      <H2>8. Governing Law</H2>

      <P className="mb-6">
        These Terms and Conditions are governed by the laws of Ecuador. Any
        disputes will be resolved in the competent courts of Ecuador.
      </P>

      <H2>9. Contact Information</H2>

      <P className="mb-6">
        For questions or concerns regarding these Terms and Conditions, please
        contact us at:
      </P>

      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          <b>Email</b> davidaragundy@outlook.com
        </li>
      </ul>

      <P className="mb-6">
        Thank you for being part of the Stories community. We aim to provide a
        unique and secure platform for sharing ephemeral content.
      </P>
    </main>
  );
}
