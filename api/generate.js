
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { room, style, color, furniture, lighting } = req.body;

    // Get keys from Environment Variables
    const FAL_KEY = process.env.FAL_KEY;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!FAL_KEY) {
      return res.status(500).json({ error: 'FAL_KEY not found' });
    }

    // Create prompt
    const prompt = `A beautiful realistic interior design photo of a ${room} in ${style} style, 
    wall color ${color}, ${furniture} furniture, ${lighting} lighting, 
    highly detailed, professional interior photography, 8k quality`;

    // Call Fal.ai (Flux model for image generation)
    const response = await fetch('https://fal.run/fal-ai/flux/dev', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        image_size: 'landscape_4_3',
        num_inference_steps: 28,
      }),
    });

    const data = await response.json();

    if (data.images && data.images[0]) {
      return res.status(200).json({ 
        success: true, 
        imageUrl: data.images[0].url 
      });
    } else {
      return res.status(500).json({ 
        error: 'Image generation failed', 
        details: data 
      });
    }

  } catch (error) {
    return res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
}
