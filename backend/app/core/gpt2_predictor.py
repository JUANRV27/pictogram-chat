"""
GPT-2 based predictor for pictogram recommendations.
Uses a quantized Spanish GPT-2 model for next word prediction.
"""

from transformers import GPT2TokenizerFast, GPT2LMHeadModel
import torch
from functools import lru_cache

class GPT2Predictor:
    """
    Lightweight GPT-2 predictor for Spanish text generation.
    Uses quantization to reduce memory footprint (~100MB).
    """
    
    def __init__(self):
        """Initialize GPT-2 model with 8-bit quantization for efficiency"""
        print("Loading GPT-2 model with 8-bit quantization...")
        
        # Using Spanish GPT-2 model with 8-bit quantization
        model_name = "datificate/gpt2-small-spanish"
        
        try:
            self.tokenizer = GPT2TokenizerFast.from_pretrained(model_name)
            
            # Load model with 8-bit quantization for memory efficiency
            # Reduces RAM usage from ~400 MB to ~125 MB (68% reduction)
            self.model = GPT2LMHeadModel.from_pretrained(
                model_name,
                load_in_8bit=True,  # 8-bit quantization
                device_map="auto"    # Automatic device placement
            )
            
            # Set to evaluation mode (faster inference)
            self.model.eval()
            
            print(f"✓ GPT-2 model loaded successfully ({model_name})")
            print(f"  - Quantization: 8-bit (memory optimized)")
            print(f"  - Expected RAM usage: ~125 MB")
        except Exception as e:
            print(f"✗ Error loading GPT-2 model: {e}")
            print("  Falling back to non-quantized model...")
            # Fallback to standard loading if quantization fails
            self.tokenizer = GPT2TokenizerFast.from_pretrained(model_name)
            self.model = GPT2LMHeadModel.from_pretrained(model_name)
            self.model.eval()
    
    def predict_next_words(self, context: str, num_words: int = 15):
        """
        Predict most likely next words using PyConES approach.
        
        Uses torch.topk on softmax probabilities for deterministic,
        high-quality predictions (instead of random sampling).
        
        Args:
            context: String of previous words (e.g., "yo quiero")
            num_words: Number of predictions to return
        
        Returns:
            List of predicted words (ordered by probability)
        """
        if not context or not context.strip():
            return []
        
        try:
            # 1. Tokenize context
            inputs = self.tokenizer(context, return_tensors='pt')
            
            # 2. Forward pass (without gradients)
            with torch.no_grad():
                outputs = self.model(**inputs)
            
            # 3. Get logits for the last token (next word prediction)
            logits = outputs.logits[0, -1, :]
            
            # 4. Apply softmax to get probabilities
            probs = torch.softmax(logits, dim=-1)
            
            # 5. Get top-k most probable tokens
            # Request more than needed for filtering
            top_probs, top_indices = torch.topk(probs, k=num_words * 3)
            
            # 6. Decode tokens and filter
            predictions = []
            seen = set()
            
            # Blacklist only function words (no semantic content)
            # Keep verbs and nouns even if generic
            blacklist = {
                # Articles
                'un', 'una', 'el', 'la', 'los', 'las', 'al', 'del',
                # Pronouns  
                'lo', 'me', 'mi', 'su', 'sus', 'se', 'le', 'les', 'te', 'nos', 'os',
                'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas',
                'aquel', 'aquella', 'esto', 'eso', 'aquello',
                # Prepositions
                'de', 'en', 'a', 'por', 'con', 'para', 'sin', 'sobre', 'tras',
                'desde', 'hasta', 'hacia', 'entre', 'durante', 'mediante',
                # Conjunctions
                'y', 'o', 'pero', 'porque', 'aunque', 'sino', 'pues', 'que',
                # Adverbs
                'muy', 'más', 'menos', 'tan', 'también', 'tampoco',
                'ahí', 'allí', 'aquí', 'acá',
                # Quantifiers
                'todo', 'todos', 'toda', 'todas', 'mucho', 'poco',
                # Misc common fillers
                'san', 'don', 'doña'
            }
            
            for prob, idx in zip(top_probs, top_indices):
                # Decode token
                token = self.tokenizer.decode([idx.item()]).strip().lower()
                
                # Filter criteria:
                # - Not empty
                # - Not seen before  
                # - More than 1 character
                # - Only alphabetic
                # - Not in blacklist
                if (token and 
                    token not in seen and 
                    len(token) > 1 and 
                    token.isalpha() and 
                    token not in blacklist):
                    
                    predictions.append(token)
                    seen.add(token)
                    
                    # Stop when we have enough
                    if len(predictions) >= num_words:
                        break
            
            return predictions
            
        except Exception as e:
            print(f"Error in GPT-2 prediction: {e}")
            return []

# Global instance (loaded once at startup)
_predictor = None

def get_predictor():
    """Get or create the global GPT-2 predictor instance"""
    global _predictor
    if _predictor is None:
        _predictor = GPT2Predictor()
    return _predictor

@lru_cache(maxsize=100)
def predict_next_words_cached(context: str, num_words: int = 15):
    """
    Cached version of predict_next_words for better performance.
    Same context will return cached results.
    """
    predictor = get_predictor()
    return predictor.predict_next_words(context, num_words)
