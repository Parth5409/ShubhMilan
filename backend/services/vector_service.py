from chromadb import PersistentClient
from core.config import settings
from typing import List, Dict
import hashlib
import logging

logger = logging.getLogger(__name__)

class DummyEmbeddings:
    def __init__(self, dimension: int = 16):
        self.dimension = dimension

    def embed_query(self, text: str) -> List[float]:
        return self._to_vector(text)

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return [self._to_vector(text) for text in texts]

    def _to_vector(self, text: str) -> List[float]:
        digest = hashlib.sha256(text.encode("utf-8")).digest()
        return [(digest[i % len(digest)] / 255.0) for i in range(self.dimension)]

class VectorService:
    def __init__(self, chroma_client: PersistentClient):
        self.client = chroma_client
        # Always use mock embeddings for consistent behavior
        # Only try real Ollama if explicitly enabled via USE_OLLAMA=true
        use_ollama = getattr(settings, 'USE_OLLAMA', False)
        if use_ollama:
            try:
                from langchain_ollama import OllamaEmbeddings
                self.embeddings = OllamaEmbeddings(model="all-minilm:l6-v2")
                logger.info("Using OllamaEmbeddings")
            except Exception as exc:
                logger.warning("OllamaEmbeddings initialization failed, falling back to mock embeddings: %s", exc)
                self.embeddings = DummyEmbeddings()
        else:
            logger.info("Using mock embeddings (set USE_OLLAMA=true to enable real Ollama)")
            self.embeddings = DummyEmbeddings()

        self.collection = self.client.get_or_create_collection(name="user_profiles")

    async def upsert_profile(self, user_id: str, bio_text: str, metadata: Dict):
        # Langchain embed_query is synchronous
        try:
            embedding = self.embeddings.embed_query(bio_text)
        except Exception as exc:
            logger.error("Ollama embedding failed: %s", exc)
            return
        
        self.collection.upsert(
            ids=[user_id],
            embeddings=[embedding],
            documents=[bio_text],
            metadatas=[metadata]
        )

    async def search_profiles(self, query_text: str, n_results: int = 5, gender_filter: str = None) -> List[Dict]:
        try:
            query_embedding = self.embeddings.embed_query(query_text)
        except Exception as exc:
            logger.error("Embedding query failed: %s", exc)
            return []
        
        where_clause = {}
        if gender_filter:
            where_clause["gender"] = gender_filter

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where=where_clause if where_clause else None
        )
        
        logger.debug("ChromaDB search results: %s", results)
        
        output = []
        if results and results.get("ids") and len(results["ids"]) > 0 and len(results["ids"][0]) > 0:
            for i in range(len(results["ids"][0])):
                output.append({
                    "user_id": results["ids"][0][i],
                    "distance": results["distances"][0][i],
                    "metadata": results["metadatas"][0][i]
                })
        else:
            logger.warning("No profiles found in ChromaDB. Make sure users have updated their profiles with bios.")
        
        return output

    async def delete_profile(self, user_id: str):
        self.collection.delete(ids=[user_id])
