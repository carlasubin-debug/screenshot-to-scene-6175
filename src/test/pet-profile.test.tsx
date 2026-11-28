import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PetProfile } from "@/components/PetProfile";
import { resetPet, updatePet } from "@/lib/pet-store";
import { resetSettings, updateSettings } from "@/lib/settings-store";

beforeEach(() => {
  localStorage.clear();
  resetPet();
  resetSettings();
  updateSettings({ name: "구름이", onboarded: true });
  updatePet({ age: "2살", snack: "고구마" });
});
afterEach(cleanup);

describe("Pet profile drafts", () => {
  it("saves edited profile values to the existing browser stores", () => {
    render(<PetProfile />);
    fireEvent.click(screen.getByRole("button", { name: "편집" }));
    fireEvent.change(screen.getByRole("textbox", { name: /이름/ }), { target: { value: "  보리  " } });
    fireEvent.change(screen.getByRole("textbox", { name: "나이" }), { target: { value: "3살" } });
    fireEvent.change(screen.getByRole("textbox", { name: "최애 간식" }), { target: { value: "사과" } });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));
    expect(JSON.parse(localStorage.getItem("mwoi.settings.v1") ?? "{}").name).toBe("보리");
    expect(JSON.parse(localStorage.getItem("mwoi.pet.v1") ?? "{}")).toMatchObject({ age: "3살", snack: "사과" });
  });

  it("discards draft changes on cancellation", () => {
    render(<PetProfile />);
    fireEvent.click(screen.getByRole("button", { name: "편집" }));
    fireEvent.change(screen.getByRole("textbox", { name: /이름/ }), { target: { value: "보리" } });
    fireEvent.change(screen.getByRole("textbox", { name: "최애 간식" }), { target: { value: "사과" } });
    fireEvent.click(screen.getByRole("button", { name: "취소" }));
    expect(JSON.parse(localStorage.getItem("mwoi.settings.v1") ?? "{}").name).toBe("구름이");
    expect(JSON.parse(localStorage.getItem("mwoi.pet.v1") ?? "{}").snack).toBe("고구마");
  });
});