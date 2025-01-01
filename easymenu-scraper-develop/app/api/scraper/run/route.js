export async function GET(request) {
  // Parse query parameters from the request URL
  const { searchParams } = new URL(request.url);

  const googleMapsLink = searchParams.get("googleMapsLink");
  const externalMenuLink = searchParams.get("externalMenuLink");
  const mode = searchParams.get("mode");
  const steps = searchParams.get("steps")?.split(",") || [];
  const images = searchParams.get("images")?.split(",") || [];

  // Build response
  return new Response(
    JSON.stringify({
      googleMapsLink,
      externalMenuLink,
      mode,
      steps,
      images,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
