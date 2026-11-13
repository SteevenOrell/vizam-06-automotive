import { describe, expect, it } from "vitest";
import { submitContact } from "@/app/contact/actions";
import { submitTestDrive } from "@/app/test-drive/actions";
import { getDefaultConfig } from "./configurator";
import { IDLE_RESULT, processContact, processTestDrive, readFormValues } from "./demo-forms";
import { isoDateAfter } from "./schemas";

const NOW = new Date(2026, 10, 11, 12, 0, 0);

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [k, v] of Object.entries(fields)) data.set(k, v);
  return data;
}

const drive = {
  name: "Alex Example",
  email: "alex@example.com",
  phone: "",
  model: "vire",
  preferredDate: "2026-11-20",
  preferredLocation: "Toronto, ON",
  message: "",
  website: "",
};
const contact = { name: "Sam Example", email: "sam@example.com", topic: "press", model: "", message: "I would like to know more about the lineup.", website: "" };

describe("processTestDrive (server-side check)", () => {
  it("accepts a valid request and returns a summary, nothing else", () => {
    const result = processTestDrive(form(drive), NOW);
    expect(result.status).toBe("success");
    if (result.status === "success") {
      expect(result.summary.find((l) => l.label === "Vehicle")?.value).toBe("ORVANE Vire");
      expect(result.summary.find((l) => l.label === "Saved configuration")?.value).toBe("Not attached");
    }
  });

  it("rejects invalid input with per-field messages and echoes the submitted text for the form", () => {
    const result = processTestDrive(form({ ...drive, name: "", email: "nope", preferredDate: "2026-01-01", model: "" }), NOW);
    expect(result.status).toBe("error");
    if (result.status === "error") {
      expect(Object.keys(result.fieldErrors)).toEqual(expect.arrayContaining(["name", "email", "preferredDate", "model"]));
      expect(result.values.email).toBe("nope");
    }
  });

  it("allows one day of time-zone slack on the date but not two, and caps the far end", () => {
    expect(processTestDrive(form({ ...drive, preferredDate: "2026-11-10" }), NOW).status).toBe("success");
    expect(processTestDrive(form({ ...drive, preferredDate: "2026-11-09" }), NOW).status).toBe("error");
    expect(processTestDrive(form({ ...drive, preferredDate: isoDateAfter(NOW, 300) }), NOW).status).toBe("error");
  });

  it("returns the same generic success for a honeypot hit, without detail", () => {
    expect(processTestDrive(form({ ...drive, website: "spam" }), NOW)).toEqual({ status: "success", summary: [] });
    expect(processTestDrive(form({ ...drive, name: "", website: "spam" }), NOW)).toEqual({ status: "success", summary: [] });
  });

  it("attaches a saved configuration only when it is valid", () => {
    const config = getDefaultConfig("sola");
    const ok = processTestDrive(form({ ...drive, attachedConfig: JSON.stringify(config) }), NOW);
    expect(ok.status === "success" && ok.summary.find((l) => l.label === "Saved configuration")?.value).toContain("ORVANE Sola");
    expect(processTestDrive(form({ ...drive, attachedConfig: "{not json" }), NOW).status).toBe("error");
    expect(processTestDrive(form({ ...drive, attachedConfig: JSON.stringify({ ...config, colour: "chartreuse" }) }), NOW).status).toBe("error");
  });

  it("rejects control characters and over-long input, and ignores files and unknown fields", () => {
    expect(processTestDrive(form({ ...drive, name: "Alex\u0000" }), NOW).status).toBe("error");
    expect(processTestDrive(form({ ...drive, message: "x".repeat(9000) }), NOW).status).toBe("error");
    const data = form(drive);
    data.set("name", new File(["x"], "x.txt"));
    data.set("extra", "ignored");
    expect(readFormValues(data, ["name", "extra"]).name).toBe("");
    expect(processTestDrive(data, NOW).status).toBe("error");
  });
});

describe("processContact (server-side check)", () => {
  it("accepts a valid message", () => {
    const result = processContact(form(contact));
    expect(result.status).toBe("success");
    if (result.status === "success") expect(result.summary.find((l) => l.label === "Topic")?.value).toBe("Press & media");
  });

  it("rejects a short message, an unknown topic and a bad model", () => {
    const result = processContact(form({ ...contact, message: "short", topic: "sales", model: "zeta" }));
    expect(result.status).toBe("error");
    if (result.status === "error") expect(Object.keys(result.fieldErrors)).toEqual(expect.arrayContaining(["message", "topic", "model"]));
  });

  it("returns the generic success for a honeypot hit", () => {
    expect(processContact(form({ ...contact, website: "x" }))).toEqual({ status: "success", summary: [] });
  });
});

describe("Server Action functions called directly", () => {
  it("submitTestDrive and submitContact validate and return results", async () => {
    expect((await submitTestDrive(IDLE_RESULT, form({ ...drive, preferredDate: isoDateAfter(new Date(), 5) }))).status).toBe("success");
    expect((await submitTestDrive(IDLE_RESULT, form({ ...drive, email: "bad" }))).status).toBe("error");
    expect((await submitContact(IDLE_RESULT, form(contact))).status).toBe("success");
    expect((await submitContact(IDLE_RESULT, form({ ...contact, name: "" }))).status).toBe("error");
  });
});
