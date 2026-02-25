import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // ✅ Correct proxy authentication
  await authenticate.public.appProxy(request);

  const url = new URL(request.url);
  const sku = url.searchParams.get("sku");
  const pincode = url.searchParams.get("pincode");

  if (!sku || !pincode) {
    return new Response(
      JSON.stringify({ error: "Missing SKU or Pincode" }),
      { status: 400 }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      sku,
      pincode,
      message: "Proxy working",
    }),
    { headers: { "Content-Type": "application/json" } }
  );
};