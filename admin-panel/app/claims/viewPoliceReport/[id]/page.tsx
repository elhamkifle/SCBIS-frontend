import PoliceReportReview from "@/components/claims/policeReportReview";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <PoliceReportReview claimId={id} />;
}