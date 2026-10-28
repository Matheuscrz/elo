import { describe, expect, it } from "vitest";
import {
  buildSlots,
  calculateAppointmentFinancials,
  canCancel,
  daysUntilBillingDeadline,
  isValidCpfShape,
  maskCpf,
} from "@/lib/clinic";

describe("clinic rules", () => {
  it("billing deadline is day 25 of current month", () => {
    expect(daysUntilBillingDeadline(new Date(2026, 9, 20))).toBe(5);
  });
  it("after day 25 the deadline rolls to next month", () => {
    expect(daysUntilBillingDeadline(new Date(2026, 9, 26))).toBe(30);
  });
  it("cancel is blocked under 24h before the appointment", () => {
    const now = new Date(2026, 9, 26, 9);
    expect(canCancel(new Date(2026, 9, 27, 8), now)).toBe(false);
    expect(canCancel(new Date(2026, 9, 27, 10), now)).toBe(true);
  });
  it("shifts split into slots by interval", () => {
    expect(buildSlots([{ start: "08:00", end: "10:00" }], 30)).toEqual([
      "08:00",
      "08:30",
      "09:00",
      "09:30",
    ]);
  });
  it("masks CPF while typing and caps at 11 digits", () => {
    expect(maskCpf("52998224725")).toBe("529.982.247-25");
    expect(maskCpf("5299822")).toBe("529.982.2");
    expect(maskCpf("529.982.247-251234")).toBe("529.982.247-25");
  });
  it("checks CPF shape by digit count", () => {
    expect(isValidCpfShape("529.982.247-25")).toBe(true);
    expect(isValidCpfShape("529.982.247")).toBe(false);
  });
  it("splits a charge between professional and clinic", () => {
    expect(calculateAppointmentFinancials(180, 70)).toEqual({
      gross: 180,
      professional: 126,
      clinic: 54,
    });
  });
});
