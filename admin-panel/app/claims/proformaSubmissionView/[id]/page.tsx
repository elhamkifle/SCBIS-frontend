import ProformaSubmissionView from "@/components/claims/proformaSubmissionView";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <ProformaSubmissionView claimId={id} />;
}