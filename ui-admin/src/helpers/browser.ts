export function showReportInBrowser(): void {
  const pdfUrl = "http://localhost:3000/files/report.pdf";
  console.log("URL", pdfUrl);
  window.open(pdfUrl);
}
