import type { Metadata } from "next";

import { H1 } from "@/shared/components/ui/h1";
import { H2 } from "@/shared/components/ui/h2";
import { Muted } from "@/shared/components/ui/muted";
import { P } from "@/shared/components/ui/p";

export const metadata: Metadata = {
  title: "Stories | Privacy Policy",
  description: "Stories Privacy Policy",
};

export default function Privacy() {
  return (
    <main className="p-10">
      <H1>Privacy Policy</H1>

      <Muted>Effective Date: March 21, 2025</Muted>

      <P className="mb-6">
        At Stories, we value your privacy and are committed to protecting your
        personal information. This Privacy Policy outlines how we collect, use,
        and safeguard your data when you use our social media application.
      </P>

      <H2>1. Information We Collect</H2>

      <P className="mb-6">
        When you use Stories, we may collect the following types of information:
      </P>

      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          <b>Personal Information:</b> Details such as your name, email address,
          and profile information that you provide during account creation.
        </li>

        <li>
          <b>Usage Data:</b> Information about your interactions with the app,
          including posts, comments, and engagement metrics.
        </li>

        <li>
          <b>Device Information:</b> Data about the device you use to access
          Stories, such as IP address, browser type, and operating system.
        </li>
      </ul>

      <H2>2. Use of Information</H2>

      <P className="mb-6">
        We use the collected information for the following purposes:
      </P>

      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          Service Provision: To operate and maintain the Stories app, including
          displaying posts and facilitating interactions.
        </li>

        <li>
          Improvement of Services: To analyze usage patterns and enhance app
          functionality and user experience.
        </li>

        <li>
          Communication: To send updates, notifications, and respond to your
          inquiries.
        </li>
      </ul>

      <H2>3. Data Retention</H2>

      <P className="mb-6">
        In alignment with our commitment to user privacy, all user-generated
        content, including posts and comments, is automatically deleted 24 hours
        after posting. This ensures that your shared content is not stored
        indefinitely.
      </P>

      <H2>4. Sharing of Information</H2>

      <P className="mb-6">
        We do not sell, trade, or rent your personal information to third
        parties. However, we may share non-personal, aggregated data with
        partners to analyze trends and improve our services.
      </P>

      <H2>5. Security Measures</H2>

      <P className="mb-6">
        We implement industry-standard security protocols to protect your data
        from unauthorized access, alteration, or destruction. Despite our
        efforts, no method of electronic storage is entirely secure, and we
        cannot guarantee absolute security.
      </P>

      <H2>6. Your Rights</H2>

      <P className="mb-6">
        You have the right to access, correct, or delete your personal
        information stored with us. Given our data retention policy,
        user-generated content is deleted 24 hours after posting. To manage your
        account information or exercise your rights, please contact us at
        davidaragundy@outlook.com
      </P>

      <H2>7. Third-Party Links</H2>

      <P className="mb-6">
        Stories may contain links to external websites or services not operated
        by us. We are not responsible for the privacy practices of these third
        parties. We encourage you to review the privacy policies of any external
        sites you visit.
      </P>

      <H2>8. Changes to This Privacy Policy</H2>

      <P className="mb-6">
        We may update this Privacy Policy periodically to reflect changes in our
        practices or legal requirements. We will notify users of significant
        changes by posting the updated policy within the app or through other
        communication channels.
      </P>

      <H2>9. Contact Us</H2>

      <P className="mb-6">
        If you have any questions or concerns about this Privacy Policy, please
        contact us at:
      </P>

      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>Email: davidaragundy@outlook.com</li>
      </ul>

      <P className="mb-6">
        Thank you for trusting Stories with your personal information. We are
        dedicated to providing a secure and enjoyable social media experience.
      </P>
    </main>
  );
}
