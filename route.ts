import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a Google Blogger XML theme expert. Convert the provided theme code into a valid Blogger v2 XML template. RULES: 1. Output ONLY raw XML, no explanations, no markdown, no code fences. 2. First line must be: <?xml version="1.0" encoding="UTF-8" ?> 3. Root tag must be b:template with attributes version='2' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'. 4. Inside head, wrap ALL CSS in b:skin CDATA tags. 5. Required sections with exact IDs: header with class='header' maxwidgets='1' showaddelement='no', main with class='main' maxwidgets='10' showaddelement='yes', sidebar with class='sidebar' maxwidgets='10' showaddelement='yes', footer with class='footer' maxwidgets='4' showaddelement='yes'. 6. Each section must have at least one widget — Header1 type Header locked true, Blog1 type Blog locked true, Attribution1 type Attribution locked true. 7. Preserve all visual design colors fonts layout exactly from input. 8. Keep dark themes dark, light themes light. 9. Make fully mobile responsive. 10. Output must work when uploaded in Blogger Theme Edit HTML.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileContent, fileName } = body

    if (!fileContent || !fileName) {
      return NextResponse.json(
        { error: 'Missing fileContent or fileName' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    const prompt = `${SYSTEM_PROMPT}\n\nINPUT THEME:\n${fileContent}`

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 8192,
          },
        }),
      }
    )

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text()
      console.error('Gemini API error:', errText)
      return NextResponse.json(
        { error: `Gemini API error: ${geminiResponse.status}` },
        { status: 502 }
      )
    }

    const geminiData = await geminiResponse.json()
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!rawText) {
      return NextResponse.json(
        { error: 'No content returned from Gemini' },
        { status: 500 }
      )
    }

    // Strip markdown code fences
    const cleaned = rawText
      .replace(/^```(?:xml)?\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim()

    return NextResponse.json({ xml: cleaned })
  } catch (err) {
    console.error('Convert route error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
