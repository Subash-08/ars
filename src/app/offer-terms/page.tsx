import { PolicyContent } from "@/components/policy-content";
export const metadata = { title: "Offer Information | ARS Motors", alternates: { canonical: "/offer-terms" } };
export default function OfferTerms() {
    return <PolicyContent title="Understanding dealership offers" sections={[
            ["Confirm the specific offer", "Each offer has its own eligibility and conditions shown alongside it. Ask for current written confirmation of the applicable model, branch, period, inclusions and any exclusions before relying on an advertised benefit."],
            ["Exchange and finance", "Exchange values depend on inspection, condition, ownership documents and acceptance by the dealership. Any finance example is illustrative; the lender determines eligibility, final rate, fees and approval."],
            ["Enquiries do not claim or redeem an offer", "An offer enquiry asks the team to contact you. It does not reserve stock, secure allocation or confirm a discount. No payment is collected through this website."],
        ]}/>;
}
