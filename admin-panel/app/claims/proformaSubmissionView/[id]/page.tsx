import ProformaSubmissionView from "@/components/claims/proformaSubmissionView";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <ProformaSubmissionView claimId={params.id} />;
}