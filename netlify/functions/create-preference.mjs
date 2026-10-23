// Netlify Function: cria uma preferência do Mercado Pago Checkout Pro.
// Configure MP_ACCESS_TOKEN nas variáveis de ambiente da Netlify (nunca no HTML).
const PRODUCTS = {
  unit_sem: { title: "Criado-mudo MDF DGB (sem fechadura)", unit_price: 189.90 },
  unit_com: { title: "Criado-mudo MDF DGB (com fechadura)", unit_price: 199.90 },
  pair_sem: { title: "Par de criados-mudos MDF DGB S + Z (sem fechadura)", unit_price: 359.99 },
  pair_com: { title: "Par de criados-mudos MDF DGB S + Z (com fechadura)", unit_price: 369.99 },
};

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido." }), {
      status: 405, headers: { "content-type": "application/json; charset=utf-8", "allow": "POST" }
    });
  }

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: "A integração ainda não está ativada. Falta configurar a credencial privada MP_ACCESS_TOKEN na Netlify." }), {
      status: 503, headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: "Pedido inválido." }), {
      status: 400, headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  const format = body?.format === "Z" ? "Z" : "S";
  const lock = body?.lock === "com" ? "com" : "sem";
  const pair = body?.quantity === "pair" || body?.format === "par";
  const requestedCount = Number(body?.count ?? 1);
  if (!Number.isInteger(requestedCount) || requestedCount < 1 || requestedCount > 99) {
    return new Response(JSON.stringify({ error: "Escolha uma quantidade entre 1 e 99." }), {
      status: 400, headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
  const key = `${pair ? "pair" : "unit"}_${lock}`;
  const product = PRODUCTS[key];
  const siteUrl = "https://dgbmoveisplanejados.com.br";

  const payload = {
    items: [{
      id: key,
      title: product.title + (pair ? "" : ` — formato ${format}`),
      quantity: requestedCount,
      currency_id: "BRL",
      unit_price: product.unit_price
    }],
    back_urls: {
      success: siteUrl + "/loja.html?pagamento=sucesso",
      pending: siteUrl + "/loja.html?pagamento=pendente",
      failure: siteUrl + "/loja.html?pagamento=falhou"
    },
    auto_return: "approved",
    external_reference: "DGB-" + Date.now()
  };

  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": crypto.randomUUID()
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok || !data.init_point) {
      console.error("Mercado Pago preference error:", response.status, data?.message || data?.error || "unknown");
      return new Response(JSON.stringify({ error: "O Mercado Pago não conseguiu criar o pagamento. Confira as credenciais e a configuração da aplicação." }), {
        status: 502, headers: { "content-type": "application/json; charset=utf-8" }
      });
    }
    return new Response(JSON.stringify({ checkout_url: data.init_point }), {
      status: 200, headers: { "content-type": "application/json; charset=utf-8" }
    });
  } catch (error) {
    console.error("Checkout request failed:", error);
    return new Response(JSON.stringify({ error: "Não foi possível conectar ao Mercado Pago. Tente novamente." }), {
      status: 502, headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
};

export const config = { path: "/.netlify/functions/create-preference" };
