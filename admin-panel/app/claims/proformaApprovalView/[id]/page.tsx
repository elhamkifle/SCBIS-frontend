import ProformaApprovalView from "@/components/claims/proformaApprovalView";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <ProformaApprovalView claimId={params.id} />;
}