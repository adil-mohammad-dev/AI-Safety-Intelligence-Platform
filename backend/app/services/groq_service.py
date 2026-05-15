from groq import Groq

from app.core.config import settings


client = Groq(
    api_key=settings.GROQ_API_KEY
)


def generate_ai_incident_report(incident):
    prompt = f"""
You are a professional workplace safety incident analyst.

Generate a complete incident report using ONLY the details provided below.
Do not include placeholders like [Insert Date], [Insert Time], [Insert Name], or [Insert ID].
Do not use markdown symbols like **, ##, -, or bullet formatting.
Do not ask for missing information.
If exact date/time is not provided, write "Not available from system data".

Incident Details:
Incident ID: {incident.id}
Incident Type: {incident.incident_type}
Severity: {incident.severity}
Description: {incident.description}
Frame Timestamp: {incident.frame_timestamp}
Confidence Score: {incident.confidence_score}
Status: {incident.status}
Created At: {incident.created_at}

Generate the report in this exact format:

Incident Report

Incident ID:
Use the provided incident ID.

Incident Type:
Use the provided incident type.

Severity:
Use the provided severity.

Incident Summary:
Write a short professional summary of what happened.

Risk Analysis:
Explain the possible workplace safety risk in simple professional language.

Recommended Action:
Suggest practical safety actions for a safety officer or operations team.

Status Note:
Mention the current incident status based on the provided status value.

Final Note:
Write one short professional closing note.

Keep the tone professional, safety-focused, non-alarming, and suitable for workplaces, campuses, warehouses, and public infrastructure.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": "You generate clean professional workplace safety incident reports without markdown symbols or placeholders."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
        max_tokens=600
    )

    return response.choices[0].message.content