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
  url: string;
}

export const MagicLink = ({ url }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>your magic link is here 🫦</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded-2xl my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Heading className="font-extrabold">Stories</Heading>
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Sign in with Magic Link
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              In order to sign in, click the button below (this link will expire
              in 5 minutes).
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-black text-white rounded-2xl text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={url}
              >
                Sign In
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

MagicLink.PreviewProps = {
  url: "https://stories.aragundy.com/api/auth/magic-link/verify?token=sltkojopgtpxacfmbwevccbzcerugnfw&callbackURL=/home",
} as Props;

export default MagicLink;
