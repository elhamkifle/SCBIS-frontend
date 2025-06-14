import PoliceReportReview from "@/components/claims/policeReportReview";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <PoliceReportReview claimId={params.id} />;
}