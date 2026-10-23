import { lexoUdhetimet } from "@/lib/udhetimet";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const noStoreHeaders = {
  "Cache-Control": "no-store",
};

export async function GET() {
  try {
    const udhetimet = await lexoUdhetimet();

    return Response.json(
      udhetimet.map(
        ({ id, nisja, destinacioni, ora, vendtakimi, vende }) => ({
          id,
          nisja,
          destinacioni,
          ora,
          vendtakimi,
          vende,
        }),
      ),
      { headers: noStoreHeaders },
    );
  } catch {
    return new Response(null, {
      status: 500,
      headers: noStoreHeaders,
    });
  }
}
