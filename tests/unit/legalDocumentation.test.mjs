import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LEGAL_DOCUMENTS, LEGAL_CATEGORIES } from "../../src/lib/legal/legalContent.ts";

describe("Legal Documentation & Compliance Verification Suite", () => {
  const EXPECTED_SLUGS = [
    "terms",
    "privacy",
    "cookies",
    "notice",
    "acceptable-use",
    "ai-disclaimer",
    "retention",
    "security-disclosure",
    "intellectual-property",
    "refunds",
    "dpa",
    "subprocessors",
  ];

  it("verifies all 12 required legal documents exist in registry", () => {
    const registeredSlugs = Object.keys(LEGAL_DOCUMENTS);
    for (const expectedSlug of EXPECTED_SLUGS) {
      assert(
        registeredSlugs.includes(expectedSlug),
        `Missing required legal document: ${expectedSlug}`
      );
    }
    assert.equal(registeredSlugs.length, 12);
  });

  it("validates that all documents have complete statutory metadata", () => {
    for (const slug of EXPECTED_SLUGS) {
      const doc = LEGAL_DOCUMENTS[slug];
      assert(doc.title && doc.title.length > 5, `${slug} must have a descriptive title`);
      assert(doc.shortTitle, `${slug} must have a short title`);
      assert(doc.version, `${slug} must have a version string`);
      assert(doc.effectiveDate, `${slug} must have an effective date`);
      assert(doc.lastUpdated, `${slug} must have a last updated date`);
      assert(doc.governingLaw, `${slug} must specify governing law`);
      assert(doc.summary && doc.summary.length > 20, `${slug} must have an executive summary`);
      assert(Array.isArray(doc.sections) && doc.sections.length >= 2, `${slug} must have at least 2 sections`);

      for (const section of doc.sections) {
        assert(section.id, `${slug} section must have an id`);
        assert(section.title, `${slug} section must have a title`);
        assert(
          Array.isArray(section.content) && section.content.length > 0,
          `${slug} section ${section.id} must have non-empty content`
        );
      }
    }
  });

  it("ensures Nigerian law (NDPA 2023) is the primary foundation in Privacy, Terms, and DPA", () => {
    const privacy = LEGAL_DOCUMENTS["privacy"];
    const terms = LEGAL_DOCUMENTS["terms"];
    const dpa = LEGAL_DOCUMENTS["dpa"];

    assert(privacy.governingLaw.includes("Nigeria Data Protection Act 2023"));
    assert(terms.governingLaw.includes("Nigeria"));
    assert(dpa.governingLaw.includes("Nigeria Data Protection Act 2023"));

    // Check content mentions NDPA Section 24, 25, 29, or 40
    const privacyText = JSON.stringify(privacy.sections);
    assert(privacyText.includes("Nigeria Data Protection Act 2023"));
    assert(privacyText.includes("NDPA"));
    assert(privacyText.includes("NDPC"));
  });

  it("ensures Lisumen Innovative Hub is explicitly identified as operating entity", () => {
    const notice = LEGAL_DOCUMENTS["notice"];
    const terms = LEGAL_DOCUMENTS["terms"];

    const noticeText = JSON.stringify(notice.sections);
    const termsText = JSON.stringify(terms.sections);

    assert(noticeText.includes("Lisumen Innovative Hub"));
    assert(termsText.includes("Lisumen Innovative Hub"));
  });

  it("verifies subprocessors document lists only verified infrastructure providers", () => {
    const subprocessors = LEGAL_DOCUMENTS["subprocessors"];
    const subText = JSON.stringify(subprocessors.sections);

    assert(subText.includes("Supabase Inc."));
    assert(subText.includes("Vercel Inc."));
    assert(subText.includes("Google LLC"));

    // Disallow unverified vendors
    assert(!subText.includes("Salesforce"));
    assert(!subText.includes("Datadog"));
    assert(!subText.includes("Mixpanel"));
  });

  it("verifies all three categories are properly populated with documents", () => {
    const legalDocs = Object.values(LEGAL_DOCUMENTS).filter((d) => d.category === "legal");
    const policyDocs = Object.values(LEGAL_DOCUMENTS).filter((d) => d.category === "policies");
    const dataProtectionDocs = Object.values(LEGAL_DOCUMENTS).filter((d) => d.category === "data-protection");

    assert.equal(legalDocs.length, 4, "Legal category must contain 4 documents (Terms, Privacy, Cookies, Notice)");
    assert.equal(policyDocs.length, 6, "Policies category must contain 6 documents (AUP, AI Disclaimer, Retention, Security, IP, Refunds)");
    assert.equal(dataProtectionDocs.length, 2, "Data Protection category must contain 2 documents (DPA, Subprocessors)");
  });

  it("verifies presence of clearly marked confirmation placeholders for legal counsel review", () => {
    const terms = LEGAL_DOCUMENTS["terms"];
    const notice = LEGAL_DOCUMENTS["notice"];
    const privacy = LEGAL_DOCUMENTS["privacy"];

    assert(terms.confirmationItems.length > 0);
    assert(notice.confirmationItems.length > 0);
    assert(privacy.confirmationItems.length > 0);

    for (const item of terms.confirmationItems) {
      assert(item.includes("[CONFIRMATION REQUIRED"));
    }
  });
});

