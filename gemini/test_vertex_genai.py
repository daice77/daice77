import os
from google import genai

PROJECT_ID = "tiny-ai-1757386205295"
LOCATION = "us-central1"  # try us-central1 first

def main():
    if not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
        raise SystemExit("Set GOOGLE_APPLICATION_CREDENTIALS to your service-account JSON path.")

    # Vertex AI mode (OAuth via service account)
    client = genai.Client(
        vertexai=True,
        project=PROJECT_ID,
        location=LOCATION,
    )

    # Use a current model (examples from Vertex model catalog)
    model = "gemini-2.5-flash"  # or "gemini-2.5-pro"

    resp = client.models.generate_content(
        model=model,
        contents="Say hello from Vertex AI and include today's date."
    )

    print(resp.text)

if __name__ == "__main__":
    main()

