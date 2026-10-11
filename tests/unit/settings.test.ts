import { describe, expect, it } from "vitest";
import { FUNDING_NOTICE_DEFAULT } from "@/lib/copy/common";
import { resolveSettings } from "@/lib/settings";

describe("resolveSettings", () => {
  it("tiene il PopCoin spento se l'impostazione manca o non è un booleano vero", () => {
    expect(resolveSettings({}).popcoinEnabled).toBe(false);
    expect(resolveSettings({ popcoin_enabled: "true" }).popcoinEnabled).toBe(false);
    expect(resolveSettings({ popcoin_enabled: true }).popcoinEnabled).toBe(true);
  });

  it("non lascia mai la dicitura del finanziamento vuota", () => {
    expect(resolveSettings({}).fundingNotice).toBe(FUNDING_NOTICE_DEFAULT);
    expect(resolveSettings({ funding_notice: "   " }).fundingNotice).toBe(FUNDING_NOTICE_DEFAULT);
    expect(resolveSettings({ funding_notice: "Testo aggiornato" }).fundingNotice).toBe(
      "Testo aggiornato",
    );
  });
});
