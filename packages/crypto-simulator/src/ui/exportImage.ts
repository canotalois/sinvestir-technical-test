import { toPng } from "html-to-image";

export async function exportNodeToPng(
  node: HTMLElement,
  filename: string,
): Promise<void> {
  const backgroundColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-app")
    .trim();
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    filter: (el) =>
      !(el instanceof HTMLElement && el.dataset.shareHide === "true"),
    ...(backgroundColor !== "" ? { backgroundColor } : {}),
  });
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
