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
  url: string;
}

export const VerifyEmail = ({ url, name }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Verify you email address!</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded-2xl my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Heading className="font-extrabold">Stories</Heading>
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Verify your email address
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {name},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              In order to start using your account, you need to verify your
              email address. Click the button below to verify your email address
              (this link will expire in one hour).
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-black text-white rounded-2xl text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={url}
              >
                Verify Email
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

VerifyEmail.PreviewProps = {
  url: "https://stories.aragundy.com/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhdmlkYXJhZ3VuZHlAb3V0bG9vay5jb20iLCJpYXQiOjE3NDE5Njc4NzQsImV4cCI6MTc0MTk3MTQ3NH0.9AjvRxMX1jwIw7XfagZThFe9eTBtc8utmM3VV7F8jqs&callbackURL=/",
  name: "David Aragundy",
} as Props;

export default VerifyEmail;
