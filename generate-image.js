import OpenAI from "openai";

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { prompt, photoBase64 } = req.body;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    let imageUrl;

    if (photoBase64) {
      // Use GPT-4o vision to describe the home, then generate with that context
      const vision = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
          role: "user",
          content: [
            { type: "image_url", image_url: { url: photoBase64 } },
            { type: "text", text: "Describe this home's exterior/backyard in detail: siding color, architectural style, existing structures, yard size, grade/slope, any existing features. Be specific and concise — 3 sentences max." }
          ]
        }],
        max_tokens: 200,
      });
      const homeDesc = vision.choices[0].message.content;

      const fullPrompt = `${prompt}\n\nThe existing home has these characteristics: ${homeDesc}. Render the new outdoor living space as if photographed in real life, showing the completed project on this specific home.`;

      const result = await openai.images.generate({
        model: "dall-e-3",
        prompt: fullPrompt,
        n: 1,
        size: "1792x1024",
        quality: "hd",
      });
      imageUrl = result.data[0].url;
    } else {
      const result = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1792x1024",
        quality: "hd",
      });
      imageUrl = result.data[0].url;
    }

    res.status(200).json({ imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
