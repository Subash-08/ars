import { PolicyContent } from "@/components/policy-content";
export const metadata = { title: "Booking & Test Ride Terms | ARS Motors", alternates: { canonical: "/booking-terms" } };
export default function BookingTerms() {
    return <PolicyContent title="Test ride & reservation enquiries" sections={[
            ["A request, followed by confirmation", "Submitting a form requests contact or a test ride. A reference identifies the saved enquiry; it is not confirmation of a ride, vehicle allocation, purchase or payment. The showroom will confirm availability and the requested time."],
            ["No payment collected online", "This website does not collect token payments. If you discuss a deposit with the dealership, obtain the amount, vehicle details, receipt, allocation conditions and cancellation/refund terms in writing before paying through an independently verified dealership channel."],
            ["Prices and availability", "Product information and listed prices are indicative. Ask for a current written quotation specifying the exact variant, on-road charges, warranty, accessories and delivery expectations. Finance is subject to lender assessment."],
            ["Changing your request", "Contact your selected showroom to change or cancel a requested visit. Confirm test ride requirements, documentation and safety arrangements with the team before travelling."],
        ]}/>;
}
