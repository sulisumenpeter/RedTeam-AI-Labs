import { TargetAdapter } from "../domain/interfaces";
import { SyntheticLegalIntakeAssistant } from "./syntheticAssistant";
import { ExternalHttpTargetAdapter, ExternalTargetConfig } from "./externalTargetAdapter";

export class TargetAdapterFactory {
  static create(targetType: "SYNTHETIC" | "EXTERNAL_ENDPOINT" | "OPENAI_COMPATIBLE" | "AGENTIC_MCP_ENDPOINT", config?: Partial<ExternalTargetConfig>): TargetAdapter {
    if (targetType === "SYNTHETIC") {
      return new SyntheticLegalIntakeAssistant();
    }

    if (!config?.endpointUrl) {
      throw new Error("External target requires an endpointUrl.");
    }

    return new ExternalHttpTargetAdapter({
      targetId: config.targetId || "external-custom-target",
      name: config.name || "External AI System",
      endpointUrl: config.endpointUrl,
      apiKey: config.apiKey,
      targetType,
      timeoutMs: config.timeoutMs,
      maxRetries: config.maxRetries,
    });
  }
}

