export async function generateAIResponse(
  prompt: string
) {

  try {

    const response =
      await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${process.env.OPENROUTER_API_KEY}`,

          },

          body: JSON.stringify({

            model:
              "openchat/openchat-7b:free",

            messages: [

              {
                role: "user",
                content: prompt,
              },

            ],

          }),

        }
      );

    const data =
      await response.json();

    console.log(data);

    if (
      data?.choices?.[0]
        ?.message?.content
    ) {

      return data.choices[0]
        .message.content;

    }

    return JSON.stringify(data);

  } catch (err) {

    console.log(err);

    return "Error conectando IA.";

  }

}