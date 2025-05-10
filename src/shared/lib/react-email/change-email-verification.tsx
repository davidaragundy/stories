import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface Props {
  name: string;
  newEmail: string;
  url: string;
}

export const ChangeEmailVerification = ({ url, name, newEmail }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>bitch, we gotta be sure its really you 🧐</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded-2xl my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Heading className="font-extrabold">Stories</Heading>
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Change email verification
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {name},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              In order to change your email address ({newEmail}), we need to
              verify it is really you. Click the button below to confirm.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-black text-white rounded-2xl text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={url}
              >
                Confirm
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link
                href={url}
                className="text-blue-600 no-underline text-wrap break-all"
              >
                {url}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ChangeEmailVerification.PreviewProps = {
  url: "https://stories.aragundy.com/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhdmlkYXJhZ3VuZHlAb3V0bG9vay5jb20iLCJpYXQiOjE3NDE5Njc4NzQsImV4cCI6MTc0MTk3MTQ3NH0.9AjvRxMX1jwIw7XfagZThFe9eTBtc8utmM3VV7F8jqs&callbackURL=/",
  name: "David Aragundy",
} as Props;

export default ChangeEmailVerification;
