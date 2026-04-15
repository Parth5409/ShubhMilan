from chromadb import PersistentClient
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from core.config import settings
from typing import List, Dict

class VectorService:
    def __init__(self, chroma_client: PersistentClient):
        self.client = chroma_client
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=settings.GEMINI_API_KEY
        )
        self.collection = self.client.get_or_create_collection(name="user_profiles")

    async def upsert_profile(self, user_id: str, bio_text: str, metadata: Dict):
        # Langchain embed_query is synchronous
        embedding = self.embeddings.embed_query(bio_text)
        
        self.collection.upsert(
            ids=[user_id],
            embeddings=[embedding],
            documents=[bio_text],
            metadatas=[metadata]
        )

    async def search_profiles(self, query_text: str, n_results: int = 5, gender_filter: str = None) -> List[Dict]:
        query_embedding = self.embeddings.embed_query(query_text)
        
        where_clause = {}
        if gender_filter:
            where_clause["gender"] = gender_filter

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where=where_clause if where_clause else None
        )
        
        output = []
        if results["ids"]:
            for i in range(len(results["ids"][0])):
                output.append({
                    "user_id": results["ids"][0][i],
                    "distance": results["distances"][0][i],
                    "metadata": results["metadatas"][0][i]
                })
        return output

    async def delete_profile(self, user_id: str):
        self.collection.delete(ids=[user_id])
