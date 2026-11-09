import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LEGAL_DOCUMENTS } from "@/lib/legal/legalContent";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";

interface LegalDocPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(LEGAL_DOCUMENTS).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: LegalDocPageProps): Promise<Metadata> {
  const doc = LEGAL_DOCUMENTS[params.slug];
  if (!doc) {
    return {
      title: "Document Not Found | RedTeam AI Labs",
    };
  }

  return {
    title: `${doc.title} | RedTeam AI Labs`,
    description: doc.summary,
    openGraph: {
      title: `${doc.title} | RedTeam AI Labs`,
      description: doc.summary,
    },
  };
}

export default function LegalDocumentPage({ params }: LegalDocPageProps) {
  const doc = LEGAL_DOCUMENTS[params.slug];

  if (!doc) {
    notFound();
  }

  return <LegalDocumentView doc={doc} />;
}

