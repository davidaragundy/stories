import type { Metadata } from "next";

import {
  TypographyH1,
  TypographyH2,
  TypographyMuted,
  TypographyP,
} from "@/shared/components/ui/typography";

export const metadata: Metadata = {
  title: "Stories | Privacy Policy",
  description: "Stories Privacy Policy",
};

export default function Privacy() {
  return (
    <main className="p-10">
      <TypographyH1>Privacy Policy</TypographyH1>

      <TypographyMuted>Effective Date: March 21, 2025</TypographyMuted>

      <TypographyP className="mb-6">
        At Stories, we value your privacy and are committed to protecting your
        personal information. This Privacy Policy outlines how we collect, use,
        and safeguard your data when you use our social media application.
      </TypographyP>

      <TypographyH2>1. Information We Collect</TypographyH2>

      <TypographyP className="mb-6">
        When you use Stories, we may collect the following types of information:
      </TypographyP>

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

      <TypographyH2>2. Use of Information</TypographyH2>

      <TypographyP className="mb-6">
        We use the collected information for the following purposes:
      </TypographyP>

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

      <TypographyH2>3. Data Retention</TypographyH2>

      <TypographyP className="mb-6">
        In alignment with our commitment to user privacy, all user-generated
        content, including posts and comments, is automatically deleted 24 hours
        after posting. This ensures that your shared content is not stored
        indefinitely.
      </TypographyP>

      <TypographyH2>4. Sharing of Information</TypographyH2>

      <TypographyP className="mb-6">
        We do not sell, trade, or rent your personal information to third
        parties. However, we may share non-personal, aggregated data with
        partners to analyze trends and improve our services.
      </TypographyP>

      <TypographyH2>5. Security Measures</TypographyH2>

      <TypographyP className="mb-6">
        We implement industry-standard security protocols to protect your data
        from unauthorized access, alteration, or destruction. Despite our
        efforts, no method of electronic storage is entirely secure, and we
        cannot guarantee absolute security.
      </TypographyP>

      <TypographyH2>6. Your Rights</TypographyH2>

      <TypographyP className="mb-6">
        You have the right to access, correct, or delete your personal
        information stored with us. Given our data retention policy,
        user-generated content is deleted 24 hours after posting. To manage your
        account information or exercise your rights, please contact us at
        davidaragundy@outlook.com
      </TypographyP>

      <TypographyH2>7. Third-Party Links</TypographyH2>

      <TypographyP className="mb-6">
        Stories may contain links to external websites or services not operated
        by us. We are not responsible for the privacy practices of these third
        parties. We encourage you to review the privacy policies of any external
        sites you visit.
      </TypographyP>

      <TypographyH2>8. Changes to This Privacy Policy</TypographyH2>

      <TypographyP className="mb-6">
        We may update this Privacy Policy periodically to reflect changes in our
        practices or legal requirements. We will notify users of significant
        changes by posting the updated policy within the app or through other
        communication channels.
      </TypographyP>

      <TypographyH2>9. Contact Us</TypographyH2>

      <TypographyP className="mb-6">
        If you have any questions or concerns about this Privacy Policy, please
        contact us at:
      </TypographyP>

      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>Email: davidaragundy@outlook.com</li>
      </ul>

      <TypographyP className="mb-6">
        Thank you for trusting Stories with your personal information. We are
        dedicated to providing a secure and enjoyable social media experience.
      </TypographyP>
    </main>
  );
}
