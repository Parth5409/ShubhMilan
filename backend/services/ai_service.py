from langchain_google_genai import ChatGoogleGenerativeAI
from core.config import settings
from typing import List, Dict

class AIService:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=settings.GEMINI_API_KEY
        )

    async def enhance_bio(self, raw_text: str) -> str:
        prompt = f"""You are a professional matrimonial bio writer. 
        Rewrite the following rough notes into an engaging, warm, and authentic 3-sentence bio.

        <user_notes>
        {raw_text}
        </user_notes>

        Respond with only the bio text."""
        
        response = await self.llm.ainvoke(prompt)
        return response.content.strip()

    async def generate_astrology(self, dob: str, time: str, place: str) -> Dict[str, str]:
        prompt = f"""Act as an expert Vedic astrologer. 
        Given the following birth details:
        Date: {dob}
        Time: {time}
        Place: {place}

        Determine the Sun sign and Moon sign. 
        Provide a 3-sentence personality reading suitable for a marriage profile.

        Respond in the following format:
        Sun Sign: [Sign]
        Moon Sign: [Sign]
        Reading: [3-sentence reading]"""

        response = await self.llm.ainvoke(prompt)
        text = response.content.strip()
        
        # Simple parser
        lines = text.split("\n")
        data = {"sun_sign": "", "moon_sign": "", "generated_reading": ""}
        for line in lines:
            if "Sun Sign:" in line:
                data["sun_sign"] = line.split("Sun Sign:")[1].strip()
            elif "Moon Sign:" in line:
                data["moon_sign"] = line.split("Moon Sign:")[1].strip()
            elif "Reading:" in line:
                data["generated_reading"] = line.split("Reading:")[1].strip()
        
        return data

    async def generate_icebreakers(self, user_bio: str, target_bio: str) -> List[str]:
        prompt = f"""You are a social expert. 
        Compare these two matrimonial bios and identify shared interests or interesting conversation points.
        Suggest 3 unique, engaging conversation starters.

        <my_bio>
        {user_bio}
        </my_bio>

        <match_bio>
        {target_bio}
        </match_bio>

        Respond with only the 3 suggestions, one per line, no numbering."""

        response = await self.llm.ainvoke(prompt)
        lines = response.content.strip().split("\n")
        return [line.strip() for line in lines if line.strip()][:3]
