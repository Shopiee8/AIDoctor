
import { LandingHeader } from "@/components/landing-header";
import { Footer } from "@/components/home/footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold font-headline mb-6">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p>
              Your privacy is important to us. It is Not Too Late AI's policy to respect
              your privacy regarding any information we may collect from you across
              our website, and other sites we own and operate.
            </p>

            <h2 className="text-xl font-semibold font-headline mt-6 mb-3 text-foreground">1. Information we collect</h2>
            <p>
              We only ask for personal information when we truly need it to
              provide a service to you. We collect it by fair and lawful means,
              with your knowledge and consent. We also let you know why we’re
              collecting it and how it will be used.
            </p>
            <p>
              Log data: When you visit our website, our servers may
              automatically log the standard data provided by your web browser. It
              may include your computer’s Internet Protocol (IP) address, your
              browser type and version, the pages you visit, the time and date of
              your visit, the time spent on each page, and other details.
            </p>
            <p>
              Device data: We may also collect data about the device you’re using
              to access our website. This data may include the device type,
              operating system, unique device identifiers, device settings, and
              geo-location data. What we collect can depend on the individual
              settings of your device and software. We recommend checking the
              policies of your device manufacturer or software provider to learn
              what information they make available to us.
            </p>

            <h2 className="text-xl font-semibold font-headline mt-6 mb-3 text-foreground">2. Legal bases for processing</h2>
            <p>
              We will process your personal information lawfully, fairly and in a
              transparent manner. We collect and process information about you
              only where we have legal bases for doing so.
            </p>

            <h2 className="text-xl font-semibold font-headline mt-6 mb-3 text-foreground">3. Use of information</h2>
            <p>
              We may use the information we collect for a variety of purposes,
              including to:
            </p>
            <ul>
              <li>Provide, operate, and maintain our website;</li>
              <li>Improve, personalize, and expand our website;</li>
              <li>Understand and analyze how you use our website;</li>
              <li>
                Develop new products, services, features, and functionality;
              </li>
              <li>
                Communicate with you, either directly or through one of our
                partners, including for customer service, to provide you with
                updates and other information relating to the website, and for
                marketing and promotional purposes;
              </li>
              <li>Send you emails;</li>
              <li>Find and prevent fraud.</li>
            </ul>

            <h2 className="text-xl font-semibold font-headline mt-6 mb-3 text-foreground">4. Security of your personal information</h2>
            <p>
              We will protect personal information by reasonable security
              safeguards against loss or theft, as well as unauthorized access,
              disclosure, copying, use or modification.
            </p>

            <h2 className="text-xl font-semibold font-headline mt-6 mb-3 text-foreground">5. Changes to this policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
