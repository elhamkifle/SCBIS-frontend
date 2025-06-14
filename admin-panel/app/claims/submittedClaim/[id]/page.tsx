import SubmittedClaimView from "@/components/claims/SubmittedClaimView";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <SubmittedClaimView claimId={params.id} />;
}