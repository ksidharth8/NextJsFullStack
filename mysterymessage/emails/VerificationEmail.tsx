// import required modules
import { Html, Head, Font, Preview, Heading, Row, Section, Text, Button, Link, } from "@react-email/components";

// define the VerificationEmailProps interface
interface VerificationEmailProps {
  username: string;
  otp: string;
}

// define the VerificationEmail component and export it
export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    // return the email template
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your verification code: {otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering. Please use the following
            verification code to complete your registration:
          </Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
        <Row>
          <Text>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
        <Row>
          <Link href={`http://localhost:3000/verify/${username}`}>
            <Button style={{ color: "#61dafb" }}>Verify here</Button>
          </Link>
        </Row>
      </Section>
    </Html>
  );
}
