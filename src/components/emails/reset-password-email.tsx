import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Heading,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordProps {
  userFirstName: string;
  resetPasswordLink: string;
}

export const ResetPasswordEmail = ({
  userFirstName,
  resetPasswordLink,
}: ResetPasswordProps) => {
  return (
    <Html>
      <Head />
      <Preview>Stories: reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Stories | Reset password</Heading>
          <Section>
            <Text style={text}>Hi {userFirstName},</Text>
            <Text style={text}>
              Someone recently requested a password change for your Stories
              account. If this was you, you can set a new password here (the
              link is valid for 5 minutes):
            </Text>
            <Button style={button} href={resetPasswordLink}>
              Reset password
            </Button>
            <Text style={text}>
              If you {"don't"} want to change your password or {"didn't"}
              request this, just ignore and delete this message.
            </Text>
            <Text style={text}>Good vibes! 🌴</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  userFirstName: "David",
  resetPasswordLink: "http://localhost:3000/forgot-password/123456",
} as ResetPasswordProps;

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  padding: "45px",
};

const heading = {
  color: "#006FEE",
  fontSize: "24px",
  fontWeight: "800",
  lineHeight: "32px",
  marginBottom: "20px",
};

const text = {
  fontSize: "16px",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#006FEE",
  borderRadius: "16px",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};
