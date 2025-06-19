import SubmittedClaimView from "@/components/claims/SubmittedClaimView";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <SubmittedClaimView claimId={id} />;
}