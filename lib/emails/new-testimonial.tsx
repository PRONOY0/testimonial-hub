export function newTestimonialEmail({
  ownerName,
  testimonialName,
  feedback,
  stars,
  avatarUrl,
  company,
  dashboardUrl,
}: {
  ownerName: string;
  testimonialName: string;
  feedback: string;
  stars: number;
  avatarUrl: string;
  company?: string | null;
  dashboardUrl: string;
}) {
  const starRow = "★".repeat(stars) + "☆".repeat(5 - stars);

  return `
  <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; background:#f4f4f5; padding:40px 0;">
    <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e4e4e7;">
      
      <div style="background:#18181b; padding:24px 32px;">
        <span style="color:#fff; font-size:18px; font-weight:600;">TestimonialHub</span>
      </div>

      <div style="padding:32px;">
        <p style="font-size:15px; color:#52525b; margin:0 0 4px;">Hey ${ownerName},</p>
        <h2 style="font-size:20px; color:#18181b; margin:0 0 20px;">You just got a new testimonial</h2>

        <div style="border:1px solid #e4e4e7; border-radius:10px; padding:20px;">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <img src="${avatarUrl}" width="40" height="40" style="border-radius:50%; display:block;" />
            <div>
              <div style="font-weight:600; color:#18181b; font-size:14px;">${testimonialName}</div>
              ${company ? `<div style="color:#71717a; font-size:12px;">${company}</div>` : ""}
            </div>
          </div>
          <div style="color:#f59e0b; font-size:14px; margin-bottom:8px;">${starRow}</div>
          <p style="color:#3f3f46; font-size:14px; line-height:1.5; margin:0;">"${feedback}"</p>
        </div>

        <a href="${dashboardUrl}" style="display:inline-block; margin-top:24px; background:#18181b; color:#fff; text-decoration:none; padding:10px 18px; border-radius:8px; font-size:14px; font-weight:500;">
          View on dashboard
        </a>
      </div>

      <div style="padding:16px 32px; background:#fafafa; border-top:1px solid #e4e4e7;">
        <p style="font-size:12px; color:#a1a1aa; margin:0;">You're receiving this because you have a TestimonialHub page.</p>
      </div>
    </div>
  </div>
  `;
}