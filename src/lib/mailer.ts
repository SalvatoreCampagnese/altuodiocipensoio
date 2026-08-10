import "server-only";

/**
 * Invio email transazionali.
 *
 * Stripe NON può recapitare il contenuto digitale: le sue email sono ricevute
 * di pagamento e non accettano corpo personalizzato né allegati. Quello che
 * Stripe ci dà è l'indirizzo (lo raccoglie al checkout e lo salviamo in
 * `orders.email`): la consegna la facciamo noi da qui.
 *
 * Provider: Resend, via API HTTP, senza dipendenze aggiuntive. Se le variabili
 * non sono configurate le funzioni non fanno nulla e non sollevano errori: la
 * preghiera resta comunque raggiungibile dal suo link privato.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function config() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM || "AlTuoDioCiPensoIO <noreply@altuodiocipensoio.it>",
    replyTo: process.env.EMAIL_REPLY_TO,
    siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  };
}

export function isMailerConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

async function send(opts: { to: string; subject: string; html: string }): Promise<boolean> {
  const { apiKey, from, replyTo } = config();
  if (!apiKey) return false;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!res.ok) {
      console.error("[mailer]", res.status, (await res.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    // Un'email non partita non deve mai far fallire la generazione.
    console.error("[mailer]", err instanceof Error ? err.message : err);
    return false;
  }
}

/* -------------------------------------------------------------------------
 * Template
 * ----------------------------------------------------------------------- */

function layout(inner: string): string {
  return `<!doctype html>
<html lang="it"><body style="margin:0;padding:32px 16px;background:#fdfbf6;font-family:Georgia,'Times New Roman',serif;color:#2b241d;">
  <table role="presentation" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid rgba(184,134,47,.2);border-radius:16px;">
    <tr><td style="padding:36px 32px;">
      <p style="margin:0 0 28px;font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#8a6119;">
        AlTuoDioCiPensoIO
      </p>
      ${inner}
    </td></tr>
  </table>
  <p style="max-width:560px;margin:20px auto 0;font-family:system-ui,sans-serif;font-size:11px;line-height:1.6;color:#8b8378;text-align:center;">
    Preghiera composta con l'assistenza dell'intelligenza artificiale e recitata da una voce
    sintetica. Il servizio non è affiliato ad alcuna autorità religiosa.
  </p>
</body></html>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#8a6119;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-family:system-ui,sans-serif;font-size:15px;">${label}</a>`;
}

/** La preghiera è pronta: testo completo più link all'audio. */
export async function sendPrayerReady(opts: {
  to: string;
  title: string;
  body: string;
  prayerId: string;
  accessToken: string;
  recipientName?: string | null;
}): Promise<boolean> {
  const { siteUrl } = config();
  const url = `${siteUrl}/preghiera/${opts.prayerId}?token=${encodeURIComponent(opts.accessToken)}`;

  const paragraphs = opts.body
    .split(/\n{2,}/)
    .map(
      (p) =>
        `<p style="margin:0 0 18px;font-size:17px;line-height:1.9;">${escapeHtml(p.trim())}</p>`
    )
    .join("");

  return send({
    to: opts.to,
    subject: `La tua preghiera è pronta — ${opts.title}`,
    html: layout(`
      <h1 style="margin:0 0 8px;font-size:30px;font-weight:400;line-height:1.25;">${escapeHtml(opts.title)}</h1>
      ${opts.recipientName ? `<p style="margin:0 0 24px;font-size:14px;color:#6b6055;font-family:system-ui,sans-serif;">Per ${escapeHtml(opts.recipientName)}</p>` : ""}
      <div style="margin:28px 0;padding:24px 0;border-top:1px solid rgba(184,134,47,.2);border-bottom:1px solid rgba(184,134,47,.2);">
        ${paragraphs}
      </div>
      <p style="margin:0 0 20px;font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#6b6055;">
        La registrazione ti aspetta qui: puoi ascoltarla, scaricarla e mandare il link a chi vuoi.
      </p>
      ${button(url, "Ascolta la preghiera")}
      <p style="margin:24px 0 0;font-family:system-ui,sans-serif;font-size:12px;color:#8b8378;">
        Questo link è privato: chiunque ce l'abbia può ascoltare la preghiera.
      </p>
    `),
  });
}

/** Conferma che la candela del lucernario è accesa. */
export async function sendCandleLit(opts: {
  to: string;
  slot: number;
  hours: number;
  donorName?: string | null;
  intention?: string | null;
}): Promise<boolean> {
  const { siteUrl } = config();

  return send({
    to: opts.to,
    subject: `La tua candela è accesa — n. ${opts.slot}`,
    html: layout(`
      <h1 style="margin:0 0 16px;font-size:30px;font-weight:400;">La tua candela è accesa</h1>
      <p style="margin:0 0 20px;font-family:system-ui,sans-serif;font-size:15px;line-height:1.7;color:#6b6055;">
        È la numero <strong style="color:#2b241d;">${opts.slot}</strong> del Lucernario e resterà
        accesa ${opts.hours} ore.${opts.intention ? ` Sotto c'è scritto: “${escapeHtml(opts.intention)}”.` : ""}
      </p>
      <p style="margin:0 0 24px;font-family:system-ui,sans-serif;font-size:15px;line-height:1.7;color:#6b6055;">
        Grazie.
      </p>
      ${button(`${siteUrl}/lucernario`, "Vedi il Lucernario")}
    `),
  });
}

/** Allerta al gestore: qualcosa si è rotto e serve un occhio umano. */
export async function sendAdminAlert(opts: {
  to: string;
  kind: string;
  severity: string;
  message: string;
  prayerId?: string | null;
  userEmail?: string | null;
  context?: Record<string, unknown>;
}): Promise<boolean> {
  const { siteUrl } = config();

  const rows: [string, string][] = [
    ["Tipo", opts.kind],
    ["Gravità", opts.severity],
    ["Quando", new Date().toLocaleString("it-IT", { dateStyle: "full", timeStyle: "medium" })],
  ];
  if (opts.userEmail) rows.push(["Utente", opts.userEmail]);
  if (opts.prayerId) rows.push(["Preghiera", opts.prayerId]);

  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#8b8378;white-space:nowrap;">${escapeHtml(k)}</td>` +
        `<td style="padding:6px 0;color:#2b241d;">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  return send({
    to: opts.to,
    subject: `[AlTuoDioCiPensoIO] ${opts.kind}${opts.userEmail ? ` — ${opts.userEmail}` : ""}`,
    html: layout(`
      <h1 style="margin:0 0 18px;font-size:26px;font-weight:400;color:#b5541f;">
        Qualcosa è andato storto
      </h1>
      <p style="margin:0 0 20px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.6;background:#faf6ee;border:1px solid rgba(184,134,47,.2);border-radius:8px;padding:14px;color:#2b241d;">
        ${escapeHtml(opts.message)}
      </p>
      <table role="presentation" style="font-family:system-ui,sans-serif;font-size:13px;margin:0 0 24px;">${table}</table>
      ${
        opts.context
          ? `<pre style="font-family:ui-monospace,Menlo,monospace;font-size:11px;line-height:1.5;color:#6b6055;background:#faf6ee;border-radius:8px;padding:12px;overflow-x:auto;white-space:pre-wrap;">${escapeHtml(
              JSON.stringify(opts.context, null, 2)
            )}</pre>`
          : ""
      }
      ${
        opts.prayerId
          ? button(`${siteUrl}/preghiera/${opts.prayerId}`, "Apri la preghiera")
          : ""
      }
      <p style="margin:24px 0 0;font-family:system-ui,sans-serif;font-size:12px;color:#8b8378;">
        L'allerta è registrata anche nella tabella <code>alerts</code> su Supabase.
        Vista rapida: <code>select * from open_alerts;</code>
      </p>
    `),
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
