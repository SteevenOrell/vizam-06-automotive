import { describe, expect, it } from "vitest";
import { getDefaultConfig } from "./configurator";
import { configStateSchema, contactSchema, createTestDriveSchema, todayIsoDate } from "./schemas";

const NOW = new Date(2026, 10, 11, 12, 0, 0); // 11 Nov 2026, local time
const schema = createTestDriveSchema(NOW);

const validDrive = {
  name: "Alex Example",
  email: "alex@example.com",
  phone: "",
  model: "aren",
  preferredDate: "2026-11-20",
  preferredLocation: "Toronto, ON",
  message: "",
};

function fieldErrors(result: { success: boolean; error?: { issues: { path: PropertyKey[] }[] } }) {
  return result.success ? [] : result.error!.issues.map((i) => i.path.join("."));
}

describe("todayIsoDate", () => {
  it("formats the local date", () => {
    expect(todayIsoDate(NOW)).toBe("2026-11-11");
  });
});

describe("test-drive schema", () => {
  it("accepts a valid request and trims text", () => {
    const result = schema.safeParse({ ...validDrive, name: "  Alex Example  " });
    expect(result.success).toBe(true);
    expect(result.data?.name).toBe("Alex Example");
  });

  it("accepts today and an optional phone", () => {
    expect(schema.safeParse({ ...validDrive, preferredDate: "2026-11-11", phone: "+1 (416) 555-0100" }).success).toBe(true);
    const withoutOptional: Partial<typeof validDrive> = { ...validDrive };
    delete withoutOptional.phone;
    delete withoutOptional.message;
    expect(schema.safeParse(withoutOptional).success).toBe(true);
  });

  it("rejects a date in the past or an impossible date", () => {
    expect(fieldErrors(schema.safeParse({ ...validDrive, preferredDate: "2026-11-10" }))).toContain("preferredDate");
    expect(fieldErrors(schema.safeParse({ ...validDrive, preferredDate: "2026-02-30" }))).toContain("preferredDate");
    expect(fieldErrors(schema.safeParse({ ...validDrive, preferredDate: "next week" }))).toContain("preferredDate");
  });

  it("rejects bad email, phone, model, missing name and location", () => {
    const errors = fieldErrors(
      schema.safeParse({ ...validDrive, name: " ", email: "nope", phone: "abc", model: "x", preferredLocation: "" }),
    );
    expect(errors).toEqual(expect.arrayContaining(["name", "email", "phone", "model", "preferredLocation"]));
  });

  it("rejects a filled honeypot", () => {
    expect(fieldErrors(schema.safeParse({ ...validDrive, website: "spam.example" }))).toContain("website");
  });
});

describe("contact schema", () => {
  const valid = { name: "Sam Example", email: "sam@example.com", topic: "press", message: "I would like to know more about the lineup." };

  it("accepts a valid message", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a known topic and a message of at least 20 characters", () => {
    const errors = fieldErrors(contactSchema.safeParse({ ...valid, topic: "sales", message: "Too short" }));
    expect(errors).toEqual(expect.arrayContaining(["topic", "message"]));
  });

  it("returns readable messages", () => {
    const result = contactSchema.safeParse({ ...valid, email: "bad" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Please enter a valid email address.");
  });
});

describe("config state schema", () => {
  it("accepts a default config and rejects wrong versions or models", () => {
    expect(configStateSchema.safeParse(getDefaultConfig("vire")).success).toBe(true);
    expect(configStateSchema.safeParse({ ...getDefaultConfig("vire"), version: 2 }).success).toBe(false);
    expect(configStateSchema.safeParse({ ...getDefaultConfig("vire"), model: "other" }).success).toBe(false);
  });
});
