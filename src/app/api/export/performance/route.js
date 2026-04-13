export async function GET(request) {
  // Matches "Social Media Performance Report"
  const csvHeaders = "Date,Type,Description,Reach,Interactions,Status\n";
  const rows = [
    "05-04-2026,Reel,100 problems 1 solution,1205,45,Done",
    "08-04-2026,Post,myth vs facts,890,22,Done",
    "10-04-2026,Post,most broker lose deal here,3400,156,Done",
    "14-04-2026,Reel,ek flat chahiye rent pe,5600,310,Done"
  ].join("\n");

  const csv = csvHeaders + rows;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=\"performance_report_ezyestapp.csv\""
    }
  });
}
