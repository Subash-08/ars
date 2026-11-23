import { PolicyContent } from "@/components/policy-content";
export const metadata = { title: "Privacy | ARS Motors", alternates: { canonical: "/privacy" } };
export default function PrivacyPage() {
    return <PolicyContent title="Privacy & your information" sections={[
            ["Information submitted", "Enquiry forms collect your name, phone number and the preferences you choose to share, such as vehicle, branch, area and requested schedule. Please do not submit identity documents, payment information or other sensitive details through these forms."],
            ["How it is used", "ARS Motors uses your enquiry to respond, discuss vehicle availability and coordinate a requested visit or service. Contact permission relates to this enquiry; submitting a request does not authorize unrelated marketing."],
            ["Optional analytics", "Optional usage analytics are disabled until you accept them. If accepted, the site records page path, referrer, browser/device information and campaign attribution. You can change this choice using Analytics preferences in the footer. Essential staff session cookies are used only for staff authentication."],
            ["Storage and access", "Submitted enquiries are stored in the dealership's configured database for follow-up. Access to staff records requires an authenticated session. Contact the showroom for details about retention, access or deletion of your enquiry. No guarantee of zero data loss is made."],
            ["External services", "Phone, email and map links open services outside this website. Those services handle information under their own policies. External fonts may also be requested by your browser. This site does not collect online payments."],
            ["Contact and requests", "To ask about, correct or request deletion of an enquiry, call +91 90253 80626 or email arsmotors9@gmail.com. The team may need to verify that the request relates to your record."],
        ]}/>;
}
